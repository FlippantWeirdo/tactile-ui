# Rename before publishing

“Tactile UI” and `@tactile-ui` are temporary names. There is no published package or final brand commitment to migrate.

1. Pick an available npm scope that you own.
2. Replace `@tactile-ui/` throughout tracked source/config/docs, including all package names, workspace dependency keys, imports, Changesets entries/ignores, script filters, and package-boundary checks.
3. Update user-facing names in the docs, Expo app config, README, PRODUCT.md, and this guide. Change the Expo slug/Android application ID if needed.
4. Update or rename generated archive expectations in `scripts/check-packages.mjs` and any future registry/repository metadata.
5. Run `pnpm install` to regenerate workspace references in the lockfile, then run `pnpm format`, `pnpm check`, and browser checks.
6. Verify scope ownership and set a license before publishing. Confirm no old identifiers remain in source. Build outputs are regenerated rather than edited.

A later rename after publication requires a package migration/deprecation plan. Doing it before the first release is straightforward.
