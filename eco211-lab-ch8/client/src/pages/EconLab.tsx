import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Award, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "recap" | "spectrum" | "conditions" | "profitmax" | "outcomes" | "longrun" | "quiz" | "results" | "not-yet";

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function shuffleOpts(opts: string[], correct: number | number[]): { opts: string[]; correct: number | number[] } {
  const idx = opts.map((_, i) => i);
  const s = shuffle(idx);
  const newOpts = s.map(i => opts[i]);
  if (Array.isArray(correct)) return { opts: newOpts, correct: (correct as number[]).map(c => s.indexOf(c)) };
  return { opts: newOpts, correct: s.indexOf(correct as number) };
}

// ─────────────────────────────────────────────
// Chapter Summary
// ─────────────────────────────────────────────
const CH8_SUMMARY = [
  {
    heading: "8.1 — Perfect Competition and Why It Matters",
    body: "A perfectly competitive firm is a price taker — it must accept the equilibrium price set by the market. Perfect competition requires: many sellers, identical products, easy entry and exit, and perfect information. Because no single firm controls price, the only decision is how much to produce. Long-run equilibrium occurs when all entry and exit has driven economic profits to zero.",
  },
  {
    heading: "8.2 — How Perfectly Competitive Firms Make Output Decisions",
    body: "Total revenue rises at a constant rate equal to the market price. Profits are maximized where Marginal Revenue (MR) equals Marginal Cost (MC). For a perfectly competitive firm, MR = Price. If Price > Average Cost at the profit-maximizing output, the firm earns profit. If Price = Average Cost, the firm earns zero economic profit (the break-even point). If Price < Average Cost but Price > Average Variable Cost, the firm operates at a loss in the short run. If Price < Average Variable Cost, the firm shuts down immediately (the shutdown point).",
  },
  {
    heading: "8.3 — Entry and Exit Decisions in the Long Run",
    body: "Profits attract new entrants; losses drive firms to exit. Through this process, price moves toward the zero-profit point (P = MC = AC at the minimum of the AC curve). The long-run supply curve shape depends on industry type: constant-cost industries have a flat long-run supply curve; increasing-cost industries slope upward; decreasing-cost industries slope downward.",
  },
  {
    heading: "8.4 — Efficiency in Perfectly Competitive Markets",
    body: "Long-run equilibrium in perfect competition achieves both productive efficiency (P = minimum AC — producing at lowest possible cost) and allocative efficiency (P = MC — resources go to their highest-valued uses, social benefit equals social cost). Perfect competition maximizes social welfare and serves as the benchmark against which other market structures are measured.",
  },
];

// ─────────────────────────────────────────────
// Summary Modal
// ─────────────────────────────────────────────
function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="summary-title">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 id="summary-title" className="text-lg font-bold text-foreground">📄 Chapter 8 Summary</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" aria-label="Close summary">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {CH8_SUMMARY.map((sec, i) => (
            <div key={i}>
              <h3 className="font-semibold text-primary mb-1">{sec.heading}</h3>
              <p className="text-sm text-foreground leading-relaxed">{sec.body}</p>
            </div>
          ))}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Access for free at{" "}
              <a href="https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction
              </a>
            </p>
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={onClose} className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition">
            Close &amp; Return to Lab
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 1 — Chapter 8 Recap (Ch7 review)
// ─────────────────────────────────────────────
const RECAP_QS = [
  {
    q: "Which of the following is an example of an implicit cost?",
    opts: ["Monthly rent paid to a landlord", "Wages paid to employees", "The salary the owner could have earned working elsewhere", "Cost of raw materials purchased"],
    correct: 2,
    exp: "Implicit costs are opportunity costs — resources the owner already owns that are used in the business. Foregone salary is a classic example.",
  },
  {
    q: "The law of diminishing marginal returns states that:",
    opts: ["Total output always falls when more workers are added", "As more variable inputs are added to a fixed input, marginal product eventually falls", "Long-run costs always increase with output", "Fixed costs rise when output increases"],
    correct: 1,
    exp: "Diminishing marginal returns is a short-run concept. Adding variable inputs (like labor) to a fixed input (like capital) eventually yields smaller increments of output.",
  },
  {
    q: "If Total Cost (TC) = $500 and output (Q) = 50 units, what is Average Total Cost (ATC)?",
    opts: ["$25,000", "$50", "$10", "$5"],
    correct: 2,
    exp: "ATC = TC ÷ Q = $500 ÷ 50 = $10 per unit.",
  },
  {
    q: "Which cost curve is U-shaped and crosses both AVC and ATC at their minimum points?",
    opts: ["Average Fixed Cost (AFC)", "Total Cost (TC)", "Marginal Cost (MC)", "Average Variable Cost (AVC)"],
    correct: 2,
    exp: "The Marginal Cost curve is U-shaped and intersects AVC at AVC's minimum and ATC at ATC's minimum — a key cost curve relationship.",
  },
  {
    q: "Economies of scale occur when:",
    opts: ["Long-Run Average Cost (LRAC) rises as output increases", "Long-Run Average Cost (LRAC) falls as output increases", "Marginal cost equals average total cost", "Fixed costs fall with higher output"],
    correct: 1,
    exp: "Economies of scale: as a firm grows, per-unit long-run costs fall — bigger scale = lower average costs. This is what makes natural monopolies possible.",
  },
];

