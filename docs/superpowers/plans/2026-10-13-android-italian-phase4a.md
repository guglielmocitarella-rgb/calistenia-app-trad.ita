# Android Italian phase 4A Implementation Plan

> Execute inline with the existing phase 2 inventories. The user's instruction authorizes implementation, commits and CI verification; stop for review after this block.

**Goal:** Italian display text for navigation, authentication, onboarding, home, profile, settings and common controls on Android.

**Architecture:** Update only Italian UI catalog values and Android display adapters. Keep ES/EN content translators and phase 3 policies intact. Web imports only ES/EN and must remain unchanged.

**Tech Stack:** React Native / Expo, i18next, TypeScript, Vitest, pnpm.

**Spec:** User's phase 4A request; `docs/ANDROID_ITALIAN_LOCALIZATION_AUDIT.md` and its inventory JSONs.

## Constraints

- No backend, web, workflows, build infrastructure, migrations, release, algorithms or persisted content changes.
- No new server `it`; no modifications to phase 3 language protections.
- Retain PR #1 as draft and do not start later translation blocks.

## Tasks

- [ ] Select keys using phase 2 source references, dynamic families and the requested screen scope; record exact keys and accepted identical values in `docs/ANDROID_ITALIAN_PHASE4A_STRINGS.json`.
- [ ] Translate `packages/core/locales/it/translation.json`, review terminology, interpolation, numbers and singular/plural grammar. Maintain a repository glossary.
- [ ] Address display-only onboarding month names and profile skill labels; localize recognized authentication messages without changing remote payloads or unknown free text. Verify Android-only adapters and unchanged source data.
- [ ] Run core/mobile/web suites, all-workspace typecheck and lint; verify keys, placeholders, plurals and hardcoded display text. Preserve original phase 2 artifacts.
- [ ] Record translated and residual strings and limitations in `docs/ANDROID_ITALIAN_PHASE4A_REPORT.md`. Commit and push to existing PR branch. Verify every applicable Actions run/job including Security and Dependency Review against the new SHA.
- [ ] Keep draft status and stop for review; no merge or release.

## Review focus

- Short labels with ambiguous meanings (train, sets, light, streak).
- Singular `count=1` versus plural `count=2`, including screen-reader labels.
- Placeholder names and numbers must remain intact.
- Rendering must never copy localized labels into exercise identities or persisted records.
- Remote free text, changelog, catalog/program titles and later screens are explicitly reported rather than rewritten.
