import { useState, useRef } from "react";
import { ChevronLeft, Award, BookOpen } from "lucide-react";

type Section = "intro" | "measurement" | "growth" | "unemployment" | "inflation" | "quiz" | "results" | "not-yet";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a;
}
function shuffleOpts(opts: string[], correct: number | number[]): { opts: string[]; correct: number | number[] } {
  const idx = opts.map((_, i) => i); const s = shuffle(idx); const newOpts = s.map(i => opts[i]);
  if (Array.isArray(correct)) return { opts: newOpts, correct: (correct as number[]).map(c => s.indexOf(c)) };
  return { opts: newOpts, correct: s.indexOf(correct as number) };
}

// ─── Quick Reference ───
const REFERENCE = [
  { ch: "Ch6", title: "GDP & National Income", bullets: [
    "GDP = C + I + G + (X − M) — Expenditure Approach",
    "GDP counts final goods only — no intermediate goods, used goods, or financial transactions",
    "Real GDP adjusts for inflation; Nominal GDP does not",
    "GDP per capita = GDP ÷ population — measures standard of living",
    "Limitations: excludes non-market activity, inequality, environmental quality",
  ]},
  { ch: "Ch7", title: "Economic Growth", bullets: [
    "Rule of 70: Years to double = 70 ÷ growth rate",
    "Sources of growth: more labor, more capital, better technology (productivity)",
    "Investment in physical and human capital drives long-run growth",
    "Aggregate Production Function: Y = A × f(K, L)",
    "Convergence theory: poorer countries tend to grow faster than richer ones",
  ]},
  { ch: "Ch8", title: "Unemployment", bullets: [
    "Unemployment rate = (Unemployed ÷ Labor Force) × 100",
    "Labor Force = Employed + Unemployed (actively seeking)",
    "Not in Labor Force: retirees, students not working, discouraged workers, Active Military",
    "Types: Frictional (between jobs), Structural (skills mismatch), Cyclical (recession)",
    "Natural rate = Frictional + Structural; Cyclical = 0 at full employment",
  ]},
  { ch: "Ch9", title: "Inflation", bullets: [
    "CPI inflation rate = [(CPI_new − CPI_old) / CPI_old] × 100",
    "Real value = Nominal value ÷ Price Index × 100",
    "Real interest rate = Nominal rate − Inflation rate (Fisher equation)",
    "Demand-pull: AD rises faster than AS; Cost-push: supply shock raises costs",
    "Hyperinflation: extremely rapid price increase; deflation: falling prices",
  ]},
];

function ReferenceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display font-bold text-base text-foreground">Ch6–9 Quick Reference</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {REFERENCE.map((sec, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-bold text-primary mb-2">{sec.ch} — {sec.title}</p>
              <ul className="space-y-1">{sec.bullets.map((b, j) => <li key={j} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary shrink-0">•</span>{b}</li>)}</ul>
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
  const q = questions[qIdx]; const ans = answers[qIdx]; const isChecked = checked[qIdx];
  const allDone = checked.every(Boolean);
  const score = questions.filter((q, i) => answers[i] === q.correct).length;
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">{label} — Q{qIdx + 1} of {questions.length}</span>
        <div className="flex gap-1">{questions.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === qIdx ? "bg-primary" : checked[i] ? (answers[i] === questions[i].correct ? "bg-green-500" : "bg-red-400") : "bg-muted"}`} />)}</div>
      </div>
      <div className="rounded-xl bg-card border-2 border-border p-5">
        <p className="font-semibold text-sm text-foreground mb-3">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, oi) => {
            let cls = ans === oi ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (isChecked) { if (oi === q.correct) cls = "border-green-500 bg-green-100 text-green-800 font-semibold"; else if (ans === oi) cls = "border-red-400 bg-red-100 text-red-700"; else cls = "border-border text-muted-foreground opacity-40"; }
            return <button key={oi} onClick={() => { if (!isChecked) setAnswers(p => { const n=[...p]; n[qIdx]=oi; return n; }); }} disabled={isChecked} className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition ${cls}`}>{isChecked && oi === q.correct && "✓ "}{opt}</button>;
          })}
        </div>
        {isChecked && <p className="text-xs mt-3 text-muted-foreground italic bg-muted/50 p-2 rounded-lg">{q.exp}</p>}
      </div>
      {!isChecked
        ? <button onClick={() => { if (ans !== null) setChecked(p => { const n=[...p]; n[qIdx]=true; return n; }); }} disabled={ans === null} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Check Answer</button>
        : <div className="flex gap-3">
            {qIdx > 0 && <button onClick={() => setQIdx(qIdx-1)} className="flex-1 py-3 rounded-xl border-2 border-border text-sm font-semibold text-muted-foreground hover:border-primary/40 transition">← Back</button>}
            {qIdx < questions.length - 1
              ? <button onClick={() => setQIdx(qIdx+1)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next →</button>
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
const MEASUREMENT_QS = [
  { q: "Which of the following is included in GDP?", opts: ["A family buys a used car from a neighbor", "A bakery buys flour to make bread for sale", "A contractor builds a new home for a client", "You sell your old textbook to a classmate"], correct: 2, exp: "GDP counts final goods and services produced. Building a new home = new production included. Used goods are not new production. Intermediate goods (flour) are excluded to avoid double counting." },
  { q: "Real GDP differs from Nominal GDP because Real GDP:", opts: ["Excludes government spending", "Adjusts for inflation, allowing comparison of output across years", "Only counts goods, not services", "Includes only domestically consumed output"], correct: 1, exp: "Nominal GDP is measured in current prices. Real GDP removes the effect of price changes, so we can compare true output levels across different years." },
  { q: "GDP per capita is useful because it measures:", opts: ["Total national income", "The average standard of living across the population", "The distribution of income between rich and poor", "Government spending per person"], correct: 1, exp: "GDP per capita = GDP ÷ population. It approximates the average income/output per person — a rough measure of living standards useful for comparing countries." },
  { q: "The Expenditure Approach to GDP sums:", opts: ["Wages + Rent + Interest + Profit", "C + I + G + (X − M)", "Final goods + Intermediate goods + Services", "Tax revenue + Transfer payments + Government purchases"], correct: 1, exp: "Expenditure Approach: GDP = C (consumption) + I (investment) + G (government spending) + NX (net exports = X − M). This is the most common way GDP is taught and reported." },
  { q: "Which is NOT a limitation of GDP as a measure of well-being?", opts: ["GDP ignores income inequality", "GDP excludes non-market production (e.g. volunteer work, home childcare)", "GDP does not account for environmental degradation", "GDP fails to measure the total value of all goods traded in the economy"], correct: 3, exp: "GDP does measure the total market value of final goods and services — that's its definition. The real limitations are what it misses: inequality, non-market activity, sustainability, and quality of life." },
];

const GROWTH_QS = [
  { q: "If an economy grows at 2% per year, approximately how many years will it take to double in size?", opts: ["20 years", "35 years", "70 years", "14 years"], correct: 1, exp: "Rule of 70: Years to double = 70 ÷ growth rate = 70 ÷ 2 = 35 years. Small differences in growth rates compound dramatically over time." },
  { q: "Which of the following is the most important long-run source of economic growth?", opts: ["Government deficit spending", "Technological progress and productivity improvements", "Population growth alone", "Increasing imports"], correct: 1, exp: "Technology and productivity growth (total factor productivity) is the primary long-run engine. More capital and labor help, but without productivity gains, growth eventually hits diminishing returns." },
  { q: "Human capital refers to:", opts: ["Physical tools and machinery used in production", "Financial investments in the stock market", "The skills, education, and training embodied in workers", "Natural resources available to the economy"], correct: 2, exp: "Human capital = the productive capacity embedded in people through education, training, and experience. Investment in human capital raises productivity and wages." },
  { q: "Convergence theory in economics predicts that:", opts: ["Rich countries will always grow faster than poor countries", "Poor countries tend to grow faster than rich countries, narrowing the income gap over time", "All countries will reach the same income level within 50 years", "Trade agreements cause all countries to grow at the same rate"], correct: 1, exp: "Convergence: capital has diminishing returns. Poor countries with less capital get higher returns on new investment → faster growth. This is why developing economies often grow faster than advanced ones, conditional on good institutions." },
  { q: "Which policy would MOST directly promote long-run economic growth?", opts: ["Increasing short-run consumer spending through tax cuts", "Investing in education, infrastructure, and research & development", "Reducing interest rates to stimulate borrowing", "Expanding the money supply"], correct: 1, exp: "Long-run growth comes from expanding productive capacity: better-educated workers, improved infrastructure, and R&D that generates technological progress. Monetary/fiscal stimulus helps short-run output but doesn't raise long-run potential." },
];

const UNEMPLOYMENT_QS = [
  { q: "The unemployment rate is calculated as:", opts: ["(Unemployed ÷ Total Population) × 100", "(Unemployed ÷ Labor Force) × 100", "(Employed ÷ Total Population) × 100", "(Unemployed ÷ Employed) × 100"], correct: 1, exp: "Unemployment rate = (Unemployed ÷ Labor Force) × 100. Labor Force = Employed + Unemployed. People not looking for work are NOT in the labor force and not counted in this rate." },
  { q: "A worker who lost her job due to a recession is experiencing:", opts: ["Frictional unemployment", "Structural unemployment", "Cyclical unemployment", "Seasonal unemployment"], correct: 2, exp: "Cyclical unemployment is caused by downturns in the business cycle. When aggregate demand falls, businesses lay off workers. This type of unemployment disappears when the economy recovers." },
  { q: "A coal miner who loses his job because power plants switched to natural gas is experiencing:", opts: ["Frictional unemployment", "Structural unemployment", "Cyclical unemployment", "Voluntary unemployment"], correct: 1, exp: "Structural unemployment: a permanent shift in the economy (technology, energy transition) eliminates certain types of jobs. Retraining is needed because the old skills no longer match available jobs." },
  { q: "Which of the following people is classified as UNEMPLOYED?", opts: ["A retiree who stopped working 5 years ago", "A student enrolled full-time who is not working", "A worker who was laid off last week and is actively applying for jobs", "A member of the Active Military"], correct: 2, exp: "To be unemployed: not working AND actively searching for work. Retirees, full-time students not working, and Active Military are all classified as Not in the Labor Force." },
  { q: "The natural rate of unemployment includes:", opts: ["Only cyclical unemployment", "Frictional and structural unemployment — the unemployment that exists even at full employment", "All unemployment during a recession", "Zero — full employment means no unemployment"], correct: 1, exp: "Natural rate = frictional + structural. Even at 'full employment,' some workers are between jobs (frictional) or retraining (structural). Cyclical unemployment is zero at the natural rate. The natural rate is typically 4–5% in the U.S." },
];

const INFLATION_QS = [
  { q: "If the CPI was 240 last year and is 252 this year, the inflation rate is:", opts: ["12%", "5%", "4.8%", "252%"], correct: 1, exp: "Inflation rate = [(252 − 240) / 240] × 100 = [12/240] × 100 = 5%. Always divide by the BASE year (old) CPI. The change is $12 on a base of $240." },
  { q: "The real interest rate equals:", opts: ["Nominal interest rate + inflation rate", "Nominal interest rate − inflation rate", "Inflation rate − nominal interest rate", "Nominal interest rate × inflation rate"], correct: 1, exp: "Fisher equation: Real rate = Nominal rate − Inflation rate. If your savings account pays 4% but inflation is 6%, your real purchasing power is falling at 2% per year." },
  { q: "Demand-pull inflation occurs when:", opts: ["Rising oil prices increase the cost of production", "Aggregate demand grows faster than aggregate supply, pulling prices up", "The government prints money to pay off debt", "Workers demand higher wages, increasing business costs"], correct: 1, exp: "Demand-pull: 'too much money chasing too few goods.' AD shifts right faster than AS can respond → prices rise. Common during economic booms or periods of heavy government stimulus." },
  { q: "Which group is MOST harmed by unexpected inflation?", opts: ["Borrowers with fixed-rate loans", "People who own real estate", "People living on fixed nominal incomes (e.g., retirees on fixed pensions)", "Companies with large inventories of goods"], correct: 2, exp: "Unexpected inflation hurts fixed-income recipients most — their nominal income stays the same while prices rise, eroding real purchasing power. Borrowers actually benefit from inflation (they repay with cheaper dollars)." },
  { q: "Cost-push inflation is caused by:", opts: ["Excess consumer demand driving prices up", "A negative supply shock (e.g., rising energy costs) that increases production costs and shifts SRAS left", "The Federal Reserve printing too much money", "Government spending exceeding tax revenue"], correct: 1, exp: "Cost-push: supply shock raises input costs → firms reduce output AND raise prices → SRAS shifts left → higher price level + lower real GDP (stagflation). Oil price spikes are the classic example." },
];

// ─── Quiz Pool (15 questions) ───
const QUIZ_POOL = [
  { q: "Which of the following would be EXCLUDED from GDP?", opts: ["A new laptop sold at Best Buy", "A government payment to a Social Security recipient", "Construction of a new office building", "A haircut at a local salon"], correct: 1, multi: false, exp: "Transfer payments (Social Security, welfare) are excluded — they redistribute income but don't represent new production. GDP counts only final goods and services produced." },
  { q: "Real GDP is preferred over Nominal GDP for comparing output across years because:", opts: ["Real GDP grows faster than Nominal GDP", "Real GDP removes the effect of price changes, isolating changes in actual output", "Real GDP includes more sectors of the economy", "Real GDP is easier to calculate"], correct: 1, multi: false, exp: "Nominal GDP rises when prices rise even if output is unchanged. Real GDP uses constant base-year prices, so changes reflect actual production changes, not inflation." },
  { q: "Using the Rule of 70, a country growing at 3.5% per year will double its GDP in approximately:", opts: ["20 years", "35 years", "70 years", "10 years"], correct: 0, multi: false, exp: "Rule of 70: 70 ÷ 3.5 = 20 years. This rule shows why small differences in growth rates matter enormously over decades." },
  { q: "The unemployment rate = (Unemployed ÷ Labor Force) × 100. With 160M employed and 10M unemployed, the rate is:", opts: ["5.9%", "6.25%", "10%", "6.5%"], correct: 0, multi: false, exp: "Labor Force = 160 + 10 = 170M. Rate = 10/170 × 100 = 5.88% ≈ 5.9%. Note: the 160M population is NOT used as the denominator — only the labor force." },
  { q: "The CPI was 280 in 2023 and 294 in 2024. The inflation rate for 2024 is:", opts: ["14%", "5%", "4.8%", "5.26%"], correct: 1, multi: false, exp: "[(294 − 280) / 280] × 100 = [14/280] × 100 = 5%. Divide the change by the base year (2023) value." },
  { q: "A discouraged worker is someone who:", opts: ["Works part-time but wants full-time work", "Has given up looking for work and is no longer counted in the labor force", "Is between jobs and actively searching", "Works in a declining industry"], correct: 1, multi: false, exp: "Discouraged workers stopped job searching because they believe no jobs are available for them. They are NOT counted as unemployed — they fall out of the labor force entirely, which can cause the unemployment rate to understate joblessness." },
  { q: "Which correctly describes the Fisher equation?", opts: ["Real rate = Inflation rate + Nominal rate", "Real rate = Nominal rate − Inflation rate", "Nominal rate = Real rate − Inflation rate", "Inflation rate = Nominal rate × Real rate"], correct: 1, multi: false, exp: "Fisher equation: Real rate = Nominal rate − Inflation rate. A 5% nominal return with 3% inflation gives a 2% real return. Unexpected inflation can make real returns negative." },
  { q: "Which source of economic growth has the GREATEST impact on long-run living standards?", opts: ["Increasing the labor force through immigration", "Technological progress and productivity growth", "Reducing the budget deficit", "Expanding consumer credit"], correct: 1, multi: false, exp: "Technological progress (total factor productivity) drives the largest share of long-run growth. Capital and labor face diminishing returns — only technology can continuously lift productivity without running into limits." },
  { q: "Cost-push inflation differs from demand-pull inflation because cost-push:", opts: ["Is caused by too much consumer spending", "Results from supply shocks that raise production costs, pushing prices up while reducing output", "Always leads to hyperinflation", "Only affects luxury goods"], correct: 1, multi: false, exp: "Cost-push: negative supply shock (e.g., oil price spike) → higher costs → SRAS shifts left → higher prices AND lower real GDP. Demand-pull: AD shifts right → higher prices with higher output. Stagflation is the cost-push outcome." },
  { q: "Structural unemployment results from:", opts: ["A recession reducing demand for workers across industries", "A worker voluntarily quitting to find a better job", "A permanent mismatch between workers' skills and available jobs due to technology or industry shifts", "Seasonal fluctuations in demand for labor"], correct: 2, multi: false, exp: "Structural unemployment: the economy's structure changes (technology replaces workers, industries decline) and workers' skills no longer match available jobs. Retraining is required. It persists even during economic booms." },
  { q: "GDP per capita is best described as:", opts: ["The median household income in a country", "Total output divided by population — a rough measure of average living standards", "The total value of all goods produced for export", "Income after taxes per person"], correct: 1, multi: false, exp: "GDP per capita = GDP ÷ population. It measures average output per person and allows cross-country comparisons of living standards. It does NOT capture distribution — a country with high GDP per capita can still have significant inequality." },
  { q: "Frictional unemployment is:", opts: ["Unemployment caused by recessions", "Normal, short-term unemployment from workers transitioning between jobs", "Unemployment caused by automation replacing workers", "Unemployment among workers with outdated skills"], correct: 1, multi: false, exp: "Frictional unemployment is natural and healthy — workers between jobs while searching for better matches. It exists even in a booming economy and is part of the natural rate. Job search takes time." },
  { q: "Human capital investment refers to:", opts: ["Buying machinery and equipment for production", "Education, training, and health improvements that increase worker productivity", "Building new factories and infrastructure", "Purchasing stocks and bonds"], correct: 1, multi: false, exp: "Human capital = productive skills and knowledge in people. Education and job training increase human capital, raising both individual wages and overall economic productivity and growth." },
  { q: "Which of the following correctly identifies a component of the expenditure approach to GDP?", opts: ["Wages paid to workers (W)", "Business investment in equipment and structures (I)", "Corporate profit (Π)", "Interest income earned by households (r)"], correct: 1, multi: false, exp: "GDP = C + I + G + NX. Investment (I) includes business spending on equipment, structures, and inventories. Wages, profit, and interest are income approach components, not expenditure approach." },
  { q: "When the economy is at the natural rate of unemployment:", opts: ["There is zero unemployment", "Only frictional and structural unemployment exist — cyclical unemployment is zero", "The economy is in a recession", "The Federal Reserve must cut interest rates"], correct: 1, multi: false, exp: "At the natural rate, cyclical unemployment = 0. Frictional and structural unemployment still exist (that's natural). This is what economists mean by 'full employment' — not literally zero unemployment." },
];

// ─── Quiz Station ───
type QuizResult = { q: string; correct: boolean; exp: string };

function QuizStation({ onPass, onFail }: { onPass: (score: number, results: QuizResult[]) => void; onFail: (score: number, results: QuizResult[]) => void }) {
  const TOTAL = 15;
  const [questions] = useState(() => shuffle(QUIZ_POOL).slice(0, TOTAL).map(q => { const s = shuffleOpts(q.opts, q.correct); return { ...q, opts: s.opts, correct: s.correct }; }));
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(TOTAL).fill(null));
  const cur = questions[idx]; const curAns = answers[idx];

  function select(oi: number) { setAnswers(prev => { const n=[...prev]; n[idx]=oi; return n; }); }
  function isAnswered() { return curAns !== null; }
  function allAnswered() { return answers.every(a => a !== null); }

  function submit() {
    const results: QuizResult[] = questions.map((q, i) => ({ q: q.q, correct: answers[i] === q.correct, exp: q.exp }));
    const score = results.filter(r => r.correct).length;
    if (score >= 13) onPass(score, results); else onFail(score, results);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Question {idx + 1} of {TOTAL}</span>
        <div className="flex gap-0.5 flex-wrap justify-end">{answers.map((a, i) => <div key={i} className={`w-2 h-2 rounded-full ${i === idx ? "bg-primary" : a !== null ? "bg-green-500" : "bg-muted"}`} />)}</div>
      </div>
      <div className="rounded-xl bg-card border-2 border-border p-5">
        <p className="font-semibold text-foreground text-sm mb-3">{cur.q}</p>
        <div className="space-y-2">
          {cur.opts.map((opt, oi) => (
            <button key={oi} onClick={() => select(oi)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition ${curAns === oi ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40"}`}>
              <span className="font-bold mr-2">{String.fromCharCode(65+oi)}.</span>{opt}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        {idx > 0 && <button onClick={() => setIdx(idx-1)} className="flex-1 py-3 rounded-xl border-2 border-border text-sm font-semibold text-muted-foreground hover:border-primary/40 transition">← Back</button>}
        {idx < TOTAL - 1
          ? <button onClick={() => { if (isAnswered()) setIdx(idx+1); }} disabled={!isAnswered()} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Next →</button>
          : <button onClick={submit} disabled={!allAnswered()} className="flex-1 py-3 rounded-xl font-bold text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 transition">Submit Review Quiz</button>
        }
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
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [sectionScores, setSectionScores] = useState<Record<string, { score: number; total: number }>>({});
  const [studentName, setStudentName] = useState("");

  const SECTIONS = [
    { id: "measurement", label: "📊 GDP & Measurement",  short: "GDP",         desc: "5 questions on GDP, real vs. nominal, and expenditure approach" },
    { id: "growth",      label: "📈 Economic Growth",    short: "Growth",      desc: "5 questions on sources of growth, Rule of 70, human capital" },
    { id: "unemployment",label: "👷 Unemployment",       short: "Unemployment",desc: "5 questions on types, rate calculation, and labor force" },
    { id: "inflation",   label: "💰 Inflation",          short: "Inflation",   desc: "5 questions on CPI, real vs. nominal, demand-pull vs. cost-push" },
  ];

  const allDone = SECTIONS.every(s => completed.has(s.id));

  function markDone(id: string, score: number, total: number) {
    setSectionScores(prev => ({ ...prev, [id]: { score, total } }));
    setCompleted(prev => new Set([...prev, id]));
    setSection("intro");
  }

  function handlePass(score: number, results: QuizResult[]) {
    setQuizScore(score);
    setQuizResults(results);
    try { localStorage.setItem("econlab_done_review_ch69", "true"); } catch(e) {}
    setSection("results");
  }
  function handleFail(score: number, results: QuizResult[]) {
    setQuizScore(score);
    setQuizResults(results);
    setSection("not-yet");
  }

  function handlePrint() {
    const w = window.open("", "_blank", "width=820,height=960");
    if (!w) return;
    const SECTION_LABELS: Record<string,string> = { measurement:"GDP & Measurement", growth:"Economic Growth", unemployment:"Unemployment", inflation:"Inflation" };
    const now = new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
    const sectionRows = Object.entries(sectionScores).map(([id,s]) =>
      `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0">${SECTION_LABELS[id]||id}</td><td style="padding:6px 10px;border:1px solid #e2e8f0;text-align:center;font-weight:bold;color:${s.score===s.total?"#16a34a":"#475569"}">${s.score}/${s.total}</td></tr>`
    ).join("");
    const quizRows = quizResults.map((r,i) =>
      `<tr style="background:${r.correct?"#f0fdf4":"#fef2f2"}">
        <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;font-weight:bold">${r.correct?"✓":"✗"}</td>
        <td style="padding:8px;border:1px solid #e2e8f0"><strong>Q${i+1}:</strong> ${r.q}</td>
        <td style="padding:8px;border:1px solid #e2e8f0;font-size:11px;color:#475569">${r.exp}</td>
      </tr>`
    ).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>ECO 210 Review Lab 2 Results</title>
    <style>body{font-family:Arial,sans-serif;max-width:720px;margin:40px auto;color:#1e293b;padding:0 20px}h1{font-size:1.4rem;color:#1a2744;border-bottom:3px solid #1a2744;padding-bottom:8px}h2{font-size:1rem;color:#1a2744;margin-top:24px}table{width:100%;border-collapse:collapse;margin-top:8px}th{background:#1a2744;color:white;padding:8px 10px;text-align:left;font-size:12px}.footer{margin-top:40px;font-size:.75rem;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px}</style>
    </head><body>
    <h1>ECO 210 ECONLAB — Review Lab 2: Chapters 6–9</h1>
    <p><strong>Student:</strong> ${studentName||"—"} &nbsp;&nbsp; <strong>Date:</strong> ${now}</p>
    <p><strong>Quiz Score:</strong> ${quizScore}/15 &nbsp;&nbsp; <strong>Status:</strong> ${quizScore>=13?"✓ Mastery Achieved":"Needs Review"}</p>
    <h2>Station Scores</h2>
    <table><thead><tr><th>Station</th><th style="width:80px;text-align:center">Score</th></tr></thead><tbody>${sectionRows}</tbody></table>
    <h2>Quiz Question Review (15 Questions)</h2>
    <table><thead><tr><th style="width:30px"></th><th>Question</th><th>Explanation</th></tr></thead><tbody>${quizRows}</tbody></table>
    <div class="footer">ECO 210 ECONLAB · Review Lab 2: Chapters 6–9 · Access for free at https://openstax.org/books/principles-macroeconomics-3e/pages/1-introduction</div>
    </body></html>`);
    w.document.close(); setTimeout(() => w.print(), 600);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showRef && <ReferenceModal onClose={() => setShowRef(false)} />}

      {/* ── Results Screen ── */}
      {section === "results" && (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-5">
            <div className="text-center">
              <Award className="w-16 h-16 text-green-500 mx-auto mb-3" />
              <p className="text-4xl font-bold text-green-600">{quizScore} / 15</p>
              <p className="text-sm text-muted-foreground mt-1">ECO 210 Review Lab 2 · Chapters 6–9</p>
            </div>
            {Object.keys(sectionScores).length > 0 && (
              <div className="bg-muted rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-foreground">Station Scores</p>
                {[{id:"measurement",label:"GDP & Measurement"},{id:"growth",label:"Economic Growth"},{id:"unemployment",label:"Unemployment"},{id:"inflation",label:"Inflation"}].map(s => sectionScores[s.id] && (
                  <div key={s.id} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className={`font-bold ${sectionScores[s.id].score===sectionScores[s.id].total?"text-green-600":"text-amber-600"}`}>{sectionScores[s.id].score}/{sectionScores[s.id].total}</span>
                  </div>
                ))}
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1">Your Name (required for credit)</label>
              <input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="First and Last Name"
                className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            {quizResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <p className="text-xs font-bold text-foreground">Quiz Question Review</p>
                {quizResults.map((r,i) => (
                  <div key={i} className={`rounded-xl border p-3 ${r.correct?"border-green-200 bg-green-50":"border-red-200 bg-red-50"}`}>
                    <p className="text-xs font-semibold">{r.correct?"✓":"✗"} Q{i+1}: {r.q}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.exp}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={handlePrint} disabled={!studentName.trim()} className="flex-1 py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition text-sm">🖨️ Print PDF</button>
              <button onClick={() => { setSection("intro"); setQuizResults([]); setSectionScores({}); setCompleted(new Set()); }} className="flex-1 py-3 bg-muted hover:bg-accent text-muted-foreground rounded-xl font-semibold transition text-sm">↺ Start Over</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Not Yet Screen ── */}
      {section === "not-yet" && (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor:"#fef3c7" }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-5">
            <div className="text-5xl">📖</div>
            <h2 className="text-2xl font-bold text-amber-800">Not Yet</h2>
            <p className="text-amber-700 font-medium">You scored {quizScore} out of 15.</p>
            <p className="text-sm text-amber-700">Mastery requires 13 out of 15. Review the sections and try again.</p>
            <p className="text-xs text-amber-600 font-semibold border border-amber-300 rounded-xl p-3 bg-amber-50">This screen cannot be submitted. Only the final Results screen counts.</p>
            <button onClick={() => setSection("quiz")} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition">← Try the Quiz Again</button>
          </div>
        </div>
      )}

      {/* ── Main Lab (everything except results/not-yet) ── */}
      {section !== "results" && section !== "not-yet" && (
        <>
          <header style={{ backgroundColor:"hsl(222,42%,19%)" }} className="text-white px-4 py-3 shadow-lg sticky top-0 z-50">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <a href="https://www.perplexity.ai/computer/a/eco-210-econlab-course-hub-JgrfOPjHQ5iSYovw19FfIg" target="_blank" rel="noopener noreferrer"
                  className="hidden sm:flex text-white/80 hover:text-white text-xs font-medium whitespace-nowrap items-center gap-1 transition shrink-0">
                  <ChevronLeft className="w-3.5 h-3.5" />Course Hub
                </a>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">ECO 210 ECONLAB</p>
                  <p className="text-sm font-bold text-white truncate">Review Lab 2 · Chapters 6–9</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 flex-wrap">
                {SECTIONS.map(s => { const done=completed.has(s.id); const active=section===s.id; return (
                  <button key={s.id} onClick={() => setSection(s.id as Section)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active?"bg-white/20 text-white font-semibold":done?"text-white/90":"text-white/60 hover:text-white"}`}>
                    {done&&!active?"✓ ":""}{s.short}
                  </button>
                ); })}
                {allDone
                  ? <button onClick={() => setSection("quiz")} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${section==="quiz"?"bg-white/20 text-white font-semibold":"text-white/90 hover:text-white"}`}>🎯 Quiz</button>
                  : <span className="px-3 py-1.5 text-xs text-white/35 cursor-not-allowed select-none">🔒 Quiz</span>
                }
              </div>
              <div className="sm:hidden flex items-center gap-2 shrink-0">
                <span className="text-xs text-white/60">{completed.size}/{SECTIONS.length}</span>
                <div className="w-14 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full transition-all" style={{ width:`${(completed.size/SECTIONS.length)*100}%` }} />
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {/* Dashboard */}
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
                  <p className="text-sm text-muted-foreground">This review covers GDP measurement, economic growth, unemployment, and inflation — the foundations of macroeconomics.</p>
                </div>
                <button onClick={() => setShowRef(true)} className="w-full text-left rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 transition flex items-center gap-2">
                  <BookOpen size={16} className="text-primary shrink-0" />
                  <span>Need a refresher? <span className="text-primary font-semibold underline">Open the Ch6–9 Quick Reference.</span></span>
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SECTIONS.map(s => { const done=completed.has(s.id); return (
                    <button key={s.id} onClick={() => setSection(s.id as Section)}
                      className={`rounded-xl border-2 p-4 text-left transition ${done?"border-green-400 bg-green-50":"border-border bg-card hover:border-primary/40"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold ${done?"text-green-700":"text-foreground"}`}>{s.label}</span>
                        {done && sectionScores[s.id] && <span className="text-xs font-bold bg-green-100 text-green-700 border border-green-300 rounded-full px-2 py-0.5">{sectionScores[s.id].score}/{sectionScores[s.id].total} ✓</span>}
                        {done && !sectionScores[s.id] && <span className="text-green-600 text-lg">✓</span>}
                      </div>
                      <span className="text-xs text-muted-foreground">{done?"Completed":s.desc}</span>
                    </button>
                  ); })}
                </div>
                {allDone
                  ? <button onClick={() => setSection("quiz")} className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-base transition flex items-center justify-center gap-2">
                      <Award size={20} /> Take the Cumulative Quiz (15 Questions)
                    </button>
                  : <div className="w-full py-4 bg-muted text-muted-foreground/60 rounded-xl font-bold text-base text-center">🔒 Quiz — Complete all sections to unlock · 13/15 required for mastery</div>
                }
              </div>
            )}

            {/* Station views */}
            {section !== "intro" && section !== "quiz" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5 items-center">
                  <button onClick={() => setSection("intro")} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">← Dashboard</button>
                  <button onClick={() => setShowRef(true)} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">📚 Quick Ref</button>
                </div>
                <div className="rounded-xl bg-card border-2 border-border p-4">
                  <h2 className="text-base font-bold text-foreground">{SECTIONS.find(s => s.id === section)?.label}</h2>
                </div>
                {section==="measurement"  && <QASection questions={MEASUREMENT_QS}  onComplete={(sc,t) => markDone("measurement",sc,t)}  label="Ch6 GDP & Measurement" />}
                {section==="growth"       && <QASection questions={GROWTH_QS}        onComplete={(sc,t) => markDone("growth",sc,t)}        label="Ch7 Economic Growth" />}
                {section==="unemployment" && <QASection questions={UNEMPLOYMENT_QS}  onComplete={(sc,t) => markDone("unemployment",sc,t)}  label="Ch8 Unemployment" />}
                {section==="inflation"    && <QASection questions={INFLATION_QS}     onComplete={(sc,t) => markDone("inflation",sc,t)}     label="Ch9 Inflation" />}
              </div>
            )}

            {/* Quiz view */}
            {section === "quiz" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => setSection("intro")} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">← Dashboard</button>
                  <button onClick={() => setShowRef(true)} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">📚 Quick Ref</button>
                  <h2 className="text-base font-bold text-foreground">🎯 Cumulative Quiz — Chapters 6–9</h2>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-xs text-amber-800 font-semibold">
                  15 questions · Mastery = 13/15 correct
                </div>
                <QuizStation onPass={handlePass} onFail={handleFail} />
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}
