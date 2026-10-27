// Checks SJF against the standard textbook example. Run with: npm test
import assert from 'node:assert/strict';
import sjf from './sjf.js';

const r = sjf([
  { id: 'P1', arrival: 0, burst: 8 },
  { id: 'P2', arrival: 1, burst: 4 },
  { id: 'P3', arrival: 2, burst: 9 },
  { id: 'P4', arrival: 3, burst: 5 },
]);

const order = r.segments.map((s) => `${s.id}(${s.start}-${s.end})`).join(' ');
console.log('SJF order:', order);

assert.equal(order, 'P1(0-8) P2(8-12) P4(12-17) P3(17-26)');
assert.deepEqual(r.completion, { 0: 8, 1: 12, 2: 26, 3: 17 });

// Idle time: nothing arrives until 5
const idle = sjf([{ id: 'A', arrival: 5, burst: 2 }]);
assert.deepEqual(idle.segments[0], { id: null, start: 0, end: 5 });

console.log('SJF tests passed.');
