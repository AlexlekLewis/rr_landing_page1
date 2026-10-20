import { describe, it, expect } from 'vitest';
import { reconcileTab } from './sheetReconcile.js';

// An in-memory Google Sheet: just enough of the Sheets API for reconcileTab.
const colIndex = (letters) => [...letters].reduce((n, ch) => n * 26 + (ch.charCodeAt(0) - 64), 0) - 1;
const cellRef = (a1) => {
  const m = /^([A-Z]+)(\d+)$/.exec(a1);
  return { col: colIndex(m[1]), row: Number(m[2]) - 1 };
};

function fakeSheet(tab, grid) {
  const g = grid.map((r) => [...r]);
  const calls = { inserted: [], headerWrites: 0 };
  const protectedRanges = [];
  const split = (range) => {
    const i = range.lastIndexOf('!');
    expect(range.slice(0, i)).toBe(tab);
    return range.slice(i + 1);
  };
  const setRow = (row, col, values) => {
    while (g.length <= row) g.push([]);
    const r = g[row];
    while (r.length < col) r.push('');
    values.forEach((v, i) => { r[col + i] = v; });
  };
  const trim = (r) => { const x = [...r]; while (x.length && (x[x.length - 1] ?? '') === '') x.pop(); return x; };
  const sheets = {
    spreadsheets: {
      get: async () => ({ data: { sheets: [{ properties: { sheetId: 7, title: tab, gridProperties: { columnCount: 26 } }, protectedRanges }] } }),
      batchUpdate: async ({ requestBody }) => {
        for (const rq of requestBody.requests) {
          if (rq.insertDimension) {
            const { startIndex, endIndex } = rq.insertDimension.range;
            calls.inserted.push([startIndex, endIndex]);
            g.forEach((r) => { if (r.length > startIndex) r.splice(startIndex, 0, ...Array(endIndex - startIndex).fill('')); });
          }
          if (rq.addProtectedRange) protectedRanges.push({ ...rq.addProtectedRange.protectedRange, protectedRangeId: 1 });
          if (rq.updateProtectedRange) Object.assign(protectedRanges[0], rq.updateProtectedRange.protectedRange);
        }
        return {};
      },
      values: {
        get: async ({ range }) => {
          const r = split(range);
          if (r === '1:1') return { data: { values: g[0] ? [trim(g[0])] : [] } };
          if (/^[A-Z]+1$/.test(r)) { const { col } = cellRef(r); return { data: { values: g[0]?.[col] ? [[g[0][col]]] : [] } }; }
          const [a, b] = r.split(':');
          const from = cellRef(a), last = colIndex(b.replace(/\d+/g, ''));
          return { data: { values: g.slice(from.row).map((row) => trim(row.slice(0, last + 1))) } };
        },
        update: async ({ range, requestBody }) => {
          const { row, col } = cellRef(split(range));
          if (row === 0 && col === 0) calls.headerWrites++;
          setRow(row, col, requestBody.values[0]);
          return {};
        },
        batchUpdate: async ({ requestBody }) => {
          for (const d of requestBody.data) {
            const { row, col } = cellRef(split(d.range).split(':')[0]);
            setRow(row, col, d.values[0]);
          }
          return {};
        },
        append: async ({ requestBody }) => { requestBody.values.forEach((v) => g.push([...v])); return {}; },
      },
    },
  };
  return { sheets, grid: g, calls, protectedRanges };
}

const TAB = 'Junior Royals Term 4 — DO NOT EDIT';
const LABEL = 'YOUR NOTES — SAFE TO EDIT, NEVER OVERWRITTEN →';
const OLD = ['Entry ID', 'Player', 'Night They Chose', 'Payment'];
const NEW = ['Entry ID', 'Player', 'Night They Chose', 'Group and Time', 'Payment'];

describe('reconcileTab: a column added in front of the notes column', () => {
  it('moves the notes column right before writing, so nothing anyone typed is lost', async () => {
    const f = fakeSheet(TAB, [
      [...OLD, LABEL],
      ['id-1', 'Liam', 'Monday', 'PAID', 'called mum, coming Monday'],
      ['id-2', 'Mia', 'Wednesday', 'NOT PAID'],
    ]);
    await reconcileTab(f.sheets, 's', TAB, NEW, [
      ['id-1', 'Liam', 'Monday', '5:00pm – 6:00pm (ages 7–9)', 'PAID'],
      ['id-2', 'Mia', 'Wednesday', '6:00pm – 7:00pm (ages 10–12)', 'NOT PAID'],
    ], LABEL);
    expect(f.calls.inserted).toEqual([[4, 5]]);
    expect(f.grid[0]).toEqual([...NEW, LABEL]);
    expect(f.grid[1]).toEqual(['id-1', 'Liam', 'Monday', '5:00pm – 6:00pm (ages 7–9)', 'PAID', 'called mum, coming Monday']);
    expect(f.grid[2].slice(0, 5)).toEqual(['id-2', 'Mia', 'Wednesday', '6:00pm – 7:00pm (ages 10–12)', 'NOT PAID']);
    // The warning range now covers the new column too.
    expect(f.protectedRanges[0].range.endColumnIndex).toBe(NEW.length);
  });

  // The state the live tab was left in on 20 Oct 2026: rows already one column wider,
  // header not moved, and a second notes label one column further right.
  it('repairs a header the rows have already moved past, without inserting again', async () => {
    const f = fakeSheet(TAB, [
      [...OLD, LABEL, LABEL],
      ['id-1', 'Liam', 'Monday', '5:00pm – 6:00pm (ages 7–9)', 'PAID', 'a note in the new notes column'],
    ]);
    await reconcileTab(f.sheets, 's', TAB, NEW, [
      ['id-1', 'Liam', 'Monday', '5:00pm – 6:00pm (ages 7–9)', 'PAID'],
    ], LABEL);
    expect(f.calls.inserted).toEqual([]);
    expect(f.grid[0]).toEqual([...NEW, LABEL]);
    expect(f.grid[1][5]).toBe('a note in the new notes column');
  });

  it('leaves a settled tab alone', async () => {
    const f = fakeSheet(TAB, [
      [...NEW, LABEL],
      ['id-1', 'Liam', 'Monday', '5:00pm – 6:00pm (ages 7–9)', 'PAID', 'note'],
    ]);
    await reconcileTab(f.sheets, 's', TAB, NEW, [
      ['id-1', 'Liam', 'Monday', '5:00pm – 6:00pm (ages 7–9)', 'PAID'],
    ], LABEL);
    expect(f.calls.inserted).toEqual([]);
    expect(f.calls.headerWrites).toBe(0);
    expect(f.grid[1][5]).toBe('note');
  });
});
