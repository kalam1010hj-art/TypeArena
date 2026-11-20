# TypeArena

Type Faster. Compete Smarter. Master Your Keyboard.

Phase 1 is a guest-first typing platform built with React, Vite, React Router, CSS Modules and Lucide. It runs entirely in the browser. The default branch was initialized for the first feature pull request.

## Run locally

Use Node.js 22 or newer and npm.

```sh
cd frontend
npm ci
npm run dev
```

## What works

- Home, interactive keyboard illustration, quick test, duration-specific landing pages and three challenge shortcuts.
- Six durations from 15 seconds to 10 minutes. Eight modes cover words, sentences, paragraphs, numbers, punctuation, quotes, code and custom passages.
- The clock uses monotonic active time. It starts on the first committed character and pauses on blur or tab hide. Focus the field again to resume. Backspace, Esc restart and composed input are supported. Generated passages extend as you type. Custom passages finish at the last position or the time limit.
- Results include WPM and accuracy charts, mistake counts, retry, export and sharing. The most recent 50 guest results and theme preference are saved in the current browser.
- Original typing guidance, FAQ, about, public GitHub feedback, privacy, terms, cookie and disclaimer pages.
- Static public route HTML, metadata, sitemap generation, robots.txt, a branded favicon and a 404 page.

## Scoring

Net WPM uses correct characters still in the input. Gross WPM includes incorrect characters still in the input. Raw WPM uses all inserted attempts, including later corrections. Divide each count by five and by active minutes. Accuracy is the percentage of attempted characters that were correct when entered. Consistency compares the standard deviation of sampled typing rates against their mean and needs at least two samples. Unicode inputs use NFC and grapheme segmentation. These metrics are for personal practice.

## Architecture

| Path | Responsibility |
| --- | --- |
| frontend/src/engine.js | Clock, score calculation, sampling and grapheme comparison |
| frontend/src/Test.jsx | Input handling, charts and result actions |
| frontend/src/App.jsx | Navigation, home, guest history and route views |
| frontend/src/pages.js | Public page metadata and original content |
| frontend/src/storage.js | Browser-local guest persistence |
| frontend/scripts/pages.mjs | Build-time rendering, sitemap and crawler files |
| frontend/tests | Engine, interface and desktop/mobile browser checks |

## Verification

```sh
cd frontend
npm test
npm run build
npm run test:interface
npx playwright install chromium --only-shell
npm run test:browser
```

The browser suite launches Vite preview and checks a complete custom test, persisted history, switching themes, mobile navigation and deep-link refresh. Set CHROMIUM_PATH to use an existing compatible Chromium executable.

## Vercel setup

Import the repository into Vercel and select **frontend** as the root. Use the Vite preset, npm ci for installation, npm run build for the build command and dist for output. The included routing configuration serves individual pre-rendered pages and gives unknown paths a 404 status.

Local practice requires no environment variables or credentials. Set **VITE_SITE_URL** to the final HTTPS production origin for absolute canonical URLs and the sitemap. The build falls back to VERCEL_PROJECT_PRODUCTION_URL when provided by Vercel. A local build without either variable uses relative page URLs and omits the sitemap.

## Scope

This release covers Phase 1. Guided lessons and daily challenges are the next milestone. Games, exam simulations, authentication, server-backed statistics, leaderboards and verified certificates belong to the later phases. There are no Render, PostgreSQL or advertising credentials to configure in this release. Clearing browser storage removes guest history.
