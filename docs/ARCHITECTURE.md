# 🏗️ Decisões de Arquitetura - NutriFy

## 🎯 Escolhas Técnicas

### **Frontend: Next.js 15**
- **App Router** para roteamento moderno
- **Server Components** para performance  
- **ShadCN/UI** para componentes consistentes

### **Backend: Express.js + TypeScript**
- **Controller-Service pattern** para organização
- **Prisma ORM** para type-safety e migrações
- **JWT** para autenticação stateless

### **Database: PostgreSQL**
- **Relacionamentos complexos** entre usuários, contratos e planos
- **ACID compliance** para integridade dos dados

## 🔐 Segurança

**Autenticação:** JWT com roles (CLIENT/NUTRITIONIST)
**Autorização:** Middleware por rota
**Validação:** Zod schemas em todas as entradas

## � Estrutura de Pastas

```
client/src/
├── app/           # Pages (App Router)
├── components/    # Componentes reutilizáveis
├── services/      # API calls
└── contexts/      # Estado global

server/src/
├── controllers/   # HTTP handlers
├── services/      # Lógica de negócio  
├── routes/        # Definição de rotas
└── middleware/    # Auth, validação
```

## 🔄 Padrões Importantes

**Service Layer:** Abstração da lógica de negócio  
**Repository Pattern:** Prisma como abstração do banco  
**Middleware Chain:** Auth → Validation → Controller

## 📊 Deploy

- **Frontend:** Vercel (deploy automático)
- **Backend:** Render (com PostgreSQL)
- **Environment:** Docker Compose para desenvolvimento

**Ver implementação:** [`/server/src/`](../server/src/) e [`/client/src/`](../client/src/)