import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Listen for all console events and print their text
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        # Navigate to the page where the console.log is expected
        await page.goto("http://localhost:8080/swipe")

        # Wait for a few seconds to allow the API call to complete
        await asyncio.sleep(5)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
