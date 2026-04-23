import { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft, Award, BarChart2, BookOpen, RotateCcw, TrendingUp, Zap, Scale } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "recap" | "wages" | "multiplier" | "phillips" | "policy" | "verdict" | "fredchart" | "quiz" | "results" | "not-yet";

// ─────────────────────────────────────────────
// FRED Data (annual averages 1960–2023)
// ─────────────────────────────────────────────
const PHILLIPS_DATA: { year: number; u: number; inf: number }[] = [
  { year: 1960, u: 5.54, inf: 1.49 }, { year: 1961, u: 6.69, inf: 1.07 },
  { year: 1962, u: 5.57, inf: 1.18 }, { year: 1963, u: 5.64, inf: 1.26 },
  { year: 1964, u: 5.16, inf: 1.32 }, { year: 1965, u: 4.51, inf: 1.58 },
  { year: 1966, u: 3.79, inf: 2.99 }, { year: 1967, u: 3.84, inf: 2.79 },
  { year: 1968, u: 3.56, inf: 4.24 }, { year: 1969, u: 3.49, inf: 5.43 },
  { year: 1970, u: 4.98, inf: 5.89 }, { year: 1971, u: 5.95, inf: 4.23 },
  { year: 1972, u: 5.60, inf: 3.27 }, { year: 1973, u: 4.86, inf: 6.24 },
  { year: 1974, u: 5.64, inf: 10.99 }, { year: 1975, u: 8.47, inf: 9.19 },
  { year: 1976, u: 7.70, inf: 5.78 }, { year: 1977, u: 7.05, inf: 6.47 },
  { year: 1978, u: 6.07, inf: 7.61 }, { year: 1979, u: 5.85, inf: 11.22 },
  { year: 1980, u: 7.17, inf: 13.53 }, { year: 1981, u: 7.62, inf: 10.39 },
  { year: 1982, u: 9.71, inf: 6.19 }, { year: 1983, u: 9.60, inf: 3.16 },
  { year: 1984, u: 7.51, inf: 4.37 }, { year: 1985, u: 7.19, inf: 3.53 },
  { year: 1986, u: 7.00, inf: 1.95 }, { year: 1987, u: 6.17, inf: 3.58 },
  { year: 1988, u: 5.49, inf: 4.10 }, { year: 1989, u: 5.26, inf: 4.79 },
  { year: 1990, u: 5.62, inf: 5.41 }, { year: 1991, u: 6.85, inf: 4.23 },
  { year: 1992, u: 7.49, inf: 3.04 }, { year: 1993, u: 6.91, inf: 2.97 },
  { year: 1994, u: 6.10, inf: 2.60 }, { year: 1995, u: 5.59, inf: 2.81 },
  { year: 1996, u: 5.41, inf: 2.93 }, { year: 1997, u: 4.94, inf: 2.34 },
  { year: 1998, u: 4.50, inf: 1.55 }, { year: 1999, u: 4.22, inf: 2.19 },
  { year: 2000, u: 3.97, inf: 3.37 }, { year: 2001, u: 4.74, inf: 2.82 },
  { year: 2002, u: 5.78, inf: 1.60 }, { year: 2003, u: 5.99, inf: 2.30 },
  { year: 2004, u: 5.54, inf: 2.67 }, { year: 2005, u: 5.08, inf: 3.36 },
  { year: 2006, u: 4.61, inf: 3.23 }, { year: 2007, u: 4.62, inf: 2.87 },
  { year: 2008, u: 5.80, inf: 3.82 }, { year: 2009, u: 9.28, inf: -0.31 },
  { year: 2010, u: 9.61, inf: 1.64 }, { year: 2011, u: 8.93, inf: 3.14 },
  { year: 2012, u: 8.07, inf: 2.08 }, { year: 2013, u: 7.36, inf: 1.47 },
  { year: 2014, u: 6.16, inf: 1.62 }, { year: 2015, u: 5.27, inf: 0.12 },
  { year: 2016, u: 4.88, inf: 1.27 }, { year: 2017, u: 4.36, inf: 2.13 },
  { year: 2018, u: 3.89, inf: 2.44 }, { year: 2019, u: 3.68, inf: 1.81 },
  { year: 2020, u: 8.10, inf: 1.26 }, { year: 2021, u: 5.35, inf: 4.68 },
  { year: 2022, u: 3.65, inf: 8.00 }, { year: 2023, u: 3.62, inf: 4.15 },
];

// ─────────────────────────────────────────────
// Ch12+13 Summary
// ─────────────────────────────────────────────
const CH1213_SUMMARY = [
  {
    heading: "12.1 — Aggregate Demand in Keynesian Analysis",
    body: "Aggregate demand is the sum of four components: consumption, investment, government spending, and net exports. Consumption changes with income, taxes, expectations, and wealth. Investment responds to expected profitability, technology, input prices, and interest rates. Government spending and taxes are set by political decisions. Exports and imports shift with relative growth rates and prices between economies.",
  },
  {
    heading: "12.2 — Building Blocks of Keynesian Analysis",
    body: "Keynesian economics rests on two ideas: (1) aggregate demand is more likely than aggregate supply to cause short-run events like recessions; (2) wages and prices can be sticky, so downturns produce unemployment rather than quick price adjustment. Menu costs explain price stickiness. The expenditure multiplier means a change in autonomous spending causes a more-than-proportionate change in GDP.",
  },
  {
    heading: "12.3 — The Phillips Curve",
    body: "A Phillips curve shows the tradeoff between unemployment and inflation. From a Keynesian view, higher unemployment means lower inflation, and vice versa — but this is a short-run relationship that can shift. Expansionary fiscal policy (tax cuts, spending increases) shifts AD right to fight recessions. Contractionary fiscal policy (tax increases, spending cuts) shifts AD left to cool inflation.",
  },
  {
    heading: "12.4 — Keynesian Perspective on Market Forces",
    body: "Keynesian policy calls for government intervention at the macroeconomic level — increasing aggregate demand when private demand falls and decreasing it when private demand rises. This is macro-level stabilization, not micro-level price or quantity controls.",
  },
  {
    heading: "13.1 — Building Blocks of Neoclassical Analysis",
    body: "The neoclassical perspective holds that the economy adjusts back to potential GDP through flexible prices in the long run — making the long-run AS curve vertical. Rational expectations theory argues people have excellent information and adjustments happen quickly. Adaptive expectations theory allows for slower adjustment due to limited information.",
  },
  {
    heading: "13.2 — Policy Implications of Neoclassical Perspective",
    body: "Neoclassical economists emphasize long-run growth over fighting recessions, believing recessions fade on their own. They focus on reducing the natural rate of unemployment rather than cyclical unemployment. With a vertical long-run AS curve, aggregate demand affects only the price level, not output — producing a vertical Phillips curve and no lasting inflation-unemployment tradeoff.",
  },
  {
    heading: "13.3 — Balancing Keynesian and Neoclassical Models",
    body: "Keynesians see AD changes as the primary cause of business cycles and advocate active stabilization policy. Neoclassical economists emphasize aggregate supply and long-run self-correction — they are skeptical of policy effectiveness and timing. Keynesians accept a short-run inflation-unemployment tradeoff; neoclassicals argue any such tradeoff eventually disappears, leaving only inflation.",
  },
];

// ─────────────────────────────────────────────
// Summary Modal
// ─────────────────────────────────────────────
function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-foreground">📄 Chapter 12 & 13 Summary</h2>
          <button onClick={onClose} className="text-muted-foreground/60 hover:text-muted-foreground text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {CH1213_SUMMARY.map((sec, i) => (
            <div key={i}>
              <h3 className="font-semibold text-primary mb-1">{sec.heading}</h3>
              <p className="text-sm text-foreground leading-relaxed">{sec.body}</p>
            </div>
          ))}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Access for free at{" "}
              <a href="https://openstax.org/books/principles-macroeconomics-3e/pages/1-introduction" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                https://openstax.org/books/principles-macroeconomics-3e/pages/1-introduction
              </a>
            </p>
          </div>
        </div>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition"
          >
            Close & Return to Lab
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Recap Station — Ch11 Review (5 Qs)
// ─────────────────────────────────────────────
const RECAP_QUESTIONS = [
  {
    q: "The economy is producing above potential GDP. In the AD-AS model, which zone does this represent?",
    opts: ["Keynesian zone", "Intermediate zone", "Neoclassical zone", "Recessionary gap zone"],
    correct: 2,
    exp: "Above potential GDP is the Neoclassical (vertical) zone — the economy is at or beyond full capacity.",
  },
  {
    q: "A decrease in consumer confidence shifts which curve, and in which direction?",
    opts: ["AS shifts right", "AD shifts left", "AD shifts right", "AS shifts left"],
    correct: 1,
    exp: "Lower consumer confidence reduces consumption spending, shifting Aggregate Demand to the left.",
  },
  {
    q: "The output gap equals Real GDP minus Potential GDP. A negative output gap indicates:",
    opts: ["The economy is overheating", "Unemployment is below the natural rate", "The economy is in a recessionary gap", "Inflation is above target"],
    correct: 2,
    exp: "A negative output gap means real GDP is below potential — a recessionary gap with cyclical unemployment.",
  },
  {
    q: "Which of the following would shift the Aggregate Supply curve to the LEFT? (Select all that apply)",
    opts: ["A rise in oil prices", "Widespread drought reducing farm output", "New labor-saving technology", "A drop in worker productivity"],
    correct: [0, 1, 3],
    multi: true,
    exp: "Higher input costs (oil), supply shocks (drought), and lower productivity all reduce AS. New technology would shift AS right.",
  },
  {
    q: "During the 2008–2009 financial crisis, the U.S. output gap turned sharply negative. This is best explained by:",
    opts: [
      "A large rightward shift in AS",
      "A large leftward shift in AD due to falling investment and consumption",
      "The economy moving into the Neoclassical zone",
      "A supply shock raising production costs",
    ],
    correct: 1,
    exp: "The financial crisis caused a collapse in investment and consumer spending — a massive leftward AD shift producing a deep recessionary gap.",
  },
];

function RecapStation({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const q = RECAP_QUESTIONS[current];
  const isMulti = !!q.multi;

  function toggle(idx: number) {
    if (submitted) return;
    if (isMulti) {
      setSelected(prev => prev.includes(idx) ? prev.filter(x => x !== idx) : [...prev, idx]);
    } else {
      setSelected([idx]);
    }
  }

  function submit() {
    if (selected.length === 0) return;
    let correct = false;
    if (isMulti) {
      const ca = q.correct as number[];
      correct = ca.length === selected.length && ca.every(x => selected.includes(x));
    } else {
      correct = selected[0] === (q.correct as number);
    }
    setSubmitted(true);
    if (correct) setScore(s => s + 1);
    setResults(prev => [...prev, correct]);
  }

  function next() {
    if (current + 1 >= RECAP_QUESTIONS.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setSelected([]);
      setSubmitted(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-4 py-6">
        <div className="text-5xl">📚</div>
        <h3 className="text-xl font-bold text-foreground">Ch11 Recap Complete!</h3>
        <p className="text-muted-foreground">You got <span className="font-bold text-primary">{score} / {RECAP_QUESTIONS.length}</span> correct.</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {results.map((r, i) => (
            <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold ${r ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              Q{i + 1} {r ? "✓" : "✗"}
            </span>
          ))}
        </div>
        <button onClick={onComplete} className="mt-4 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">
          Mark Complete ✓
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground/60 mb-2">
        <span>Question {current + 1} of {RECAP_QUESTIONS.length}</span>
        <span>{isMulti ? "Select all that apply" : "Select one"}</span>
      </div>
      <div className="bg-muted rounded-xl p-4">
        <p className="font-semibold text-foreground leading-snug">{q.q}</p>
      </div>
      <div className="space-y-2">
        {q.opts.map((opt, i) => {
          const isSel = selected.includes(i);
          const isCorrect = isMulti ? (q.correct as number[]).includes(i) : q.correct === i;
          let cls = "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ";
          if (!submitted) {
            cls += isSel ? "border-primary bg-primary/10 text-foreground" : "border-slate-200 bg-white hover:border-primary/40 text-foreground";
          } else {
            if (isCorrect) cls += "border-green-500 bg-green-50 text-green-800";
            else if (isSel && !isCorrect) cls += "border-red-400 bg-red-50 text-red-700";
            else cls += "border-border bg-card text-muted-foreground";
          }
          return (
            <button key={i} className={cls} onClick={() => toggle(i)} disabled={submitted}>
              {isMulti ? (isSel ? "☑ " : "☐ ") : ""}{opt}
            </button>
          );
        })}
      </div>
      {submitted && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
          <span className="font-semibold">{(isMulti ? (q.correct as number[]).length === selected.length && (q.correct as number[]).every(x => selected.includes(x)) : selected[0] === q.correct) ? "✓ Correct! " : "✗ Not quite. "}</span>
          {q.exp}
        </div>
      )}
      {!submitted ? (
        <button onClick={submit} disabled={selected.length === 0}
          className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
          Submit Answer
        </button>
      ) : (
        <button onClick={next} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">
          {current + 1 < RECAP_QUESTIONS.length ? "Next Question →" : "See Results"}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 2 — Sticky vs. Flexible Wages
// ─────────────────────────────────────────────
const WAGE_CARDS = [
  { id: 0, text: "Workers resist nominal pay cuts even in a recession.", category: "keynesian" },
  { id: 1, text: "Prices fall quickly to restore full employment without government action.", category: "neoclassical" },
  { id: 2, text: "A business keeps staff at current wages rather than risk losing trained workers.", category: "keynesian" },
  { id: 3, text: "Labor markets clear rapidly — anyone willing to work at the market wage finds a job.", category: "neoclassical" },
  { id: 4, text: "Printing new menus is costly, so restaurants hold prices even when demand falls.", category: "keynesian" },
  { id: 5, text: "In the long run, the economy always returns to potential GDP regardless of AD shifts.", category: "neoclassical" },
  { id: 6, text: "Unemployment rises during recessions because wages don't fall fast enough.", category: "keynesian" },
  { id: 7, text: "Rational workers and firms immediately adjust expectations, so policy surprises don't work.", category: "neoclassical" },
];

function WagesStation({ onComplete }: { onComplete: () => void }) {
  const [placed, setPlaced] = useState<{ [id: number]: "keynesian" | "neoclassical" | null }>({});
  const [checked, setChecked] = useState(false);
  const [engaged, setEngaged] = useState(false);

  const totalPlaced = Object.values(placed).filter(Boolean).length;
  const allPlaced = totalPlaced === WAGE_CARDS.length;

  function place(id: number, cat: "keynesian" | "neoclassical") {
    setPlaced(prev => ({ ...prev, [id]: cat }));
    setEngaged(true);
  }

  function checkAnswers() {
    setChecked(true);
  }

  const score = WAGE_CARDS.filter(c => placed[c.id] === c.category).length;
  const allCorrect = score === WAGE_CARDS.length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Sort each statement into <span className="font-semibold text-blue-600">Keynesian</span> (sticky wages/prices, AD-driven) or{" "}
        <span className="font-semibold text-emerald-600">Neoclassical</span> (flexible prices, supply-side self-correction). Tap a statement, then tap a column to place it.
      </p>

      {/* Cards to sort */}
      <div className="grid grid-cols-1 gap-2">
        {WAGE_CARDS.filter(c => !placed[c.id]).map(card => (
          <div key={card.id} className="bg-card border-2 border-border rounded-xl p-3 text-sm text-foreground">
            <p className="mb-2">{card.text}</p>
            <div className="flex gap-2">
              <button onClick={() => place(card.id, "keynesian")}
                className="flex-1 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold transition">
                → Keynesian
              </button>
              <button onClick={() => place(card.id, "neoclassical")}
                className="flex-1 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold transition">
                → Neoclassical
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sorted columns */}
      {(placed[0] !== undefined || Object.keys(placed).length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {(["keynesian", "neoclassical"] as const).map(cat => (
            <div key={cat} className={`rounded-xl p-3 min-h-[60px] border-2 ${cat === "keynesian" ? "border-blue-200 bg-blue-50" : "border-emerald-200 bg-emerald-50"}`}>
              <p className={`text-xs font-bold mb-2 ${cat === "keynesian" ? "text-blue-700" : "text-emerald-700"}`}>
                {cat === "keynesian" ? "🔵 Keynesian" : "🟢 Neoclassical"}
              </p>
              {WAGE_CARDS.filter(c => placed[c.id] === cat).map(card => {
                const correct = checked ? card.category === cat : null;
                return (
                  <div key={card.id} className={`text-xs mb-1 p-1.5 rounded-lg ${checked ? (correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700") : "bg-white text-foreground"}`}>
                    {checked && (correct ? "✓ " : "✗ ")}{card.text}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {checked && (
        <div className={`p-3 rounded-xl text-sm font-semibold text-center ${allCorrect ? "bg-green-100 text-green-800" : "bg-amber-50 text-amber-800"}`}>
          {allCorrect ? "🎉 Perfect! All 8 sorted correctly." : `${score} / ${WAGE_CARDS.length} correct. Incorrect cards are marked in red.`}
        </div>
      )}

      {allPlaced && !checked && (
        <button onClick={checkAnswers} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">
          Check My Sorting
        </button>
      )}
      {checked && (
        <button onClick={onComplete} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">
          Mark Complete ✓
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 3 — Multiplier Calculator
// ─────────────────────────────────────────────
function MultiplierStation({ onComplete }: { onComplete: () => void }) {
  const [mpc, setMpc] = useState("");
  const [deltaG, setDeltaG] = useState("");
  const [mpcSubmit, setMpcSubmit] = useState<{ val: number; attempt: number; done: boolean; hint: string }>({ val: 0, attempt: 0, done: false, hint: "" });
  const [gdpSubmit, setGdpSubmit] = useState<{ val: number; attempt: number; done: boolean; hint: string }>({ val: 0, attempt: 0, done: false, hint: "" });
  const [engaged, setEngaged] = useState(false);

  const mpcNum = parseFloat(mpc);
  const gNum = parseFloat(deltaG);

  const correctMultiplier = !isNaN(mpcNum) && mpcNum > 0 && mpcNum < 1 ? 1 / (1 - mpcNum) : null;
  const correctGDP = correctMultiplier !== null && !isNaN(gNum) ? correctMultiplier * gNum : null;

  function attemptMultiplier() {
    if (!mpcSubmit.val && !mpc) return;
    const userVal = parseFloat(mpc);
    if (isNaN(userVal) || userVal <= 0 || userVal >= 1) return;
    const correct = correctMultiplier!;
    const userMultiplier = userVal; // they entered MPC; multiplier is computed
    // Actually: the student enters MPC, we compute for them — they need to understand the formula
    // Let's ask them to enter the multiplier value
    setEngaged(true);
  }

  // Revised approach: student enters MPC (0–1), sees formula, then enters multiplier result
  const [multiplierAnswer, setMultiplierAnswer] = useState("");
  const [gdpAnswer, setGdpAnswer] = useState("");
  const [mpcAttempt, setMpcAttempt] = useState(0);
  const [mpcDone, setMpcDone] = useState(false);
  const [mpcMsg, setMpcMsg] = useState("");
  const [gdpAttempt, setGdpAttempt] = useState(0);
  const [gdpDone, setGdpDone] = useState(false);
  const [gdpMsg, setGdpMsg] = useState("");
  const [bothDone, setBothDone] = useState(false);

  const mpcVal = parseFloat(mpc);
  const gVal = parseFloat(deltaG);
  const validMpc = !isNaN(mpcVal) && mpcVal > 0 && mpcVal < 1;
  const validG = !isNaN(gVal) && gVal !== 0;
  const trueMultiplier = validMpc ? +(1 / (1 - mpcVal)).toFixed(2) : null;
  const trueGDP = trueMultiplier !== null && validG ? +(trueMultiplier * gVal).toFixed(1) : null;

  function checkMultiplier() {
    const userM = parseFloat(multiplierAnswer);
    if (isNaN(userM) || trueMultiplier === null) return;
    const newAttempt = mpcAttempt + 1;
    setMpcAttempt(newAttempt);
    if (Math.abs(userM - trueMultiplier) <= 0.05) {
      setMpcDone(true);
      setMpcMsg("✓ Correct! Multiplier = 1 ÷ (1 − MPC)");
    } else if (newAttempt === 1) {
      setMpcMsg("Not quite — try again. Remember: Multiplier = 1 ÷ (1 − MPC)");
    } else if (newAttempt === 2) {
      setMpcMsg(`Hint: With MPC = ${mpcVal.toFixed(2)}, the denominator is ${(1 - mpcVal).toFixed(2)}.`);
    } else {
      setMpcDone(true);
      setMpcMsg(`The correct multiplier is ${trueMultiplier}. (1 ÷ ${(1 - mpcVal).toFixed(2)} = ${trueMultiplier})`);
    }
    setEngaged(true);
  }

  function checkGDP() {
    const userG = parseFloat(gdpAnswer);
    if (isNaN(userG) || trueGDP === null) return;
    const newAttempt = gdpAttempt + 1;
    setGdpAttempt(newAttempt);
    if (Math.abs(userG - trueGDP) <= Math.abs(trueGDP) * 0.02 + 0.5) {
      setGdpDone(true);
      setGdpMsg(`✓ Correct! ΔGDP = Multiplier × ΔG`);
      setBothDone(true);
    } else if (newAttempt === 1) {
      setGdpMsg("Not quite — try again. Multiply your multiplier by the change in government spending.");
    } else if (newAttempt === 2) {
      setGdpMsg(`Hint: ΔGDP = ${trueMultiplier} × ${gVal.toFixed(0)} = ?`);
    } else {
      setGdpDone(true);
      setGdpMsg(`Answer: ΔGDP = ${trueMultiplier} × ${gVal.toFixed(0)} = $${trueGDP.toFixed(1)} billion`);
      setBothDone(true);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">The Expenditure Multiplier</p>
        <p>When the government spends $1, total GDP rises by more than $1 because each dollar of income gets re-spent. The formula:</p>
        <p className="text-center font-mono font-bold text-lg mt-2">Multiplier = 1 ÷ (1 − MPC)</p>
        <p className="mt-2">Where MPC (marginal propensity to consume) is the fraction of extra income people spend.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">MPC (e.g. 0.75)</label>
          <input type="number" step="0.01" min="0.01" max="0.99" value={mpc}
            onChange={e => { setMpc(e.target.value); setMpcDone(false); setMpcAttempt(0); setMpcMsg(""); setMultiplierAnswer(""); setGdpDone(false); setGdpAttempt(0); setGdpMsg(""); setGdpAnswer(""); setBothDone(false); }}
            placeholder="0.75" className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none bg-card text-foreground" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">ΔG = Gov't Spending Change ($B)</label>
          <input type="number" value={deltaG}
            onChange={e => { setDeltaG(e.target.value); setGdpDone(false); setGdpAttempt(0); setGdpMsg(""); setGdpAnswer(""); setBothDone(false); }}
            placeholder="200" className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none bg-card text-foreground" />
        </div>
      </div>

      {validMpc && validG && (
        <div className="space-y-4">
          {/* Step 1: Calculate multiplier */}
          <div className="bg-card border-2 border-border rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">Step 1: What is the spending multiplier?</p>
            <p className="text-xs text-muted-foreground">MPC = {mpcVal.toFixed(2)} → Multiplier = 1 ÷ (1 − {mpcVal.toFixed(2)}) = ?</p>
            <div className="flex gap-2">
              <input type="number" step="0.01" value={multiplierAnswer}
                onChange={e => setMultiplierAnswer(e.target.value)}
                disabled={mpcDone}
                placeholder="Your answer" className="flex-1 border-2 border-border rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none bg-card text-foreground disabled:bg-muted" />
              {!mpcDone && (
                <button onClick={checkMultiplier} disabled={!multiplierAnswer}
                  className="px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl text-sm font-semibold transition">
                  Check
                </button>
              )}
            </div>
            {mpcMsg && (
              <p className={`text-xs font-medium ${mpcDone ? "text-green-700" : "text-amber-700"}`}>{mpcMsg}</p>
            )}
          </div>

          {/* Step 2: Calculate GDP impact */}
          {mpcDone && (
            <div className="bg-card border-2 border-border rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Step 2: By how much does GDP increase? ($B)</p>
              <p className="text-xs text-muted-foreground">ΔGDP = Multiplier × ΔG = {trueMultiplier} × ${gVal.toFixed(0)}B = ?</p>
              <div className="flex gap-2">
                <input type="number" value={gdpAnswer}
                  onChange={e => setGdpAnswer(e.target.value)}
                  disabled={gdpDone}
                  placeholder="Your answer" className="flex-1 border-2 border-border rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none bg-card text-foreground disabled:bg-muted" />
                {!gdpDone && (
                  <button onClick={checkGDP} disabled={!gdpAnswer}
                    className="px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl text-sm font-semibold transition">
                    Check
                  </button>
                )}
              </div>
              {gdpMsg && (
                <p className={`text-xs font-medium ${gdpDone ? "text-green-700" : "text-amber-700"}`}>{gdpMsg}</p>
              )}
            </div>
          )}

          {bothDone && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
              <p className="font-semibold">Summary</p>
              <p>MPC = {mpcVal.toFixed(2)} → Multiplier = {trueMultiplier}</p>
              <p>ΔG = ${gVal.toFixed(0)}B → ΔGDP = ${trueGDP?.toFixed(1)}B</p>
              <p className="mt-1 text-xs">A neoclassical economist would note: in the long run, flexible prices offset any GDP gain — the multiplier only works in the short run when wages/prices are sticky!</p>
            </div>
          )}
        </div>
      )}

      <button onClick={onComplete}
        disabled={!bothDone}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 4 — Phillips Curve Explorer
// ─────────────────────────────────────────────
function PhillipsStation({ onComplete }: { onComplete: () => void }) {
  const [era, setEra] = useState<"1960s" | "1970s" | "1980s+" | "all">("1960s");
  const [hovered, setHovered] = useState<(typeof PHILLIPS_DATA)[0] | null>(null);
  const [engaged, setEngaged] = useState(false);
  const svgW = 340, svgH = 260;
  const pad = { l: 44, r: 16, t: 16, b: 36 };

  const eraFilter: { [k: string]: (d: typeof PHILLIPS_DATA[0]) => boolean } = {
    "1960s": d => d.year >= 1960 && d.year <= 1969,
    "1970s": d => d.year >= 1970 && d.year <= 1979,
    "1980s+": d => d.year >= 1980,
    "all": () => true,
  };

  const uMin = 3, uMax = 11, infMin = -1, infMax = 15;
  function xScale(u: number) { return pad.l + ((u - uMin) / (uMax - uMin)) * (svgW - pad.l - pad.r); }
  function yScale(inf: number) { return pad.t + ((infMax - inf) / (infMax - infMin)) * (svgH - pad.t - pad.b); }

  const ERA_COLORS: { [k: string]: string } = {
    "1960s": "#6366f1",
    "1970s": "#ef4444",
    "1980s+": "#10b981",
    "all": "#94a3b8",
  };

  const eraInsights: { [k: string]: string } = {
    "1960s": "The classic Phillips Curve: as unemployment fell, inflation rose. Policy makers believed they could choose any point on this curve.",
    "1970s": "Stagflation! Both unemployment AND inflation rose together — shattering the stable tradeoff. Supply shocks (oil embargo 1973) and rising inflation expectations shifted the curve outward.",
    "1980s+": "The Fed's tight-money policy (Volcker shock) crushed inflation but spiked unemployment. By the 1990s–2000s, the curve appeared flat — the tradeoff had weakened dramatically.",
    "all": "Viewing all data: the clear downward slope of the 1960s vanishes over time. Each decade's data forms its own cluster, showing the curve shifts with inflation expectations.",
  };

  const filteredData = PHILLIPS_DATA.filter(eraFilter[era]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        The Phillips Curve plots unemployment vs. inflation. Explore how the relationship changed across decades — and why it broke down in the 1970s.
      </p>

      {/* Era selector */}
      <div className="flex gap-2 flex-wrap">
        {(["1960s", "1970s", "1980s+", "all"] as const).map(e => (
          <button key={e} onClick={() => { setEra(e); setEngaged(true); }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition ${era === e ? "border-current text-white" : "border-slate-200 text-muted-foreground bg-white"}`}
            style={era === e ? { backgroundColor: ERA_COLORS[e], borderColor: ERA_COLORS[e] } : {}}>
            {e === "all" ? "All Decades" : e}
          </button>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="bg-card rounded-xl border border-border p-2 relative overflow-x-auto">
        <svg width={svgW} height={svgH} style={{ display: "block", margin: "0 auto" }} role="img" aria-label="Interactive data chart. Use mouse to hover over data points for values.">
          {/* Grid */}
          {[0, 2, 4, 6, 8, 10, 12, 14].map(v => (
            <line key={v} x1={pad.l} x2={svgW - pad.r} y1={yScale(v)} y2={yScale(v)} stroke="#f1f5f9" strokeWidth="1" />
          ))}
          {[3, 5, 7, 9, 11].map(v => (
            <line key={v} x1={xScale(v)} x2={xScale(v)} y1={pad.t} y2={svgH - pad.b} stroke="#f1f5f9" strokeWidth="1" />
          ))}
          {/* Axes */}
          <line x1={pad.l} x2={svgW - pad.r} y1={svgH - pad.b} y2={svgH - pad.b} stroke="#94a3b8" strokeWidth="1.5" />
          <line x1={pad.l} x2={pad.l} y1={pad.t} y2={svgH - pad.b} stroke="#94a3b8" strokeWidth="1.5" />
          {/* Y zero line */}
          <line x1={pad.l} x2={svgW - pad.r} y1={yScale(0)} y2={yScale(0)} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />

          {/* Axis labels */}
          {[3, 5, 7, 9, 11].map(v => (
            <text key={v} x={xScale(v)} y={svgH - pad.b + 14} textAnchor="middle" fontSize="9" fill="#94a3b8">{v}%</text>
          ))}
          {[0, 4, 8, 12].map(v => (
            <text key={v} x={pad.l - 6} y={yScale(v) + 3} textAnchor="end" fontSize="9" fill="#94a3b8">{v}%</text>
          ))}
          <text x={(pad.l + svgW - pad.r) / 2} y={svgH - 2} textAnchor="middle" fontSize="9" fill="#64748b">Unemployment Rate</text>
          <text x={10} y={(pad.t + svgH - pad.b) / 2} textAnchor="middle" fontSize="9" fill="#64748b" transform={`rotate(-90, 10, ${(pad.t + svgH - pad.b) / 2})`}>Inflation Rate (CPI YoY)</text>

          {/* All dots (gray background) */}
          {era !== "all" && PHILLIPS_DATA.map(d => (
            <circle key={`bg-${d.year}`} cx={xScale(d.u)} cy={yScale(d.inf)} r={3} fill="#e2e8f0" />
          ))}

          {/* Highlighted era dots */}
          {filteredData.map(d => (
            <circle
              key={d.year}
              cx={xScale(d.u)} cy={yScale(d.inf)} r={5}
              fill={ERA_COLORS[era]}
              fillOpacity={0.85}
              stroke="white" strokeWidth="1.5"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(d)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}

          {/* Year labels for focused eras */}
          {era !== "all" && filteredData.map(d => (
            <text key={`lbl-${d.year}`} x={xScale(d.u) + 6} y={yScale(d.inf) - 4} fontSize="8" fill={ERA_COLORS[era]} fontWeight="600">
              {d.year}
            </text>
          ))}

          {/* Tooltip */}
          {hovered && (() => {
            const tx = xScale(hovered.u);
            const ty = yScale(hovered.inf);
            const boxW = 100, boxH = 44;
            const bx = tx + 10 + boxW > svgW ? tx - boxW - 10 : tx + 10;
            const by = ty - boxH / 2;
            return (
              <g>
                <rect x={bx} y={by} width={boxW} height={boxH} rx={5} fill="white" stroke="#e2e8f0" strokeWidth="1" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))" />
                <text x={bx + 8} y={by + 14} fontSize="10" fill="#1e293b" fontWeight="bold">{hovered.year}</text>
                <text x={bx + 8} y={by + 27} fontSize="9" fill="#64748b">U: {hovered.u.toFixed(1)}% | π: {hovered.inf.toFixed(1)}%</text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Era insight */}
      <div className={`p-3 rounded-xl text-sm border-l-4 ${era === "1970s" ? "border-red-400 bg-red-50 text-red-800" : era === "1960s" ? "border-indigo-400 bg-indigo-50 text-indigo-800" : era === "1980s+" ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-slate-300 bg-slate-50 text-foreground"}`}>
        {eraInsights[era]}
      </div>

      <button onClick={onComplete} disabled={!engaged}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 5 — Policy Toolkit Matcher
// ─────────────────────────────────────────────
const POLICY_SCENARIOS = [
  {
    id: 0,
    scenario: "The economy is in a deep recession. GDP is 6% below potential. Unemployment is at 9%.",
    label: "Recession",
    correct: "expansionary",
    tools: ["Cut income taxes to boost consumer spending", "Increase government spending on infrastructure", "Raise interest rates to cool the economy", "Reduce government transfer payments"],
    correctTools: [0, 1],
    explanation: "A recession calls for expansionary fiscal policy — tax cuts raise AD by boosting consumption; spending increases shift AD directly to the right.",
  },
  {
    id: 1,
    scenario: "The economy is overheating. GDP is 3% above potential. Inflation is running at 7%.",
    label: "Inflation",
    correct: "contractionary",
    tools: ["Increase government spending", "Raise taxes to reduce consumer spending", "Cut government programs and transfer payments", "Cut taxes to stimulate investment"],
    correctTools: [1, 2],
    explanation: "Above potential GDP, contractionary policy is needed. Tax hikes and spending cuts reduce AD, easing inflationary pressure.",
  },
  {
    id: 2,
    scenario: "The economy faces stagflation: both high unemployment (8%) and high inflation (10%).",
    label: "Stagflation",
    correct: "supply-side",
    tools: ["Large stimulus spending to reduce unemployment", "Address supply-side constraints (energy policy, deregulation)", "Raise taxes sharply to fight inflation", "Focus on long-run productivity growth rather than short-run fixes"],
    correctTools: [1, 3],
    explanation: "Stagflation is a supply shock — expansionary policy worsens inflation and contractionary policy worsens unemployment. Neoclassical economists recommend supply-side policies and patience.",
  },
  {
    id: 3,
    scenario: "The economy is near full employment but growing slowly. Investment is weak.",
    label: "Slow Growth",
    correct: "supply-side",
    tools: ["Massive deficit spending to push GDP above potential", "Investment tax credits and R&D incentives", "Reduce regulations that raise business costs", "Impose trade barriers to protect domestic industry"],
    correctTools: [1, 2],
    explanation: "Near full employment, supply-side policies support long-run growth without triggering inflation. Investment incentives and deregulation raise potential GDP.",
  },
];

function PolicyStation({ onComplete }: { onComplete: () => void }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedTools, setSelectedTools] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [engaged, setEngaged] = useState(false);

  const s = POLICY_SCENARIOS[currentScenario];

  function toggleTool(i: number) {
    if (submitted) return;
    setSelectedTools(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    setEngaged(true);
  }

  function submit() {
    const correct = s.correctTools.length === selectedTools.length &&
      s.correctTools.every(x => selectedTools.includes(x));
    setSubmitted(true);
    setScores(prev => [...prev, correct]);
  }

  function next() {
    if (currentScenario + 1 >= POLICY_SCENARIOS.length) {
      setDone(true);
    } else {
      setCurrentScenario(c => c + 1);
      setSelectedTools([]);
      setSubmitted(false);
    }
  }

  if (done) {
    const total = scores.filter(Boolean).length;
    return (
      <div className="max-w-xl mx-auto text-center space-y-4 py-6">
        <div className="text-5xl">🎯</div>
        <h3 className="text-xl font-bold text-foreground">Policy Toolkit Complete!</h3>
        <p className="text-muted-foreground">You matched <span className="font-bold text-primary">{total} / {POLICY_SCENARIOS.length}</span> scenarios correctly.</p>
        <div className="flex justify-center gap-2">
          {scores.map((r, i) => (
            <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold ${r ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {POLICY_SCENARIOS[i].label} {r ? "✓" : "✗"}
            </span>
          ))}
        </div>
        <button onClick={onComplete} className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">
          Mark Complete ✓
        </button>
      </div>
    );
  }

  const labelColor: { [k: string]: string } = {
    "Recession": "bg-blue-100 text-blue-700",
    "Inflation": "bg-red-100 text-red-700",
    "Stagflation": "bg-amber-100 text-amber-700",
    "Slow Growth": "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex justify-between text-xs text-muted-foreground/60">
        <span>Scenario {currentScenario + 1} of {POLICY_SCENARIOS.length}</span>
        <span>Select the 2 correct policy tools</span>
      </div>

      <div className="bg-muted rounded-xl p-4">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full mr-2 ${labelColor[s.label]}`}>{s.label}</span>
        <p className="mt-2 font-semibold text-foreground text-sm leading-snug">{s.scenario}</p>
      </div>

      <div className="space-y-2">
        {s.tools.map((tool, i) => {
          const isSel = selectedTools.includes(i);
          const isCorrect = s.correctTools.includes(i);
          let cls = "w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition ";
          if (!submitted) {
            cls += isSel ? "border-primary bg-primary/10 text-foreground font-medium" : "border-slate-200 bg-white hover:border-primary/40 text-foreground";
          } else {
            if (isCorrect) cls += "border-green-500 bg-green-50 text-green-800 font-medium";
            else if (isSel) cls += "border-red-400 bg-red-50 text-red-700";
            else cls += "border-border bg-card text-muted-foreground";
          }
          return (
            <button key={i} className={cls} onClick={() => toggleTool(i)} disabled={submitted}>
              {submitted && isCorrect ? "✓ " : submitted && isSel && !isCorrect ? "✗ " : ""}{tool}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
          <span className="font-semibold">{scores[scores.length - 1] ? "✓ Correct! " : "Not quite. "}</span>
          {s.explanation}
        </div>
      )}

      {!submitted ? (
        <button onClick={submit} disabled={selectedTools.length !== 2}
          className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
          Submit Answer
        </button>
      ) : (
        <button onClick={next} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">
          {currentScenario + 1 < POLICY_SCENARIOS.length ? "Next Scenario →" : "See Results"}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 6 — Keynesian vs. Neoclassical Verdict
// ─────────────────────────────────────────────
const VERDICT_SCENARIOS = [
  {
    id: 0,
    policy: "The government increases spending by $500B during a recession to shift AD to the right.",
    keynesian: true,
    neoclassical: false,
    explanation: "Keynesians endorse this — AD stimulus works in the short run when wages are sticky. Neoclassicals argue it crowds out private investment and only raises prices in the long run.",
  },
  {
    id: 1,
    policy: "The central bank targets a low, stable inflation rate and avoids using monetary policy to fine-tune employment.",
    keynesian: false,
    neoclassical: true,
    explanation: "Neoclassicals favor rules-based, stable policy over discretionary intervention. Keynesians believe active monetary policy can stabilize employment in the short run.",
  },
  {
    id: 2,
    policy: "Congress cuts the capital gains tax to encourage business investment and long-run economic growth.",
    keynesian: false,
    neoclassical: true,
    explanation: "Neoclassicals emphasize supply-side policies — incentivizing investment raises potential GDP. Keynesians focus more on demand-side tools for short-run stabilization.",
  },
  {
    id: 3,
    policy: "During a recession, the government sends $1,200 stimulus checks to all households.",
    keynesian: true,
    neoclassical: false,
    explanation: "Keynesians endorse direct income transfers to boost consumption and AD in the short run. Neoclassicals worry about crowding out and argue consumers may save the checks (Ricardian equivalence), neutralizing the effect.",
  },
];

function VerdictStation({ onComplete }: { onComplete: () => void }) {
  const [answers, setAnswers] = useState<{ [id: number]: "keynesian" | "neoclassical" | "both" | null }>({});
  const [revealed, setRevealed] = useState<{ [id: number]: boolean }>({});
  const [engaged, setEngaged] = useState(false);
  const [allDone, setAllDone] = useState(false);

  function answer(id: number, choice: "keynesian" | "neoclassical" | "both") {
    setAnswers(prev => ({ ...prev, [id]: choice }));
    setEngaged(true);
  }

  function reveal(id: number) {
    setRevealed(prev => ({ ...prev, [id]: true }));
    if (Object.keys({ ...revealed, [id]: true }).length === VERDICT_SCENARIOS.length) {
      setAllDone(true);
    }
  }

  const correctAnswer = (s: typeof VERDICT_SCENARIOS[0]) => {
    if (s.keynesian && !s.neoclassical) return "keynesian";
    if (!s.keynesian && s.neoclassical) return "neoclassical";
    return "both";
  };

  const allAnswered = VERDICT_SCENARIOS.every(s => answers[s.id] != null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        For each policy, decide which school of thought would endorse it — Keynesian, Neoclassical, or both.
        Then reveal the verdict to check your reasoning.
      </p>

      {VERDICT_SCENARIOS.map(s => {
        const ca = correctAnswer(s);
        const userAns = answers[s.id];
        const isRevealed = !!revealed[s.id];
        const isCorrect = userAns === ca;

        return (
          <div key={s.id} className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-foreground leading-snug">📋 {s.policy}</p>
            <div className="flex gap-2 flex-wrap">
              {(["keynesian", "neoclassical", "both"] as const).map(choice => (
                <button key={choice} onClick={() => answer(s.id, choice)}
                  disabled={isRevealed}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition capitalize ${userAns === choice ? (isRevealed ? (isCorrect ? "border-green-500 bg-green-100 text-green-800" : "border-red-400 bg-red-100 text-red-700") : "border-primary bg-primary/15 text-foreground") : "border-border bg-muted text-muted-foreground hover:border-primary/40"}`}>
                  {choice === "keynesian" ? "🔵 Keynesian" : choice === "neoclassical" ? "🟢 Neoclassical" : "⚪ Both"}
                </button>
              ))}
            </div>
            {userAns && !isRevealed && (
              <button onClick={() => reveal(s.id)}
                className="text-xs px-3 py-1.5 bg-muted hover:bg-accent text-muted-foreground rounded-lg font-medium transition">
                Reveal Verdict
              </button>
            )}
            {isRevealed && (
              <div className={`p-2.5 rounded-lg text-xs border-l-4 ${isCorrect ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-green-800" : "border-amber-400 bg-amber-50 text-amber-800"}`}>
                <span className="font-semibold">{isCorrect ? "✓ Correct! " : `✗ The answer is ${ca.charAt(0).toUpperCase() + ca.slice(1)}. `}</span>
                {s.explanation}
              </div>
            )}
          </div>
        );
      })}

      <button onClick={onComplete} disabled={!allAnswered || !Object.keys(revealed).length}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 7 — Reading the Data (FRED: U + CPI)
// ─────────────────────────────────────────────
const FRED_U_ANNUAL: [number, number][] = PHILLIPS_DATA.map(d => [d.year, d.u]);
const FRED_INF_ANNUAL: [number, number][] = PHILLIPS_DATA.map(d => [d.year, d.inf]);

function FredChartStation({ onComplete }: { onComplete: () => void }) {
  const [showInf, setShowInf] = useState(true);
  const [showU, setShowU] = useState(true);
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const [engaged, setEngaged] = useState(false);
  const svgW = 340, svgH = 220;
  const pad = { l: 40, r: 16, t: 16, b: 32 };

  const years = FRED_U_ANNUAL.map(d => d[0]);
  const yMin = -2, yMax = 16;
  function xScale(yr: number) { return pad.l + ((yr - years[0]) / (years[years.length - 1] - years[0])) * (svgW - pad.l - pad.r); }
  function yScale(v: number) { return pad.t + ((yMax - v) / (yMax - yMin)) * (svgH - pad.t - pad.b); }

  function makePath(data: [number, number][]) {
    return data.map((d, i) => `${i === 0 ? "M" : "L"}${xScale(d[0]).toFixed(1)},${yScale(d[1]).toFixed(1)}`).join(" ");
  }

  const hData = hoverYear !== null ? {
    u: FRED_U_ANNUAL.find(d => d[0] === hoverYear)?.[1],
    inf: FRED_INF_ANNUAL.find(d => d[0] === hoverYear)?.[1],
  } : null;

  const annotations = [
    { year: 1973, label: "Oil shock", y: 13 },
    { year: 1982, label: "Volcker recession", y: 15 },
    { year: 2009, label: "Financial crisis", y: 15 },
    { year: 2022, label: "Post-COVID inflation", y: 10 },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        This chart shows U.S. unemployment and inflation from 1960–2023. Look for periods when the Phillips Curve tradeoff held — and when it broke down.
      </p>

      {/* Toggles */}
      <div className="flex gap-3">
        <button onClick={() => { setShowU(s => !s); setEngaged(true); }}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition ${showU ? "border-blue-500 bg-blue-100 text-blue-700" : "border-border bg-card text-muted-foreground"}`}>
          {showU ? "● " : "○ "}Unemployment
        </button>
        <button onClick={() => { setShowInf(s => !s); setEngaged(true); }}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition ${showInf ? "border-red-500 bg-red-100 text-red-700" : "border-border bg-card text-muted-foreground"}`}>
          {showInf ? "● " : "○ "}Inflation (CPI YoY)
        </button>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-2 relative overflow-x-auto"
        onMouseLeave={() => setHoverYear(null)}>
        <svg width={svgW} height={svgH} style={{ display: "block", margin: "0 auto" }}
          role="img" aria-label="Interactive chart — hover to explore data points"
          onMouseMove={e => {
            const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const yr = Math.round(years[0] + ((mx - pad.l) / (svgW - pad.l - pad.r)) * (years[years.length - 1] - years[0]));
            if (yr >= years[0] && yr <= years[years.length - 1]) { setHoverYear(yr); setEngaged(true); }
          }}>
          {/* Grid */}
          {[0, 4, 8, 12].map(v => (
            <line key={v} x1={pad.l} x2={svgW - pad.r} y1={yScale(v)} y2={yScale(v)} stroke="#f1f5f9" strokeWidth="1" />
          ))}
          <line x1={pad.l} x2={svgW - pad.r} y1={yScale(0)} y2={yScale(0)} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />
          {/* Axes */}
          <line x1={pad.l} x2={svgW - pad.r} y1={svgH - pad.b} y2={svgH - pad.b} stroke="#94a3b8" strokeWidth="1.5" />
          <line x1={pad.l} x2={pad.l} y1={pad.t} y2={svgH - pad.b} stroke="#94a3b8" strokeWidth="1.5" />
          {/* Y labels */}
          {[0, 4, 8, 12].map(v => (
            <text key={v} x={pad.l - 4} y={yScale(v) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">{v}%</text>
          ))}
          {/* X labels */}
          {[1960, 1970, 1980, 1990, 2000, 2010, 2020].map(yr => (
            <text key={yr} x={xScale(yr)} y={svgH - pad.b + 12} textAnchor="middle" fontSize="8" fill="#94a3b8">{yr}</text>
          ))}

          {/* Annotation lines */}
          {annotations.map(a => (
            <g key={a.year}>
              <line x1={xScale(a.year)} x2={xScale(a.year)} y1={pad.t} y2={svgH - pad.b} stroke="#fca5a5" strokeWidth="1" strokeDasharray="3,3" />
              <text x={xScale(a.year) + 2} y={yScale(a.y)} fontSize="7" fill="#ef4444" fontStyle="italic">{a.label}</text>
            </g>
          ))}

          {/* Lines */}
          {showU && <path d={makePath(FRED_U_ANNUAL)} fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinejoin="round" />}
          {showInf && <path d={makePath(FRED_INF_ANNUAL)} fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinejoin="round" />}

          {/* Hover line */}
          {hoverYear !== null && (
            <line x1={xScale(hoverYear)} x2={xScale(hoverYear)} y1={pad.t} y2={svgH - pad.b} stroke="#6366f1" strokeWidth="1" strokeDasharray="2,2" />
          )}

          {/* Tooltip */}
          {hoverYear !== null && hData && (hData.u !== undefined || hData.inf !== undefined) && (() => {
            const tx = xScale(hoverYear);
            const boxW = 110, boxH = showU && showInf ? 54 : 36;
            const bx = tx > svgW / 2 ? tx - boxW - 8 : tx + 8;
            const by = pad.t;
            return (
              <g>
                <rect x={bx} y={by} width={boxW} height={boxH} rx={5} fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x={bx + 8} y={by + 14} fontSize="10" fill="#1e293b" fontWeight="bold">{hoverYear}</text>
                {showU && hData.u !== undefined && <text x={bx + 8} y={by + 27} fontSize="9" fill="#3b82f6">Unemployment: {hData.u.toFixed(1)}%</text>}
                {showInf && hData.inf !== undefined && <text x={bx + 8} y={by + (showU ? 40 : 27)} fontSize="9" fill="#ef4444">Inflation: {hData.inf.toFixed(1)}%</text>}
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { title: "1960s Pattern", body: "U and inflation moved in opposite directions — the classic Phillips Curve tradeoff." },
          { title: "1970s Breakdown", body: "Both rose simultaneously (stagflation), disproving a stable long-run tradeoff." },
          { title: "1980s Disinflation", body: "Volcker's tight money crushed inflation but drove U above 10% — a painful short-run tradeoff." },
          { title: "2010s Puzzle", body: "Ultra-low U (3.5%) with near-zero inflation — the flat Phillips Curve era." },
        ].map((c, i) => (
          <div key={i} className="bg-muted rounded-xl p-3">
            <p className="text-xs font-semibold text-foreground mb-0.5">{c.title}</p>
            <p className="text-xs text-muted-foreground leading-snug">{c.body}</p>
          </div>
        ))}
      </div>

      <button onClick={onComplete} disabled={!engaged}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Quiz Station (10 Qs, Q9 + Q10 multi-select)
// ─────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    q: "In the Keynesian model, a recession is primarily caused by:",
    opts: ["A leftward shift in aggregate supply", "A leftward shift in aggregate demand", "An increase in potential GDP", "Flexible wages adjusting too quickly"],
    correct: 1,
    exp: "Keynesians view recessions as primarily AD-driven — falling consumption, investment, or government spending shifts AD left.",
  },
  {
    q: "The expenditure multiplier is calculated as:",
    opts: ["1 × MPC", "MPC ÷ (1 − MPS)", "1 ÷ (1 − MPC)", "MPS ÷ MPC"],
    correct: 2,
    exp: "The spending multiplier = 1 ÷ (1 − MPC). A higher MPC means more re-spending and a larger multiplier.",
  },
  {
    q: "If MPC = 0.8 and the government increases spending by $100B, the total change in GDP is:",
    opts: ["$100B", "$200B", "$400B", "$500B"],
    correct: 3,
    exp: "Multiplier = 1 ÷ (1 − 0.8) = 5. ΔGDP = 5 × $100B = $500B.",
  },
  {
    q: "The Keynesian short-run Phillips Curve suggests:",
    opts: ["Higher unemployment always causes higher inflation", "Lower unemployment is associated with higher inflation", "There is no relationship between unemployment and inflation", "The tradeoff is permanent and stable"],
    correct: 1,
    exp: "The downward-sloping Phillips Curve implies lower unemployment (tight labor markets) raises wages and prices — higher inflation.",
  },
  {
    q: "The neoclassical long-run aggregate supply (LRAS) curve is:",
    opts: ["Downward sloping, like AD", "Upward sloping", "Horizontal at the price level target", "Vertical at potential GDP"],
    correct: 3,
    exp: "The LRAS is vertical — in the long run, flexible prices restore the economy to potential GDP regardless of the price level.",
  },
  {
    q: "The 1970s stagflation is best explained by:",
    opts: ["A large rightward shift in AD", "Rising animal spirits boosting consumer confidence", "Negative supply shocks (oil embargo) shifting AS left while AD remained high", "Government spending cuts reducing output"],
    correct: 2,
    exp: "OPEC oil embargoes and supply disruptions shifted AS left, raising prices and unemployment simultaneously — disproving the stable Phillips Curve.",
  },
  {
    q: "A neoclassical economist responding to a mild recession is most likely to recommend:",
    opts: ["Large deficit spending to restore full employment immediately", "Allowing the economy to self-correct through price and wage flexibility", "Cutting interest rates aggressively to stimulate AD", "Hiring millions of government workers"],
    correct: 1,
    exp: "Neoclassicals believe the economy returns to potential GDP on its own through flexible prices — active intervention is unnecessary and may worsen outcomes.",
  },
  {
    q: "Sticky wages, according to Keynesians, explain why:",
    opts: ["Inflation accelerates in booms", "Unemployment falls during expansions", "Recessions produce unemployment rather than quick wage cuts", "Long-run growth is supply-determined"],
    correct: 2,
    exp: "When wages don't fall quickly in response to falling demand, firms cut workers instead of wages — producing cyclical unemployment.",
  },
  {
    q: "Which of the following are KEYNESIAN policy recommendations? (Select all that apply)",
    opts: [
      "Increase government spending during recessions",
      "Cut taxes to raise consumer disposable income",
      "Focus exclusively on long-run growth and avoid short-run intervention",
      "Use fiscal stimulus to shift AD right",
    ],
    correct: [0, 1, 3],
    multi: true,
    exp: "Keynesians advocate fiscal stimulus (spending increases, tax cuts) to shift AD right. Focusing only on long-run growth is the neoclassical preference.",
  },
  {
    q: "Which of the following observations would cause a NEOCLASSICAL economist to be skeptical of fiscal policy? (Select all that apply)",
    opts: [
      "Policy lags mean stimulus often arrives after the recession has already ended",
      "Rational consumers may save stimulus checks rather than spend them (Ricardian equivalence)",
      "The expenditure multiplier only works if wages are sticky",
      "GDP responds instantly to any change in aggregate demand",
    ],
    correct: [0, 1, 2],
    multi: true,
    exp: "Neoclassicals cite policy lags, Ricardian equivalence, and the stickiness condition — all reasons why Keynesian demand management may be ineffective in practice.",
  },
];


function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOptions(opts: string[], correct: number | number[]): { opts: string[]; correct: number | number[] } {
  const indices = opts.map((_, i) => i);
  const shuffledIdx = shuffle(indices);
  const newOpts = shuffledIdx.map(i => opts[i]);
  if (Array.isArray(correct)) {
    const newCorrect = (correct as number[]).map(c => shuffledIdx.indexOf(c));
    return { opts: newOpts, correct: newCorrect };
  } else {
    return { opts: newOpts, correct: shuffledIdx.indexOf(correct as number) };
  }
}


function QuizStation({ onPass, onFail }: {
  onPass: (r: { correct: boolean; exp: string }[]) => void;
  onFail: (r: { correct: boolean; exp: string }[]) => void;
}) {
  const [questions] = useState(() =>
    shuffle(QUIZ_QUESTIONS).map(q => {
      const { opts, correct } = shuffleOptions(q.opts, q.correct);
      return { ...q, opts, correct };
    })
  );
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; exp: string }[]>([]);

  const q = questions[cur];
  const isMulti = !!q.multi;

  function toggle(i: number) {
    if (submitted) return;
    setSel(prev => isMulti ? (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]) : [i]);
  }

  function isCorrectNow() {
    return isMulti
      ? (q.correct as number[]).length === sel.length && (q.correct as number[]).every(x => sel.includes(x))
      : sel[0] === q.correct;
  }

  function submit() {
    if (!sel.length) return;
    setSubmitted(true);
    setResults(prev => [...prev, { correct: isCorrectNow(), exp: q.exp }]);
  }

  function next() {
    if (cur + 1 >= questions.length) {
      const final = [...results];
      if (final.filter(r => r.correct).length >= 9) onPass(final);
      else onFail(final);
    } else {
      setCur(c => c + 1); setSel([]); setSubmitted(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(cur / questions.length) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{cur+1} / {questions.length}</span>
      </div>
      <div className="bg-muted rounded-xl p-4">
        <p className="font-semibold text-foreground leading-snug">{q.q}</p>
        {isMulti && <p className="text-xs text-primary mt-1">Select all that apply</p>}
      </div>
      <div className="space-y-2">
        {q.opts.map((opt, i) => {
          const isSel = sel.includes(i);
          const isCorrect = isMulti ? (q.correct as number[]).includes(i) : q.correct === i;
          let cls = "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ";
          if (!submitted) cls += isSel ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card hover:border-primary/40 text-foreground";
          else if (isCorrect) cls += "border-green-500 bg-green-50 text-green-800";
          else if (isSel) cls += "border-red-400 bg-red-50 text-red-700";
          else cls += "border-border bg-card text-muted-foreground";
          return <button key={i} className={cls} onClick={() => toggle(i)} disabled={submitted}>{isMulti ? (isSel ? "☑ " : "☐ ") : ""}{opt}</button>;
        })}
      </div>
      {submitted && <div role="alert" aria-live="polite" className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm text-foreground"><span className="font-semibold">{isCorrectNow() ? "✓ Correct! " : "✗ Not quite. "}</span>{q.exp}</div>}
      {!submitted
        ? <button onClick={submit} disabled={!sel.length} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">Submit Answer</button>
        : <button onClick={next} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">{cur+1 < questions.length ? "Next Question →" : "See Results"}</button>}
    </div>
  );
}
// ─────────────────────────────────────────────
// Not Yet Screen
// ─────────────────────────────────────────────
function NotYetScreen({ score, onRetry }: { score: number; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#fef3c7" }}>
      <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-4">
        <div className="text-5xl">📖</div>
        <h2 className="text-2xl font-bold text-amber-700">Not Yet</h2>
        <p className="text-muted-foreground">You scored <span className="font-bold">{score}/10</span>. Mastery requires 9 out of 10 correct.</p>
        <p className="text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-xl p-3">
          This screen cannot be submitted. Only the final Results screen counts.
        </p>
        <p className="text-sm text-muted-foreground">Review the stations, then try the quiz again.</p>
        <button onClick={onRetry} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2">
          <RotateCcw size={16} /> Try Again
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Results Screen
// ─────────────────────────────────────────────
function ResultsScreen({ results, onRestart }: { results: { correct: boolean; exp: string }[]; onRestart: () => void }) {
  const [exitTicket, setExitTicket] = useState("");
  const [studentName, setStudentName] = useState("");
  const score = results.filter(r => r.correct).length;
  // Mark lab complete in localStorage for Hub tracking
  if (typeof window !== 'undefined') { try { localStorage.setItem('econlab_done_ch1213', 'true'); } catch(e) {} }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-bold text-foreground">Lab Complete!</h2>
          <p className="text-muted-foreground">Chapter 12 & 13</p>
          <div className="inline-block bg-primary/15 text-primary-foreground px-6 py-2 rounded-full text-xl font-bold mt-2">
            {score} / 10
          </div>
        </div>

        {/* Question review */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground text-sm">Question Review</h3>
          {results.map((r, i) => (
            <div key={i} className={`p-3 rounded-xl text-sm border-l-4 ${r.correct ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20" : "border-red-400 bg-red-50"}`}>
              <div className="flex items-start gap-2">
                <span className="font-bold text-xs mt-0.5">{r.correct ? "✓" : "✗"}</span>
                <div>
                  <span className="font-semibold text-foreground">Q{i + 1}: </span>
                  <span className="text-muted-foreground">{r.exp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Exit ticket */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground block">
            Exit Ticket: In your own words, what is the main difference between Keynesian and Neoclassical views on how the economy responds to a recession?
          </label>
          <textarea
            value={exitTicket}
            onChange={e => setExitTicket(e.target.value)}
            rows={4}
            className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none bg-card text-foreground resize-none"
            placeholder="Write your reflection here..."
          />
        </div>

        <div className="text-center text-xs text-muted-foreground/60 bg-muted rounded-xl p-3">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1">Your Name (required for submission)</label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="First and Last Name"
                className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none"
              />
            </div>
                      <button
            onClick={() => {
              if (!studentName.trim()) { alert("Please enter your name before printing."); return; }
              const items = results.map((r, i) => '<p style="border-left:4px solid ' + (r.correct ? '#16a34a' : '#dc2626') + ';background:' + (r.correct ? '#f0fdf4' : '#fef2f2') + ';padding:6px 10px;margin:3px 0;font-size:12px"><b>Q' + (i+1) + ' ' + (r.correct ? '✓' : '✗') + ':</b> ' + r.exp + '</p>').join('');
              const html = '<html><head><title>ECO 210 ECONLAB</title><style>body{font-family:Arial,sans-serif;padding:20px;max-width:680px;margin:0 auto}@media print{button{display:none}}</style></head><body>'
                + '<h2 style="margin:0">ECO 210 ECONLAB - Lab Complete</h2>'
                + '<p style="color:#475569;margin:2px 0">Chapter 12+13: Keynesian and Neoclassical</p>'
                + '<p style="font-size:22px;font-weight:bold;background:#1e2d4a;color:white;display:inline-block;padding:4px 16px;border-radius:99px;margin:8px 0">' + score + ' / 10</p>'
                + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
                + '<h3 style="font-size:13px;margin:0 0 6px">Question Review</h3>' + items
                + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
                + '<p style="font-size:13px"><b>Exit Ticket:</b></p><p style="border:1px solid #ccc;padding:8px;border-radius:4px;font-size:13px;min-height:40px">' + (exitTicket || '') + '</p>'
                + '<p style="font-size:13px;margin-top:12px"><b>Student Name:</b></p><p style="border:1px solid #000;padding:8px;border-radius:4px;font-size:14px;font-weight:bold">' + studentName + '</p>'
                + '<p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:16px;padding-top:8px">ECO 210 - Printed ' + new Date().toLocaleDateString() + ' - Submit this PDF to Brightspace</p>'
                + '</body></html>';
              const w = window.open('', '_blank', 'width=820,height=900');
              if (w) { w.document.write(html); w.document.close(); w.focus(); setTimeout(function(){ w.print(); }, 600); }
            }}
            className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            🖨️ Print / Save as PDF <span className="sr-only">(opens print dialog in new window)</span>
          </button>
            <p className="text-xs text-muted-foreground text-center bg-muted rounded-xl p-3">In the print dialog, choose "Save as PDF" and submit the file to Brightspace.</p>
          </div>
        </div>

        <button onClick={onRestart} className="w-full py-2.5 bg-muted hover:bg-accent text-muted-foreground rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
          <RotateCcw size={14} /> Start Over
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Intro / Dashboard
// ─────────────────────────────────────────────
function IntroStation({
  completed,
  onSelect,
  quizUnlocked,
  onStartQuiz,
}: {
  completed: Set<Station>;
  onSelect: (s: Station) => void;
  quizUnlocked: boolean;
  onStartQuiz: () => void;
}) {
  const [showSummary, setShowSummary] = useState(false);

  const stations: { id: Station; label: string; desc: string; icon: string }[] = [
    { id: "recap", label: "📚 Ch11 Recap", desc: "Start here — 5 review questions on AD-AS", icon: "📚" },
    { id: "wages", label: "⚖️ Sticky vs. Flexible Wages", desc: "Sort Keynesian and Neoclassical statements", icon: "⚖️" },
    { id: "multiplier", label: "✖️ Multiplier Calculator", desc: "Calculate the spending multiplier and GDP impact", icon: "✖️" },
    { id: "phillips", label: "📉 Phillips Curve Explorer", desc: "Track inflation vs. unemployment across decades", icon: "📉" },
    { id: "policy", label: "🎯 Policy Toolkit Matcher", desc: "Match recession/inflation scenarios to policies", icon: "🎯" },
    { id: "verdict", label: "⚖️ Keynesian vs. Neoclassical Verdict", desc: "Identify which school endorses each policy", icon: "⚖️" },
    { id: "fredchart", label: "📊 Reading the Data", desc: "FRED: unemployment & inflation overlay 1960–2023", icon: "📊" },
  ];

  const completedCount = stations.filter(s => completed.has(s.id)).length;
  const totalStations = stations.length;

  return (
    <div className="max-w-2xl mx-auto">
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}

      {/* Title */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wide mb-4">Chapter 12 & 13</span>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Keynesian & Neoclassical Analysis</h1>
        <p className="text-muted-foreground text-base">Two Schools of Thought — Recessions, Policy, and the Phillips Curve</p>
      </div>

      {/* Key Idea */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4 text-sm text-foreground">
        💡 <strong>Key idea:</strong> Keynesians believe recessions are driven by falling demand and require active government intervention. Neoclassicals trust flexible prices to self-correct in the long run. Understanding both is the foundation of modern macroeconomic policy debate. Complete all 7 stations in any order, then take the quiz.
      </div>

      {/* Chapter Summary link */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted border border-border mb-6">
        <div className="flex items-center gap-2">
          <span className="text-base">📄</span>
          <span className="text-sm text-foreground">Need a refresher? View the chapter summary.</span>
        </div>
        <button onClick={() => setShowSummary(true)}
          className="text-xs px-3 py-1.5 rounded-lg bg-card border border-border text-primary font-semibold hover:bg-accent transition-all shrink-0">
          Open Summary
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-muted rounded-full h-1.5">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(completedCount / totalStations) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{completedCount}/{totalStations} complete</span>
      </div>

        {/* Station grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {stations.map(s => {
            const done = completed.has(s.id);
            return (
              <button key={s.id} onClick={() => onSelect(s.id)}
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

        {/* Quiz button */}
        {quizUnlocked ? (
          <button onClick={onStartQuiz}
            className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-base transition flex items-center justify-center gap-2">
            <Award size={20} /> Take the Quiz
          </button>
        ) : (
          <div className="w-full py-4 bg-muted text-muted-foreground/60 rounded-xl font-bold text-base text-center">
            🔒 Quiz — Complete all stations to unlock
          </div>
        )}
    </div>
  );
}
// ─────────────────────────────────────────────
// Header with breadcrumb trail
// ─────────────────────────────────────────────
function Header({ station, onStation, completed }: { station: Station; onStation: (s: Station) => void; completed: Set<Station> }) {
  const stations: { id: Station; label: string }[] = [
    { id: "intro", label: "Dashboard" },
    { id: "recap", label: "Ch11 Recap" },
    { id: "wages", label: "Wages" },
    { id: "multiplier", label: "Multiplier" },
    { id: "phillips", label: "Phillips Curve" },
    { id: "policy", label: "Policy Toolkit" },
    { id: "verdict", label: "Verdict" },
    { id: "fredchart", label: "Data" },
    { id: "quiz", label: "Quiz" },
  ];
  const CONTENT_STATIONS: Station[] = ["recap", "wages", "multiplier", "phillips", "policy", "verdict", "fredchart"];
  const allDone = CONTENT_STATIONS.every(s => completed.has(s));
  const stationOrder: Station[] = ["intro","recap","wages","multiplier","phillips","policy","verdict","fredchart","quiz","results","not-yet"];
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
            <div className="font-display font-semibold text-sm leading-none text-sidebar-foreground">ECO 210 ECONLAB</div>
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 12 & 13</div>
          </div>
        </div>

        {/* Back to Hub */}
        <a href="https://www.perplexity.ai/computer/a/eco-210-econlab-course-hub-JgrfOPjHQ5iSYovw19FfIg" target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-sidebar-foreground/80 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-sidebar-accent shrink-0">
          ← Course Hub <span className="sr-only">(opens in new tab)</span>
        </a>
        <div className="hidden sm:flex items-center gap-1 flex-wrap">
          {stations.map((s) => {
            const idx = stationOrder.indexOf(s.id);
            const done = idx < currentIdx;
            const active = s.id === station;
            if (s.id === "quiz" && !allDone) {
              return <span key={s.id} title="Complete all stations first" className="px-3 py-1.5 rounded-full text-xs font-medium text-sidebar-foreground/35 cursor-not-allowed select-none">🔒 {s.label}</span>;
            }
            return (
              <button key={s.id} onClick={() => onStation(s.id)}
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
  const [completed, setCompleted] = useState<Set<Station>>(new Set());
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const CONTENT_STATIONS: Station[] = ["recap", "wages", "multiplier", "phillips", "policy", "verdict", "fredchart"];
  const quizUnlocked = CONTENT_STATIONS.every(s => completed.has(s));

  function scrollTop() { contentRef.current?.scrollTo({ top: 0, behavior: "smooth" }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function go(s: Station) { setStation(s); scrollTop(); }

  function markComplete(s: Station) {
    setCompleted(prev => new Set([...prev, s]));
    go("intro");
  }

  function handleQuizPass(results: { correct: boolean; exp: string }[]) {
    setQuizResults(results);
    setQuizScore(results.filter(r => r.correct).length);
    go("results");
  }

  function restart() {
    setCompleted(new Set());
    setQuizResults([]);
    setQuizScore(0);
    go("intro");
  }

  if (station === "results") return <ResultsScreen results={quizResults} onRestart={restart} />;
  if (station === "not-yet") return <NotYetScreen score={quizScore} onRetry={() => { setQuizResults([]); go("quiz"); }} />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <Header station={station} onStation={go} completed={completed} />
      <main id="main-content" ref={contentRef} className="flex-1 px-4 py-8">
        {station === "intro" && (
          <IntroStation
            completed={completed}
            onSelect={go}
            quizUnlocked={quizUnlocked}
            onStartQuiz={() => go("quiz")}
          />
        )}
        {station === "recap" && <RecapStation onComplete={() => markComplete("recap")} />}
        {station === "wages" && <WagesStation onComplete={() => markComplete("wages")} />}
        {station === "multiplier" && <MultiplierStation onComplete={() => markComplete("multiplier")} />}
        {station === "phillips" && <PhillipsStation onComplete={() => markComplete("phillips")} />}
        {station === "policy" && <PolicyStation onComplete={() => markComplete("policy")} />}
        {station === "verdict" && <VerdictStation onComplete={() => markComplete("verdict")} />}
        {station === "fredchart" && <FredChartStation onComplete={() => markComplete("fredchart")} />}
        {station === "quiz" && (
          <QuizStation onPass={handleQuizPass} onFail={(results) => {
            setQuizResults(results);
            setQuizScore(results.filter(r => r.correct).length);
            go("not-yet");
          }} />
        )}
      </main>
    </div>
  );
}
