"use client";
import { useState, useEffect, useRef, useCallback } from "react";

import { DEFAULT_ACCENT, HERO_IMAGES, toKey, asDate, rgba } from "./components/utils";
import HeroSection  from "./components/HeroSection";
import CalendarGrid from "./components/CalendarGrid";
import NoteModal    from "./components/NoteModal";
import NotesPanel   from "./components/NotesPanel";

export default function WallCalendar() {
  const now = new Date();

  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [dir,   setDir]   = useState(0);
  const [animK, setAnimK] = useState(0);

  const [heroIdx,   setHero]   = useState(0);
  const [customImg, setCustom] = useState(null);
  const [accent,    setAccent] = useState(DEFAULT_ACCENT);

  const [rangeStart, setRS] = useState(null);
  const [rangeEnd,   setRE] = useState(null);
  const dragging   = useRef(false);
  const dragAnchor = useRef(null);

  const [notes, setNotes] = useState({});

  const [modal, setModal] = useState(null);
  const [mText, setMText] = useState("");
  const [mTag,  setMTag]  = useState(null);

  const touchX = useRef(null);

  useEffect(() => {
    if (customImg) return;
    const id = setInterval(
      () => setHero((i) => (i + 1) % HERO_IMAGES.length),
      5000,
    );
    return () => clearInterval(id);
  }, [customImg]);

  useEffect(() => {
    const handler = (e) => {
      if (modal) return;
      if (e.key === "ArrowLeft")  nav(-1);
      if (e.key === "ArrowRight") nav(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const nav = useCallback(
    (d) => {
      setDir(d);
      setAnimK((k) => k + 1);
      setRS(null);
      setRE(null);
      if (d === -1) {
        if (month === 0) { setYear((y) => y - 1); setMonth(11); }
        else setMonth((m) => m - 1);
      } else {
        if (month === 11) { setYear((y) => y + 1); setMonth(0); }
        else setMonth((m) => m + 1);
      }
    },
    [month],
  );

  const jumpToday = () => {
    const d =
      year > now.getFullYear() ||
      (year === now.getFullYear() && month > now.getMonth())
        ? -1 : 1;
    setDir(d);
    setAnimK((k) => k + 1);
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setRS(null);
    setRE(null);
  };

  const onDayDown = (d) => {
    dragging.current  = true;
    dragAnchor.current = asDate(year, month, d);
    setRS(dragAnchor.current);
    setRE(null);
  };

  const onDayEnter = (d) => {
    if (!dragging.current || !dragAnchor.current) return;
    const cur = asDate(year, month, d);
    if (cur >= dragAnchor.current) {
      setRS(dragAnchor.current);
      setRE(cur);
    } else {
      setRS(cur);
      setRE(dragAnchor.current);
    }
  };

  const onDayUp = (d) => {
    if (!dragging.current) return;
    dragging.current = false;
    const cur = asDate(year, month, d);
    if (!dragAnchor.current) return;
    const [s, e] =
      cur >= dragAnchor.current
        ? [dragAnchor.current, cur]
        : [cur, dragAnchor.current];
    setRS(s);
    setRE(e);
    setModal({ y: year, m: month, d });
    const existing = notes[toKey(year, month, d)];
    setMText(existing?.text || "");
    setMTag(existing?.tag   || null);
  };

  const onGlobalUp = () => {
    dragging.current = false;
  };

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (!touchX.current) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 48) nav(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const saveNote = () => {
    const k = toKey(modal.y, modal.m, modal.d);
    setNotes((prev) =>
      mText.trim()
        ? { ...prev, [k]: { text: mText.trim(), tag: mTag } }
        : (({ [k]: _, ...rest }) => rest)(prev),
    );
    setModal(null);
  };

  const delNote = () => {
    setNotes((prev) =>
      (({ [toKey(modal.y, modal.m, modal.d)]: _, ...rest }) => rest)(prev),
    );
    setModal(null);
  };

  const handleNoteClick = (y, m, d, text, tag) => {
    setModal({ y, m, d });
    setMText(text);
    setMTag(tag ?? null);
  };

  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthNotes  = Object.entries(notes)
    .filter(([k]) => k.startsWith(monthPrefix))
    .sort(([a], [b]) => a.localeCompare(b));

  const selDays =
    rangeStart && rangeEnd
      ? Math.round((rangeEnd - rangeStart) / 86400000) + 1
      : null;

  const A = accent;

  return (
    <div
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "#EDEAE2",
        minHeight: "100vh",
        padding: "18px 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onMouseUp={onGlobalUp}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .day { user-select: none; -webkit-user-select: none; transition: background 0.1s; cursor: pointer; }
        .day:hover > .num { background: rgba(0,0,0,0.05) !important; }

        .ncard { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .ncard:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.11) !important; }

        .ndot:hover { opacity: 1 !important; }

        .nbtn:hover { background: rgba(0,0,0,0.06) !important; }

        @keyframes slideL {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes slideR {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0);     }
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }

        @media (max-width: 640px) {
          .mlayout  { flex-direction: column !important; }
          .hpanel   { min-height: 210px !important; flex: none !important; width: 100% !important; }
          .cpanel   { padding: 14px 10px !important; }
          .num      { width: 27px !important; height: 27px !important; font-size: 11.5px !important; }
          .ngrid    { grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)) !important; }
        }
      `}</style>

      <div
        style={{
          maxWidth: 940, width: "100%",
          background: "#fff", borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 24px 72px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.05)",
          animation: "popIn 0.45s ease",
        }}
      >
        <div
          style={{
            background: "#E4DFD5",
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            borderBottom: "1px solid rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}
        >
          {Array.from({ length: 26 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 14, height: 14,
                borderRadius: "50%",
                border: `2.5px solid ${rgba(A, 0.55)}`,
                background: "#E4DFD5",
                flexShrink: 0,
                transition: "border-color 0.8s ease",
              }}
            />
          ))}
        </div>

        <div className="mlayout" style={{ display: "flex", minHeight: 430 }}>
          <HeroSection
            heroIdx={heroIdx}
            setHero={setHero}
            customImg={customImg}
            setCustom={setCustom}
            accent={accent}
            setAccent={setAccent}
            year={year}
            month={month}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />

          <CalendarGrid
            year={year}
            month={month}
            dir={dir}
            animK={animK}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onDayDown={onDayDown}
            onDayEnter={onDayEnter}
            onDayUp={onDayUp}
            notes={notes}
            accent={accent}
            nav={nav}
            jumpToday={jumpToday}
            selDays={selDays}
            monthNotesCount={monthNotes.length}
          />
        </div>

        <NotesPanel
          monthNotes={monthNotes}
          month={month}
          year={year}
          accent={accent}
          onNoteClick={handleNoteClick}
        />
      </div>

      <div
        style={{
          marginTop: 14, fontSize: 11,
          color: "rgba(0,0,0,0.28)", letterSpacing: 0.5,
        }}
      >
        ← → arrow keys to navigate · drag across dates to select a range
      </div>

      <NoteModal
        modal={modal}
        setModal={setModal}
        mText={mText}
        setMText={setMText}
        mTag={mTag}
        setMTag={setMTag}
        notes={notes}
        accent={accent}
        saveNote={saveNote}
        delNote={delNote}
      />
    </div>
  );
}