## 2025-05-18 - String Concatenation vs Substring Slicing for Line Splitting
**Learning:** Character-by-character string concatenation (`currentLine += char`) in long text traversal creates massive string allocation and garbage collection overhead in V8/Node.js, scaling poorly on files even 1MB+ in size (taking ~1600ms on 1.5MB).
**Action:** Always prefer scanning index bounds with `charCodeAt()` and slicing with `string.substring(lineStart, lineEnd)` to extract tokens/lines with minimal intermediate object allocations, yielding >80% latency reduction.
