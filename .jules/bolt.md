## 2025-05-10 - Single-pass regex & fast-path check for string line ending normalization
**Learning:** Replacing sequential `.replace(/\r\n/g, '\n').replace(/\r/g, '\n')` calls with a single-pass `text.replace(/\r\n?/g, '\n')` plus a fast-path `text.indexOf('\r') === -1` check drastically reduces string allocations and execution time when processing clean LF text and mixed line endings in high-frequency string operations.
**Action:** When normalizing line endings or parsing multi-line text blocks, always use `indexOf('\r')` fast-path checks and single-pass regex replacement `/\r\n?/g`.
