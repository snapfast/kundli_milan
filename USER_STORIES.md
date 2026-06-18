# User Stories - Milan Moon

## Core Functionality

### 1. Profile Creation & Astrology Calculation
**As a user**, I want to provide my name, email, birth date, time, and location, **so that** the system can calculate my unique astrological profile (Kundli) and identify my Nakshatra and Moon Sign.

*   **Acceptance Criteria:**
    *   Form validation ensures all mandatory fields (Name, Email, DOB, TOB, Location) are filled.
    *   Location autocomplete helps me find the correct coordinates for my birthplace.
    *   The system calculates my planetary positions and Panchang details correctly.
    *   My data is saved locally (cookies) and on the backend for future visits.

### 2. Personalized Dashboard
**As a returning user**, I want to be automatically recognized and directed to a dashboard, **so that** I can view my astrological summary and top matches without re-entering my details.

*   **Acceptance Criteria:**
    *   If a 'user_id' cookie exists, the home page redirects me to the dashboard.
    *   The dashboard displays my name, email, birth details, and Manglik status.
    *   I have the option to edit my profile or reset it entirely.

### 3. Milan Moon Matchmaking
**As a user looking for a partner**, I want the system to compare my astrological profile with other users using the Ashta Koota (36-point) system, **so that** I can find people with the highest Milan Moon compatibility.

*   **Acceptance Criteria:**
    *   The system calculates compatibility based on Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot, and Nadi.
    *   Manglik Dosha compatibility is factored into the final assessment.
    *   My top 3 matches are displayed with their compatibility score and a descriptive category (e.g., "Soul Connection").
    *   I can see a breakdown of the individual Koota scores for each match to understand *why* we are compatible.

### 4. Privacy & Data Management
**As a privacy-conscious user**, I want my email address to remain private from others, and I want the ability to delete my data from the system at any time.

*   **Acceptance Criteria:**
    *   My email address is shown on my dashboard but **never** in the match cards shown to other users.
    *   The 'Reset' functionality clears my local cookies and resets my profile on the backend.

### 5. Educational Insights
**As a user curious about astrology**, I want to see explanations for the various compatibility factors (Kootas), **so that** I can learn more about what the scores mean.

*   **Acceptance Criteria:**
    *   Clicking or hovering over a Koota name (like "Yoni" or "Gana") reveals a brief explanation of its significance in Vedic astrology.
