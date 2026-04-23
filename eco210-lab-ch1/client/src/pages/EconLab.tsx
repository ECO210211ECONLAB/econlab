import { useState } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "oppcost" | "factors" | "micromacro" | "circularflow" | "systems" | "recap" | "quiz" | "results" | "not-yet";

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
const CH1_SUMMARY = [
  { heading: "1.1 What Is Economics, and Why Is It Important?", body: "Economics seeks to solve the problem of scarcity, which is when human wants for goods and services exceed the available supply. A modern economy displays a division of labor, in which people earn income by specializing in what they produce and then use that income to purchase the products they need or want. The division of labor allows individuals and firms to specialize and to produce more for several reasons: a) It allows the agents to focus on areas of advantage due to natural factors and skill levels; b) It encourages the agents to learn and invent; c) It allows agents to take advantage of economies of scale. Division and specialization of labor only work when individuals can purchase what they do not produce in markets. Learning about economics helps you understand the major problems facing the world today, prepares you to be a good citizen, and helps you become a well-rounded thinker." },
  { heading: "1.2 Microeconomics and Macroeconomics", body: "Microeconomics and macroeconomics are two different perspectives on the economy. The microeconomic perspective focuses on parts of the economy: individuals, firms, and industries. The macroeconomic perspective looks at the economy as a whole, focusing on goals like growth in the standard of living, unemployment, and inflation. Macroeconomics has two types of policies for pursuing these goals: monetary policy and fiscal policy." },
  { heading: "1.3 How Economists Use Theories and Models to Understand Economic Issues", body: "Economists analyze problems differently than do other disciplinary experts. The main tools economists use are economic theories or models. A theory is not an illustration of the answer to a problem. Rather, a theory is a tool for determining the answer." },
  { heading: "1.4 How To Organize Economies: An Overview of Economic Systems", body: "We can organize societies as traditional, command, or market-oriented economies. Most societies are a mix. The last few decades have seen globalization evolve as a result of growth in commercial and financial networks that cross national borders, making businesses and workers from different economies increasingly interdependent." },
];

function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="summary-title">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 id="summary-title" className="font-display font-bold text-base text-foreground">Chapter 1 Summary</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" aria-label="Close">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {CH1_SUMMARY.map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground mb-1">{s.heading}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-2">
            Access for free at{" "}
            <a href="https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction" target="_blank" rel="noopener noreferrer" className="underline text-primary">https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction</a>
          </p>
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={onClose} className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition">Close &amp; Return to Lab</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 1 — Opportunity Cost Calculator
// ─────────────────────────────────────────────
const OPP_SCENARIOS = [
  {
    id: 1,
    scenario: "You have Friday evening free. You can either study for your upcoming economics exam or go to a concert with friends (tickets already purchased — non-refundable).",
    question: "What is the opportunity cost of choosing to study?",
    options: ["The cost of the concert ticket", "The enjoyment of attending the concert with friends", "The grade you would have received on the exam", "The time spent traveling to campus"],
    correct: 1,
    exp: "The opportunity cost of studying is the enjoyment of the concert — the next-best alternative you give up. Note: the ticket price is a sunk cost (already paid, non-refundable) and is NOT the opportunity cost.",
  },
  {
    id: 2,
    scenario: "A factory owner has $500,000 in savings. She can either invest it in upgrading her factory equipment (expected return: $40,000/year) or deposit it in a savings account (interest: $20,000/year).",
    question: "If she chooses to upgrade the factory, what is her opportunity cost?",
    options: ["$500,000 (the full investment)", "$40,000 (the factory return)", "$20,000 (the forgone interest)", "$60,000 (the combined return of both options)"],
    correct: 2,
    exp: "The opportunity cost is $20,000 — the interest she gives up by choosing the factory investment over the savings account. Opportunity cost is always the value of the NEXT-BEST alternative forgone.",
  },
  {
    id: 3,
    scenario: "A college student takes an unpaid internship over the summer instead of working a paid job that would have earned her $8,000.",
    question: "What is the economic opportunity cost of the internship?",
    options: ["$0 — because the internship is free", "$8,000 in forgone wages", "The tuition she paid for college", "The cost of her transportation to the internship"],
    correct: 1,
    exp: "The opportunity cost is $8,000 — the wages she could have earned at the paid job. Even though the internship has no direct monetary cost, choosing it means giving up $8,000 in wages. This is a real economic cost.",
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
    if (sel === q.correct) setScore(s => s + 1);
  }

  function next() {
    if (idx + 1 < OPP_SCENARIOS.length) {
      setIdx(idx + 1); setSel(null); setChecked(false);
    } else {
      setDone(true);
    }
  }

  if (done) return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-lg font-bold text-green-800">You got {score}/{OPP_SCENARIOS.length} correct</p>
        <p className="text-sm text-green-700 mt-1">{score === 3 ? "Perfect — you understand opportunity cost." : "Review the explanations above and remember: opportunity cost is always the next-best alternative forgone."}</p>
      </div>
      <button onClick={onComplete} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">Opportunity Cost</p>
        <p>Every choice has an opportunity cost — the value of the <strong>next-best alternative you give up</strong>. It is not the cost of what you chose; it is the cost of what you didn't choose.</p>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Scenario {idx + 1} of {OPP_SCENARIOS.length}</span>
        <div className="flex gap-1">{OPP_SCENARIOS.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < idx ? "bg-green-500" : i === idx ? "bg-primary" : "bg-muted"}`} />)}</div>
      </div>
      <div className="bg-card border-2 border-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground italic mb-2">{q.scenario}</p>
        <p className="text-sm font-semibold text-foreground mb-3">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, oi) => {
            let cls = "border-border text-foreground";
            if (checked) {
              if (oi === q.correct) cls = "border-green-500 bg-green-50 text-green-800 font-semibold";
              else if (oi === sel) cls = "border-red-400 bg-red-50 text-red-700";
              else cls = "border-border text-muted-foreground opacity-50";
            } else if (sel === oi) cls = "border-primary bg-primary/10 text-primary font-semibold";
            return (
              <button key={oi} disabled={checked} onClick={() => setSel(oi)}
                className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-sm transition ${cls} ${!checked ? "hover:border-primary/40" : ""}`}>
                <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
              </button>
            );
          })}
        </div>
        {checked && <p className={`mt-3 text-xs font-medium ${sel === q.correct ? "text-green-700" : "text-amber-700"}`}>{sel === q.correct ? "✓ Correct! " : "✗ Not quite. "}{q.exp}</p>}
      </div>
      {!checked
        ? <button onClick={check} disabled={sel === null} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">Check Answer</button>
        : <button onClick={next} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">{idx + 1 < OPP_SCENARIOS.length ? "Next Scenario →" : "See Results"}</button>
      }
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 2 — Factors of Production Sorter
// ─────────────────────────────────────────────
type Factor = "land" | "labor" | "capital" | "entrepreneurship";

