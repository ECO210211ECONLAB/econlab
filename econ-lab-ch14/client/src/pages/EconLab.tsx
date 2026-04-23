import { useState, useRef } from "react";
import { ChevronLeft, Award, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "recap" | "barter" | "moneyornot" | "m1m2" | "taccount" | "depchain" | "fredchart" | "quiz" | "results" | "not-yet";

// ─────────────────────────────────────────────
// M2 Data (annual, trillions USD)
// ─────────────────────────────────────────────
const M2_DATA: [number, number][] = [
  [1980,1.60],[1981,1.76],[1982,1.91],[1983,2.13],[1984,2.31],[1985,2.50],
  [1986,2.73],[1987,2.83],[1988,2.99],[1989,3.16],[1990,3.28],[1991,3.38],
  [1992,3.43],[1993,3.48],[1994,3.50],[1995,3.65],[1996,3.82],[1997,4.05],
  [1998,4.37],[1999,4.63],[2000,4.91],[2001,5.45],[2002,5.79],[2003,6.05],
  [2004,6.40],[2005,6.68],[2006,7.07],[2007,7.46],[2008,8.19],[2009,8.51],
  [2010,8.81],[2011,9.65],[2012,10.51],[2013,11.02],[2014,11.67],[2015,12.34],
  [2016,13.21],[2017,13.85],[2018,14.36],[2019,15.34],[2020,19.10],[2021,21.18],
  [2022,21.30],[2023,20.78],[2024,21.20]
];

// ─────────────────────────────────────────────
// Chapter Summary
// ─────────────────────────────────────────────
const CH14_SUMMARY = [
  { heading: "14.1 — Defining Money by Its Functions", body: "Money is what people in a society regularly use when purchasing or selling goods and services. Without money, people would need to barter, requiring a double coincidence of wants. Money serves four functions: a medium of exchange, a unit of account, a store of value, and a standard of deferred payment. Commodity money has value from its use as something other than money (e.g. gold, salt). Fiat money has no intrinsic value but is declared by a government to be legal tender." },
  { heading: "14.2 — Measuring Money: Currency, M1, and M2", body: "M1 includes currency, money in checking accounts (demand deposits), and savings deposits. Traveler's checks are also a component of M1 but are declining in use. Note: The Federal Reserve reclassified savings accounts into M1 in 2020 when Regulation D transaction limits were removed. M2 includes all of M1, plus time deposits like certificates of deposit and money market funds." },
  { heading: "14.3 — The Role of Banks", body: "Banks facilitate transactions in the economy and act as financial intermediaries between savers who supply financial capital and borrowers who demand loans. A balance sheet (T-account) lists assets in one column and liabilities in another. Bank liabilities are its deposits; assets include loans, bonds, and reserves. Net worth = assets minus liabilities. Banks risk negative net worth if asset values decline due to loan defaults or interest rate changes (asset-liability time mismatch). Banks protect themselves by diversifying loans or holding more bonds and reserves. Holding only a fraction of deposits as reserves allows banks to create money through repeated lending and re-depositing." },
  { heading: "14.4 — How Banks Create Money", body: "The money multiplier is the quantity of money the banking system can generate from each $1 of bank reserves. Formula: 1 ÷ reserve ratio, where the reserve ratio is the fraction of deposits the bank holds as reserves. The quantity of money and credit are inextricably intertwined. When banks hold only limited reserves, the network of lending, depositing, and re-lending creates much of the money in the economy." },
];

// ─────────────────────────────────────────────
// Summary Modal
// ─────────────────────────────────────────────
function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">📄 Chapter 14 Summary</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {CH14_SUMMARY.map((sec, i) => (
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
// Station 1 — Ch12+13 Recap
// ─────────────────────────────────────────────
const RECAP_QS = [
  {
    q: "A Keynesian economist sees unemployment rising to 8%. What policy does she recommend?",
    opts: ["Raise taxes to balance the budget", "Increase government spending to shift AD right", "Wait for flexible prices to restore full employment", "Raise interest rates to cool inflation"],
    correct: 1,
    exp: "Keynesians advocate expansionary fiscal policy — increased spending shifts AD right, raising GDP and reducing unemployment.",
  },
  {
    q: "If MPC = 0.75, the spending multiplier equals:",
    opts: ["0.75", "1.33", "4.0", "7.5"],
    correct: 2,
    exp: "Multiplier = 1 ÷ (1 − 0.75) = 1 ÷ 0.25 = 4.",
  },
  {
    q: "The Phillips Curve broke down in the 1970s primarily because of:",
    opts: ["A large rightward shift in AD", "Negative supply shocks (oil embargo) that caused stagflation", "Government spending cuts", "Falling consumer confidence"],
    correct: 1,
    exp: "Oil embargoes shifted AS left, producing simultaneous high unemployment and high inflation — stagflation — which the stable Phillips Curve could not explain.",
  },
  {
    q: "A neoclassical economist believes recessions are best addressed by:",
    opts: ["Immediate large deficit spending", "Allowing the economy to self-correct through flexible prices", "Passing stimulus checks to households", "Rapidly expanding the money supply"],
    correct: 1,
    exp: "Neoclassicals trust price flexibility to restore potential GDP without active intervention.",
  },
  {
    q: "Which of these are Keynesian arguments for why wages are sticky? (Select all that apply)",
    opts: ["Menu costs make price changes expensive", "Workers resist nominal pay cuts", "Rational expectations ensure fast adjustment", "Long-term contracts lock in wages"],
    correct: [0, 1, 3],
    multi: true,
    exp: "Menu costs, worker resistance to pay cuts, and long-term contracts all contribute to wage/price stickiness. Rational expectations is the neoclassical counter-argument.",
  },
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
    setCur(c => c + 1); setSel([]); setSubmitted(false);
  }

  if (done) return (
    <div className="max-w-xl mx-auto text-center space-y-4 py-6">
      <div className="text-5xl">📚</div>
      <h3 className="text-xl font-bold text-foreground">Ch12+13 Recap Complete!</h3>
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
      <div className="bg-muted rounded-xl p-4"><p className="font-semibold text-foreground leading-snug">{q.q}</p></div>
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
// Station 2 — Barter vs. Money
// ─────────────────────────────────────────────
const BARTER_PROBLEMS = [
  { id: 0, problem: "Double Coincidence of Wants", desc: "Both parties must want exactly what the other has.", solution: "Medium of Exchange — money is universally accepted, so you never need a perfect match." },
  { id: 1, problem: "No Standard Pricing", desc: "How many apples equal a haircut? Every trade requires negotiating a new exchange rate.", solution: "Unit of Account — money gives everything a single price in dollars, making comparison instant." },
  { id: 2, problem: "Indivisibility", desc: "You cannot trade half a cow for a loaf of bread.", solution: "Medium of Exchange — money is perfectly divisible into any amount." },
  { id: 3, problem: "Perishability", desc: "Strawberries rot before you can find someone willing to trade for them.", solution: "Store of Value — money holds its value over time (imperfectly with inflation)." },
  { id: 4, problem: "High Transaction Costs", desc: "Enormous time and effort spent finding matching trading partners.", solution: "Medium of Exchange — one universally accepted good eliminates the search problem entirely." },
];

function BarterStation({ onComplete }: { onComplete: () => void }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const allRevealed = revealed.size === BARTER_PROBLEMS.length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Barter has five fundamental problems. For each one, click <strong>Reveal Solution</strong> to see how money solves it.</p>
      {BARTER_PROBLEMS.map(p => {
        const isRev = revealed.has(p.id);
        return (
          <div key={p.id} className={`rounded-xl border-2 p-4 transition-all ${isRev ? "border-green-400 bg-green-50" : "border-border bg-card"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground text-sm">❌ Problem: {p.problem}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
              </div>
              {!isRev && (
                <button onClick={() => setRevealed(prev => new Set([...prev, p.id]))}
                  className="shrink-0 text-xs px-3 py-1.5 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-semibold transition">
                  Reveal →
                </button>
              )}
            </div>
            {isRev && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <p className="text-xs text-green-800"><span className="font-semibold">✓ Money's Solution: </span>{p.solution}</p>
              </div>
            )}
          </div>
        );
      })}
      <button onClick={onComplete} disabled={!allRevealed}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 3 — Money or Not?
// ─────────────────────────────────────────────
const MONEY_ITEMS = [
  { id: 0, item: "Debit Card", verdict: "no", color: "red", explanation: "A debit card is an access device — it lets you reach your checking deposit, which is the actual money. The plastic card itself has no monetary value." },
  { id: 1, item: "Credit Card", verdict: "no", color: "red", explanation: "A credit card is a short-term loan from the card issuer. When you swipe it, the bank pays the merchant — you owe the bank. Spending it doesn't reduce your money supply, it increases your debt." },
  { id: 2, item: "Venmo / Zelle", verdict: "no", color: "red", explanation: "These are payment services that move money between accounts. The app itself is not money — it's a transfer mechanism. The deposits in your bank account are the money." },
  { id: 3, item: "Bitcoin", verdict: "debatable", color: "amber", explanation: "Bitcoin is debatable. It's not widely accepted as a medium of exchange and is extremely volatile as a store of value. Most economists classify it as a speculative asset rather than money — for now." },
  { id: 4, item: "Checking Account Deposit", verdict: "yes", color: "green", explanation: "Yes — demand deposits are part of M1, the most liquid measure of the money supply. When you write a check or use your debit card, you're spending this money." },
  { id: 5, item: "$20 Bill", verdict: "yes", color: "green", explanation: "Yes — currency in circulation is the core of M1. It's fiat money: no intrinsic value, but universally accepted because the government says so." },
  { id: 6, item: "Certificate of Deposit (CD)", verdict: "m2only", color: "blue", explanation: "A CD is money — but only in M2, not M1. It's less liquid because you must wait until maturity to access it without penalty. It counts as 'near money.'" },
  { id: 7, item: "Money Market Fund", verdict: "m2only", color: "blue", explanation: "Money market funds are in M2 only. They're highly liquid but not instantly spendable like a checking account. Think of them as 'almost M1.'" },
];

function MoneyOrNotStation({ onComplete }: { onComplete: () => void }) {
  const [answers, setAnswers] = useState<{ [id: number]: string }>({});
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [engaged, setEngaged] = useState(false);
  const allRevealed = revealed.size === MONEY_ITEMS.length;

  const colorMap: { [k: string]: { btn: string; badge: string } } = {
    red: { btn: "bg-red-100 text-red-700 border-red-300", badge: "bg-red-100 text-red-700" },
    green: { btn: "bg-green-100 text-green-700 border-green-300", badge: "bg-green-100 text-green-700" },
    amber: { btn: "bg-amber-100 text-amber-700 border-amber-300", badge: "bg-amber-100 text-amber-700" },
    blue: { btn: "bg-blue-100 text-blue-700 border-blue-300", badge: "bg-blue-100 text-blue-700" },
  };

  const verdictLabel: { [k: string]: string } = { yes: "✓ Money (M1)", no: "✗ Not Money", debatable: "⚡ Debatable", m2only: "◎ M2 Only" };

  function guess(id: number, g: string) {
    setAnswers(prev => ({ ...prev, [id]: g }));
    setEngaged(true);
  }

  function reveal(id: number) {
    setRevealed(prev => new Set([...prev, id]));
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">For each item, decide if it's money — then reveal the answer.</p>
      {MONEY_ITEMS.map(item => {
        const isRev = revealed.has(item.id);
        const userGuess = answers[item.id];
        const correct = isRev ? userGuess === item.verdict : null;
        return (
          <div key={item.id} className={`rounded-xl border-2 p-4 transition-all ${isRev ? `border-${item.color}-300 bg-${item.color}-50/40` : "border-border bg-card"}`}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="font-semibold text-sm text-foreground">{item.item}</p>
              {isRev && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colorMap[item.color].badge}`}>{verdictLabel[item.verdict]}</span>}
            </div>
            {!isRev && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {[["yes","✓ Money"], ["no","✗ Not Money"], ["debatable","⚡ Debatable"], ["m2only","◎ M2 Only"]].map(([val, label]) => (
                  <button key={val} onClick={() => guess(item.id, val)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${userGuess === val ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                    {label}
                  </button>
                ))}
                {userGuess && (
                  <button onClick={() => reveal(item.id)}
                    className="text-xs px-3 py-1.5 bg-primary hover:opacity-90 text-primary-foreground rounded-full font-semibold transition">
                    Reveal →
                  </button>
                )}
              </div>
            )}
            {isRev && (
              <div className="mt-2">
                {userGuess && <p className={`text-xs font-semibold mb-1 ${correct ? "text-green-700" : "text-red-600"}`}>{correct ? "✓ You got it!" : `✗ You said: ${verdictLabel[userGuess]}`}</p>}
                <p className="text-xs text-muted-foreground leading-relaxed">{item.explanation}</p>
              </div>
            )}
          </div>
        );
      })}
      <button onClick={onComplete} disabled={!allRevealed}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 4 — M1 vs. M2 Builder
// ─────────────────────────────────────────────
const M_ITEMS = [
  { id: 0, label: "Coins & currency in circulation", correct: "m1", liquidity: 5 },
  { id: 1, label: "Checkable (demand) deposits", correct: "m1", liquidity: 5 },
  { id: 2, label: "Savings deposits", correct: "m1", liquidity: 4 },
  { id: 3, label: "Money market mutual funds", correct: "m2only", liquidity: 3 },
  { id: 4, label: "Certificates of Deposit (CDs < $100K)", correct: "m2only", liquidity: 2 },
  { id: 5, label: "Other small time deposits", correct: "m2only", liquidity: 2 },
];

function M1M2Station({ onComplete }: { onComplete: () => void }) {
  const [placed, setPlaced] = useState<{ [id: number]: "m1" | "m2only" | null }>({});
  const [checked, setChecked] = useState(false);
  const allPlaced = M_ITEMS.every(item => placed[item.id]);
  const score = M_ITEMS.filter(item => placed[item.id] === item.correct).length;

  function place(id: number, bucket: "m1" | "m2only") {
    if (checked) return;
    setPlaced(prev => ({ ...prev, [id]: bucket }));
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Sort each item into <strong>M1</strong> (most liquid — spend right now) or <strong>M2 only</strong> (less liquid — needs conversion). All M1 items are also in M2.</p>

      {/* Unplaced items */}
      {M_ITEMS.filter(item => !placed[item.id]).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Items to sort:</p>
          {M_ITEMS.filter(item => !placed[item.id]).map(item => (
            <div key={item.id} className="bg-card border-2 border-border rounded-xl p-3">
              <p className="text-sm text-foreground font-medium mb-2">{item.label}</p>
              <div className="flex gap-2">
                <button onClick={() => place(item.id, "m1")} className="flex-1 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-semibold transition">→ M1</button>
                <button onClick={() => place(item.id, "m2only")} className="flex-1 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-semibold transition">→ M2 Only</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Placed columns */}
      {Object.keys(placed).length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {([["m1", "🔵 M1 (Most Liquid)", "border-primary bg-primary/5"], ["m2only", "🟡 M2 Only (Less Liquid)", "border-amber-300 bg-amber-50"]] as const).map(([bucket, label, cls]) => (
            <div key={bucket} className={`rounded-xl border-2 p-3 min-h-[60px] ${cls}`}>
              <p className="text-xs font-bold mb-2 text-foreground">{label}</p>
              {M_ITEMS.filter(item => placed[item.id] === bucket).map(item => {
                const correct = checked ? placed[item.id] === item.correct : null;
                return (
                  <div key={item.id} className={`text-xs mb-1 p-1.5 rounded-lg ${checked ? (correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700") : "bg-white text-foreground"}`}>
                    {checked && (correct ? "✓ " : "✗ ")}{item.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {checked && (
        <div className={`p-3 rounded-xl text-sm font-semibold text-center ${score === M_ITEMS.length ? "bg-green-100 text-green-800" : "bg-amber-50 text-amber-800"}`}>
          {score === M_ITEMS.length ? "🎉 Perfect! All sorted correctly." : `${score} / ${M_ITEMS.length} correct — incorrect items shown in red.`}
        </div>
      )}

      {/* Liquidity spectrum */}
      {checked && (
        <div className="bg-muted rounded-xl p-4">
          <p className="text-xs font-bold text-foreground mb-2">Liquidity Spectrum</p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Most liquid</span>
            <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-primary to-amber-400 mx-2" />
            <span className="text-xs text-muted-foreground">Less liquid</span>
          </div>
          <div className="flex justify-between mt-1">
            {["Cash", "Checking", "Savings", "Money Mkt", "CDs"].map(l => (
              <span key={l} className="text-xs text-muted-foreground">{l}</span>
            ))}
          </div>
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
// Station 5 — T-Account Lab + Money Multiplier
// ─────────────────────────────────────────────
const TACCOUNT_REQUIRED = 3;

function TAccountStation({ onComplete }: { onComplete: () => void }) {
  const [deposit, setDeposit] = useState(10);
  const [rr, setRr] = useState(10);
  const [multAnswer, setMultAnswer] = useState("");
  const [multAttempt, setMultAttempt] = useState(0);
  const [multDone, setMultDone] = useState(false);
  const [multMsg, setMultMsg] = useState("");
  const [loanAnswer, setLoanAnswer] = useState("");
  const [loanAttempt, setLoanAttempt] = useState(0);
  const [loanDone, setLoanDone] = useState(false);
  const [loanMsg, setLoanMsg] = useState("");
  // Track completed scenario summaries
  const [completed, setCompleted] = useState<{ deposit: number; rr: number; multiplier: number; total: number }[]>([]);

  const reserves = +(deposit * rr / 100).toFixed(2);
  const loan = +(deposit - reserves).toFixed(2);
  const trueMultiplier = +(100 / rr).toFixed(2);
  const trueTotal = +(trueMultiplier * deposit).toFixed(1);

  const scenarioDone = completed.length >= TACCOUNT_REQUIRED;

  function resetInputs() {
    setMultDone(false); setMultAttempt(0); setMultMsg("");
    setLoanDone(false); setLoanAttempt(0); setLoanMsg("");
    setMultAnswer(""); setLoanAnswer("");
  }

  function handleDepositChange(val: number) {
    setDeposit(val); resetInputs();
  }
  function handleRrChange(val: number) {
    setRr(val); resetInputs();
  }

  function checkMult() {
    const u = parseFloat(multAnswer);
    if (isNaN(u)) return;
    const n = multAttempt + 1;
    setMultAttempt(n);
    if (Math.abs(u - trueMultiplier) <= 0.05) {
      setMultDone(true);
      setMultMsg(`✓ Correct! Multiplier = 1 ÷ ${(rr/100).toFixed(2)} = ${trueMultiplier}`);
    } else if (n === 1) {
      setMultMsg(`Not quite — try again. Formula: 1 ÷ reserve requirement (as decimal)`);
    } else if (n === 2) {
      setMultMsg(`Hint: convert the reserve requirement % to a decimal first, then divide 1 by that number.`);
    } else {
      setMultDone(true);
      setMultMsg(`Answer: 1 ÷ ${(rr/100).toFixed(2)} = ${trueMultiplier}`);
    }
  }

  function checkLoan() {
    const u = parseFloat(loanAnswer);
    if (isNaN(u)) return;
    const n = loanAttempt + 1;
    setLoanAttempt(n);
    if (Math.abs(u - trueTotal) <= trueTotal * 0.02 + 0.5) {
      setLoanDone(true);
      setLoanMsg(`✓ Correct! Total M1 = ${trueMultiplier} × $${deposit}M = $${trueTotal}M`);
      // Record scenario
      setCompleted(prev => [...prev, { deposit, rr, multiplier: trueMultiplier, total: trueTotal }]);
    } else if (n === 1) {
      setLoanMsg(`Not quite — multiply the money multiplier by the initial deposit.`);
    } else if (n === 2) {
      setLoanMsg(`Hint: multiply your multiplier from Step 1 by the initial deposit amount.`);
    } else {
      setLoanDone(true);
      setLoanMsg(`Answer: ${trueMultiplier} × $${deposit}M = $${trueTotal}M`);
      setCompleted(prev => [...prev, { deposit, rr, multiplier: trueMultiplier, total: trueTotal }]);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">How Banks Create Money</p>
        <p>Banks keep only a fraction of deposits as reserves and lend the rest. Each loan becomes a new deposit at another bank — multiplying the money supply.</p>
        <p className="font-mono font-bold text-center text-base mt-2">Money Multiplier = 1 ÷ Reserve Requirement</p>
      </div>

      {/* Progress chips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs font-semibold text-amber-800 mb-2">Try 3 different combinations of deposit amount and reserve requirement to complete this station.</p>
        <div className="flex gap-2">
          {Array.from({ length: TACCOUNT_REQUIRED }).map((_, i) => {
            const sc = completed[i];
            return sc ? (
              <div key={i} className="flex-1 bg-green-100 border border-green-300 rounded-lg px-2 py-1.5 text-center">
                <p className="text-xs font-bold text-green-700">✓ Scenario {i + 1}</p>
                <p className="text-xs text-green-600">${sc.deposit}M · {sc.rr}% RR</p>
                <p className="text-xs text-green-600">×{sc.multiplier} → ${sc.total}M</p>
              </div>
            ) : (
              <div key={i} className="flex-1 bg-white border-2 border-dashed border-amber-300 rounded-lg px-2 py-1.5 text-center">
                <p className="text-xs font-semibold text-amber-400">Scenario {i + 1}</p>
                <p className="text-xs text-amber-300">not yet done</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Initial Deposit ($M)</label>
          <input type="number" min={1} max={100} value={deposit} onChange={e => handleDepositChange(+e.target.value)}
            className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Reserve Requirement (%)</label>
          <input type="number" min={1} max={50} value={rr} onChange={e => handleRrChange(+e.target.value)}
            className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none" />
        </div>
      </div>

      {/* T-Account */}
      <div className="rounded-xl border-2 border-border overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="bg-primary text-primary-foreground px-3 py-2 text-xs font-bold text-center">ASSETS</div>
          <div className="bg-amber-600 text-white px-3 py-2 text-xs font-bold text-center">LIABILITIES</div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Reserves ({rr}%)</span><span className="font-semibold text-foreground">${reserves}M</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Loan (excess)</span><span className="font-semibold text-foreground">${loan}M</span></div>
            <div className="flex justify-between border-t border-border pt-1"><span className="font-bold text-foreground">Total</span><span className="font-bold text-foreground">${deposit}M</span></div>
          </div>
          <div className="p-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Deposits</span><span className="font-semibold text-foreground">${deposit}M</span></div>
            <div className="flex justify-between border-t border-border pt-1"><span className="font-bold text-foreground">Total</span><span className="font-bold text-foreground">${deposit}M</span></div>
          </div>
        </div>
      </div>

      {!scenarioDone && (
        <>
          {/* Step 1 */}
          <div className="bg-card border-2 border-border rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">Step 1: What is the money multiplier?</p>
            <p className="text-xs text-muted-foreground">Formula: Multiplier = 1 ÷ Reserve Requirement (expressed as a decimal)</p>
            <div className="flex gap-2">
              <input type="number" step="0.01" value={multAnswer} onChange={e => setMultAnswer(e.target.value)} disabled={multDone}
                placeholder="Your answer" className="flex-1 border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none disabled:bg-muted" />
              {!multDone && <button onClick={checkMult} disabled={!multAnswer} className="px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl text-sm font-semibold transition">Check</button>}
            </div>
            {multMsg && <p className={`text-xs font-medium ${multDone ? "text-green-700" : "text-amber-700"}`}>{multMsg}</p>}
          </div>

          {/* Step 2 */}
          {multDone && (
            <div className="bg-card border-2 border-border rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Step 2: Total money supply created? ($M)</p>
              <p className="text-xs text-muted-foreground">Formula: Total Money Supply = Multiplier × Initial Deposit</p>
              {!loanDone ? (
                <>
                  <div className="flex gap-2">
                    <input type="number" value={loanAnswer} onChange={e => setLoanAnswer(e.target.value)}
                      placeholder="Your answer" className="flex-1 border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none" />
                    <button onClick={checkLoan} disabled={!loanAnswer} className="px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl text-sm font-semibold transition">Check</button>
                  </div>
                  {loanMsg && <p className="text-xs font-medium text-amber-700">{loanMsg}</p>}
                </>
              ) : (
                <>
                  <p className="text-xs font-medium text-green-700">{loanMsg}</p>
                  <p className="text-xs text-muted-foreground mt-1">Real-world note: Banks may hold excess reserves, and people hold cash — so the actual multiplier is always lower than the formula suggests.</p>
                  {completed.length < TACCOUNT_REQUIRED && (
                    <button onClick={resetInputs} className="mt-2 w-full py-2 bg-amber-500 hover:opacity-90 text-white rounded-xl text-sm font-semibold transition">
                      Try Another Combination ({completed.length}/{TACCOUNT_REQUIRED} done) →
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}

      {scenarioDone && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
          <p className="font-semibold mb-1">All 3 scenarios complete!</p>
          <p>Notice how a lower reserve requirement creates a higher multiplier — and a much larger total money supply from the same initial deposit.</p>
          <p className="mt-1 text-xs">Real-world note: Banks may hold excess reserves, and people hold cash — so the actual multiplier is always lower than the formula suggests.</p>
        </div>
      )}

      <button onClick={onComplete} disabled={!scenarioDone} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 6 — Deposit Expansion Chain
// ─────────────────────────────────────────────
function DepChainStation({ onComplete }: { onComplete: () => void }) {
  const [rr, setRr] = useState(10);
  const [step, setStep] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const initDeposit = 10;

  const banks = ["Singleton Bank", "First National", "Second National", "Third National"];
  const chain = banks.map((name, i) => {
    const newDep = +(initDeposit * Math.pow(1 - rr/100, i)).toFixed(2);
    const req = +(newDep * rr / 100).toFixed(2);
    const newLoan = +(newDep - req).toFixed(2);
    const cumulative = +([...Array(i+1)].reduce((acc, _, j) => acc + initDeposit * Math.pow(1 - rr/100, j), 0)).toFixed(2);
    return { name, newDep, req, newLoan, cumulative };
  });

  const trueTotal = +(initDeposit / (rr/100)).toFixed(1);

  function advance() {
    if (step < banks.length) { setStep(s => s + 1); setEngaged(true); }
  }

  return (
    <div className="space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm text-foreground">
        Starting with a <strong>${initDeposit}M deposit</strong>, watch how money multiplies through the banking system. Adjust the reserve requirement to see how it changes the outcome.
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1">Reserve Requirement: {rr}%</label>
        <input type="range" aria-label="Slider" min={5} max={30} step={5} value={rr} onChange={e => { setRr(+e.target.value); setStep(0); setEngaged(true); }}
          className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground mt-0.5"><span>5% (multiplier: 20)</span><span>30% (multiplier: 3.3)</span></div>
      </div>

      {/* Chain table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-secondary text-secondary-foreground">
              <th className="px-3 py-2 text-left">Bank</th>
              <th className="px-3 py-2 text-right">New Deposit</th>
              <th className="px-3 py-2 text-right">Reserves ({rr}%)</th>
              <th className="px-3 py-2 text-right">New Loan</th>
              <th className="px-3 py-2 text-right font-bold">Total Money</th>
            </tr>
          </thead>
          <tbody>
            {chain.slice(0, step).map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted"}>
                <td className="px-3 py-2 font-medium text-foreground">{row.name}</td>
                <td className="px-3 py-2 text-right text-foreground">${row.newDep}M</td>
                <td className="px-3 py-2 text-right text-muted-foreground">${row.req}M</td>
                <td className="px-3 py-2 text-right text-foreground">${row.newLoan}M</td>
                <td className="px-3 py-2 text-right font-bold text-primary">${row.cumulative}M</td>
              </tr>
            ))}
            {step < banks.length && (
              <tr className="bg-muted/50">
                <td colSpan={5} className="px-3 py-2 text-center text-muted-foreground italic">… continues through many more banks …</td>
              </tr>
            )}
            {step > 0 && (
              <tr className="bg-secondary/30 font-bold">
                <td className="px-3 py-2 text-foreground">Final Total</td>
                <td className="px-3 py-2 text-right text-foreground">${initDeposit}M</td>
                <td className="px-3 py-2 text-right text-foreground">${(initDeposit * rr/100).toFixed(2)}M</td>
                <td className="px-3 py-2 text-right text-foreground">${(initDeposit - initDeposit * rr/100).toFixed(2)}M × chain</td>
                <td className="px-3 py-2 text-right text-primary">${trueTotal}M</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        {step < banks.length
          ? <button onClick={advance} className="flex-1 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition">Next Bank →</button>
          : <button onClick={onComplete} className="flex-1 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>}
        {step > 0 && step < banks.length && <button onClick={() => setStep(banks.length)} className="px-4 py-2 bg-muted hover:bg-accent text-muted-foreground rounded-xl text-sm font-medium transition">Skip to End</button>}
      </div>

      {step === banks.length && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
          <p className="font-semibold">Key Insight</p>
          <p>From a single ${initDeposit}M deposit, the banking system creates <strong>${trueTotal}M</strong> total — a {+(trueTotal/initDeposit).toFixed(1)}× multiplier. All money beyond the original reserves was created by lending.</p>
          <p className="mt-1 text-xs">Try adjusting the reserve requirement above — a lower rate creates more money; a higher rate creates less.</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 7 — Reading the Data (FRED M2)
// ─────────────────────────────────────────────
const FRED_QUESTIONS = [
  {
    q: "Hover over the chart near 2008. Approximately what was the U.S. M2 money supply when the Fed began quantitative easing (QE)?",
    prompt: "Enter your answer in trillions (e.g. 3.0)",
    unit: "T",
    // Accept answers in the range $7.5T–$9.0T (actual ≈ $8.2T)
    check: (v: number) => v >= 7.5 && v <= 9.0,
    hint: "Look for the red dashed line labeled 'QE begins' — hover just to the right of it to read the value.",
    answer: "approximately $8.2 trillion",
    exp: "In 2008 M2 was about $8.2T. The Fed's QE bond-buying program injected massive reserves into the banking system, expanding M2 sharply.",
  },
  {
    q: "Hover over the chart near 2019 and 2021. By roughly how many trillion dollars did M2 increase between 2019 and 2021 during the COVID pandemic?",
    prompt: "Enter the change in trillions (e.g. 2.0)",
    unit: "T",
    // M2 went from ~$15.3T (2019) to ~$21.7T (2021) — change ≈ $6.4T. Accept $4T–$8T.
    check: (v: number) => v >= 4.0 && v <= 8.0,
    hint: "Hover near 2019 to get the starting value, then hover near 2021 for the peak. Subtract to find the change.",
    answer: "approximately $6 trillion",
    exp: "M2 rose from about $15.3T in 2019 to over $21T by 2021 — roughly a $6T jump in two years, driven by QE and COVID stimulus.",
  },
  {
    q: "Hover over the right side of the chart. In approximately what year did M2 reach its peak and begin to decline?",
    prompt: "Enter a year (e.g. 2010)",
    unit: "",
    // Peak was 2022. Accept 2021–2023.
    check: (v: number) => v >= 2021 && v <= 2023,
    hint: "Look for where the line stops rising and starts falling — hover along the top of the curve.",
    answer: "2022",
    exp: "M2 peaked around 2022. As the Fed raised interest rates aggressively, lending slowed and deposits contracted — a rare M2 decline.",
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
  const pad = { l: 44, r: 16, t: 16, b: 32 };

  const years = M2_DATA.map(d => d[0]);
  const yMin = 0, yMax = 24;

  function xScale(yr: number) { return pad.l + ((yr - years[0]) / (years[years.length-1] - years[0])) * (svgW - pad.l - pad.r); }
  function yScale(v: number) { return pad.t + ((yMax - v) / (yMax - yMin)) * (svgH - pad.t - pad.b); }

  const pathD = M2_DATA.map((d, i) => `${i===0?"M":"L"}${xScale(d[0]).toFixed(1)},${yScale(d[1]).toFixed(1)}`).join(" ");

  const annotations = [
    { year: 2008, label: "QE begins", val: 8.2 },
    { year: 2020, label: "COVID stimulus", val: 19.1 },
  ];

  const hData = hoverYear !== null ? M2_DATA.find(d => d[0] === hoverYear) : null;
  // Only show tooltip when all questions done (suppress during Q&A to avoid giving away answers)
  const allDone = results.every(r => r !== null);
  const showTooltip = allDone;

  function checkAnswer() {
    const q = FRED_QUESTIONS[qIdx];
    const raw = answers[qIdx].trim();
    const val = parseFloat(raw);
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

  const currentQDone = results[qIdx] !== null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">U.S. M2 Money Supply, 1980–2024. Hover over the chart to read values — then answer the questions below.</p>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-2"
        onMouseLeave={() => setHoverYear(null)}>
        <svg width={svgW} height={svgH} style={{ display: "block", margin: "0 auto" }}
          role="img" aria-label="Interactive chart — hover to explore data points"
          onMouseMove={e => {
            const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const yr = Math.round(years[0] + ((mx - pad.l) / (svgW - pad.l - pad.r)) * (years[years.length-1] - years[0]));
            if (yr >= years[0] && yr <= years[years.length-1]) setHoverYear(yr);
          }}>
          {/* Grid */}
          {[0,4,8,12,16,20,24].map(v => (
            <line key={v} x1={pad.l} x2={svgW - pad.r} y1={yScale(v)} y2={yScale(v)} stroke="#f1f5f9" strokeWidth="1" />
          ))}
          {/* Axes */}
          <line x1={pad.l} x2={svgW-pad.r} y1={svgH-pad.b} y2={svgH-pad.b} stroke="#94a3b8" strokeWidth="1.5" />
          <line x1={pad.l} x2={pad.l} y1={pad.t} y2={svgH-pad.b} stroke="#94a3b8" strokeWidth="1.5" />
          {/* Y labels */}
          {[0,4,8,12,16,20,24].map(v => (
            <text key={v} x={pad.l-4} y={yScale(v)+3} textAnchor="end" fontSize="8" fill="#94a3b8">${v}T</text>
          ))}
          {/* X labels */}
          {[1980,1990,2000,2010,2020].map(yr => (
            <text key={yr} x={xScale(yr)} y={svgH-pad.b+12} textAnchor="middle" fontSize="8" fill="#94a3b8">{yr}</text>
          ))}
          {/* Annotations */}
          {annotations.map(a => (
            <g key={a.year}>
              <line x1={xScale(a.year)} x2={xScale(a.year)} y1={pad.t} y2={svgH-pad.b} stroke="#fca5a5" strokeWidth="1" strokeDasharray="3,3" />
              <text x={xScale(a.year)+3} y={yScale(a.val)-4} fontSize="7" fill="#ef4444" fontStyle="italic">{a.label}</text>
            </g>
          ))}
          {/* Line */}
          <path d={pathD} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round" />
          {/* Filled area */}
          <path d={`${pathD} L${xScale(years[years.length-1])},${svgH-pad.b} L${xScale(years[0])},${svgH-pad.b} Z`}
            fill="hsl(var(--primary))" fillOpacity="0.08" />
          {/* Hover crosshair — always shown */}
          {hoverYear !== null && <line x1={xScale(hoverYear)} x2={xScale(hoverYear)} y1={pad.t} y2={svgH-pad.b} stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="2,2" />}
          {/* Year label at bottom of crosshair — always shown so student knows where they are */}
          {hoverYear !== null && (
            <text x={xScale(hoverYear)} y={svgH-pad.b-4} textAnchor="middle" fontSize="9" fill="hsl(var(--primary))" fontWeight="bold">{hoverYear}</text>
          )}
          {/* Full tooltip only shown after all questions answered */}
          {showTooltip && hData && (() => {
            const tx = xScale(hData[0]);
            const bx = tx > svgW/2 ? tx - 108 : tx + 8;
            return (
              <g>
                <rect x={bx} y={pad.t} width={100} height={36} rx={5} fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x={bx+8} y={pad.t+14} fontSize="10" fill="#1e293b" fontWeight="bold">{hData[0]}</text>
                <text x={bx+8} y={pad.t+27} fontSize="9" fill="#64748b">M2: ${hData[1].toFixed(2)}T</text>
              </g>
            );
          })()}
        </svg>
        {/* Year + value readout BELOW chart — visible during questions, out of chart area */}
        {hoverYear !== null && !showTooltip && hData && (
          <p className="text-center text-xs font-semibold text-primary mt-1">{hData[0]}: M2 = ${hData[1].toFixed(2)}T</p>
        )}
      </div>

      {/* Question progress dots */}
      <div className="flex items-center justify-center gap-2">
        {FRED_QUESTIONS.map((_, i) => (
          <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
            results[i] === "correct" ? "bg-green-100 border-green-400 text-green-700" :
            results[i] === "revealed" ? "bg-amber-100 border-amber-400 text-amber-700" :
            i === qIdx ? "bg-primary/10 border-primary text-primary" :
            "bg-muted border-border text-muted-foreground"
          }`}>{results[i] === "correct" ? "✓" : results[i] === "revealed" ? "!" : i + 1}</div>
        ))}
        <span className="text-xs text-muted-foreground ml-1">{results.filter(r => r !== null).length} / {FRED_QUESTIONS.length} answered</span>
      </div>

      {/* Active question */}
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Q{qIdx + 1}: {FRED_QUESTIONS[qIdx].q}</p>
        {!currentQDone ? (
          <>
            <div className="flex gap-2 items-center">
              <input
                type="number" step="0.1"
                value={answers[qIdx]}
                onChange={e => { const a = [...answers]; a[qIdx] = e.target.value; setAnswers(a); }}
                placeholder={FRED_QUESTIONS[qIdx].prompt}
                className="flex-1 border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none"
              />
              {FRED_QUESTIONS[qIdx].unit && <span className="text-sm font-semibold text-muted-foreground">{FRED_QUESTIONS[qIdx].unit}</span>}
              <button onClick={checkAnswer} disabled={!answers[qIdx].trim()}
                className="px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl text-sm font-semibold transition">Check</button>
            </div>
            {msgs[qIdx] && <p className="text-xs font-medium text-amber-700">{msgs[qIdx]}</p>}
          </>
        ) : (
          <>
            <p className={`text-xs font-medium ${results[qIdx] === "correct" ? "text-green-700" : "text-amber-700"}`}>{msgs[qIdx]}</p>
            {qIdx < FRED_QUESTIONS.length - 1 && (
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
          { title: "Steady Growth 1980–2019", body: "$1.6T → $15.3T over 40 years. Steady expansion tracking economic growth." },
          { title: "2020 COVID Spike", body: "M2 jumped ~$6T in two years — the Fed's QE and stimulus programs flooded banks with reserves." },
          { title: "Why It Matters", body: "Rapid M2 growth contributed to the 2021–2023 inflation surge. More money chasing the same goods." },
          { title: "2022–2023 Decline", body: "Rare M2 contraction as the Fed raised rates. Reduced lending and increased rate-paying deposits." },
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
// Quiz (10 Qs, Q9+Q10 multi-select)
// ─────────────────────────────────────────────
const QUIZ_QS = [
  {
    q: "Which of the four functions of money allows you to compare the value of a car to the value of a vacation?",
    opts: ["Medium of exchange", "Store of value", "Unit of account", "Standard of deferred payment"],
    correct: 2,
    exp: "Unit of account gives everything a common price in dollars, making comparison across goods and services possible.",
  },
  {
    q: "The 'double coincidence of wants' problem means:",
    opts: ["Both parties want the same thing", "Both parties must want exactly what the other has to offer", "Money must be desired by both parties", "Goods must be divisible for trade"],
    correct: 1,
    exp: "In barter, a trade only works if I want what you have AND you want what I have — a rare coincidence that money eliminates.",
  },
  {
    q: "A U.S. dollar bill is an example of:",
    opts: ["Commodity money, because it is printed on paper", "Fiat money, because it is accepted by government decree with no intrinsic value", "Commodity money, because it was once backed by gold", "Representative money, because it is backed by silver reserves"],
    correct: 1,
    exp: "The U.S. left the gold standard in 1971. Today's dollar is pure fiat — its value rests entirely on trust and legal tender laws.",
  },
  {
    q: "Which item is included in M1 but NOT in M2?",
    opts: ["Certificates of Deposit (CDs)", "Money market mutual funds", "Checkable (demand) deposits", "None — M1 items are always part of M2"],
    correct: 3,
    exp: "M1 is a subset of M2. Every item in M1 (currency, checking deposits) is also in M2. M2 adds less-liquid assets on top.",
  },
  {
    q: "A bank receives $50M in deposits and faces a 10% reserve requirement. How much can it lend?",
    opts: ["$5M", "$10M", "$45M", "$50M"],
    correct: 2,
    exp: "Required reserves = 10% × $50M = $5M. Excess reserves (available to lend) = $50M − $5M = $45M.",
  },
  {
    q: "With a reserve requirement of 5%, the money multiplier is:",
    opts: ["5", "10", "15", "20"],
    correct: 3,
    exp: "Money multiplier = 1 ÷ 0.05 = 20. A lower reserve requirement means more lending at each round and a larger multiplier.",
  },
  {
    q: "When a bank makes a loan, it:",
    opts: ["Transfers existing deposits to the borrower's account", "Creates new money by crediting the borrower's account", "Reduces its own net worth", "Increases required reserves proportionally"],
    correct: 1,
    exp: "Banks create money by crediting a borrower's account — new deposits are created out of thin air, backed by the loan asset. This is how most modern money is created.",
  },
  {
    q: "The 2020 spike in M2 money supply was primarily caused by:",
    opts: ["A surge in consumer borrowing for home purchases", "The Fed's QE program and COVID stimulus flooding banks with reserves", "A reduction in the reserve requirement to 0%", "Rapid growth in certificate of deposit accounts"],
    correct: 1,
    exp: "The Fed purchased trillions in bonds (QE) and the government sent stimulus checks — both dramatically expanded bank reserves and deposits, spiking M2.",
  },
  {
    q: "Which of the following are TRUE about credit cards? (Select all that apply)",
    opts: ["A credit card is not money — it is a short-term loan", "Swiping a credit card increases the cardholder's debt", "Credit cards are included in M1 because they are widely accepted", "The card issuer pays the merchant, creating a liability for the cardholder"],
    correct: [0, 1, 3],
    multi: true,
    exp: "Credit cards are borrowing instruments, not money. The card is not M1 — the bank loan it represents is a liability, not an asset. Acceptance does not make something money.",
  },
  {
    q: "Which of the following would cause the actual money multiplier to be LOWER than the formula (1/rr) predicts? (Select all that apply)",
    opts: ["Banks hold excess reserves beyond the requirement", "People hold cash instead of depositing it (mattress money)", "The Fed raises the reserve requirement", "The economy is growing rapidly and banks are eager to lend"],
    correct: [0, 1],
    multi: true,
    exp: "Excess reserves reduce the amount available to lend each round. Cash held outside banks never re-enters the deposit chain. Both lower the real-world multiplier below 1/rr.",
  },
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
        <p className="text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-xl p-3">
          This screen cannot be submitted. Only the final Results screen counts.
        </p>
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
  if (typeof window !== 'undefined') { try { localStorage.setItem('econlab_done_ch14', 'true'); } catch(e) {} }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-bold text-foreground">Lab Complete!</h2>
          <p className="text-muted-foreground">Chapter 14</p>
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
          <label htmlFor="exit-ticket-textarea" className="text-sm font-semibold text-foreground block">Exit Ticket: In your own words, explain how banks create money through the deposit expansion process.</label>
        <textarea id="exit-ticket-textarea" value={exitTicket} onChange={e => setExitTicket(e.target.value)} rows={4}
            className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none resize-none"
            placeholder="Write your reflection here..." />
        </div>
        <div className="text-center text-xs text-muted-foreground bg-muted rounded-xl p-3">
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
                + '<p style="color:#475569;margin:2px 0">Chapter 14: Money and Banking</p>'
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
function IntroStation({ completed, onSelect, quizUnlocked, onStartQuiz }: {
  completed: Set<Station>; onSelect: (s: Station) => void; quizUnlocked: boolean; onStartQuiz: () => void;
}) {
  const [showSummary, setShowSummary] = useState(false);
  const stations = [
    { id: "recap" as Station, label: "📚 Ch12+13 Recap", desc: "Start here — 5 review questions on Keynesian & Neoclassical policy" },
    { id: "barter" as Station, label: "🔄 Barter vs. Money", desc: "Discover how money solves each of barter's five problems" },
    { id: "moneyornot" as Station, label: "💳 Money or Not?", desc: "Classify debit cards, Bitcoin, CDs, and more" },
    { id: "m1m2" as Station, label: "📊 M1 vs. M2 Builder", desc: "Sort assets by liquidity into the right money supply measure" },
    { id: "taccount" as Station, label: "🏦 T-Account Lab", desc: "Watch how banks create money — and calculate the multiplier" },
    { id: "depchain" as Station, label: "💰 Deposit Expansion Chain", desc: "Follow a deposit through the banking system step by step" },
    { id: "fredchart" as Station, label: "📈 Reading the Data", desc: "FRED: M2 money supply 1980–2024, annotated with key events" },
  ];
  const done = stations.filter(s => completed.has(s.id)).length;

  return (
    <>
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wide mb-4">Chapter 14</span>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Money and Banking</h1>
          <p className="text-muted-foreground text-base">From Barter to Banking — How Money is Created and Measured</p>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4 text-sm text-foreground">
          💡 <strong>Key idea:</strong> Money isn't just coins and bills — it's anything widely accepted as payment. And banks don't just store money; they create it every time they make a loan. Complete all 7 stations in any order, then take the quiz.
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
function Header({ station, onStation, completed }: { station: Station; onStation: (s: Station) => void; completed: Set<Station> }) {
  const stationList: { id: Station; label: string }[] = [
    { id: "intro", label: "Dashboard" },
    { id: "recap", label: "Recap" },
    { id: "barter", label: "Barter" },
    { id: "moneyornot", label: "Money?" },
    { id: "m1m2", label: "M1/M2" },
    { id: "taccount", label: "T-Account" },
    { id: "depchain", label: "Dep. Chain" },
    { id: "fredchart", label: "Data" },
    { id: "quiz", label: "Quiz" },
  ];
  const CONTENT: Station[] = ["recap","barter","moneyornot","m1m2","taccount","depchain","fredchart"];
  const allDone = CONTENT.every(s => completed.has(s));
  const order: Station[] = ["intro","recap","barter","moneyornot","m1m2","taccount","depchain","fredchart","quiz","results","not-yet"];
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
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 14</div>
          </div>
        </div>

        {/* Back to Hub */}
        <a href="https://www.perplexity.ai/computer/a/eco-210-econlab-course-hub-JgrfOPjHQ5iSYovw19FfIg" target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-sidebar-foreground/80 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-sidebar-accent shrink-0">
          ← Course Hub <span className="sr-only">(opens in new tab)</span>
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

  const CONTENT: Station[] = ["recap","barter","moneyornot","m1m2","taccount","depchain","fredchart"];
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
        {station === "barter" && <BarterStation onComplete={() => markComplete("barter")} />}
        {station === "moneyornot" && <MoneyOrNotStation onComplete={() => markComplete("moneyornot")} />}
        {station === "m1m2" && <M1M2Station onComplete={() => markComplete("m1m2")} />}
        {station === "taccount" && <TAccountStation onComplete={() => markComplete("taccount")} />}
        {station === "depchain" && <DepChainStation onComplete={() => markComplete("depchain")} />}
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
