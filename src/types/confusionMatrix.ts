export interface MatrixCounts {
  tp: number; // Verdadero Positivo
  fp: number; // Falso Positivo (Error Tipo I)
  fn: number; // Falso Negativo (Error Tipo II)
  tn: number; // Verdadero Negativo
}

export interface CalculatedMetrics {
  total: number;
  actualPositives: number; // P = TP + FN
  actualNegatives: number; // N = TN + FP
  predictedPositives: number; // PP = TP + FP
  predictedNegatives: number; // PN = TN + FN
  prevalence: number; // actualPositives / total
  accuracy: number; // (TP + TN) / total
  precision: number; // TP / (TP + FP)
  recall: number; // TP / (TP + FN) (Sensibilidad)
  specificity: number; // TN / (TN + FP) (Especificidad)
  f1Score: number; // 2 * (P * R) / (P + R)
  f2Score: number; // 5 * (P * R) / (4*P + R) - pondera más el Recall
  f05Score: number; // 1.25 * (P * R) / (0.25*P + R) - pondera más la Precisión
  balancedAccuracy: number; // (Recall + Specificity) / 2
  missRate: number; // FN / (TP + FN) = 1 - Recall
  fallOut: number; // FP / (TN + FP) = 1 - Specificity
}

export interface CostConfiguration {
  tpValue: number; // Beneficio por acierto positivo
  tnValue: number; // Beneficio por acierto negativo
  fpCost: number; // Coste/Pérdida por falsa alarma
  fnCost: number; // Coste/Pérdida por omisión
  currencyUnit: string; // Ej. "USD", "EUR", "Puntos de Riesgo"
}

export interface ModelProfile {
  id: string;
  name: string;
  tagline: string;
  strategy: 'naive-majority' | 'balanced' | 'high-recall' | 'high-precision' | 'random' | 'custom';
  matrix: MatrixCounts;
  description: string;
  whyLooksGoodOrBad: string;
  clinicalOrBusinessImpact: string;
  colorScheme: 'slate' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'cyan';
}

export interface CaseStudy {
  id: string;
  title: string;
  category: 'Salud' | 'Finanzas' | 'Ciberseguridad' | 'Industria Aeroespacial' | 'Filtro de Contenido';
  icon: string;
  description: string;
  backgroundContext: string;
  imbalanceRatio: string;
  whyAccuracyFails: string;
  costs: CostConfiguration;
  criticalMetric: 'recall' | 'precision' | 'f1' | 'specificity';
  criticalMetricExplanation: string;
  models: ModelProfile[];
}

export interface QuizQuestion {
  id: string;
  title: string;
  scenario: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  targetGoal: string;
  models: {
    id: string;
    name: string;
    matrix: MatrixCounts;
    description: string;
  }[];
  correctModelId: string;
  insight: string;
  trapWarning: string;
}
