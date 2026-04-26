import { useState, useRef } from "react";
import { ChevronLeft, Award, RotateCcw, BookOpen } from "lucide-react";

type Section = "intro" | "structures" | "costs" | "marketpower" | "antitrust" | "quiz" | "results" | "not-yet";

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

// ─── Quick Reference Summary ───
const REFERENCE = [
  { ch: "Ch7", title: "Production, Costs & Scale", bullets: ["Explicit costs = actual payments; Implicit costs = opportunity costs", "Economic profit = TR − (explicit + implicit costs)", "MC = ΔTC/ΔQ; ATC = TC/Q; AVC = VC/Q", "Diminishing marginal returns: MP eventually falls as variable inputs increase", "LRAC U-shaped: economies → constant → diseconomies of scale"] },
  { ch: "Ch8", title: "Perfect Competition", bullets: ["4 conditions: many sellers, identical products, easy entry/exit, perfect info", "Price taker: MR = Price; demand curve is horizontal", "Profit max: MR = MC; P from demand curve", "Short-run: operate if P > AVC; shutdown if P < AVC", "Long-run: free entry/exit → economic profit = 0; P = MC = AC"] },
  { ch: "Ch9", title: "Monopoly", bullets: ["Price maker: downward-sloping demand; MR < Price always", "Profit max: MR = MC, then charge demand-curve price", "Natural monopoly: one firm cheapest due to economies of scale", "Regulation options: unregulated / break up / P=MC (needs subsidy) / P=AC (most practical)", "Inefficiencies: P > MC (allocative) + P > min AC (productive)"] },
  { ch: "Ch10", title: "Monopolistic Competition & Oligopoly", bullets: ["Monopolistic competition: many sellers + differentiated products + easy entry", "SR: can earn profit; LR: entry drives profit → 0, P = AC but P > MC", "Oligopoly: few firms, high barriers, interdependent decisions", "Prisoner's dilemma: dominant strategy to defect → cartels unstable", "Cartels: illegal; HHI > 1,800 = highly concentrated"] },
  { ch: "Ch11", title: "Antitrust & Regulation", bullets: ["4-Firm Ratio = sum of top 4 market shares", "HHI = sum of squared market shares; <1,000 low, >1,800 high concentration", "FTC: approve / approve with conditions / block mergers", "Illegal: price fixing, cartels; Gray area: tying, bundling, predatory pricing", "Cost-plus vs. price cap regulation; Regulatory capture risk"] },
];

function ReferenceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="ref-title">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 id="ref-title" className="text-lg font-bold text-foreground">📚 Ch7–11 Quick Reference</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" aria-label="Close">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {REFERENCE.map((sec, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">{sec.ch}</span>
                <span className="font-semibold text-foreground text-sm">{sec.title}</span>
              </div>
              <ul className="space-y-1">
                {sec.bullets.map((b, j) => <li key={j} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary shrink-0">•</span>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={onClose} className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition">Close &amp; Return to Lab</button>
        </div>
      </div>
    </div>
  );
}

// ─── Section 1: Market Structures Grand Classifier ───
type Structure = "perfect" | "mono_comp" | "oligopoly" | "monopoly";
const STRUCT_LABELS: Record<Structure, string> = { perfect: "Perfect Competition", mono_comp: "Monopolistic Competition", oligopoly: "Oligopoly", monopoly: "Monopoly" };
const STRUCT_COLORS: Record<Structure, string> = { perfect: "border-blue-400 bg-blue-50 text-blue-800", mono_comp: "border-teal-400 bg-teal-50 text-teal-800", oligopoly: "border-amber-400 bg-amber-50 text-amber-800", monopoly: "border-red-400 bg-red-50 text-red-800" };

const STRUCT_ITEMS = [
  { name: "A wheat farmer in Kansas", correct: "perfect" as Structure, exp: "Thousands of identical sellers, no pricing power — price taker. Textbook perfect competition." },
  { name: "Domino's Pizza", correct: "mono_comp" as Structure, exp: "Many pizza sellers, but each is differentiated by brand, menu, location, and service. Easy entry — monopolistic competition." },
  { name: "Boeing commercial aircraft", correct: "oligopoly" as Structure, exp: "Only Boeing and Airbus make large commercial jets globally. Duopoly with massive entry barriers." },
  { name: "Duke Energy (electric utility)", correct: "monopoly" as Structure, exp: "Single provider of electricity in its service area. Natural monopoly — regulated by state utilities commission." },
  { name: "U.S. wireless carriers (Verizon, AT&T, T-Mobile)", correct: "oligopoly" as Structure, exp: "Three dominant firms, high barriers, interdependent pricing — classic oligopoly." },
  { name: "A hair salon in a large city", correct: "mono_comp" as Structure, exp: "Many salons differentiated by stylist, price, location, specialty. Low barriers — monopolistic competition." },
  { name: "Stock exchange (NYSE shares)", correct: "perfect" as Structure, exp: "Identical shares, millions of buyers and sellers, public prices — very close to perfect competition." },
  { name: "Pfizer with a patent on a drug", correct: "monopoly" as Structure, exp: "Patent gives Pfizer exclusive legal right to produce and sell that drug — a legal monopoly for 20 years." },
  { name: "Fast food chains (McDonald's, Burger King, Wendy's)", correct: "mono_comp" as Structure, exp: "Many sellers of differentiated products (brand, menu, atmosphere). Easy entry — monopolistic competition." },
  { name: "OPEC oil-producing nations", correct: "oligopoly" as Structure, exp: "A few dominant producers coordinating output decisions — classic cartel/oligopoly." },
  { name: "A soybean farmer in Iowa", correct: "perfect" as Structure, exp: "Commodity market, identical product, world price taker — perfect competition." },
  { name: "Local water utility (sole provider)", correct: "monopoly" as Structure, exp: "Single supplier, no close substitute, natural monopoly from economies of scale in pipe infrastructure." },
];

const ALL_STRUCTURES: Structure[] = ["perfect", "mono_comp", "oligopoly", "monopoly"];

