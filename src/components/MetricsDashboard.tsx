import React, { useState } from 'react';
import { MatrixCounts } from '../types/confusionMatrix';
import { computeMetrics, formatPercent, formatNumber } from '../utils/metrics';
import {
  HelpCircle,
  AlertTriangle,
  Check,
  TrendingUp,
  Percent,
  Sliders,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface MetricsDashboardProps {
  matrix: MatrixCounts;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ matrix }) => {
  const m = computeMetrics(matrix);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedMetric(expandedMetric === id ? null : id);
  };

  const isAccuracyMisleading = m.accuracy >= 0.85 && (m.recall < 0.3 || m.f1Score < 0.4);
  const totalErrors = matrix.fp + matrix.fn;
  const fpPercentOfErrors = totalErrors > 0 ? (matrix.fp / totalErrors) * 100 : 50;
  const fnPercentOfErrors = totalErrors > 0 ? (matrix.fn / totalErrors) * 100 : 50;

  return (
    <div className="flex flex-col gap-4">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Accuracy */}
        <div
          onClick={() => toggleExpand('accuracy')}
          className={`cursor-pointer transition-all rounded-xl p-4 border relative overflow-hidden ${
            isAccuracyMisleading
              ? 'bg-amber-950/20 border-amber-600/70 hover:border-amber-400'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              Exactitud (Accuracy)
            </span>
            {isAccuracyMisleading && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-600/60 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                ¡Engañosa!
              </span>
            )}
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-black font-mono tracking-tight ${
                isAccuracyMisleading ? 'text-amber-300' : 'text-white'
              }`}
            >
              {formatPercent(m.accuracy)}
            </span>
            <span className="text-xs text-slate-400">
              ({formatNumber(matrix.tp + matrix.tn)}/{formatNumber(m.total)})
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-400 line-clamp-2">
            Porcentaje de aciertos totales sobre el universo completo.
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
            <span>Ver fórmula y desglose</span>
            {expandedMetric === 'accuracy' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </div>

        {/* Card 2: F1-Score */}
        <div
          onClick={() => toggleExpand('f1')}
          className="cursor-pointer transition-all rounded-xl p-4 border bg-slate-900 border-indigo-600/40 hover:border-indigo-400 relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              Puntaje F1 (F1-Score)
            </span>
            <span className="text-[10px] font-bold text-indigo-200 bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-700/60">
              Media Armónica
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono tracking-tight text-indigo-300">
              {m.f1Score.toFixed(3)}
            </span>
            <span className="text-xs text-slate-400">
              ({formatPercent(m.f1Score)})
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-400 line-clamp-2">
            Equilibrio honesto entre Precisión y Recall. No se deja engañar por la clase mayoritaria.
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
            <span>Ver fórmula y desglose</span>
            {expandedMetric === 'f1' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </div>

        {/* Card 3: Precision */}
        <div
          onClick={() => toggleExpand('precision')}
          className="cursor-pointer transition-all rounded-xl p-4 border bg-slate-900 border-slate-800 hover:border-emerald-600/50 relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Precisión (Precision)
            </span>
            <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              Evita Falsos (+)
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono tracking-tight text-emerald-300">
              {formatPercent(m.precision)}
            </span>
            <span className="text-xs text-slate-400">
              ({formatNumber(matrix.tp)}/{formatNumber(m.predictedPositives)})
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-400 line-clamp-2">
            De todo lo que predijo positivo, ¿cuántos eran reales? (Castigada por Falsos Positivos).
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
            <span>Ver fórmula y desglose</span>
            {expandedMetric === 'precision' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </div>

        {/* Card 4: Recall / Sensibilidad */}
        <div
          onClick={() => toggleExpand('recall')}
          className="cursor-pointer transition-all rounded-xl p-4 border bg-slate-900 border-slate-800 hover:border-violet-600/50 relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
              Sensibilidad (Recall)
            </span>
            <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              Evita Falsos (-)
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono tracking-tight text-violet-300">
              {formatPercent(m.recall)}
            </span>
            <span className="text-xs text-slate-400">
              ({formatNumber(matrix.tp)}/{formatNumber(m.actualPositives)})
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-400 line-clamp-2">
            De todos los positivos reales en el mundo, ¿cuántos logró cazar? (Castigada por Falsos Negativos).
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
            <span>Ver fórmula y desglose</span>
            {expandedMetric === 'recall' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>

      {/* Expanded Formula Details */}
      {expandedMetric && (
        <div className="bg-slate-900 border border-indigo-700/50 rounded-xl p-4 text-sm animate-fadeIn">
          {expandedMetric === 'accuracy' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span>📐 Desglose Matemático: Exactitud (Accuracy)</span>
                </h4>
                <button
                  onClick={() => setExpandedMetric(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg font-mono text-xs text-indigo-300 border border-slate-800">
                Accuracy = (TP + TN) / (TP + TN + FP + FN) = ({matrix.tp} + {matrix.tn}) / ({m.total}) = {(m.accuracy * 100).toFixed(2)}%
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-amber-300">¿Por qué engaña?</strong> Si tienes 990 personas sanas y 10 enfermas (desbalance 99:1), un modelo que diga ciegamente "todos sanos" tendrá 99.0% de exactitud matemática. Pero como médico, no detectaste a NINGÚN enfermo. El accuracy premia el acertar la clase mayoritaria fácil.
              </p>
            </div>
          )}

          {expandedMetric === 'f1' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span>📐 Desglose Matemático: F1-Score (Media Armónica)</span>
                </h4>
                <button
                  onClick={() => setExpandedMetric(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg font-mono text-xs text-indigo-300 border border-slate-800">
                F1 = 2 × (Precisión × Recall) / (Precisión + Recall) = 2 × ({m.precision.toFixed(3)} × {m.recall.toFixed(3)}) / ({m.precision.toFixed(3)} + {m.recall.toFixed(3)}) = {m.f1Score.toFixed(3)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-indigo-300">¿Por qué es la métrica reina en datos desbalanceados?</strong> La media aritmética de 100% y 0% daría 50%, lo cual parecería aceptable. La <em>media armónica</em> se hunde hacia el número más bajo: si la Precisión o el Recall se van a cero, el F1-Score se desploma a 0. Esto desenmascara inmediatamente a los modelos tramposos.
              </p>
            </div>
          )}

          {expandedMetric === 'precision' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span>📐 Desglose Matemático: Precisión (Precision)</span>
                </h4>
                <button
                  onClick={() => setExpandedMetric(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg font-mono text-xs text-emerald-300 border border-slate-800">
                Precisión = TP / (TP + FP) = {matrix.tp} / ({matrix.tp} + {matrix.fp}) = {(m.precision * 100).toFixed(2)}%
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-emerald-300">¿Cuándo es tu prioridad #1?</strong> Cuando el coste de una falsa alarma (Falso Positivo) es inaceptable. Ejemplo: Filtro de Spam (mandar un correo de trabajo vital a spam), o acusar a alguien penalmente sin pruebas contundentes.
              </p>
            </div>
          )}

          {expandedMetric === 'recall' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span>📐 Desglose Matemático: Sensibilidad / Recall (Exhaustividad)</span>
                </h4>
                <button
                  onClick={() => setExpandedMetric(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg font-mono text-xs text-violet-300 border border-slate-800">
                Recall = TP / (TP + FN) = {matrix.tp} / ({matrix.tp} + {matrix.fn}) = {(m.recall * 100).toFixed(2)}%
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-violet-300">¿Cuándo es tu prioridad #1?</strong> Cuando dejar escapar un caso real (Falso Negativo) es mortal o catastrófico. Ejemplo: Diagnóstico de cáncer, detección de armas en aeropuertos, o detección de terremotos. Preferimos mil falsas alarmas antes que una omisión fatal.
              </p>
            </div>
          )}
        </div>
      )}

      {/* FP vs FN Error Balance Comparison Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Balanza de Errores del Modelo:</span>
            <span className="text-slate-400 font-mono">
              Total Errores: {formatNumber(totalErrors)} ({totalErrors > 0 ? formatPercent(totalErrors / m.total) : '0%'} de la muestra)
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              Falsos Positivos (Alarmas Falsas): <strong>{formatNumber(matrix.fp)}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-rose-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Falsos Negativos (Omisiones Peligrosas): <strong>{formatNumber(matrix.fn)}</strong>
            </span>
          </div>
        </div>

        {/* Visual Bar */}
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
          {totalErrors === 0 ? (
            <div className="h-full w-full bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-slate-950">
              ¡Cero Errores!
            </div>
          ) : (
            <>
              <div
                style={{ width: `${fpPercentOfErrors}%` }}
                className="h-full bg-amber-400 transition-all duration-300"
                title={`Falsos Positivos: ${matrix.fp} (${fpPercentOfErrors.toFixed(1)}% de los errores)`}
              />
              <div
                style={{ width: `${fnPercentOfErrors}%` }}
                className="h-full bg-rose-500 transition-all duration-300"
                title={`Falsos Negativos: ${matrix.fn} (${fnPercentOfErrors.toFixed(1)}% de los errores)`}
              />
            </>
          )}
        </div>

        <div className="mt-2 flex justify-between text-[10px] text-slate-500">
          <span>← Más Falsos Positivos (Poca Precisión, Molestia de Alarmas)</span>
          <span>Más Falsos Negativos (Poco Recall, Casos Reales Ignorados) →</span>
        </div>
      </div>
    </div>
  );
};
