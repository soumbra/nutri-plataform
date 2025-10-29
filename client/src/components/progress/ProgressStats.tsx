'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ProgressStats } from '@/types/progress';

interface ProgressStatsProps {
  readonly stats: ProgressStats | null;
  readonly loading?: boolean;
}

export function ProgressStatsComponent({ stats, loading = false }: ProgressStatsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm">Carregando...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-4">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-xs text-gray-500">
              Adicione registros para ver estatísticas
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTrendDisplay = (trend: string) => {
    switch (trend) {
      case 'gaining':
        return { icon: '📈', text: 'Ganhando', color: 'bg-green-100 text-green-800' };
      case 'losing':
        return { icon: '📉', text: 'Perdendo', color: 'bg-red-100 text-red-800' };
      case 'stable':
        return { icon: '➡️', text: 'Estável', color: 'bg-gray-100 text-gray-800' };
      default:
        return { icon: '❓', text: 'Indefinido', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const trendDisplay = getTrendDisplay(stats.trends.weightTrend);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Estatísticas</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Grid de estatísticas compacto */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total de Registros */}
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg mb-1">📝</div>
              <div className="text-lg font-bold text-blue-600">
                {stats.totalRecords}
              </div>
              <div className="text-xs text-gray-600">
                {stats.totalRecords === 1 ? 'Registro' : 'Registros'}
              </div>
            </div>

            {/* Peso Médio */}
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg mb-1">⚖️</div>
              <div className="text-lg font-bold text-purple-600">
                {stats.averageWeight ? `${stats.averageWeight.toFixed(1)}kg` : '--'}
              </div>
              <div className="text-xs text-gray-600">Peso Médio</div>
            </div>

            {/* Tendência */}
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg mb-1">{trendDisplay.icon}</div>
              <div className="mb-1">
                <Badge className={`${trendDisplay.color} text-xs`}>
                  {trendDisplay.text}
                </Badge>
              </div>
              <div className="text-xs text-gray-600">Tendência</div>
            </div>

            {/* Período */}
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg mb-1">📅</div>
              <div className="text-lg font-bold text-orange-600">
                {stats.trends.periodDays}
              </div>
              <div className="text-xs text-gray-600">
                {stats.trends.periodDays === 1 ? 'Dia' : 'Dias'}
              </div>
            </div>
          </div>

          {/* Último Registro - compacto */}
          {stats.lastRecord && (
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-2 text-sm">
                Último Registro
              </h4>
              
              <div className="flex justify-between items-center text-xs">
                <div>
                  <strong>{stats.lastRecord.weight}kg</strong>
                  <span className="text-gray-500 ml-2">
                    {new Date(stats.lastRecord.recordDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {stats.lastRecord.notes && (
                  <div className="text-gray-600 truncate max-w-32">
                    💭 {stats.lastRecord.notes}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
