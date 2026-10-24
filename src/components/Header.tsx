import React from 'react';
import {
  Sliders,
  GitCompare,
  BookOpen,
  Trophy,
  DollarSign,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export type ActiveTab = 'sandbox' | 'comparator' | 'cases' | 'game' | 'costs' | 'guide';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'sandbox' as ActiveTab,
      label: 'Laboratorio Interactivo',
      shortLabel: 'Laboratorio',
      icon: Sliders,
      badge: 'En Vivo',
    },
    {
      id: 'comparator' as ActiveTab,
      label: 'Comparador de Modelos',
      shortLabel: 'Comparador',
      icon: GitCompare,
      badge: 'Cara a Cara',
    },
    {
      id: 'cases' as ActiveTab,
      label: 'Casos Reales & Desbalance',
      shortLabel: 'Casos Reales',
      icon: BookOpen,
      badge: '4 Casos',
    },
    {
      id: 'game' as ActiveTab,
      label: 'Desafío del Científico',
      shortLabel: 'Reto Minijuego',
      icon: Trophy,
      badge: 'Misiones',
    },
    {
      id: 'costs' as ActiveTab,
      label: 'Impacto de Costos ($)',
      shortLabel: 'Costos $',
      icon: DollarSign,
    },
    {
      id: 'guide' as ActiveTab,
      label: 'Guía y Fórmulas',
      shortLabel: 'Fórmulas',
      icon: HelpCircle,
    },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl tracking-tighter">
              M<span className="text-emerald-300">L</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                  MatrizLab
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-medium">
                    Explorador de Modelos
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Domina la Matriz de Confusión, la Paradoja de la Exactitud y el F1-Score
              </p>
            </div>
          </div>

          {/* Quick Concept Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300">Regla de oro:</strong> Un 99% de Accuracy en datos desbalanceados puede ser completamente inútil.
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/80 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
