## 2025-05-18 - Avoid Character-by-Character String Concatenation for Line Operations
**Learning:** In Node.js text processing, character-by-character loops doing `currentLine += char` generate high GC pressure and slow execution down significantly on large files. Index scanning with `charCodeAt` and `substring(start, end)` slicing is ~3x faster and avoids temporary string allocations.
**Action:** When scanning or splitting large text strings by delimiters/endings, track start/end indices and slice with `substring` rather than accumulating characters in a loop.
