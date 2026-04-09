"use client";
import { useState, useEffect, useRef, useCallback } from "react";

import { DEFAULT_ACCENT, HERO_IMAGES, toKey, asDate, rgba } from "./components/utils";
import HeroSection  from "./components/HeroSection";
import CalendarGrid from "./components/CalendarGrid";
import NoteModal    from "./components/NoteModal";
import NotesPanel   from "./components/NotesPanel";

type Accent = { r: number; g: number; b: number };
type Note = { text: string; tag: string | null };

export default function WallCalendar() {
  const now = new Date();

  const [year,  setYear]  = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth());
  const [dir,   setDir]   = useState<number>(0);
  const [animK, setAnimK] = useState<number>(0);

  const [heroIdx,   setHero]   = useState<number>(0);
  const [customImg, setCustom] = useState<string | null>(null);
  const [accent,    setAccent] = useState<Accent>(DEFAULT_ACCENT);

  const [rangeStart, setRS] = useState<Date | null>(null);
  const [rangeEnd,   setRE] = useState<Date | null>(null);
  const dragging   = useRef<boolean>(false);
  const dragAnchor = useRef<Date | null>(null);

  const [notes, setNotes] = useState<Record<string, Note>>({});

  const [modal, setModal] = useState<{ y: number; m: number; d: number } | null>(null);
  const [mText, setMText] = useState<string>("");
  const [mTag,  setMTag]  = useState<string | null>(null);

  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (customImg) return;
    const id = setInterval(
      () => setHero((i) => (i + 1) % HERO_IMAGES.length),
      5000,
    );
    return () => clearInterval(id);
  }, [customImg]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (modal) return;
      if (e.key === "ArrowLeft")  nav(-1);
      if (e.key === "ArrowRight") nav(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const nav = useCallback(
    (d: number) => {
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

  const onDayDown = (d: number) => {
    dragging.current  = true;
    dragAnchor.current = asDate(year, month, d);
    setRS(dragAnchor.current);
    setRE(null);
  };

  const onDayEnter = (d: number) => {
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

  const onDayUp = (d: number) => {
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

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchX.current) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 48) nav(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const saveNote = () => {
    if (!modal) return;
    const k = toKey(modal.y, modal.m, modal.d);
    setNotes((prev) =>
      mText.trim()
        ? { ...prev, [k]: { text: mText.trim(), tag: mTag } }
        : (({ [k]: _, ...rest }) => rest)(prev),
    );
    setModal(null);
  };

  const delNote = () => {
    if (!modal) return;
    setNotes((prev) =>
      (({ [toKey(modal.y, modal.m, modal.d)]: _, ...rest }) => rest)(prev),
    );
    setModal(null);
  };

  const handleNoteClick = (
    y: number,
    m: number,
    d: number,
    text: string,
    tag: string | null
  ) => {
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
      ? Math.round((rangeEnd.getTime() - rangeStart.getTime()) / 86400000) + 1
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

      <NotesPanel
        monthNotes={monthNotes}
        month={month}
        year={year}
        accent={accent}
        onNoteClick={handleNoteClick}
      />

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