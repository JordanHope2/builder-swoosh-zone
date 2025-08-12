from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:8080/")

    # Wait for the navigation bar to be visible, indicating the page has loaded.
    expect(page.locator("nav")).to_be_visible()

    # Check for featured companies
    expect(page.get_by_text("Trusted by Leading Companies")).to_be_visible()
    expect(page.get_by_text("UBS")).to_be_visible()
    expect(page.get_by_text("Nestlé")).to_be_visible()
    expect(page.get_by_text("Roche")).to_be_visible()
    expect(page.get_by_text("ABB")).to_be_visible()

    # Check for stats
    expect(page.get_by_text("10,000+")).to_be_visible()
    expect(page.get_by_text("Active Jobs")).to_be_visible()
    expect(page.get_by_text("50,000+")).to_be_visible()
    expect(page.get_by_text("Registered Users")).to_be_visible()
    expect(page.get_by_text("95%")).to_be_visible()
    expect(page.get_by_text("Success Rate")).to_be_visible()

    # Check for featured jobs
    expect(page.get_by_text("Curated Excellence")).to_be_visible()
    # Wait for at least one job card to be visible
    expect(page.locator(".group.cursor-pointer").first).to_be_visible()

    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
