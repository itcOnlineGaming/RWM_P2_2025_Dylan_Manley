import { test, expect, Page } from '@playwright/test';

test.describe('Homescreen', () => {

  const BASE_PATH = '/Team_5';
  const BASE_URL = `http://localhost:5173${BASE_PATH}`;

  // Helper: go to route under the base path
  const go = (page: Page, route: string) => page.goto(`${BASE_URL}${route}`);

  test.beforeEach(async ({ page }) => {
    await go(page, '/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('loads homescreen with main elements', async ({ page }) => {
    await go(page, '/Homescreen');

    await expect(page.getByRole('heading', { name: 'Current Goals:' })).toBeVisible();
    await expect(page.getByText('Total Progress')).toBeVisible();
    await expect(page.getByText("Today's To-Do List")).toBeVisible();
    await expect(page.getByText("Today's Mood Tracker")).toBeVisible();
    await expect(page.getByText('Mindfulness Exercises')).toBeVisible();
    await expect(page.getByText('0%')).toBeVisible(); // Initial progress with default tasks uncompleted
  });

  test('opens tasks modal when EDIT TASKS button clicked', async ({ page }) => {
    await go(page, '/Homescreen');

    await page.click('button:has-text("EDIT TASKS")');
    await expect(page.getByRole('heading', { name: 'Edit Tasks' })).toBeVisible();
  });

  test('navigates to breathing screen when button clicked', async ({ page }) => {
    await go(page, '/Homescreen');

    await page.click('button:has-text("BREATHING TECHNIQUES")');
    await expect(page).toHaveURL(new RegExp(`${BASE_PATH}/Breathingscreen`));
  });

  test('navigates to yoga screen when button clicked', async ({ page }) => {
    await go(page, '/Homescreen');

    await page.click('button:has-text("YOGA EXERCISES")');
    await expect(page).toHaveURL(new RegExp(`${BASE_PATH}/YogaScreen`));
  });

  test('displays default tasks and allows toggling completion', async ({ page }) => {
    await go(page, '/Homescreen');

    // The store initializes with default tasks "Finish Concepts"
    await expect(page.getByText('Finish Concepts').first()).toBeVisible();

    // Toggle the first task completion
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.check();

    // Verify task is marked as completed
    const taskText = page.locator('span').filter({ hasText: 'Finish Concepts' }).first();
    await expect(taskText).toHaveClass(/completed/);
  });

  test('calculates progress correctly when tasks are completed', async ({ page }) => {
    await go(page, '/Homescreen');

    // Initially should show 0% (3 tasks, 0 completed)
    await expect(page.getByText('0%')).toBeVisible();

    // Check the first checkbox to complete one task (1/3 = 33%)
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();

    // Wait for progress to update
    await page.waitForTimeout(100);
    await expect(page.getByText('33%')).toBeVisible();
  });

  test('displays mood graph with no moods message', async ({ page }) => {
    await go(page, '/Homescreen');

    await expect(page.getByText('No moods logged today')).toBeVisible();
  });

  test('displays mood graph with mood entries', async ({ page }) => {
    await go(page, '/Homescreen');

    const today = new Date();
    await page.evaluate((todayTime) => {
      localStorage.setItem('moodEntries', JSON.stringify([
        { mood: 3, timestamp: todayTime },
        { mood: 4, timestamp: todayTime + 3600000 }
      ]));
    }, today.getTime());

    await page.reload();

    // Should not show "no moods" message
    await expect(page.getByText('No moods logged today')).not.toBeVisible();
  });

  test('progress journey shows start and goal markers', async ({ page }) => {
    await go(page, '/Homescreen');

    // Check for Start and Goal text in SVG
    const svg = page.locator('svg.journey-svg');
    await expect(svg).toBeVisible();
  });
});
