import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  midnight: {
    name: "Midnight",
    icon: "🌑",
    type: "dark",
    bg: "linear-gradient(135deg,#020408 0%,#070d1a 50%,#020408 100%)",
    surface: "rgba(255,255,255,0.04)",
    border: "rgba(255,215,0,0.15)",
    text: "#ffffff",
    textMuted: "rgba(255,255,255,0.4)",
    textDim: "rgba(255,255,255,0.12)",
    accent: "#ffd700",
    accentGlow: "rgba(255,215,0,0.3)",
    cardBg: "rgba(8,12,28,0.82)",
    glassCard: "rgba(8,12,28,0.55)",
    particle: ["#ffd700", "#4d9fff", "#00d4aa", "#ff6b9d"],
  },
  cybergrid: {
    name: "Cyber",
    icon: "🟢",
    type: "dark",
    bg: "linear-gradient(135deg,#000a00 0%,#001800 50%,#000a00 100%)",
    surface: "rgba(0,255,65,0.04)",
    border: "rgba(0,255,65,0.15)",
    text: "#e0ffe8",
    textMuted: "rgba(0,255,65,0.5)",
    textDim: "rgba(0,255,65,0.1)",
    accent: "#00ff41",
    accentGlow: "rgba(0,255,65,0.25)",
    cardBg: "rgba(0,12,0,0.82)",
    glassCard: "rgba(0,12,0,0.55)",
    particle: ["#00ff41", "#00cc33", "#39ff14", "#7fff00"],
  },
  bloomberg: {
    name: "Bloomberg",
    icon: "☀️",
    type: "light",
    bg: "linear-gradient(135deg,#eef2fa 0%,#e4eaf6 50%,#eef2fa 100%)",
    surface: "rgba(0,0,0,0.04)",
    border: "rgba(30,80,200,0.15)",
    text: "#0a1628",
    textMuted: "rgba(10,22,40,0.5)",
    textDim: "rgba(10,22,40,0.12)",
    accent: "#1e50c8",
    accentGlow: "rgba(30,80,200,0.2)",
    cardBg: "rgba(255,255,255,0.88)",
    glassCard: "rgba(255,255,255,0.55)",
    particle: ["#1e50c8", "#e63946", "#2a9d8f", "#e9c46a"],
  },
  rosegold: {
    name: "Rose Gold",
    icon: "🌸",
    type: "light",
    bg: "linear-gradient(135deg,#fdf6f0 0%,#faeae0 50%,#fdf6f0 100%)",
    surface: "rgba(0,0,0,0.03)",
    border: "rgba(180,90,60,0.15)",
    text: "#2d1810",
    textMuted: "rgba(45,24,16,0.5)",
    textDim: "rgba(45,24,16,0.1)",
    accent: "#b45a3c",
    accentGlow: "rgba(180,90,60,0.2)",
    cardBg: "rgba(255,248,242,0.88)",
    glassCard: "rgba(255,248,242,0.55)",
    particle: ["#b45a3c", "#d4845a", "#e8b4a0", "#c87941"],
  },
  steelgray: {
    name: "Steel",
    icon: "🩶",
    type: "light",
    bg: "linear-gradient(135deg,#c8cdd6 0%,#b8bfc9 40%,#c4c9d2 100%)",
    surface: "rgba(0,0,0,0.05)",
    border: "rgba(80,100,130,0.2)",
    text: "#1a2030",
    textMuted: "rgba(30,45,70,0.55)",
    textDim: "rgba(30,45,70,0.15)",
    accent: "#4a6fa5",
    accentGlow: "rgba(74,111,165,0.25)",
    cardBg: "rgba(220,225,235,0.88)",
    glassCard: "rgba(210,218,230,0.55)",
    particle: ["#4a6fa5", "#6b8aad", "#7a9bc0", "#5c7fa0"],
  },
  obsidian: {
    name: "Obsidian",
    icon: "🌫️",
    type: "dark",
    bg: "linear-gradient(135deg,#111318 0%,#1a1d24 50%,#111318 100%)",
    surface: "rgba(255,255,255,0.03)",
    border: "rgba(200,200,220,0.1)",
    text: "#e8eaf0",
    textMuted: "rgba(200,205,220,0.45)",
    textDim: "rgba(200,205,220,0.1)",
    accent: "#a0b0d0",
    accentGlow: "rgba(160,176,208,0.2)",
    cardBg: "rgba(18,21,28,0.85)",
    glassCard: "rgba(18,21,28,0.55)",
    particle: ["#a0b0d0", "#8090b8", "#b0c0e0", "#7080a8"],
  },
};

// ─── SESSIONS ─────────────────────────────────────────────────────────────────
const SESSIONS_DEFAULT = [
  {
    id: "sydney",
    name: "سیدنی",
    nameEn: "SYDNEY",
    flag: "🇦🇺",
    startUTC: 21,
    endUTC: 6,
    color: "#00d4aa",
    glow: "rgba(0,212,170,0.35)",
    rankLabel: "ضعیف",
    rankStars: "★☆☆☆☆",
    pairs: ["AUD/USD", "AUD/JPY", "NZD/USD", "AUD/NZD"],
    desc: "نقدینگی پایین — مناسب رنج",
  },
  {
    id: "tokyo",
    name: "توکیو",
    nameEn: "TOKYO",
    flag: "🇯🇵",
    startUTC: 0,
    endUTC: 9,
    color: "#ff6b9d",
    glow: "rgba(255,107,157,0.35)",
    rankLabel: "متوسط",
    rankStars: "★★☆☆☆",
    pairs: ["USD/JPY", "EUR/JPY", "GBP/JPY", "AUD/JPY"],
    desc: "JPY پر نوسان — جفت‌های ین فعال",
  },
  {
    id: "london",
    name: "لندن",
    nameEn: "LONDON",
    flag: "🇬🇧",
    startUTC: 8,
    endUTC: 17,
    color: "#4d9fff",
    glow: "rgba(77,159,255,0.35)",
    rankLabel: "بسیار قوی",
    rankStars: "★★★★★",
    pairs: ["EUR/USD", "GBP/USD", "EUR/GBP", "GBP/JPY"],
    desc: "بزرگترین سشن — بالاترین نقدینگی",
  },
  {
    id: "newyork",
    name: "نیویورک",
    nameEn: "NEW YORK",
    flag: "🇺🇸",
    startUTC: 13,
    endUTC: 22,
    color: "#ffd700",
    glow: "rgba(255,215,0,0.35)",
    rankLabel: "قوی",
    rankStars: "★★★★☆",
    pairs: ["EUR/USD", "USD/CAD", "USD/JPY", "GBP/USD"],
    desc: "اخبار USD — اورلپ با لندن انفجاری",
  },
];

