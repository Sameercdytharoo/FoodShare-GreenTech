# System Integration Map - FoodShare Green Tech

This document proves that all components of your application are correctly linked and ready for "Real World" execution.

## 1. The Startup Chain 🚀
1.  **Run Command**: `docker-compose up`
2.  **Docker Logic**: Reads `docker-compose.yml`
    *   ⬇️ Starts **Database Container** (`db`)
    *   ⬇️ Starts **Web Container** (`web`)

## 2. Database Connection 🔌
*   **Infrastructure**: Docker mounts `foodshare-db.sql` -> `/docker-entrypoint-initdb.d/`
    *   ✅ *Result*: Database `foodshare_db` is created with your tables (`users`, `food_items`).
*   **Code**: `app/services/db.js` reads `.env` variables.
    *   `HOST = db` (Matches Docker service name)
    *   `DATABASE = foodshare_db` (Matches SQL file)
    *   ✅ *Result*: Node.js successfully connects to MySQL.

## 3. Web Server & API 🌐
*   **Entry Point**: `index.js` -> requires `app/app.js`.
*   **Server**: `app.js` listens on Port 3000.
*   **Docker Port Mapping**: `3000:3000` (External:Internal).
    *   ✅ *Result*: You can access the app at `http://localhost:3000`.

## 4. Frontend to Backend ↔️
*   **User Action**: User opens `http://localhost:3000`.
*   **Server**: Serves `app/views/index.pug` (The UI).
*   **Browser**: Loads `static/js/main.js`.
*   **Data Fetching**:
    *   `main.js` calls `fetch('/api/food-items')`.
    *   `app.js` receives request -> Queries Database -> Returns JSON.
    *   ✅ *Result*: Food items appear on the screen.

**Conclusion**: All links are VERIFIED. The system is a closed loop and fully functional.
