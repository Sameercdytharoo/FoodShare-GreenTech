// Import express.js
const express = require("express");
const path = require('path');

// Create express app
const app = express();

// Add static files location
app.use(express.static("static"));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    const { item_id, receiver_id } = req.body;

    if (!item_id || !receiver_id) {
        return res.status(400).json({ error: "Missing item_id or receiver_id" });
    }

    // Use a transaction or sequential queries to update status and record claim
    const updateSql = "UPDATE food_items SET status = 'claimed' WHERE id = ? AND status = 'available'";
    const claimSql = "INSERT INTO claims (item_id, receiver_id) VALUES (?, ?)";

    db.query(updateSql, [item_id])
        .then(results => {
            if (results.affectedRows === 0) {
                throw new Error("Item already claimed or not found");
            }
            return db.query(claimSql, [item_id, receiver_id]);
        })
        .then(() => {
            res.status(200).json({ message: "Item claimed successfully" });
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


module.exports = app;