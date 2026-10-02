# Bolt's Performance Journal

## 2025-05-18 - Single-pass line ending normalization in lineEndingHandler

**Learning:** `normalizeLineEndings` was performing 2 to 3 regex string operations sequentially (converting to LF, then converting to target style). For large file edit operations (`edit_block`), this caused redundant allocation and multiple iterations over string memory. Converting to single-pass regex (`text.replace(/\r\n?/g, '\n')`, `text.replace(/\r\n?|\n/g, '\r\n')`, etc.) eliminates intermediate allocations and reduces string traversal overhead.

**Action:** Prefer single-pass regex replacements when normalizing string formatting across line endings.
