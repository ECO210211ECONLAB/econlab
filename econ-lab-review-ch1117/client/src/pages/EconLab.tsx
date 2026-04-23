import { useState, useRef } from "react";
import { ChevronLeft, Award, RotateCcw, BookOpen } from "lucide-react";

// ─── Types ───
type Section = "intro" | "adas" | "keynesian" | "money" | "monetary" | "fiscal" | "quiz" | "results" | "not-yet";

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

// ─── Quick Reference ───
const REFERENCE = [
  { ch: "Ch11", title: "AD-AS Model", bullets: [
    "AD slopes downward: wealth effect, interest-rate effect, exchange-rate effect",
    "SRAS slopes upward (sticky wages/prices); LRAS is vertical at potential GDP",
    "Recessionary gap: actual GDP < potential; Inflationary gap: actual GDP > potential",
    "Keynesian: use fiscal/monetary policy to close gaps; Neoclassical: let markets self-correct",
    "Supply shocks shift SRAS; demand shocks shift AD",
  ]},
  { ch: "Ch12/13", title: "Keynesian & Neoclassical", bullets: [
    "Keynesian multiplier = 1 / (1 − MPC) = 1 / MPS",
    "Crowding out: government borrowing raises interest rates → reduces private investment",
    "Automatic stabilizers: unemployment insurance, progressive taxes (work without legislation)",
    "Keynesian: sticky wages/prices require active policy; Neoclassical: flexible prices self-correct",
    "Discretionary policy requires legislation; automatic stabilizers do not",
  ]},
  { ch: "Ch14", title: "Money & Banking", bullets: [
    "M1: cash + checking deposits + savings deposits (savings reclassified into M1 by Fed in 2020)",
    "M2: M1 + money market funds + time deposits (CDs)",
    "Money multiplier = 1 / Reserve requirement",
    "T-account: Assets = Liabilities + Net Worth",
    "Pre-2008 Fed Tools: Open Market Operations (OMO), discount rate, reserve requirements",
    "Post-2008 Fed Tools: IORB, ON RRP, discount rate, OMO (QE/QT)",
  ]},
  { ch: "Ch15", title: "Monetary Policy", bullets: [
    "Expansionary monetary policy: lower rates → more borrowing → AD shifts right",
    "Contractionary: raise rates → less borrowing → fight inflation (AD shifts left)",
    "Federal Funds Rate: overnight lending rate between banks — the Fed's target rate",
    "IORB: interest the Fed pays banks on reserves — primary post-2008 rate-setting tool",
    "ON RRP: rate Fed pays non-banks overnight — sets a floor for the FFR",
    "Zero lower bound: Fed cannot cut below 0%; uses QE and forward guidance instead",
  ]},
  { ch: "Ch17", title: "Fiscal Policy & Government Budgets", bullets: [
    "Expansionary fiscal: increase G or cut taxes → shifts AD right",
    "Contractionary fiscal: cut G or raise taxes → shifts AD left",
    "Budget deficit = G > T; budget surplus = T > G",
    "National debt = cumulative sum of all past deficits minus surpluses",
    "Automatic stabilizers: unemployment insurance and progressive taxes act without legislation",
  ]},
];

