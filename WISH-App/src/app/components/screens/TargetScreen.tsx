import React, { useState, useEffect } from "react";

interface TargetScreenProps {
  name: string;
  years: number;
  onYearsChange: (y: number) => void;
  onConfirm: () => void;
  onBack: () => void;
  onClick: () => void;
  txCount: number;
}

function getSisaNapas(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0x7fffffff;
  }
  return 28 + (Math.abs(hash) % 52);
}

function getTanggalLahir(name: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  let h = 0;
  for (const c of name) h = (h * 17 + c.charCodeAt(0)) & 0xffffff;
  const day = 1 + (Math.abs(h) % 27);
  const month = months[Math.abs(h >> 4) % 12];
  const year = 1958 + (Math.abs(h >> 8) % 45);
  return `${day} ${month} ${year}`;
}

export function TargetScreen({ name, years, onYearsChange, onConfirm, onBack, onClick, txCount }: TargetScreenProps) {
  const sisaNapas = getSisaNapas(name);
  const tanggalLahir = getTanggalLahir(name);
  const [lifeShift, setLifeShift] = useState(false);

  // Occasional "life counter flicker" — number shifts briefly
  useEffect(() => {
    const interval = setInterval(() => {
      setLifeShift(true);
      setTimeout(() => setLifeShift(false), 150);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const displayLife = lifeShift
    ? `${sisaNapas + (Math.random() > 0.5 ? 1 : -1)} TAHUN`
    : `${sisaNapas} TAHUN`;

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#020202",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Scan lines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,0,0,0.006) 4px, rgba(255,0,0,0.006) 5px)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 22px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        zIndex: 2,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
            <path d="M6.5 1.5L1.5 6.5L6.5 11.5" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", color: "rgba(255,255,255,0.2)", letterSpacing: "2px" }}>KEMBALI</span>
        </button>
        <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 200, fontSize: "10px", letterSpacing: "4px", color: "rgba(255,255,255,0.2)" }}>ADEM</span>
      </div>

      <div style={{ padding: "22px 22px 0", flex: 1, display: "flex", flexDirection: "column", zIndex: 2 }}>
        {/* Profile */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "22px" }}>
          <div style={{
            width: "76px", height: "76px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "14px",
            position: "relative",
            overflow: "hidden",
          }}>
            <svg viewBox="0 0 60 60" width="54" height="54" fill="none">
              <ellipse cx="30" cy="18" rx="11" ry="13" fill="rgba(255,255,255,0.055)" />
              <path d="M10 55 Q14 35 30 32 Q46 35 50 55" fill="rgba(255,255,255,0.055)" />
            </svg>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              boxShadow: "inset 0 -10px 22px rgba(100,0,0,0.14)",
            }} />
          </div>

          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 200,
            fontSize: "24px",
            letterSpacing: "5px",
            color: "rgba(255,255,255,0.8)",
            textTransform: "uppercase" as const,
            marginBottom: "6px",
          }}>
            {name || "—"}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div className="adem-pulse-dot" style={{
              width: "4px", height: "4px",
              borderRadius: "50%",
              background: "rgba(139,0,0,0.7)",
            }} />
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "7px",
              color: "rgba(139,0,0,0.45)",
              letterSpacing: "2px",
            }}>TERDETEKSI</span>
          </div>
        </div>

        {/* Info rows */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "5px",
          marginBottom: "20px",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7.5px", color: "rgba(255,255,255,0.22)", letterSpacing: "1.5px" }}>TANGGAL LAHIR</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", color: "rgba(255,255,255,0.45)", letterSpacing: "1px" }}>{tanggalLahir}</span>
          </div>
          <div style={{
            padding: "12px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(139,0,0,0.05)",
          }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7.5px", color: "rgba(255,255,255,0.22)", letterSpacing: "1.5px" }}>SISA NAPAS</span>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: lifeShift ? "rgba(200,0,0,0.5)" : "#CC0000",
              letterSpacing: "2px",
              textShadow: "0 0 12px rgba(200,0,0,0.35)",
              transition: "color 0.1s",
            }}>{displayLife}</span>
          </div>
        </div>

        {/* Slider */}
        <div style={{ marginBottom: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7.5px", color: "rgba(255,255,255,0.18)", letterSpacing: "1.5px" }}>AMBIL</span>
            <span style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 200,
              fontSize: "22px",
              letterSpacing: "3px",
              color: "#CC0000",
              textShadow: "0 0 14px rgba(200,0,0,0.4)",
            }}>
              {years} <span style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.25)" }}>TAHUN</span>
            </span>
          </div>

          <div style={{ position: "relative", height: "22px", display: "flex", alignItems: "center" }}>
            <div style={{
              position: "absolute", left: 0, right: 0,
              height: "1.5px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "1px",
            }} />
            <div style={{
              position: "absolute", left: 0,
              width: `${((years - 1) / 19) * 100}%`,
              height: "1.5px",
              background: "linear-gradient(90deg, rgba(100,0,0,0.5), rgba(200,0,0,0.85))",
              borderRadius: "1px",
              boxShadow: "0 0 6px rgba(139,0,0,0.4)",
            }} />
            <input
              type="range"
              min={1} max={20}
              value={years}
              onChange={(e) => { onYearsChange(Number(e.target.value)); onClick(); }}
              style={{
                position: "absolute", left: 0, right: 0, width: "100%",
                opacity: 0, cursor: "pointer", height: "22px",
              }}
            />
            <div style={{
              position: "absolute",
              left: `calc(${((years - 1) / 19) * 100}% - 7px)`,
              width: "14px", height: "14px",
              borderRadius: "50%",
              background: "#8B0000",
              border: "2px solid rgba(200,0,0,0.7)",
              boxShadow: "0 0 12px rgba(139,0,0,0.65)",
              pointerEvents: "none",
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            {[1, 5, 10, 15, 20].map((v) => (
              <span key={v} style={{ fontFamily: "'Space Mono', monospace", fontSize: "6.5px", color: "rgba(255,255,255,0.12)" }}>{v}</span>
            ))}
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={onConfirm}
          style={{
            width: "100%",
            padding: "15px",
            background: "rgba(110,0,0,0.85)",
            border: "none",
            borderRadius: "3px",
            color: "rgba(255,255,255,0.88)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "9.5px",
            letterSpacing: "5px",
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(100,0,0,0.16)",
          }}
        >
          KONFIRMASI
        </button>

        {txCount >= 3 && (
          <div className="adem-flicker" style={{
            textAlign: "center",
            marginTop: "12px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "7px",
            color: "rgba(139,0,0,0.3)",
            letterSpacing: "1px",
          }}>
            harga berikutnya akan lebih besar
          </div>
        )}
      </div>

      <div style={{
        position: "absolute", bottom: "10px", right: "20px",
        fontFamily: "'Space Mono', monospace", fontSize: "7px",
        color: "rgba(139,0,0,0.18)", letterSpacing: "2px", zIndex: 2,
      }}>§02</div>
    </div>
  );
}
