## 2025-05-18 - Avoid full file split('\n') for partial preview slices
**Learning:** Calling `newContent.split('\n')` on multi-megabyte files during `edit_block` creates large arrays in heap memory just to slice a ~20 line preview around the edit position.
**Action:** Use single-pass `indexOf('\n')` position tracking to determine line counts and substring bounds without array allocations.
