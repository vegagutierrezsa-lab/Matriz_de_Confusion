import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { computeMetrics, formatPercent, formatNumber } from '../utils/metrics';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export const GameChallenge: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answersHistory, setAnswersHistory] = useState<Record<string, boolean>>({});

  const question = QUIZ_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUIZ_QUESTIONS.length - 1;
  const isCorrect = selectedModelId === question.correctModelId;

  const handleSelectModel = (modelId: string) => {
    if (isAnswered) return;
    setSelectedModelId(modelId);
    setIsAnswered(true);

    const correct = modelId === question.correctModelId;
    if (correct) {
      setScore((prev) => prev + 100);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
    setAnswersHistory((prev) => ({
      ...prev,
      [question.id]: correct,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedModelId(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedModelId(null);
    setIsAnswered(false);
    setScore(0);
    setAnswersHistory({});
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Game Header & Scoreboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              El Reto del Científico de Datos
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                Misión {currentQuestionIndex + 1} de {QUIZ_QUESTIONS.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Evalúa los modelos candidatos y esquiva las trampas de la Exactitud (Accuracy Trap).
            </p>
          </div>
        </div>

        {/* Score & Progress */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Puntuación:</span>
            <span className="font-mono text-2xl font-black text-amber-300">
              {score} <span className="text-xs text-slate-400">pts</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const answered = answersHistory[q.id];
              return (
                <div
                  key={q.id}
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border transition-all ${
                    idx === currentQuestionIndex
                      ? 'border-indigo-400 bg-indigo-600 text-white shadow-md'
                      : answered === true
                      ? 'border-emerald-500 bg-emerald-950 text-emerald-300'
                      : answered === false
                      ? 'border-rose-500 bg-rose-950 text-rose-300'
                      : 'border-slate-800 bg-slate-950 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              {question.title}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                question.difficulty === 'Fácil'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : question.difficulty === 'Intermedio'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              Nivel: {question.difficulty}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {question.scenario}
          </h3>

          <div className="mt-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>Objetivo Crítico:</strong> {question.targetGoal}
            </span>
          </div>
        </div>

        {/* Model Candidates to Choose From */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Selecciona el modelo que pondrías en producción:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {question.models.map((model) => {
              const m = computeMetrics(model.matrix);
              const isSelected = selectedModelId === model.id;
              const isModelCorrect = model.id === question.correctModelId;

              let cardStyle = 'bg-slate-950 border-slate-800 hover:border-slate-600';
              if (isAnswered) {
                if (isModelCorrect) {
                  cardStyle = 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/40';
                } else if (isSelected && !isModelCorrect) {
                  cardStyle = 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/40';
                } else {
                  cardStyle = 'bg-slate-950/40 border-slate-900 opacity-60';
                }
              }

              return (
                <div
                  key={model.id}
                  onClick={() => handleSelectModel(model.id)}
                  className={`rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between gap-3 ${cardStyle}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-bold text-white text-sm">{model.name}</h4>
                      {isAnswered && (
                        <span>
                          {isModelCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-rose-400" />
                          ) : null}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{model.description}</p>
                  </div>

                  {/* Matrix snapshot */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-center">
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800 text-emerald-400">
                      TP: {formatNumber(model.matrix.tp)}
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800 text-rose-400">
                      FN: {formatNumber(model.matrix.fn)}
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800 text-amber-400">
                      FP: {formatNumber(model.matrix.fp)}
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800 text-slate-300">
                      TN: {formatNumber(model.matrix.tn)}
                    </div>
                  </div>

                  {/* Metrics snapshot */}
                  <div className="space-y-1 text-xs border-t border-slate-800/80 pt-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Exactitud:</span>
                      <span className="text-white font-bold">{formatPercent(m.accuracy)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-300 font-bold">F1-Score:</span>
                      <span className="text-indigo-300 font-bold">{m.f1Score.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-violet-400">Recall:</span>
                      <span className="text-violet-300">{formatPercent(m.recall)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400">Precisión:</span>
                      <span className="text-emerald-300">{formatPercent(m.precision)}</span>
                    </div>
                  </div>

                  {!isAnswered && (
                    <button className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-white text-xs font-bold transition-all">
                      Elegir este modelo
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Answer Feedback Card */}
        {isAnswered && (
          <div
            className={`rounded-xl p-5 border animate-fadeIn space-y-3 ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100'
                : 'bg-rose-950/40 border-rose-500/60 text-rose-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <h4 className="text-base font-bold text-emerald-300">
                    ¡Brillante decisión de Ingeniería de ML! (+100 pts)
                  </h4>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                  <h4 className="text-base font-bold text-rose-300">
                    ¡Caíste en la trampa del Accuracy!
                  </h4>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {question.insight}
            </p>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-amber-300 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Atención:</strong> {question.trapWarning}
              </span>
            </div>

            {/* Next / Finish Actions */}
            <div className="pt-2 flex justify-end">
              {!isLastQuestion ? (
                <button
                  onClick={handleNextQuestion}
                  className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
                >
                  Siguiente Misión <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleRestart}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> Reiniciar Desafío
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
