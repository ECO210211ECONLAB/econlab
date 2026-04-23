import { useState, useRef } from "react";
import { ChevronLeft, Award, RotateCcw, BookOpen } from "lucide-react";

// ─── Types ───
type Section = "intro" | "measurement" | "growth" | "unemployment" | "inflation" | "quiz" | "results" | "not-yet";

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
  { ch: "Ch6", title: "GDP & National Output", bullets: [
    "GDP = C + I + G + (X − M) — the four components",
    "Nominal GDP: measured in current prices; Real GDP: adjusted for inflation",
    "GDP deflator = (Nominal GDP / Real GDP) × 100",
    "GDP gap = actual GDP − potential GDP (negative = recession)",
    "GDP excludes: used goods, financial transactions, underground economy, non-market activities",
  ]},
  { ch: "Ch7", title: "Economic Growth", bullets: [
    "Economic growth = sustained increase in real GDP per capita over time",
    "Rule of 70: years to double = 70 ÷ growth rate",
    "Sources of growth: physical capital, human capital, technology (productivity)",
    "Compound growth: small rate differences produce huge long-run gaps",
    "Convergence: poorer countries grow faster (if institutions allow)",
  ]},
  { ch: "Ch8", title: "Unemployment", bullets: [
    "Labor Force = Employed + Unemployed (actively seeking work)",
    "Unemployment rate = (Unemployed / Labor Force) × 100",
    "NOT in labor force: students, retirees, discouraged workers, military",
    "Frictional: between jobs; Structural: skills mismatch; Cyclical: recession-related",
    "Natural rate = frictional + structural (no cyclical unemployment)",
    "Active military classified as Not in Labor Force (civilian measure)",
  ]},
  { ch: "Ch9", title: "Inflation", bullets: [
    "CPI = (Cost of basket this year / Cost in base year) × 100",
    "Inflation rate = ((CPI₂ − CPI₁) / CPI₁) × 100",
    "Core CPI excludes food and energy (more stable signal)",
    "Real interest rate = Nominal rate − Inflation rate",
    "Winners from surprise inflation: debtors, government, fixed-payment recipients",
    "Losers: creditors, savers, those on fixed incomes",
    "Hyperinflation: extremely rapid inflation (e.g., Weimar Germany, Zimbabwe)",
  ]},
];

function ReferenceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="ref-title">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 id="ref-title" className="text-lg font-bold text-foreground">📚 Ch6–9 Quick Reference</h2>
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

// ─── Shared Q&A component ───
function QASection({ questions, onComplete, label }: {
  questions: { q: string; opts: string[]; correct: number; exp: string }[];
  onComplete: () => void;
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
            {qIdx < questions.length - 1
              ? <button onClick={() => setQIdx(qIdx + 1)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next →</button>
              : allDone && !marked
                ? <div className="flex-1 space-y-2">
                    <div className="rounded-xl bg-muted p-3 text-center text-sm"><span className="font-bold">{score}/{questions.length}</span> correct</div>
                    <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
                  </div>
                : marked ? <p className="flex-1 text-center text-green-700 font-semibold text-sm py-3">✓ Section Complete</p> : null
            }
          </div>
      }
    </div>
  );
}

