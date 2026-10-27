
function calculateTimes(processes) {
    let currentTime = 0;

    for (const process of processes) {
        const startTime = Math.max(
            currentTime,
            process.arrivalTime
        );

        process.startTime = startTime;

        // Completion Time
        process.completionTime =
            startTime + process.burstTime;

        // Turnaround Time
        process.turnaroundTime =
            process.completionTime - process.arrivalTime;

        // Waiting Time
        process.waitingTime =
            process.turnaroundTime - process.burstTime;

        // Response Time
        process.responseTime =
            process.startTime - process.arrivalTime;

        currentTime = process.completionTime;
    }

    return processes;
}

module.exports = { calculateTimes };
