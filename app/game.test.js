import { describe, expect, it } from 'vitest';
import { createJourney, resolveChoice, restartJourney } from './game.js';

describe('journey rules', () => {
  it('recognizes the correct pair regardless of selection order', () => {
    const first = resolveChoice(createJourney(), ['Touro', 'Capricórnio']);
    const second = resolveChoice(createJourney(), ['Capricórnio', 'Touro']);

    expect(first.result).toBe('success');
    expect(second.result).toBe('success');
  });

  it('advances on partial success and retains the outcome for the result screen', () => {
    const outcome = resolveChoice(createJourney(), ['Virgem', 'Capricórnio']);

    expect(outcome.result).toBe('partial');
    expect(outcome.journey.phaseIndex).toBe(1);
    expect(outcome.journey.completedPhases).toEqual([0]);
  });

  it('retries a collapse on the same phase without erasing earlier progress', () => {
    const afterFirstPhase = resolveChoice(createJourney(), ['Touro', 'Capricórnio']).journey;
    const retry = resolveChoice(afterFirstPhase, ['Áries', 'Leão']);

    expect(retry.result).toBe('collapse');
    expect(retry.journey.phaseIndex).toBe(1);
    expect(retry.journey.completedPhases).toEqual([0]);
  });

  it('finishes after a successful or partial sixth phase', () => {
    let journey = createJourney();
    const winningPairs = [
      ['Touro', 'Capricórnio'], ['Câncer', 'Peixes'], ['Virgem', 'Touro'],
      ['Gêmeos', 'Libra'], ['Capricórnio', 'Aquário'], ['Sagitário', 'Leão'],
    ];

    for (const pair of winningPairs) journey = resolveChoice(journey, pair).journey;

    expect(journey.status).toBe('complete');
    expect(journey.phaseIndex).toBe(5);
    expect(journey.completedPhases).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('recognizes the approved correct pair in the final phase', () => {
    let journey = createJourney();
    const firstFivePairs = [
      ['Touro', 'Capricórnio'], ['Câncer', 'Peixes'], ['Virgem', 'Touro'],
      ['Gêmeos', 'Libra'], ['Capricórnio', 'Aquário'],
    ];
    for (const pair of firstFivePairs) journey = resolveChoice(journey, pair).journey;

    const finalOutcome = resolveChoice(journey, ['Aquário', 'Sagitário']);

    expect(finalOutcome.result).toBe('success');
    expect(finalOutcome.journey.status).toBe('complete');
  });

  it('starts a fresh in-memory journey when restarted', () => {
    const journey = resolveChoice(createJourney(), ['Touro', 'Capricórnio']).journey;

    expect(restartJourney()).toEqual(createJourney());
  });
});
