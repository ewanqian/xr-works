# Greenhouse in Transit / MG-17 — completion review
2026-11-09 | Based on ewanqian/Greenhouse-in-Transit source and documentation. No physical headset acceptance is claimed.

## Artistic thesis

The artwork's strength is not WebXR technology by itself. It is one physical object that carries a displaced space: an apparently lost suitcase becomes the interface to a digital greenhouse, a travel archive, and a decision about whether to recover or inhabit that space.

For curatorial presentation, the single best experience is a compact **physical case → three evidence objects → greenhouse unfolding → afterimage → failed recovery → temporary habitation** story. Show, don't explain 81 lore entries.

## Current source reality

- Project site and archive exist: index.html redirects to mg17-intake.html; Archive/project-home-v2.html and Archive/archive-viewer-v2.html provide context.
- xr/ground-zero.html is a four-stage prototype with desktop/VR selection, six records and operator controls; documentation explicitly says not finished modelling/headset acceptance.
- xr/branch-atlas/ is a separate **nine-route × nine-node (81 selection) design explorer**, using perspective-projected wireframe Canvas rather than a headset WebXR scene. It is not 81 authored visual environments.
- xr/experience-v2/index.html defines a six-beat 60–90s sequence with actual desktop, controller and WebXR hand pinch pathways; the dedicated score.mjs reducer controls gates, evidence and events.
- The story uses three required records (ticket, parameter card, botanical memory sample), brief botanical afterimages and the failed-recovery/habitation end.
- The XR README says the current placeholder GLB/USDZ is about 2.3 KB, not a final detailed case/greenhouse asset.
- Current documentation says real-case MR anchoring/occlusion, real headset interaction QA and final audio are **not complete**. Do not label them complete until physically demonstrated.
- Experience-v2 has source and browser CI configuration. CI presence does not establish successful physical-device operation.

## Actual completion score — qualitative, not benchmarked percentages

| Dimension | Current assessment | Evidence / main blocker |
| --- | --- | --- |
| Distinct concept / narrative | Strong | Existing unusual transported-space metaphor, six-beat dramaturgy |
| Story structure | Good prototype | Clear gates and evidence; still needs author final selection/edit |
| Mobile entry and lore | Functional source present | Multiple parallel pages can dilute the visitor's path |
| Desktop WebGL prototype | Source-built, needs visual review | Procedural scene rather than approved authored assets |
| WebXR interaction | Implemented but unverified on-device | Gaze/pinch/selection code, no real headset QA records examined |
| Visual finish | Below exhibition-ready | Final suitcase, botanical forms, scan/texture composition missing |
| Physical staging | Concept stage | Real case registration, QR alignment, installation proof missing |
| Sound design | Prototype | Short procedural sounds, not final spatial audio/mix |
| Documentation and operator flow | Partially mature | Runbook exists; needs physical rehearsal and recovery drills |
| Public artwork case | Not approved yet | Needs complete capture, actual photographs, credits and installation record |

## Cut the excess before more creation

**Stop expanding** nine routes/81 micro-actions. Keep them as background design options, not new production commitments. Keep the full lore archive accessible, but route visitors through only **three decisive clues**. Do not build a mobile app, AVP-native codebase, multi-user backend, realtime Gaussian pipeline or complex climate simulation before the base 85-second story works in desktop + Quest.

Do not replace Three.js with an unverified engine solely because it looks newer. Use existing Ground Zero and Experience V2 code to close physical interaction.

## Six concrete gates to finish

**G1 / One visitor loop:** A first-time tester understands what to do without reading a manual; completes case opening, three distinct clues, greenhouse unfold, afterimage, failed recall and habitation in 60–90 seconds. No forced auto-advance in audience mode.

**G2 / True assets:** Replace placeholder case model with a visually convincing authored suitcase and a restrained botanical spatial scene. Match an approved silhouette, lid pivot, scale and in-world placement. Keep real scanned plants/point clouds only if the asset/source license and performance are verified.

**G3 / Cross-device basics:** Desktop and phone remain readable, stable, accessible. Test actual Quest Browser enter/exit, recentering, hand/eye selection, dropping tracking, re-entry and fallback controller. Report pass/fail + device/browser version. No claims of registered MR placement until explicitly implemented.

**G4 / Spatial registration (optional after G3):** If the art requires the virtual greenhouse to emerge from the **actual physical suitcase**, implement supported hit-test/object registration and a repeatable operator calibration. Otherwise clearly present an unanchored virtual object and do not market it as anchored MR.

**G5 / Music, sound and staging:** Curate six short sonic cues (latch, clue recognition, bloom, afterimage, recovery, habitation), one sustained environmental bed, explicit mute, safe master level and clean exit. Sound conveys story phase, not arbitrary every-hit arcade effects.

**G6 / Documentation, capture and release:** Record one uninterrupted 85-second actual run with spectator and operator views, a 45-second excerpt, 6–10 approved stills, factual installation/spec details, credited collaborators and known limitations. Only then treat it as finished XR work in Portfolio.

## A 5-session production order

1. **Story lock:** choose one six-beat path; remove distracting side routes and freeze scope. Write a one-sentence player objective for each stage.
2. **Art direction:** produce/approve case, lid, three clues and greenhouse structural visual; audit actual files, scale, licenses. Do not equate wireframe engineering with final visual.
3. **Interaction & hardware:** test three desktop loops and three Quest loops, log misses/retries, make one pass of threshold changes.
4. **Sound + operator rehearsal:** finalize coherent sound layer and practice reset, crash, interruption and attendee guidance.
5. **Capture and editorial publish:** one continuous uncut demo, approved artwork case, one source-of-truth project page and clear archives.

This is a work program, not a prediction of calendar days or a promise of automatic development.

## Recommended ownership and exposure

- Greenhouse-in-Transit repository: canonical story, props, website, 85-second XR experience and evidence.
- XR Works: link to it as a selected external project and potentially supply only shared input modules. Do not clone the lore/asset archive.
- Portfolio Works: once art and headset evidence are accepted, show one Greenhouse case, not a separate card for Ground Zero, Branch Atlas and each variant.
- Writing: a finished post-mortem about the suitcase-to-space story and technical hand-tracking decisions, not 81 disjoint draft posts.

## Review links

- Source: https://github.com/ewanqian/Greenhouse-in-Transit
- Visitor entry: https://ewanqian.github.io/Greenhouse-in-Transit/mg17-intake.html
- Six-beat spatial experience: https://ewanqian.github.io/Greenhouse-in-Transit/xr/experience-v2/index.html
- Nine-route ideation atlas: https://ewanqian.github.io/Greenhouse-in-Transit/xr/branch-atlas/
