import { hueOf, MAX_PROCESSES, SAMPLE } from '../constants.js';

export default function ProcessForm({ processes, setProcesses, error }) {
  const update = (i, field, value) =>
    setProcesses((list) => list.map((p, k) => (k === i ? { ...p, [field]: value } : p)));

  const remove = (i) => setProcesses((list) => list.filter((_, k) => k !== i));

  const add = () =>
    setProcesses((list) => {
      if (list.length >= MAX_PROCESSES) return list;
      let n = list.length + 1;
      while (list.some((p) => p.id === `P${n}`)) n++;
      const lastArrival = Math.max(0, ...list.map((p) => Number(p.arrival) || 0));
      return [...list, { id: `P${n}`, arrival: lastArrival + 1, burst: 3 }];
    });

  const random = () => {
    const n = 4 + Math.floor(Math.random() * 3);
    setProcesses(
      Array.from({ length: n }, (_, i) => ({
        id: `P${i + 1}`,
        arrival: i === 0 ? 0 : Math.floor(Math.random() * 10),
        burst: 1 + Math.floor(Math.random() * 9),
      }))
    );
  };

  const invalid = (i, field) => error && error.row === i && error.field === field;

  return (
    <section className="panel" aria-labelledby="in-h">
      <div className="panel-head">
        <h2 id="in-h">Processes</h2>
        <span className="muted small">Time is in units. Up to {MAX_PROCESSES} processes.</span>
      </div>

      <table className="ptable">
        <thead>
          <tr>
            <th aria-label="Colour"></th>
            <th>ID</th>
            <th><abbr title="Arrival Time">AT</abbr></th>
            <th><abbr title="Burst Time">BT</abbr></th>
            <th aria-label="Remove"></th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p, i) => (
            <tr key={i}>
              <td>
                <span className="swatch" style={{ '--h': hueOf(i) }} />
              </td>
              <td>
                <input
                  id={`pid-${i}`}
                  value={p.id}
                  maxLength={6}
                  aria-label={`Process ID, row ${i + 1}`}
                  aria-invalid={invalid(i, 'id')}
                  onChange={(e) => update(i, 'id', e.target.value)}
                />
              </td>
              <td>
                <input
                  id={`pat-${i}`}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={p.arrival}
                  aria-label={`Arrival time of ${p.id}`}
                  aria-invalid={invalid(i, 'arrival')}
                  onChange={(e) => update(i, 'arrival', e.target.value)}
                />
              </td>
              <td>
                <input
                  id={`pbt-${i}`}
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={p.burst}
                  aria-label={`Burst time of ${p.id}`}
                  aria-invalid={invalid(i, 'burst')}
                  onChange={(e) => update(i, 'burst', e.target.value)}
                />
              </td>
              <td>
                <button
                  className="del"
                  aria-label={`Remove ${p.id}`}
                  disabled={processes.length <= 1}
                  onClick={() => remove(i)}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && <p className="error">{error.message}</p>}

      <div className="row-actions">
        <button className="btn primary" onClick={add} disabled={processes.length >= MAX_PROCESSES}>
          + Add process
        </button>
        <button className="btn" onClick={() => setProcesses(SAMPLE)}>Load example</button>
        <button className="btn" onClick={random}>Random set</button>
      </div>

      <div className="formulas" aria-label="Formulas">
        <div><b>TAT</b> = CT − AT</div>
        <div><b>WT</b>&nbsp; = TAT − BT</div>
        <div><b>RT</b>&nbsp; = first time on CPU − AT</div>
        <div><b>CPU utilisation</b> = busy time ÷ total time</div>
      </div>
    </section>
  );
}
