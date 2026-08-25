# Mayoyo Tools

A collection of small, client-side, no-backend web tools, deployed together
on one GitHub Pages site. Each tool lives in its own folder; a single shared
Tailwind CSS build is used by all of them.

## Structure

```text
mayoyo-tools/
├── index.html              <- hub page, links to every tool
├── shared/
│   ├── tailwind.css        <- Tailwind source (edit this if you need custom CSS)
│   └── tailwind.build.css  <- compiled output, committed to the repo, loaded by every tool
├── json-validator/
│   └── index.html          <- links to ../shared/tailwind.build.css
└── (future-tool)/
    └── index.html          <- links to ../shared/tailwind.build.css
```

## One-time setup

```bash
pnpm install
```

## Adding a new tool

1. Create a new folder at the repo root, e.g. `pdf-merger/`.

2. Build its `index.html` using Tailwind utility classes as normal - no
   per-tool Tailwind install needed.

3. Link the shared stylesheet in its `<head>`:

   ```html
   <link rel="stylesheet" href="../shared/tailwind.build.css">
   ```

4. Add a card for it on the root `index.html` hub page.

5. Rebuild the shared CSS (Tailwind v4 auto-scans the whole repo for
   classes in use, so any new tool's classes get picked up automatically):

   ```bash
   pnpm run build:css
   ```

6. Commit everything, including `shared/tailwind.build.css`, and push.

## While developing

Run this in a spare terminal to rebuild the CSS automatically on save:

```bash
pnpm run watch:css
```

## Deploying

GitHub Pages serves static files only - there's no build step on GitHub's
side. That's why `shared/tailwind.build.css` is committed rather than
`.gitignore`d: always run `pnpm run build:css` and commit the result before
pushing, or the site will be missing styles.

Pages settings: **Settings -> Pages -> Source: Deploy from a branch -> main -> / (root)**.
