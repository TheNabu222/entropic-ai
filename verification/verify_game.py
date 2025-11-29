from playwright.sync_api import sync_playwright
import os

def run():
    # Use absolute path for reliability
    cwd = os.getcwd()
    file_path = f"file://{cwd}/cavebot/ttrpg/index.html"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print(f"Navigating to {file_path}")
        page.goto(file_path)

        # Wait for the narrator tag to appear to ensure JS loaded
        page.wait_for_selector("#speaker-tag")

        # Verify initial state
        speaker = page.inner_text("#speaker-tag")
        print(f"Initial Speaker: {speaker}")
        assert speaker == "NARRATOR"

        # Take initial screenshot
        os.makedirs("verification", exist_ok=True)
        page.screenshot(path="verification/step1_start.png")

        # Click a choice: "Look for the Bird"
        print("Clicking 'Look for the Bird'...")
        page.click("button:has-text('Look for the Bird')")

        # Wait for update
        page.wait_for_timeout(1000) # Wait for fade/typing

        # Verify new state
        speaker = page.inner_text("#speaker-tag")
        print(f"New Speaker: {speaker}")
        assert speaker == "NABU"

        # Take screenshot of scene 2
        page.screenshot(path="verification/step2_observe.png")

        # Test Dice Roll: "[INSTINCT] Hunt it for food"
        print("Clicking Hunt option...")
        page.click("button:has-text('Hunt it')")

        # Wait for dice animation (approx 2s in code)
        page.wait_for_timeout(2500)

        # Screenshot result
        page.screenshot(path="verification/step3_result.png")

        browser.close()

if __name__ == "__main__":
    run()
