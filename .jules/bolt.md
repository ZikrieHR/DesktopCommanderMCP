## 2025-05-18 - Scroll Event DOM Thrashing in Document Outline
**Learning:** Unthrottled scroll listeners reading layout properties like `offsetTop` and mutating DOM element classes/attributes on every scroll tick cause layout thrashing and high CPU usage during document navigation.
**Action:** Gate scroll-based active state calculations with `requestAnimationFrame` and maintain a `lastActiveId` state check to avoid redundant DOM query and mutation calls when scrolling within the same section.
