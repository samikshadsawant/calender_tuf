"use client";
import {
  MONTHS,
  WEEKDAYS,
  HOLIDAYS,
  NOTE_TAGS,
  getDim,
  getOffset,
  toKey,
  asDate,
  rgb,
  rgba,
} from "./utils";

type Props = {
  year: number;
  month: number;
  dir: number;
  animK: number;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onDayDown: (d: number) => void;
  onDayEnter: (d: number) => void;
  onDayUp: (d: number) => void;
  notes: Record<string, { text: string; tag: string | null }>;
  accent: { r: number; g: number; b: number };
  nav: (d: number) => void;
  jumpToday: () => void;
  selDays: number | null;
  monthNotesCount: number;
};

const H = HOLIDAYS as Record<string, string | undefined>;

export default function CalendarGrid({
  year,
  month,
  dir,
  animK,
  rangeStart,
  rangeEnd,
  onDayDown,
  onDayEnter,
  onDayUp,
  notes,
  accent,
  nav,
  jumpToday,
  selDays,
  monthNotesCount,
}: Props) {
  const now = new Date();
  const A   = accent;

  const dim    = getDim(year, month);
  const offset = getOffset(year, month);
  const cells  = [
    ...Array(offset).fill(null),
    ...Array.from({ length: dim }, (_, i) => i + 1),
  ];

  const isStart  = (d: number) =>
    rangeStart?.getFullYear() === year &&
    rangeStart?.getMonth()    === month &&
    rangeStart?.getDate()     === d;

  const isEnd_   = (d: number) =>
    rangeEnd?.getFullYear() === year &&
    rangeEnd?.getMonth()    === month &&
    rangeEnd?.getDate()     === d;

  const inRange  = (d: number) => {
    if (!rangeStart || !rangeEnd) return false;
    const cur = asDate(year, month, d);
    return cur > rangeStart && cur < rangeEnd;
  };

  const isToday  = (d: number) =>
    now.getFullYear() === year &&
    now.getMonth()    === month &&
    now.getDate()     === d;

  const holiday  = (d: number) => H[toKey(year, month, d)];
  const note     = (d: number) => notes[toKey(year, month, d)];

  return (
    <div
      className="cpanel"
      style={{
        flex: 1,
        padding: "22px 20px 18px",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <button
          className="nbtn"
          onClick={() => nav(-1)}
          style={{
            width: 36, height: 36,
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 10, background: "none",
            cursor: "pointer", fontSize: 22, color: "#1A1714",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
          }}
        >
          ‹
        </button>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 21, fontWeight: 700,
              color: rgb(A), letterSpacing: 0.3,
              transition: "color 0.8s ease",
            }}
          >
            {MONTHS[month]} {year}
          </div>
          <button
            onClick={jumpToday}
            style={{
              fontSize: 10.5, color: rgba(A, 0.65),
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "inherit", letterSpacing: 0.5,
              textDecoration: "underline dotted",
              padding: 0, transition: "color 0.8s ease",
            }}
          >
            {now.getFullYear() === year && now.getMonth() === month
              ? "· this month ·"
              : "jump to today"}
          </button>
        </div>

        <button
          className="nbtn"
          onClick={() => nav(1)}
          style={{
            width: 36, height: 36,
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 10, background: "none",
            cursor: "pointer", fontSize: 22, color: "#1A1714",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
          }}
        >
          ›
        </button>
      </div>

      <div
        style={{
          display: "flex", gap: 8, marginBottom: 14,
          flexWrap: "wrap", alignItems: "center",
        }}
      >
        <div
          style={{
            background: rgba(A, 0.09), borderRadius: 8,
            padding: "4px 11px", fontSize: 11, color: rgb(A),
            fontWeight: 500, transition: "background 0.8s, color 0.8s",
          }}
        >
          {monthNotesCount} {monthNotesCount === 1 ? "note" : "notes"} this month
        </div>

        {selDays && (
          <div
            style={{
              background: rgba(A, 0.09), borderRadius: 8,
              padding: "4px 11px", fontSize: 11, color: rgb(A),
              fontWeight: 500, transition: "background 0.8s, color 0.8s",
            }}
          >
            {selDays} day{selDays > 1 ? "s" : ""} selected
          </div>
        )}

        <div style={{ marginLeft: "auto", fontSize: 10, color: "#B0A8A0", letterSpacing: 0.3 }}>
          ← → · drag to select
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            style={{
              textAlign: "center", fontSize: 9.5, fontWeight: 600,
              letterSpacing: 1.2, textTransform: "uppercase",
              color: w === "Sat" || w === "Sun" ? rgba(A, 0.6) : "#B0A8A0",
              padding: "3px 0", transition: "color 0.8s",
            }}
          >
            {w}
          </div>
        ))}
      </div>

      <div
        key={animK}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px 1px",
          flex: 1,
          animation:
            dir === 0
              ? "none"
              : dir === 1
              ? "slideL 0.3s ease"
              : "slideR 0.3s ease",
        }}
      >
        {cells.map((d, idx) => {
          if (d === null) return <div key={`e${idx}`} />;

          const start  = isStart(d);
          const end__  = isEnd_(d);
          const range_ = inRange(d);
          const today  = isToday(d);
          const hol    = holiday(d);
          const nt     = note(d);
          const isWknd = (offset + d - 1) % 7 >= 5;
          const tag    = nt ? NOTE_TAGS.find((t) => t.id === nt.tag) : null;

          const cellBg =
            start  ? rgb(A)        :
            end__  ? rgba(A, 0.72) :
            range_ ? rgba(A, 0.1)  :
            "transparent";

          const numCol =
            start || end__ ? "#fff"        :
            today          ? rgb(A)        :
            hol            ? "#B45309"     :
            isWknd         ? rgba(A, 0.65) :
            "#1A1714";

          return (
            <div
              key={d}
              className="day"
              onMouseDown={() => onDayDown(d)}
              onMouseEnter={() => onDayEnter(d)}
              onMouseUp={() => onDayUp(d)}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px 1px",
                borderRadius: 10,
                background: cellBg,
                transition: "background 0.1s",
              }}
            >
              <div
                className="num"
                style={{
                  width: 31, height: 31, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12.5,
                  fontWeight: start || end__ ? 600 : today ? 600 : 400,
                  color: numCol,
                  border: today && !start && !end__
                    ? `1.5px solid ${rgb(A)}`
                    : "none",
                  transition: "color 0.8s, border-color 0.8s",
                }}
              >
                {d}
              </div>

              {nt && (
                <div
                  style={{
                    position: "absolute", bottom: 4,
                    width: 4, height: 4, borderRadius: "50%",
                    background:
                      start || end__
                        ? "rgba(255,255,255,0.7)"
                        : tag
                        ? tag.text
                        : rgb(A),
                    transition: "background 0.8s",
                  }}
                />
              )}

              {hol && !nt && (
                <div
                  title={hol}
                  style={{
                    position: "absolute", bottom: 4,
                    width: 4, height: 4, borderRadius: "50%",
                    background: "#D97706",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
        {[
          { sw: rgb(A),         label: "Start"   },
          { sw: rgba(A, 0.72),  label: "End"     },
          { sw: rgba(A, 0.1),   label: "Range",  border: `1px solid ${rgba(A, 0.2)}` },
          { sw: "#D97706",      label: "Holiday", circle: true },
          { sw: rgb(A),         label: "Note",    circle: true },
        ].map(({ sw, label, border, circle }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div
              style={{
                width:  circle ? 5  : 12,
                height: circle ? 5  : 12,
                borderRadius: circle ? "50%" : 3,
                background: sw,
                border,
                flexShrink: 0,
                transition: "background 0.8s",
              }}
            />
            <span style={{ fontSize: 10.5, color: "#B0A8A0", letterSpacing: 0.3 }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}