"use client";
import { useEffect, useRef } from "react";
import {
  HERO_IMAGES,
  MONTHS,
  DEFAULT_ACCENT,
  extractAccent,
  rgb,
} from "./utils";

type Props = {
  heroIdx: number;
  setHero: (value: number) => void;
  customImg: string | null;
  setCustom: (value: string | null) => void;
  accent: { r: number; g: number; b: number };
  setAccent: (value: { r: number; g: number; b: number }) => void;
  year: number;
  month: number;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
};

export default function HeroSection({
  heroIdx,
  setHero,
  customImg,
  setCustom,
  accent,
  setAccent,
  year,
  month,
  onTouchStart,
  onTouchEnd,
}: Props) {
  const imgRefs = useRef<{ [key: number]: HTMLImageElement }>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (customImg) return;
    const el = imgRefs.current[heroIdx];
    if (el?.complete) {
      const c = extractAccent(el);
      if (c) setAccent(c);
    }
  }, [heroIdx, customImg, setAccent]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = (ev.target as FileReader).result as string;
      setCustom(result);
      const img = new Image();
      img.onload = () => {
        const c = extractAccent(img);
        if (c) setAccent(c);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleReset = () => {
    setCustom(null);
    setAccent(DEFAULT_ACCENT);
  };

  const A = accent;

  return (
    <div
      className="hpanel"
      style={{
        flex: "0 0 310px",
        position: "relative",
        overflow: "hidden",
        background: "#111",
        minHeight: 430,
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {HERO_IMAGES.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          crossOrigin="anonymous"
          ref={(el) => { if (el) imgRefs.current[i] = el; }}
          onLoad={(e) => {
            if (i === heroIdx && !customImg) {
              const c = extractAccent(e.currentTarget);
              if (c) setAccent(c);
            }
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: !customImg && heroIdx === i ? 1 : 0,
            transition: "opacity 1.3s ease",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      {customImg && (
        <img
          src={customImg}
          alt="custom"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 3,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(175deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.76) 100%)",
          zIndex: 4,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 5,
          background: rgb(A),
          zIndex: 6,
          transition: "background 0.85s ease",
        }}
      />

      <div style={{ position: "absolute", bottom: 26, left: 22, zIndex: 5 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 60,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1,
            letterSpacing: -2,
            textShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          {year}
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.7)",
            letterSpacing: 5,
            textTransform: "uppercase",
            marginTop: 8,
          }}
        >
          {MONTHS[month]}
        </div>
      </div>

      {!customImg && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 7,
            zIndex: 5,
          }}
        >
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              className="ndot"
              onClick={() => setHero(i)}
              style={{
                width: i === heroIdx ? 22 : 6,
                height: 6,
                borderRadius: 3,
                background:
                  i === heroIdx ? "#fff" : "rgba(255,255,255,0.32)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.4s ease",
                opacity: i === heroIdx ? 1 : 0.6,
              }}
            />
          ))}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          flexDirection: "column",
          gap: 7,
          zIndex: 6,
        }}
      >
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            background: "rgba(255,255,255,0.13)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.28)",
            borderRadius: 9,
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            padding: "7px 12px",
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
          }}
        >
          ＋ My Photo
        </button>

        {customImg && (
          <button
            onClick={handleReset}
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 9,
              color: "rgba(255,255,255,0.82)",
              fontSize: 11,
              padding: "6px 12px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Reset
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}