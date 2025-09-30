'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CreateProgressRequest } from '@/types/progress';

interface ProgressFormProps {
  readonly onSubmit: (data: CreateProgressRequest) => Promise<void>;
  readonly loading?: boolean;
}

export function ProgressForm({ onSubmit, loading = false }: ProgressFormProps) {
  const [formData, setFormData] = useState<CreateProgressRequest>({
    weight: 0,
    bodyFat: undefined,
    muscle: undefined,
    notes: '',
    recordDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    const newErrors: Record<string, string> = {};
    
    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = 'Peso é obrigatório e deve ser maior que 0';
    }
    
    if (!formData.recordDate) {
      newErrors.recordDate = 'Data é obrigatória';
    }
    
    if (formData.bodyFat && (formData.bodyFat < 0 || formData.bodyFat > 100)) {
      newErrors.bodyFat = 'Gordura corporal deve estar entre 0% e 100%';
    }
    
    if (formData.muscle && formData.muscle < 0) {
      newErrors.muscle = 'Massa muscular deve ser maior que 0';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      // Converter data para ISO string se necessário
      const submitData = {
        ...formData,
        recordDate: new Date(formData.recordDate + 'T12:00:00.000Z').toISOString(),
        bodyFat: formData.bodyFat || undefined,
        muscle: formData.muscle || undefined,
        notes: formData.notes || undefined,
      };
      
      await onSubmit(submitData);
      
      // Reset form após sucesso
      setFormData({
        weight: 0,
        bodyFat: undefined,
        muscle: undefined,
        notes: '',
        recordDate: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    } catch (error) {
      console.error('Erro ao criar registro:', error);
    }
  };

  const handleInputChange = (field: keyof CreateProgressRequest, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-blue-800">
          Registrar Novo Progresso
        </CardTitle>
        <p className="text-sm text-blue-600">
          Adicione suas medidas e acompanhe sua evolução
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="weight">Peso (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                value={formData.weight || ''}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                className={errors.weight ? 'border-red-500' : ''}
                placeholder="Ex: 70.5"
                required
              />
              {errors.weight && (
                <p className="text-sm text-red-500 mt-1">{errors.weight}</p>
              )}
            </div>

            <div>
              <Label htmlFor="recordDate">Data *</Label>
              <Input
                id="recordDate"
                type="date"
                value={formData.recordDate}
                onChange={(e) => handleInputChange('recordDate', e.target.value)}
                className={errors.recordDate ? 'border-red-500' : ''}
                required
              />
              {errors.recordDate && (
                <p className="text-sm text-red-500 mt-1">{errors.recordDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="bodyFat">Gordura Corporal (%) - Opcional</Label>
              <Input
                id="bodyFat"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.bodyFat || ''}
                onChange={(e) => handleInputChange('bodyFat', parseFloat(e.target.value) || undefined)}
                className={errors.bodyFat ? 'border-red-500' : ''}
                placeholder="Ex: 15.5"
              />
              {errors.bodyFat && (
                <p className="text-sm text-red-500 mt-1">{errors.bodyFat}</p>
              )}
            </div>

            <div>
              <Label htmlFor="muscle">Massa Muscular (kg) - Opcional</Label>
              <Input
                id="muscle"
                type="number"
                step="0.1"
                min="0"
                value={formData.muscle || ''}
                onChange={(e) => handleInputChange('muscle', parseFloat(e.target.value) || undefined)}
                className={errors.muscle ? 'border-red-500' : ''}
                placeholder="Ex: 45.2"
              />
              {errors.muscle && (
                <p className="text-sm text-red-500 mt-1">{errors.muscle}</p>
              )}
            </div>
          </div>

          <div className="col-span-2 lg:col-span-4">
            <Label htmlFor="notes">Observações - Opcional</Label>
            <textarea
              id="notes"
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Como você está se sentindo? Alguma observação importante..."
            />
          </div>

          <div className="col-span-2 lg:col-span-4 flex gap-3 pt-2">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </div>
              ) : (
                '✓ Registrar Progresso'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}