# Bolt's Journal - Critical Learnings

## 2025-05-18 - String Splitting & Line Counting Optimization Patterns in Node.js
**Learning:** In V8/Node.js, character-by-character string concatenation (`str += char`) inside loops creates massive memory/GC overhead ($O(\text{chars})$ allocations). Replacing it with index tracking and `content.slice(lineStart, i + 1)` reduces allocations to $O(\text{lines})$, yielding a >10x speedup (>88% time reduction). Furthermore, for counting newline occurrences, a `while ((pos = content.indexOf('\n', pos)) !== -1)` loop is ~4x faster than `content.split('\n')` and ~15x faster than indexing characters in JS (`content[i]`), while using $O(1)$ memory.
**Action:** Prefer `content.indexOf('\n')` for counting lines and index-based `content.slice()` for preserving-split algorithms over char-by-char string concatenation.
