import React, { useState } from 'react';
import { MatrixCounts } from '../types/confusionMatrix';
import { Sliders, ArrowLeftRight, Check, Sparkles } from 'lucide-react';
import { computeMetrics, formatPercent } from '../utils/metrics';

interface ThresholdDistributionProps {
  onApplyMatrix: (newMatrix: MatrixCounts) => void;
}

export const ThresholdDistribution: React.FC<ThresholdDistributionProps> = ({ onApplyMatrix }) => {
  const [threshold, setThreshold] = useState<number>(0.5);
  const [imbalanceMode, setImbalanceMode] = useState<'balanced' | 'imbalanced'>('imbalanced');

  // Total population size simulated
  const N_NEG = imbalanceMode === 'imbalanced' ? 9900 : 1000;
  const N_POS = imbalanceMode === 'imbalanced' ? 100 : 1000;

  // Gaussian simulation: Negatives centered around 0.35, Positives centered around 0.65
  // Cumulative Normal distribution approximation
  const normalCdf = (x: number, mean: number, std: number): number => {
    const z = (x - mean) / std;
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp((-z * z) / 2);
    let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (z > 0) p = 1 - p;
    return p;
  };

  // True Negative Rate: portion of Negatives < threshold
  const tnr = normalCdf(threshold, 0.35, 0.14);
  const fpr = 1 - tnr;

  // False Negative Rate: portion of Positives < threshold
  const fnr = normalCdf(threshold, 0.65, 0.14);
  const tpr = 1 - fnr; // Recall

  const tn = Math.round(N_NEG * tnr);
  const fp = Math.round(N_NEG * fpr);
  const fn = Math.round(N_POS * fnr);
  const tp = Math.round(N_POS * tpr);

  const simulatedMatrix: MatrixCounts = { tp, fp, fn, tn };
  const m = computeMetrics(simulatedMatrix);

  // SVG dimensions
  const width = 640;
  const height = 180;
  const padding = 20;

  // Generate curve path points
  const points = 100;
  const curveNeg: string[] = [];
  const curvePos: string[] = [];

  const negMean = 0.35;
  const posMean = 0.65;
  const std = 0.14;

  const gaussian = (x: number, mean: number) => {
    return Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(std, 2)));
  };

  for (let i = 0; i <= points; i++) {
    const xVal = i / points;
    const svgX = padding + xVal * (width - 2 * padding);

    // Height scaled
    const yNeg = gaussian(xVal, negMean);
    const svgYNeg = height - padding - yNeg * (height - 2 * padding - 20);
    curveNeg.push(`${i === 0 ? 'M' : 'L'} ${svgX} ${svgYNeg}`);

    const yPos = gaussian(xVal, posMean);
    const svgYPos = height - padding - yPos * (height - 2 * padding - 20);
    curvePos.push(`${i === 0 ? 'M' : 'L'} ${svgX} ${svgYPos}`);
  }

  const thresholdSvgX = padding + threshold * (width - 2 * padding);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Simulador de Umbral de Decisión (Curvas de Distribución)
          </h3>
          <p className="text-xs text-slate-400">
            Descubre cómo mover el umbral de probabilidad genera los Verdaderos y Falsos Positivos/Negativos.
          </p>
        </div>

        {/* Dataset Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Escenario:</span>
          <button
            onClick={() => setImbalanceMode('imbalanced')}
            className={`text-xs px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
              imbalanceMode === 'imbalanced'
                ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ⚠️ Desbalance 99:1
          </button>
          <button
            onClick={() => setImbalanceMode('balanced')}
            className={`text-xs px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
              imbalanceMode === 'balanced'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ⚖️ Equilibrado 50:50
          </button>
        </div>
      </div>

      {/* SVG Canvas Curve */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 relative overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-52 overflow-visible select-none"
        >
          {/* Axis line */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#334155"
            strokeWidth="2"
          />

          {/* Negative Distribution Curve (Blue) */}
          <path
            d={`${curveNeg.join(' ')} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
            fill="rgba(59, 130, 246, 0.15)"
            stroke="#3b82f6"
            strokeWidth="2.5"
          />

          {/* Positive Distribution Curve (Red/Emerald) */}
          <path
            d={`${curvePos.join(' ')} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
            fill="rgba(16, 185, 129, 0.18)"
            stroke="#10b981"
            strokeWidth="2.5"
          />

          {/* Threshold Vertical Line */}
          <line
            x1={thresholdSvgX}
            y1={padding - 10}
            x2={thresholdSvgX}
            y2={height - padding + 10}
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="4 3"
          />

          {/* Threshold Label badge */}
          <circle cx={thresholdSvgX} cy={padding - 5} r="7" fill="#f59e0b" />
          <text
            x={thresholdSvgX}
            y={padding - 14}
            textAnchor="middle"
            fill="#f59e0b"
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
          >
            Umbral: {threshold.toFixed(2)}
          </text>

          {/* Region Annotations */}
          <text
            x={thresholdSvgX - 10}
            y={height - padding - 8}
            textAnchor="end"
            fill="#94a3b8"
            fontSize="10"
            fontWeight="bold"
          >
            ← PREDICCIÓN: NEGATIVO (-)
          </text>
          <text
            x={thresholdSvgX + 10}
            y={height - padding - 8}
            textAnchor="start"
            fill="#f59e0b"
            fontSize="10"
            fontWeight="bold"
          >
            PREDICCIÓN: POSITIVO (+) →
          </text>
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-3 h-1 bg-blue-500 rounded"></span>
              Distribución Reales Negativos ({N_NEG})
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-1 bg-emerald-500 rounded"></span>
              Distribución Reales Positivos ({N_POS})
            </span>
          </div>
          <div className="text-amber-300 font-mono font-semibold">
            Umbral de Decisión: {threshold.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Threshold Slider Control */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white flex items-center gap-2">
            <span>Ajustar Umbral de Decisión:</span>
            <span className="font-mono text-amber-400 text-sm">{threshold.toFixed(2)}</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setThreshold(0.2)}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              Umbral Bajo (0.20 - Cazar Todos)
            </button>
            <button
              onClick={() => setThreshold(0.5)}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              Estándar (0.50)
            </button>
            <button
              onClick={() => setThreshold(0.8)}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              Umbral Alto (0.80 - Conservador)
            </button>
          </div>
        </div>

        <input
          type="range"
          min="0.05"
          max="0.95"
          step="0.01"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          className="w-full accent-amber-400 cursor-ew-resize h-2 bg-slate-800 rounded-lg"
        />

        <div className="flex justify-between text-[11px] text-slate-400">
          <span>← Umbral Bajo: Aumenta Sensibilidad/Recall (Menos Falsos Negativos, Más Falsas Alarmas)</span>
          <span>Umbral Alto: Aumenta Precisión (Cero Falsas Alarmas, Escapan Positivos) →</span>
        </div>
      </div>

      {/* Quick live metrics generated from current threshold */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Exactitud (Accuracy)</span>
          <span className="font-mono font-bold text-sm text-white">{formatPercent(m.accuracy)}</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-indigo-900/50">
          <span className="text-indigo-300 block text-[10px]">F1-Score</span>
          <span className="font-mono font-bold text-sm text-indigo-300">{m.f1Score.toFixed(3)}</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-emerald-900/50">
          <span className="text-emerald-400 block text-[10px]">Precisión</span>
          <span className="font-mono font-bold text-sm text-emerald-300">{formatPercent(m.precision)}</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-violet-900/50">
          <span className="text-violet-400 block text-[10px]">Recall (Sensibilidad)</span>
          <span className="font-mono font-bold text-sm text-violet-300">{formatPercent(m.recall)}</span>
        </div>
      </div>

      {/* Apply to Main Matrix Button */}
      <button
        onClick={() => onApplyMatrix(simulatedMatrix)}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 cursor-pointer transition-all"
      >
        <Check className="w-4 h-4" />
        Aplicar estos valores simulados a la Matriz de Confusión principal
      </button>
    </div>
  );
};
