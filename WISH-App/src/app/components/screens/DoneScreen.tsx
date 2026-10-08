import React, { useEffect, useState } from "react";

interface DoneScreenProps {
  name: string;
  years: number;
  price: string;
  useCount: number;
  onHistory: () => void;
}

export function DoneScreen({
  name,
  years,
  price,
  useCount,
  onHistory,
}: DoneScreenProps) {
  const [visible, setVisible] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [showDark, setShowDark] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 400);
    const t2 = setTimeout(() => setShowExtra(true), 2200);
    // High use count = extra dark message
    if (useCount >= 5) {
      const t3 = setTimeout(() => setShowDark(true), 4000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [useCount]);

  return (
    <div
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
      }}
    >
      {/* Background red glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(80,0,0,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Scan lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,0,0,0.007) 4px, rgba(255,0,0,0.007) 5px)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          textAlign: "center",
          padding: "0 32px",
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0)"
            : "translateY(10px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {/* Check mark — ritual complete */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "1px solid rgba(139,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 0 20px rgba(139,0,0,0.15)",
          }}
        >
          <svg
            width="18"
            height="13"
            viewBox="0 0 18 13"
            fill="none"
          >
            <path
              d="M1 6L6.5 11.5L17 1"
              stroke="rgba(180,0,0,0.7)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "7.5px",
            color: "rgba(139,0,0,0.45)",
            letterSpacing: "4px",
            marginBottom: "8px",
          }}
        >
          RITUAL SELESAI
        </div>
        <div
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 100,
            fontSize: "28px",
            letterSpacing: "7px",
            color: "rgba(255,255,255,0.82)",
            marginBottom: "6px",
          }}
        >
          SELESAI
        </div>

        {/* Divider */}
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "rgba(139,0,0,0.45)",
            margin: "18px auto",
            boxShadow: "0 0 6px rgba(139,0,0,0.3)",
          }}
        />

        {/* Summary */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "4px",
            padding: "16px",
            marginBottom: "28px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "7px",
              color: "rgba(255,255,255,0.15)",
              letterSpacing: "2px",
              marginBottom: "12px",
            }}
          >
            RINGKASAN TRANSAKSI
          </div>
          {[
            { label: "TARGET", value: name.toUpperCase() },
            { label: "DIAMBIL", value: `${years} TAHUN` },
            { label: "HARGA DIBAYAR", value: price, red: true },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "7px",
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "1.5px",
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "8.5px",
                  color: row.red
                    ? "rgba(180,0,0,0.8)"
                    : "rgba(255,255,255,0.5)",
                  letterSpacing: "1px",
                  textShadow: row.red
                    ? "0 0 10px rgba(180,0,0,0.3)"
                    : "none",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Extra horror text */}
        {showExtra && (
          <div
            className="adem-fade-in"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "7.5px",
              color: "rgba(255,255,255,0.1)",
              letterSpacing: "1.5px",
              marginBottom: "28px",
            }}
          >
            sesuatu telah berubah.
          </div>
        )}

        {/* Dark warning for high use count */}
        {showDark && (
          <div
            className="adem-flicker"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "7px",
              color: "rgba(139,0,0,0.35)",
              letterSpacing: "1.5px",
              marginBottom: "20px",
            }}
          >
            harga berikutnya akan lebih besar.
          </div>
        )}

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
          }}
        >
          <button
            onClick={onHistory}
            style={{
              width: "100%",
              padding: "13px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "3px",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              letterSpacing: "5px",
              cursor: "pointer",
              touchAction: "manipulation",
            }}
          >
            CATATAN
          </button>
        </div>
      </div>

      {/* Section marker */}
      <div
        style={{
          position: "absolute",
          bottom: "14px",
          right: "22px",
          fontFamily: "'Space Mono', monospace",
          fontSize: "7px",
          color: "rgba(139,0,0,0.18)",
          letterSpacing: "2px",
          zIndex: 5,
        }}
      >
        §05
      </div>
    </div>
  );
}