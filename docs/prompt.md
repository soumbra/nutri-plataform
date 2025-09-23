# Contexto do Projeto: Nutri Platform - Teste Técnico

## Projeto Overview
Estou desenvolvendo uma plataforma nutricional chamada "Nutri Platform" - um teste técnico de 7 dias que conecta clientes e nutricionistas. É uma aplicação web full-stack moderna.

## Stack Tecnológica Obrigatória
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS + ShadCN/UI
- **Backend:** Express.js + TypeScript 
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT + Context API
- **Deploy:** Docker (dev) + Vercel/Railway (prod)

## Estrutura do Projeto

nutri-platform/
├── client/                 # Next.js frontend
│   ├── src/app/
│   │   ├── (auth)/         # Login/Register pages
│   │   ├── dashboard/      # User dashboards
│   │   └── components/     # Reusable components
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   └── types/          # TypeScript types
│   ├── prisma/            # Database schema & migrations
│   └── .env               # Environment variables
└── docker-compose.yml     # PostgreSQL container

## Funcionalidades Principais

### Para Clientes:
- Registro/login na plataforma
- Busca e contratação de nutricionistas
- Visualização de planos alimentares personalizados
- Chat com nutricionista
- Acompanhamento de progresso (peso, medidas, fotos)

### Para Nutricionistas:
- Perfil profissional com CRN
- Gerenciamento de clientes
- Criação de planos alimentares detalhados
- Sistema de acompanhamento
- Comunicação com clientes

## Status Atual do Desenvolvimento

### ✅ Concluído (Dia 1):
- Setup completo do ambiente (Git, Docker, PostgreSQL)
- Schema Prisma com relacionamentos complexos (Users, Profiles, Contracts, MealPlans, etc.)
- APIs de autenticação funcionais (POST /auth/login, /auth/register, GET /auth/me)
- Context API para gerenciamento de estado de auth
- Páginas de login/registro com React Hook Form + Zod validation
- Dashboard básico com proteção de rotas
- Seed data para testes

### Backend APIs Implementadas:
- JWT authentication system
- Middleware de validação com Zod
- Estrutura organizada (controllers/services/middleware)
- Prisma Client configurado corretamente

### Frontend Implementado:
- Landing page responsiva
- Páginas de autenticação com UX polida
- Context para estado global
- Integração completa frontend-backend
- Dashboards diferenciados por role

## Roadmap dos Próximos 6 Dias

### Dia 2: Dashboard e APIs Nutricionistas
- Dashboard mais detalhado para ambos os roles
- APIs: GET /nutritionists, GET /nutritionists/:id
- Página de listagem de nutricionistas
- Sistema de busca e filtros

### Dia 3: Sistema de Contratação
- APIs: POST /contracts, GET /contracts
- Processo de contratação cliente-nutricionista
- Páginas de perfil detalhado

### Dia 4: Planos Alimentares
- APIs para meal plans e foods
- Interface para criar/visualizar planos
- Sistema de refeições detalhado

### Dia 5: Chat e Progresso
- Sistema de mensagens básico
- Upload de fotos de progresso
- Acompanhamento de evolução

### Dia 6-7: Refinamentos e Deploy
- Testes, correções, melhorias de UX
- Deploy em produção
- Documentação final

## Convenções de Código Atuais
- **Git:** Conventional Commits (feat:, fix:, docs:)
- **Branches:** feature/nome-da-funcionalidade
- **TypeScript:** Strict mode habilitado
- **Validation:** Zod schemas para todas as entradas
- **Error Handling:** Try-catch com mensagens específicas
- **Auth Flow:** JWT tokens + localStorage
- **Database:** Prisma com PostgreSQL

## Dados de Teste Disponíveis
- Nutricionista: dra.silva@email.com / 123456
- Cliente: joao@email.com / 123456
- Alimentos básicos cadastrados no seed

## Próxima Tarefa Imediata
Vou implementar a listagem de nutricionistas no frontend e as APIs correspondentes no backend. Preciso criar uma experiência completa de busca e visualização de perfis profissionais.

## Context para GitHub Copilot
Me ajude a gerar código que segue os padrões estabelecidos, mantém a consistência com a arquitetura atual, e implementa as funcionalidades do roadmap. Foque em código limpo, typesafe, e bem estruturado seguindo as convenções já definidas no projeto.