// ─── Section questions ───
const MEASUREMENT_QS = [
  { q: "Which formula correctly represents GDP using the expenditure approach?", opts: ["GDP = C + S + T + G", "GDP = C + I + G + (X − M)", "GDP = Wages + Profits + Rent + Interest", "GDP = National Income − Depreciation"], correct: 1, exp: "GDP = C (Consumption) + I (Investment) + G (Government) + (X − M) (Net Exports). This is the expenditure approach — the most commonly cited." },
  { q: "Real GDP differs from Nominal GDP because:", opts: ["Real GDP includes only goods, not services", "Real GDP is adjusted for inflation, allowing fair year-to-year comparisons of actual output", "Nominal GDP is always higher than Real GDP", "Real GDP excludes government spending"], correct: 1, exp: "Nominal GDP is valued in current prices — it rises with inflation even if output didn't grow. Real GDP removes price changes, isolating true growth in production." },
  { q: "A used car sold between private citizens is NOT included in GDP because:", opts: ["Cars are not final goods", "It was already counted when first sold new — counting it again would be double-counting", "The transaction is illegal", "GDP only counts new services"], correct: 1, exp: "GDP counts final goods and services produced in the current period. A used car sale is a transfer of an existing asset — no new production occurred, so it's excluded." },
  { q: "If Nominal GDP = $25 trillion and Real GDP = $20 trillion, the GDP deflator is:", opts: ["45", "80", "125", "5"], correct: 2, exp: "GDP deflator = (Nominal GDP / Real GDP) × 100 = ($25T / $20T) × 100 = 125. This means the price level is 25% higher than in the base year." },
  { q: "Which of the following is EXCLUDED from GDP?", opts: ["A new house built by a contractor", "Groceries purchased at a supermarket", "A parent cooking meals at home for their family", "A haircut at a salon"], correct: 2, exp: "Non-market activities are excluded from GDP. Home-cooked meals have economic value but no market transaction — no money changes hands, so GDP doesn't capture them." },
  { q: "A negative GDP gap means:", opts: ["The economy is growing faster than potential", "Actual GDP is below potential GDP — the economy is in a recession or underperforming", "The trade deficit exceeds investment", "Government spending exceeds tax revenues"], correct: 1, exp: "GDP gap = actual GDP − potential GDP. Negative gap = recession territory — the economy is producing less than it could at full employment. This is the key measure of economic slack." },
  { q: "The largest component of U.S. GDP is:", opts: ["Government spending (G)", "Investment (I)", "Consumer spending (C)", "Net exports (X − M)"], correct: 2, exp: "Consumer spending (C) is by far the largest component of U.S. GDP — roughly 70% of total output. Investment is second at about 18%, government around 17%, and the U.S. typically runs a net export deficit." },
];

const GROWTH_QS = [
  { q: "Using the Rule of 70, if a country grows at 7% per year, approximately how many years to double GDP?", opts: ["7 years", "10 years", "14 years", "70 years"], correct: 1, exp: "Rule of 70: years to double = 70 ÷ growth rate = 70 ÷ 7 = 10 years. At 2% growth it would take 35 years — small rate differences produce huge long-run outcomes." },
  { q: "Which of the following is the PRIMARY driver of long-run economic growth?", opts: ["Higher consumer spending each year", "Technological progress and productivity improvements", "Population growth alone", "Larger government budgets"], correct: 1, exp: "Technology and productivity (producing more output per worker per unit of capital) are the ultimate drivers of sustained long-run growth. Capital accumulation helps but faces diminishing returns; technology does not." },
  { q: "Human capital refers to:", opts: ["The physical machinery and equipment used in production", "The knowledge, skills, and health of workers that increases productivity", "Financial capital invested in the stock market", "Natural resources owned by the country"], correct: 1, exp: "Human capital = the productive capacity embodied in people through education, training, and health. Higher human capital means workers produce more per hour — a key driver of income differences across countries." },
  { q: "The convergence hypothesis predicts that:", opts: ["Rich countries always grow faster than poor ones", "Poor countries tend to grow faster than rich ones (given good institutions) — they have more room to adopt existing technologies", "All countries reach the same income level within 50 years", "Countries with more natural resources always grow faster"], correct: 1, exp: "Convergence: poor countries can 'borrow' technologies and practices from rich countries, potentially growing faster. But this requires stable institutions, rule of law, and openness to trade. Many poor countries have NOT converged — institutions matter enormously." },
  { q: "If Country A grows at 1% per year and Country B grows at 3% per year, after 70 years:", opts: ["Country A's GDP doubles; Country B's GDP triples", "Country A's GDP doubles; Country B's GDP increases about 8×", "Both countries grow the same amount in the long run", "Country B's growth advantage disappears due to diminishing returns"], correct: 1, exp: "Rule of 70: Country A doubles in 70 years (70÷1). Country B doubles every ~23 years (70÷3), so it doubles about 3 times in 70 years = roughly 8× original size. Compounding makes small rate differences enormous over long periods." },
];

