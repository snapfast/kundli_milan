# Palette's Journal - Moonine Vedic Matchmaker

## 2025-07-15 - Visual Focus Indicators & Keyboard Navigable Custom Radio Tiles
**Learning:** Custom styled HTML inputs (like radio buttons or checkboxes) that are hidden with `display: none;` are completely skipped during keyboard tab/navigation flow and are invisible to screen readers. This breaks accessibility. Using an accessible, visually hidden CSS utility keeps them focusable and in the DOM accessibility tree.
**Action:** Replace `display: none` on inputs with accessible visual hiding techniques, and use `:focus-within` or custom focused states to render distinct, themed focus indicators on their visual wrapper elements. Combine this with robust JS listening to input `change` events rather than container `click` events to support both clicks and keyboard arrows seamlessly.
