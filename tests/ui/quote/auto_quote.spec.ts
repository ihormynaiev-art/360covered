import { test, expect } from '@fixtures/app.fixture';

test.describe('Auto Quote Flow', () => {

  test('User can fill the Auto quote form and submit', async ({ homePage, page }) => {
    await homePage.open('/');

    await homePage.fillAutoQuoteForm('1HGCM82633A004', '50000', 'California');

    await homePage.submitQuote();

    // await expect(page).toHaveURL(/.*step2/);
  });

});