const UNEMPLOYMENT_QS = [
  { q: "A 35-year-old who was laid off 3 months ago and is actively sending out résumés is:", opts: ["Not in the labor force", "Employed", "Unemployed", "Underemployed"], correct: 2, exp: "To be counted as unemployed: must be (1) not working AND (2) actively seeking work. This person is both — they are officially unemployed and counted in the unemployment rate." },
  { q: "A retired teacher who is not looking for work is classified as:", opts: ["Unemployed", "Employed part-time", "Not in the labor force", "Frictionally unemployed"], correct: 2, exp: "Retirees are Not in the Labor Force — they are neither working nor actively seeking work. They are excluded from both the numerator and denominator of the unemployment rate." },
  { q: "Active-duty U.S. military personnel are classified as:", opts: ["Employed", "Unemployed", "Not in the labor force — the unemployment rate is a civilian measure", "Frictionally unemployed"], correct: 2, exp: "Active military are NOT in the civilian labor force — they are excluded from the unemployment rate calculation entirely. This is a civilian measure. Active military are 'Not in the Labor Force.'" },
  { q: "A software developer is laid off when the economy enters recession. This is:", opts: ["Frictional unemployment", "Structural unemployment", "Cyclical unemployment", "Seasonal unemployment"], correct: 2, exp: "Cyclical unemployment: caused by downturns in the business cycle. When aggregate demand falls and firms cut workers, that's cyclical. It's the type of unemployment associated with recessions." },
  { q: "The natural rate of unemployment includes:", opts: ["Cyclical unemployment only", "Frictional and structural unemployment — the baseline that exists even in a healthy economy", "Zero unemployment", "Seasonal and cyclical unemployment"], correct: 1, exp: "Natural rate = frictional + structural. This is the 'normal' level of unemployment even when the economy is at full employment — workers between jobs (frictional) and those with mismatched skills (structural). Cyclical is NOT part of the natural rate." },
  { q: "If the working-age population = 260M, employed = 158M, and unemployed (actively seeking) = 8M, the unemployment rate is:", opts: ["3.1%", "4.8%", "6.2%", "5.0%"], correct: 1, exp: "Labor force = employed + unemployed = 158M + 8M = 166M. Unemployment rate = 8M/166M = 4.82% ≈ 4.8%. Note: the 260M working-age population includes people NOT in the labor force (retirees, students, etc.)." },
];

const INFLATION_QS = [
  { q: "If a basket of goods costs $200 in the base year and $216 this year, the CPI is:", opts: ["8", "108", "16", "216"], correct: 1, exp: "CPI = (Current cost / Base year cost) × 100 = ($216 / $200) × 100 = 108. Inflation rate = (108 − 100) / 100 × 100 = 8%." },
  { q: "Real interest rate = Nominal rate − Inflation rate. If the nominal rate is 6% and inflation is 4%, the real rate is:", opts: ["10%", "2%", "−2%", "24%"], correct: 1, exp: "Real interest rate = 6% − 4% = 2%. This is the true purchasing power return to lenders. If inflation exceeds the nominal rate, the real rate is negative — lenders lose purchasing power." },
  { q: "Who BENEFITS from unexpected inflation?", opts: ["Creditors (lenders) who are owed fixed payments", "Retirees on fixed pension income", "Debtors who borrowed at fixed interest rates before inflation rose", "Holders of cash savings"], correct: 2, exp: "Debtors benefit: they borrowed a certain dollar amount but will repay in dollars that are worth less due to inflation. The real burden of their debt falls. Creditors lose for the same reason." },
  { q: "Core CPI excludes food and energy prices because:", opts: ["Food and energy are not important to consumers", "Food and energy prices are highly volatile — core CPI provides a cleaner signal of underlying inflation trends", "The BLS is unable to measure food prices accurately", "Food and energy are provided free by the government"], correct: 1, exp: "Food and energy prices swing dramatically due to weather, geopolitics, and supply shocks. Core CPI strips them out to reveal the underlying, persistent inflation trend — the signal policymakers care most about." },
  { q: "Hyperinflation occurs when:", opts: ["Inflation exceeds 2% annually", "Inflation rises above the Federal Reserve's target", "Prices rise at extremely rapid rates, often 50%+ per month, destroying the currency's usefulness", "The government raises interest rates too quickly"], correct: 2, exp: "Hyperinflation: extreme rapid price increases (historically 50%+ per month). Examples: Weimar Germany 1923, Zimbabwe 2008. It destroys the currency as a medium of exchange and typically results from governments printing money to finance spending." },
  { q: "Which correctly states the relationship between nominal GDP, real GDP, and the GDP deflator?", opts: ["Real GDP = Nominal GDP × GDP Deflator", "Nominal GDP = Real GDP × (GDP Deflator / 100)", "GDP Deflator = Real GDP / Nominal GDP × 100", "Nominal GDP = Real GDP + GDP Deflator"], correct: 1, exp: "Nominal GDP = Real GDP × (GDP Deflator / 100). Rearranging: Real GDP = Nominal GDP / (GDP Deflator / 100) = Nominal GDP × (100 / GDP Deflator). This is how BEA calculates inflation-adjusted output." },
];

