# Project Screenshots Directory
### 📸 Pega Capstone Project Verification

This directory is designated for storing the execution screenshots of your completed Pega Case lifecycle. Once you capture the screenshots from your Pega platform, save them here with the following recommended filenames:

1.  **`1_case_lifecycle.png`** - The completed stage-step workflow showing Request, Availability, Calculation, and Confirmation stages in Pega App Studio.
2.  **`2_submit_request.png`** - The interactive user interface displaying the form where users select their movie, theater location, and ticket category.
3.  **`3_seating_map.png`** - The custom visual layout showing the seating grid, with some seats booked and others highlighted during active selection.
4.  **`4_cost_calculation.png`** - The billing page showing the detailed breakdown of basic fare, tax (GST), discounts, and final computed total.
5.  **`5_case_resolution.png`** - The final confirmation UI displaying a generated transaction reference ID and resolved-completed status indicators.

---

### How to Upload:
1. Save your captured images directly in this folder (`pega/screenshots/`) using the filenames above.
2. Run these git commands in your terminal to sync them with GitHub:
   ```bash
   git add screenshots/
   git commit -m "docs: add project execution screenshots"
   git push origin main
   ```
