# STRUCTURAL CLONE V1 REPORT

## Scope

H-01 desktop-only structural clone of the Apple cinematic product-page core. This is an isolated Apple reference exercise, not The EXOTIST implementation, adaptation, Dark Reconstruction or Overlay Test.

## Implemented states

1. `SC-01 Product Opening` — opening hierarchy, oversized headline, product media surface and primary CTA.
2. `SC-02 Highlights` — cinematic media stage, film CTA and selector row.
3. `SC-03 Design` — split text/media composition and secondary CTA.
4. `SC-04 Take a Closer Look` — product viewer surface and vertical control stack.
5. `SC-05 Cameras / Lens exploration` — long scroll-driven camera stage, sticky media and lens selector.
6. `SC-06 Pro Video` — long-form split media/story composition and camera CTA.
7. `SC-07 Performance` — performance close with large type, media and return route.

All seven states are in the required Apple reference order and have direct hash routes: `#sc-01` through `#sc-07`.

## Reference evidence used

- `/Users/Shared/The EXOTIST Website/The EXOTIST-Apple SITE/evidence/APPLE_TARGETED_VALIDATION_L01_ENVIRONMENT.md`
- Existing desktop screenshot corpus `APL-PILOT-D-SEC01-S01` through `APL-PILOT-D-SEC12-S01` in the prior evidence workspace.
- Apple page reference: `https://www.apple.com/iphone-17-pro/`

## Key measured dimensions used

- Desktop validation viewport reference: `937 × 905`.
- Desktop DPR reference: `1`.
- Document height reference: `33378`.
- Section heading document positions used as proportional anchors: Highlights `867.3`, Design `1975.3`, Closer Look `3016.3`, Cameras `4108.3`, Pro Video `9357.7`, Performance `11470.4`.
- Clone section proportions are explicit CSS `min-height` values and are inspectable; they are structural approximations, not pixel-perfect claims.

## Behaviour implemented

- Sticky global navigation and local product navigation.
- Direct hash navigation for all seven systems.
- `transform` + `opacity` scroll scrub on marked media surfaces.
- Sticky media in the camera exploration scene.
- Selector/tab states for Highlights, Product Viewer and Lens Exploration.
- Pill primary CTA hierarchy and blue action color `#0071e3`.
- Neutral placeholder media only.

## Files created

- `clone/index.html`
- `clone/styles.css`
- `clone/script.js`
- `clone/STRUCTURAL_CLONE_V1_REPORT.md`

## Files modified

- `The EXOTIST-Apple SITE/PROJECT_STATE.md` only, to record accepted gates and H-01 phase.

## Known mismatches

- Placeholder media does not reproduce Apple imagery or video.
- Clone proportions are measured-reference approximations, not pixel-perfect output.
- Browser-level Apple navigation and exact media loading are not reproduced.
- Motion timing and scroll interpolation are simplified.
- Mobile CSS is present only as a containment fallback; mobile implementation was not part of H-01 validation.

## Unproven

- Exact Apple CSS geometry for every child element.
- Exact Apple easing/duration values for all media transitions.
- Exact sticky thresholds across every reference system.

## Safety confirmation

- No The EXOTIST production files outside `The EXOTIST-Apple SITE` were modified.
- No The EXOTIST content, photography, video, service names or final brand styling entered the clone.
- Overlay Test, Dark Reconstruction, Design System extraction, sitemap work and Production were not started.
