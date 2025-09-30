'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ClientDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard do Cliente
        </h1>
        <p className="text-gray-600">
          Acompanhe seu progresso e gerencie seus planos alimentares
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">📊</span>
              </div>
              Acompanhamento de Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Registre seu peso, medidas corporais e acompanhe sua evolução com gráficos detalhados.
            </p>
            <Link href="/dashboard/client/progress" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Ver Progresso
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Meal Plans Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">🍽️</span>
              </div>
              Planos Alimentares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Visualize seus planos alimentares e acompanhe suas refeições diárias.
            </p>
            <Link href="/dashboard/client/meal-plans" className="block">
              <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                Ver Planos
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">👤</span>
              </div>
              Meu Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Gerencie suas informações pessoais e configurações de conta.
            </p>
            <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
              Ver Perfil
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/client/progress">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-1 border-blue-300 hover:bg-blue-50">
                <span className="text-lg">📊</span>
                <span className="text-xs">Registrar Peso</span>
              </Button>
            </Link>
            
            <Link href="/dashboard/client/meal-plans">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-1 border-green-300 hover:bg-green-50">
                <span className="text-lg">🍽️</span>
                <span className="text-xs">Ver Refeições</span>
              </Button>
            </Link>
            
            <Button variant="outline" className="w-full h-16 flex flex-col gap-1 border-purple-300 hover:bg-purple-50">
              <span className="text-lg">📱</span>
              <span className="text-xs">Contato</span>
            </Button>
            
            <Button variant="outline" className="w-full h-16 flex flex-col gap-1 border-gray-300 hover:bg-gray-50">
              <span className="text-lg">⚙️</span>
              <span className="text-xs">Configurações</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}