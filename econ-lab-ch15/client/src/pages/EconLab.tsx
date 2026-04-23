import { useState, useRef } from "react";
import { ChevronLeft, Award, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "recap" | "fedexplorer" | "bankrun" | "toolssorter" | "txchain" | "fedsim" | "fredchart" | "quiz" | "results" | "not-yet";

// ─────────────────────────────────────────────
// FRED Federal Funds Rate (annual averages)
// ─────────────────────────────────────────────
const FFR_DATA: [number, number][] = [
  [1954,1.00],[1955,1.79],[1956,2.73],[1957,3.11],[1958,1.57],[1959,3.31],
  [1960,3.22],[1961,1.96],[1962,2.68],[1963,3.18],[1964,3.50],[1965,4.07],
  [1966,5.11],[1967,4.22],[1968,5.66],[1969,8.20],[1970,7.18],[1971,4.67],
  [1972,4.44],[1973,8.73],[1974,10.51],[1975,5.82],[1976,5.05],[1977,5.54],
  [1978,7.94],[1979,11.19],[1980,13.36],[1981,16.38],[1982,12.26],[1983,9.09],
  [1984,10.23],[1985,8.10],[1986,6.81],[1987,6.66],[1988,7.57],[1989,9.21],
  [1990,8.10],[1991,5.69],[1992,3.52],[1993,3.02],[1994,4.21],[1995,5.83],
  [1996,5.30],[1997,5.46],[1998,5.35],[1999,5.00],[2000,6.24],[2001,3.88],
  [2002,1.67],[2003,1.13],[2004,1.35],[2005,3.22],[2006,5.02],[2007,5.02],
  [2008,1.93],[2009,0.24],[2010,0.18],[2011,0.10],[2012,0.14],[2013,0.11],
  [2014,0.09],[2015,0.13],[2016,0.40],[2017,1.00],[2018,1.83],[2019,2.16],
  [2020,0.36],[2021,0.08],[2022,1.68],[2023,5.02],[2024,5.33]
];

// ─────────────────────────────────────────────
// Chapter Summary
// ─────────────────────────────────────────────
const CH15_SUMMARY = [
  { heading: "15.1 — The Federal Reserve Banking System and Central Banks", body: "The most prominent task of a central bank is to conduct monetary policy, which involves changes to interest rates and credit conditions, affecting the amount of borrowing and spending in an economy. Some prominent central banks include the U.S. Federal Reserve, the European Central Bank, the Bank of Japan, and the Bank of England." },
  { heading: "15.2 — Bank Regulation", body: "A bank run occurs when rumors that a bank is at financial risk cause depositors to rush to withdraw their money, potentially forcing even a healthy bank to close. Deposit insurance guarantees depositors that their deposits will be protected even if the bank has negative net worth. In the U.S., the FDIC insures deposits up to $250,000. Bank supervision involves inspecting balance sheets to ensure positive net worth and manageable risk (OCC, NCUA, FDIC, and the Fed all play roles). When a central bank acts as lender of last resort, it makes short-term loans available during severe financial stress. Together, deposit insurance, bank supervision, and lender of last resort policies help prevent banking weaknesses from causing recessions." },
  { heading: "15.3 — Pre-2008 Fed Tools (Limited Reserves Era)", body: "Before 2008, the Federal Reserve operated in a limited reserves environment and relied on three primary tools. Open Market Operations (OMO): the Fed buys or sells U.S. Treasury bonds to add or drain bank reserves — the most frequently used pre-2008 tool, conducted daily by the NY Fed trading desk. Reserve Requirement: the minimum fraction of deposits banks must hold as reserves; lowering it frees banks to lend more (expansionary), raising it restricts lending (contractionary). Discount Rate: the interest rate the Fed charges commercial banks that borrow directly from the Fed's discount window; a lower rate encourages banks to borrow and lend more." },
  { heading: "15.3 (cont.) — Post-2008 Fed Tools (Ample Reserves Era)", body: "After the 2008 financial crisis, QE flooded the banking system with trillions in excess reserves, making quantity-based tools (OMO, reserve requirements) ineffective. The Fed now sets rates by controlling the price of reserves, not the quantity. IORB (Interest on Reserve Balances): the rate the Fed pays banks on overnight reserves parked at the Fed — now the primary rate-setting tool. Raising IORB raises the floor for all lending rates; lowering it encourages banks to lend out reserves. ON RRP (Overnight Reverse Repo Rate): the rate the Fed pays non-bank institutions (e.g. money market funds) that lend to the Fed overnight. Sets a hard floor for the federal funds rate — no institution lends in the market below what the Fed will pay. OMO: still used in the post-2008 era for large-scale asset purchases (QE) and sales (QT). Discount Rate: still available as a lender-of-last-resort tool for banks facing short-term liquidity stress." },
  { heading: "15.4 — Monetary Policy and Economic Outcomes", body: "Expansionary (loose) monetary policy raises the quantity of money and credit, reduces interest rates, boosts aggregate demand, and counters recession. Contractionary (tight) monetary policy reduces money and credit, raises interest rates, and holds down inflation. During the 2008–2009 recession, central banks also used quantitative easing to expand the supply of credit." },
  { heading: "15.5 — Pitfalls for Monetary Policy", body: "Monetary policy is inevitably imprecise because: (a) effects occur only after long and variable lags; (b) if banks decide to hold excess reserves, the central bank cannot force them to lend; and (c) economic conditions may shift in unpredictable ways. Some central banks practice inflation targeting (e.g. the European Central Bank), keeping inflation within a low target range. Others, like the U.S. Federal Reserve, follow a dual mandate: price stability and maximum employment, adjusting policy depending on which goal is most pressing at any given time." },
];

// ─────────────────────────────────────────────
// Summary Modal
// ─────────────────────────────────────────────
function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">📄 Chapter 15 Summary</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {CH15_SUMMARY.map((sec, i) => (
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
        <div className="p-4 border-t border-border">
          <button onClick={onClose} className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition">
            Close & Return to Lab
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Shared quiz/recap helpers
// ─────────────────────────────────────────────
type QA = { q: string; opts: string[]; correct: number | number[]; multi?: boolean; exp: string };

function QuestionBlock({ q, onResult }: { q: QA; onResult: (correct: boolean) => void }) {
  const [sel, setSel] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const isMulti = !!q.multi;

  function toggle(i: number) {
    if (submitted) return;
    setSel(prev => isMulti ? (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]) : [i]);
  }

  function submit() {
    if (!sel.length) return;
    const correct = isMulti
      ? (q.correct as number[]).length === sel.length && (q.correct as number[]).every(x => sel.includes(x))
      : sel[0] === (q.correct as number);
    setSubmitted(true);
    onResult(correct);
  }

  return (
    <div className="space-y-2">
      <div className="bg-muted rounded-xl p-4">
        <p className="font-semibold text-foreground leading-snug text-sm">{q.q}</p>
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
      {submitted && <div role="alert" aria-live="polite" className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm text-foreground"><span className="font-semibold">{(isMulti ? (q.correct as number[]).length === sel.length && (q.correct as number[]).every(x => sel.includes(x)) : sel[0] === q.correct) ? "✓ Correct! " : "✗ Not quite. "}</span>{q.exp}</div>}
      {!submitted && <button onClick={submit} disabled={!sel.length} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition text-sm">Submit Answer</button>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 1 — Ch14 Recap
// ─────────────────────────────────────────────
const RECAP_QS: QA[] = [
  { q: "Which of the four functions of money allows you to use dollars to pay off a 30-year mortgage?", opts: ["Medium of exchange", "Unit of account", "Store of value", "Standard of deferred payment"], correct: 3, exp: "Standard of deferred payment means money is acceptable for settling future obligations — including long-term loans and contracts." },
  { q: "A Certificate of Deposit (CD) is included in:", opts: ["M1 only", "M2 only, not M1", "Both M1 and M2", "Neither M1 nor M2"], correct: 1, exp: "CDs are less liquid — you can't spend them instantly without penalty — so they are in M2 but not M1." },
  { q: "With a reserve requirement of 20%, the money multiplier is:", opts: ["2", "5", "10", "20"], correct: 1, exp: "Money multiplier = 1 ÷ 0.20 = 5." },
  { q: "When a bank makes a loan of $9M from a $10M deposit (10% reserve req.), the bank's balance sheet shows:", opts: ["Assets fall by $9M", "A new $9M loan as an asset and $10M deposits remain as a liability", "Net worth increases by $9M", "Reserves increase to $10M"], correct: 1, exp: "The loan is a new asset (money owed to the bank). Deposits remain as a liability. Assets still equal liabilities + net worth." },
  { q: "Which of the following cause the real-world money multiplier to be lower than 1/rr predicts? (Select all that apply)", opts: ["Banks hold excess reserves", "People hold cash outside the banking system", "The Fed raises the reserve requirement", "Interest rates are very low"], correct: [0, 1], multi: true, exp: "Excess reserves and cash holdings ('mattress money') both reduce the amount re-deposited each round, shrinking the real multiplier below the theoretical maximum." },
];

function RecapStation({ onComplete }: { onComplete: () => void }) {
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const q = RECAP_QS[cur];
  const isMulti = !!q.multi;

  function toggle(i: number) {
    if (submitted) return;
    setSel(prev => isMulti ? (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]) : [i]);
  }

  function submit() {
    if (!sel.length) return;
    const correct = isMulti
      ? (q.correct as number[]).length === sel.length && (q.correct as number[]).every(x => sel.includes(x))
      : sel[0] === (q.correct as number);
    setSubmitted(true);
    if (correct) setScore(s => s + 1);
    setResults(prev => [...prev, correct]);
  }

  function next() {
    if (cur + 1 >= RECAP_QS.length) { setDone(true); return; }
    setCur(c => c + 1);
    setSel([]);
    setSubmitted(false);
  }

  if (done) return (
    <div className="max-w-xl mx-auto text-center space-y-4 py-6">
      <div className="text-5xl">📚</div>
      <h3 className="text-xl font-bold text-foreground">Ch14 Recap Complete!</h3>
      <p className="text-muted-foreground">You got <span className="font-bold text-primary">{score} / {RECAP_QS.length}</span> correct.</p>
      <div className="flex justify-center gap-2 flex-wrap">
        {results.map((r, i) => <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold ${r ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>Q{i+1} {r ? "✓" : "✗"}</span>)}
      </div>
      <button onClick={onComplete} className="mt-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex justify-between text-xs text-muted-foreground"><span>Q {cur+1} of {RECAP_QS.length}</span><span>{isMulti ? "Select all that apply" : "Select one"}</span></div>
      <div className="bg-muted rounded-xl p-4"><p className="font-semibold text-foreground leading-snug">{q.q}</p>{isMulti && <p className="text-xs text-primary mt-1">Select all that apply</p>}</div>
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
      {submitted && <div role="alert" aria-live="polite" className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm text-foreground"><span className="font-semibold">{(isMulti ? (q.correct as number[]).length === sel.length && (q.correct as number[]).every(x => sel.includes(x)) : sel[0] === q.correct) ? "✓ Correct! " : "✗ Not quite. "}</span>{q.exp}</div>}
      {!submitted
        ? <button onClick={submit} disabled={!sel.length} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">Submit Answer</button>
        : <button onClick={next} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">{cur + 1 < RECAP_QS.length ? "Next Question →" : "See Results"}</button>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 2 — The Fed Explorer
// ─────────────────────────────────────────────
const FED_ROLES = [
  { id: 0, emoji: "🏦", title: "Monetary Policy", tag: "Primary", color: "primary", body: "The Fed's dual mandate: maximum employment (targeting ~3.5–4.5% unemployment) and price stability (~2% inflation target). The FOMC sets the federal funds rate target 8 times per year to pursue both goals simultaneously." },
  { id: 1, emoji: "🛡️", title: "Financial Stability", tag: "Critical", color: "primary", body: "Monitor systemic risk across the financial system — the risk that problems in one institution cascade into a full crisis. The Fed watches for excessive leverage, asset bubbles, and interconnected exposures that could threaten the whole system." },
  { id: 2, emoji: "🏛️", title: "Banking Services", tag: "Operational", color: "amber", body: "The Fed acts as banker to commercial banks and the federal government. It runs the payment system (Fedwire), clears checks, and manages the Treasury's account. Private citizens have no accounts at the Fed." },
  { id: 3, emoji: "🔍", title: "Bank Supervision", tag: "Regulatory", color: "amber", body: "Examine bank balance sheets, enforce capital and reserve requirements, and ensure banks aren't taking excessive risks with depositor funds. Works alongside the OCC and FDIC to keep the banking system solvent." },
  { id: 4, emoji: "⚖️", title: "Consumer Protection", tag: "Regulatory", color: "amber", body: "Enforce fair lending laws (Equal Credit Opportunity Act, Truth in Lending Act), community development programs, and outreach to underserved communities. Ensures banks don't discriminate or mislead borrowers." },
  { id: 5, emoji: "🚨", title: "Lender of Last Resort", tag: "Emergency", color: "red", body: "When solvent banks face a liquidity crisis (a bank run), the Fed provides emergency loans through the discount window. This was the Fed's original purpose — created in 1913 after repeated bank panics. SVB (2023) showed how quickly a run can happen: $42B withdrawn in one day." },
];

const FOMC_FACTS = [
  { num: "19", label: "Total FOMC Members", sub: "All 7 Governors + all 12 Regional Bank Presidents" },
  { num: "12", label: "Vote Each Meeting", sub: "7 Governors + NY Fed (always) + 4 rotating regional presidents" },
  { num: "8", label: "Meetings Per Year", sub: "Every ~6–7 weeks in Washington, D.C." },
];

function FedExplorerStation({ onComplete }: { onComplete: () => void }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [fomc, setFomc] = useState(false);
  const allExpanded = expanded.size === FED_ROLES.length && fomc;

  const colorMap: { [k: string]: string } = {
    primary: "border-primary/30 bg-primary/5",
    amber: "border-amber-300 bg-amber-50",
    red: "border-red-300 bg-red-50",
  };
  const tagColor: { [k: string]: string } = {
    primary: "bg-primary/15 text-primary",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">The Fed has six distinct roles. Click each to learn what it does — then explore the FOMC structure.</p>

      {FED_ROLES.map(role => {
        const isExp = expanded.has(role.id);
        return (
          <button key={role.id} onClick={() => setExpanded(prev => { const n = new Set(prev); n.has(role.id) ? n.delete(role.id) : n.add(role.id); return n; })}
            className={`w-full text-left rounded-xl border-2 p-4 transition-all ${isExp ? colorMap[role.color] : "border-border bg-card hover:border-primary/40"}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{role.emoji}</span>
                <div>
                  <p className="font-semibold text-foreground text-sm">{role.title}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tagColor[role.color]}`}>{role.tag}</span>
                </div>
              </div>
              <span className="text-muted-foreground text-lg">{isExp ? "▲" : "▼"}</span>
            </div>
            {isExp && <p className="mt-3 text-sm text-foreground leading-relaxed border-t border-border/50 pt-3">{role.body}</p>}
          </button>
        );
      })}

      {/* FOMC Card */}
      <button onClick={() => setFomc(f => !f)}
        className={`w-full text-left rounded-xl border-2 p-4 transition-all ${fomc ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗳️</span>
            <div>
              <p className="font-semibold text-foreground text-sm">FOMC — The Rate-Setting Committee</p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">Structure</span>
            </div>
          </div>
          <span className="text-muted-foreground text-lg">{fomc ? "▲" : "▼"}</span>
        </div>
        {fomc && (
          <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-3 gap-3">
            {FOMC_FACTS.map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-3 text-center border border-border">
                <p className="text-2xl font-bold text-primary">{f.num}</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{f.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{f.sub}</p>
              </div>
            ))}
            <div className="col-span-3 text-xs text-muted-foreground bg-white rounded-xl p-3 border border-border leading-relaxed">
              <strong>Why does NY always vote?</strong> The NY Fed executes all open market operations — it can never sit out monetary policy decisions. The other 11 regional banks rotate through the remaining 4 voting seats annually.
            </div>
          </div>
        )}
      </button>

      <button onClick={onComplete} disabled={!allExpanded}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 3 — Bank Run Simulator (SVB)
// ─────────────────────────────────────────────
const RUN_STEPS = [
  { icon: "🏦", title: "The Setup", body: "Silicon Valley Bank (SVB) holds $209B in assets — mostly long-term Treasury bonds purchased during 2020–2021 when rates were near zero. Then the Fed raises rates aggressively in 2022." },
  { icon: "📉", title: "The Problem Emerges", body: "Rising rates crush bond values. SVB's bond portfolio loses billions in market value. Word spreads among tech investors that SVB may be insolvent. A rumor is all it takes." },
  { icon: "📱", title: "The Run Begins", body: "March 9, 2023: depositors — mostly tech startups — try to withdraw $42 billion in a single day. This is the fastest bank run in history, accelerated by smartphones and group chats." },
  { icon: "🔒", title: "Bank Fails", body: "SVB cannot liquidate bonds fast enough to meet withdrawals. Regulators seize SVB on March 10 — the 2nd-largest U.S. bank failure ever. With no safeguards, every depositor above $250K would lose money." },
  { icon: "🛡️", title: "Safeguard 1: FDIC Insurance", body: "FDIC deposit insurance protects up to $250,000 per depositor per bank. Banks pay premiums for this coverage. The guarantee eliminates the incentive to panic: 'My money is safe even if the bank fails.'" },
  { icon: "🚨", title: "Safeguard 2: Lender of Last Resort", body: "The Fed can provide emergency loans to solvent-but-illiquid banks — stopping a run before it becomes a collapse. Like an emergency room for banks: treats the liquidity crisis before it becomes fatal." },
];

function BankRunStation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [safeguard, setSafeguard] = useState<"fdic" | "lolr" | null>(null);
  const [engaged, setEngaged] = useState(false);

  const showSafeguards = step >= 4;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Walk through the SVB bank run step by step — then explore the two safeguards that prevent runs from destroying the system.</p>

      {/* Step cards */}
      <div className="space-y-2">
        {RUN_STEPS.slice(0, Math.min(step + 1, 4)).map((s, i) => (
          <div key={i} className={`rounded-xl border-2 p-4 transition-all ${i < 4 && i === step && i < 4 ? "border-red-300 bg-red-50" : i < 4 ? "border-border bg-card" : ""}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{s.icon}</span>
              <div>
                <p className="font-semibold text-foreground text-sm">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {step < 3 && (
        <button onClick={() => { setStep(s => s + 1); setEngaged(true); }}
          className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition">
          Next Step →
        </button>
      )}

      {step === 3 && !showSafeguards && (
        <button onClick={() => { setStep(4); setEngaged(true); }}
          className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">
          How Do We Stop Bank Runs? →
        </button>
      )}

      {/* Safeguards */}
      {showSafeguards && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Two safeguards prevent bank runs from cascading:</p>
          <div className="grid grid-cols-2 gap-3">
            {(["fdic", "lolr"] as const).map(key => {
              const s = RUN_STEPS[key === "fdic" ? 4 : 5];
              const active = safeguard === key;
              return (
                <button key={key} onClick={() => { setSafeguard(active ? null : key); setEngaged(true); }}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${active ? "border-green-400 bg-green-50" : "border-border bg-card hover:border-green-300"}`}>
                  <span className="text-2xl block mb-2">{s.icon}</span>
                  <p className="font-semibold text-foreground text-sm">{s.title}</p>
                  {active && <p className="text-xs text-green-800 mt-2 leading-relaxed">{s.body}</p>}
                  {!active && <p className="text-xs text-muted-foreground mt-1">Tap to reveal</p>}
                </button>
              );
            })}
          </div>
          {safeguard && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800">
              <strong>Key insight:</strong> Together, FDIC insurance removes the incentive to run (your money is safe), while the lender of last resort provides liquidity if a run starts anyway. Neither alone is sufficient — both are needed.
            </div>
          )}
        </div>
      )}

      <button onClick={onComplete} disabled={safeguard === null || !showSafeguards}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 4 — Policy Tools Sorter
// ─────────────────────────────────────────────
const TOOLS = [
  { id: 0, name: "Open Market Operations (OMO)", era: "pre", detail: "Fed buys or sells Treasury bonds to add or drain bank reserves. Expansionary: buy bonds → inject reserves → ↓ FFR. Contractionary: sell bonds → drain reserves → ↑ FFR. Was the primary pre-2008 tool, conducted daily by the NY Fed trading desk." },
  { id: 1, name: "Discount Rate", era: "pre", detail: "Interest rate charged when banks borrow directly from the Fed's 'discount window.' Expansionary: lower rate → banks borrow cheaply → ↑ reserves → ↓ FFR. Now mainly a ceiling and signaling tool." },
  { id: 2, name: "Reserve Requirement", era: "pre", detail: "The % of deposits banks must keep on hand. Historically ~10%; currently 0% (suspended March 2020). Rarely changed even before suspension. Effectively inactive in today's system." },
  { id: 3, name: "IORB (Interest on Reserve Balances)", era: "post", detail: "The Fed pays banks interest on reserves parked at the Fed overnight. This is now the PRIMARY rate-setting tool. ↑ IORB → banks prefer Fed deposit → ↑ demand in fed funds market → ↑ FFR. ↓ IORB → banks lend out reserves → ↑ supply → ↓ FFR. Works through arbitrage." },
  { id: 4, name: "ON RRP Rate (Overnight Reverse Repo)", era: "post", detail: "Rate the Fed pays non-bank institutions (money market funds) that lend to the Fed overnight. Sets a floor for the FFR — no institution lends in the market at below what the Fed pays. Works with IORB to keep the FFR in its target band." },
];

function ToolsSorterStation({ onComplete }: { onComplete: () => void }) {
  const [placed, setPlaced] = useState<{ [id: number]: "pre" | "post" | null }>({});
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);

  const allPlaced = TOOLS.every(t => placed[t.id]);
  const score = TOOLS.filter(t => placed[t.id] === t.era).length;

  function place(id: number, era: "pre" | "post") {
    if (checked) return;
    setPlaced(prev => ({ ...prev, [id]: era }));
  }

  function toggleExpand(id: number) {
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Sort each tool into <strong>Pre-2008</strong> ("Limited Reserves" era) or <strong>Post-2008</strong> ("Ample Reserves" era). Then expand each card to learn how it works.</p>

      {/* Unplaced */}
      {TOOLS.filter(t => !placed[t.id]).length > 0 && (
        <div className="space-y-2">
          {TOOLS.filter(t => !placed[t.id]).map(tool => (
            <div key={tool.id} className="bg-card border-2 border-border rounded-xl p-3">
              <p className="text-sm font-semibold text-foreground mb-2">{tool.name}</p>
              <div className="flex gap-2">
                <button onClick={() => place(tool.id, "pre")} className="flex-1 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-semibold transition">→ Pre-2008</button>
                <button onClick={() => place(tool.id, "post")} className="flex-1 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-semibold transition">→ Post-2008</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sorted columns */}
      {Object.keys(placed).length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {(["pre", "post"] as const).map(era => (
            <div key={era} className={`rounded-xl border-2 p-3 min-h-[60px] ${era === "pre" ? "border-primary/30 bg-primary/5" : "border-amber-300 bg-amber-50"}`}>
              <p className={`text-xs font-bold mb-2 ${era === "pre" ? "text-primary" : "text-amber-700"}`}>
                {era === "pre" ? "🔵 Pre-2008 (Limited Reserves)" : "🟡 Post-2008 (Ample Reserves)"}
              </p>
              {TOOLS.filter(t => placed[t.id] === era).map(tool => {
                const correct = checked ? tool.era === era : null;
                const isExp = expanded.has(tool.id);
                return (
                  <div key={tool.id} className={`mb-2 rounded-lg border ${checked ? (correct ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50") : "border-border bg-white"}`}>
                    <button onClick={() => toggleExpand(tool.id)} className="w-full text-left p-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {checked && (correct ? "✓ " : "✗ ")}{tool.name}
                      </span>
                      <span className="text-muted-foreground text-xs">{isExp ? "▲" : "▼"}</span>
                    </button>
                    {isExp && <p className="text-xs text-muted-foreground px-2 pb-2 leading-relaxed">{tool.detail}</p>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {checked && (
        <div className={`p-3 rounded-xl text-sm font-semibold text-center ${score === TOOLS.length ? "bg-green-100 text-green-800" : "bg-amber-50 text-amber-800"}`}>
          {score === TOOLS.length ? "🎉 Perfect! All 5 tools sorted correctly." : `${score} / ${TOOLS.length} correct — tap each card to learn more.`}
        </div>
      )}

      {allPlaced && !checked && (
        <button onClick={() => setChecked(true)} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Check My Sorting</button>
      )}
      {checked && (
        <button onClick={onComplete} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 5 — Transmission Chain Builder
// ─────────────────────────────────────────────
const CHAINS = {
  recession: {
    label: "Recession / High Unemployment",
    color: "blue",
    policy: "Expansionary — Cut Rates",
    steps: [
      { id: 0, text: "FOMC lowers the FFR target" },
      { id: 1, text: "↓ IORB & ON RRP → banks lend more cheaply" },
      { id: 2, text: "↓ Market interest rates (mortgages, auto, business loans)" },
      { id: 3, text: "↑ Borrowing → ↑ Consumer spending (C) & Investment (I)" },
      { id: 4, text: "↑ Aggregate Demand (AD shifts right)" },
      { id: 5, text: "↑ Real GDP & ↓ Unemployment" },
    ],
  },
  inflation: {
    label: "Inflation Above 2%",
    color: "red",
    policy: "Contractionary — Raise Rates",
    steps: [
      { id: 0, text: "FOMC raises the FFR target" },
      { id: 1, text: "↑ IORB & ON RRP → banks park reserves at Fed" },
      { id: 2, text: "↑ Market interest rates across the economy" },
      { id: 3, text: "↓ Borrowing → ↓ Consumer spending (C) & Investment (I)" },
      { id: 4, text: "↓ Aggregate Demand (AD shifts left)" },
      { id: 5, text: "↓ Price level & ↓ Real GDP" },
    ],
  },
};

function TxChainStation({ onComplete }: { onComplete: () => void }) {
  const [scenario, setScenario] = useState<"recession" | "inflation" | null>(null);
  const [placed, setPlaced] = useState<(number | null)[]>([null, null, null, null, null, null]);
  const [shuffled, setShuffled] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [engaged, setEngaged] = useState(false);

  function startScenario(s: "recession" | "inflation") {
    setScenario(s);
    setPlaced([null, null, null, null, null, null]);
    setChecked(false);
    setEngaged(true);
    // Shuffle step IDs
    const ids = [0, 1, 2, 3, 4, 5];
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setShuffled(ids);
  }

  const chain = scenario ? CHAINS[scenario] : null;
  const usedIds = placed.filter(x => x !== null) as number[];
  const availableIds = shuffled.filter(id => !usedIds.includes(id));
  const allPlaced = placed.every(x => x !== null);
  const correct = chain ? placed.every((id, i) => id === i) : false;

  function placeStep(slotIdx: number, stepId: number) {
    if (checked) return;
    setPlaced(prev => { const n = [...prev]; n[slotIdx] = stepId; return n; });
  }

  function removeStep(slotIdx: number) {
    if (checked) return;
    setPlaced(prev => { const n = [...prev]; n[slotIdx] = null; return n; });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Choose a scenario, then arrange the transmission chain steps in the correct order — from FOMC decision to economic outcome.</p>

      {/* Scenario selector */}
      <div className="grid grid-cols-2 gap-3">
        {(["recession", "inflation"] as const).map(s => (
          <button key={s} onClick={() => startScenario(s)}
            className={`p-4 rounded-xl border-2 text-left transition ${scenario === s ? (s === "recession" ? "border-blue-400 bg-blue-50" : "border-red-400 bg-red-50") : "border-border bg-card hover:border-primary/40"}`}>
            <p className="font-bold text-sm text-foreground">{s === "recession" ? "📉 Recession" : "📈 Inflation"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{CHAINS[s].label}</p>
            <p className={`text-xs font-semibold mt-1 ${s === "recession" ? "text-blue-600" : "text-red-600"}`}>{CHAINS[s].policy}</p>
          </button>
        ))}
      </div>

      {chain && (
        <>
          {/* Available steps to place */}
          {availableIds.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Steps to place:</p>
              {availableIds.map(id => (
                <div key={id} className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground">
                  {chain.steps[id].text}
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {placed.map((p, slotIdx) => p === null ? (
                      <button key={slotIdx} onClick={() => placeStep(slotIdx, id)}
                        className="text-xs px-2 py-0.5 bg-primary/10 hover:bg-primary/20 text-primary rounded font-medium transition">
                        → Step {slotIdx + 1}
                      </button>
                    ) : null)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chain slots */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Your chain:</p>
            {placed.map((stepId, slotIdx) => {
              const isCorrect = checked && stepId === slotIdx;
              const isWrong = checked && stepId !== null && stepId !== slotIdx;
              return (
                <div key={slotIdx} className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 min-h-[44px] transition ${
                  checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-400 bg-red-50" : "border-border bg-muted")
                  : stepId !== null ? "border-primary/40 bg-primary/5" : "border-dashed border-border bg-muted/50"
                }`}>
                  <span className={`text-xs font-bold w-14 flex-shrink-0 ${checked && isCorrect ? "text-green-700" : checked && isWrong ? "text-red-600" : "text-muted-foreground"}`}>
                    Step {slotIdx + 1}
                  </span>
                  {stepId !== null ? (
                    <div className="flex-1 flex items-center justify-between gap-2">
                      <span className="text-xs text-foreground">{checked && (isCorrect ? "✓ " : "✗ ")}{chain.steps[stepId].text}</span>
                      {!checked && <button onClick={() => removeStep(slotIdx)} className="text-muted-foreground hover:text-red-500 text-xs font-bold flex-shrink-0">✕</button>}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">empty — tap a step above to place here</span>
                  )}
                </div>
              );
            })}
          </div>

          {checked && (
            <div className={`p-3 rounded-xl text-sm font-semibold text-center ${correct ? "bg-green-100 text-green-800" : "bg-amber-50 text-amber-800"}`}>
              {correct ? "🎉 Perfect chain! You traced the full transmission mechanism." : "Not quite — incorrect steps shown in red. Try the other scenario too!"}
            </div>
          )}

          <div className="flex gap-2">
            {allPlaced && !checked && (
              <button onClick={() => setChecked(true)} className="flex-1 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Check My Chain</button>
            )}
            {checked && (
              <button onClick={onComplete} className="flex-1 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
            )}
            {checked && scenario && (
              <button onClick={() => startScenario(scenario === "recession" ? "inflation" : "recession")}
                className="px-4 py-3 bg-muted hover:bg-accent text-muted-foreground rounded-xl text-sm font-medium transition">
                Try {scenario === "recession" ? "Inflation" : "Recession"} →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 6 — Fed Decision Simulator
// ─────────────────────────────────────────────
const FED_SCENARIOS = [
  {
    year: "March 2020",
    headline: "COVID-19 pandemic declared. GDP projected to fall 30% annualized. Unemployment surging from 3.5% toward 15%. Inflation well below 2%.",
    options: ["Cut rates aggressively (to near zero)", "Hold rates steady", "Raise rates to prevent future inflation"],
    correct: 0,
    actual: "The Fed cut rates to 0–0.25% on March 15, 2020 — an emergency inter-meeting cut. Also launched massive QE, purchasing $700B in bonds within days.",
    insight: "With unemployment spiking and inflation non-existent, expansionary policy was unambiguous. The dual mandate both pointed the same direction.",
  },
  {
    year: "June 2022",
    headline: "CPI inflation hits 9.1% — highest since 1981. Unemployment at 3.6% (near full employment). Fed funds rate still at 0.25%.",
    options: ["Raise rates sharply (75 bps)", "Small rate cut to protect growth", "Hold — wait for inflation to self-correct"],
    correct: 0,
    actual: "The Fed raised rates by 75 basis points — the largest single hike since 1994. It would hike 11 times total, taking the FFR from near 0% to over 5% by mid-2023.",
    insight: "With inflation at 40-year highs and the labor market tight, the Fed's credibility was at stake. Delay risked inflation becoming entrenched in expectations.",
  },
  {
    year: "September 2008",
    headline: "Lehman Brothers collapses. Credit markets freeze. Banks won't lend to each other. Unemployment rising. Inflation at 5% from oil prices.",
    options: ["Cut rates — financial crisis is more urgent", "Raise rates — inflation is above target", "Hold — conflicting signals, wait for clarity"],
    correct: 0,
    actual: "The Fed cut rates from 2% to 1.5% and eventually to 0–0.25% by December 2008. It also used emergency lending facilities to keep the financial system functioning.",
    insight: "Financial crises take priority — a systemic collapse would cause far worse deflation and unemployment than the existing inflation. The oil-driven inflation would fade on its own.",
  },
  {
    year: "Late 1979",
    headline: "Paul Volcker becomes Fed Chair. Inflation at 13%. Unemployment at 6%. Public and politicians demand action on prices. Previous Fed chairs had been too timid.",
    options: ["Raise rates dramatically — crush inflation even if recession follows", "Gradual rate increases to balance both mandates", "Cut rates — 6% unemployment is too high"],
    correct: 0,
    actual: "Volcker raised the FFR to 20% by 1981 — deliberately inducing a deep recession. Unemployment peaked at 10.8% in 1982. But inflation fell from 13% to 3% by 1983, restoring the Fed's credibility.",
    insight: "Sometimes one mandate must be sacrificed temporarily for the other. Volcker's 'shock therapy' permanently anchored inflation expectations — the foundation of modern monetary policy.",
  },
];

function FedSimStation({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const s = FED_SCENARIOS[current];

  function choose(i: number) {
    if (revealed) return;
    setSelected(i);
  }

  function reveal() {
    if (selected === null) return;
    const correct = selected === s.correct;
    setRevealed(true);
    setScores(prev => [...prev, correct]);
  }

  function next() {
    if (current + 1 >= FED_SCENARIOS.length) { setDone(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setRevealed(false);
  }

  if (done) {
    const total = scores.filter(Boolean).length;
    return (
      <div className="max-w-xl mx-auto text-center space-y-4 py-6">
        <div className="text-5xl">🎯</div>
        <h3 className="text-xl font-bold text-foreground">Fed Simulator Complete!</h3>
        <p className="text-muted-foreground">You matched <span className="font-bold text-primary">{total} / {FED_SCENARIOS.length}</span> Fed decisions correctly.</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {scores.map((r, i) => <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold ${r ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{FED_SCENARIOS[i].year} {r ? "✓" : "✗"}</span>)}
        </div>
        <button onClick={onComplete} className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Scenario {current + 1} of {FED_SCENARIOS.length}</span>
        <span className="font-semibold text-primary">{s.year}</span>
      </div>

      <div className="bg-secondary/10 border border-border rounded-xl p-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">📰 The Situation</p>
        <p className="text-sm text-foreground leading-relaxed">{s.headline}</p>
        <p className="text-xs font-semibold text-primary mt-3">You are the FOMC. What do you do?</p>
      </div>

      <div className="space-y-2">
        {s.options.map((opt, i) => {
          let cls = "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ";
          if (!revealed) cls += selected === i ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card hover:border-primary/40 text-foreground";
          else if (i === s.correct) cls += "border-green-500 bg-green-50 text-green-800";
          else if (selected === i && i !== s.correct) cls += "border-red-400 bg-red-50 text-red-700";
          else cls += "border-border bg-card text-muted-foreground";
          return (
            <button key={i} className={cls} onClick={() => choose(i)} disabled={revealed}>
              {revealed && i === s.correct ? "✓ " : revealed && selected === i ? "✗ " : ""}{opt}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="space-y-2">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm text-foreground">
            <p className="font-semibold mb-1">📋 What the Fed Actually Did</p>
            <p>{s.actual}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
            <p className="font-semibold mb-1">💡 Key Insight</p>
            <p>{s.insight}</p>
          </div>
        </div>
      )}

      {!revealed
        ? <button onClick={reveal} disabled={selected === null} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">Reveal Fed's Decision</button>
        : <button onClick={next} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">{current + 1 < FED_SCENARIOS.length ? "Next Scenario →" : "See Results"}</button>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 7 — Reading the Data (FRED FFR)
// ─────────────────────────────────────────────
const FFR_QUESTIONS = [
  {
    q: "Hover near 1981. Approximately what was the Federal Funds Rate at its peak during the Volcker Shock? (%)",
    prompt: "Enter the rate in % (e.g. 5.0)",
    unit: "%",
    check: (v: number) => v >= 15 && v <= 18,
    hint: "Look for the tallest spike on the chart — hover around 1980–1981 and read the FFR value below the chart.",
    answer: "approximately 16.4%",
    exp: "The FFR averaged 16.38% in 1981 — the peak of Volcker's aggressive tightening to break double-digit inflation.",
  },
  {
    q: "Hover over 2009–2015. Approximately how many years did the Fed hold the FFR near zero (below 0.5%) after the 2008 financial crisis?",
    prompt: "Enter number of years (e.g. 3)",
    unit: "yrs",
    check: (v: number) => v >= 6 && v <= 8,
    hint: "Count the years from 2009 up to when the FFR begins rising again — hover along that flat stretch near the bottom.",
    answer: "approximately 7 years (2009–2015)",
    exp: "From 2009 through 2015 the FFR stayed below 0.5% — 7 years at the zero lower bound, as the Fed tried to stimulate a slow recovery.",
  },
  {
    q: "Hover over 2021 and then 2023. By approximately how many percentage points did the FFR rise during the 2022–2023 rapid tightening cycle?",
    prompt: "Enter the change in percentage points (e.g. 2.0)",
    unit: "pp",
    check: (v: number) => v >= 4 && v <= 6,
    hint: "Hover near 2021 for the starting rate, then near 2023 for the peak. Subtract to find the change.",
    answer: "approximately 5 percentage points",
    exp: "The FFR went from ~0.08% in 2021 to ~5.02% in 2023 — nearly a 5 percentage point rise in just two years, the fastest tightening cycle in 40 years.",
  },
];

function FredChartStation({ onComplete }: { onComplete: () => void }) {
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["" , "", ""]);
  const [attempts, setAttempts] = useState<number[]>([0, 0, 0]);
  const [results, setResults] = useState<("correct" | "revealed" | null)[]>([null, null, null]);
  const [msgs, setMsgs] = useState<string[]>(["", "", ""]);
  const svgW = 340, svgH = 220;
  const pad = { l: 36, r: 16, t: 16, b: 32 };

  const years = FFR_DATA.map(d => d[0]);
  const yMax = 18;

  function xScale(yr: number) { return pad.l + ((yr - years[0]) / (years[years.length-1] - years[0])) * (svgW - pad.l - pad.r); }
  function yScale(v: number) { return pad.t + ((yMax - v) / yMax) * (svgH - pad.t - pad.b); }

  const pathD = FFR_DATA.map((d, i) => `${i===0?"M":"L"}${xScale(d[0]).toFixed(1)},${yScale(d[1]).toFixed(1)}`).join(" ");
  const hData = hoverYear !== null ? FFR_DATA.find(d => d[0] === hoverYear) : null;

  const annotations = [
    { year: 1979, label: "Volcker shock", val: 16 },
    { year: 2008, label: "ZLB", val: 4 },
    { year: 2022, label: "Rapid tightening", val: 10 },
  ];

  const allDone = results.every(r => r !== null);
  const showTooltip = allDone;
  const currentQDone = results[qIdx] !== null;

  function checkAnswer() {
    const q = FFR_QUESTIONS[qIdx];
    const val = parseFloat(answers[qIdx].trim());
    if (isNaN(val)) return;
    const n = attempts[qIdx] + 1;
    const newAttempts = [...attempts]; newAttempts[qIdx] = n;
    setAttempts(newAttempts);
    if (q.check(val)) {
      const newResults = [...results]; newResults[qIdx] = "correct";
      const newMsgs = [...msgs]; newMsgs[qIdx] = `✓ Correct! ${q.exp}`;
      setResults(newResults); setMsgs(newMsgs);
    } else if (n === 1) {
      const newMsgs = [...msgs]; newMsgs[qIdx] = `Not quite — try again. ${q.hint}`;
      setMsgs(newMsgs);
    } else if (n === 2) {
      const newMsgs = [...msgs]; newMsgs[qIdx] = `Hint: ${q.hint}`;
      setMsgs(newMsgs);
    } else {
      const newResults = [...results]; newResults[qIdx] = "revealed";
      const newMsgs = [...msgs]; newMsgs[qIdx] = `Answer: ${q.answer}. ${q.exp}`;
      setResults(newResults); setMsgs(newMsgs);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">U.S. Federal Funds Rate 1954–2024. Hover over the chart to read values — then answer the questions below.</p>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-2" onMouseLeave={() => setHoverYear(null)}>
        <svg width={svgW} height={svgH} style={{ display: "block", margin: "0 auto" }}
          role="img" aria-label="Interactive chart — hover to explore data points"
          onMouseMove={e => {
            const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const yr = Math.round(years[0] + ((mx - pad.l) / (svgW - pad.l - pad.r)) * (years[years.length-1] - years[0]));
            if (yr >= years[0] && yr <= years[years.length-1]) setHoverYear(yr);
          }}>
          {[0, 4, 8, 12, 16].map(v => (
            <line key={v} x1={pad.l} x2={svgW-pad.r} y1={yScale(v)} y2={yScale(v)} stroke="#f1f5f9" strokeWidth="1" />
          ))}
          <line x1={pad.l} x2={svgW-pad.r} y1={svgH-pad.b} y2={svgH-pad.b} stroke="#94a3b8" strokeWidth="1.5" />
          <line x1={pad.l} x2={pad.l} y1={pad.t} y2={svgH-pad.b} stroke="#94a3b8" strokeWidth="1.5" />
          {[0, 4, 8, 12, 16].map(v => (
            <text key={v} x={pad.l-4} y={yScale(v)+3} textAnchor="end" fontSize="8" fill="#94a3b8">{v}%</text>
          ))}
          {[1960,1970,1980,1990,2000,2010,2020].map(yr => (
            <text key={yr} x={xScale(yr)} y={svgH-pad.b+12} textAnchor="middle" fontSize="8" fill="#94a3b8">{yr}</text>
          ))}
          {annotations.map(a => (
            <g key={a.year}>
              <line x1={xScale(a.year)} x2={xScale(a.year)} y1={pad.t} y2={svgH-pad.b} stroke="#fca5a5" strokeWidth="1" strokeDasharray="3,3" />
              <text x={xScale(a.year)+3} y={yScale(a.val)} fontSize="7" fill="#ef4444" fontStyle="italic">{a.label}</text>
            </g>
          ))}
          <path d={pathD} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.8" strokeLinejoin="round" />
          <path d={`${pathD} L${xScale(years[years.length-1])},${svgH-pad.b} L${xScale(years[0])},${svgH-pad.b} Z`}
            fill="hsl(var(--primary))" fillOpacity="0.08" />
          {/* Crosshair — always shown */}
          {hoverYear !== null && <line x1={xScale(hoverYear)} x2={xScale(hoverYear)} y1={pad.t} y2={svgH-pad.b} stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="2,2" />}
          {hoverYear !== null && (
            <text x={xScale(hoverYear)} y={svgH-pad.b-4} textAnchor="middle" fontSize="9" fill="hsl(var(--primary))" fontWeight="bold">{hoverYear}</text>
          )}
          {/* Full tooltip only after all questions done */}
          {showTooltip && hData && (() => {
            const tx = xScale(hData[0]);
            const bx = tx > svgW/2 ? tx - 108 : tx + 8;
            return (
              <g>
                <rect x={bx} y={pad.t} width={100} height={36} rx={5} fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x={bx+8} y={pad.t+14} fontSize="10" fill="#1e293b" fontWeight="bold">{hData[0]}</text>
                <text x={bx+8} y={pad.t+27} fontSize="9" fill="#64748b">FFR: {hData[1].toFixed(2)}%</text>
              </g>
            );
          })()}
        </svg>
        {/* Value readout below chart during Q&A */}
        {hoverYear !== null && !showTooltip && hData && (
          <p className="text-center text-xs font-semibold text-primary mt-1">{hData[0]}: FFR = {hData[1].toFixed(2)}%</p>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {FFR_QUESTIONS.map((_, i) => (
          <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
            results[i] === "correct" ? "bg-green-100 border-green-400 text-green-700" :
            results[i] === "revealed" ? "bg-amber-100 border-amber-400 text-amber-700" :
            i === qIdx ? "bg-primary/10 border-primary text-primary" :
            "bg-muted border-border text-muted-foreground"
          }`}>{results[i] === "correct" ? "✓" : results[i] === "revealed" ? "!" : i + 1}</div>
        ))}
        <span className="text-xs text-muted-foreground ml-1">{results.filter(r => r !== null).length} / {FFR_QUESTIONS.length} answered</span>
      </div>

      {/* Active question */}
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Q{qIdx + 1}: {FFR_QUESTIONS[qIdx].q}</p>
        {!currentQDone ? (
          <>
            <div className="flex gap-2 items-center">
              <input
                type="number" step="0.1"
                value={answers[qIdx]}
                onChange={e => { const a = [...answers]; a[qIdx] = e.target.value; setAnswers(a); }}
                placeholder={FFR_QUESTIONS[qIdx].prompt}
                className="flex-1 border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none"
              />
              {FFR_QUESTIONS[qIdx].unit && <span className="text-sm font-semibold text-muted-foreground">{FFR_QUESTIONS[qIdx].unit}</span>}
              <button onClick={checkAnswer} disabled={!answers[qIdx].trim()}
                className="px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl text-sm font-semibold transition">Check</button>
            </div>
            {msgs[qIdx] && <p className="text-xs font-medium text-amber-700">{msgs[qIdx]}</p>}
          </>
        ) : (
          <>
            <p className={`text-xs font-medium ${results[qIdx] === "correct" ? "text-green-700" : "text-amber-700"}`}>{msgs[qIdx]}</p>
            {qIdx < FFR_QUESTIONS.length - 1 && (
              <button onClick={() => setQIdx(qIdx + 1)}
                className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl text-sm font-semibold transition">
                Next Question →
              </button>
            )}
          </>
        )}
      </div>

      {/* Insight cards — always visible */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { title: "Volcker Shock (1979–83)", body: "FFR hit ~16% to crush 13% inflation. Caused a deep recession but permanently anchored expectations." },
          { title: "Zero Lower Bound (2009–15)", body: "Fed cut to ~0% after the financial crisis — and stayed there for 7 years. Traditional tools were exhausted." },
          { title: "Gradual Normalization (2015–19)", body: "Slow, telegraphed rate hikes back toward 'neutral.' Showed the Fed could exit without causing instability." },
          { title: "Rapid Tightening (2022–23)", body: "Fastest rate cycle in 40 years — 0% to 5.33% in 16 months — to fight post-COVID inflation." },
        ].map((c, i) => (
          <div key={i} className="bg-muted rounded-xl p-3">
            <p className="text-xs font-semibold text-foreground mb-0.5">{c.title}</p>
            <p className="text-xs text-muted-foreground leading-snug">{c.body}</p>
          </div>
        ))}
      </div>

      <button onClick={onComplete} disabled={!allDone}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Quiz (10 Qs)
// ─────────────────────────────────────────────
const QUIZ_QS: QA[] = [
  { q: "The Federal Reserve's 'dual mandate' refers to its goals of:", opts: ["Low taxes and high growth", "Maximum employment and price stability", "Balanced budget and low inflation", "Financial stability and consumer protection"], correct: 1, exp: "The Fed's two statutory goals are maximum employment (targeting ~3.5–4.5% unemployment) and price stability (~2% inflation)." },
  { q: "Which body within the Fed sets the federal funds rate target?", opts: ["The Board of Governors only", "The 12 regional bank presidents only", "The FOMC (Federal Open Market Committee)", "The U.S. Treasury"], correct: 2, exp: "The FOMC — 19 members total, 12 voting — meets 8 times per year to set the FFR target range." },
  { q: "The New York Fed always votes on the FOMC because:", opts: ["It is the largest regional bank by assets", "It executes all open market operations on behalf of the Fed", "The NY Fed president is always the FOMC Chair", "New York is the U.S. capital"], correct: 1, exp: "The NY Fed trading desk conducts all OMOs — buying and selling bonds to implement monetary policy — so it can never sit out a rate decision." },
  { q: "FDIC deposit insurance eliminates bank runs primarily by:", opts: ["Paying depositors interest above market rates", "Removing the incentive to panic — depositors know their money is safe", "Requiring banks to hold 100% reserves", "Allowing the Fed to print money for failing banks"], correct: 1, exp: "If you know your deposits are insured up to $250K, there's no reason to rush to the bank at the first rumor. The guarantee breaks the self-fulfilling panic." },
  { q: "In the pre-2008 'limited reserves' era, the Fed's primary tool for moving interest rates was:", opts: ["IORB (Interest on Reserve Balances)", "The reserve requirement", "Open Market Operations (buying/selling bonds)", "The ON RRP rate"], correct: 2, exp: "OMOs — conducted daily by the NY Fed — added or drained reserves to move the fed funds rate. IORB didn't exist pre-2008." },
  { q: "After 2008, the Fed shifted to IORB as its primary tool because:", opts: ["Congress banned open market operations", "QE flooded banks with so many reserves that quantity-based tools lost traction", "Reserve requirements were raised to 50%", "The discount rate became legally unavailable"], correct: 1, exp: "With banks holding trillions in excess reserves, changing the quantity of reserves by a few billion had no effect on rates. The Fed needed to directly set the price banks earn on reserves." },
  { q: "The ON RRP (Overnight Reverse Repo) rate sets a floor for the FFR because:", opts: ["No institution will lend in the market at a rate below what the Fed pays them", "It is always set above the IORB rate", "It applies only to commercial banks, creating a ceiling", "The Treasury mandates it as a minimum lending rate"], correct: 0, exp: "Money market funds won't lend to banks at below the ON RRP rate — why accept less from a bank than the Fed will pay? This arbitrage sets a hard floor for overnight rates." },
  { q: "Expansionary monetary policy works through the transmission chain by:", opts: ["↑ FFR → ↑ borrowing costs → ↓ C+I → ↓ AD", "↓ FFR → ↓ borrowing costs → ↑ C+I → ↑ AD → ↑ GDP", "↑ FFR → ↑ bank reserves → ↑ money supply", "↓ FFR → ↓ bank profits → ↓ lending"], correct: 1, exp: "Lower rates reduce borrowing costs → consumers and businesses spend and invest more → AD shifts right → GDP rises and unemployment falls." },
  { q: "Which of the following are TRUE about the Fed's lender of last resort role? (Select all that apply)", opts: ["It provides emergency loans to solvent-but-illiquid banks", "It was the Fed's original purpose, created after repeated bank panics in the 1800s–early 1900s", "It insures individual depositor accounts up to $250,000", "It prevents a liquidity crisis from becoming a solvency crisis"], correct: [0, 1, 3], multi: true, exp: "The Fed lends to illiquid (but not insolvent) banks to stop panic-driven runs. It was the founding purpose of the Fed (1913). FDIC — not the Fed — insures individual deposits." },
  { q: "Which statements about capital requirements are correct? (Select all that apply)", opts: ["They require banks to hold a minimum % of equity relative to assets", "They act as a loss cushion — depositors are only harmed after equity is wiped out", "They are the same as reserve requirements", "They were strengthened after the 2008 crisis by Dodd-Frank"], correct: [0, 1, 3], multi: true, exp: "Capital requirements (equity/assets ratio) protect depositors by ensuring banks absorb losses first. They are distinct from reserve requirements (cash on hand). Dodd-Frank (2010) significantly raised capital standards." },
];


// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle answer options while tracking the correct answer index/indices
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
    shuffle(QUIZ_QS).map(q => {
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
// Not Yet
// ─────────────────────────────────────────────
function NotYetScreen({ score, onRetry }: { score: number; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#fef3c7" }}>
      <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-4">
        <div className="text-5xl">📖</div>
        <h2 className="text-2xl font-bold text-amber-700">Not Yet</h2>
        <p className="text-foreground">You scored <span className="font-bold">{score}/10</span>. Mastery requires 9 out of 10 correct.</p>
        <p className="text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-xl p-3">This screen cannot be submitted. Only the final Results screen counts.</p>
        <button onClick={onRetry} className="w-full py-3 bg-amber-500 hover:opacity-90 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2">
          <RotateCcw size={16} /> Try Again
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Results
// ─────────────────────────────────────────────
function ResultsScreen({ results, onRestart }: { results: { correct: boolean; exp: string }[]; onRestart: () => void }) {
  const [exitTicket, setExitTicket] = useState("");
  const [studentName, setStudentName] = useState("");
  const score = results.filter(r => r.correct).length;
  // Mark lab complete in localStorage for Hub tracking
  if (typeof window !== 'undefined') { try { localStorage.setItem('econlab_done_ch15', 'true'); } catch(e) {} }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-bold text-foreground">Lab Complete!</h2>
          <p className="text-muted-foreground">Chapter 15</p>
          <div className="inline-block bg-primary/15 text-primary px-6 py-2 rounded-full text-xl font-bold mt-2">{score} / 10</div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground text-sm">Question Review</h3>
          {results.map((r, i) => (
            <div key={i} className={`p-3 rounded-xl text-sm border-l-4 ${r.correct ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"}`}>
              <span className="font-bold text-xs">{r.correct ? "✓" : "✗"}</span>
              <span className="font-semibold text-foreground ml-1">Q{i+1}: </span>
              <span className="text-muted-foreground">{r.exp}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <label htmlFor="exit-ticket-textarea" className="text-sm font-semibold text-foreground block">Exit Ticket: In your own words, explain how the Fed uses IORB to control the federal funds rate in today's "ample reserves" system.</label>
        <textarea id="exit-ticket-textarea" value={exitTicket} onChange={e => setExitTicket(e.target.value)} rows={4}
            className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none resize-none"
            placeholder="Write your reflection here..." />
        </div>
        <div className="space-y-3">
          <div>
            <label htmlFor="student-name-input" className="text-sm font-semibold text-foreground block mb-1">Your Name (required for submission)</label>
            <input
              id="student-name-input"
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
                + '<p style="color:#475569;margin:2px 0">Chapter 15: Monetary Policy and Bank Regulation</p>'
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
function IntroStation({ completed, onSelect, quizUnlocked, onStartQuiz }: {
  completed: Set<Station>; onSelect: (s: Station) => void; quizUnlocked: boolean; onStartQuiz: () => void;
}) {
  const [showSummary, setShowSummary] = useState(false);
  const stations = [
    { id: "recap" as Station, label: "📚 Ch14 Recap", desc: "Start here — 5 review questions on money, M1/M2, and the multiplier" },
    { id: "fedexplorer" as Station, label: "🏛️ The Fed Explorer", desc: "Discover the Fed's 6 roles and the FOMC's structure" },
    { id: "bankrun" as Station, label: "🛡️ Bank Run Simulator", desc: "Walk through the SVB collapse — then explore the two safeguards" },
    { id: "toolssorter" as Station, label: "🔧 Policy Tools Sorter", desc: "Sort pre-2008 vs. post-2008 monetary policy tools" },
    { id: "txchain" as Station, label: "⛓️ Transmission Chain Builder", desc: "Assemble the steps from FOMC decision to economic outcome" },
    { id: "fedsim" as Station, label: "🎯 Fed Decision Simulator", desc: "Face 4 real crisis moments — what would you do?" },
    { id: "fredchart" as Station, label: "📊 Reading the Data", desc: "FRED: Federal Funds Rate 1954–2024, annotated with key eras" },
  ];
  const done = stations.filter(s => completed.has(s.id)).length;

  return (
    <>
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wide mb-4">Chapter 15</span>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Monetary Policy & Bank Regulation</h1>
          <p className="text-muted-foreground text-base">The Fed, Its Tools, and How They Move the Economy</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4 text-sm text-foreground">
          💡 <strong>Key idea:</strong> The Fed doesn't print money to fight recessions — it moves interest rates. Understanding how a single rate decision ripples through the entire economy is the heart of monetary policy. Complete all 7 stations in any order, then take the quiz.
        </div>
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted border border-border mb-6">
          <div className="flex items-center gap-2">
            <span className="text-base">📄</span>
            <span className="text-sm text-foreground">Need a refresher? View the chapter summary.</span>
          </div>
          <button onClick={() => setShowSummary(true)} className="text-xs px-3 py-1.5 rounded-lg bg-card border border-border text-primary font-semibold hover:bg-accent transition-all shrink-0">Open Summary</button>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-muted rounded-full h-1.5">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(done / stations.length) * 100}%` }} />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{done}/{stations.length} complete</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {stations.map(s => {
            const isDone = completed.has(s.id);
            return (
              <button key={s.id} onClick={() => onSelect(s.id)}
                className={`rounded-xl border-2 p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary
                  ${isDone ? "border-green-400 bg-green-50" : "border-border bg-card hover:border-primary/40"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${isDone ? "text-green-700" : "text-foreground"}`}>{s.label}</span>
                  {isDone && <span className="text-green-600 text-lg">✓</span>}
                </div>
                <span className="text-xs text-muted-foreground">{isDone ? "Completed" : s.desc}</span>
              </button>
            );
          })}
        </div>
        {quizUnlocked
          ? <button onClick={onStartQuiz} className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-base transition flex items-center justify-center gap-2"><Award size={20} /> Take the Quiz</button>
          : <div className="w-full py-4 bg-muted text-muted-foreground/60 rounded-xl font-bold text-base text-center">🔒 Quiz — Complete all stations to unlock</div>}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────
const HUB_URL = "https://www.perplexity.ai/computer/a/eco-210-econlab-course-hub-JgrfOPjHQ5iSYovw19FfIg";

function Header({ station, onStation, completed }: { station: Station; onStation: (s: Station) => void; completed: Set<Station> }) {
  const stationList: { id: Station; label: string }[] = [
    { id: "intro", label: "Dashboard" },
    { id: "recap", label: "Recap" },
    { id: "fedexplorer", label: "Fed" },
    { id: "bankrun", label: "Bank Run" },
    { id: "toolssorter", label: "Tools" },
    { id: "txchain", label: "Chain" },
    { id: "fedsim", label: "Simulator" },
    { id: "fredchart", label: "Data" },
    { id: "quiz", label: "Quiz" },
  ];
  const CONTENT: Station[] = ["recap","fedexplorer","bankrun","toolssorter","txchain","fedsim","fredchart"];
  const allDone = CONTENT.every(s => completed.has(s));
  const order: Station[] = ["intro","recap","fedexplorer","bankrun","toolssorter","txchain","fedsim","fredchart","quiz","results","not-yet"];
  const curIdx = order.indexOf(station);

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
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 15</div>
          </div>
        </div>

        {/* Back to Hub */}
        <a href={HUB_URL} target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-sidebar-foreground/80 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-sidebar-accent shrink-0">
          ← Course Hub
        </a>

        <div className="hidden sm:flex items-center gap-1 flex-wrap">
          {stationList.map(s => {
            const idx = order.indexOf(s.id);
            const done = idx < curIdx;
            const active = s.id === station;
            if (s.id === "quiz" && !allDone) {
              return <span key={s.id} className="px-3 py-1.5 rounded-full text-xs font-medium text-sidebar-foreground/35 cursor-not-allowed select-none">🔒 Quiz</span>;
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
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(curIdx / (stationList.length - 1)) * 100}%` }} />
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
  const contentRef = useRef<HTMLDivElement>(null);

  const CONTENT: Station[] = ["recap","fedexplorer","bankrun","toolssorter","txchain","fedsim","fredchart"];
  const quizUnlocked = CONTENT.every(s => completed.has(s));

  function go(s: Station) { setStation(s); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function markComplete(s: Station) { setCompleted(prev => new Set([...prev, s])); go("intro"); }

  if (station === "results") return <ResultsScreen results={quizResults} onRestart={() => { setCompleted(new Set()); setQuizResults([]); go("intro"); }} />;
  if (station === "not-yet") return <NotYetScreen score={quizResults.filter(r => r.correct).length} onRetry={() => { setQuizResults([]); go("quiz"); }} />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <Header station={station} onStation={go} completed={completed} />
      <main id="main-content" ref={contentRef} className="flex-1 px-4 py-8">
        {station === "intro" && <IntroStation completed={completed} onSelect={go} quizUnlocked={quizUnlocked} onStartQuiz={() => go("quiz")} />}
        {station === "recap" && <RecapStation onComplete={() => markComplete("recap")} />}
        {station === "fedexplorer" && <FedExplorerStation onComplete={() => markComplete("fedexplorer")} />}
        {station === "bankrun" && <BankRunStation onComplete={() => markComplete("bankrun")} />}
        {station === "toolssorter" && <ToolsSorterStation onComplete={() => markComplete("toolssorter")} />}
        {station === "txchain" && <TxChainStation onComplete={() => markComplete("txchain")} />}
        {station === "fedsim" && <FedSimStation onComplete={() => markComplete("fedsim")} />}
        {station === "fredchart" && <FredChartStation onComplete={() => markComplete("fredchart")} />}
        {station === "quiz" && (
          <QuizStation
            onPass={r => { setQuizResults(r); go("results"); }}
            onFail={r => { setQuizResults(r); go("not-yet"); }}
          />
        )}
      </main>
    </div>
  );
}
