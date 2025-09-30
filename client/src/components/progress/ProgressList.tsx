'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ProgressRecord } from '@/types/progress';

interface ProgressListProps {
  readonly records: ProgressRecord[];
  readonly onDelete?: (id: string) => Promise<void>;
  readonly loading?: boolean;
}

export function ProgressList({ records, onDelete, loading = false }: ProgressListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    
    if (!confirm('Tem certeza que deseja deletar este registro?')) {
      return;
    }

    try {
      setDeletingId(id);
      await onDelete(id);
    } catch (error) {
      console.error('Erro ao deletar registro:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTrendIcon = (index: number) => {
    if (index === records.length - 1) return '';
    
    const current = records[index].weight;
    const previous = records[index + 1].weight;
    
    if (current > previous) return '📈';
    if (current < previous) return '📉';
    return '➡️';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm">Carregando...</span>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="text-2xl mb-2">📋</div>
        <p className="text-sm text-gray-500">
          Nenhum registro encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {records.map((record, index) => (
        <div
          key={record.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <span className="font-medium text-sm">{record.weight}kg</span>
              <span className="text-xs text-gray-500">{formatDate(record.recordDate)}</span>
            </div>
            
            {(record.bodyFat || record.muscle) && (
              <div className="flex gap-3 text-xs text-gray-600 mb-1">
                {record.bodyFat && <span>Gordura: {record.bodyFat}%</span>}
                {record.muscle && <span>Músculo: {record.muscle}kg</span>}
              </div>
            )}
            
            {record.notes && (
              <p className="text-xs text-gray-600 truncate">{record.notes}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-3">
            <span className="text-sm">{getTrendIcon(index)}</span>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(record.id)}
                disabled={deletingId === record.id}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                {deletingId === record.id ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-red-500"></div>
                ) : (
                  '🗑️'
                )}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
