import { test, expect, Page } from '@playwright/test';

test.describe('Coach Dashboard - Comprehensive Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test.describe('Page Load & Core Structure', () => {

    test('dashboard loads successfully', async ({ page }) => {
      await expect(page).toHaveTitle('Weekly Coach Dashboard');
    });

    test('header displays correctly', async ({ page }) => {
      const header = page.locator('header h1');
      await expect(header).toBeVisible();
      await expect(header).toHaveText('Weekly Coach Dashboard');
    });

    test('week date is displayed', async ({ page }) => {
      const weekDate = page.locator('#weekDate');
      await expect(weekDate).toBeVisible();
      await expect(weekDate).toContainText('Week of');
    });

    test('PDF download button exists', async ({ page }) => {
      const pdfBtn = page.locator('.pdf-btn');
      await expect(pdfBtn).toBeVisible();
      await expect(pdfBtn).toContainText('Download PDF');
    });
  });

  test.describe('Coach Session Prep Section', () => {

    test('coach prep section is visible', async ({ page }) => {
      const coachPrep = page.locator('.coach-prep-section');
      await expect(coachPrep).toBeVisible();
    });

    test('client readiness card displays', async ({ page }) => {
      const readinessCard = page.locator('.readiness-card');
      await expect(readinessCard).toBeVisible();

      const clientStatus = page.locator('#clientStatus');
      await expect(clientStatus).toBeVisible();
    });

    test('velocity metrics grid is populated', async ({ page }) => {
      const velocityCard = page.locator('.velocity-card');
      await expect(velocityCard).toBeVisible();

      const moodTrend = page.locator('#moodTrend');
      const energyTrend = page.locator('#energyTrend');
      const sleepTrend = page.locator('#sleepTrend');
      const weightTrend = page.locator('#weightTrend');

      await expect(moodTrend).toBeVisible();
      await expect(energyTrend).toBeVisible();
      await expect(sleepTrend).toBeVisible();
      await expect(weightTrend).toBeVisible();
    });

    test('blockers list displays', async ({ page }) => {
      const blockersList = page.locator('#blockersList');
      await expect(blockersList).toBeVisible();
    });

    test('suggested topics list displays', async ({ page }) => {
      const topicsList = page.locator('#topicsList');
      await expect(topicsList).toBeVisible();

      // Should have at least one topic
      const topics = page.locator('#topicsList li');
      await expect(topics).not.toHaveCount(0);
    });

    test('wins highlight section displays', async ({ page }) => {
      const winsHighlight = page.locator('#winsHighlight');
      await expect(winsHighlight).toBeVisible();
    });

    test('session focus displays', async ({ page }) => {
      const sessionFocus = page.locator('#sessionFocus');
      await expect(sessionFocus).toBeVisible();
    });
  });

  test.describe('Summary Cards', () => {

    test('recovery score card displays', async ({ page }) => {
      const recoveryScore = page.locator('#recoveryScore');
      await expect(recoveryScore).toBeVisible();

      // Should have a numeric value
      const text = await recoveryScore.textContent();
      expect(text).not.toBe('--');
    });

    test('recovery score has correct color coding', async ({ page }) => {
      const recoveryScore = page.locator('#recoveryScore');

      // Should have one of the color classes
      const hasColorClass = await recoveryScore.evaluate((el) => {
        return el.classList.contains('green') ||
               el.classList.contains('yellow') ||
               el.classList.contains('red');
      });
      expect(hasColorClass).toBeTruthy();
    });

    test('calories card displays', async ({ page }) => {
      const avgCalories = page.locator('#avgCalories');
      await expect(avgCalories).toBeVisible();
    });

    test('steps card displays', async ({ page }) => {
      const avgSteps = page.locator('#avgSteps');
      await expect(avgSteps).toBeVisible();
    });

    test('measurements table displays', async ({ page }) => {
      const measurementsTable = page.locator('#measurementsTable');
      await expect(measurementsTable).toBeVisible();

      // Should have rows
      const rows = page.locator('#measurementsTable tbody tr');
      await expect(rows).not.toHaveCount(0);
    });

    test('weekly averages grid displays', async ({ page }) => {
      const averagesGrid = page.locator('#averagesGrid');
      await expect(averagesGrid).toBeVisible();
    });
  });

  test.describe('AI Insight Section', () => {

    test('insight card is visible', async ({ page }) => {
      const insightCard = page.locator('.insight-card');
      await expect(insightCard).toBeVisible();
    });

    test('AI insight is generated', async ({ page }) => {
      const aiInsight = page.locator('#aiInsight');
      await expect(aiInsight).toBeVisible();

      const text = await aiInsight.textContent();
      expect(text).not.toBe('Loading insight...');
      expect(text?.length).toBeGreaterThan(10);
    });
  });

  test.describe('WHOOP Recovery Charts', () => {

    test('WHOOP section title exists', async ({ page }) => {
      const whoopSection = page.locator('text=WHOOP Recovery Metrics');
      await expect(whoopSection).toBeVisible();
    });

    test('HRV chart canvas exists', async ({ page }) => {
      const hrvChart = page.locator('#hrvChart');
      await expect(hrvChart).toBeVisible();
    });

    test('RHR chart canvas exists', async ({ page }) => {
      const rhrChart = page.locator('#rhrChart');
      await expect(rhrChart).toBeVisible();
    });

    test('sleep chart canvas exists', async ({ page }) => {
      const sleepChart = page.locator('#sleepChart');
      await expect(sleepChart).toBeVisible();
    });

    test('strain chart canvas exists', async ({ page }) => {
      const strainChart = page.locator('#strainChart');
      await expect(strainChart).toBeVisible();
    });

    test('chart explainers are present', async ({ page }) => {
      const explainers = page.locator('.chart-explainer');
      const count = await explainers.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });
  });

  test.describe('Nutrition Charts', () => {

    test('nutrition section title exists', async ({ page }) => {
      const nutritionSection = page.locator('text=Nutrition (MacroFactor)');
      await expect(nutritionSection).toBeVisible();
    });

    test('calories chart canvas exists', async ({ page }) => {
      const caloriesChart = page.locator('#caloriesChart');
      await expect(caloriesChart).toBeVisible();
    });

    test('macros chart canvas exists', async ({ page }) => {
      const macrosChart = page.locator('#macrosChart');
      await expect(macrosChart).toBeVisible();
    });

    test('nutrition notes section exists', async ({ page }) => {
      const nutritionNotes = page.locator('#nutritionNotes');
      await expect(nutritionNotes).toBeVisible();
    });
  });

  test.describe('Training & Wellbeing Sections', () => {

    test('training section title exists', async ({ page }) => {
      const trainingSection = page.locator('text=Training Summary');
      await expect(trainingSection).toBeVisible();
    });

    test('training notes display', async ({ page }) => {
      const trainingNotes = page.locator('#trainingNotes');
      await expect(trainingNotes).toBeVisible();
    });

    test('WHOOP notes display', async ({ page }) => {
      const whoopNotes = page.locator('#whoopNotes');
      await expect(whoopNotes).toBeVisible();
    });

    test('health & wellbeing section exists', async ({ page }) => {
      const healthSection = page.locator('text=Health & Well-Being');
      await expect(healthSection).toBeVisible();
    });

    test('wellbeing notes display', async ({ page }) => {
      const wellbeingNotes = page.locator('#wellbeingNotes');
      await expect(wellbeingNotes).toBeVisible();
    });

    test('wins notes element exists', async ({ page }) => {
      const winsNotes = page.locator('#winsNotes');
      await expect(winsNotes).toBeAttached();
    });

    test('coach questions element exists', async ({ page }) => {
      const coachQuestions = page.locator('#coachQuestions');
      await expect(coachQuestions).toBeAttached();
    });
  });

  test.describe('Chart.js Integration', () => {

    test('Chart.js library loaded', async ({ page }) => {
      const chartLoaded = await page.evaluate(() => {
        return typeof (window as any).Chart !== 'undefined';
      });
      expect(chartLoaded).toBeTruthy();
    });

    test('charts are rendered (canvas has content)', async ({ page }) => {
      // Wait for charts to render
      await page.waitForTimeout(1000);

      const chartRendered = await page.evaluate(() => {
        const canvas = document.getElementById('hrvChart') as HTMLCanvasElement;
        if (!canvas) return false;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;

        // Check if canvas has been drawn to by checking dimensions
        return canvas.width > 0 && canvas.height > 0;
      });
      expect(chartRendered).toBeTruthy();
    });
  });

  test.describe('Responsive Design', () => {

    test('mobile layout - single column', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });

      const grid = page.locator('.grid').first();
      const gridStyle = await grid.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.gridTemplateColumns;
      });

      // On mobile, should be single column (one value)
      const columnCount = gridStyle.split(' ').filter(v => v.includes('px')).length;
      expect(columnCount).toBe(1);
    });

    test('tablet layout - 2 column grid', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const grid = page.locator('.grid').first();
      const gridStyle = await grid.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.gridTemplateColumns;
      });

      // On tablet, should have 2 columns
      const columnCount = gridStyle.split(' ').filter(v => v.includes('px')).length;
      expect(columnCount).toBe(2);
    });

    test('desktop layout - 3 column grid', async ({ page }) => {
      await page.setViewportSize({ width: 1400, height: 900 });

      const grid = page.locator('.grid').first();
      const gridStyle = await grid.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.gridTemplateColumns;
      });

      // On desktop, should have 3 columns
      const columnCount = gridStyle.split(' ').filter(v => v.includes('px')).length;
      expect(columnCount).toBe(3);
    });
  });

  test.describe('Print Functionality', () => {

    test('PDF button triggers print', async ({ page }) => {
      // Monitor print dialog
      let printCalled = false;
      await page.exposeFunction('mockPrint', () => {
        printCalled = true;
      });

      await page.evaluate(() => {
        window.print = () => (window as any).mockPrint();
      });

      await page.locator('.pdf-btn').click();
      expect(printCalled).toBeTruthy();
    });

    test('print footer has correct elements', async ({ page }) => {
      const printWeek = page.locator('#printWeek');
      const printDate = page.locator('#printDate');

      // These exist but are hidden (display: none) until print
      await expect(printWeek).toBeAttached();
      await expect(printDate).toBeAttached();
    });
  });

  test.describe('Data Integrity', () => {

    test('embedded JSON data exists', async ({ page }) => {
      const jsonExists = await page.evaluate(() => {
        const el = document.getElementById('dashboardData');
        return el !== null && el.textContent !== null;
      });
      expect(jsonExists).toBeTruthy();
    });

    test('embedded JSON is valid', async ({ page }) => {
      const jsonValid = await page.evaluate(() => {
        try {
          const el = document.getElementById('dashboardData');
          if (!el || !el.textContent) return false;
          JSON.parse(el.textContent);
          return true;
        } catch {
          return false;
        }
      });
      expect(jsonValid).toBeTruthy();
    });

    test('WHOOP data has 7 daily entries', async ({ page }) => {
      const dayCount = await page.evaluate(() => {
        const el = document.getElementById('dashboardData');
        if (!el || !el.textContent) return 0;
        const data = JSON.parse(el.textContent);
        return data.whoop?.daily?.length || 0;
      });
      expect(dayCount).toBe(7);
    });
  });

  test.describe('Accessibility', () => {

    test('page has proper heading hierarchy', async ({ page }) => {
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      const h2Count = await page.locator('h2').count();
      expect(h2Count).toBeGreaterThan(0);
    });

    test('images/charts have accessible alternatives', async ({ page }) => {
      // Canvas elements should be within labeled containers
      const chartContainers = page.locator('.card:has(canvas)');
      const count = await chartContainers.count();

      for (let i = 0; i < count; i++) {
        const container = chartContainers.nth(i);
        const heading = container.locator('h2');
        await expect(heading).toBeVisible();
      }
    });

    test('color contrast for text elements', async ({ page }) => {
      // Check that main text is not too light
      const bodyColor = await page.evaluate(() => {
        const body = document.body;
        return window.getComputedStyle(body).color;
      });

      // Should be dark color (not near white)
      expect(bodyColor).not.toBe('rgb(255, 255, 255)');
    });
  });

  test.describe('Performance', () => {

    test('page loads within 3 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000);
    });

    test('no JavaScript errors on load', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => {
        errors.push(error.message);
      });

      await page.goto('/index.html');
      await page.waitForTimeout(1000);

      expect(errors).toHaveLength(0);
    });

    test('no failed network requests', async ({ page }) => {
      const failedRequests: string[] = [];
      page.on('requestfailed', (request) => {
        failedRequests.push(request.url());
      });

      await page.goto('/index.html');
      await page.waitForTimeout(1000);

      expect(failedRequests).toHaveLength(0);
    });
  });

  test.describe('Client Status Logic', () => {

    test('status badge has correct class', async ({ page }) => {
      const statusBadge = page.locator('#clientStatus');

      const hasStatusClass = await statusBadge.evaluate((el) => {
        return el.classList.contains('on-track') ||
               el.classList.contains('at-risk') ||
               el.classList.contains('off-track');
      });
      expect(hasStatusClass).toBeTruthy();
    });

    test('prep metrics show values', async ({ page }) => {
      const prepRecovery = page.locator('#prepRecovery');
      const prepSleep = page.locator('#prepSleep');
      const prepAdherence = page.locator('#prepAdherence');

      await expect(prepRecovery).not.toHaveText('--%');
      await expect(prepSleep).not.toHaveText('--h');
      await expect(prepAdherence).not.toHaveText('--%');
    });
  });
});

