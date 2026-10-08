import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  onContinue: () => void;
  onBreath: () => void;
}

const VARIANTS = ["ADEM", "A.D.E.M", "ÅD̶EM", "ADEM", "Adem", "ADEM"];

export function SplashScreen({ onContinue, onBreath }: SplashScreenProps) {
  const [title, setTitle] = useState("ADEM");
  const [glitching, setGlitching] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(show);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const glitch = () => {
      setGlitching(true);
      let step = 0;
      const cycle = () => {
        setTitle(VARIANTS[step % VARIANTS.length]);
        step++;
        if (step < VARIANTS.length) {
          timeout = setTimeout(cycle, 70);
        } else {
          setTitle("ADEM");
          setGlitching(false);
        }
      };
      cycle();
    };
    const interval = setInterval(glitch, 4500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Breath sound every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      onBreath();
    }, 5000);
    return () => clearInterval(interval);
  }, [onBreath]);

  return (
    <div
      onClick={onContinue}
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Blood/smoke gradient */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "70%",
        background: "radial-gradient(ellipse 130% 80% at 50% 110%, rgba(100,0,0,0.4) 0%, rgba(50,0,0,0.15) 40%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Top red glow */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "300px",
        height: "200px",
        background: "radial-gradient(ellipse, rgba(60,0,0,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Human silhouette — breathing */}
      <div
        className="adem-breathe"
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transformOrigin: "bottom center",
        }}
      >
        <svg viewBox="0 0 80 170" width="70" height="148" fill="white" opacity={0.06}>
          <ellipse cx="40" cy="19" rx="14" ry="16" />
          <rect x="34" y="33" width="12" height="10" rx="3" />
          <path d="M22 44 Q40 52 58 44 L62 116 Q40 124 18 116 Z" />
          <path d="M23 50 L6 108 Q9 113 15 109 L29 58 Z" />
          <path d="M57 50 L74 108 Q71 113 65 109 L51 58 Z" />
          <path d="M30 114 L24 166 Q29 170 37 167 L40 117 Z" />
          <path d="M50 114 L56 166 Q51 170 43 167 L40 117 Z" />
        </svg>
      </div>

      {/* Scan lines */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,0,0.01) 3px, rgba(255,0,0,0.01) 4px)",
        pointerEvents: "none",
        zIndex: 2,
      }} />

      {/* Title */}
      <div style={{ position: "relative", zIndex: 5, textAlign: "center" }}>
        {glitching && (
          <>
            <div aria-hidden style={{
              position: "absolute",
              top: 0, left: "-3px",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 100,
              fontSize: "68px",
              letterSpacing: "18px",
              color: "rgba(139,0,0,0.6)",
              clipPath: "inset(15% 0 65% 0)",
              pointerEvents: "none",
            }}>ADEM</div>
            <div aria-hidden style={{
              position: "absolute",
              top: 0, left: "3px",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 100,
              fontSize: "68px",
              letterSpacing: "18px",
              color: "rgba(0,160,160,0.2)",
              clipPath: "inset(65% 0 15% 0)",
              pointerEvents: "none",
            }}>ADEM</div>
          </>
        )}
        <span style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 100,
          fontSize: "68px",
          letterSpacing: "18px",
          color: "#ddd",
          display: "block",
          marginLeft: "18px",
          textShadow: "0 0 50px rgba(139,0,0,0.25)",
        }}>
          {title}
        </span>

        <div style={{
          width: "48px",
          height: "1px",
          background: "rgba(139,0,0,0.6)",
          margin: "20px auto",
          boxShadow: "0 0 8px rgba(139,0,0,0.5)",
        }} />

        <p className="adem-flicker" style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "8.5px",
          letterSpacing: "2.5px",
          color: "rgba(200,200,200,0.35)",
          margin: 0,
        }}>
          napas adalah milik yang dipinjam.
        </p>
      </div>

      {/* Tap hint */}
      <div className="adem-pulse-text" style={{
        position: "absolute",
        bottom: "6%",
        fontFamily: "'Space Mono', monospace",
        fontSize: "7px",
        letterSpacing: "3px",
        color: "rgba(255,255,255,0.12)",
        zIndex: 5,
      }}>
        SENTUH UNTUK MELANJUTKAN
      </div>

      {/* Center pulse dot */}
      <div className="adem-pulse-dot" style={{
        position: "absolute",
        bottom: "4.2%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        background: "rgba(139,0,0,0.6)",
        zIndex: 5,
      }} />
    </div>
  );
}