const NEWS_EVENTS = [
  {
    id: 1,
    time: "15:30",
    label: "NFP — Non-Farm Payrolls",
    impact: "high",
    days: [5],
    pairs: "EUR/USD, GBP/USD, USD/JPY",
  },
  {
    id: 2,
    time: "15:30",
    label: "CPI — Consumer Price Index",
    impact: "high",
    days: [2, 4],
    pairs: "EUR/USD, USD/CAD, Gold",
  },
  {
    id: 3,
    time: "21:00",
    label: "FOMC Statement",
    impact: "high",
    days: [3],
    pairs: "همه جفت‌ارزهای USD",
  },
  {
    id: 4,
    time: "15:30",
    label: "Initial Jobless Claims",
    impact: "medium",
    days: [4],
    pairs: "USD/JPY, EUR/USD",
  },
  {
    id: 5,
    time: "12:00",
    label: "BOE Interest Rate Decision",
    impact: "high",
    days: [4],
    pairs: "GBP/USD, EUR/GBP, GBP/JPY",
  },
  {
    id: 6,
    time: "14:45",
    label: "PMI Flash",
    impact: "medium",
    days: [2, 5],
    pairs: "EUR/USD, GBP/USD",
  },
  {
    id: 7,
    time: "17:00",
    label: "ISM Manufacturing PMI",
    impact: "medium",
    days: [1],
    pairs: "USD/CAD, EUR/USD",
  },
  {
    id: 8,
    time: "09:15",
    label: "ECB Interest Rate Decision",
    impact: "high",
    days: [4],
    pairs: "EUR/USD, EUR/GBP, EUR/JPY",
  },
  {
    id: 9,
    time: "16:30",
    label: "Crude Oil Inventories",
    impact: "medium",
    days: [3],
    pairs: "USD/CAD, Oil",
  },
  {
    id: 10,
    time: "15:30",
    label: "Retail Sales (USD)",
    impact: "medium",
    days: [3],
    pairs: "EUR/USD, USD/JPY",
  },
  {
    id: 11,
    time: "15:30",
    label: "GDP Preliminary",
    impact: "high",
    days: [4],
    pairs: "EUR/USD, GBP/USD, S&P500",
  },
  {
    id: 12,
    time: "10:00",
    label: "German IFO Business Climate",
    impact: "medium",
    days: [2],
    pairs: "EUR/USD, EUR/GBP",
  },
];

function pad(n) {
  return String(n).padStart(2, "0");
}
function isActive(s, h) {
  return s.startUTC < s.endUTC
    ? h >= s.startUTC && h < s.endUTC
    : h >= s.startUTC || h < s.endUTC;
}
function getProgress(s, h, m) {
  const total =
    s.startUTC < s.endUTC
      ? (s.endUTC - s.startUTC) * 60
      : (24 - s.startUTC + s.endUTC) * 60;
  const elapsed =
    s.startUTC <= h
      ? (h - s.startUTC) * 60 + m
      : (24 - s.startUTC + h) * 60 + m;
  return Math.min(Math.max((elapsed / total) * 100, 0), 100);
}

// ─── WEB AUDIO ALARM ─────────────────────────────────────────────────────────
function playAlarmSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const beeps = [0, 0.25, 0.5, 0.75, 1.0];
    beeps.forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(i === 4 ? 1200 : 880, ctx.currentTime + t);
      gain.gain.setValueAtTime(0, ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.18);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.2);
    });
  } catch (e) {}
}

