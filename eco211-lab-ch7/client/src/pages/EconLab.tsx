import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Award, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "costs" | "profit" | "mp" | "curves" | "scale" | "markets" | "quiz" | "results" | "not-yet";

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
const CH7_SUMMARY = [
  { heading: "7.1 — Explicit and Implicit Costs, and Accounting and Economic Profit", body: "Private enterprise seeks profit. Explicit costs are direct monetary payments — wages, rent, materials. Implicit costs are opportunity costs of using owned resources — foregone salary, foregone interest on savings. Accounting profit = Total Revenue − Explicit Costs. Economic profit = Total Revenue − Explicit Costs − Implicit Costs. A firm earning zero economic profit is still covering all opportunity costs and earning a normal profit." },
  { heading: "7.2 — Production in the Short Run", body: "In the short run, at least one input is fixed (e.g. capital). Total Product (TP) is total output. Marginal Product (MP) = change in TP from adding one more unit of variable input (labor). The law of diminishing marginal returns states that as more variable inputs are added to a fixed input, MP eventually declines. This is a short-run concept — it results from the fixed factor becoming congested." },
  { heading: "7.3 — Costs in the Short Run", body: "Fixed costs (FC) don't change with output. Variable costs (VC) rise with output. Total Cost (TC) = FC + VC. Average Total Cost (ATC) = TC / Q. Average Variable Cost (AVC) = VC / Q. Average Fixed Cost (AFC) = FC / Q. Marginal Cost (MC) = ΔTC / ΔQ = ΔAVC / ΔQ. The MC curve is U-shaped and crosses both AVC and ATC at their minimum points." },
  { heading: "7.4 — Production in the Long Run", body: "In the long run, all inputs are variable. Firms can scale all factors. Economies of scale occur when LRAC falls as output rises — larger scale lowers per-unit costs. Constant returns to scale: LRAC is flat. Diseconomies of scale: LRAC rises — bigger scale raises per-unit costs (management complexity, communication breakdowns)." },
  { heading: "7.5 — Costs in the Long Run", body: "The Long-Run Average Cost (LRAC) curve is the envelope of all short-run ATC curves. The shape of the LRAC determines market structure: if economies of scale persist across the entire market demand, a natural monopoly results. If LRAC is flat (constant returns) across market demand, many competitive firms can coexist. The minimum efficient scale is the output level at which LRAC first reaches its minimum." },
];

// ─────────────────────────────────────────────
// Summary Modal
// ─────────────────────────────────────────────
function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="summary-title">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 id="summary-title" className="text-lg font-bold text-foreground">📄 Chapter 7 Summary</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" aria-label="Close summary">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {CH7_SUMMARY.map((sec, i) => (
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
// Station 1 — Explicit or Implicit?
// ─────────────────────────────────────────────
const COST_SCENARIOS = [
  { id: 0, text: "A café owner pays $2,000/month rent for her shop space.", correct: "explicit", exp: "Cash leaves the business — rent is a direct monetary payment recorded on the books." },
  { id: 1, text: "A café owner uses her own $50,000 savings (could earn 5% interest) instead of investing it.", correct: "implicit", exp: "The foregone $2,500/year in interest is an opportunity cost — no cash changes hands, but the cost is real." },
  { id: 2, text: "A graphic designer pays $200/month for software subscriptions.", correct: "explicit", exp: "This is a direct out-of-pocket payment for a business expense." },
  { id: 3, text: "A food truck owner works 60 hrs/week instead of taking a $70,000/year job.", correct: "implicit", exp: "The foregone $70,000 salary is an implicit cost — the owner sacrifices that income but doesn't pay herself." },
  { id: 4, text: "A bakery pays $15/hour wages to employees.", correct: "explicit", exp: "Wages paid to workers are direct monetary payments — classic explicit costs." },
  { id: 5, text: "A startup founder uses his garage for prototyping instead of renting it for $800/month.", correct: "implicit", exp: "The $800/month in foregone rent is an opportunity cost — no cash paid, but a real economic cost." },
  { id: 6, text: "A restaurant owner buys $3,000/month in ingredients.", correct: "explicit", exp: "Purchasing ingredients requires a direct cash outflow — a clear explicit cost." },
  { id: 7, text: "A spouse helps with bookkeeping for free (market rate = $25/hr, 10 hrs/week).", correct: "implicit", exp: "Unpaid family labor is an implicit cost — the $250/week market value is a real opportunity cost even without a paycheck." },
  { id: 8, text: "An entrepreneur uses her personal laptop for the business (could have sold it for $1,200).", correct: "both", exp: "Using a personal asset means the $1,200 foregone resale value is an implicit opportunity cost. If it was purchased for the business, depreciation is also explicit. This qualifies as 'both'." },
  { id: 9, text: "A firm pays $500/month for electricity.", correct: "explicit", exp: "Electricity bills are direct cash payments — straightforward explicit costs." },
];

const COST_CATS = ["explicit", "implicit", "both"];
const COST_CAT_LABELS: { [k: string]: string } = { explicit: "Explicit", implicit: "Implicit", both: "Both" };
const COST_CAT_COLORS: { [k: string]: string } = {
  explicit: "border-primary/30 bg-primary/5 text-primary",
  implicit: "border-amber-300 bg-amber-50 text-amber-700",
  both: "border-purple-300 bg-purple-50 text-purple-700",
};

