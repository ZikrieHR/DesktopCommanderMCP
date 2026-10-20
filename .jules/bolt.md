## 2025-05-18 - Avoid String Array Allocation for Line Counting
**Learning:** `content.split('\n')` creates an array containing every line string in memory when counting lines in text files. For large files (e.g. 10MB limit), this creates thousands of string allocations and array objects in V8 heap memory. Using `indexOf('\n')` in a loop counts line breaks directly without allocating any array or string objects.
**Action:** Use `indexOf('\n')` counting loops when only line counts are needed, avoiding heap allocations from `split('\n')`.
