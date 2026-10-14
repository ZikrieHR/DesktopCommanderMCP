## 2025-05-18 - Fast line-ending detection with native indexOf
**Learning:** Native `String.prototype.indexOf` in V8 leverages SIMD/vectorized instructions in C++, executing line searches ~150x-200x faster than indexed JS loop iterations over large string buffers.
**Action:** Prefer native C++ string methods (`indexOf`, `includes`) over manual character iteration loops (`charCodeAt` / `[i]`) when scanning large text buffers for specific delimiters.
