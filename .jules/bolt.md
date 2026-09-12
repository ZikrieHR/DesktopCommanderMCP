## 2025-05-15 - Fast Line Counting in V8
**Learning:** Using `content.split('\n').length` for line counting in Node.js/V8 allocates an array of string slices for every line in the file, causing significant heap allocations and GC overhead on multi-megabyte files. `content.indexOf('\n')` iteration in a loop avoids memory allocations completely and executes ~5x faster.
**Action:** Use `indexOf('\n')` loop counting when inspecting line counts for large strings/files instead of string splitting.