export default function TradingWidget() {
  const [now, setNow] = useState(new Date());
  const [theme, setTheme] = useState("midnight");
  const [alarms, setAlarms] = useState(() =>
    Object.fromEntries(NEWS_EVENTS.map((e) => [e.id, true]))
  );
  const [alarmFired, setAlarmFired] = useState(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [showBg, setShowBg] = useState(true);
  const [widgetMode, setWidgetMode] = useState(false);
  const [sessions, setSessions] = useState(SESSIONS_DEFAULT);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [aiRecs, setAiRecs] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const T = THEMES[theme];

  // Clock tick
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  // Alarm checker + sound
  useEffect(() => {
    const h = now.getUTCHours(),
      m = now.getUTCMinutes(),
      s = now.getUTCSeconds();
    if (s === 0) {
      NEWS_EVENTS.forEach((e) => {
        const [eh, em] = e.time.split(":").map(Number);
        if (alarms[e.id] && eh === h && em === m) {
          setAlarmFired(e);
          playAlarmSound();
          setTimeout(() => setAlarmFired(null), 6000);
        }
      });
    }
  }, [now, alarms]);

  // Mouse parallax
  const handleMouseMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    });
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * 9999,
      y: Math.random() * 9999,
      r: Math.random() * 1.3 + 0.3,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      op: Math.random() * 0.35 + 0.08,
      c: T.particle[Math.floor(Math.random() * 4)],
    }));
    const draw = () => {
      if (!canvas.width) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x % canvas.width, p.y % canvas.height, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.op;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  // AI fetch
  const fetchAI = useCallback(() => {
    setAiLoading(true);
    setAiRecs(null);
    const today = new Date();
    const dayName = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][today.getDay()];
    const utcH = today.getUTCHours();
    const prompt = `Forex analyst. Today ${dayName}, UTC hour ${utcH}. For Sydney,Tokyo,London,NewYork: TOP 4 volatile pairs RIGHT NOW. Short Persian hotTip. Reply ONLY valid JSON no markdown: {"lastUpdated":"${dayName} ${utcH}:00","sydney":{"pairs":["P1","P2","P3","P4"],"hotTip":"نکته فارسی","sentiment":"bullish"},"tokyo":{"pairs":["P1","P2","P3","P4"],"hotTip":"نکته","sentiment":"ranging"},"london":{"pairs":["P1","P2","P3","P4"],"hotTip":"نکته","sentiment":"bearish"},"newyork":{"pairs":["P1","P2","P3","P4"],"hotTip":"نکته","sentiment":"bullish"}}`;
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        try {
          const t = d?.content?.[0]?.text || "";
          setAiRecs(JSON.parse(t.replace(/```json|```/g, "").trim()));
        } catch (e) {}
        setAiLoading(false);
      })
      .catch(() => setAiLoading(false));
  }, []);

  useEffect(() => {
    fetchAI();
  }, []);

  // Drag & Drop
  const onDragStart = useCallback((i) => setDragIdx(i), []);
  const onDragOver = useCallback((e, i) => {
    e.preventDefault();
    setDragOver(i);
  }, []);
  const onDrop = useCallback(
    (e, i) => {
      e.preventDefault();
      if (dragIdx === null || dragIdx === i) return;
      setSessions((prev) => {
        const arr = [...prev];
        const [moved] = arr.splice(dragIdx, 1);
        arr.splice(i, 0, moved);
        return arr;
      });
      setDragIdx(null);
      setDragOver(null);
    },
    [dragIdx]
  );

  const utcH = now.getUTCHours(),
    utcM = now.getUTCMinutes(),
    utcS = now.getUTCSeconds();
  const activeSessions = sessions.filter((s) => isActive(s, utcH));
  const isOverlap = activeSessions.length > 1;
  const todayDay = now.getDay(),
    nowMin = utcH * 60 + utcM;

  // Glass or solid card
  const cardBg = showBg ? T.cardBg : T.glassCard;
  const glassExtra = !showBg
    ? {
        backdropFilter: "blur(28px) saturate(1.6)",
        WebkitBackdropFilter: "blur(28px) saturate(1.6)",
      }
    : { backdropFilter: "blur(16px)" };
  const tile = (extra = {}) => ({
    background: cardBg,
    border: `1px solid ${
      showBg ? T.border : T.border.replace(/[\d.]+\)$/, "0.35)")
    }`,
    borderRadius: "18px",
    boxShadow: showBg
      ? `0 4px 32px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.06)`
      : `0 8px 40px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.15)`,
    transition: "all 0.3s ease",
    ...glassExtra,
    ...extra,
  });

  const lbl = {
    fontSize: "9px",
    letterSpacing: "4px",
    color: T.textMuted,
    textTransform: "uppercase",
    marginBottom: "12px",
    fontFamily: "Orbitron,monospace",
  };

  // ── WIDGET MODE ──────────────────────────────────────────────────────────────
  if (widgetMode) {
    const active = activeSessions[0];
    return (
      <>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <style>{`
          @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
          @keyframes alarmPop{0%{transform:scale(0.8);opacity:0}20%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
          .pulse{animation:pulse 1.8s ease-in-out infinite;}
        `}</style>
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            fontFamily: "Orbitron,monospace",
            width: "260px",
            userSelect: "none",
            filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.5))",
          }}
        >
          <div
            style={{
              ...tile(),
              padding: "16px 18px",
              background: showBg ? T.cardBg : T.glassCard,
              borderRadius: "20px",
            }}
          >
            {/* Widget header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "8px",
                  letterSpacing: "3px",
                  color: T.accent,
                }}
              >
                FOREX UTC
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => setShowBg((b) => !b)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    opacity: 0.6,
                  }}
                >
                  {showBg ? "🖼" : "🪟"}
                </button>
                <button
                  onClick={() => setWidgetMode(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    opacity: 0.6,
                  }}
                >
                  ⛶
                </button>
              </div>
            </div>

            {/* Big time */}
            <div
              style={{
                fontSize: "38px",
                fontWeight: "900",
                color: T.accent,
                letterSpacing: "3px",
                textAlign: "center",
                textShadow: `0 0 20px ${T.accentGlow}`,
                direction: "ltr",
              }}
            >
              {pad(utcH)}:{pad(utcM)}
              <span style={{ fontSize: "18px", opacity: 0.4 }}>
                :{pad(utcS)}
              </span>
            </div>

            {/* Session status */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                marginTop: "10px",
                justifyContent: "center",
              }}
            >
              {sessions.map((s) => {
                const on = isActive(s, utcH);
                return (
                  <div
                    key={s.id}
                    style={{
                      padding: "3px 9px",
                      borderRadius: "100px",
                      fontSize: "8px",
                      letterSpacing: "1px",
                      background: on ? `${s.color}20` : "transparent",
                      border: `1px solid ${on ? s.color : T.textDim}`,
                      color: on ? s.color : T.textDim,
                      boxShadow: on ? `0 0 8px ${s.glow}` : "none",
                    }}
                    className={on ? "pulse" : ""}
                  >
                    {s.flag} {s.nameEn}
                  </div>
                );
              })}
            </div>

            {/* Overlap */}
            {isOverlap && (
              <div
                className="pulse"
                style={{
                  textAlign: "center",
                  marginTop: "8px",
                  fontSize: "8px",
                  color: "#ff8c42",
                  letterSpacing: "2px",
                }}
              >
                ⚡ OVERLAP
              </div>
            )}

            {/* Next alarm */}
            {(() => {
              const next = NEWS_EVENTS.filter((e) => {
                const [h, m] = e.time.split(":").map(Number);
                const d = h * 60 + m - nowMin;
                return d > 0 && d <= 60 && alarms[e.id];
              }).sort((a, b) => {
                const [ah, am] = a.time.split(":").map(Number);
                const [bh, bm] = b.time.split(":").map(Number);
                return ah * 60 + am - (bh * 60 + bm);
              })[0];
              if (!next) return null;
              const [h, m] = next.time.split(":").map(Number);
              const diff = h * 60 + m - nowMin;
              return (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "6px 10px",
                    borderRadius: "10px",
                    background: "rgba(255,68,68,0.1)",
                    border: "1px solid rgba(255,68,68,0.2)",
                    fontSize: "8px",
                    color: "#ff6b6b",
                    letterSpacing: "1px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>🔔 {next.label.split("—")[0].trim()}</span>
                  <span style={{ fontWeight: "700" }}>{diff}m</span>
                </div>
              );
            })()}
          </div>
        </div>
      </>
    );
  }

  // ── FULL MODE ────────────────────────────────────────────────────────────────
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Noto+Sans+Arabic:wght@300;400;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{height:100%;}
        @keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}
        @keyframes alarmPop{0%{transform:scale(0.8);opacity:0}20%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
        @keyframes alarmShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-4px)}40%{transform:translateX(4px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scanGlow{0%{opacity:0}50%{opacity:1}100%{opacity:0}}
        .pulse{animation:pulse 1.8s ease-in-out infinite;}
        .alarm-pop{animation:alarmPop 0.4s cubic-bezier(.34,1.56,.64,1) forwards, alarmShake 0.5s 0.4s ease;}
        .fade-in{animation:fadeIn 0.4s ease forwards;}
        .session-card{transition:transform 0.25s cubic-bezier(.25,.8,.25,1),box-shadow 0.25s ease,opacity 0.2s;}
        .session-card:hover{transform:translateY(-3px)!important;}
        .session-card.dragging{opacity:0.4;transform:scale(0.97)!important;}
        .session-card.drag-over{transform:translateY(-6px)!important;box-shadow:0 0 0 2px ${THEMES.midnight.accent}!important;}
        .pair-chip{transition:transform 0.15s,box-shadow 0.15s;cursor:default;}
        .pair-chip:hover{transform:scale(1.07);}
        .news-row{transition:background 0.15s,transform 0.15s;}
        .news-row:hover{transform:translateX(3px);}
        .theme-btn{transition:transform 0.2s,box-shadow 0.2s;cursor:pointer;}
        .theme-btn:hover{transform:scale(1.15);}
        .ctrl-btn{transition:all 0.2s;cursor:pointer;}
        .ctrl-btn:hover{opacity:0.8;transform:scale(1.05);}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px;}
      `}</style>

      <div
        style={{
          fontFamily: "'Noto Sans Arabic','Orbitron',sans-serif",
          background: showBg ? T.bg : "transparent",
          minHeight: "100vh",
          color: T.text,
          position: "relative",
          overflow: "hidden",
          direction: "rtl",
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Particle canvas — only when bg on */}
        {showBg && (
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              opacity: 0.5,
            }}
          />
        )}

        {/* Parallax ambient */}
        {showBg && (
          <div
            style={{
              position: "absolute",
              top: `${mouse.y * 40 - 20 + 30}%`,
              left: `${mouse.x * 40 - 20 + 30}%`,
              width: "700px",
              height: "700px",
              background: `radial-gradient(circle,${T.accentGlow} 0%,transparent 65%)`,
              transform: "translate(-50%,-50%)",
              pointerEvents: "none",
              transition: "top 0.4s ease,left 0.4s ease",
            }}
          />
        )}

        {/* Glass noise texture overlay when no bg */}
        {!showBg && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
          />
        )}

        {/* ALARM POPUP */}
        {alarmFired && (
          <div
            className="alarm-pop"
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              background: cardBg,
              ...glassExtra,
              border: "2px solid #ff4444",
              borderRadius: "16px",
              padding: "14px 28px",
              zIndex: 9999,
              boxShadow: "0 0 50px rgba(255,68,68,0.5)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div style={{ fontSize: "26px" }}>🔔</div>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "#ff4444",
                  fontFamily: "Orbitron,monospace",
                }}
              >
                آلارم خبر مهم
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: T.text,
                  marginTop: "2px",
                }}
              >
                {alarmFired.label}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  color: T.textMuted,
                  marginTop: "2px",
                }}
              >
                {alarmFired.time} UTC · {alarmFired.pairs}
              </div>
            </div>
            <button
              onClick={() => setAlarmFired(null)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.textMuted,
                fontSize: "16px",
                marginRight: "auto",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ── MAIN CONTAINER — fixed max width, centered ── */}
        <div
          style={{
            maxWidth: "1080px",
            width: "100%",
            margin: "0 auto",
            padding: "20px 16px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ── TOOLBAR ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "Orbitron,monospace",
                  fontSize: "17px",
                  fontWeight: "900",
                  color: T.accent,
                  letterSpacing: "4px",
                }}
              >
                FOREX SESSIONS
              </div>
              <div
                style={{
                  fontSize: "9px",
                  color: T.textMuted,
                  letterSpacing: "2px",
                  marginTop: "2px",
                }}
              >
                ویجت تریدر — UTC time
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* AI status */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "100px",
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  fontSize: "9px",
                  color: T.textMuted,
                  letterSpacing: "1px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: aiLoading
                      ? "#ffa500"
                      : aiRecs
                      ? "#00d4aa"
                      : "#666",
                    boxShadow: aiLoading
                      ? "0 0 6px #ffa500"
                      : aiRecs
                      ? "0 0 8px #00d4aa"
                      : "none",
                    animation: aiLoading ? "pulse 1s infinite" : "none",
                  }}
                />
                <span>
                  {aiLoading
                    ? "AI در حال تحلیل..."
                    : aiRecs
                    ? `AI: ${aiRecs.lastUpdated}`
                    : "پیش‌فرض"}
                </span>
                {!aiLoading && (
                  <button
                    onClick={fetchAI}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: T.accent,
                      padding: "0 2px",
                    }}
                  >
                    ↻
                  </button>
                )}
              </div>

              {/* Controls */}
              <div
                style={{ display: "flex", gap: "6px", alignItems: "center" }}
              >
                {/* BG toggle */}
                <button
                  className="ctrl-btn"
                  onClick={() => setShowBg((b) => !b)}
                  title="پس‌زمینه"
                  style={{
                    padding: "6px 12px",
                    borderRadius: "100px",
                    border: `1px solid ${T.border}`,
                    background: showBg ? `${T.accent}22` : T.surface,
                    color: showBg ? T.accent : T.textMuted,
                    fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "Orbitron,monospace",
                    letterSpacing: "1px",
                    boxShadow: showBg ? `0 0 10px ${T.accentGlow}` : "none",
                  }}
                >
                  {showBg ? "🖼 BG" : "🪟 Glass"}
                </button>

                {/* Widget mode */}
                <button
                  className="ctrl-btn"
                  onClick={() => setWidgetMode(true)}
                  title="حالت ویجت"
                  style={{
                    padding: "6px 12px",
                    borderRadius: "100px",
                    border: `1px solid ${T.border}`,
                    background: T.surface,
                    color: T.textMuted,
                    fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "Orbitron,monospace",
                    letterSpacing: "1px",
                  }}
                >
                  ⊞ Widget
                </button>
              </div>

              {/* Theme buttons */}
              <div
                style={{ display: "flex", gap: "6px", alignItems: "center" }}
              >
                {Object.entries(THEMES).map(([k, v]) => (
                  <button
                    key={k}
                    className="theme-btn"
                    onClick={() => setTheme(k)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: `2px solid ${theme === k ? T.accent : T.border}`,
                      background: theme === k ? `${T.accent}22` : T.surface,
                      fontSize: "14px",
                      cursor: "pointer",
                      boxShadow:
                        theme === k ? `0 0 12px ${T.accentGlow}` : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {v.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── BODY GRID ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: "18px",
              alignItems: "start",
            }}
          >
            {/* ══ LEFT ══ */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* CLOCK CARD */}
              <div
                style={{
                  ...tile(),
                  padding: "24px 18px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div style={lbl}>⬡ ساعت جهانی UTC</div>

                {/* Tri-ring clock */}
                <div
                  style={{
                    position: "relative",
                    width: "264px",
                    height: "264px",
                  }}
                >
                  <svg width="264" height="264" viewBox="0 0 264 264">
                    <defs>
                      <filter id="fg">
                        <feGaussianBlur stdDeviation="5" result="b" />
                        <feComposite
                          in="SourceGraphic"
                          in2="b"
                          operator="over"
                        />
                      </filter>
                      <filter id="sg">
                        <feGaussianBlur stdDeviation="2.5" result="b" />
                        <feComposite
                          in="SourceGraphic"
                          in2="b"
                          operator="over"
                        />
                      </filter>
                      <radialGradient id="cg" cx="50%" cy="50%">
                        <stop
                          offset="0%"
                          stopColor={T.accent}
                          stopOpacity="0.12"
                        />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                    </defs>

                    <circle cx="132" cy="132" r="85" fill="url(#cg)" />

                    {/* Track rings */}
                    <circle
                      cx="132"
                      cy="132"
                      r="122"
                      fill="none"
                      stroke="rgba(255,68,100,0.07)"
                      strokeWidth="7"
                    />
                    <circle
                      cx="132"
                      cy="132"
                      r="104"
                      fill="none"
                      stroke={`${T.accent}10`}
                      strokeWidth="9"
                    />
                    <circle
                      cx="132"
                      cy="132"
                      r="83"
                      fill="none"
                      stroke="rgba(77,159,255,0.1)"
                      strokeWidth="11"
                    />

                    {/* Seconds ring */}
                    {(() => {
                      const p = utcS / 60,
                        c = 2 * Math.PI * 122,
                        d = p * c;
                      return (
                        <circle
                          cx="132"
                          cy="132"
                          r="122"
                          fill="none"
                          stroke="#ff4466"
                          strokeWidth="3.5"
                          strokeDasharray={`${d} ${c}`}
                          strokeDashoffset={c * 0.25}
                          strokeLinecap="round"
                          filter="url(#sg)"
                          style={{ transition: "stroke-dasharray 0.4s linear" }}
                        />
                      );
                    })()}
                    {(() => {
                      const a = (((utcS / 60) * 360 - 90) * Math.PI) / 180;
                      return (
                        <circle
                          cx={132 + 122 * Math.cos(a)}
                          cy={132 + 122 * Math.sin(a)}
                          r="4.5"
                          fill="#ff4466"
                          filter="url(#fg)"
                        />
                      );
                    })()}

                    {/* Minutes ring */}
                    {(() => {
                      const p = (utcM + utcS / 60) / 60,
                        c = 2 * Math.PI * 104,
                        d = p * c;
                      return (
                        <circle
                          cx="132"
                          cy="132"
                          r="104"
                          fill="none"
                          stroke={T.accent}
                          strokeWidth="5.5"
                          strokeDasharray={`${d} ${c}`}
                          strokeDashoffset={c * 0.25}
                          strokeLinecap="round"
                          filter="url(#sg)"
                          style={{ transition: "stroke-dasharray 0.4s ease" }}
                        />
                      );
                    })()}
                    {(() => {
                      const a =
                        ((((utcM + utcS / 60) / 60) * 360 - 90) * Math.PI) /
                        180;
                      return (
                        <circle
                          cx={132 + 104 * Math.cos(a)}
                          cy={132 + 104 * Math.sin(a)}
                          r="6"
                          fill={T.accent}
                          filter="url(#fg)"
                        />
                      );
                    })()}

                    {/* Hours ring */}
                    {(() => {
                      const p = ((utcH % 12) + utcM / 60) / 12,
                        c = 2 * Math.PI * 83,
                        d = p * c;
                      return (
                        <circle
                          cx="132"
                          cy="132"
                          r="83"
                          fill="none"
                          stroke="#4d9fff"
                          strokeWidth="8"
                          strokeDasharray={`${d} ${c}`}
                          strokeDashoffset={c * 0.25}
                          strokeLinecap="round"
                          filter="url(#sg)"
                          style={{ transition: "stroke-dasharray 0.5s ease" }}
                        />
                      );
                    })()}
                    {(() => {
                      const a =
                        (((((utcH % 12) + utcM / 60) / 12) * 360 - 90) *
                          Math.PI) /
                        180;
                      return (
                        <circle
                          cx={132 + 83 * Math.cos(a)}
                          cy={132 + 83 * Math.sin(a)}
                          r="7"
                          fill="#4d9fff"
                          filter="url(#fg)"
                        />
                      );
                    })()}

                    {/* Tick marks */}
                    {Array.from({ length: 60 }, (_, i) => {
                      const a = (((i / 60) * 360 - 90) * Math.PI) / 180,
                        big = i % 5 === 0;
                      return (
                        <line
                          key={i}
                          x1={132 + (big ? 131 : 133) * Math.cos(a)}
                          y1={132 + (big ? 131 : 133) * Math.sin(a)}
                          x2={132 + 138 * Math.cos(a)}
                          y2={132 + 138 * Math.sin(a)}
                          stroke={
                            big
                              ? "rgba(255,255,255,0.3)"
                              : "rgba(255,255,255,0.08)"
                          }
                          strokeWidth={big ? 1.5 : 0.6}
                        />
                      );
                    })}

                    {/* Hour numbers */}
                    {[12, 3, 6, 9].map((h) => {
                      const a = (((h / 12) * 360 - 90) * Math.PI) / 180,
                        r = 60;
                      return (
                        <text
                          key={h}
                          x={132 + r * Math.cos(a)}
                          y={132 + r * Math.sin(a) + 4}
                          textAnchor="middle"
                          fill={T.textMuted}
                          fontSize="12"
                          fontFamily="Orbitron"
                          fontWeight="700"
                        >
                          {h}
                        </text>
                      );
                    })}
                    {[1, 2, 4, 5, 7, 8, 10, 11].map((h) => {
                      const a = (((h / 12) * 360 - 90) * Math.PI) / 180,
                        r = 60;
                      return (
                        <text
                          key={h}
                          x={132 + r * Math.cos(a)}
                          y={132 + r * Math.sin(a) + 3}
                          textAnchor="middle"
                          fill={T.textDim}
                          fontSize="7.5"
                          fontFamily="Orbitron"
                        >
                          {h}
                        </text>
                      );
                    })}

                    {/* Center face */}
                    <circle
                      cx="132"
                      cy="132"
                      r="40"
                      fill={showBg ? T.cardBg : T.glassCard}
                      stroke={T.border}
                      strokeWidth="1"
                    />
                    <text
                      x="132"
                      y="128"
                      textAnchor="middle"
                      fill={T.accent}
                      fontSize="19"
                      fontFamily="Orbitron"
                      fontWeight="900"
                      filter="url(#sg)"
                    >
                      {pad(utcH)}:{pad(utcM)}
                    </text>
                    <text
                      x="132"
                      y="144"
                      textAnchor="middle"
                      fill={T.textMuted}
                      fontSize="9.5"
                      fontFamily="Orbitron"
                    >
                      :{pad(utcS)}
                    </text>
                  </svg>

                  {/* Ring legend */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "12px",
                      direction: "ltr",
                    }}
                  >
                    {[
                      ["SEC", "#ff4466"],
                      ["MIN", T.accent],
                      ["HR", "#4d9fff"],
                    ].map(([l, c]) => (
                      <div
                        key={l}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <div
                          style={{
                            width: "7px",
                            height: "3px",
                            borderRadius: "2px",
                            background: c,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "7px",
                            color: c,
                            letterSpacing: "1.5px",
                            fontFamily: "Orbitron,monospace",
                            opacity: 0.75,
                          }}
                        >
                          {l}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "10px",
                    color: T.textMuted,
                    letterSpacing: "4px",
                    fontFamily: "Orbitron,monospace",
                  }}
                >
                  UTC / GMT+0
                </div>

                {isOverlap && (
                  <div
                    className="pulse"
                    style={{
                      width: "100%",
                      padding: "9px",
                      borderRadius: "10px",
                      background: "rgba(255,100,0,0.1)",
                      border: "1px solid rgba(255,100,0,0.25)",
                      fontSize: "9px",
                      color: "#ff8c42",
                      letterSpacing: "2px",
                      textAlign: "center",
                      fontFamily: "Orbitron,monospace",
                    }}
                  >
                    ⚡ OVERLAP — نوسان انفجاری
                  </div>
                )}
              </div>

              {/* Session legend */}
              <div style={{ ...tile(), padding: "16px 18px" }}>
                <div style={lbl}>راهنمای سشن‌ها</div>
                {sessions.map((s) => {
                  const on = isActive(s, utcH);
                  return (
                    <div
                      key={s.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                        padding: "4px 0",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "3px",
                          borderRadius: "2px",
                          background: s.color,
                          opacity: on ? 1 : 0.25,
                          boxShadow: on ? `0 0 6px ${s.glow}` : "none",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "9px",
                          color: T.textMuted,
                          letterSpacing: "1.5px",
                          flex: 1,
                        }}
                      >
                        {s.flag} {s.name}
                      </span>
                      <span
                        style={{
                          fontSize: "8px",
                          color: T.textDim,
                          fontFamily: "Orbitron,monospace",
                        }}
                      >
                        {pad(s.startUTC)}–{pad(s.endUTC)}
                      </span>
                      {on && (
                        <span
                          className="pulse"
                          style={{
                            fontSize: "7px",
                            padding: "2px 6px",
                            background: `${s.color}22`,
                            border: `1px solid ${s.color}55`,
                            borderRadius: "100px",
                            color: s.color,
                            letterSpacing: "1px",
                          }}
                        >
                          LIVE
                        </span>
                      )}
                    </div>
                  );
                })}
                <div
                  style={{
                    fontSize: "8px",
                    color: T.textDim,
                    letterSpacing: "1px",
                    marginTop: "6px",
                    paddingTop: "8px",
                    borderTop: `1px solid ${T.textDim}`,
                  }}
                >
                  ✦ کارت‌ها را drag کنید تا ترتیب تغییر کند
                </div>
              </div>
            </div>

            {/* ══ RIGHT ══ */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* SESSION CARDS — draggable 2x2 grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                {sessions.map((s, i) => {
                  const on = isActive(s, utcH),
                    pct = on ? getProgress(s, utcH, utcM) : 0;
                  const rec = aiRecs?.[s.id];
                  const pairs = rec?.pairs || s.pairs;
                  const sentColor =
                    rec?.sentiment === "bullish"
                      ? "#00d4aa"
                      : rec?.sentiment === "bearish"
                      ? "#ff4466"
                      : "#ffd700";
                  const isDragging = dragIdx === i,
                    isOver = dragOver === i;
                  return (
                    <div
                      key={s.id}
                      draggable
                      onDragStart={() => onDragStart(i)}
                      onDragOver={(e) => onDragOver(e, i)}
                      onDrop={(e) => onDrop(e, i)}
                      onDragEnd={() => {
                        setDragIdx(null);
                        setDragOver(null);
                      }}
                      className={`session-card fade-in ${
                        isDragging ? "dragging" : ""
                      } ${isOver ? "drag-over" : ""}`}
                      style={{
                        ...tile(),
                        padding: "15px",
                        cursor: "grab",
                        borderColor: on ? `${s.color}55` : undefined,
                        boxShadow: on
                          ? `0 0 22px ${s.glow},inset 0 1px 0 rgba(255,255,255,0.07)`
                          : "none",
                      }}
                    >
                      {/* Header row */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "9px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                          }}
                        >
                          <span style={{ fontSize: "20px" }}>{s.flag}</span>
                          <div>
                            <div
                              style={{
                                fontFamily: "Orbitron,monospace",
                                fontSize: "10px",
                                letterSpacing: "2.5px",
                                color: on ? s.color : T.textMuted,
                                fontWeight: "700",
                              }}
                            >
                              {s.nameEn}
                            </div>
                            <div
                              style={{
                                fontSize: "9px",
                                color: T.textMuted,
                                letterSpacing: "0.5px",
                              }}
                            >
                              {s.name}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "3px 9px",
                            borderRadius: "100px",
                            textAlign: "center",
                            background: `${s.color}18`,
                            border: `1px solid ${s.color}40`,
                            fontSize: "7.5px",
                            color: s.color,
                            letterSpacing: "0.5px",
                            fontFamily: "Orbitron,monospace",
                          }}
                        >
                          <div>{s.rankStars}</div>
                          <div style={{ marginTop: "1px" }}>{s.rankLabel}</div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div
                        style={{
                          height: "3px",
                          borderRadius: "2px",
                          background: T.textDim,
                          marginBottom: "7px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            borderRadius: "2px",
                            background: `linear-gradient(90deg,${s.color}66,${s.color})`,
                            boxShadow: on ? `0 0 8px ${s.glow}` : "none",
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "8px",
                          color: T.textDim,
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                          fontFamily: "Orbitron,monospace",
                        }}
                      >
                        {pad(s.startUTC)}:00 → {pad(s.endUTC)}:00 UTC ·{" "}
                        {on ? `${Math.round(pct)}% گذشته` : "بسته"}
                      </div>
                      <div
                        style={{
                          fontSize: "8.5px",
                          color: T.textMuted,
                          letterSpacing: "0.3px",
                          marginBottom: "9px",
                          lineHeight: "1.5",
                        }}
                      >
                        {s.desc}
                      </div>

                      {/* Sentiment + pairs */}
                      {rec?.sentiment && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            marginBottom: "7px",
                          }}
                        >
                          <div
                            style={{
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              background: sentColor,
                              boxShadow: `0 0 6px ${sentColor}`,
                            }}
                          />
                          <span
                            style={{
                              fontSize: "7.5px",
                              color: sentColor,
                              letterSpacing: "2px",
                              fontFamily: "Orbitron,monospace",
                              textTransform: "uppercase",
                            }}
                          >
                            {rec.sentiment}
                          </span>
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px",
                        }}
                      >
                        {aiLoading && !rec
                          ? [1, 2, 3, 4].map((j) => (
                              <div
                                key={j}
                                style={{
                                  height: "20px",
                                  width: "56px",
                                  borderRadius: "100px",
                                  background: T.textDim,
                                  animation: "pulse 1.5s ease infinite",
                                  animationDelay: `${j * 0.12}s`,
                                }}
                              />
                            ))
                          : pairs.map((p) => (
                              <span
                                key={p}
                                className="pair-chip"
                                style={{
                                  padding: "3px 8px",
                                  borderRadius: "100px",
                                  background: `${s.color}14`,
                                  border: `1px solid ${s.color}35`,
                                  fontSize: "8px",
                                  color: on ? s.color : T.textMuted,
                                  fontFamily: "Orbitron,monospace",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {p}
                              </span>
                            ))}
                      </div>

                      {rec?.hotTip && (
                        <div
                          style={{
                            fontSize: "8px",
                            color: T.textMuted,
                            lineHeight: "1.5",
                            borderTop: `1px solid ${T.textDim}`,
                            paddingTop: "7px",
                            marginTop: "7px",
                            fontStyle: "italic",
                          }}
                        >
                          💡 {rec.hotTip}
                        </div>
                      )}

                      {on && (
                        <div
                          className="pulse"
                          style={{
                            marginTop: "8px",
                            padding: "4px 0",
                            borderTop: `1px solid ${s.color}25`,
                            fontSize: "7.5px",
                            color: s.color,
                            letterSpacing: "3px",
                            fontFamily: "Orbitron,monospace",
                            textAlign: "center",
                          }}
                        >
                          ● LIVE NOW
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* NEWS TABLE */}
              <div style={{ ...tile(), padding: "18px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <div style={lbl}>📰 تقویم اقتصادی · Economic Calendar</div>
                  <div
                    style={{
                      fontSize: "8px",
                      color: T.textMuted,
                      letterSpacing: "1px",
                    }}
                  >
                    🔔 آلارم صوتی ۵ دقیقه قبل
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "54px 1fr 86px 32px",
                    gap: "6px",
                    padding: "5px 8px",
                    marginBottom: "4px",
                    fontSize: "7.5px",
                    color: T.textDim,
                    letterSpacing: "2px",
                    borderBottom: `1px solid ${T.textDim}`,
                  }}
                >
                  <span>زمان</span>
                  <span>خبر</span>
                  <span>نمادها</span>
                  <span style={{ textAlign: "center" }}>🔔</span>
                </div>

                <div style={{ maxHeight: "260px", overflowY: "auto" }}>
                  {NEWS_EVENTS.map((e) => {
                    const [eh, em] = e.time.split(":").map(Number);
                    const eMin = eh * 60 + em,
                      isPast = eMin < nowMin;
                    const isToday = e.days.includes(todayDay),
                      diff = eMin - nowMin;
                    const isSoon = diff > 0 && diff <= 30;
                    return (
                      <div
                        key={e.id}
                        className="news-row"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "54px 1fr 86px 32px",
                          gap: "6px",
                          padding: "8px 8px",
                          borderRadius: "8px",
                          borderBottom: `1px solid ${T.textDim}`,
                          opacity: !isToday || isPast ? 0.28 : 1,
                          background: isSoon
                            ? "rgba(255,68,68,0.04)"
                            : "transparent",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "Orbitron,monospace",
                            fontSize: "11px",
                            fontWeight: "700",
                            color: isSoon
                              ? "#ff4466"
                              : isToday
                              ? T.text
                              : T.textMuted,
                            direction: "ltr",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span
                            style={{
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              display: "inline-block",
                              background:
                                e.impact === "high" ? "#ff4444" : "#ffa500",
                              boxShadow: isSoon
                                ? `0 0 7px ${
                                    e.impact === "high" ? "#ff4444" : "#ffa500"
                                  }`
                                : "none",
                            }}
                          />
                          {e.time}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "9px",
                              color: T.text,
                              lineHeight: "1.3",
                            }}
                          >
                            {e.label}
                          </div>
                          {isSoon && (
                            <div
                              style={{
                                fontSize: "7.5px",
                                color: "#ff4466",
                                letterSpacing: "2px",
                                marginTop: "1px",
                                fontFamily: "Orbitron,monospace",
                              }}
                            >
                              ⚡ {diff}m دیگر
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: "7.5px",
                            color: T.textMuted,
                            lineHeight: "1.4",
                          }}
                        >
                          {e.pairs}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            className="ctrl-btn"
                            onClick={() =>
                              setAlarms((a) => ({ ...a, [e.id]: !a[e.id] }))
                            }
                            style={{
                              width: "26px",
                              height: "26px",
                              borderRadius: "50%",
                              border: "none",
                              cursor: "pointer",
                              background: alarms[e.id]
                                ? `${T.accent}22`
                                : "rgba(255,255,255,0.03)",
                              fontSize: "12px",
                              boxShadow: alarms[e.id]
                                ? `0 0 8px ${T.accentGlow}`
                                : "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {alarms[e.id] ? "🔔" : "🔕"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    marginTop: "10px",
                    paddingTop: "8px",
                    borderTop: `1px solid ${T.textDim}`,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    ["High Impact", "#ff4444"],
                    ["Medium Impact", "#ffa500"],
                  ].map(([l, c]) => (
                    <div
                      key={l}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: c,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "7.5px",
                          color: T.textMuted,
                          letterSpacing: "1px",
                        }}
                      >
                        {l}
                      </span>
                    </div>
                  ))}
                  <span
                    style={{
                      fontSize: "7.5px",
                      color: T.textDim,
                      marginRight: "auto",
                      letterSpacing: "0.5px",
                    }}
                  >
                    همه ساعت‌ها UTC
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              marginTop: "14px",
              fontSize: "7.5px",
              color: T.textDim,
              letterSpacing: "3px",
              fontFamily: "Orbitron,monospace",
            }}
          >
            FOREX SESSION TRACKER · {THEMES[theme].name} ·{" "}
            {now.toLocaleDateString("fa-IR")} ·{" "}
            {showBg ? "BG ON" : "GLASS MODE"}
          </div>
        </div>
      </div>
    </>
  );
}
