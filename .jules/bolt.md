## 2025-02-17 - Line Ending Detection & String Search Patterns in V8

**Learning:** `content.indexOf('\r')` scans the entire text when `\r` is absent (common in Unix source files), whereas `/[\r\n]/.exec(content)` halts at the very first line ending (`\n` or `\r`), making regex execution ~6x faster for line ending style detection. Furthermore, counting matches with `(content.match(/\n/g) || []).length` allocates a full array of string matches in heap memory, whereas an `indexOf('\n')` loop counts occurrences without any heap allocations.

**Action:** Prefer single-pass short-circuiting regex `/[\r\n]/.exec()` when looking for the first occurrence among multiple characters, and use `indexOf` loops over `match()` when counting character occurrences in large strings.
