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


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

// Rotas
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Nutri Platform API is running!' })
})

app.use('/api/auth', authRoutes)
app.use('/api/nutritionists', nutritionistRoutes)
app.use('/api/contracts', contractRoutes)
app.use('/api/meal-plans', mealPlanRoutes)
app.use('/api/foods', foodRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})