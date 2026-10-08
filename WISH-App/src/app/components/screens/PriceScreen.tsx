import React, { useEffect, useState } from "react";

interface PriceScreenProps {
  name: string;
  years: number;
  consequence: string;
  onAccept: () => void;
  onBack: () => void;
}

export function PriceScreen({ name, years, consequence, onAccept, onBack }: PriceScreenProps) {
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState("");
  const [mouthOpacity, setMouthOpacity] = useState(0.05);
  const [glitchConsequence, setGlitchConsequence] = useState(false);
  const [contractTime, setContractTime] = useState(13);

  // Consequence reveal — type letter by letter after 2 sec
  useEffect(() => {
    setRevealed(false);
    setTyped("");
    const delay = setTimeout(() => {
      setRevealed(true);
      let i = 0;
      const interval = setInterval(() => {
        setTyped(consequence.slice(0, i + 1).toUpperCase());
        i++;
        if (i >= consequence.length) clearInterval(interval);
      }, 80);
      return () => clearInterval(interval);
    }, 2200);
    return () => clearTimeout(delay);
  }, [consequence]);

  // Mouth fade pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setMouthOpacity((prev) => (prev < 0.14 ? 0.14 : 0.04));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Glitch on consequence
  useEffect(() => {
    if (!revealed) return;
    const interval = setInterval(() => {
      setGlitchConsequence(true);
      setTimeout(() => setGlitchConsequence(false), 140);
    }, 5500);
    return () => clearInterval(interval);
  }, [revealed]);

  // Contract countdown - sisa waktu kontrak
  useEffect(() => {
    setContractTime(13);
    const interval = setInterval(() => {
      setContractTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [name, years, consequence]);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#010101",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient red top glow */}
      <div style={{
        position: "absolute",
        top: "-30px", left: "50%",
        transform: "translateX(-50%)",
        width: "300px", height: "200px",
        background: "radial-gradient(ellipse, rgba(90,0,0,0.2) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Fading mouth */}
      <div style={{
        position: "absolute",
        bottom: "22%", left: "50%",
        transform: "translateX(-50%)",
        opacity: mouthOpacity,
        transition: "opacity 2.5s ease",
        pointerEvents: "none",
        filter: "blur(0.4px)",
        zIndex: 1,
      }}>
        <svg viewBox="0 0 130 65" width="115" height="57" fill="none">
          <path d="M8 32 Q32 14 65 12 Q98 14 122 32" stroke="rgba(180,0,0,0.7)" strokeWidth="1.5" fill="none" />
          <path d="M8 32 Q32 52 65 54 Q98 52 122 32" stroke="rgba(180,0,0,0.7)" strokeWidth="1.5" fill="none" />
          <path d="M20 32 Q40 20 65 19 Q90 20 110 32 Q90 44 65 45 Q40 44 20 32 Z" fill="rgba(0,0,0,0.85)" />
          {[38, 47, 56, 65, 74, 83, 92].map((x, i) => (
            <line key={i} x1={x} y1={26} x2={x} y2={32} stroke="rgba(230,230,230,0.1)" strokeWidth="0.7" />
          ))}
          {glitchConsequence && (
            <line x1="0" y1="30" x2="130" y2="30" stroke="rgba(139,0,0,0.5)" strokeWidth="2" />
          )}
        </svg>
      </div>

      {/* Scan lines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,0,0,0.006) 4px, rgba(255,0,0,0.006) 5px)",
        pointerEvents: "none", zIndex: 2,
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 22px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        zIndex: 3,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
            <path d="M6.5 1.5L1.5 6.5L6.5 11.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", color: "rgba(255,255,255,0.18)", letterSpacing: "2px" }}>KEMBALI</span>
        </button>
        <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 200, fontSize: "10px", letterSpacing: "4px", color: "rgba(255,255,255,0.18)" }}>ADEM</span>
      </div>

      <div style={{ padding: "22px 22px 0", flex: 1, display: "flex", flexDirection: "column", zIndex: 3 }}>
        {/* HARGA heading */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "7.5px", color: "rgba(139,0,0,0.45)", letterSpacing: "4px", marginBottom: "6px" }}>RINCIAN</div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 100, fontSize: "32px", letterSpacing: "9px", color: "rgba(255,255,255,0.82)" }}>HARGA</div>
        </div>

        {/* Contract timer */}
        <div style={{
          background: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(139,0,0,0.18)",
          borderRadius: "4px",
          padding: "12px 14px",
          marginBottom: "14px",
          boxShadow: "inset 0 0 18px rgba(0,0,0,0.65)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "9px" }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", color: "rgba(255,255,255,0.16)", letterSpacing: "2px" }}>
              SISA WAKTU KONTRAK
            </span>
            <span className={contractTime <= 3 ? "adem-flicker" : ""} style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "18px",
              color: contractTime <= 3 ? "rgba(200,0,0,0.9)" : "rgba(255,255,255,0.58)",
              letterSpacing: "3px",
              textShadow: contractTime <= 3 ? "0 0 18px rgba(200,0,0,0.45)" : "none",
            }}>
              00:{String(contractTime).padStart(2, "0")}
            </span>
          </div>
          <div style={{ height: "2px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{
              width: `${(contractTime / 13) * 100}%`,
              height: "100%",
              background: contractTime <= 3 ? "rgba(200,0,0,0.75)" : "rgba(139,0,0,0.45)",
              transition: "width 1s linear, background 0.3s ease",
            }} />
          </div>
        </div>

        {/* Transaction summary */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "5px",
          padding: "16px",
          marginBottom: "16px",
        }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "7.5px", color: "rgba(255,255,255,0.18)", letterSpacing: "2px", marginBottom: "8px" }}>ANDA AKAN MENGAMBIL</div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 200, fontSize: "26px", letterSpacing: "4px", color: "rgba(255,255,255,0.7)", marginBottom: "12px" }}>
            {years}{" "}
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)" }}>TAHUN</span>
          </div>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.04)", marginBottom: "12px" }} />
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", color: "rgba(255,255,255,0.2)", letterSpacing: "1px", lineHeight: 1.8 }}>
            DARI: {name.toUpperCase()}<br />
            SISA NAPAS BERKURANG: {years} TAHUN
          </div>
        </div>

        {/* Consequence */}
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "7.5px",
          color: "rgba(255,255,255,0.18)",
          letterSpacing: "1.5px",
          marginBottom: "12px",
        }}>
          SEBAGAI GANTI, ANDA AKAN KEHILANGAN:
        </div>

        <div style={{
          background: "rgba(120,0,0,0.1)",
          border: "1px solid rgba(139,0,0,0.22)",
          borderRadius: "4px",
          padding: "18px 16px",
          marginBottom: "14px",
          position: "relative",
          overflow: "hidden",
          minHeight: "72px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, rgba(120,0,0,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          {!revealed ? (
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "8px",
              color: "rgba(255,255,255,0.1)",
              letterSpacing: "2px",
            }}>sistem menentukan...</div>
          ) : (
            <>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "7.5px", color: "rgba(139,0,0,0.45)", letterSpacing: "3px", marginBottom: "8px" }}>HARGA</div>
              <div style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 200,
                fontSize: "30px",
                letterSpacing: "7px",
                color: "#CC0000",
                textShadow: "0 0 22px rgba(200,0,0,0.5), 0 0 50px rgba(139,0,0,0.2)",
                transform: glitchConsequence ? "translateX(-2px)" : "none",
                transition: glitchConsequence ? "none" : "transform 0.1s",
              }}>
                {typed}
                <span className="adem-cursor" style={{ display: "inline-block", width: "2px", height: "24px", background: "rgba(200,0,0,0.7)", marginLeft: "3px", verticalAlign: "middle" }} />
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", color: "rgba(255,255,255,0.15)", letterSpacing: "1px", marginTop: "8px" }}>
                kehilangan permanen · dalam 6–12 jam
              </div>
            </>
          )}
        </div>

        {/* Warning */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "20px" }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1L9.5 9H0.5L5 1Z" stroke="rgba(139,0,0,0.4)" strokeWidth="0.8" fill="none" />
            <line x1="5" y1="4.5" x2="5" y2="6.5" stroke="rgba(139,0,0,0.4)" strokeWidth="0.9" strokeLinecap="round" />
            <circle cx="5" cy="7.8" r="0.5" fill="rgba(139,0,0,0.4)" />
          </svg>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", color: "rgba(139,0,0,0.4)", letterSpacing: "1.5px" }}>
            harga tidak dapat diubah
          </span>
        </div>

        {/* SETUJUI button */}
        <button
          onClick={onAccept}
          disabled={!revealed}
          style={{
            width: "100%",
            padding: "15px",
            background: revealed ? "rgba(100,0,0,0.88)" : "rgba(40,40,40,0.5)",
            border: `1px solid ${revealed ? "rgba(139,0,0,0.3)" : "rgba(80,80,80,0.2)"}`,
            borderRadius: "3px",
            color: revealed ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "9.5px",
            letterSpacing: "5px",
            cursor: revealed ? "pointer" : "not-allowed",
            boxShadow: revealed ? "0 0 28px rgba(100,0,0,0.2)" : "none",
            transition: "all 0.4s ease",
          }}
        >
          SETUJUI
        </button>
      </div>

      <div style={{
        position: "absolute", bottom: "10px", right: "20px",
        fontFamily: "'Space Mono', monospace", fontSize: "7px",
        color: "rgba(139,0,0,0.18)", letterSpacing: "2px", zIndex: 3,
      }}>§03</div>
    </div>
  );
}
