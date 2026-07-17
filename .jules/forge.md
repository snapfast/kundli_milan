# Forge's Journal - Moonine Vedic Matchmaker

## 2026-07-17 - Input Field Character Size Limits & Counter Integration
**Context:** Adding character size limits and validation on the user profile wizard and Guna Milan public calculator to prevent visual and database overflow.
**Discovery:** Text inputs and textareas without `maxlength` properties can accept unlimited data, causing unexpected payload size increases, UI card layout distortion, and Google Sheets row capacity issues. Large fields like bios need both client-side `maxlength` and a visual live countdown indicator to prevent a frustrating user experience when typing.
**Standard:** All future HTML input and textarea elements in this codebase that accept free text must enforce an explicit, context-appropriate `maxlength` limit. Additionally, any textarea with a limit greater than 100 characters must include a nearby, dynamically updated live remaining character indicator styled to match the warm Bumble cream and taupe aesthetic.
