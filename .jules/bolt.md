## 2025-05-20 - Fast Native String Operations for Line Ending Detection and Normalization

**Learning:** Replacing character-by-character JavaScript loops and chained `.replace()` calls for line ending handling with native V8 string methods (`indexOf('\r')`, `indexOf('\n')`, `charCodeAt(i)`) and single-pass regexes yields massive speedups (~9x faster detection, up to thousands of times faster normalization when no CR characters exist).
**Action:** When inspecting or transforming large strings in Node.js, prefer native `indexOf` for first-occurrence lookups and fast-path `.includes()` checks before running regex replacements.
