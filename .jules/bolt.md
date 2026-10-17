## 2025-05-18 - Fast-path checking for line ending normalization
**Learning:** `normalizeLineEndings` in `lineEndingHandler.ts` was executing double-pass regex replacements unconditionally on every `edit_block` call. Adding simple `.includes()` fast-path checks avoids regex overhead and string allocation when content already matches the target line ending style.
**Action:** Always check if a string already meets target formatting conditions using fast methods (`.includes()`, `.startsWith()`) before running full regular expression replacements or string transformations.
