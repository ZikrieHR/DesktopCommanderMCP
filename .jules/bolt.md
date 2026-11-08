## 2026-05-18 - Allocation-free line counting for file reading and writing
**Learning:** `TextFileHandler.countLines()` is called whenever reading text files under 10MB (to populate totalLines in status headers) and on every `writeFile` operation for telemetry. Using `content.split('\n')` creates an array of all line strings in memory; for files with tens of thousands of lines, this allocates megabytes on the V8 heap and creates GC pauses.
**Action:** Use an index-based `content.indexOf('\n', pos)` loop to count newlines without any array or substring allocations.
