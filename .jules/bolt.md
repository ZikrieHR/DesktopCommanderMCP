# Bolt's Journal - Critical Performance Learnings

## 2026-09-29 - Text file line counting and preserving split allocations
**Learning:** `TextFileHandler.countLines` and `TextFileHandler.splitLinesPreservingEndings` run on text files up to 10MB during file reads, info queries, and edit operations. Using `content.split('\n')` allocated massive arrays of strings (e.g. 1 million elements for a 1M line file), incurring heavy V8 heap churn and GC pauses. Similarly, character-by-character string concatenation (`currentLine += char`) in `splitLinesPreservingEndings` caused excessive intermediate string object allocations.
**Action:** Use single-pass character code inspection (`charCodeAt(i) === 10`) with O(1) memory for line counting, and index-based slicing (`substring(lineStart, i + 1)`) for line splitting while preserving line endings.