const FACTOR_ITEMS = [
  { id: 1, text: "A farmer's wheat field", correct: "land" as Factor },
  { id: 2, text: "A software engineer writing code", correct: "labor" as Factor },
  { id: 3, text: "A delivery company's fleet of trucks", correct: "capital" as Factor },
  { id: 4, text: "An entrepreneur launching a new food app", correct: "entrepreneurship" as Factor },
  { id: 5, text: "An offshore oil deposit", correct: "land" as Factor },
  { id: 6, text: "A factory worker assembling cars", correct: "labor" as Factor },
  { id: 7, text: "A hospital's MRI machine", correct: "capital" as Factor },
  { id: 8, text: "A startup founder combining resources to disrupt retail", correct: "entrepreneurship" as Factor },
  { id: 9, text: "A river used to generate hydroelectric power", correct: "land" as Factor },
  { id: 10, text: "A teacher educating students", correct: "labor" as Factor },
  { id: 11, text: "A warehouse storing finished goods", correct: "capital" as Factor },
  { id: 12, text: "A small business owner taking financial risk to open a bakery", correct: "entrepreneurship" as Factor },
];

const FACTOR_BUCKETS: { key: Factor; label: string; color: string }[] = [
  { key: "land", label: "🌍 Land", color: "border-green-400 bg-green-50" },
  { key: "labor", label: "👷 Labor", color: "border-blue-400 bg-blue-50" },
  { key: "capital", label: "🏭 Capital", color: "border-amber-400 bg-amber-50" },
  { key: "entrepreneurship", label: "💡 Entrepreneurship", color: "border-purple-400 bg-purple-50" },
];

