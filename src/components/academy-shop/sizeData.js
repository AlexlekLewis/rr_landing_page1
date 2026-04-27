// ============================================================
// RRA Melbourne — Omtex Size Data
// Source: Official Omtex size charts (Men's & Kids)
// All measurements in inches
// ============================================================

export const SIZE_GROUPS = {
  JUNIOR: 'junior',
  SENIOR: 'senior',
};

// ── TOPS (Shirts) ────────────────────────────────────────────
export const TOPS_SIZES = {
  junior: [
    { label: '18', halfChest: '11 – 11.5', length: '16' },
    { label: '20', halfChest: '11 – 12',   length: '17' },
    { label: '22', halfChest: '12.5 – 13', length: '18' },
    { label: '24', halfChest: '13.5 – 14', length: '19' },
    { label: '26', halfChest: '14.5 – 15', length: '21' },
    { label: '28', halfChest: '15.5 – 16', length: '22' },
    { label: '30', halfChest: '16.5 – 17', length: '23' },
    { label: '32', halfChest: '17.5 – 18', length: '24.5' },
    { label: '34 (XXS)', halfChest: '18.5 – 19', length: '25' },
  ],
  senior: [
    { label: 'SX (36)', halfChest: '19.5 – 20', length: '27' },
    { label: 'S (38)',  halfChest: '20.5 – 21', length: '28' },
    { label: 'M (40)',  halfChest: '21.5 – 22', length: '29' },
    { label: 'L (42)',  halfChest: '22.5 – 23', length: '30' },
    { label: 'XL (44)', halfChest: '23.5 – 24', length: '31' },
    { label: '2XL (46)', halfChest: '24.5 – 25', length: '32' },
    { label: '3XL (48)', halfChest: '25.5 – 26', length: '33' },
    { label: '4XL (50)', halfChest: '26.5 – 27', length: '34' },
    { label: '5XL (52)', halfChest: '27.5 – 28', length: '34' },
  ],
};

export const TOPS_MEASURE_TIP = 'Measure around the fullest part of your chest (horizontal). Use half-chest column below.';
export const TOPS_MEASURE_FIELDS = ['Half Chest (in)', 'Length (in)'];

// ── SHORTS ───────────────────────────────────────────────────
export const SHORTS_SIZES = {
  junior: [
    { label: '8–10',  waist: '18 – 20', length: '12.5' },
    { label: '12–14', waist: '22 – 24', length: '13.5' },
    { label: '15–16', waist: '26 – 28', length: '17' },
  ],
  senior: [
    { label: 'S',   waist: '28 – 30', length: '18' },
    { label: 'M',   waist: '30 – 32', length: '18' },
    { label: 'L',   waist: '32 – 34', length: '18' },
    { label: 'XL',  waist: '34 – 36', length: '18' },
    { label: '2XL', waist: '36 – 38', length: '19' },
  ],
};

export const SHORTS_MEASURE_TIP = 'Measure around your waist (horizontal). Compare to the waist column below.';
export const SHORTS_MEASURE_FIELDS = ['Waist (in)', 'Length (in)'];

// ── PANTS / TROUSERS ─────────────────────────────────────────
export const PANTS_SIZES = {
  junior: [
    { label: '18', waist: '18', length: '26' },
    { label: '20', waist: '20', length: '28' },
    { label: '22', waist: '22', length: '30' },
    { label: '24', waist: '24', length: '32' },
    { label: '26', waist: '26', length: '34' },
    { label: '28', waist: '28', length: '36' },
  ],
  senior: [
    { label: 'SX',  waist: '28', length: '42' },
    { label: 'S',   waist: '30', length: '42' },
    { label: 'M',   waist: '32', length: '42' },
    { label: 'L',   waist: '34', length: '42' },
    { label: 'XL',  waist: '36', length: '42' },
    { label: '2XL', waist: '38', length: '42' },
    { label: '3XL', waist: '40', length: '42' },
    { label: '4XL', waist: '42', length: '42' },
  ],
};

export const PANTS_MEASURE_TIP = 'Measure around your waist (horizontal). Compare to the waist column below.';
export const PANTS_MEASURE_FIELDS = ['Waist (in)', 'Length (in)'];

// ── KIDS AGE CHART (reference only — shown as info panel) ────
export const KIDS_AGE_CHART = [
  { age: '1/2 yrs',   top: '20', bottom: '16' },
  { age: '3/4 yrs',   top: '22', bottom: '18' },
  { age: '5/6 yrs',   top: '24', bottom: '20' },
  { age: '7/8 yrs',   top: '26', bottom: '22' },
  { age: '9/10 yrs',  top: '28', bottom: '24' },
  { age: '11/12 yrs', top: '30', bottom: '26' },
  { age: '13/14 yrs', top: '32', bottom: '28' },
  { age: '15/16 yrs', top: '34', bottom: '28' },
];

// ── Map product ID → size data ───────────────────────────────
export const PRODUCT_SIZE_MAP = {
  'ipl-replica-shirt': {
    sizes: TOPS_SIZES,
    tip: TOPS_MEASURE_TIP,
    fields: TOPS_MEASURE_FIELDS,
    measureKey: 'halfChest', // key in junior/senior objects for col 1
    col1Label: 'Half Chest',
    col2Label: 'Length',
    showKidsAgeChart: true,
  },
  'training-shirt': {
    sizes: TOPS_SIZES,
    tip: TOPS_MEASURE_TIP,
    fields: TOPS_MEASURE_FIELDS,
    measureKey: 'halfChest',
    col1Label: 'Half Chest',
    col2Label: 'Length',
    showKidsAgeChart: true,
  },
  'training-shorts': {
    sizes: SHORTS_SIZES,
    tip: SHORTS_MEASURE_TIP,
    fields: SHORTS_MEASURE_FIELDS,
    measureKey: 'waist',
    col1Label: 'Waist',
    col2Label: 'Length',
    showKidsAgeChart: false,
  },
  'training-pants': {
    sizes: PANTS_SIZES,
    tip: PANTS_MEASURE_TIP,
    fields: PANTS_MEASURE_FIELDS,
    measureKey: 'waist',
    col1Label: 'Waist',
    col2Label: 'Length',
    showKidsAgeChart: false,
  },
};
