
const express = require("express");
const { fcfsScheduling } = require("../algorithms/fcfs");
const { srtfScheduling } = require("../algorithms/srtf");

const router = express.Router();

// POST /api/schedule
router.post("/", (req, res) => {
    const { algorithm, processes } = req.body;

    // Validate the algorithm
    if (!["FCFS", "SRTF"].includes(algorithm)) {
        return res.status(400).json({
            error: "Unsupported algorithm. Use FCFS or SRTF."
        });
    }

    // Validate the process list
    if (!Array.isArray(processes) || processes.length === 0) {
        return res.status(400).json({
            error: "Processes must be a non-empty array."
        });
    }

    // Validate individual processes
    const validProcesses = processes.every(process =>
        process &&
        typeof process.processId === "string" &&
        process.processId.trim() !== "" &&
        typeof process.arrivalTime === "number" &&
        Number.isFinite(process.arrivalTime) &&
        process.arrivalTime >= 0 &&
        typeof process.burstTime === "number" &&
        Number.isFinite(process.burstTime) &&
        process.burstTime > 0
    );

    if (!validProcesses) {
        return res.status(400).json({
            error: "Each process needs a non-empty processId, a non-negative arrivalTime, and a positive burstTime."
        });
    }

    // Prevent duplicate process IDs
    const processIds = processes.map(process =>
        process.processId.trim()
    );

    if (new Set(processIds).size !== processIds.length) {
        return res.status(400).json({
            error: "Process IDs must be unique."
        });
    }

    // Run the selected scheduling algorithm
    if (algorithm === "FCFS") {
        const result = fcfsScheduling(processes);

        return res.json({
            algorithm: "FCFS",
            processes: result
        });
    }

    if (algorithm === "SRTF") {
        const result = srtfScheduling(processes);

        return res.json({
            algorithm: "SRTF",
            processes: result.processes,
            segments: result.segments,
            totalTime: result.totalTime
        });
    }
});

module.exports = router;
