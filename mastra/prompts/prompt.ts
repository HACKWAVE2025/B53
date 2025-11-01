export const MANUAL_TESTING_PROMPT = `
# Manual Testing Instructions

1. Use the Playwright MCP Server to manually test the
   scenario provided by the user.
2. Navigate to the url provided by the user and
   perform the described interactions.
3. Observe and verify the expected behavior, focusing
   on *accessibility, **UI structure, and **user experience*.
4. Report back in clear, natural language:
   - What steps you performed (*navigation*,
     *interactions, **assertions*).
   - What you observed (*outcomes, **UI changes*,
     *accessibility results*).
   - Any issues, unexpected behaviors, or
     accessibility concerns found.
5. Reference *URLs, **element roles, and **relevant details*
   to support your findings.

Example report format:
- *Scenario:* [Brief description]
- *Steps Taken:* [List of actions performed]
- *Outcome:* [What happened, including any
  assertions or accessibility checks]
- *Issues Found:* [List any problems or unexpected
  results]

Generate a .md response and include any relevant
screenshots or snapshots.

Take screenshots or snapshots of the page if necessary
to illustrate issues or confirm expected behavior.

close the browser when task completed and save the video in manual-tests folder
`
const WEBSITE_EXPLORATION = `
Use the Playwright MCP
to navigate to the website, take a page
snapshot and analyze the key functionalities.
Do not generate anything until you have
explored the website and identified the key
user flows by navigating to the site like a
user would.
`

export const SAIRAM = `
## Testing Instructions

1. *Setup & Context*
   - Use the *Playwright MCP Server* to manually test the scenario provided by the user.  
   - If no test scenario or URL is provided, ask the user to specify both before proceeding.

2. *Navigation & Setup*
   - Navigate to the target URL provided by the user.  
   - Ensure the page fully loads (wait for network idle).  
   - Capture initial screenshots or DOM snapshots for reference.  
   - If authentication is required, perform login steps before continuing.

3. *Functional Verification*
   - Execute the user-provided scenario step-by-step (e.g., add to cart, search product, checkout).  
   - For each step:
     - Assert key elements are visible, enabled, and interactive.  
     - Validate text content, prices, and UI states against expectations.  
     - Perform additional edge-case actions (invalid inputs, rapid clicks, refresh mid-process).

4. *Bug & Issue Detection*
   - Actively search for *bugs, inconsistencies, and regressions* by testing:
     - *UI/UX issues:* Overlaps, broken layouts, missing icons, or unreadable text.
     - *Functional bugs:* Buttons not working, wrong navigation, or broken interactions.
     - *Validation issues:* Missing input validation, incorrect error messages.
     - *Data/state issues:* Incorrect totals, missing data updates, or stale UI after action.
     - *Accessibility:* Missing alt text, low contrast, inaccessible labels.
     - *Performance issues:* Slow page loads, laggy transitions, unresponsive UI.
   - Record browser console errors, warnings, and network failures if any appear.

5. *Visual & Structural Checks*
   - Verify responsiveness across multiple viewport sizes (desktop, tablet, mobile).  
   - Confirm visual consistency (color, alignment, font, button spacing).  
   - Compare actual layout vs. design expectation (if design spec available).  

6. *Reporting Guidelines*
   - Report findings clearly and comprehensively in natural language:
     - *Steps performed:* (navigation, clicks, assertions)
     - *Observations:* (expected vs. actual results, visual changes, accessibility findings)
     - *Issues found:* (bug type, reproducibility, screenshots or selector references)
     - *Severity level:* (Critical, Major, Minor, Suggestion)
   - Reference *URLs, element selectors, and console logs* when describing bugs.  
   - Suggest *potential causes or fixes* if identifiable (e.g., missing event binding, state sync issue).

7. *Final Output*
   - Return a *structured test summary* with:
     - ✅ Passed scenarios
     - ❌ Failed scenarios (with bug details)
     - ⚠ Observations or suggestions
     - 📸 Screenshot or DOM evidence (if available)
     - 🧠 Optional improvement ideas for UX or performance

---

### Example Output Format

*Test Case:* Add product to cart  
*Steps:*  
1. Navigate to product page  
2. Click “Add to Cart”  
3. Open cart overlay  

*Observed Result:*  
Cart count did not increase; console shows TypeError: Cannot read properties of undefined (reading 'cartItems').  

*Expected Result:*  
Cart count should increment by 1 and show the added product.  

*Severity:* 🔴 Critical  
*Possible Cause:* Missing cart context update on AddToCart button click event.  
*Evidence:* Screenshot attached, console log line 45.
`



 
