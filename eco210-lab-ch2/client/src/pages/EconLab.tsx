import { useState, useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station =
  | "intro"
  | "budget"
  | "oppcost"
  | "margin"
  | "ppf"
  | "comparative"
  | "posnorm"
  | "quiz"
  | "results"
  | "not-yet";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────
// Summary Modal
// ─────────────────────────────────────────────
const CH2_SUMMARY = [
  {
    heading: "2.1 How Individuals Make Choices Based on Their Budget Constraint",
    body: "Consumers face a budget constraint — a limit on their spending based on income and prices. Every choice along the budget line involves a trade-off. The slope of the budget line equals the opportunity cost of one good in terms of the other. For Alphonso with $10 and burgers at $2 and bus tickets at $0.50, every burger costs 4 bus tickets in opportunity cost.",
  },
  {
    heading: "2.2 The Production Possibilities Frontier and Social Choices",
    body: "The Production Possibilities Frontier (PPF) shows the maximum combinations of two goods a society can produce with its available resources and technology. Points on the PPF are productively efficient; points inside are inefficient; points outside are unattainable. The PPF curves outward (is concave) due to the law of increasing opportunity cost — resources are not perfectly adaptable between uses.",
  },
  {
    heading: "2.3 Confronting Objections to the Economic Approach",
    body: "Two common objections to economics: (1) People don't actually calculate like this — but models describe patterns, not calculations; the basketball pass analogy shows that experts act optimally without explicitly computing. (2) People shouldn't be self-interested — but positive economics describes behavior, not prescribes it; self-interest can include altruism. Economists distinguish positive statements (factual) from normative statements (value judgments).",
  },
  {
    heading: "Key Concepts",
    body: "Opportunity Cost: the value of the next-best alternative forgone. Sunk Cost: a past cost that cannot be recovered — should be ignored in future decisions. Marginal Analysis: decisions made at the margin by comparing marginal benefit to marginal cost. Law of Diminishing Marginal Utility: each additional unit of a good provides less satisfaction than the previous one. Comparative Advantage: a country (or person) should specialize in what they produce at the lowest opportunity cost.",
  },
];

function SummaryModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-title"
    >
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2
            id="summary-title"
            className="font-display font-bold text-base text-foreground"
          >
            Chapter 2 Summary
          </h2>
          <button
            onClick={onClose}
            ref={closeRef}
          className="text-muted-foreground hover:text-foreground text-2xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          aria-label="Close summary dialog"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {CH2_SUMMARY.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="text-sm font-semibold text-foreground mb-1">
                {s.heading}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-2">
            Access for free at{" "}
            <a
              href="https://openstax.org/books/principles-macroeconomics-3e/pages/1-introduction"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              https://openstax.org/books/principles-macroeconomics-3e/pages/1-introduction
            </a>
          </p>
        </div>
        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            Close &amp; Return to Lab
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 1 — Budget Constraint Explorer
// ─────────────────────────────────────────────
function BudgetStation({ onComplete }: { onComplete: () => void }) {
  const BUDGET = 10;
  const BURGER_PRICE = 2;
  const TICKET_PRICE = 0.5;
  const MAX_BURGERS = Math.floor(BUDGET / BURGER_PRICE); // 5

  const [burgers, setBurgers] = useState(2);
  const tickets = Math.floor((BUDGET - burgers * BURGER_PRICE) / TICKET_PRICE);
  const spent = burgers * BURGER_PRICE + tickets * TICKET_PRICE;
  const onBudget = Math.abs(spent - BUDGET) < 0.01;

  // Quiz questions at bottom
  const [q1, setQ1] = useState<number | null>(null);
  const [q1Checked, setQ1Checked] = useState(false);
  const [q2, setQ2] = useState<number | null>(null);
  const [q2Checked, setQ2Checked] = useState(false);
  const [q3, setQ3] = useState<number | null>(null);
  const [q3Checked, setQ3Checked] = useState(false);
  const allDone = q1Checked && q2Checked && q3Checked;

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Concept card */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">Budget Constraint</p>
        <p className="text-muted-foreground text-xs">
          Alphonso has <strong>$10/week</strong> to spend on burgers ($2 each)
          and bus tickets ($0.50 each). Every dollar spent on burgers is a
          dollar not spent on bus tickets — that's the trade-off.
        </p>
      </div>

      {/* Interactive slider */}
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-4">
        <p className="text-sm font-semibold text-foreground">
          Adjust Alphonso's Choices
        </p>
        <div>
          <label htmlFor="burger-slider" className="text-xs text-muted-foreground font-medium block mb-1">
            Burgers per week: <strong className="text-foreground">{burgers}</strong>
          </label>
          <input
            id="burger-slider"
            type="range"
            min={0}
            max={MAX_BURGERS}
            step={1}
            value={burgers}
            onChange={(e) => setBurgers(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
            <span>0</span>
            <span>{MAX_BURGERS}</span>
          </div>
        </div>

        {/* Results display */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-2xl font-bold text-amber-700">{burgers}</p>
            <p className="text-xs text-amber-600 mt-0.5">Burgers</p>
            <p className="text-xs text-amber-500">${(burgers * BURGER_PRICE).toFixed(2)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-2xl font-bold text-blue-700">{tickets}</p>
            <p className="text-xs text-blue-600 mt-0.5">Bus Tickets</p>
            <p className="text-xs text-blue-500">${(tickets * TICKET_PRICE).toFixed(2)}</p>
          </div>
          <div className={`border rounded-lg p-3 ${onBudget ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <p className={`text-2xl font-bold ${onBudget ? "text-green-700" : "text-red-700"}`}>${spent.toFixed(2)}</p>
            <p className={`text-xs mt-0.5 ${onBudget ? "text-green-600" : "text-red-600"}`}>
              {onBudget ? "On Budget ✓" : "Over Budget!"}
            </p>
            <p className={`text-xs ${onBudget ? "text-green-500" : "text-red-500"}`}>of $10.00</p>
          </div>
        </div>

        {/* Trade-off insight */}
        <div className="bg-muted rounded-lg p-3 text-xs text-muted-foreground">
          <p>
            <strong className="text-foreground">Trade-off: </strong>
            Every 1 burger you add costs you{" "}
            <strong className="text-primary">4 bus tickets</strong>{" "}
            (because $2 ÷ $0.50 = 4). This 4-to-1 ratio is the{" "}
            <strong className="text-foreground">opportunity cost</strong> of a
            burger.
          </p>
        </div>
      </div>

      {/* Check-in questions */}
      <p className="text-sm font-semibold text-foreground">Check Your Understanding</p>

      {/* Q1 */}
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">
          If Alphonso buys 3 burgers, how many bus tickets can he afford?
        </p>
        <div className="space-y-2">
          {["4", "8", "14", "20"].map((opt, oi) => {
            let cls = "border-border text-foreground";
            if (q1Checked) {
              if (oi === 1) cls = "border-green-500 bg-green-50 text-green-800 font-semibold";
              else if (oi === q1) cls = "border-red-400 bg-red-50 text-red-700";
              else cls = "border-border text-muted-foreground opacity-50";
            } else if (q1 === oi) cls = "border-primary bg-primary/10 text-primary font-semibold";
            return (
              <button
                key={oi}
                type="button"
                disabled={q1Checked}
                onClick={() => setQ1(oi)}
                aria-pressed={q1 === oi}
                className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cls} ${!q1Checked ? "hover:border-primary/40" : ""}`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
        {q1Checked && (
          <p className={`text-xs font-medium ${q1 === 1 ? "text-green-700" : "text-amber-700"}`}>
            {q1 === 1 ? "✓ Correct! " : "✗ Not quite. "}
            3 burgers × $2 = $6. Remaining: $10 − $6 = $4. At $0.50 each, $4 ÷ $0.50 = <strong>8 bus tickets</strong>.
          </p>
        )}
        {!q1Checked && (
          <button
            onClick={() => setQ1Checked(true)}
            disabled={q1 === null}
            className="w-full py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            Check Answer
          </button>
        )}
      </div>

      {/* Q2 */}
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">
          What is the opportunity cost of 1 burger in terms of bus tickets?
        </p>
        <div className="space-y-2">
          {["1 bus ticket", "2 bus tickets", "4 bus tickets", "10 bus tickets"].map((opt, oi) => {
            let cls = "border-border text-foreground";
            if (q2Checked) {
              if (oi === 2) cls = "border-green-500 bg-green-50 text-green-800 font-semibold";
              else if (oi === q2) cls = "border-red-400 bg-red-50 text-red-700";
              else cls = "border-border text-muted-foreground opacity-50";
            } else if (q2 === oi) cls = "border-primary bg-primary/10 text-primary font-semibold";
            return (
              <button
                key={oi}
                type="button"
                disabled={q2Checked}
                onClick={() => setQ2(oi)}
                aria-pressed={q2 === oi}
                className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cls} ${!q2Checked ? "hover:border-primary/40" : ""}`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
        {q2Checked && (
          <p className={`text-xs font-medium ${q2 === 2 ? "text-green-700" : "text-amber-700"}`}>
            {q2 === 2 ? "✓ Correct! " : "✗ Not quite. "}
            $2 burger ÷ $0.50 ticket = <strong>4 bus tickets</strong>. For every burger you add, you give up 4 bus tickets.
          </p>
        )}
        {!q2Checked && (
          <button
            onClick={() => setQ2Checked(true)}
            disabled={q2 === null}
            className="w-full py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            Check Answer
          </button>
        )}
      </div>

      {/* Q3 */}
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">
          Alphonso decides to spend all $10 on bus tickets only. How many can he buy?
        </p>
        <div className="space-y-2">
          {["5", "10", "15", "20"].map((opt, oi) => {
            let cls = "border-border text-foreground";
            if (q3Checked) {
              if (oi === 3) cls = "border-green-500 bg-green-50 text-green-800 font-semibold";
              else if (oi === q3) cls = "border-red-400 bg-red-50 text-red-700";
              else cls = "border-border text-muted-foreground opacity-50";
            } else if (q3 === oi) cls = "border-primary bg-primary/10 text-primary font-semibold";
            return (
              <button
                key={oi}
                type="button"
                disabled={q3Checked}
                onClick={() => setQ3(oi)}
                aria-pressed={q3 === oi}
                className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cls} ${!q3Checked ? "hover:border-primary/40" : ""}`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
        {q3Checked && (
          <p className={`text-xs font-medium ${q3 === 3 ? "text-green-700" : "text-amber-700"}`}>
            {q3 === 3 ? "✓ Correct! " : "✗ Not quite. "}
            $10 ÷ $0.50 = <strong>20 bus tickets</strong>. This is the maximum-ticket endpoint of Alphonso's budget constraint.
          </p>
        )}
        {!q3Checked && (
          <button
            onClick={() => setQ3Checked(true)}
            disabled={q3 === null}
            className="w-full py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            Check Answer
          </button>
        )}
      </div>

      {allDone && (
        <button
          type="button"
          onClick={onComplete}
          className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          Mark Complete ✓
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 2 — Opportunity Cost & Sunk Cost
// ─────────────────────────────────────────────
const OPP_SCENARIOS = [
  {
    id: 1,
    title: "The College Decision",
    scenario:
      "Maria is deciding whether to attend college full-time. Annual tuition is $12,000. She currently works full-time earning $35,000/year. If she goes to college, she will quit her job.",
    question: "What is the TRUE economic cost (opportunity cost) of attending college for one year?",
    options: [
      "$12,000 (tuition only)",
      "$35,000 (lost wages only)",
      "$47,000 (tuition + lost wages)",
      "$0 — education is an investment, not a cost",
    ],
    correct: 2,
    exp: "The full opportunity cost includes BOTH the direct cost (tuition: $12,000) AND the forgone alternative (lost wages: $35,000) = $47,000. This is why economists say college is more expensive than just tuition.",
  },
  {
    id: 2,
    title: "The Sunk Cost Trap",
    scenario:
      "Selena spent $15 on a movie ticket. After 30 minutes, she realizes the movie is terrible. She is miserable watching it.",
    question: "What should Selena do?",
    options: [
      "Stay — she already paid $15 and should get her money's worth",
      "Leave — the $15 is gone regardless; future time is what matters now",
      "Ask for a refund since she is unhappy",
      "Stay only if the movie gets better in the next 10 minutes",
    ],
    correct: 1,
    exp: "The $15 is a sunk cost — it's gone whether she stays or leaves. The rational decision ignores sunk costs and focuses only on future costs and benefits. If leaving gives more enjoyment than staying, she should leave.",
  },
  {
    id: 3,
    title: "The Airport Delay",
    scenario:
      "U.S. airport delays cost passengers an estimated $8 billion per year in lost time. This estimate counts the value of hours passengers spend waiting.",
    question: "What economic concept does the $8 billion figure represent?",
    options: [
      "Nominal GDP cost of delays",
      "The direct ticket price increases caused by delays",
      "The opportunity cost of time — what passengers could have done instead",
      "The fiscal policy cost to the government",
    ],
    correct: 2,
    exp: "The $8 billion is the opportunity cost of time — the value of what passengers could have been doing (working, spending time with family, etc.) instead of waiting. Time has economic value even when no money changes hands.",
  },
  {
    id: 4,
    title: "The Daily Lunch",
    scenario:
      "You spend $8 on lunch every workday (250 days/year). A friend points out this costs $2,000/year — money that could fund a vacation.",
    question: "Your friend is making an argument based on which economic concept?",
    options: [
      "Sunk cost — the money is already spent",
      "Opportunity cost — the vacation is what you give up each year",
      "Marginal cost — each lunch adds only $8",
      "Comparative advantage — restaurants make lunch more efficiently",
    ],
    correct: 1,
    exp: "Your friend is highlighting the opportunity cost: by choosing to buy $8 lunches daily, you forgo $2,000/year that could fund a vacation. The same dollars could have been used differently — that foregone alternative is the opportunity cost.",
  },
];

function OppCostStation({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = OPP_SCENARIOS[idx];

  function check() {
    setChecked(true);
    if (sel === q.correct) setScore((s) => s + 1);
  }

  function next() {
    if (idx + 1 < OPP_SCENARIOS.length) {
      setIdx(idx + 1);
      setSel(null);
      setChecked(false);
    } else {
      setDone(true);
    }
  }

  if (done)
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-green-800">
            You got {score}/{OPP_SCENARIOS.length} correct
          </p>
          <p className="text-sm text-green-700 mt-1">
            {score === OPP_SCENARIOS.length
              ? "Perfect — you understand opportunity cost and sunk costs."
              : "Key rule: Opportunity cost = the next-best alternative forgone. Sunk costs are gone — never let them drive future decisions."}
          </p>
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          Mark Complete ✓
        </button>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">Opportunity Cost & Sunk Costs</p>
        <p className="text-muted-foreground text-xs">
          <strong>Opportunity cost</strong> = the value of the next-best
          alternative you give up.{" "}
          <strong>Sunk cost</strong> = a past cost already paid that cannot be
          recovered — ignore it in future decisions.
        </p>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span aria-live="polite" aria-atomic="true">
          Scenario {idx + 1} of {OPP_SCENARIOS.length}
        </span>
        <div className="flex gap-1" role="img" aria-label={`Progress: scenario ${idx + 1} of ${OPP_SCENARIOS.length}`}>
          {OPP_SCENARIOS.map((_, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={`w-2.5 h-2.5 rounded-full ${i < idx ? "bg-green-500" : i === idx ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>
      <div className="bg-card border-2 border-border rounded-xl p-4">
        <p className="text-xs font-semibold text-primary mb-1">{q.title}</p>
        <p className="text-xs text-muted-foreground italic mb-3">{q.scenario}</p>
        <p className="text-sm font-semibold text-foreground mb-3">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, oi) => {
            let cls = "border-border text-foreground";
            if (checked) {
              if (oi === q.correct)
                cls = "border-green-500 bg-green-50 text-green-800 font-semibold";
              else if (oi === sel)
                cls = "border-red-400 bg-red-50 text-red-700";
              else cls = "border-border text-muted-foreground opacity-50";
            } else if (sel === oi)
              cls = "border-primary bg-primary/10 text-primary font-semibold";
            return (
              <button
                key={oi}
                type="button"
                disabled={checked}
                onClick={() => setSel(oi)}
                aria-pressed={sel === oi}
                className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cls} ${!checked ? "hover:border-primary/40" : ""}`}
              >
                {checked && oi === q.correct && <span className="mr-1" aria-hidden="true">✓</span>}
                {checked && oi === sel && oi !== q.correct && <span className="mr-1" aria-hidden="true">✗</span>}
                <span className="font-bold mr-2">
                  {String.fromCharCode(65 + oi)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>
        {checked && (
          <p
            className={`mt-3 text-xs font-medium ${sel === q.correct ? "text-green-700" : "text-amber-700"}`}
          >
            {sel === q.correct ? "✓ Correct! " : "✗ Not quite. "}
            {q.exp}
          </p>
        )}
      </div>
      {!checked ? (
        <button
          type="button"
          onClick={check}
          disabled={sel === null}
          className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          Check Answer
        </button>
      ) : (
        <button
          type="button"
          onClick={next}
          className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          {idx + 1 < OPP_SCENARIOS.length ? "Next Scenario →" : "See Results"}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 3 — Thinking at the Margin
// ─────────────────────────────────────────────
const MARGIN_DECISIONS = [
  {
    id: 1,
    title: "The Midnight Episode",
    setup:
      "It's midnight. You have an 8 AM exam tomorrow. You've watched 3 episodes of your favorite show tonight. Should you watch one more?",
    mb: "Another hour of entertainment and relaxation",
    mc: "One hour of sleep lost + reduced exam performance",
    question: "Thinking at the margin, you should watch one more episode if:",
    options: [
      "You already watched 3 episodes so one more won't matter",
      "The marginal benefit of that episode exceeds the marginal cost to your exam",
      "You paid for the streaming subscription, so you should get your money's worth",
      "You can always catch up on sleep later",
    ],
    correct: 1,
    exp: "The rational rule: do one more unit only if marginal benefit > marginal cost. The 3 episodes already watched are irrelevant (sunk). And paying for streaming is a sunk cost too. Only compare the benefit of that one extra episode to its real cost.",
  },
  {
    id: 2,
    title: "The Cake Pop",
    setup:
      "You're at a café and considering buying a cake pop for $3. You just finished a satisfying meal and aren't very hungry.",
    mb: "Some enjoyment — but you're already full",
    mc: "$3 you could spend on something else",
    question: "According to marginal analysis, you should buy the cake pop if:",
    options: [
      "The price is only $3 — it's cheap enough to always buy",
      "You haven't had dessert yet today",
      "The additional satisfaction from the cake pop is worth at least $3 to you right now",
      "You usually like cake pops",
    ],
    correct: 2,
    exp: "Marginal analysis compares marginal benefit (your enjoyment right now, having just eaten) to marginal cost ($3). Because you're already full, the marginal utility is lower than usual — the right answer depends on whether that reduced satisfaction still equals $3 to you.",
  },
  {
    id: 3,
    title: "The Extra Work Shift",
    setup:
      "Alphonso works part-time and was offered an extra shift on Saturday. The shift pays $60. But Saturday is also the only free day he has this week — he planned to rest and spend time with family.",
    mb: "$60 in wages",
    mc: "Loss of rest + family time on his only free day",
    question: "Alphonso should accept the shift if:",
    options: [
      "He needs money — more work is always better",
      "He's already working part-time so one more shift is easy",
      "The $60 is worth more to him than the rest and family time he gives up",
      "His employer asked, so he should say yes",
    ],
    correct: 2,
    exp: "This is a classic marginal decision: compare the marginal benefit ($60) to the marginal cost (foregone rest and family time). If the money matters more to him right now, accept. If that Saturday's rest matters more, decline. There's no universal right answer — it depends on his preferences.",
  },
  {
    id: 4,
    title: "Diminishing Marginal Utility",
    setup:
      "You're hungry and eating slices of pizza. The 1st slice is amazing. The 2nd is very good. The 3rd is fine. The 4th makes you uncomfortable. The 5th sounds awful.",
    mb: "Decreasing with each additional slice",
    mc: "Roughly constant per slice (same price, same calories)",
    question: "This scenario illustrates which economic principle?",
    options: [
      "Comparative advantage — you prefer pizza over other foods",
      "The law of diminishing marginal utility — each additional unit gives less satisfaction than the previous",
      "Sunk cost — you already paid for all 5 slices",
      "Productive efficiency — eating quickly is optimal",
    ],
    correct: 1,
    exp: "The law of diminishing marginal utility: as you consume more of a good, each additional unit provides less additional satisfaction (utility). This is why we don't eat the same thing forever, and why variety matters. It also explains downward-sloping demand curves.",
  },
];

function MarginStation({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = MARGIN_DECISIONS[idx];

  function check() {
    setChecked(true);
    if (sel === q.correct) setScore((s) => s + 1);
  }

  function next() {
    if (idx + 1 < MARGIN_DECISIONS.length) {
      setIdx(idx + 1);
      setSel(null);
      setChecked(false);
    } else {
      setDone(true);
    }
  }

  if (done)
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-green-800">
            {score}/{MARGIN_DECISIONS.length} correct
          </p>
          <p className="text-sm text-green-700 mt-1">
            Key rule: always compare{" "}
            <strong>marginal benefit vs. marginal cost</strong>. Past costs are
            irrelevant. And remember: more isn't always better — diminishing
            marginal utility means satisfaction eventually falls.
          </p>
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          Mark Complete ✓
        </button>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">Thinking at the Margin</p>
        <p className="text-muted-foreground text-xs">
          Economists assume people make decisions by comparing{" "}
          <strong>marginal benefit</strong> (extra gain from one more unit) to{" "}
          <strong>marginal cost</strong> (extra cost of one more unit). Do one
          more only if MB ≥ MC.
        </p>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Decision {idx + 1} of {MARGIN_DECISIONS.length}
        </span>
        <div className="flex gap-1">
          {MARGIN_DECISIONS.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${i < idx ? "bg-green-500" : i === idx ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>
      <div className="bg-card border-2 border-border rounded-xl p-4">
        <p className="text-xs font-semibold text-primary mb-1">{q.title}</p>
        <p className="text-xs text-muted-foreground italic mb-3">{q.setup}</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
            <p className="text-xs font-semibold text-green-700 mb-0.5">
              Marginal Benefit
            </p>
            <p className="text-xs text-green-600">{q.mb}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-2">
            <p className="text-xs font-semibold text-red-700 mb-0.5">
              Marginal Cost
            </p>
            <p className="text-xs text-red-600">{q.mc}</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-foreground mb-3">
          {q.question}
        </p>
        <div className="space-y-2">
          {q.options.map((opt, oi) => {
            let cls = "border-border text-foreground";
            if (checked) {
              if (oi === q.correct)
                cls = "border-green-500 bg-green-50 text-green-800 font-semibold";
              else if (oi === sel)
                cls = "border-red-400 bg-red-50 text-red-700";
              else cls = "border-border text-muted-foreground opacity-50";
            } else if (sel === oi)
              cls = "border-primary bg-primary/10 text-primary font-semibold";
            return (
              <button
                key={oi}
                type="button"
                disabled={checked}
                onClick={() => setSel(oi)}
                aria-pressed={sel === oi}
                className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cls} ${!checked ? "hover:border-primary/40" : ""}`}
              >
                {checked && oi === q.correct && <span className="mr-1" aria-hidden="true">✓</span>}
                {checked && oi === sel && oi !== q.correct && <span className="mr-1" aria-hidden="true">✗</span>}
                <span className="font-bold mr-2">
                  {String.fromCharCode(65 + oi)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>
        {checked && (
          <p
            className={`mt-3 text-xs font-medium ${sel === q.correct ? "text-green-700" : "text-amber-700"}`}
          >
            {sel === q.correct ? "✓ Correct! " : "✗ Not quite. "}
            {q.exp}
          </p>
        )}
      </div>
      {!checked ? (
        <button
          type="button"
          onClick={check}
          disabled={sel === null}
          className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          Check Answer
        </button>
      ) : (
        <button
          type="button"
          onClick={next}
          className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          {idx + 1 < MARGIN_DECISIONS.length ? "Next Decision →" : "See Results"}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 4 — PPF Builder (Interactive)
// ─────────────────────────────────────────────
// PPF: Healthcare (x-axis 0–100) vs Education (y-axis 0–100)
// Curve: approximated as y = 100 * sqrt(1 - (x/100)^2)
// Points on curve are efficient; inside = inefficient; outside = unattainable

const PPF_POINTS = [
  { id: "A", x: 0,  y: 100, type: "on",      label: "A (0, 100)" },
  { id: "B", x: 50, y: 87,  type: "on",      label: "B (50, 87)" },
  { id: "C", x: 80, y: 60,  type: "on",      label: "C (80, 60)" },
  { id: "D", x: 100,y: 0,   type: "on",      label: "D (100, 0)" },
  { id: "E", x: 40, y: 50,  type: "inside",  label: "E (40, 50)" },
  { id: "F", x: 70, y: 80,  type: "outside", label: "F (70, 80)" },
  { id: "G", x: 30, y: 95,  type: "outside", label: "G (30, 95)" },
  { id: "H", x: 60, y: 40,  type: "inside",  label: "H (60, 40)" },
];

const PPF_QUESTIONS = [
  {
    q: "Which point(s) represent PRODUCTIVE EFFICIENCY — the economy is using all resources fully?",
    correct: ["A", "B", "C", "D"],
    multi: true,
    exp: "Points A, B, C, and D all lie ON the PPF curve. Any point on the PPF represents productive efficiency — the economy cannot produce more of one good without producing less of the other.",
  },
  {
    q: "Which point(s) are INSIDE the PPF — representing inefficiency or unused resources?",
    correct: ["E", "H"],
    multi: true,
    exp: "Points E and H are inside the PPF. These represent productive inefficiency — the economy has idle resources or is using them poorly. During a recession, for example, the economy operates inside its PPF.",
  },
  {
    q: "Which point(s) are OUTSIDE the PPF — currently unattainable with existing resources and technology?",
    correct: ["F", "G"],
    multi: true,
    exp: "Points F and G are outside the PPF — they are unattainable given current resources and technology. Only technological improvement or resource growth can shift the PPF outward to make these points reachable.",
  },
  {
    q: "Moving from Point A (0 healthcare, 100 education) to Point B (50 healthcare, 87 education), then to Point C (80 healthcare, 60 education) — what happens to the opportunity cost of adding healthcare?",
    correct: ["increasing"],
    multi: false,
    exp: "The opportunity cost of healthcare is increasing. From A to B: 50 units of healthcare cost 13 units of education. From B to C: 30 more units of healthcare cost 27 units of education. Each additional unit of healthcare requires giving up more and more education — this is the law of increasing opportunity cost, which is why the PPF curves outward.",
  },
];

function PPFStation({ onComplete }: { onComplete: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // For the last question (non-point), use a separate answer
  const [lastAns, setLastAns] = useState<string | null>(null);

  const q = PPF_QUESTIONS[qIdx];
  const isLastQ = qIdx === PPF_QUESTIONS.length - 1;

  // Draw SVG PPF curve
  const svgW = 280, svgH = 220;
  const pad = 30;
  function toSvg(x: number, y: number) {
    return {
      cx: pad + (x / 100) * (svgW - 2 * pad),
      cy: svgH - pad - (y / 100) * (svgH - 2 * pad),
    };
  }

  // Build curve path
  const curvePts: string[] = [];
  for (let x = 0; x <= 100; x += 2) {
    const y = 100 * Math.sqrt(1 - (x / 100) ** 2);
    const { cx, cy } = toSvg(x, y);
    curvePts.push(`${cx},${cy}`);
  }
  const curveD = "M " + curvePts.join(" L ");

  function togglePoint(id: string) {
    if (checked) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function checkAnswer() {
    setChecked(true);
    if (isLastQ) {
      if (lastAns === "increasing") setScore((s) => s + 1);
    } else {
      const correct = new Set(q.correct);
      const isCorrect =
        selected.size === correct.size &&
        [...selected].every((id) => correct.has(id));
      if (isCorrect) setScore((s) => s + 1);
    }
  }

  function next() {
    if (qIdx + 1 < PPF_QUESTIONS.length) {
      setQIdx(qIdx + 1);
      setSelected(new Set());
      setLastAns(null);
      setChecked(false);
    } else {
      setDone(true);
    }
  }

  if (done)
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-green-800">
            {score}/{PPF_QUESTIONS.length} correct
          </p>
          <p className="text-sm text-green-700 mt-1">
            The PPF shows the maximum combinations a society can produce.
            Points on the curve = productive efficiency. Inside = waste.
            Outside = currently impossible. The curved shape reflects
            increasing opportunity cost.
          </p>
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          Mark Complete ✓
        </button>
      </div>
    );

  const isCorrectAnswer = checked
    ? isLastQ
      ? lastAns === "increasing"
      : selected.size === new Set(q.correct).size &&
        [...selected].every((id) => new Set(q.correct).has(id))
    : false;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">Production Possibilities Frontier (PPF)</p>
        <p className="text-muted-foreground text-xs">
          Society must choose how to allocate limited resources between two
          goods — here, <strong>Healthcare</strong> and{" "}
          <strong>Education</strong>. The curved frontier shows all efficient
          combinations.
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span aria-live="polite" aria-atomic="true">
          Question {qIdx + 1} of {PPF_QUESTIONS.length}
        </span>
        <div className="flex gap-1" role="img" aria-label={`Progress: question ${qIdx + 1} of ${PPF_QUESTIONS.length}`}>
          {PPF_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${i < qIdx ? "bg-green-500" : i === qIdx ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      {/* SVG PPF diagram */}
      <div className="bg-card border-2 border-border rounded-xl p-3">
        <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} className="overflow-visible" role="img" aria-label="Production Possibilities Frontier diagram showing points on, inside, and outside the curve">
          <title>Production Possibilities Frontier — Healthcare vs Education</title>
          {/* Axes */}
          <line x1={pad} y1={svgH - pad} x2={svgW - pad + 5} y2={svgH - pad} stroke="#94a3b8" strokeWidth="1.5" />
          <line x1={pad} y1={pad - 5} x2={pad} y2={svgH - pad} stroke="#94a3b8" strokeWidth="1.5" />
          {/* Axis labels */}
          <text x={svgW / 2} y={svgH - 4} textAnchor="middle" fontSize="9" fill="#64748b">Healthcare (%)</text>
          <text x={10} y={svgH / 2} textAnchor="middle" fontSize="9" fill="#64748b" transform={`rotate(-90, 10, ${svgH / 2})`}>Education (%)</text>
          {/* PPF curve */}
          <polyline points={curvePts.join(" ")} fill="none" stroke="hsl(222, 42%, 35%)" strokeWidth="2" strokeLinecap="round" />
          {/* Points */}
          {PPF_POINTS.map((pt) => {
            const { cx, cy } = toSvg(pt.x, pt.y);
            const isSelected = selected.has(pt.id);
            const isCorrectPt = checked && q.correct.includes(pt.id);
            const isWrongPt = checked && isSelected && !q.correct.includes(pt.id);
            let fill = pt.type === "on" ? "hsl(222,42%,40%)" : pt.type === "inside" ? "#f59e0b" : "#ef4444";
            if (isCorrectPt) fill = "#22c55e";
            if (isWrongPt) fill = "#ef4444";
            const stroke = isSelected ? (checked ? (isCorrectPt ? "#16a34a" : "#dc2626") : "hsl(38,95%,50%)") : "white";
            return (
              <g key={pt.id}
                onClick={() => !isLastQ && togglePoint(pt.id)}
                onKeyDown={(e) => { if (!isLastQ && (e.key === " " || e.key === "Enter")) { e.preventDefault(); togglePoint(pt.id); } }}
                tabIndex={isLastQ ? -1 : 0}
                role={isLastQ ? undefined : "checkbox"}
                aria-checked={isLastQ ? undefined : isSelected}
                aria-label={isLastQ ? undefined : `Point ${pt.id}: ${pt.type === "on" ? "on the PPF (efficient)" : pt.type === "inside" ? "inside the PPF (inefficient)" : "outside the PPF (unattainable)"}`}
                style={{ cursor: isLastQ ? "default" : "pointer", outline: "none" }}
              >
                <circle cx={cx} cy={cy} r={isSelected ? 8 : 6} fill={fill} stroke={stroke} strokeWidth={isSelected ? 2.5 : 1.5} />
                <text x={cx + 10} y={cy + 4} fontSize="9" fill="#334155" fontWeight="bold" aria-hidden="true">{pt.id}</text>
              </g>
            );
          })}
          {/* Legend */}
          <circle cx={pad + 5} cy={14} r={4} fill="hsl(222,42%,40%)" />
          <text x={pad + 12} y={18} fontSize="7.5" fill="#475569">On PPF (Efficient)</text>
          <circle cx={pad + 80} cy={14} r={4} fill="#f59e0b" />
          <text x={pad + 87} y={18} fontSize="7.5" fill="#475569">Inside (Inefficient)</text>
          <circle cx={pad + 165} cy={14} r={4} fill="#ef4444" />
          <text x={pad + 172} y={18} fontSize="7.5" fill="#475569">Outside (Unattainable)</text>
        </svg>
        {!isLastQ && (
          <p className="text-xs text-muted-foreground text-center mt-1">
            Tap points to select/deselect. Select all that apply.
          </p>
        )}
      </div>

      {/* Question */}
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">{q.q}</p>
        {isLastQ ? (
          <div className="space-y-2">
            {["increasing", "decreasing", "constant", "zero"].map((opt) => {
              let cls = "border-border text-foreground";
              if (checked) {
                if (opt === "increasing") cls = "border-green-500 bg-green-50 text-green-800 font-semibold";
                else if (opt === lastAns) cls = "border-red-400 bg-red-50 text-red-700";
                else cls = "border-border text-muted-foreground opacity-50";
              } else if (lastAns === opt) cls = "border-primary bg-primary/10 text-primary font-semibold";
              const labels: Record<string, string> = { increasing: "Increasing", decreasing: "Decreasing", constant: "Constant", zero: "Zero" };
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={checked}
                  onClick={() => setLastAns(opt)}
                  aria-pressed={lastAns === opt}
                  className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cls} ${!checked ? "hover:border-primary/40" : ""}`}
                >
                  {labels[opt]}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {selected.size === 0
              ? "Select point(s) on the diagram above."
              : `Selected: ${[...selected].sort().join(", ")}`}
          </p>
        )}
        {checked && (
          <p
            className={`text-xs font-medium ${isCorrectAnswer ? "text-green-700" : "text-amber-700"}`}
          >
            {isCorrectAnswer ? "✓ Correct! " : "✗ Not quite. "}
            {q.exp}
          </p>
        )}
      </div>

      {!checked ? (
        <button
          onClick={checkAnswer}
          disabled={isLastQ ? lastAns === null : selected.size === 0}
          className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition"
        >
          Check Answer
        </button>
      ) : (
        <button
          type="button"
          onClick={next}
          className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          {qIdx + 1 < PPF_QUESTIONS.length ? "Next Question →" : "See Results"}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 5 — Comparative Advantage
// ─────────────────────────────────────────────
// US and Brazil production data (hours to produce 1 unit)
// US: 1 unit wheat = 1 hr, 1 unit sugar = 4 hrs
// Brazil: 1 unit wheat = 5 hrs, 1 unit sugar = 2 hrs
// US OC of wheat = 1/4 sugar; US OC of sugar = 4 wheat
// Brazil OC of wheat = 5/2 sugar; Brazil OC of sugar = 2/5 wheat
// → US has comparative advantage in wheat (lower OC: 1/4 < 5/2)
// → Brazil has comparative advantage in sugar (lower OC: 2/5 < 4)

const COMP_ADV_STEPS = [
  {
    step: 1,
    title: "Read the Production Data",
    desc: "The table shows how many hours each country needs to produce 1 unit of each good.",
    question: "Which country is MORE efficient at producing wheat (takes fewer hours)?",
    options: ["United States (1 hour)", "Brazil (5 hours)", "Both are equally efficient", "Neither — they should both produce sugar"],
    correct: 0,
    exp: "The US produces wheat in 1 hour vs. Brazil's 5 hours — so the US has an absolute advantage in wheat. But absolute advantage doesn't determine comparative advantage. We need to look at opportunity costs.",
  },
  {
    step: 2,
    title: "Calculate US Opportunity Costs",
    desc: "The US spends 1 hour on wheat OR 4 hours on sugar. So the US can produce: 1 unit of wheat OR (1/4) of a unit of sugar in 1 hour.",
    question: "What is the opportunity cost of 1 unit of WHEAT for the United States?",
    options: ["4 units of sugar", "1/4 unit of sugar", "1 unit of sugar", "5 units of sugar"],
    correct: 1,
    exp: "To produce 1 unit of wheat takes the US 1 hour. In that same 1 hour, the US could produce 1/4 unit of sugar (since sugar takes 4 hours). So the opportunity cost of 1 wheat = 1/4 sugar. The US gives up very little sugar to make wheat.",
  },
  {
    step: 3,
    title: "Calculate Brazil's Opportunity Costs",
    desc: "Brazil spends 5 hours on wheat OR 2 hours on sugar. So to produce 1 wheat, Brazil gives up 5/2 = 2.5 units of sugar.",
    question: "What is the opportunity cost of 1 unit of WHEAT for Brazil?",
    options: ["2 units of sugar", "1/2 unit of sugar", "2.5 units of sugar", "5 units of sugar"],
    correct: 2,
    exp: "Brazil takes 5 hours for wheat. In 5 hours, Brazil could make 5/2 = 2.5 units of sugar (since sugar takes 2 hours each). So the opportunity cost of 1 wheat in Brazil = 2.5 sugar — much higher than the US (1/4 sugar).",
  },
  {
    step: 4,
    title: "Determine Comparative Advantage",
    desc: "US wheat OC: 1/4 sugar. Brazil wheat OC: 2.5 sugar. US sugar OC: 4 wheat. Brazil sugar OC: 2/5 wheat.",
    question: "Which country has comparative advantage in each good?",
    options: [
      "US in both wheat and sugar",
      "Brazil in both wheat and sugar",
      "US in wheat, Brazil in sugar",
      "US in sugar, Brazil in wheat",
    ],
    correct: 2,
    exp: "The US has a lower opportunity cost for wheat (1/4 sugar vs. Brazil's 2.5 sugar) → US has comparative advantage in wheat. Brazil has a lower opportunity cost for sugar (2/5 wheat vs. US's 4 wheat) → Brazil has comparative advantage in sugar. Each should specialize in what they give up LEAST to produce.",
  },
  {
    step: 5,
    title: "The Gains from Trade",
    desc: "If the US specializes in wheat and Brazil in sugar, they can trade and BOTH end up with more of both goods than if each tried to produce everything.",
    question: "What is the key insight of comparative advantage?",
    options: [
      "Only the most productive country benefits from trade",
      "Countries should be self-sufficient and avoid trade",
      "Even if one country is better at everything, both benefit by specializing in their comparative advantage",
      "Trade only works if opportunity costs are equal",
    ],
    correct: 2,
    exp: "This is the core insight: even if the US is more efficient at BOTH goods (absolute advantage in both), BOTH countries benefit from trade by specializing in their comparative advantage. The gains from trade come from differences in opportunity costs, not absolute productivity.",
  },
];

function ComparativeStation({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = COMP_ADV_STEPS[idx];

  function check() {
    setChecked(true);
    if (sel === q.correct) setScore((s) => s + 1);
  }

  function next() {
    if (idx + 1 < COMP_ADV_STEPS.length) {
      setIdx(idx + 1);
      setSel(null);
      setChecked(false);
    } else {
      setDone(true);
    }
  }

  if (done)
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-green-800">
            {score}/{COMP_ADV_STEPS.length} correct
          </p>
          <p className="text-sm text-green-700 mt-1">
            Comparative advantage — not absolute advantage — drives the gains
            from specialization and trade. The country with the lower
            opportunity cost for a good should produce it.
          </p>
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          Mark Complete ✓
        </button>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">Comparative Advantage</p>
        <p className="text-muted-foreground text-xs">
          A country has comparative advantage in a good when it can produce it
          at a <strong>lower opportunity cost</strong> than another country.
          This determines who should specialize — and both countries gain from
          trade.
        </p>
      </div>

      {/* Production data table — always visible */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <p className="text-xs font-semibold text-foreground px-3 py-2 bg-muted border-b border-border">
          Hours to Produce 1 Unit
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Country</th>
              <th className="text-center px-3 py-2 text-xs font-semibold text-muted-foreground">🌾 Wheat</th>
              <th className="text-center px-3 py-2 text-xs font-semibold text-muted-foreground">🍬 Sugar</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-3 py-2 text-xs font-medium text-foreground">🇺🇸 United States</td>
              <td className="px-3 py-2 text-xs text-center text-foreground font-bold">1 hr</td>
              <td className="px-3 py-2 text-xs text-center text-foreground font-bold">4 hrs</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2 text-xs font-medium text-foreground">🇧🇷 Brazil</td>
              <td className="px-3 py-2 text-xs text-center text-foreground font-bold">5 hrs</td>
              <td className="px-3 py-2 text-xs text-center text-foreground font-bold">2 hrs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span aria-live="polite" aria-atomic="true">Step {q.step} of {COMP_ADV_STEPS.length}</span>
        <div className="flex gap-1">
          {COMP_ADV_STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${i < idx ? "bg-green-500" : i === idx ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-card border-2 border-border rounded-xl p-4">
        <p className="text-xs font-semibold text-primary mb-1">{q.title}</p>
        <p className="text-xs text-muted-foreground italic mb-3">{q.desc}</p>
        <p className="text-sm font-semibold text-foreground mb-3">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, oi) => {
            let cls = "border-border text-foreground";
            if (checked) {
              if (oi === q.correct)
                cls = "border-green-500 bg-green-50 text-green-800 font-semibold";
              else if (oi === sel)
                cls = "border-red-400 bg-red-50 text-red-700";
              else cls = "border-border text-muted-foreground opacity-50";
            } else if (sel === oi)
              cls = "border-primary bg-primary/10 text-primary font-semibold";
            return (
              <button
                key={oi}
                disabled={checked}
                onClick={() => setSel(oi)}
                className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-sm transition ${cls} ${!checked ? "hover:border-primary/40" : ""}`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
        {checked && (
          <p className={`mt-3 text-xs font-medium ${sel === q.correct ? "text-green-700" : "text-amber-700"}`}>
            {sel === q.correct ? "✓ Correct! " : "✗ Not quite. "}
            {q.exp}
          </p>
        )}
      </div>
      {!checked ? (
        <button
          type="button"
          onClick={check}
          disabled={sel === null}
          className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          Check Answer
        </button>
      ) : (
        <button
          type="button"
          onClick={next}
          className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          {idx + 1 < COMP_ADV_STEPS.length ? "Next Step →" : "See Results"}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 6 — Positive vs. Normative Sorter
// ─────────────────────────────────────────────
const PN_STATEMENTS = [
  { id: 1, text: "The unemployment rate rose to 4.1% in March.", correct: "positive", exp: "Positive — this is a measurable, verifiable fact. No value judgment involved." },
  { id: 2, text: "The government should raise the minimum wage to $20/hour.", correct: "normative", exp: "Normative — 'should' signals a value judgment about what policy ought to be. Reasonable people can disagree." },
  { id: 3, text: "Increasing the minimum wage to $15/hour is associated with a small decrease in employment in some studies.", correct: "positive", exp: "Positive — this describes an empirical finding from research. It's a factual claim that can be tested, even if results vary across studies." },
  { id: 4, text: "Free trade is better for the economy than tariffs.", correct: "normative", exp: "Normative — 'better' implies a value judgment. While many economists support free trade, this is a policy opinion, not a verifiable fact." },
  { id: 5, text: "A 10% increase in the price of gasoline typically reduces quantity demanded by about 2–3%.", correct: "positive", exp: "Positive — this is an empirical claim about how consumers respond to price changes. It's measurable and testable." },
  { id: 6, text: "Society should prioritize reducing inequality over maximizing GDP growth.", correct: "normative", exp: "Normative — this reflects a value priority. Economists can describe trade-offs, but choosing which goal matters more is a value judgment." },
  { id: 7, text: "When GDP grows, unemployment tends to fall.", correct: "positive", exp: "Positive — this describes Okun's Law, an empirical regularity economists have observed. It's a factual claim about how the economy works." },
  { id: 8, text: "The rich should pay higher tax rates because they can afford it.", correct: "normative", exp: "Normative — 'should' and 'can afford it' embed value judgments about fairness. This is an opinion about what tax policy ought to be." },
];

function PosNormStation({ onComplete }: { onComplete: () => void }) {
  const [placements, setPlacements] = useState<Record<number, "positive" | "normative">>({});
  const [checked, setChecked] = useState(false);

  const allPlaced = PN_STATEMENTS.every((s) => placements[s.id]);
  const correctCount = checked
    ? PN_STATEMENTS.filter((s) => placements[s.id] === s.correct).length
    : 0;

  function place(id: number, bucket: "positive" | "normative") {
    if (checked) return;
    setPlacements((p) => ({ ...p, [id]: bucket }));
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">Positive vs. Normative Statements</p>
        <p className="text-muted-foreground text-xs">
          <strong>Positive</strong> = a factual claim that can be tested or
          verified (even if currently unknown). Ask: "Can this be measured?"{" "}
          <strong>Normative</strong> = a value judgment about what{" "}
          <em>should</em> be. Ask: "Does this express an opinion?" Look for
          words like <em>should, better, ought, fair</em>.
        </p>
      </div>

      <div className="space-y-2">
        {PN_STATEMENTS.map((s) => {
          const placement = placements[s.id];
          const isCorrect = checked && placement === s.correct;
          const isWrong = checked && placement && placement !== s.correct;
          return (
            <div
              key={s.id}
              className={`bg-card border-2 rounded-xl p-3 transition ${
                isCorrect
                  ? "border-green-400"
                  : isWrong
                  ? "border-red-400"
                  : "border-border"
              }`}
            >
              <p className="text-xs text-foreground mb-2">{s.text}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={checked}
                  onClick={() => place(s.id, "positive")}
                  aria-pressed={placement === "positive"}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition border ${
                    placement === "positive"
                      ? checked
                        ? isCorrect
                          ? "bg-green-100 border-green-400 text-green-800"
                          : "bg-red-100 border-red-400 text-red-700"
                        : "bg-blue-100 border-blue-400 text-blue-800"
                      : "border-border text-muted-foreground hover:border-blue-300"
                  }`}
                >
                  📊 Positive
                </button>
                <button
                  type="button"
                  disabled={checked}
                  onClick={() => place(s.id, "normative")}
                  aria-pressed={placement === "normative"}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition border ${
                    placement === "normative"
                      ? checked
                        ? isCorrect
                          ? "bg-green-100 border-green-400 text-green-800"
                          : "bg-red-100 border-red-400 text-red-700"
                        : "bg-purple-100 border-purple-400 text-purple-800"
                      : "border-border text-muted-foreground hover:border-purple-300"
                  }`}
                >
                  💬 Normative
                </button>
              </div>
              {checked && (
                <p className={`text-xs mt-1.5 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                  {isCorrect ? "✓ " : `✗ This is ${s.correct}. `}
                  {s.exp}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!checked ? (
        <button
          type="button"
          onClick={() => setChecked(true)}
          disabled={!allPlaced}
          className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          Check All Answers
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <p className="text-base font-bold text-green-800">
              {correctCount}/{PN_STATEMENTS.length} correct
            </p>
          </div>
          <button
            onClick={onComplete}
            className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition"
          >
            Mark Complete ✓
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Quiz
// ─────────────────────────────────────────────
const ALL_QUESTIONS = [
  // Budget Constraint
  {
    q: "Alphonso has $10/week. Burgers cost $2 and bus tickets cost $0.50. What is the opportunity cost of 1 burger in terms of bus tickets?",
    options: ["1 bus ticket", "2 bus tickets", "4 bus tickets", "8 bus tickets"],
    correct: 2,
    exp: "$2 burger ÷ $0.50 per ticket = 4 bus tickets. For every burger Alphonso buys, he gives up 4 bus rides.",
  },
  {
    q: "A budget constraint for an individual shows:",
    options: [
      "The maximum amount of one good that can be produced",
      "All combinations of two goods that exactly use up available income",
      "The optimal combination of goods the consumer should buy",
      "The total cost of all goods purchased",
    ],
    correct: 1,
    exp: "The budget constraint shows all affordable combinations given income and prices — not the optimal choice (that requires preferences), just the frontier of what's possible.",
  },
  // Opportunity Cost
  {
    q: "Maria leaves her $40,000/year job to attend graduate school costing $20,000/year in tuition. What is the opportunity cost of one year of grad school?",
    options: [
      "$20,000 (tuition only)",
      "$40,000 (lost wages only)",
      "$60,000 (tuition + lost wages)",
      "$0 — education is an investment",
    ],
    correct: 2,
    exp: "Full opportunity cost = direct cost ($20,000 tuition) + forgone alternative ($40,000 wages) = $60,000. Economists count both because both represent real sacrifices.",
  },
  {
    q: "You spent $50 on a concert ticket but find out the day-of that you're exhausted and the show sounds less appealing. The $50 is:",
    options: [
      "A marginal cost that should influence your decision to go",
      "A sunk cost — already spent and should NOT affect your decision",
      "An opportunity cost of staying home",
      "A variable cost that changes with your decision",
    ],
    correct: 1,
    exp: "The $50 is a sunk cost — it's spent and non-refundable regardless of what you do now. Rational decision-making ignores sunk costs and evaluates only future costs and benefits.",
  },
  // Marginal Analysis
  {
    q: "According to marginal analysis, you should continue an activity as long as:",
    options: [
      "Total benefit is positive",
      "Marginal benefit equals zero",
      "Marginal benefit is greater than or equal to marginal cost",
      "Average benefit exceeds average cost",
    ],
    correct: 2,
    exp: "The marginal rule: keep doing the activity as long as the additional gain (MB) is at least as large as the additional cost (MC). Stop when MC > MB.",
  },
  {
    q: "The law of diminishing marginal utility states that:",
    options: [
      "As price rises, consumers buy less",
      "Each additional unit of a good consumed provides less additional satisfaction than the previous unit",
      "Producers supply more as price increases",
      "Resources become scarcer as consumption increases",
    ],
    correct: 1,
    exp: "Diminishing marginal utility: the 1st slice of pizza is amazing; the 6th, less so. Each additional unit adds less satisfaction. This is why consumers buy variety instead of only one good.",
  },
  // PPF
  {
    q: "A point INSIDE the Production Possibilities Frontier represents:",
    options: [
      "Allocative efficiency",
      "Productive efficiency",
      "Productive inefficiency — resources are idle or misallocated",
      "A point that requires new technology to reach",
    ],
    correct: 2,
    exp: "A point inside the PPF means the economy is not using all its resources effectively — some are idle (like during a recession) or misallocated. Moving to the PPF curve would mean producing more of both goods.",
  },
  {
    q: "The PPF curves outward (is concave to the origin) because of the:",
    options: [
      "Law of demand",
      "Law of increasing opportunity cost",
      "Law of diminishing marginal utility",
      "Budget constraint",
    ],
    correct: 1,
    exp: "As a society shifts more resources to one good, the resources being transferred are increasingly less suited to that production — requiring ever-larger sacrifices of the other good. This increasing opportunity cost creates the outward curve.",
  },
  // Comparative Advantage
  {
    q: "The United States takes 1 hour to produce a unit of wheat and 4 hours for sugar. Brazil takes 5 hours for wheat and 2 hours for sugar. Which country has comparative advantage in sugar?",
    options: [
      "United States — it has absolute advantage in both",
      "Brazil — its opportunity cost of sugar (2/5 wheat) is lower than the US's (4 wheat)",
      "Neither — they should each produce both goods",
      "United States — 4 hours is less than 5 hours",
    ],
    correct: 1,
    exp: "Brazil's opportunity cost of 1 unit of sugar = 2/5 unit of wheat. The US's opportunity cost of 1 unit of sugar = 4 units of wheat. Since Brazil gives up far less wheat to produce sugar, Brazil has comparative advantage in sugar.",
  },
  // Positive vs. Normative
  {
    q: "\"An increase in the federal minimum wage to $15/hour would reduce teen employment by approximately 1–3%.\" This statement is:",
    options: [
      "Normative — it advocates for a specific policy",
      "Positive — it is a testable, empirical claim about the relationship between wages and employment",
      "Neither — it is just an opinion",
      "Normative — because it involves government policy",
    ],
    correct: 1,
    exp: "This is a positive statement. It makes a specific, measurable claim about the effect of a policy that can be tested with data. Whether the policy is good or bad is a separate normative question.",
  },
];

function QuizStation({
  onPass,
  onFail,
}: {
  onPass: (score: number, results: { correct: boolean; exp: string }[]) => void;
  onFail: () => void;
}) {
  const [questions] = useState(() => shuffle(ALL_QUESTIONS).slice(0, 10));
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; exp: string }[]>([]);

  const q = questions[idx];
  const PASS = 9;

  function check() {
    setChecked(true);
    setResults((r) => [...r, { correct: sel === q.correct, exp: q.exp }]);
  }

  function next() {
    const newResults = [...results];
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setSel(null);
      setChecked(false);
    } else {
      const score = newResults.filter((r) => r.correct).length;
      if (score >= PASS) onPass(score, newResults);
      else onFail();
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span aria-live="polite" aria-atomic="true">
          Question {idx + 1} of {questions.length}
        </span>
        <div className="flex gap-1" role="img" aria-label={`Progress: question ${idx + 1} of ${questions.length}`}>
          {questions.map((_, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={`w-2 h-2 rounded-full ${
                i < results.length
                  ? results[i].correct
                    ? "bg-green-500"
                    : "bg-red-400"
                  : i === idx
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="bg-card border-2 border-border rounded-xl p-4">
        <p className="text-sm font-semibold text-foreground mb-3">{q.q}</p>
        <div className="space-y-2">
          {q.options.map((opt, oi) => {
            let cls = "border-border text-foreground";
            if (checked) {
              if (oi === q.correct)
                cls = "border-green-500 bg-green-50 text-green-800 font-semibold";
              else if (oi === sel)
                cls = "border-red-400 bg-red-50 text-red-700";
              else cls = "border-border text-muted-foreground opacity-50";
            } else if (sel === oi)
              cls = "border-primary bg-primary/10 text-primary font-semibold";
            return (
              <button
                key={oi}
                type="button"
                disabled={checked}
                onClick={() => setSel(oi)}
                aria-pressed={sel === oi}
                className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cls} ${!checked ? "hover:border-primary/40" : ""}`}
              >
                {checked && oi === q.correct && <span className="mr-1" aria-hidden="true">✓</span>}
                {checked && oi === sel && oi !== q.correct && <span className="mr-1" aria-hidden="true">✗</span>}
                <span className="font-bold mr-2">
                  {String.fromCharCode(65 + oi)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>
        {checked && (
          <p
            className={`mt-3 text-xs font-medium ${sel === q.correct ? "text-green-700" : "text-amber-700"}`}
          >
            {sel === q.correct ? "✓ Correct! " : "✗ Not quite. "}
            {q.exp}
          </p>
        )}
      </div>
      {!checked ? (
        <button
          type="button"
          onClick={check}
          disabled={sel === null}
          className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          Check Answer
        </button>
      ) : (
        <button
          type="button"
          onClick={next}
          className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          {idx + 1 < questions.length ? "Next Question →" : "Submit Quiz"}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Not Yet Screen
// ─────────────────────────────────────────────
function NotYetScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2">📋</p>
        <p className="text-lg font-bold text-amber-800 mb-1">Not Yet</p>
        <p className="text-sm text-amber-700 mb-3">
          You need 9 out of 10 to pass. Keep reviewing and try again!
        </p>
        <p className="text-xs text-amber-600 font-medium">
          This screen cannot be submitted. Only the final Results screen counts.
        </p>
      </div>
      <button
        onClick={onRetry}
        type="button"
        className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
      >
        Try Again
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Results Screen
// ─────────────────────────────────────────────
function ResultsScreen({
  score,
  results,
  onRestart,
  courseTitle,
}: {
  score: number;
  results: { correct: boolean; exp: string }[];
  onRestart: () => void;
  courseTitle: string;
}) {
  const [name, setName] = useState("");
  const [exitTicket, setExitTicket] = useState("");

  function printPDF() {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>ECO 210 Ch2 Results</title>
      <style>
        body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;color:#1e293b;padding:20px}
        h1{color:hsl(222,42%,19%);font-size:1.4rem;margin-bottom:4px}
        h2{font-size:1rem;color:#475569;font-weight:normal;margin-top:0}
        .score{background:#f0fdf4;border:2px solid #86efac;border-radius:12px;padding:16px;text-align:center;margin:20px 0}
        .score p{margin:0;color:#166534;font-size:1.1rem;font-weight:bold}
        .q{border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:10px}
        .correct{border-left:4px solid #22c55e}.wrong{border-left:4px solid #f87171}
        .label{font-size:0.7rem;font-weight:bold;text-transform:uppercase;color:#64748b}
        .exp{font-size:0.8rem;color:#475569;margin-top:6px}
        .exit{background:#fafafa;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-top:16px}
        footer{font-size:0.7rem;color:#94a3b8;margin-top:30px;border-top:1px solid #e2e8f0;padding-top:10px}
      </style></head><body>
      <h1>${courseTitle}</h1>
      <h2>Chapter 2 — Choice In A World Of Scarcity</h2>
      <p style="font-size:0.9rem;color:#475569">Student: <strong>${name}</strong></p>
      <div class="score"><p>Score: ${score}/10 — ${score >= 9 ? "PASSED ✓" : "Not Yet"}</p></div>
      ${results
        .map(
          (r, i) => `
        <div class="q ${r.correct ? "correct" : "wrong"}">
          <div class="label">${r.correct ? "✓ Correct" : "✗ Incorrect"} — Question ${i + 1}</div>
          <div class="exp">${r.exp}</div>
        </div>`
        )
        .join("")}
      ${
        exitTicket.trim()
          ? `<div class="exit"><div class="label">Exit Ticket</div><p style="font-size:0.85rem;margin:6px 0 0">${exitTicket}</p></div>`
          : ""
      }
      <footer>Access for free at https://openstax.org/books/principles-macroeconomics-3e/pages/1-introduction</footer>
      </body></html>`);
    win.document.close();
    win.print();
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className={`rounded-2xl p-6 text-center border-2 ${score >= 9 ? "bg-green-50 border-green-300" : "bg-amber-50 border-amber-300"}`}>
        <p className="text-3xl font-black mb-1 text-foreground">
          {score}/10
        </p>
        <p className={`text-base font-bold ${score >= 9 ? "text-green-700" : "text-amber-700"}`}>
          {score >= 9 ? "Excellent — Chapter 2 Complete! ✓" : "Keep Reviewing — You Need 9/10"}
        </p>
      </div>

      {/* Name field */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        <label htmlFor="result-name" className="text-sm font-semibold text-foreground block">
          Enter your name to generate PDF:
        </label>
        <input
          id="result-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Exit ticket */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        <label htmlFor="exit-ticket" className="text-sm font-semibold text-foreground block">
          Exit Ticket (optional): In your own words, what is one thing from Chapter 2 that surprised you or changed how you think about a decision?
        </label>
        <textarea
          id="exit-ticket"
          value={exitTicket}
          onChange={(e) => setExitTicket(e.target.value)}
          placeholder="Your response here..."
          rows={3}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* Question review */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Question Review</p>
        {results.map((r, i) => (
          <div
            key={i}
            className={`rounded-xl border px-4 py-2.5 text-xs ${r.correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <span className={`font-bold ${r.correct ? "text-green-700" : "text-red-600"}`}>
              {r.correct ? "✓" : "✗"} Q{i + 1}:
            </span>{" "}
            <span className={r.correct ? "text-green-700" : "text-red-600"}>
              {r.exp}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={printPDF}
          disabled={!name.trim()}
          type="button"
          className="flex-1 py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          🖨️ Print PDF
        </button>
        <button
          onClick={onRestart}
          type="button"
          className="flex-1 py-3 bg-muted hover:bg-accent text-muted-foreground rounded-xl font-semibold transition text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          ↺ Start Over
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────
const STATIONS_LIST = [
  { id: "budget" as Station, label: "Budget Constraint", desc: "Explore Alphonso's trade-off between burgers and bus tickets", icon: "💰" },
  { id: "oppcost" as Station, label: "Opportunity & Sunk Cost", desc: "Apply real-world opportunity cost and sunk cost scenarios", icon: "💡" },
  { id: "margin" as Station, label: "Thinking at the Margin", desc: "Compare marginal benefit vs. marginal cost decisions", icon: "📊" },
  { id: "ppf" as Station, label: "PPF Builder", desc: "Identify efficiency, inefficiency, and increasing opportunity cost", icon: "📈" },
  { id: "comparative" as Station, label: "Comparative Advantage", desc: "Calculate opportunity costs and find gains from trade", icon: "🌎" },
  { id: "posnorm" as Station, label: "Positive vs. Normative", desc: "Sort economic statements into facts vs. value judgments", icon: "⚖️" },
];

function Dashboard({
  completed,
  onSelect,
  quizUnlocked,
  onStartQuiz,
  onSummary,
}: {
  completed: Set<Station>;
  onSelect: (s: Station) => void;
  quizUnlocked: boolean;
  onStartQuiz: () => void;
  onSummary: () => void;
}) {
  const progress = STATIONS_LIST.filter((s) => completed.has(s.id)).length;
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">
          Chapter 2 — Choice In A World Of Scarcity
        </p>
        <p className="text-muted-foreground text-xs">
          Complete all 6 stations to unlock the Quiz. Your progress is saved
          automatically.
        </p>
        <div className="mt-3 h-2 bg-primary/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(progress / STATIONS_LIST.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {progress}/{STATIONS_LIST.length} stations complete
        </p>
      </div>

      {/* Chapter Summary */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted border border-border">
        <div className="flex items-center gap-2">
          <span className="text-base">📄</span>
          <span className="text-sm text-foreground">
            Need a refresher? View the chapter summary.
          </span>
        </div>
        <button
          onClick={onSummary}
          type="button"
          className="text-xs px-3 py-1.5 rounded-lg bg-card border border-border text-primary font-semibold hover:bg-accent transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Open Summary
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STATIONS_LIST.map((s) => {
          const done = completed.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              type="button"
              aria-label={`${s.label}${done ? " (completed)" : ""}`}
              className={`rounded-xl border-2 p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${done ? "border-green-400 bg-green-50" : "border-border bg-card hover:border-primary/40"}`}
            >
              <span className="text-lg">{done ? "✅" : s.icon}</span>
              <p className="text-sm font-semibold text-foreground mt-1">
                {s.label}
              </p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </button>
          );
        })}
      </div>

      <button
        onClick={onStartQuiz}
        disabled={!quizUnlocked}
        type="button"
        className={`w-full py-3 rounded-xl font-semibold text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${quizUnlocked ? "bg-primary hover:opacity-90 text-primary-foreground" : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"}`}
      >
        {quizUnlocked
          ? "🎯 Take the Quiz"
          : "🔒 Complete all stations to unlock the Quiz"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────
const NAV_STATIONS: { id: Station; label: string }[] = [
  { id: "intro", label: "Dashboard" },
  { id: "budget", label: "Budget" },
  { id: "oppcost", label: "Opp. Cost" },
  { id: "margin", label: "Margin" },
  { id: "ppf", label: "PPF" },
  { id: "comparative", label: "Comp. Adv." },
  { id: "posnorm", label: "Pos/Norm" },
  { id: "quiz", label: "Quiz" },
];

const STATION_ORDER: Station[] = [
  "intro", "budget", "oppcost", "margin", "ppf", "comparative", "posnorm", "quiz", "results", "not-yet",
];

function Header({
  station,
  completed,
  onNav,
  courseTitle,
  courseSubtitle,
  hubUrl,
}: {
  station: Station;
  completed: Set<Station>;
  onNav: (s: Station) => void;
  courseTitle: string;
  courseSubtitle: string;
  hubUrl: string;
}) {
  const currentIdx = STATION_ORDER.indexOf(station);
  const allStationsDone = STATIONS_LIST.every((s) => completed.has(s.id));

  return (
    <header
      role="banner"
      className="bg-secondary text-secondary-foreground shadow-md sticky top-0 z-50"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Econ Lab logo">
            <rect width="32" height="32" rx="8" fill="hsl(38 95% 50%)" />
            <path d="M8 22 L12 14 L16 18 L20 10 L24 16" stroke="hsl(222 30% 10%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="16" r="2" fill="hsl(222 30% 10%)" />
          </svg>
          <div>
            <div className="font-display font-semibold text-sm leading-none text-sidebar-foreground">
              {courseTitle}
            </div>
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">
              {courseSubtitle}
            </div>
          </div>
        </div>

        <a
          href={hubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-sidebar-foreground/80 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-sidebar-accent shrink-0"
        >
          ← Course Hub <span className="sr-only">(opens in new tab)</span>
        </a>

        <div className="hidden sm:flex items-center gap-1 flex-wrap">
          {NAV_STATIONS.map((s) => {
            const idx = STATION_ORDER.indexOf(s.id);
            const done = idx < currentIdx || completed.has(s.id);
            const active =
              s.id === station ||
              (station === "not-yet" && s.id === "quiz") ||
              (station === "results" && s.id === "quiz");
            if (s.id === "quiz" && !allStationsDone) {
              return (
                <span
                  key={s.id}
                  title="Complete all stations first"
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-sidebar-foreground/35 cursor-not-allowed select-none"
                >
                  🔒 Quiz
                </span>
              );
            }
            return (
              <button
                key={s.id}
                onClick={() => onNav(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : done
                    ? "bg-sidebar-accent text-sidebar-foreground/90"
                    : "text-sidebar-foreground/75 hover:text-white"
                }`}
              >
                {done && !active ? "✓ " : ""}
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="sm:hidden text-sm font-medium text-sidebar-foreground/80">
          {currentIdx + 1} / {NAV_STATIONS.length}
        </div>

        <div className="w-24 hidden md:block shrink-0">
          <div className="h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${(currentIdx / (NAV_STATIONS.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// Main EconLab
// ─────────────────────────────────────────────
const STORAGE_KEY = "econlab_done_ch2";

export default function EconLab({
  courseTitle,
  courseSubtitle,
  hubUrl,
}: {
  courseTitle: string;
  courseSubtitle: string;
  hubUrl: string;
}) {
  const [station, setStation] = useState<Station>("intro");
  const [completed, setCompleted] = useState<Set<Station>>(() => {
    try {
      return new Set(
        JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Station[]
      );
    } catch {
      return new Set();
    }
  });
  const [showSummary, setShowSummary] = useState(false);
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const [quizScore, setQuizScore] = useState(0);

  function markDone(s: Station) {
    const next = new Set(completed);
    next.add(s);
    setCompleted(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {}
    setStation("intro");
  }

  const quizUnlocked = STATIONS_LIST.every((s) => completed.has(s.id));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
      {station !== "results" && station !== "not-yet" && (
        <>
          <Header
            station={station}
            completed={completed}
            onNav={setStation}
            courseTitle={courseTitle}
            courseSubtitle={courseSubtitle}
            hubUrl={hubUrl}
          />
          <main className="max-w-2xl mx-auto px-4 py-6">
            {station === "intro" && (
              <Dashboard
                completed={completed}
                onSelect={setStation}
                quizUnlocked={quizUnlocked}
                onStartQuiz={() => setStation("quiz")}
                onSummary={() => setShowSummary(true)}
              />
            )}
            {station === "budget" && (
              <BudgetStation onComplete={() => markDone("budget")} />
            )}
            {station === "oppcost" && (
              <OppCostStation onComplete={() => markDone("oppcost")} />
            )}
            {station === "margin" && (
              <MarginStation onComplete={() => markDone("margin")} />
            )}
            {station === "ppf" && (
              <PPFStation onComplete={() => markDone("ppf")} />
            )}
            {station === "comparative" && (
              <ComparativeStation onComplete={() => markDone("comparative")} />
            )}
            {station === "posnorm" && (
              <PosNormStation onComplete={() => markDone("posnorm")} />
            )}
            {station === "quiz" && (
              <QuizStation
                onPass={(score, results) => {
                  setQuizScore(score);
                  setQuizResults(results);
                  markDone("quiz");
                  setStation("results");
                }}
                onFail={() => setStation("not-yet")}
              />
            )}
          </main>
        </>
      )}
      {station === "not-yet" && (
        <NotYetScreen onRetry={() => setStation("quiz")} />
      )}
      {station === "results" && (
        <ResultsScreen
          score={quizScore}
          results={quizResults}
          onRestart={() => setStation("intro")}
          courseTitle={courseTitle}
        />
      )}
    </div>
  );
}
