# Goodreads to Vinted

A Manifest V3 Chrome extension that adds English and Portuguese Vinted search links to Goodreads review-list rows.
Completely done by ChatGPT. I do not claim authorship of any of this.

## Features

- Adds 🇬🇧 Vinted and 🇵🇹 Vinted links under the **author**.
- Adds the same links under the **title**, using only the main title (the separate Goodreads series suffix, such as `(Sprawl, #1)`, is excluded).
- Adds the links under **ISBN-13** only when an ISBN-13 value exists.
- Searches Vinted Portugal in the books category, sorted by ascending price.
- Opens searches in a new tab and leaves the Goodreads tab open.
- Handles rows loaded later or re-rendered dynamically.
- Uses compact Goodreads-inspired link styling.
- Runs only on `https://www.goodreads.com/review/list/*`.

## Requirements

- Node.js 20 or newer recommended
- npm
- Google Chrome

## Install dependencies and build

```sh
npm install
npm run build
```

The extension build is generated in `dist/`.

## Load in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the generated `dist` folder (not the project root).
5. Open or refresh a Goodreads review-list page.

After editing source files, run `npm run build`, then click the extension's reload button on `chrome://extensions` and refresh Goodreads.

## Vinted language IDs

- English: `6435`
- Portuguese: `6442`

## Project structure

```text
goodreads-to-vinted/
├── public/
│   └── icons/
│       ├── icon16.png
│       ├── icon48.png
│       ├── icon128.png
│       └── icon512.png
├── src/
│   ├── content.ts
│   └── styles.css
├── manifest.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Notes

The extension uses `URLSearchParams` to encode search terms safely. Goodreads author text is used as shown on the page (for example, `Gibson, William`). ISBN-13 links are omitted when the field is empty.
