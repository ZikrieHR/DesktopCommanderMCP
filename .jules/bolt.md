## 2025-05-20 - Character-by-Character String Concatenation in Line-Splitting

**Learning:** Accumulating strings character-by-character (`currentLine += char`) in a loop over large text files causes $O(N)$ string object allocations and re-allocations in Node.js/V8, taking ~490ms for a 5MB/100k-line file.
**Action:** Use `content.slice(start, i + 1)` combined with `content.charCodeAt(i)` to split lines while preserving line endings. This achieves an ~8.7x speedup (~56ms) and avoids 100,000+ intermediate string allocations.
