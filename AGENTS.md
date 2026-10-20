<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

<!-- LOVABLE:BEGIN-PERSIAN -->
> [!IMPORTANT]
> Persian (RTL) text is first-class: load the Vazirmatn webfont through a `<link>`
> in the root route's `head()` (`src/routes/__root.tsx`), never via `@import` in
> `src/styles.css` (Tailwind v4's Lightning CSS build resolves imports from disk
> and a remote URL breaks the build). Any Persian heading needs `dir="rtl"` +
> `lang="fa"` and `letter-spacing: 0` — negative tracking pulls Persian glyphs apart.
<!-- LOVABLE:END-PERSIAN -->

- Keep celestial bodies as separate, source-aligned transparent images inside the sky parallax layer so mode changes animate them independently without changing their responsive position.
- Keep mode mapping and transition duration in the browser-safe parallax-mode module so behavior tests and the rendered scene use the same rules.
- Keep public discovery routes separate from client-gated account routes; private operations use authenticated server functions with database authorization so route guards never substitute for data access checks.
- Keep shared travel eligibility and validation rules in browser-safe modules; server functions validate them again and database routines own sensitive booking transitions.
- Preserve the parallax scene as an independent visual container; render functional discovery content through its children without changing sky or celestial positioning.
