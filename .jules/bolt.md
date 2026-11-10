# Bolt's Journal - Critical Performance Learnings

## 2025-05-18 - Avoid Character-by-Character Concatenation in Line Parsers
**Learning:** In V8/Node.js, parsing multiline text by looping character-by-character and concatenating to a running string (`currentLine += char`) allocates an intermediate string on every single character, creating massive O(N) allocation churn. Scanning with integer indices (`charCodeAt`) and slicing whole lines (`content.slice(lineStart, i + 1)`) keeps allocations to O(lines) and yields a ~3.4x speedup.
**Action:** Use integer indices with `slice()` when tokenizing or splitting lines preserving delimiter characters instead of accumulator string concatenation.

## 2025-05-18 - Early Exit in Line Ending Normalization
**Learning:** Many operations normalize strings to target line endings (LF, CRLF). Unconditional global regex chains (e.g. `.replace(/\r\n/g, '\n').replace(/\r/g, '\n')`) perform full-string regex scans and create new strings even when the string is already normalized. Checking `!text.includes('\r')` before running replacement passes yields an order of magnitude faster execution on standard LF text.
**Action:** Guard normalization passes with fast-path `includes()` checks before invoking multi-pass regex replacements.
