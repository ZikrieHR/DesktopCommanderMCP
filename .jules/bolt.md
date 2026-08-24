## 2026-03-29 - Fast-path Line Ending Normalization
**Learning:** Checking for carriage return characters (`\r`) with string `includes()` before normalizing line endings avoids unnecessary string allocations and regex execution when operating on standard LF (`\n`) text.
**Action:** Always consider fast-path checks for common text formats in utility functions that perform string replacement operations across search/edit handlers.
