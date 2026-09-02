# Bolt's Journal - Critical Performance Learnings

## 2025-05-10 - Fast-path check for line ending normalization
**Learning:** Sequential `.replace()` calls on large strings allocate intermediate strings even when no conversion is required. Adding fast-path checks using `.includes()` (`!text.includes('\r')`) completely avoids string allocation and regex execution for standard LF text.
**Action:** Before applying standard string normalization routines, check if the string already conforms to the target format to skip unnecessary work.
