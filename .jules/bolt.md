## 2026-08-26 - Zero-allocation NUL byte stripping for clean remote payload objects/arrays

**Learning:** `stripNullBytes` was using `Object.entries()` and `.map()` on every remote call result payload, constructing new objects and array entries even when no NUL bytes (`\x00`) were present. Switching to `for...in` and mutating/returning cloned objects only when `hasChanged` is true avoids unnecessary GC pressure and object allocations on clean payloads.
**Action:** Always check if a transformation actually mutates data before re-allocating objects or arrays in hot sanitization utility paths.
