'use client';

import { useState } from 'react';
import { createJourney, PHASES, resolveChoice, restartJourney, ZODIAC_SIGNS } from './game.js';

const resultCopy = {
  success: { title: 'SUCESSO', icon: '✓', message: 'A Terra encontrou sua fundação.', detail: 'O mundo prospera sob um céu em harmonia.', action: 'AVANÇAR' },
  partial: { title: 'INSTÁVEL', icon: '≈', message: 'A humanidade sobreviveu.', detail: 'O equilíbrio ainda está se formando.', action: 'CONTINUAR' },
  collapse: { title: 'COLAPSO', icon: '×', message: 'A combinação entrou em conflito.', detail: 'O mundo não prosperou. O cosmos oferece outra chance.', action: 'TENTAR NOVAMENTE' },
};

export default function Home() {
  const [journey, setJourney] = useState(createJourney);
  const [screen, setScreen] = useState('home');
  const [selected, setSelected] = useState([]);
  const [outcome, setOutcome] = useState(null);
  const phase = PHASES[journey.phaseIndex];

  function startJourney() {
    setJourney(createJourney());
    setSelected([]);
    setOutcome(null);
    setScreen('intro');
  }

  function toggleSign(sign) {
    setSelected((current) => current.includes(sign) ? current.filter((item) => item !== sign) : current.length < 2 ? [...current, sign] : current);
  }

  function confirmChoice() {
    if (selected.length !== 2) return;
    const resolved = resolveChoice(journey, selected);
    setJourney(resolved.journey);
    setOutcome(resolved.result);
    setScreen('result');
  }

  function continueJourney() {
    if (outcome === 'collapse') {
      setSelected([]);
      setScreen('selection');
      return;
    }
    if (journey.status === 'complete') {
      setScreen('final');
      return;
    }
    setSelected([]);
    setScreen('selection');
  }

  return (
      <main className="universe min-h-screen flex items-center justify-center">
      <div className="nebula nebula-one" aria-hidden="true" /><div className="nebula nebula-two" aria-hidden="true" />
      {screen === 'home' && <section className="home-screen" aria-labelledby="home-title">
        <div className="stars" aria-hidden="true">✦ <span>·</span> ✧</div>
        <p className="eyebrow">UMA JORNADA CÓSMICA</p>
        <h1 id="home-title">Astro<span>Ville</span></h1>
        <p className="home-subtitle">O destino da humanidade<br />está nas estrelas.</p>
        <div className="planet" role="img" aria-label="Planeta Terra brilhando no espaço"><span>✦</span></div>
        <p className="planet-label">TERRA · ANO ZERO</p>
        <button className="primary-button home-cta" onClick={startJourney}>COMEÇAR JORNADA <span aria-hidden="true">→</span></button>
        <p className="home-note">Seis fases. Dois signos. Um destino.</p>
        <div className="home-sparkles" aria-hidden="true">·　✦　　·　✧　·</div>
      </section>}

      {screen === 'intro' && <section className="intro-screen panel" aria-labelledby="intro-title">
        <div className="phase-badge">FASE 1 / 6</div>
        <div className="intro-orb" aria-hidden="true">🌍</div>
        <p className="eyebrow">TUDO COMEÇA EM ALGUM LUGAR</p>
        <h2 id="intro-title">{phase.name}</h2>
        <p className="intro-description">{phase.description}<br />Prepare o mundo para receber a vida.</p>
        <button className="primary-button" onClick={() => setScreen('selection')}>ESCOLHER SIGNOS <span aria-hidden="true">→</span></button>
      </section>}

      {screen === 'selection' && <section className="game-screen" aria-labelledby="phase-title">
        <header className="game-header">
          <span className="phase-badge">FASE {journey.phaseIndex + 1} / 6</span>
          <ol className="progress" aria-label={`Fase ${journey.phaseIndex + 1} de 6`}>
            {PHASES.map((item, index) => <li key={item.name} className={index < journey.phaseIndex ? 'complete' : index === journey.phaseIndex ? 'current' : ''} aria-label={`Fase ${index + 1}${journey.completedPhases.includes(index) ? ', concluída' : index === journey.phaseIndex ? ', atual' : ', bloqueada'}`} />)}
          </ol>
        </header>
        <div className="phase-copy">
          <p className="eyebrow">CAPÍTULO {String(journey.phaseIndex + 1).padStart(2, '0')} · EVOLUÇÃO DA TERRA</p>
          <h2 id="phase-title">{phase.name}</h2>
          <p>{phase.prompt}</p>
        </div>
        <div className="zodiac-grid" aria-label="Escolha dois signos">
          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = selected.includes(sign.name);
            const disabled = selected.length === 2 && !isSelected;
            return <button key={sign.name} type="button" className={`zodiac-card${isSelected ? ' selected' : ''}${disabled ? ' unavailable' : ''}`} aria-pressed={isSelected} disabled={disabled} onClick={() => toggleSign(sign.name)}>
              {isSelected && <span className="checkmark" aria-hidden="true">✓</span>}
              <span className="zodiac-symbol" aria-hidden="true">{sign.symbol}</span><span className="zodiac-name">{sign.name}</span><span className="zodiac-element">{sign.element}</span>
            </button>;
          })}
        </div>
        <div className="selection-footer">
          <div className="pair-area" aria-live="polite">
            <span className="pair-label">SEU PAR</span>
            <div className="pair-slots">
              {[0, 1].map((index) => <span className={`pair-slot${selected[index] ? ' filled' : ''}`} key={index}>{selected[index] ? <><span>{ZODIAC_SIGNS.find((item) => item.name === selected[index])?.symbol}</span> {selected[index]}</> : <span className="empty-slot">+</span>}</span>)}
            </div>
            <span className="selection-count">{selected.length} / 2 escolhidos</span>
          </div>
          <button className="primary-button confirm-button" onClick={confirmChoice} disabled={selected.length !== 2}>CONFIRMAR ESCOLHA <span aria-hidden="true">→</span></button>
        </div>
      </section>}

      {screen === 'result' && outcome && <section className={`result-screen panel result-${outcome}`} role="region" aria-label="Resultado da fase" aria-live="polite">
        <div className="result-icon" aria-hidden="true">{resultCopy[outcome].icon}</div>
        <p className="eyebrow">FASE {journey.phaseIndex + 1} · {phase.name}</p>
        <h2>{resultCopy[outcome].title}</h2>
        <div className="result-pair">{selected.map((sign, index) => <span key={sign}>{index > 0 && <b>+</b>}{ZODIAC_SIGNS.find((item) => item.name === sign)?.symbol} <small>{sign}</small></span>)}</div>
        <p className="result-message">{resultCopy[outcome].message}</p>
        <p className="result-detail">{resultCopy[outcome].detail}</p>
        <div className="result-divider" />
        <button className="primary-button" onClick={continueJourney}>{resultCopy[outcome].action} <span aria-hidden="true">→</span></button>
      </section>}

      {screen === 'final' && <section className="final-screen panel" aria-labelledby="final-title">
        <div className="final-stars" aria-hidden="true">✦　✧　✦</div>
        <div className="planet final-planet" role="img" aria-label="Terra em seu futuro próspero"><span>✦</span></div>
        <p className="eyebrow">JORNADA COMPLETA</p>
        <h2 id="final-title">A humanidade<br />prosperou.</h2>
        <p className="final-copy">Você guiou a Terra até um novo horizonte.<br />O universo agradece — e já prepara outra surpresa.</p>
        <div className="completed-stages" aria-label="Seis fases concluídas">{PHASES.map((item) => <span key={item.name} title={item.name}>✓</span>)}</div>
        <button className="primary-button" onClick={() => { setJourney(restartJourney(journey)); setOutcome(null); setSelected([]); setScreen('home'); }}>JOGAR NOVAMENTE <span aria-hidden="true">↻</span></button>
      </section>}
      <footer className="site-footer">ASTROVILLE <span>·</span> A TERRA É SUA OBRA-PRIMA</footer>
    </main>
  );
}
