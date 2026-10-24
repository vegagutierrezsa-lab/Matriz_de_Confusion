import React from 'react';
import { MatrixCounts } from '../types/confusionMatrix';
import { formatNumber, formatPercent } from '../utils/metrics';
import { Minus, Plus, Info, Sparkles, CheckCircle2, AlertOctagon, BellOff, ShieldCheck } from 'lucide-react';

interface InteractiveMatrixProps {
  matrix: MatrixCounts;
  onChange: (newMatrix: MatrixCounts) => void;
  onSelectPreset?: (presetName: string) => void;
}

export const InteractiveMatrix: React.FC<InteractiveMatrixProps> = ({
  matrix,
  onChange,
  onSelectPreset,
}) => {
  const { tp, fp, fn, tn } = matrix;
  const total = tp + fp + fn + tn;
  const actualPos = tp + fn;
  const actualNeg = tn + fp;
  const predPos = tp + fp;
  const predNeg = tn + fn;

  const updateCell = (cell: keyof MatrixCounts, value: number) => {
    const safeVal = Math.max(0, Math.round(value));
    onChange({
      ...matrix,
      [cell]: safeVal,
    });
  };

  const adjustCell = (cell: keyof MatrixCounts, delta: number) => {
    const current = matrix[cell];
    updateCell(cell, current + delta);
  };

  const presets = [
    {
      label: '😴 Modelo Vago (99% Exactitud Falsa)',
      matrix: { tp: 0, fp: 0, fn: 100, tn: 9900 },
      description: 'Dice siempre que todo está bien. Cero F1, 99% Accuracy engañosa.',
    },
    {
      label: '⚖️ Caso Clínico Balanceado',
      matrix: { tp: 85, fp: 200, fn: 15, tn: 9700 },
      description: 'Menor exactitud (97.8%), pero salva al 85% de los enfermos reales.',
    },
    {
      label: '🚨 Alarma Paranoica',
      matrix: { tp: 98, fp: 1800, fn: 2, tn: 8100 },
      description: 'Casi ningún Falso Negativo, pero Precisión bajísima (5%).',
    },
    {
      label: '📊 Dataset Equilibrado (50/50)',
      matrix: { tp: 420, fp: 80, fn: 60, tn: 440 },
      description: 'Clases simétricas donde el Accuracy sí correlaciona bien con el F1.',
    },
    {
      label: '✨ Clasificador Ideal',
      matrix: { tp: 500, fp: 0, fn: 0, tn: 500 },
      description: 'Cero errores de ningún tipo (Recall 100%, Precisión 100%).',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Matriz de Confusión 2x2
            <span className="text-xs font-normal text-slate-400">
              (Total muestra: <strong className="text-indigo-300 font-mono">{formatNumber(total)}</strong>)
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Ajusta los 4 cuadrantes con los controles o prueba los escenarios predefinidos:
          </p>
        </div>

        {/* Quick presets pill list */}
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                onChange(preset.matrix);
                if (onSelectPreset) onSelectPreset(preset.label);
              }}
              className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-800 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-200 border border-slate-700/60 hover:border-indigo-500/40 transition-all cursor-pointer"
              title={preset.description}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* The 2x2 Visual Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          {/* Header Row: Predicciones */}
          <div className="grid grid-cols-[130px_1fr_1fr_120px] gap-3 text-center mb-2">
            <div className="text-xs font-semibold text-slate-500 flex items-center justify-center">
              <span>REALIDAD \ PRED.</span>
            </div>
            <div className="bg-slate-800/80 rounded-lg py-1.5 px-3 border border-slate-700/50">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                Predicción: Positivo (+)
              </span>
              <span className="text-[11px] text-slate-400">
                (El modelo dijo "SÍ / Caso")
              </span>
            </div>
            <div className="bg-slate-800/80 rounded-lg py-1.5 px-3 border border-slate-700/50">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                Predicción: Negativo (-)
              </span>
              <span className="text-[11px] text-slate-400">
                (El modelo dijo "NO / Normal")
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-center">
              <span>Total Real</span>
            </div>
          </div>

          {/* Row 1: Realmente Positivo */}
          <div className="grid grid-cols-[130px_1fr_1fr_120px] gap-3 mb-3 items-stretch">
            {/* Row Label */}
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 flex flex-col justify-center text-left">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Real Positivo (+)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                Tiene la enfermedad, es fraude, o es spam
              </p>
            </div>

            {/* Cell: TP */}
            <div className="bg-emerald-950/40 border-2 border-emerald-500/50 hover:border-emerald-400 rounded-xl p-3.5 transition-all shadow-sm shadow-emerald-950/50 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Verdadero Positivo (TP)</span>
                  </div>
                  <span className="text-[11px] text-emerald-400/80 font-medium">Acierto directo</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-700/50">
                  {total > 0 ? formatPercent(tp / total) : '0%'}
                </span>
              </div>

              {/* Number and Stepper */}
              <div className="my-2 flex items-center justify-between">
                <input
                  type="number"
                  min="0"
                  value={tp}
                  onChange={(e) => updateCell('tp', Number(e.target.value))}
                  className="font-mono text-2xl font-black text-white bg-slate-900/80 border border-emerald-700/60 rounded-lg px-2.5 py-1 w-28 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustCell('tp', -10)}
                    className="p-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 cursor-pointer"
                    title="-10"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustCell('tp', 10)}
                    className="p-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 cursor-pointer"
                    title="+10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-emerald-200/70 border-t border-emerald-800/40 pt-1.5">
                Era positivo y el modelo acertó. ¡Salvado o detectado!
              </div>
            </div>

            {/* Cell: FN */}
            <div className="bg-rose-950/40 border-2 border-rose-500/50 hover:border-rose-400 rounded-xl p-3.5 transition-all shadow-sm shadow-rose-950/50 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs uppercase tracking-wide">
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                    <span>Falso Negativo (FN)</span>
                  </div>
                  <span className="text-[11px] text-rose-400 font-semibold">Error Tipo II (Omisión)</span>
                </div>
                <span className="text-xs font-mono font-bold text-rose-300 bg-rose-900/60 px-1.5 py-0.5 rounded border border-rose-700/50">
                  {total > 0 ? formatPercent(fn / total) : '0%'}
                </span>
              </div>

              {/* Number and Stepper */}
              <div className="my-2 flex items-center justify-between">
                <input
                  type="number"
                  min="0"
                  value={fn}
                  onChange={(e) => updateCell('fn', Number(e.target.value))}
                  className="font-mono text-2xl font-black text-rose-200 bg-slate-900/80 border border-rose-700/60 rounded-lg px-2.5 py-1 w-28 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustCell('fn', -10)}
                    className="p-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-800 text-rose-200 border border-rose-700/50 cursor-pointer"
                    title="-10"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustCell('fn', 10)}
                    className="p-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-800 text-rose-200 border border-rose-700/50 cursor-pointer"
                    title="+10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-rose-300/80 border-t border-rose-800/40 pt-1.5 font-medium">
                ⚠️ ¡Peligro! Era positivo pero el modelo dijo "Negativo".
              </div>
            </div>

            {/* Total Row 1 */}
            <div className="bg-slate-800/50 rounded-xl p-3 flex flex-col justify-center items-center text-center border border-slate-700/40">
              <span className="text-xs text-slate-400 font-medium">Positivos Reales</span>
              <span className="text-lg font-black font-mono text-emerald-300">
                {formatNumber(actualPos)}
              </span>
              <span className="text-[10px] text-slate-400">
                ({total > 0 ? formatPercent(actualPos / total) : '0%'} del total)
              </span>
            </div>
          </div>

          {/* Row 2: Realmente Negativo */}
          <div className="grid grid-cols-[130px_1fr_1fr_120px] gap-3 items-stretch">
            {/* Row Label */}
            <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-3 flex flex-col justify-center text-left">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Real Negativo (-)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                Persona sana, transacción legítima, correo normal
              </p>
            </div>

            {/* Cell: FP */}
            <div className="bg-amber-950/30 border-2 border-amber-500/50 hover:border-amber-400 rounded-xl p-3.5 transition-all shadow-sm shadow-amber-950/50 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wide">
                    <BellOff className="w-4 h-4 text-amber-400" />
                    <span>Falso Positivo (FP)</span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-semibold">Error Tipo I (Falsa Alarma)</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded border border-amber-700/50">
                  {total > 0 ? formatPercent(fp / total) : '0%'}
                </span>
              </div>

              {/* Number and Stepper */}
              <div className="my-2 flex items-center justify-between">
                <input
                  type="number"
                  min="0"
                  value={fp}
                  onChange={(e) => updateCell('fp', Number(e.target.value))}
                  className="font-mono text-2xl font-black text-amber-200 bg-slate-900/80 border border-amber-700/60 rounded-lg px-2.5 py-1 w-28 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustCell('fp', -10)}
                    className="p-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800 text-amber-200 border border-amber-700/50 cursor-pointer"
                    title="-10"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustCell('fp', 10)}
                    className="p-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800 text-amber-200 border border-amber-700/50 cursor-pointer"
                    title="+10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-amber-300/80 border-t border-amber-800/40 pt-1.5 font-medium">
                🔔 Falsa alarma: era normal pero el modelo dijo "Positivo".
              </div>
            </div>

            {/* Cell: TN */}
            <div className="bg-slate-800/60 border-2 border-slate-600 hover:border-slate-400 rounded-xl p-3.5 transition-all shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs uppercase tracking-wide">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Verdadero Negativo (TN)</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Descarte correcto</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 bg-slate-700/60 px-1.5 py-0.5 rounded border border-slate-600">
                  {total > 0 ? formatPercent(tn / total) : '0%'}
                </span>
              </div>

              {/* Number and Stepper */}
              <div className="my-2 flex items-center justify-between">
                <input
                  type="number"
                  min="0"
                  value={tn}
                  onChange={(e) => updateCell('tn', Number(e.target.value))}
                  className="font-mono text-2xl font-black text-slate-200 bg-slate-900/80 border border-slate-600 rounded-lg px-2.5 py-1 w-28 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustCell('tn', -10)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 cursor-pointer"
                    title="-10"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustCell('tn', 10)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 cursor-pointer"
                    title="+10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-700/50 pt-1.5">
                Era negativo y el modelo lo descartó correctamente.
              </div>
            </div>

            {/* Total Row 2 */}
            <div className="bg-slate-800/50 rounded-xl p-3 flex flex-col justify-center items-center text-center border border-slate-700/40">
              <span className="text-xs text-slate-400 font-medium">Negativos Reales</span>
              <span className="text-lg font-black font-mono text-blue-300">
                {formatNumber(actualNeg)}
              </span>
              <span className="text-[10px] text-slate-400">
                ({total > 0 ? formatPercent(actualNeg / total) : '0%'} del total)
              </span>
            </div>
          </div>

          {/* Bottom Summary Row: Totales por Predicción */}
          <div className="grid grid-cols-[130px_1fr_1fr_120px] gap-3 mt-3 pt-2 border-t border-slate-800/80 text-center">
            <div className="text-xs text-slate-500 font-medium flex items-center justify-center">
              <span>Total Predicho</span>
            </div>
            <div className="bg-slate-800/40 rounded-lg py-2 border border-slate-700/40">
              <span className="text-xs text-slate-400">Predichos Positivos: </span>
              <span className="font-mono font-bold text-white ml-1">{formatNumber(predPos)}</span>
            </div>
            <div className="bg-slate-800/40 rounded-lg py-2 border border-slate-700/40">
              <span className="text-xs text-slate-400">Predichos Negativos: </span>
              <span className="font-mono font-bold text-white ml-1">{formatNumber(predNeg)}</span>
            </div>
            <div className="bg-indigo-950/40 rounded-lg py-2 border border-indigo-700/50">
              <span className="text-xs text-indigo-300 block font-semibold">Total Muestra</span>
              <span className="font-mono font-black text-indigo-200">{formatNumber(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
