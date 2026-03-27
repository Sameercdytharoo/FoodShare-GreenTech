# Sprint 3 Deliverables – FoodShare Green Tech

## 1. Project Information
**Group Name:** The Groupmates
**Project Title:** FoodShare – Community Food Waste Reduction Platform
**GitHub Repository:** [FoodShare-GreenTech](https://github.com/Sameercdytharoo/FoodShare-GreenTech)
**Task Board:** [GitHub Project Board](https://github.com/users/maheshbatala/projects/1)

### Team Members
1. Sameer Chaudhary Tharu (Lead Developer / Scrum Master)
2. Mahesh Batala (Frontend Developer)
3. Dhiraj Yadav (Backend Developer)
4. Prativa Rai (Database Administrator / Tester)
5. Rupesh Shah (DevOps / Documentation Lead)

---

## 2. Implemented User Stories (Sprint 3)

The following core stories from the Sprint 2 plan have been successfully implemented using MySQL, Express, and PUG templates. The development environment runs on Docker.

### US1: Listing Food Items (Donor)
**Story:** As a Donor, I want to list surplus food items with details so that they can be discovered.
- *Implemented Page:* `/items` (List View)

![Food Listing Page](app/ss/Food%20Listing%20Page.png)

### US2: Browse Available Food (Recipient)
**Story:** As a Recipient, I want to browse available food items so that I can find food near me.
- *Implemented Page:* `/categories` (Tagged by category)

![Category Page](app/ss/Category%20Page.png)

### US3: View Detailed Items & Claim (Recipient)
**Story:** As a Recipient, I want to see details and claim a food item so that it is no longer available.
- *Implemented Page:* `/items/:id` (Detail Page)

![Food Item Details](app/ss/Food%20Item%20Details.png)

### US4: Community Directory & Profiles (General)
**Story:** As a User, I want to view a list of community members and their profiles.
- *Implemented Pages:* `/users` (Users List Page) & `/users/:id` (User Profile Page)

![Users List](app/ss/Users%20list.png)

![User Profile Page](app/ss/User%20Profile%20Page.png)

---

## 3. Database Design

Our application uses a MySQL relational database consisting of the following core tables:

1. **`users`**: Manages our donors, recipients, and partners.
2. **`categories`**: Tracks food classification (e.g., Bakery, Produce) for filtering purposes.
3. **`food_items`**: The core listing table storing title, description, image, expiration datetime, and status (available/claimed). It links to the `users` and `categories` tables.
4. **`claims`**: Tracks the transaction of claiming food items.

### Entity Relationship Diagram

```
    USER ||--o{ FOOD_ITEM : "posts"
    USER ||--o{ CLAIM : "makes"
    FOOD_ITEM ||--o{ CLAIM : "is subject of"
    CATEGORY ||--o{ FOOD_ITEM : "classifies"

    USER {
        int id PK
        string username
        string email
        string password_hash
        timestamp created_at
    }
    FOOD_ITEM {
        int id PK
        int donor_id FK
        string title
        text description
        string image_url
        datetime expiry_date
        int category_id FK
        enum status (available/claimed)
        timestamp created_at
    }
    CATEGORY {
        int id PK
        string name
    }
    CLAIM {
        int id PK
        int item_id FK
        int recipient_id FK
        timestamp claim_date
        enum status (pending/collected)
    }
```

---

## 4. Task Breakdown & Developer Allocation

The team used the GitHub Project board to assign tasks for Sprint 3. The breakdown is as follows:

| Task Description | Assigned Developer | Status |
|:---|:---|:---|
| Backend: Create PUG Templates `/items`, `/users` | Mahesh Batala | Completed |
| Backend: Setup Express routing for new pages | Dhiraj Yadav | Completed |
| Database: Seed database with test categories and items | Prativa Rai | Completed |
| Docker: Verify multi-container orchestration | Rupesh Shah | Completed |
| Integration: Fetch real database data into Views | Sameer Chaudhary Tharu | Completed |
| Frontend: Categories and category detail pages | Mahesh Batala | Completed |
| Backend: Claim item endpoint and redirect logic | Dhiraj Yadav | Completed |
| Testing: Verify all pages render with DB data | Prativa Rai | Completed |

---

## 5. Participation Metrics & Kanban Board

### GitHub Metrics (Contributions)
> **Action Required:** Insert screenshot from your repository's Insights/Contributors page showing commits from all team members.

### Kanban Board Status
> **Action Required:** Insert screenshot of your current Sprint 3 GitHub Project / Kanban board.

---

## 6. Meeting Records

### Meeting Record: Sprint 3 Kickoff & Allocation
| **Meeting Minutes** | **Details** |
| :--- | :--- |
| **Date and Time** | 10/03/2026 \| 11:00 AM |
| **Meeting Goal** | Plan Sprint 3 deliverables, assign backend integration tasks. |
| **Note taker** | Prativa Rai |
| **Discussion points** | Need to shift from single-page static mocks to server-side PUG templates connecting directly to the MySQL database. Decided to focus on core `item`, `user`, and `category` views first. |
| **Actions** | Create Express routes (Dhiraj), build PUG layouts (Mahesh) |

### Meeting Record: Sprint 3 Mid-Sprint Review
| **Meeting Minutes** | **Details** |
| :--- | :--- |
| **Date and Time** | 17/03/2026 \| 02:00 PM |
| **Meeting Goal** | Review PUG views and DB queries for correctness. |
| **Note taker** | Rupesh Shah |
| **Discussion points** | Group agreed that using a single `layout.pug` makes styling standard and robust. Docker containers working smoothly for all members. |
| **Actions** | Finalize `/items/:id` claim logic. (Sameer) |

### Meeting Record: Sprint 3 Final Review
| **Meeting Minutes** | **Details** |
| :--- | :--- |
| **Date and Time** | 24/03/2026 \| 10:00 AM |
| **Meeting Goal** | Final testing, bug fixes, and preparation for code review. |
| **Note taker** | Sameer Chaudhary Tharu |
| **Discussion points** | All five required pages confirmed working with database data. Claim functionality tested and verified. Docker environment stable for all team members. |
| **Actions** | Prepare Sprint 3 deliverables document and screenshots for submission. |

---

## 7. Project Links
- **GitHub Repository:** [https://github.com/Sameercdytharoo/FoodShare-GreenTech](https://github.com/Sameercdytharoo/FoodShare-GreenTech)
- **Task Board:** [https://github.com/users/maheshbatala/projects/1](https://github.com/users/maheshbatala/projects/1)
