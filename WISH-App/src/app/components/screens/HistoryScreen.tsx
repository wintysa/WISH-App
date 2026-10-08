import React, { useEffect, useState } from "react";

export interface Transaction {
  id: string;
  name: string;
  years: number;
  price: string;
  date: string;
  timestamp: number;
}

interface HistoryScreenProps {
  transactions: Transaction[];
  onBack: () => void;
  useCount: number;
}

export function HistoryScreen({ transactions, onBack, useCount }: HistoryScreenProps) {
  const [glitchRow, setGlitchRow] = useState<number | null>(null);
  const [showPhantom, setShowPhantom] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const row = Math.floor(Math.random() * (transactions.length + 1));
      setGlitchRow(row);
      setTimeout(() => setGlitchRow(null), 160);
    }, 2800);

    if (useCount >= 2) {
      const phantomTimer = setTimeout(() => setShowPhantom(true), 3500);
      return () => {
        clearInterval(glitchInterval);
        clearTimeout(phantomTimer);
      };
    }

    return () => clearInterval(glitchInterval);
  }, [transactions.length, useCount]);

  const allEntries = [
    ...transactions,
    ...(showPhantom
      ? [{ id: "phantom", name: "???", years: 0, price: "???", date: "??/??/????", timestamp: 0 }]
      : []),
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#020202",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scan lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,0,0,0.006) 4px, rgba(255,0,0,0.006) 5px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: "18px 22px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "7px",
                color: "rgba(139,0,0,0.45)",
                letterSpacing: "3px",
                marginBottom: "4px",
              }}
            >
              TERSEMBUNYI · §05
            </div>
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 100,
                fontSize: "24px",
                letterSpacing: "7px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              CATATAN
            </div>
          </div>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "3px",
              padding: "8px 14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              touchAction: "manipulation" as const,
            }}
          >
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
              <path
                d="M6.5 1.5L1.5 6.5L6.5 11.5"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "7px",
                color: "rgba(255,255,255,0.22)",
                letterSpacing: "2px",
              }}
            >
              KEMBALI
            </span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
          <div
            className="adem-pulse-dot"
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "rgba(139,0,0,0.6)",
            }}
          />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "7px",
              color: "rgba(255,255,255,0.15)",
              letterSpacing: "1.5px",
            }}
          >
            {transactions.length} TRANSAKSI TERCATAT
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 72px 90px",
          padding: "8px 22px",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        {["NAMA", "DIAMBIL", "HARGA"].map((h) => (
          <span
            key={h}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "6.5px",
              color: "rgba(255,255,255,0.14)",
              letterSpacing: "2px",
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Transaction list — scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: "auto" as const,
          zIndex: 2,
        }}
      >
        {allEntries.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "80px",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "8px",
                color: "rgba(255,255,255,0.1)",
                letterSpacing: "2px",
              }}
            >
              BELUM ADA CATATAN
            </div>
            <div
              className="adem-flicker"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "7px",
                color: "rgba(139,0,0,0.2)",
                letterSpacing: "1.5px",
              }}
            >
              setiap nama akan tercatat.
            </div>
          </div>
        )}

        {allEntries.map((tx, index) => {
          const isPhantom = tx.id === "phantom";
          const isGlitching = glitchRow === index;

          return (
            <div
              key={tx.id}
              style={{
                padding: "13px 22px",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                borderLeft: isPhantom
                  ? "2px solid rgba(139,0,0,0.55)"
                  : "2px solid rgba(139,0,0,0.14)",
                background: isPhantom
                  ? "rgba(139,0,0,0.07)"
                  : isGlitching
                  ? "rgba(139,0,0,0.04)"
                  : "transparent",
                transform: isGlitching ? "translateX(2px)" : "none",
                transition: isGlitching ? "none" : "transform 0.1s",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 72px 90px",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <span
                  className={isPhantom ? "adem-flicker" : ""}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "10px",
                    color: isPhantom ? "rgba(180,0,0,0.65)" : "rgba(255,255,255,0.58)",
                    letterSpacing: "0.5px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tx.name}
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "8px",
                    color: isPhantom ? "rgba(139,0,0,0.4)" : "rgba(255,255,255,0.32)",
                  }}
                >
                  {isPhantom ? "? thn" : `${tx.years} thn`}
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "7.5px",
                    color: isPhantom ? "rgba(200,0,0,0.55)" : "rgba(180,0,0,0.7)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tx.price.toLowerCase()}
                </span>
              </div>

              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "6px",
                  color: isPhantom ? "rgba(139,0,0,0.28)" : "rgba(255,255,255,0.1)",
                  letterSpacing: "1.5px",
                }}
              >
                {isPhantom ? "▓ DATA TIDAK DAPAT DIBACA ▓" : tx.date}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "10px 22px",
          borderTop: "1px solid rgba(255,255,255,0.03)",
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        <span
          className="adem-flicker"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "6.5px",
            color: "rgba(255,255,255,0.08)",
            letterSpacing: "1.5px",
          }}
        >
          catatan tidak dapat dihapus · semua nama tetap tercatat
        </span>
      </div>
    </div>
  );
}
