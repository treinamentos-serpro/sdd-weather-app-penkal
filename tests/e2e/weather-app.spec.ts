import { expect, type Page, type Route, test } from '@playwright/test';

import { forecastFixtures } from '../fixtures/forecast';
import { type GeocodingPayloadFixture, geocodingFixtures } from '../fixtures/geocoding';

const geocodingUrl = /geocoding-api\.open-meteo\.com\/v1\/search/;
const forecastUrl = /api\.open-meteo\.com\/v1\/forecast/;

const secondCityForecast = {
  ...forecastFixtures.success,
  current: {
    ...forecastFixtures.success.current,
    temperature_2m: 10,
    weather_code: 3,
  },
};

async function fulfillJson(route: Route, payload: unknown, status = 200): Promise<void> {
  await route.fulfill({ json: payload, status });
}

async function mockSuccessfulApis(page: Page): Promise<void> {
  await page.route(geocodingUrl, (route) =>
    fulfillJson(route, geocodingFixtures.successWithHomonyms),
  );
  await page.route(forecastUrl, (route) => fulfillJson(route, forecastFixtures.success));
}

async function submitSearch(page: Page, query: string): Promise<void> {
  const input = page.getByRole('textbox', { name: 'Nome da cidade' });
  await input.fill(query);
  await input.press('Enter');
}

async function selectFirstResult(page: Page): Promise<void> {
  await page
    .getByRole('list', { name: 'Localidades encontradas' })
    .getByRole('button')
    .first()
    .click();
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const layout = await page.evaluate(() => {
    const interactiveElements = Array.from(
      document.querySelectorAll<HTMLElement>('button, input'),
    ).map((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        left: bounds.left,
        right: bounds.right,
        width: bounds.width,
      };
    });

    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      interactiveElements,
    };
  });

  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
  for (const bounds of layout.interactiveElements) {
    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.left).toBeGreaterThanOrEqual(0);
    expect(bounds.right).toBeLessThanOrEqual(layout.viewportWidth);
  }
}

test('T-44/T-41 RF1-RF4/RF9: conclui o fluxo principal por teclado em 390 x 844', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockSuccessfulApis(page);
  await page.goto('/');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const searchInput = page.getByRole('textbox', { name: 'Nome da cidade' });
  await expect(searchInput).toBeFocused();
  await searchInput.pressSequentially('São Paulo');
  await searchInput.press('Enter');

  const results = page.getByRole('list', { name: 'Localidades encontradas' });
  await expect(results.getByRole('button')).toHaveCount(3);
  await expect(results).toContainText('São Paulo');
  await expect(results).toContainText('Minas Gerais');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const firstResult = results.getByRole('button').first();
  await expect(firstResult).toBeFocused();
  await expect(firstResult).toHaveCSS('box-shadow', /rgb/);
  await page.keyboard.press('Enter');

  const currentWeather = page.getByRole('region', { name: 'Clima atual' });
  await expect(currentWeather).toContainText('São Paulo, Brazil');
  await expect(currentWeather).toContainText('22 °C');
  const forecast = page.getByRole('list', { name: 'Previsão diária' });
  await expect(forecast.getByRole('listitem')).toHaveCount(5);
  for (const date of [
    '16 de setembro',
    '17 de setembro',
    '18 de setembro',
    '19 de setembro',
    '20 de setembro',
  ]) {
    await expect(forecast).toContainText(date);
  }
  await expectNoHorizontalOverflow(page);
});

test('T-39 RF5-RF6: converte temperaturas e preserva Fahrenheit em uma nova busca', async ({
  page,
}) => {
  let forecastRequests = 0;
  await page.route(geocodingUrl, (route) =>
    fulfillJson(route, geocodingFixtures.successWithHomonyms),
  );
  await page.route(forecastUrl, async (route) => {
    forecastRequests += 1;
    await fulfillJson(
      route,
      forecastRequests === 1 ? forecastFixtures.success : secondCityForecast,
    );
  });
  await page.goto('/');

  await submitSearch(page, 'São Paulo');
  await selectFirstResult(page);
  await expect(page.getByRole('region', { name: 'Clima atual' })).toContainText('22 °C');

  await page.getByRole('radio', { name: 'Fahrenheit (F)' }).check();
  await expect(page.getByRole('region', { name: 'Clima atual' })).toContainText('72 °F');
  await expect(page.getByRole('list', { name: 'Previsão diária' })).toContainText('57 °F');
  expect(forecastRequests).toBe(1);

  await submitSearch(page, 'São Paulo novamente');
  await page
    .getByRole('list', { name: 'Localidades encontradas' })
    .getByRole('button')
    .nth(1)
    .click();

  await expect(page.getByRole('radio', { name: 'Fahrenheit (F)' })).toBeChecked();
  await expect(page.getByRole('region', { name: 'Clima atual' })).toContainText('50 °F');
  await expect(page.getByRole('list', { name: 'Previsão diária' })).toContainText('°F');
  expect(forecastRequests).toBe(2);
});

