import React, { useState, useRef, useEffect } from "react";

interface InputScreenProps {
  name: string;
  onNameChange: (n: string) => void;
  onContinue: () => void;
  onGlitch: () => void;
}

export function InputScreen({ name, onNameChange, onContinue, onGlitch }: InputScreenProps) {
  const [flickerLabel, setFlickerLabel] = useState(false);
  const [autoTyped, setAutoTyped] = useState("");
  const [showAutoType, setShowAutoType] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subtle auto-type ghost effect (if user hasn't typed yet)
  useEffect(() => {
    if (name.length > 0) return;
    const ghostNames = ["ardan", ""];
    let charIdx = 0;
    let phase = 0;
    const interval = setInterval(() => {
      const target = ghostNames[phase % ghostNames.length];
      if (charIdx <= target.length) {
        setShowAutoType(true);
        setAutoTyped(target.slice(0, charIdx));
        charIdx++;
      } else {
        phase++;
        charIdx = 0;
        if (phase >= ghostNames.length) {
          setShowAutoType(false);
          clearInterval(interval);
        }
      }
    }, 120);
    const startTimer = setTimeout(() => {}, 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(startTimer);
    };
  }, [name]);

  // Random label flicker
  useEffect(() => {
    const interval = setInterval(() => {
      setFlickerLabel(true);
      setTimeout(() => setFlickerLabel(false), 100);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    if (name.trim().length === 0) {
      onGlitch();
      inputRef.current?.focus();
      return;
    }
    onContinue();
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#030303",
      display: "flex",
      flexDirection: "column",
      padding: "28px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Top red line */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(139,0,0,0.5), transparent)",
      }} />

      {/* Scan lines */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,0,0,0.006) 4px, rgba(255,0,0,0.006) 5px)",
        pointerEvents: "none",
      }} />

      {/* App mark */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "36px" }}>
        <div style={{
          width: "20px", height: "20px",
          borderRadius: "50%",
          border: "1px solid rgba(139,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: "7px", height: "1px", background: "rgba(139,0,0,0.6)", borderRadius: "1px" }} />
        </div>
        <span style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 200,
          fontSize: "11px",
          letterSpacing: "6px",
          color: "rgba(255,255,255,0.2)",
        }}>ADEM</span>
      </div>

      {/* Title */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 100,
          fontSize: "26px",
          letterSpacing: "5px",
          color: flickerLabel ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
          transition: "color 0.05s",
          marginBottom: "2px",
        }}>MASUKKAN</div>
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 200,
          fontSize: "26px",
          letterSpacing: "5px",
          color: "rgba(255,255,255,0.85)",
        }}>NAMA</div>
        <div style={{
          width: "28px", height: "1px",
          background: "rgba(139,0,0,0.55)",
          marginTop: "14px",
        }} />
      </div>

      {/* Label */}
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "7.5px",
        letterSpacing: "2px",
        color: "rgba(255,255,255,0.15)",
        marginBottom: "10px",
        textTransform: "uppercase" as const,
      }}>
        nama target
      </div>

      {/* Input field */}
      <div style={{ position: "relative", marginBottom: "10px" }}>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          placeholder={showAutoType && name.length === 0 ? autoTyped : "nama lengkap"}
          autoComplete="off"
          style={{
            width: "100%",
            padding: "15px 16px",
            background: "rgba(255,255,255,0.025)",
            border: "none",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            borderLeft: "2px solid rgba(139,0,0,0.55)",
            color: "rgba(255,255,255,0.75)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "13px",
            letterSpacing: "1.5px",
            outline: "none",
            caretColor: "rgba(139,0,0,0.9)",
            boxSizing: "border-box" as const,
          }}
        />
      </div>

      {/* Hint */}
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "7px",
        color: "rgba(139,0,0,0.3)",
        letterSpacing: "1px",
        marginBottom: "44px",
      }}>
        * gunakan nama asli
      </div>

      {/* LANJUT button */}
      <button
        onClick={handleContinue}
        style={{
          width: "100%",
          padding: "16px",
          background: "rgba(120,0,0,0.85)",
          border: "none",
          borderRadius: "3px",
          color: "rgba(255,255,255,0.88)",
          fontFamily: "'Space Mono', monospace",
          fontSize: "10px",
          letterSpacing: "6px",
          cursor: "pointer",
          textTransform: "uppercase" as const,
          boxShadow: "0 0 24px rgba(139,0,0,0.18), 0 0 60px rgba(80,0,0,0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span style={{ position: "relative", zIndex: 1 }}>LANJUT</span>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />
      </button>

      {/* Warning text */}
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <span className="adem-flicker" style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "7.5px",
          letterSpacing: "1.5px",
          color: "rgba(255,255,255,0.12)",
        }}>
          setiap nama, ada harganya.
        </span>
      </div>

      {/* Corner */}
      <div style={{
        position: "absolute",
        bottom: "12px", right: "20px",
        fontFamily: "'Space Mono', monospace",
        fontSize: "7px",
        color: "rgba(139,0,0,0.18)",
        letterSpacing: "2px",
      }}>§01</div>
    </div>
  );
}