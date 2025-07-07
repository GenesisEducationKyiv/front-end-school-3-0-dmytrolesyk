import { test as base, expect } from '@playwright/test';
import { getContainerInfoFromFile } from 'tests/utils/get-container-info-from-file';

const API_URL = 'http://localhost:8000';

const test = base.extend({
  page: async ({ page }, use) => {
    const { host, port } = await getContainerInfoFromFile();
    await page.route(`${API_URL}/**`, async route => {
      const url = route.request().url();
      const newUrl = url.replace(API_URL, `http://${host}:${String(port)}`);
      await route.continue({ url: newUrl });
    });

    await use(page);
  },
});

export { test, expect };
