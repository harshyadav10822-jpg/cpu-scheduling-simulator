

const express = require("express");
const cors = require("cors");
const scheduleRouter = require("../routes/schedule");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health-check endpoint
app.get("/", (req, res) => {
    res.json({
        message: "CPU Scheduling Simulator Backend is running"
    });
});

// Scheduling API endpoint
app.use("/api/schedule", scheduleRouter);

// Start the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
