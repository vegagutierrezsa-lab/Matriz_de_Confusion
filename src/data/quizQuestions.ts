import { QuizQuestion } from '../types/confusionMatrix';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-1-medical',
    title: 'Misión 1: El Comité Médico del Hospital',
    scenario:
      'Estás a cargo de la IA médica en un hospital metropolitano. Debes elegir el modelo para detectar una afección cardíaca asintomática pero mortal que sufre el 0.5% de los pacientes (50 de 10,000 personas). Los pacientes no detectados mueren en menos de un año.',
    difficulty: 'Fácil',
    targetGoal: 'Maximizar el Recall (Sensibilidad) y evitar a toda costa los Falsos Negativos (FN).',
    models: [
      {
        id: 'opt-a',
        name: 'Modelo Apolo (Exactitud: 99.5%)',
        matrix: { tp: 0, fp: 0, fn: 50, tn: 9950 },
        description: 'Presume un 99.5% de exactitud matemática global con cero quejas de falsas alarmas.',
      },
      {
        id: 'opt-b',
        name: 'Modelo Bios (Exactitud: 96.8%)',
        matrix: { tp: 48, fp: 310, fn: 2, tn: 9640 },
        description: 'Exactitud del 96.8%, genera 310 falsas alarmas que requieren un ecocardiograma de $50, pero detecta 48 de los 50 enfermos.',
      },
      {
        id: 'opt-c',
        name: 'Modelo Chronos (Exactitud: 90.0%)',
        matrix: { tp: 10, fp: 980, fn: 40, tn: 8970 },
        description: 'Modelo no calibrado que deja escapar al 80% de los pacientes enfermos.',
      },
    ],
    correctModelId: 'opt-b',
    insight:
      '¡Excelente decisión! El Modelo Bios tiene menor exactitud que Apolo (96.8% vs 99.5%), pero salva al 96% de los pacientes enfermos (Recall: 96%). El Modelo Apolo es un clásico modelo tramposo: dice a todos que están sanos y deja morir al 100% de los pacientes.',
    trapWarning:
      'Muchos directivos eligen el Modelo Apolo atraídos por la cifra de "99.5% de Exactitud", cometiendo una negligencia mortal.',
  },
  {
    id: 'quiz-2-spam',
    title: 'Misión 2: El Filtro de Correos de la Dirección General',
    scenario:
      'El CEO de una multinacional recibe ofertas de licitación de millones de dólares. Si un correo legítimo se va a la carpeta de Spam (Falso Positivo), la empresa pierde contratos. Si un spam llega a la bandeja de entrada (Falso Negativo), simplemente se borra con un clic.',
    difficulty: 'Intermedio',
    targetGoal: 'Maximizar la Precisión (Precision) para garantizar que lo marcado como spam sea realmente spam.',
    models: [
      {
        id: 'opt-spam-1',
        name: 'Modelo Tormenta (Recall: 99%, Precisión: 65%)',
        matrix: { tp: 198, fp: 105, fn: 2, tn: 795 },
        description: 'Atrapa casi todo el spam, pero mandó 105 correos legítimos de clientes a la papelera.',
      },
      {
        id: 'opt-spam-2',
        name: 'Modelo Halcón (Recall: 82%, Precisión: 98.8%)',
        matrix: { tp: 164, fp: 2, fn: 36, tn: 898 },
        description: 'Deja pasar 36 correos de spam molestos a la bandeja, pero solo se equivoca con 2 correos legítimos.',
      },
      {
        id: 'opt-spam-3',
        name: 'Modelo Cero-Spam (Recall: 100%, Precisión: 40%)',
        matrix: { tp: 200, fp: 300, fn: 0, tn: 600 },
        description: 'Bandeja de entrada 100% libre de spam, pero bloqueó 300 propuestas de negocios.',
      },
    ],
    correctModelId: 'opt-spam-2',
    insight:
      '¡Correcto! En filtros de correo corporativo el Falso Positivo es devastador. El Modelo Halcón tiene una Precisión del 98.8%, protegiendo las oportunidades de negocio críticas a cambio de que el CEO borre manualmente unos pocos spams.',
    trapWarning:
      'Querer "0% de spam en la bandeja" (Recall 100%) suele destruir correos legítimos vitales.',
  },
  {
    id: 'quiz-3-fraud',
    title: 'Misión 3: El Dilema del Black Friday en el Banco',
    scenario:
      'Durante Black Friday, el banco procesa 100,000 compras. Si bloqueas arbitrariamente a usuarios honestos (FP), colapsas el centro de llamadas y los clientes abandonan sus carritos. Si dejas pasar fraudes (FN), el banco asume la pérdida.',
    difficulty: 'Avanzado',
    targetGoal: 'Elegir el modelo con el mejor balance armónico (F1-Score) y menor impacto financiero neto.',
    models: [
      {
        id: 'opt-f-1',
        name: 'Modelo Ultradesconfiado',
        matrix: { tp: 290, fp: 4500, fn: 10, tn: 95200 },
        description: 'Frena el 96% de fraudes pero bloquea a 4,500 clientes inocentes en plena fiesta de compras.',
      },
      {
        id: 'opt-f-2',
        name: 'Modelo Inteligente Balanceado',
        matrix: { tp: 250, fp: 120, fn: 50, tn: 99580 },
        description: 'Frena 250 fraudes, solo causa fricción a 120 clientes y mantiene un F1-Score de 0.74.',
      },
      {
        id: 'opt-f-3',
        name: 'Modelo Permisivo',
        matrix: { tp: 50, fp: 10, fn: 250, tn: 99690 },
        description: 'Casi no molesta a clientes, pero deja pasar 250 fraudes millonarios.',
      },
    ],
    correctModelId: 'opt-f-2',
    insight:
      '¡Extraordinario! El Modelo Balanceado logra un F1-Score de 0.74 con una Precisión de 67.5% y Recall de 83.3%. Logra salvar el dinero del banco sin provocar una estampida de clientes insatisfechos.',
    trapWarning:
      'El modelo Ultradesconfiado parecía bueno por su alto Recall, pero provocar 4,500 falsos bloqueos en Black Friday causaría un daño reputacional incalculable.',
  },
  {
    id: 'quiz-4-airport',
    title: 'Misión 4: Escáner de Objetos Prohibidos en Aeropuerto',
    scenario:
      'Un escáner con IA en el control de seguridad de un aeropuerto internacional analiza equipajes. El costo de una alarma falsa (FP) es que el agente abre la maleta 2 minutos. El costo de un arma no detectada (FN) es un secuestro o atentado aéreo.',
    difficulty: 'Fácil',
    targetGoal: 'Priorizar rotundamente Sensibilidad (Recall = 100%), tolerando Falsos Positivos de inspección manual.',
    models: [
      {
        id: 'opt-air-1',
        name: 'Modelo Aeroseguro (Recall: 100%, FP: 450)',
        matrix: { tp: 15, fp: 450, fn: 0, tn: 9535 },
        description: 'Ningún arma u objeto peligroso pasa a la cabina (FN = 0). Requiere abrir 450 maletas para revisión manual.',
      },
      {
        id: 'opt-air-2',
        name: 'Modelo Rápido (Recall: 80%, FP: 20)',
        matrix: { tp: 12, fp: 20, fn: 3, tn: 9965 },
        description: 'Filas ultra-rápidas en el aeropuerto, pero 3 armas de fuego subieron a los aviones.',
      },
    ],
    correctModelId: 'opt-air-1',
    insight:
      '¡Exacto! En seguridad aérea nacional, la tolerancia a Falsos Negativos es CERO absoluto. Abrir 450 maletas es un precio operativo insignificante frente a una catástrofe.',
    trapWarning:
      'Nunca optimices por comodidad o exactitud global cuando el costo de un Falso Negativo involucre vidas humanas.',
  },
];
