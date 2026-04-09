// ─── Hero Images ─────────────────────────────────────────────────────────────
export const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=900&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=900&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80",
];

// ─── Calendar Labels ──────────────────────────────────────────────────────────
export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const WEEKDAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// ─── Indian Public Holidays ───────────────────────────────────────────────────
export const HOLIDAYS = {
  "2025-01-26":"Republic Day",
  "2025-03-17":"Holi",
  "2025-03-31":"Id-ul-Fitr",
  "2025-04-14":"Ambedkar Jayanti",
  "2025-04-18":"Good Friday",
  "2025-05-12":"Buddha Purnima",
  "2025-08-15":"Independence Day",
  "2025-10-02":"Gandhi Jayanti",
  "2025-10-20":"Dussehra",
  "2025-11-05":"Bhai Dooj",
  "2025-12-25":"Christmas",
  "2026-01-01":"New Year's Day",
  "2026-01-26":"Republic Day",
  "2026-03-06":"Holi",
  "2026-08-15":"Independence Day",
  "2026-10-02":"Gandhi Jayanti",
  "2026-12-25":"Christmas",
};

// ─── Note Tag Definitions ─────────────────────────────────────────────────────
export const NOTE_TAGS = [
  { id: "work",     label: "Work",     bg: "#DBEAFE", text: "#1D4ED8" },
  { id: "personal", label: "Personal", bg: "#D1FAE5", text: "#065F46" },
  { id: "reminder", label: "Reminder", bg: "#FEF3C7", text: "#92400E" },
  { id: "urgent",   label: "Urgent",   bg: "#FEE2E2", text: "#991B1B" },
];

// ─── Default Accent Colour (navy) ────────────────────────────────────────────
export const DEFAULT_ACCENT = { r: 27, g: 58, b: 92 };

// ─── Pure Utility Functions ───────────────────────────────────────────────────

/** Total days in a given month */
export const getDim = (y, m) => new Date(y, m + 1, 0).getDate();

/** 0-based weekday offset of the 1st (Mon = 0) */
export const getOffset = (y, m) => {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1;
};

/** Stable string key for a date, e.g. "2025-04-09" */
export const toKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** Construct a Date object from parts */
export const asDate = (y, m, d) => new Date(y, m, d);

/** Accent colour object → CSS rgb() string */
export const rgb = ({ r, g, b }) => `rgb(${r},${g},${b})`;

/** Accent colour object → CSS rgba() string */
export const rgba = ({ r, g, b }, a) => `rgba(${r},${g},${b},${a})`;

/**
 * Canvas-based accent colour extraction.
 * Samples the bottom-centre of an <img> element (richest hues in
 * landscape photography), darkens the result for safe UI use on
 * white backgrounds, and rejects near-grey samples.
 *
 * @param {HTMLImageElement} imgEl
 * @returns {{ r: number, g: number, b: number } | null}
 */
export function extractAccent(imgEl) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 80;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgEl, 0, 0, 80, 80);
    const px = ctx.getImageData(15, 45, 50, 35).data;

    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < px.length; i += 16) {
      r += px[i]; g += px[i + 1]; b += px[i + 2]; n++;
    }
    if (!n) return null;

    r = Math.round(r / n);
    g = Math.round(g / n);
    b = Math.round(b / n);

    // Reject near-grey colours — not useful as UI accents
    if (Math.max(r, g, b) - Math.min(r, g, b) < 35) return null;

    // Darken significantly so the colour is legible on white
    return {
      r: Math.round(r * 0.52),
      g: Math.round(g * 0.52),
      b: Math.round(b * 0.52),
    };
  } catch {
    return null;
  }
}