import asyncio
import re
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # --- Step 1: Sign In ---
            print("Navigating to Sign In page...")
            await page.goto("http://localhost:8080/signin")

            test_email = "testuser@test-user.com" # A known user
            test_password = "Password123!"

            print(f"Signing in with user: {test_email}")
            await page.get_by_placeholder("Enter your email").fill(test_email)
            await page.get_by_placeholder("Enter your password").fill(test_password)
            await page.get_by_role("button", name="Sign in").click()

            # Expect to be redirected to the dashboard
            await expect(page).to_have_url("http://localhost:8080/dashboard")
            print("Sign in successful.")

            # --- Step 2: Navigate to Swipe Page ---
            print("Navigating to Swipe page...")
            await page.goto("http://localhost:8080/swipe")

            # --- Step 3: Verify Match Score ---
            print("Waiting for match score to appear...")
            # Wait for a locator that contains "% Match"
            match_score_locator = page.locator('text=/% Match/').first()

            # Wait for the element to be visible, with a generous timeout
            await expect(match_score_locator).to_be_visible(timeout=15000)

            print("Match score is visible.")

            # --- Step 4: Screenshot ---
            print("Taking screenshot...")
            await page.screenshot(path="jules-scratch/verification/match_score_success.png")
            print("Screenshot saved to jules-scratch/verification/match_score_success.png")

        except Exception as e:
            print(f"An error occurred during verification: {e}")
            await page.screenshot(path="jules-scratch/verification/match_score_error.png")
            print("Error screenshot saved.")

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
