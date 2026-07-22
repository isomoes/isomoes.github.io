# Isomoes Blog

The personal blog of [isomoes](https://github.com/isomoes) — notes on AI research, papers, and building things. Bilingual (English / 中文), deployed to [isomoes.github.io](https://isomoes.github.io).

Built on Next.js 15 (App Router), Tailwind CSS, Contentlayer, and [pliny](https://github.com/timlrx/pliny) — a fork of the [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog).

## Development

Requires [Bun](https://bun.sh).

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000). Edit layout in `app`/`components`/`layouts` or content in `data` — pages hot-reload as you go.

```bash
bun run lint   # eslint + prettier
bun test       # vitest
```

## Content

- `data/blog` — posts (MDX), organized by locale (`en`, `zh`).
- `data/authors` — author profiles.
- `data/siteMetadata.js` — site config: title, socials, comments (giscus), search (kbar), analytics (umami).
- `data/headerNavLinks.ts` — navigation, per locale.
- `public/static` — images and other assets.

Post frontmatter (see `contentlayer.config.ts` for the full schema):

```
---
title: 'Post title'
date: '2026-01-01'
tags: ['ai', 'papers']
draft: false
summary: 'One-line summary shown in listings.'
---
```

## Deploy

Pushing to `main` triggers [`.github/workflows/pages.yml`](.github/workflows/pages.yml), which runs a static export (`EXPORT=1 bun run build`) and publishes to GitHub Pages.

## Credit & Licence

Based on the [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) by [Timothy Lin](https://www.timlrx.com). [MIT](LICENSE).
