'use client';

import { useEffect, useState } from 'react';
import { createJourney, PHASES, resolveChoice, restartJourney, ZODIAC_SIGNS } from './game.js';

const resultCopy = {
  success: { title: 'SUCESSO', message: 'A Terra encontrou sua fundação.', detail: 'O mundo prospera sob um céu em harmonia.', action: 'AVANÇAR' },
  partial: { title: 'INSTÁVEL', message: 'A humanidade sobreviveu.', detail: 'O equilíbrio ainda está se formando.', action: 'CONTINUAR' },
  collapse: { title: 'COLAPSO', message: 'A combinação entrou em conflito.', detail: 'O mundo não prosperou. O cosmos oferece outra chance.', action: 'TENTAR NOVAMENTE' },
};

const resultIllustrations = {
  success: (phaseNumber) => `/planets/fase-${phaseNumber}-sucesso.svg`,
  partial: (phaseNumber) => `/planets/fase-${phaseNumber}-instavel.svg`,
  collapse: () => '/planets/colapso.svg',
};

export default function Home() {
  const [journey, setJourney] = useState(createJourney);
  const [screen, setScreen] = useState('home');
  const [selected, setSelected] = useState([]);
  const [outcome, setOutcome] = useState(null);
  const [resultPhaseIndex, setResultPhaseIndex] = useState(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const phase = PHASES[journey.phaseIndex];

  useEffect(() => {
    if (!guideOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === 'Escape') setGuideOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [guideOpen]);

  function startJourney() {
    setJourney(createJourney());
    setSelected([]);
    setOutcome(null);
    setResultPhaseIndex(null);
    setScreen('intro');
  }

  function toggleSign(sign) {
    setSelected((current) => current.includes(sign) ? current.filter((item) => item !== sign) : current.length < 2 ? [...current, sign] : current);
  }

  function confirmChoice() {
    if (selected.length !== 2) return;
    setResultPhaseIndex(journey.phaseIndex);
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
    <>
      <main className={`universe min-h-screen flex items-center justify-center${screen === 'home' ? ' is-home' : ''}`}>
      <div className="nebula nebula-one" aria-hidden="true" /><div className="nebula nebula-two" aria-hidden="true" />
      {screen === 'home' && <section className="home-screen" aria-labelledby="home-title">
        <div className="home-hero">
          <p className="launch-badge"><span aria-hidden="true">✦</span> NOVO JOGO CÓSMICO • VERSÃO 1.0 <i aria-hidden="true" /></p>
          <h1 id="home-title">Astro<span>Ville</span></h1>
          <p className="home-subtitle">O destino da Terra está nas estrelas.</p>
          <p className="home-description">Você é o arquiteto cósmico. A cada era da evolução planetária, combine dois signos<br className="desktop-break" /> do zodíaco para guiar o destino da humanidade entre prosperidade, caos ou harmonia cósmica.</p>
          <div className="planet-scene" role="group" aria-label="Terra em uma órbita cósmica: atmosfera 100%, sinergia elemental">
            <span className="planet-tag atmosphere"><i aria-hidden="true" />Atmosfera: 100%</span>
            <div className="planet-orbit orbit-one" /><div className="planet-orbit orbit-two" />
            <div className="hero-planet" role="img" aria-label="Planeta Terra azul e verde"><span className="planet-ring" /><span className="land land-one" /><span className="land land-two" /><span className="land land-three" /></div>
            <span className="planet-tag synergy"><b aria-hidden="true">✦</b> Sinergia Elemental</span>
          </div>
          <div className="home-actions">
            <button className="primary-button home-cta" onClick={startJourney}>COMEÇAR JORNADA <span aria-hidden="true">✦</span></button>
            <button className="secondary-button" onClick={() => setGuideOpen(true)}><span aria-hidden="true">▱</span> Como Jogar</button>
          </div>
          <p className="home-note"><span aria-hidden="true">◷</span> Partida rápida: ~3 minutos • 6 Eras Planetárias</p>
        </div>

        <div className="feature-grid" aria-label="Sobre AstroVille">
          <article className="feature-card epochs-card">
            <div className="feature-card-top"><span className="feature-icon" aria-hidden="true">◷</span><span className="feature-tag">Épocas</span></div>
            <h2>6 Eras de Evolução</h2>
            <p>Da sopa primordial à era biomecânica e o horizonte estelar. Molde cada transição biológica e cultural com escolhas decisivas.</p>
            <div className="feature-meta"><strong>Ciclo I → Ciclo VI</strong><span>•</span> Transição Contínua</div>
          </article>
          <article className="feature-card synergy-card">
            <div className="feature-card-top"><span className="feature-icon" aria-hidden="true">✦</span><span className="feature-tag">Sinergias</span></div>
            <h2>12 Forças Zodiacais</h2>
            <p>Fogo, Terra, Ar e Água. Combine pares astrológicos em cada turno para destravar ressonâncias lendárias ou mutações.</p>
            <div className="feature-meta"><strong>66 Combinações</strong><span>•</span> Gemas Ocultas</div>
          </article>
          <article className="feature-card verdict-card">
            <div className="feature-card-top"><span className="feature-icon" aria-hidden="true">⠿</span><span className="feature-tag">Vereditos</span></div>
            <h2>3 Destinos Planetários</h2>
            <p>Prosperidade Estelar de ordem harmônica, Cataclismo Primordial ou Simbiose Instável. Cada caminho gera uma crônica exclusiva.</p>
            <div className="feature-meta"><strong>Alta Rejogabilidade</strong><span>•</span> Codex Registro</div>
          </article>
        </div>
        <footer className="home-footer"><span>AstroVille v1.0 • Simulador de Evolução Planetária</span><span>© 2024 AstroVille Studios. Todos os direitos reservados.</span></footer>
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
        <img className="result-icon" src={resultIllustrations[outcome](resultPhaseIndex + 1)} alt="" aria-hidden="true" />
        <p className="eyebrow">FASE {resultPhaseIndex + 1} · {PHASES[resultPhaseIndex].name}</p>
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
      {screen !== 'home' && <footer className="site-footer">ASTROVILLE <span>·</span> A TERRA É SUA OBRA-PRIMA</footer>}
      </main>
      {guideOpen && <div className="guide-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setGuideOpen(false); }}>
        <section className="guide-modal" role="dialog" aria-modal="true" aria-labelledby="guide-title" aria-describedby="guide-subtitle">
          <button className="guide-close" type="button" aria-label="Fechar Como Jogar" onClick={() => setGuideOpen(false)}>✕</button>
          <h2 id="guide-title">Como Jogar AstroVille</h2>
          <p id="guide-subtitle" className="guide-subtitle">Manual Breve do Arquiteto Cósmico</p>
          <ol className="guide-steps">
            <li><span>1</span><div><h3>Observe a Era Planetária</h3><p>A cada turno, o planeta entra em um momento crítico. Examine Bioma, Cultura e Harmonia.</p></div></li>
            <li><span>2</span><div><h3>Escolha 2 Signos do Zodíaco</h3><p>Selecione o primeiro regente e combine com um segundo signo para guiar as forças astrológicas.</p></div></li>
            <li><span>3</span><div><h3>Confirme e Testemunhe a Sinergia</h3><p>Descubra a fusão resultante: uma sinergia perfeita impulsiona a evolução; choque gera caos.</p></div></li>
            <li><span>4</span><div><h3>Alcance o Horizonte Estelar</h3><p>Sobreviva às 6 Eras históricas com os indicadores vitais estáveis para consagrar a civilização.</p></div></li>
          </ol>
          <button className="primary-button guide-start" type="button" onClick={() => setGuideOpen(false)}>Entendido, Iniciar <span aria-hidden="true">→</span></button>
        </section>
      </div>}
    </>
  );
}
