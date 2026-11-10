# XR Works — migration and source-of-truth plan
> 2026-11-11 update: the homepage and four original studies are implemented in this repository. The existing Portfolio publisher hosts a build from a pinned source commit at `/xr-creations/`. Old demos remain at their original URLs; a catalogue entry is not a code migration. The original wave plan below is retained as historical context. Browser and headset acceptance remain distinct, and the new entries are labelled prototypes.

2026-11-09 | Status: planned, not copied or deployed

## Decisions

- Canonical independent research home: https://github.com/ewanqian/xr-works (this actual repository; replaces the earlier proposed spatial-hand-lab name).
- Personal Portfolio: curated artworks, real projects and publications; Apps remains a thin gateway, not a gallery of every experiment.
- Performable Music: composition, visual-instrument scoring, Ableton/Max/OSC music bridges and live-performance systems.
- Greenhouse in Transit: its own project and narrative source, **not a folder inside XR Works**.
- XR Works: reusable tracking runtime, gesture mechanics, rapid tests, interactive micro-demos, selected stable XR experiences, research notes.

## Public link protection

The following original URLs have already been circulated or might have been shared. Do not remove, redirect or break them without an audited compatibility plan.

| Original source | URL | Action |
| --- | --- | --- |
| Hand / Space / OSC | https://ewanqian.github.io/performable-music/spatial-playground/hand-osc-lab/ | Preserve indefinitely |
| Hand / Synth / Space V2 | https://ewanqian.github.io/performable-music/spatial-playground/hand-osc-lab/instrument.html | Preserve indefinitely |
| Organic Fields | https://ewanqian.github.io/performable-music/spatial-playground/hand-osc-lab/playground.html | Preserve until user confirms the exact 3rd circulated link |
| Gesture Dynamics | https://ewanqian.github.io/performable-music/spatial-playground/hand-osc-lab/gesture-dynamics.html | Preserve link; future development at XR Works |
| Spellcraft | https://ewanqian.github.io/performable-music/spatial-playground/hand-osc-lab/spellcraft.html | Preserve link; keep fantasy fan research separate from generic input library |
| Sixfold / Warlock | https://ewanqian.github.io/performable-music/spatial-playground/warlock-immersion/ | Preserve and label unofficial fan study |
| Warlock / Six Elements | https://ewanqian.github.io/performable-music/spatial-playground/warlock-lab/ | Preserve until comparison decides a canonical version |

There are more deep links in Portfolio's underlying historical application registry. Inventory and serve every one before deleting a single legacy static file.

## Copy-first migration waves

### Wave 0 — repository scaffold (now)
Create documentation, public taxonomy and an inventory. No source/assets copied at this stage. No Pages hosting implied.

### Wave 1 — standalone shared library (highest reuse)
From Performable Music hand-osc-lab, copy only tested generic modules with imports preserved:
- engine.mjs (25 joint semantics / normalization)
- gesture-stability.mjs and tests
- gesture-dynamics-engine.mjs only if needed by core
- gesture-stream-engine.mjs and tests
- spellcraft-controls.mjs and tests only under study/interaction, not as core mandatory dependency
- WSS/OSC bridge only after security and environment configuration review

Do not blanket-copy the whole directory. Run independent syntax + deterministic tests with no dependency on Performable Music paths. Add explicit source origin commit SHA for every copy.

### Wave 2 — interactive demonstrations
Copy/rationalize **one** canonical Gesture Dynamics streaming demo and **one** canonical Spellcraft interaction test, then later Warlock into a distinct fan-studies area. Keep its own license ledger and do not package Bungie audio. Avoid maintaining two nearly identical six-school Warlock pages in the final showcase: compare them and archive the loser as an experiment.

### Wave 3 — performable experiments
Move generic XR-input demos like joint labels, gesture contact, controls, particle dynamics, neuro-fields into studies, but leave *musical composition/arrangement works* canonically in Performable Music. References can link across repos. Do not migrate playable music wholesale into XR Works.

### Wave 4 — independent Pages and cutover
Use the new XR Works Pages address ONLY after source migration, build, smoke tests, HTTPS and headset validation.
- Resolve all relative imports and asset paths.
- Verify desktop real WebGL plus mobile responsiveness and gesture/sound unlock.
- Quest 3: AR/VR selection, hand tracking, independent left/right loss, stable FPS, stereo/SFX, scene reset, exit.
- Only then update XR Works links from GitHub source links to runnable app URLs.
- Keep old public URLs running indefinitely as compatibility mirrors or explicit safe entry pages.

## Proposed folders

- docs/ : inventory, references, decisions, QA and curatorial assessment
- packages/hand-input/ : reusable WebXR joints and tracking confidence
- packages/gesture-runtime/ : state machines / motion grammars / space transforms
- packages/osc/ : secure bridge and tested protocol boundaries
- apps/ : actual hosted, self-contained testable software
- studies/ : short experiments and A/B variants, including failed results
- fan-studies/ : nonofficial franchise interactions, separate IP and sound attribution
- showcases/ : author-curated XR works accepted for public artistic presentation

## Gate for archive and deletion

No deletion merely because a Portfolio card was hidden. A later demo can be called archived when an immutable commit, a test result, dependencies and a README explain whether it is stable, broken or intentionally retired.

## Notes on naming

Portfolio Apps is a **launchpad** for 2 public legacy entries plus a gateway to the XR Works research index. A future independently hosted interactive XR Works *Test Table* can be added when it actually exists. The repository index is currently the only verified new destination.