function FactorsStation({ onComplete }: { onComplete: () => void }) {
  const [placements, setPlacements] = useState<Record<number, Factor>>({});
  const [checked, setChecked] = useState(false);

  const allPlaced = FACTOR_ITEMS.every(item => placements[item.id]);

  function place(id: number, bucket: Factor) {
    if (checked) return;
    setPlacements(p => ({ ...p, [id]: bucket }));
  }

  const correct = checked ? FACTOR_ITEMS.filter(item => placements[item.id] === item.correct).length : 0;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm">
        <p className="font-semibold text-foreground mb-1">Factors of Production</p>
        <p className="text-muted-foreground text-xs"><strong>Land</strong> — natural resources · <strong>Labor</strong> — human effort · <strong>Capital</strong> — tools/machinery/buildings · <strong>Entrepreneurship</strong> — innovation and risk-taking</p>
      </div>
      <p className="text-sm text-muted-foreground italic">Click a factor button on each item to classify it.</p>
      <div className="space-y-2">
        {FACTOR_ITEMS.map(item => {
          const placed = placements[item.id];
          const isCorrect = checked && placed === item.correct;
          const isWrong = checked && placed && placed !== item.correct;
          return (
            <div key={item.id} className={`rounded-xl border-2 p-3 transition ${isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-400 bg-red-50" : placed ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
              <p className="text-sm text-foreground mb-2">{item.text}</p>
              {!checked && (
                <div className="flex flex-wrap gap-1.5">
                  {FACTOR_BUCKETS.map(b => (
                    <button key={b.key} onClick={() => place(item.id, b.key)}
                      className={`px-2 py-1 text-xs rounded-lg border font-semibold transition ${placed === b.key ? b.color + " border-2" : "border-border bg-card hover:border-primary/40"}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              )}
              {checked && (
                <p className="text-xs font-semibold mt-1">
                  {isCorrect ? <span className="text-green-700">✓ Correct — {FACTOR_BUCKETS.find(b => b.key === item.correct)?.label}</span>
                    : <span className="text-red-700">✗ Answer: {FACTOR_BUCKETS.find(b => b.key === item.correct)?.label}</span>}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {!checked
        ? <button onClick={() => setChecked(true)} disabled={!allPlaced} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">Check My Sorting</button>
        : (
          <div className="space-y-3">
            <div className={`rounded-xl p-3 text-center ${correct >= 10 ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
              <p className="font-bold text-sm">{correct}/{FACTOR_ITEMS.length} correct</p>
              <p className="text-xs mt-0.5">{correct >= 10 ? "Excellent work!" : "Review any misses above — the key is whether it's a natural resource, human effort, physical tool/building, or innovative risk-taking."}</p>
            </div>
            <button onClick={onComplete} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
          </div>
        )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 3 — Micro vs. Macro Classifier
// ─────────────────────────────────────────────
const MM_ITEMS = [
  { id: 1, text: "Why did the price of eggs double over the past year?", correct: "micro", exp: "Price of a specific good in a specific market → Microeconomics." },
  { id: 2, text: "What caused the national unemployment rate to rise to 6%?", correct: "macro", exp: "Economy-wide unemployment rate → Macroeconomics." },
  { id: 3, text: "How does a coffee shop decide how many baristas to hire?", correct: "micro", exp: "Individual firm's hiring decision → Microeconomics." },
  { id: 4, text: "How does the Federal Reserve's interest rate affect GDP growth?", correct: "macro", exp: "Central bank policy affecting the whole economy → Macroeconomics." },
  { id: 5, text: "Why do nurses earn more than retail workers?", correct: "micro", exp: "Wage differences between specific occupations in labor markets → Microeconomics." },
  { id: 6, text: "What is the effect of a tax cut on national consumer spending?", correct: "macro", exp: "Economy-wide spending impact of fiscal policy → Macroeconomics." },
  { id: 7, text: "How does Amazon decide what price to charge for Prime membership?", correct: "micro", exp: "Individual firm's pricing decision → Microeconomics." },
  { id: 8, text: "Why does inflation rise when unemployment falls below a certain level?", correct: "macro", exp: "Economy-wide relationship between inflation and unemployment → Macroeconomics." },
  { id: 9, text: "How does a student decide whether to attend college or enter the workforce?", correct: "micro", exp: "Individual decision-making under scarcity → Microeconomics." },
  { id: 10, text: "What determines a country's long-run rate of economic growth?", correct: "macro", exp: "Economy-wide long-run output growth → Macroeconomics." },
];

function MicroMacroStation({ onComplete }: { onComplete: () => void }) {
  const [placements, setPlacements] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const allPlaced = MM_ITEMS.every(item => placements[item.id]);
  const correct = checked ? MM_ITEMS.filter(item => placements[item.id] === item.correct).length : 0;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm">
        <p className="font-semibold text-foreground mb-1">Micro vs. Macro</p>
        <p className="text-muted-foreground text-xs"><strong>Microeconomics</strong> — individual households, firms, and specific markets · <strong>Macroeconomics</strong> — economy-wide phenomena (GDP, inflation, unemployment, national policy)</p>
      </div>
      <p className="text-sm text-muted-foreground italic">Classify each question as Microeconomics or Macroeconomics.</p>
      <div className="space-y-2">
        {MM_ITEMS.map(item => {
          const placed = placements[item.id];
          const isCorrect = checked && placed === item.correct;
          const isWrong = checked && placed && placed !== item.correct;
          return (
            <div key={item.id} className={`rounded-xl border-2 p-3 transition ${isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-400 bg-red-50" : placed ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
              <p className="text-sm text-foreground mb-2">{item.text}</p>
              {!checked && (
                <div className="flex gap-2">
                  {["micro", "macro"].map(type => (
                    <button key={type} onClick={() => setPlacements(p => ({ ...p, [item.id]: type }))}
                      className={`flex-1 py-1.5 text-xs rounded-lg border font-semibold transition ${placed === type ? (type === "micro" ? "border-blue-400 bg-blue-100 text-blue-700" : "border-amber-400 bg-amber-100 text-amber-700") : "border-border bg-card hover:border-primary/40"}`}>
                      {type === "micro" ? "🔬 Micro" : "🌐 Macro"}
                    </button>
                  ))}
                </div>
              )}
              {checked && (
                <p className="text-xs font-medium mt-1">
                  {isCorrect ? <span className="text-green-700">✓ {item.exp}</span> : <span className="text-red-700">✗ {item.exp}</span>}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {!checked
        ? <button onClick={() => setChecked(true)} disabled={!allPlaced} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">Check My Sorting</button>
        : (
          <div className="space-y-3">
            <div className={`rounded-xl p-3 text-center ${correct >= 8 ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
              <p className="font-bold text-sm">{correct}/{MM_ITEMS.length} correct</p>
              <p className="text-xs mt-0.5">{correct >= 8 ? "Great work!" : "Key tip: if the question is about a specific price, firm, or person → Micro. If it's about the whole economy → Macro."}</p>
            </div>
            <button onClick={onComplete} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
          </div>
        )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 4 — Circular Flow Labeler
// ─────────────────────────────────────────────
type FlowBucket = "product" | "factor" | "household" | "firm";

const FLOW_ITEMS = [
  { id: 1, text: "You buy a new laptop at Best Buy", correct: "product" as FlowBucket, exp: "Households purchase finished goods → Product Market." },
  { id: 2, text: "You accept a job offer from a company", correct: "factor" as FlowBucket, exp: "Households supply labor to firms → Factor Market." },
  { id: 3, text: "Apple sells iPhones to consumers", correct: "product" as FlowBucket, exp: "Firms sell goods to households → Product Market." },
  { id: 4, text: "A hotel pays wages to its front desk staff", correct: "factor" as FlowBucket, exp: "Firms pay for labor in the Factor Market." },
  { id: 5, text: "A family receives rental income from a property they own", correct: "household" as FlowBucket, exp: "Households earn income by supplying land (a factor of production)." },
  { id: 6, text: "Nike uses cotton and rubber to manufacture shoes", correct: "firm" as FlowBucket, exp: "Firms hire factors of production (capital and raw materials) to produce goods." },
  { id: 7, text: "Consumers spend their paychecks at grocery stores", correct: "product" as FlowBucket, exp: "Households spend income on goods and services → Product Market." },
  { id: 8, text: "A bank pays interest to depositors", correct: "factor" as FlowBucket, exp: "Households supply financial capital; the bank (a firm) pays for it → Factor Market." },
];

const FLOW_BUCKETS: { key: FlowBucket; label: string; color: string }[] = [
  { key: "product", label: "🛒 Product Market", color: "border-blue-400 bg-blue-50" },
  { key: "factor", label: "⚙️ Factor Market", color: "border-amber-400 bg-amber-50" },
  { key: "household", label: "🏠 Household", color: "border-green-400 bg-green-50" },
  { key: "firm", label: "🏭 Firm", color: "border-purple-400 bg-purple-50" },
];

function CircularFlowStation({ onComplete }: { onComplete: () => void }) {
  const [placements, setPlacements] = useState<Record<number, FlowBucket>>({});
  const [checked, setChecked] = useState(false);

  const allPlaced = FLOW_ITEMS.every(item => placements[item.id]);
  const correct = checked ? FLOW_ITEMS.filter(item => placements[item.id] === item.correct).length : 0;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm">
        <p className="font-semibold text-foreground mb-1">Circular Flow Model</p>
        <p className="text-muted-foreground text-xs"><strong>Product Market</strong>: goods/services exchanged · <strong>Factor Market</strong>: labor/land/capital exchanged · <strong>Household</strong>: owns resources, buys goods · <strong>Firm</strong>: hires resources, produces goods</p>
      </div>
      <p className="text-sm text-muted-foreground italic">Classify each flow in the circular flow model.</p>
      <div className="space-y-2">
        {FLOW_ITEMS.map(item => {
          const placed = placements[item.id];
          const isCorrect = checked && placed === item.correct;
          const isWrong = checked && placed && placed !== item.correct;
          return (
            <div key={item.id} className={`rounded-xl border-2 p-3 transition ${isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-400 bg-red-50" : placed ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
              <p className="text-sm text-foreground mb-2">{item.text}</p>
              {!checked && (
                <div className="flex flex-wrap gap-1.5">
                  {FLOW_BUCKETS.map(b => (
                    <button key={b.key} onClick={() => setPlacements(p => ({ ...p, [item.id]: b.key }))}
                      className={`px-2 py-1 text-xs rounded-lg border font-semibold transition ${placed === b.key ? b.color + " border-2" : "border-border bg-card hover:border-primary/40"}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              )}
              {checked && (
                <p className={`text-xs font-medium mt-1 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                  {isCorrect ? "✓ " : "✗ "}{item.exp}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {!checked
        ? <button onClick={() => setChecked(true)} disabled={!allPlaced} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">Check My Sorting</button>
        : (
          <div className="space-y-3">
            <div className={`rounded-xl p-3 text-center ${correct >= 6 ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
              <p className="font-bold text-sm">{correct}/{FLOW_ITEMS.length} correct</p>
              <p className="text-xs mt-0.5">{correct >= 6 ? "Well done!" : "Key: Product Market = finished goods/services exchanged. Factor Market = resources (labor, land, capital) exchanged."}</p>
            </div>
            <button onClick={onComplete} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
          </div>
        )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 5 — Economic Systems Matcher
// ─────────────────────────────────────────────
type EconSystem = "traditional" | "market" | "command" | "mixed";

const SYSTEM_ITEMS = [
  { id: 1, text: "A farmer in a small village grows the same crops his grandfather grew, following customs passed down for centuries.", correct: "traditional" as EconSystem, exp: "Customs and traditions guide production decisions → Traditional Economy." },
  { id: 2, text: "Businesses freely set prices based on supply and demand; government does not control what is produced.", correct: "market" as EconSystem, exp: "Private ownership and prices coordinate decisions → Market Economy." },
  { id: 3, text: "The government owns all factories and decides how much steel, wheat, and cars to produce each year.", correct: "command" as EconSystem, exp: "Central government planning controls production → Command Economy." },
  { id: 4, text: "The United States allows free markets but also regulates industries, provides social insurance, and funds public goods.", correct: "mixed" as EconSystem, exp: "Blend of private markets and government intervention → Mixed Economy." },
  { id: 5, text: "In a fishing community, sons always become fishermen and daughters always weave nets — occupations follow family lineage.", correct: "traditional" as EconSystem, exp: "Occupations determined by tradition → Traditional Economy." },
  { id: 6, text: "Firms compete for customers and workers choose jobs freely, but the government provides public healthcare and regulates banks.", correct: "mixed" as EconSystem, exp: "Market + government involvement → Mixed Economy." },
  { id: 7, text: "A central planning committee sets production quotas for every factory and controls all prices.", correct: "command" as EconSystem, exp: "Centralized control of all production → Command Economy." },
  { id: 8, text: "Entrepreneurs start businesses, earn profits, and face losses — the price system signals where resources should flow.", correct: "market" as EconSystem, exp: "Prices, profits, and losses coordinate decentralized decisions → Market Economy." },
];

const SYSTEM_BUCKETS: { key: EconSystem; label: string; color: string }[] = [
  { key: "traditional", label: "🏺 Traditional", color: "border-amber-400 bg-amber-50" },
  { key: "market", label: "📈 Market", color: "border-blue-400 bg-blue-50" },
  { key: "command", label: "🏛️ Command", color: "border-red-400 bg-red-50" },
  { key: "mixed", label: "⚖️ Mixed", color: "border-purple-400 bg-purple-50" },
];

function SystemsStation({ onComplete }: { onComplete: () => void }) {
  const [placements, setPlacements] = useState<Record<number, EconSystem>>({});
  const [checked, setChecked] = useState(false);

  const allPlaced = SYSTEM_ITEMS.every(item => placements[item.id]);
  const correct = checked ? SYSTEM_ITEMS.filter(item => placements[item.id] === item.correct).length : 0;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm">
        <p className="font-semibold text-foreground mb-1">Economic Systems</p>
        <p className="text-muted-foreground text-xs"><strong>Traditional</strong>: customs guide decisions · <strong>Market</strong>: private ownership, prices coordinate · <strong>Command</strong>: government controls production · <strong>Mixed</strong>: blend of market + government</p>
      </div>
      <p className="text-sm text-muted-foreground italic">Match each description to the correct economic system.</p>
      <div className="space-y-2">
        {SYSTEM_ITEMS.map(item => {
          const placed = placements[item.id];
          const isCorrect = checked && placed === item.correct;
          const isWrong = checked && placed && placed !== item.correct;
          return (
            <div key={item.id} className={`rounded-xl border-2 p-3 transition ${isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-400 bg-red-50" : placed ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
              <p className="text-sm text-foreground mb-2">{item.text}</p>
              {!checked && (
                <div className="flex flex-wrap gap-1.5">
                  {SYSTEM_BUCKETS.map(b => (
                    <button key={b.key} onClick={() => setPlacements(p => ({ ...p, [item.id]: b.key }))}
                      className={`px-2 py-1 text-xs rounded-lg border font-semibold transition ${placed === b.key ? b.color + " border-2" : "border-border bg-card hover:border-primary/40"}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              )}
              {checked && (
                <p className={`text-xs font-medium mt-1 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                  {isCorrect ? "✓ " : "✗ "}{item.exp}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {!checked
        ? <button onClick={() => setChecked(true)} disabled={!allPlaced} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">Check My Sorting</button>
        : (
          <div className="space-y-3">
            <div className={`rounded-xl p-3 text-center ${correct >= 6 ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
              <p className="font-bold text-sm">{correct}/{SYSTEM_ITEMS.length} correct</p>
              <p className="text-xs mt-0.5">{correct >= 6 ? "Great!" : "Most real-world economies today are Mixed — review any misses above."}</p>
            </div>
            <button onClick={onComplete} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
          </div>
        )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Recap Station
// ─────────────────────────────────────────────
const RECAP_QS = [
  { q: "Economics is best defined as:", opts: ["The study of how governments collect taxes", "The study of how people make choices under scarcity", "The study of stock market behavior", "The study of international trade"], correct: 1, exp: "Economics is the study of choice under scarcity — how individuals, firms, and governments allocate limited resources to satisfy unlimited wants." },
  { q: "You choose to spend Saturday studying instead of working a shift that would pay $80. Your opportunity cost is:", opts: ["$0 — studying is free", "$80 in forgone wages", "The cost of your textbooks", "The grade you earn"], correct: 1, exp: "Opportunity cost = the value of the next-best alternative forgone. By studying, you give up $80 in wages." },
  { q: "Which of the following is an example of CAPITAL as a factor of production?", opts: ["A coal mine", "A construction worker", "A bulldozer on a construction site", "An entrepreneur building a startup"], correct: 2, exp: "Capital = tools, machinery, and physical equipment used in production. A bulldozer is physical capital. The coal mine is land; the worker is labor; the entrepreneur represents entrepreneurship." },
  { q: "The question 'Why did the price of gasoline rise last month?' is an example of:", opts: ["Macroeconomics", "Microeconomics", "Fiscal policy", "Monetary policy"], correct: 1, exp: "Microeconomics studies individual markets and specific prices — like the price of gasoline. Macroeconomics would ask about economy-wide inflation across all goods." },
  { q: "In the circular flow model, households supply labor to firms through:", opts: ["The Product Market", "The Factor Market", "The Government Sector", "The Financial Market"], correct: 1, exp: "The Factor Market is where households sell (supply) labor, land, and capital to firms, who pay wages, rent, and interest in return." },
];

function RecapStation({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = RECAP_QS[idx];

  function check() { setChecked(true); if (sel === q.correct) setScore(s => s + 1); }
  function next() {
    if (idx + 1 < RECAP_QS.length) { setIdx(idx + 1); setSel(null); setChecked(false); }
    else setDone(true);
  }

  if (done) return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className={`rounded-xl p-4 text-center ${score >= 4 ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
        <p className="text-lg font-bold">{score}/{RECAP_QS.length} correct</p>
        <p className="text-sm mt-1">{score >= 4 ? "You're ready to take the quiz!" : "Review the stations above before moving to the quiz."}</p>
      </div>
      <button onClick={onComplete} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">Mark Complete ✓</button>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Question {idx + 1} of {RECAP_QS.length}</span>
        <div className="flex gap-1">{RECAP_QS.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < idx ? "bg-green-500" : i === idx ? "bg-primary" : "bg-muted"}`} />)}</div>
      </div>
      <div className="bg-card border-2 border-border rounded-xl p-4">
        <p className="text-sm font-semibold text-foreground mb-3">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, oi) => {
            let cls = "border-border text-foreground hover:border-primary/40";
            if (checked) {
              if (oi === q.correct) cls = "border-green-500 bg-green-50 text-green-800 font-semibold";
              else if (oi === sel) cls = "border-red-400 bg-red-50 text-red-700";
              else cls = "border-border text-muted-foreground opacity-50";
            } else if (sel === oi) cls = "border-primary bg-primary/10 text-primary font-semibold";
            return (
              <button key={oi} disabled={checked} onClick={() => setSel(oi)}
                className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-sm transition ${cls}`}>
                <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
              </button>
            );
          })}
        </div>
        {checked && <p className={`mt-3 text-xs font-medium ${sel === q.correct ? "text-green-700" : "text-amber-700"}`}>{sel === q.correct ? "✓ Correct! " : "✗ Not quite. "}{q.exp}</p>}
      </div>
      {!checked
        ? <button onClick={check} disabled={sel === null} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">Check Answer</button>
        : <button onClick={next} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">{idx + 1 < RECAP_QS.length ? "Next Question →" : "See Results"}</button>
      }
    </div>
  );
}

// ─────────────────────────────────────────────
// Quiz Station
// ─────────────────────────────────────────────
const QUIZ_QS = [
  { q: "Scarcity in economics means:", opts: ["There is not enough money in the economy", "Resources are limited relative to unlimited wants", "Only poor countries face resource shortages", "Prices are too high for most people"], correct: 1, exp: "Scarcity is the fundamental economic condition: limited resources cannot satisfy all unlimited human wants. It applies to all economies, rich or poor." },
  { q: "If you choose to attend college instead of working full-time, your opportunity cost includes:", opts: ["Only the tuition you pay", "Only the wages you forego", "Tuition paid plus wages foregone plus other forgone alternatives", "Nothing — education is an investment, not a cost"], correct: 2, exp: "Opportunity cost captures all the next-best alternatives forgone — including both direct costs (tuition) and indirect costs (forgone wages, time)." },
  { q: "Which factor of production refers to human-made tools, machinery, and buildings used in production?", opts: ["Land", "Labor", "Capital", "Entrepreneurship"], correct: 2, exp: "Capital = physical, human-made resources used to produce other goods (factories, computers, trucks). This is distinct from financial capital (money)." },
  { q: "Macroeconomics is primarily concerned with:", opts: ["Why one firm earns more profit than another", "The economy-wide level of output, employment, and prices", "How consumers allocate their personal budgets", "The pricing strategies of individual firms"], correct: 1, exp: "Macroeconomics examines the economy as a whole — GDP, national unemployment, inflation, and the effects of monetary and fiscal policy." },
  { q: "Adam Smith's pin factory example was used to illustrate:", opts: ["Why capital is more important than labor", "The benefits of specialization and division of labor", "How monopolies reduce productivity", "Why free trade harms domestic workers"], correct: 1, exp: "Smith showed that dividing production into specialized tasks increased output from ~20 pins/worker/day to 48,000 — demonstrating how specialization and division of labor dramatically raise productivity." },
  { q: "In the circular flow model, the Product Market is where:", opts: ["Households sell their labor to firms", "Firms sell finished goods and services to households", "The government collects taxes", "Banks provide loans to businesses"], correct: 1, exp: "The Product Market is where firms sell goods and services to households in exchange for money (consumer spending). The Factor Market is where households sell labor/resources to firms." },
  { q: "Which economic system relies on customs, traditions, and historical roles to answer the three fundamental economic questions?", opts: ["Market economy", "Command economy", "Traditional economy", "Mixed economy"], correct: 2, exp: "In a traditional economy, decisions about what, how, and for whom to produce are guided by customs and historical practices passed down through generations." },
  { q: "The three fundamental economic questions that every society must answer are:", opts: ["When, where, and how much to produce", "What, how, and for whom to produce", "Who owns, who works, and who consumes", "How to tax, spend, and regulate"], correct: 1, exp: "Every economic system must decide: WHAT goods to produce, HOW to produce them (which methods/technologies), and FOR WHOM (how to distribute output). These three questions define economic organization." },
  { q: "A mixed economy is best described as:", opts: ["An economy with both rich and poor citizens", "An economy that blends market and government elements", "An economy that trades with other countries", "An economy in transition from command to market"], correct: 1, exp: "A mixed economy combines private markets (prices and profits coordinate decisions) with government intervention (regulation, public goods, social programs). Most real-world economies today are mixed." },
  { q: "Which of the following BEST illustrates the concept of opportunity cost?", opts: ["A student buys cheaper textbooks online to save money", "A government taxes citizens to fund public schools", "A manager hires a second employee because sales are growing", "A student gives up $12,000 in wages to attend a free community college"], correct: 3, exp: "Even though the college is free (no tuition), the student gives up $12,000 in wages — the next-best alternative. This forgone income is the real opportunity cost of attending college." },
];

function QuizStation({ onPass, onFail }: { onPass: (score: number, results: { correct: boolean; exp: string }[]) => void; onFail: () => void }) {
  const [questions] = useState(() => QUIZ_QS.map(q => {
    const idx = q.opts.map((_, i) => i);
    const s = shuffle(idx);
    const newOpts = s.map(i => q.opts[i]);
    const newCorrect = s.indexOf(q.correct);
    return { ...q, opts: newOpts, correct: newCorrect };
  }));
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; exp: string }[]>([]);

  function check() {
    setChecked(true);
    setResults(r => [...r, { correct: sel === questions[cur].correct, exp: questions[cur].exp }]);
  }
  function next() {
    if (cur + 1 < questions.length) { setCur(cur + 1); setSel(null); setChecked(false); }
    else {
      const final = [...results];
      const score = final.filter(r => r.correct).length;
      if (score >= 9) onPass(score, final); else onFail();
    }
  }

  const q = questions[cur];
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Question {cur + 1} of {questions.length}</span>
        <div className="flex gap-1">{questions.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < cur ? (results[i]?.correct ? "bg-green-500" : "bg-red-400") : i === cur ? "bg-primary" : "bg-muted"}`} />)}</div>
      </div>
      <div className="bg-card border-2 border-border rounded-xl p-4">
        <p className="text-sm font-semibold text-foreground mb-3">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, oi) => {
            let cls = "border-border text-foreground hover:border-primary/40";
            if (checked) {
              if (oi === q.correct) cls = "border-green-500 bg-green-50 text-green-800 font-semibold";
              else if (oi === sel) cls = "border-red-400 bg-red-50 text-red-700";
              else cls = "border-border text-muted-foreground opacity-50";
            } else if (sel === oi) cls = "border-primary bg-primary/10 text-primary font-semibold";
            return (
              <button key={oi} disabled={checked} onClick={() => setSel(oi)}
                className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-sm transition ${cls}`}>
                <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
              </button>
            );
          })}
        </div>
        {checked && <p className={`mt-3 text-xs font-medium ${sel === q.correct ? "text-green-700" : "text-amber-700"}`}>{sel === q.correct ? "✓ Correct! " : "✗ Not quite. "}{q.exp}</p>}
      </div>
      {!checked
        ? <button onClick={check} disabled={sel === null} className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">Check Answer</button>
        : <button onClick={next} className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold transition">{cur + 1 < questions.length ? "Next Question →" : "See Results"}</button>
      }
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
      <button onClick={onRetry} className="w-full py-3 bg-amber-500 hover:opacity-90 text-white rounded-xl font-semibold transition">← Try the Quiz Again</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Results Screen
// ─────────────────────────────────────────────
function ResultsScreen({ score, results, onRestart, courseTitle }: {
  score: number; results: { correct: boolean; exp: string }[];
  onRestart: () => void; courseTitle: string;
}) {
  const [name, setName] = useState("");
  const [exitTicket, setExitTicket] = useState("");
  const grade = score === 10 ? "A+" : score === 9 ? "A" : score === 8 ? "B" : score === 7 ? "C" : "Needs Review";

  function printPDF() {
    const w = window.open("", "_blank", "width=820,height=960");
    if (!w) return;
    const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const rows = QUIZ_QS.map((q, i) => `
      <tr style="background:${results[i]?.correct ? "#f0fdf4" : "#fef2f2"}">
        <td style="padding:8px;border:1px solid #e2e8f0;font-weight:600">${results[i]?.correct ? "✓" : "✗"}</td>
        <td style="padding:8px;border:1px solid #e2e8f0">${q.q}</td>
        <td style="padding:8px;border:1px solid #e2e8f0;font-size:11px;color:#475569">${q.exp}</td>
      </tr>`).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>Ch1 Quiz Results</title>
      <style>body{font-family:Arial,sans-serif;margin:40px;color:#1e293b}h1{color:#1a2744}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#1a2744;color:white;padding:8px;text-align:left}</style>
      </head><body>
      <h1>${courseTitle} — Chapter 1 Quiz Results</h1>
      <p><strong>Student:</strong> ${name || "—"} &nbsp;&nbsp; <strong>Date:</strong> ${now}</p>
      <p><strong>Score:</strong> ${score}/10 &nbsp;&nbsp; <strong>Grade:</strong> ${grade}</p>
      ${exitTicket ? `<p><strong>Exit Ticket:</strong> ${exitTicket}</p>` : ""}
      <table><thead><tr><th style="width:40px"></th><th>Question</th><th>Explanation</th></tr></thead><tbody>${rows}</tbody></table>
      <p style="margin-top:24px;font-size:11px;color:#94a3b8">Content adapted from OpenStax. Access for free at https://openstax.org/books/principles-macroeconomics-3e/pages/1-introduction</p>
      </body></html>`);
    setTimeout(() => w.print(), 600);
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className={`rounded-2xl p-5 text-center ${score >= 9 ? "bg-green-50 border-2 border-green-300" : "bg-amber-50 border-2 border-amber-300"}`}>
        <p className="text-3xl font-bold">{score}/10</p>
        <p className="text-lg font-semibold mt-1">{grade}</p>
        <p className="text-sm text-muted-foreground mt-1">Chapter 1 — Introduction to Economics</p>
      </div>
      <div className="bg-card border-2 border-border rounded-xl p-4 space-y-3">
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1">Your Name (required for credit)</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="First and Last Name"
            className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1">Exit Ticket: In one sentence, describe a real-world example of opportunity cost from your own life.</label>
          <textarea value={exitTicket} onChange={e => setExitTicket(e.target.value)} rows={2} placeholder="Your response..."
            className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none resize-none" />
        </div>
      </div>
      <div className="space-y-2">
        {QUIZ_QS.map((q, i) => (
          <div key={i} className={`rounded-xl border p-3 ${results[i]?.correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <p className="text-xs font-semibold">{results[i]?.correct ? "✓" : "✗"} Q{i + 1}: {q.q}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{q.exp}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={printPDF} disabled={!name.trim()} className="flex-1 py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition text-sm">🖨️ Print PDF</button>
        <button onClick={onRestart} className="flex-1 py-3 bg-muted hover:bg-accent text-muted-foreground rounded-xl font-semibold transition text-sm">↺ Start Over</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Dashboard (Intro)
// ─────────────────────────────────────────────
const STATIONS = [
  { id: "oppcost" as Station, label: "Opportunity Cost", desc: "Apply opportunity cost to real scenarios", icon: "💡" },
  { id: "factors" as Station, label: "Factors of Production", desc: "Classify Land, Labor, Capital, Entrepreneurship", icon: "🏭" },
  { id: "micromacro" as Station, label: "Micro vs. Macro", desc: "Classify economic questions by scope", icon: "🔬" },
  { id: "circularflow" as Station, label: "Circular Flow", desc: "Label flows in the circular flow model", icon: "🔄" },
  { id: "systems" as Station, label: "Economic Systems", desc: "Match descriptions to Traditional, Market, Command, or Mixed", icon: "⚖️" },
  { id: "recap" as Station, label: "Recap", desc: "5 review questions before the quiz", icon: "📚" },
];

function Dashboard({ completed, onSelect, quizUnlocked, onStartQuiz, onSummary }: {
  completed: Set<Station>; onSelect: (s: Station) => void; quizUnlocked: boolean; onStartQuiz: () => void; onSummary: () => void;
}) {
  const progress = STATIONS.filter(s => completed.has(s.id)).length;
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
        <p className="font-semibold mb-1">Chapter 1 — Introduction to Economics</p>
        <p className="text-muted-foreground text-xs">Complete all 5 stations and the Recap to unlock the Quiz. Your progress is saved automatically.</p>
        <div className="mt-3 h-2 bg-primary/20 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(progress / STATIONS.length) * 100}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{progress}/{STATIONS.length} stations complete</p>
      </div>
      {/* Chapter Summary link */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted border border-border">
        <div className="flex items-center gap-2">
          <span className="text-base">📄</span>
          <span className="text-sm text-foreground">Need a refresher? View the chapter summary.</span>
        </div>
        <button onClick={onSummary}
          className="text-xs px-3 py-1.5 rounded-lg bg-card border border-border text-primary font-semibold hover:bg-accent transition-all shrink-0">
          Open Summary
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STATIONS.map(s => {
          const done = completed.has(s.id);
          return (
            <button key={s.id} onClick={() => onSelect(s.id)}
              className={`rounded-xl border-2 p-3 text-left transition ${done ? "border-green-400 bg-green-50" : "border-border bg-card hover:border-primary/40"}`}>
              <span className="text-lg">{done ? "✅" : s.icon}</span>
              <p className="text-sm font-semibold text-foreground mt-1">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </button>
          );
        })}
      </div>
      <button onClick={onStartQuiz} disabled={!quizUnlocked}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition ${quizUnlocked ? "bg-primary hover:opacity-90 text-primary-foreground" : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"}`}>
        {quizUnlocked ? "🎯 Take the Quiz" : "🔒 Complete all stations to unlock the Quiz"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────
const NAV_STATIONS: { id: Station; label: string }[] = [
  { id: "intro",       label: "Dashboard" },
  { id: "oppcost",     label: "Opp. Cost" },
  { id: "factors",     label: "Factors" },
  { id: "micromacro",  label: "Micro/Macro" },
  { id: "circularflow",label: "Circular Flow" },
  { id: "systems",     label: "Systems" },
  { id: "recap",       label: "Recap" },
  { id: "quiz",        label: "Quiz" },
];

const STATION_ORDER: Station[] = ["intro","oppcost","factors","micromacro","circularflow","systems","recap","quiz","results","not-yet"];

function Header({ station, completed, onNav, courseTitle, courseSubtitle, hubUrl }:
  { station: Station; completed: Set<Station>; onNav: (s: Station) => void; courseTitle: string; courseSubtitle: string; hubUrl: string }) {
  const currentIdx = STATION_ORDER.indexOf(station);
  const allStationsDone = STATIONS.every(s => completed.has(s.id));

  return (
    <header role="banner" className="bg-secondary text-secondary-foreground shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Econ Lab logo">
            <rect width="32" height="32" rx="8" fill="hsl(38 95% 50%)"/>
            <path d="M8 22 L12 14 L16 18 L20 10 L24 16" stroke="hsl(222 30% 10%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="24" cy="16" r="2" fill="hsl(222 30% 10%)"/>
          </svg>
          <div>
            <div className="font-display font-semibold text-sm leading-none text-sidebar-foreground">{courseTitle}</div>
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">{courseSubtitle}</div>
          </div>
        </div>

        {/* Back to Hub */}
        <a href={hubUrl} target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-sidebar-foreground/80 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-sidebar-accent shrink-0">
          ← Course Hub <span className="sr-only">(opens in new tab)</span>
        </a>

        {/* Nav pills */}
        <div className="hidden sm:flex items-center gap-1 flex-wrap">
          {NAV_STATIONS.map(s => {
            const idx = STATION_ORDER.indexOf(s.id);
            const done = idx < currentIdx || completed.has(s.id);
            const active = s.id === station || (station === "not-yet" && s.id === "quiz") || (station === "results" && s.id === "quiz");
            if (s.id === "quiz" && !allStationsDone) {
              return <span key={s.id} title="Complete all stations first" className="px-3 py-1.5 rounded-full text-xs font-medium text-sidebar-foreground/35 cursor-not-allowed select-none">🔒 Quiz</span>;
            }
            return (
              <button key={s.id} onClick={() => onNav(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active ? "bg-primary text-primary-foreground" :
                  done   ? "bg-sidebar-accent text-sidebar-foreground/90" :
                           "text-sidebar-foreground/75 hover:text-white"
                }`}>
                {done && !active ? "✓ " : ""}{s.label}
              </button>
            );
          })}
        </div>

        {/* Mobile label */}
        <div className="sm:hidden text-sm font-medium text-sidebar-foreground/80">
          {currentIdx + 1} / {NAV_STATIONS.length}
        </div>

        {/* Progress bar */}
        <div className="w-24 hidden md:block shrink-0">
          <div className="h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(currentIdx / (NAV_STATIONS.length - 1)) * 100}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// Main EconLab
// ─────────────────────────────────────────────
const STORAGE_KEY = "econlab_done_ch1";

export default function EconLab({ courseTitle, courseSubtitle, hubUrl }: {
  courseTitle: string; courseSubtitle: string; hubUrl: string;
}) {
  const [station, setStation] = useState<Station>("intro");
  const [completed, setCompleted] = useState<Set<Station>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Station[]); } catch { return new Set(); }
  });
  const [showSummary, setShowSummary] = useState(false);
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const [quizScore, setQuizScore] = useState(0);

  function markDone(s: Station) {
    const next = new Set(completed);
    next.add(s);
    setCompleted(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch {}
    setStation("intro");
  }

  const quizUnlocked = STATIONS.every(s => completed.has(s.id));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
      <Header station={station} completed={completed} onNav={setStation}
        courseTitle={courseTitle} courseSubtitle={courseSubtitle} hubUrl={hubUrl} />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {station === "intro" && <Dashboard completed={completed} onSelect={setStation} quizUnlocked={quizUnlocked} onStartQuiz={() => setStation("quiz")} onSummary={() => setShowSummary(true)} />}
        {station === "oppcost" && station !== "not-yet" && station !== "results" && <OppCostStation onComplete={() => markDone("oppcost")} />}
        {station === "factors" && station !== "not-yet" && station !== "results" && <FactorsStation onComplete={() => markDone("factors")} />}
        {station === "micromacro" && station !== "not-yet" && station !== "results" && <MicroMacroStation onComplete={() => markDone("micromacro")} />}
        {station === "circularflow" && station !== "not-yet" && station !== "results" && <CircularFlowStation onComplete={() => markDone("circularflow")} />}
        {station === "systems" && station !== "not-yet" && station !== "results" && <SystemsStation onComplete={() => markDone("systems")} />}
        {station === "recap" && station !== "not-yet" && station !== "results" && <RecapStation onComplete={() => markDone("recap")} />}
        {station === "quiz" && station !== "not-yet" && station !== "results" && (
          <QuizStation
            onPass={(score, results) => { setQuizScore(score); setQuizResults(results); setStation("results"); }}
            onFail={() => setStation("not-yet")}
          />
        )}
        {station === "not-yet" && <NotYetScreen onRetry={() => setStation("quiz")} />}
        {station === "results" && <ResultsScreen score={quizScore} results={quizResults} onRestart={() => { setStation("intro"); }} courseTitle={courseTitle} />}
      </main>
    </div>
  );
}
