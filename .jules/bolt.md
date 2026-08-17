## 2025-05-18 - Fast-path HTML escaping optimization
**Learning:** Chained `.replace()` calls for string escaping create multiple intermediate string allocations and perform full traversals of the string for each character replacement. Checking for entity presence with a fast regex test (`/[&<>"']/`) and performing a single-pass index-buffered character code scan yields ~3.4x speedup for clean strings and ~2x for strings with HTML entities.
**Action:** Apply single-pass fast-path scanning pattern for hot string formatting / escaping routines in UI rendering pipelines.
