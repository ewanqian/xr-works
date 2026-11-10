# XR Creations / XR Works

Spatial interaction research, playable WebXR prototypes and selected immersive work.

**2026-11-11:** XR Creations now has a real homepage, a searchable catalogue of 20 existing entrances, and four playable studies using one shared runtime. The source repository keeps its established name `xr-works`. Existing public demo URLs continue to work in their original repositories.

**Website:** [XR Creations](https://ewanqian.site/xr-creations/) · [Artist Portfolio](https://ewanqian.site/#/apps)

## Start with one action

| Study | Action | End |
| --- | --- | --- |
| [Held Resonance / 掌中残响](https://ewanqian.site/xr-creations/apps/studio/?work=resonance) | Hold a string, release it into sound | Six releases |
| [Score Foundry / 空间铸谱](https://ewanqian.site/xr-creations/apps/studio/?work=score) | Arrange point, line, plane and silence | Eight choices |
| [Palm Atlas / 掌上星图](https://ewanqian.site/xr-creations/apps/studio/?work=atlas) | Locate and confirm seven positions | A completed constellation |
| [Garden of Signals / 共生之庭](https://ewanqian.site/xr-creations/apps/studio/?work=garden) | Send six pulses, then leave space | Release, then three quiet seconds |

Each study has a deliberate start, a completion state, mute, reset, one-shot replay and action-score export. Desktop/touch interactions use the same state logic as WebXR. Browsers without WebGL retain a clearly labelled perspective-projection preview. Actual Quest / Vision Pro interaction and artistic listening acceptance remain separate checks.

- [Four studies: concepts, workshop connections and next experiments](docs/FOUR_STUDIES_2026-11-11.md)
- [Project manager review and consolidation map](docs/PM_REVIEW_2026-11-11.md)
- [Destiny 2: Warlock, Titan and Hunter roadmap](docs/DESTINY_CLASS_ROADMAP.md)
- [Release and verification record](docs/RELEASE_2026-11-11.md)

## One source, one public release

Edit the homepage in `index.html`, `assets/`, `data/`, and the four-study runtime in `apps/studio/`. Run `npm test`, `npm run check`, then `npm run build`. There are no npm runtime dependencies.

`dist/` contains only the public site and a `release.json` identifying its source commit. The existing Portfolio publisher checks out the exact reviewed `xr-works` commit named in its `.github/xr-creations-source.json`, builds it, and serves the generated snapshot at `/xr-creations/`. Its copies are release output, not another editable source. A failed source check leaves the previous published version in place.

This closes the public entry without requiring a second Pages site to be enabled. `ewanqian.github.io/xr-works/` is not the release URL. See the Portfolio deployment record linked from the release note for live verification.

## Five research tracks

| Track | Content | Output |
| --- | --- | --- |
| 01 / Input & Runtime | 25-joint hands, WebXR orientation, OSC, latency, gesture recognition | reusable tested modules |
| 02 / Interaction Studies | particle physics, gesture grammars, spatial sound and instrument experiments | standalone QA-tested demos |
| 03 / Experience Prototypes | branching narratives, spells and unofficial fan interactions | complete playable loops |
| 04 / Selected XR Works | author-curated spatial artworks, installation experiences | full cases after device and artistic QA |
| 05 / Research Notes | technique, diagrams, A/B evidence, runbooks and experiments | dated and attributed records |

These are XR Works internal tracks, **not extra top-level navigation sections on the primary Portfolio**.

## Permanent early public entries

- [Hand / Space / OSC](https://ewanqian.github.io/performable-music/spatial-playground/hand-osc-lab/)
- [Hand / Synth / Space V2](https://ewanqian.github.io/performable-music/spatial-playground/hand-osc-lab/instrument.html)
- [Organic Fields](https://ewanqian.github.io/performable-music/spatial-playground/hand-osc-lab/playground.html) — potentially the third externally shared demo; preserve its URL

Older experiments still live at their original Performable Music URLs. They are catalogued here, not silently migrated or copied into new runtimes. A generic input component is available at [packages/hand-input](./packages/hand-input/README.md).

## Independent artwork

[Greenhouse in Transit](https://github.com/ewanqian/Greenhouse-in-Transit) keeps its own narrative, props, project files and publishing pipeline. XR Works can index its XR tests and share generic interaction tooling, but does not absorb or duplicate the artwork.

## Release discipline

Research → repeatable interaction → desktop/mobile QA → real Quest/AVP QA → curated artwork. Never equate a browser test with headset acceptance; never put all experimental entries into the CV.

**[Open the research catalogue](https://ewanqian.site/xr-creations/#library)** · [Historical Markdown test table](./docs/TEST_TABLE.md).

See [Migration](./docs/MIGRATION.md), [Portfolio / XR audit](./docs/AUDIT_2026-11-09.md) and [Greenhouse completion review](./docs/GREENHOUSE_REVIEW_2026-11-09.md).

This repository contains no extracted game audio or models. Copyrighted fan-study references must be separated from distributable original/licensed assets.
