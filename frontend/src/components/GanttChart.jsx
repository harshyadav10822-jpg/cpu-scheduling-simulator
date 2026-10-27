
import React from 'react';

const COLORS = [
  '#3B82F6',
  '#F59E0B',
  '#10B981',
  '#EC4899',
  '#8B5CF6',
  '#06B6D4',
  '#EF4444',
  '#84CC16',
  '#F97316',
  '#6366F1',
];

export default function GanttChart({ segments = [], totalTime = 0 }) {
  if (!segments.length || totalTime <= 0) {
    return <p className="muted">No schedule available.</p>;
  }

  // Assign a consistent colour to each process ID.
  const processIds = [
    ...new Set(
      segments
        .filter(
          (segment) =>
            segment.id !== null && segment.id !== undefined
        )
        .map((segment) => String(segment.id))
    ),
  ];

  const colourMap = new Map(
    processIds.map((id, index) => [
      id,
      COLORS[index % COLORS.length],
    ])
  );

  return (
    <div
      className="gantt-wrapper"
      style={{
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <div
        className="gantt-chart"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
          width: '100%',
          minWidth: '100%',
          minHeight: '65px',
          boxSizing: 'border-box',
        }}
      >
        {segments.map((segment, index) => {
          const duration = segment.end - segment.start;

          if (duration <= 0) return null;

          const isIdle =
            segment.id === null || segment.id === undefined;

          const colour = isIdle
            ? '#6B7280'
            : colourMap.get(String(segment.id));

          return (
            <div
              key={`${segment.id ?? 'idle'}-${segment.start}-${index}`}
              className={`gantt-segment${isIdle ? ' idle' : ''}`}
              title={
                isIdle
                  ? `CPU Idle: ${segment.start}–${segment.end}`
                  : `${segment.id}: ${segment.start}–${segment.end}`
              }
              style={{
                flexGrow: duration,
                flexShrink: 0,
                flexBasis: 0,
                minWidth: '45px',
                minHeight: '65px',
                backgroundColor: colour,
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              <span>{isIdle ? 'Idle' : segment.id}</span>
            </div>
          );
        })}
      </div>

      <div
        className="gantt-times"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          minWidth: '100%',
          paddingTop: '8px',
          fontSize: '12px',
        }}
      >
        {segments
          .filter((segment) => segment.end > segment.start)
          .map((segment, index) => (
            <span
              key={`${segment.start}-${index}`}
              style={{
                flex: '1 0 0',
                textAlign: 'left',
              }}
            >
              {segment.start}
            </span>
          ))}

        <span style={{ textAlign: 'right' }}>{totalTime}</span>
      </div>
    </div>
  );
}
