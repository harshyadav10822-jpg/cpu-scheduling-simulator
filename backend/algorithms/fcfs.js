
const { calculateTimes } = require("../utils");

function fcfsScheduling(processes) {
    // Create a copy so the original input is not modified.
    const scheduledProcesses = processes.map(process => ({
        ...process
    }));

    // Sort processes by arrival time.
    // Preserve input order when arrival times are equal.
    scheduledProcesses.sort(
        (a, b) => a.arrivalTime - b.arrivalTime
    );

    // Calculate CT, TAT, WT, and RT.
    return calculateTimes(scheduledProcesses);
}

module.exports = { fcfsScheduling };
