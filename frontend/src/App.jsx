
import { useMemo, useState } from 'react';
import ProcessForm from './components/ProcessForm.jsx';
import AlgorithmTabs from './components/AlgorithmTabs.jsx';
import GanttChart from './components/GanttChart.jsx';
import sjf from './algorithms/sjf.js';
import { SAMPLE } from './constants.js';

// Validate process input.
function validate(processes) {
  const seen = new Set();

  for (let i = 0; i < processes.length; i++) {
    const p = processes[i];
    const id = String(p.id).trim();
    const label = id || `row ${i + 1}`;
    const arrival = p.arrival === '' ? NaN : Number(p.arrival);
    const burst = p.burst === '' ? NaN : Number(p.burst);

    if (!id)
      return { message: `Row ${i + 1} needs a process ID.`, row: i, field: 'id' };

    if (seen.has(id))
      return { message: `Process ID ${id} is used twice.`, row: i, field: 'id' };

    if (!Number.isInteger(arrival) || arrival < 0)
      return { message: `Arrival time of ${label} must be a whole number, 0 or more.`, row: i, field: 'arrival' };

    if (!Number.isInteger(burst) || burst < 1)
      return { message: `Burst time of ${label} must be a whole number, 1 or more.`, row: i, field: 'burst' };

    seen.add(id);
  }

  return null;
}

// First Come, First Served (FCFS).
function fcfs(processes) {
  const sorted = [...processes].sort(
    (a, b) => a.arrival - b.arrival
  );

  const segments = [];
  let time = 0;

  for (const p of sorted) {
    if (time < p.arrival) {
      segments.push({ id: null, start: time, end: p.arrival });
      time = p.arrival;
    }

    segments.push({
      id: p.id,
      start: time,
      end: time + p.burst,
    });

    time += p.burst;
  }

  return { segments, totalTime: time };
}

// Shortest Remaining Time First (SRTF).
function srtf(processes) {
  const jobs = processes.map((p, index) => ({
    ...p,
    remaining: p.burst,
    index,
  }));

  const segments = [];
  let time = 0;
  let completed = 0;

  while (completed < jobs.length) {
    const available = jobs
      .filter((p) => p.arrival <= time && p.remaining > 0)
      .sort(
        (a, b) =>
          a.remaining - b.remaining ||
          a.arrival - b.arrival ||
          a.index - b.index
      );

    if (available.length === 0) {
      const nextArrival = Math.min(
        ...jobs
          .filter((p) => p.remaining > 0)
          .map((p) => p.arrival)
      );

      if (time < nextArrival) {
        segments.push({
          id: null,
          start: time,
          end: nextArrival,
        });
      }

      time = nextArrival;
      continue;
    }

    const current = available[0];
    const start = time;

    // Run until completion or until a new process arrives.
    const futureArrivals = jobs
      .filter((p) => p.remaining > 0 && p.arrival > time)
      .map((p) => p.arrival);

    const nextArrival = futureArrivals.length
      ? Math.min(...futureArrivals)
      : Infinity;

    const duration = Math.min(
      current.remaining,
      nextArrival - time
    );

    current.remaining -= duration;
    time += duration;

    // Merge adjacent segments for the same process.
    const last = segments[segments.length - 1];

    if (last && last.id === current.id && last.end === start) {
      last.end = time;
    } else {
      segments.push({
        id: current.id,
        start,
        end: time,
      });
    }

    if (current.remaining === 0) {
      completed++;
    }
  }

  return { segments, totalTime: time };
}

const ALGORITHM_INFO = {
  fcfs: {
    name: 'First Come, First Served',
    short: 'FCFS',
    description:
      'Processes execute in order of arrival. Once a process starts, it runs until completion.',
  },
  sjf: {
    name: 'Shortest Job First',
    short: 'SJF',
    description:
      'Whenever the CPU becomes free, it selects the arrived process with the smallest burst time. A running process is not interrupted.',
  },
  srtf: {
    name: 'Shortest Remaining Time First',
    short: 'SRTF',
    description:
      'The CPU always selects the arrived process with the shortest remaining execution time. A running process can be interrupted when a better candidate arrives.',
  },
};

export default function App() {
  const [processes, setProcesses] = useState(SAMPLE);
  const [view, setView] = useState('sjf');

  const error = validate(processes);

  const result = useMemo(() => {
    if (error) return null;

    const normalized = processes.map((p) => ({
      id: String(p.id).trim(),
      arrival: Number(p.arrival),
      burst: Number(p.burst),
    }));

    if (view === 'fcfs') return fcfs(normalized);
    if (view === 'srtf') return srtf(normalized);

    return sjf(normalized);
  }, [processes, view, error]);

  const info = ALGORITHM_INFO[view] || ALGORITHM_INFO.sjf;

  const order = result
    ? result.segments
        .filter((segment) => segment.id !== null)
        .map((segment) => segment.id)
    : [];

  return (
    <div className="wrap">
      <header>
        <div className="eyebrow">
          Operating Systems · Process Scheduling
        </div>

        <h1>CPU Scheduling Simulator</h1>

        <p>
          Enter processes and select a scheduling algorithm to
          compare how the CPU executes them. The Gantt chart
          updates automatically.
        </p>
      </header>

      <div className="layout">
        <ProcessForm
          processes={processes}
          setProcesses={setProcesses}
          error={error}
        />

        <section className="results" aria-live="polite">
          <AlgorithmTabs view={view} setView={setView} />

          {error && (
            <p className="muted">
              {error.message} Correct the highlighted input to
              calculate the schedule.
            </p>
          )}

          {result && (
            <>
              <div className="algo-head">
                <div className="eyebrow">{info.short}</div>
                <h2>{info.name}</h2>
                <p>{info.description}</p>
              </div>

              <div className="block">
                <h3>Gantt chart</h3>

                <GanttChart
                  segments={result.segments}
                  totalTime={result.totalTime}
                />

                <p className="order">
                  Execution order:{' '}
                  {order.map((id, index) => (
                    <span key={`${id}-${index}`}>
                      {index > 0 && ' → '}
                      <b>{id}</b>
                    </span>
                  ))}
                </p>

                <p className="muted small">
                  All processes finish at time {result.totalTime}.
                  Empty Gantt chart intervals indicate CPU idle time.
                </p>
              </div>
            </>
          )}
        </section>
      </div>

      <footer>
        CPU Scheduling Simulator · React frontend and CPU scheduling
        algorithms · B.Sc. Programme project, Department of Computer
        Science, Shyam Lal College, University of Delhi.
      </footer>
    </div>
  );
}
