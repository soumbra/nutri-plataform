# NutriFy

Uma plataforma que conecta clientes e nutricionistas para acompanhamento nutricional personalizado.

## 🚀 Tecnologias

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Express.js, TypeScript
- **Database:** PostgreSQL, Prisma ORM
- **Autenticação:** NextAuth.js
- **Deploy:** Vercel (Frontend), Railway (Backend)

## 📋 Features Planejadas

### Para Clientes
- [x] Cadastro e perfil
- [ ] Busca de nutricionistas
- [ ] Contratação de planos
- [ ] Visualização de planos alimentares
- [ ] Chat com nutricionista
- [ ] Acompanhamento de progresso

### Para Nutricionistas
- [x] Perfil profissional
- [ ] Gerenciamento de clientes
- [ ] Criação de planos alimentares
- [ ] Sistema de acompanhamento
- [ ] Comunicação com clientes

## 🛠️ Como rodar
```bash
# Clone o repositório
git clone [URL_DO_REPO]

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Rode as migrações
npx prisma migrate dev

# Inicie o projeto
npm run dev