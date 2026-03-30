"use client";

import { useState, useEffect } from "react";

const INDUSTRIES = [
  { label: "Home Services (HVAC, Plumbing, Roofing)", missRate: 0.40, avgJobValue: 350, conversionRate: 0.55, callVolume: 120 },
  { label: "Dental / Medical", missRate: 0.33, avgJobValue: 650, conversionRate: 0.65, callVolume: 90 },
  { label: "Legal Services", missRate: 0.28, avgJobValue: 3000, conversionRate: 0.45, callVolume: 60 },
  { label: "Real Estate", missRate: 0.25, avgJobValue: 7500, conversionRate: 0.40, callVolume: 50 },
  { label: "Other Service Business", missRate: 0.35, avgJobValue: 250, conversionRate: 0.50, callVolume: 80 },
];

const SOURCE_NOTES = [
  "85% no-callback rate: corroborated across Invoca, Eden, DaVinci Virtual, and Nextiva industry analyses (2024–2026)",
  "Miss rate ranges (25–60%): PCN Answers 2026 Small Business Missed Call Revenue Study; 411 Locals 58-industry study",
  "Conversion rates: conservative benchmarks by industry — adjust to your actual close rate for precision",
  "Recovery rate (60%): conservative deployment estimate; actual capture depends on hours covered and use case",
];

const fmt = (n) => "$" + Math.round(n).toLocaleString();
const pct = (n) => Math.round(n * 100) + "%";

