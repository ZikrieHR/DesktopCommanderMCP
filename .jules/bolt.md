# Bolt's Journal - Critical Learnings

## 2025-05-18 - [Line Ending Normalization and Line Counting Bottlenecks]
**Learning:** `content.split('\n')` allocates large arrays of substring objects when counting lines or checking string boundaries, consuming megabytes of RAM on large files. Using `text.indexOf('\r') === -1` fast-paths for LF line normalization avoids running redundant global regex replace passes over clean LF files.
**Action:** Use `indexOf('\n')` iteration for line counting (O(N) time, zero array allocations) and fast-path `indexOf('\r') === -1` checks before running line ending regex replacements.
