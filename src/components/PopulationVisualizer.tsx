import React, { useState, useMemo } from 'react';
import { MatrixCounts } from '../types/confusionMatrix';
import { formatNumber, formatPercent } from '../utils/metrics';
import { Users, Filter, Eye, AlertOctagon, CheckCircle2, BellOff, ShieldCheck } from 'lucide-react';

interface PopulationVisualizerProps {
  matrix: MatrixCounts;
}

type FilterType = 'all' | 'tp' | 'fp' | 'fn' | 'tn';
type ContextType = 'medical' | 'fraud' | 'spam';

export const PopulationVisualizer: React.FC<PopulationVisualizerProps> = ({ matrix }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [contextType, setContextType] = useState<ContextType>('medical');
  const [hoveredDot, setHoveredDot] = useState<{
    id: number;
    type: 'tp' | 'fp' | 'fn' | 'tn';
    actual: string;
    predicted: string;
    impact: string;
  } | null>(null);

  const { tp, fp, fn, tn } = matrix;
  const total = tp + fp + fn + tn;

  // Represent 100 normalized dots for the waffle grid
  const dots = useMemo(() => {
    if (total === 0) return [];
    const GRID_SIZE = 100;

    // Proportions
    let tpCount = Math.round((tp / total) * GRID_SIZE);
    let fnCount = Math.round((fn / total) * GRID_SIZE);
    let fpCount = Math.round((fp / total) * GRID_SIZE);
    let tnCount = GRID_SIZE - (tpCount + fnCount + fpCount);

    // If rounding made tnCount negative, adjust
    if (tnCount < 0) {
      tnCount = 0;
      tpCount = Math.min(GRID_SIZE, tpCount);
    }

    const items: Array<{ id: number; type: 'tp' | 'fp' | 'fn' | 'tn' }> = [];
    let idCounter = 1;

    for (let i = 0; i < tpCount; i++) items.push({ id: idCounter++, type: 'tp' });
    for (let i = 0; i < fnCount; i++) items.push({ id: idCounter++, type: 'fn' });
    for (let i = 0; i < fpCount; i++) items.push({ id: idCounter++, type: 'fp' });
    for (let i = 0; i < tnCount; i++) items.push({ id: idCounter++, type: 'tn' });

    return items;
  }, [tp, fp, fn, tn, total]);

  const getContextText = (type: 'tp' | 'fp' | 'fn' | 'tn') => {
    if (contextType === 'medical') {
      switch (type) {
        case 'tp':
          return {
            actual: 'ENFERMO REAL (+)',
            predicted: 'POSITIVO (+)',
            impact: '¡Salvado! Se detectó la enfermedad y comenzó tratamiento a tiempo.',
          };
        case 'fn':
          return {
            actual: 'ENFERMO REAL (+)',
            predicted: 'NEGATIVO (-)',
            impact: '⚠️ ¡PELIGRO! Se fue a casa creyendo estar sano. Cero tratamiento.',
          };
        case 'fp':
          return {
            actual: 'PERSONA SANA (-)',
            predicted: 'POSITIVO (+)',
            impact: 'Falsa alarma: ansiedad y costo de una prueba diagnóstica adicional.',
          };
        case 'tn':
          return {
            actual: 'PERSONA SANA (-)',
            predicted: 'NEGATIVO (-)',
            impact: 'Descarte tranquilo: confirmación de buena salud sin gastos.',
          };
      }
    } else if (contextType === 'fraud') {
      switch (type) {
        case 'tp':
          return {
            actual: 'FRAUDE REAL (+)',
            predicted: 'POSITIVO (+)',
            impact: '¡Acierto financiero! Robo bloqueado y dinero recuperado.',
          };
        case 'fn':
          return {
            actual: 'FRAUDE REAL (+)',
            predicted: 'NEGATIVO (-)',
            impact: '⚠️ Dinero robado no recuperado. El banco asume la pérdida.',
          };
        case 'fp':
          return {
            actual: 'CLIENTE HONESTO (-)',
            predicted: 'POSITIVO (+)',
            impact: 'Tarjeta bloqueada injustamente. Cliente enfadado en la tienda.',
          };
        case 'tn':
          return {
            actual: 'CLIENTE HONESTO (-)',
            predicted: 'NEGATIVO (-)',
            impact: 'Pago procesado en milisegundos con total fluidez.',
          };
      }
    } else {
      switch (type) {
        case 'tp':
          return {
            actual: 'SPAM / VIRUS (+)',
            predicted: 'POSITIVO (+)',
            impact: 'Bandeja de entrada limpia de publicidad molesta o phishing.',
          };
        case 'fn':
          return {
            actual: 'SPAM / VIRUS (+)',
            predicted: 'NEGATIVO (-)',
            impact: 'Spam llega a la bandeja. El usuario lo borra manualmente.',
          };
        case 'fp':
          return {
            actual: 'CORREO VITAL (-)',
            predicted: 'POSITIVO (+)',
            impact: '⚠️ ¡FATAL! Propuesta de trabajo o contrato millonario enviado a Spam.',
          };
        case 'tn':
          return {
            actual: 'CORREO VITAL (-)',
            predicted: 'NEGATIVO (-)',
            impact: 'Correo importante recibido en la bandeja principal a tiempo.',
          };
      }
    }
  };

  const filteredDots = dots.filter((dot) => {
    if (activeFilter === 'all') return true;
    return dot.type === activeFilter;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Visualizador de Población (Muestra de 100 Representantes)
          </h3>
          <p className="text-xs text-slate-400">
            Cada círculo representa el 1% de la muestra. Pasa el cursor sobre ellos para ver qué ocurrió con cada sujeto.
          </p>
        </div>

        {/* Context Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold px-1.5">Contexto:</span>
          <button
            onClick={() => setContextType('medical')}
            className={`text-xs px-2 py-1 rounded cursor-pointer ${
              contextType === 'medical'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Médico
          </button>
          <button
            onClick={() => setContextType('fraud')}
            className={`text-xs px-2 py-1 rounded cursor-pointer ${
              contextType === 'fraud'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fraude
          </button>
          <button
            onClick={() => setContextType('spam')}
            className={`text-xs px-2 py-1 rounded cursor-pointer ${
              contextType === 'spam'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Email / Spam
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filtrar:
        </span>
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-slate-700 text-white'
              : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Todos ({dots.length})
        </button>
        <button
          onClick={() => setActiveFilter('tp')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
            activeFilter === 'tp'
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/40'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          TP: Acierto (+) ({formatNumber(tp)})
        </button>
        <button
          onClick={() => setActiveFilter('fn')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
            activeFilter === 'fn'
              ? 'bg-rose-600 text-white'
              : 'bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/40'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          FN: Omisión Mortal ({formatNumber(fn)})
        </button>
        <button
          onClick={() => setActiveFilter('fp')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
            activeFilter === 'fp'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-950/40 text-amber-300 border border-amber-800/40 hover:bg-amber-900/40'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          FP: Falsa Alarma ({formatNumber(fp)})
        </button>
        <button
          onClick={() => setActiveFilter('tn')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
            activeFilter === 'tn'
              ? 'bg-slate-600 text-white'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
          TN: Descarte (-) ({formatNumber(tn)})
        </button>
      </div>

      {/* Grid of Dots & Hover Details */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 items-start">
        {/* The 10x10 Waffle Dot Grid */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col items-center">
          <div className="grid grid-cols-10 gap-2 max-w-[420px] w-full">
            {dots.map((dot) => {
              const isDimmed = activeFilter !== 'all' && dot.type !== activeFilter;
              let dotBg = 'bg-slate-700';
              let ringColor = 'ring-slate-500';

              if (dot.type === 'tp') {
                dotBg = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
                ringColor = 'ring-emerald-300';
              } else if (dot.type === 'fn') {
                dotBg = 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse';
                ringColor = 'ring-rose-300';
              } else if (dot.type === 'fp') {
                dotBg = 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]';
                ringColor = 'ring-amber-300';
              } else if (dot.type === 'tn') {
                dotBg = 'bg-slate-700';
                ringColor = 'ring-indigo-400';
              }

              return (
                <div
                  key={dot.id}
                  onMouseEnter={() => {
                    const ctx = getContextText(dot.type);
                    setHoveredDot({
                      id: dot.id,
                      type: dot.type,
                      actual: ctx.actual,
                      predicted: ctx.predicted,
                      impact: ctx.impact,
                    });
                  }}
                  className={`aspect-square rounded-full transition-all duration-200 cursor-pointer ${dotBg} ${
                    isDimmed ? 'opacity-10 scale-75' : 'hover:scale-135 hover:ring-2 ' + ringColor
                  }`}
                />
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between w-full text-[11px] text-slate-500">
            <span>Matriz normalizada (100 puntos = 100%)</span>
            <span>Total real: {formatNumber(total)} unidades</span>
          </div>
        </div>

        {/* Hover / Inspection Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Inspección Individual</span>
            </div>

            {hoveredDot ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Sujeto de Muestra #{hoveredDot.id}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                      hoveredDot.type === 'tp'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : hoveredDot.type === 'fn'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : hoveredDot.type === 'fp'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-700/40 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {hoveredDot.type.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Condición Real:</span>
                    <span className="font-semibold text-white">{hoveredDot.actual}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Predicción IA:</span>
                    <span className="font-semibold text-white">{hoveredDot.predicted}</span>
                  </div>
                </div>

                <div className="mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="block text-[11px] text-indigo-300 font-bold mb-1">
                    Consecuencia Práctica:
                  </strong>
                  {hoveredDot.impact}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-6 text-slate-500 text-xs">
                <p>Pasa el cursor sobre cualquiera de los puntos de la cuadrícula para ver su diagnóstico en detalle.</p>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            Nota cómo en casos desbalanceados, los puntos rojos (FN) o ámbar (FP) pueden estar ocultos entre un mar de puntos azules (TN).
          </div>
        </div>
      </div>
    </div>
  );
};
