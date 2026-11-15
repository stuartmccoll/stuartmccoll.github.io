# CLAUDE.md

Personal blog of Stuart McColl, built with Hugo and deployed to GitHub Pages
at https://stuartmccoll.github.io/.

## Commands

- `hugo server -D`: run locally, including drafts.
- `hugo`: build into `public/`.
- To check a build without touching `public/`, build into a temp directory:
  `hugo -d "$TMPDIR/hugo-check" --quiet`.

## Layout

- `config.toml`: site config. `[params]` holds most of the copy the theme
  shows (`heroEyebrow`, `heroTitle`, `heroLede`, `role`, `focus`,
  `footerSummary`, `aboutSummary`, social links).
- `content/posts/`: posts, named `YYYY-MM-DD-slug.md`. Older posts use TOML or
  inline YAML front matter; newer ones use YAML lists. Both are fine.
- `content/posts/_index.md` and `content/tags/_index.md` exist only to set the
  section titles ("Posts", "Topics").
- `content/about/`, `content/uses/`: standalone pages with their own layouts.
- `themes/azure/`: the site's own theme (the only theme; not a submodule).
  - `layouts/partials/`: topbar, crumbs (breadcrumbs), rail (sidebar),
    footer, post-item, etc.
  - `assets/css/main.css`: all styles. Colours are CSS custom properties per
    colour scheme at the top of the file. The home page hero terminal (`.wt`)
    deliberately uses fixed PowerShell-blue colours rather than scheme
    variables.
- `public/`: committed build output. Deployment rebuilds it in CI, so you
  don't need to commit it for a change to go live.
- `.azure/bicep/`: Bicep files, validated by CI on pull requests.

## Conventions and gotchas

- Tags are displayed using the tag page's title (`.Page.Title`), not
  `.Name` (which Hugo lowercases). Write tags in front matter with their
  proper casing (`AWS`, `macOS`, `Power BI`). Hugo uses the first casing it
  finds, so keep a tag's casing consistent across posts.
- `capitalizeListTitles = false` is set so tags like `macOS` aren't
  title-cased. That is why sections need explicit `_index.md` titles.
- Changing a tag's casing doesn't change its URL; adding or removing words
  or spaces does (for example `Route53` vs `Route 53`).
- In Hugo, `.NextInSection` is the *newer* post and `.PrevInSection` the
  *older* one. The post footer relies on this.
- Writing style: British English; the site describes Stuart as a
  "technologist". His actual job title ("Solution Architect at Kainos") is
  used only in the About content (sidebar `aboutSummary` and the About page).

## Deployment

- Merging to `main` runs `.github/workflows/gh-pages.yml`, which builds with
  `hugo --minify` and publishes to the `gh-pages` branch.
- `archival.yml` archives previous versions of the site via an Azure-hosted
  website-archiver; it needs the repository secrets listed in the README.
  It is paused (manual `workflow_dispatch` only) while it is reworked:
  `azure/aci-deploy` is unmaintained, so the rework should probably replace it
  with `az container create` via `azure/cli`.
- `bicep.yml` validates `.azure/bicep/*.bicep` on pull requests.
