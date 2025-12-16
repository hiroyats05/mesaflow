import { FastifyInstance } from 'fastify';
import crypto from 'crypto';

export class JwtTokenService {
  private fastify: FastifyInstance;
  
  // Cache em memória para refresh tokens
  // Estrutura: Map<hashedToken, { userId: number, expiresAt: Date }>
  private refreshTokenCache: Map<string, { userId: number; expiresAt: Date }>;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.refreshTokenCache = new Map();
    
    // Limpar tokens expirados a cada 1 hora
    setInterval(() => this.cleanupExpiredTokens(), 60 * 60 * 1000);
  }

  // Gera um access token

  generateAccessToken(payload: { id: number; email: string; role: string }) {
    return this.fastify.jwt.sign(payload, { expiresIn: '50m' });
  }

  //Gera um refresh token 
  generateRefreshToken(payload: { id: number; email: string; role: string }) {
    return this.fastify.jwt.sign(payload, { expiresIn: '1h' });
  }

  //Gera ambos os tokens (access + refresh)
  generateTokenPair(user: { id: number; email: string; role: string }) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Armazena refresh token no cache
    this.storeRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: 3000, // 50 minutos em segundos
    };
  }

  // Valida e decodifica um token
  async verifyToken(token: string) {
    try {
      return await this.fastify.jwt.verify(token);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  // Armazena refresh token no cache (em memória ou Redis)
  private storeRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    this.refreshTokenCache.set(hashedToken, { userId, expiresAt });
  }

  // Valida se refresh token existe e é válido
  async validateRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const cached = this.refreshTokenCache.get(hashedToken);

    if (!cached) {
      return false;
    }

    // Verifica se o token pertence ao usuário e não expirou
    if (cached.userId !== userId || cached.expiresAt < new Date()) {
      this.refreshTokenCache.delete(hashedToken);
      return false;
    }

    return true;
  }

  // Revoga um refresh token específico
  async revokeRefreshToken(refreshToken: string) {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    this.refreshTokenCache.delete(hashedToken);
  }

  // Revoga todos os refresh tokens de um usuário (logout em todos os dispositivos)
  async revokeAllUserTokens(userId: number) {
    for (const [token, data] of this.refreshTokenCache.entries()) {
      if (data.userId === userId) {
        this.refreshTokenCache.delete(token);
      }
    }
  }

  // Remove tokens expirados do cache (limpeza periódica)
  private cleanupExpiredTokens() {
    const now = new Date();
    for (const [token, data] of this.refreshTokenCache.entries()) {
      if (data.expiresAt < now) {
        this.refreshTokenCache.delete(token);
      }
    }
  }

  // Retorna estatísticas do cache (útil para monitoramento)
  getCacheStats() {
    return {
      totalTokens: this.refreshTokenCache.size,
      users: new Set([...this.refreshTokenCache.values()].map(v => v.userId)).size,
    };
  }
}
