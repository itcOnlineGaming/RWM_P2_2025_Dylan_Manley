import { test, expect, Page, Route } from '@playwright/test';

test.describe('Mood Response Screen', () => {

  const BASE_PATH = '/Team_5';
  const BASE_URL = `http://localhost:5173${BASE_PATH}`;

  // Helper: go to route under the base path
  const go = (page:Page, route: string) => page.goto(`${BASE_URL}${route}`);

  test.beforeEach(async ({ page }) => {
    await go(page, '/');
    await page.evaluate(() => localStorage.clear());
  });

  test('red mood (mood=0)', async ({ page }) => {
    await go(page, '/MoodScreen/MoodResponse?mood=0');

    await expect(page.getByText('Oh No!')).toBeVisible();
  });

  test('orange mood (mood=1)', async ({ page }) => {
    await go(page, '/MoodScreen/MoodResponse?mood=1');

    await expect(page.getByText('You might need a break.')).toBeVisible();
  });

  test('yellow mood (mood=2)', async ({ page }) => {
    await go(page, '/MoodScreen/MoodResponse?mood=2');

    await expect(page.getByText('Good to Know!')).toBeVisible();
  });

  test('lime mood (mood=3)', async ({ page }) => {
    await go(page, '/MoodScreen/MoodResponse?mood=3');

    await expect(page.getByText('Wonderful!')).toBeVisible();
  });

  test('green mood (mood=4)', async ({ page }) => {
    await go(page, '/MoodScreen/MoodResponse?mood=4');

    await expect(page.getByText('Thats great to hear!')).toBeVisible();
  });

  test('saves mood and navigates to HomeScreen', async ({ page }) => {
    await go(page, '/MoodScreen/MoodResponse?mood=2');

    await page.click('.continueButton');
    await expect(page).toHaveURL(new RegExp(`${BASE_PATH}/Homescreen`));

    const entries = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('moodEntries') || '[]')
    );

    expect(entries.length).toBe(1);
    expect(entries[0].mood).toBe(3);
  });

  test('shows support buttons on third low mood', async ({ page }) => {
    await go(page, '/');
    await page.evaluate(() => {
      localStorage.setItem('moodEntries', JSON.stringify([
        { mood: 1, timestamp: Date.now() - 20000 },
        { mood: 2, timestamp: Date.now() - 10000 }
      ]));
    });

    await go(page, '/MoodScreen/MoodResponse?mood=0');

    await expect(page.getByText("Looks like you're having a rough day")).toBeVisible();
    await expect(page.getByText('Try some breathing excercises')).toBeVisible();
    await expect(page.getByText('Try some Yoga')).toBeVisible();
  });


  test('mixed moods do NOT trigger support buttons', async ({ page }) => {
    await go(page, '/');
    await page.evaluate(() => {
      localStorage.setItem('moodEntries', JSON.stringify([
        { mood: 1, timestamp: Date.now() - 30000 },
        { mood: 5, timestamp: Date.now() - 20000 },
        { mood: 4, timestamp: Date.now() - 10000 }
      ]));
    });

    await go(page, '/MoodScreen/MoodResponse?mood=0');

    await expect(page.getByText('Try some breathing excercises')).not.toBeVisible();
  });

});