function CostsStation({ onComplete }: { onComplete: () => void }) {
  const [placed, setPlaced] = useState<{ [id: number]: string }>({});
  const [checked, setChecked] = useState(false);
  const allPlaced = COST_SCENARIOS.every(s => placed[s.id] !== undefined);
  const score = COST_SCENARIOS.filter(s => placed[s.id] === s.correct).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Tag each cost scenario — is it an <strong>Explicit</strong> cost (direct cash payment), an <strong>Implicit</strong> cost (opportunity cost of owned resources), or <strong>Both</strong>?</p>

      <div className="space-y-2">
        {COST_SCENARIOS.map(s => {
          const chosen = placed[s.id];
          const isCorrect = checked && chosen === s.correct;
          const isWrong = checked && chosen !== undefined && chosen !== s.correct;
          return (
            <div key={s.id} className={`rounded-xl border-2 p-4 transition-all ${checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-400 bg-red-50" : "border-border bg-card") : "border-border bg-card"}`}>
              <p className="text-sm font-medium text-foreground mb-2">
                {checked && (isCorrect ? "✓ " : isWrong ? "✗ " : "")}{s.text}
                {isWrong && <span className="text-xs text-red-600 ml-2 font-semibold">→ {COST_CAT_LABELS[s.correct]}</span>}
              </p>
              {!checked && (
                <div className="flex gap-2 flex-wrap" role="group" aria-label="Cost type options">
                  {COST_CATS.map(cat => (
                    <button key={cat} onClick={() => setPlaced(prev => ({ ...prev, [s.id]: cat }))}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${placed[s.id] === cat ? COST_CAT_COLORS[cat] + " border-current" : "border-border text-muted-foreground hover:border-primary/40"}`}
                      aria-pressed={placed[s.id] === cat}>
                      {COST_CAT_LABELS[cat]}
                    </button>
                  ))}
                </div>
              )}
              {checked && chosen && (
                <div className="mt-2 space-y-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${COST_CAT_COLORS[chosen]}`}>{COST_CAT_LABELS[chosen]}</span>
                  {(isCorrect || isWrong) && <p className="text-xs text-muted-foreground leading-snug mt-1">{s.exp}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {checked && (
        <div role="alert" aria-live="polite" className={`p-3 rounded-xl text-sm font-semibold text-center ${score === COST_SCENARIOS.length ? "bg-green-100 text-green-800" : "bg-amber-50 text-amber-800"}`}>
          {score === COST_SCENARIOS.length ? "🎉 Perfect! All 10 tagged correctly." : `${score} / ${COST_SCENARIOS.length} correct — incorrect items show the right answer in red.`}
        </div>
      )}
      {allPlaced && !checked && <button onClick={() => setChecked(true)} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">Check My Answers</button>}
      {checked && <button onClick={onComplete} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">Mark Complete ✓</button>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 2 — Profit Calculator
// ─────────────────────────────────────────────
const BUSINESSES = [
  { name: "Graphic Design Firm", revenue: 120000, explicit: 30000, implicit: 90000, implicitLabel: "Foregone salary if owner worked elsewhere" },
  { name: "Food Truck", revenue: 130000, explicit: 40000, implicit: 5000, implicitLabel: "Foregone 5% interest on $100,000 personal savings" },
  { name: "YouTube Creator", revenue: 60000, explicit: 10000, implicit: 30000, implicitLabel: "Foregone part-time job income" },
];

function ProfitStation({ onComplete }: { onComplete: () => void }) {
  const [tab, setTab] = useState(0);
  const [answers, setAnswers] = useState<{ acct: string; econ: string; acctChecked: boolean; econChecked: boolean; acctCorrect: boolean | null; econCorrect: boolean | null }[]>(
    BUSINESSES.map(() => ({ acct: "", econ: "", acctChecked: false, econChecked: false, acctCorrect: null, econCorrect: null }))
  );
  const [allDone, setAllDone] = useState(false);

  const b = BUSINESSES[tab];
  const ans = answers[tab];
  const correctAcct = b.revenue - b.explicit;
  const correctEcon = correctAcct - b.implicit;

  function update(field: "acct" | "econ", val: string) {
    setAnswers(prev => prev.map((a, i) => i === tab ? { ...a, [field]: val } : a));
  }

  function check(field: "acct" | "econ") {
    const val = parseFloat(field === "acct" ? ans.acct : ans.econ);
    const correct = field === "acct" ? Math.abs(val - correctAcct) < 1 : Math.abs(val - correctEcon) < 1;
    setAnswers(prev => prev.map((a, i) => i === tab ? {
      ...a,
      [field === "acct" ? "acctChecked" : "econChecked"]: true,
      [field === "acct" ? "acctCorrect" : "econCorrect"]: correct,
    } : a));
    const updated = answers.map((a, i) => i === tab ? {
      ...a,
      [field === "acct" ? "acctChecked" : "econChecked"]: true,
      [field === "acct" ? "acctCorrect" : "econCorrect"]: correct,
    } : a);
    if (updated.every(a => a.acctCorrect !== null && a.econCorrect !== null)) setAllDone(true);
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground space-y-1">
        <p><strong>Accounting Profit</strong> = Total Revenue − Explicit Costs</p>
        <p><strong>Economic Profit</strong> = Total Revenue − Explicit Costs − Implicit Costs</p>
        <p className="text-xs text-muted-foreground">Or: Economic Profit = Accounting Profit − Implicit Costs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2" role="tablist">
        {BUSINESSES.map((bus, i) => (
          <button key={i} role="tab" aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${tab === i ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`}>
            {bus.name}
            {answers[i].acctCorrect !== null && answers[i].econCorrect !== null && <span className="ml-1 text-green-600">✓</span>}
          </button>
        ))}
      </div>

      {/* Business data */}
      <div className="bg-card border-2 border-border rounded-xl overflow-hidden" role="tabpanel">
        <div className="bg-secondary text-secondary-foreground px-4 py-2 text-sm font-semibold">{b.name}</div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Total Revenue</span><span className="font-semibold text-foreground">${b.revenue.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Explicit Costs</span><span className="font-semibold text-foreground">${b.explicit.toLocaleString()}</span></div>
          <div className="flex justify-between border-t border-border pt-2"><span className="text-muted-foreground text-xs">{b.implicitLabel}</span><span className="font-semibold text-foreground">${b.implicit.toLocaleString()}</span></div>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        {/* Accounting Profit */}
        <div className="bg-card border-2 border-border rounded-xl p-4 space-y-2">
          <label htmlFor={`acct-${tab}`} className="text-sm font-semibold text-foreground block">Accounting Profit ($)</label>
          <div className="flex gap-2">
            <input id={`acct-${tab}`} type="number" value={ans.acct} onChange={e => update("acct", e.target.value)}
              disabled={ans.acctChecked && ans.acctCorrect === true}
              placeholder="Enter accounting profit"
              className="flex-1 border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none disabled:bg-muted"
              aria-describedby={ans.acctChecked ? `acct-feedback-${tab}` : undefined} />
            {!(ans.acctChecked && ans.acctCorrect) && (
              <button onClick={() => check("acct")} disabled={!ans.acct}
                className="px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                Check
              </button>
            )}
          </div>
          {ans.acctChecked && (
            <p id={`acct-feedback-${tab}`} role="alert" className={`text-xs font-semibold ${ans.acctCorrect ? "text-green-700" : "text-red-600"}`}>
              {ans.acctCorrect ? `✓ Correct! $${b.revenue.toLocaleString()} − $${b.explicit.toLocaleString()} = $${correctAcct.toLocaleString()}` : `✗ Try again. Hint: Revenue − Explicit Costs`}
            </p>
          )}
        </div>

        {/* Economic Profit */}
        <div className="bg-card border-2 border-border rounded-xl p-4 space-y-2">
          <label htmlFor={`econ-${tab}`} className="text-sm font-semibold text-foreground block">Economic Profit ($)</label>
          <div className="flex gap-2">
            <input id={`econ-${tab}`} type="number" value={ans.econ} onChange={e => update("econ", e.target.value)}
              disabled={ans.econChecked && ans.econCorrect === true}
              placeholder="Enter economic profit"
              className="flex-1 border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none disabled:bg-muted"
              aria-describedby={ans.econChecked ? `econ-feedback-${tab}` : undefined} />
            {!(ans.econChecked && ans.econCorrect) && (
              <button onClick={() => check("econ")} disabled={!ans.econ}
                className="px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                Check
              </button>
            )}
          </div>
          {ans.econChecked && (
            <p id={`econ-feedback-${tab}`} role="alert" className={`text-xs font-semibold ${ans.econCorrect ? "text-green-700" : "text-red-600"}`}>
              {ans.econCorrect ? `✓ Correct! Accounting profit ($${correctAcct.toLocaleString()}) − Implicit costs ($${b.implicit.toLocaleString()}) = $${correctEcon.toLocaleString()}` : `✗ Try again. Hint: Accounting Profit − Implicit Costs`}
            </p>
          )}
        </div>
      </div>

      {allDone && (
        <div role="alert" className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
          <p className="font-semibold">All three businesses complete! Notice:</p>
          <p className="mt-1 text-xs">The Graphic Design Firm earns $0 economic profit — it's earning exactly enough to cover all costs including the owner's opportunity cost. This is called <strong>normal profit</strong>. The firm is viable even though economic profit = $0.</p>
        </div>
      )}

      <button onClick={onComplete} disabled={!allDone}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 3 — Marginal Product Explorer
// ─────────────────────────────────────────────
const MP_DATA = [
  { workers: 1, tp: 10,  mp: 10 },
  { workers: 2, tp: 25,  mp: 15 },
  { workers: 3, tp: 38,  mp: 13 },
  { workers: 4, tp: 47,  mp: 9  },
  { workers: 5, tp: 52,  mp: 5  },
  { workers: 6, tp: 54,  mp: 2  },
];

function MPStation({ onComplete }: { onComplete: () => void }) {
  const [inputs, setInputs] = useState<string[]>(new Array(MP_DATA.length).fill(""));
  const [checked, setChecked] = useState<boolean[]>(new Array(MP_DATA.length).fill(false));
  const [correct, setCorrect] = useState<(boolean | null)[]>(new Array(MP_DATA.length).fill(null));
  const [currentRow, setCurrentRow] = useState(0);
  const allCorrect = correct.every(c => c === true);

  const svgW = 300, svgH = 160;
  const pad = { l: 32, r: 12, t: 12, b: 28 };
  const maxMp = 16;
  function xScale(w: number) { return pad.l + ((w - 1) / (MP_DATA.length - 1)) * (svgW - pad.l - pad.r); }
  function yScale(v: number) { return pad.t + ((maxMp - v) / maxMp) * (svgH - pad.t - pad.b); }

  const revealedPoints = MP_DATA.filter((_, i) => correct[i] === true);
  const pathD = revealedPoints.length > 1
    ? revealedPoints.map((d, i) => `${i === 0 ? "M" : "L"}${xScale(d.workers).toFixed(1)},${yScale(d.mp).toFixed(1)}`).join(" ")
    : "";

  function checkRow(i: number) {
    const val = parseFloat(inputs[i]);
    const ok = !isNaN(val) && Math.abs(val - MP_DATA[i].mp) < 0.5;
    setChecked(prev => { const n = [...prev]; n[i] = true; return n; });
    setCorrect(prev => { const n = [...prev]; n[i] = ok; return n; });
    if (ok && i + 1 < MP_DATA.length) setCurrentRow(i + 1);
  }

  return (
    <div className="space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">A pizza shop has 1 oven (fixed capital). How does adding workers affect output?</p>
        <p>Marginal Product (MP) = Change in Total Product ÷ Change in Workers</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm" role="grid">
          <thead>
            <tr className="bg-secondary text-secondary-foreground">
              <th scope="col" className="px-3 py-2 text-center text-xs">Workers</th>
              <th scope="col" className="px-3 py-2 text-center text-xs">Total Product (pizzas/hr)</th>
              <th scope="col" className="px-3 py-2 text-center text-xs">Marginal Product</th>
            </tr>
          </thead>
          <tbody>
            {MP_DATA.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted"}>
                <td className="px-3 py-2 text-center font-semibold text-foreground">{row.workers}</td>
                <td className="px-3 py-2 text-center text-foreground">{row.tp}</td>
                <td className="px-3 py-2 text-center">
                  {i === 0 && correct[0] === null && currentRow === 0 ? (
                    <div className="flex justify-center gap-1">
                      <input type="number" value={inputs[0]} onChange={e => setInputs(prev => { const n = [...prev]; n[0] = e.target.value; return n; })}
                        aria-label={`Marginal product for ${row.workers} worker(s)`}
                        className="w-16 text-center border border-border rounded-lg px-1 py-1 text-xs bg-card text-foreground focus:border-primary focus:outline-none" />
                      <button onClick={() => checkRow(0)} disabled={!inputs[0]}
                        className="px-2 py-1 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded text-xs font-semibold">✓</button>
                    </div>
                  ) : i === currentRow && !checked[i] ? (
                    <div className="flex justify-center gap-1">
                      <input type="number" value={inputs[i]} onChange={e => setInputs(prev => { const n = [...prev]; n[i] = e.target.value; return n; })}
                        aria-label={`Marginal product for ${row.workers} workers`}
                        className="w-16 text-center border border-border rounded-lg px-1 py-1 text-xs bg-card text-foreground focus:border-primary focus:outline-none" />
                      <button onClick={() => checkRow(i)} disabled={!inputs[i]}
                        className="px-2 py-1 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded text-xs font-semibold">✓</button>
                    </div>
                  ) : correct[i] === true ? (
                    <span className="text-green-700 font-semibold">{row.mp} ✓</span>
                  ) : checked[i] && correct[i] === false ? (
                    <div className="flex justify-center gap-1">
                      <span className="text-red-500 text-xs">✗</span>
                      <input type="number" value={inputs[i]} onChange={e => setInputs(prev => { const n = [...prev]; n[i] = e.target.value; return n; })}
                        aria-label={`Retry marginal product for ${row.workers} workers`}
                        className="w-16 text-center border border-red-400 rounded-lg px-1 py-1 text-xs bg-card text-foreground focus:border-primary focus:outline-none" />
                      <button onClick={() => checkRow(i)} disabled={!inputs[i]}
                        className="px-2 py-1 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded text-xs font-semibold">↵</button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      {revealedPoints.length >= 2 && (
        <div className="bg-card rounded-xl border border-border p-3">
          <p className="text-xs font-semibold text-foreground mb-2">Marginal Product Curve</p>
          <svg width={svgW} height={svgH} aria-label="Marginal product curve — diminishing returns visible as line slopes downward" role="img" style={{ display: "block", margin: "0 auto" }}>
            {[0, 4, 8, 12, 16].map(v => <line key={v} x1={pad.l} x2={svgW - pad.r} y1={yScale(v)} y2={yScale(v)} stroke="#f1f5f9" strokeWidth="1" />)}
            <line x1={pad.l} x2={svgW - pad.r} y1={svgH - pad.b} y2={svgH - pad.b} stroke="#94a3b8" strokeWidth="1.5" />
            <line x1={pad.l} x2={pad.l} y1={pad.t} y2={svgH - pad.b} stroke="#94a3b8" strokeWidth="1.5" />
            {[1, 2, 3, 4, 5, 6].map(w => <text key={w} x={xScale(w)} y={svgH - pad.b + 12} textAnchor="middle" fontSize="9" fill="#94a3b8">{w}</text>)}
            {[0, 5, 10, 15].map(v => <text key={v} x={pad.l - 4} y={yScale(v) + 3} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>)}
            <text x={(pad.l + svgW - pad.r) / 2} y={svgH - 2} textAnchor="middle" fontSize="9" fill="#64748b">Workers</text>
            <text x={10} y={(pad.t + svgH - pad.b) / 2} textAnchor="middle" fontSize="9" fill="#64748b" transform={`rotate(-90,10,${(pad.t + svgH - pad.b) / 2})`}>MP</text>
            {pathD && <path d={pathD} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round" />}
            {revealedPoints.map((d, i) => <circle key={i} cx={xScale(d.workers)} cy={yScale(d.mp)} r={4} fill="hsl(var(--primary))" />)}
          </svg>
          {allCorrect && (
            <p className="text-xs text-muted-foreground mt-2 text-center">Notice the downward slope — diminishing marginal returns in action. Each additional worker adds less output than the previous one.</p>
          )}
        </div>
      )}

      <button onClick={onComplete} disabled={!allCorrect}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 4 — Cost Curve Lab
// ─────────────────────────────────────────────
const CURVES_DATA = [
  { labor: 1, q: 16,  fc: 160, vc: 80  },
  { labor: 2, q: 40,  fc: 160, vc: 160 },
  { labor: 3, q: 60,  fc: 160, vc: 240 },
  { labor: 4, q: 72,  fc: 160, vc: 320 },
  { labor: 5, q: 80,  fc: 160, vc: 400 },
  { labor: 6, q: 84,  fc: 160, vc: 480 },
];

function calcCurves(row: typeof CURVES_DATA[0], prevRow: typeof CURVES_DATA[0] | null) {
  const tc = row.fc + row.vc;
  const mc = prevRow ? +((tc - (prevRow.fc + prevRow.vc)) / (row.q - prevRow.q)).toFixed(2) : null;
  const atc = +(tc / row.q).toFixed(2);
  const avc = +(row.vc / row.q).toFixed(2);
  return { tc, mc, atc, avc };
}

type CellState = { val: string; attempts: number; correct: boolean | null; revealed: boolean };
function initCell(): CellState { return { val: "", attempts: 0, correct: null, revealed: false }; }


function CurvesStation({ onComplete }: { onComplete: () => void }) {
  const [cells, setCells] = useState<{ tc: CellState; mc: CellState; atc: CellState; avc: CellState }[]>(
    CURVES_DATA.map(() => ({ tc: initCell(), mc: initCell(), atc: initCell(), avc: initCell() }))
  );

  // allDone: row 0 has no MC so we skip it for that row
  const allDone = cells.every((row, i) =>
    (row.tc.correct || row.tc.revealed) &&
    (i === 0 || row.mc.correct || row.mc.revealed) &&
    (row.atc.correct || row.atc.revealed) &&
    (row.avc.correct || row.avc.revealed)
  );

  function checkCell(rowIdx: number, field: "tc" | "mc" | "atc" | "avc") {
    const row = CURVES_DATA[rowIdx];
    const prev = rowIdx > 0 ? CURVES_DATA[rowIdx - 1] : null;
    const { tc, mc, atc, avc } = calcCurves(row, prev);
    const target: { [k: string]: number | null } = { tc, mc, atc, avc };
    const cell = cells[rowIdx][field];
    if (!cell.val) return;
    const userVal = parseFloat(cell.val);
    const tgt = target[field];
    if (tgt === null) return;
    const ok = Math.abs(userVal - tgt) < 0.1;
    setCells(prev => prev.map((r, i) => i !== rowIdx ? r : {
      ...r,
      [field]: { ...r[field], attempts: r[field].attempts + 1, correct: ok, revealed: false }
    }));
  }

  function revealCell(rowIdx: number, field: "tc" | "mc" | "atc" | "avc") {
    setCells(prev => prev.map((r, i) => i !== rowIdx ? r : {
      ...r,
      [field]: { ...r[field], revealed: true }
    }));
  }

  function renderCell(rowIdx: number, field: "tc" | "mc" | "atc" | "avc", tgt: number | null) {
    if (tgt === null) return <span className="text-muted-foreground text-xs">—</span>;
    const cell = cells[rowIdx][field];
    if (cell.correct) return <span className="text-green-700 font-semibold text-xs">${tgt.toFixed(2)} ✓</span>;
    if (cell.revealed) return <span className="text-amber-700 font-semibold text-xs">${tgt.toFixed(2)} 🟡</span>;
    return (
      <div className="flex flex-col gap-1 items-center">
        <div className="flex gap-1">
          <input type="number" step="0.01" value={cell.val}
            onChange={e => { setCells(prev => prev.map((r, i) => i !== rowIdx ? r : { ...r, [field]: { ...r[field], val: e.target.value } })); }}
            aria-label={`${field.toUpperCase()} for row ${rowIdx + 1}`}
            className={`w-16 text-center border rounded px-1 py-1 text-xs bg-card text-foreground focus:outline-none ${cell.correct === false ? "border-red-400" : "border-border focus:border-primary"}`} />
          <button onClick={() => checkCell(rowIdx, field)} disabled={!cell.val}
            className="px-1.5 py-1 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded text-xs font-semibold">✓</button>
        </div>
        {cell.correct === false && cell.attempts < 2 && <span className="text-xs text-red-500">Try again</span>}
        {cell.correct === false && cell.attempts >= 2 && (
          <button onClick={() => revealCell(rowIdx, field)} className="text-xs text-amber-600 underline">See Answer</button>
        )}
      </div>
    );
  }

  const usedReveal = cells.some(r => r.tc.revealed || r.mc.revealed || r.atc.revealed || r.avc.revealed);

  // Build chart data from correctly answered (or revealed) cells
  const chartPoints: { q: number; mc: number | null; atc: number; avc: number }[] = CURVES_DATA.map((row, i) => {
    const prev = i > 0 ? CURVES_DATA[i - 1] : null;
    const { tc, mc, atc, avc } = calcCurves(row, prev);
    const cell = cells[i];
    const mcReady  = i > 0 && (cell.mc.correct || cell.mc.revealed);
    const atcReady = cell.atc.correct || cell.atc.revealed;
    const avcReady = cell.avc.correct || cell.avc.revealed;
    return {
      q: row.q,
      mc:  mcReady  ? mc  : null,
      atc: atcReady ? atc : null,
      avc: avcReady ? avc : null,
    };
  });

  const hasChartData = chartPoints.some(p => p.mc !== null || p.atc !== null || p.avc !== null);

  // SVG chart
  const svgW = 340, svgH = 200;
  const pad = { l: 44, r: 16, t: 16, b: 32 };
  const allQ = CURVES_DATA.map(r => r.q);
  const qMin = allQ[0], qMax = allQ[allQ.length - 1];
  const yMax = 25;

  function xScale(q: number) { return pad.l + ((q - qMin) / (qMax - qMin)) * (svgW - pad.l - pad.r); }
  function yScale(v: number) { return pad.t + ((yMax - Math.min(v, yMax)) / yMax) * (svgH - pad.t - pad.b); }

  function makePath(data: { q: number; val: number | null }[]) {
    const pts = data.filter(d => d.val !== null);
    if (pts.length < 2) return "";
    return pts.map((d, i) => `${i === 0 ? "M" : "L"}${xScale(d.q).toFixed(1)},${yScale(d.val!).toFixed(1)}`).join(" ");
  }

  const mcPath  = makePath(chartPoints.map(p => ({ q: p.q, val: p.mc })));
  const atcPath = makePath(chartPoints.map(p => ({ q: p.q, val: p.atc })));
  const avcPath = makePath(chartPoints.map(p => ({ q: p.q, val: p.avc })));

  return (
    <div className="space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground space-y-1">
        <p><strong>Barbershop:</strong> Fixed cost = $160/day (lease) · Variable cost = $80/barber/day</p>
        <p className="text-xs">TC = FC + VC &nbsp;|&nbsp; MC = ΔTC ÷ ΔQ &nbsp;|&nbsp; ATC = TC ÷ Q &nbsp;|&nbsp; AVC = VC ÷ Q</p>
        <p className="text-xs text-muted-foreground">Work out each row on paper first, then enter and check. You get 2 attempts per cell — after 2 wrong tries, "See Answer" appears (flagged 🟡).</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-xs" role="grid">
          <thead>
            <tr className="bg-secondary text-secondary-foreground">
              {["Labor", "Output (Q)", "FC", "VC", "TC", "MC", "ATC", "AVC"].map(h => (
                <th key={h} scope="col" className="px-2 py-2 text-center font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CURVES_DATA.map((row, i) => {
              const prev = i > 0 ? CURVES_DATA[i - 1] : null;
              const { tc, mc, atc, avc } = calcCurves(row, prev);
              return (
                <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted"}>
                  <td className="px-2 py-2 text-center font-semibold text-foreground">{row.labor}</td>
                  <td className="px-2 py-2 text-center text-foreground">{row.q}</td>
                  <td className="px-2 py-2 text-center text-muted-foreground">${row.fc}</td>
                  <td className="px-2 py-2 text-center text-muted-foreground">${row.vc}</td>
                  <td className="px-2 py-2 text-center">{renderCell(i, "tc", tc)}</td>
                  <td className="px-2 py-2 text-center">{renderCell(i, "mc", mc)}</td>
                  <td className="px-2 py-2 text-center">{renderCell(i, "atc", atc)}</td>
                  <td className="px-2 py-2 text-center">{renderCell(i, "avc", avc)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dynamic cost curve chart */}
      {hasChartData && (
        <div className="bg-card rounded-xl border border-border p-3">
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <p className="text-xs font-semibold text-foreground">Cost Curves (builds as you solve)</p>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-red-500"></span> MC</span>
              <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-primary" style={{borderTop:'2px solid'}}></span> ATC</span>
              <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-amber-500"></span> AVC</span>
            </div>
          </div>
          <svg width={svgW} height={svgH} role="img" aria-label="Cost curves chart showing MC, ATC, and AVC. MC is U-shaped and crosses both ATC and AVC at their minimums." style={{ display: "block", margin: "0 auto" }}>
            {/* Grid */}
            {[0, 5, 10, 15, 20, 25].map(v => (
              <line key={v} x1={pad.l} x2={svgW - pad.r} y1={yScale(v)} y2={yScale(v)} stroke="#f1f5f9" strokeWidth="1" />
            ))}
            {/* Axes */}
            <line x1={pad.l} x2={svgW - pad.r} y1={svgH - pad.b} y2={svgH - pad.b} stroke="#94a3b8" strokeWidth="1.5" />
            <line x1={pad.l} x2={pad.l} y1={pad.t} y2={svgH - pad.b} stroke="#94a3b8" strokeWidth="1.5" />
            {/* Y labels */}
            {[0, 5, 10, 15, 20].map(v => (
              <text key={v} x={pad.l - 4} y={yScale(v) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">${v}</text>
            ))}
            {/* X labels */}
            {allQ.map(q => (
              <text key={q} x={xScale(q)} y={svgH - pad.b + 12} textAnchor="middle" fontSize="8" fill="#94a3b8">{q}</text>
            ))}
            <text x={(pad.l + svgW - pad.r) / 2} y={svgH - 2} textAnchor="middle" fontSize="8" fill="#64748b">Output (haircuts/day)</text>
            <text x={10} y={(pad.t + svgH - pad.b) / 2} textAnchor="middle" fontSize="8" fill="#64748b" transform={`rotate(-90,10,${(pad.t + svgH - pad.b) / 2})`}>$/unit</text>
            {/* Curves */}
            {mcPath  && <path d={mcPath}  fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeDasharray="4,2" />}
            {atcPath && <path d={atcPath} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round" />}
            {avcPath && <path d={avcPath} fill="none" stroke="#d97706" strokeWidth="2" strokeLinejoin="round" />}
            {/* Dots for solved points */}
            {chartPoints.map((p, i) => (
              <g key={i}>
                {p.mc  !== null && <circle cx={xScale(p.q)} cy={yScale(p.mc)}  r={3} fill="#ef4444" />}
                {p.atc !== null && <circle cx={xScale(p.q)} cy={yScale(p.atc)} r={3} fill="hsl(var(--primary))" />}
                {p.avc !== null && <circle cx={xScale(p.q)} cy={yScale(p.avc)} r={3} fill="#d97706" />}
              </g>
            ))}
            {/* Curve labels at last point */}
            {(() => {
              const lastMc  = chartPoints.filter(p => p.mc  !== null).at(-1);
              const lastAtc = chartPoints.filter(p => p.atc !== null).at(-1);
              const lastAvc = chartPoints.filter(p => p.avc !== null).at(-1);
              return (
                <>
                  {lastMc  && <text x={xScale(lastMc.q) + 4}  y={yScale(lastMc.mc!) + 3}  fontSize="8" fill="#ef4444" fontWeight="bold">MC</text>}
                  {lastAtc && <text x={xScale(lastAtc.q) + 4} y={yScale(lastAtc.atc!) + 3} fontSize="8" fill="hsl(var(--primary))" fontWeight="bold">ATC</text>}
                  {lastAvc && <text x={xScale(lastAvc.q) + 4} y={yScale(lastAvc.avc!) - 3} fontSize="8" fill="#d97706" fontWeight="bold">AVC</text>}
                </>
              );
            })()}
          </svg>
          {allDone && (
            <p className="text-xs text-muted-foreground mt-2 text-center">Notice: MC is U-shaped. MC crosses AVC and ATC at their <strong>minimum points</strong>. ATC &gt; AVC always because ATC includes fixed cost per unit.</p>
          )}
        </div>
      )}

      {allDone && (
        <div role="alert" className={`p-3 rounded-xl text-sm ${usedReveal ? "bg-amber-50 border border-amber-200 text-amber-800" : "bg-green-50 border border-green-200 text-green-800"}`}>
          {usedReveal
            ? "🟡 Complete — some cells were revealed. Review the flagged rows to understand your errors before the quiz."
            : "🎉 Perfect — all cells correct without hints!"}
        </div>
      )}

      <button onClick={onComplete} disabled={!allDone}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
        Mark Complete ✓
      </button>
    </div>
  );
}


function ScaleStation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [engaged, setEngaged] = useState(false);

  const steps = [
    {
      title: "What is the LRAC curve?",
      content: "In the long run, a firm can change ALL its inputs — it can build a bigger factory, hire more managers, buy more equipment. The Long-Run Average Cost (LRAC) curve shows the lowest possible cost per unit at each level of output when a firm is free to choose its optimal size.",
      visual: "lrac",
      insight: "Think of it as the 'best case' cost curve — the firm picks the perfect factory size for whatever output level it wants to produce.",
    },
    {
      title: "Economies of Scale",
      content: "When producing more causes average cost to FALL, we have economies of scale. Why? Specialization, bulk purchasing, spreading fixed costs over more units, more efficient equipment. The LRAC slopes DOWNWARD in this zone.",
      visual: "lrac-economies",
      insight: "Example: Amazon's first warehouse costs a lot per package. As volume grows, they spread those costs across millions of shipments — cost per package falls.",
    },
    {
      title: "Constant Returns to Scale",
      content: "When output increases but average cost stays roughly the same, we have constant returns to scale. The LRAC is FLAT in this zone. This is common in many industries — there's a sweet spot where bigger isn't cheaper but isn't more expensive either.",
      visual: "lrac-constant",
      insight: "Example: A second coffee shop costs roughly the same per cup to run as the first. Doubling the business doubles the costs — no particular advantage to being bigger.",
    },
    {
      title: "Diseconomies of Scale",
      content: "If a firm grows too large, management becomes complex, communication breaks down, bureaucracy slows decisions. Average costs start to RISE. The LRAC slopes UPWARD in this zone.",
      visual: "lrac-dis",
      insight: "Example: A hospital with 5,000 beds becomes harder to manage than one with 500 beds. More layers of administration raise costs per patient.",
    },
    {
      title: "How This Determines Market Structure",
      content: "Here's the key insight: where market demand falls on the LRAC curve determines how many firms the market can support.",
      visual: "structure",
      insight: "",
      examples: [
        { label: "Natural Monopoly", icon: "🔵", desc: "LRAC still falling at market demand. One firm can supply the whole market cheaper than two. Example: local water utility." },
        { label: "Oligopoly", icon: "🟡", desc: "LRAC levels off — a few large firms can reach efficient scale. Example: airline industry." },
        { label: "Monopolistic Competition", icon: "🟢", desc: "LRAC flat, minimum efficient scale is small. Many firms can operate efficiently. Example: coffee shops." },
        { label: "Perfect Competition", icon: "⚪", desc: "Minimum scale is tiny relative to market demand. Hundreds of firms. Example: wheat farming." },
      ],
    },
  ];

  const svgW = 380, svgH = 180;
  const padL = 36, padR = 14, padT = 16, padB = 30;
  const w = svgW - padL - padR, h = svgH - padT - padB;

  // LRAC curve points
  const lracPts = Array.from({ length: 50 }, (_, i) => {
    const x = i / 49;
    const y = 2.8 * Math.pow(x - 0.42, 2) + 0.22;
    return { px: padL + x * w, py: padT + (1 - Math.min(y, 1)) * h };
  });
  const lracPath = lracPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(" ");
  const minPt = lracPts[21];

  function LracSVG({ highlightZone, demandX }: { highlightZone?: "left" | "mid" | "right"; demandX?: number }) {
    return (
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ display: "block", maxWidth: svgW, margin: "0 auto" }} role="img" aria-label="LRAC curve">
        {/* Zone shading */}
        {(!highlightZone || highlightZone === "left")  && <rect x={padL} y={padT} width={w*0.38} height={h} fill="hsl(var(--primary))" fillOpacity={highlightZone === "left" ? 0.15 : 0.04} />}
        {(!highlightZone || highlightZone === "mid")   && <rect x={padL+w*0.38} y={padT} width={w*0.3} height={h} fill="#10b981" fillOpacity={highlightZone === "mid" ? 0.15 : 0.04} />}
        {(!highlightZone || highlightZone === "right") && <rect x={padL+w*0.68} y={padT} width={w*0.32} height={h} fill="#ef4444" fillOpacity={highlightZone === "right" ? 0.15 : 0.04} />}
        {/* Zone labels */}
        <text x={padL+w*0.19} y={padT+11} textAnchor="middle" fontSize="10" fill="#1e40af" fontWeight={highlightZone==="left"?"bold":"normal"}>Economies</text>
        <text x={padL+w*0.53} y={padT+11} textAnchor="middle" fontSize="10" fill="#065f46" fontWeight={highlightZone==="mid"?"bold":"normal"}>Constant</text>
        <text x={padL+w*0.84} y={padT+11} textAnchor="middle" fontSize="10" fill="#991b1b" fontWeight={highlightZone==="right"?"bold":"normal"}>Diseconomies</text>
        {/* Axes */}
        <line x1={padL} x2={svgW-padR} y1={svgH-padB} y2={svgH-padB} stroke="#94a3b8" strokeWidth="1.5" />
        <line x1={padL} x2={padL} y1={padT} y2={svgH-padB} stroke="#94a3b8" strokeWidth="1.5" />
        <text x={(padL+svgW-padR)/2} y={svgH-6} textAnchor="middle" fontSize="10" fill="#1e293b">Output →</text>
        <text x={12} y={(padT+svgH-padB)/2} textAnchor="middle" fontSize="10" fill="#1e293b" transform={`rotate(-90,12,${(padT+svgH-padB)/2})`}>LRAC →</text>
        {/* Curve */}
        <path d={lracPath} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinejoin="round" />
        <text x={svgW-padR+2} y={lracPts[49].py+4} fontSize="10" fill="hsl(var(--primary))" fontWeight="bold">LRAC</text>
        {/* Min efficient scale */}
        <circle cx={minPt.px} cy={minPt.py} r={3} fill="hsl(var(--primary))" />
        {/* Demand line */}
        {demandX !== undefined && (
          <line x1={padL + demandX * w} x2={padL + demandX * w} y1={padT} y2={svgH-padB} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />
        )}
      </svg>
    );
  }

  const s = steps[step];
  const visualMap: { [k: string]: JSX.Element } = {
    "lrac":           <LracSVG />,
    "lrac-economies": <LracSVG highlightZone="left" />,
    "lrac-constant":  <LracSVG highlightZone="mid" />,
    "lrac-dis":       <LracSVG highlightZone="right" />,
    "structure":      <LracSVG />,
  };

  return (
    <div className="space-y-4">
      {/* Progress pills */}
      <div className="flex gap-1.5" aria-label="Scale Explorer progress">
        {steps.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>

      {/* Step card */}
      <div className="bg-card border-2 border-primary/20 rounded-xl overflow-hidden">
        <div className="bg-primary/10 px-4 py-2 border-b border-border">
          <p className="text-xs font-bold text-primary uppercase tracking-wide">Step {step + 1} of {steps.length}</p>
          <p className="font-bold text-foreground text-base">{s.title}</p>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-sm text-foreground leading-relaxed">{s.content}</p>

          {/* Visual */}
          <div className="bg-muted rounded-xl py-3">{visualMap[s.visual]}</div>

          {/* Insight */}
          {s.insight && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800">
              💡 {s.insight}
            </div>
          )}

          {/* Market structure examples (last step) */}
          {s.examples && (
            <div className="space-y-2 mt-2">
              {s.examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-2 bg-muted rounded-xl p-3">
                  <span className="text-xl flex-shrink-0">{ex.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-foreground">{ex.label}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{ex.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)}
            className="px-4 py-2.5 bg-muted hover:bg-accent text-muted-foreground rounded-xl text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            ← Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button onClick={() => { setStep(s => s + 1); setEngaged(true); }}
            className="flex-1 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            Next →
          </button>
        ) : (
          <button onClick={onComplete}
            className="flex-1 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
            Mark Complete ✓
          </button>
        )}
      </div>
    </div>
  );
}
const MARKET_CATS = [
  { key: "perfect",   label: "Perfect Competition",     color: "bg-blue-100 text-blue-800 border-blue-300" },
  { key: "monopoly",  label: "Monopoly",                color: "bg-red-100 text-red-800 border-red-300" },
  { key: "oligopoly", label: "Oligopoly",               color: "bg-amber-100 text-amber-800 border-amber-300" },
  { key: "moncomp",   label: "Monopolistic Competition", color: "bg-purple-100 text-purple-800 border-purple-300" },
];

const MARKET_ITEMS = [
  { id: 1, industry: "Wheat farming",                    correct: "perfect",   exp: "Thousands of identical farms, price-taking behavior — classic perfect competition." },
  { id: 2, industry: "Local tap water utility",          correct: "monopoly",  exp: "Natural monopoly — high fixed costs, single provider, often regulated." },
  { id: 3, industry: "U.S. commercial airline industry", correct: "oligopoly", exp: "A few dominant carriers (Delta, United, Southwest) with significant market power." },
  { id: 4, industry: "Restaurant industry",              correct: "moncomp",   exp: "Many restaurants with differentiated menus, brands, and locations — low barriers." },
  { id: 5, industry: "Smartphone manufacturing",         correct: "oligopoly", exp: "Dominated by Apple and Samsung, with a few others — high R&D and brand barriers." },
  { id: 6, industry: "Foreign currency exchange market", correct: "perfect",   exp: "Millions of buyers/sellers, homogeneous product (currency), price-taking traders." },
  { id: 7, industry: "Cable TV / internet service",      correct: "monopoly",  exp: "Often a local monopoly — high infrastructure costs create natural monopoly conditions." },
  { id: 8, industry: "Coffee shop chains",               correct: "moncomp",   exp: "Many firms (Starbucks, local shops) with differentiated products and easy entry." },
];

function MarketsStation({ onComplete }: { onComplete: () => void }) {
  const [placed, setPlaced] = useState<{ [id: number]: string }>({});
  const [checked, setChecked] = useState(false);
  const allPlaced = MARKET_ITEMS.every(s => placed[s.id] !== undefined);
  const score = MARKET_ITEMS.filter(s => placed[s.id] === s.correct).length;

  const catColor = (key: string) => MARKET_CATS.find(c => c.key === key)?.color || "";
  const catLabel = (key: string) => MARKET_CATS.find(c => c.key === key)?.label || key;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Classify each industry by its market structure.</p>

      <div className="space-y-2">
        {MARKET_ITEMS.map(item => {
          const chosen = placed[item.id];
          const isCorrect = checked && chosen === item.correct;
          const isWrong = checked && chosen !== undefined && chosen !== item.correct;
          return (
            <div key={item.id} className={`rounded-xl border-2 p-4 transition-all ${checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-400 bg-red-50" : "border-border bg-card") : "border-border bg-card"}`}>
              <p className="text-sm font-medium text-foreground mb-2">
                {checked && (isCorrect ? "✓ " : isWrong ? "✗ " : "")}{item.industry}
                {isWrong && <span className="text-xs text-red-600 ml-2 font-semibold">→ {catLabel(item.correct)}</span>}
              </p>
              {!checked && (
                <div className="flex gap-2 flex-wrap" role="group" aria-label="Market structure options">
                  {MARKET_CATS.map(cat => (
                    <button key={cat.key} onClick={() => setPlaced(prev => ({ ...prev, [item.id]: cat.key }))}
                      aria-pressed={placed[item.id] === cat.key}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${placed[item.id] === cat.key ? cat.color + " border-current" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
              {checked && chosen && (
                <div className="mt-2 space-y-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${catColor(chosen)}`}>{catLabel(chosen)}</span>
                  <p className="text-xs text-muted-foreground leading-snug mt-1">{item.exp}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {checked && (
        <div role="alert" aria-live="polite" className={`p-3 rounded-xl text-sm font-semibold text-center ${score === MARKET_ITEMS.length ? "bg-green-100 text-green-800" : "bg-amber-50 text-amber-800"}`}>
          {score === MARKET_ITEMS.length ? "🎉 Perfect! All 8 industries correctly classified." : `${score} / ${MARKET_ITEMS.length} correct.`}
        </div>
      )}

      {allPlaced && !checked && <button onClick={() => setChecked(true)} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">Check My Answers</button>}
      {checked && <button onClick={onComplete} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">Mark Complete ✓</button>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Quiz
// ─────────────────────────────────────────────
type QA = { q: string; opts: string[]; correct: number | number[]; multi?: boolean; exp: string };

const QUIZ_QS: QA[] = [
  { q: "A firm owner works in her own business instead of taking a $65,000/year corporate job. The $65,000 is best classified as:", opts: ["An explicit cost, recorded on the income statement", "An implicit cost — a foregone opportunity with real economic value", "Neither a cost nor a benefit since no cash changes hands", "A sunk cost that should be ignored in business decisions"], correct: 1, exp: "Implicit costs are opportunity costs of using owned resources. The foregone $65,000 salary is a real economic cost even though no paycheck is written." },
  { q: "Accounting profit equals $80,000 and implicit costs equal $95,000. What is the economic profit?", opts: ["$175,000", "$80,000", "−$15,000", "$95,000"], correct: 2, exp: "Economic profit = Accounting profit − Implicit costs = $80,000 − $95,000 = −$15,000. The firm is earning less than its full opportunity cost — below normal profit." },
  { q: "The law of diminishing marginal returns states that:", opts: ["As a firm grows larger, long-run average costs eventually rise", "In the short run, adding more variable inputs to a fixed input eventually yields smaller increases in output", "Firms in competitive markets must accept lower prices as output expands", "Total product falls when too many workers are hired"], correct: 1, exp: "Diminishing marginal returns is a short-run concept: as variable inputs (e.g. labor) are added to a fixed input (e.g. capital), marginal product eventually declines." },
  { q: "A barbershop has fixed costs of $200/day and variable costs of $100/barber. With 3 barbers and 60 haircuts, what is the Average Total Cost (ATC)?", opts: ["$3.33", "$5.00", "$8.33", "$10.00"], correct: 2, exp: "TC = FC + VC = $200 + 3×$100 = $500. ATC = TC/Q = $500/60 = $8.33 per haircut." },
  { q: "Marginal cost (MC) is defined as:", opts: ["Total variable cost divided by output", "Total cost divided by output", "The change in total cost when output increases by one unit", "The sum of average variable and average fixed cost"], correct: 2, exp: "MC = ΔTC/ΔQ — the additional cost of producing one more unit. It equals the slope of the total cost curve." },
  { q: "When Marginal Cost is below Average Total Cost, ATC is:", opts: ["Rising", "Falling", "At its minimum", "Equal to AVC"], correct: 1, exp: "When MC < ATC, each additional unit is cheaper than the average, pulling the average down. ATC falls. When MC > ATC, ATC rises. MC crosses ATC at ATC's minimum." },
  { q: "A firm experiencing economies of scale has a Long-Run Average Cost curve that is:", opts: ["Horizontal across all output levels", "Falling as output increases", "Rising as output increases", "U-shaped with a minimum at low output"], correct: 1, exp: "Economies of scale = LRAC falls as output rises. Larger scale lowers per-unit costs. The downward-sloping portion of the LRAC represents this range." },
  { q: "Which market structure is characterized by many sellers, differentiated products, and easy entry/exit?", opts: ["Perfect competition", "Monopolistic competition", "Oligopoly", "Monopoly"], correct: 1, exp: "Monopolistic competition: many firms, product differentiation (branding, quality), and low barriers. Examples: restaurants, hairstylists, coffee shops." },
  { q: "Which of the following are characteristics of a perfectly competitive market? (Select all that apply)", opts: ["Many small buyers and sellers", "Identical (homogeneous) products", "Individual firms are price takers", "Significant barriers to entry"], correct: [0, 1, 2], multi: true, exp: "Perfect competition requires: many buyers/sellers, identical products, price-taking behavior, and FREE entry/exit (no significant barriers). High barriers would indicate oligopoly or monopoly." },
  { q: "A natural monopoly arises when: (Select all that apply)", opts: ["A single firm has a government-granted patent", "Economies of scale persist across the entire level of market demand", "One firm's LRAC is still declining at the output level that meets total market demand", "The product is essential and has no close substitutes"], correct: [1, 2], multi: true, exp: "A natural monopoly occurs specifically when the LRAC is still falling across the entire market demand — one firm can supply the whole market cheaper than two firms splitting it. This is distinct from legal monopolies (patents) or monopolies based on essential goods." },
];

function QuizStation({ onPass, onFail }: { onPass: (score: number, results: { correct: boolean; exp: string }[]) => void; onFail: (score: number, results: { correct: boolean; exp: string }[]) => void }) {
  const [questions] = useState(() => shuffle(QUIZ_QS).map(q => {
    const s = shuffleOpts(q.opts, q.correct);
    return { ...q, opts: s.opts, correct: s.correct };
  }));
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

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
  const score = questions.filter((_, i) => isAnswerCorrect(i)).length;

  function handleSubmit() {
    const results = questions.map((q, i) => ({ correct: isAnswerCorrect(i), exp: q.exp }));
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
            className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
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
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700">
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
// Not Yet
// ─────────────────────────────────────────────
function NotYetScreen({ score, onRetry }: { score: number; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#fef3c7" }}>
      <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-4">
        <div className="text-5xl" aria-hidden="true">📖</div>
        <h2 className="text-2xl font-bold text-amber-700">Not Yet</h2>
        <p className="text-foreground">You scored <span className="font-bold">{score}/10</span>. Mastery requires 9 out of 10 correct.</p>
        <p className="text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-xl p-3">This screen cannot be submitted. Only the final Results screen counts.</p>
        <button onClick={onRetry} className="w-full py-3 bg-amber-500 hover:opacity-90 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700">
          <RotateCcw size={16} aria-hidden="true" /> Try Again
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Results
// ─────────────────────────────────────────────
function ResultsScreen({ score, results, onRetry }: { score: number; results: { correct: boolean; exp: string }[]; onRetry: () => void }) {
  const [reflection, setReflection] = useState("");
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
      + '<p style="color:#475569;margin:2px 0">Chapter 7: Production, Costs and Industry Structure</p>'
      + '<p style="font-size:22px;font-weight:bold;background:#1e2d4a;color:white;display:inline-block;padding:4px 16px;border-radius:99px;margin:8px 0">' + score + ' / 10</p>'
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<h3 style="font-size:13px;margin:0 0 6px">Question Review</h3>' + items
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<p style="font-size:13px"><b>Exit Ticket:</b></p><p style="border:1px solid #ccc;padding:8px;border-radius:4px;font-size:13px;min-height:40px">' + (reflection || '') + '</p>'
      + '<p style="font-size:13px;margin-top:12px"><b>Student Name:</b></p><p style="border:1px solid #000;padding:8px;border-radius:4px;font-size:14px;font-weight:bold">' + studentName + '</p>'
      + '<p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:16px;padding-top:8px">ECO 211 · Chapter 7: Production, Costs and Industry Structure · Printed ' + new Date().toLocaleDateString() + ' · Access for free at https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction</p>'
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
          <div className="text-xs font-semibold text-foreground">ECO 211 ECONLAB · Chapter 7: Production, Costs and Industry Structure</div>
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
        <p className="text-xs text-muted-foreground mb-3">In your own words, explain the difference between accounting profit and economic profit. Why might a business owner care about the difference?</p>
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


// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────
const CH7_STATIONS = [
  { id: "costs",   short: "Costs",    label: "Explicit & Implicit Costs",    desc: "Accounting vs. economic profit" },
  { id: "profit",  short: "Profit",   label: "Profit Calculations",           desc: "TR, TC, and profit maximization" },
  { id: "mp",      short: "Marginal", label: "Marginal Product & Costs",      desc: "MC, ATC, AVC curves" },
  { id: "curves",  short: "Curves",   label: "Cost Curves Table",             desc: "Fill in the short-run cost table" },
  { id: "scale",   short: "Scale",    label: "Economies of Scale",            desc: "LRAC and scale effects" },
  { id: "markets", short: "Markets",  label: "Market Structure Classifier",   desc: "Classify firms by market structure" },
];

function Header({ station, onStation, completed }: { station: Station; onStation: (s: Station) => void; completed: Set<Station> }) {
  const stations: { id: Station; label: string }[] = [
    { id: "intro",   label: "Dashboard" },
    { id: "costs",   label: "Costs" },
    { id: "profit",  label: "Profit" },
    { id: "mp",      label: "Marginal" },
    { id: "curves",  label: "Curves" },
    { id: "scale",   label: "Scale" },
    { id: "markets", label: "Markets" },
    { id: "quiz",    label: "Quiz" },
  ];
  const CONTENT_STATIONS: Station[] = ["costs","profit","mp","curves","scale","markets"];
  const allDone = CONTENT_STATIONS.every(s => completed.has(s as Station));
  const stationOrder: Station[] = ["intro","costs","profit","mp","curves","scale","markets","quiz","results","not-yet"];
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
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 7</div>
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


export default function EconLab() {
  const [station, setStation] = useState<Station>("intro");
  const [completed, setCompleted] = useState<Set<Station>>(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);

  const allStationsDone = CH7_STATIONS.every(s => completed.has(s.id as Station));

  function go(s: Station) { setStation(s); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function markComplete(s: Station) { setCompleted(prev => new Set([...prev, s])); go("intro"); }

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded z-50">Skip to main content</a>
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}

      <Header station={station} onStation={go} completed={completed} />

      <main id="main-content" ref={mainRef} className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {station === "intro" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-primary/5 border-2 border-primary/20 p-5">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Key Idea</p>
              <p className="text-base font-semibold text-foreground">"Every Cost Is an Opportunity Cost"</p>
              <p className="text-sm text-muted-foreground mt-1">Production decisions depend on <em>all</em> costs — explicit and implicit. Economic profit, not accounting profit, determines whether a firm truly covers its opportunity costs.</p>
            </div>
            <button onClick={() => setShowSummary(true)}
              className="w-full text-left rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 transition flex items-center gap-2">
              <span>📄</span>
              <span>Need a refresher? <span className="text-primary font-semibold underline">View the Chapter 7 summary.</span></span>
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {CH7_STATIONS.map(s => {
                const done = completed.has(s.id as Station);
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
                  className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-base transition flex items-center justify-center gap-2">
                  <Award size={20} aria-hidden="true" /> Take the Quiz
                </button>
              : <div className="w-full py-4 bg-muted text-muted-foreground/60 rounded-xl font-bold text-base text-center" role="status">🔒 Quiz — Complete all stations to unlock</div>
            }
          </div>
        )}

        {station !== "intro" && station !== "quiz" && station !== "not-yet" && station !== "results" && (
          <div className="space-y-4">
            <button onClick={() => go("intro")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />← Dashboard
            </button>
          </div>
        )}

        {station === "costs"   && <CostsStation onComplete={() => markComplete("costs")} />}
        {station === "profit"  && <ProfitStation onComplete={() => markComplete("profit")} />}
        {station === "mp"      && <MPStation onComplete={() => markComplete("mp")} />}
        {station === "curves"  && <CurvesStation onComplete={() => markComplete("curves")} />}
        {station === "scale"   && <ScaleStation onComplete={() => markComplete("scale")} />}
        {station === "markets" && <MarketsStation onComplete={() => markComplete("markets")} />}
        {station === "quiz" && (
          <div className="space-y-4">
            <button onClick={() => go("intro")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />← Dashboard
            </button>
            <QuizStation
              onPass={(score, results) => { setQuizScore(score); setQuizResults(results); go("results"); }}
              onFail={(score, results) => { setQuizScore(score); setQuizResults(results); go("not-yet"); }}
            />
          </div>
        )}
      {station === "not-yet" && <NotYetScreen score={quizResults.filter(r => r.correct).length} onRetry={() => { setQuizResults([]); go("quiz"); }} />}
      {station === "results" && <ResultsScreen score={quizScore} results={quizResults} onRetry={() => { setCompleted(new Set()); setQuizResults([]); go("intro"); }} />}
      </main>
    </>
  );
}
