## 2025-05-18 - String concatenation in loops vs V8 optimizations

**Learning:** Character-by-character string concatenation (`currentLine += char`) in JavaScript loops creates heavy GC pressure and string allocations. Replacing it with index tracking and string slicing (`content.slice(start, end)`) yields a >5x speedup for line-splitting while preserving exact line endings. However, native V8 string methods (`split`, `indexOf`, `replace`) are implemented in optimized C++ and usually outperform custom JS index loops; benchmark first before assuming a manual loop will be faster.

**Action:** Avoid character-by-character string concatenation in loops. Benchmark V8 native methods first against manual slicing before refactoring string operations.
