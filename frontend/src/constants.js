// Colour hue for each process (by input order).
export const HUES = [214, 28, 152, 340, 268, 46, 190, 4, 104, 300];
export const hueOf = (index) => HUES[index % HUES.length];

export const MAX_PROCESSES = 10;

// Example input. With SJF this gives the order P1 → P2 → P4 → P3,
// then an idle gap before P5 arrives at time 28.
export const SAMPLE = [
  { id: 'P1', arrival: 0, burst: 8 },
  { id: 'P2', arrival: 1, burst: 4 },
  { id: 'P3', arrival: 2, burst: 9 },
  { id: 'P4', arrival: 3, burst: 5 },
  { id: 'P5', arrival: 28, burst: 3 },
];
