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

- Keep the mountain and underground journey in one sticky scene with a scoped GSAP context; this prevents gaps during descent and avoids killing unrelated scroll animations.
- Animate all four mountain layers independently during descent, counterbalancing the shared scene translation with the rear layer; this preserves visible parallax without uncovering the sky edge.
- Use generated bundled scenery for the alternate sky and geological cutaway; this keeps the existing mountain layers intact and makes the new media deployable.
