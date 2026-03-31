import { test as setup } from '@fixtures/app.fixture';
import * as path from 'path';

const authFile = path.join(__dirname, '../../storage-states/user-state.json');

setup('Authenticate', async ({ page, loginPage }) => {
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;

  await loginPage.open('/login');
  await loginPage.login(email, password);

  await page.context().storageState({ path: authFile });
});
