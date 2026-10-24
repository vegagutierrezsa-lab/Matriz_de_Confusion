import React from 'react';
import { MatrixCounts } from '../types/confusionMatrix';
import { analyzeParadoxAndTradeoffs } from '../utils/metrics';
import { AlertTriangle, AlertOctagon, CheckCircle2, Info, Lightbulb } from 'lucide-react';

interface ParadoxAlertBannerProps {
  matrix: MatrixCounts;
}

export const ParadoxAlertBanner: React.FC<ParadoxAlertBannerProps> = ({ matrix }) => {
  const analysis = analyzeParadoxAndTradeoffs(matrix);

  const getTheme = () => {
    switch (analysis.severity) {
      case 'danger':
        return {
          bg: 'bg-rose-950/40',
          border: 'border-rose-500/60',
          icon: AlertOctagon,
          iconColor: 'text-rose-400',
          titleColor: 'text-rose-200',
          textColor: 'text-rose-100/90',
          adviceBg: 'bg-rose-900/30 border-rose-800/40 text-rose-200',
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/60',
          icon: AlertTriangle,
          iconColor: 'text-amber-400',
          titleColor: 'text-amber-200',
          textColor: 'text-amber-100/90',
          adviceBg: 'bg-amber-900/30 border-amber-800/40 text-amber-200',
        };
      case 'success':
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/60',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
          titleColor: 'text-emerald-200',
          textColor: 'text-emerald-100/90',
          adviceBg: 'bg-emerald-900/30 border-emerald-800/40 text-emerald-200',
        };
      default:
        return {
          bg: 'bg-slate-900/80',
          border: 'border-slate-800',
          icon: Info,
          iconColor: 'text-indigo-400',
          titleColor: 'text-indigo-200',
          textColor: 'text-slate-300',
          adviceBg: 'bg-slate-800/60 border-slate-700/50 text-slate-300',
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border ${theme.bg} ${theme.border} shadow-lg transition-all animate-fadeIn`}
    >
      <div className="flex items-start gap-3.5">
        <div className={`p-2 rounded-xl bg-slate-900/60 shrink-0 border border-white/5`}>
          <Icon className={`w-5 h-5 ${theme.iconColor}`} />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className={`font-bold text-sm sm:text-base ${theme.titleColor}`}>
              {analysis.title}
            </h3>
            {analysis.hasParadox && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Paradoja Activa
              </span>
            )}
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme.textColor}`}>
            {analysis.summary}
          </p>

          <div className={`rounded-xl p-3 border text-xs flex items-start gap-2.5 ${theme.adviceBg}`}>
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
            <div>
              <strong className="font-semibold block mb-0.5">Diagnóstico y Recomendación:</strong>
              <span>{analysis.recommendation}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
