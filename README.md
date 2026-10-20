# Farzaan Ali — portfolio

React + Vite portfolio. The hero is an interactive ASCII embedding space; the sections below it (About, Experience, Projects, Journey, Writing) use the same palette, and the footer echoes the hero with an ASCII wordmark.

## Development

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Where to edit

- `src/portfolio/theme.css`: the standard palette (`--color-*` tokens), typefaces, and page width. Use these tokens for new work.
- `src/portfolio/content.js`: profile links, projects (in display order; `featured: true` marks the three large homepage blocks), and professional experience.
- `src/portfolio/Showcase.jsx` and `EmbeddingField.jsx`: the hero and its canvas.
- `src/portfolio/Sections.jsx` and `sections.css`: About, Experience, and Projects; `accents.css` holds the blue title and subheading accents.
- `src/portfolio/SiteFooter.jsx`: the footer and its ASCII wordmark. `asciiText.js` traces DOM text into grid cells for both the hero name and the footer.
- `src/App.jsx` and `App.css`: routes, the Journey and Writing sections, and the project case-study pages.
- `public/media/projects/`: project screenshots. `public/documents/`: the downloadable resume.

## Pages

`/`, `/projects`, `/projects/:slug`. The older `/experience` and `/about` URLs redirect to their sections on the landing page, and `/blog` redirects to blog.farzaanali.com. Login and admin routes remain available through lazy imports; admin edits affect the legacy backend, not `content.js`. Original MongoDB project IDs continue through the legacy API-backed detail component.

Configure the production host to serve `index.html` for client-side routes. `public/_redirects` provides this fallback for hosts that support it.

## Content notes

Screenshots of YoraHealth, ComicThread, and AqaarPro are captures of their public websites. The YoraHealth dashboard preview uses fictional data, and ComicThread's cover art belongs to its publishers. KnowMyDocs and BuddyWay have no working live deployment, so they link to their case studies and source instead. The Journey section is waiting on updated content.