function StructuresSection({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [choices, setChoices] = useState<Record<string, Structure | null>>(() => Object.fromEntries(STRUCT_ITEMS.map(e => [e.name, null])));
  const [checked, setChecked] = useState(false);
  const [marked, setMarked] = useState(false);
  const allChosen = STRUCT_ITEMS.every(e => choices[e.name] !== null);
  const score = STRUCT_ITEMS.filter(e => choices[e.name] === e.correct).length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm font-semibold text-primary mb-1">Section 1 — The Grand Market Structure Classifier</p>
        <p className="text-sm text-muted-foreground">Classify each real-world example into one of the four market structures. Use the Quick Reference if you need a reminder.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_STRUCTURES.map(s => <span key={s} className={`px-2 py-1 rounded-full text-xs font-semibold border-2 ${STRUCT_COLORS[s]}`}>{STRUCT_LABELS[s]}</span>)}
      </div>
      <div className="space-y-3">
        {STRUCT_ITEMS.map(ex => {
          const chosen = choices[ex.name];
          const isCorrect = checked && chosen === ex.correct;
          const isWrong = checked && chosen !== null && chosen !== ex.correct;
          return (
            <div key={ex.name} className={`rounded-xl border-2 p-4 transition-all ${checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-300 bg-red-50" : "border-border") : "border-border bg-card"}`}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-foreground">{ex.name}</span>
                {checked && isWrong && <span className="text-xs text-red-600 font-semibold">→ {STRUCT_LABELS[ex.correct]}</span>}
                {checked && isCorrect && <span className="text-xs text-green-700 font-semibold">✓</span>}
              </div>
              <div className="flex flex-wrap gap-1">
                {ALL_STRUCTURES.map(s => {
                  const sel = chosen === s;
                  let cls = sel ? STRUCT_COLORS[s] + " border-current" : "border-border text-muted-foreground hover:border-primary/40";
                  if (checked && s === ex.correct) cls = STRUCT_COLORS[s] + " border-current";
                  else if (checked && sel && s !== ex.correct) cls = "border-red-400 bg-red-100 text-red-700";
                  return (
                    <button key={s} onClick={() => { if (!checked) setChoices(prev => ({ ...prev, [ex.name]: s })); }}
                      disabled={checked} aria-pressed={sel}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                      {STRUCT_LABELS[s]}
                    </button>
                  );
                })}
              </div>
              {checked && <p className="text-xs mt-2 text-muted-foreground italic">{ex.exp}</p>}
            </div>
          );
        })}
      </div>
      {!checked
        ? <button onClick={() => { if (allChosen) setChecked(true); }} disabled={!allChosen}
            className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Check My Answers</button>
        : <div className="space-y-3">
            <div className="rounded-xl bg-muted p-4 text-center">
              <p className="font-bold text-lg">{score} / {STRUCT_ITEMS.length}</p>
              <p className="text-sm text-muted-foreground">{score >= 11 ? "Excellent — you know all four structures cold!" : score >= 9 ? "Good — review any misses above." : "Review the Quick Reference for market structure definitions."}</p>
            </div>
            {!marked && <button onClick={() => { setMarked(true); onComplete(score, STRUCT_ITEMS.length); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>}
            {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Section Complete</p>}
          </div>
      }
    </div>
  );
}

// ─── Section 2: Cost & Profit Concepts Gauntlet ───
const COST_QS = [
  { q: "A bakery owner pays herself $60,000/year but could earn $80,000 working for someone else. Her salary is an implicit cost of $80,000. Her economic profit is:", opts: ["The same as accounting profit", "Accounting profit minus $80,000", "Accounting profit plus $80,000", "Zero always"], correct: 1, exp: "Economic profit = TR − explicit costs − implicit costs. The $80,000 foregone salary is an implicit cost. Economic profit = Accounting profit − $80,000." },
  { q: "A firm's Total Cost is $900 and output is 60 units. Its Average Total Cost (ATC) is:", opts: ["$54,000", "$15", "$6", "$60"], correct: 1, exp: "ATC = TC ÷ Q = $900 ÷ 60 = $15 per unit." },
  { q: "At Q=100, TC=$500. At Q=101, TC=$506. Marginal Cost of the 101st unit is:", opts: ["$500", "$506", "$6", "$5"], correct: 2, exp: "MC = ΔTC/ΔQ = ($506 − $500) / (101 − 100) = $6/unit." },
  { q: "The law of diminishing marginal returns says that as more workers are added to a fixed factory:", opts: ["Marginal product increases forever", "Total output falls immediately", "Marginal product eventually falls", "Average cost immediately rises"], correct: 2, exp: "Diminishing marginal returns: with a fixed input (factory), each additional variable input (worker) eventually adds less to output than the previous one." },
  { q: "A perfectly competitive firm with Market Price = $8 and AVC = $8.50 should:", opts: ["Keep producing — price is close to AVC", "Raise its price above $8", "Shut down immediately — price doesn't cover variable costs", "Reduce output by half"], correct: 2, exp: "The shutdown rule: if P < AVC, shut down immediately. Every unit produced deepens the loss. Here P ($8) < AVC ($8.50) → shut down." },
  { q: "In long-run equilibrium for a perfectly competitive market:", opts: ["Firms earn maximum economic profit", "P = MR = MC = AC and economic profit = zero", "Firms produce below minimum average cost", "Price exceeds marginal cost"], correct: 1, exp: "Long-run equilibrium: free entry/exit drives P = min AC. Economic profit = 0. Productive and allocative efficiency are both achieved." },
  { q: "Economies of scale occur when:", opts: ["Long-run average cost rises as output increases", "Long-run average cost falls as output increases", "Marginal cost equals average total cost", "Fixed costs increase with output"], correct: 1, exp: "Economies of scale: as the firm grows, per-unit long-run costs fall. This is why large firms can undercut smaller rivals on price." },
];

function CostsSection({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(COST_QS.length).fill(null));
  const [checked, setChecked] = useState<boolean[]>(Array(COST_QS.length).fill(false));
  const [marked, setMarked] = useState(false);
  const q = COST_QS[qIdx];
  const ans = answers[qIdx];
  const isChecked = checked[qIdx];
  const allDone = checked.every(Boolean);
  const score = COST_QS.filter((q, i) => answers[i] === q.correct).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Question {qIdx + 1} of {COST_QS.length}</span>
        <div className="flex gap-1">{COST_QS.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === qIdx ? "bg-primary" : checked[i] ? (answers[i] === COST_QS[i].correct ? "bg-green-500" : "bg-red-400") : "bg-muted"}`} />)}</div>
      </div>
      <div className="rounded-xl bg-card border-2 border-border p-5">
        <p className="font-semibold text-sm text-foreground mb-3">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, oi) => {
            const sel = ans === oi;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (isChecked) {
              if (oi === q.correct) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
              else if (sel) cls = "border-red-400 bg-red-100 text-red-700";
            }
            return (
              <button key={oi} onClick={() => { if (!isChecked) setAnswers(p => { const n = [...p]; n[qIdx] = oi; return n; }); }}
                disabled={isChecked} aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                {isChecked && oi === q.correct && "✓ "}{opt}
              </button>
            );
          })}
        </div>
        {isChecked && <p className="text-xs mt-3 text-muted-foreground italic bg-muted/50 p-2 rounded-lg">{q.exp}</p>}
      </div>
      {!isChecked
        ? <button onClick={() => { if (ans !== null) setChecked(p => { const n = [...p]; n[qIdx] = true; return n; }); }} disabled={ans === null}
            className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Check Answer</button>
        : <div className="flex gap-3">
            {qIdx > 0 && <button onClick={() => setQIdx(qIdx - 1)} className="flex-1 py-3 rounded-xl border-2 border-border text-sm font-semibold text-muted-foreground hover:border-primary/40 transition">← Back</button>}
            {qIdx < COST_QS.length - 1
              ? <button onClick={() => setQIdx(qIdx + 1)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next →</button>
              : allDone && !marked
                ? <div className="flex-1 space-y-2">
                    <div className="rounded-xl bg-muted p-3 text-center text-sm"><span className="font-bold">{score}/{COST_QS.length}</span> correct</div>
                    <button onClick={() => { setMarked(true); onComplete(score, COST_QS.length); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
                  </div>
                : marked ? <p className="flex-1 text-center text-green-700 font-semibold text-sm py-3">✓ Section Complete</p> : null
            }
          </div>
      }
    </div>
  );
}

// ─── Section 3: Market Power Decisions ───
const MP_SCENARIOS = [
  {
    title: "The Monopolist's Table",
    desc: "table:A monopolist faces this demand schedule.|Q|TR|TC|MR|MC|4|$36|$22|$7|$4|5|$45|$26|$5|$4|6|$54|$32|$3|$5",
    question: "At what quantity does this monopolist maximize profit, and what is the profit?",
    opts: ["Q=4, because profit is highest at lower output", "Q=5, because MR ($5) > MC ($4) at Q=5 and MR ($3) < MC ($5) at Q=6. Profit = TR($45) − TC($26) = $19", "Q=6, because total revenue is higher", "Q=3, because MC is lowest"],
    correct: 1,
    exp: "The MR = MC rule: produce as long as MR > MC. At Q=5, MR=$5 > MC=$4 — produce it. At Q=6, MR=$3 < MC=$5 — stop. Profit = $45 − $26 = $19. The monopolist then charges the demand curve price at Q=5.",
  },
  {
    title: "Monopolistic Competitor — Long Run",
    desc: "A coffee shop in a competitive neighborhood is currently earning $15,000 in economic profit. It produces where MR = MC and charges the demand-curve price.",
    question: "What should the coffee shop owner expect to happen over time?",
    opts: ["Profits will rise as customers become loyal", "New coffee shops will enter, stealing customers until this shop's economic profit approaches zero", "The government will regulate the coffee shop's price", "Existing shops will exit, raising profits further"],
    correct: 1,
    exp: "Easy entry is the defining feature of monopolistic competition. Positive profit attracts new entrants who offer more substitutes. This shifts the existing shop's demand left until economic profit = 0 in the long run.",
  },
  {
    title: "The Oligopoly Temptation",
    desc: "Three airlines on the Chicago–Miami route are each earning $5M profit at competitive prices. They could collectively earn $12M total (split three ways) if they all raised fares. Each has an individual incentive to NOT raise fares while hoping rivals will.",
    question: "This situation is an example of which concept?",
    opts: ["Natural monopoly", "The prisoner's dilemma — the dominant strategy for each firm makes all worse off", "Perfect competition equilibrium", "Regulatory capture"],
    correct: 1,
    exp: "Classic prisoner's dilemma in oligopoly: the dominant strategy for each airline is to keep fares low (defect from the cooperation). When all defect, everyone earns less than if they had cooperated — but cooperation is unstable (and illegal if explicit).",
  },
  {
    title: "Natural Monopoly Regulation Choice",
    desc: "A regional electric grid is a natural monopoly. A regulator must choose between: (A) P = MC — achieves allocative efficiency but firm loses money, (B) P = AC — firm survives, prices lower than unregulated monopoly, (C) No regulation — firm sets MR = MC.",
    question: "Which option best balances financial viability and consumer protection?",
    opts: ["Option A (P = MC) — most economically efficient", "Option B (P = AC) — firm stays solvent without subsidy, prices kept below monopoly level", "Option C (no regulation) — firms know best how to set prices", "Break up the monopoly into 10 competing firms"],
    correct: 1,
    exp: "P = AC regulation is the practical standard for regulated utilities. Option A (P = MC) requires ongoing government subsidy. Option C leaves consumers at the mercy of monopoly pricing. Breaking up a natural monopoly raises average costs.",
  },
  {
    title: "MR < Price for a Monopolist",
    desc: "A monopolist can sell 5 units at $10 each (TR = $50) or 6 units at $9 each (TR = $54).",
    question: "What is the Marginal Revenue of the 6th unit?",
    opts: ["$9 (the price of the 6th unit)", "$4 (TR increases from $50 to $54)", "$10 (the original price)", "$54 (the new total revenue)"],
    correct: 1,
    exp: "MR = ΔTR/ΔQ = ($54 − $50) / (6 − 5) = $4. The 6th unit sells for $9, but requires the price on all previous 5 units to drop from $10 to $9 — losing $5 of revenue on those units. Net gain: $9 − $5 = $4. MR < Price.",
  },
];

function MarketPowerSection({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [scenarios] = useState(() => MP_SCENARIOS.map(s => { const sh = shuffleOpts(s.opts, s.correct); return { ...s, opts: sh.opts, correct: sh.correct as number }; }));
  const [scenIdx, setScenIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(scenarios.length).fill(null));
  const [checked, setChecked] = useState<boolean[]>(Array(scenarios.length).fill(false));
  const [marked, setMarked] = useState(false);
  const scen = scenarios[scenIdx];
  const ans = answers[scenIdx];
  const isChecked = checked[scenIdx];
  const allDone = checked.every(Boolean);
  const score = scenarios.filter((s, i) => answers[i] === s.correct).length;

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {scenarios.map((s, i) => (
          <button key={i} onClick={() => setScenIdx(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition ${i === scenIdx ? "border-primary bg-primary text-primary-foreground" : checked[i] ? (answers[i] === scenarios[i].correct ? "border-green-400 bg-green-50 text-green-700" : "border-red-400 bg-red-50 text-red-700") : "border-border text-muted-foreground"}`}>
            {checked[i] ? (answers[i] === scenarios[i].correct ? "✓" : "✗") : i + 1}
          </button>
        ))}
      </div>
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="font-semibold text-primary text-sm mb-1">Scenario {scenIdx + 1}: {scen.title}</p>
        {scen.desc.startsWith("table:") ? (() => {
          const parts = scen.desc.slice(6).split("|");
          const label = parts[0];
          const headers = parts.slice(1, 6);
          const rows: string[][] = [];
          for (let i = 6; i < parts.length; i += 5) rows.push(parts.slice(i, i + 5));
          return (
            <div className="space-y-2">
              <p className="text-sm text-foreground">{label}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead><tr className="bg-primary/10">{headers.map((h, i) => <th key={i} className="px-3 py-2 text-center font-bold text-foreground border border-border">{h}</th>)}</tr></thead>
                  <tbody>{rows.map((row, ri) => <tr key={ri} className={ri % 2 === 0 ? "bg-card" : "bg-muted/30"}>{row.map((cell, ci) => <td key={ci} className="px-3 py-2 text-center text-foreground border border-border">{cell}</td>)}</tr>)}</tbody>
                </table>
              </div>
            </div>
          );
        })() : <p className="text-sm text-foreground">{scen.desc}</p>}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">{scen.question}</p>
        <div className="space-y-2">
          {scen.opts.map((opt, oi) => {
            const sel = ans === oi;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (isChecked) {
              if (oi === scen.correct) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
              else if (sel) cls = "border-red-400 bg-red-100 text-red-700";
            }
            return (
              <button key={oi} onClick={() => { if (!isChecked) setAnswers(p => { const n = [...p]; n[scenIdx] = oi; return n; }); }}
                disabled={isChecked} aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                {isChecked && oi === scen.correct && "✓ "}{opt}
              </button>
            );
          })}
        </div>
        {isChecked && <p className="text-xs mt-3 text-muted-foreground italic bg-muted/50 p-3 rounded-lg">{scen.exp}</p>}
      </div>
      {!isChecked
        ? <button onClick={() => { if (ans !== null) setChecked(p => { const n = [...p]; n[scenIdx] = true; return n; }); }} disabled={ans === null}
            className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Check Answer</button>
        : scenIdx < scenarios.length - 1
          ? <button onClick={() => setScenIdx(scenIdx + 1)} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next Scenario →</button>
          : allDone && !marked
            ? <div className="space-y-3">
                <div className="rounded-xl bg-muted p-3 text-center text-sm"><span className="font-bold">{score}/{scenarios.length}</span> correct</div>
                <button onClick={() => { setMarked(true); onComplete(score, scenarios.length); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
              </div>
            : marked ? <p className="text-center text-green-700 font-semibold text-sm">✓ Section Complete</p> : null
      }
    </div>
  );
}

