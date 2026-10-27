const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'desktop', width: 1440, height: 900, columns: 4 },
  { name: 'tablet', width: 768, height: 1024, columns: 3 },
  { name: 'mobile', width: 390, height: 844, columns: 2 },
];

const laterPhasePairs = [
  ['Touro', 'Câncer'],
  ['Virgem', 'Touro'],
  ['Gêmeos', 'Libra'],
  ['Capricórnio', 'Aquário'],
];
async function choosePair(page, pair, result, expectedPhase) {
  for (const sign of pair) await page.getByRole('button', { name: new RegExp(sign, 'i') }).click();
  await page.getByRole('button', { name: /confirmar escolha/i }).click();
  await expect(page.getByRole('heading', { name: new RegExp(result, 'i') })).toBeVisible();
  await expect(page.locator('.result-screen .eyebrow')).toContainText(`FASE ${expectedPhase} ·`);
  const expectedAsset = result === 'colapso'
    ? '/planets/colapso.svg'
    : `/planets/fase-${expectedPhase}-${result === 'sucesso' ? 'sucesso' : 'instavel'}.svg`;
  const resultImage = page.locator('.result-icon');
  await expect(resultImage).toHaveAttribute('src', expectedAsset);
  await expect.poll(() => resultImage.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  await expectFullyVisibleAfterScroll(page, page.locator('.result-screen'));
  await expectNoHorizontalOverflow(page);
  await expectTouchTarget(page.locator('.result-screen button'));
}

async function expectTouchTarget(button) {
  const box = await button.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
}

async function expectFullyVisibleAfterScroll(page, element) {
  await element.scrollIntoViewIfNeeded();
  const box = await element.boundingBox();
  const viewport = page.viewportSize();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
}

async function expectNoHorizontalOverflow(page) {
  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
}

for (const viewport of viewports) {
  test(`full journey fits and works at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');

    await page.keyboard.press('Tab');
    const start = page.getByRole('button', { name: /começar jornada/i });
    await expect(start).toBeFocused();
    await expectTouchTarget(start);
    const focusStyle = await start.evaluate((button) => ({
      style: getComputedStyle(button).outlineStyle,
      width: getComputedStyle(button).outlineWidth,
    }));
    expect(focusStyle).toEqual({ style: 'solid', width: '3px' });
    await start.click();
    const introAction = page.getByRole('button', { name: /escolher signos/i });
    await expectFullyVisibleAfterScroll(page, page.locator('.intro-screen'));
    await expectTouchTarget(introAction);
    await introAction.click();

    await expectFullyVisibleAfterScroll(page, page.locator('.game-header'));
    const grid = page.locator('.zodiac-grid');
    await expect(grid).toBeVisible();
    await expectFullyVisibleAfterScroll(page, page.locator('.phase-copy'));
    await expectFullyVisibleAfterScroll(page, grid);
    const columns = await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(viewport.columns);
    const visualStyle = await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      headingFont: getComputedStyle(document.querySelector('#phase-title')).fontFamily,
      cardSurface: getComputedStyle(document.querySelector('.zodiac-card')).backgroundColor,
      cardRadius: getComputedStyle(document.querySelector('.zodiac-card')).borderRadius,
    }));
    expect(visualStyle.background).toBe('rgb(9, 11, 26)');
    expect(visualStyle.headingFont).toContain('Space Grotesk');
    expect(visualStyle.cardSurface).toBe('rgb(17, 21, 43)');
    expect(visualStyle.cardRadius).toBe('16px');

    await expectNoHorizontalOverflow(page);

    const signButtons = await page.locator('.zodiac-card').all();
    expect(signButtons).toHaveLength(12);
    const boxes = await Promise.all(signButtons.map((button) => button.boundingBox()));
    for (const box of boxes) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    for (const button of signButtons) await expectFullyVisibleAfterScroll(page, button);
    for (let first = 0; first < boxes.length; first += 1) {
      for (let second = first + 1; second < boxes.length; second += 1) {
        const overlaps = boxes[first].x < boxes[second].x + boxes[second].width
          && boxes[first].x + boxes[first].width > boxes[second].x
          && boxes[first].y < boxes[second].y + boxes[second].height
          && boxes[first].y + boxes[first].height > boxes[second].y;
        expect(overlaps).toBe(false);
      }
    }
    await expectTouchTarget(page.getByRole('button', { name: /confirmar escolha/i }));
    await expectFullyVisibleAfterScroll(page, page.locator('.selection-footer'));
    const sectionBounds = await page.evaluate(() => ['.game-header', '.phase-copy', '.zodiac-grid', '.selection-footer'].map((selector) => {
      const { x, y, width, height } = document.querySelector(selector).getBoundingClientRect();
      return { x, y, width, height };
    }));
    for (let index = 0; index < sectionBounds.length - 1; index += 1) {
      expect(sectionBounds[index].y + sectionBounds[index].height).toBeLessThanOrEqual(sectionBounds[index + 1].y + 1);
    }
    const rows = await grid.evaluate((element) => getComputedStyle(element).gridTemplateRows.split(' ').length);
    expect(rows).toBe(Math.ceil(12 / viewport.columns));

    const phaseHeading = await page.locator('#phase-title').boundingBox();
    const gridBounds = await grid.boundingBox();
    const phaseCopyBounds = await page.locator('.phase-copy').boundingBox();
    const headerBounds = await page.locator('.game-header').boundingBox();
    const footerBounds = await page.locator('.selection-footer').boundingBox();
    expect(gridBounds.y).toBeGreaterThan(phaseHeading.y + phaseHeading.height);
    expect(gridBounds.width * gridBounds.height).toBeGreaterThan(phaseHeading.width * phaseHeading.height);
    expect(gridBounds.width * gridBounds.height).toBeGreaterThan(phaseCopyBounds.width * phaseCopyBounds.height);
    expect(gridBounds.width * gridBounds.height).toBeGreaterThan(headerBounds.width * headerBounds.height);
    expect(gridBounds.width * gridBounds.height).toBeGreaterThan(footerBounds.width * footerBounds.height);

    await choosePair(page, ['Áries', 'Leão'], 'colapso', 1);
    await page.getByRole('button', { name: /tentar novamente/i }).click();
    await choosePair(page, ['Touro', 'Capricórnio'], 'sucesso', 1);
    await page.getByRole('button', { name: /avançar/i }).click();

    await choosePair(page, laterPhasePairs[0], 'instável', 2);
    await page.getByRole('button', { name: /continuar/i }).click();
    await choosePair(page, laterPhasePairs[1], 'sucesso', 3);
    await page.getByRole('button', { name: /avançar/i }).click();
    await choosePair(page, laterPhasePairs[2], 'sucesso', 4);
    await page.getByRole('button', { name: /avançar/i }).click();
    await choosePair(page, laterPhasePairs[3], 'sucesso', 5);
    await page.getByRole('button', { name: /avançar/i }).click();
    await choosePair(page, ['Sagitário', 'Aquário'], 'sucesso', 6);
    await page.getByRole('button', { name: /avançar/i }).click();
    await expect(page.getByRole('heading', { name: /humanidade prosperou/i })).toBeVisible();
    await expectTouchTarget(page.getByRole('button', { name: /jogar novamente/i }));
    await expectFullyVisibleAfterScroll(page, page.locator('.final-screen'));
    await expectNoHorizontalOverflow(page);
  });
}

test('keyboard-only play can choose, confirm, advance, collapse, and retry', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /escolher signos/i })).toBeFocused();
  await page.keyboard.press('Enter');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const bull = page.getByRole('button', { name: /touro/i });
  await expect(bull).toBeFocused();
  const signFocusStyle = await bull.evaluate((button) => ({
    outline: getComputedStyle(button).outlineStyle,
    width: getComputedStyle(button).outlineWidth,
  }));
  expect(signFocusStyle).toEqual({ outline: 'solid', width: '3px' });
  await page.keyboard.press('Enter');
  for (let index = 0; index < 8; index += 1) await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /capricórnio/i })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /confirmar escolha/i })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: /sucesso/i })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /avançar/i })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: /nascimento dos oceanos/i })).toBeVisible();

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  for (let index = 0; index < 4; index += 1) await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /leão/i })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: /colapso/i })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /tentar novamente/i })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: /nascimento dos oceanos/i })).toBeVisible();
});

test('reduced-motion preference disables transitions without blocking play', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: /começar jornada/i }).click();
  await page.getByRole('button', { name: /escolher signos/i }).click();

  const transitionDuration = await page.locator('.zodiac-card').first().evaluate((button) => getComputedStyle(button).transitionDuration);
  expect(transitionDuration).toBe('0s');
  await choosePair(page, ['Touro', 'Capricórnio'], 'sucesso', 1);
});
