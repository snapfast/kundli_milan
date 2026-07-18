# Palette's Journal - Moonine Vedic Matchmaker

## 2025-07-15 - Visual Focus Indicators & Keyboard Navigable Custom Radio Tiles
**Learning:** Custom styled HTML inputs (like radio buttons or checkboxes) that are hidden with `display: none;` are completely skipped during keyboard tab/navigation flow and are invisible to screen readers. This breaks accessibility. Using an accessible, visually hidden CSS utility keeps them focusable and in the DOM accessibility tree.
**Action:** Replace `display: none` on inputs with accessible visual hiding techniques, and use `:focus-within` or custom focused states to render distinct, themed focus indicators on their visual wrapper elements. Combine this with robust JS listening to input `change` events rather than container `click` events to support both clicks and keyboard arrows seamlessly.

## 2026-07-17 - Keyboard Navigable Custom Radio Tiles in Calculator Interfaces
**Learning:** Just like the profile form, customized radio tiles on calculator forms can be completely non-navigable with standard keyboard flows if inputs are hidden using `display: none`. Leveraging native `change` event listeners instead of container `click` event listeners solves keyboard selection and screen-reader accessibility beautifully.
**Action:** Re-apply the accessible absolute position hiding style for native radio inputs inside any custom tile grid components, style active states gracefully with focus indicators (`:focus-within`), and use simple `'change'` event listeners on inputs to keep UI state in perfect alignment with keyboard selections.

## 2026-07-18 - Live Countdown Indicators for Limited Textarea Inputs
**Learning:** Textareas without explicit character constraints or live feedback can lead to silent failures, layout breakage, or unexpected form validation errors during submission. Providing a native `maxlength` alongside a live-updated countdown element offers immediate, non-intrusive feedback that significantly improves form confidence and accessibility.
**Action:** Always combine character-limited free-text inputs with a responsive countdown utility (like `${max - length} characters remaining`) styled neatly below the container, initialized on load to handle pre-filled data, and updating reactively on every input event.
