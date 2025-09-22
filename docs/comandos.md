# Iniciar banco
npm run db:up

# Parar banco
npm run db:down

# Ver logs do banco
docker-compose logs postgres

# Resetar banco (cuidado!)
npm run db:reset

# Prisma
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js  # opcional

# Backend
npm run dev  # Express

# Frontend
npm run dev  # Next.js
