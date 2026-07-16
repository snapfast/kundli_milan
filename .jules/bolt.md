# Bolt's Journal - Moonine Vedic Matchmaker

## 2026-07-15 - [Astronomy Engine SearchRiseSet Bottleneck & O(1) Lookups]
**Learning:**
1. Calling `SearchRiseSet` of `astronomy-engine` to compute sunrise/sunset takes approximately 80% of the total time for `calculateAstrology`. Since sunrise and sunset are not displayed or utilized anywhere on the platform, we can avoid this bottleneck entirely in future features by skipping or lazy-loading these calculations.
2. In client-side rendering loops on Astro, utilizing linear scans like `array.find()` inside iterated matches lists leads to unnecessary $O(N \times M)$ overhead. Pre-constructing a `Map` of key-value pairs reduces this lookup to $O(1)$ and speeds up multi-list dashboard rendering significantly as the user database grows.

**Action:**
1. Keep `SearchRiseSet` in mind as an optimization target if we ever need to make astrology calculation faster.
2. Always pre-build maps/dictionaries for multi-element dashboard list lookups.
