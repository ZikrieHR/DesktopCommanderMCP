## 2025-05-18 - Fast String Searching with Built-in indexOf vs JS Loops
**Learning:** In V8/Node.js, character-by-character JS loops for string inspection (like scanning for line endings in large files) are significantly slower (>250x) than native `String.prototype.indexOf`, which uses SIMD/C++ optimizations.
**Action:** Prefer `indexOf` or `charCodeAt` fast-paths over character indexing `s[i]` when scanning string content.
