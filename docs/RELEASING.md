# Releasing & Versioning

How versions and publishes work in this repo, built on
[changesets](https://github.com/changesets/changesets). This is the complete
guide: adding changesets, cutting versions, prerelease (beta) cycles, and
publishing to npm.

## How versioning is set up here

Three publishable packages version from the same changesets and release
together:

| Package | Directory | Notes |
|---|---|---|
| `@kala-ui/react` | `packages/react` | standard UI components |
| `@kala-ui/react-app` | `packages/react-app` | app-level composites, depends on `react` via `workspace:*` |
| `@kala-ui/react-hooks` | `packages/react-hooks` | hooks |

Relevant wiring (already in place, listed so you know what to touch —
usually nothing):

- Root scripts: `pnpm changeset`, `pnpm run version-packages`
  (`changeset version`), `pnpm run release` (`changeset publish`).
- `.changeset/config.json`: public access, GitHub-linked changelogs
  (`repo: krr2020/kala-ui`), `baseBranch: main`, no auto-commits
  (`commit: false`), and `updateInternalDependencies: patch` — when `react`
  bumps, `react-app`'s dependency range is updated automatically.
- Because internal deps are `workspace:*`, pnpm swaps them for the real
  version at publish time; changesets keeps the three packages' versions
  in lockstep when their changesets bump together.

The mental model: **changesets are pending release notes living in
`.changeset/*.md`. `version-packages` folds them into versions +
CHANGELOGs. `release` publishes whatever is versioned but unpublished.**

## Step 1 — Add a changeset (with every consumer-relevant change)

Whenever a PR changes package behavior in a way a consumer would notice,
add a changeset in that PR:

```sh
pnpm changeset
```

The interactive wizard walks you through three prompts:

1. **Select packages** — the ones that changed. Space toggles entries,
   `a` selects all, Enter confirms. (`react-app` changes usually mean
   `react` too only if core itself changed — the dependency bump is
   handled automatically, don't add changesets for it.)
2. **Select bump type**:
   - `patch` — bug fixes, no new API
   - `minor` — new features and, while pre-1.0, breaking changes
     (pre-1.0 minors carry breaks)
   - `major` — reserved for the 1.0 line and beyond
3. **Write a summary** — this text becomes the CHANGELOG entry verbatim.
   Lead with what changed and why; use **bold** for component names and
   breaking changes; mention migration steps or point at
   `docs/MIGRATION-<version>.md`.

The wizard writes a file like `.changeset/<random-words>.md`. Commit it
with the PR. Multiple changesets per PR are fine — they all fold into the
next version.

### Writing a changeset by hand

The wizard needs an interactive terminal. If you don't have one (CI, script,
agent), the file format is plain markdown with a YAML frontmatter map:

```md
---
"@kala-ui/react": minor
"@kala-ui/react-app": minor
---

**DataTable** now honors a controlled `pagination.page` …

- Sorting, filtering and selection semantics unchanged.
- Migration: …
```

Keys are package names; values are `patch` | `minor` | `major`. The body is
the changelog entry. Delete the file only via `version-packages` (below) —
never hand-edit versions to "consume" a changeset.

## Step 2 — Fold changesets into versions

```sh
pnpm run version-packages
```

This:

- removes every `.changeset/*.md` (their content moves into the packages)
- bumps each package's `version` in `package.json` by the highest bump
  requested for it
- updates `workspace:*` internal dependency ranges
- prepends entries to each package's `CHANGELOG.md` (with links to the
  commits/PRs, courtesy of the GitHub changelog formatter)

Review the result (`git diff`), adjust wording if needed, and commit. If
you're not in prerelease mode, this is a normal version — skip to
publishing.

> During prerelease mode, consumed changesets are parked in
> `.changeset/pre/` and only surface in CHANGELOGs when the cycle exits
> (see below).

## Prerelease (beta) cycles

Prerelease mode makes `version-packages` publish `-beta.N` versions
instead of stable ones. One cycle looks like:

```sh
pnpm changeset pre enter beta    # 1. enter prerelease mode (once per cycle)
pnpm run build                   # fresh dist
pnpm run version-packages        # 2. -> 0.x.0-beta.N, N increments each run
pnpm run release                 # 3. publish betas (see next section)

# …more changes land, more changesets added…

pnpm run version-packages        # repeat as often as needed
pnpm run release

pnpm changeset pre exit          # 4. when done: exit prerelease mode
pnpm run version-packages        # 5. folds parked changesets into the stable
                                 #    version (e.g. 0.1.0) and its CHANGELOGs
pnpm run release                 # 6. publish the stable version
```

Two gotchas we've hit in this repo:

- **The prerelease counter continues from the highest existing prerelease
  of that tag.** Coming from `0.0.1-beta.8`, entering beta mode and
  versioning produced `0.1.0-beta.9` — not `beta.0`. If a clean
  `0.1.0-beta.0` is wanted, normalize `package.json` versions and the new
  CHANGELOG headings by hand before publishing (nothing published =
  nothing to un-publish).
- **Mode state lives in `.changeset/pre.json`.** `"mode": "exit"` means
  prerelease mode is off (the normal state). Commit this file — it's
  shared state for everyone cutting releases.

## Step 3 — Publish to npm

```sh
pnpm login                       # npm account; publishes are public
pnpm run build                   # REQUIRED — see note
pnpm run release                 # changeset publish: packs + publishes + tags
git push --follow-tags           # push commits AND the created version tags
```

**The build note:** `changeset publish` does **not** build — it packs
whatever is in each package's `dist/`. There are no `prepublishOnly`
hooks by design (keeps `pnpm install` fast). Always run `pnpm run build`
immediately before `pnpm run release`, or you will publish stale output.
With 2FA enabled npm will prompt for an OTP during publish.

`release` only publishes packages whose version changed and isn't already
on the registry, so re-running it is safe. Each published package gets a
git tag (`@kala-ui/react@0.1.0-beta.0` etc.) — hence `--follow-tags`.

Published files are exactly `dist`, `README.md`, `LICENSE`,
`CHANGELOG.md` (the `files` allowlist in each package.json). CSS ships
inside `dist/styles/`, so consumers need no build step of their own.

## Verifying without publishing (dry runs)

From inside a package directory:

```sh
pnpm publish --dry-run --no-git-checks --tag beta
```

- `--tag beta` is **required for prerelease versions** — npm refuses to
  publish a prerelease without an explicit dist-tag.
- `--no-git-checks` skips pnpm's clean-working-tree check, which fires
  during dry runs from a dirty checkout.

The output lists every file and the packed size — sanity-check that
`dist/styles/*.css` and the per-component outputs are present.

## What must be green before publishing

- `pnpm run lint` (includes the package-boundary guard),
  `pnpm run type-check`, `pnpm run test`
- `pnpm run build` and `pnpm run build-storybook`
- `pnpm run test-storybook` (710 story smoke + 520 visual baselines)
- `pnpm run build:apps` (Next.js consumer gate: every component SSRs
  through the published exports)

Migration notes for breaking releases live in `docs/MIGRATION-<version>.md`.

## Quick reference

| Task | Command |
|---|---|
| Add a changeset | `pnpm changeset` |
| Fold changesets into versions + CHANGELOGs | `pnpm run version-packages` |
| Enter / exit prerelease mode | `pnpm changeset pre enter beta` / `pre exit` |
| Build all packages | `pnpm run build` |
| Publish (build first!) | `pnpm run release` |
| Dry-run one package | `pnpm publish --dry-run --no-git-checks --tag beta` |
| Push commits + version tags | `git push --follow-tags` |
