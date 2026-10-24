import React, { useState } from 'react';
import { ModelProfile, MatrixCounts } from '../types/confusionMatrix';
import { CASE_STUDIES } from '../data/caseStudies';
import { computeMetrics, formatPercent, formatNumber } from '../utils/metrics';
import {
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ModelComparatorProps {
  onLoadMatrixToSandbox: (matrix: MatrixCounts) => void;
}

export const ModelComparator: React.FC<ModelComparatorProps> = ({ onLoadMatrixToSandbox }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(CASE_STUDIES[0].id);

  const currentCase = CASE_STUDIES.find((c) => c.id === selectedCaseId) || CASE_STUDIES[0];
  const models = currentCase.models;

  return (
    <div className="flex flex-col gap-6">
      {/* Scenario Selector Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <GitCompare className="w-4 h-4" /> Comparación Cara a Cara de Modelos
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              {currentCase.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentCase.description}
            </p>
          </div>

          {/* Quick Scenario Pills */}
          <div className="flex flex-wrap gap-2">
            {CASE_STUDIES.map((cs) => (
              <button
                key={cs.id}
                onClick={() => setSelectedCaseId(cs.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedCaseId === cs.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cs.title}
              </button>
            ))}
          </div>
        </div>

        {/* Why this case study matters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">⚖️ Desbalance de Clases:</span>
            <p className="text-slate-300 leading-relaxed">
              {currentCase.imbalanceRatio}. {currentCase.backgroundContext}
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-indigo-900/40">
            <span className="font-bold text-indigo-300 block mb-1">💡 La Trampa Revelada:</span>
            <p className="text-slate-300 leading-relaxed">
              {currentCase.whyAccuracyFails}
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Model Cards Grid */}
      <div className={`grid grid-cols-1 ${models.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'} gap-5`}>
        {models.map((model) => {
          const m = computeMetrics(model.matrix);
          const isNaive = model.strategy === 'naive-majority';
          const isBalanced = model.strategy === 'balanced';

          return (
            <div
              key={model.id}
              className={`bg-slate-900 rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-xl relative overflow-hidden ${
                isNaive
                  ? 'border-rose-700/60 hover:border-rose-500'
                  : isBalanced
                  ? 'border-emerald-600/60 ring-1 ring-emerald-500/30 hover:border-emerald-400'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    isNaive
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : isBalanced
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isNaive ? 'Trampa del Accuracy' : isBalanced ? '⭐ Recomendado' : 'Especializado'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Total: {formatNumber(m.total)}
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  {model.name}
                </h3>
                <p className="text-xs text-indigo-300 font-medium mt-1">
                  {model.tagline}
                </p>
              </div>

              {/* Mini Confusion Matrix Visual */}
              <div className="my-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block mb-2 uppercase text-center">
                  Matriz del Modelo
                </span>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
                    <span className="text-[10px] text-emerald-400 block font-medium">TP (Acierto +)</span>
                    <span className="font-mono font-bold text-white text-base">{formatNumber(model.matrix.tp)}</span>
                  </div>
                  <div className="bg-rose-950/40 p-2 rounded-lg border border-rose-800/40">
                    <span className="text-[10px] text-rose-400 block font-medium">FN (Omisión -)</span>
                    <span className="font-mono font-bold text-rose-300 text-base">{formatNumber(model.matrix.fn)}</span>
                  </div>
                  <div className="bg-amber-950/40 p-2 rounded-lg border border-amber-800/40">
                    <span className="text-[10px] text-amber-400 block font-medium">FP (Alarma +)</span>
                    <span className="font-mono font-bold text-amber-300 text-base">{formatNumber(model.matrix.fp)}</span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-medium">TN (Acierto -)</span>
                    <span className="font-mono font-bold text-slate-200 text-base">{formatNumber(model.matrix.tn)}</span>
                  </div>
                </div>
              </div>

              {/* Comparative Metrics Bars */}
              <div className="space-y-2.5 text-xs">
                {/* Accuracy */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 font-medium">Exactitud (Accuracy):</span>
                    <span className="font-mono font-bold text-white">{formatPercent(m.accuracy)}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${m.accuracy * 100}%` }}
                      className={`h-full ${isNaive ? 'bg-amber-400' : 'bg-indigo-500'}`}
                    />
                  </div>
                </div>

                {/* F1-Score */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-indigo-300 font-medium font-bold">F1-Score:</span>
                    <span className="font-mono font-bold text-indigo-300">{m.f1Score.toFixed(3)}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${m.f1Score * 100}%` }}
                      className={`h-full ${m.f1Score > 0.4 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    />
                  </div>
                </div>

                {/* Recall */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-violet-400 font-medium">Sensibilidad (Recall):</span>
                    <span className="font-mono font-bold text-violet-300">{formatPercent(m.recall)}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${m.recall * 100}%` }}
                      className={`h-full ${m.recall > 0.6 ? 'bg-violet-500' : 'bg-rose-600'}`}
                    />
                  </div>
                </div>

                {/* Precision */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-emerald-400 font-medium">Precisión:</span>
                    <span className="font-mono font-bold text-emerald-300">{formatPercent(m.precision)}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${m.precision * 100}%` }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pedagogical Explanation Breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <strong className="block text-indigo-300 text-[11px] mb-1">
                    🔎 ¿Por qué parece bueno o malo?
                  </strong>
                  <p className="leading-relaxed">{model.whyLooksGoodOrBad}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 text-[11px]">
                  <strong className="text-slate-200">Impacto Real:</strong> {model.clinicalOrBusinessImpact}
                </div>
              </div>

              {/* Load to sandbox button */}
              <button
                onClick={() => onLoadMatrixToSandbox(model.matrix)}
                className="mt-4 w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-indigo-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                Cargar en Laboratorio para experimentar
              </button>
            </div>
          );
        })}
      </div>

      {/* Synthesis Insight Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 to-slate-900 border border-indigo-700/40 rounded-2xl p-5">
        <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Conclusión Clave: La Verdad Detrás de las Métricas
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          En problemas con desequilibrio de clases, <strong>nunca tomes una decisión basada únicamente en el Accuracy</strong>. Un modelo que predice siempre la clase mayoritaria puede alcanzar un 99% de exactitud y ser absolutamente peligroso. Observa siempre el <strong>F1-Score</strong> para un balance honesto, el <strong>Recall</strong> si no puedes permitirte Falsos Negativos (salud, seguridad), y la <strong>Precisión</strong> si una falsa alarma tiene un costo prohibitivo (spam, acusaciones).
        </p>
      </div>
    </div>
  );
};
