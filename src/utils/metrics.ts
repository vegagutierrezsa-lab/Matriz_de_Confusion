import { MatrixCounts, CalculatedMetrics, CostConfiguration } from '../types/confusionMatrix';

export function computeMetrics(matrix: MatrixCounts): CalculatedMetrics {
  const { tp, fp, fn, tn } = matrix;
  const safeTp = Math.max(0, tp);
  const safeFp = Math.max(0, fp);
  const safeFn = Math.max(0, fn);
  const safeTn = Math.max(0, tn);

  const total = safeTp + safeFp + safeFn + safeTn;
  const actualPositives = safeTp + safeFn;
  const actualNegatives = safeTn + safeFp;
  const predictedPositives = safeTp + safeFp;
  const predictedNegatives = safeTn + safeFn;

  const prevalence = total > 0 ? actualPositives / total : 0;
  const accuracy = total > 0 ? (safeTp + safeTn) / total : 0;
  
  const precision = predictedPositives > 0 ? safeTp / predictedPositives : 0;
  const recall = actualPositives > 0 ? safeTp / actualPositives : 0;
  const specificity = actualNegatives > 0 ? safeTn / actualNegatives : 0;

  // F1-Score: Harmonic mean of Precision and Recall
  const f1Score =
    precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  // F2-Score: Recall weighs 2x as much as Precision
  const f2Score =
    4 * precision + recall > 0 ? (5 * precision * recall) / (4 * precision + recall) : 0;

  // F0.5-Score: Precision weighs 2x as much as Recall
  const f05Score =
    0.25 * precision + recall > 0
      ? (1.25 * precision * recall) / (0.25 * precision + recall)
      : 0;

  const balancedAccuracy = (recall + specificity) / 2;
  const missRate = actualPositives > 0 ? safeFn / actualPositives : 0;
  const fallOut = actualNegatives > 0 ? safeFp / actualNegatives : 0;

  return {
    total,
    actualPositives,
    actualNegatives,
    predictedPositives,
    predictedNegatives,
    prevalence,
    accuracy,
    precision,
    recall,
    specificity,
    f1Score,
    f2Score,
    f05Score,
    balancedAccuracy,
    missRate,
    fallOut,
  };
}

export function computeNetCost(
  matrix: MatrixCounts,
  cost: CostConfiguration
): {
  total: number;
  breakdown: { tp: number; tn: number; fp: number; fn: number };
} {
  const tpImpact = matrix.tp * cost.tpValue;
  const tnImpact = matrix.tn * cost.tnValue;
  const fpImpact = matrix.fp * -cost.fpCost;
  const fnImpact = matrix.fn * -cost.fnCost;

  return {
    total: tpImpact + tnImpact + fpImpact + fnImpact,
    breakdown: {
      tp: tpImpact,
      tn: tnImpact,
      fp: fpImpact,
      fn: fnImpact,
    },
  };
}

export interface ParadoxAnalysis {
  hasParadox: boolean;
  type: 'accuracy_trap' | 'precision_sacrifice' | 'recall_sacrifice' | 'balanced_healthy';
  title: string;
  summary: string;
  recommendation: string;
  severity: 'danger' | 'warning' | 'success' | 'info';
}

export function analyzeParadoxAndTradeoffs(matrix: MatrixCounts): ParadoxAnalysis {
  const m = computeMetrics(matrix);

  // Paradoja del Accuracy: Alto accuracy (>85%), pero F1 muy bajo (<0.4) o Recall muy bajo (<0.2)
  if (m.accuracy >= 0.85 && (m.recall < 0.25 || m.f1Score < 0.35)) {
    return {
      hasParadox: true,
      type: 'accuracy_trap',
      severity: 'danger',
      title: '🚨 Trampa de la Exactitud (Accuracy Trap)',
      summary: `El modelo presume un ${formatPercent(m.accuracy)} de exactitud, ¡pero es un espejismo! Como los datos están muy desbalanceados (solo el ${formatPercent(m.prevalence)} son positivos reales), el modelo casi nunca predice positivo. Está ignorando el ${formatPercent(m.missRate)} de los casos críticos reales (Falsos Negativos: ${matrix.fn}). Su F1-Score es de apenas ${m.f1Score.toFixed(2)}.`,
      recommendation: 'Nunca evalúes este modelo usando solo Exactitud. Guíate por el F1-Score o Recall (Sensibilidad). Si es un caso médico o de fraude, este modelo es prácticamente inútil o peligroso.',
    };
  }

  // Alto Recall pero bajísima Precisión (Muchas falsas alarmas)
  if (m.recall > 0.85 && m.precision < 0.25) {
    return {
      hasParadox: true,
      type: 'precision_sacrifice',
      severity: 'warning',
      title: '⚠️ Síndrome de la Alarma Paranoica (Baja Precisión)',
      summary: `El modelo detecta casi todos los positivos reales (Recall: ${formatPercent(m.recall)}), pero a costa de disparar demasiadas falsas alarmas (Falsos Positivos: ${matrix.fp}). De todo lo que marca positivo, solo el ${formatPercent(m.precision)} es real.`,
      recommendation: 'Si el coste de investigar cada alarma es alto o frustra a los usuarios (como en filtros de spam o bloqueos de tarjetas), sube el umbral de decisión para ganar Precisión.',
    };
  }

  // Alta Precisión pero bajísimo Recall (Modelo ultra-conservador)
  if (m.precision > 0.85 && m.recall < 0.3) {
    return {
      hasParadox: true,
      type: 'recall_sacrifice',
      severity: 'warning',
      title: '⚠️ Síndrome del Modelo Ultra-Conservador',
      summary: `Cuando el modelo dice "Positivo", casi nunca se equivoca (Precisión: ${formatPercent(m.precision)}). Sin embargo, es tan tímido que deja escapar la mayoría de los casos reales (Recall de solo ${formatPercent(m.recall)} y ${matrix.fn} Falsos Negativos).`,
      recommendation: 'Aceptable solo si un Falso Positivo es devastador (ej. una acusación penal automática o cirugía irreversible). Para detección temprana, reduce el umbral.',
    };
  }

  // Modelo equilibrado y saludable
  if (m.f1Score >= 0.7 && m.balancedAccuracy >= 0.75) {
    return {
      hasParadox: false,
      type: 'balanced_healthy',
      severity: 'success',
      title: '✅ Rendimiento Sólido y Equilibrado',
      summary: `El modelo demuestra un buen balance armónico entre Precisión (${formatPercent(m.precision)}) y Sensibilidad (${formatPercent(m.recall)}), con un F1-Score respetable de ${m.f1Score.toFixed(2)}.`,
      recommendation: 'Es un clasificador robusto que no se deja engañar por el sesgo de la clase mayoritaria.',
    };
  }

  return {
    hasParadox: false,
    type: 'balanced_healthy',
    severity: 'info',
    title: 'ℹ️ Rendimiento Moderado',
    summary: `Exactitud del ${formatPercent(m.accuracy)}, con F1-Score de ${m.f1Score.toFixed(2)} (Precisión: ${formatPercent(m.precision)}, Recall: ${formatPercent(m.recall)}).`,
    recommendation: 'Ajusta los umbrales o balancea los datos de entrenamiento para optimizar la métrica que tu problema requiera.',
  };
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0.0%';
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('es-ES').format(val);
}
