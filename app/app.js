// Import express.js
const express = require("express");
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');

// Create express app
const app = express();

// Add static files location
app.use(express.static("static"));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'foodshare_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to make session user available to all Pug templates
app.use((req, res, next) => {
    res.locals.sessionUser = req.session.user;
    next();
});

// Set view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function (req, res) {
    // Render the 'index' Pug template
    res.render("index");
});

// GET /api/food-items - Retrieve all available food items
// Joins with 'users' table to show the name of the donor
app.get("/api/food-items", function (req, res) {
    const sql = "SELECT food_items.*, users.username as donor_name FROM food_items JOIN users ON food_items.donor_id = users.id WHERE status = 'available' ORDER BY created_at DESC";
    db.query(sql).then(results => {
        res.json(results);
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve food items' });
    });
});

// POST /api/food-items - Add a new food item
app.post("/api/food-items", function (req, res) {
    const { name, description, category, expiry_date, location, donor_id } = req.body;

    // Basic validation
    if (!name || !description || !location) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "INSERT INTO food_items (name, description, category, expiry_date, location, donor_id) VALUES (?, ?, ?, ?, ?, ?)";

    // Note: In a real app, donor_id would come from the authenticated session
    // For Sprint 1, we accept the donor_id provided by the frontend
    db.query(sql, [name, description, category, expiry_date, location, donor_id])
        .then(results => {
            res.status(201).json({ id: results.insertId, message: "Item added successfully" });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Failed to add item" });
        });
});

// GET /api/users - List users (for demo/debugging to pick a donor)
app.get("/api/users", function (req, res) {
    const sql = "SELECT id, username FROM users";
    db.query(sql).then(results => {
        res.json(results);
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve users' });
    });
});

// POST /api/claim - Claim a food item
app.post("/api/claim", function (req, res) {
    if (!req.session.user) {
        return res.status(401).send("You must be logged in to claim an item.");
    }
    const item_id = req.body.item_id;
    const receiver_id = req.session.user.id;

    if (!item_id) {
        return res.status(400).json({ error: "Missing item_id" });
    }

    // First get the donor_id to award points
    const getDonorSql = "SELECT donor_id FROM food_items WHERE id = ? AND status = 'available'";
    db.query(getDonorSql, [item_id])
        .then(results => {
            if (results.length === 0) {
                throw new Error("Item already claimed or not found");
            }
            const donor_id = results[0].donor_id;
            
            const updateSql = "UPDATE food_items SET status = 'claimed' WHERE id = ?";
            const claimSql = "INSERT INTO claims (item_id, recipient_id) VALUES (?, ?)";
            const pointsSql = "UPDATE users SET points = points + 10 WHERE id = ?";

            // Execute queries sequentially
            return db.query(updateSql, [item_id])
                .then(() => db.query(claimSql, [item_id, receiver_id]))
                .then(() => db.query(pointsSql, [donor_id]));
        })
        .then(() => {
            // Redirect back to the item detail page on success
            res.redirect("/items/" + item_id);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message || "Failed to claim item" });
        });
});

// GET /api/current-user - Simulated current user for demo
// In a real app, this would use session/token auth
app.get("/api/current-user", function (req, res) {
    // We return a mock user that can be "switched" on the frontend for the demo
    // The actual "logged in" ID will be passed in the headers or handled by the frontend for this Sprint
    const userId = req.headers['x-user-id'] || 1;
    const sql = "SELECT id, username, email FROM users WHERE id = ?";
    db.query(sql, [userId]).then(results => {
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve user' });
    });
});

// --- SPRINT 3 PAGE ROUTES ---

