import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

// Rotas
import authRoutes from './routes/auth'
import nutritionistRoutes from './routes/nutritionist'
import contractRoutes from './routes/contracts'
import mealPlanRoutes from './routes/meal-plans'
import foodRoutes from './routes/foods'
import progressRoutes from './routes/progress'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV || 'development'

// CORS configuration for production
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? [
        'https://your-app-name.vercel.app', // Substituir pela URL real do Vercel
        'https://*.vercel.app'
      ] 
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}

// Middlewares
app.use(helmet())
app.use(cors(corsOptions))
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rotas
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Nutri Platform API is running!' })
})

app.use('/api/auth', authRoutes)
app.use('/api/nutritionists', nutritionistRoutes)
app.use('/api/contracts', contractRoutes)
app.use('/api/meal-plans', mealPlanRoutes)
app.use('/api/foods', foodRoutes)
app.use('/api/progress', progressRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})