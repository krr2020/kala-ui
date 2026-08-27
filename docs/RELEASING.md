# Releasing

Kala UI releases through [changesets](https://github.com/changesets/changesets).
All three workspace packages (`@kala-ui/react`, `@kala-ui/react-app`,
`@kala-ui/react-hooks`) version from the same changesets; bump them together
(`react-app` depends on `react`, which changesets links via `workspace:*`).

## Daily flow

1. Land changes on `main` (CI gates: lint, type-check, unit tests, package
   + Storybook build, Storybook visual regression, Next.js consumer build).
2. Add a changeset describing consumer-relevant changes:
   ```sh
   pnpm changeset
   ```
   Pick the packages and a bump type — `patch` for fixes, `minor` for
   features, `major` for breaking changes (pre-1.0 minors carry breaks).
3. Merge the changeset with your PR.

## Cutting a release

```sh
pnpm run build          # fresh dist for all packages
pnpm run version-packages   # consumes changesets, bumps versions, writes CHANGELOGs
```

Review the version bumps and changelog entries, then either publish the
prerelease line:

```sh
pnpm changeset pre enter beta   # once per prerelease cycle
pnpm run version-packages
pnpm changeset pre exit         # before the stable release
```

or go straight to publishing:

```sh
pnpm login                      # npm account with 2FA; publish access is public
pnpm run release                # changeset publish (builds, packs, publishes, tags)
git push --follow-tags
```

`pnpm publish --dry-run` inside a package directory lists exactly what would
be shipped (`dist`, `README.md`, `LICENSE`, `CHANGELOG.md` — nothing else).

## What must be green before publishing

- `pnpm run lint`, `pnpm run type-check`, `pnpm run test`
- `pnpm run build` and `pnpm run build-storybook`
- `pnpm run test-storybook` (710 story smoke + visual baselines)
- `pnpm run build:apps` (Next.js consumer gate: every component SSRs
  through the published exports)

Migration notes for breaking releases live in `docs/MIGRATION-<version>.md`.
