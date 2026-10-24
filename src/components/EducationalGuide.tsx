import React from 'react';
import {
  BookOpen,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  GitBranch,
  ShieldAlert,
  Activity,
  MailCheck,
  Scale,
  Sparkles,
} from 'lucide-react';

export const EducationalGuide: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" /> Manual Pedagógico Completo
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Guía Definitiva de la Matriz de Confusión y Métricas de Clasificación
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Todo lo que necesitas saber para interpretar modelos en Machine Learning sin dejarte engañar por las apariencias.
        </p>
      </div>

      {/* Decision Tree: What metric should I optimize? */}
      <div className="bg-slate-950 rounded-xl p-5 border border-indigo-900/40 space-y-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">
            Árbol de Decisión: ¿Qué Métrica Debes Optimizar para tu Problema?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Path 1: High Recall */}
          <div className="p-4 rounded-xl bg-slate-900 border border-violet-800/50 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-violet-400 font-bold text-sm mb-1">
                <Activity className="w-4 h-4" />
                <span>Sensibilidad / Recall</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                <strong>Regla:</strong> Úsala cuando el costo de una <strong>omisión (Falso Negativo)</strong> sea catastrófico, irreparable o mortal.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 text-slate-400 border border-slate-800 text-[11px]">
              <strong>Ejemplos:</strong> Detección de cáncer, escaneo de armas en aeropuertos, fallas de motores de avión, alertas de terremoto.
            </div>
          </div>

          {/* Path 2: High Precision */}
          <div className="p-4 rounded-xl bg-slate-900 border border-emerald-800/50 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm mb-1">
                <MailCheck className="w-4 h-4" />
                <span>Precisión (Precision)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                <strong>Regla:</strong> Úsala cuando el costo de una <strong>falsa alarma (Falso Positivo)</strong> sea inaceptable para el usuario o el negocio.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 text-slate-400 border border-slate-800 text-[11px]">
              <strong>Ejemplos:</strong> Filtros de correo spam, condenas judiciales automáticas, recomendaciones de YouTube, cirugías irreversibles.
            </div>
          </div>

          {/* Path 3: F1-Score */}
          <div className="p-4 rounded-xl bg-slate-900 border border-indigo-800/50 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-sm mb-1">
                <Scale className="w-4 h-4" />
                <span>F1-Score (Media Armónica)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                <strong>Regla:</strong> Úsala cuando tienes <strong>datos desbalanceados</strong> y requieres un compromiso armónico entre no alarmar falsamente y no omitir casos.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 text-slate-400 border border-slate-800 text-[11px]">
              <strong>Ejemplos:</strong> Detección de fraudes en comercio electrónico, clasificación de documentos legales, procesamiento de lenguaje natural.
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Quadrants Detailed Anatomy */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <span>Anatomía de los 4 Cuadrantes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-700/50 space-y-1.5">
            <span className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Verdadero Positivo (TP / True Positive)
            </span>
            <p className="text-slate-300 leading-relaxed">
              El evento de interés <strong>ocurrió en el mundo real</strong> y el modelo <strong>lo predijo correctamente</strong>.
              Ejemplo: El paciente tenía la enfermedad y el test dio positivo. Se inicia el tratamiento a tiempo.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-700/50 space-y-1.5">
            <span className="font-bold text-rose-300 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Falso Negativo (FN / Error Tipo II)
            </span>
            <p className="text-slate-300 leading-relaxed">
              El evento <strong>ocurrió en la realidad</strong>, pero el modelo <strong>dijo erróneamente que no</strong>.
              Ejemplo: El paciente tiene cáncer pero el algoritmo dice "usted está sano". El paciente vuelve a casa sin atención y empeora.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-700/50 space-y-1.5">
            <span className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Falso Positivo (FP / Error Tipo I)
            </span>
            <p className="text-slate-300 leading-relaxed">
              El evento <strong>NO ocurrió</strong>, pero el modelo <strong>disparó una alarma falsa</strong>.
              Ejemplo: Una persona sana recibe un resultado positivo preliminar y sufre angustia hasta que una prueba confirmatoria la descarta.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 space-y-1.5">
            <span className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Verdadero Negativo (TN / True Negative)
            </span>
            <p className="text-slate-300 leading-relaxed">
              El evento <strong>no ocurrió</strong> y el modelo <strong>lo descartó con acierto</strong>.
              Ejemplo: Una transacción normal de supermercado es aprobada al instante sin bloquear al titular.
            </p>
          </div>
        </div>
      </div>

      {/* Formula Reference Card */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base">Fórmulas Matemáticas de Referencia Rápida</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-indigo-400 font-bold block mb-1">Exactitud (Accuracy)</span>
            <code className="text-white block font-mono bg-slate-950 p-1.5 rounded mb-1 text-[11px]">
              (TP + TN) / Total
            </code>
            <p className="text-slate-400 text-[11px]">
              Válida solo si las clases están balanceadas (50:50).
            </p>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">Precisión</span>
            <code className="text-white block font-mono bg-slate-950 p-1.5 rounded mb-1 text-[11px]">
              TP / (TP + FP)
            </code>
            <p className="text-slate-400 text-[11px]">
              Calidad de las predicciones positivas hechas por el modelo.
            </p>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-violet-400 font-bold block mb-1">Recall (Sensibilidad)</span>
            <code className="text-white block font-mono bg-slate-950 p-1.5 rounded mb-1 text-[11px]">
              TP / (TP + FN)
            </code>
            <p className="text-slate-400 text-[11px]">
              Capacidad de encontrar todos los casos positivos reales.
            </p>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-indigo-300 font-bold block mb-1">F1-Score</span>
            <code className="text-white block font-mono bg-slate-950 p-1.5 rounded mb-1 text-[11px]">
              2 × (P × R) / (P + R)
            </code>
            <p className="text-slate-400 text-[11px]">
              Media armónica: penaliza fuertemente el desbalance.
            </p>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-blue-400 font-bold block mb-1">Especificidad (TNR)</span>
            <code className="text-white block font-mono bg-slate-950 p-1.5 rounded mb-1 text-[11px]">
              TN / (TN + FP)
            </code>
            <p className="text-slate-400 text-[11px]">
              Capacidad de descartar los casos negativos reales.
            </p>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">Exactitud Balanceada</span>
            <code className="text-white block font-mono bg-slate-950 p-1.5 rounded mb-1 text-[11px]">
              (Recall + Especificidad) / 2
            </code>
            <p className="text-slate-400 text-[11px]">
              Alternativa robusta a la exactitud simple en desbalances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
