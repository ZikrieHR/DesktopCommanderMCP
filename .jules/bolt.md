## 2025-05-18 - Optimized Line Ending Detection with Native `indexOf`
**Learning:** Iterating character-by-character in JS (`for (let i = 0; i < str.length; i++)`) on large file content for simple substring/character searches like `\r` and `\n` is significantly slower than native C++ `String.prototype.indexOf`.
**Action:** Use native `String.prototype.indexOf` jump-scanning for line-break and character search routines to bypass JS loop overhead.
