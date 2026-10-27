// Shortest Job First (SJF), non-preemptive.
//
// Rule: whenever the CPU becomes free, pick the process with the smallest
// burst time among the processes that have already arrived. Once a process
// starts, it runs until it finishes, even if a shorter one arrives.
// Ties: earlier arrival first, then the one entered first.
//
// Input:  [{ id, arrival, burst }, ...]
// Output: {
//   segments:   Gantt chart blocks [{ id, index, start, end }] (id = null means CPU idle)
//   completion: completion time of each process, keyed by its input index
//   firstRun:   time each process first got the CPU, keyed by its input index
//   totalTime:  time when the last process finishes
// }
export default function sjf(input) {
  const processes = input.map((p, index) => ({ ...p, index }));
  const done = new Set();
  const segments = [];
  const completion = {};
  const firstRun = {};
  let time = 0;

  while (done.size < processes.length) {
    // 1. Processes that have arrived and are not finished
    const ready = processes.filter((p) => !done.has(p.index) && p.arrival <= time);

    // 2. Nothing has arrived yet: CPU stays idle until the next arrival
    if (ready.length === 0) {
      const next = Math.min(...processes.filter((p) => !done.has(p.index)).map((p) => p.arrival));
      segments.push({ id: null, start: time, end: next });
      time = next;
      continue;
    }

    // 3. Pick the shortest burst (tie: earlier arrival, then input order)
    ready.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival || a.index - b.index);
    const p = ready[0];

    // 4. Run it to completion
    firstRun[p.index] = time;
    segments.push({ id: p.id, index: p.index, start: time, end: time + p.burst });
    time += p.burst;
    completion[p.index] = time;
    done.add(p.index);
  }

  return { segments, completion, firstRun, totalTime: time };
}