// ─── Reference Modal ───
function ReferenceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display font-bold text-base text-foreground">Ch11–17 Quick Reference</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {REFERENCE.map((sec, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-bold text-primary mb-2">{sec.ch} — {sec.title}</p>
              <ul className="space-y-1">
                {sec.bullets.map((b, j) => <li key={j} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary shrink-0">•</span>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={onClose} className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── QA Section ───
function QASection({ questions, onComplete, label }: {
  questions: { q: string; opts: string[]; correct: number; exp: string }[];
  onComplete: (score: number, total: number) => void;
  label: string;
}) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [checked, setChecked] = useState<boolean[]>(Array(questions.length).fill(false));
  const [marked, setMarked] = useState(false);
  const q = questions[qIdx];
  const ans = answers[qIdx];
  const isChecked = checked[qIdx];
  const allDone = checked.every(Boolean);
  const score = questions.filter((q, i) => answers[i] === q.correct).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">{label} — Question {qIdx + 1} of {questions.length}</span>
        <div className="flex gap-1">{questions.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === qIdx ? "bg-primary" : checked[i] ? (answers[i] === questions[i].correct ? "bg-green-500" : "bg-red-400") : "bg-muted"}`} />)}</div>
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
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition ${cls}`}>
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
            {qIdx < questions.length - 1
              ? <button onClick={() => setQIdx(qIdx + 1)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next →</button>
              : allDone && !marked
                ? <div className="flex-1 space-y-2">
                    <div className="rounded-xl bg-muted p-3 text-center text-sm"><span className="font-bold">{score}/{questions.length}</span> correct</div>
                    <button onClick={() => { setMarked(true); onComplete(score, questions.length); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
                  </div>
                : marked ? <p className="flex-1 text-center text-green-700 font-semibold text-sm py-3">✓ Section Complete</p> : null
            }
          </div>
      }
    </div>
  );
}

// ─── Station Question Banks ───
const ADAS_QS = [
  { q: "The AD curve slopes downward because of the wealth effect, interest-rate effect, and exchange-rate effect. Which correctly describes the INTEREST-RATE effect?", opts: ["Higher prices increase consumer wealth, boosting spending", "Higher prices raise interest rates → lower investment and consumer borrowing → less output demanded", "Higher prices make imports cheaper → more imports demanded", "Higher prices reduce government spending automatically"], correct: 1, exp: "Interest-rate effect: higher price level → need more money for transactions → interest rates rise → business investment and consumer borrowing fall → quantity of real GDP demanded falls. One of three reasons AD slopes down." },
  { q: "A supply shock (e.g., a sharp rise in oil prices) will:", opts: ["Shift AD to the right, raising both output and prices", "Shift SRAS to the left — raising the price level and reducing real GDP (stagflation)", "Shift LRAS to the right, increasing potential GDP", "Have no effect on the AD-AS model"], correct: 1, exp: "Negative supply shock: SRAS shifts left → higher prices AND lower real GDP simultaneously (stagflation). This is more complex than demand shocks because the usual tools (expand demand) worsen inflation while fighting the output problem." },
  { q: "In the long run, if the economy is in a recessionary gap, the Neoclassical view predicts:", opts: ["The government must use fiscal stimulus to restore equilibrium", "Wages and prices will eventually fall, shifting SRAS right until equilibrium is restored at potential GDP", "The economy will remain stuck below potential GDP indefinitely", "The Federal Reserve must cut interest rates immediately"], correct: 1, exp: "Neoclassical long-run self-correction: in a recession, unemployment puts downward pressure on wages. Lower wages reduce production costs → SRAS shifts right → economy returns to potential GDP without policy intervention." },
  { q: "Which of the following would shift Aggregate Demand to the RIGHT?", opts: ["A decrease in consumer confidence", "A tax increase on households", "An increase in government spending on infrastructure", "Rising interest rates from the Federal Reserve"], correct: 2, exp: "Expansionary fiscal policy (increase G) directly increases one component of AD = C + I + G + NX. Consumer confidence ↓ and tax ↑ reduce C; rising rates reduce I — all shift AD left." },
  { q: "The Long-Run Aggregate Supply (LRAS) curve is vertical because:", opts: ["Prices are fixed in the long run", "In the long run, real GDP is determined by productive capacity — not by the price level", "Government always ensures full employment in the long run", "The Federal Reserve controls long-run output directly"], correct: 1, exp: "LRAS is vertical at potential GDP. In the long run, prices are flexible and the economy produces at full employment regardless of the price level. LRAS shifts only when productive capacity changes (more capital, better technology, more workers)." },
];

const KEYNESIAN_QS = [
  { q: "The Keynesian multiplier effect means:", opts: ["A $1 decrease in taxes always increases GDP by exactly $1", "An initial $1 of government spending generates more than $1 of total economic activity through rounds of spending and re-spending", "Government spending crowds out an equal amount of private investment", "Tax cuts are always more effective than spending increases"], correct: 1, exp: "Multiplier: an initial injection becomes income for workers → they spend → that spending becomes income for others → and so on. Total effect exceeds the initial injection. Multiplier = 1/(1−MPC)." },
  { q: "Crowding out refers to:", opts: ["Government spending reducing consumer confidence", "Government borrowing raising interest rates → reducing private investment — partially offsetting the stimulus effect", "The Federal Reserve printing money to fund government deficits", "Tax increases reducing consumer spending directly"], correct: 1, exp: "Crowding out: when government borrows heavily, it competes for funds → interest rates rise → private businesses find borrowing more expensive → investment falls. The fiscal multiplier is reduced by crowding out." },
  { q: "The Keynesian view of recessions argues that:", opts: ["Markets will quickly self-correct through wage and price flexibility", "Sticky wages and prices trap the economy below potential — government intervention can accelerate recovery", "Monetary policy is more effective than fiscal policy in deep recessions", "Recessions are caused by government interference in free markets"], correct: 1, exp: "Keynesian model: wages and prices are sticky downward in the short run. This means the economy can stay stuck in recession. Government spending (fiscal stimulus) can shift AD right and restore output faster." },
  { q: "Automatic stabilizers help reduce the severity of recessions because:", opts: ["They require Congress to vote for spending increases during downturns", "They automatically increase government spending (unemployment benefits) and reduce taxes during recessions without new legislation", "They prevent the Federal Reserve from raising interest rates", "They eliminate all budget deficits during downturns"], correct: 1, exp: "Automatic stabilizers: when GDP falls, unemployment insurance payments automatically rise and tax revenue automatically falls. Both reduce the multiplied decline in AD — built-in stabilization without political action." },
  { q: "Which economist's ideas most directly support using fiscal policy to combat recessions?", opts: ["Milton Friedman (monetarist)", "John Maynard Keynes", "Adam Smith (classical)", "Friedrich Hayek (Austrian)"], correct: 1, exp: "Keynes argued that in a serious recession, private demand is insufficient and government must step in as the 'spender of last resort.' His 1936 General Theory revolutionized macroeconomics and directly justified New Deal-era policies and modern fiscal stimulus." },
];

const MONEY_QS = [
  { q: "The three functions of money are:", opts: ["Save, spend, invest", "Medium of exchange, store of value, unit of account", "Barter, credit, currency", "Liquid, illiquid, semi-liquid"], correct: 1, exp: "Money's three functions: (1) Medium of exchange — avoids barter's double coincidence problem; (2) Store of value — holds purchasing power over time; (3) Unit of account — provides a common measure to compare values." },
  { q: "M2 money supply includes:", opts: ["Only physical coins and currency", "M1 (cash + checking + savings) only", "M1 plus money market accounts and small time deposits (CDs)", "All financial assets including stocks and bonds"], correct: 2, exp: "M2 = M1 + money market accounts + small CDs (time deposits). Note: savings accounts were reclassified into M1 by the Fed in 2020. M2 is broader than M1 and the measure most commonly used to track overall money supply for policy purposes." },
  { q: "If the reserve requirement is 10%, the money multiplier is:", opts: ["10", "1", "0.1", "100"], correct: 0, exp: "Money multiplier = 1 / Reserve requirement = 1 / 0.10 = 10. Every $1 of new reserves can theoretically support $10 in new deposits and loans. In practice the actual multiplier is lower — banks hold excess reserves and people hold some cash." },
  { q: "When the Federal Reserve buys Treasury bonds through open market operations, it:", opts: ["Reduces the money supply by taking bonds from banks", "Injects reserves into the banking system → expands the money supply → lowers interest rates", "Raises the federal funds rate immediately", "Reduces bank lending capacity"], correct: 1, exp: "Open market purchase (expansionary): Fed buys bonds → pays banks with reserves → banks have more reserves to lend → money supply expands → interest rates fall. This is the primary monetary policy tool." },
  { q: "The difference between M1 and M2 is that M2 includes:", opts: ["Large corporate bonds and Treasury securities", "Money market funds and small CDs — less liquid than M1 but still 'close to money'", "Physical gold and silver reserves", "Credit card balances"], correct: 1, exp: "M2 adds near-money assets to M1: money market deposit accounts and small time deposits (CDs). Note: savings accounts were reclassified into M1 by the Fed in 2020 and are no longer a M2-only item." },
];

const MONETARY_QS = [
  { q: "To fight a recession, the Federal Reserve would most likely:", opts: ["Raise the federal funds rate target", "Increase reserve requirements", "Lower the federal funds rate — making borrowing cheaper to stimulate investment and spending", "Sell Treasury bonds on the open market"], correct: 2, exp: "Expansionary monetary policy: Fed lowers the federal funds rate (often through open market purchases). Lower rates → cheaper borrowing → more investment and consumer credit → AD shifts right → GDP rises." },
  { q: "The Federal Funds Rate is:", opts: ["The interest rate the Federal Reserve charges consumers directly", "The overnight lending rate between banks — the Fed's primary policy tool", "The rate the U.S. Treasury pays on 10-year bonds", "The maximum interest rate banks can charge on mortgages"], correct: 1, exp: "Federal Funds Rate: the rate banks charge each other for overnight loans. The Fed controls this rate through open market operations. When it changes, all other interest rates (mortgages, car loans, savings accounts) tend to follow." },
  { q: "The 'zero lower bound' (ZLB) is a challenge for the Federal Reserve because:", opts: ["The Fed is legally prohibited from setting negative interest rates", "Once the federal funds rate reaches 0%, traditional rate cuts are no longer available as a stimulus tool", "Banks stop lending entirely when rates reach zero", "The money multiplier becomes zero at the ZLB"], correct: 1, exp: "The ZLB means the Fed cannot push the federal funds rate meaningfully below 0%. Once rates hit 0%, the Fed's primary traditional tool — cutting rates — is exhausted. This forces the Fed to use unconventional tools like quantitative easing (QE) and forward guidance." },
  { q: "Contractionary monetary policy is used to:", opts: ["Stimulate a recessionary economy by lowering interest rates", "Fight inflation by raising interest rates — slowing borrowing, investment, and spending", "Increase the money supply to fund government spending", "Reduce the national debt by printing money"], correct: 1, exp: "Contractionary (tight) monetary policy: Fed raises rates → borrowing becomes more expensive → investment and consumer spending slow → aggregate demand falls → inflationary pressure eases. This is the classic inflation-fighting tool." },
  { q: "After 2008, the Federal Reserve's primary tool for setting interest rates shifted to:", opts: ["Adjusting reserve requirements for commercial banks", "Interest on Reserve Balances (IORB) — the rate paid to banks on overnight reserves held at the Fed", "Printing new currency and distributing it to banks", "Setting a fixed price for Treasury bonds"], correct: 1, exp: "In the ample reserves era post-2008, the Fed controls interest rates mainly through IORB — the rate it pays banks on reserves parked at the Fed. Raising IORB makes holding reserves more attractive, pushing up the floor for all lending rates." },
];

const FISCAL_QS = [
  { q: "Which of the following is an EXPANSIONARY fiscal policy?", opts: ["Raising the payroll tax rate", "Cutting Medicare benefits", "Increasing government spending on infrastructure", "Reducing the federal deficit"], correct: 2, exp: "Expansionary fiscal policy increases AD: more G directly adds to GDP through the multiplier. Tax cuts also work by boosting C. Deficit reduction (cutting G or raising taxes) is contractionary — it reduces AD." },
  { q: "The national debt is:", opts: ["The annual budget deficit", "The trade deficit with other countries", "The cumulative total of all past annual deficits minus surpluses", "The amount the U.S. owes to foreign governments only"], correct: 2, exp: "National debt = running total of all annual deficits minus surpluses over time. Each year's deficit adds to the debt; a surplus reduces it. As of 2024 the U.S. national debt exceeded $34 trillion, accumulated over decades." },
  { q: "Which of the following is an example of an AUTOMATIC STABILIZER?", opts: ["Congress passes a new $500 billion stimulus spending bill", "The Federal Reserve lowers the federal funds rate", "Unemployment insurance payments automatically increase when workers lose their jobs in a recession", "The president proposes a new infrastructure investment program"], correct: 2, exp: "Automatic stabilizers work without any new legislative action: unemployment benefits rise automatically when jobs are lost, and tax revenues fall automatically as incomes drop. Both cushion the economy from recession without requiring Congress to act." },
  { q: "Automatic stabilizers differ from discretionary fiscal policy because:", opts: ["Automatic stabilizers require Congressional approval each time they activate", "Automatic stabilizers (unemployment insurance, progressive taxes) respond automatically to economic conditions without new legislation", "Discretionary policy is faster and more responsive than automatic stabilizers", "Automatic stabilizers only affect the money supply, not government spending"], correct: 1, exp: "Automatic stabilizers: unemployment insurance, progressive income taxes — they automatically expand the deficit in recessions and contract it in booms. No legislation needed. Discretionary policy requires legislative action — slower but potentially larger." },
  { q: "If the federal government runs a budget deficit, it finances the deficit by:", opts: ["Printing money directly", "Raising taxes immediately", "Borrowing — issuing Treasury bonds and bills to investors", "Reducing the money supply"], correct: 2, exp: "U.S. deficit financing: the Treasury issues bonds (T-bills, T-notes, T-bonds) sold to investors — domestic and foreign. The Fed does NOT simply print money to cover deficits. Borrowing adds to the national debt." },
];

// ─── Quiz Pool ───
const QUIZ_POOL = [
  { q: "Aggregate Demand (AD) slopes downward because:", opts: ["Higher prices reduce real output supplied", "Higher prices reduce the real value of wealth, raise interest rates, and make exports less competitive — all reducing spending", "Higher prices increase consumer confidence", "Higher prices encourage more investment"], correct: 1, multi: false, exp: "Three effects: wealth effect (higher prices reduce real purchasing power of savings), interest-rate effect (higher prices raise rates, reducing investment), exchange-rate effect (higher prices make exports pricier, reducing net exports)." },
  { q: "A negative supply shock shifts SRAS:", opts: ["Right — increasing output and lowering prices", "Left — raising prices AND reducing real GDP (stagflation)", "Right — increasing output while raising prices", "Left — reducing prices while also reducing GDP"], correct: 1, multi: false, exp: "Negative supply shock (oil price spike, pandemic disruption): SRAS shifts left. Both bad outcomes simultaneously: higher prices AND lower real GDP. This is stagflation — the worst of both worlds." },
  { q: "The Keynesian multiplier is larger when:", opts: ["The marginal propensity to save (MPS) is higher", "The marginal propensity to consume (MPC) is higher — each round of spending generates more re-spending", "Interest rates are higher", "The reserve requirement is lower"], correct: 1, multi: false, exp: "Multiplier = 1/(1−MPC) = 1/MPS. Higher MPC → more of each dollar of income is spent → more rounds of re-spending → larger total GDP impact from the initial injection." },
  { q: "The money multiplier = 1 / Reserve requirement. If the reserve requirement is 5%, the multiplier is:", opts: ["5", "20", "0.05", "100"], correct: 1, multi: false, exp: "1 / 0.05 = 20. Every $1 of new reserves can theoretically support $20 in new deposits and loans. In practice the actual multiplier is lower — banks hold excess reserves and people hold some cash." },
  { q: "Expansionary monetary policy works primarily by:", opts: ["Increasing taxes to fund government spending", "Lowering interest rates → stimulating borrowing, investment, and consumer spending → AD shifts right", "Raising reserve requirements to expand bank lending", "Selling Treasury bonds to reduce bank reserves"], correct: 1, multi: false, exp: "Expansionary monetary policy (Fed cuts rates or buys bonds): lower rates → cheaper borrowing → more investment and consumer credit → spending rises → AD shifts right → GDP increases. The transmission mechanism runs through credit markets." },
  { q: "The federal budget deficit equals:", opts: ["National debt × interest rate", "Government spending minus tax revenue (G − T) when spending exceeds revenue", "Total tax revenue − government spending", "Trade deficit + capital account surplus"], correct: 1, multi: false, exp: "Annual deficit = G − T when G > T. The deficit must be financed by borrowing (issuing Treasury bonds). Each year's deficit adds to the cumulative national debt." },
  { q: "Automatic stabilizers reduce the severity of recessions because:", opts: ["They require emergency legislation to activate spending quickly", "Unemployment benefits rise and tax revenue falls automatically in downturns — cushioning the fall in aggregate demand", "They prevent the Fed from raising interest rates during recessions", "They guarantee a balanced budget at all times"], correct: 1, multi: false, exp: "Automatic stabilizers work without legislation. In a recession: unemployment payments rise (more spending), income tax revenue falls (less contractionary). Both automatically push against the decline in AD, smoothing the business cycle." },
  { q: "Quantitative easing (QE) refers to:", opts: ["The Fed raising short-term interest rates aggressively", "The Fed purchasing large quantities of longer-term assets (Treasury bonds, mortgage-backed securities) to inject reserves and lower long-term rates", "The Treasury issuing new bonds to finance a budget deficit", "Banks increasing lending when reserve requirements are lowered"], correct: 1, multi: false, exp: "QE is an unconventional monetary policy tool used when short-term rates are near zero. The Fed buys long-term assets to push down long-term interest rates, encourage borrowing/investment, and inject liquidity." },
  { q: "The national debt differs from the annual deficit because:", opts: ["They are the same thing measured differently", "The national debt is cumulative (all past deficits minus surpluses); the deficit is the annual shortfall", "The deficit includes state and local government debt; the national debt only tracks federal debt", "The national debt is owed only to foreign creditors"], correct: 1, multi: false, exp: "Deficit = this year's G − T. National debt = sum of all deficits and surpluses since the country's founding. Even with a balanced budget today, the accumulated debt from past deficits remains." },
  { q: "In the AD-AS model, a severe recession with high unemployment is represented by:", opts: ["Equilibrium to the right of LRAS (inflationary gap)", "Equilibrium to the left of LRAS (recessionary gap — actual GDP below potential)", "LRAS shifting left", "AD and SRAS both shifting right simultaneously"], correct: 1, multi: false, exp: "Recessionary gap: AD intersects SRAS at output below potential GDP (LRAS). The economy is underperforming — there is cyclical unemployment. Both Keynesian stimulus and Neoclassical self-correction aim to close this gap." },
  { q: "The Federal Funds Rate is important because:", opts: ["It directly sets mortgage rates for all homeowners", "It is the overnight interbank lending rate — changes ripple through all interest rates in the economy", "It determines the government's cost of borrowing through Treasury bonds", "It sets the maximum interest rate banks can charge customers"], correct: 1, multi: false, exp: "Federal Funds Rate: when this rate changes, banks adjust the rates they charge each other → those adjustments spread to prime rate, mortgage rates, car loan rates, savings rates. It's the economy's 'base rate' — the fulcrum of monetary policy." },
  { q: "Crowding out occurs when:", opts: ["Government spending directly replaces private consumption", "Government borrowing raises interest rates, making private investment more expensive and reducing it", "The Federal Reserve raises the reserve requirement", "Tax cuts reduce government revenue below spending"], correct: 1, multi: false, exp: "Crowding out: increased government borrowing → higher demand for loanable funds → interest rates rise → private investment becomes more expensive → investment spending falls. This partially or fully offsets the fiscal stimulus effect." },
  { q: "Which of the following are tools of monetary policy? (Select all that apply)", opts: ["Open market operations (buying/selling Treasury bonds)", "Setting the federal funds rate target", "Changing the reserve requirement for banks", "Changing the federal income tax rate"], correct: [0, 1, 2], multi: true, exp: "Federal Reserve tools: open market operations (primary), federal funds rate targeting, reserve requirements, and discount rate. Changing income tax rates is fiscal policy — a legislative decision made by Congress, not the Fed." },
  { q: "Which of the following are examples of EXPANSIONARY fiscal policy? (Select all that apply)", opts: ["A $300B increase in highway and bridge spending", "Cutting the corporate income tax rate", "Reducing Social Security benefits to balance the budget", "Emergency pandemic relief payments to households"], correct: [0, 1, 3], multi: true, exp: "Expansionary fiscal policy shifts AD right: spending increases (highways, pandemic payments) directly add to G or C; tax cuts increase disposable income → more C. Reducing Social Security benefits is contractionary — it reduces transfer payments and thus C." },
  { q: "Which of the following correctly describe the Neoclassical view of macroeconomics? (Select all that apply)", opts: ["Wages and prices are flexible — markets self-correct in the long run", "Fiscal stimulus is often offset by crowding out of private investment", "Recessions require immediate large government spending programs", "The economy naturally tends toward full employment over time"], correct: [0, 1, 3], multi: true, exp: "Neoclassical: flexible prices/wages mean markets self-correct (correct), crowding out reduces fiscal multiplier (correct), full employment is the long-run tendency (correct). 'Immediate large government spending programs' is the Keynesian prescription, not Neoclassical." },
];

// ─── Quiz Station ─── (exact Ch6-9 working pattern)
function QuizStation({ onPass, onFail }: { onPass: (s: number) => void; onFail: (s: number) => void }) {
  const TOTAL = 15;
  const [questions] = useState(() => shuffle(QUIZ_POOL).slice(0, TOTAL).map(q => { const s = shuffleOpts(q.opts, q.correct); return { ...q, opts: s.opts, correct: s.correct }; }));
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | number[] | null)[]>(Array(TOTAL).fill(null));
  const cur = questions[idx];
  const curAns = answers[idx];

  function toggleMulti(oi: number) { setAnswers(prev => { const n = [...prev]; const c = (n[idx] as number[] | null) ?? []; n[idx] = c.includes(oi) ? c.filter(x => x !== oi) : [...c, oi]; return n; }); }
  function selectSingle(oi: number) { setAnswers(prev => { const n = [...prev]; n[idx] = oi; return n; }); }
  function isAnswered() { return cur.multi ? Array.isArray(curAns) && (curAns as number[]).length > 0 : curAns !== null; }
  function allAnswered() { return questions.every((q, i) => { const a = answers[i]; return q.multi ? Array.isArray(a) && (a as number[]).length > 0 : a !== null; }); }

  function submit() {
    const score = questions.reduce((acc, q, i) => {
      const ans = answers[i];
      if (q.multi) {
        const correct = Array.isArray(q.correct) ? (q.correct as number[]).slice().sort().join(",") : String(q.correct);
        const given = Array.isArray(ans) ? (ans as number[]).slice().sort().join(",") : "";
        return acc + (given === correct ? 1 : 0);
      }
      return acc + (ans === q.correct ? 1 : 0);
    }, 0);
    if (score >= 13) onPass(score); else onFail(score);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Question {idx + 1} of {TOTAL}</span>
        <div className="flex gap-0.5 flex-wrap justify-end">{questions.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i === idx ? "bg-primary" : answers[i] !== null ? "bg-green-500" : "bg-muted"}`} />)}</div>
      </div>
      <div className="rounded-xl bg-card border-2 border-border p-5">
        <p className="font-semibold text-foreground text-sm mb-1">{cur.q}</p>
        {cur.multi && <p className="text-xs text-muted-foreground mt-1 mb-3">Select all that apply.</p>}
        <div className="space-y-2 mt-3">
          {cur.opts.map((opt, oi) => {
            const sel = cur.multi ? (Array.isArray(curAns) && (curAns as number[]).includes(oi)) : curAns === oi;
            return (
              <button key={oi} onClick={() => cur.multi ? toggleMulti(oi) : selectSingle(oi)} aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition ${sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40"}`}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex gap-3">
        {idx > 0 && <button onClick={() => setIdx(idx - 1)} className="flex-1 py-3 rounded-xl border-2 border-border text-sm font-semibold text-muted-foreground hover:border-primary/40 transition">← Back</button>}
        {idx < TOTAL - 1
          ? <button onClick={() => { if (isAnswered()) setIdx(idx + 1); }} disabled={!isAnswered()} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Next →</button>
          : <button onClick={() => { if (allAnswered()) submit(); }} disabled={!allAnswered()} className="flex-1 py-3 rounded-xl font-bold text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 transition">Submit Review Quiz</button>
        }
      </div>
    </div>
  );
}

