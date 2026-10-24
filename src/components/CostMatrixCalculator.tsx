import React, { useState } from 'react';
import { MatrixCounts, CostConfiguration } from '../types/confusionMatrix';
import { computeMetrics, computeNetCost, formatNumber, formatPercent } from '../utils/metrics';
import { DollarSign, Sliders, TrendingUp, TrendingDown, RefreshCw, Sparkles } from 'lucide-react';

interface CostMatrixCalculatorProps {
  currentMatrix: MatrixCounts;
}

export const CostMatrixCalculator: React.FC<CostMatrixCalculatorProps> = ({ currentMatrix }) => {
  const [costs, setCosts] = useState<CostConfiguration>({
    tpValue: 1200,
    tnValue: 5,
    fpCost: 80,
    fnCost: 1500,
    currencyUnit: 'USD',
  });

  const net = computeNetCost(currentMatrix, costs);
  const m = computeMetrics(currentMatrix);

  // Compare with Naive model (all negatives)
  const naiveMatrix: MatrixCounts = {
    tp: 0,
    fp: 0,
    fn: m.actualPositives,
    tn: m.actualNegatives,
  };
  const naiveNet = computeNetCost(naiveMatrix, costs);
  const diffNet = net.total - naiveNet.total;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
          <DollarSign className="w-4 h-4" /> Calculadora de Impacto Económico y Costes
        </div>
        <h2 className="text-xl font-black text-white tracking-tight">
          Matriz de Costes: ¿Cuánto Cuesta Cada Error en Dinero Real?
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          En el mundo real, los errores no valen lo mismo. Un Falso Negativo puede costar millones mientras que un Falso Positivo solo unos dólares.
        </p>
      </div>

      {/* Cost Customizer Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TP Reward */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-800/40">
          <span className="text-[11px] font-bold text-emerald-400 block mb-1">
            Beneficio por TP (+):
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono text-sm">$</span>
            <input
              type="number"
              min="0"
              value={costs.tpValue}
              onChange={(e) => setCosts({ ...costs, tpValue: Number(e.target.value) })}
              className="font-mono text-lg font-bold text-white bg-slate-900 border border-slate-700 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Valor de fraude evitado o vida salvada
          </span>
        </div>

        {/* FP Cost */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-800/40">
          <span className="text-[11px] font-bold text-amber-400 block mb-1">
            Coste por Falso Positivo (FP):
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono text-sm">-$</span>
            <input
              type="number"
              min="0"
              value={costs.fpCost}
              onChange={(e) => setCosts({ ...costs, fpCost: Number(e.target.value) })}
              className="font-mono text-lg font-bold text-amber-300 bg-slate-900 border border-slate-700 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Coste de llamada a soporte o prueba secundaria
          </span>
        </div>

        {/* FN Cost */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-800/40">
          <span className="text-[11px] font-bold text-rose-400 block mb-1">
            Pérdida por Falso Negativo (FN):
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono text-sm">-$</span>
            <input
              type="number"
              min="0"
              value={costs.fnCost}
              onChange={(e) => setCosts({ ...costs, fnCost: Number(e.target.value) })}
              className="font-mono text-lg font-bold text-rose-300 bg-slate-900 border border-slate-700 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-rose-400"
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Pérdida del fraude o daño no evitado
          </span>
        </div>

        {/* TN Reward */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-700/50">
          <span className="text-[11px] font-bold text-slate-300 block mb-1">
            Beneficio por TN (-):
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono text-sm">+$</span>
            <input
              type="number"
              min="0"
              value={costs.tnValue}
              onChange={(e) => setCosts({ ...costs, tnValue: Number(e.target.value) })}
              className="font-mono text-lg font-bold text-slate-200 bg-slate-900 border border-slate-700 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Ingreso normal de operación sin fricción
          </span>
        </div>
      </div>

      {/* Financial Results Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model Actual Net Result */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Resultado Financiero Neto del Modelo Actual
              </span>
              <span className="text-xs font-mono text-indigo-300 font-semibold">
                Accuracy: {formatPercent(m.accuracy)} | F1: {m.f1Score.toFixed(3)}
              </span>
            </div>

            <div className="my-3">
              <span
                className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                  net.total >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {net.total >= 0 ? '+' : ''}${formatNumber(net.total)}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800 pt-3">
              <div className="flex justify-between text-emerald-400">
                <span>+ Ganancias por TP ({currentMatrix.tp} aciertos):</span>
                <span className="font-mono font-bold">+${formatNumber(net.breakdown.tp)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>+ Ganancias por TN ({currentMatrix.tn} descartes):</span>
                <span className="font-mono font-bold">+${formatNumber(net.breakdown.tn)}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>- Costes por FP ({currentMatrix.fp} falsas alarmas):</span>
                <span className="font-mono font-bold">-${formatNumber(Math.abs(net.breakdown.fp))}</span>
              </div>
              <div className="flex justify-between text-rose-400 font-semibold">
                <span>- Pérdidas por FN ({currentMatrix.fn} omisiones):</span>
                <span className="font-mono font-bold">-${formatNumber(Math.abs(net.breakdown.fn))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison with Naive Model */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Comparado con "El Modelo Vago" (99% Accuracy)
              </span>
            </div>

            <div className="my-3">
              <span
                className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                  diffNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {diffNet >= 0 ? '+' : ''}${formatNumber(diffNet)}
              </span>
              <span className="text-xs text-slate-400 block mt-1">
                de ventaja económica neta frente al modelo pasivo
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
              El modelo ingenuo (que dice siempre "todo normal") genera un impacto neto de{' '}
              <strong className="text-white">${formatNumber(naiveNet.total)}</strong> porque absorbe el 100% de las pérdidas por omisión (FN).
            </p>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200">
            💡 <strong>Lección Ejecutiva:</strong> El ROI real de un modelo de Machine Learning lo dicta la matriz de costes, no la precisión académica abstracta.
          </div>
        </div>
      </div>
    </div>
  );
};
