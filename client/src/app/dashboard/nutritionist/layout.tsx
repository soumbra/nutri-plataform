import { ReactNode } from 'react'
import { NutritionistRoute } from '@/components/ProtectedRoute'

interface NutritionistLayoutProps {
  readonly children: ReactNode
}

export default function NutritionistLayout({ children }: NutritionistLayoutProps) {
  return (
    <NutritionistRoute>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </NutritionistRoute>
  )
}