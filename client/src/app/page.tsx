import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Nutri Platform</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Para Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Encontre o nutricionista ideal e acompanhe seu progresso
            </p>
            <Button className="w-full">Começar como Cliente</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Para Nutricionistas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Gerencie seus clientes e crie planos personalizados
            </p>
            <Button variant="outline" className="w-full">
              Começar como Nutricionista
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}