// ─── Cumulative Quiz Pool ───
const QUIZ_POOL = [
  { q: "GDP is calculated as:", opts: ["C + I + G + (X − M)", "C + S + T + G", "Wages + Profits + Rent + Interest + Depreciation", "National Income + Net Foreign Income"], correct: 0, multi: false, exp: "Expenditure approach: GDP = Consumption + Investment + Government + Net Exports. This is the most widely used formulation." },
  { q: "Real GDP differs from Nominal GDP because:", opts: ["Real GDP includes services; nominal doesn't", "Real GDP is adjusted for inflation — it measures actual output growth", "Nominal GDP is always larger than real GDP", "Real GDP excludes net exports"], correct: 1, multi: false, exp: "Real GDP removes price-level changes, showing true production growth. Nominal GDP rises with inflation even if nothing more is produced." },
  { q: "The Rule of 70 says an economy growing at 2% per year will double GDP in:", opts: ["2 years", "70 years", "35 years", "14 years"], correct: 2, multi: false, exp: "Years to double = 70 ÷ growth rate = 70 ÷ 2 = 35 years." },
  { q: "A worker who recently quit to search for a higher-paying job is experiencing:", opts: ["Structural unemployment", "Cyclical unemployment", "Frictional unemployment", "Seasonal unemployment"], correct: 2, multi: false, exp: "Frictional unemployment: voluntary job-search unemployment between positions. It's a normal, healthy part of the labor market — workers matching to better opportunities." },
  { q: "Active-duty military are classified in the labor market as:", opts: ["Employed", "Unemployed", "Not in the labor force — it's a civilian measure", "Frictionally unemployed"], correct: 2, multi: false, exp: "Active military are Not in the Labor Force. The unemployment rate is purely a civilian measure. Military service members are excluded from both numerator and denominator." },
  { q: "The natural unemployment rate includes which types?", opts: ["Cyclical only", "Structural only", "Frictional and structural — the rate in a healthy full-employment economy", "All types including cyclical"], correct: 2, multi: false, exp: "Natural rate = frictional + structural. This is 'normal' even at full employment. Cyclical unemployment disappears in a healthy economy; frictional and structural always exist." },
  { q: "If the basket of goods costs $300 in the base year and $321 this year, the inflation rate is:", opts: ["21%", "7%", "93%", "321"], correct: 1, multi: false, exp: "CPI = (321/300) × 100 = 107. Inflation = (107 − 100) / 100 × 100 = 7%." },
  { q: "Unexpected inflation benefits:", opts: ["Creditors who are owed fixed dollar payments", "People holding large cash savings", "Debtors who borrowed at fixed rates before inflation rose", "Retirees on fixed pensions"], correct: 2, multi: false, exp: "Debtors win: they repay loans in dollars worth less than when they borrowed. Creditors lose purchasing power on their fixed repayments." },
  { q: "Which of the following is excluded from GDP? (Select all that apply)", opts: ["A used car sold between two private individuals", "Illegal drug transactions", "A parent's unpaid childcare at home", "A new laptop sold to a business"], correct: [0, 1, 2], multi: true, exp: "GDP excludes: used goods (already counted), illegal/underground economy transactions, and non-market activities (unpaid household work). A new laptop sold to a business IS included — it's a final investment good." },
  { q: "Which of the following are sources of long-run economic growth? (Select all that apply)", opts: ["Increases in physical capital (machinery, infrastructure)", "Technological progress and productivity gains", "Improvements in human capital (education, health)", "Short-run increases in consumer confidence"], correct: [0, 1, 2], multi: true, exp: "Long-run growth sources: physical capital accumulation, technological progress, and human capital investment. Short-run consumer confidence affects cyclical fluctuations — not the long-run growth trend." },
  { q: "Cyclical unemployment occurs when:", opts: ["Workers are searching between jobs voluntarily", "Workers lack skills demanded by employers", "Demand falls in a recession and firms lay off workers", "Seasonal demand patterns reduce employment temporarily"], correct: 2, multi: false, exp: "Cyclical unemployment: tied to the business cycle. Recessions reduce aggregate demand — firms produce less and lay off workers. It disappears when the economy recovers." },
  { q: "Core CPI excludes food and energy because:", opts: ["These goods are less important to consumers", "Food and energy prices are highly volatile — core CPI reveals the underlying persistent inflation trend", "The government provides food and energy for free", "These prices never change"], correct: 1, multi: false, exp: "Food and energy prices spike and fall due to weather, geopolitics, and supply shocks. Core inflation strips them out to show the trend policymakers target — a cleaner signal of durable inflation." },
  { q: "Which of the following correctly describe GDP measurement? (Select all that apply)", opts: ["GDP counts only final goods and services to avoid double-counting", "Services (haircuts, healthcare, education) are included in GDP", "GDP includes all financial market transactions", "GDP excludes non-market activities like home cooking"], correct: [0, 1, 3], multi: true, exp: "GDP: final goods only (avoids double-counting intermediate goods), includes services (≈70% of U.S. GDP), excludes financial transactions (asset transfers, not new production), and excludes non-market activities." },
  { q: "If nominal interest rate = 5% and inflation = 3%, the real interest rate is:", opts: ["8%", "2%", "15%", "−2%"], correct: 1, multi: false, exp: "Real rate = Nominal − Inflation = 5% − 3% = 2%. This is the true return in purchasing power terms — what lenders actually gain after inflation erodes their dollars." },
  { q: "Structural unemployment is caused by:", opts: ["Workers voluntarily searching for better jobs", "An economic recession reducing demand for all workers", "A mismatch between workers' skills and what employers need — often due to technology or industry shifts", "Temporary seasonal demand patterns"], correct: 2, multi: false, exp: "Structural unemployment: skills mismatch. Technology automation displaces factory workers; the coal industry declines while solar grows. Workers may need retraining — this unemployment doesn't disappear with recovery." },
];

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
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40"}`}>
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
          : <button onClick={() => { if (answers.every(a => a !== null)) submit(); }} disabled={!answers.every(a => a !== null)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 transition">Submit Review Quiz</button>
        }
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
        <p className="text-sm text-amber-700">Mastery requires 13 out of 15. Review the sections and try again.</p>
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 text-sm text-amber-800 font-semibold">This screen cannot be submitted. Only the final Results screen counts.</div>
        <button onClick={onRetry} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition"><RotateCcw className="inline w-4 h-4 mr-2" />Retry Quiz</button>
      </div>
    </div>
  );
}

