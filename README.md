# MesaFlow - Sistema de Gestão para Restaurantes

**MesaFlow** iniciou como um **sistema sob demanda para clientes reais** e evoluiu para um **projeto SaaS em desenvolvimento**. Começou resolvendo problemas operacionais de restaurantes específicos e agora está sendo arquitetado para servir múltiplos clientes com a mesma plataforma escalável.

Atualmente, o foco está em consolidar uma **API backend robusta, escalável e multi-tenant**, com arquitetura preparada para integração com aplicações frontend (mobile e desktop) em fases posteriores.

Este documento descreve a arquitetura, decisões técnicas e design patterns do backend.

## 🚀 Tecnologias

- **Runtime**: Node.js 22.20.0
- **Framework**: Fastify 5.6.2 (event-loop concurrency, plugin architecture)
- **Linguagem**: TypeScript 5.6.3
- **ORM**: Prisma 5.15.0
- **Database**: SQLite (MVP) com migração Postgres pronta
- **Autenticação**: JWT (@fastify/jwt v10)
- **Hash**: bcryptjs (10 rounds)
- **Logging**: Pino com pino-pretty (dev) e persistência em arquivo (produção/opcional)

---



## 🏗️ Arquitetura

### Diagrama de Fluxo

![Arquitetura MesaFlow](./docs/assets/arquitetura-mesaflow.png)

O diagrama acima ilustra o fluxo completo da aplicação, desde o usuário no frontend até a persistência no banco de dados.

### Camadas

```
Routes (HTTP endpoints)
    ↓
Service (lógica de negócio)
    ↓
Repository (abstração de dados)
    ↓
Prisma (ORM)
    ↓
SQLite Database
```

### Princípios Aplicados

- **ACID**: Consistência de dados via transações e constraints do Prisma
- **SOLID**: 
  - **S**ingle Responsibility: Cada camada tem responsabilidade única
  - **O**pen/Closed: Fácil estender com novos módulos
  - **L**iskov Substitution: Services implementam interfaces Repository
  - **I**nterface Segregation: Interfaces mínimas e específicas
  - **D**ependency Inversion: Serviços dependem de abstrações (interfaces), não de Prisma direto
- **REST API**: Recursos em plural (`/users`, `/estoques`), verbos HTTP corretos (GET, POST, PUT, DELETE)

---

## 🔐 Autenticação & Autorização

### JWT Strategy
- **Access Token**: 50 minutos (curta duração, melhor segurança)
- **Refresh Token**: 1 hora (permite renovação de sesão)
- **Cache**: Map em memória (adequado para MVP sem load balancer; fácil migração para Redis)
- **Cleanup**: Tokens expirados removidos automaticamente a cada 1 hora

### Fluxo de Autenticação
1. **Login**: `POST /auth/login` → Retorna `{ accessToken, refreshToken, expiresIn }`
2. **Requisição Autenticada**: Incluir `Authorization: Bearer <accessToken>` no header
3. **Refresh Token**: `POST /auth/refresh` → Novo `accessToken` (antes de expirar)
4. **Logout**: `POST /auth/logout` → Revoga token(s)

### Autorização (Role-Based Access Control)

- **Admin**: Acesso completo a listar todos os usuários
- **User**: Acesso apenas ao próprio perfil e recursos scoped por userId

Verificações ocorrem **na rota** (não no serviço):
```typescript
// Exemplo: rotas protegidas
GET /users/:id              // Requer autenticação; self-only ou admin
GET /users                  // Admin-only
POST /estoques              // Requer autenticação; scoped by userId
```

---

## 📚 API Endpoints

### Autenticação
| Método | Endpoint | Descrição | Autenticado |
|--------|----------|-----------|-------------|
| POST | `/auth/login` | Login com email/password | ❌ |
| POST | `/auth/refresh` | Renovar access token | ❌ |
| POST | `/auth/logout` | Logout | ✅ |
| GET | `/auth/me` | Perfil do usuário autenticado | ✅ |