// ─── Not Yet Screen ───
function NotYetScreen({ score, onRetry }: { score: number; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#fef3c7" }}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-5">
        <div className="text-5xl">📖</div>
        <h2 className="text-2xl font-bold text-amber-800">Not Yet</h2>
        <p className="text-amber-700 font-medium">You scored {score} out of 15.</p>
        <p className="text-sm text-amber-700">Mastery requires 13 out of 15. Review the sections and try again.</p>
        <p className="text-xs text-amber-600 font-semibold border border-amber-300 rounded-xl p-3 bg-amber-50">This screen cannot be submitted. Only the final Results screen counts.</p>
        <button onClick={onRetry} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition">← Try the Quiz Again</button>
      </div>
    </div>
  );
}

// ─── Results Screen ───
function ResultsScreen({ score, sectionScores, name, setName }: {
  score: number;
  sectionScores: Record<string, { score: number; total: number }>;
  name: string;
  setName: (n: string) => void;
}) {
  const [printed, setPrinted] = useState(false);
  const SECTION_LABELS: Record<string, string> = { adas: "AD-AS Model", keynesian: "Keynesian & Neoclassical", money: "Money & Banking", monetary: "Monetary Policy", fiscal: "Fiscal Policy" };

  function handlePrint() {
    const w = window.open("", "_blank", "width=820,height=960");
    if (!w) return;
    const sectionRows = Object.entries(sectionScores).map(([id, s]) =>
      `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0">${SECTION_LABELS[id] || id}</td><td style="padding:6px 10px;border:1px solid #e2e8f0;text-align:center;font-weight:bold">${s.score} / ${s.total}</td></tr>`
    ).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>ECO 210 Review Lab Results</title>
    <style>body{font-family:Arial,sans-serif;max-width:680px;margin:40px auto;color:#1e293b;padding:0 20px}h1{font-size:1.4rem;color:#1a2744;border-bottom:3px solid #1a2744;padding-bottom:8px}h2{font-size:1rem;color:#1a2744;margin-top:24px}table{width:100%;border-collapse:collapse;margin-top:8px}th{background:#1a2744;color:white;padding:8px 10px;text-align:left;font-size:12px}.footer{margin-top:40px;font-size:.75rem;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px}</style>
    </head><body>
    <h1>ECO 210 ECONLAB — Review Lab: Chapters 11–17</h1>
    <p><strong>Student:</strong> ${name || "(Name not entered)"} &nbsp;&nbsp; <strong>Completed:</strong> ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
    <p><strong>Quiz Score:</strong> ${score} / 15 &nbsp;&nbsp; <strong>Status:</strong> ${score >= 13 ? "✓ Mastery Achieved" : "Needs Review"}</p>
    <h2>Station Scores</h2>
    <table><thead><tr><th>Station</th><th style="width:80px;text-align:center">Score</th></tr></thead><tbody>${sectionRows}</tbody></table>
    <div class="footer">ECO 210 ECONLAB · Review Lab: Chapters 11–17 · Access for free at https://openstax.org/books/principles-macroeconomics-3e/pages/1-introduction</div>
    </body></html>`);
    w.document.close(); setTimeout(() => w.print(), 600); setPrinted(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-5">
        <Award className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Review Mastery Achieved!</h2>
        <p className="text-4xl font-bold text-green-600">{score} / 15</p>
        <p className="text-sm text-muted-foreground">You've completed the ECO 210 Review Lab covering Chapters 11–17.</p>
        {Object.keys(sectionScores).length > 0 && (
          <div className="text-left bg-muted rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-foreground">Station Scores</p>
            {Object.entries(sectionScores).map(([id, s]) => (
              <div key={id} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{SECTION_LABELS[id] || id}</span>
                <span className={`font-bold ${s.score === s.total ? "text-green-600" : "text-amber-600"}`}>{s.score}/{s.total}</span>
              </div>
            ))}
          </div>
        )}
        <div className="text-left space-y-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="student-name">Your Name (for submission)</label>
          <input id="student-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First Last" className="w-full border-2 border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
        </div>
        <button onClick={handlePrint} className="w-full py-3 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold text-sm transition">🖨️ Print / Save as PDF</button>
        {printed && <p className="text-xs text-muted-foreground">Print dialog opened. Choose "Save as PDF" to save your results.</p>}
        <p className="text-xs text-muted-foreground">Take a screenshot or print this page and submit to Brightspace.</p>
      </div>
    </div>
  );
}

// ─── Main EconLab ───
export default function EconLab() {
  const [section, setSection] = useState<Section>("intro");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showRef, setShowRef] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [sectionScores, setSectionScores] = useState<Record<string, { score: number; total: number }>>({});
  const [studentName, setStudentName] = useState("");
  const mainRef = useRef<HTMLDivElement>(null);

  const SECTIONS = [
    { id: "adas",      label: "📉 AD-AS Model",               short: "AD-AS",      desc: "5 questions on AD/SRAS/LRAS curves, shifts, and gaps" },
    { id: "keynesian", label: "🏛️ Keynesian & Neoclassical",  short: "Keynesian",  desc: "5 questions on multiplier, crowding out, and automatic stabilizers" },
    { id: "money",     label: "💵 Money & Banking",            short: "Money",      desc: "5 questions on money functions, M1/M2, and the money multiplier" },
    { id: "monetary",  label: "🏦 Monetary Policy",            short: "Monetary",   desc: "5 questions on Fed tools, federal funds rate, and post-2008 policy" },
    { id: "fiscal",    label: "📋 Fiscal Policy",              short: "Fiscal",     desc: "5 questions on government spending, deficits, and automatic stabilizers" },
  ];

  const allDone = SECTIONS.every(s => completed.has(s.id));

  function markDone(id: string, score?: number, total?: number) {
    setCompleted(prev => new Set([...prev, id]));
    if (score !== undefined && total !== undefined) {
      setSectionScores(prev => ({ ...prev, [id]: { score, total } }));
    }
    setSection("intro");
  }

  function handlePass(score: number) { setQuizScore(score); localStorage.setItem("econlab_done_review_ch1117", "true"); setSection("results"); }
  function handleFail(score: number) { setQuizScore(score); setSection("not-yet"); }

  if (section === "not-yet") return <NotYetScreen score={quizScore} onRetry={() => setSection("quiz")} />;
  if (section === "results") return <ResultsScreen score={quizScore} sectionScores={sectionScores} name={studentName} setName={setStudentName} />;

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded z-50">Skip to main content</a>
      {showRef && <ReferenceModal onClose={() => setShowRef(false)} />}

      <header style={{ backgroundColor: "hsl(222,42%,19%)" }} className="text-white px-4 py-3 shadow-lg sticky top-0 z-50" role="banner">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <a href="https://www.perplexity.ai/computer/a/eco-210-econlab-course-hub-JgrfOPjHQ5iSYovw19FfIg" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex text-white/80 hover:text-white text-xs font-medium whitespace-nowrap items-center gap-1 transition shrink-0">
              <ChevronLeft className="w-3.5 h-3.5" />Course Hub
            </a>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">ECO 210 ECONLAB</p>
              <p className="text-sm font-bold text-white truncate">Review Lab · Chapters 11–17</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 flex-wrap" role="navigation" aria-label="Section navigation">
            {SECTIONS.map(s => {
              const done = completed.has(s.id); const active = section === s.id;
              return (
                <button key={s.id} onClick={() => setSection(s.id as Section)} aria-current={active ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active ? "bg-white/20 text-white font-semibold" : done ? "text-white/90" : "text-white/60 hover:text-white"}`}>
                  {done && !active ? "✓ " : ""}{s.short}
                </button>
              );
            })}
            {allDone
              ? <button onClick={() => setSection("quiz")} aria-current={section === "quiz" ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${section === "quiz" ? "bg-white/20 text-white font-semibold" : "text-white/90 hover:text-white"}`}>🎯 Quiz</button>
              : <span className="px-3 py-1.5 text-xs text-white/35 cursor-not-allowed select-none">🔒 Quiz</span>
            }
          </div>
          <div className="sm:hidden flex items-center gap-2 shrink-0">
            <span className="text-xs text-white/60">{completed.size}/{SECTIONS.length}</span>
            <div className="w-14 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${(completed.size / SECTIONS.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" ref={mainRef} className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {section === "intro" && (
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-primary p-6 bg-primary/5">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Cumulative Review</p>
                  <p className="text-xl font-bold text-foreground">Chapters 11–17</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">This review covers the policy half of ECO 210 — the AD-AS model, Keynesian vs. Neoclassical debate, money and banking, monetary policy, and fiscal policy.</p>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {["Ch11 AD-AS", "Ch12/13 Keynesian & Neo", "Ch14 Money", "Ch15 Monetary Policy", "Ch17 Fiscal Policy"].map((ch, i) => (
                  <div key={i} className="bg-white rounded-lg p-2 text-center border border-border">
                    <p className="text-xs font-semibold text-primary">{ch}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowRef(true)} className="w-full text-left rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 transition flex items-center gap-2">
              <BookOpen size={16} className="text-primary shrink-0" />
              <span>Need a refresher? <span className="text-primary font-semibold underline">Open the Ch11–17 Quick Reference.</span></span>
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTIONS.map(s => {
                const done = completed.has(s.id);
                return (
                  <button key={s.id} onClick={() => setSection(s.id as Section)}
                    className={`rounded-xl border-2 p-4 text-left transition ${done ? "border-green-400 bg-green-50" : "border-border bg-card hover:border-primary/40"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${done ? "text-green-700" : "text-foreground"}`}>{s.label}</span>
                      {done && sectionScores[s.id] && (
                        <span className="text-xs font-bold bg-green-100 text-green-700 border border-green-300 rounded-full px-2 py-0.5">
                          {sectionScores[s.id].score}/{sectionScores[s.id].total} ✓
                        </span>
                      )}
                      {done && !sectionScores[s.id] && <span className="text-green-600 text-lg">✓</span>}
                    </div>
                    <span className="text-xs text-muted-foreground">{done ? "Completed" : s.desc}</span>
                  </button>
                );
              })}
            </div>
            {allDone
              ? <button onClick={() => setSection("quiz")} className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-base transition flex items-center justify-center gap-2">
                  <Award size={20} /> Take the Cumulative Quiz (15 Questions)
                </button>
              : <div className="w-full py-4 bg-muted text-muted-foreground/60 rounded-xl font-bold text-base text-center">🔒 Quiz — Complete all sections to unlock · 13/15 required for mastery</div>
            }
          </div>
        )}

        {section !== "intro" && section !== "quiz" && (
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
            {section === "adas"      && <QASection questions={ADAS_QS}      onComplete={(sc, t) => markDone("adas", sc, t)}      label="Ch11 AD-AS Model"             />}
            {section === "keynesian" && <QASection questions={KEYNESIAN_QS} onComplete={(sc, t) => markDone("keynesian", sc, t)} label="Ch12/13 Keynesian & Neoclassical" />}
            {section === "money"     && <QASection questions={MONEY_QS}     onComplete={(sc, t) => markDone("money", sc, t)}     label="Ch14 Money & Banking"          />}
            {section === "monetary"  && <QASection questions={MONETARY_QS}  onComplete={(sc, t) => markDone("monetary", sc, t)}  label="Ch15 Monetary Policy"           />}
            {section === "fiscal"    && <QASection questions={FISCAL_QS}    onComplete={(sc, t) => markDone("fiscal", sc, t)}    label="Ch17 Fiscal Policy"             />}
          </div>
        )}

        {section === "quiz" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={() => setSection("intro")} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">← Dashboard</button>
              <button onClick={() => setShowRef(true)} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">📚 Quick Ref</button>
              <h2 className="text-base font-bold text-foreground">🎯 Cumulative Quiz — Chapters 11–17</h2>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-xs text-amber-800 font-semibold">
              15 questions drawn from the Ch11–17 question bank. Mastery = 13/15 correct.
            </div>
            <QuizStation onPass={handlePass} onFail={handleFail} />
          </div>
        )}
      </main>
    </>
  );
}
