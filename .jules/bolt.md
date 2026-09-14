## 2025-05-18 - Non-allocating Line Scanning with `indexOf('\n')`
**Learning:** Using `str.split('\n').length` or `str.split('\n').slice()` allocates large arrays on the V8 heap when processing multi-megabyte files. Scanning newline positions using `str.indexOf('\n', pos + 1)` in a simple loop runs ~4x-8x faster and has zero heap allocation overhead.
**Action:** Always prefer `indexOf('\n')` position scanning over `split('\n')` when counting lines or extracting line ranges from large strings in Node.js.