### Usuários
| Método | Endpoint | Descrição | Autenticado | Role |
|--------|----------|-----------|-------------|------|
| POST | `/users` | Criar usuário (signup) | ❌ | - |
| GET | `/users` | Listar todos (admin-only) | ✅ | Admin |
| GET | `/users/:id` | Ver perfil (self or admin) | ✅ | User/Admin |
| PUT | `/users/:id` | Atualizar perfil (self or admin) | ✅ | User/Admin |
| DELETE | `/users/:id` | Deletar usuário (self or admin) | ✅ | User/Admin |

### Estoque
| Método | Endpoint | Descrição | Autenticado |
|--------|----------|-----------|-------------|
| GET | `/estoques` | Listar itens do usuário | ✅ |
| GET | `/estoques/:id` | Detalhes de um item | ✅ |
| POST | `/estoques` | Criar novo item | ✅ |
| PUT | `/estoques/:id` | Atualizar item | ✅ |
| DELETE | `/estoques/:id` | Deletar item | ✅ |

---

## 📊 Logging Estruturado

### Implementação com Pino

**Desenvolvimento** (pino-pretty):
```bash
$ npm run dev
[INFO] 14:30:45 GET /auth/login 127.0.0.1 (duration: 25ms)
[INFO] 14:30:46 POST /users status: 201 (duration: 45ms, userId: 1)
```

**Produção** (JSON):
```json
{"level":"info","time":"2025-12-16T14:30:45.000Z","method":"GET","url":"/estoques","statusCode":200,"durationMs":12,"userId":5}
```

### Características
- **Request/Response Hooks**: Captura method, URL, IP, status code, duração, userId
- **Colorizado em Dev**: pino-pretty para fácil leitura
- **JSON em Produção**: Estruturado para parsing e análise
- **Persistência Opcional**: Configurar `LOG_FILE` para salvar em arquivo
- **Auto-cleanup**: Tokens expirados e logs antigos gerenciados automaticamente

---

## 🗄️ Banco de Dados

### Schema Prisma
- **users**: Usuários do sistema
- **estoqueItems**: Itens de estoque scoped por userId
- **atendimentos**: Registros de atendimento (em desenvolvimento)
- **caixa**: Registros de caixa (em desenvolvimento)

### SQLite → Postgres
Ao migrar para Postgres:
1. Atualizar `DATABASE_URL` no `.env`
2. Rodar `npm run prisma:migrate` (futura documentação)
3. Nenhuma mudança de código necessária

---

## 🧪 Testes

Arquivos de teste HTTP (executáveis com REST Client do VS Code):

- **`src/test/apitestAuth.http`**: Fluxo de autenticação (login, refresh, logout)
- **`src/test/apitestEstoque.http`**: CRUD de estoque com exemplos de requests
- **`src/test/apitestCompleto.http`**: Fluxo completo (signup → login → create estoque → update)

---

## 🏛️ Estrutura de Pastas

```
mesaflow/
├── src/                      # Backend - API REST
│   ├── server.ts             # Configuração Fastify, Pino, JWT, rotas
│   ├── auth/                 # Módulo de autenticação
│   │   ├── auth.routes.ts
│   │   ├── auth.service.ts
│   │   └── jwt-token.service.ts
│   ├── module/               # Módulos de negócio
│   │   ├── user/             # Gestão de usuários
│   │   │   ├── user.routes.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.repository.ts
│   │   ├── estoque/          # Gestão de estoque
│   │   │   ├── estoque.routes.ts
│   │   │   ├── estoque.service.ts
│   │   │   └── estoque.repository.ts
│   │   ├── atendimento/      # Módulo de atendimentos (próxima fase)
│   │   └── financeiro/       # Módulo financeiro (próxima fase)
│   ├── prisma/
│   │   ├── schema.prisma     # Schema do banco de dados
│   │   └── dev.db            # SQLite (gerado)
│   └── test/                 # Testes HTTP manuais
│       ├── apitestAuth.http
│       ├── apitestEstoque.http
│       └── apitestCompleto.http
│
├── app/
│   ├── desktop/              # Aplicação Desktop (em planejamento)
│   └── mobile/               # Aplicação Mobile (em planejamento)
│
├── package.json              # Dependências do backend
├── tsconfig.json
├── .env
├── .gitignore
└── README.md
```

