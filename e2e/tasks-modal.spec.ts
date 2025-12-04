import { test, expect, Page } from '@playwright/test';

test.describe('Tasks Modal', () => {

  const BASE_PATH = '/Team_5';
  const BASE_URL = `http://localhost:5173${BASE_PATH}`;

  const go = (page: Page, route: string) => page.goto(`${BASE_URL}${route}`);

  test.beforeEach(async ({ page }) => {
    await go(page, '/');
    await page.evaluate(() => localStorage.clear());
    await go(page, '/Homescreen');

    // Open the tasks modal
    await page.click('button:has-text("EDIT TASKS")');
    await expect(page.getByRole('heading', { name: 'Edit Tasks' })).toBeVisible();
  });

  test('modal opens and displays all sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Edit Tasks' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add New Task' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your Tasks' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SAVE & CLOSE' })).toBeVisible();

    // Should show 3 default tasks
    const taskItems = page.locator('.task-item-edit');
    await expect(taskItems).toHaveCount(3);
  });

  test('adds a new task', async ({ page }) => {
    const taskInput = page.locator('.task-input');
    const taskItems = page.locator('.task-item-edit');

    // Count initial tasks
    const initialCount = await taskItems.count();

    await taskInput.fill('New Test Task');
    await page.click('button:has-text("ADD +")');

    // Wait for task to be added
    await page.waitForTimeout(200);

    // Verify task count increased
    await expect(taskItems).toHaveCount(initialCount + 1);

    // Verify input field was cleared
    await expect(taskInput).toHaveValue('');
  });

  test('adds task with Enter key', async ({ page }) => {
    const taskInput = page.locator('.task-input');
    const taskItems = page.locator('.task-item-edit');

    // Count initial tasks
    const initialCount = await taskItems.count();

    await taskInput.fill('Task via Enter');
    await taskInput.press('Enter');

    // Wait for task to be added
    await page.waitForTimeout(200);

    // Verify task count increased
    await expect(taskItems).toHaveCount(initialCount + 1);

    // Verify input field was cleared
    await expect(taskInput).toHaveValue('');
  });

  test('does not add empty task', async ({ page }) => {
    const taskInput = page.locator('.task-input');
    await taskInput.fill('   ');

    // Count tasks before attempting to add empty task
    const taskItems = page.locator('.task-item-edit');
    const initialCount = await taskItems.count();

    await page.click('button:has-text("ADD +")');
    await page.waitForTimeout(100);

    // Should still have same number of tasks (no new task added)
    await expect(taskItems).toHaveCount(initialCount);
  });

  test('removes a task', async ({ page }) => {
    const taskItems = page.locator('.task-item-edit');

    // Count initial tasks
    const initialCount = await taskItems.count();

    // Remove the first task
    await page.locator('.remove-btn').first().click();
    await page.waitForTimeout(200);

    // Verify task count decreased
    await expect(taskItems).toHaveCount(initialCount - 1);
  });

  test('toggles task completion', async ({ page }) => {
    // Use one of the existing default tasks
    const firstCheckbox = page.locator('.task-checkbox').first();
    const firstTaskInput = page.locator('.task-text-input').first();

    // Check the checkbox
    await firstCheckbox.check();
    await page.waitForTimeout(100);

    // Verify task has completed class
    await expect(firstTaskInput).toHaveClass(/completed/);

    // Uncheck the checkbox
    await firstCheckbox.uncheck();
    await page.waitForTimeout(100);

    // Verify completed class is removed
    await expect(firstTaskInput).not.toHaveClass(/completed/);
  });

  test('edits task text', async ({ page }) => {
    // Use one of the existing default tasks
    const taskTextInput = page.locator('.task-text-input').first();
    await taskTextInput.clear();
    await taskTextInput.fill('Edited Task');
    await page.waitForTimeout(100);

    // Verify the change
    await expect(taskTextInput).toHaveValue('Edited Task');
  });

  test('closes modal with SAVE & CLOSE button', async ({ page }) => {
    await page.click('button:has-text("SAVE & CLOSE")');

    // Modal should be closed
    await expect(page.getByRole('heading', { name: 'Edit Tasks' })).not.toBeVisible();
  });

  test('closes modal with X button', async ({ page }) => {
    await page.click('.close-btn');

    // Modal should be closed
    await expect(page.getByRole('heading', { name: 'Edit Tasks' })).not.toBeVisible();
  });

  test('closes modal when clicking overlay', async ({ page }) => {
    // Click outside the modal (on the overlay)
    await page.locator('.popup-overlay').click({ position: { x: 10, y: 10 } });

    // Modal should be closed
    await expect(page.getByRole('heading', { name: 'Edit Tasks' })).not.toBeVisible();
  });

  test('closes modal with Escape key', async ({ page }) => {
    // Focus the overlay to ensure Escape key is captured
    await page.locator('.popup-overlay').focus();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);

    // Modal should be closed
    await expect(page.getByRole('heading', { name: 'Edit Tasks' })).not.toBeVisible();
  });

  test('persists tasks after modal close', async ({ page }) => {
    // Add tasks
    const taskInput = page.locator('.task-input');
    await taskInput.fill('Persistent Task 1');
    await page.click('button:has-text("ADD +")');
    await taskInput.fill('Persistent Task 2');
    await page.click('button:has-text("ADD +")');

    // Close modal
    await page.click('button:has-text("SAVE & CLOSE")');

    // Verify tasks appear on homescreen
    await expect(page.getByText('Persistent Task 1')).toBeVisible();
    await expect(page.getByText('Persistent Task 2')).toBeVisible();
  });

  test('respects max length of 45 characters', async ({ page }) => {
    const longText = 'A'.repeat(50);
    const taskInput = page.locator('.task-input');
    await taskInput.fill(longText);

    // Should only accept 45 characters
    const inputValue = await taskInput.inputValue();
    expect(inputValue.length).toBeLessThanOrEqual(45);
  });
});
