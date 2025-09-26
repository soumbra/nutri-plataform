'use client'

interface EditMealPlanPageProps {
  readonly params: {
    readonly id: string
  }
}

export default function EditMealPlanPage({ params }: EditMealPlanPageProps) {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Editar Plano Alimentar</h1>
        <div className="bg-white rounded-lg border p-6">
          <p className="text-muted-foreground">
            Editando plano ID: <span className="font-mono">{params.id}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Esta página ainda está em desenvolvimento.
          </p>
        </div>
      </div>
    </div>
  )
}