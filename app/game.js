export const ZODIAC_SIGNS = [
  { name: 'Áries', symbol: '♈', element: 'Fogo' },
  { name: 'Touro', symbol: '♉', element: 'Terra' },
  { name: 'Gêmeos', symbol: '♊', element: 'Ar' },
  { name: 'Câncer', symbol: '♋', element: 'Água' },
  { name: 'Leão', symbol: '♌', element: 'Fogo' },
  { name: 'Virgem', symbol: '♍', element: 'Terra' },
  { name: 'Libra', symbol: '♎', element: 'Ar' },
  { name: 'Escorpião', symbol: '♏', element: 'Água' },
  { name: 'Sagitário', symbol: '♐', element: 'Fogo' },
  { name: 'Capricórnio', symbol: '♑', element: 'Terra' },
  { name: 'Aquário', symbol: '♒', element: 'Ar' },
  { name: 'Peixes', symbol: '♓', element: 'Água' },
];

export const PHASES = [
  { name: 'Sopa Primordial', description: 'A Terra ainda é jovem. Tudo está começando.', prompt: 'Quais dois signos vão preparar o mundo para receber a vida?', idealPair: ['Touro', 'Capricórnio'], partialPair: ['Virgem', 'Capricórnio'] },
  { name: 'Nascimento dos Oceanos', description: 'As águas chegam para transformar o planeta.', prompt: 'Quais dois signos vão dar forma aos primeiros oceanos?', idealPair: ['Câncer', 'Peixes'], partialPair: ['Touro', 'Câncer'] },
  { name: 'Era das Florestas', description: 'A vida encontrou espaço para crescer.', prompt: 'Quais dois signos vão fazer as florestas florescerem?', idealPair: ['Virgem', 'Touro'], partialPair: ['Virgem', 'Câncer'] },
  { name: 'Era das Cidades', description: 'Ideias e encontros começam a mudar tudo.', prompt: 'Quais dois signos vão erguer as primeiras cidades?', idealPair: ['Gêmeos', 'Libra'], partialPair: ['Gêmeos', 'Aquário'] },
  { name: 'Era das Máquinas', description: 'A engenhosidade acelera o futuro.', prompt: 'Quais dois signos vão conduzir a era das máquinas?', idealPair: ['Capricórnio', 'Aquário'], partialPair: ['Capricórnio', 'Gêmeos'] },
  { name: 'Horizonte Estelar', description: 'A humanidade olha para além de seu lar.', prompt: 'Quais dois signos vão guiar a humanidade até as estrelas?', idealPair: ['Sagitário', 'Aquário'], partialPair: ['Sagitário', 'Leão'] },
];

export function createJourney() {
  return { phaseIndex: 0, completedPhases: [], status: 'playing' };
}

function samePair(left, right) {
  return left.length === 2 && right.length === 2 && left.every((sign) => right.includes(sign)) && left[0] !== left[1];
}

export function resolveChoice(journey, pair) {
  if (journey.status === 'complete' || pair.length !== 2 || pair[0] === pair[1]) {
    throw new Error('A jornada requer dois signos distintos na fase atual.');
  }
  const phase = PHASES[journey.phaseIndex];
  const result = samePair(pair, phase.idealPair) ? 'success' : samePair(pair, phase.partialPair) ? 'partial' : 'collapse';
  if (result === 'collapse') return { result, journey };

  const completedPhases = journey.completedPhases.includes(journey.phaseIndex)
    ? journey.completedPhases
    : [...journey.completedPhases, journey.phaseIndex];
  const lastPhase = journey.phaseIndex === PHASES.length - 1;
  return {
    result,
    journey: { phaseIndex: lastPhase ? journey.phaseIndex : journey.phaseIndex + 1, completedPhases, status: lastPhase ? 'complete' : 'playing' },
  };
}

export function restartJourney() {
  return createJourney();
}
