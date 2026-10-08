import React, { useEffect, useState } from "react";

interface ProcessingScreenProps {
  onComplete: () => void;
  onHeartbeat: () => void;
}

const WHISPER_BG = [
  "suara", "ingatan", "napas", "jari", "waktu", "bayangan",
  "nama", "tubuh", "darah", "takut", "diam", "hilang",
  "mati", "kembali", "gelap", "lupa", "pergi", "terhapus",
];

export function ProcessingScreen({ onComplete, onHeartbeat }: ProcessingScreenProps) {
  const [dots, setDots] = useState(".");
  const [showWarning, setShowWarning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    onHeartbeat();

    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);

    const warnTimer = setTimeout(() => setShowWarning(true), 2800);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + (p < 70 ? 1.2 : 0.4);
      });
    }, 60);

    // Auto-complete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5500);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(warnTimer);
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Whisper background words */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "16px",
        opacity: 0.032,
        filter: "blur(0.6px)",
        transform: "rotate(-4deg) scale(1.18)",
        pointerEvents: "none",
      }}>
        {[...WHISPER_BG, ...WHISPER_BG, ...WHISPER_BG].map((w, i) => (
          <span key={i} style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: `${6 + (i % 5) * 1.5}px`,
            color: `rgba(${i % 3 === 0 ? "180,0,0" : "255,255,255"},1)`,
            letterSpacing: "2px",
            whiteSpace: "nowrap",
          }}>{w}</span>
        ))}
      </div>

      {/* Red ambient glow */}
      <div style={{
        position: "absolute",
        left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        width: "260px", height: "260px",
        background: "radial-gradient(circle, rgba(70,0,0,0.2) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Ritual rings */}
      <div style={{ position: "absolute", left: "50%", top: "50%", pointerEvents: "none" }}>
        <div className="adem-ring-3" style={{
          position: "absolute",
          width: "200px", height: "200px",
          borderRadius: "50%",
          border: "1px solid rgba(139,0,0,0.1)",
          top: "-100px", left: "-100px",
        }} />
        <div className="adem-ring-2" style={{
          position: "absolute",
          width: "140px", height: "140px",
          borderRadius: "50%",
          border: "1px solid rgba(139,0,0,0.18)",
          top: "-70px", left: "-70px",
        }} />
        <div className="adem-ring-1" style={{
          position: "absolute",
          width: "90px", height: "90px",
          borderRadius: "50%",
          border: "1px solid rgba(139,0,0,0.32)",
          top: "-45px", left: "-45px",
        }} />
        {/* Heartbeat center */}
        <div className="adem-pulse-dot" style={{
          position: "absolute",
          width: "12px", height: "12px",
          borderRadius: "50%",
          background: "rgba(139,0,0,0.8)",
          top: "-6px", left: "-6px",
          boxShadow: "0 0 24px rgba(139,0,0,0.6)",
        }} />
      </div>

      {/* Main text */}
      <div style={{ position: "relative", zIndex: 5, textAlign: "center" }}>
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 200,
          fontSize: "15px",
          letterSpacing: "5px",
          color: "rgba(255,255,255,0.82)",
          marginBottom: "4px",
        }}>PERMINTAAN</div>
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 100,
          fontSize: "15px",
          letterSpacing: "5px",
          color: "rgba(255,255,255,0.82)",
          marginBottom: "18px",
        }}>DITERIMA</div>

        <div style={{ width: "38px", height: "1px", background: "rgba(139,0,0,0.55)", margin: "0 auto 16px", boxShadow: "0 0 6px rgba(139,0,0,0.4)" }} />

        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "8.5px",
          letterSpacing: "3px",
          color: "rgba(255,255,255,0.22)",
          marginBottom: "28px",
        }}>HET IS AANVAARD</div>

        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "7.5px",
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.12)",
          marginBottom: "12px",
          minHeight: "14px",
        }}>proses berlangsung{dots}</div>

        {/* Progress bar */}
        <div style={{
          width: "110px",
          height: "1.5px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "1px",
          overflow: "hidden",
          margin: "0 auto",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "rgba(139,0,0,0.7)",
            borderRadius: "1px",
            transition: "width 0.06s linear",
          }} />
        </div>
      </div>

      {/* Warning */}
      {showWarning && (
        <div className="adem-fade-in" style={{
          position: "absolute",
          bottom: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          zIndex: 5,
        }}>
          <span className="adem-flicker" style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "7px",
            letterSpacing: "2px",
            color: "rgba(139,0,0,0.5)",
          }}>JANGAN MENARIK KEMBALI</span>
        </div>
      )}

      {/* Scan lines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,0,0,0.008) 4px, rgba(255,0,0,0.008) 5px)",
        pointerEvents: "none", zIndex: 3,
      }} />

      <div style={{
        position: "absolute", bottom: "10px", right: "20px",
        fontFamily: "'Space Mono', monospace", fontSize: "7px",
        color: "rgba(139,0,0,0.18)", letterSpacing: "2px", zIndex: 5,
      }}>§04</div>
    </div>
  );
}
