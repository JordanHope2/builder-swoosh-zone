import { test, expect } from "@playwright/test";

// This test suite covers the user authentication flow.
// It requires a .env.test file with the following variables:
// E2E_TEST_EMAIL=your_test_user@example.com
// E2E_TEST_PASSWORD=your_test_user_password

test.describe("Authentication Flow", () => {
  // Before running the test, make sure the environment variables are set.
  test.beforeEach(async ({ page }) => {
    if (!process.env.E2E_TEST_EMAIL || !process.env.E2E_TEST_PASSWORD) {
      throw new Error(
        "Test environment variables E2E_TEST_EMAIL and E2E_TEST_PASSWORD must be set. Please create a .env.test file.",
      );
    }
    // The base URL is configured in playwright.config.ts and will be prepended to all page.goto() calls.
  });

  test("should allow a user to sign in with email and password", async ({
    page,
  }) => {
    // 1. Navigate to the sign-in page
    await page.goto("/signin");

    // 2. Fill in the email and password fields
    await page
      .getByLabel("Email address")
      .fill(process.env.E2E_TEST_EMAIL!);
    await page
      .getByLabel("Password")
      .fill(process.env.E2E_TEST_PASSWORD!);

    // 3. Click the sign-in button
    await page.getByRole("button", { name: "Sign in" }).click();

    // 4. Wait for navigation and verify the URL
    // We expect to be redirected to the candidate dashboard after a successful login.
    await expect(page).toHaveURL("/candidate-dashboard", { timeout: 10000 });

    // 5. Verify that a key element on the dashboard is visible
    // This confirms that the dashboard has loaded correctly.
    // We'll look for a heading that says "Dashboard" or similar.
    await expect(
      page.getByRole("heading", { name: "Dashboard", level: 1 }),
    ).toBeVisible();

    // Optional: You could add further assertions here, like checking for the user's name or email on the page.
    // For example:
    // await expect(page.getByText(`Welcome back, ${process.env.E2E_TEST_EMAIL!}`)).toBeVisible();
  });
});
