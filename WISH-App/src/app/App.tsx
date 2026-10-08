import React, { useState, useEffect, useRef, useCallback } from "react";
import { SplashScreen } from "./components/screens/SplashScreen";
import { InputScreen } from "./components/screens/InputScreen";
import { TargetScreen } from "./components/screens/TargetScreen";
import { PriceScreen } from "./components/screens/PriceScreen";
import { ProcessingScreen } from "./components/screens/ProcessingScreen";
import { DoneScreen } from "./components/screens/DoneScreen";
import { HistoryScreen } from "./components/screens/HistoryScreen";
import type { Transaction } from "./components/screens/HistoryScreen";
import { useHorrorAudio } from "./hooks/useHorrorAudio";

/* ─────────────────────────────────────────────
   CONSEQUENCE / PRICE GENERATION
───────────────────────────────────────────── */
const PRICES_T1 = ["SUARA", "RASA NYERI", "KUKU KANAN", "BAYANG-BAYANG", "BAU HUJAN"];
const PRICES_T2 = ["INGATAN MASA KECIL", "WARNA FAVORIT", "MIMPI SEMALAM", "SUARA IBU", "TAWA ANAK"];
const PRICES_T3 = ["WAJAH SESEORANG", "NAMAMU SENDIRI", "NAPAS PERTAMA", "SEMUA YANG TERSISA", "DIRIMU SENDIRI"];

function generateConsequence(name: string, useCount: number): string {
  const seed =
    name.split("").reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0) +
    useCount * 13;
  if (useCount < 3) return PRICES_T1[seed % PRICES_T1.length];
  if (useCount < 6) return PRICES_T2[seed % PRICES_T2.length];
  return PRICES_T3[seed % PRICES_T3.length];
}

