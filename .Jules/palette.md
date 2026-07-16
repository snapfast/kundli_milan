# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-03-04 - Accessible Custom Radio/Select Tiles
**Learning:** Custom UI selectors like gender tiles often use hidden radio inputs. Styling these inputs with `display: none` completely removes them from the document tab flow and accessibility tree, rendering keyboard arrow navigation and screen reader support broken. Additionally, binding selection styling updates solely to label `click` events fails when keyboard navigation selects options directly.
**Action:** Visually hide inputs using absolute positioning, zero width/height, zero opacity, and `pointer-events: none` instead of `display: none`. Always attach `change` event listeners to native inputs to ensure robust visual state synchronizations for both click and keyboard-based selection. Add distinct `:focus-within` outline/ring selectors on their container wrappers to supply clear visual cues for focus.
