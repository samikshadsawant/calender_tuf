"use client";
import {
  MONTHS,
  WEEKDAYS,
  HOLIDAYS,
  NOTE_TAGS,
  toKey,
  asDate,
  rgb,
} from "./utils";

type Props = {
  modal: { y: number; m: number; d: number } | null;
  setModal: (value: { y: number; m: number; d: number } | null) => void;
  mText: string;
  setMText: (value: string) => void;
  mTag: string | null;
  setMTag: (value: string | null) => void;
  notes: Record<string, { text: string; tag: string | null }>;
  accent: { r: number; g: number; b: number };
  saveNote: () => void;
  delNote: () => void;
};

const H = HOLIDAYS as Record<string, string | undefined>;

export default function NoteModal({
  modal,
  setModal,
  mText,
  setMText,
  mTag,
  setMTag,
  notes,
  accent,
  saveNote,
  delNote,
}: Props) {
  if (!modal) return null;

  const A           = accent;
  const dateKey     = toKey(modal.y, modal.m, modal.d);
  const dayOfWeek   = WEEKDAYS[(asDate(modal.y, modal.m, modal.d).getDay() + 6) % 7];
  const holidayName = H[dateKey];
  const hasExisting = !!notes[dateKey];

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(5,5,10,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: 16,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}
    >
      <div
        style={{
          background: "#fff", borderRadius: 22,
          padding: "0 0 22px",
          width: "100%", maxWidth: 420,
          boxShadow: "0 32px 88px rgba(0,0,0,0.32)",
          animation: "popIn 0.25s ease",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 6,
            background: rgb(A),
            transition: "background 0.8s",
          }}
        />

        <div style={{ padding: "24px 24px 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28, fontWeight: 700,
                  color: "#1A1714", lineHeight: 1,
                }}
              >
                {modal.d} {MONTHS[modal.m]}
              </div>

              <div
                style={{
                  fontSize: 12, color: "#B0A8A0", marginTop: 4,
                  display: "flex", alignItems: "center",
                  gap: 6, flexWrap: "wrap",
                }}
              >
                <span>{dayOfWeek} · {modal.y}</span>

                {holidayName && (
                  <span
                    style={{
                      background: "#FEF3C7", color: "#92400E",
                      fontSize: 10.5, fontWeight: 600,
                      padding: "1px 7px", borderRadius: 5,
                    }}
                  >
                    🎉 {holidayName}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setModal(null)}
              style={{
                background: "#F2EFE8", border: "none", cursor: "pointer",
                width: 32, height: 32, borderRadius: 8,
                fontSize: 18, color: "#B0A8A0",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {NOTE_TAGS.map((t) => (
              <button
                key={t.id}
                onClick={() => setMTag(mTag === t.id ? null : t.id)}
                style={{
                  fontSize: 11, fontWeight: 600,
                  padding: "4px 12px", borderRadius: 7,
                  cursor: "pointer", fontFamily: "inherit",
                  letterSpacing: 0.3, transition: "all 0.15s",
                  background: mTag === t.id ? t.text : t.bg,
                  color:      mTag === t.id ? "#fff"  : t.text,
                  border: `1.5px solid ${t.text}33`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <textarea
            value={mText}
            onChange={(e) => setMText(e.target.value)}
            placeholder="Jot down anything for this date…"
            autoFocus
            rows={5}
            style={{
              width: "100%",
              border: "1.5px solid rgba(0,0,0,0.1)",
              borderRadius: 12,
              padding: "13px 15px",
              fontSize: 14, fontFamily: "inherit",
              resize: "vertical", outline: "none",
              lineHeight: 1.68, color: "#1A1714",
              background: "#F6F2EB",
              transition: "border-color 0.2s",
            }}
            onFocus={(e)  => (e.target.style.borderColor = rgb(A))}
            onBlur={(e)   => (e.target.style.borderColor = "rgba(0,0,0,0.1)")}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button
              onClick={saveNote}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              style={{
                flex: 1,
                background: rgb(A), color: "#fff",
                border: "none", borderRadius: 11,
                padding: "12px", fontSize: 13.5, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                transition: "opacity 0.15s, background 0.8s",
              }}
            >
              Save Note
            </button>

            <button
              onClick={() => setModal(null)}
              style={{
                background: "none",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 11, padding: "12px 15px",
                fontSize: 13, color: "#B0A8A0",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Cancel
            </button>

            {hasExisting && (
              <button
                onClick={delNote}
                style={{
                  background: "rgba(220,38,38,0.06)",
                  border: "1px solid rgba(220,38,38,0.22)",
                  borderRadius: 11, padding: "12px 14px",
                  fontSize: 13, color: "#DC2626",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Delete
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}