// ─── Section 4: Antitrust & Regulation Matcher ───
const ANTITRUST_QS = [
  { q: "The Herfindahl-Hirschman Index is calculated by:", opts: ["Summing the top 4 firms' market shares", "Squaring each firm's market share and summing all results", "Dividing total industry revenue by number of firms", "Multiplying the 4-firm ratio by 100"], correct: 1, exp: "HHI = sum of squared market shares. Squaring gives disproportionate weight to larger firms — that's why it's more useful than the 4-firm ratio for detecting dominant-firm markets." },
  { q: "The FTC has three possible decisions when reviewing a proposed merger:", opts: ["Only approve or block", "Approve, block, or approve with conditions (require divestitures)", "Investigate, fine, or imprison executives", "Regulate prices, break up, or nationalize"], correct: 1, exp: "FTC merger decisions: approve (most common), block (rare), or approve with conditions — typically requiring the merged firm to sell certain assets or routes to preserve competition." },
  { q: "Price cap regulation creates stronger efficiency incentives than cost-plus regulation because:", opts: ["It sets price equal to marginal cost", "The price ceiling is set in advance — firms profit by cutting costs faster than the cap falls", "It requires no government monitoring", "It always results in lower prices for consumers"], correct: 1, exp: "Price cap: the regulator sets a maximum price years in advance. If the firm cuts costs faster than the cap declines, it keeps the difference as profit. This creates powerful incentives to be efficient." },
  { q: "Which of these is a GRAY AREA in antitrust law (not automatically legal or illegal)?", opts: ["Explicit price-fixing between competitors", "Bundling products together for sale as a package", "Forming a cartel to restrict output and raise price", "Giving a supplier kickbacks to exclude rivals"], correct: 1, exp: "Bundling (selling multiple products together) is often legal and efficient, but can be anticompetitive if a firm with market power uses it to foreclose rivals from adjacent markets. Courts evaluate each case." },
  { q: "Regulatory capture is MOST likely to occur when:", opts: ["A government regulator successfully reduces prices to the competitive level", "The regulated industry gains influence over who regulates them and what rules are written", "A natural monopoly is broken up into competing firms", "Congress passes strong new antitrust legislation"], correct: 1, exp: "Regulatory capture: the industry being regulated ends up controlling the regulatory process — through lobbying, information provision, and the 'revolving door' of regulators taking industry jobs. Regulations then protect incumbents rather than consumers." },
  { q: "A four-firm concentration ratio of 85% and HHI of 2,400 for a proposed merger market indicates:", opts: ["A competitive market — the FTC will approve quickly", "A highly concentrated market — the FTC will likely scrutinize the merger closely", "The market needs more firms to reduce the HHI", "A natural monopoly that should be regulated"], correct: 1, exp: "4-Firm Ratio of 85% (well above 50%) and HHI of 2,400 (well above 1,800) both signal high concentration. Any merger that increases HHI further would face intense FTC scrutiny and likely require conditions or be blocked." },
];

