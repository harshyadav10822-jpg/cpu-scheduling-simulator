
function srtfScheduling(input) {
    if (!Array.isArray(input) || input.length === 0) {
        return {
            processes: [],
            segments: [],
            totalTime: 0
        };
    }

    const processes = input.map((p, index) => ({
        ...p,
        processId: String(p.processId).trim(),
        remainingTime: Number(p.burstTime),
        firstStartTime: null,
        completionTime: null,
        index
    }));

    const segments = [];
    let time = 0;
    let completed = 0;

    function appendSegment(segment) {
        const previous = segments[segments.length - 1];

        if (
            previous &&
            previous.processId === segment.processId &&
            previous.end === segment.start
        ) {
            previous.end = segment.end;
        } else {
            segments.push(segment);
        }
    }

    while (completed < processes.length) {
        const ready = processes
            .filter(p =>
                p.remainingTime > 0 &&
                p.arrivalTime <= time
            )
            .sort((a, b) =>
                a.remainingTime - b.remainingTime ||
                a.arrivalTime - b.arrivalTime ||
                a.index - b.index
            );

        if (ready.length === 0) {
            const nextArrival = Math.min(
                ...processes
                    .filter(p => p.remainingTime > 0)
                    .map(p => p.arrivalTime)
            );

            appendSegment({
                processId: null,
                start: time,
                end: nextArrival
            });

            time = nextArrival;
            continue;
        }

        const process = ready[0];

        if (process.firstStartTime === null) {
            process.firstStartTime = time;
        }

        appendSegment({
            processId: process.processId,
            index: process.index,
            start: time,
            end: time + 1
        });

        process.remainingTime--;
        time++;

        if (process.remainingTime === 0) {
            process.completionTime = time;

            process.turnaroundTime =
                time - process.arrivalTime;

            process.waitingTime =
                process.turnaroundTime - process.burstTime;

            process.responseTime =
                process.firstStartTime - process.arrivalTime;

            completed++;
        }
    }

    return {
        processes: processes.map(
            ({ remainingTime, firstStartTime, index, ...p }) => ({
                ...p,
                startTime: firstStartTime
            })
        ),
        segments,
        totalTime: time
    };
}

module.exports = { srtfScheduling };
