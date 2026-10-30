## 2025-05-18 - Single-Pass Line Ending Normalization

**Learning:** `normalizeLineEndings` in `src/utils/lineEndingHandler.ts` performed a two-step string replace (converting all CRLF/CR to LF, then LF to target style). Replacing this with a single-pass regex replacement targeted to the desired line ending style (`\r\n`, `\r`, or `\n`) eliminates intermediate string allocations and reduces regex Passes from 2-3 down to 1.

**Action:** Use single-pass regex replacements tailored to target delimiters when normalizing text formatting across large files.
