## 2025-05-18 - Single-Pass Character Scanning for HTML Escaping
**Learning:** Sequential `.replace()` regex calls on string inputs create unnecessary intermediate allocations and multiple full passes over string data. Single-pass regex testing followed by character code scanning cuts execution time by ~50% for strings containing special characters.
**Action:** Use single-pass regex exec + char code scanning when performing string escaping or sanitization on critical paths.
