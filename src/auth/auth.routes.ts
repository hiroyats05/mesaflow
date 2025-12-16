import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { JwtTokenService } from './jwt-token.service';

const authService = new AuthService();

export async function authRoutes(fastify: FastifyInstance) {
  const tokenService = new JwtTokenService(fastify);

  // Login - Retorna access token + refresh token
  fastify.post('/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };

    if (!email || !password) {
      return reply.code(400).send({ error: 'Email e senha são obrigatórios' });
    }

    try {
      const user = await authService.login(email, password);
      
      const tokens = tokenService.generateTokenPair({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.code(200).send({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error: any) {
      return reply.code(401).send({ error: error.message || 'Credenciais inválidas' });
    }
  });

  // Refresh - Renova o access token usando o refresh token
  fastify.post('/auth/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshToken } = request.body as { refreshToken: string };

    if (!refreshToken) {
      return reply.code(400).send({ error: 'Refresh token é obrigatório' });
    }

    try {
      // Verifica se o refresh token é válido
      const decoded = await tokenService.verifyToken(refreshToken) as any;
      
      // Valida se o token está no cache
      const isValid = await tokenService.validateRefreshToken(decoded.id, refreshToken);
      
      if (!isValid) {
        return reply.code(401).send({ error: 'Refresh token inválido ou expirado' });
      }

      // Gera novo access token
      const accessToken = tokenService.generateAccessToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      });

      return reply.code(200).send({
        accessToken,
        expiresIn: 3000, // 50 minutos
      });
    } catch (error: any) {
      return reply.code(401).send({ error: 'Refresh token inválido' });
    }
  });

  // Logout - Revoga o refresh token
  fastify.post(
    '/auth/logout',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { refreshToken } = request.body as { refreshToken?: string };
      const userId = (request.user as any).id;

      if (refreshToken) {
        // Revoga apenas o token específico
        await tokenService.revokeRefreshToken(refreshToken);
      } else {
        // Revoga todos os tokens do usuário (logout de todos os dispositivos)
        await tokenService.revokeAllUserTokens(userId);
      }

      return reply.code(200).send({ message: 'Logout realizado com sucesso' });
    }
  );

  // Verificar token (rota protegida de exemplo)
  fastify.get(
    '/auth/me',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request.user as any).id;
      
      const user = await fastify.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

      if (!user) {
        return reply.code(404).send({ error: 'Usuário não encontrado' });
      }

      return user;
    }
  );
}
