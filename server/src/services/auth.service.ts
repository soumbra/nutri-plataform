import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwt'
import { LoginRequest, RegisterRequest } from '../types'

const prisma = new PrismaClient()

export class AuthService {
  static async login({ email, password }: LoginRequest) {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        clientProfile: true,
        nutritionistProfile: true
      }
    })

    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas')
    }

    // Gerar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'CLIENT' | 'NUTRITIONIST' | 'ADMIN'
    })

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user

    return {
      token,
      user: userWithoutPassword
    }
  }

  static async register(data: RegisterRequest) {
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new Error('Usuário já existe com este email')
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role,
        phone: data.phone
      }
    })

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'CLIENT' | 'NUTRITIONIST' | 'ADMIN'
    })

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user

    return {
      token,
      user: userWithoutPassword
    }
  }

  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        clientProfile: true,
        nutritionistProfile: true
      }
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  }
}