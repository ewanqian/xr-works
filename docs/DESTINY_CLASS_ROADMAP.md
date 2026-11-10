# Destiny 2 fan interaction — three-class expansion

Updated: 2026-11-11 (Asia/Shanghai)

## Current scope

The existing [Sixfold / Warlock prototype](https://ewanqian.github.io/performable-music/spatial-playground/warlock-immersion/) remains playable at its original URL. [Warlock / Six Elements](https://ewanqian.github.io/performable-music/spatial-playground/warlock-lab/) stays available as a comparison implementation. No source has been deleted or silently redirected.

Titan and Hunter are planned studies. Their class tabs in XR Creations show a proposed interaction grammar, **not playable class implementations**. The user will provide more detailed reference music and ability slices. There is no claim of game fidelity, affiliation with Bungie, or hardware acceptance.

## One system, distinct physical verbs

| Class | Direction to test | Input hypothesis | Feedback hypothesis | First complete loop |
| --- | --- | --- | --- | --- |
| Warlock / 术士 | Accumulation, shaping, release | Palm orientation, intentional hold and a distinct release | An audible change from potential energy to impact and decay | Summon → shape → release/freeze → impact/shatter → settle |
| Titan / 泰坦 | Weight, impulse, support | Bounded hand acceleration, two-hand preparation, controlled release | A short concentrated impact with a brief body/resonance tail | Prepare → load → bounded strike → contact → recover |
| Hunter / 猎人 | Precision, rhythm, agility | Aim dwell, a measured release gesture, repeatable follow-through | Clear launch, flight and target contact that remain distinguishable | Prepare → aim → project → hit → recover |

These are original design proposals. A real Quest test must establish safe movement range, accidental activation rate and recognition consistency before final gesture thresholds are chosen. Do not require room-scale lunges, strikes or dramatic real-world movement just to satisfy a reference animation.

## Shared sound-event contract

One class-aware event vocabulary serves all three classes. Preserve separate event identity even if a single recording initially covers multiple phases.

| Event key | Function | Preferred source slice | Playback rule |
| --- | --- | --- | --- |
| `summon` | Preparation / materialization | A clear beginning with a short tail | Once per intentional start |
| `charge` | Energy accumulation | Material that changes audibly with charge | Only during an active charge; explicit stop/release |
| `cast` | Release / projection | A crisp transition | Once on release, no repeated retrigger while holding |
| `impact` | Target contact | Transient plus useful body | Only after a confirmed hit; distinguish from cast |
| `release` | Decay / recovery | A finite afterimage | Finite tail; return to silence |
| `ultimate` | Major event | An authored development and resolution | Deliberate trigger, bounded duration, stop control |

Suggested future record shape:

```json
{
  "class": "warlock",
  "element": "stasis",
  "event": "impact",
  "source": "local-user-selected",
  "filename": "user-provided-slice.wav",
  "trimStartSeconds": 0,
  "trimEndSeconds": null,
  "gain": 0.5,
  "loop": false,
  "rights": "to-be-confirmed-before-publication"
}
```

## Implemented in this update

The XR Creations hub has a local sound-slice desk for all three classes and the six event keys. Users can choose, audition, replace and clear local audio, or reset all six assignments for the current class. Class selections retain their own assignments for the current page session. Playback is one clip at a time, at 50% volume, without looping or automatic play. Class change, page hide, collapsing the desk, reset and the stop button stop playback. Reset revokes the current class's temporary object URLs; replacing or clearing a file also revokes its previous temporary URL.

The slice desk does **not** upload audio, persist it after refresh, extract audio from a game, trim files or send assignments into the current Warlock prototype. The visible UI states this integration boundary. Selecting a class for sound preparation does not make that class playable.

## Integration sequence

1. **Reference intake.** Receive the user's named slices and precise ability/action timestamps. Record which are references and which may be distributed. Keep unreleased or uncleared recordings out of public Git history.
2. **Choose a Warlock mainline.** Compare the existing implementations on intentional activation, targeting, hit feedback, interrupted tracking, session exit and sound release. Retain old URLs whichever implementation is selected.
3. **Connect the event map once.** Add the six-key sound contract to the selected runtime. Local user imports can remain local. Public sounds must be original or appropriately licensed.
4. **Implement one Titan loop.** One bounded preparation/impact/recovery mechanism, with a short documented device test and artist listening.
5. **Implement one Hunter loop.** One aim/project/hit/recovery mechanism, tested under the same conditions.
6. **Compare by experience.** Choose what to deepen from actual control, recognition and sound quality; do not expand every element merely to fill a matrix.

## Acceptance before class promotion

- A visitor can understand the action, execute it, perceive the result and return to a quiet state.
- The core loop works with the selected real input device, and the desktop fallback is explicitly labeled.
- Audio is unlocked by user action, does not drone at rest, and stops when hands are lost or the session ends.
- Each class has a distinct action grammar and feedback shape. Cosmetic color changes do not count as new classes.
- Source, current build, input mapping, sound mapping and the device-test record are traceable.
- The artist's listening and playtest decides whether the experience is enjoyable; unit tests do not establish that judgment.

## Source boundaries

- Existing implementation source: `ewanqian/performable-music`, `spatial-playground/warlock-immersion/` and `spatial-playground/warlock-lab/`.
- Hub and expansion plan source: `ewanqian/xr-works`.
- Public entry inventory: [TEST_TABLE.md](./TEST_TABLE.md).
- The four original studies remain a separate creative line: [FOUR_STUDIES_2026-11-11.md](./FOUR_STUDIES_2026-11-11.md).
