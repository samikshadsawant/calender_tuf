"use client";
import {
  MONTHS,
  WEEKDAYS,
  HOLIDAYS,
  NOTE_TAGS,
  asDate,
  rgb,
  rgba,
} from "./utils";

export default function NotesPanel({
  monthNotes,
  month,
  year,
  accent,
  onNoteClick,
}) {
  const A = accent;

  return (
    <div
      style={{
        borderTop: "1px solid rgba(0,0,0,0.07)",
        background: "#F6F2EB",
        padding: "20px 24px 26px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 3, height: 22,
            background: rgb(A), borderRadius: 2,
            transition: "background 0.8s",
          }}
        />

        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 17, fontWeight: 700, color: "#1A1714",
          }}
        >
          Notes —{" "}
          <span style={{ color: rgb(A), transition: "color 0.8s" }}>
            {MONTHS[month]} {year}
          </span>
        </div>

        <div
          style={{
            marginLeft: "auto",
            background: monthNotes.length ? rgb(A) : "transparent",
            color:      monthNotes.length ? "#fff" : "#B0A8A0",
            fontSize: 12, fontWeight: 600,
            padding: "3px 11px", borderRadius: 20,
            border: monthNotes.length ? "none" : "1px solid #C5C0B6",
            minWidth: 28, textAlign: "center",
            transition: "background 0.8s",
          }}
        >
          {monthNotes.length}
        </div>
      </div>

      {monthNotes.length === 0 ? (
        <div
          style={{
            color: "#B0A8A0", fontSize: 13,
            textAlign: "center", padding: "22px 0",
            fontStyle: "italic",
          }}
        >
          Drag across dates to select a range · click any date to attach a note
        </div>
      ) : (
        <div
          className="ngrid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
            gap: 10,
          }}
        >
          {monthNotes.map(([k, nd]) => {
            const [ky, km, kd] = k.split("-").map(Number);
            const dow          = WEEKDAYS[(asDate(ky, km - 1, kd).getDay() + 6) % 7];
            const tag          = NOTE_TAGS.find((t) => t.id === nd.tag);
            const holidayName  = HOLIDAYS[k];

            return (
              <div
                key={k}
                className="ncard"
                onClick={() => onNoteClick(ky, km - 1, kd, nd.text, nd.tag)}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.07)",
                  borderLeft: `3.5px solid ${tag?.text || rgb(A)}`,
                  borderRadius: 14,
                  padding: "13px 14px",
                  animation: "fadeUp 0.3s ease",
                  transition: "border-color 0.8s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: rgba(A, 0.1),
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: rgb(A),
                      flexShrink: 0,
                      transition: "background 0.8s, color 0.8s",
                    }}
                  >
                    {kd}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 9.5, fontWeight: 600,
                        color: rgb(A), letterSpacing: 1,
                        textTransform: "uppercase",
                        transition: "color 0.8s",
                      }}
                    >
                      {dow}
                    </div>
                    <div style={{ fontSize: 9.5, color: "#B0A8A0" }}>
                      {MONTHS[km - 1]}
                    </div>
                  </div>

                  {tag && (
                    <div
                      style={{
                        fontSize: 9.5, fontWeight: 600,
                        padding: "2px 7px", borderRadius: 6,
                        background: tag.bg, color: tag.text,
                        flexShrink: 0,
                      }}
                    >
                      {tag.label}
                    </div>
                  )}
                </div>

                {holidayName && (
                  <div
                    style={{
                      fontSize: 10, color: "#D97706",
                      fontWeight: 500, marginBottom: 5,
                    }}
                  >
                    🎉 {holidayName}
                  </div>
                )}

                <div
                  style={{
                    fontSize: 12.5, color: "#2C2824",
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {nd.text}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}