function RecapStation({ onComplete }: { onComplete: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [marked, setMarked] = useState(false);

  const q = RECAP_QS[currentQ];
  const isChecked = !!checked[currentQ];
  const isCorrect = isChecked && answers[currentQ] === q.correct;
  const allChecked = RECAP_QS.every((_, i) => checked[i]);
  const score = RECAP_QS.filter((q, i) => answers[i] === q.correct).length;

  function handleSelect(oi: number) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [currentQ]: oi }));
  }

  function handleCheck() {
    if (answers[currentQ] === undefined) return;
    setChecked(prev => ({ ...prev, [currentQ]: true }));
  }

  function navDotStyle(i: number): string {
    if (i === currentQ) return "bg-primary";
    if (checked[i]) return answers[i] === RECAP_QS[i].correct ? "bg-emerald-400" : "bg-red-400";
    if (answers[i] !== undefined) return "bg-primary/40";
    return "bg-muted";
  }

  if (showResults) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-card border-2 border-border p-6 text-center">
          <div className="text-4xl font-bold text-foreground mb-2">{score} / {RECAP_QS.length}</div>
          <p className="text-sm text-muted-foreground">
            {score === RECAP_QS.length
              ? "Perfect! You're ready to dive in."
              : score >= 3
              ? "Good foundation — review any explanations you missed."
              : "Take another look at the explanations before moving on."}
          </p>
        </div>
        <div className="space-y-2">
          {RECAP_QS.map((q, i) => (
            <div key={i} className={`p-3 rounded-xl text-sm border-l-4 ${answers[i] === q.correct ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"}`}>
              <span className="font-bold">{answers[i] === q.correct ? "✓" : "✗"}</span>
              <span className="font-semibold text-foreground ml-1">Q{i+1}: </span>
              <span className="text-muted-foreground">{q.exp}</span>
            </div>
          ))}
        </div>
        {!marked ? (
          <button onClick={() => { setMarked(true); onComplete(); }}
            className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700">
            Mark Complete ✓
          </button>
        ) : (
          <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Question {currentQ + 1} of {RECAP_QS.length}</span>
        <span className="text-xs text-muted-foreground">{Object.keys(checked).length} / {RECAP_QS.length} checked</span>
      </div>

      <div className="flex gap-2">
        {RECAP_QS.map((_, i) => (
          <button key={i} onClick={() => setCurrentQ(i)}
            className={`flex-1 h-2 rounded-full transition-all ${navDotStyle(i)}`}
            aria-label={`Question ${i + 1}`} />
        ))}
      </div>

      <div className="rounded-xl bg-card border-2 border-border p-5">
        <p className="text-sm font-semibold text-foreground mb-4">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, i) => {
            const selected = answers[currentQ] === i;
            const isCorrectOpt = q.correct === i;
            let style = "border-border text-foreground hover:border-primary/40";
            if (isChecked) {
              if (isCorrectOpt) style = "bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-300";
              else if (selected) style = "bg-red-50 border-red-300 text-red-800";
              else style = "border-border text-foreground opacity-50";
            } else if (selected) {
              style = "bg-primary/10 border-primary text-foreground";
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={isChecked}
                className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${style} ${isChecked ? "cursor-default" : ""}`}>
                <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>
        {!isChecked && answers[currentQ] !== undefined && (
          <button onClick={handleCheck}
            className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check Answer
          </button>
        )}
        {isChecked && (
          <div className={`mt-4 p-3 rounded-xl text-sm ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
            <strong>{isCorrect ? "✓ Correct! " : "✗ Not quite. "}</strong>{q.exp}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          ← Previous
        </button>
        {currentQ < RECAP_QS.length - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Question →
          </button>
        ) : allChecked ? (
          <button onClick={() => setShowResults(true)}
            className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all">
            See Results →
          </button>
        ) : (
          <span className="text-xs text-muted-foreground">Check all answers to continue</span>
        )}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────
// Station 2 — Market Power Spectrum
// ─────────────────────────────────────────────
type PowerLevel = "none" | "low" | "moderate" | "high" | "total";
const POWER_LABELS: Record<PowerLevel, string> = { none: "No Control", low: "Low", moderate: "Moderate", high: "High", total: "Total Control" };
const POWER_COLORS: Record<PowerLevel, string> = {
  none: "border-blue-400 bg-blue-50 text-blue-800",
  low: "border-teal-400 bg-teal-50 text-teal-800",
  moderate: "border-amber-400 bg-amber-50 text-amber-800",
  high: "border-orange-400 bg-orange-50 text-orange-800",
  total: "border-red-500 bg-red-50 text-red-800",
};

const SPECTRUM_FIRMS = [
  { name: "A wheat farmer", correct: "none" as PowerLevel, exp: "Sells an identical commodity at the world market price — pure price taker." },
  { name: "A soybean farmer", correct: "none" as PowerLevel, exp: "Same as wheat — agricultural commodities are perfectly competitive." },
  { name: "Local farmer's market stall", correct: "low" as PowerLevel, exp: "Slight differentiation (freshness, location, personality) gives very limited pricing power." },
  { name: "Roadside produce stand", correct: "low" as PowerLevel, exp: "Convenience and local monopoly on a stretch of road gives a tiny pricing advantage." },
  { name: "Sportclips (hair salon chain)", correct: "moderate" as PowerLevel, exp: "Brand recognition and convenience give some pricing power, but many substitutes exist." },
  { name: "McDonald's", correct: "moderate" as PowerLevel, exp: "Brand loyalty and product differentiation give moderate pricing power — but fast food is competitive." },
  { name: "Domino's", correct: "moderate" as PowerLevel, exp: "Differentiated product and brand loyalty, but strong pizza competition limits pricing power." },
  { name: "Zara", correct: "moderate" as PowerLevel, exp: "Fast fashion brand with some differentiation, but many substitutes (H&M, ASOS, etc.)." },
  { name: "J. Crew", correct: "moderate" as PowerLevel, exp: "Premium positioning gives moderate pricing power within its market niche." },
  { name: "Nike", correct: "high" as PowerLevel, exp: "Strong brand identity and loyalty allow significant price premiums over generic alternatives." },
  { name: "Apple iPhone", correct: "high" as PowerLevel, exp: "Ecosystem lock-in and brand prestige give Apple substantial pricing power." },
  { name: "American Airlines", correct: "high" as PowerLevel, exp: "Oligopoly structure and hub dominance give airlines considerable pricing power on specific routes." },
  { name: "Boeing", correct: "high" as PowerLevel, exp: "Duopoly (Boeing + Airbus) — few competitors means significant pricing power in commercial aircraft." },
  { name: "Comporium (local cable)", correct: "high" as PowerLevel, exp: "Regional monopoly on cable/internet gives near-total pricing control in its service area." },
  { name: "York Natural Gas", correct: "total" as PowerLevel, exp: "Regulated utility monopoly — the only supplier; customers have no alternatives." },
  { name: "Duke Energy", correct: "total" as PowerLevel, exp: "Electric utility monopoly — price is controlled by regulation, not competition." },
  { name: "Google Search", correct: "total" as PowerLevel, exp: "Near-monopoly in search advertising (90%+ market share) — advertisers have almost no alternatives." },
];

const POWER_LEVELS: PowerLevel[] = ["none", "low", "moderate", "high", "total"];

function SpectrumStation({ onComplete }: { onComplete: () => void }) {
  const [choices, setChoices] = useState<Record<string, PowerLevel | null>>(() => Object.fromEntries(SPECTRUM_FIRMS.map(f => [f.name, null])));
  const [checked, setChecked] = useState(false);
  const [marked, setMarked] = useState(false);
  const allChosen = SPECTRUM_FIRMS.every(f => choices[f.name] !== null);
  const score = SPECTRUM_FIRMS.filter(f => choices[f.name] === f.correct).length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm font-semibold text-primary mb-1">The Market Power Spectrum</p>
        <p className="text-sm text-muted-foreground">For each firm, select where it falls on the spectrum from <strong>No Control</strong> (pure price taker) to <strong>Total Control</strong> (monopoly). Then check your answers.</p>
      </div>

      {/* Spectrum legend */}
      <div className="flex gap-1 flex-wrap">
        {POWER_LEVELS.map(lv => (
          <span key={lv} className={`px-2 py-1 rounded-full text-xs font-semibold border-2 ${POWER_COLORS[lv]}`}>{POWER_LABELS[lv]}</span>
        ))}
      </div>

      <div className="space-y-3">
        {SPECTRUM_FIRMS.map(firm => {
          const chosen = choices[firm.name];
          const isCorrect = checked && chosen === firm.correct;
          const isWrong = checked && chosen !== null && chosen !== firm.correct;
          return (
            <div key={firm.name} className={`rounded-xl border-2 p-3 transition-all ${checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-300 bg-red-50" : "border-border bg-card") : "border-border bg-card"}`}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-foreground">{firm.name}</span>
                {checked && isWrong && <span className="text-xs text-red-600 font-semibold">→ {POWER_LABELS[firm.correct]}</span>}
                {checked && isCorrect && <span className="text-xs text-green-700 font-semibold">✓ Correct</span>}
              </div>
              <div className="flex gap-1 flex-wrap" role="group" aria-label={`Market power for ${firm.name}`}>
                {POWER_LEVELS.map(lv => (
                  <button key={lv} onClick={() => { if (!checked) setChoices(prev => ({ ...prev, [firm.name]: lv })); }}
                    disabled={checked}
                    aria-pressed={chosen === lv}
                    className={`px-2 py-1 rounded-full text-xs font-semibold border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary
                      ${chosen === lv ? POWER_COLORS[lv] + " border-current" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                    {POWER_LABELS[lv]}
                  </button>
                ))}
              </div>
              {checked && <p className="text-xs mt-2 text-muted-foreground italic">{firm.exp}</p>}
            </div>
          );
        })}
      </div>

      {!checked ? (
        <button onClick={() => { if (allChosen) setChecked(true); }} disabled={!allChosen}
          className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          Check My Answers
        </button>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl bg-muted p-4 text-center">
            <p className="font-bold text-lg text-foreground">{score} / {SPECTRUM_FIRMS.length}</p>
            <p className="text-sm text-muted-foreground">{score >= 14 ? "Excellent feel for market power!" : score >= 10 ? "Good — review the explanations for any misses." : "Review the explanations — the spectrum has nuance."}</p>
          </div>
          {!marked && (
            <button onClick={() => { setMarked(true); onComplete(); }}
              className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700">
              Mark Complete ✓
            </button>
          )}
          {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 3 — 4 Conditions Checker
// ─────────────────────────────────────────────
const CONDITIONS = [
  { id: "many", label: "Many buyers & sellers (free entry/exit)" },
  { id: "identical", label: "Identical (homogeneous) products" },
  { id: "info", label: "Perfect information for all participants" },
  { id: "nobarrier", label: "No barriers to entry or exit" },
];

const CONDITION_SCENARIOS = [
  {
    market: "U.S. Wheat Market",
    desc: "Thousands of farmers grow wheat. Buyers can't tell which farm a bushel came from. Prices are posted publicly. Any farmer can enter or exit easily.",
    correct: ["many", "identical", "info", "nobarrier"],
    verdict: "Perfect Competition",
    exp: "All four conditions are met — wheat is the textbook example of a perfectly competitive market.",
  },
  {
    market: "Smartphone Market",
    desc: "Apple, Samsung, and Google dominate. Products are highly differentiated (iOS vs Android). Entering requires billions in R&D. Brand loyalty creates information asymmetry.",
    correct: [],
    verdict: "Not Perfectly Competitive",
    exp: "None of the four conditions are met — smartphones are differentiated, entry barriers are enormous, and the market is dominated by a handful of players.",
  },
  {
    market: "Stock Exchange (NYSE)",
    desc: "Millions of shares of identical stock trade daily. Prices are posted in real time. Anyone can buy or sell through a broker. No single buyer controls the market.",
    correct: ["many", "identical", "info", "nobarrier"],
    verdict: "Perfect Competition",
    exp: "Stock markets closely approximate perfect competition — identical shares, public price data, and free access through brokers.",
  },
  {
    market: "Local Coffee Shop Market",
    desc: "Many cafés in a city. Each has a unique menu, atmosphere, and brand. Location and décor create differentiation. Entry is relatively easy with moderate startup costs.",
    correct: ["many", "nobarrier"],
    verdict: "Monopolistic Competition",
    exp: "Many sellers and low entry barriers, but products are differentiated (not identical) and information about quality varies — this is monopolistic competition.",
  },
  {
    market: "Commercial Aircraft Manufacturing",
    desc: "Essentially two producers globally (Boeing and Airbus). Aircraft are highly specialized. Entry requires billions in capital and decades of expertise.",
    correct: [],
    verdict: "Oligopoly (Duopoly)",
    exp: "Only two major players, massive entry barriers, and products are differentiated — far from perfect competition.",
  },
];

function ConditionsStation({ onComplete }: { onComplete: () => void }) {
  const [scenIdx, setScenIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [doneScens, setDoneScens] = useState<number[]>([]);
  const [marked, setMarked] = useState(false);
  const scen = CONDITION_SCENARIOS[scenIdx];

  function toggle(id: string) {
    if (checked) return;
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function checkAnswers() { setChecked(true); }

  function nextScen() {
    setDoneScens(prev => [...prev, scenIdx]);
    const next = CONDITION_SCENARIOS.findIndex((_, i) => i > scenIdx && !doneScens.includes(i));
    if (next !== -1) { setScenIdx(next); setSelected([]); setChecked(false); }
  }

  const allDone = doneScens.length === CONDITION_SCENARIOS.length - 1 && checked;

  const isCorrect = (id: string) => scen.correct.includes(id);
  const wasSelected = (id: string) => selected.includes(id);

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {CONDITION_SCENARIOS.map((s, i) => (
          <button key={i} onClick={() => { if (!checked || doneScens.includes(i)) { setScenIdx(i); setSelected([]); setChecked(false); } }}
            className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition ${i === scenIdx ? "border-primary bg-primary text-primary-foreground" : doneScens.includes(i) ? "border-green-500 bg-green-100 text-green-800" : "border-border text-muted-foreground"}`}>
            {i + 1}. {s.market}
          </button>
        ))}
      </div>

      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
        <p className="font-semibold text-primary text-sm mb-1">{scen.market}</p>
        <p className="text-sm text-foreground">{scen.desc}</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground mb-3">Which conditions of perfect competition does this market meet? (Check all that apply — or none if none apply.)</p>
        <div className="space-y-2">
          {CONDITIONS.map(c => {
            const sel = wasSelected(c.id);
            const correct = isCorrect(c.id);
            let cls = "border-border text-foreground hover:border-primary/40";
            if (checked) {
              if (correct && sel) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
              else if (correct && !sel) cls = "border-green-400 bg-green-50 text-green-700"; // missed correct
              else if (!correct && sel) cls = "border-red-400 bg-red-100 text-red-700"; // wrong selection
            } else if (sel) cls = "border-primary bg-primary/10 text-primary font-semibold";
            return (
              <button key={c.id} onClick={() => toggle(c.id)}
                disabled={checked}
                aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                {checked && correct && sel && "✓ "}{checked && !correct && sel && "✗ "}{c.label}
                {checked && correct && !sel && <span className="ml-2 text-xs text-green-600 font-semibold">(This condition IS met — you missed it)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {checked && (
        <div className="rounded-xl bg-muted p-4 space-y-1">
          <p className="font-bold text-foreground">Verdict: {scen.verdict}</p>
          <p className="text-sm text-muted-foreground">{scen.exp}</p>
        </div>
      )}

      {!checked ? (
        <button onClick={checkAnswers}
          className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          Check This Market
        </button>
      ) : (
        <div className="space-y-3">
          {scenIdx < CONDITION_SCENARIOS.length - 1 && !doneScens.includes(scenIdx) && (
            <button onClick={nextScen}
              className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              Next Market →
            </button>
          )}
          {(allDone || (doneScens.length >= CONDITION_SCENARIOS.length - 1 && checked)) && !marked && (
            <button onClick={() => { setMarked(true); onComplete(); }}
              className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700">
              Mark Complete ✓
            </button>
          )}
          {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 4 — MR = MC Profit Maximizer
// ─────────────────────────────────────────────
// Raspberry farm data: Q, TC
const FARM_DATA = [
  { q: 0,   tc: 62  },
  { q: 10,  tc: 90  },
  { q: 20,  tc: 100 },
  { q: 30,  tc: 107 },
  { q: 40,  tc: 115 },
  { q: 50,  tc: 126 },
  { q: 60,  tc: 150 },
  { q: 70,  tc: 166 },
  { q: 80,  tc: 230 },
  { q: 90,  tc: 340 },
  { q: 100, tc: 490 },
  { q: 110, tc: 700 },
  { q: 120, tc: 1100 },
];

function ProfitMaxStation({ onComplete }: { onComplete: () => void }) {
  const PRICE = 4.00;
  const [selectedQ, setSelectedQ] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [correct, setCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [marked, setMarked] = useState(false);
  const [showProfit, setShowProfit] = useState(false);

  // Compute rows
  const rows = FARM_DATA.map((row, i) => {
    const tr = row.q * PRICE;
    const mc = i === 0 ? null : (FARM_DATA[i].tc - FARM_DATA[i - 1].tc) / (FARM_DATA[i].q - FARM_DATA[i - 1].q);
    const profit = tr - row.tc;
    return { ...row, tr, mc, profit };
  });

  // Profit-maximizing Q: at Q=70, MC=$1.60 < MR=$4.00; at Q=80, MC=$6.40 > MR=$4.00 → stop at Q=70, profit=$114
  const CORRECT_Q = 70;

  function handleSelect(q: number) {
    if (correct) return;
    setSelectedQ(q);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (q === CORRECT_Q) {
      setFeedback("✓ Correct! At Q = 70, MC ($1.60) < MR ($4.00), and at Q = 80, MC ($6.40) > MR ($4.00). So Q = 70 is the last unit worth producing — profit is maximized at $114.");
      setCorrect(true);
      setShowProfit(true);
    } else {
      const row = rows.find(r => r.q === q)!;
      const profit = row.profit;
      if (newAttempts === 1) setFeedback(`Not quite. At Q = ${q}, profit = TR ($${row.tr.toFixed(0)}) − TC ($${row.tc}) = $${profit.toFixed(0)}. Look for the row where profit is highest and where MC crosses above MR = $${PRICE.toFixed(2)}.`);
      else if (newAttempts === 2) { setFeedback(`Try once more. Hint: Compare MC to MR = $${PRICE.toFixed(2)} in each row. Produce as long as MC < MR, stop when MC exceeds MR.`); setShowHint(true); }
      else { setFeedback(`The profit-maximizing output is Q = ${CORRECT_Q}. At Q = 70, MC ($1.60) is still below MR ($4.00). At Q = 80, MC ($6.40) exceeds MR ($4.00) — so stop at Q = 70. Profit = $114.`); setCorrect(true); }
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm font-semibold text-primary mb-1">🍇 The Raspberry Farm</p>
        <p className="text-sm text-muted-foreground">The market price of raspberries is <strong>${PRICE.toFixed(2)}/pack</strong>. MR = Price = ${PRICE.toFixed(2)} for every unit sold.</p>
        <p className="text-sm text-muted-foreground mt-1">Review the table below and click the row where the farm <strong>maximizes profit (MR = MC)</strong>. The Profit column will reveal once you find the correct row.</p>
      </div>

      {showHint && !correct && (
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-sm text-amber-800">
          💡 Hint: Compare MC to MR ($4.00) row by row. Produce as long as MC &lt; MR. Stop when MC exceeds MR.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-3 py-2 text-left rounded-tl-lg">Qty (Q)</th>
              <th className="px-3 py-2 text-right">Total Cost (TC)</th>
              <th className="px-3 py-2 text-right">Total Revenue (TR)</th>
              <th className="px-3 py-2 text-right">MR</th>
              <th className="px-3 py-2 text-right">MC</th>
              {showProfit && <th className="px-3 py-2 text-right rounded-tr-lg">Profit (TR−TC)</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isSelected = selectedQ === row.q;
              const isCorrectRow = row.q === CORRECT_Q;
              let rowCls = i % 2 === 0 ? "bg-card" : "bg-muted/30";
              if (correct && isCorrectRow) rowCls = "bg-green-100 border-l-4 border-l-green-500";
              else if (!correct && isSelected) rowCls = "bg-primary/10 border-l-4 border-l-primary";
              return (
                <tr key={row.q} onClick={() => { if (row.q > 0) handleSelect(row.q); }}
                  className={`${rowCls} ${row.q > 0 && !correct ? "cursor-pointer hover:bg-primary/5 transition" : ""}`}>
                  <td className="px-3 py-2 font-semibold text-foreground">{row.q}</td>
                  <td className="px-3 py-2 text-right text-foreground">${row.tc}</td>
                  <td className="px-3 py-2 text-right text-foreground">${row.tr.toFixed(0)}</td>
                  <td className="px-3 py-2 text-right text-foreground">${PRICE.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right text-foreground">{row.mc !== null ? `$${row.mc.toFixed(2)}` : "—"}</td>
                  {showProfit && <td className={`px-3 py-2 text-right font-semibold ${row.profit >= 0 ? "text-green-700" : "text-red-600"}`}>${row.profit.toFixed(0)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {feedback && (
        <div className={`rounded-xl p-4 text-sm font-medium ${correct ? "bg-green-50 border border-green-400 text-green-800" : "bg-amber-50 border border-amber-300 text-amber-800"}`} role="alert" aria-live="polite">
          {feedback}
        </div>
      )}

      {correct && !marked && (
        <button onClick={() => { setMarked(true); onComplete(); }}
          className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700">
          Mark Complete ✓
        </button>
      )}
      {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 5 — Outcomes Classifier
// ─────────────────────────────────────────────
type OutcomeZone = "profit" | "loss-operate" | "shutdown";
const OUTCOME_LABELS: Record<OutcomeZone, string> = {
  "profit": "Earning Profit",
  "loss-operate": "Loss — Keep Operating",
  "shutdown": "Shutdown Immediately",
};
const OUTCOME_COLORS: Record<OutcomeZone, string> = {
  "profit": "border-green-500 bg-green-50 text-green-800",
  "loss-operate": "border-amber-400 bg-amber-50 text-amber-800",
  "shutdown": "border-red-500 bg-red-50 text-red-800",
};

const OUTCOME_ROUNDS = [
  { price: 5.00, ac: 3.50, avc: 2.00, q: 75, correct: "profit" as OutcomeZone, exp: "Price ($5.00) > AC ($3.50) → Profit Zone. The firm earns $1.50 per unit in economic profit." },
  { price: 3.00, ac: 3.00, avc: 2.20, q: 70, correct: "profit" as OutcomeZone, exp: "Price ($3.00) = AC ($3.00) → Break-Even Point. Zero economic profit, but still technically 'earning profit' in the accounting sense. Firm is covering all costs." },
  { price: 2.50, ac: 3.50, avc: 2.20, q: 65, correct: "loss-operate" as OutcomeZone, exp: "Price ($2.50) < AC ($3.50) → Loss. But Price ($2.50) > AVC ($2.20) → Keep operating short run. The firm covers variable costs and contributes something toward fixed costs." },
  { price: 1.50, ac: 3.50, avc: 2.20, q: 60, correct: "shutdown" as OutcomeZone, exp: "Price ($1.50) < AVC ($2.20) → Shutdown immediately. The firm can't even cover its variable costs — every unit produced deepens the loss." },
  { price: 4.00, ac: 4.80, avc: 3.20, q: 80, correct: "loss-operate" as OutcomeZone, exp: "Price ($4.00) < AC ($4.80) → Loss. But Price ($4.00) > AVC ($3.20) → Keep operating. Variable costs are covered; fixed costs are partially covered." },
  { price: 6.50, ac: 5.00, avc: 3.00, q: 90, correct: "profit" as OutcomeZone, exp: "Price ($6.50) > AC ($5.00) → Strong Profit Zone. The firm earns $1.50/unit in economic profit." },
  { price: 2.80, ac: 4.00, avc: 3.10, q: 55, correct: "shutdown" as OutcomeZone, exp: "Price ($2.80) < AVC ($3.10) → Shutdown. The firm loses money on every unit it produces, even before fixed costs." },
];

function OutcomesStation({ onComplete }: { onComplete: () => void }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [choice, setChoice] = useState<OutcomeZone | null>(null);
  const [checked, setChecked] = useState(false);
  const [doneRounds, setDoneRounds] = useState<number[]>([]);
  const [marked, setMarked] = useState(false);
  const round = OUTCOME_ROUNDS[roundIdx];
  const allDone = doneRounds.length >= OUTCOME_ROUNDS.length - 1 && checked;

  function nextRound() {
    setDoneRounds(prev => [...prev, roundIdx]);
    const next = OUTCOME_ROUNDS.findIndex((_, i) => i > roundIdx && !doneRounds.includes(i));
    if (next !== -1) { setRoundIdx(next); setChoice(null); setChecked(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {OUTCOME_ROUNDS.map((_, i) => (
          <span key={i} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold border-2 ${i === roundIdx ? "border-primary bg-primary text-primary-foreground" : doneRounds.includes(i) ? "border-green-500 bg-green-100 text-green-800" : "border-border text-muted-foreground"}`}>{i + 1}</span>
        ))}
      </div>

      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
        <p className="text-sm font-semibold text-primary mb-3">Scenario {roundIdx + 1} of {OUTCOME_ROUNDS.length}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground mb-1">Market Price (P)</p>
            <p className="text-2xl font-bold text-foreground">${round.price.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground mb-1">Avg Total Cost (AC)</p>
            <p className="text-2xl font-bold text-foreground">${round.ac.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground mb-1">Avg Variable Cost (AVC)</p>
            <p className="text-2xl font-bold text-foreground">${round.avc.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground mb-1">Output (Q)</p>
            <p className="text-2xl font-bold text-foreground">{round.q}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground mb-2">What should this firm do?</p>
        <div className="space-y-2">
          {(["profit", "loss-operate", "shutdown"] as OutcomeZone[]).map(zone => {
            const sel = choice === zone;
            const isCorrect = checked && zone === round.correct;
            const isWrong = checked && sel && zone !== round.correct;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (checked) {
              if (isCorrect) cls = OUTCOME_COLORS[zone];
              else if (isWrong) cls = "border-red-400 bg-red-50 text-red-700";
              else if (zone === round.correct) cls = OUTCOME_COLORS[zone];
            }
            return (
              <button key={zone} onClick={() => { if (!checked) setChoice(zone); }}
                disabled={checked}
                aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                {OUTCOME_LABELS[zone]}
                {checked && zone === round.correct && <span className="ml-2 text-xs font-semibold">(Correct answer)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {checked && (
        <div className="rounded-xl bg-muted p-4 text-sm text-foreground" role="alert">
          <p className="font-semibold mb-1">{choice === round.correct ? "✓ Correct!" : "Not quite."}</p>
          <p className="text-muted-foreground">{round.exp}</p>
        </div>
      )}

      {!checked ? (
        <button onClick={() => { if (choice) setChecked(true); }} disabled={!choice}
          className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          Check Answer
        </button>
      ) : (
        <div className="space-y-3">
          {roundIdx < OUTCOME_ROUNDS.length - 1 && !doneRounds.includes(roundIdx) && (
            <button onClick={nextRound}
              className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              Next Scenario →
            </button>
          )}
          {(allDone || (doneRounds.length >= OUTCOME_ROUNDS.length - 1 && checked)) && !marked && (
            <button onClick={() => { setMarked(true); onComplete(); }}
              className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700">
              Mark Complete ✓
            </button>
          )}
          {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 6 — Long-Run Entry & Exit Simulator
// ─────────────────────────────────────────────
const LR_STEPS = [
  {
    title: "Step 1: A Profitable Industry",
    desc: "Suppose the market price for raspberries rises to $6/pack. At this price, existing firms earn positive economic profit (P > AC). What happens next?",
    question: "When firms earn positive economic profit, what do new firms do?",
    opts: ["Exit the industry", "Enter the industry", "Raise prices further", "Reduce output"],
    correct: 1,
    exp: "Profit is a signal! New firms enter to capture those above-normal returns. This is the core of the entry mechanism.",
    visual: { firms: 5, price: 6.0, profit: "positive", direction: "entry" },
  },
  {
    title: "Step 2: Entry Drives Down Price",
    desc: "New firms enter, increasing market supply. What happens?",
    question: "As more firms enter and supply increases, what happens to the market price?",
    opts: ["It rises", "It falls", "It stays the same", "It becomes zero immediately"],
    correct: 1,
    exp: "More supply shifts the supply curve right, which lowers the equilibrium price. Each existing firm now earns less profit.",
    visual: { firms: 12, price: 4.5, profit: "shrinking", direction: "entry" },
  },
  {
    title: "Step 3: Long-Run Equilibrium",
    desc: "Entry continues until price equals Average Cost (AC). What happens?",
    question: "At long-run equilibrium in a perfectly competitive market, economic profit equals:",
    opts: ["Maximum profit", "Zero", "Normal profit only", "Accounting profit"],
    correct: 1,
    exp: "Long-run equilibrium: P = MR = MC = AC. Zero economic profit means all opportunity costs are covered — a normal return, but nothing extra.",
    visual: { firms: 20, price: 4.0, profit: "zero", direction: "stable" },
  },
  {
    title: "Step 4: What If Losses Occur?",
    desc: "Now suppose market demand falls and price drops to $2/pack — below AC. Firms are losing money. What happens?",
    question: "When firms suffer economic losses in the long run, what do they do?",
    opts: ["Enter the market", "Exit the market", "Increase production", "Lobby for higher prices"],
    correct: 1,
    exp: "Losses drive exit. Firms leave until supply falls enough that price rises back to the zero-profit point.",
    visual: { firms: 20, price: 2.0, profit: "negative", direction: "exit" },
  },
  {
    title: "Step 5: Industry Types",
    desc: "The long-run supply curve depends on whether input costs change as the industry expands.",
    question: "In an increasing-cost industry, what happens to long-run price as the industry expands?",
    opts: ["Price falls (economies of scale)", "Price stays constant", "Price rises (scarce inputs get more expensive)", "Price is set by the government"],
    correct: 2,
    exp: "Increasing-cost industries: as more firms enter and demand more inputs (like land or specialized labor), input prices rise, pushing AC up. The long-run supply curve slopes upward.",
    visual: null,
    table: [
      { type: "Constant-Cost", what: "Input prices unchanged as industry grows", lrs: "Flat (horizontal)", example: "Many agricultural goods" },
      { type: "Increasing-Cost", what: "Input prices rise as industry grows", lrs: "Upward sloping", example: "Oil drilling, skilled trades" },
      { type: "Decreasing-Cost", what: "Input prices fall as industry grows (scale economies in inputs)", lrs: "Downward sloping", example: "Tech manufacturing, solar panels" },
    ],
  },
];

function LongRunStation({ onComplete }: { onComplete: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const [marked, setMarked] = useState(false);
  const step = LR_STEPS[stepIdx];
  const allDone = doneSteps.length >= LR_STEPS.length - 1 && checked;

  function nextStep() {
    setDoneSteps(prev => [...prev, stepIdx]);
    if (stepIdx < LR_STEPS.length - 1) { setStepIdx(stepIdx + 1); setChoice(null); setChecked(false); }
  }

  // Simple firm visualizer
  function FirmDots({ count, price, profit }: { count: number; price: number; profit: string }) {
    const color = profit === "positive" ? "#16a34a" : profit === "zero" ? "#2563eb" : profit === "shrinking" ? "#d97706" : "#dc2626";
    return (
      <div className="rounded-xl bg-slate-50 border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Market Firms</span>
          <span className="text-xs font-semibold" style={{ color }}>{profit === "positive" ? "📈 Profit" : profit === "zero" ? "⚖️ Zero Profit" : profit === "shrinking" ? "📉 Shrinking Profit" : "🔴 Loss"}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {Array.from({ length: Math.min(count, 25) }).map((_, i) => (
            <div key={i} className="w-5 h-5 rounded-full" style={{ backgroundColor: color, opacity: 0.7 }} title="Firm" />
          ))}
          {count > 25 && <span className="text-xs text-muted-foreground self-center">+{count - 25} more</span>}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{count} firms in market</span>
          <span>Market price: ${price.toFixed(2)}/pack</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Step progress */}
      <div className="flex gap-1 flex-wrap">
        {LR_STEPS.map((s, i) => (
          <span key={i} className={`px-2 py-1 rounded-full text-xs font-semibold border-2 transition ${i === stepIdx ? "border-primary bg-primary text-primary-foreground" : doneSteps.includes(i) ? "border-green-500 bg-green-100 text-green-800" : "border-border text-muted-foreground"}`}>
            Step {i + 1}
          </span>
        ))}
      </div>

      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="font-semibold text-primary mb-1">{step.title}</p>
        <p className="text-sm text-foreground">{step.desc}</p>
      </div>

      {step.visual && (
        <FirmDots count={step.visual.firms} price={step.visual.price} profit={step.visual.profit} />
      )}

      {step.table && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-3 py-2 text-left">Industry Type</th>
                <th className="px-3 py-2 text-left">As Industry Expands…</th>
                <th className="px-3 py-2 text-left">LR Supply Curve</th>
                <th className="px-3 py-2 text-left">Example</th>
              </tr>
            </thead>
            <tbody>
              {step.table.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                  <td className="px-3 py-2 font-semibold text-foreground">{row.type}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.what}</td>
                  <td className="px-3 py-2 text-foreground">{row.lrs}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-foreground mb-2">{step.question}</p>
        <div className="space-y-2">
          {step.opts.map((opt, oi) => {
            const sel = choice === oi;
            const isCorrect = checked && oi === step.correct;
            const isWrong = checked && sel && oi !== step.correct;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (checked) {
              if (isCorrect) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
              else if (isWrong) cls = "border-red-400 bg-red-100 text-red-700";
            }
            return (
              <button key={oi} onClick={() => { if (!checked) setChoice(oi); }}
                disabled={checked}
                aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                {checked && isCorrect && "✓ "}{opt}
              </button>
            );
          })}
        </div>
      </div>

      {checked && (
        <div className="rounded-xl bg-muted p-4 text-sm" role="alert">
          <p className="font-semibold text-foreground mb-1">{choice === step.correct ? "✓ Correct!" : "Not quite."}</p>
          <p className="text-muted-foreground">{step.exp}</p>
        </div>
      )}

      {!checked ? (
        <button onClick={() => { if (choice !== null) setChecked(true); }} disabled={choice === null}
          className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          Check Answer
        </button>
      ) : (
        <div className="space-y-3">
          {stepIdx < LR_STEPS.length - 1 && !doneSteps.includes(stepIdx) && (
            <button onClick={nextStep}
              className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              Next Step →
            </button>
          )}
          {(allDone || (doneSteps.length >= LR_STEPS.length - 1 && checked)) && !marked && (
            <button onClick={() => { setDoneSteps(prev => prev.includes(stepIdx) ? prev : [...prev, stepIdx]); setMarked(true); onComplete(); }}
              className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700">
              Mark Complete ✓
            </button>
          )}
          {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Quiz
// ─────────────────────────────────────────────
const QUIZ_BANK = [
  {
    q: "A perfectly competitive firm is best described as a:",
    opts: ["Price maker — it sets the market price", "Price taker — it must accept the market price", "Price leader — it influences what rivals charge", "Price discriminator — it charges different prices to different buyers"],
    correct: 1,
    multi: false,
    exp: "In perfect competition, no single firm is large enough to affect the market price. Each firm takes the price as given.",
  },
  {
    q: "Which of the following is NOT a characteristic of perfect competition?",
    opts: ["Many buyers and sellers", "Differentiated products", "Free entry and exit", "Perfect information"],
    correct: 1,
    multi: false,
    exp: "Perfect competition requires identical (homogeneous) products. Product differentiation is a characteristic of monopolistic competition, not perfect competition.",
  },
  {
    q: "For a perfectly competitive firm, Marginal Revenue (MR) equals:",
    opts: ["Average Total Cost (ATC)", "Marginal Cost (MC)", "The market price (P)", "Total Revenue divided by quantity"],
    correct: 2,
    multi: false,
    exp: "For a price taker, each additional unit sold adds exactly the market price to revenue. So MR = P always.",
  },
  {
    q: "The profit-maximizing rule for any firm is to produce where:",
    opts: ["Total Revenue is maximized", "MR = MC", "Price equals Average Fixed Cost", "Marginal Cost is at its minimum"],
    correct: 1,
    multi: false,
    exp: "Profit is maximized (or loss minimized) at the quantity where MR = MC. Producing beyond this point would cost more than it earns.",
  },
  {
    q: "If a perfectly competitive firm's market price falls below its Average Variable Cost (AVC) at the profit-maximizing output, the firm should:",
    opts: ["Continue producing — it will break even eventually", "Raise its price above AVC", "Shut down immediately", "Reduce output but keep producing"],
    correct: 2,
    multi: false,
    exp: "If P < AVC, the firm can't even cover its variable costs. Every unit produced deepens the loss. Immediate shutdown minimizes losses.",
  },
  {
    q: "At the break-even point for a perfectly competitive firm:",
    opts: ["The firm earns maximum economic profit", "Price equals Average Total Cost and economic profit is zero", "The firm is about to shut down", "Price equals Average Variable Cost"],
    correct: 1,
    multi: false,
    exp: "The break-even point is where MC crosses AC at AC's minimum. P = AC → zero economic profit. All costs (including opportunity costs) are covered.",
  },
  {
    q: "In the long run, if firms in a perfectly competitive industry are earning positive economic profit, we expect:",
    opts: ["Existing firms to reduce output", "New firms to enter, increasing supply and lowering price", "The government to intervene and set a price ceiling", "Firms to merge into larger monopolies"],
    correct: 1,
    multi: false,
    exp: "Profit is a signal that attracts new entrants. New firms enter, supply rises, price falls, and profit is eventually competed away.",
  },
  {
    q: "Long-run equilibrium in a perfectly competitive market is characterized by:",
    opts: ["P > MC, creating deadweight loss", "Firms earning positive economic profit", "P = MR = MC = AC and zero economic profit", "High barriers to entry preventing new firms"],
    correct: 2,
    multi: false,
    exp: "P = MR = MC = AC is the long-run equilibrium condition. Zero economic profit, productive efficiency (P = min AC), and allocative efficiency (P = MC) all hold.",
  },
  {
    q: "Which of the following are conditions for productive AND allocative efficiency in perfect competition? (Select all that apply)",
    opts: ["Price equals minimum Average Cost (productive efficiency)", "Price equals Marginal Cost (allocative efficiency)", "Firms earn positive economic profit", "Resources are allocated to their highest-valued uses"],
    correct: [0, 1, 3],
    multi: true,
    exp: "Productive efficiency: P = minimum AC (lowest possible cost). Allocative efficiency: P = MC (social benefit = social cost). Both together mean resources go to highest-valued uses.",
  },
  {
    q: "Which of the following are examples of markets that closely approximate perfect competition? (Select all that apply)",
    opts: ["Wheat farming", "Smartphone manufacturing", "Foreign currency exchange", "Shares of identical stock on the NYSE"],
    correct: [0, 2, 3],
    multi: true,
    exp: "Agricultural commodities, currency exchange, and identical stock shares are the classic near-perfect-competition examples. Smartphone manufacturing is an oligopoly with highly differentiated products.",
  },
];

function QuizStation({ onPass, onFail }: { onPass: (score: number, results: { correct: boolean; exp: string }[]) => void; onFail: (score: number, results: { correct: boolean; exp: string }[]) => void }) {
  const [questions] = useState(() => shuffle(QUIZ_BANK).map(q => {
    const s = shuffleOpts(q.opts, q.correct);
    return { ...q, opts: s.opts, correct: s.correct };
  }));
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalResults, setFinalResults] = useState<{ correct: boolean; exp: string }[]>([]);

  const q = questions[currentQ];
  const isChecked = !!checked[currentQ];

  function isAnswerCorrect(qIdx: number): boolean {
    const question = questions[qIdx];
    const given = answers[qIdx];
    if (question.multi) {
      const correct = (question.correct as number[]).slice().sort().join(",");
      const userArr = Array.isArray(given) ? (given as number[]).slice().sort().join(",") : "";
      return correct === userArr;
    }
    return given === question.correct;
  }

  function hasSelection(qIdx: number): boolean {
    const given = answers[qIdx];
    if (questions[qIdx].multi) return Array.isArray(given) && (given as number[]).length > 0;
    return given !== undefined;
  }

  function handleSelect(idx: number) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [currentQ]: idx }));
  }

  function handleToggle(idx: number) {
    if (isChecked) return;
    setAnswers(prev => {
      const curr = (prev[currentQ] as number[] | undefined) ?? [];
      return { ...prev, [currentQ]: curr.includes(idx) ? curr.filter(x => x !== idx) : [...curr, idx] };
    });
  }

  function handleCheck() {
    if (!hasSelection(currentQ)) return;
    setChecked(prev => ({ ...prev, [currentQ]: true }));
  }

  const allAnswered = questions.every((_, i) => hasSelection(i));

  function handleSubmit() {
    const results = questions.map((q, i) => ({ correct: isAnswerCorrect(i), exp: q.exp }));
    const score = results.filter(r => r.correct).length;
    setFinalScore(score);
    setFinalResults(results);
    setSubmitted(true);
    if (score >= 9) onPass(score, results);
    else onFail(score, results);
  }

  const isCorrectForQ = isChecked && isAnswerCorrect(currentQ);

  function optionStyle(i: number): string {
    const correctAnswers = q.multi ? (q.correct as number[]) : [q.correct as number];
    const userAnswer = answers[currentQ];
    const userSelected = q.multi ? (Array.isArray(userAnswer) && (userAnswer as number[]).includes(i)) : userAnswer === i;
    const isInCorrectSet = correctAnswers.includes(i);
    if (!isChecked) return userSelected ? "bg-primary/10 border-primary text-foreground" : "border-border text-foreground hover:border-primary/40";
    if (isInCorrectSet) return "bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-300";
    if (userSelected && !isInCorrectSet) return "bg-red-50 border-red-300 text-red-800";
    return "border-border text-foreground opacity-50";
  }

  function navDotStyle(i: number): string {
    if (i === currentQ) return "bg-primary";
    if (checked[i]) return isAnswerCorrect(i) ? "bg-emerald-400" : "bg-red-400";
    if (hasSelection(i)) return "bg-primary/40";
    return "bg-muted";
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Question {currentQ + 1} of {questions.length}</span>
        <span className="text-xs text-muted-foreground">{Object.keys(checked).length} / {questions.length} checked</span>
      </div>

      <div className="flex gap-2">
        {questions.map((_, i) => (
          <button key={i} onClick={() => setCurrentQ(i)}
            className={`flex-1 h-2 rounded-full transition-all ${navDotStyle(i)}`}
            aria-label={`Question ${i + 1}`} />
        ))}
      </div>

      <div className="rounded-xl bg-card border-2 border-border p-5">
        {q.multi && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Select ALL that apply</span>
          </div>
        )}
        <p className="text-sm font-semibold text-foreground mb-4">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, i) => {
            const userAnswer = answers[currentQ];
            const isSelected = q.multi ? (Array.isArray(userAnswer) && (userAnswer as number[]).includes(i)) : userAnswer === i;
            if (q.multi) {
              return (
                <button key={i} onClick={() => handleToggle(i)} disabled={isChecked}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all flex items-start gap-3 ${optionStyle(i)} ${isChecked ? "cursor-default" : ""}`}>
                  <span className={`shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? "bg-primary border-primary text-white" : "border-current opacity-50"}`}>
                    {isSelected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </span>
                  <span><span className="font-semibold mr-1">{String.fromCharCode(65 + i)}.</span>{opt}</span>
                </button>
              );
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={isChecked}
                className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${optionStyle(i)} ${isChecked ? "cursor-default" : ""}`}>
                <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>

        {!isChecked && hasSelection(currentQ) && (
          <button onClick={handleCheck}
            className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check Answer
          </button>
        )}
        {isChecked && (
          <div className={`mt-4 p-3 rounded-xl text-sm ${isCorrectForQ ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"} text-foreground`}>
            <strong>{isCorrectForQ ? "✓ Correct! " : "✗ Not quite. "}</strong>{q.exp}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          ← Previous
        </button>
        {currentQ < questions.length - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Question →
          </button>
        ) : allAnswered ? (
          <button onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all">
            Submit Quiz
          </button>
        ) : (
          <span className="text-xs text-muted-foreground">Answer all questions to submit</span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Not Yet Screen
// ─────────────────────────────────────────────
function NotYetScreen({ score, onRetry }: { score: number; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#fef3c7" }}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-5">
        <div className="text-5xl">📖</div>
        <h2 className="text-2xl font-bold text-amber-800">Not Yet</h2>
        <p className="text-amber-700 font-medium">You scored {score} out of 10.</p>
        <p className="text-sm text-amber-700">Mastery requires 9 out of 10. Review the stations and try again.</p>
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 text-sm text-amber-800 font-semibold">
          This screen cannot be submitted. Only the final Results screen counts.
        </div>
        <button onClick={onRetry} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700">
          <RotateCcw className="inline w-4 h-4 mr-2" />Retry Quiz
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Results Screen
// ─────────────────────────────────────────────
function ResultsScreen({ score, results, onRetry }: { score: number; results: { correct: boolean; exp: string }[]; onRetry: () => void }) {
  const [reflection, setReflection] = useState("");
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const [studentName, setStudentName] = useState("");
  const pct = Math.round((score / 10) * 100);
  const grade =
    score === 10 ? { label: "Excellent",    color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", msg: "Perfect score! You've mastered the key concepts." } :
    score >= 8   ? { label: "Strong",       color: "text-blue-600",    bg: "bg-blue-50 border-blue-200",       msg: "Solid understanding — review any questions you missed." } :
    score >= 6   ? { label: "Developing",   color: "text-amber-600",   bg: "bg-amber-50 border-amber-200",     msg: "Good foundation. Revisit the stations before moving on." } :
                   { label: "Needs Review", color: "text-red-600",     bg: "bg-red-50 border-red-200",         msg: "Go back through the stations before the next class." };

  function handlePrint() {
    if (!studentName.trim()) { alert("Please enter your name before printing."); return; }
    const items = results.map((r, i) => '<p style="border-left:4px solid ' + (r.correct ? '#16a34a' : '#dc2626') + ';background:' + (r.correct ? '#f0fdf4' : '#fef2f2') + ';padding:6px 10px;margin:3px 0;font-size:12px"><b>Q' + (i+1) + ' ' + (r.correct ? '✓' : '✗') + ':</b> ' + r.exp + '</p>').join('');
    const w = window.open("", "_blank", "width=820,height=960");
    if (!w) return;
    w.document.write(
      '<html><head><title>ECO 211 ECONLAB</title><style>body{font-family:Arial,sans-serif;padding:20px;max-width:680px;margin:0 auto}@media print{button{display:none}}</style></head><body>'
      + '<h2 style="margin:0">ECO 211 ECONLAB - Lab Complete</h2>'
      + '<p style="color:#475569;margin:2px 0">Chapter 8: Perfect Competition</p>'
      + '<p style="font-size:22px;font-weight:bold;background:#1e2d4a;color:white;display:inline-block;padding:4px 16px;border-radius:99px;margin:8px 0">' + score + ' / 10</p>'
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<h3 style="font-size:13px;margin:0 0 6px">Question Review</h3>' + items
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<p style="font-size:13px"><b>Exit Ticket:</b></p><p style="border:1px solid #ccc;padding:8px;border-radius:4px;font-size:13px;min-height:40px">' + (reflection || '') + '</p>'
      + '<p style="font-size:13px;margin-top:12px"><b>Student Name:</b></p><p style="border:1px solid #000;padding:8px;border-radius:4px;font-size:14px;font-weight:bold">' + studentName + '</p>'
      + '<p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:16px;padding-top:8px">ECO 211 · Chapter 8: Perfect Competition · Printed ' + new Date().toLocaleDateString() + ' · Access for free at https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction</p>'
      + '</body></html>'
    );
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 600);
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 mb-4">
          <Award size={36} className="text-primary" />
        </div>
        <div className="font-bold text-5xl text-foreground mb-1">{score}/10</div>
        <div className="text-lg text-muted-foreground mb-4">{pct}% — {grade.label}</div>
        <div className={`inline-block px-5 py-3 rounded-xl border text-sm ${grade.bg} ${grade.color} font-medium max-w-sm`}>{grade.msg}</div>
        <div className="mt-6 pt-6 border-t border-border text-left space-y-3">
          <div className="text-xs font-semibold text-foreground">ECO 211 ECONLAB · Chapter 8: Perfect Competition</div>
          <div>
            <label htmlFor="student-name" className="text-xs font-semibold text-foreground block mb-1">Your Name (required for submission)</label>
            <input id="student-name" type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="First and Last Name"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <button onClick={handlePrint}
            className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
            🖨️ Print / Save as PDF
          </button>
          <p className="text-xs text-muted-foreground text-center">In the print dialog, choose "Save as PDF" and submit to Brightspace.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-3">Question Review</h3>
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className={`p-3 rounded-xl text-sm border-l-4 ${r.correct ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"}`}>
              <span className="font-bold text-xs">{r.correct ? "✓" : "✗"}</span>
              <span className="font-semibold text-foreground ml-1">Q{i+1}: </span>
              <span className="text-muted-foreground">{r.exp}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-2">Exit Ticket (Optional)</h3>
        <p className="text-xs text-muted-foreground mb-3">In 2–3 sentences: What is one thing from this lab that surprised you or changed how you think about this topic?</p>
        <textarea value={reflection} onChange={e => setReflection(e.target.value)} rows={3}
          placeholder="Type your reflection here…"
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground" />
        <p className="text-xs text-muted-foreground mt-1">Your reflection will appear in the printed PDF.</p>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onRetry}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          ↺ Start Over
        </button>
      </div>
    </div>
  );
}


function Header({ station, onStation, completed }: { station: Station; onStation: (s: Station) => void; completed: Set<Station> }) {
  const stations: { id: Station; label: string }[] = [
    { id: "intro", label: "Dashboard" },
    { id: "recap", label: "Recap" },
    { id: "spectrum", label: "Spectrum" },
    { id: "conditions", label: "Conditions" },
    { id: "profitmax", label: "Profit Max" },
    { id: "outcomes", label: "Outcomes" },
    { id: "longrun", label: "Long Run" },
    { id: "quiz", label: "Quiz" },
  ];
  const CONTENT_STATIONS: Station[] = ["recap","spectrum","conditions","profitmax","outcomes","longrun"];
  const allDone = CONTENT_STATIONS.every(s => completed.has(s as Station));
  const stationOrder: Station[] = ["intro","recap","spectrum","conditions","profitmax","outcomes","longrun","quiz","results","not-yet"];
  const currentIdx = stationOrder.indexOf(station);

  return (
    <header role="banner" className="bg-secondary text-secondary-foreground shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" role="presentation">
            <rect width="32" height="32" rx="8" fill="hsl(38 95% 50%)"/>
            <path d="M6 22 L10 16 L14 19 L18 11 L22 14 L26 8" stroke="hsl(222 30% 10%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="26" cy="8" r="2" fill="hsl(222 30% 10%)"/>
          </svg>
          <div>
            <div className="font-display font-semibold text-sm leading-none text-sidebar-foreground">ECO 211 ECONLAB</div>
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 8</div>
          </div>
        </div>
        <a href="https://www.perplexity.ai/computer/a/eco-211-econlab-course-hub-h76o7OX6SpisjlWADnIRGg" target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-sidebar-foreground/80 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-sidebar-accent shrink-0">
          ← Course Hub <span className="sr-only">(opens in new tab)</span>
        </a>
        <div className="hidden sm:flex items-center gap-1 flex-wrap">
          {stations.map((s) => {
            const idx = stationOrder.indexOf(s.id as Station);
            const done = idx < currentIdx;
            const active = s.id === station;
            if (s.id === "quiz" && !allDone) {
              return <span key={s.id} title="Complete all stations first" className="px-3 py-1.5 rounded-full text-xs font-medium text-sidebar-foreground/35 cursor-not-allowed select-none">🔒 {s.label}</span>;
            }
            return (
              <button key={s.id} onClick={() => onStation(s.id as Station)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active ? "bg-primary text-primary-foreground" : done ? "bg-sidebar-accent text-sidebar-foreground/90" : "text-sidebar-foreground/75 hover:text-white"}`}>
                {done && !active ? "✓ " : ""}{s.label}
              </button>
            );
          })}
        </div>
        <div className="hidden md:block w-24">
          <div className="h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(currentIdx / (stations.length - 1)) * 100}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────
export default function EconLab() {
  const [station, setStation] = useState<Station>("intro");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const [studentName, setStudentName] = useState("");
  const mainRef = useRef<HTMLDivElement>(null);

  const STATIONS = [
    { id: "recap",      label: "📚 Ch7 Recap",            short: "Recap",      desc: "Review Ch7 cost concepts before diving into Ch8" },
    { id: "spectrum",   label: "🎚️ Market Power Spectrum", short: "Spectrum",   desc: "Classify 17 real firms from price taker to monopoly" },
    { id: "conditions", label: "✅ 4 Conditions Checker",  short: "Conditions", desc: "Identify which perfect competition criteria real markets meet" },
    { id: "profitmax",  label: "🍇 MR = MC Profit Maximizer", short: "Profit Max", desc: "Find the profit-maximizing output on the raspberry farm table" },
    { id: "outcomes",   label: "⚖️ Outcomes Classifier",  short: "Outcomes",   desc: "Decide: Earning Profit, Loss but Operate, or Shutdown?" },
    { id: "longrun",    label: "📈 Long-Run Simulator",   short: "Long Run",   desc: "Follow entry, exit, and equilibrium step by step" },
  ];

  const allStationsDone = STATIONS.every(s => completed.has(s.id));

  function markDone(id: string) {
    setCompleted(prev => new Set([...prev, id]));
    setStation("intro");
  }

  function handlePass(score: number, results: { correct: boolean; exp: string }[]) {
    setQuizScore(score);
    setQuizResults(results);
    try { localStorage.setItem("econlab211_done_ch8", "true"); } catch (_) {}
    setStation("results");
  }

  function handleFail(score: number, results: { correct: boolean; exp: string }[]) {
    setQuizScore(score);
    setQuizResults(results);
    setStation("not-yet");
  }


  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded z-50">Skip to main content</a>

      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}

      {/* Header */}
      <Header station={station} onStation={setStation} completed={completed} />

      <main id="main-content" ref={mainRef} className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Intro / Dashboard */}
        {station === "intro" && (
          <div className="space-y-6">
            {/* Key idea */}
            <div className="rounded-2xl bg-primary/5 border-2 border-primary/20 p-5">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Key Idea</p>
              <p className="text-base font-semibold text-foreground">"When You Are One Among Thousands"</p>
              <p className="text-sm text-muted-foreground mt-1">In perfect competition, firms are price takers with one decision: <em>how much to produce</em>. Profit is maximized where MR = MC, and in the long run, free entry and exit drive economic profit to zero.</p>
            </div>

            {/* Summary bar */}
            <button onClick={() => setShowSummary(true)}
              className="w-full text-left rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 transition flex items-center gap-2">
              <span>📄</span>
              <span>Need a refresher? <span className="text-primary font-semibold underline">View the Chapter 8 summary.</span></span>
            </button>

            {/* Station grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {STATIONS.map(s => {
                const done = completed.has(s.id);
                return (
                  <button key={s.id} onClick={() => setStation(s.id as Station)}
                    className={`rounded-xl border-2 p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary
                      ${done ? "border-green-400 bg-green-50" : "border-border bg-card hover:border-primary/40"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${done ? "text-green-700" : "text-foreground"}`}>{s.label}</span>
                      {done && <span className="text-green-600 text-lg">✓</span>}
                    </div>
                    <span className="text-xs text-muted-foreground">{done ? "Completed" : s.desc}</span>
                  </button>
                );
              })}
            </div>
            {allStationsDone
              ? <button onClick={() => setStation("quiz")}
                  className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-base transition flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
                  <Award size={20} aria-hidden="true" /> Take the Quiz
                </button>
              : <div className="w-full py-4 bg-muted text-muted-foreground/60 rounded-xl font-bold text-base text-center" role="status">🔒 Quiz — Complete all stations to unlock</div>
            }
          </div>
        )}

        {/* Station views */}
        {station !== "intro" && station !== "quiz" && station !== "not-yet" && station !== "results" && (
          <div className="space-y-4">
{/* Station title */}
            <div className="rounded-xl bg-card border-2 border-border p-4">
              <h2 className="text-base font-bold text-foreground">
                {STATIONS.find(s => s.id === station)?.label}
              </h2>
            </div>

            {/* Station content */}
            <div role="alert" aria-live="polite" className="sr-only" id="station-feedback" />

            {station === "recap"      && <RecapStation      onComplete={() => markDone("recap")}      />}
            {station === "spectrum"   && <SpectrumStation   onComplete={() => markDone("spectrum")}   />}
            {station === "conditions" && <ConditionsStation onComplete={() => markDone("conditions")} />}
            {station === "profitmax"  && <ProfitMaxStation  onComplete={() => markDone("profitmax")}  />}
            {station === "outcomes"   && <OutcomesStation   onComplete={() => markDone("outcomes")}   />}
            {station === "longrun"    && <LongRunStation    onComplete={() => markDone("longrun")}    />}
          </div>
        )}

        {/* Quiz */}
        {station === "quiz" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setStation("intro")} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">
                ← Dashboard
              </button>
              <h2 className="text-base font-bold text-foreground">🎯 Chapter 8 Quiz</h2>
            </div>
            <QuizStation
              onPass={(score, results) => { setQuizScore(score); setQuizResults(results); try { localStorage.setItem("econlab211_done_ch8", "true"); } catch (_) {} setStation("results"); }}
              onFail={(score, results) => { setQuizScore(score); setQuizResults(results); setStation("not-yet"); }}
            />
          </div>
        )}

      {station === "not-yet" && <NotYetScreen score={quizScore} onRetry={() => setStation("quiz")} />}
      {station === "results" && <ResultsScreen score={quizScore} results={quizResults} onRetry={() => { setQuizScore(0); setQuizResults([]); setCompleted(new Set()); setStation("intro"); }} />}
      </main>
    </>
  );
}
