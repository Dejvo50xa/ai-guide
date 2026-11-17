# PromptujAI

A free, bilingual (Czech / English) guide to choosing AI models, writing better prompts, and understanding AI agents.
Live at <https://www.promptujai.cz/> (English: `/en/`).

It's a static site built with **Vite + React** (plain JavaScript). There's no backend, no accounts, and no API keys:
prompts are assembled in the browser, saved prompts live in the visitor's `localStorage`, and the only network request
the site makes itself is an optional, visitor-triggered refresh of GitHub star counts on the repository catalog.

## Pages

| URL | Language | Entry HTML |
| --- | --- | --- |
| `/` | Czech | `index.html` |
| `/en/` | English | `en/index.html` |
| `/repozitare/` | Czech | `repozitare/index.html` |
| `/en/repositories/` | English | `en/repositories/index.html` |

Each HTML file sets `<html lang>`, and `src/i18n.jsx` loads only that language's content file.

## Local development

Requires Node 20+ (the repo uses npm; see `package-lock.json`).

```bash
npm install
npm run dev
```

Then open <http://localhost:5173/> (Czech) or <http://localhost:5173/en/> (English).

## Checks

```bash
npm test        # content parity (cs vs en), practice checker, catalog data and filters
npm run lint    # ESLint
npm run build   # production build into dist/
npm run preview # serve the built dist/ locally
```

## Editing content

All visible text lives in two files with the same structure:

- `src/content/cs.js` — Czech
- `src/content/en.js` — English

When you add or change something in one, do the same in the other. `npm test` fails if keys, list lengths or ids
differ between the two, or if a string is empty. Section anchors (`#modely`, `#techniky`, …) are shared by both languages
on purpose so the language switch and old links keep working.

The model catalog (`models.items`) describes vendors' own documentation as of the date in `verified`; update the date
when you re-check it. Don't add benchmark numbers or claims the vendors don't publish.

Repository catalog data is in `src/data/repositories.json`. Each entry has Czech `description`, `setup` and `prompt`
fields plus an `en` object with the English versions. See `docs/repository-catalog.md`.

## Project structure

```
index.html, en/…, repozitare/…   one HTML entry per page and language (meta tags, hreflang, OG image)
src/main.jsx, src/catalog-main.jsx  page entry scripts
src/i18n.jsx                     loads the right content file and provides it to components
src/content/{cs,en}.js           all copy
src/App.jsx                      home page layout
src/SiteNav.jsx                  header (with language switch) and footer
src/Explore.jsx                  hero, model picker, workflows, shared SectionHead/Mark
src/Studio.jsx                   task launcher, prompt builder, local prompt library
src/Learn.jsx                    career paths, roadmap, techniques, practice, agents, loop, templates, glossary, FAQ
src/practice.mjs                 keyword checker for the practice exercise (tested)
src/RepositoryCatalog.jsx        repository catalog page
src/catalog-utils.mjs            catalog filtering/sorting (tested)
src/styles.css                   the whole design system
scripts/*.test.mjs               tests (node:test)
public/                          favicon, OG images, robots.txt, sitemap.xml, 404.html
```

## Deployment

The site is deployed on **Vercel** from the `main` branch; Vercel detects Vite automatically
(build command `npm run build`, output `dist`). No environment variables are needed, so there's no `.env` file.

To ship a change: merge it into `main` and Vercel builds and publishes it. Preview deployments are created for pull
requests. After deploying, check `/`, `/en/`, `/repozitare/` and `/en/repositories/`.

Optional maintenance: `npm run refresh:repositories` updates star counts in `src/data/repositories.json` from the public
GitHub API (no token needed; anonymous requests are rate-limited). Review the diff before committing.
