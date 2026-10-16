# Farzaan Ali — portfolio

React + Vite portfolio with a creative editorial landing page, visual project showcases, a professional career journey, education milestones, a real blog article feature, and detailed project pages.

## Development

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Where to edit

- `src/portfolio/theme.css`: public site colors, typefaces, page width, and shared design tokens.
- `src/portfolio/content.js`: profile links, all six technical projects, and experience, ordered newest first.
- `src/App.jsx`: public layouts and routes.
- `src/App.css`: responsive styling and animation. Reduced-motion preferences disable animations.
- `public/documents/Mohammed-Farzaan-Ali-Resume.pdf`: downloadable resume.

## Pages

`/`, `/projects`, `/projects/:slug`. The older `/experience` and `/about` URLs redirect to their sections on the landing page. The landing page has anchored About, Projects, Professional Experience, My Journey, Writing, and Contact sections, with a sticky navigation bar that marks the current section. Professional contributions and IEEE roles are visible without expanding controls.

The blog route redirects to blog.farzaanali.com. Original login and admin routes remain available via lazy imports. Original MongoDB project IDs continue through the legacy API-backed detail component. Admin edits affect the legacy backend, not the new local public collection; update `content.js` for the redesigned project pages.

Configure the production host to serve `index.html` for client-side routes. The existing `public/_redirects` provides this fallback for hosts that support it.

## Content decisions and follow-up

The resume and supplied LinkedIn screenshots are the sources for the first version. Artmac dates provisionally follow the resume (October 2024–February 2025); LinkedIn shows July 2024–January 2025. The LinkedIn role title is used for Linkiat. The CIS role uses the resume's Engineering Lead title and LinkedIn dates.

The personal story can be expanded when the SOP is provided. Project order is editorial, since project dates were not provided. Project showcases use existing InterviewAIde and academic portal screenshots, alongside conceptual system maps for projects without screenshots. The hero portrait and fonts are bundled locally. The writing feature links to the verified linear-regression article on the existing blog. See `docs/design-direction.md` for reference research and design decisions. Comic content and new website screenshots are deferred as requested. No comic URL or unprovided project live URL has been guessed.

This work updates the local checkout. Deployment and DNS are unchanged.
