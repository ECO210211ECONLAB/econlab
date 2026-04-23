import { useState, useRef } from "react";
import { ChevronLeft, Award, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "recap" | "spending" | "taxsystem" | "fiscalmatch" | "lags" | "debtcalc" | "fredchart" | "quiz" | "results" | "not-yet";

// ─────────────────────────────────────────────
// FRED Debt/GDP Data (annual %)
// ─────────────────────────────────────────────
const DEBT_GDP: [number, number][] = [
  [1940,52.4],[1941,50.3],[1942,69.7],[1943,105.8],[1944,116.6],[1945,119.0],
  [1946,108.6],[1947,97.8],[1948,87.1],[1949,87.0],[1950,80.2],[1951,66.9],
  [1952,61.6],[1953,58.6],[1954,59.5],[1955,57.2],[1956,53.1],[1957,49.5],
  [1958,50.9],[1959,50.3],[1960,46.0],[1961,46.0],[1962,44.9],[1963,43.1],
  [1964,41.0],[1965,38.9],[1966,35.9],[1967,35.0],[1968,34.8],[1969,30.8],
  [1970,28.0],[1971,28.0],[1972,26.8],[1973,25.5],[1974,24.1],[1975,25.5],
  [1976,27.5],[1977,27.8],[1978,27.0],[1979,25.6],[1980,26.1],[1981,25.8],
  [1982,28.7],[1983,33.1],[1984,34.0],[1985,36.5],[1986,39.5],[1987,40.5],
  [1988,40.9],[1989,40.5],[1990,42.0],[1991,45.3],[1992,48.2],[1993,49.5],
  [1994,49.4],[1995,49.2],[1996,48.5],[1997,46.1],[1998,43.2],[1999,40.5],
  [2000,35.1],[2001,33.0],[2002,34.1],[2003,36.1],[2004,37.1],[2005,36.9],
  [2006,36.3],[2007,35.2],[2008,39.4],[2009,53.5],[2010,60.9],[2011,65.8],
  [2012,70.3],[2013,71.5],[2014,73.8],[2015,73.6],[2016,76.4],[2017,76.0],
  [2018,77.4],[2019,79.2],[2020,100.1],[2021,97.7],[2022,95.2],[2023,97.3],
  [2024,99.0]
];

// ─────────────────────────────────────────────
// Chapter Summary
// ─────────────────────────────────────────────
const CH17_SUMMARY = [
  { heading: "17.1 — Government Spending", body: "Fiscal policy is the set of policies relating to federal government spending, taxation, and borrowing. Federal spending and taxes as a share of GDP have typically fluctuated between 18–22% of GDP in recent decades. State and local spending has risen from about 12–13% to about 20% of GDP over the last four decades. The four main areas of federal spending are national defense, Social Security, healthcare, and interest payments, accounting for about 70% of all federal spending. A budget deficit occurs when spending exceeds taxes; a budget surplus when taxes exceed spending. The sum of all past deficits and surpluses makes up the government debt." },
  { heading: "17.2 — Taxation", body: "The two main federal taxes are individual income taxes and payroll taxes (for Social Security and Medicare), together accounting for more than 80% of federal revenues. Other federal taxes include the corporate income tax, excise taxes, and the estate and gift tax. A progressive tax (e.g. federal income tax) requires those with higher incomes to pay a higher share. A proportional tax (e.g. Medicare payroll tax) applies the same rate to all income levels. A regressive tax (e.g. Social Security payroll tax above a threshold) results in higher-income earners paying a lower share of income in taxes." },
  { heading: "17.3 — Federal Deficits and the National Debt", body: "For most of the twentieth century, the U.S. government took on debt during wartime and paid it down slowly in peacetime. Substantial peacetime deficits emerged in the 1980s and early 1990s, followed by budget surpluses from 1998 to 2001, then annual deficits since 2002, with very large deficits during the 2008–2009 recession. A budget deficit or surplus is measured annually; the national debt is the cumulative sum of all past deficits and surpluses." },
  { heading: "17.4 — Using Fiscal Policy to Fight Recession and Inflation", body: "Expansionary fiscal policy increases aggregate demand through higher government spending or tax reductions. It is most appropriate when an economy is in recession and producing below potential GDP. Contractionary fiscal policy decreases aggregate demand through spending cuts or tax increases. It is most appropriate when an economy is producing above potential GDP." },
  { heading: "17.5 — Automatic Stabilizers", body: "Fiscal policy operates through discretionary fiscal policy (government enacts changes in response to economic events) or through automatic stabilizers (taxing and spending mechanisms that shift automatically without new legislation). The standardized employment budget calculates what the deficit or surplus would have been if the economy had been producing at potential GDP. Critics of fiscal policy point to time lags, impacts on interest rates, and the inherently political nature of fiscal decisions." },
  { heading: "17.6 — Practical Problems with Discretionary Fiscal Policy", body: "Because fiscal policy affects government borrowing in financial capital markets, it can also affect interest rates. If expansionary fiscal policy raises interest rates, firms and households borrow and spend less, reducing aggregate demand — a situation called crowding out. Given uncertainties over interest rate effects, time lags (recognition, legislative, and implementation lags), temporary vs. permanent policy effects, and unpredictable political behavior, many economists have concluded that discretionary fiscal policy is a blunt instrument best reserved for extreme situations." },
  { heading: "17.7 — The Question of a Balanced Budget", body: "Balanced budget amendments are a popular political idea, but the economic merits are questionable. Most economists accept that fiscal policy needs flexibility to accommodate unforeseen expenditures such as wars or recessions. While persistent, large budget deficits can be a problem, a balanced budget amendment prevents even small, temporary deficits that may in some cases be necessary." },
];

// ─────────────────────────────────────────────
// Summary Modal
// ─────────────────────────────────────────────
function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">📄 Chapter 17 Summary</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {CH17_SUMMARY.map((sec, i) => (
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
// Station 1 — Ch15 Recap
// ─────────────────────────────────────────────
const RECAP_QS = [
  { q: "The Federal Reserve's dual mandate requires it to pursue:", opts: ["Low taxes and stable exchange rates", "Maximum employment and price stability (~2% inflation)", "Balanced federal budget and low unemployment", "Financial stability and economic growth"], correct: 1, exp: "The Fed's two statutory goals: maximum employment (targeting ~3.5–4.5% unemployment) and price stability (~2% inflation target)." },
  { q: "In the post-2008 'ample reserves' system, the Fed's primary tool for moving interest rates is:", opts: ["Open Market Operations (buying bonds)", "The reserve requirement", "IORB — Interest on Reserve Balances", "The discount rate"], correct: 2, exp: "With banks holding trillions in excess reserves, the Fed now directly sets the rate it pays banks to park reserves (IORB) to control the federal funds rate." },
  { q: "The ON RRP rate sets a floor for the federal funds rate because:", opts: ["It is always above the IORB rate", "No institution will lend below what the Fed pays them", "The Treasury mandates it as a minimum rate", "It applies only to large commercial banks"], correct: 1, exp: "Money market funds and other non-banks won't lend reserves in the market at below what the Fed pays via ON RRP — arbitrage ensures the FFR stays above this floor." },
  { q: "Expansionary monetary policy reduces unemployment primarily by:", opts: ["Directly hiring unemployed workers", "Lowering interest rates → ↑ borrowing → ↑ C+I → ↑ AD → ↑ GDP", "Raising reserve requirements to force more lending", "Selling Treasury bonds to inject money into circulation"], correct: 1, exp: "Lower rates reduce borrowing costs → consumers and businesses spend and invest more → AD shifts right → GDP rises and unemployment falls." },
  { q: "Which of the following are TRUE about FDIC deposit insurance? (Select all that apply)", opts: ["It protects deposits up to $250,000 per depositor per bank", "It removes the incentive to panic-withdraw during a bank scare", "It is funded by premiums paid by banks, not taxpayers", "It replaced the Fed as lender of last resort after 2008"], correct: [0, 1, 2], multi: true, exp: "FDIC insures up to $250K, is funded by bank premiums, and prevents runs by guaranteeing safety. The Fed's lender-of-last-resort role still exists alongside FDIC." },
];

function RecapStation({ onComplete }: { onComplete: () => void }) {
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const q = RECAP_QS[cur];
  const isMulti = !!(q as any).multi;

  function toggle(i: number) {
    if (submitted) return;
    setSel(prev => isMulti ? (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]) : [i]);
  }

  function submit() {
    if (!sel.length) return;
    const correct = isMulti
      ? ((q as any).correct as number[]).length === sel.length && ((q as any).correct as number[]).every((x: number) => sel.includes(x))
      : sel[0] === q.correct;
    setSubmitted(true);
    if (correct) setScore(s => s + 1);
    setResults(prev => [...prev, correct]);
  }

  function next() {
    if (cur + 1 >= RECAP_QS.length) { setDone(true); return; }
    setCur(c => c + 1); setSel([]); setSubmitted(false);
  }

  const isCorrectNow = () => isMulti
    ? ((q as any).correct as number[]).length === sel.length && ((q as any).correct as number[]).every((x: number) => sel.includes(x))
    : sel[0] === q.correct;

  if (done) return (
    <div className="max-w-xl mx-auto text-center space-y-4 py-6">
      <div className="text-5xl">📚</div>
      <h3 className="text-xl font-bold text-foreground">Ch15 Recap Complete!</h3>
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
          const isCorrect = isMulti ? ((q as any).correct as number[]).includes(i) : q.correct === i;
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
        : <button onClick={next} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">{cur + 1 < RECAP_QS.length ? "Next Question →" : "See Results"}</button>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 2 — Spending Classifier
// ─────────────────────────────────────────────
const SPENDING_ITEMS = [
  { id: 0, item: "Social Security payments", correct: "mandatory", pct: "~25% of federal budget", exp: "Set by existing law — no annual vote needed. Goes out automatically like a mortgage payment." },
  { id: 1, item: "National Defense / Military", correct: "discretionary", pct: "~19% of federal budget", exp: "Approved annually by Congress and the President. One of the largest discretionary programs." },
  { id: 2, item: "Medicare and Medicaid", correct: "mandatory", pct: "~15% of federal budget", exp: "Entitlement programs set by law. Anyone who qualifies automatically receives benefits — no annual vote required." },
  { id: 3, item: "Interest payments on the national debt", correct: "mandatory", pct: "~16% of federal budget", exp: "The government must pay bondholders — no choice. This is now one of the largest budget line items." },
  { id: 4, item: "Education and NASA funding", correct: "discretionary", pct: "~1/3 of federal budget combined with defense", exp: "Congress must vote and appropriate funds each year. Can be cut or expanded in any budget cycle." },
  { id: 5, item: "2020 COVID-19 relief packages", correct: "supplemental", pct: "~$3T in 2020 alone", exp: "Emergency spending passed outside the normal budget cycle when the need is too urgent to wait." },
  { id: 6, item: "Unemployment insurance payments", correct: "mandatory", pct: "Part of mandatory transfers", exp: "Automatic stabilizer — rises automatically in recessions without new legislation. Set by existing law." },
  { id: 7, item: "Transportation infrastructure (non-emergency)", correct: "discretionary", pct: "Part of annual discretionary", exp: "Requires annual Congressional appropriation. The 2021 Infrastructure Investment and Jobs Act is an exception — a one-time large bill." },
];

function SpendingStation({ onComplete }: { onComplete: () => void }) {
  const [placed, setPlaced] = useState<{ [id: number]: string }>({});
  const [checked, setChecked] = useState(false);
  const allPlaced = SPENDING_ITEMS.every(item => placed[item.id]);
  const score = SPENDING_ITEMS.filter(item => placed[item.id] === item.correct).length;

  const buckets = [
    { key: "mandatory", label: "⚙️ Mandatory", color: "border-primary/30 bg-primary/5", textColor: "text-primary" },
    { key: "discretionary", label: "🗳️ Discretionary", color: "border-amber-300 bg-amber-50", textColor: "text-amber-700" },
    { key: "supplemental", label: "🚨 Supplemental", color: "border-red-300 bg-red-50", textColor: "text-red-700" },
  ];

  function place(id: number, bucket: string) {
    if (checked) return;
    setPlaced(prev => ({ ...prev, [id]: bucket }));
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Sort each spending item into <strong>Mandatory</strong> (auto-pilot, set by law), <strong>Discretionary</strong> (annual Congressional vote), or <strong>Supplemental</strong> (emergency add-ons).</p>

      {SPENDING_ITEMS.filter(item => !placed[item.id]).length > 0 && (
        <div className="space-y-2">
          {SPENDING_ITEMS.filter(item => !placed[item.id]).map(item => (
            <div key={item.id} className="bg-card border-2 border-border rounded-xl p-3">
              <p className="text-sm font-semibold text-foreground mb-2">{item.item}</p>
              <div className="flex gap-2 flex-wrap">
                {buckets.map(b => (
                  <button key={b.key} onClick={() => place(item.id, b.key)}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-accent transition min-w-[80px]">
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {Object.keys(placed).length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {buckets.map(b => (
            <div key={b.key} className={`rounded-xl border-2 p-2 min-h-[60px] ${b.color}`}>
              <p className={`text-xs font-bold mb-1.5 ${b.textColor}`}>{b.label}</p>
              {SPENDING_ITEMS.filter(item => placed[item.id] === b.key).map(item => {
                const correct = checked ? item.correct === b.key : null;
                return (
                  <div key={item.id} className={`text-xs mb-1 p-1.5 rounded-lg leading-snug ${checked ? (correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700") : "bg-white text-foreground"}`}>
                    {checked && (correct ? "✓ " : "✗ ")}{item.item}
                    {checked && correct && <p className="text-xs text-green-700 mt-0.5">{item.pct}</p>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {checked && (
        <>
          <div className={`p-3 rounded-xl text-sm font-semibold text-center ${score === SPENDING_ITEMS.length ? "bg-green-100 text-green-800" : "bg-amber-50 text-amber-800"}`}>
            {score === SPENDING_ITEMS.length ? "🎉 Perfect! All 8 sorted correctly." : `${score} / ${SPENDING_ITEMS.length} correct — incorrect items shown in red.`}
          </div>
          {SPENDING_ITEMS.filter(item => placed[item.id] !== item.correct).map(item => (
            <div key={item.id} className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
              <span className="font-semibold">{item.item}</span> → should be <strong>{item.correct}</strong>: {item.exp}
            </div>
          ))}
        </>
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
// Station 3 — Tax System Sorter + Calculator
// ─────────────────────────────────────────────
const TAX_ITEMS = [
  { id: 0, name: "Federal income tax (10%–37%)", correct: "progressive", exp: "Rate rises with income. A taxpayer earning $60K pays 10% on the first bracket, 12% on the next, 22% on income above $48K — never 22% on all $60K." },
  { id: 1, name: "Medicare payroll tax (2.9%, no ceiling)", correct: "proportional", exp: "Everyone pays the same 2.9% regardless of income level — no cap, no variation." },
  { id: 2, name: "Social Security payroll tax (only on first ~$160K)", correct: "regressive", exp: "Someone earning $80K pays SS tax on 100% of income. Someone earning $320K pays on only 50%. The effective rate falls as income rises." },
  { id: 3, name: "Flat sales tax (e.g., 7% state sales tax)", correct: "regressive", exp: "Both earners pay the same dollar amount on purchases, but a lower-income household spends a higher % of income — making the effective rate regressive." },
  { id: 4, name: "Capital gains tax (0%, 15%, or 20% based on income)", correct: "progressive", exp: "Higher income levels pay a higher rate on investment gains, making it progressive — though lower-income earners often pay 0%." },
];

// 2025 federal tax brackets (single filer)
const BRACKETS = [
  { min: 0, max: 11925, rate: 0.10 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: Infinity, rate: 0.37 },
];

function calcTax(income: number) {
  let tax = 0;
  for (const b of BRACKETS) {
    if (income <= b.min) break;
    const taxable = Math.min(income, b.max) - b.min;
    tax += taxable * b.rate;
  }
  return tax;
}

function TaxStation({ onComplete }: { onComplete: () => void }) {
  const [placed, setPlaced] = useState<{ [id: number]: string }>({});
  const [checked, setChecked] = useState(false);
  const [income, setIncome] = useState(60000);
  const [showCalc, setShowCalc] = useState(false);

  const allPlaced = TAX_ITEMS.every(t => placed[t.id]);
  const score = TAX_ITEMS.filter(t => placed[t.id] === t.correct).length;
  const taxOwed = calcTax(income);
  const avgRate = income > 0 ? (taxOwed / income * 100) : 0;
  const marginalRate = BRACKETS.find(b => income > b.min && income <= b.max)?.rate ?? 0.37;

  const buckets = [
    { key: "progressive", label: "📈 Progressive", color: "border-primary/30 bg-primary/5", textColor: "text-primary" },
    { key: "proportional", label: "➡️ Proportional", color: "border-green-300 bg-green-50", textColor: "text-green-700" },
    { key: "regressive", label: "📉 Regressive", color: "border-amber-300 bg-amber-50", textColor: "text-amber-700" },
  ];

  function place(id: number, bucket: string) {
    if (checked) return;
    setPlaced(prev => ({ ...prev, [id]: bucket }));
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Sort each tax into Progressive, Proportional, or Regressive. Then use the marginal vs. average rate calculator to see how progressive taxes actually work.</p>

      {TAX_ITEMS.filter(t => !placed[t.id]).length > 0 && (
        <div className="space-y-2">
          {TAX_ITEMS.filter(t => !placed[t.id]).map(item => (
            <div key={item.id} className="bg-card border-2 border-border rounded-xl p-3">
              <p className="text-sm font-semibold text-foreground mb-2">{item.name}</p>
              <div className="flex gap-2">
                {buckets.map(b => (
                  <button key={b.key} onClick={() => place(item.id, b.key)}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-accent transition">
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {Object.keys(placed).length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {buckets.map(b => (
            <div key={b.key} className={`rounded-xl border-2 p-2 min-h-[50px] ${b.color}`}>
              <p className={`text-xs font-bold mb-1.5 ${b.textColor}`}>{b.label}</p>
              {TAX_ITEMS.filter(t => placed[t.id] === b.key).map(item => {
                const correct = checked ? item.correct === b.key : null;
                return (
                  <div key={item.id} className={`text-xs mb-1 p-1.5 rounded-lg ${checked ? (correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700") : "bg-white text-foreground"}`}>
                    {checked && (correct ? "✓ " : "✗ ")}{item.name}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {checked && score < TAX_ITEMS.length && (
        <div className="space-y-1">
          {TAX_ITEMS.filter(t => placed[t.id] !== t.correct).map(item => (
            <div key={item.id} className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
              <span className="font-semibold">{item.name}</span> → <strong>{item.correct}</strong>: {item.exp}
            </div>
          ))}
        </div>
      )}

      {checked && (
        <div className={`p-2 rounded-xl text-sm font-semibold text-center ${score === TAX_ITEMS.length ? "bg-green-100 text-green-800" : "bg-amber-50 text-amber-800"}`}>
          {score === TAX_ITEMS.length ? "🎉 Perfect sort!" : `${score} / ${TAX_ITEMS.length} correct.`}
        </div>
      )}

      {allPlaced && !checked && (
        <button onClick={() => setChecked(true)} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Check My Sorting</button>
      )}

      {/* Marginal vs. Average Calculator */}
      {checked && (
        <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
          <button onClick={() => setShowCalc(s => !s)} className="w-full flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">🧮 Marginal vs. Average Rate Calculator</p>
            <span className="text-muted-foreground">{showCalc ? "▲" : "▼"}</span>
          </button>
          {showCalc && (
            <>
              <p className="text-xs text-muted-foreground">Adjust the income slider to see how your marginal rate (on the next dollar) differs from your average rate (total taxes ÷ income). Uses 2025 federal brackets — single filer.</p>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Income: <strong className="text-foreground">${income.toLocaleString()}</strong></span>
                  <span>$0 — $400K</span>
                </div>
                <input type="range" aria-label="Slider" min={0} max={400000} step={1000} value={income}
                  onChange={e => setIncome(+e.target.value)}
                  className="w-full accent-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{(marginalRate * 100).toFixed(0)}%</p>
                  <p className="text-xs text-foreground font-semibold mt-0.5">Marginal Rate</p>
                  <p className="text-xs text-muted-foreground">on next $1 earned</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-amber-700">{avgRate.toFixed(1)}%</p>
                  <p className="text-xs text-foreground font-semibold mt-0.5">Average Rate</p>
                  <p className="text-xs text-muted-foreground">effective tax rate</p>
                </div>
              </div>
              <div className="bg-muted rounded-xl p-3 text-xs text-foreground">
                <p><strong>Tax owed:</strong> ${taxOwed.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p className="mt-1 text-muted-foreground">In a progressive system, your marginal rate is always higher than your average rate. You are <em>never</em> taxed at your marginal rate on all your income.</p>
              </div>
            </>
          )}
        </div>
      )}

      {checked && (
        <button onClick={onComplete} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 4 — Fiscal Policy Matcher
// ─────────────────────────────────────────────
const FISCAL_SCENARIOS = [
  {
    id: 0, label: "Deep Recession",
    situation: "GDP is 5% below potential. Unemployment is at 8%. Consumer and business confidence have collapsed. Inflation is near 0%.",
    correct: "expansionary",
    tools: ["↑ Government spending on infrastructure", "↓ Income taxes to boost disposable income", "↑ Interest rates to cool borrowing", "↓ Government transfer payments"],
    correctTools: [0, 1],
    adShift: "right",
    exp: "Expansionary fiscal policy shifts AD right — government spending directly adds to GDP; tax cuts boost consumption (C). Both restore output toward potential.",
  },
  {
    id: 1, label: "Overheating Economy",
    situation: "GDP is 3% above potential. Unemployment is at 3%. Inflation is running at 6%. The economy is clearly overheating.",
    correct: "contractionary",
    tools: ["↑ Government spending on new programs", "↑ Taxes to reduce disposable income", "↓ Government spending and cut programs", "↓ Reserve requirements for banks"],
    correctTools: [1, 2],
    adShift: "left",
    exp: "Contractionary fiscal policy shifts AD left — tax hikes reduce consumption; spending cuts reduce G directly. Both cool inflationary pressure.",
  },
  {
    id: 2, label: "Mild Slowdown",
    situation: "Growth has slowed to 1% (below trend of 2.5%). Unemployment is at 5%, slightly above natural rate. Inflation is at 2% — right on target.",
    correct: "expansionary",
    tools: ["Targeted tax credits for investment", "Broad tax cuts and large spending increases", "Raise taxes to build budget surplus", "Leave policy unchanged — let automatic stabilizers work"],
    correctTools: [0, 3],
    adShift: "right",
    exp: "A mild slowdown with on-target inflation calls for modest stimulus or relying on automatic stabilizers. Broad, large-scale action risks overshooting.",
  },
];

function FiscalMatchStation({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);
  const [selectedTools, setSelectedTools] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const s = FISCAL_SCENARIOS[current];

  function toggleTool(i: number) {
    if (submitted) return;
    setSelectedTools(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  }

  function submit() {
    const correct = s.correctTools.length === selectedTools.length && s.correctTools.every(x => selectedTools.includes(x));
    setSubmitted(true);
    setScores(prev => [...prev, correct]);
  }

  function next() {
    if (current + 1 >= FISCAL_SCENARIOS.length) { setDone(true); return; }
    setCurrent(c => c + 1); setSelectedTools([]); setSubmitted(false);
  }

  // Simple SVG AD diagram
  function AdDiagram({ shift }: { shift: "left" | "right" }) {
    const svgW = 160, svgH = 120;
    const pad = { l: 24, r: 8, t: 12, b: 20 };
    const w = svgW - pad.l - pad.r, h = svgH - pad.t - pad.b;

    // AD0 baseline
    const ad0x1 = pad.l + w * 0.1, ad0y1 = pad.t + h * 0.15;
    const ad0x2 = pad.l + w * 0.85, ad0y2 = pad.t + h * 0.9;
    // AD1 shifted
    const offset = shift === "right" ? w * 0.2 : -w * 0.2;
    // AS upward
    const asx1 = pad.l + w * 0.15, asy1 = pad.t + h * 0.9;
    const asx2 = pad.l + w * 0.9, asy2 = pad.t + h * 0.05;

    return (
      <svg width={svgW} height={svgH} style={{ display: "block" }} role="img" aria-label="Interactive data chart. Use mouse to hover over data points for values.">
        <line x1={pad.l} x2={pad.l} y1={pad.t} y2={pad.t + h} stroke="#94a3b8" strokeWidth="1.5" />
        <line x1={pad.l} x2={pad.l + w} y1={pad.t + h} y2={pad.t + h} stroke="#94a3b8" strokeWidth="1.5" />
        <text x={pad.l + w / 2} y={svgH - 2} textAnchor="middle" fontSize="7" fill="#94a3b8">Real GDP</text>
        <text x={pad.l - 14} y={pad.t + h / 2} textAnchor="middle" fontSize="7" fill="#94a3b8" transform={`rotate(-90,${pad.l - 14},${pad.t + h / 2})`}>Price Level</text>
        {/* AS */}
        <line x1={asx1} y1={asy1} x2={asx2} y2={asy2} stroke="#10b981" strokeWidth="1.5" />
        <text x={asx2 + 2} y={asy2} fontSize="7" fill="#10b981">AS</text>
        {/* AD0 */}
        <line x1={ad0x1} y1={ad0y1} x2={ad0x2} y2={ad0y2} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" />
        <text x={ad0x2} y={ad0y2 + 8} fontSize="7" fill="#94a3b8">AD₀</text>
        {/* AD1 */}
        <line x1={ad0x1 + offset} y1={ad0y1} x2={ad0x2 + offset} y2={ad0y2} stroke={shift === "right" ? "#3b82f6" : "#ef4444"} strokeWidth="2" />
        <text x={ad0x2 + offset + 2} y={ad0y2 + 8} fontSize="7" fill={shift === "right" ? "#3b82f6" : "#ef4444"}>AD₁</text>
        {/* Arrow */}
        <text x={(ad0x1 + ad0x1 + offset) / 2} y={pad.t + h * 0.5} fontSize="12" fill={shift === "right" ? "#3b82f6" : "#ef4444"} textAnchor="middle">{shift === "right" ? "→" : "←"}</text>
      </svg>
    );
  }

  if (done) {
    const total = scores.filter(Boolean).length;
    return (
      <div className="max-w-xl mx-auto text-center space-y-4 py-6">
        <div className="text-5xl">🎯</div>
        <h3 className="text-xl font-bold text-foreground">Fiscal Policy Matcher Complete!</h3>
        <p className="text-muted-foreground">You matched <span className="font-bold text-primary">{total} / {FISCAL_SCENARIOS.length}</span> scenarios correctly.</p>
        <div className="flex justify-center gap-2">{scores.map((r, i) => <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold ${r ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{FISCAL_SCENARIOS[i].label} {r ? "✓" : "✗"}</span>)}</div>
        <button onClick={onComplete} className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex justify-between text-xs text-muted-foreground"><span>Scenario {current + 1} of {FISCAL_SCENARIOS.length}</span><span>Select 2 correct tools</span></div>
      <div className="bg-muted rounded-xl p-4">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full mr-2 ${s.correct === "expansionary" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>{s.label}</span>
        <p className="mt-2 font-semibold text-foreground text-sm leading-snug">{s.situation}</p>
      </div>
      <div className="space-y-2">
        {s.tools.map((tool, i) => {
          const isSel = selectedTools.includes(i);
          const isCorrect = s.correctTools.includes(i);
          let cls = "w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition ";
          if (!submitted) cls += isSel ? "border-primary bg-primary/10 text-foreground font-medium" : "border-border bg-card hover:border-primary/40 text-foreground";
          else if (isCorrect) cls += "border-green-500 bg-green-50 text-green-800 font-medium";
          else if (isSel) cls += "border-red-400 bg-red-50 text-red-700";
          else cls += "border-border bg-card text-muted-foreground";
          return <button key={i} className={cls} onClick={() => toggleTool(i)} disabled={submitted}>{submitted && isCorrect ? "✓ " : submitted && isSel ? "✗ " : ""}{tool}</button>;
        })}
      </div>
      {submitted && (
        <div className="flex gap-3 items-start">
          <AdDiagram shift={s.adShift as "left" | "right"} />
          <div className={`flex-1 p-3 rounded-xl text-sm border-l-4 ${scores[scores.length - 1] ? "border-green-400 bg-green-50 text-green-800" : "border-amber-400 bg-amber-50 text-amber-800"}`}>
            <span className="font-semibold">{scores[scores.length - 1] ? "✓ Correct! " : "Not quite. "}</span>{s.exp}
          </div>
        </div>
      )}
      {!submitted
        ? <button onClick={submit} disabled={selectedTools.length !== 2} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">Submit Answer</button>
        : <button onClick={next} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">{current + 1 < FISCAL_SCENARIOS.length ? "Next Scenario →" : "See Results"}</button>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 5 — Three Lags Explorer
// ─────────────────────────────────────────────
const LAGS = [
  {
    name: "Recognition Lag",
    icon: "🔍",
    color: "border-amber-300 bg-amber-50",
    tagColor: "bg-amber-100 text-amber-700",
    duration: "3–6 months",
    body: "The economy must deteriorate for months before data confirms a recession. GDP data is released quarterly and revised multiple times. By the time the NBER officially declares a recession, the trough may already have passed.",
    example: "The 2007–09 recession began in December 2007. The NBER didn't officially declare it until December 2008 — a full year later.",
  },
  {
    name: "Legislative Lag",
    icon: "🏛️",
    color: "border-primary/30 bg-primary/5",
    tagColor: "bg-primary/15 text-primary",
    duration: "6–18 months",
    body: "A stimulus bill must pass committee hearings, floor votes in both chambers, and receive presidential signature. Major legislation can take 6 to 18 months. Political disagreements, amendments, and negotiations add time.",
    example: "The 2009 American Recovery and Reinvestment Act (ARRA, $830B) was signed on Feb 17, 2009 — but the recession had started 14 months earlier.",
  },
  {
    name: "Implementation Lag",
    icon: "⚙️",
    color: "border-green-300 bg-green-50",
    tagColor: "bg-green-100 text-green-700",
    duration: "Months to years",
    body: "Once a bill passes, funds must be disbursed, contracts awarded, and projects started. Infrastructure spending can take years to fully deploy — 'shovel-ready' projects are rarer than politicians claim.",
    example: "Of the 2009 ARRA's $275B in tax cuts, only ~10% flowed out in the first year. The infrastructure portions took 3+ years to fully spend.",
  },
];

function LagsStation({ onComplete }: { onComplete: () => void }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{ [k: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [k: number]: boolean }>({});
  const allExpanded = expanded.size === LAGS.length;

  const quizQs = [
    { q: "A recession begins in January. By what month might the Fed/Congress even confirm it?", opts: ["February", "March–June", "December–January of next year"], correct: 1 },
    { q: "Which lag is most responsible for stimulus arriving after the recession has ended?", opts: ["Recognition lag", "Legislative lag", "Implementation lag", "All three combined"], correct: 3 },
  ];

  function answerQuiz(qi: number, ai: number) {
    if (quizSubmitted[qi]) return;
    setQuizAnswers(prev => ({ ...prev, [qi]: ai }));
    setQuizSubmitted(prev => ({ ...prev, [qi]: true }));
  }

  const allQuizDone = quizQs.every((_, i) => quizSubmitted[i]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Fiscal policy has three timing problems. Expand each lag to understand why stimulus often arrives too late — then test your understanding.</p>

      <div className="space-y-3">
        {LAGS.map((lag, i) => {
          const isExp = expanded.has(i);
          return (
            <button key={i} onClick={() => setExpanded(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all ${isExp ? lag.color : "border-border bg-card hover:border-primary/40"}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lag.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{lag.name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${lag.tagColor}`}>{lag.duration}</span>
                  </div>
                </div>
                <span className="text-muted-foreground">{isExp ? "▲" : "▼"}</span>
              </div>
              {isExp && (
                <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                  <p className="text-sm text-foreground leading-relaxed">{lag.body}</p>
                  <div className="bg-white rounded-xl p-3 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-0.5">Real example</p>
                    <p className="text-xs text-foreground">{lag.example}</p>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Timeline visual */}
      {allExpanded && (
        <div className="bg-muted rounded-xl p-4">
          <p className="text-xs font-bold text-foreground mb-3">Combined Timeline: Typical Fiscal Policy Delay</p>
          <div className="relative h-8">
            <div className="absolute inset-0 flex rounded-lg overflow-hidden">
              <div className="flex-1 bg-amber-400 flex items-center justify-center"><span className="text-xs font-bold text-amber-900">Recognition</span></div>
              <div className="flex-1 bg-primary/70 flex items-center justify-center"><span className="text-xs font-bold text-white">Legislative</span></div>
              <div className="flex-1 bg-green-500 flex items-center justify-center"><span className="text-xs font-bold text-white">Implementation</span></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Recession starts</span>
            <span>~12–24+ months later: Policy arrives</span>
          </div>
          <p className="text-xs text-foreground mt-2 font-medium">"While the economist is accustomed to the concept of lags, the politician likes instant results." — George P. Shultz</p>
        </div>
      )}

      {/* Quick questions */}
      {allExpanded && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick Check</p>
          {quizQs.map((qz, qi) => (
            <div key={qi} className="bg-card border border-border rounded-xl p-3 space-y-2">
              <p className="text-sm font-semibold text-foreground">{qz.q}</p>
              <div className="flex gap-2 flex-wrap">
                {qz.opts.map((opt, ai) => {
                  const isSubmitted = quizSubmitted[qi];
                  const isSel = quizAnswers[qi] === ai;
                  const isCorrect = ai === qz.correct;
                  let cls = "flex-1 text-xs px-2 py-1.5 rounded-lg border font-medium transition min-w-[80px] ";
                  if (!isSubmitted) cls += isSel ? "border-primary bg-primary/10 text-foreground" : "border-border bg-white text-foreground hover:border-primary/40";
                  else if (isCorrect) cls += "border-green-400 bg-green-50 text-green-800";
                  else if (isSel) cls += "border-red-400 bg-red-50 text-red-700";
                  else cls += "border-border bg-white text-muted-foreground";
                  return <button key={ai} className={cls} onClick={() => answerQuiz(qi, ai)} disabled={isSubmitted}>{opt}</button>;
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={onComplete} disabled={!allExpanded || !allQuizDone}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 6 — Deficit vs. Debt Calculator
// ─────────────────────────────────────────────
function DebtCalcStation({ onComplete }: { onComplete: () => void }) {
  const initRows = [
    { revenue: 400, spending: 500 },
    { revenue: 600, spending: 800 },
    { revenue: 700, spending: 650 },
  ];
  const [rows, setRows] = useState(initRows);
  const [engaged, setEngaged] = useState(false);

  function update(i: number, field: "revenue" | "spending", val: number) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
    setEngaged(true);
  }

  let cumDebt = 0;
  const computed = rows.map(r => {
    const balance = r.revenue - r.spending;
    cumDebt += balance < 0 ? Math.abs(balance) : -Math.min(Math.abs(balance), cumDebt);
    const debt = Math.max(0, cumDebt);
    cumDebt = debt;
    return { ...r, balance, debt };
  });

  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const totalSpending = rows.reduce((s, r) => s + r.spending, 0);
  const finalDebt = computed[computed.length - 1].debt;

  return (
    <div className="space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">Deficit ≠ Debt</p>
        <p><strong>Deficit</strong> = spending minus revenue in <em>one year</em> (flow). <strong>Debt</strong> = accumulated sum of all past deficits minus surpluses (stock). A surplus reduces debt; a deficit adds to it.</p>
      </div>

      <p className="text-sm text-muted-foreground">Edit revenue and spending for each year. Watch how annual deficits or surpluses build the cumulative national debt.</p>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-1/5" />
            <col className="w-1/5" />
            <col className="w-1/5" />
            <col className="w-1/5" />
            <col className="w-1/5" />
          </colgroup>
          <thead>
            <tr className="bg-secondary text-secondary-foreground">
              <th className="px-3 py-2 text-left text-xs">Year</th>
              <th className="px-3 py-2 text-right text-xs">Revenue ($B)</th>
              <th className="px-3 py-2 text-right text-xs">Spending ($B)</th>
              <th className="px-3 py-2 text-right text-xs">Balance</th>
              <th className="px-3 py-2 text-right text-xs font-bold">Cumulative Debt</th>
            </tr>
          </thead>
          <tbody>
            {computed.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted"}>
                <td className="px-3 py-2 font-medium text-foreground">Year {i + 1}</td>
                <td className="px-2 py-1 text-right">
                  <input type="number" value={row.revenue} min={0} max={2000}
                    onChange={e => update(i, "revenue", +e.target.value)}
                    className="w-full text-right border border-border rounded-lg px-2 py-1 text-xs bg-card text-foreground focus:border-primary focus:outline-none" />
                </td>
                <td className="px-2 py-1 text-right">
                  <input type="number" value={row.spending} min={0} max={2000}
                    onChange={e => update(i, "spending", +e.target.value)}
                    className="w-full text-right border border-border rounded-lg px-2 py-1 text-xs bg-card text-foreground focus:border-primary focus:outline-none" />
                </td>
                <td className={`px-3 py-2 text-right text-xs font-semibold ${row.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                  {row.balance < 0 ? `-$${Math.abs(row.balance)}B` : `+$${row.balance}B`}
                </td>
                <td className="px-3 py-2 text-right text-xs font-bold text-primary">${row.debt}B</td>
              </tr>
            ))}
            <tr className="bg-secondary/30 font-bold text-xs">
              <td className="px-3 py-2 text-foreground">Total</td>
              <td className="px-3 py-2 text-right text-foreground">${totalRevenue}B</td>
              <td className="px-3 py-2 text-right text-foreground">${totalSpending}B</td>
              <td className={`px-3 py-2 text-right font-bold ${totalRevenue - totalSpending < 0 ? "text-red-600" : "text-green-600"}`}>{totalRevenue - totalSpending < 0 ? `-$${Math.abs(totalRevenue - totalSpending)}B` : `+$${totalRevenue - totalSpending}B`}</td>
              <td className="px-3 py-2 text-right text-primary">${finalDebt}B</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-muted rounded-xl p-3">
          <p className="text-xs font-bold text-foreground mb-1">Key Insight: Debt/GDP</p>
          <p className="text-xs text-muted-foreground leading-snug">Raw debt numbers mislead. A $100B debt is trivial for a $1T economy but crushing for a $200B economy. Always compare debt to GDP.</p>
        </div>
        <div className="bg-muted rounded-xl p-3">
          <p className="text-xs font-bold text-foreground mb-1">Can Debt Fall With Deficits?</p>
          <p className="text-xs text-muted-foreground leading-snug">Yes — if GDP grows faster than debt, the ratio falls. The U.S. ran near-continuous deficits from WWII to 1980, yet debt/GDP fell from 119% to 26%.</p>
        </div>
      </div>

      <button onClick={onComplete} disabled={!engaged}
        className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
        Mark Complete ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 7 — Reading the Data (FRED Debt/GDP)
// ─────────────────────────────────────────────
const DEBT_QUESTIONS = [
  {
    q: "Hover near 1945. Approximately what was the U.S. federal debt as a percentage of GDP at its WWII peak?",
    prompt: "Enter your answer in % (e.g. 50.0)",
    unit: "%",
    check: (v: number) => v >= 115 && v <= 122,
    hint: "Look for the tallest point on the left side of the chart — hover around 1944–1945 and read the value below the chart.",
    answer: "approximately 119%",
    exp: "Federal debt peaked at 119% of GDP in 1945, driven by massive WWII spending. Remarkably, the debt was never fully 'paid off' — instead, decades of economic growth caused the ratio to fall steadily to just 24% by 1974.",
  },
  {
    q: "Hover over the mid-1970s. Approximately what was the LOWEST debt/GDP ratio reached after the post-WWII decline?",
    prompt: "Enter your answer in % (e.g. 40.0)",
    unit: "%",
    check: (v: number) => v >= 22 && v <= 28,
    hint: "Look for the lowest point on the chart — it occurs in the mid-1970s before the Reagan-era rise begins.",
    answer: "approximately 24%",
    exp: "Debt/GDP reached its post-WWII low of about 24% in 1974. From there, tax cuts and increased defense and social spending under Reagan reversed the trend, pushing debt/GDP back above 40% by the late 1980s.",
  },
  {
    q: "Hover near 2019–2021. In approximately what year did federal debt first cross 100% of GDP since World War II?",
    prompt: "Enter a year (e.g. 2015)",
    unit: "",
    check: (v: number) => v >= 2019 && v <= 2021,
    hint: "Look for the red dashed 100% reference line on the chart — hover along the right side to find where the line crosses it.",
    answer: "2020",
    exp: "Federal debt crossed 100% of GDP in 2020 for the first time since WWII, reaching 100.1%. The COVID-19 pandemic triggered over $3 trillion in emergency relief spending while tax revenues fell — producing the largest single-year deficit since WWII.",
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
  const pad = { l: 40, r: 16, t: 16, b: 32 };

  const years = DEBT_GDP.map(d => d[0]);
  const yMax = 130;

  function xScale(yr: number) { return pad.l + ((yr - years[0]) / (years[years.length-1] - years[0])) * (svgW - pad.l - pad.r); }
  function yScale(v: number) { return pad.t + ((yMax - v) / yMax) * (svgH - pad.t - pad.b); }

  const pathD = DEBT_GDP.map((d, i) => `${i===0?"M":"L"}${xScale(d[0]).toFixed(1)},${yScale(d[1]).toFixed(1)}`).join(" ");
  const hData = hoverYear !== null ? DEBT_GDP.find(d => d[0] === hoverYear) : null;

  const annotations = [
    { year: 1945, label: "WWII peak", val: 119 },
    { year: 1982, label: "Reagan deficits", val: 65 },
    { year: 2009, label: "Great Recession", val: 80 },
    { year: 2020, label: "COVID", val: 115 },
  ];

  const y100 = yScale(100);
  const allDone = results.every(r => r !== null);
  const showTooltip = allDone;
  const currentQDone = results[qIdx] !== null;

  function checkAnswer() {
    const q = DEBT_QUESTIONS[qIdx];
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
      <p className="text-sm text-muted-foreground">U.S. Federal Debt as % of GDP, 1940–2024. Hover over the chart to read values — then answer the questions below.</p>

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
          {[0,25,50,75,100,125].map(v => (
            <line key={v} x1={pad.l} x2={svgW-pad.r} y1={yScale(v)} y2={yScale(v)} stroke={v === 100 ? "#fca5a5" : "#f1f5f9"} strokeWidth={v === 100 ? 1.5 : 1} strokeDasharray={v === 100 ? "4,3" : undefined} />
          ))}
          <text x={svgW - pad.r + 2} y={y100 + 3} fontSize="7" fill="#ef4444">100%</text>
          <line x1={pad.l} x2={svgW-pad.r} y1={svgH-pad.b} y2={svgH-pad.b} stroke="#94a3b8" strokeWidth="1.5" />
          <line x1={pad.l} x2={pad.l} y1={pad.t} y2={svgH-pad.b} stroke="#94a3b8" strokeWidth="1.5" />
          {[0,25,50,75,100,125].map(v => (
            <text key={v} x={pad.l-4} y={yScale(v)+3} textAnchor="end" fontSize="8" fill="#94a3b8">{v}%</text>
          ))}
          {[1940,1960,1980,2000,2020].map(yr => (
            <text key={yr} x={xScale(yr)} y={svgH-pad.b+12} textAnchor="middle" fontSize="8" fill="#94a3b8">{yr}</text>
          ))}
          {annotations.map(a => (
            <g key={a.year}>
              <line x1={xScale(a.year)} x2={xScale(a.year)} y1={pad.t} y2={svgH-pad.b} stroke="#fca5a5" strokeWidth="1" strokeDasharray="3,3" />
              <text x={xScale(a.year)+3} y={yScale(a.val)-3} fontSize="7" fill="#ef4444" fontStyle="italic">{a.label}</text>
            </g>
          ))}
          <path d={pathD} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round" />
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
            const bx = tx > svgW / 2 ? tx - 112 : tx + 8;
            return (
              <g>
                <rect x={bx} y={pad.t} width={104} height={36} rx={5} fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x={bx+8} y={pad.t+14} fontSize="10" fill="#1e293b" fontWeight="bold">{hData[0]}</text>
                <text x={bx+8} y={pad.t+27} fontSize="9" fill="#64748b">Debt/GDP: {hData[1].toFixed(1)}%</text>
              </g>
            );
          })()}
        </svg>
        {/* Value readout below chart during Q&A */}
        {hoverYear !== null && !showTooltip && hData && (
          <p className="text-center text-xs font-semibold text-primary mt-1">{hData[0]}: Debt/GDP = {hData[1].toFixed(1)}%</p>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {DEBT_QUESTIONS.map((_, i) => (
          <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
            results[i] === "correct" ? "bg-green-100 border-green-400 text-green-700" :
            results[i] === "revealed" ? "bg-amber-100 border-amber-400 text-amber-700" :
            i === qIdx ? "bg-primary/10 border-primary text-primary" :
            "bg-muted border-border text-muted-foreground"
          }`}>{results[i] === "correct" ? "✓" : results[i] === "revealed" ? "!" : i + 1}</div>
        ))}
        <span className="text-xs text-muted-foreground ml-1">{results.filter(r => r !== null).length} / {DEBT_QUESTIONS.length} answered</span>
      </div>

      {/* Active question */}
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Q{qIdx + 1}: {DEBT_QUESTIONS[qIdx].q}</p>
        {!currentQDone ? (
          <>
            <div className="flex gap-2 items-center">
              <input
                type="number" step="0.1"
                value={answers[qIdx]}
                onChange={e => { const a = [...answers]; a[qIdx] = e.target.value; setAnswers(a); }}
                placeholder={DEBT_QUESTIONS[qIdx].prompt}
                className="flex-1 border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none"
              />
              {DEBT_QUESTIONS[qIdx].unit && <span className="text-sm font-semibold text-muted-foreground">{DEBT_QUESTIONS[qIdx].unit}</span>}
              <button onClick={checkAnswer} disabled={!answers[qIdx].trim()}
                className="px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl text-sm font-semibold transition">Check</button>
            </div>
            {msgs[qIdx] && <p className="text-xs font-medium text-amber-700">{msgs[qIdx]}</p>}
          </>
        ) : (
          <>
            <p className={`text-xs font-medium ${results[qIdx] === "correct" ? "text-green-700" : "text-amber-700"}`}>{msgs[qIdx]}</p>
            {qIdx < DEBT_QUESTIONS.length - 1 && (
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
          { title: "WWII Peak (1945: 119%)", body: "War financing drove debt to 119% of GDP. Yet by 1980 it had fallen to 26% — without ever paying it all off. GDP grew faster than debt." },
          { title: "Reagan Era (1982–89)", body: "Tax cuts + defense spending without offsetting cuts pushed debt/GDP from 26% to 41% — reversing a 35-year decline." },
          { title: "Great Recession (2009)", body: "Stimulus spending + collapsed tax revenue spiked debt/GDP from 35% to 54% in two years." },
          { title: "COVID (2020)", body: "Debt crossed 100% of GDP for the first time since WWII as the government spent $3T+ in relief. The key question: is the path sustainable?" },
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
// Quiz
// ─────────────────────────────────────────────
type QA = { q: string; opts: string[]; correct: number | number[]; multi?: boolean; exp: string };

const QUIZ_QS: QA[] = [
  { q: "Fiscal policy refers to the government's use of:", opts: ["Interest rates and reserve requirements", "Spending and taxation to influence the economy", "Exchange rates and trade policy", "Money supply and bank regulation"], correct: 1, exp: "Fiscal policy = government spending + taxation. Monetary policy handles interest rates. Both aim to stabilize the economy but through different channels." },
  { q: "Mandatory spending is best described as:", opts: ["Spending approved annually by Congress", "Emergency spending outside the budget cycle", "Spending set by existing law that goes out automatically", "Spending subject to presidential veto"], correct: 2, exp: "Mandatory spending (Social Security, Medicare, Medicaid) is set by existing law — it flows automatically without an annual vote, like a mortgage payment." },
  { q: "In a progressive tax system, your marginal tax rate is:", opts: ["Always equal to your average rate", "Always lower than your average rate", "Always higher than your average rate", "Unrelated to your income level"], correct: 2, exp: "In a progressive system, each additional dollar is taxed at a higher rate than previous dollars. The marginal rate (on the last dollar) always exceeds the average rate (taxes ÷ income)." },
  { q: "The national debt is best described as:", opts: ["The annual difference between spending and revenue", "The total accumulated borrowing minus any surpluses", "The amount owed to foreign governments only", "The Fed's balance sheet total"], correct: 1, exp: "Debt is the stock — accumulated sum of all past deficits minus any surpluses. The deficit is the annual flow. Running a surplus reduces debt; running a deficit adds to it." },
  { q: "The debt/GDP ratio is a better measure of fiscal burden than raw debt because:", opts: ["It adjusts for inflation automatically", "It measures the debt relative to the economy's ability to service it", "It excludes debt held by the Federal Reserve", "Congress requires it by law"], correct: 1, exp: "A $30T debt means very different things to a $25T economy vs. a $50T economy — just as a mortgage is judged relative to income. GDP measures the economy's capacity to generate tax revenue and service debt." },
  { q: "An automatic stabilizer is best described as:", opts: ["A Fed tool that automatically adjusts interest rates", "A budget rule that requires balance in every year", "A tax or spending policy that cushions recessions without new legislation", "A Congressional mechanism for emergency appropriations"], correct: 2, exp: "Automatic stabilizers (unemployment insurance, SNAP, progressive income tax) respond automatically to economic conditions — stabilizing AD in recessions and restraining it in booms without new laws." },
  { q: "Crowding out occurs when:", opts: ["Government spending directly reduces private consumption", "Government borrowing raises interest rates, reducing private investment", "Tax cuts crowd out government revenue", "The Fed raises rates in response to fiscal expansion"], correct: 1, exp: "When the government borrows heavily, it competes with private borrowers for loanable funds — pushing up interest rates and reducing private investment. This partially offsets the stimulus effect." },
  { q: "The 'recognition lag' in fiscal policy refers to:", opts: ["The time for Congress to pass a stimulus bill", "The time for spending to reach the economy after a bill passes", "The delay before data confirms a recession has actually begun", "The time between elections and policy changes"], correct: 2, exp: "By the time GDP data is released, revised, and a recession officially declared, months have passed. The trough may already be past before policymakers even know a recession started." },
  { q: "Which of the following are examples of automatic stabilizers? (Select all that apply)", opts: ["Unemployment insurance payments", "Progressive income tax (falls automatically when incomes drop)", "A new infrastructure bill passed during a recession", "SNAP (food stamp) benefits"], correct: [0, 1, 3], multi: true, exp: "Unemployment insurance, progressive income tax, and SNAP all respond automatically to economic conditions without new legislation. A new infrastructure bill is discretionary fiscal policy — it requires a Congressional vote." },
  { q: "Which statements about fiscal policy lags are correct? (Select all that apply)", opts: ["By the time stimulus arrives, the recession may already be over", "Legislative lag can take 6–18 months for major bills", "Implementation lag is eliminated if the spending is tax cuts", "The combination of all three lags is why some economists prefer monetary policy for short-run stabilization"], correct: [0, 1, 3], multi: true, exp: "All three lags compound — recognition + legislative + implementation can easily exceed 2 years. Tax cuts reduce implementation lag somewhat but still face recognition and legislative delays. Monetary policy acts faster, which is why many economists prefer it for short-run stabilization." },
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
  if (typeof window !== 'undefined') { try { localStorage.setItem('econlab_done_ch17', 'true'); } catch(e) {} }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-bold text-foreground">Lab Complete!</h2>
          <p className="text-muted-foreground">Chapter 17</p>
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
          <label htmlFor="exit-ticket-textarea" className="text-sm font-semibold text-foreground block">Exit Ticket: In your own words, explain why fiscal policy often arrives "too late" to fight a recession. What are the three lags?</label>
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
                + '<p style="color:#475569;margin:2px 0">Chapter 17: Government Budgets and Fiscal Policy</p>'
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
    { id: "recap" as Station, label: "📚 Ch15 Recap", desc: "Start here — 5 review questions on the Fed, monetary tools, and transmission" },
    { id: "spending" as Station, label: "🗂️ Spending Classifier", desc: "Sort federal spending into Mandatory, Discretionary, and Supplemental" },
    { id: "taxsystem" as Station, label: "💰 Tax System Sorter", desc: "Classify taxes as Progressive, Proportional, or Regressive; calculate marginal vs. average rate" },
    { id: "fiscalmatch" as Station, label: "⚖️ Fiscal Policy Matcher", desc: "Match recession/inflation scenarios to correct fiscal tools and AD shifts" },
    { id: "lags" as Station, label: "⏱️ Three Lags Explorer", desc: "Explore recognition, legislative, and implementation lags — why timing is hard" },
    { id: "debtcalc" as Station, label: "🏛️ Deficit vs. Debt Calculator", desc: "Build a 3-year budget — watch how annual deficits accumulate into national debt" },
    { id: "fredchart" as Station, label: "📊 Reading the Data", desc: "FRED: Federal Debt as % of GDP, 1940–2024 — from WWII to COVID" },
  ];
  const done = stations.filter(s => completed.has(s.id)).length;

  return (
    <>
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wide mb-4">Chapter 17</span>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Government Budgets & Fiscal Policy</h1>
          <p className="text-muted-foreground text-base">How Taxing, Spending, and Borrowing Shape the Economy</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4 text-sm text-foreground">
          💡 <strong>Key idea:</strong> Fiscal policy is government's most powerful tool — and its most politically complicated. Understanding the difference between deficit and debt, why stimulus often arrives late, and how taxes actually work separates economic myth from reality. Complete all 7 stations in any order, then take the quiz.
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
    { id: "spending", label: "Spending" },
    { id: "taxsystem", label: "Taxes" },
    { id: "fiscalmatch", label: "Fiscal" },
    { id: "lags", label: "Lags" },
    { id: "debtcalc", label: "Debt" },
    { id: "fredchart", label: "Data" },
    { id: "quiz", label: "Quiz" },
  ];
  const CONTENT: Station[] = ["recap","spending","taxsystem","fiscalmatch","lags","debtcalc","fredchart"];
  const allDone = CONTENT.every(s => completed.has(s));
  const order: Station[] = ["intro","recap","spending","taxsystem","fiscalmatch","lags","debtcalc","fredchart","quiz","results","not-yet"];
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
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 17</div>
          </div>
        </div>
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

  const CONTENT: Station[] = ["recap","spending","taxsystem","fiscalmatch","lags","debtcalc","fredchart"];
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
        {station === "spending" && <SpendingStation onComplete={() => markComplete("spending")} />}
        {station === "taxsystem" && <TaxStation onComplete={() => markComplete("taxsystem")} />}
        {station === "fiscalmatch" && <FiscalMatchStation onComplete={() => markComplete("fiscalmatch")} />}
        {station === "lags" && <LagsStation onComplete={() => markComplete("lags")} />}
        {station === "debtcalc" && <DebtCalcStation onComplete={() => markComplete("debtcalc")} />}
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
