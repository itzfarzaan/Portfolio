# Creative editorial direction

Reviewed 16 October 2026. The new composition was built and visually inspected as a hero plus one featured project before the remaining sections were redesigned.

## Reference research

- [Dennis Snellenberg](https://www.dennissnellenberg.com/): portrait and oversized name form one composition; the person has as much visual weight as the work. Adapted the relationship between portrait and type, with a different layout, palette, and personal image.
- [Adam Ho](https://www.adamho.com/): layered typography, overlapping graphic material, and distinctive project identities. Adapted the print-like layering and varied project presentations. Avoided its dense, unconventional information layout to keep navigation accessible.
- [Bruno Simon](https://bruno-simon.com/): an interactive environment makes the portfolio itself a personal demonstration. Adapted the idea of expressive technical visuals and direct interaction, while keeping normal scrolling, links, and readable content. The browser inspection initially displayed the loading environment; the site's own text explains its navigable 3D world.
- [Pablo Stanley](https://www.pablostanley.com/): the current site has a personal illustrated mark and concise first-person positioning, followed by a restrained project index. Retained the emphasis on an individual identity; its current list-led composition was not a fit for this brief.

## Visual system

Butter yellow, plum, vermilion, lilac, mint, and blue form a print-inspired palette. All public-site colors remain in `src/portfolio/theme.css`. Space Grotesk handles bold display type, Instrument Serif italic supplies expressive contrast, and DM Sans handles longer reading. The fonts and open-font licenses are bundled locally.

The hero uses the original portrait as a collage with a clear name and engineering role. About uses a schematic of AI, web systems, and people. Projects use large real screenshots or explicitly identified conceptual system maps. Career panels have dated, visible responsibilities and step across the desktop composition. Journey milestones progress from school through university and professional work. Writing uses a custom illustrated cover for an actual published article. Contact closes with a vivid, legible email link.

## Content and assets

- InterviewAIde and the academic portal use existing real screenshots.
- AqaarPro and other projects without supplied screenshots use conceptual system maps, not fabricated product interfaces.
- The portrait is an optimized WebP copy of the original image; the original asset is retained.
- [The existing blog](https://blog.farzaanali.com/) was read in the browser. It lists *Building a Linear Regression model from Scratch | Coding CS229*, dated 25 May 2025, with a three-minute reading time. The article feature points to its actual permalink. The regression graphic is an editorial illustration, not an extracted screenshot or a claimed experiment result.
- No comic content, invented achievements, or unverified live project URLs were added.

## Interaction

Section navigation remains sticky and marks the current section. All content is visible without JavaScript-driven reveal effects. Intersection-based transitions enhance already-visible content; reduced-motion preferences disable the transitions. Hover motions are limited to small changes in artwork angle and links. Mobile layouts rearrange the portrait, stack the project stages, and flatten the stepped career panels.
