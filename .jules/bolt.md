# Bolt's Performance Journal

## 2025-05-18 - Pre-computed Levenshtein Distance in Fuzzy Search Similarity
**Learning:** `runFuzzySearch` already computes and returns the exact Levenshtein distance (`fuzzyResult.distance`) during fuzzy matching. Recomputing `getSimilarityRatio` without passing this distance forces `fastest-levenshtein` to run a redundant O(N*M) calculation on the same strings.
**Action:** Always pass `knownDistance` to `getSimilarityRatio` whenever fuzzy search distance has already been calculated.
