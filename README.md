# Pole Events

A minimalist weekly calendar for our five poles: Sport, Cinema, Environnement, Art and Bar.
Rows are poles, columns are the 4 weeks of the month (week 4 runs to the end of the month).

Everyone adds and edits events **directly on the website**:
- **Add:** hover a cell and click **+ Add**, type the event, press Enter.
- **Edit:** click an event, change the text, press Enter.
- **Delete:** click an event, clear the text, press Enter.

The site is hosted for free on GitHub Pages; the events are saved in a Google Sheet.

## One-time setup (≈10 minutes)

### 1. Create the Google Sheet backend
1. Create a new Google Sheet (any name, e.g. "Pole Events").
2. In the sheet: **Extensions → Apps Script**. Delete what's there, paste the contents of
   `apps-script.gs`, and click 💾 Save.
3. *(Optional but recommended)* set `PASSCODE` at the top of the script, e.g. `'pole2026'`.
   Members will be asked for it the first time they edit (it's remembered on their device).
   Without it, anyone who has the link can edit.
4. Click **Deploy → New deployment**, click ⚙️ next to "Select type" and choose **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, authorize with your Google account (click *Advanced → Go to … (unsafe)*;
   it's your own script), then copy the **Web app URL** (ends with `/exec`).

https://script.google.com/macros/s/AKfycbyc7oHMWhKHXm3ZnZRQGuM1cPOkB-POGRAhI0slXjaJW8bo68CTjeKKg8JubzinV7pf/exec

### 2. Put the site on GitHub
1. Open `index.html` and paste the URL into the line
   `const API_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';`
2. Create a new GitHub repository and upload `index.html` (plus this README and
   `apps-script.gs` if you want to keep them there).
3. **Settings → Pages**, Source: *Deploy from a branch*, branch `main`, folder `/ (root)`, Save.
4. The site is live at `https://<your-username>.github.io/<repo-name>/`. Share that link.

## Good to know
- **Changing pole names:** edit the `POLES` list near the top of the script in `index.html`.
- **Changing the Apps Script later:** go to *Deploy → Manage deployments → ✏️ → Version: New version*,
  otherwise the old code keeps running (and the URL stays the same).
- The Google Sheet is your backup: you can see and fix every event in it.
- Before `API_URL` is set, the page runs in demo mode: you can try editing, but nothing is saved.
