# CPU Scheduling Simulator: Harshit's part

**Frontend (React) and the SJF algorithm.**

This folder runs on its own. You can enter processes, see the Shortest Job First schedule as a Gantt chart, and see the execution order. No backend is needed for this part, because SJF runs in the browser.

## What this part contains

| File | What it does |
|---|---|
| `src/algorithms/sjf.js` | Shortest Job First (non-preemptive) algorithm |
| `src/algorithms/sjf.test.js` | Checks SJF against the textbook example |
| `src/components/ProcessForm.jsx` | Process input table: ID, Arrival Time, Burst Time; add, remove, example and random buttons |
| `src/components/AlgorithmTabs.jsx` | FCFS / SJF / SRTF / Compare tabs (only SJF is active in this part) |
| `src/components/GanttChart.jsx` | Draws the Gantt chart, including idle time |
| `src/styles.css` | Page layout, colours, light and dark mode |
| `src/App.jsx` | Puts the page together and checks the input |
| `vite.config.js`, `index.html`, `src/main.jsx` | React app setup with Vite |

## How to run

You need Node.js 18 or newer. Open a terminal in this folder:

```bash
npm install
npm run dev
```

Then open **http://localhost:5173**.

To test the SJF algorithm:

```bash
npm test
```

Expected output: `SJF order: P1(0-8) P2(8-12) P4(12-17) P3(17-26)`.

## How SJF works (for the viva)

1. Look at every process that has arrived (arrival time ≤ current time) and is not finished.
2. If none has arrived, the CPU is idle until the next arrival.
3. Otherwise, pick the one with the **smallest burst time**. If two tie, pick the one that arrived first, then the one entered first.
4. Run it **to completion** (non-preemptive), then go back to step 1.

Worked example (P1–P4, arrival 0/1/2/3, burst 8/4/9/5):

- At time 0 only P1 has arrived, so P1 runs from 0 to 8.
- At time 8, P2 (4), P3 (9) and P4 (5) are waiting. P2 is shortest, so it runs from 8 to 12.
- At time 12, P4 (5) is shorter than P3 (9), so P4 runs from 12 to 17.
- P3 runs from 17 to 26.
- Average waiting time = (0 + 7 + 15 + 9) ÷ 4 = **7.75**.

## Joining with the full project

In the full project, `sjf.js` moves to `server/algorithms/sjf.js` and runs on the Express backend. Harsh's `utils.js` then turns its output into CT, TAT, WT and RT. The React components are used as they are, and the FCFS, SRTF and Compare tabs are switched on.
