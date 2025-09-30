'use client';

import { ProgressRecord } from '@/types/progress';
import { useState } from 'react';

interface ProgressChartProps {
  readonly data: ProgressRecord[];
  readonly height?: number;
}

export default function ProgressChart({ data, height = 300 }: ProgressChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ProgressRecord | null>(null);
  
  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-gray-50 rounded-lg border flex items-center justify-center" style={{ height }}>
        <div className="text-center text-gray-500">
          <div className="text-lg mb-2">📊</div>
          <div>Nenhum dado disponível</div>
          <div className="text-sm">Adicione registros para visualizar o gráfico</div>
        </div>
      </div>
    );
  }

  // Preparar dados
  const sortedData = [...data].sort((a, b) => 
    new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()
  );

  // Dimensões
  const padding = { top: 20, right: 50, bottom: 40, left: 50 };
  const chartWidth = 400;
  const chartHeight = height;
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Escalas
  const weights = sortedData.map(d => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight || 1;
  const buffer = weightRange * 0.1;
  const displayMin = minWeight - buffer;
  const displayMax = maxWeight + buffer;
  const displayRange = displayMax - displayMin;

  // Calcular pontos
  const points = sortedData.map((record, index) => {
    const x = padding.left + (index / Math.max(sortedData.length - 1, 1)) * plotWidth;
    const y = padding.top + (1 - (record.weight - displayMin) / displayRange) * plotHeight;
    return { x, y, record };
  });

  // Criar path SVG
  const linePath = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + 
      points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  // Grid horizontal
  const gridSteps = 4;
  const gridLines = Array.from({ length: gridSteps + 1 }, (_, i) => {
    const value = displayMin + (i / gridSteps) * displayRange;
    const y = padding.top + (1 - i / gridSteps) * plotHeight;
    return { y, value };
  });

  return (
    <div className="w-full bg-white rounded-lg border" style={{ height }}>
      <div className="relative w-full h-full p-4">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Grid horizontal */}
          {gridLines.map((line) => (
            <g key={`grid-${line.value.toFixed(1)}`}>
              <line
                x1={padding.left}
                y1={line.y}
                x2={padding.left + plotWidth}
                y2={line.y}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={line.y + 4}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {line.value.toFixed(1)}kg
              </text>
            </g>
          ))}
          
          {/* Linha principal */}
          <path
            d={linePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Pontos */}
          {points.map((point) => (
            <circle
              key={point.record.id}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              stroke="#3b82f6"
              strokeWidth="2"
              className="cursor-pointer hover:r-6 transition-all"
              onMouseEnter={() => setHoveredPoint(point.record)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none z-10 top-2 right-2">
            <div className="font-semibold">{hoveredPoint.weight}kg</div>
            <div className="text-gray-300 text-xs">
              {new Date(hoveredPoint.recordDate).toLocaleDateString('pt-BR')}
            </div>
            {hoveredPoint.notes && (
              <div className="text-gray-400 text-xs mt-1 max-w-32 truncate">
                {hoveredPoint.notes}
              </div>
            )}
          </div>
        )}

        {/* Labels do eixo X */}
        <div className="absolute bottom-1 left-12 right-12 flex justify-between text-xs text-gray-500">
          <span>
            {new Date(sortedData[0]?.recordDate).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short'
            })}
          </span>
          <span>
            {new Date(sortedData[sortedData.length - 1]?.recordDate).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short'
            })}
          </span>
        </div>

        {/* Contador de registros */}
        <div className="absolute top-2 left-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
          {sortedData.length} registros
        </div>
      </div>
    </div>
  );
}