# Hand Input / Stable Pose

This is the **first non-destructive source copy** into XR Works, not a repository-wide migration.

Source paths in [Performable Music](https://github.com/ewanqian/performable-music):
- spatial-playground/hand-osc-lab/gesture-stability.mjs — source blob 9827a60a56d10f72d8a310ee7e72574659326035
- spatial-playground/hand-osc-lab/gesture-stability.test.mjs — source blob 645aa025b9a190cf4062d2e1ee97a4f51bec0d55

The old copies and every existing public Demo URL remain untouched. This library is generic user-authored WebXR pose filtering, not imported Bungie or other third-party franchise assets.

Exports:
- StableHand: hand state hysteresis, differentiated entry vs exit, short occlusion holding, aim and hand-position smoothing, delayed hard loss.
- poseEvidence: relaxed continuation margins.
- HAND_STABILITY: default thresholds.

Run tests: node --test packages/hand-input/gesture-stability.test.mjs

**Limits:** This is a post-recognition stabilizer, not a complete hand pose detector or an XR renderer. It expects precomputed positions, directions, bend angles and finger separation. Real Quest hardware accuracy remains unverified at this point. Physical studies should log false triggers, aim angle and occlusion durations instead of claiming code-test success is device validation.

Next source candidates should only be copied with clear dependency boundaries. The owner-facing Apps URLs should not be switched until a new independently hosted XR Works test page exists and is verified.
