# Foodshare Green Tech - Sprint 1 Report

## 1. Project Overview
**Project Name:** Foodshare Green Tech
**Sprint Goal:** Establish the technical foundation (Database, API) and create the basic user interface for viewing food items.

## 2. Database Designe
We have updated the database schema to support the core functionality of sharing food.

### New Tables
1.  **Users**: Stores user credentials and profile info.
2.  **FoodItems**: Stores details of food available for sharing (name, expiry, location).
3.  **Claims**: Tracks which user has claimed which item.

## 3. Implementation Details

### Backend (Node.js/Express)
- **Database Connection**: Configured `db.js` to connect to the MySQL container using environment variables.
- **API Endpoints Implemented**:
    - `GET /api/food-items`: Returns a JSON list of all available food items, joining with the `users` table to display donor names.
    - `POST /api/food-items`: Accepts JSON payload (name, description, category, expiry, location) to create new items.
- **Middleware**: Added `express.json()` to parse incoming JSON requests.

### Frontend
- **Tech Stack**: **PUG Templates** (Server-side rendering), CSS3, Vanilla JS.
- **Interface & UX (Distinction Features)**:
    - **Premium UI**: Implemented a "Green Tech" visual identity with glassmorphism headers, gradients, and pill-shaped buttons.
    - **Responsive Design**: Mobile-first Grid layout that adapts to any screen size.
    - **Interactive Feedback**: 
        - Custom "Toast" notifications (no native browser alerts) for better user experience.
        - "Posting..." loading states on buttons to prevent double submissions.
        - Smooth CSS transitions and hover effects for a "Real-time" feel.
    - **`views/index.pug`**: Converted static HTML to PUG template for dynamic rendering potential.
    - **Post Item Modal**: Interactive form with backdrop blur and slide-up animations.
    - Asynchronous `fetch` calls to retrieve data from the backend.
    - DOM manipulation to render food cards.
    - Event listeners for modal interactions and form submission.

## 4. Verification & Testing
### Manual Verification Steps
1.  **Database**: Verified `foodshare-db.sql` executes successfully, creating `users`, `food_items`, and `claims` tables.
2.  **API**:
    - `GET /api/food-items` returns 200 OK with empty array (initially) or list of items.
    - `POST /api/food-items` successfully inserts a record into the database.
3.  **UI**:
    - "Donate Food" button opens the modal.
    - Submitting the form refreshes the grid with the new item.
    - Mobile responsiveness checked via CSS media queries (using Grid auto-fill).

## 5. Next Steps (Sprint 2)
- Implement User Authentication (Register/Login).
- Implement "Claim Item" functionality (linking `PRO` users to `claims` table).
- Add "My Items" dashboard for donors to manage their listings.

## 6. Sprint 1 Deliverables Checklist
This folder contains everything required for your submission:

| Requirement | File Location | Status |
| :--- | :--- | :--- |
| **Single PDF Content** | `sprint1_deliverables.md` | ✅ Ready to export |
| **Product Backlog** | `BACKLOG.md` | ✅ Ready |
| **Scaffolding Files** | `package.json`, `docker-compose.yml` | ✅ Present |
| **Customized README** | `README.md` | ✅ Updated |
| **PUG Templates** | `app/views/index.pug` | ✅ Implemented |
| **Dynamic Web App** | `app.js` + `static/js/main.js` | ✅ Working |

**To Run:** `docker-compose up --build`

## 7. Final Audit (Performed 07/02/2026)
- **Database File**: Renamed to `foodshare-db.sql` for project identity.
- **Sample Data**: Updated to 2026/2027 dates to match current academic year.
- **Configuration**: `.env` and `docker-compose.yml` synced to `foodshare_db`.
- **References**: "sd2" template references removed.
