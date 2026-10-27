const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'desktop', width: 1440, height: 1000, stackedCards: false },
  { name: 'tablet', width: 768, height: 1024, stackedCards: false },
  { name: 'mobile', width: 390, height: 844, stackedCards: true },
  { name: 'small mobile', width: 320, height: 640, stackedCards: true },
];

for (const viewport of viewports) {
  test(`home screen content fits ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /astro\s*ville/i })).toBeVisible();
    await expect(page.getByText('O destino da Terra está nas estrelas.')).toBeVisible();
    await expect(page.getByRole('button', { name: /começar jornada/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /como jogar/i })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Terra em uma órbita cósmica: atmosfera 100%, sinergia elemental' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Planeta Terra azul e verde' })).toBeVisible();
    await expect(page.getByRole('navigation')).toHaveCount(0);

    const cards = page.getByRole('article');
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0).getByRole('heading', { name: '6 Eras de Evolução' })).toBeVisible();
    await expect(cards.nth(1).getByRole('heading', { name: '12 Forças Zodiacais' })).toBeVisible();
    await expect(cards.nth(2).getByRole('heading', { name: '3 Destinos Planetários' })).toBeVisible();
    await expect(page.getByText(/todos os direitos reservados/i)).toBeVisible();
    const boxes = await cards.evaluateAll((elements) => elements.map((element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    }));
    expect(boxes.every((box) => box.width > 0 && box.height > 0)).toBe(true);
    if (viewport.stackedCards) {
      expect(boxes[1].y).toBeGreaterThanOrEqual(boxes[0].y + boxes[0].height);
      expect(boxes[2].y).toBeGreaterThanOrEqual(boxes[1].y + boxes[1].height);
    } else {
      expect(boxes[1].y).toBe(boxes[0].y);
      expect(boxes[2].y).toBe(boxes[0].y);
    }

    const dimensions = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);

    await page.keyboard.press('Tab');
    const start = page.getByRole('button', { name: /começar jornada/i });
    await expect(start).toBeFocused();
    const focusStyle = await start.evaluate((button) => ({
      style: getComputedStyle(button).outlineStyle,
      width: getComputedStyle(button).outlineWidth,
    }));
    expect(focusStyle).toEqual({ style: 'solid', width: '3px' });

    await page.keyboard.press('Tab');
    const help = page.getByRole('button', { name: /como jogar/i });
    await expect(help).toBeFocused();
    await page.keyboard.press('Enter');
    const guide = page.getByRole('dialog', { name: 'Como Jogar AstroVille' });
    await expect(guide).toBeVisible();
    await expect(guide.getByRole('listitem')).toHaveCount(4);
    await page.keyboard.press('Escape');
    await expect(guide).toBeHidden();

    await page.getByRole('button', { name: /começar jornada/i }).click();
    await expect(page.getByRole('heading', { name: /sopa primordial/i })).toBeVisible();
  });
}

test('home screen guide can be read and dismissed before starting a journey', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /como jogar/i }).click();

  const guide = page.getByRole('dialog', { name: 'Como Jogar AstroVille' });
  await expect(guide).toBeVisible();
  await expect(guide.getByRole('listitem')).toHaveCount(4);
  await expect(guide.getByRole('heading', { name: 'Observe a Era Planetária' })).toBeVisible();
  await expect(guide.getByRole('heading', { name: 'Escolha 2 Signos do Zodíaco' })).toBeVisible();
  await expect(guide.getByRole('heading', { name: 'Confirme e Testemunhe a Sinergia' })).toBeVisible();
  await expect(guide.getByRole('heading', { name: 'Alcance o Horizonte Estelar' })).toBeVisible();
  await expect(guide.getByText(/sobreviva às 6 eras/i)).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(guide).toBeHidden();

  await page.getByRole('button', { name: /como jogar/i }).click();
  await page.getByRole('button', { name: /fechar como jogar/i }).click();
  await expect(guide).toBeHidden();

  await page.getByRole('button', { name: /como jogar/i }).click();
  await page.getByRole('button', { name: /entendido, iniciar/i }).click();
  await expect(guide).toBeHidden();

  await page.getByRole('button', { name: /como jogar/i }).click();
  await page.mouse.click(4, 4);
  await expect(guide).toBeHidden();

  await page.getByRole('button', { name: /começar jornada/i }).click();
  await expect(page.getByRole('heading', { name: /sopa primordial/i })).toBeVisible();
});

test('guide remains within a short mobile viewport and its actions can be reached by scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 400 });
  await page.goto('/');
  await page.getByRole('button', { name: /como jogar/i }).click();

  const guide = page.getByRole('dialog', { name: 'Como Jogar AstroVille' });
  const bounds = await guide.boundingBox();
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(400);

  for (const title of [
    'Observe a Era Planetária',
    'Escolha 2 Signos do Zodíaco',
    'Confirme e Testemunhe a Sinergia',
    'Alcance o Horizonte Estelar',
  ]) {
    const step = guide.getByRole('heading', { name: title });
    await step.scrollIntoViewIfNeeded();
    await expect(step).toBeInViewport();
  }

  const finish = guide.getByRole('button', { name: /entendido, iniciar/i });
  await finish.scrollIntoViewIfNeeded();
  await expect(finish).toBeInViewport();

  const close = guide.getByRole('button', { name: /fechar como jogar/i });
  await close.scrollIntoViewIfNeeded();
  await expect(close).toBeInViewport();
  await close.click();
  await expect(guide).toBeHidden();
});
