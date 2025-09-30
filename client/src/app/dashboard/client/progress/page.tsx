'use client';
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import ProgressChart from '@/components/progress/ProgressChart';
import { ProgressForm } from '@/components/progress/ProgressForm';
import { ProgressList } from '@/components/progress/ProgressList';
import { ProgressStatsComponent } from '@/components/progress/ProgressStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

import type { CreateProgressRequest } from '@/types/progress';

function ClientProgressContent() {
  const [showForm, setShowForm] = useState(false);
  const { 
    records, 
    stats, 
    chartData, 
    loading, 
    error, 
    createRecord, 
    deleteRecord 
  } = useProgress();

  const handleCreateRecord = async (data: CreateProgressRequest) => {
    try {
      await createRecord(data);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar registro:', error);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteRecord(id);
    } catch (error) {
      console.error('Erro ao deletar registro:', error);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Erro ao carregar dados
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Acompanhamento de Progresso
            </h1>
            <p className="text-muted-foreground">
              Registre e acompanhe sua evolução ao longo do tempo
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {showForm ? 'Cancelar' : '+ Novo Registro'}
        </Button>
      </div>

      {/* Dicas de uso - Exibidas quando não há registros ou quando o formulário está aberto */}
      {(records.length === 0 || showForm) && (
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-1">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">
                  {records.length === 0 ? 'Primeiros passos' : 'Dicas para um bom registro'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    <span>Registre sempre no mesmo horário</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    <span>Use a mesma balança para precisão</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    <span>Anote observações importantes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    <span>Registre pelo menos 1x por semana</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid principal - layout mais compacto */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal - Gráfico e Lista */}
        <div className="lg:col-span-2 space-y-4">
          {/* Formulário (condicionalmente renderizado) */}
          {showForm && (
            <ProgressForm 
              onSubmit={handleCreateRecord}
              loading={loading}
            />
          )}

          {/* Gráfico - altura reduzida */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Evolução do Peso</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm">Carregando gráfico...</span>
                </div>
              ) : (
                <ProgressChart data={chartData} height={220} />
              )}
            </CardContent>
          </Card>

          {/* Lista de Registros - mais compacta */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Histórico de Registros</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ProgressList 
                records={records}
                onDelete={handleDeleteRecord}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar compacta - Estatísticas e Ações */}
        <div className="lg:col-span-1 space-y-4">
          <ProgressStatsComponent 
            stats={stats}
            loading={loading}
          />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowForm(true)}
              >
                📝 Adicionar Registro
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.reload()}
              >
                🔄 Atualizar Dados
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  // Funcionalidade de exportação será implementada em versão futura
                  alert('Funcionalidade em desenvolvimento');
                }}
              >
                📊 Exportar Dados
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ClientProgressPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div>Carregando...</div>
      </div>
    }>
      <ClientProgressContent />
    </Suspense>
  )
}