// Listing page with Search/Match Algorithm
app.get("/items", function(req, res) {
    let sql = "SELECT food_items.*, users.username as donor_name, categories.name as category_name FROM food_items JOIN users ON food_items.donor_id = users.id JOIN categories ON food_items.category_id = categories.id";
    const queryParams = [];
    const conditions = [];

    // Search by title or description
    if (req.query.q) {
        conditions.push("(food_items.title LIKE ? OR food_items.description LIKE ?)");
        queryParams.push(`%${req.query.q}%`, `%${req.query.q}%`);
    }

    // Filter by category
    if (req.query.category && req.query.category !== 'all') {
        conditions.push("food_items.category_id = ?");
        queryParams.push(req.query.category);
    }

    // Add conditions to SQL
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY food_items.created_at DESC";

    // We also need all categories for the dropdown in the search form
    const catSql = "SELECT * FROM categories";

    Promise.all([
        db.query(sql, queryParams),
        db.query(catSql)
    ]).then(([items, categories]) => {
        res.render("items", { 
            items: items, 
            categories: categories, 
            searchQuery: req.query.q || '',
            selectedCategory: req.query.category || 'all'
        });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Server Error");
    });
});

// Detail page
app.get("/items/:id", function(req, res) {
    const sql = "SELECT food_items.*, users.username as donor_name, categories.name as category_name FROM food_items JOIN users ON food_items.donor_id = users.id JOIN categories ON food_items.category_id = categories.id WHERE food_items.id = ?";
    db.query(sql, [req.params.id]).then(results => {
        if (results.length > 0) {
            res.render("item-detail", { item: results[0] });
        } else {
            res.status(404).send("Item Not Found");
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send("Server Error");
    });
});

// Users list page
app.get("/users", function(req, res) {
    const sql = "SELECT * FROM users ORDER BY created_at DESC";
    db.query(sql).then(results => {
        res.render("users", { users: results });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Server Error");
    });
});

// User profile page
app.get("/users/:id", function(req, res) {
    const sqlUser = "SELECT * FROM users WHERE id = ?";
    const sqlItems = "SELECT * FROM food_items WHERE donor_id = ? ORDER BY created_at DESC";
    Promise.all([
        db.query(sqlUser, [req.params.id]),
        db.query(sqlItems, [req.params.id])
    ]).then(([users, items]) => {
        if (users.length > 0) {
            res.render("user-profile", { user: users[0], items: items });
        } else {
            res.status(404).send("User Not Found");
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send("Server Error");
    });
});

// Categories list
app.get("/categories", function(req, res) {
    const sql = "SELECT c.id, c.name, COUNT(f.id) as item_count FROM categories c LEFT JOIN food_items f ON c.id = f.category_id GROUP BY c.id, c.name";
    db.query(sql).then(results => {
        res.render("categories", { categories: results });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Server Error");
    });
});

// Category detail page
app.get("/categories/:id", function(req, res) {
    const catSql = "SELECT * FROM categories WHERE id = ?";
    const itemSql = "SELECT food_items.*, users.username as donor_name FROM food_items JOIN users ON food_items.donor_id = users.id WHERE category_id = ?";
    Promise.all([
        db.query(catSql, [req.params.id]),
        db.query(itemSql, [req.params.id])
    ]).then(([cats, items]) => {
        if(cats.length > 0) {
             res.render("category-detail", { category: cats[0], items: items });
        } else {
             res.status(404).send("Category Not Found");
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send("Server Error");
    });
});

// --- SPRINT 4 LOGIN ROUTES ---

// Render the login page
app.get("/login", function(req, res) {
    res.render("login");
});

// Render the signup page
app.get("/signup", function(req, res) {
    res.render("signup");
});

// Handle signup submission
app.post("/signup", async function(req, res) {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.render("signup", { error: "Please fill in all fields" });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
        await db.query(sql, [username, email, hash]);
        res.redirect("/login");
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
             res.render("signup", { error: "Username or email already exists" });
        } else {
             res.status(500).send("Server Error");
        }
    }
});

// Handle login submission
app.post("/login", async function(req, res) {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.render("login", { error: "Please enter both email and password" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email]).then(async results => {
        if (results.length > 0) {
            const user = results[0];
            
            // Compare the hashed password
            const isMatch = await bcrypt.compare(password, user.password_hash);
            
            // Fallback for sprint dummy accounts that aren't actually hashed in the db
            const isDummyMatch = user.password_hash === password;
            
            if (isMatch || isDummyMatch) {
                req.session.user = { id: user.id, username: user.username, email: user.email };
                res.redirect("/items");
            } else {
                res.render("login", { error: "Invalid credentials" });
            }
        } else {
            res.render("login", { error: "User not found" });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send("Server Error");
    });
});

// Handle logout
app.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = app;