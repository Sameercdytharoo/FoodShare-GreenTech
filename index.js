const app = require("./app/app.js");

// Start server on configured port
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});