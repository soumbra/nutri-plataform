import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Limpar dados existentes
  await prisma.message.deleteMany()
  await prisma.progressRecord.deleteMany()
  await prisma.mealFood.deleteMany()
  await prisma.meal.deleteMany()
  await prisma.mealPlan.deleteMany()
  await prisma.contract.deleteMany()
  await prisma.food.deleteMany()
  await prisma.clientProfile.deleteMany()
  await prisma.nutritionistProfile.deleteMany()
  await prisma.user.deleteMany()

  // Hash das senhas
  const hashedPassword = await bcrypt.hash('123456', 10)

  // Criar nutricionista
  await prisma.user.create({
    data: {
      email: 'dra.silva@email.com',
      name: 'Dra. Ana Silva',
      password: hashedPassword,
      role: 'NUTRITIONIST',
      phone: '(11) 99999-1111',
      nutritionistProfile: {
        create: {
          crn: 'CRN3-12345',
          specialty: 'Nutrição Esportiva',
          experience: 8,
          bio: 'Especialista em nutrição esportiva com foco em performance e qualidade de vida.',
          pricePerHour: 120.0,
          isActive: true
        }
      }
    }
  })

  await prisma.user.create({
    data: {
      email: 'dr.carlos@email.com',
      name: 'Dr. Carlos Mendes',
      password: hashedPassword,
      role: 'NUTRITIONIST',
      phone: '(11) 99999-3333',
      nutritionistProfile: {
        create: {
          crn: 'CRN3-54321',
          specialty: 'Nutrição Clínica',
          experience: 12,
          bio: 'Especialista em nutrição clínica com foco em diabetes e hipertensão. Atendimento humanizado e baseado em evidências.',
          pricePerHour: 150.0,
          isActive: true
        }
      }
    }
  })

  await prisma.user.create({
    data: {
      email: 'dra.lucia@email.com',
      name: 'Dra. Lúcia Santos',
      password: hashedPassword,
      role: 'NUTRITIONIST',
      phone: '(11) 99999-4444',
      nutritionistProfile: {
        create: {
          crn: 'CRN3-67890',
          specialty: 'Nutrição Materno-Infantil',
          experience: 6,
          bio: 'Nutricionista especializada em gestantes, lactantes e nutrição infantil. Acompanhamento completo da família.',
          pricePerHour: 100.0,
          isActive: true
        }
      }
    }
  })

  await prisma.user.create({
    data: {
      email: 'dr.pedro@email.com',
      name: 'Dr. Pedro Lima',
      password: hashedPassword,
      role: 'NUTRITIONIST',
      phone: '(11) 99999-5555',
      nutritionistProfile: {
        create: {
          crn: 'CRN3-11111',
          specialty: 'Nutrição Funcional',
          experience: 4,
          bio: 'Abordagem integrativa com foco em nutrição funcional e fitoterapia. Tratamento personalizado.',
          pricePerHour: 180.0,
          isActive: true
        }
      }
    }
  })

  // Criar cliente
  await prisma.user.create({
    data: {
      email: 'joao@email.com',
      name: 'João Santos',
      password: hashedPassword,
      role: 'CLIENT',
      phone: '(11) 99999-2222',
      clientProfile: {
        create: {
          age: 28,
          height: 175.0,
          weight: 80.0,
          gender: 'MALE',
          activityLevel: 'MODERATE',
          goal: 'Perder peso e ganhar massa muscular',
          restrictions: 'Intolerância à lactose'
        }
      }
    }
  })

  await prisma.user.create({
    data: {
      email: 'maria@email.com',
      name: 'Maria Silva',
      password: hashedPassword,
      role: 'CLIENT',
      phone: '(11) 99999-6666',
      clientProfile: {
        create: {
          age: 35,
          height: 165.0,
          weight: 70.0,
          gender: 'FEMALE',
          activityLevel: 'LIGHT',
          goal: 'Melhorar alimentação após gravidez',
          restrictions: 'Vegetariana'
        }
      }
    }
  })

  // Criar alguns alimentos básicos
  await prisma.food.createMany({
    data: [
      {
        name: 'Peito de Frango Grelhado',
        category: 'Proteína',
        calories: 165,
        proteins: 31,
        carbs: 0,
        fats: 3.6,
        fiber: 0
      },
      {
        name: 'Arroz Integral',
        category: 'Carboidrato',
        calories: 111,
        proteins: 2.6,
        carbs: 23,
        fats: 0.9,
        fiber: 1.8
      },
      {
        name: 'Brócolis',
        category: 'Vegetal',
        calories: 34,
        proteins: 2.8,
        carbs: 7,
        fats: 0.4,
        fiber: 2.6
      },
      {
        name: 'Aveia',
        category: 'Carboidrato',
        calories: 389,
        proteins: 16.9,
        carbs: 66.3,
        fats: 6.9,
        fiber: 10.6
      },
      {
        name: 'Banana',
        category: 'Fruta',
        calories: 89,
        proteins: 1.1,
        carbs: 22.8,
        fats: 0.3,
        fiber: 2.6
      }
    ]
  })

  console.log('✅ Seed executado com sucesso!')
  console.log('👨‍⚕️ Nutricionista: dra.silva@email.com / 123456')
  console.log('👤 Cliente: joao@email.com / 123456')
  console.log('✅ Seed executado com sucesso!')
  console.log('👨‍⚕️ Nutricionistas:')
  console.log('  - dra.silva@email.com / 123456 (Nutrição Esportiva)')
  console.log('  - dr.carlos@email.com / 123456 (Nutrição Clínica)')
  console.log('  - dra.lucia@email.com / 123456 (Materno-Infantil)')
  console.log('  - dr.pedro@email.com / 123456 (Nutrição Funcional)')
  console.log('👤 Clientes:')
  console.log('  - joao@email.com / 123456')
  console.log('  - maria@email.com / 123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })