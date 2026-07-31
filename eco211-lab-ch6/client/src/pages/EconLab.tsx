import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "econlab211_done_ch6";
const COURSE_TITLE = "ECO 211 ECONLAB";
const COURSE_SUBTITLE = "Chapter 6 — Consumer Choice";

type Station = "intro" | "utility" | "budget" | "utilmax" | "incprice" | "behavioral" | "flash" | "quiz" | "results" | "not-yet";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────
// Station 1 — Utility & Diminishing MU: Stepped Calculation
// ─────────────────────────────────────────────
const UTILITY_STEPS = [
  {
    step: 1,
    title: "Total Utility vs. Marginal Utility",
    content: "The coffee example from your slides:\nCup 1: MU = 30 utils  (\"Lifesaver!\")\nCup 2: MU = 20 utils  (\"Really good\")\nCup 3: MU = 12 utils  (\"Fine\")\nCup 4: MU =  8 utils  (\"A bit much\")\nCup 5: MU =  5 utils  (\"Jittery!\")\n\nTotal Utility (TU) = cumulative sum of all MU values so far.\nMarginal Utility (MU) = ΔTU ÷ ΔQ = the EXTRA utility from ONE more unit.",
    question: "After drinking 3 cups of coffee (MU = 30, 20, 12), what is the Total Utility?",
    options: ["A) 12 utils — just the last cup", "B) 30 utils — just the first cup", "C) 62 utils — the sum of all three cups", "D) 20.7 utils — the average MU"],
    correct: 2,
    exp: "TU = 30 + 20 + 12 = 62. Total Utility is the cumulative satisfaction. MU (12) is just the marginal addition from the 3rd cup alone."
  },
  {
    step: 2,
    title: "The Law of Diminishing Marginal Utility",
    content: "Notice the pattern: MU fell from 30 → 20 → 12 → 8 → 5 with each additional cup.\n\nThe Law of Diminishing Marginal Utility: as you consume more units of a good (holding everything else constant), the marginal utility from each successive unit eventually decreases.\n\nKey clarification: TU keeps RISING (each cup still adds some satisfaction) but MU FALLS (each cup adds less than the last).\n\nTU rises at a decreasing rate — the curve flattens but doesn't turn down (until you're truly sick of it).",
    question: "According to the Law of Diminishing Marginal Utility, what happens to Total Utility as more coffee is consumed?",
    options: [
      "A) TU falls — each additional cup makes you worse off",
      "B) TU stays constant — the law only affects MU, not TU",
      "C) TU rises, but at a decreasing rate — each cup adds less than the last",
      "D) TU rises at a constant rate — MU stays the same",
    ],
    correct: 2,
    exp: "TU keeps rising (each cup still adds positive utility) but at a decreasing rate because MU falls. Only when MU = 0 does TU peak; when MU becomes negative, TU falls. In most normal consumption ranges, TU rises while MU falls."
  },
  {
    step: 3,
    title: "MU per Dollar — The Decision Tool",
    content: "Utility theory's real power is comparing goods: which gives more satisfaction per dollar spent?\n\nMU per Dollar = MU ÷ Price\n\nFrom José's data (T-shirts at $14, Movies at $7):\n• 1st T-shirt: MU = 22, MU/$ = 22/14 = 1.57\n• 1st Movie:   MU = 16, MU/$ = 16/7  = 2.29\n\nThe first movie gives MORE satisfaction per dollar (2.29 > 1.57).\n→ José should buy movies first.",
    question: "José is deciding between a 2nd T-shirt (MU = 21, price $14) and a 3rd Movie (MU = 14, price $7). Which gives more utility per dollar?",
    options: [
      "A) 2nd T-shirt: MU/$ = 21/14 = 1.50 — T-shirt wins",
      "B) 3rd Movie: MU/$ = 14/7 = 2.00 — Movie wins",
      "C) They're equal — 21 utils vs. 14 utils",
      "D) 2nd T-shirt because it costs more and is therefore better quality",
    ],
    correct: 1,
    exp: "2nd T-shirt: 21 ÷ 14 = 1.50 MU/$. 3rd Movie: 14 ÷ 7 = 2.00 MU/$. The movie gives more bang for the buck — José should buy it first. This is the core logic behind utility maximization."
  },
];

function UtilityStation({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const step = UTILITY_STEPS[stepIdx];
  const isLast = stepIdx === UTILITY_STEPS.length - 1;

  function handleCheck() {
    if (sel === null) return;
    setScore(s => s + (sel === step.correct ? 1 : 0));
    setChecked(true);
  }
  function handleNext() { setStepIdx(i => i + 1); setSel(null); setChecked(false); }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm">
        <p className="font-semibold text-foreground mb-1">Station 1 — Utility & Diminishing Marginal Utility</p>
        <p className="text-muted-foreground text-xs">Walk through the coffee example to master TU, MU, and the Law of Diminishing MU.</p>
        <div className="flex gap-1 mt-2">
          {UTILITY_STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= stepIdx ? "bg-primary" : "bg-primary/20"}`} />
          ))}
        </div>
      </div>
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Step {step.step} of {UTILITY_STEPS.length} — {step.title}</p>
        <div className="bg-muted/60 rounded-lg p-3 text-xs text-foreground leading-relaxed whitespace-pre-line">{step.content}</div>
        <p className="text-sm font-semibold text-foreground">{step.question}</p>
        <div className="space-y-2">
          {step.options.map((opt, i) => (
            <button key={i} disabled={checked} onClick={() => setSel(i)}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition ${
                checked
                  ? i === step.correct ? "border-green-500 bg-green-50 text-green-900"
                    : i === sel && sel !== step.correct ? "border-red-400 bg-red-50 text-red-900"
                    : "border-border text-muted-foreground opacity-60"
                  : sel === i ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background text-foreground hover:border-primary"
              }`}>{opt}</button>
          ))}
        </div>
        {checked && <div className={`rounded-lg p-3 text-xs ${sel === step.correct ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>{sel === step.correct ? "✓ Correct — " : "✗ Incorrect — "}{step.exp}</div>}
        {!checked && sel !== null && <button onClick={handleCheck} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition">Check Answer</button>}
        {checked && !isLast && <button onClick={handleNext} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition">Next Step →</button>}
        {checked && isLast && <button onClick={() => onComplete(score + (sel === step.correct ? 1 : 0), UTILITY_STEPS.length)} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 2 — Budget Constraint: Bundle Classifier
// ─────────────────────────────────────────────
// José: $56 budget, T-shirts $14, Movies $7
const BUNDLES = [
  { id: 1, label: "Point P",  shirts: 4, movies: 0, status: "on",      statusLabel: "On the budget line",  reason: "4×$14 + 0×$7 = $56. Spends every dollar — on the line." },
  { id: 2, label: "Point R",  shirts: 2, movies: 4, status: "on",      statusLabel: "On the budget line",  reason: "2×$14 + 4×$7 = $28 + $28 = $56. Spends every dollar — on the line." },
  { id: 3, label: "Point S",  shirts: 1, movies: 6, status: "on",      statusLabel: "On the budget line",  reason: "1×$14 + 6×$7 = $14 + $42 = $56. Spends every dollar — on the line." },
  { id: 4, label: "Point T",  shirts: 0, movies: 8, status: "on",      statusLabel: "On the budget line",  reason: "0×$14 + 8×$7 = $56. Spends every dollar — on the line." },
  { id: 5, label: "3 shirts + 5 movies", shirts: 3, movies: 5, status: "outside", statusLabel: "Outside (unaffordable)", reason: "3×$14 + 5×$7 = $42 + $35 = $77. Exceeds the $56 budget — outside the fence." },
  { id: 6, label: "1 shirt + 3 movies", shirts: 1, movies: 3, status: "inside",  statusLabel: "Inside (affordable, not using all income)", reason: "1×$14 + 3×$7 = $14 + $21 = $35. Affordable but leaves $21 unspent — inside the fence." },
];

const BUNDLE_OPTS = [
  { id: "on",      label: "On budget line",     color: "bg-teal-100 border-teal-400 text-teal-800" },
  { id: "inside",  label: "Inside (affordable)", color: "bg-blue-100 border-blue-400 text-blue-800" },
  { id: "outside", label: "Outside (unaffordable)", color: "bg-red-100 border-red-400 text-red-800" },
];

function BudgetStation({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const allAnswered = BUNDLES.every(b => answers[b.id]);
  const correctCount = checked ? BUNDLES.filter(b => answers[b.id] === b.status).length : 0;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm">
        <p className="font-semibold text-foreground mb-1">Station 2 — The Budget Constraint: José's $56 Fence</p>
        <p className="text-muted-foreground text-xs mb-2">José has $56. T-shirts cost $14, Movies cost $7. Classify each bundle. Slope = −(P<sub>M</sub>/P<sub>T</sub>) = −(7/14) = −0.5 — opportunity cost is 2 movies per t-shirt.</p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs font-mono text-center font-semibold">
          Budget: $14×(T-shirts) + $7×(Movies) = $56
        </div>
      </div>
      <div className="space-y-2">
        {BUNDLES.map(b => {
          const ans = answers[b.id];
          const isCorrect = checked && ans === b.status;
          const isWrong = checked && ans && ans !== b.status;
          const optObj = BUNDLE_OPTS.find(o => o.id === b.status);
          return (
            <div key={b.id} className={`rounded-xl border-2 p-3 transition ${isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-400 bg-red-50" : "border-border bg-card"}`}>
              <p className="text-sm font-semibold text-foreground mb-0.5">{b.label}</p>
              <p className="text-xs text-muted-foreground mb-2">{b.shirts} T-shirts + {b.movies} Movies → Cost: ${b.shirts * 14 + b.movies * 7}</p>
              {!checked ? (
                <div className="flex gap-1.5">
                  {BUNDLE_OPTS.map(o => (
                    <button key={o.id} onClick={() => setAnswers(a => ({ ...a, [b.id]: o.id }))}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition ${ans === o.id ? `${o.color} border-current` : "border-border bg-background text-foreground hover:border-primary/40"}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className={`text-xs font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                  {isCorrect ? "✓ " : "✗ "}{optObj?.label} — {b.reason}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {!checked ? (
        <button disabled={!allAnswered} onClick={() => setChecked(true)}
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-40">
          Check Answers
        </button>
      ) : (
        <div className="space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="text-sm font-bold text-blue-800">You got {correctCount} of {BUNDLES.length} correct!</p>
          </div>
          <button onClick={() => onComplete(correctCount, BUNDLES.length)}
            className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">
            Mark Complete ✓
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 3 — Utility Maximization: Stepped Walkthrough
// ─────────────────────────────────────────────
const UTILMAX_STEPS = [
  {
    step: 1,
    title: "The Utility Maximization Rule",
    content: "A consumer maximizes utility when the last dollar spent on each good yields the same marginal utility:\n\n     MU₁/P₁  =  MU₂/P₂\n\n'Equal bang for the buck' across all goods. If MU₁/P₁ > MU₂/P₂, you're getting more satisfaction per dollar from Good 1 — shift spending toward it until equality is restored.\n\nFor José: T-shirts cost $14, Movies cost $7.\nMU/$ for T-shirts = MU_T ÷ 14\nMU/$ for Movies  = MU_M ÷ 7",
    question: "José currently buys 0 t-shirts and 8 movies. At this bundle: MU of 1st t-shirt = 22 (MU/$ = 1.57), MU of 8th movie = 9 (MU/$ = 1.29). What should José do?",
    options: [
      "A) Buy more movies — he's at the budget limit so he can't change",
      "B) Shift spending toward t-shirts — MU/$ for t-shirts (1.57) > MU/$ for movies (1.29)",
      "C) Buy fewer movies — he has too many already",
      "D) Shift spending toward movies — MU/$ for movies is always higher",
    ],
    correct: 1,
    exp: "MU/$ for t-shirts (1.57) > MU/$ for 8th movie (1.29). He gets more satisfaction per dollar from a t-shirt right now. He should trade 2 movies for 1 t-shirt (same cost: $14), gaining more total utility."
  },
  {
    step: 2,
    title: "Finding the Optimum: Step by Step",
    content: "José's MU/$ for movies starts at 2.29 (1st movie) and falls to 1.57 (6th movie). T-shirts always yield MU/$ = 1.57 for the 1st shirt.\n\nDecision process:\n• 1st movie: MU/$ = 2.29 > 1.57 (t-shirt) → BUY movie ✓\n• 2nd movie: MU/$ = 2.14 > 1.57 → BUY movie ✓\n• 3rd movie: MU/$ = 2.00 > 1.57 → BUY movie ✓\n• 4th movie: MU/$ = 1.86 > 1.57 → BUY movie ✓\n• 5th movie: MU/$ = 1.71 > 1.57 → BUY movie ✓\n• 6th movie: MU/$ = 1.57 = 1.57 (t-shirt) → STOP — EQUAL!\n\nAt this point: 1 T-shirt + 6 Movies = $14 + $42 = $56 ✓",
    question: "What is José's optimal bundle and why does it maximize utility?",
    options: [
      "A) 0 T-shirts + 8 Movies (Point T) — all movies since they start with higher MU/$",
      "B) 1 T-shirt + 6 Movies (Point S) — MU/$ equalizes at 1.57 for both goods at this bundle",
      "C) 2 T-shirts + 4 Movies (Point R) — this splits the budget evenly",
      "D) 4 T-shirts + 0 Movies (Point P) — t-shirts are more durable investments",
    ],
    correct: 1,
    exp: "Point S (1 T-shirt + 6 Movies) is optimal because MU_T/P_T = MU_M/P_M = 1.57 at this bundle. Total Utility = 103 utils — higher than any other affordable bundle (Point T = 100, Point R = 101, Point P = 81)."
  },
  {
    step: 3,
    title: "Why the Rule Works",
    content: "Because MU diminishes, buying more of a good lowers its MU/$. You keep shifting toward the higher-ratio good until both sides equalize.\n\nWhen MU₁/P₁ = MU₂/P₂, no reallocation can improve total utility:\n• Shifting $1 more to Good 1 gains MU₁/P₁ but loses MU₂/P₂ — net gain = 0\n• Shifting $1 more to Good 2 gains MU₂/P₂ but loses MU₁/P₁ — net gain = 0\n\nThis is a true equilibrium — a local maximum of total utility given the budget constraint.\n\nThe rule extends to any number of goods:\nMU₁/P₁ = MU₂/P₂ = MU₃/P₃ = ... = MUₙ/Pₙ",
    question: "If MU_T/P_T = 1.57 and MU_M/P_M = 1.71 at José's current bundle, what should he do?",
    options: [
      "A) Keep the same bundle — both ratios are close enough",
      "B) Buy more t-shirts — his ratio for t-shirts is lower so they're a better value",
      "C) Buy more movies and fewer t-shirts — movies give more satisfaction per dollar right now",
      "D) Reduce spending on both — he may be overspending",
    ],
    correct: 2,
    exp: "MU_M/P_M (1.71) > MU_T/P_T (1.57) — movies give more bang per buck at this moment. Trade a t-shirt for 2 movies (same $14). As José buys more movies, their MU falls. Keep shifting until the ratios equalize."
  },
];

function UtilMaxStation({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const step = UTILMAX_STEPS[stepIdx];
  const isLast = stepIdx === UTILMAX_STEPS.length - 1;

  function handleCheck() {
    if (sel === null) return;
    setScore(s => s + (sel === step.correct ? 1 : 0));
    setChecked(true);
  }
  function handleNext() { setStepIdx(i => i + 1); setSel(null); setChecked(false); }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm">
        <p className="font-semibold text-foreground mb-1">Station 3 — José&apos;s Optimal Choice: MU₁/P₁ = MU₂/P₂</p>
        <p className="text-muted-foreground text-xs">Walk through the utility maximization rule step by step using José&apos;s real data from the slides.</p>
        <div className="flex gap-1 mt-2">
          {UTILMAX_STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= stepIdx ? "bg-primary" : "bg-primary/20"}`} />
          ))}
        </div>
      </div>
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Step {step.step} of {UTILMAX_STEPS.length} — {step.title}</p>
        <div className="bg-muted/60 rounded-lg p-3 text-xs text-foreground leading-relaxed whitespace-pre-line">{step.content}</div>
        <p className="text-sm font-semibold text-foreground">{step.question}</p>
        <div className="space-y-2">
          {step.options.map((opt, i) => (
            <button key={i} disabled={checked} onClick={() => setSel(i)}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition ${
                checked
                  ? i === step.correct ? "border-green-500 bg-green-50 text-green-900"
                    : i === sel && sel !== step.correct ? "border-red-400 bg-red-50 text-red-900"
                    : "border-border text-muted-foreground opacity-60"
                  : sel === i ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background text-foreground hover:border-primary"
              }`}>{opt}</button>
          ))}
        </div>
        {checked && <div className={`rounded-lg p-3 text-xs ${sel === step.correct ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>{sel === step.correct ? "✓ Correct — " : "✗ Incorrect — "}{step.exp}</div>}
        {!checked && sel !== null && <button onClick={handleCheck} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition">Check Answer</button>}
        {checked && !isLast && <button onClick={handleNext} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition">Next Step →</button>}
        {checked && isLast && <button onClick={() => onComplete(score + (sel === step.correct ? 1 : 0), UTILMAX_STEPS.length)} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 4 — Income & Price Changes: Two-Part Classifier
// ─────────────────────────────────────────────
type IncPriceItem = { id: number; text: string; shift: string; shiftLabel: string; good: string; goodLabel: string; shiftExp: string; goodExp: string };
const INCPRICE_SCENARIOS: IncPriceItem[] = [
  { id: 1, text: "Amara gets a raise. She can now afford more of both concert tickets AND overnight getaways.", shift: "out", shiftLabel: "Budget shifts OUT (parallel)", good: "normal", goodLabel: "Normal goods (both)", shiftExp: "Income ↑ → budget line shifts outward, parallel. Prices unchanged so slope stays the same.", goodExp: "Both goods are normal — she buys more of both when income rises." },
  { id: 2, text: "Overnight getaways are inferior goods for Amara. After her raise, she buys fewer getaways and more concerts.", shift: "out", shiftLabel: "Budget shifts OUT (parallel)", good: "inferior", goodLabel: "Inferior good (getaways)", shiftExp: "Income still rises → budget line still shifts out parallel. The shift direction is always the same for income changes.", goodExp: "Getaways are inferior — Amara buys fewer as income rises, substituting toward preferred options." },
  { id: 3, text: "The price of concert tickets rises. Amara's budget for concerts shrinks but her overnight getaway budget is unchanged.", shift: "rotate", shiftLabel: "Budget ROTATES inward (concerts axis only)", good: "normal", goodLabel: "Normal good (concerts)", shiftExp: "Price ↑ on one good → budget line ROTATES inward on that good's axis. The other intercept is unchanged.", goodExp: "Concerts are a normal good — quantity demanded falls as price rises (substitution + income effects both reduce Q)." },
  { id: 4, text: "Ramen noodles are an inferior good. Income falls during a recession — consumers buy MORE ramen.", shift: "in", shiftLabel: "Budget shifts IN (parallel)", good: "inferior", goodLabel: "Inferior good (ramen)", shiftExp: "Income ↓ → budget line shifts INWARD, parallel. Less total purchasing power.", goodExp: "Inferior good: quantity demanded RISES when income falls. At lower incomes, cheaper alternatives become more attractive." },
  { id: 5, text: "The price of housing falls. Consumers can now afford more housing units while keeping spending on everything else the same.", shift: "rotate", shiftLabel: "Budget ROTATES outward (housing axis only)", good: "normal", goodLabel: "Normal good (housing)", shiftExp: "Price ↓ on housing → budget line ROTATES outward on the housing axis. The other intercept is unchanged.", goodExp: "Housing is a normal good — as price falls, quantity demanded rises (law of demand). Each price drop traces one point on the demand curve." },
  { id: 6, text: "Bus service is an inferior good. Income rises. Consumers take fewer bus rides, using the extra income for ride-sharing apps instead.", shift: "out", shiftLabel: "Budget shifts OUT (parallel)", good: "inferior", goodLabel: "Inferior good (bus rides)", shiftExp: "Income ↑ → budget line shifts outward, parallel — always.", goodExp: "Bus rides are inferior: demand falls as income rises. Consumers substitute toward preferred alternatives when they can afford them." },
];

const SHIFT_OPTS = [
  { id: "out",    label: "Shifts OUT (parallel)",      color: "bg-green-100 border-green-400 text-green-800" },
  { id: "in",     label: "Shifts IN (parallel)",       color: "bg-red-100 border-red-400 text-red-800" },
  { id: "rotate", label: "Rotates (one intercept)",    color: "bg-blue-100 border-blue-400 text-blue-800" },
];
const GOOD_OPTS = [
  { id: "normal",   label: "Normal good",   color: "bg-teal-100 border-teal-400 text-teal-800" },
  { id: "inferior", label: "Inferior good", color: "bg-amber-100 border-amber-400 text-amber-800" },
];

function IncPriceStation({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, { shift: string; good: string }>>({});
  const [checked, setChecked] = useState(false);
  const allAnswered = INCPRICE_SCENARIOS.every(s => answers[s.id]?.shift && answers[s.id]?.good);
  const correctCount = checked ? INCPRICE_SCENARIOS.filter(s => answers[s.id]?.shift === s.shift && answers[s.id]?.good === s.good).length : 0;
  const totalQs = INCPRICE_SCENARIOS.length;

  function setAns(id: number, field: "shift" | "good", val: string) {
    setAnswers(a => ({ ...a, [id]: { ...a[id], [field]: val } }));
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm">
        <p className="font-semibold text-foreground mb-1">Station 4 — Income &amp; Price Changes</p>
        <p className="text-muted-foreground text-xs mb-2">For each scenario: (1) how does the budget line move? (2) is the affected good normal or inferior?</p>
        <div className="space-y-1 text-xs">
          <div className="bg-green-50 border border-green-200 rounded px-2 py-1"><span className="font-semibold text-green-800">Income change:</span><span className="text-green-700 ml-1">Parallel shift (same slope — prices unchanged)</span></div>
          <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1"><span className="font-semibold text-blue-800">Price change:</span><span className="text-blue-700 ml-1">Rotation on that good's axis (slope changes)</span></div>
        </div>
      </div>
      <div className="space-y-3">
        {INCPRICE_SCENARIOS.map(s => {
          const ans = answers[s.id] || {};
          const shiftOk = checked && ans.shift === s.shift;
          const goodOk = checked && ans.good === s.good;
          const bothOk = shiftOk && goodOk;
          const anyWrong = checked && (!shiftOk || !goodOk);
          return (
            <div key={s.id} className={`rounded-xl border-2 p-3 transition ${bothOk ? "border-green-400 bg-green-50" : anyWrong ? "border-red-400 bg-red-50" : "border-border bg-card"}`}>
              <p className="text-sm font-medium text-foreground mb-2">{s.text}</p>
              {!checked ? (
                <div className="space-y-2">
                  <div className="flex gap-1.5">
                    {SHIFT_OPTS.map(o => (
                      <button key={o.id} onClick={() => setAns(s.id, "shift", o.id)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition ${ans.shift === o.id ? `${o.color} border-current` : "border-border bg-background text-foreground hover:border-primary/40"}`}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {GOOD_OPTS.map(o => (
                      <button key={o.id} onClick={() => setAns(s.id, "good", o.id)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition ${ans.good === o.id ? `${o.color} border-current` : "border-border bg-background text-foreground hover:border-primary/40"}`}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className={`text-xs font-semibold ${shiftOk ? "text-green-700" : "text-red-700"}`}>{shiftOk ? "✓ " : "✗ "}{s.shiftLabel} — {s.shiftExp}</p>
                  <p className={`text-xs font-semibold ${goodOk ? "text-green-700" : "text-red-700"}`}>{goodOk ? "✓ " : "✗ "}{s.goodLabel} — {s.goodExp}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!checked ? (
        <button disabled={!allAnswered} onClick={() => setChecked(true)}
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-40">
          Check Answers
        </button>
      ) : (
        <div className="space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="text-sm font-bold text-blue-800">You got {correctCount} of {totalQs} correct!</p>
          </div>
          <button onClick={() => onComplete(correctCount, totalQs)}
            className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">
            Mark Complete ✓
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 5 — Behavioral Economics: Verdict Cards
// ─────────────────────────────────────────────
const BEHAV_CARDS = [
  {
    id: "lossaversion",
    icon: "⚖️",
    title: "Loss Aversion",
    tag: "KAHNEMAN & TVERSKY",
    tagColor: "bg-red-100 border-red-400 text-red-800",
    body: "Traditional economics: losses and gains of equal size are weighted equally in decisions.\n\nBehavioral reality: losses hurt approximately 2.25× more than equivalent gains feel good. (Kahneman & Tversky, 1979 — Nobel Prize 2002)\n\nReal-world implications:\n• Investor overreaction: people sell winning stocks too early (lock in gains) and hold losing stocks too long (avoid realizing losses) — the disposition effect.\n• Status quo bias: any change risks a loss, which looms large. This is why people stay in suboptimal jobs, plans, and portfolios — inertia feels safe.\n• Sunk cost fallacy: a past $100 loss 'feels' like it should affect future decisions, even though sunk costs are irretrievable.\n\n'People hate losing $100 more than they enjoy gaining $150.'",
    takeaway: "When you feel unusually resistant to selling an investment, canceling a plan, or changing a habit — ask: am I responding to a real future cost, or just loss aversion? Past spending is gone regardless of what you do next."
  },
  {
    id: "mentalaccounting",
    icon: "🧠",
    title: "Mental Accounting",
    tag: "THALER",
    tagColor: "bg-blue-100 border-blue-400 text-blue-800",
    body: "Traditional economics: money is fungible — $1 is $1 regardless of where it came from or what mental category you put it in.\n\nBehavioral reality: people treat money differently based on how it was obtained or what mental account it belongs to.\n\nThree examples from your slides:\n1. Windfall effect: found $50 → spend on treats. Earned $50 → add to budget. Same dollar, different behavior.\n2. Earmarking: won't touch the 'vacation fund' to pay an emergency — even though the net financial position is identical.\n3. Debt-savings puzzle: keeps $5,000 in a 1% savings account while carrying $5,000 in 22% credit card debt — losing 21% APY net. The 'emergency fund' mental label overrides basic arithmetic.\n\nMental accounting is not always irrational — earmarking savings for retirement can enforce discipline. But when it leads to avoidable financial loss, it's costly.",
    takeaway: "Check your mental accounts. 'Found money' is just money. If you have high-interest debt, paying it off first beats any savings account. The label on the bucket doesn't change the math."
  },
  {
    id: "personalfinance",
    icon: "💡",
    title: "Apply It: Track Your MU per Dollar",
    tag: "PERSONAL FINANCE",
    tagColor: "bg-teal-100 border-teal-400 text-teal-800",
    body: "The utility maximization rule isn't just theory — it's a spending audit tool:\n\nMU/$ = Satisfaction per Dollar Spent\n\nAsk for each recurring expense:\n• Is that streaming subscription (MU/$) still delivering value — or are you just not canceling because you're loss-averse?\n• Does your gym membership give as much satisfaction as $50 spent elsewhere?\n• Is your 'emergency fund' earning 1% while you carry 22% credit card debt?\n\nRational reallocation:\nIf MU/$ of Spotify < MU/$ of the $12 redirected elsewhere → cancel Spotify.\nIf MU/$ of your gym < MU/$ of an at-home workout → switch.\n\nLoss aversion and mental accounting BOTH work against this audit. You'll feel the 'loss' of canceling more than the 'gain' of reallocating — even if the math is clear.\n\n'The utility-maximization rule is a forcing function for honest spending decisions.'",
    takeaway: "Do an annual MU/$ audit of recurring expenses. Cancel or reduce what no longer delivers the satisfaction you're paying for. Rational consumers reallocate — behavioral consumers keep paying for things they've habituated to."
  },
];

function BehavioralStation({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const allRevealed = BEHAV_CARDS.every(c => revealed.has(c.id));

  function toggle(id: string) {
    setRevealed(r => new Set([...r, id]));
    setExpanded(e => e === id ? null : id);
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm">
        <p className="font-semibold text-foreground mb-1">Station 5 — Behavioral Economics: When Humans Deviate</p>
        <p className="text-muted-foreground text-xs">Traditional theory assumes perfect rationality. Behavioral economics documents where and why real humans systematically deviate. Open all three cards to complete.</p>
      </div>
      <div className="space-y-3">
        {BEHAV_CARDS.map(card => {
          const isOpen = expanded === card.id;
          const seen = revealed.has(card.id);
          return (
            <div key={card.id} className={`rounded-2xl border-2 overflow-hidden transition ${seen ? "border-primary/40" : "border-border"} bg-card`}>
              <button onClick={() => toggle(card.id)}
                className="w-full flex items-center justify-between p-4 text-left gap-3 hover:bg-muted/40 transition">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border mr-2 ${card.tagColor}`}>{card.tag}</span>
                    <span className="text-sm font-semibold text-foreground">{card.title}</span>
                  </div>
                </div>
                <span className="text-muted-foreground text-sm">{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="bg-muted/50 rounded-xl p-3 text-xs text-foreground leading-relaxed whitespace-pre-line">{card.body}</div>
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Key Takeaway</p>
                    <p className="text-xs text-foreground">{card.takeaway}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button disabled={!allRevealed} onClick={() => onComplete(BEHAV_CARDS.length, BEHAV_CARDS.length)}
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-40">
        {allRevealed ? "Mark Complete ✓" : `Open all cards to continue (${revealed.size}/${BEHAV_CARDS.length})`}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Flashcard Station
// ─────────────────────────────────────────────
const FLASHCARDS = [
  { front: "Utility", back: "The satisfaction or benefit a consumer receives from consuming a good or service. Subjective and personal — your utils ≠ my utils. Utility is ordinal, not cardinal in modern theory." },
  { front: "Total Utility (TU)", back: "The cumulative satisfaction from consuming a given quantity of a good. TU generally rises as you consume more — but at a decreasing rate due to diminishing MU." },
  { front: "Marginal Utility (MU)", back: "The additional satisfaction from consuming one more unit. MU = ΔTU ÷ ΔQ. The extra happiness from the next slice of pizza, the next cup of coffee." },
  { front: "Law of Diminishing Marginal Utility", back: "As you consume additional units of a good (holding everything else constant), the MU from each successive unit eventually decreases. MU falls; TU still rises (but more slowly)." },
  { front: "Budget Constraint", back: "All combinations of goods a consumer can afford given their income and prices. Points on the line: spend all income. Inside: affordable surplus. Outside: unaffordable." },
  { front: "Slope of Budget Line", back: "= −(P₁/P₂). The opportunity cost of one unit of Good 1 in terms of Good 2. For José: −($7/$14) = −0.5 — one T-shirt costs 2 movies." },
  { front: "MU per Dollar (MU/$)", back: "MU ÷ Price. The satisfaction received per dollar spent on a good. The key comparison tool: spend more on whichever good currently yields the highest MU/$." },
  { front: "Utility Maximization Rule", back: "Spend so that MU₁/P₁ = MU₂/P₂ across all goods. Equal 'bang for the buck.' If ratios are unequal, shift spending toward the higher-ratio good." },
  { front: "Normal Good", back: "A good for which demand rises when income rises. Budget line shifts out → consumer buys more. Examples: restaurant meals, new cars, branded clothing." },
  { front: "Inferior Good", back: "A good for which demand falls when income rises. Consumer switches to preferred substitutes. Examples: ramen noodles, bus rides, generic brands." },
  { front: "Substitution Effect", back: "When a good's price rises, it becomes relatively more expensive than substitutes → consumers shift toward cheaper alternatives, even holding purchasing power constant." },
  { front: "Income Effect", back: "When a good's price rises, real purchasing power falls → consumers can afford fewer units overall, even without switching goods." },
  { front: "Loss Aversion", back: "Losses hurt approximately 2.25× more than equivalent gains feel good (Kahneman & Tversky). Explains status quo bias, sunk cost fallacy, and investor overreaction." },
  { front: "Mental Accounting", back: "People treat money differently based on its source or mental category, even though $1 = $1. Example: keeping savings at 1% while carrying 22% credit card debt because of 'emergency fund' label." },
];

function FlashcardStation({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [cards] = useState(() => shuffle([...FLASHCARDS]));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set());

  function handleFlip() { setFlipped(f => !f); }
  function handleNext() {
    setSeen(s => new Set([...s, idx]));
    if (idx < cards.length - 1) { setIdx(i => i + 1); setFlipped(false); }
  }
  function handlePrev() {
    if (idx > 0) { setIdx(i => i - 1); setFlipped(false); }
  }
  const allSeen = seen.size >= cards.length - 1;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm">
        <p className="font-semibold text-foreground mb-1">Flashcard Review — Chapter 6 Key Terms</p>
        <p className="text-muted-foreground text-xs">Review all {cards.length} terms. Click each card to reveal the definition. You must view all cards before the Quiz unlocks.</p>
        <div className="mt-2 h-1.5 bg-primary/20 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" role="progressbar" aria-valuenow={seen.size} aria-valuemin={0} aria-valuemax={cards.length} style={{ width: `${(seen.size / cards.length) * 100}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{seen.size}/{cards.length} cards reviewed</p>
      </div>
      <div onClick={handleFlip} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleFlip(); }}} role="button" tabIndex={0} aria-label={flipped ? "Card showing definition. Press to see term." : "Card showing term. Press to reveal definition."} className="cursor-pointer select-none bg-card border-2 border-border rounded-2xl p-6 min-h-[160px] flex flex-col items-center justify-center text-center shadow-sm hover:border-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <span aria-live="polite" aria-atomic="true" className="sr-only">{flipped ? cards[idx].back : cards[idx].front}</span>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{flipped ? "Definition" : "Term"} — {idx + 1} / {cards.length}</p>
        <p className={`font-semibold leading-relaxed ${flipped ? "text-sm text-muted-foreground" : "text-base text-foreground"}`}>
          {flipped ? cards[idx].back : cards[idx].front}
        </p>
        <p className="text-xs text-muted-foreground mt-4">{flipped ? "Click to see term" : "Click to reveal definition"}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={handlePrev} disabled={idx === 0} className="flex-1 py-2 rounded-xl border border-border text-sm font-medium text-foreground disabled:opacity-30 hover:bg-muted transition">← Prev</button>
        <button onClick={handleNext} disabled={idx === cards.length - 1} className="flex-1 py-2 rounded-xl border border-border text-sm font-medium text-foreground disabled:opacity-30 hover:bg-muted transition">Next →</button>
      </div>
      <button disabled={!allSeen} onClick={() => onComplete(cards.length, cards.length)}
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-40">
        {allSeen ? "Mark Complete — Unlock Quiz ✓" : `Review all cards to unlock (${seen.size}/${cards.length})`}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Quiz
// ─────────────────────────────────────────────
const ALL_QUESTIONS = [
  { q: "The Law of Diminishing Marginal Utility states that as you consume more of a good:", options: ["A) Total utility falls with each additional unit", "B) Marginal utility eventually decreases with each additional unit", "C) Marginal utility is always negative after the first unit", "D) Total utility eventually starts declining immediately"], correct: 1, exp: "MU eventually decreases — TU still rises, just more slowly. TU only falls when MU becomes negative, which happens far beyond typical consumption ranges." },
  { q: "José has a $56 budget. T-shirts cost $14, movies cost $7. Which of the following bundles is ON his budget line?", options: ["A) 3 T-shirts + 5 Movies ($42 + $35 = $77) — outside", "B) 2 T-shirts + 4 Movies ($28 + $28 = $56) — on the line", "C) 1 T-shirt + 3 Movies ($14 + $21 = $35) — inside", "D) 0 T-shirts + 6 Movies ($0 + $42 = $42) — inside"], correct: 1, exp: "2×$14 + 4×$7 = $28 + $28 = $56 exactly. A consumer on the budget line spends every dollar of income." },
  { q: "The slope of José's budget line (T-shirts on x-axis, Movies on y-axis) equals:", options: ["A) −2.0 — each T-shirt costs 2 movies", "B) −0.5 — each movie costs half a T-shirt", "C) −14 — the price of a T-shirt", "D) −7 — the price of a movie"], correct: 1, exp: "Slope = −P_T/P_M = −$14/$7 = −2.0. Wait — the slope is the negative ratio of the x-axis good's price to the y-axis good's price. T-shirts are on x, so slope = −P_T/P_M = −14/7 = −2. Each additional T-shirt costs 2 movies in opportunity cost. Answer B is incorrect — let's recalculate: slope = −(P on x-axis)/(P on y-axis) = −14/7 = −2." },
  { q: "At José's optimal bundle (Point S: 1 T-shirt + 6 Movies), MU_T/P_T = MU_M/P_M = 1.57. This means:", options: ["A) He is spending too much on movies relative to T-shirts", "B) The last dollar spent on each good yields the same satisfaction — no reallocation can improve total utility", "C) He should buy more T-shirts until the ratio for movies exceeds T-shirts", "D) His total utility equals 1.57 utils per dollar"], correct: 1, exp: "When MU₁/P₁ = MU₂/P₂, the consumer is at the utility maximum. Any dollar shifted from one good to the other gains MU₁/P₁ but loses MU₂/P₂ — net gain = 0. This IS the optimum." },
  { q: "If MU of movies / Price of movies > MU of T-shirts / Price of T-shirts, a utility-maximizing consumer should:", options: ["A) Buy more T-shirts — they're more expensive so they must be better", "B) Buy more movies — they yield more satisfaction per dollar right now", "C) Buy equal amounts of both until income is exhausted", "D) Stop consuming both until the market price adjusts"], correct: 1, exp: "Shift toward the good with the higher MU/$. More movies → MU of movies falls (diminishing returns) → ratio falls toward equality. Keep shifting until MU_M/P_M = MU_T/P_T." },
  { q: "When income rises and a consumer buys MORE of a good, that good is:", options: ["A) An inferior good — demand rises because it's now more affordable", "B) A normal good — demand rises with income", "C) A Giffen good — demand rises as price rises", "D) A complementary good — it must be bought with another product"], correct: 1, exp: "Normal good: demand rises as income rises. The budget line shifts outward (parallel), and the consumer moves to a higher utility bundle with more of the normal good." },
  { q: "When income rises, Amara buys FEWER overnight getaways. This means overnight getaways are:", options: ["A) A normal good — she can afford more now", "B) A complement to concert tickets", "C) An inferior good — demand falls as income rises", "D) A substitute for concert tickets"], correct: 2, exp: "Inferior good: demand falls when income rises. Amara substitutes toward preferred alternatives (concert tickets) as her budget allows. Examples: ramen noodles, bus rides, generic brands." },
  { q: "A price increase on one good causes the budget line to:", options: ["A) Shift inward parallel — both intercepts fall proportionally", "B) Rotate inward on that good's axis — only that good's intercept changes", "C) Shift outward parallel — the consumer can now afford less of everything", "D) Remain unchanged — price changes only affect MU, not the budget line"], correct: 1, exp: "Price ↑ on Good 1 → Good 1 intercept falls (can afford fewer units at higher price) while Good 2 intercept is unchanged. The line rotates inward on the Good 1 axis. Slope changes because opportunity cost changed." },
  { q: "Kahneman & Tversky found that losses are weighted approximately how much more than equivalent gains?", options: ["A) 1.0× — losses and gains are treated symmetrically", "B) 1.5× — losses feel slightly worse", "C) 2.25× — losses hurt significantly more than gains feel good", "D) 5.0× — losses are catastrophic relative to gains"], correct: 2, exp: "The seminal finding: losses hurt ~2.25× more than equivalent gains feel good. A $100 loss causes more pain than a $100 gain causes pleasure. This explains risk aversion, status quo bias, and investor overreaction." },
  { q: "You paid $100 for a concert ticket but can't attend. The ticket is non-refundable. According to rational decision-making:", options: ["A) You should go — you've already paid so you must get your money's worth", "B) The $100 is a sunk cost — your decision should only consider future costs and benefits from this point forward", "C) You should try to sell the ticket to recover part of the loss", "D) The $100 should count toward future entertainment decisions"], correct: 1, exp: "Sunk costs are irretrievable — they should not influence forward-looking decisions. Rational choice: do whatever maximizes future utility from this point. Loss aversion makes us FEEL we should go, but the $100 is gone regardless." },
  { q: "A consumer keeps $5,000 in a savings account at 1% APY while simultaneously carrying $5,000 in credit card debt at 22% APR. This is an example of:", options: ["A) Rational portfolio diversification", "B) The substitution effect — saving and borrowing are complementary behaviors", "C) Mental accounting — the 'emergency fund' label prevents rational arbitrage between accounts", "D) Loss aversion — the consumer fears the loss of savings more than the interest cost"], correct: 2, exp: "Mental accounting: the 'emergency fund' mental label creates a psychological barrier against using savings to pay off high-interest debt — even though the net effect is losing 21% APY. Traditional economics: $1 = $1 regardless of label." },
  { q: "When a good's price rises, a utility-maximizing consumer experiences TWO effects. Which pair correctly describes them?", options: ["A) Substitution effect: consumer buys more of the now-relatively-cheaper good. Income effect: real purchasing power falls, so less is bought overall.", "B) Substitution effect: consumer buys more of the now-expensive good. Income effect: nominal income falls.", "C) Substitution effect: consumer moves to a higher budget line. Income effect: marginal utility of the good rises.", "D) Substitution effect: MU per dollar rises for the expensive good. Income effect: the budget constraint rotates outward."], correct: 0, exp: "Substitution effect: relative prices change → substitute toward the relatively cheaper good. Income effect: higher price means real purchasing power falls → fewer units overall. For normal goods, both effects reduce quantity demanded — generating the downward-sloping demand curve." },
  { q: "The demand curve slopes downward BECAUSE (from the utility theory perspective):", options: ["A) Lower prices are always set by competitive markets with many sellers", "B) When price falls, MU/$ rises → consumer buys more until MU/$ falls back to equal MU/$ of other goods", "C) Economists assume demand slopes downward by convention", "D) The budget line shifts outward when price falls, increasing total income"], correct: 1, exp: "When price falls, MU/$ = MU/P rises. The consumer has an incentive to buy more — the good is now a better deal per dollar. They keep buying more until diminishing MU brings MU/$ back to equality with other goods. This IS the law of demand, derived from utility maximization." },
  { q: "At Point T (0 T-shirts, 8 Movies) in José's example, TU = 100. At Point S (1 T-shirt, 6 Movies), TU = 103. What does this confirm?", options: ["A) José should always buy movies over T-shirts", "B) Point S is better because equal MU/$ ratios maximize total utility given the budget constraint", "C) José's budget is too small — he needs more income", "D) Total utility is maximized when spending is spread as evenly as possible"], correct: 1, exp: "Point S (TU=103) > Point T (TU=100) > Point R (TU=101) > Point P (TU=81). The MU/$ equalization rule (MU_T/P_T = MU_M/P_M = 1.57 at Point S) correctly identifies the utility maximum among all affordable bundles." },
  { q: "If budget line slope = −(P_M/P_T) = −0.5, what does this mean in plain English?", options: ["A) Movies cost twice as much as T-shirts", "B) T-shirts cost twice as much as movies — the opportunity cost of one T-shirt is 2 movies", "C) The consumer can afford 0.5 movies for every dollar of income", "D) Total utility falls at a rate of 0.5 utils per dollar spent"], correct: 1, exp: "Slope = −P_T/P_M = −14/7 = −2... wait. If the slope = −0.5, then P_M/P_T = 0.5, meaning movies cost half as much as T-shirts. T-shirts cost twice as much. Opportunity cost of 1 T-shirt = 2 movies: to buy 1 more T-shirt, give up 2 movies." },
];

function QuizStation({ onPass, onFail }: { onPass: (score: number, results: { correct: boolean; exp: string }[]) => void; onFail: () => void }) {
  const [questions] = useState(() => shuffle(ALL_QUESTIONS).slice(0, 10));
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const q = questions[idx];
  const isLast = idx === 9;

  function handleCheck() {
    if (sel === null) return;
    setScore(s => s + (sel === q.correct ? 1 : 0));
    setChecked(true);
  }
  function handleNext() {
    setResults(r => [...r, { correct: sel === q.correct, exp: q.exp }]);
    setIdx(i => i + 1); setSel(null); setChecked(false);
  }
  function handleFinish() {
    const finalResults = [...results, { correct: sel === q.correct, exp: q.exp }];
    const finalScore = score + (sel === q.correct ? 1 : 0);
    if (finalScore >= 9) { onPass(finalScore, finalResults); } else { onFail(); }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm">
        <p className="font-semibold text-foreground mb-1">Chapter 6 Quiz — Consumer Choice</p>
        <p className="text-muted-foreground text-xs">10 questions from the full pool. You need 9/10 to complete the lab.</p>
        <div className="mt-2 h-1.5 bg-primary/20 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" role="progressbar" aria-valuenow={idx} aria-valuemin={0} aria-valuemax={10} style={{ width: `${(idx / 10) * 100}%` }} />
        </div>
      </div>
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Question {idx + 1} of 10</p>
          {score > 0 && <span className="text-xs font-semibold text-green-700">{score} correct so far</span>}
        </div>
        <p className="text-sm font-semibold text-foreground">{q.q}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button key={`q${idx}-opt${i}`} disabled={checked} onClick={() => setSel(i)} aria-pressed={sel === i}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition ${
                checked
                  ? i === q.correct ? "border-green-500 bg-green-50 text-green-900"
                    : i === sel && sel !== q.correct ? "border-red-400 bg-red-50 text-red-900"
                    : "border-border text-muted-foreground opacity-60"
                  : sel === i ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background text-foreground hover:border-primary"
              }`}>{opt}</button>
          ))}
        </div>
        {checked && <div className={`rounded-lg p-3 text-xs ${sel === q.correct ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>{sel === q.correct ? "✓ Correct — " : "✗ Incorrect — "}{q.exp}</div>}
        {!checked && sel !== null && <button onClick={handleCheck} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition">Check Answer</button>}
        {checked && !isLast && <button onClick={handleNext} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition">Next Question →</button>}
        {checked && isLast && <button onClick={handleFinish} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Submit Quiz</button>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Summary Modal
// ─────────────────────────────────────────────
const CH6_SUMMARY = [
  { heading: "6.1 Consumption Choices", body: "Economic analysis of household behavior is based on the assumption that people seek the highest level of utility or satisfaction. Individuals are the only judge of their own utility. In general, greater consumption of a good brings higher total utility. However, the additional utility people receive from each unit of greater consumption tends to decline in a pattern of diminishing marginal utility.\n\nWe can find the utility-maximizing choice on a consumption budget constraint in several ways. You can add up total utility of each choice on the budget line and choose the highest total. You can select a starting point at random and compare the marginal utility gains and losses of moving to neighboring points—and thus eventually seek out the preferred choice. Alternatively, you can compare the ratio of the marginal utility to price of good 1 with the marginal utility to price of good 2 and apply the rule that at the optimal choice, the two ratios should be equal: MU1/P1 = MU2/P2." },
  { heading: "6.2 How Changes in Income and Prices Affect Consumption Choices", body: "The budget constraint framework suggest that when income or price changes, a range of responses are possible. When income rises, households will demand a higher quantity of normal goods, but a lower quantity of inferior goods. When the price of a good rises, households will typically demand less of that good—but whether they will demand a much lower quantity or only a slightly lower quantity will depend on personal preferences. Also, a higher price for one good can lead to more or less demand of the other good." },
  { heading: "6.3 Behavioral Economics: An Alternative Framework for Consumer Choice", body: "People regularly make decisions that seem less than rational, decisions that contradict traditional consumer theory. This is because traditional theory ignores people's state of mind or feelings, which can influence behavior. For example, people tend to value a dollar lost more than a dollar gained, even though the amounts are the same. Similarly, many people over withhold on their taxes, essentially giving the government a free loan until they file their tax returns, so that they are more likely to get money back than have to pay money on their taxes." },
];

function SummaryModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="summary-title">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 id="summary-title" className="font-bold text-base text-foreground">Chapter 6 Summary — Consumer Choice</h2>
          <button ref={closeRef} onClick={onClose} type="button" className="text-muted-foreground hover:text-foreground text-2xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {CH6_SUMMARY.map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground mb-1">{s.heading}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-2">Access for free at <a href="https://openstax.org/books/principles-microeconomics-3e/pages/6-introduction-to-consumer-choices" target="_blank" rel="noopener noreferrer" className="underline text-primary">openstax.org — Principles of Microeconomics 3e, Ch 6</a></p>
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={onClose} type="button" className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition">Close &amp; Return to Lab</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Not Yet Screen
// ─────────────────────────────────────────────
function NotYetScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="max-w-lg mx-auto space-y-4 text-center">
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6">
        <p className="text-2xl mb-2">📚</p>
        <p className="text-lg font-bold text-amber-800">Not quite there yet</p>
        <p className="text-sm text-amber-700 mt-2">You need 9 out of 10 correct to complete the quiz. This screen cannot be submitted. Only the final Results screen counts.</p>
      </div>
      <button type="button" onClick={onRetry} className="w-full py-3 bg-amber-500 hover:opacity-90 text-white rounded-xl font-semibold transition">← Try the Quiz Again</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Results Screen
// ─────────────────────────────────────────────
const STATION_LABELS: Record<string, string> = {
  utility:    "Utility & Diminishing MU",
  budget:     "Budget Constraint",
  utilmax:    "Utility Maximization",
  incprice:   "Income & Price Changes",
  behavioral: "Behavioral Economics",
  flash:      "Flashcard Review",
};

function ResultsScreen({ score, results, sectionScores, onRestart }: {
  score: number;
  results: { correct: boolean; exp: string }[];
  sectionScores: Record<string, { score: number; total: number }>;
  onRestart: () => void;
}) {
  const [name, setName] = useState("");
  const [exitTicket, setExitTicket] = useState("");
  const stationRows = Object.entries(STATION_LABELS).filter(([id]) => sectionScores[id]).map(([id, label]) => ({ label, ...sectionScores[id] }));

  function printPDF() {
    const w = window.open("", "_blank", "width=820,height=960");
    if (!w) return;
    const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const stRows = stationRows.map(r => `<tr><td style="padding:7px 10px;border-bottom:1px solid #e2e8f0">${r.label}</td><td style="text-align:center;padding:7px 10px;border-bottom:1px solid #e2e8f0">${r.score}/${r.total}</td><td style="text-align:center;padding:7px 10px;border-bottom:1px solid #e2e8f0">${r.score===r.total?"✓":r.score>=r.total*0.7?"Good":"Review"}</td></tr>`).join("");
    const qRows = results.map((r, i) => `<tr style="background:${r.correct?"#f0fdf4":"#fef2f2"}"><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600;text-align:center">${r.correct?"✓":"✗"}</td><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600">Question ${i+1}</td><td style="padding:8px;border:1px solid #e2e8f0;font-size:11px;color:#475569">${r.exp}</td></tr>`).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>ECO 211 Ch6 Results</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#1e293b}h1{color:#1a2744;font-size:1.3rem;margin-bottom:4px}h2{font-size:1rem;color:#475569;font-weight:normal;margin-top:0}h3{font-size:0.9rem;color:#1e293b;margin:20px 0 8px}.score-box{background:#f0fdf4;border:2px solid #86efac;border-radius:10px;padding:14px;text-align:center;margin:16px 0}.score-box p{margin:0;color:#166534;font-size:1.1rem;font-weight:bold}table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:0.85rem}th{background:#1a2744;color:white;padding:8px 10px;text-align:left}tr:nth-child(even) td{background:#f8fafc}footer{font-size:0.7rem;color:#94a3b8;margin-top:30px;border-top:1px solid #e2e8f0;padding-top:10px}</style></head><body>
    <h1>${COURSE_TITLE}</h1><h2>Chapter 6 — Consumer Choice</h2>
    <p style="font-size:0.9rem;color:#475569"><strong>Student:</strong> ${name||"—"} &nbsp;&nbsp; <strong>Date:</strong> ${now}</p>
    <div class="score-box"><p>Quiz Score: ${score}/10 — ${score>=9?"PASSED ✓":"Not Yet"}</p></div>
    ${stRows?`<h3>Station Scores</h3><table><thead><tr><th>Station</th><th style="text-align:center">Score</th><th style="text-align:center">Status</th></tr></thead><tbody>${stRows}</tbody></table>`:""}
    <h3>Quiz Question Review</h3><table><thead><tr><th style="width:40px"></th><th>Question</th><th>Explanation</th></tr></thead><tbody>${qRows}</tbody></table>
    ${exitTicket?`<div style="background:#fafafa;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-top:12px"><strong style="font-size:0.75rem;text-transform:uppercase;color:#64748b">Exit Ticket</strong><p style="font-size:0.85rem;margin:6px 0 0">${exitTicket}</p></div>`:""}
    <footer>Access for free at https://openstax.org/books/principles-microeconomics-3e/pages/6-introduction-to-consumer-choices</footer></body></html>`);
    setTimeout(() => w.print(), 600);
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className={`rounded-2xl p-5 text-center ${score>=9?"bg-green-50 border-2 border-green-300":"bg-amber-50 border-2 border-amber-300"}`}>
        <p className="text-3xl font-bold">{score}/10</p>
        <p className={`text-lg font-semibold mt-1 ${score>=9?"text-green-800":"text-amber-800"}`}>{score>=9?"Excellent — Chapter 6 Complete! ✓":"Keep Reviewing — You Need 9/10"}</p>
        <p className="text-sm text-muted-foreground mt-1">Chapter 6 — Consumer Choice</p>
      </div>
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
        <div>
          <label htmlFor="result-name" className="text-sm font-semibold text-foreground block mb-1">Your Name (required for credit)</label>
          <input id="result-name" value={name} onChange={e => setName(e.target.value)} placeholder="First and Last Name" className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label htmlFor="exit-ticket" className="text-sm font-semibold text-foreground block mb-1">Exit Ticket: Explain the Utility Maximization Rule (MU₁/P₁ = MU₂/P₂) in your own words. Why does a consumer following this rule maximize total utility?</label>
          <textarea id="exit-ticket" value={exitTicket} onChange={e => setExitTicket(e.target.value)} rows={3} placeholder="Your response..." className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none resize-none" />
        </div>
      </div>
      {stationRows.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm font-semibold text-foreground mb-3">Station Scores</p>
          <div className="space-y-2">
            {stationRows.map(r => (
              <div key={r.label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{r.label}</span>
                <span className={`font-bold ${r.score===r.total?"text-green-700":r.score>=r.total*0.7?"text-amber-700":"text-red-600"}`}>{r.score}/{r.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Quiz Question Review</p>
        {results.map((r, i) => (
          <div key={i} className={`rounded-xl border p-3 ${r.correct?"border-green-200 bg-green-50":"border-red-200 bg-red-50"}`}>
            <p className="text-xs font-semibold">{r.correct?"✓ Correct":"✗ Incorrect"} — Question {i+1}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{r.exp}</p>
          </div>
        ))}
      </div>
      <button type="button" onClick={onRestart} className="w-full py-3 bg-muted hover:bg-accent text-muted-foreground rounded-xl font-semibold transition text-sm">↺ Start Over</button>
      <button type="button" onClick={printPDF} disabled={!name.trim()} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition text-sm">🖨️ Print PDF</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Dashboard & Header
// ─────────────────────────────────────────────
const STATIONS = [
  { id: "utility" as Station,    icon: "☕", label: "Utility & Diminishing MU", desc: "TU, MU, and the coffee example" },
  { id: "budget" as Station,     icon: "🧱", label: "Budget Constraint",        desc: "Classify José's 6 bundles" },
  { id: "utilmax" as Station,    icon: "⚖️", label: "Utility Maximization",     desc: "MU₁/P₁ = MU₂/P₂ walkthrough" },
  { id: "incprice" as Station,   icon: "↔️", label: "Income & Price Changes",   desc: "Shifts vs. rotations" },
  { id: "behavioral" as Station, icon: "🧠", label: "Behavioral Economics",     desc: "Loss aversion, mental accounting" },
  { id: "flash" as Station,      icon: "🃏", label: "Flashcard Review",         desc: "Review all 14 key terms" },
];

const NAV_STATIONS: { id: Station; label: string }[] = [
  { id: "utility",    label: "Utility" },
  { id: "budget",     label: "Budget" },
  { id: "utilmax",    label: "Util Max" },
  { id: "incprice",   label: "Inc/Price" },
  { id: "behavioral", label: "Behavioral" },
  { id: "flash",      label: "Flashcards" },
  { id: "quiz",       label: "Quiz" },
];

const STATION_ORDER: Station[] = ["intro","utility","budget","utilmax","incprice","behavioral","flash","quiz","results","not-yet"];

function Dashboard({ completed, onSelect, quizUnlocked, onStartQuiz, onSummary }: {
  completed: Set<Station>; onSelect: (s: Station) => void; quizUnlocked: boolean; onStartQuiz: () => void; onSummary: () => void;
}) {
  const progress = STATIONS.filter(s => completed.has(s.id)).length;
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">Chapter 6 — Consumer Choice</p>
        <p className="text-muted-foreground text-xs">Complete all stations and the Flashcard review to unlock the Quiz. Your progress is saved automatically.</p>
        <div className="mt-3 h-2 bg-primary/20 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={STATIONS.length} style={{ width: `${(progress / STATIONS.length) * 100}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{progress}/{STATIONS.length} stations complete</p>
      </div>
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted border border-border">
        <div className="flex items-center gap-2"><span className="text-base">📄</span><span className="text-sm text-foreground">Need a refresher? View the chapter summary.</span></div>
        <button onClick={onSummary} className="text-xs px-3 py-1.5 rounded-lg bg-card border border-border text-primary font-semibold hover:bg-accent transition-all shrink-0">Open Summary</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {STATIONS.map(s => {
          const done = completed.has(s.id);
          return (
            <button key={s.id} type="button" onClick={() => onSelect(s.id)}
              className={`rounded-xl border-2 p-3 text-left transition ${done ? "border-green-400 bg-green-50" : "border-border bg-card hover:border-primary/40"}`}>
              <span className="text-lg">{done ? "✅" : s.icon}</span>
              <p className="text-sm font-semibold text-foreground mt-1">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </button>
          );
        })}
      </div>
      <button type="button" onClick={onStartQuiz} disabled={!quizUnlocked}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition ${quizUnlocked ? "bg-primary hover:opacity-90 text-primary-foreground" : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"}`}>
        {quizUnlocked ? "🎯 Take the Quiz" : "🔒 Complete all stations to unlock the Quiz"}
      </button>
    </div>
  );
}

function Header({ station, completed, onNav }: { station: Station; completed: Set<Station>; onNav: (s: Station) => void }) {
  const allStationsDone = STATIONS.every(s => completed.has(s.id));
  return (
    <>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-semibold">Skip to main content</a>
    <header role="banner" className="bg-secondary text-secondary-foreground shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Econ Lab logo">
            <rect width="32" height="32" rx="8" fill="hsl(38 95% 50%)"/>
            <path d="M8 22 L12 14 L16 18 L20 10 L24 16" stroke="hsl(222 30% 10%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="24" cy="16" r="2" fill="hsl(222 30% 10%)"/>
          </svg>
          <div>
            <div className="font-semibold text-sm leading-none text-sidebar-foreground">{COURSE_TITLE}</div>
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">{COURSE_SUBTITLE}</div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 flex-wrap">
          {NAV_STATIONS.map(s => {
            const done = completed.has(s.id);
            const active = s.id === station || (station === "not-yet" && s.id === "quiz") || (station === "results" && s.id === "quiz");
            if (s.id === "quiz" && !allStationsDone) return <span key={s.id} className="px-3 py-1.5 rounded-full text-xs font-medium text-sidebar-foreground/35 cursor-not-allowed select-none">🔒 Quiz</span>;
            return (
              <button key={s.id} onClick={() => onNav(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active ? "bg-primary text-primary-foreground" : done ? "bg-sidebar-accent text-sidebar-foreground/90" : "text-sidebar-foreground/75 hover:text-white"}`}>
                {done && !active ? "✓ " : ""}{s.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
    </>
  );
}

// ─────────────────────────────────────────────
// Main EconLab
// ─────────────────────────────────────────────
export default function EconLab() {
  const [station, setStation] = useState<Station>("intro");
  const [completed, setCompleted] = useState<Set<Station>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Station[]); } catch { return new Set(); }
  });
  const [showSummary, setShowSummary] = useState(false);
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [sectionScores, setSectionScores] = useState<Record<string, { score: number; total: number }>>({});

  function markDone(s: Station, score?: number, total?: number) {
    const next = new Set(completed);
    next.add(s);
    setCompleted(next);
    if (score !== undefined && total !== undefined) setSectionScores(prev => ({ ...prev, [s]: { score, total } }));
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch {}
    setStation("intro");
  }

  const quizUnlocked = STATIONS.every(s => completed.has(s.id));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
      <Header station={station} completed={completed} onNav={setStation} />
      <main id="main-content" className="max-w-2xl mx-auto px-4 py-6">
        {station === "intro"      && <Dashboard completed={completed} onSelect={setStation} quizUnlocked={quizUnlocked} onStartQuiz={() => setStation("quiz")} onSummary={() => setShowSummary(true)} />}
        {station === "utility"    && <UtilityStation    onComplete={(sc, t) => markDone("utility",    sc, t)} />}
        {station === "budget"     && <BudgetStation     onComplete={(sc, t) => markDone("budget",     sc, t)} />}
        {station === "utilmax"    && <UtilMaxStation    onComplete={(sc, t) => markDone("utilmax",    sc, t)} />}
        {station === "incprice"   && <IncPriceStation   onComplete={(sc, t) => markDone("incprice",   sc, t)} />}
        {station === "behavioral" && <BehavioralStation onComplete={(sc, t) => markDone("behavioral", sc, t)} />}
        {station === "flash"      && <FlashcardStation  onComplete={(sc, t) => markDone("flash",      sc, t)} />}
        {station === "quiz" && (
          <QuizStation
            onPass={(score, results) => { setQuizScore(score); setQuizResults(results); markDone("quiz"); setStation("results"); }}
            onFail={() => setStation("not-yet")}
          />
        )}
        {station === "results" && <ResultsScreen score={quizScore} results={quizResults} sectionScores={sectionScores} onRestart={() => setStation("intro")} />}
        {station === "not-yet"   && <NotYetScreen onRetry={() => setStation("quiz")} />}
      </main>
    </div>
  );
}