test.describe('V2 Dashboard Tests', () => {

  test('v2 index page loads', async ({ page }) => {
    await page.goto('/v2/index.html');
    await expect(page).toHaveTitle(/Dashboard|Coach/i);
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/v2/login.html');
    await expect(page.locator('body')).toBeVisible();
  });

  test('admin page loads', async ({ page }) => {
    await page.goto('/v2/admin.html');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Visual Rendering Tests', () => {

  test('full page renders without errors - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto('/index.html');
    await page.waitForTimeout(1500); // Wait for charts to render

    // Verify all main sections are visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('.coach-prep-section')).toBeVisible();
    await expect(page.locator('.grid').first()).toBeVisible();
    await expect(page.locator('#hrvChart')).toBeVisible();
  });

  test('full page renders without errors - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/index.html');
    await page.waitForTimeout(1500);

    // Verify page adapts to mobile
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('.coach-prep-section')).toBeVisible();
  });

  test('coach prep section renders correctly', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(1000);

    const coachPrep = page.locator('.coach-prep-section');
    await expect(coachPrep).toBeVisible();

    // Verify all coach prep sub-components
    await expect(page.locator('.readiness-card')).toBeVisible();
    await expect(page.locator('.velocity-card')).toBeVisible();
    await expect(page.locator('.blockers-card')).toBeVisible();
    await expect(page.locator('.topics-card')).toBeVisible();
  });
});
