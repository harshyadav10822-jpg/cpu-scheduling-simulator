
const TABS = [
  {
    key: 'fcfs',
    label: 'FCFS',
    sub: 'Non-preemptive',
    ready: true,
  },
  {
    key: 'sjf',
    label: 'SJF',
    sub: 'Non-preemptive',
    ready: true,
  },
  {
    key: 'srtf',
    label: 'SRTF',
    sub: 'Preemptive',
    ready: true,
  },
  {
    key: 'compare',
    label: 'Compare all',
    sub: 'Same input',
    ready: false,
  },
];

export default function AlgorithmTabs({ view, setView }) {
  return (
    <div className="tabs" role="tablist" aria-label="Algorithm">
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`tab ${view === t.key ? 'active' : ''}`}
          role="tab"
          aria-selected={view === t.key}
          disabled={!t.ready}
          title={
            t.ready
              ? `Select ${t.label} scheduling`
              : 'Coming in a future update'
          }
          onClick={() => setView(t.key)}
        >
          {t.label}
          <small>
            {t.ready ? t.sub : 'Coming soon'}
          </small>
        </button>
      ))}
    </div>
  );
}
