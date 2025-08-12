import asyncio
import random
import string
from playwright.async_api import async_playwright, expect

# Generate a random email to ensure the user is new each time
def generate_random_email():
    random_part = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
    return f"testuser_{random_part}@test-user.com"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        test_email = generate_random_email()
        test_password = "Password123!"

        try:
            # --- Step 1: Sign Up ---
            print("Navigating to Sign Up page...")
            await page.goto("http://localhost:8080/signup")

            print("Choosing user type...")
            await page.get_by_text("Job Seeker").click()
            await page.get_by_role("button", name="Continue").click()

            print(f"Signing up with new user: {test_email}")
            await page.get_by_placeholder("First name").fill("Test")
            await page.get_by_placeholder("Last name").fill("User")
            await page.get_by_placeholder("Enter your email").fill(test_email)
            await page.get_by_placeholder("Create password").fill(test_password)
            await page.get_by_placeholder("Confirm password").fill(test_password)
            await page.get_by_label("I agree to the").check()
            await page.get_by_role("button", name="Create account").click()

            # Expect a success toast (notification).
            success_toast = page.get_by_text("Account created!", exact=True)
            await expect(success_toast).to_be_visible()
            print("Sign up successful.")

            # --- Step 2: Attempt to access protected route (should fail) ---
            print("Attempting to access protected route while logged out...")
            await page.goto("http://localhost:8080/dashboard")
            # Expect to be redirected to the sign-in page
            await expect(page).to_have_url("http://localhost:8080/signin")
            print("Redirected to sign-in as expected.")

            # --- Step 3: Sign In ---
            print(f"Signing in with user: {test_email}")
            await page.get_by_placeholder("Enter your email").fill(test_email)
            await page.get_by_placeholder("Enter your password").fill(test_password)
            await page.get_by_role("button", name="Sign in").click()

            # Expect to be redirected to the dashboard
            await expect(page).to_have_url("http://localhost:8080/dashboard")
            print("Sign in successful, redirected to dashboard.")

            # --- Step 4: Sign Out ---
            # NOTE: There is no sign out button yet. We will add one to the dashboard for the test.
            # For now, we can't test sign out, but we have verified the core loop.
            # We'll proceed to take a screenshot of the dashboard.
            print("Successfully accessed protected dashboard.")

            # --- Step 5: Screenshot ---
            print("Taking screenshot...")
            await page.screenshot(path="jules-scratch/verification/auth_flow_success.png")
            print("Screenshot saved to jules-scratch/verification/auth_flow_success.png")

        except Exception as e:
            print(f"An error occurred during the auth flow test: {e}")
            # Take a screenshot on error for debugging
            await page.screenshot(path="jules-scratch/verification/auth_flow_error.png")
            print("Error screenshot saved to jules-scratch/verification/auth_flow_error.png")

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