function AntitrustSection({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [scenarios] = useState(() => ANTITRUST_QS.map(s => { const sh = shuffleOpts(s.opts, s.correct); return { ...s, opts: sh.opts, correct: sh.correct as number }; }));
  const [answers, setAnswers] = useState<(number | null)[]>(Array(scenarios.length).fill(null));
  const [checked, setChecked] = useState<boolean[]>(Array(scenarios.length).fill(false));
  const [marked, setMarked] = useState(false);
  const q = scenarios[qIdx];
  const ans = answers[qIdx];
  const isChecked = checked[qIdx];
  const allDone = checked.every(Boolean);
  const score = scenarios.filter((q, i) => answers[i] === q.correct).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Question {qIdx + 1} of {scenarios.length}</span>
        <div className="flex gap-1">{scenarios.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === qIdx ? "bg-primary" : checked[i] ? (answers[i] === scenarios[i].correct ? "bg-green-500" : "bg-red-400") : "bg-muted"}`} />)}</div>
      </div>
      <div className="rounded-xl bg-card border-2 border-border p-5">
        <p className="font-semibold text-sm text-foreground mb-3">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, oi) => {
            const sel = ans === oi;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (isChecked) {
              if (oi === q.correct) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
              else if (sel) cls = "border-red-400 bg-red-100 text-red-700";
            }
            return (
              <button key={oi} onClick={() => { if (!isChecked) setAnswers(p => { const n = [...p]; n[qIdx] = oi; return n; }); }}
                disabled={isChecked} aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                {isChecked && oi === q.correct && "✓ "}{opt}
              </button>
            );
          })}
        </div>
        {isChecked && <p className="text-xs mt-3 text-muted-foreground italic bg-muted/50 p-2 rounded-lg">{q.exp}</p>}
      </div>
      {!isChecked
        ? <button onClick={() => { if (ans !== null) setChecked(p => { const n = [...p]; n[qIdx] = true; return n; }); }} disabled={ans === null}
            className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Check Answer</button>
        : <div className="flex gap-3">
            {qIdx > 0 && <button onClick={() => setQIdx(qIdx - 1)} className="flex-1 py-3 rounded-xl border-2 border-border text-sm font-semibold text-muted-foreground hover:border-primary/40 transition">← Back</button>}
            {qIdx < scenarios.length - 1
              ? <button onClick={() => setQIdx(qIdx + 1)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next →</button>
              : allDone && !marked
                ? <div className="flex-1 space-y-2">
                    <div className="rounded-xl bg-muted p-3 text-center text-sm"><span className="font-bold">{score}/{scenarios.length}</span> correct</div>
                    <button onClick={() => { setMarked(true); onComplete(score, scenarios.length); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
                  </div>
                : marked ? <p className="flex-1 text-center text-green-700 font-semibold text-sm py-3">✓ Section Complete</p> : null
            }
          </div>
      }
    </div>
  );
}

// ─── Cumulative Quiz — 15 questions, 13/15 gate ───
const QUIZ_POOL = [
  { q: "Which market structure achieves BOTH productive efficiency (P = min AC) and allocative efficiency (P = MC) in long-run equilibrium?", opts: ["Monopoly", "Oligopoly", "Monopolistic competition", "Perfect competition"], correct: 3, multi: false, exp: "Perfect competition: long-run equilibrium at P = MR = MC = min AC. Both efficiencies achieved simultaneously. No other structure achieves this." },
  { q: "The shutdown rule for a firm in the short run states:", opts: ["Shut down if P < ATC", "Shut down if P < AVC", "Shut down if TR < Fixed Costs", "Shut down if P < MC"], correct: 1, multi: false, exp: "Shutdown rule: if P < AVC, every unit produced deepens the loss. The firm minimizes losses by producing nothing. Fixed costs are unavoidable either way." },
  { q: "For a monopolist, Marginal Revenue is ALWAYS:", opts: ["Equal to price", "Greater than price", "Less than price", "Equal to zero"], correct: 2, multi: false, exp: "MR < Price for a monopolist because selling one more unit requires lowering price on ALL units — the revenue gained on the new unit is offset by revenue lost on previous units." },
  { q: "An oligopoly is characterized by:", opts: ["Many sellers of identical products", "One seller with no close substitutes", "A few dominant firms with high entry barriers and strategic interdependence", "Many sellers of differentiated products"], correct: 2, multi: false, exp: "Oligopoly = few firms + high barriers + interdependence. Each firm must consider how rivals will react to its pricing and output decisions." },
  { q: "Monopolistic competition differs from perfect competition primarily because:", opts: ["Products are identical in monopolistic competition", "Monopolistic competition has differentiated products giving some pricing power", "Entry is restricted in monopolistic competition", "Monopolistic competition achieves allocative efficiency"], correct: 1, multi: false, exp: "Product differentiation is the key difference. Each monopolistic competitor offers a slightly unique product, creating a downward-sloping demand curve and some pricing power." },
  { q: "A natural monopoly is best defined as:", opts: ["A monopoly created by government patent protection", "A market where one firm can supply the entire market at lower cost than multiple firms due to economies of scale", "A monopoly that has captured its regulator", "A firm that controls a key physical resource"], correct: 1, multi: false, exp: "Natural monopoly: economies of scale persist over such a large range of output that one firm is always cheaper than two or more. Splitting it up would raise average costs." },
  { q: "The HHI (Herfindahl-Hirschman Index) is calculated by:", opts: ["Summing the market shares of the top 4 firms", "Squaring each firm's market share and summing all results", "Multiplying the four-firm ratio by 100", "Dividing total revenue by number of firms"], correct: 1, multi: false, exp: "HHI = Σ(market share²). Squaring emphasizes the importance of large firms — a market with one firm at 80% looks very different from five firms at 16% even if both have the same 4-firm ratio." },
  { q: "The prisoner's dilemma explains why oligopoly cartels tend to break down because:", opts: ["Governments always detect and break up cartels immediately", "Each firm's dominant strategy is to defect/cheat, even though cooperation benefits all", "Firms always prefer competitive outcomes", "Cartel agreements are automatically null and void"], correct: 1, multi: false, exp: "Dominant strategy: regardless of what rivals do, each firm is better off defecting (undercutting). When all defect, everyone earns less than under cooperation — the classic dilemma." },
  { q: "Price cap regulation creates stronger cost-cutting incentives than cost-plus regulation because:", opts: ["Price caps set P = MC (allocatively efficient)", "Price caps are set in advance — firms keep the profit from cutting costs faster than caps decline", "Price caps guarantee a normal profit to the firm", "Cost-plus regulation rewards inefficiency by passing all cost increases to consumers"], correct: 1, multi: false, exp: "Price cap: the ceiling is fixed for years ahead. Any cost saving goes to the firm's profit, not back to the regulator. This creates powerful efficiency incentives — the opposite of cost-plus." },
  { q: "Regulatory capture describes:", opts: ["A government successfully controlling monopoly prices", "Regulated industries gaining strong influence over the regulatory process — regulations serve industry, not consumers", "A firm capturing market share from rivals", "Breaking a monopoly into smaller competing firms"], correct: 1, multi: false, exp: "Regulatory capture: the industry being regulated ends up controlling who regulates them, what information regulators get, and what rules are written. Regulations protect incumbents rather than consumers." },
  { q: "In the long run, a monopolistically competitive firm earns:", opts: ["Maximum economic profit (like a monopolist)", "Zero economic profit (free entry competes it away)", "Government-regulated profit", "Negative economic profit permanently"], correct: 1, multi: false, exp: "Easy entry competes away profits. New entrants steal market share, shifting each firm's demand left until P = AC and economic profit = 0 — just like perfect competition, but with P > MC still." },
  { q: "A firm earns $200,000 in accounting profit but the owner could earn $150,000 managing elsewhere. Economic profit is:", opts: ["$200,000", "$350,000", "$50,000", "−$150,000"], correct: 2, multi: false, exp: "Economic profit = Accounting profit − Implicit costs = $200,000 − $150,000 = $50,000. The $150,000 foregone salary is an implicit (opportunity) cost." },
  { q: "Which of the following are TRUE about perfect competition? (Select all that apply)", opts: ["Firms are price takers", "Products are identical (homogeneous)", "Economic profit is zero in the long run", "Firms face a downward-sloping demand curve"], correct: [0, 1, 2], multi: true, exp: "Perfect competition: price takers (horizontal demand), identical products, zero economic profit in LR. Downward-sloping demand describes monopolistic competitors and monopolists — not perfect competitors." },
  { q: "Which of the following are features of monopoly that create inefficiency? (Select all that apply)", opts: ["P > MC (allocative inefficiency)", "P = min AC (productive inefficiency)", "Less output than the competitive quantity", "May lack innovation incentives due to no competitive pressure"], correct: [0, 2, 3], multi: true, exp: "Monopoly inefficiencies: P > MC (allocative), P > min AC (productive — note P > min AC, not P = min AC), less output than competition, and weak innovation incentives. P = min AC would mean productive efficiency, which monopolists do NOT achieve." },
  { q: "Which of the following correctly distinguish cost-plus from price cap regulation? (Select all that apply)", opts: ["Cost-plus removes incentives to cut costs (higher costs = higher allowed price)", "Price cap creates efficiency incentives (firm profits from cutting costs below the cap)", "Cost-plus sets a price ceiling several years in advance", "Price cap is set based on accounting costs plus normal profit"], correct: [0, 1], multi: true, exp: "Cost-plus: price = accounting costs + normal profit (removes efficiency incentives). Price cap: ceiling set years ahead (creates efficiency incentives). These are switched in the wrong answers — cost-plus does NOT set a ceiling years in advance." },
];


// ─── Quiz Bank (Ch7–11, 20 questions, draw all) ───────────────────────────────
type QA = { q: string; opts: string[]; correct: number; multi?: boolean; exp: string };

const QUIZ_QUESTIONS: QA[] = [
  { q: "Which cost is an example of an implicit cost?", opts: ["Monthly rent paid to a landlord", "The foregone salary of an owner who manages their own business", "Wages paid to employees", "The cost of raw materials"], correct: 1, exp: "Implicit costs are opportunity costs — the value of the next-best foregone alternative. An owner's foregone salary is never written as a check but is a real economic cost." },
  { q: "Marginal Cost (MC) is defined as:", opts: ["Total Cost divided by quantity", "The change in Total Cost from producing one more unit", "Average Variable Cost plus Average Fixed Cost", "The cost of the last unit minus the cost of the first unit"], correct: 1, exp: "MC = ΔTC/ΔQ — the additional cost of producing one more unit. When MC < ATC, ATC falls; when MC > ATC, ATC rises." },
  { q: "In perfect competition, a firm's demand curve is:", opts: ["Downward sloping like the market demand curve", "Upward sloping", "Perfectly elastic (horizontal) at the market price", "Perfectly inelastic (vertical)"], correct: 2, exp: "Perfect competitors are price-takers. They can sell any quantity at the market price but nothing above it — so their individual demand curve is horizontal (perfectly elastic)." },
  { q: "The profit-maximizing rule for ALL firms is:", opts: ["Maximize total revenue", "Produce where MR = MC", "Produce where P = ATC", "Minimize average total cost"], correct: 1, exp: "MR = MC is the universal profit-maximization rule. Producing beyond this point adds more to cost than to revenue, reducing profit." },
  { q: "A monopolist's MR curve lies below its demand curve because:", opts: ["The monopolist charges a higher price than competitive firms", "To sell more units, the monopolist must lower the price on ALL units sold", "The government regulates monopoly prices", "Monopolists have higher costs than competitive firms"], correct: 1, exp: "A monopolist faces a downward-sloping demand curve. To sell the next unit, it must lower price on every unit — so MR < Price. MR falls twice as fast as demand." },
  { q: "Which outcome is associated with monopoly compared to perfect competition?", opts: ["Lower price and higher quantity", "Higher price and lower quantity", "Same price but higher quality", "Lower cost due to economies of scale"], correct: 1, exp: "Monopolists restrict output below the competitive level and charge a higher price. This creates deadweight loss — mutually beneficial trades that don't happen." },
  { q: "Monopolistic competition differs from perfect competition primarily because:", opts: ["There are fewer firms in monopolistic competition", "Firms in monopolistic competition sell differentiated products", "Monopolistic competitors have no market power", "Entry is blocked in monopolistic competition"], correct: 1, exp: "Product differentiation is the key feature. Each monopolistic competitor sells a slightly different product (brand, location, quality), giving it a small amount of pricing power — unlike perfect competitors who sell identical products." },
  { q: "In the long run, a monopolistic competitor earns:", opts: ["Positive economic profit due to product differentiation", "Zero economic profit — entry eliminates profit", "Negative economic profit — it should exit", "The same profit as a monopolist"], correct: 1, exp: "Easy entry is the key. Positive short-run profits attract competitors with similar (but differentiated) products. Entry shifts each firm's demand left until economic profit → 0." },
  { q: "The prisoner's dilemma in oligopoly explains why:", opts: ["Oligopolists always cooperate and earn maximum profits", "Individual incentives to defect from cooperation make all firms worse off", "Oligopoly markets are perfectly competitive in the long run", "Price leadership always results in higher consumer welfare"], correct: 1, exp: "Each firm's dominant strategy is to undercut rivals (defect), but when all defect, the Nash equilibrium is worse than if they had cooperated. The incentive to defect makes cooperation unstable." },
  { q: "The Herfindahl-Hirschman Index (HHI) is calculated by:", opts: ["Adding the market shares of the top 4 firms", "Squaring each firm's market share and summing all the squared values", "Dividing the largest firm's share by the smallest", "Multiplying the 4-firm concentration ratio by the number of firms"], correct: 1, exp: "HHI = Σ(market share)². Squaring gives more weight to larger firms. An HHI above 1,800 signals high concentration; below 1,000 indicates a competitive market." },
  { q: "A natural monopoly exists when:", opts: ["One firm owns all the raw materials", "Average cost falls continuously as output increases, making one firm most efficient", "The government grants a single firm an exclusive license", "A firm achieves market dominance through superior products"], correct: 1, exp: "Natural monopoly: economies of scale are so large that one firm can serve the entire market at lower average cost than two or more firms could. Breaking it up raises costs." },
  { q: "Price cap regulation (vs. cost-plus regulation) creates stronger efficiency incentives because:", opts: ["It always results in lower prices", "Firms profit by cutting costs faster than the cap falls — they keep the savings", "It requires constant government monitoring", "It sets price equal to marginal cost"], correct: 1, exp: "Under price caps, the regulator sets a ceiling in advance. If the firm cuts costs below the cap, it keeps the profit. This mimics competitive pressure — unlike cost-plus, where higher costs = higher allowed prices." },
  { q: "Which market structure is productively efficient (P = min ATC) in long-run equilibrium?", opts: ["Monopoly", "Oligopoly", "Monopolistic competition", "Perfect competition"], correct: 3, exp: "Perfect competition: long-run equilibrium forces P = min ATC (productive efficiency) AND P = MC (allocative efficiency). No other structure achieves both." },
  { q: "Explicit collusion among oligopolists (forming a cartel to fix prices) is:", opts: ["Legal if firms publicly announce the agreement", "Illegal under antitrust law in the United States", "Permitted if the industry is regulated", "Encouraged to prevent destructive price wars"], correct: 1, exp: "Explicit price-fixing is per se illegal under the Sherman Antitrust Act (1890). The DOJ can prosecute executives with criminal penalties. Tacit collusion (no agreement) is harder to prosecute." },
  { q: "The 4-firm concentration ratio measures:", opts: ["The HHI of the top 4 firms only", "The combined market share of the largest 4 firms in the industry", "The average profit margin of the top 4 firms", "The ratio of large to small firms in an industry"], correct: 1, exp: "C4 = sum of market shares of the 4 largest firms. A ratio above 40% suggests moderate concentration; above 60% is typically considered highly concentrated." },
];

function QuizStation({ onPass, onFail }: { onPass: (score: number, results: { correct: boolean; exp: string }[]) => void; onFail: (score: number, results: { correct: boolean; exp: string }[]) => void }) {
  const [questions] = useState(() => shuffle(QUIZ_QUESTIONS).map(q => { const s = shuffleOpts(q.opts, q.correct); return { ...q, opts: s.opts, correct: s.correct }; }));
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const q = questions[currentQ];
  const isChecked = !!checked[currentQ];
  const isCorrect = isChecked && answers[currentQ] === q.correct;

  function hasSelection(qi: number): boolean {
    return answers[qi] !== undefined;
  }

  function handleSelect(oi: number) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [currentQ]: oi }));
  }

  function handleCheck() {
    if (!hasSelection(currentQ)) return;
    setChecked(prev => ({ ...prev, [currentQ]: true }));
  }

  const allAnswered = questions.every((_, i) => hasSelection(i));
  const score = questions.filter((_, i) => answers[i] === questions[i].correct).length;

  function handleSubmit() {
    const results = questions.map((q, i) => ({
      correct: answers[i] === q.correct,
      exp: q.exp,
    }));
    if (score >= 13) onPass(score, results);
    else onFail(score, results);
  }

  function navDotStyle(i: number): string {
    if (i === currentQ) return "bg-primary";
    if (checked[i]) return answers[i] === questions[i].correct ? "bg-emerald-400" : "bg-red-400";
    if (hasSelection(i)) return "bg-primary/40";
    return "bg-muted";
  }

  function optionStyle(i: number): string {
    const userAnswer = answers[currentQ];
    const isSelected = userAnswer === i;
    const isCorrectOpt = q.correct === i;
    if (!isChecked) return isSelected ? "bg-primary/10 border-primary text-foreground" : "border-border text-foreground hover:border-primary/40";
    if (isCorrectOpt) return "bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-300";
    if (isSelected && !isCorrectOpt) return "bg-red-50 border-red-300 text-red-800";
    return "border-border text-foreground opacity-50";
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Question {currentQ + 1} of {questions.length}</span>
        <span className="text-xs text-muted-foreground">{Object.keys(checked).length} / {questions.length} checked</span>
      </div>

      <div className="flex gap-1.5">
        {questions.map((_, i) => (
          <button key={i} onClick={() => setCurrentQ(i)}
            className={`flex-1 h-2 rounded-full transition-all ${navDotStyle(i)}`}
            aria-label={`Question ${i + 1}`} />
        ))}
      </div>

      <div className="rounded-xl bg-card border-2 border-border p-5">
        <p className="text-sm font-semibold text-foreground mb-4">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => handleSelect(i)} disabled={isChecked}
              className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${optionStyle(i)} ${isChecked ? "cursor-default" : ""}`}>
              <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          ))}
        </div>
        {!isChecked && hasSelection(currentQ) && (
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
          className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          ← Previous
        </button>
        {currentQ < questions.length - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)}
            className="text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Question →
          </button>
        ) : allAnswered ? (
          <button onClick={handleSubmit}
            className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all">
            Submit Quiz
          </button>
        ) : (
          <span className="text-xs text-muted-foreground">Answer all questions to submit</span>
        )}
      </div>
    </div>
  );
}