function ResultsScreen({ score, name, setName }: { score: number; name: string; setName: (n: string) => void }) {
  const [printed, setPrinted] = useState(false);
  function handlePrint() {
    const w = window.open("", "_blank", "width=820,height=960");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>ECO 210 Review Lab Results</title>
    <style>body{font-family:Georgia,serif;max-width:680px;margin:40px auto;color:#1e293b;padding:0 20px}h1{font-size:1.5rem;color:#1e3a5f;border-bottom:3px solid #1e3a5f;padding-bottom:8px}.score{font-size:2.5rem;font-weight:bold;color:#16a34a;margin:16px 0}.badge{display:inline-block;background:#dcfce7;color:#15803d;border:2px solid #16a34a;border-radius:8px;padding:8px 20px;font-weight:bold;font-size:1.1rem}.footer{margin-top:40px;font-size:.75rem;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px}</style>
    </head><body>
    <h1>ECO 210 ECONLAB — Review Lab: Chapters 6–9</h1>
    <div class="score">${score} / 15</div><div class="badge">✓ Mastery Achieved</div>
    <div style="margin-top:16px;font-size:.9rem"><p><strong>Student:</strong> ${name || "(Name not entered)"}</p><p><strong>Completed:</strong> ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p></div>
    <p style="margin-top:20px;font-size:.95rem">This student completed all review sections and achieved mastery on the Ch6–9 cumulative review quiz (≥ 13/15 correct).</p>
    <div style="margin-top:16px;font-size:.85rem;color:#475569"><strong>Chapters Covered:</strong> Ch6 GDP · Ch7 Economic Growth · Ch8 Unemployment · Ch9 Inflation</div>
    <div class="footer">ECO 210 ECONLAB · Review Lab: Chapters 6–9 · OpenStax Principles of Macroeconomics 3e</div>
    </body></html>`);
    w.document.close(); setTimeout(() => w.print(), 600); setPrinted(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-5">
        <Award className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Review Mastery Achieved!</h2>
        <p className="text-4xl font-bold text-green-600">{score} / 15</p>
        <p className="text-sm text-muted-foreground">You've completed the ECO 210 Review Lab covering Chapters 6–9.</p>
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

// ─── Main App ───
export default function EconLab() {
  const [section, setSection] = useState<Section>("intro");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showRef, setShowRef] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [studentName, setStudentName] = useState("");
  const mainRef = useRef<HTMLDivElement>(null);

  const SECTIONS = [
    { id: "measurement",  label: "📊 GDP & Measurement",    short: "GDP",          desc: "7 questions on GDP components, real vs. nominal, and the GDP gap" },
    { id: "growth",       label: "📈 Economic Growth",       short: "Growth",       desc: "5 questions on Rule of 70, sources of growth, and convergence" },
    { id: "unemployment", label: "👷 Unemployment",          short: "Unemployment", desc: "6 questions on labor market classification and types of unemployment" },
    { id: "inflation",    label: "💰 Inflation",             short: "Inflation",    desc: "6 questions on CPI calculation, real interest rates, and winners/losers" },
  ];

  const allDone = SECTIONS.every(s => completed.has(s.id));
  function markDone(id: string) { setCompleted(prev => new Set([...prev, id])); }
  function handlePass(score: number) { setQuizScore(score); localStorage.setItem("econlab_done_review_ch69", "true"); setSection("results"); }
  function handleFail(score: number) { setQuizScore(score); setSection("not-yet"); }

  if (section === "not-yet") return <NotYetScreen score={quizScore} onRetry={() => setSection("quiz")} />;
  if (section === "results") return <ResultsScreen score={quizScore} name={studentName} setName={setStudentName} />;

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
              <p className="text-sm font-bold text-white truncate">Review Lab · Chapters 6–9</p>
            </div>
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
            {allDone
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
            <div className="rounded-2xl border-2 border-primary p-6 bg-primary/5">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Cumulative Review</p>
                  <p className="text-xl font-bold text-foreground">Chapters 6–9</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">This review covers the measurement half of ECO 210 — how we measure what an economy produces (GDP), how fast it grows, who is working, and how prices change. Master these before moving to the AD-AS model and policy.</p>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {["Ch6 GDP", "Ch7 Growth", "Ch8 Unemployment", "Ch9 Inflation"].map((ch, i) => (
                  <div key={i} className="bg-white rounded-lg p-2 text-center border border-border">
                    <p className="text-xs font-semibold text-primary">{ch}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowRef(true)} className="w-full text-left rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 transition flex items-center gap-2">
              <BookOpen size={16} className="text-primary shrink-0" />
              <span>Need a refresher? <span className="text-primary font-semibold underline">Open the Ch6–9 Quick Reference.</span></span>
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTIONS.map(s => {
                const done = completed.has(s.id);
                return (
                  <button key={s.id} onClick={() => setSection(s.id as Section)}
                    className={`rounded-xl border-2 p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${done ? "border-green-400 bg-green-50" : "border-border bg-card hover:border-primary/40"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${done ? "text-green-700" : "text-foreground"}`}>{s.label}</span>
                      {done && <span className="text-green-600 text-lg">✓</span>}
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
            {section === "measurement"  && <QASection questions={MEASUREMENT_QS}  onComplete={() => markDone("measurement")}  label="Ch6 GDP & Measurement"  />}
            {section === "growth"       && <QASection questions={GROWTH_QS}        onComplete={() => markDone("growth")}        label="Ch7 Economic Growth"   />}
            {section === "unemployment" && <QASection questions={UNEMPLOYMENT_QS}  onComplete={() => markDone("unemployment")}  label="Ch8 Unemployment"      />}
            {section === "inflation"    && <QASection questions={INFLATION_QS}     onComplete={() => markDone("inflation")}     label="Ch9 Inflation"         />}
          </div>
        )}

        {section === "quiz" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={() => setSection("intro")} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">← Dashboard</button>
              <button onClick={() => setShowRef(true)} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">📚 Quick Ref</button>
              <h2 className="text-base font-bold text-foreground">🎯 Cumulative Quiz — Chapters 6–9</h2>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-xs text-amber-800 font-semibold">
              15 questions drawn from the Ch6–9 question bank. Mastery = 13/15 correct.
            </div>
            <QuizStation onPass={handlePass} onFail={handleFail} />
          </div>
        )}
      </main>
    </>
  );
}