function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem("adem_transactions");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTransactions(txs: Transaction[]) {
  try {
    localStorage.setItem("adem_transactions", JSON.stringify(txs));
  } catch {}
}

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const HORROR_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100%; height: 100%;
    overflow: hidden; background: #000;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .adem-app * {
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .adem-app input {
    user-select: text;
    -webkit-user-select: text;
  }

  @keyframes adem-breathe-kf {
    0%, 100% { transform: translateX(-50%) scaleY(1);    opacity: 0.06; }
    50%       { transform: translateX(-50%) scaleY(1.04); opacity: 0.13; }
  }
  .adem-breathe {
    animation: adem-breathe-kf 4.8s ease-in-out infinite;
    transform-origin: bottom center;
  }

  @keyframes adem-flicker-kf {
    0%, 88%, 90%, 92%, 100% { opacity: 1; }
    89%  { opacity: 0.2; }
    91%  { opacity: 0.7; }
  }
  .adem-flicker { animation: adem-flicker-kf 7s ease-in-out infinite; }

  @keyframes adem-pulse-text-kf {
    0%, 100% { opacity: 0.12; }
    50%       { opacity: 0.22; }
  }
  .adem-pulse-text { animation: adem-pulse-text-kf 3s ease-in-out infinite; }

  @keyframes adem-pulse-dot-kf {
    0%, 100% { transform: scale(1);   opacity: 0.65; box-shadow: 0 0 6px rgba(139,0,0,0.4); }
    50%       { transform: scale(1.5); opacity: 1;    box-shadow: 0 0 16px rgba(139,0,0,0.8); }
  }
  .adem-pulse-dot { animation: adem-pulse-dot-kf 2.2s ease-in-out infinite; }

  @keyframes adem-ring-1-kf {
    0%, 100% { transform: scale(0.92); opacity: 0.70; }
    50%       { transform: scale(1.06); opacity: 0.28; }
  }
  .adem-ring-1 { animation: adem-ring-1-kf 2.6s ease-in-out infinite; }

  @keyframes adem-ring-2-kf {
    0%, 100% { transform: scale(0.95); opacity: 0.50; }
    50%       { transform: scale(1.04); opacity: 0.18; }
  }
  .adem-ring-2 { animation: adem-ring-2-kf 3.4s ease-in-out infinite; }

  @keyframes adem-ring-3-kf {
    0%, 100% { transform: scale(0.97); opacity: 0.32; }
    50%       { transform: scale(1.03); opacity: 0.10; }
  }
  .adem-ring-3 { animation: adem-ring-3-kf 4.8s ease-in-out infinite; }

  @keyframes adem-cursor-kf {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  .adem-cursor { animation: adem-cursor-kf 1s step-end infinite; }

  @keyframes adem-fade-in-kf {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .adem-fade-in { animation: adem-fade-in-kf 1s ease-out forwards; }

  @keyframes adem-flash-kf {
    0%   { opacity: 0; }
    15%  { opacity: 1; }
    85%  { opacity: 1; }
    100% { opacity: 0; }
  }
  .adem-flash {
    animation: adem-flash-kf 0.5s ease-in-out forwards;
    pointer-events: none;
  }

  @keyframes adem-notif-kf {
    0%   { transform: translateY(-100%); opacity: 0; }
    12%  { transform: translateY(0);     opacity: 1; }
    80%  { transform: translateY(0);     opacity: 1; }
    100% { transform: translateY(-100%); opacity: 0; }
  }
  .adem-notif { animation: adem-notif-kf 3s ease-in-out forwards; }

  @keyframes adem-grain-kf {
    0%, 100% { transform: translate(0,0); }
    10%  { transform: translate(-0.5%,-1%); }
    20%  { transform: translate(1%,0.5%); }
    30%  { transform: translate(-1%,1.5%); }
    40%  { transform: translate(1.5%,-0.5%); }
    50%  { transform: translate(-0.5%,1%); }
    60%  { transform: translate(1%,-1.5%); }
    70%  { transform: translate(-1.5%,0.5%); }
    80%  { transform: translate(0.5%,1.5%); }
    90%  { transform: translate(-1%,-0.5%); }
  }
  .adem-grain { animation: adem-grain-kf 0.35s steps(1) infinite; }

  @keyframes adem-screen-glitch-kf {
    0%, 100% { opacity: 0; }
    50% { opacity: 0.07; }
  }
  .adem-screen-glitch {
    animation: adem-screen-glitch-kf 0.08s steps(1) 3 forwards;
  }

  input::placeholder {
    color: rgba(255,255,255,0.18);
    font-family: 'Space Mono', monospace;
    letter-spacing: 1px;
  }

  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(139,0,0,0.3); border-radius: 1px; }

  button {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }
  button:active { opacity: 0.8; }
`;

/* ─────────────────────────────────────────────
   HORROR NOTIFICATION OVERLAY
───────────────────────────────────────────── */
function HorrorNotification({ text }: { text: string }) {
  return (
    <div
      className="adem-notif"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        padding: "14px 20px",
        background: "rgba(0,0,0,0.97)",
        borderBottom: "1px solid rgba(139,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div
        className="adem-pulse-dot"
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "rgba(139,0,0,0.8)",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "8px",
          color: "rgba(200,0,0,0.7)",
          letterSpacing: "3px",
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCREEN TRANSITION FLASH
───────────────────────────────────────────── */
function TransitionFlash() {
  return (
    <div
      className="adem-flash"
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 8000,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   MAIN APP — Full-screen Horror App
───────────────────────────────────────────── */
type AppScreen =
  | "splash"
  | "input"
  | "target"
  | "price"
  | "processing"
  | "done"
  | "history";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("splash");
  const [prevScreen, setPrevScreen] = useState<AppScreen>("splash");
  const [transitioning, setTransitioning] = useState(false);

  // Core app state
  const [targetName, setTargetName] = useState("");
  const [yearsToTake, setYearsToTake] = useState(5);
  const [consequence, setConsequence] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);
  const [useCount, setUseCount] = useState(() =>
    parseInt(localStorage.getItem("adem_count") || "0")
  );

  // Horror state
  const [horrorNotif, setHorrorNotif] = useState<string | null>(null);
  const [screenGlitch, setScreenGlitch] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);
  const swipeResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notifScheduledRef = useRef(false);

  const { playClick, playAccept, playGlitch, playHeartbeat, playTransition, playBreath } =
    useHorrorAudio();

  /* ── Navigate with black-flash transition ── */
  const navigate = useCallback(
    (to: AppScreen, delay = 380) => {
      setTransitioning(true);
      playTransition();
      setTimeout(() => {
        setPrevScreen(screen);
        setScreen(to);
        setTimeout(() => setTransitioning(false), 80);
      }, delay);
    },
    [screen, playTransition]
  );

  /* ── Random horror notifications after first transaction ── */
  useEffect(() => {
    if (transactions.length === 0 || notifScheduledRef.current) return;
    notifScheduledRef.current = true;

    let timer: ReturnType<typeof setTimeout>;

    const scheduleNotif = () => {
      const delay = 28000 + Math.random() * 45000;
      timer = setTimeout(() => {
        const notifs = [
          "PERMINTAAN DITERIMA",
          "NAMA BARU TERCATAT",
          "PROSES BERLANGSUNG...",
          "SISTEM AKTIF",
          "HET IS AANVAARD",
        ];
        const text = notifs[Math.floor(Math.random() * notifs.length)];
        setHorrorNotif(text);
        setTimeout(() => {
          setHorrorNotif(null);
          scheduleNotif();
        }, 3200);
      }, delay);
    };

    scheduleNotif();
    return () => clearTimeout(timer);
  }, [transactions.length]);

  /* ── Occasional full-screen red glitch ── */
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleGlitch = () => {
      const delay = 14000 + Math.random() * 12000;
      timeout = setTimeout(() => {
        setScreenGlitch(true);
        setTimeout(() => {
          setScreenGlitch(false);
          scheduleGlitch();
        }, 130);
      }, delay);
    };
    scheduleGlitch();
    return () => clearTimeout(timeout);
  }, []);

  /* ────────────────── Screen Handlers ────────────────── */

  const handleSplashContinue = () => {
    playClick();
    navigate("input");
  };

  const handleInputContinue = () => {
    if (!targetName.trim()) {
      playGlitch();
      return;
    }
    const c = generateConsequence(targetName, useCount);
    setConsequence(c);
    playClick();
    navigate("target");
  };

  const handleTargetConfirm = () => {
    playClick();
    navigate("price");
  };

  const handlePriceAccept = () => {
    playAccept();
    navigate("processing", 600);
  };

  const handleProcessingComplete = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const newTx: Transaction = {
      id: Date.now().toString(),
      name: targetName,
      years: yearsToTake,
      price: consequence,
      date: dateStr,
      timestamp: Date.now(),
    };
    const newTxs = [newTx, ...transactions];
    const newCount = useCount + 1;
    setTransactions(newTxs);
    setUseCount(newCount);
    saveTransactions(newTxs);
    localStorage.setItem("adem_count", String(newCount));
    navigate("done", 200);
  };

  /* ── Splash: swipe right 3× to reveal hidden history ── */
  const handleSplashTouchStart = (e: React.TouchEvent) => {
    setSwipeStartX(e.touches[0].clientX);
  };

  const handleSplashTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - swipeStartX;
    if (deltaX > 65) {
      const next = swipeCount + 1;
      setSwipeCount(next);
      if (next >= 3) {
        setSwipeCount(0);
        playGlitch();
        navigate("history");
      } else {
        if (swipeResetRef.current) clearTimeout(swipeResetRef.current);
        swipeResetRef.current = setTimeout(() => setSwipeCount(0), 1800);
      }
    }
  };

  /* ─────────── RENDER ─────────── */

  const screenStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
  };

  return (
    <div
      className="adem-app"
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        overflow: "hidden",
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <style>{HORROR_CSS}</style>

      {/* ── Film grain overlay ── */}
      <div
        className="adem-grain"
        style={{
          position: "fixed",
          inset: "-15%",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0.5,
        }}
      />

      {/* ── Red screen glitch ── */}
      {screenGlitch && (
        <div
          className="adem-screen-glitch"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(100,0,0,1)",
            zIndex: 9998,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Black transition flash ── */}
      {transitioning && <TransitionFlash />}

      {/* ── Horror notification pop-up ── */}
      {horrorNotif && <HorrorNotification text={horrorNotif} />}

      {/* ══════════════ SCREENS ══════════════ */}

      {screen === "splash" && (
        <div
          style={screenStyle}
          onTouchStart={handleSplashTouchStart}
          onTouchEnd={handleSplashTouchEnd}
        >
          <SplashScreen onContinue={handleSplashContinue} onBreath={playBreath} />
        </div>
      )}

      {screen === "input" && (
        <div style={screenStyle}>
          <InputScreen
            name={targetName}
            onNameChange={setTargetName}
            onContinue={handleInputContinue}
            onGlitch={playGlitch}
          />
        </div>
      )}

      {screen === "target" && (
        <div style={screenStyle}>
          <TargetScreen
            name={targetName}
            years={yearsToTake}
            onYearsChange={setYearsToTake}
            onConfirm={handleTargetConfirm}
            onBack={() => {
              playClick();
              navigate("input");
            }}
            onClick={playClick}
            txCount={useCount}
          />
        </div>
      )}

      {screen === "price" && (
        <div style={screenStyle}>
          <PriceScreen
            name={targetName}
            years={yearsToTake}
            consequence={consequence}
            onAccept={handlePriceAccept}
            onBack={() => {
              playClick();
              navigate("target");
            }}
          />
        </div>
      )}

      {screen === "processing" && (
        <div style={screenStyle}>
          <ProcessingScreen onComplete={handleProcessingComplete} onHeartbeat={playHeartbeat} />
        </div>
      )}

      {screen === "done" && (
        <div style={screenStyle}>
          <DoneScreen
            name={targetName}
            years={yearsToTake}
            price={consequence}
            useCount={useCount}
            onHistory={() => {
              playClick();
              navigate("history");
            }}
          />
        </div>
      )}

      {screen === "history" && (
        <div style={{ ...screenStyle, overflowY: "auto" }}>
          <HistoryScreen
            transactions={transactions}
            onBack={() => {
              playClick();
              navigate(prevScreen === "done" ? "done" : "splash");
            }}
            useCount={useCount}
          />
        </div>
      )}
    </div>
  );
}
