// ============================================================
// RRA Melbourne — Size Data
// Sources:
//   - Omtex official size charts (training kit)
//   - VANY official size guide (IPL replica shirt)
// All measurements in inches — max size: 3XL
// ============================================================

export const SIZE_GROUPS = {
  JUNIOR: 'junior',
  SENIOR: 'senior',
};

// ── VANY IPL REPLICA SHIRT — Adults ─────────────────────────
export const VANY_TOPS_ADULT = {
  junior: null,
  senior: [
    { label: 'XXXS',  halfChest: '16 (32)', length: '24' },
    { label: 'XXS',   halfChest: '17 (34)', length: '25' },
    { label: 'XS',    halfChest: '18 (36)', length: '26' },
    { label: 'S',     halfChest: '19 (38)', length: '27' },
    { label: 'M',     halfChest: '20 (40)', length: '28' },
    { label: 'L',     halfChest: '21 (42)', length: '29' },
    { label: 'XL',    halfChest: '22 (44)', length: '30' },
    { label: 'XXL',   halfChest: '23 (46)', length: '31' },
    { label: 'XXXL',  halfChest: '24 (48)', length: '32' },
  ],
};

// ── VANY IPL REPLICA SHIRT — Kids ───────────────────────────
export const VANY_TOPS_KIDS = [
  { label: '2 Year',  chest: '12.75 (25.5)', length: '16.75' },
  { label: '4 Year',  chest: '13.75 (27.5)', length: '18.25' },
  { label: '6 Year',  chest: '14.5 (29)',    length: '19.75' },
  { label: '8 Year',  chest: '15.25 (30.5)', length: '21.25' },
  { label: '10 Year', chest: '16 (32)',       length: '22.75' },
  { label: '12 Year', chest: '16.75 (33.5)', length: '24.25' },
  { label: '14 Year', chest: '17.75 (35.5)', length: '25.25' },
];

// ── OMTEX TRAINING SHIRT ─────────────────────────────────────
export const TOPS_SIZES = {
  junior: [
    { label: '18',       halfChest: '11 – 11.5', length: '16' },
    { label: '20',       halfChest: '11 – 12',   length: '17' },
    { label: '22',       halfChest: '12.5 – 13', length: '18' },
    { label: '24',       halfChest: '13.5 – 14', length: '19' },
    { label: '26',       halfChest: '14.5 – 15', length: '21' },
    { label: '28',       halfChest: '15.5 – 16', length: '22' },
    { label: '30',       halfChest: '16.5 – 17', length: '23' },
    { label: '32',       halfChest: '17.5 – 18', length: '24.5' },
    { label: '34 (XXS)', halfChest: '18.5 – 19', length: '25' },
  ],
  senior: [
    { label: 'XS (36)',  halfChest: '19.5 – 20', length: '27' },
    { label: 'S (38)',   halfChest: '20.5 – 21', length: '28' },
    { label: 'M (40)',   halfChest: '21.5 – 22', length: '29' },
    { label: 'L (42)',   halfChest: '22.5 – 23', length: '30' },
    { label: 'XL (44)',  halfChest: '23.5 – 24', length: '31' },
    { label: '2XL (46)', halfChest: '24.5 – 25', length: '32' },
    { label: '3XL (48)', halfChest: '25.5 – 26', length: '33' },
  ],
};
export const TOPS_MEASURE_TIP = 'Lay a shirt flat and measure across the chest (A). Use the half-chest column below to find your size.';

// ── OMTEX SHORTS ─────────────────────────────────────────────
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
export const SHORTS_MEASURE_TIP = 'Measure around your waist where you tie the drawstring. Compare to the waist column below.';

// ── OMTEX PANTS ──────────────────────────────────────────────
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
    { label: 'XS',  waist: '28', length: '42' },
    { label: 'S',   waist: '30', length: '42' },
    { label: 'M',   waist: '32', length: '42' },
    { label: 'L',   waist: '34', length: '42' },
    { label: 'XL',  waist: '36', length: '42' },
    { label: '2XL', waist: '38', length: '42' },
    { label: '3XL', waist: '40', length: '42' },
  ],
};
export const PANTS_MEASURE_TIP = 'Measure around your waist where you tie the belt. Compare to the waist column below.';

// ── JACKET SIZES ─────────────────────────────────────────────
export const JACKET_SIZES = {
  junior: null,
  senior: [
    { label: 'XXS',  halfChest: '17 – 18', length: '25' },
    { label: 'XS',   halfChest: '18 – 19', length: '26' },
    { label: 'S',    halfChest: '19 – 20', length: '27' },
    { label: 'M',    halfChest: '20 – 21', length: '28' },
    { label: 'L',    halfChest: '21 – 22', length: '29' },
    { label: 'XL',   halfChest: '22 – 23', length: '30' },
    { label: 'XXL',  halfChest: '23 – 24', length: '31' },
    { label: 'XXXL', halfChest: '24 – 25', length: '32' },
  ],
};
export const JACKET_MEASURE_TIP = 'Lay a jacket flat and measure across the chest (A). This jacket runs small — order one size larger than usual.';

// ── Omtex Kids age reference ──────────────────────────────────
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

// ── Product → size data map ───────────────────────────────────
export const PRODUCT_SIZE_MAP = {
  'ipl-replica-shirt': {
    manufacturer: 'VANY',
    sizeType: 'vany-tops',
    sizes: VANY_TOPS_ADULT,
    kidsYearSizes: VANY_TOPS_KIDS,
    tip: 'Lay a shirt you own flat and measure across the chest (A = half chest). Use the chart below to find your size. Numbers in brackets are full chest circumference.',
    col1Label: 'A — Half Chest',
    col2Label: 'B — Length',
    measureKey: 'halfChest',
    showVanyKids: true,
    showKidsAgeChart: false,
  },
  'training-shirt': {
    manufacturer: 'Omtex',
    sizeType: 'omtex-tops',
    sizes: TOPS_SIZES,
    tip: TOPS_MEASURE_TIP,
    col1Label: 'Half Chest',
    col2Label: 'Length',
    measureKey: 'halfChest',
    showVanyKids: false,
    showKidsAgeChart: true,
  },
  'training-shorts': {
    manufacturer: 'Omtex',
    sizeType: 'omtex-shorts',
    sizes: SHORTS_SIZES,
    tip: SHORTS_MEASURE_TIP,
    col1Label: 'Waist',
    col2Label: 'Length',
    measureKey: 'waist',
    showVanyKids: false,
    showKidsAgeChart: false,
  },
  'training-pants': {
    manufacturer: 'Omtex',
    sizeType: 'omtex-pants',
    sizes: PANTS_SIZES,
    tip: PANTS_MEASURE_TIP,
    col1Label: 'Waist',
    col2Label: 'Length',
    measureKey: 'waist',
    showVanyKids: false,
    showKidsAgeChart: false,
  },
  'pink-cap': null,
  'fleece-jacket': {
    manufacturer: 'Omtex',
    sizeType: 'jacket',
    sizes: JACKET_SIZES,
    tip: JACKET_MEASURE_TIP,
    col1Label: 'Half Chest',
    col2Label: 'Length',
    measureKey: 'halfChest',
    showVanyKids: false,
    showKidsAgeChart: false,
  },
};
