import { CaseStudy } from '../types/confusionMatrix';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cancer-screening',
    title: 'Detección Temprana de Cáncer Raro',
    category: 'Salud',
    icon: 'Activity',
    description: 'Tamizaje en 10,000 pacientes. La enfermedad solo afecta al 1% de la población (100 personas). El impacto de un Falso Negativo es fatal.',
    backgroundContext: 'Un laboratorio hospitalario evalúa algoritmos de IA para analizar radiografías. Un paciente sano etiquetado erróneamente (FP) se asusta y requiere un examen secundario de sangre. Pero un paciente enfermo no detectado (FN) vuelve a casa sin tratamiento y su probabilidad de supervivencia cae drásticamente.',
    imbalanceRatio: '1% Positivos (100) vs 99% Negativos (9,900)',
    whyAccuracyFails: 'Un modelo que no hace nada y dice siempre "Usted está sano" obtiene un 99.0% de exactitud matemática. Sin embargo, no salva ni a una sola persona (Recall = 0%, F1 = 0). La exactitud es una ilusión mortal en este escenario.',
    criticalMetric: 'recall',
    criticalMetricExplanation: 'El Recall (Sensibilidad) mide cuántos enfermos reales detectamos. Aquí el costo de un FN (muerte evitable) es inconmensurablemente mayor que el costo de un FP (estrés y test confirmatorio).',
    costs: {
      tpValue: 50000, // Valor de vida salvada / tratamiento oportuno
      tnValue: 100, // Paciente sano confirmado sin costos extra
      fpCost: 1500, // Coste de ecografía/biopsia secundaria y ansiedad
      fnCost: 200000, // Coste de negligencia, tratamiento tardío o fatalidad
      currencyUnit: 'USD',
    },
    models: [
      {
        id: 'cancer-naive',
        name: 'Modelo A: "El Médico Vago" (Clase Mayoritaria)',
        tagline: 'Predice a todos sanos. ¡99% de Accuracy!',
        strategy: 'naive-majority',
        matrix: { tp: 0, fp: 0, fn: 100, tn: 9900 },
        description: 'Este modelo trivial responde invariablemente "Negativo" a todos los pacientes.',
        whyLooksGoodOrBad: 'A primera vista, un reporte con "99.0% Accuracy" impresiona a directores no técnicos. Pero en realidad dejó morir al 100% de los pacientes enfermos. F1-Score: 0.00.',
        clinicalOrBusinessImpact: 'Catástrofe médica absoluta y demandas masivas por negligencia.',
        colorScheme: 'rose',
      },
      {
        id: 'cancer-balanced',
        name: 'Modelo B: "Clínico Equilibrado"',
        tagline: 'Accuracy 97.8%, pero salva 85 vidas',
        strategy: 'balanced',
        matrix: { tp: 85, fp: 200, fn: 15, tn: 9700 },
        description: 'Modelo entrenado con técnicas de sobremuestreo y ajuste de pesos de clase.',
        whyLooksGoodOrBad: 'Tiene MENOR exactitud que el Modelo A (97.8% vs 99.0%), pero detecta al 85% de los enfermos reales (Recall = 85%). Su F1-Score es de 0.44 y genera un enorme valor humano.',
        clinicalOrBusinessImpact: 'Salva 85 vidas. Los 200 Falsos Positivos son descartados rápidamente en un examen de sangre de $100.',
        colorScheme: 'emerald',
      },
      {
        id: 'cancer-sensitive',
        name: 'Modelo C: "Alarma Máxima" (Ultra-Sensible)',
        tagline: 'Recall 96%, pero satura el hospital con biopsias',
        strategy: 'high-recall',
        matrix: { tp: 96, fp: 1400, fn: 4, tn: 8500 },
        description: 'Umbral de decisión bajado al mínimo (0.15) para no dejar escapar casi ningún caso.',
        whyLooksGoodOrBad: 'Casi no tiene Falsos Negativos (solo 4), pero su Precisión cae a un 6.4%, colapsando la sala de biopsias con 1,400 personas sanas aterrorizadas.',
        clinicalOrBusinessImpact: 'Excelente salvando vidas, pero muy costoso en recursos hospitalarios.',
        colorScheme: 'amber',
      },
    ],
  },
  {
    id: 'banking-fraud',
    title: 'Detección de Fraude en Tarjetas de Crédito',
    category: 'Finanzas',
    icon: 'ShieldAlert',
    description: 'En 50,000 transacciones bancarias, solo 150 son fraudes reales (0.3%). Bloquear la tarjeta de un cliente legítimo genera indignación.',
    backgroundContext: 'Un banco procesa miles de pagos por segundo. Si no detecta el fraude (FN), el banco asume la pérdida monetaria del robo. Si bloquea una transacción legítima (FP), el cliente queda avergonzado en el supermercado y puede cancelar su cuenta.',
    imbalanceRatio: '0.3% Fraudes (150) vs 99.7% Legítimas (49,850)',
    whyAccuracyFails: 'Decir siempre "Transacción legítima" otorga 99.7% de Accuracy, pero el banco perdería cientos de miles de dólares en reembolsos por fraude.',
    criticalMetric: 'f1',
    criticalMetricExplanation: 'Se necesita un F1-Score o F-Beta balanceado: capturar el fraude sin convertir la experiencia de compra de 49,850 clientes honestos en una pesadilla.',
    costs: {
      tpValue: 1200, // Fraude detenido promedio recuperado
      tnValue: 5, // Tarifa de transacción procesada sin fricción
      fpCost: 80, // Coste de soporte telefónico y fricción del cliente
      fnCost: 1500, // Pérdida del fraude no detectado y seguros
      currencyUnit: 'USD',
    },
    models: [
      {
        id: 'fraud-majority',
        name: 'Modelo 1: "El Pasante Ciego"',
        tagline: 'Aprueba todo. 99.7% de exactitud, bancarrota en fraudes.',
        strategy: 'naive-majority',
        matrix: { tp: 0, fp: 0, fn: 150, tn: 49850 },
        description: 'No detecta nada sospechoso. Pasa todas las transacciones sin objeción.',
        whyLooksGoodOrBad: 'Exactitud récord del 99.7%, pero $225,000 en pérdidas directas por los 150 fraudes impunes. F1-Score: 0.00.',
        clinicalOrBusinessImpact: 'Fuga de capital masiva y sanción de las redes Visa/Mastercard.',
        colorScheme: 'rose',
      },
      {
        id: 'fraud-balanced',
        name: 'Modelo 2: "Centinela Financiero"',
        tagline: 'F1-Score 0.68 | Detiene el 80% del fraude con baja fricción',
        strategy: 'balanced',
        matrix: { tp: 120, fp: 80, fn: 30, tn: 49770 },
        description: 'Algoritmo Gradient Boosting calibrado con umbral óptimo de probabilidad 0.42.',
        whyLooksGoodOrBad: 'Accuracy del 99.8%. De 200 alertas emitidas, 120 son fraudes reales (Precisión: 60%). Recall del 80%. Retorno neto superior.',
        clinicalOrBusinessImpact: 'Ahorra más de $140,000 netos al banco con muy pocas llamadas a soporte.',
        colorScheme: 'emerald',
      },
      {
        id: 'fraud-paranoid',
        name: 'Modelo 3: "Bloqueador Paranoico"',
        tagline: 'Recall 93%, pero bloquea 2,500 tarjetas de clientes inocentes',
        strategy: 'high-recall',
        matrix: { tp: 140, fp: 2500, fn: 10, tn: 47350 },
        description: 'Algoritmo configurado para disparar alarma ante cualquier cambio mínimo de IP o monto.',
        whyLooksGoodOrBad: 'Detiene casi todo el fraude, pero con una Precisión de solo el 5.3%. 2,500 clientes inocentes con tarjetas bloqueadas un fin de semana.',
        clinicalOrBusinessImpact: 'Avalancha en el Call Center y renuncia masiva de tarjetahabientes.',
        colorScheme: 'amber',
      },
    ],
  },
  {
    id: 'spam-filter',
    title: 'Filtro Anti-Spam Corporativo',
    category: 'Ciberseguridad',
    icon: 'MailCheck',
    description: 'En 2,000 correos, 400 son spam y 1,600 son correos laborales vitales. Aquí un Falso Positivo puede costar un negocio de millones.',
    backgroundContext: 'Si un spam llega a tu bandeja principal (FN), te toma medio segundo borrarlo. Pero si una oferta de trabajo, cotización de contrato o factura legítima se va a la carpeta de Spam o se elimina (FP), las consecuencias son catastróficas.',
    imbalanceRatio: '20% Spam (400) vs 80% Legítimos (1,600)',
    whyAccuracyFails: 'La exactitud no refleja que cometer 1 Falso Positivo es 50 veces más grave que tener 5 Falsos Negativos en correos.',
    criticalMetric: 'precision',
    criticalMetricExplanation: 'La Precisión debe ser cercana al 99%. Cuando el filtro dice "Esto es Spam", debe tener certeza casi matemática.',
    costs: {
      tpValue: 2, // Limpieza de bandeja
      tnValue: 1, // Correo normal entregado
      fpCost: 500, // Negocio perdido o cliente desatendido por correo en spam
      fnCost: 5, // Pérdida de tiempo del empleado borrando un spam
      currencyUnit: 'USD',
    },
    models: [
      {
        id: 'spam-high-precision',
        name: 'Modelo Seguro: "Filtro Conservador"',
        tagline: 'Precisión 98.4% | Cero correos importantes perdidos',
        strategy: 'high-precision',
        matrix: { tp: 310, fp: 5, fn: 90, tn: 1595 },
        description: 'Solo envía a Spam cuando la certeza es extrema (>95%).',
        whyLooksGoodOrBad: 'Deja pasar 90 spams a la bandeja (Recall 77.5%), pero solo confunde 5 correos legítimos en miles. F1-Score 0.87. Los usuarios confían plenamente en él.',
        clinicalOrBusinessImpact: 'Máxima productividad empresarial sin riesgo de perder ventas.',
        colorScheme: 'emerald',
      },
      {
        id: 'spam-aggressive',
        name: 'Modelo Agresivo: "Bandeja Impecable"',
        tagline: 'Recall 97.5%, pero entierra 120 contratos legítimos en spam',
        strategy: 'high-recall',
        matrix: { tp: 390, fp: 120, fn: 10, tn: 1480 },
        description: 'Bloquea cualquier correo con links, números o remitentes nuevos.',
        whyLooksGoodOrBad: 'Su bandeja luce limpia (casi cero spam), pero destruye 120 correos comerciales legítimos. Precisión de solo 76.5%.',
        clinicalOrBusinessImpact: 'Directores de ventas furiosos porque no recibieron propuestas de clientes.',
        colorScheme: 'rose',
      },
    ],
  },
  {
    id: 'aerospace-testing',
    title: 'Inspección de Álaves de Turbina de Avión',
    category: 'Industria Aeroespacial',
    icon: 'PlaneAlert',
    description: 'En 5,000 piezas forjadas, 20 tienen microfisuras invisibles (0.4%). Una microfisura no detectada en vuelo causa desintegración del motor.',
    backgroundContext: 'Inspección ultrasónica automatizada de componentes de aeronaves comerciales. Inspeccionar manualmente una pieza falsamente marcada (FP) cuesta 2 horas de técnico ($300). Una pieza defectuosa instalada en un motor (FN) cuesta 250 vidas humanas y $150M.',
    imbalanceRatio: '0.4% Defectuosas (20) vs 99.6% Perfectas (4,980)',
    whyAccuracyFails: 'Un sistema con 99.6% de exactitud puede dejar pasar las 20 turbinas defectuosas y provocar 20 accidentes aéreos.',
    criticalMetric: 'recall',
    criticalMetricExplanation: 'El Recall DEBE ser del 100% o lo más cercano posible (cero Falsos Negativos tolerados).',
    costs: {
      tpValue: 200000, // Defecto crítico prevenido en fábrica
      tnValue: 50, // Pieza certificada lista para ensamble
      fpCost: 300, // Reinspección metalúrgica manual
      fnCost: 50000000, // Desastre aéreo catastrófico
      currencyUnit: 'USD',
    },
    models: [
      {
        id: 'aero-standard',
        name: 'Modelo Comercial Estándar',
        tagline: 'Accuracy 99.7%, pero dejó pasar 3 fisuras letales (FN = 3)',
        strategy: 'balanced',
        matrix: { tp: 17, fp: 12, fn: 3, tn: 4968 },
        description: 'Modelo entrenado con métricas estándar sin penalización asimétrica de error.',
        whyLooksGoodOrBad: 'Cualquier métrica genérica diría que es "casi perfecto": 99.7% Accuracy y 0.69 F1. Pero 3 turbinas rotas volarán en aviones comerciales.',
        clinicalOrBusinessImpact: 'Riesgo inaceptable para la aviación civil.',
        colorScheme: 'rose',
      },
      {
        id: 'aero-zero-defect',
        name: 'Modelo Protocolo Cero-Defectos',
        tagline: 'Recall 100% (FN = 0) | Reinspecciona 180 piezas para salvar vidas',
        strategy: 'high-recall',
        matrix: { tp: 20, fp: 180, fn: 0, tn: 4800 },
        description: 'Algoritmo con función de pérdida penalizada 10,000x ante Falsos Negativos.',
        whyLooksGoodOrBad: 'Su exactitud bajó a 96.4% y su F1-Score a 0.18 por los 180 FP, ¡pero salvó al 100% de los vuelos! Es el ÚNICO modelo aprobado para volar.',
        clinicalOrBusinessImpact: 'Seguridad aérea absoluta con un costo operativo marginal de inspección.',
        colorScheme: 'emerald',
      },
    ],
  },
];
