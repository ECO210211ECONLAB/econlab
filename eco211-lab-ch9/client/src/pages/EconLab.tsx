import { useState, useRef } from "react";
import { ChevronLeft, Award, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "recap" | "barriers" | "mrdemand" | "profitmax" | "compare" | "natmonopoly" | "quiz" | "results" | "not-yet";

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
const CH9_SUMMARY = [
  {
    heading: "9.1 — How Monopolies Form: Barriers to Entry",
    body: "Barriers to entry prevent or discourage competitors from entering the market. These barriers include: economies of scale that lead to natural monopoly; control of a physical resource; legal restrictions on competition; patent, trademark and copyright protection; and practices to intimidate the competition like predatory pricing. Intellectual property refers to legally guaranteed ownership of an idea, rather than a physical item. The laws that protect intellectual property include patents, copyrights, trademarks, and trade secrets. A natural monopoly arises when economies of scale persist over a large enough range of output that if one firm supplies the entire market, no other firm can enter without facing a cost disadvantage.",
  },
  {
    heading: "9.2 — How a Profit-Maximizing Monopoly Chooses Output and Price",
    body: "A monopolist is not a price taker, because when it decides what quantity to produce, it also determines the market price. For a monopolist, total revenue is relatively low at low quantities of output, because it is not selling much. Total revenue is also relatively low at very high quantities of output, because a very high quantity will sell only at a low price. Thus, total revenue for a monopolist will start low, rise, and then decline. The marginal revenue for a monopolist from selling additional units will decline. Each additional unit a monopolist sells will push down the overall market price, and as it sells more units, this lower price applies to increasingly more units. The monopolist will select the profit-maximizing level of output where MR = MC, and then charge the price for that quantity of output as determined by the market demand curve. If that price is above average cost, the monopolist earns positive profits. Monopolists are not productively efficient, because they do not produce at the minimum of the average cost curve. Monopolists are not allocatively efficient, because they do not produce at the quantity where P = MC. As a result, monopolists produce less, at a higher average cost, and charge a higher price than would a combination of firms in a perfectly competitive industry. Monopolists also may lack incentives for innovation, because they need not fear entry.",
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
          <h2 id="summary-title" className="text-lg font-bold text-foreground">📄 Chapter 9 Summary</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" aria-label="Close summary">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {CH9_SUMMARY.map((sec, i) => (
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
// Station 1 — Ch8 Recap
// ─────────────────────────────────────────────
const RECAP_QS = [
  {
    q: "A perfectly competitive firm is best described as a:",
    opts: ["Price maker — it sets its own price", "Price taker — it must accept the market price", "Price leader — it signals prices to rivals", "Price discriminator — it charges different buyers different prices"],
    correct: 1,
    exp: "In perfect competition, no single firm is large enough to influence the market price. Each firm takes the price as given — hence 'price taker.'",
  },
  {
    q: "The profit-maximizing rule for any firm is to produce where:",
    opts: ["Total Revenue is maximized", "Average Cost is minimized", "MR = MC", "Price equals Average Fixed Cost"],
    correct: 2,
    exp: "Profit is maximized where MR = MC. Producing beyond this point means each extra unit costs more than it earns.",
  },
  {
    q: "If a perfectly competitive firm's price falls below Average Variable Cost (AVC) at its profit-maximizing output, the firm should:",
    opts: ["Continue producing — losses are temporary", "Shut down immediately", "Raise its price above the market price", "Reduce output to zero in the long run only"],
    correct: 1,
    exp: "If P < AVC, the firm can't even cover variable costs on each unit — every unit produced deepens the loss. Immediate shutdown minimizes losses.",
  },
  {
    q: "In a perfectly competitive market, long-run equilibrium occurs when:",
    opts: ["Firms earn maximum economic profit", "Price equals minimum Average Cost and economic profit is zero", "The government sets the market price", "Only the most efficient firms remain"],
    correct: 1,
    exp: "Long-run equilibrium: P = MR = MC = AC. Free entry and exit compete away any economic profit until firms earn exactly zero economic profit.",
  },
  {
    q: "Which of the following correctly describes allocative efficiency in perfect competition?",
    opts: ["Firms produce at minimum Average Cost", "Price equals Marginal Cost — resources go to their highest-valued use", "Price exceeds Marginal Cost, creating deadweight loss", "Firms earn positive economic profit in the long run"],
    correct: 1,
    exp: "Allocative efficiency means P = MC: the price consumers pay exactly equals the cost of producing one more unit, so resources are allocated optimally.",
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
// Station 2 — Barriers to Entry Classifier
// ─────────────────────────────────────────────
type BarrierType = "natural" | "resource" | "legal" | "predatory";
const BARRIER_LABELS: Record<BarrierType, string> = {
  natural: "Natural Monopoly (Economies of Scale)",
  resource: "Control of Physical Resource",
  legal: "Legal Barrier (Patent/Copyright/Regulation)",
  predatory: "Predatory / Strategic Barrier",
};
const BARRIER_COLORS: Record<BarrierType, string> = {
  natural: "border-blue-400 bg-blue-50 text-blue-800",
  resource: "border-amber-400 bg-amber-50 text-amber-800",
  legal: "border-purple-400 bg-purple-50 text-purple-800",
  predatory: "border-red-400 bg-red-50 text-red-800",
};

const BARRIER_EXAMPLES = [
  { name: "A local water utility company", correct: "natural" as BarrierType, exp: "Building duplicate water pipe networks across a city would be massively wasteful — one firm supplying the whole market is cheapest. Classic natural monopoly." },
  { name: "De Beers diamond cartel (historically)", correct: "resource" as BarrierType, exp: "De Beers controlled over 80% of global rough diamond supply by owning or controlling the mines. Physical resource control." },
  { name: "A pharmaceutical company with a 20-year drug patent", correct: "legal" as BarrierType, exp: "Patents give the inventor exclusive legal rights to produce and sell the invention for 20 years — a government-granted monopoly to reward innovation." },
  { name: "Selling below cost to drive out a new rival, then raising prices", correct: "predatory" as BarrierType, exp: "Predatory pricing: deliberately pricing below cost to eliminate competition, then raising prices once rivals exit. Potentially illegal under antitrust law." },
  { name: "Microsoft Windows in the 1990s PC market", correct: "legal" as BarrierType, exp: "Microsoft's dominance was partly protected by copyright on its software and by network effects (everyone used Windows, so software was built for Windows)." },
  { name: "A cable TV company as the sole provider in a region", correct: "natural" as BarrierType, exp: "Laying cable infrastructure has enormous fixed costs — it only makes sense for one firm to do it. Natural monopoly from economies of scale." },
  { name: "ALCOA's control of nearly all U.S. bauxite deposits (early 1900s)", correct: "resource" as BarrierType, exp: "Without bauxite, you can't make aluminum. ALCOA cornered the essential physical input and thus controlled aluminum production." },
  { name: "Disney's copyright on Mickey Mouse characters", correct: "legal" as BarrierType, exp: "Copyright gives Disney exclusive rights to use those characters commercially. No competitor can legally produce Mickey Mouse merchandise without a license." },
  { name: "An airline buying up all gates at a hub airport to block new entrants", correct: "predatory" as BarrierType, exp: "Buying scarce resources (gate slots) specifically to prevent rival entry is a strategic/predatory barrier — not based on genuine cost advantage." },
  { name: "Electric transmission grid (high-voltage power lines)", correct: "natural" as BarrierType, exp: "Building duplicate high-voltage transmission networks would be enormously wasteful. The grid is a textbook natural monopoly." },
];

const BARRIER_TYPES: BarrierType[] = ["natural", "resource", "legal", "predatory"];

function BarriersStation({ onComplete }: { onComplete: () => void }) {
  const [choices, setChoices] = useState<Record<string, BarrierType | null>>(() => Object.fromEntries(BARRIER_EXAMPLES.map(e => [e.name, null])));
  const [checked, setChecked] = useState(false);
  const [marked, setMarked] = useState(false);
  const allChosen = BARRIER_EXAMPLES.every(e => choices[e.name] !== null);
  const score = BARRIER_EXAMPLES.filter(e => choices[e.name] === e.correct).length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm font-semibold text-primary mb-1">Barriers to Entry — 4 Types</p>
        <p className="text-sm text-muted-foreground">For each real-world example, identify which type of barrier to entry keeps competitors out. Select a category for each, then check your answers.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {BARRIER_TYPES.map(t => (
          <span key={t} className={`px-2 py-1 rounded-full text-xs font-semibold border-2 ${BARRIER_COLORS[t]}`}>{BARRIER_LABELS[t]}</span>
        ))}
      </div>
      <div className="space-y-4">
        {BARRIER_EXAMPLES.map(ex => {
          const chosen = choices[ex.name];
          const isCorrect = checked && chosen === ex.correct;
          const isWrong = checked && chosen !== null && chosen !== ex.correct;
          return (
            <div key={ex.name} className={`rounded-xl border-2 p-4 transition-all ${checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-300 bg-red-50" : "border-border bg-card") : "border-border bg-card"}`}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-foreground">{ex.name}</span>
                {checked && isWrong && <span className="text-xs text-red-600 font-semibold">→ {BARRIER_LABELS[ex.correct]}</span>}
                {checked && isCorrect && <span className="text-xs text-green-700 font-semibold">✓ Correct</span>}
              </div>
              <div className="flex flex-wrap gap-1" role="group" aria-label={`Barrier type for: ${ex.name}`}>
                {BARRIER_TYPES.map(t => {
                  const sel = chosen === t;
                  let cls = sel ? BARRIER_COLORS[t] + " border-current" : "border-border text-muted-foreground hover:border-primary/40";
                  if (checked && t === ex.correct) cls = BARRIER_COLORS[t] + " border-current";
                  else if (checked && sel && t !== ex.correct) cls = "border-red-400 bg-red-100 text-red-700";
                  return (
                    <button key={t} onClick={() => { if (!checked) setChoices(prev => ({ ...prev, [ex.name]: t })); }}
                      disabled={checked} aria-pressed={sel}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                      {BARRIER_LABELS[t].split(" (")[0]}
                    </button>
                  );
                })}
              </div>
              {checked && <p className="text-xs mt-2 text-muted-foreground italic">{ex.exp}</p>}
            </div>
          );
        })}
      </div>
      {!checked ? (
        <button onClick={() => { if (allChosen) setChecked(true); }} disabled={!allChosen}
          className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">
          Check My Answers
        </button>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl bg-muted p-4 text-center">
            <p className="font-bold text-lg text-foreground">{score} / {BARRIER_EXAMPLES.length}</p>
            <p className="text-sm text-muted-foreground">{score >= 9 ? "Excellent! You know your barriers." : score >= 7 ? "Good — review the explanations for any misses." : "Study the explanations — these distinctions matter."}</p>
          </div>
          {!marked && <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>}
          {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 3 — MR vs Demand Explorer
// ─────────────────────────────────────────────
// Monopolist demand: P = 14 - Q  →  TR = 14Q - Q²  →  MR = 14 - 2Q
const MR_DATA = Array.from({ length: 8 }, (_, i) => {
  const q = i + 1;
  const p = 14 - q;
  const tr = p * q;
  const prevTr = i === 0 ? 0 : (14 - i) * i;
  const mr = tr - prevTr;
  return { q, p, tr, mr };
});

function MRDemandStation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState(false);

  const STEPS = [
    {
      title: "Step 1: The Demand Curve",
      content: "A monopolist faces the entire market demand curve. Unlike a perfectly competitive firm (which faces a flat, horizontal demand at the market price), the monopolist must lower its price to sell more units. This makes the monopolist a price maker.",
      question: "If a monopolist lowers its price to sell one more unit, what happens to the price received on ALL previous units?",
      opts: ["Only the new unit sells at the lower price; all others stay at the old price", "The lower price applies to all units sold — including previous ones", "The monopolist can charge different prices to different customers automatically", "Price stays the same — quantity demanded falls instead"],
      correct: 1,
      exp: "This is the key difference. The monopolist must lower price for everyone to sell one more unit — which is why MR falls below price.",
    },
    {
      title: "Step 2: MR < Price",
      content: "Because a lower price applies to ALL units (not just the new one), the revenue gained from selling one more unit (MR) is always LESS than the price charged. MR = Price − (price reduction × all previous units sold).",
      question: "For a monopolist, which relationship is always true?",
      opts: ["MR = Price (same as perfect competition)", "MR > Price (monopoly premium)", "MR < Price (because the price cut applies to all units)", "MR = 0 at all output levels"],
      correct: 2,
      exp: "MR < P always for a monopolist. The extra revenue from selling one more unit is the new price MINUS the revenue lost on all previous units due to the price reduction.",
    },
    {
      title: "Step 3: The MR = MC Rule",
      content: "Even though MR < Price, the monopolist still maximizes profit where MR = MC — the same rule as any firm. After finding this quantity, the monopolist charges the highest price consumers will pay for that quantity (found on the demand curve).",
      question: "A monopolist finds that MR = MC at Q = 5. What price does it charge?",
      opts: ["The MC at Q=5", "The MR at Q=5", "The price on the demand curve at Q=5 (which is higher than MR)", "Zero — monopolists give goods away to maximize market share"],
      correct: 2,
      exp: "The monopolist produces where MR = MC (Q=5) but charges the price consumers are WILLING TO PAY at that quantity — which is found on the demand curve, and is always higher than MR.",
    },
  ];

  const curStep = STEPS[step];
  const stepAns = answers[step] ?? null;

  function checkStep() {
    if (stepAns === null) return;
    const correct = stepAns === curStep.correct;
    setFeedback(prev => ({ ...prev, [step]: correct ? `✓ Correct! ${curStep.exp}` : `Not quite. ${curStep.exp}` }));
  }

  const allStepsDone = STEPS.every((_, i) => feedback[i] !== undefined);

  return (
    <div className="space-y-5">
      {/* Step progress */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition ${i === step ? "border-primary bg-primary text-primary-foreground" : feedback[i] ? "border-green-400 bg-green-50 text-green-700" : "border-border text-muted-foreground"}`}>
            {feedback[i] ? "✓ " : ""}Step {i + 1}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="font-semibold text-primary text-sm mb-2">{curStep.title}</p>
        <p className="text-sm text-foreground">{curStep.content}</p>
      </div>

      {/* MR table shown on step 2+ */}
      {step >= 1 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-2 py-2 text-left">Q</th>
                <th className="px-2 py-2 text-right">Price (P)</th>
                <th className="px-2 py-2 text-right">Total Revenue (TR)</th>
                <th className="px-2 py-2 text-right font-bold">Marginal Revenue (MR)</th>
              </tr>
            </thead>
            <tbody>
              {MR_DATA.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                  <td className="px-2 py-1.5 font-semibold">{row.q}</td>
                  <td className="px-2 py-1.5 text-right">${row.p}</td>
                  <td className="px-2 py-1.5 text-right">${row.tr}</td>
                  <td className={`px-2 py-1.5 text-right font-bold ${row.mr < row.p ? "text-red-600" : "text-foreground"}`}>${row.mr}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground mt-1">Notice: MR is always less than Price — and MR declines twice as fast as price.</p>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-foreground mb-2">{curStep.question}</p>
        <div className="space-y-2">
          {curStep.opts.map((opt, oi) => {
            const sel = stepAns === oi;
            const hasFeedback = feedback[step] !== undefined;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (hasFeedback) {
              if (oi === curStep.correct) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
              else if (sel) cls = "border-red-400 bg-red-100 text-red-700";
            }
            return (
              <button key={oi} onClick={() => { if (!feedback[step]) setAnswers(prev => ({ ...prev, [step]: oi })); }}
                disabled={!!feedback[step]} aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                {hasFeedback && oi === curStep.correct && "✓ "}{opt}
              </button>
            );
          })}
        </div>
      </div>

      {feedback[step] && (
        <div className={`rounded-xl p-4 text-sm ${feedback[step].startsWith("✓") ? "bg-green-50 border border-green-400 text-green-800" : "bg-amber-50 border border-amber-300 text-amber-800"}`} role="alert" aria-live="polite">
          {feedback[step]}
        </div>
      )}

      {!feedback[step] ? (
        <button onClick={checkStep} disabled={stepAns === null}
          className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">
          Check Answer
        </button>
      ) : step < STEPS.length - 1 ? (
        <button onClick={() => setStep(step + 1)} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">
          Next Step →
        </button>
      ) : allStepsDone && !marked ? (
        <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">
          Mark Complete ✓
        </button>
      ) : marked ? (
        <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 4 — Monopoly Profit Maximizer
// ─────────────────────────────────────────────
// Demand: P = 14 - Q, TC given
const MONO_DATA = [
  { q: 1, p: 13, tr: 13, mr: 13, tc: 10, mc: null },
  { q: 2, p: 12, tr: 24, mr: 11, tc: 16, mc: 6 },
  { q: 3, p: 11, tr: 33, mr:  9, tc: 20, mc: 4 },
  { q: 4, p: 10, tr: 40, mr:  7, tc: 22, mc: 2 },
  { q: 5, p:  9, tr: 45, mr:  5, tc: 26, mc: 4 },
  { q: 6, p:  8, tr: 48, mr:  3, tc: 31, mc: 5 },
  { q: 7, p:  7, tr: 49, mr:  1, tc: 38, mc: 7 },
  { q: 8, p:  6, tr: 48, mr: -1, tc: 47, mc: 9 },
];
// MR=MC crossover: at Q=6, MR=3, MC=5 (MC>MR); at Q=5, MR=5, MC=4 (MR>MC) → profit-max at Q=5, P=9
// Profit at Q=5: TR=45 - TC=26 = $19
const CORRECT_Q = 5;

function ProfitMaxStation({ onComplete }: { onComplete: () => void }) {
  const [selectedQ, setSelectedQ] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [correct, setCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [marked, setMarked] = useState(false);
  const [showProfit, setShowProfit] = useState(false);

  function handleSelect(q: number) {
    if (correct) return;
    setSelectedQ(q);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (q === CORRECT_Q) {
      setFeedback("✓ Correct! At Q=5, MR ($5) > MC ($4) — still worth producing. At Q=6, MR ($3) < MC ($5) — stop. The monopolist produces Q=5 and charges P=$9 (from the demand curve). Profit = TR ($45) − TC ($26) = $19.");
      setCorrect(true);
      setShowProfit(true);
    } else {
      const row = MONO_DATA.find(r => r.q === q)!;
      const profit = row.tr - row.tc;
      if (newAttempts === 1) setFeedback(`Not quite. At Q=${q}, profit = TR ($${row.tr}) − TC ($${row.tc}) = $${profit}. Look for where MR last exceeds MC — that's your stopping point.`);
      else if (newAttempts === 2) { setFeedback(`Try once more. Hint: Go row by row. Produce if MR > MC. Stop when MC first exceeds MR.`); setShowHint(true); }
      else { setFeedback(`The answer is Q=5. At Q=5, MR ($5) still exceeds MC ($4) — produce it. At Q=6, MC ($5) exceeds MR ($3) — stop. Profit = $19, price = $9.`); setCorrect(true); }
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm font-semibold text-primary mb-1">🏭 The Monopolist's Decision</p>
        <p className="text-sm text-muted-foreground">This monopolist faces the demand schedule below. Review the table and click the row that represents the <strong>profit-maximizing quantity</strong> (where MR = MC). Remember: the monopolist charges the <em>price on the demand curve</em> — not the MR.</p>
      </div>
      {showHint && !correct && (
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-sm text-amber-800">
          💡 Hint: Compare MR and MC column by column. Produce as long as MR &gt; MC. Stop at the last row where MR ≥ MC.
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-3 py-2 text-left rounded-tl-lg">Q</th>
              <th className="px-3 py-2 text-right">Price (P)</th>
              <th className="px-3 py-2 text-right">TR</th>
              <th className="px-3 py-2 text-right">MR</th>
              <th className="px-3 py-2 text-right">TC</th>
              <th className="px-3 py-2 text-right">MC</th>
              {showProfit && <th className="px-3 py-2 text-right rounded-tr-lg">Profit</th>}
            </tr>
          </thead>
          <tbody>
            {MONO_DATA.map((row, i) => {
              const isSelected = selectedQ === row.q;
              const isCorrectRow = row.q === CORRECT_Q;
              let rowCls = i % 2 === 0 ? "bg-card" : "bg-muted/30";
              if (correct && isCorrectRow) rowCls = "bg-green-100 border-l-4 border-l-green-500";
              else if (!correct && isSelected) rowCls = "bg-primary/10 border-l-4 border-l-primary";
              const profit = row.tr - row.tc;
              return (
                <tr key={row.q} onClick={() => handleSelect(row.q)}
                  className={`${rowCls} ${!correct ? "cursor-pointer hover:bg-primary/5 transition" : ""}`}>
                  <td className="px-3 py-2 font-semibold">{row.q}</td>
                  <td className="px-3 py-2 text-right">${row.p}</td>
                  <td className="px-3 py-2 text-right">${row.tr}</td>
                  <td className={`px-3 py-2 text-right font-semibold ${row.mr < 0 ? "text-red-600" : "text-foreground"}`}>${row.mr}</td>
                  <td className="px-3 py-2 text-right">${row.tc}</td>
                  <td className="px-3 py-2 text-right">{row.mc !== null ? `$${row.mc}` : "—"}</td>
                  {showProfit && <td className={`px-3 py-2 text-right font-semibold ${profit >= 0 ? "text-green-700" : "text-red-600"}`}>${profit}</td>}
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
      {correct && !marked && <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>}
      {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 5 — Monopoly vs Competition Comparison
// ─────────────────────────────────────────────
const COMPARE_QS = [
  {
    q: "Compared to perfect competition, a monopolist produces:",
    opts: ["More output at a lower price", "Less output at a higher price", "The same output but at a higher price", "More output at a higher price"],
    correct: 1,
    exp: "The monopolist restricts output below the competitive level and charges a higher price — the source of deadweight loss and consumer harm.",
  },
  {
    q: "Why is a monopolist NOT productively efficient?",
    opts: ["It produces at the minimum of the Average Cost curve", "It does not produce at lowest possible cost", "It sets P = MC", "It earns zero economic profit in the long run"],
    correct: 1,
    exp: "Productive efficiency requires producing at minimum AC. The monopolist produces less than that output level, so average cost is higher than necessary.",
  },
  {
    q: "Why is a monopolist NOT allocatively efficient?",
    opts: ["Because P = MC at the monopolist's output", "Because the monopolist earns profit", "Because P > MC — consumers value additional output more than it costs to produce", "Because MR = MC at the monopolist's output"],
    correct: 2,
    exp: "Allocative efficiency requires P = MC. For a monopolist, P > MC — meaning consumers would pay more than the cost of producing another unit, but the monopolist doesn't produce it. This gap creates deadweight loss.",
  },
  {
    q: "A monopolist may lack incentive to innovate because:",
    opts: ["It already produces at minimum average cost", "It faces no threat of entry — it doesn't need to innovate to survive", "Innovation increases marginal cost", "Government regulation requires it to innovate"],
    correct: 1,
    exp: "Competition drives innovation — firms must improve or lose customers. A monopolist, facing no rivals, has weaker incentive to innovate. This is a key social cost of monopoly.",
  },
  {
    q: "The deadweight loss from monopoly represents:",
    opts: ["The monopolist's economic profit", "Transactions that would benefit both buyers and sellers but do not occur due to the monopolist's restricted output", "The cost of government regulation", "The difference between MR and MC at the profit-maximizing quantity"],
    correct: 1,
    exp: "Deadweight loss is the value of mutually beneficial trades that don't happen because the monopolist restricts output below the competitive level. Society is worse off by this amount.",
  },
  {
    q: "Which statement correctly contrasts a monopolist and a perfectly competitive firm?",
    opts: [
      "Both face a horizontal (flat) demand curve",
      "A perfectly competitive firm is a price taker; a monopolist is a price maker",
      "A monopolist faces MR = Price, just like a competitive firm",
      "Both earn zero economic profit in the long run",
    ],
    correct: 1,
    exp: "The core distinction: competitive firms take the market price as given (price takers); monopolists choose their price by choosing their output level (price makers).",
  },
];

function CompareStation({ onComplete }: { onComplete: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(COMPARE_QS.length).fill(null));
  const [checked, setChecked] = useState<boolean[]>(Array(COMPARE_QS.length).fill(false));
  const [marked, setMarked] = useState(false);
  const q = COMPARE_QS[qIdx];
  const ans = answers[qIdx];
  const isChecked = checked[qIdx];
  const allDone = checked.every(Boolean);

  function check() {
    if (ans === null) return;
    setChecked(prev => { const n = [...prev]; n[qIdx] = true; return n; });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Question {qIdx + 1} of {COMPARE_QS.length}</span>
        <div className="flex gap-1">{COMPARE_QS.map((_, i) => (<div key={i} className={`w-2.5 h-2.5 rounded-full ${i === qIdx ? "bg-primary" : checked[i] ? (answers[i] === COMPARE_QS[i].correct ? "bg-green-500" : "bg-red-400") : "bg-muted"}`} />))}</div>
      </div>

      <div className="rounded-xl bg-card border-2 border-border p-5">
        <p className="font-semibold text-foreground text-sm mb-3">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, oi) => {
            const sel = ans === oi;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (isChecked) {
              if (oi === q.correct) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
              else if (sel) cls = "border-red-400 bg-red-100 text-red-700";
            }
            return (
              <button key={oi} onClick={() => { if (!isChecked) setAnswers(prev => { const n = [...prev]; n[qIdx] = oi; return n; }); }}
                disabled={isChecked} aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                {isChecked && oi === q.correct && "✓ "}{opt}
              </button>
            );
          })}
        </div>
        {isChecked && <p className="text-xs mt-3 text-muted-foreground italic bg-muted/50 p-2 rounded-lg">{q.exp}</p>}
      </div>

      {!isChecked ? (
        <button onClick={check} disabled={ans === null}
          className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">
          Check Answer
        </button>
      ) : (
        <div className="flex gap-3">
          {qIdx > 0 && <button onClick={() => setQIdx(qIdx - 1)} className="flex-1 py-3 rounded-xl border-2 border-border text-sm font-semibold text-muted-foreground hover:border-primary/40 transition">← Back</button>}
          {qIdx < COMPARE_QS.length - 1
            ? <button onClick={() => setQIdx(qIdx + 1)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next →</button>
            : allDone && !marked
              ? <button onClick={() => { setMarked(true); onComplete(); }} className="flex-1 py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
              : marked ? <p className="flex-1 text-center text-green-700 font-semibold text-sm py-3">✓ Station Complete</p> : null
          }
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 6 — Natural Monopoly Regulation
// ─────────────────────────────────────────────
const REG_OPTIONS = [
  {
    id: "unreg",
    label: "A — Unregulated Monopoly",
    desc: "Firm sets MR = MC, charges highest price market will bear.",
    pros: "Firm earns maximum profit; strong incentive to cut costs",
    cons: "High prices, low output, large deadweight loss — consumers harmed",
    verdict: "Inefficient. Good for firm, bad for society.",
    color: "border-red-400",
  },
  {
    id: "breakup",
    label: "B — Break Up the Monopoly",
    desc: "Force one firm to split into multiple smaller competing firms.",
    pros: "Creates competition, lowers prices",
    cons: "Each smaller firm loses economies of scale → higher average costs, possibly HIGHER prices than the monopoly",
    verdict: "Usually counterproductive for natural monopolies.",
    color: "border-orange-400",
  },
  {
    id: "pmc",
    label: "C — Set Price = Marginal Cost",
    desc: "Regulator forces P = MC (allocatively efficient).",
    pros: "Achieves allocative efficiency (P = MC)",
    cons: "For natural monopolies, MC < AC — firm loses money and needs a government subsidy to survive",
    verdict: "Theoretically ideal but requires ongoing subsidy — politically difficult.",
    color: "border-amber-400",
  },
  {
    id: "pac",
    label: "D — Set Price = Average Cost",
    desc: "Regulator sets P = AC — firm covers all costs, earns normal profit.",
    pros: "Firm stays solvent; no subsidy needed; prices lower than unregulated monopoly",
    cons: "Slight allocative inefficiency (P > MC); removes incentive to cut costs",
    verdict: "Most practical real-world approach — used by most utility regulators.",
    color: "border-green-400",
  },
];

const REG_SCENARIOS = [
  {
    scenario: "A municipal water authority is the only water provider in a city. The government wants to ensure households can afford water while keeping the utility financially viable without taxpayer subsidies.",
    bestOption: "pac",
    exp: "P = AC regulation keeps the utility financially viable (no subsidy needed) while preventing monopoly pricing. This is why most public utility commissions use this approach for water, electricity, and gas.",
  },
  {
    scenario: "A regional electric grid is a natural monopoly. An economist argues the most economically efficient solution is to set price equal to the social cost of producing one more unit of electricity.",
    bestOption: "pmc",
    exp: "P = MC is allocatively efficient, but for a natural monopoly it means P < AC — the firm loses money on every unit and requires an ongoing government subsidy. The economist is theoretically correct but politically impractical.",
  },
  {
    scenario: "A cable company has a regional monopoly. A state legislator proposes simply allowing the cable company to operate without any price regulation.",
    bestOption: "unreg",
    exp: "Without regulation, the cable company sets MR = MC and charges the monopoly price — high prices, low output, large deadweight loss. This is the outcome regulators typically want to prevent.",
  },
];

function NatMonopolyStation({ onComplete }: { onComplete: () => void }) {
  const [scenIdx, setScenIdx] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [doneScens, setDoneScens] = useState<number[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [marked, setMarked] = useState(false);
  const scen = REG_SCENARIOS[scenIdx];
  const allDone = doneScens.length >= REG_SCENARIOS.length - 1 && checked;

  function nextScen() {
    setDoneScens(prev => [...prev, scenIdx]);
    if (scenIdx < REG_SCENARIOS.length - 1) { setScenIdx(scenIdx + 1); setChoice(null); setChecked(false); setShowOptions(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {REG_SCENARIOS.map((_, i) => (
          <span key={i} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold border-2 ${i === scenIdx ? "border-primary bg-primary text-primary-foreground" : doneScens.includes(i) ? "border-green-500 bg-green-100 text-green-800" : "border-border text-muted-foreground"}`}>{i + 1}</span>
        ))}
      </div>

      {/* 4 Options reference */}
      <button onClick={() => setShowOptions(v => !v)}
        className="w-full text-left px-4 py-2 rounded-xl border border-border text-xs text-muted-foreground hover:border-primary/40 transition">
        {showOptions ? "▲ Hide" : "▼ Show"} the 4 Regulatory Options
      </button>
      {showOptions && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {REG_OPTIONS.map(opt => (
            <div key={opt.id} className={`rounded-xl border-2 p-3 ${opt.color} bg-white`}>
              <p className="font-bold text-xs text-foreground mb-1">{opt.label}</p>
              <p className="text-xs text-muted-foreground mb-1">{opt.desc}</p>
              <p className="text-xs text-green-700"><strong>✓</strong> {opt.pros}</p>
              <p className="text-xs text-red-600"><strong>✗</strong> {opt.cons}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Scenario {scenIdx + 1}</p>
        <p className="text-sm text-foreground">{scen.scenario}</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground mb-2">Which regulatory approach best fits this scenario?</p>
        <div className="space-y-2">
          {REG_OPTIONS.map(opt => {
            const sel = choice === opt.id;
            const isCorrect = checked && opt.id === scen.bestOption;
            const isWrong = checked && sel && opt.id !== scen.bestOption;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (checked) {
              if (isCorrect) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
              else if (isWrong) cls = "border-red-400 bg-red-50 text-red-700";
            }
            return (
              <button key={opt.id} onClick={() => { if (!checked) setChoice(opt.id); }}
                disabled={checked} aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                {isCorrect && "✓ "}{opt.label}
                {checked && opt.id === scen.bestOption && <span className="ml-2 text-xs font-semibold">(Best fit)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {checked && (
        <div className="rounded-xl bg-muted p-4 text-sm" role="alert">
          <p className="font-semibold text-foreground mb-1">{choice === scen.bestOption ? "✓ Correct!" : "Not quite."}</p>
          <p className="text-muted-foreground">{scen.exp}</p>
        </div>
      )}

      {!checked ? (
        <button onClick={() => { if (choice) setChecked(true); }} disabled={!choice}
          className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">
          Check Answer
        </button>
      ) : (
        <div className="space-y-3">
          {scenIdx < REG_SCENARIOS.length - 1 && !doneScens.includes(scenIdx) && (
            <button onClick={nextScen} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next Scenario →</button>
          )}
          {(allDone || (doneScens.length >= REG_SCENARIOS.length - 1 && checked)) && !marked && (
            <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
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
  { q: "A monopolist is best described as:", opts: ["A price taker that must accept the market price", "A price maker that controls its price by choosing its output", "A firm that always earns zero economic profit in the long run", "A firm that produces at minimum average cost"], correct: 1, multi: false, exp: "A monopolist is a price maker — by choosing how much to produce, it simultaneously determines the market price via the demand curve." },
  { q: "Which of the following is an example of a LEGAL barrier to entry?", opts: ["A firm controls a key physical resource", "A firm holds a patent on its product", "A firm prices below cost to drive out rivals", "A firm benefits from economies of scale"], correct: 1, multi: false, exp: "Patents are government-granted legal barriers — they give the inventor the exclusive legal right to produce and sell the innovation for 20 years." },
  { q: "For a monopolist, Marginal Revenue (MR) is:", opts: ["Equal to price, just like in perfect competition", "Greater than price", "Less than price, because a price cut applies to all units sold", "Equal to zero at all output levels"], correct: 2, multi: false, exp: "MR < Price for a monopolist. Selling one more unit requires lowering the price — and that lower price applies to ALL units, reducing revenue on previous units." },
  { q: "A monopolist maximizes profit by producing where:", opts: ["Total Revenue is highest", "Price equals Average Cost", "MR = MC, then charging the price on the demand curve", "Marginal Cost is at its minimum"], correct: 2, multi: false, exp: "The monopolist finds MR = MC to identify profit-maximizing quantity, then charges the highest price consumers will pay for that quantity — found on the demand curve." },
  { q: "A natural monopoly occurs when:", opts: ["A firm uses patents to block competitors", "Economies of scale are so large that one firm can supply the market at lower cost than multiple firms", "A firm controls a key physical resource", "Government grants a firm exclusive rights to operate"], correct: 1, multi: false, exp: "Natural monopoly: when the long-run average cost curve declines over the entire range of market demand, so one firm can produce more cheaply than any combination of smaller firms." },
  { q: "The most commonly used approach to regulating a natural monopoly sets:", opts: ["P = MC (allocative efficiency)", "P = MR (monopoly pricing)", "P = AC (firm covers costs, earns normal profit)", "P = 0 (free provision)"], correct: 2, multi: false, exp: "P = AC regulation is most practical: the firm stays financially viable without a subsidy, while prices are kept below the unregulated monopoly level." },
  { q: "Compared to perfect competition, a monopolist produces:", opts: ["More output at lower prices", "Less output at higher prices", "The same output but earns more profit", "More output but at the same price"], correct: 1, multi: false, exp: "Monopolists restrict output below the competitive level and charge higher prices — the core source of consumer harm and deadweight loss." },
  { q: "Why does P = MC regulation of a natural monopoly typically require a government subsidy?", opts: ["Because the monopolist's MC is always zero", "Because for a natural monopoly, MC < AC — so P = MC means revenue doesn't cover average costs", "Because the government must pay the firm's fixed costs", "Because customers refuse to pay marginal cost prices"], correct: 1, multi: false, exp: "Natural monopolies have declining average costs. At the output where P = MC, the price is below average cost — the firm loses money and needs a subsidy to survive." },
  { q: "Which of the following are reasons why monopoly is inefficient compared to perfect competition? (Select all that apply)", opts: ["Monopolist produces less than the competitive quantity", "Monopolist charges a higher price than marginal cost (P > MC)", "Monopolist is productively efficient (produces at minimum AC)", "Monopolist may lack incentive to innovate"], correct: [0, 1, 3], multi: true, exp: "Monopolists produce less, charge P > MC (allocative inefficiency), produce above minimum AC (productive inefficiency), and face no competitive pressure to innovate. They are NOT productively efficient." },
  { q: "Which of the following are examples of barriers to entry that create monopoly power? (Select all that apply)", opts: ["A firm owns the only known deposit of a rare mineral", "A pharmaceutical company holds a patent on a life-saving drug", "A firm competes in a market with thousands of identical sellers", "A utility company benefits from natural monopoly economies of scale"], correct: [0, 1, 3], multi: true, exp: "Resource control, patents, and natural monopoly economies of scale are all barriers to entry. Competing with thousands of identical sellers is perfect competition — no monopoly power." },
];

function QuizStation({ onPass, onFail }: { onPass: (score: number, results: { correct: boolean; exp: string }[]) => void; onFail: (score: number, results: { correct: boolean; exp: string }[]) => void }) {
  const [questions] = useState(() => shuffle(QUIZ_BANK).map(q => {
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
// Not Yet / Results
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
        <button onClick={onRetry} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition">
          <RotateCcw className="inline w-4 h-4 mr-2" />Retry Quiz
        </button>
      </div>
    </div>
  );
}

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
      + '<p style="color:#475569;margin:2px 0">Chapter 9: Monopoly</p>'
      + '<p style="font-size:22px;font-weight:bold;background:#1e2d4a;color:white;display:inline-block;padding:4px 16px;border-radius:99px;margin:8px 0">' + score + ' / 10</p>'
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<h3 style="font-size:13px;margin:0 0 6px">Question Review</h3>' + items
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<p style="font-size:13px"><b>Exit Ticket:</b></p><p style="border:1px solid #ccc;padding:8px;border-radius:4px;font-size:13px;min-height:40px">' + (reflection || '') + '</p>'
      + '<p style="font-size:13px;margin-top:12px"><b>Student Name:</b></p><p style="border:1px solid #000;padding:8px;border-radius:4px;font-size:14px;font-weight:bold">' + studentName + '</p>'
      + '<p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:16px;padding-top:8px">ECO 211 · Chapter 9: Monopoly · Printed ' + new Date().toLocaleDateString() + ' · Access for free at https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction</p>'
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
          <div className="text-xs font-semibold text-foreground">ECO 211 ECONLAB · Chapter 9: Monopoly</div>
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
    { id: "barriers", label: "Barriers" },
    { id: "mrdemand", label: "MR & Demand" },
    { id: "profitmax", label: "Profit Max" },
    { id: "compare", label: "Compare" },
    { id: "natmonopoly", label: "Regulation" },
    { id: "quiz", label: "Quiz" },
  ];
  const CONTENT_STATIONS: Station[] = ["recap","barriers","mrdemand","profitmax","compare","natmonopoly"];
  const allDone = CONTENT_STATIONS.every(s => completed.has(s as Station));
  const stationOrder: Station[] = ["intro","recap","barriers","mrdemand","profitmax","compare","natmonopoly","quiz","results","not-yet"];
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
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 9</div>
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
    { id: "recap",       label: "📚 Ch8 Recap",                short: "Recap",       desc: "Review perfect competition before entering the world of monopoly" },
    { id: "barriers",    label: "🚧 Barriers to Entry",         short: "Barriers",    desc: "Classify 10 real-world examples across 4 barrier types" },
    { id: "mrdemand",    label: "📉 MR vs Demand Explorer",     short: "MR & Demand", desc: "Understand why MR < Price for a monopolist — step by step" },
    { id: "profitmax",   label: "🏭 Monopoly Profit Maximizer", short: "Profit Max",  desc: "Find the profit-maximizing output and price using the MR = MC table" },
    { id: "compare",     label: "⚖️ Monopoly vs Competition",   short: "Compare",     desc: "Six questions comparing monopoly and perfect competition outcomes" },
    { id: "natmonopoly", label: "🔌 Natural Monopoly Regulation", short: "Regulation", desc: "Match regulatory approaches to real-world natural monopoly scenarios" },
  ];

  const allStationsDone = STATIONS.every(s => completed.has(s.id));
  function markDone(id: string) { setCompleted(prev => new Set([...prev, id])); setStation("intro"); }
  function handlePass(score: number, results: { correct: boolean; exp: string }[]) { setQuizScore(score); setQuizResults(results); try { localStorage.setItem("econlab211_done_ch9", "true"); } catch (_) {} setStation("results"); }
  function handleFail(score: number, results: { correct: boolean; exp: string }[]) { setQuizScore(score); setQuizResults(results); setStation("not-yet"); }

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
            <div className="rounded-2xl bg-primary/5 border-2 border-primary/20 p-5">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Key Idea</p>
              <p className="text-base font-semibold text-foreground">"When One Firm Rules the Market"</p>
              <p className="text-sm text-muted-foreground mt-1">A monopolist is a price maker — it controls price by controlling output. Monopolies form behind barriers to entry, profit where MR = MC, and cause inefficiency by producing too little at too high a price.</p>
            </div>
            <button onClick={() => setShowSummary(true)}
              className="w-full text-left rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 transition flex items-center gap-2">
              <span>📄</span>
              <span>Need a refresher? <span className="text-primary font-semibold underline">View the Chapter 9 summary.</span></span>
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
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
              ? <button onClick={() => setStation("quiz")} className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-base transition flex items-center justify-center gap-2">
                  <Award size={20} /> Take the Quiz
                </button>
              : <div className="w-full py-4 bg-muted text-muted-foreground/60 rounded-xl font-bold text-base text-center">🔒 Quiz — Complete all stations to unlock</div>
            }
          </div>
        )}

        {/* Station views */}
        {station !== "intro" && station !== "quiz" && station !== "not-yet" && station !== "results" && (
          <div className="space-y-4">
            <div role="alert" aria-live="polite" className="sr-only" />
            {station === "recap"       && <RecapStation      onComplete={() => markDone("recap")}       />}
            {station === "barriers"    && <BarriersStation   onComplete={() => markDone("barriers")}    />}
            {station === "mrdemand"    && <MRDemandStation   onComplete={() => markDone("mrdemand")}    />}
            {station === "profitmax"   && <ProfitMaxStation  onComplete={() => markDone("profitmax")}   />}
            {station === "compare"     && <CompareStation    onComplete={() => markDone("compare")}     />}
            {station === "natmonopoly" && <NatMonopolyStation onComplete={() => markDone("natmonopoly")} />}
          </div>
        )}

        {/* Quiz */}
        {station === "quiz" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
  
              <h2 className="text-base font-bold text-foreground">🎯 Chapter 9 Quiz</h2>
            </div>
            <QuizStation
              onPass={(score, results) => { setQuizScore(score); setQuizResults(results); try { localStorage.setItem("econlab211_done_ch9", "true"); } catch (_) {} setStation("results"); }}
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
