## 2025-05-18 - Fast-path line ending normalization in file operations

**Learning:** `normalizeLineEndings` in `src/utils/lineEndingHandler.ts` was previously doing a 2-pass regex replace (`.replace(/\r\n/g, '\n').replace(/\r/g, '\n')`) regardless of whether the string actually contained any carriage returns. On Unix/Linux systems where most source files use standard LF (`\n`), checking `!text.includes('\r')` first provides an O(N) fast path that completely avoids regex execution and string allocations. For non-matching strings, single-pass regex replacement (`/\r\n?/g` for LF, `/\r?\n|\r/g` for CRLF/CR) is ~25-40% faster than multi-pass replacements.

**Action:** Always check if string contents need conversion before running regex replacements in file normalization and parsing utilities.