### Organização Atual (Backend)

O foco atual é consolidar a **camada de backend** com uma arquitetura sólida:

- **Camada de Rotas** (`auth/`, `module/*/routes.ts`): HTTP endpoints com validação
- **Camada de Serviços** (`module/*/service.ts`): Lógica de negócio com DIP
- **Camada de Repositórios** (`module/*/repository.ts`): Abstrações de acesso a dados
- **ORM + Banco**: Prisma 5 com SQLite (MVP)
- **Autenticação**: JWT com tokens stateless

### Roadmap - Próximas Fases

**Fase 2**: Consolidar Backend Core
- Módulo Atendimento (pedidos, workflows, real-time)
- Módulo Financeiro (transações, relatórios, caixa)
- WebSockets para sincronização real-time

**Fase 3+**: Frontend Mobile e Desktop (Em Aberto)
- Arquitetura e stack será definido conforme progresso do backend
- Requisitos de UX/UI ainda sendo refinados
- Prototipagem e feedback do mercado em andamento

---

## 📋 Roadmap Técnico

### Fase Atual (Backend - Core)
- [x] Autenticação JWT (access 50m, refresh 1h)
- [x] CRUD User com role-based access control
- [x] CRUD Estoque com userId scoping
- [x] Repository Pattern (DIP)
- [x] Structured Logging (Pino)
- [ ] Validação de entrada com Zod
- [ ] Rate limiting em `/auth/login`
- [ ] Testes unitários/integração com Jest

### Infraestrutura & Deployment
- [ ] Docker setup (backend + SQLite)
- [ ] Migração para Postgres (production)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring e alertas
- [ ] Backup automatizado

### Frontend (Stack & Arquitetura - Decisões em Aberto)
As escolhas de tecnologia e arquitetura do frontend serão baseadas em:
- 📊 **Feedback real** de usuários em produção
- 🎯 **Requisitos operacionais** observados no dia-a-dia
- 📈 **Métricas de uso** e pontos de dor identificados
- 🔄 **Validação com clientes** sobre UX/UI e experiência
- 🛠️ **Trade-off** complexidade vs. valor agregado


### Integrações (Futuro)
- [ ] Payment gateway
- [ ] Delivery (Ifood)
- [ ] SMS/Email notifications
- [ ] Analytics e BI

---

## 🔄 Arquitetura de Camadas (Backend)

```
HTTP Requests (Desktop, Mobile, CLI)
         ↓
    Routes Layer
  (auth, users, estoque)
         ↓
   Services Layer
  (Business Logic, DIP)
         ↓
 Repositories Layer
  (Data Abstraction)
         ↓
   Prisma ORM
         ↓
    SQLite DB
```

**Fluxo típico de uma requisição:**
1. Cliente envia `POST /estoques` com Bearer token
2. **Authenticate Decorator** valida JWT
3. **Route Handler** extrai userId e autorização
4. **Service** executa lógica de negócio (via repository)
5. **Repository** abstrai Prisma (fácil de testar/mockar)
6. **Prisma** persiste em SQLite
7. **Response** retorna com status e dados

---

## 💡 Decisões de Arquitetura

### Por que Fastify?
- Event-loop concurrency (crítico para mobile-first com múltiplas requisições simultâneas)
- Plugin architecture
- Performance
- Baixo overhead (reduz latência em conexões móveis)

### Por que Prisma 5 (não 7)?
- Documentação mais madura e estável
- Suporte excelente a SQLite e Postgres
- Migrações automáticas facilitadas

### Por que SQLite (MVP)?
- Sem servidor externo necessário
- Rápido para prototipagem
- Fácil de migrar para Postgres (1:1)
- Persistência em arquivo

### Por que JWT com Map (não Redis)?
- Sem overhead de serviço externo (MVP)
- Tokens stateless (escalável)
- Auto-cleanup de tokens expirados
- Pronto para Redis quando necessário escalar

---


## 📝 Licença

Propriedade de MesaFlow © 2025
