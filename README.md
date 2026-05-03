# Poshmark Utility Belt

A Chrome extension (Manifest V3) that automates sharing listings from a Poshmark closet. Supports two modes:

- **Follow Mode** — shares all listings once in random order to your followers
- **Party Mode** — shares all listings 10 times in order, looping continuously for Poshmark parties

---

## Local Testing

1. Open `chrome://extensions` and enable **Developer mode**
2. Click **Load unpacked** and select this project folder
3. Navigate to `poshmark.com/closet/<your-username>` — the toolbar icon should become active
4. Click the icon to open the popup and test both modes

To inspect the service worker, click **Inspect views: service worker** on the extension card in `chrome://extensions`.

After any code change, click the **refresh icon** (↺) on the extension card, then reload the Poshmark tab.

**Common issues**

| Symptom | Fix |
|---|---|
| Icon never activates | Reload the extension; check service worker for errors |
| Buttons do nothing | Reload the Poshmark tab so the content script re-injects |
| `Could not establish connection` | Ensure you are on `poshmark.com/closet/*` |
| Modal doesn't close / loop stalls | Poshmark DOM may have changed — inspect `.modal a` in DevTools |

---

## Packaging & Publishing

### 1. Create a zip

From the project root, exclude development files:

```bash
zip -r posh-bot.zip . \
  --exclude "*.git*" \
  --exclude "node_modules/*" \
  --exclude "package*.json" \
  --exclude "README.md"
```

`manifest.json` must be at the root of the zip (not inside a subdirectory).

### 2. Prepare store assets

- **Icon** — 128×128 PNG (`public/icon128.png`)
- **Screenshots** — at least 1, 1280×800 or 640×400 PNG/JPG
- **Privacy policy** — required because the extension uses the `tabs` permission

### 3. Submit

1. Pay the one-time **$5 USD** developer fee at the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **New Item** and upload `posh-bot.zip`
3. Fill in the store listing, justify the `tabs` and `declarativeContent` permissions, and link your privacy policy
4. Choose **Public** or **Unlisted** (unlisted skips review and is suitable for personal use)
5. Click **Submit for Review** — public items typically review in 1–3 business days

### 4. Updating

Increment `version` in `manifest.json`, recreate the zip, and upload the new package from the **Package** tab in the Developer Dashboard.
