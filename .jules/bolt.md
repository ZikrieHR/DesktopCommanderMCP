## 2025-05-18 - Fast-path line ending normalization for LF strings
**Learning:** `normalizeLineEndings` was executing multi-stage regex replacements (`/\r\n/g` then `/\r/g` then `/\n/g`) on every text string, even standard Unix LF strings. Adding a fast-path check `!text.includes('\r')` eliminates regex allocations and string copies for LF inputs.
**Action:** When normalizing line endings, test for `\r` before performing multi-pass regex replacements.
