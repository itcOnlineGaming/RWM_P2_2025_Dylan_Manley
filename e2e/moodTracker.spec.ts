import { test, expect } from '@playwright/test';

const BASE_PATH = '/Team_5';
const BASE_URL = `http://localhost:5173${BASE_PATH}`;

test(`Test on Playwright Page`, async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('Show Start Screen Popup', async ({ page }) => {
  await page.goto(BASE_URL);

  await page.getByRole('button', { name: 'View Information' }).click();
  await expect(page.getByRole('heading', { name: 'Hello, and welcome to our application called "Mood Tracker".' })).toBeVisible();
});

// Yoga Pages Tests
test('Yoga Page: Load Main Menu', async ({ page }) => {
  await page.goto(BASE_URL + "/YogaScreen");

  await expect(page.getByRole('heading', { name: 'Yoga Exercises' })).toBeVisible();
});

test('Yoga Page: Click Exercise', async ({ page }) => {
  await page.goto(BASE_URL + "/YogaScreen");

  await expect(page.getByRole('button', { name: '🧘' })).toBeVisible();
});

test('Yoga Page: Submit Feeling', async ({ page}) => {
  await page.goto(BASE_URL + "/YogaScreen");

  await page.getByRole('button', { name: 'Open Current Feeling Popup' }).click();
  await expect(page.getByRole('heading', { name: 'How do you feel currently?' })).toBeVisible();
});

// Breathing Selection
test('Start Breathing selection load from Breathing Selection', async ({ page }) => {
  await page.goto(BASE_URL + '/Breathingscreen');

  await page.getByRole('button', {name: '5 Minute Exercise'}).click();
  await expect(page.getByRole('button', { name: '5 Minute Exercise'})).toBeVisible();
});

// Breathing Exercise
test('Start Breathing exercise load from Breathing Exercise', async ({ page }) => {
  await page.goto(BASE_URL + '/BreathingExerciseScreen');

  await page.getByRole('button', {name: 'Reset'}).click();
  await expect(page.getByRole('button', { name: 'Reset'})).toBeVisible();
});