export default function ROICalculator() {
  const [industryIdx, setIndustryIdx] = useState(0);
  const [calls, setCalls] = useState(INDUSTRIES[0].callVolume);
  const [missRate, setMissRate] = useState(INDUSTRIES[0].missRate);
  const [jobValue, setJobValue] = useState(INDUSTRIES[0].avgJobValue);
  const [convRate, setConvRate] = useState(INDUSTRIES[0].conversionRate);
  const [showSources, setShowSources] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const ind = INDUSTRIES[industryIdx];
    setCalls(ind.callVolume);
    setMissRate(ind.missRate);
    setJobValue(ind.avgJobValue);
    setConvRate(ind.conversionRate);
  }, [industryIdx]);

  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 180);
    return () => clearTimeout(t);
  }, [calls, missRate, jobValue, convRate]);

  const missedCalls = Math.round(calls * missRate);
  const neverCallBack = Math.round(missedCalls * 0.85);
  const monthlyLost = Math.round(neverCallBack * jobValue * convRate);
  const annualLost = monthlyLost * 12;

  const setupFee = 1500;
  const monthlyRetainer = 400;
  const annualInvestment = setupFee + monthlyRetainer * 12;
  const recoveryRate = 0.60;
  const monthlyRecovered = Math.round(neverCallBack * recoveryRate * jobValue * convRate);
  const annualRecovered = monthlyRecovered * 12;
  const netGain = annualRecovered - annualInvestment;
  const roiMultiple = (annualRecovered / annualInvestment).toFixed(1);
  const paybackMonths = monthlyRecovered > 0 ? Math.ceil(annualInvestment / monthlyRecovered) : "—";

  const C = {
    paper: "#faf9f6",
    paperDark: "#f3f1ec",
    ink: "#1a1917",
    ink2: "#3d3b36",
    ink3: "#6b6860",
    ink4: "#9c9a93",
    rule: "#e4e2dc",
    green: "#2d5a3d",
    greenLight: "#e8f0eb",
    red: "#8b2c1a",
    redLight: "#fdf0ee",
  };

  const sliderFill = (val, min, max) => ({
    background: `linear-gradient(to right, ${C.green} ${((val - min) / (max - min)) * 100}%, ${C.rule} ${((val - min) / (max - min)) * 100}%)`,
  });

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: C.paper, color: C.ink, minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=range] { -webkit-appearance: none; width: 100%; height: 2px; border-radius: 1px; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #2d5a3d; cursor: pointer; border: 2px solid #faf9f6; box-shadow: 0 0 0 1.5px #2d5a3d; }
        select { -webkit-appearance: none; appearance: none; }
        .num { transition: opacity 0.15s; opacity: 1; }
        .num.flash { opacity: 0.45; }
      `}</style>

      <div style={{ borderBottom: `1px solid ${C.ink}`, padding: "28px 32px 22px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink4, fontFamily: "'Inter', sans-serif", marginBottom: 6 }}>
            Quiet Dissent · Nashville
          </div>
          <h1 style={{ fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 400, color: C.ink, lineHeight: 1.25, letterSpacing: "-0.3px", fontStyle: "italic" }}>
            Revenue Leak Calculator
          </h1>
          <p style={{ marginTop: 10, color: C.ink3, fontSize: 14, lineHeight: 1.65, maxWidth: 500, fontFamily: "'Inter', sans-serif", fontStyle: "normal" }}>
            Enter your actual numbers. Every figure is sourced and auditable — no inflated vendor estimates.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "36px 24px 72px" }}>
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.ink4, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
            Industry
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={industryIdx}
              onChange={(e) => setIndustryIdx(Number(e.target.value))}
              style={{
                width: "100%",
                background: C.paper,
                border: `1px solid ${C.ink}`,
                color: C.ink,
                padding: "11px 40px 11px 14px",
                fontSize: 15,
                borderRadius: 0,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              {INDUSTRIES.map((ind, i) => (
                <option key={i} value={i}>
                  {ind.label}
                </option>
              ))}
            </select>
            <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: C.ink3, fontSize: 10 }}>
              ▼
            </div>
          </div>
          <p style={{ marginTop: 7, fontSize: 12, color: C.ink4, fontFamily: "'Inter', sans-serif" }}>
            Defaults are industry benchmarks. Adjust any slider to reflect your actual business.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 16, marginBottom: 36 }}>
          {[
            { label: "Monthly Inbound Calls", value: calls, min: 20, max: 500, step: 5, display: calls.toString(), onChange: setCalls, note: "Total calls your number receives each month" },
            { label: "Miss Rate", value: Math.round(missRate * 100), min: 10, max: 70, step: 1, display: pct(missRate), onChange: (v) => setMissRate(v / 100), note: "Industry range: 25–60%. Use your actual answer rate." },
            { label: "Avg Job / Appointment Value", value: jobValue, min: 50, max: 10000, step: 50, display: fmt(jobValue), onChange: setJobValue, note: "Revenue from a typical new customer transaction" },
            { label: "Call-to-Client Conversion Rate", value: Math.round(convRate * 100), min: 10, max: 90, step: 1, display: pct(convRate), onChange: (v) => setConvRate(v / 100), note: "Of callers who reach you, how many become clients?" },
          ].map((s) => (
            <div key={s.label} style={{ background: C.paperDark, border: `1px solid ${C.rule}`, padding: "18px 18px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: C.ink3, lineHeight: 1.3, maxWidth: "55%", fontFamily: "'Inter', sans-serif" }}>{s.label}</span>
                <span className={`num${flash ? " flash" : ""}`} style={{ fontSize: 20, color: C.ink, fontStyle: "italic" }}>
                  {s.display}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={s.value}
                onChange={(e) => s.onChange(Number(e.target.value))}
                style={sliderFill(s.value, s.min, s.max)}
              />
              <p style={{ marginTop: 8, fontSize: 11, color: C.ink4, lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>{s.note}</p>
            </div>
          ))}
        </div>

        <div style={{ border: `1px solid ${C.rule}`, background: C.paperDark, padding: "20px 22px", marginBottom: 22 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink4, marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>
            The Math — Step by Step
          </div>
          {[
            [`${calls} calls/mo × ${pct(missRate)} miss rate`, `${missedCalls} missed calls/mo`],
            [`${missedCalls} missed × 85% never call back`, `${neverCallBack} permanently lost/mo`],
            [`${neverCallBack} × ${fmt(jobValue)} avg value × ${pct(convRate)} close rate`, `${fmt(monthlyLost)}/mo in lost revenue`],
          ].map(([calc, result], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderBottom: i < 2 ? `1px solid ${C.rule}` : "none",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 13, color: C.ink3, fontFamily: "'Inter', sans-serif" }}>{calc}</span>
              <span className={`num${flash ? " flash" : ""}`} style={{ fontSize: 13, color: C.ink2, fontStyle: "italic" }}>
                {result}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Monthly Revenue Leaking Out", value: fmt(monthlyLost), big: false },
            { label: "Annual Revenue at Risk", value: fmt(annualLost), big: true },
          ].map((r) => (
            <div key={r.label} style={{ background: C.redLight, border: "1px solid #d4b0a8", padding: "18px" }}>
              <div style={{ fontSize: 10, color: "#9a6055", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
                {r.label}
              </div>
              <div className={`num${flash ? " flash" : ""}`} style={{ fontSize: r.big ? 32 : 24, color: C.red, fontStyle: "italic", lineHeight: 1 }}>
                {r.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: C.rule }} />
          <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink4, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
            ROI on Quiet Dissent
          </span>
          <div style={{ flex: 1, height: 1, background: C.rule }} />
        </div>

        <div style={{ background: C.greenLight, border: "1px solid #c0d8c8", padding: "12px 16px", marginBottom: 16, fontSize: 12, color: C.green, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
          <strong>Assumption:</strong> AI implementation recovers 60% of previously missed calls — a conservative estimate based on deployment data.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 22 }}>
          {[
            { label: "Annual Investment", value: fmt(annualInvestment), sub: "$1,500 setup + $400/mo" },
            { label: "Est. Annual Recovery", value: fmt(annualRecovered), sub: "at 60% capture rate" },
            { label: "Net First-Year Gain", value: netGain > 0 ? fmt(netGain) : "$0", sub: `${roiMultiple}× return` },
          ].map((r) => (
            <div key={r.label} style={{ background: C.greenLight, border: "1px solid #c0d8c8", padding: "14px 14px" }}>
              <div style={{ fontSize: 10, color: "#5a8060", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>
                {r.label}
              </div>
              <div className={`num${flash ? " flash" : ""}`} style={{ fontSize: 20, color: C.green, fontStyle: "italic", lineHeight: 1, marginBottom: 4 }}>
                {r.value}
              </div>
              <div style={{ fontSize: 11, color: "#7aaa88", fontFamily: "'Inter', sans-serif" }}>{r.sub}</div>
            </div>
          ))}
        </div>

        {monthlyRecovered > 0 && (
          <div style={{ border: `1px solid ${C.ink}`, padding: "16px 22px", marginBottom: 28, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div className={`num${flash ? " flash" : ""}`} style={{ fontSize: 42, color: C.ink, fontStyle: "italic", lineHeight: 1 }}>
              {paybackMonths}
            </div>
            <div>
              <div style={{ fontSize: 15, color: C.ink }}>months to full payback</div>
              <div style={{ fontSize: 12, color: C.ink3, marginTop: 3, fontFamily: "'Inter', sans-serif" }}>
                After that, {fmt(monthlyRecovered)}/mo in recovered revenue — every month.
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <button
            onClick={() => setShowSources(!showSources)}
            style={{
              background: "none",
              border: `1px solid ${C.rule}`,
              color: C.ink3,
              fontFamily: "inherit",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "7px 16px",
              cursor: "pointer",
            }}
          >
            {showSources ? "Hide" : "Show"} Data Sources & Methodology
          </button>
        </div>

        {showSources && (
          <div style={{ background: C.paperDark, border: `1px solid ${C.rule}`, padding: "20px 22px", marginBottom: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink4, marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>
              Sources & Assumptions
            </div>
            {SOURCE_NOTES.map((note, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: 10, fontSize: 12, color: C.ink3, lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
                <span style={{ color: C.ink4, flexShrink: 0, fontStyle: "italic" }}>{i + 1}.</span>
                {note}
              </div>
            ))}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.rule}`, fontSize: 12, color: C.ink4, fontStyle: "italic", fontFamily: "'Inter', sans-serif" }}>
              This calculator uses your own inputs, not blended averages. Every assumption is visible. If a prospect challenges a figure, show them this screen.
            </div>
          </div>
        )}

        <div style={{ borderTop: `1px solid ${C.ink}`, paddingTop: 20, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 15, color: C.ink, fontStyle: "italic" }}>Quiet Dissent</span>
          <span style={{ fontSize: 10, color: C.ink4, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
            Non-consensus decisions. Measurable outcomes.
          </span>
        </div>
      </div>
    </div>
  );
}