test('T-40 RF7-RF8: diferencia vazio de erro e repete a busca com o termo preservado', async ({
  page,
}) => {
  let failedSearchAttempts = 0;
  await page.route(geocodingUrl, async (route) => {
    const query = new URL(route.request().url()).searchParams.get('name');

    if (query === 'Sem resultados') {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await fulfillJson(route, geocodingFixtures.emptyResults);
      return;
    }

    failedSearchAttempts += 1;
    if (failedSearchAttempts === 1) {
      await fulfillJson(route, { reason: 'Serviço indisponível' }, 503);
      return;
    }
    await fulfillJson(route, geocodingFixtures.successWithHomonyms);
  });
  await page.goto('/');

  await submitSearch(page, 'Sem resultados');
  await expect(page.getByRole('status')).toHaveText('Buscando localidades...');
  await expect(page.getByRole('status')).toHaveText(
    'Nenhuma localidade foi encontrada para esta busca.',
  );
  await expect(page.getByRole('alert')).toHaveCount(0);

  await submitSearch(page, 'Busca preservada');
  await expect(page.getByRole('alert')).toContainText('Não foi possível buscar localidades.');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();

  await expect(page.getByRole('list', { name: 'Localidades encontradas' })).toBeVisible();
  expect(failedSearchAttempts).toBe(2);
});

test('T-40 RF7-RF8: encerra busca sem resposta em dez segundos e oferece retry', async ({
  page,
}) => {
  test.setTimeout(20_000);
  await page.route(geocodingUrl, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 11_000));
    await fulfillJson(route, geocodingFixtures.successWithHomonyms).catch(() => undefined);
  });
  await page.goto('/');

  await submitSearch(page, 'Busca lenta');
  await expect(page.getByRole('status')).toHaveText('Buscando localidades...');
  await expect(page.getByRole('alert')).toContainText('tempo limite', { timeout: 11_000 });
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
});

test('T-40 RF7-RF8: repete a previsão para a mesma cidade após uma falha', async ({ page }) => {
  let forecastAttempts = 0;
  await page.route(geocodingUrl, (route) =>
    fulfillJson(route, geocodingFixtures.successWithHomonyms),
  );
  await page.route(forecastUrl, async (route) => {
    forecastAttempts += 1;
    if (forecastAttempts === 1) {
      await fulfillJson(route, { reason: 'Serviço indisponível' }, 503);
      return;
    }
    await fulfillJson(route, forecastFixtures.success);
  });
  await page.goto('/');

  await submitSearch(page, 'São Paulo');
  await selectFirstResult(page);
  await expect(page.getByRole('alert')).toContainText('Não foi possível consultar o clima.');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();

  await expect(page.getByRole('region', { name: 'Clima atual' })).toContainText(
    'São Paulo, Brazil',
  );
  expect(forecastAttempts).toBe(2);
});

test('T-41 RF9-RF10: mantém somente o resultado da busca mais recente', async ({ page }) => {
  const cityResult = (name: string, id: number): GeocodingPayloadFixture => ({
    results: [
      {
        ...geocodingFixtures.successWithHomonyms.results[0],
        id,
        name,
      },
    ],
  });

  await page.route(geocodingUrl, async (route) => {
    const query = new URL(route.request().url()).searchParams.get('name');
    if (query === 'Cidade antiga') {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await fulfillJson(route, cityResult('Cidade antiga', 1)).catch(() => undefined);
      return;
    }
    await fulfillJson(route, cityResult('Cidade nova', 2));
  });
  await page.goto('/');

  const input = page.getByRole('textbox', { name: 'Nome da cidade' });
  await input.fill('Cidade antiga');
  await input.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Buscando localidades...');
  await input.fill('Cidade nova');
  await input.press('Enter');

  const results = page.getByRole('list', { name: 'Localidades encontradas' });
  await expect(results).toContainText('Cidade nova');
  await expect(results).not.toContainText('Cidade antiga');
  await page.waitForTimeout(400);
  await expect(results).toContainText('Cidade nova');
  await expect(results).not.toContainText('Cidade antiga');
});

test('T-42 RNF1: mantém controles dentro dos viewports e engines configurados', async ({
  page,
}) => {
  await mockSuccessfulApis(page);
  await page.goto('/');
  await submitSearch(page, 'São Paulo');
  await selectFirstResult(page);

  await expect(page.getByRole('list', { name: 'Previsão diária' })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
