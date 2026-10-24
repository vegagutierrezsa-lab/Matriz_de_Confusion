import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/caseStudies';
import { CaseStudy, MatrixCounts } from '../types/confusionMatrix';
import { computeMetrics, computeNetCost, formatNumber, formatPercent } from '../utils/metrics';
import {
  Activity,
  ShieldAlert,
  MailCheck,
  Plane,
  ArrowRight,
  Sliders,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface CaseStudiesProps {
  onLoadMatrixToSandbox: (matrix: MatrixCounts) => void;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onLoadMatrixToSandbox }) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const currentCase = CASE_STUDIES[selectedCaseIndex];

  const getCaseIcon = (category: string) => {
    switch (category) {
      case 'Salud':
        return <Activity className="w-5 h-5 text-rose-400" />;
      case 'Finanzas':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'Ciberseguridad':
        return <MailCheck className="w-5 h-5 text-indigo-400" />;
      case 'Industria Aeroespacial':
        return <Plane className="w-5 h-5 text-cyan-400" />;
      default:
        return <Activity className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CASE_STUDIES.map((cs, idx) => {
          const isSelected = selectedCaseIndex === idx;
          return (
            <button
              key={cs.id}
              onClick={() => setSelectedCaseIndex(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-600/20 ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {cs.category}
                </span>
                {getCaseIcon(cs.category)}
              </div>
              <span className="font-bold text-white text-xs sm:text-sm line-clamp-1">
                {cs.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Case Deep Dive */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Title & Context */}
        <div className="border-b border-slate-800 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60">
              Caso Práctico: {currentCase.category}
            </span>
            <span className="text-xs font-mono font-semibold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-800/50">
              Desequilibrio: {currentCase.imbalanceRatio}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {currentCase.title}
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {currentCase.description}
          </p>
        </div>

        {/* Narrative Analysis Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-xs text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>El Dilema del Negocio / Vida Real</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentCase.backgroundContext}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40 space-y-2">
            <h4 className="font-bold text-xs text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Por qué la Exactitud (Accuracy) es Mortal Aquí</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentCase.whyAccuracyFails}
            </p>
          </div>
        </div>

        {/* Critical Metric Requirement Box */}
        <div className="bg-gradient-to-r from-emerald-950/40 to-slate-950 p-4 rounded-xl border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Métrica Decisiva Requerida:
              </span>
              <span className="font-mono font-extrabold text-sm text-white bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/60 uppercase">
                {currentCase.criticalMetric.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {currentCase.criticalMetricExplanation}
            </p>
          </div>
        </div>

        {/* Interactive Comparison of Models in this Case */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Compara los Modelos en Competencia para este Caso:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCase.models.map((model) => {
              const m = computeMetrics(model.matrix);
              const costImpact = computeNetCost(model.matrix, currentCase.costs);

              return (
                <div
                  key={model.id}
                  className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase block mb-1">
                      {model.tagline}
                    </span>
                    <h4 className="font-bold text-white text-sm">{model.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{model.description}</p>
                  </div>

                  {/* 4 Quadrants Pill Numbers */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                    <div className="bg-emerald-950/40 p-1.5 rounded border border-emerald-800/40 text-emerald-300">
                      TP: <strong>{formatNumber(model.matrix.tp)}</strong>
                    </div>
                    <div className="bg-rose-950/40 p-1.5 rounded border border-rose-800/40 text-rose-300">
                      FN: <strong>{formatNumber(model.matrix.fn)}</strong>
                    </div>
                    <div className="bg-amber-950/40 p-1.5 rounded border border-amber-800/40 text-amber-300">
                      FP: <strong>{formatNumber(model.matrix.fp)}</strong>
                    </div>
                    <div className="bg-slate-800 p-1.5 rounded border border-slate-700 text-slate-300">
                      TN: <strong>{formatNumber(model.matrix.tn)}</strong>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-1.5 text-xs border-t border-slate-800/80 pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Exactitud:</span>
                      <span className="font-mono font-bold text-white">{formatPercent(m.accuracy)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-300 font-bold">F1-Score:</span>
                      <span className="font-mono font-bold text-indigo-300">{m.f1Score.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-violet-400">Recall (Sensibilidad):</span>
                      <span className="font-mono font-bold text-violet-300">{formatPercent(m.recall)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400">Precisión:</span>
                      <span className="font-mono font-bold text-emerald-300">{formatPercent(m.precision)}</span>
                    </div>
                  </div>

                  {/* Financial / Impact Net Result */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Impacto Económico Neto:</span>
                      <span
                        className={`font-mono font-bold ${
                          costImpact.total >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {costImpact.total >= 0 ? '+' : ''}${formatNumber(costImpact.total)}
                      </span>
                    </div>
                  </div>

                  {/* Experiment in Sandbox button */}
                  <button
                    onClick={() => onLoadMatrixToSandbox(model.matrix)}
                    className="w-full py-2 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-indigo-500/40 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Probar en el Laboratorio
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
