# 📚 API Reference - NutriFy

**Base URL:** `https://nutri-plataform-api.onrender.com/api`

## 🔐 Autenticação

**Header obrigatório para rotas protegidas:**
```
Authorization: Bearer <token>
```

**Login:**
```http
POST /auth/login
{
  "email": "dra.silva@email.com",
  "password": "123456"
}
```

## 📋 Endpoints Principais

### Auth
- `POST /auth/login` - Login
- `POST /auth/register` - Cadastro  
- `GET /auth/me` - Dados do usuário

### Nutricionistas
- `GET /nutritionists` - Listar nutricionistas
- `GET /nutritionists/:id` - Buscar por ID
- `GET /nutritionists/profile/me` - Meu perfil (autenticado)
- `PUT /nutritionists/profile/me` - Atualizar perfil

### Contratos
- `GET /contracts` - Meus contratos
- `POST /contracts` - Criar contrato
- `PATCH /contracts/:id/status` - Atualizar status

### Planos Alimentares
- `GET /meal-plans` - Listar planos
- `POST /meal-plans` - Criar plano
- `POST /meal-plans/meals` - Adicionar refeição

### Alimentos
- `GET /foods` - Catálogo de alimentos
- `GET /foods/categories` - Categorias
- `POST /foods` - Criar alimento (nutricionistas)

### Progresso
- `GET /progress` - Meus registros
- `POST /progress` - Novo registro
- `GET /progress/stats` - Estatísticas

## 💡 Exemplos Práticos

**Buscar nutricionistas por especialidade:**
```http
GET /nutritionists?specialty=esportiva&page=1&limit=10
```

**Criar contrato:**
```http
POST /contracts
Authorization: Bearer <token>
{
  "nutritionistId": "cm1234...",
  "monthlyPrice": 300
}
```

**Adicionar progresso:**
```http
POST /progress
Authorization: Bearer <token>
{
  "weight": 75.5,
  "bodyFat": 15.2,
  "notes": "Semana foi ótima!"
}
```

## 🔍 Códigos HTTP
- `200` Sucesso
- `201` Criado  
- `400` Dados inválidos
- `401` Não autorizado
- `404` Não encontrado

**Implementação:** Ver arquivos em [`/server/src/routes/`](../server/src/routes/) e [`/server/src/controllers/`](../server/src/controllers/)