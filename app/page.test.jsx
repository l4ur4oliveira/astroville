import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import Home from './page.jsx';

describe('AstroVille game flow', () => {
  afterEach(cleanup);
  it('requires two distinct signs, lets the player remove one, and then confirms the pair', () => {
    render(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /começar jornada/i }));
    fireEvent.click(screen.getByRole('button', { name: /escolher signos/i }));

    const confirm = screen.getByRole('button', { name: /confirmar escolha/i });
    expect(confirm).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /touro/i }));
    expect(screen.getByText('1 / 2 escolhidos')).toBeInTheDocument();
    expect(confirm).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /touro/i }));
    expect(screen.getByText('0 / 2 escolhidos')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /touro/i }));
    fireEvent.click(screen.getByRole('button', { name: /capricórnio/i }));
    expect(confirm).toBeEnabled();
    fireEvent.click(confirm);

    expect(screen.getByRole('heading', { name: /sucesso/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /avançar/i })).toBeInTheDocument();
  });

  it('shows a labeled collapse and retries the same phase', () => {
    render(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /começar jornada/i }));
    fireEvent.click(screen.getByRole('button', { name: /escolher signos/i }));
    fireEvent.click(screen.getByRole('button', { name: /áries/i }));
    fireEvent.click(screen.getByRole('button', { name: /leão/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirmar escolha/i }));

    expect(screen.getByRole('heading', { name: /colapso/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /tentar novamente/i }));
    expect(screen.getByRole('heading', { name: /sopa primordial/i })).toBeInTheDocument();
    expect(screen.getByText('FASE 1 / 6')).toBeInTheDocument();
  });

  it('allows a partial pair to advance to the next phase', () => {
    render(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /começar jornada/i }));
    fireEvent.click(screen.getByRole('button', { name: /escolher signos/i }));
    fireEvent.click(screen.getByRole('button', { name: /virgem/i }));
    fireEvent.click(screen.getByRole('button', { name: /capricórnio/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirmar escolha/i }));

    expect(screen.getByRole('heading', { name: /instável/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }));
    expect(screen.getByRole('heading', { name: /nascimento dos oceanos/i })).toBeInTheDocument();
    expect(screen.getByText('FASE 2 / 6')).toBeInTheDocument();
  });

  it('lets a keyboard-only player start the journey and reach sign choices', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.tab();
    expect(screen.getByRole('button', { name: /começar jornada/i })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.tab();
    expect(screen.getByRole('button', { name: /escolher signos/i })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: /touro/i })).toHaveFocus();
    await user.keyboard('{Enter}');
    for (let index = 0; index < 8; index += 1) await user.tab();
    expect(screen.getByRole('button', { name: /capricórnio/i })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.tab();
    expect(screen.getByRole('button', { name: /confirmar escolha/i })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('heading', { name: /sucesso/i })).toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole('button', { name: /avançar/i })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('heading', { name: /nascimento dos oceanos/i })).toBeInTheDocument();
  });

  it('starts at the home screen when a new page instance is loaded', () => {
    const { unmount } = render(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /começar jornada/i }));
    expect(screen.getByRole('heading', { name: /sopa primordial/i })).toBeInTheDocument();

    unmount();
    render(<Home />);

    expect(screen.getByRole('heading', { name: /astro ville/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /começar jornada/i })).toBeInTheDocument();
  });

  it('opens the guide and closes it with its close button, start button, or Escape', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole('button', { name: /como jogar/i }));
    expect(screen.getByRole('dialog', { name: /como jogar astroville/i })).toBeInTheDocument();
    for (const step of [
      'Observe a Era Planetária',
      'Escolha 2 Signos do Zodíaco',
      'Confirme e Testemunhe a Sinergia',
      'Alcance o Horizonte Estelar',
    ]) {
      expect(screen.getByRole('heading', { name: step })).toBeInTheDocument();
    }
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /como jogar/i }));
    await user.click(screen.getByRole('button', { name: /fechar como jogar/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /como jogar/i }));
    await user.click(screen.getByRole('button', { name: /entendido, iniciar/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('finishes all six phases and starts a fresh journey again', () => {
    render(<Home />);
    const pairs = [
      ['Touro', 'Capricórnio'], ['Câncer', 'Peixes'], ['Virgem', 'Touro'],
      ['Gêmeos', 'Libra'], ['Capricórnio', 'Aquário'], ['Sagitário', 'Aquário'],
    ];
    fireEvent.click(screen.getByRole('button', { name: /começar jornada/i }));
    fireEvent.click(screen.getByRole('button', { name: /escolher signos/i }));

    for (let index = 0; index < pairs.length; index += 1) {
      for (const sign of pairs[index]) fireEvent.click(screen.getByRole('button', { name: new RegExp(sign, 'i') }));
      fireEvent.click(screen.getByRole('button', { name: /confirmar escolha/i }));
      const outcome = screen.getByRole('region', { name: /resultado da fase/i });
      const advance = within(outcome).getByRole('button', { name: /avançar|continuar/i });
      fireEvent.click(advance);
    }

    expect(screen.getByRole('heading', { name: /humanidade prosperou/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /jogar novamente/i }));
    expect(screen.getByRole('heading', { name: /astro ville/i })).toBeInTheDocument();
  });

  it('completes the journey when the sixth phase ends in partial success', () => {
    render(<Home />);
    const pairs = [
      ['Touro', 'Capricórnio'], ['Câncer', 'Peixes'], ['Virgem', 'Touro'],
      ['Gêmeos', 'Libra'], ['Capricórnio', 'Aquário'], ['Sagitário', 'Leão'],
    ];
    fireEvent.click(screen.getByRole('button', { name: /começar jornada/i }));
    fireEvent.click(screen.getByRole('button', { name: /escolher signos/i }));

    for (let index = 0; index < pairs.length; index += 1) {
      for (const sign of pairs[index]) fireEvent.click(screen.getByRole('button', { name: new RegExp(sign, 'i') }));
      fireEvent.click(screen.getByRole('button', { name: /confirmar escolha/i }));
      const outcome = screen.getByRole('region', { name: /resultado da fase/i });
      if (index === pairs.length - 1) {
        expect(within(outcome).getByRole('heading', { name: /instável/i })).toBeInTheDocument();
      }
      fireEvent.click(within(outcome).getByRole('button', { name: /avançar|continuar/i }));
    }

    expect(screen.getByRole('heading', { name: /humanidade prosperou/i })).toBeInTheDocument();
  });
});
