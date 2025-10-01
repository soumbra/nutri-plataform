# 🚀 Deploy Guide - NutriFy

## 🏗️ Produção (Atual)

**Stack:** Vercel (Frontend) + Render (Backend + DB)

### Render (Backend)
1. Conectar repo no [Render Dashboard](https://dashboard.render.com)
2. Configurar:
   ```
   Root Directory: server
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   ```
3. Environment Variables:
   ```env
   NODE_ENV=production
   DATABASE_URL=<render-postgres-url>
   JWT_SECRET=<secret-key>
   ```

### Vercel (Frontend)  
1. Conectar repo no [Vercel Dashboard](https://vercel.com)
2. Configurar:
   ```
   Root Directory: client
   Framework: Next.js
   ```
3. Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://nutri-plataform-api.onrender.com/api
   ```

## 🐳 Desenvolvimento (Docker)

```bash
# Iniciar ambiente completo
docker-compose up -d

# Rodar migrações
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma db seed

# Ver logs
docker-compose logs -f
```

**Ver configuração:** [`docker-compose.yml`](../docker-compose.yml)

## 🔍 Health Checks

- Frontend: https://nutri-plataformx.vercel.app
- Backend: https://nutri-plataform-api.onrender.com/api/health

## 🚨 Problemas Comuns

**Build Error:** Adicionar `npx prisma generate` no build command  
**CORS Error:** Verificar `NEXT_PUBLIC_API_URL` no Vercel  
**DB Error:** Confirmar `DATABASE_URL` no Render