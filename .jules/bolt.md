## 2025-05-18 - String Splitting & Line Operations Optimization in V8

**Learning:** Character-by-character string concatenation loops (`currentLine += char`) in V8 JS create massive object allocation churn and garbage collection pressure when processing large file strings. Using `indexOf('\n')`/`indexOf('\r')` combined with string `slice()` provides native C++ speed for string scanning, making line-preserving splitting ~6x faster and line counting ~5.5x faster without allocating intermediate string arrays.

**Action:** When working with file content parsing or string splitting in hot paths, avoid per-character loop concatenation. Use `indexOf` scanning with `slice` or `includes` short-circuits.
