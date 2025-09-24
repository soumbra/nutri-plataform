import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

// Rotas
import authRoutes from './routes/auth'
import nutritionistRoutes from './routes/nutritionist'


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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})