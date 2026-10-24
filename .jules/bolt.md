## 2025-05-18 - Fast-path checking in string normalization
**Learning:** `normalizeLineEndings` was executing multi-pass regex replacements unconditionally even when strings already had the desired LF (`\n`) format or no newlines at all. Fast-path checking with `text.includes('\r')` completely avoids regex engine overhead and memory allocations for LF-normalized strings.
**Action:** When performing string transformations or normalizations across frequent text tool operations, check if input strings already satisfy target invariants before executing regex operations.
