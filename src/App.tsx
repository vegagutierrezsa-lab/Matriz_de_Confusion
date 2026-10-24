import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { InteractiveMatrix } from './components/InteractiveMatrix';
import { MetricsDashboard } from './components/MetricsDashboard';
import { ParadoxAlertBanner } from './components/ParadoxAlertBanner';
import { PopulationVisualizer } from './components/PopulationVisualizer';
import { ThresholdDistribution } from './components/ThresholdDistribution';
import { ModelComparator } from './components/ModelComparator';
import { CaseStudies } from './components/CaseStudies';
import { GameChallenge } from './components/GameChallenge';
import { CostMatrixCalculator } from './components/CostMatrixCalculator';
import { EducationalGuide } from './components/EducationalGuide';
import { MatrixCounts } from './types/confusionMatrix';
import { Sparkles, Sliders, ArrowRight, RotateCcw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sandbox');

  // Initial matrix: Realistic clinical screening with class imbalance (100 positives vs 9,900 negatives)
  const [matrix, setMatrix] = useState<MatrixCounts>({
    tp: 85,
    fp: 200,
    fn: 15,
    tn: 9700,
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleLoadMatrixToSandbox = (newMatrix: MatrixCounts) => {
    setMatrix(newMatrix);
    setActiveTab('sandbox');
    showNotification('¡Modelo cargado en el Laboratorio Interactivo con éxito!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl shadow-indigo-500/40 border border-indigo-400 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: LABORATORY / SANDBOX */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Real-time Diagnostic Alert */}
            <ParadoxAlertBanner matrix={matrix} />

            {/* 2x2 Matrix & Metrics Section */}
            <div className="grid grid-cols-1 gap-6">
              <InteractiveMatrix
                matrix={matrix}
                onChange={setMatrix}
                onSelectPreset={(name) => showNotification(`Escenario activado: ${name}`)}
              />

              <MetricsDashboard matrix={matrix} />
            </div>

            {/* Visualizers: Population Dot Matrix + Gaussian Distribution Curves */}
            <div className="grid grid-cols-1 gap-6">
              <PopulationVisualizer matrix={matrix} />

              <ThresholdDistribution
                onApplyMatrix={(newMat) => {
                  setMatrix(newMat);
                  showNotification('Umbral aplicado a la matriz interactiva');
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 2: MODEL COMPARATOR (CARA A CARA) */}
        {activeTab === 'comparator' && (
          <div className="animate-fadeIn">
            <ModelComparator onLoadMatrixToSandbox={handleLoadMatrixToSandbox} />
          </div>
        )}

        {/* TAB 3: REAL-WORLD CASE STUDIES */}
        {activeTab === 'cases' && (
          <div className="animate-fadeIn">
            <CaseStudies onLoadMatrixToSandbox={handleLoadMatrixToSandbox} />
          </div>
        )}

        {/* TAB 4: DATA SCIENTIST GAME CHALLENGE */}
        {activeTab === 'game' && (
          <div className="animate-fadeIn">
            <GameChallenge />
          </div>
        )}

        {/* TAB 5: FINANCIAL COST CALCULATOR */}
        {activeTab === 'costs' && (
          <div className="animate-fadeIn">
            <CostMatrixCalculator currentMatrix={matrix} />
          </div>
        )}

        {/* TAB 6: COMPLETE EDUCATIONAL GUIDE */}
        {activeTab === 'guide' && (
          <div className="animate-fadeIn">
            <EducationalGuide />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">MatrizLab</span>
            <span>•</span>
            <span>Plataforma interactiva para el aprendizaje de Machine Learning y Evaluación de Modelos</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>TP • TN • FP • FN</span>
            <span>|</span>
            <span>Accuracy vs F1-Score</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