function NotYetScreen({ score, onRetry }: { score: number; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#fef3c7" }}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-5">
        <div className="text-5xl">📖</div>
        <h2 className="text-2xl font-bold text-amber-800">Not Yet</h2>
        <p className="text-amber-700 font-medium">You scored {score} out of 15.</p>
        <p className="text-sm text-amber-700">Mastery requires 13 out of 15. Review the sections and try again — use the Quick Reference if needed.</p>
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 text-sm text-amber-800 font-semibold">This screen cannot be submitted. Only the final Results screen counts.</div>
        <button onClick={onRetry} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition"><RotateCcw className="inline w-4 h-4 mr-2" />Retry Quiz</button>
      </div>
    </div>
  );
}

function ResultsScreen({ score, name, setName, onRetry, sectionScores, quizResults }: {
  score: number; name: string; setName: (n: string) => void; onRetry: () => void;
  sectionScores: Record<string, { score: number; total: number }>;
  quizResults: { correct: boolean; exp: string }[];
}) {
  const SECTION_LABELS: Record<string,string> = { structures:"Market Structures", costs:"Cost & Profit", marketpower:"Market Power", antitrust:"Antitrust & Regulation" };
  function handlePrint() {
    const w = window.open("", "_blank", "width=820,height=960");
    if (!w) return;
    const now = new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
    const sectionRows = Object.entries(sectionScores).map(([id,s]) =>
      `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0">${SECTION_LABELS[id]||id}</td><td style="padding:6px 10px;border:1px solid #e2e8f0;text-align:center;font-weight:bold;color:${s.score===s.total?"#16a34a":"#475569"}">${s.score}/${s.total}</td></tr>`
    ).join("");
    const quizRows = quizResults.map((r,i) =>
      `<tr style="background:${r.correct?"#f0fdf4":"#fef2f2"}">
        <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;font-weight:bold;color:${r.correct?"#16a34a":"#dc2626"}">${r.correct?"✓":"✗"}</td>
        <td style="padding:8px;border:1px solid #e2e8f0;font-size:11px;color:#475569">Q${i+1}: ${r.exp}</td>
      </tr>`
    ).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>ECO 211 Review Lab 2 Results</title>
    <style>body{font-family:Arial,sans-serif;max-width:720px;margin:40px auto;color:#1e293b;padding:0 20px}h1{font-size:1.4rem;color:#1a2744;border-bottom:3px solid #1a2744;padding-bottom:8px}h2{font-size:1rem;color:#1a2744;margin-top:24px}table{width:100%;border-collapse:collapse;margin-top:8px}th{background:#1a2744;color:white;padding:8px 10px;text-align:left;font-size:12px}.footer{margin-top:40px;font-size:.75rem;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px}</style>
    </head><body>
    <h1>ECO 211 ECONLAB — Review Lab 2: Chapters 7–11</h1>
    <p><strong>Student:</strong> ${name||"—"} &nbsp;&nbsp; <strong>Date:</strong> ${now}</p>
    <p><strong>Quiz Score:</strong> ${score}/15 &nbsp;&nbsp; <strong>Status:</strong> ${score>=13?"✓ Mastery Achieved":"Needs Review"}</p>
    <h2>Station Scores</h2>
    <table><thead><tr><th>Station</th><th style="width:80px;text-align:center">Score</th></tr></thead><tbody>${sectionRows}</tbody></table>
    <h2>Quiz Question Review (15 Questions)</h2>
    <table><thead><tr><th style="width:30px"></th><th>Explanation</th></tr></thead><tbody>${quizRows}</tbody></table>
    <div class="footer">ECO 211 ECONLAB · Review Lab 2: Chapters 7–11 · Access for free at https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction</div>
    </body></html>`);
    w.document.close(); setTimeout(() => w.print(), 600);
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-5">
        <div className="text-center">
          <Award className="w-16 h-16 text-green-500 mx-auto mb-3" />
          <p className="text-4xl font-bold text-green-600">{score} / 15</p>
          <p className="text-sm text-muted-foreground mt-1">ECO 211 Review Lab 2 · Chapters 7–11</p>
        </div>
        {Object.keys(sectionScores).length > 0 && (
          <div className="bg-muted rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-foreground">Station Scores</p>
            {[{id:"structures",label:"Market Structures"},{id:"costs",label:"Cost & Profit"},{id:"marketpower",label:"Market Power"},{id:"antitrust",label:"Antitrust & Regulation"}].map(s => sectionScores[s.id] && (
              <div key={s.id} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{s.label}</span>
                <span className={`font-bold ${sectionScores[s.id].score===sectionScores[s.id].total?"text-green-600":"text-amber-600"}`}>{sectionScores[s.id].score}/{sectionScores[s.id].total}</span>
              </div>
            ))}
          </div>
        )}
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1" htmlFor="student-name">Your Name (required for credit)</label>
          <input id="student-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First and Last Name"
            className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        {quizResults.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <p className="text-xs font-bold text-foreground">Quiz Question Review</p>
            {quizResults.map((r,i) => (
              <div key={i} className={`rounded-xl border p-3 ${r.correct?"border-green-200 bg-green-50":"border-red-200 bg-red-50"}`}>
                <p className={`text-xs font-bold ${r.correct?"text-green-700":"text-red-600"}`}>{r.correct?"✓":"✗"} Q{i+1}</p>
                <p className={`text-xs mt-0.5 ${r.correct?"text-green-700":"text-red-600"}`}>{r.exp}</p>
              </div>
            ))}
          </div>
        )}
        <button onClick={handlePrint} disabled={!name.trim()} className="w-full py-3 rounded-xl bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground font-bold text-sm transition">🖨️ Print / Save as PDF</button>
        <button onClick={onRetry} className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">↺ Start Over</button>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function EconLab() {
  const [section, setSection] = useState<Section>("intro");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showRef, setShowRef] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const [sectionScores, setSectionScores] = useState<Record<string, { score: number; total: number }>>({}); 
  const [studentName, setStudentName] = useState("");
  const mainRef = useRef<HTMLDivElement>(null);

  const SECTIONS = [
    { id: "structures",  label: "🗂️ Market Structures",          short: "Structures",   desc: "Classify 12 real markets across all four market structures" },
    { id: "costs",       label: "💰 Cost & Profit Gauntlet",      short: "Costs",        desc: "7 Ch7–8 numeric and conceptual questions on costs and competition" },
    { id: "marketpower", label: "⚡ Market Power Scenarios",      short: "Market Power", desc: "5 applied scenarios covering monopoly, monopolistic comp, and oligopoly" },
    { id: "antitrust",   label: "⚖️ Antitrust & Regulation",     short: "Antitrust",    desc: "6 questions on HHI, mergers, legal practices, and regulatory theory" },
  ];

  const allSectionsDone = SECTIONS.every(s => completed.has(s.id));
  function markDone(id: string, score?: number, total?: number) { if (score !== undefined && total !== undefined) setSectionScores(prev => ({ ...prev, [id]: { score, total } })); setCompleted(prev => new Set([...prev, id])); setSection("intro"); }
  function handlePass(score: number, results?: { correct: boolean; exp: string }[]) { setQuizScore(score); if (results) setQuizResults(results); try { localStorage.setItem("econlab211_done_review1", "true"); } catch (_) {} setSection("results"); }
  function handleFail(score: number, results?: { correct: boolean; exp: string }[]) { setQuizScore(score); if (results) setQuizResults(results); setSection("not-yet"); }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {section === "not-yet" && <NotYetScreen score={quizScore} onRetry={() => setSection("quiz")} />}
      {section === "results" && <ResultsScreen score={quizScore} name={studentName} setName={setStudentName} onRetry={() => { setQuizScore(0); setCompleted(new Set()); setSection("intro"); }} sectionScores={sectionScores} quizResults={quizResults} />}
      {section !== "results" && section !== "not-yet" && (<>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded z-50">Skip to main content</a>
      {showRef && <ReferenceModal onClose={() => setShowRef(false)} />}

      <header style={{ backgroundColor: "hsl(222,42%,19%)" }} className="text-white px-4 py-3 shadow-lg sticky top-0 z-50" role="banner">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">ECO 211 ECONLAB</p>
              <p className="text-sm font-bold text-white truncate">Review Lab 2 · Chapters 7–11</p>
            </div>
            <a href="https://www.perplexity.ai/computer/a/eco-211-econlab-course-hub-h76o7OX6SpisjlWADnIRGg" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex text-white/80 hover:text-white text-xs font-medium whitespace-nowrap items-center gap-1 transition shrink-0">
              <ChevronLeft className="w-3.5 h-3.5" />Course Hub
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-1 flex-wrap" role="navigation" aria-label="Section navigation">
            {SECTIONS.map(s => {
              const done = completed.has(s.id); const active = section === s.id;
              return (
                <button key={s.id} onClick={() => setSection(s.id as Section)} aria-current={active ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${active ? "bg-white/20 text-white font-semibold" : done ? "text-white/90" : "text-white/60 hover:text-white"}`}>
                  {done && !active ? "✓ " : ""}{s.short}
                </button>
              );
            })}
            {allSectionsDone
              ? <button onClick={() => setSection("quiz")} aria-current={section === "quiz" ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${section === "quiz" ? "bg-white/20 text-white font-semibold" : "text-white/90 hover:text-white"}`}>🎯 Quiz</button>
              : <span className="px-3 py-1.5 text-xs text-white/35 cursor-not-allowed select-none">🔒 Quiz</span>
            }
          </div>
          <div className="sm:hidden flex items-center gap-2 shrink-0">
            <span className="text-xs text-white/60">{completed.size}/{SECTIONS.length}</span>
            <div role="progressbar" aria-valuenow={completed.size} aria-valuemin={0} aria-valuemax={SECTIONS.length} className="w-14 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${(completed.size / SECTIONS.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" ref={mainRef} className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {section === "intro" && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="rounded-2xl border-2 border-primary p-6 bg-primary/5">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Cumulative Review</p>
                  <p className="text-xl font-bold text-foreground">Chapters 7–11</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">You've covered the complete market structure arc — from production and costs, through perfect competition, monopoly, and imperfect competition, to antitrust policy. This review lab synthesizes it all before moving to market failures.</p>
              <div className="grid grid-cols-5 gap-2 mt-4">
                {["Ch7 Costs", "Ch8 Perf. Comp.", "Ch9 Monopoly", "Ch10 Oligopoly", "Ch11 Antitrust"].map((ch, i) => (
                  <div key={i} className="bg-white rounded-lg p-2 text-center border border-border">
                    <p className="text-xs font-semibold text-primary">{ch}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick reference */}
            <button onClick={() => setShowRef(true)} className="w-full text-left rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 transition flex items-center gap-2">
              <BookOpen size={16} className="text-primary shrink-0" />
              <span>Need a refresher? <span className="text-primary font-semibold underline">Open the Ch7–11 Quick Reference.</span></span>
            </button>

            {/* Section cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTIONS.map(s => {
                const done = completed.has(s.id);
                return (
                  <button key={s.id} onClick={() => setSection(s.id as Section)}
                    className={`rounded-xl border-2 p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${done ? "border-green-400 bg-green-50" : "border-border bg-card hover:border-primary/40"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${done ? "text-green-700" : "text-foreground"}`}>{s.label}</span>
                      {done && sectionScores[s.id] && <span className="text-xs font-bold bg-green-100 text-green-700 border border-green-300 rounded-full px-2 py-0.5">{sectionScores[s.id].score}/{sectionScores[s.id].total} ✓</span>}
                      {done && !sectionScores[s.id] && <span className="text-green-600 text-lg">✓</span>}
                    </div>
                    <span className="text-xs text-muted-foreground">{done ? "Completed" : s.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Quiz unlock */}
            {allSectionsDone
              ? <button onClick={() => setSection("quiz")} className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-base transition flex items-center justify-center gap-2">
                  <Award size={20} /> Take the Cumulative Quiz (15 Questions)
                </button>
              : <div className="w-full py-4 bg-muted text-muted-foreground/60 rounded-xl font-bold text-base text-center">🔒 Quiz — Complete all sections to unlock · 13/15 required for mastery</div>
            }
          </div>
        )}

        {section !== "intro" && section !== "quiz" && section !== "not-yet" && section !== "results" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5 items-center">
              <button onClick={() => setSection("intro")} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">← Dashboard</button>
              <button onClick={() => setShowRef(true)} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">📚 Quick Ref</button>
              {SECTIONS.map(s => {
                const done = completed.has(s.id); const active = section === s.id;
                return (
                  <button key={s.id} onClick={() => setSection(s.id as Section)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition ${active ? "border-primary bg-primary text-primary-foreground" : done ? "border-green-400 bg-green-50 text-green-700 opacity-90" : "border-border text-muted-foreground opacity-75 hover:border-primary/40"}`}>
                    {done && !active ? "✓ " : ""}{s.short}
                  </button>
                );
              })}
            </div>
            <div className="rounded-xl bg-card border-2 border-border p-4">
              <h2 className="text-base font-bold text-foreground">{SECTIONS.find(s => s.id === section)?.label}</h2>
            </div>
            {section === "structures"  && <StructuresSection  onComplete={(sc,t) => markDone("structures",sc,t)}  />}
            {section === "costs"       && <CostsSection       onComplete={(sc,t) => markDone("costs",sc,t)}       />}
            {section === "marketpower" && <MarketPowerSection onComplete={(sc,t) => markDone("marketpower",sc,t)} />}
            {section === "antitrust"   && <AntitrustSection   onComplete={(sc,t) => markDone("antitrust",sc,t)}   />}
          </div>
        )}

        {section === "quiz" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">

              <button onClick={() => setShowRef(true)} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">📚 Quick Ref</button>
              <h2 className="text-base font-bold text-foreground">🎯 Cumulative Quiz — Chapters 7–11</h2>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-xs text-amber-800 font-semibold">
              15 questions drawn randomly from the Ch7–11 question bank. Mastery = 13/15 correct.
            </div>
            <QuizStation
              onPass={(score, results) => handlePass(score, results)}
              onFail={(score, results) => handleFail(score, results)}
            />
          </div>
        )}
      </main>
    </>)}
    </div>
  );
}
