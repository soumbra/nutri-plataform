'use client'

interface MealPlanDetailPageProps {
  readonly params: {
    readonly id: string
  }
}

export default function MealPlanDetailPage({ params }: MealPlanDetailPageProps) {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Detalhes do Plano Alimentar</h1>
        <div className="bg-white rounded-lg border p-6">
          <p className="text-muted-foreground">
            Visualizando plano ID: <span className="font-mono">{params.id}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Esta página ainda está em desenvolvimento.
          </p>
        </div>
      </div>
    </div>
  )
}