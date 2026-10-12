# Goodreads Vinted Links

Chrome extension that adds Vinted search links to Goodreads review-list pages.

## What it does

On:

<https://www.goodreads.com/review/list/>

the extension adds two links underneath the author:

- 🇬🇧 Vinted
- 🇵🇹 Vinted

The links search Vinted Portugal for books by author.

If an ISBN-13 is available, the extension also adds the same two links underneath the ISBN-13.

## Vinted language IDs

Portuguese:

6442

English:

6435

## Build

Install dependencies:

npm install

Build:

npm run build

This produces:

dist/content.js

## Install in Chrome

1. Open `chrome://extensions`.
2. Enable "Developer mode".
3. Click "Load unpacked".
4. Select the project directory.
5. Open or refresh a Goodreads review-list page.

After changing the TypeScript code:

npm run build

Then click the reload button for the extension in `chrome://extensions`.

## Supported URLs

The extension only runs on:

<https://www.goodreads.com/review/list/>*
