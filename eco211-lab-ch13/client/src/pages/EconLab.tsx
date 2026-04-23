import { useState, useRef } from "react";
import { ChevronLeft, Award, RotateCcw } from "lucide-react";

type Station = "intro" | "recap" | "innovation" | "govpolicy" | "goodstypes" | "freerider" | "quiz" | "results" | "not-yet";

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

const CH13_SUMMARY = [
  { heading: "13.1 — Investments in Innovation", body: "Competition creates pressure to innovate. However, if one can easily copy new inventions, then the original inventor loses the incentive to invest further in research and development. New technology often has positive externalities; that is, there are often spillovers from the invention of new technology that benefit firms other than the innovator. The social benefit of an invention, once the firm accounts for these spillovers, typically exceeds the private benefit to the inventor. If inventors could receive a greater share of the broader social benefits for their work, they would have a greater incentive to seek out new inventions." },
  { heading: "13.2 — How Governments Can Encourage Innovation", body: "Public policy with regard to technology must often strike a balance. For example, patents provide an incentive for inventors, but they should be limited to genuinely new inventions and not extend forever. Government has a variety of policy tools for increasing the rate of return for new technology and encouraging its development, including: direct government funding of R&D, tax incentives for R&D, protection of intellectual property, and forming cooperative relationships between universities and the private sector." },
  { heading: "13.3 — Public Goods", body: "A public good has two key characteristics: it is nonexcludable and non-rival. Nonexcludable means that it is costly or impossible for one user to exclude others from using the good. Non-rival means that when one person uses the good, it does not prevent others from using it. Markets often have a difficult time producing public goods because free riders will attempt to use the public good without paying for it. One can overcome the free rider problem through measures to assure that users of the public good pay for it. Such measures include government actions, social pressures, and specific situations where markets have discovered a way to collect payments." },
];

function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="summary-title">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 id="summary-title" className="text-lg font-bold text-foreground">📄 Chapter 13 Summary</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" aria-label="Close">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {CH13_SUMMARY.map((sec, i) => (
            <div key={i}><h3 className="font-semibold text-primary mb-1">{sec.heading}</h3><p className="text-sm text-foreground leading-relaxed">{sec.body}</p></div>
          ))}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">Access for free at{" "}
              <a href="https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction
              </a>
            </p>
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={onClose} className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition">Close &amp; Return to Lab</button>
        </div>
      </div>
    </div>
  );
}

// ─── Station 1: Ch12 Recap ───
const RECAP_QS = [
  { q: "An externality occurs when:", opts: ["A firm earns economic profit", "A transaction between a buyer and seller imposes costs or benefits on a third party not involved in the exchange", "A government regulates market prices", "A market reaches long-run equilibrium"], correct: 1, exp: "Externality = spillover to third parties. The third party bears costs (negative) or receives benefits (positive) from a transaction they didn't participate in." },
  { q: "A negative externality leads to:", opts: ["Underproduction — market produces too little", "Overproduction — market produces too much because firms don't pay the full social cost", "Efficient production — markets account for all costs", "Zero production — firms shut down"], correct: 1, exp: "Negative externality: social cost > private cost. Since firms only pay private costs, they overproduce relative to the socially optimal level. The market price is too low and output too high." },
  { q: "A pollution charge (tax per unit of pollution):", opts: ["Requires all firms to use the same cleanup technology", "Sets a price on pollution — firms reduce emissions where abatement costs less than the tax", "Distributes tradeable permits among polluters", "Eliminates all pollution"], correct: 1, exp: "Pollution charge: firms compare abatement cost to the tax. Reduce if cheaper than the tax; pay the tax if not. This ensures pollution reduction happens where it's least expensive — efficient allocation." },
  { q: "In a cap-and-trade system, firms with LOW abatement costs will:", opts: ["Buy permits from firms that can clean up cheaply", "Reduce pollution beyond their quota and sell extra permits for profit", "Ignore the permit system and pollute freely", "Lobby the government for more permits"], correct: 1, exp: "Low-cost abaters reduce more than required and sell surplus permits. High-cost abaters buy permits instead of cleaning up. Total emissions stay at the cap, but achieved at the lowest possible total cost." },
  { q: "The Coase Theorem states that private bargaining can solve externalities when:", opts: ["Millions of parties are involved", "Government sets the optimal tax level", "Property rights are clear and bargaining costs are low", "International agreements are in place"], correct: 2, exp: "Coase Theorem: with clear property rights and low transaction costs, private parties negotiate to the efficient outcome without government intervention. Fails when many parties are involved (e.g., climate change)." },
];

function RecapStation({ onComplete }: { onComplete: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [marked, setMarked] = useState(false);

  const q = RECAP_QS[currentQ];
  const isChecked = !!checked[currentQ];
  const isCorrect = isChecked && answers[currentQ] === q.correct;
  const allChecked = RECAP_QS.every((_, i) => checked[i]);
  const score = RECAP_QS.filter((q, i) => answers[i] === q.correct).length;

  function handleSelect(oi: number) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [currentQ]: oi }));
  }

  function handleCheck() {
    if (answers[currentQ] === undefined) return;
    setChecked(prev => ({ ...prev, [currentQ]: true }));
  }

  function navDotStyle(i: number): string {
    if (i === currentQ) return "bg-primary";
    if (checked[i]) return answers[i] === RECAP_QS[i].correct ? "bg-emerald-400" : "bg-red-400";
    if (answers[i] !== undefined) return "bg-primary/40";
    return "bg-muted";
  }

  if (showResults) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-card border-2 border-border p-6 text-center">
          <div className="text-4xl font-bold text-foreground mb-2">{score} / {RECAP_QS.length}</div>
          <p className="text-sm text-muted-foreground">
            {score === RECAP_QS.length
              ? "Perfect! You're ready to dive in."
              : score >= 3
              ? "Good foundation — review any explanations you missed."
              : "Take another look at the explanations before moving on."}
          </p>
        </div>
        <div className="space-y-2">
          {RECAP_QS.map((q, i) => (
            <div key={i} className={`p-3 rounded-xl text-sm border-l-4 ${answers[i] === q.correct ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"}`}>
              <span className="font-bold">{answers[i] === q.correct ? "✓" : "✗"}</span>
              <span className="font-semibold text-foreground ml-1">Q{i+1}: </span>
              <span className="text-muted-foreground">{q.exp}</span>
            </div>
          ))}
        </div>
        {!marked ? (
          <button onClick={() => { setMarked(true); onComplete(); }}
            className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700">
            Mark Complete ✓
          </button>
        ) : (
          <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Question {currentQ + 1} of {RECAP_QS.length}</span>
        <span className="text-xs text-muted-foreground">{Object.keys(checked).length} / {RECAP_QS.length} checked</span>
      </div>

      <div className="flex gap-2">
        {RECAP_QS.map((_, i) => (
          <button key={i} onClick={() => setCurrentQ(i)}
            className={`flex-1 h-2 rounded-full transition-all ${navDotStyle(i)}`}
            aria-label={`Question ${i + 1}`} />
        ))}
      </div>

      <div className="rounded-xl bg-card border-2 border-border p-5">
        <p className="text-sm font-semibold text-foreground mb-4">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, i) => {
            const selected = answers[currentQ] === i;
            const isCorrectOpt = q.correct === i;
            let style = "border-border text-foreground hover:border-primary/40";
            if (isChecked) {
              if (isCorrectOpt) style = "bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-300";
              else if (selected) style = "bg-red-50 border-red-300 text-red-800";
              else style = "border-border text-foreground opacity-50";
            } else if (selected) {
              style = "bg-primary/10 border-primary text-foreground";
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={isChecked}
                className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${style} ${isChecked ? "cursor-default" : ""}`}>
                <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>
        {!isChecked && answers[currentQ] !== undefined && (
          <button onClick={handleCheck}
            className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check Answer
          </button>
        )}
        {isChecked && (
          <div className={`mt-4 p-3 rounded-xl text-sm ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
            <strong>{isCorrect ? "✓ Correct! " : "✗ Not quite. "}</strong>{q.exp}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          ← Previous
        </button>
        {currentQ < RECAP_QS.length - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Question →
          </button>
        ) : allChecked ? (
          <button onClick={() => setShowResults(true)}
            className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all">
            See Results →
          </button>
        ) : (
          <span className="text-xs text-muted-foreground">Check all answers to continue</span>
        )}
      </div>
    </div>
  );
}


const INNOV_STEPS = [
  {
    title: "Why Markets Underinvest in R&D",
    content: "Innovation creates positive externalities — the inventor cannot capture all the benefits. Competitors can copy ideas (once disclosed), so the private return < social return. Result: the free market produces LESS innovation than is socially optimal.",
    question: "Why do markets tend to underinvest in research and development?",
    opts: ["R&D is too expensive for firms to afford", "Innovators cannot capture all the social benefits — competitors free-ride on new knowledge", "Governments prohibit private R&D spending", "Consumers don't value new products"],
    correct: 1,
    exp: "Knowledge spillovers mean that once an innovation is made, others benefit without paying. This reduces the private incentive to invest, even when the social payoff would be large.",
  },
  {
    title: "Patents and Intellectual Property",
    content: "Patents grant temporary monopoly rights to inventors — usually 20 years. This allows the innovator to charge higher prices and earn profits, recover R&D costs, and have an incentive to innovate. Trade-off: Temporary monopoly power (deadweight loss) in exchange for more innovation (dynamic benefit).",
    question: "Patents increase innovation incentives by:",
    opts: ["Permanently banning competitors from all related products", "Giving inventors temporary monopoly rights to earn back R&D costs", "Requiring firms to share all research with competitors", "Subsidizing university research directly"],
    correct: 1,
    exp: "A patent gives the inventor a time-limited exclusive right — enough to earn a return on R&D investment without permanently blocking competition.",
  },
  {
    title: "Government Support for R&D",
    content: "Because private markets underinvest in R&D, governments use several tools: direct funding (NIH, NSF, DARPA grants), R&D tax credits, the patent system, and public universities. Basic research with no immediate application is especially underfunded privately — government plays a critical role.",
    question: "Which government policy DIRECTLY addresses the underinvestment problem in R&D?",
    opts: ["Raising the minimum wage", "Providing R&D tax credits and grants to innovators", "Increasing import tariffs", "Reducing the corporate income tax rate"],
    correct: 1,
    exp: "R&D subsidies and tax credits raise the private return on innovation toward the social return, correcting the market failure caused by knowledge spillovers.",
  },
];

function InnovationStation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState(false);
  const cur = INNOV_STEPS[step];
  const stepAns = answers[step] ?? null;
  const allDone = INNOV_STEPS.every((_, i) => feedback[i] !== undefined);

  function check() {
    if (stepAns === null) return;
    setFeedback(prev => ({ ...prev, [step]: stepAns === cur.correct ? `✓ Correct! ${cur.exp}` : `Not quite. ${cur.exp}` }));
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {INNOV_STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition ${i === step ? "border-primary bg-primary text-primary-foreground" : feedback[i] ? "border-green-400 bg-green-50 text-green-700" : "border-border text-muted-foreground"}`}>
            {feedback[i] ? "✓ " : ""}Step {i + 1}
          </button>
        ))}
      </div>
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="font-semibold text-primary text-sm mb-2">{cur.title}</p>
        <p className="text-sm text-foreground whitespace-pre-line">{cur.content}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">{cur.question}</p>
        <div className="space-y-2">
          {cur.opts.map((opt, oi) => {
            const sel = stepAns === oi;
            const hasFb = feedback[step] !== undefined;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (hasFb) {
              if (oi === cur.correct) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
              else if (sel) cls = "border-red-400 bg-red-100 text-red-700";
            }
            return (
              <button key={oi} onClick={() => { if (!feedback[step]) setAnswers(p => ({ ...p, [step]: oi })); }}
                disabled={!!feedback[step]} aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                {hasFb && oi === cur.correct && "✓ "}{opt}
              </button>
            );
          })}
        </div>
      </div>
      {feedback[step] && (
        <div className={`rounded-xl p-4 text-sm ${feedback[step].startsWith("✓") ? "bg-green-50 border border-green-400 text-green-800" : "bg-amber-50 border border-amber-300 text-amber-800"}`} role="alert">
          {feedback[step]}
        </div>
      )}
      {!feedback[step]
        ? <button onClick={check} disabled={stepAns === null} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Check Answer</button>
        : step < INNOV_STEPS.length - 1
          ? <button onClick={() => setStep(step + 1)} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next Step →</button>
          : allDone && !marked
            ? <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
            : marked ? <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p> : null
      }
    </div>
  );
}

// ─── Station 3: Government Innovation Policy Matcher ───
const GOV_POLICIES = [
  { id: "patent", label: "Patent / Copyright Protection", desc: "Exclusive legal right to produce/sell the invention for a limited period" },
  { id: "direct", label: "Direct R&D Funding", desc: "Government grants, university research budgets, national labs (NIH, NSF, DoD)" },
  { id: "tax", label: "R&E Tax Credits", desc: "Tax reductions based on a firm's R&D spending — firm chooses which projects to pursue" },
  { id: "coop", label: "University-Industry Partnerships", desc: "Cooperative research between public universities and private firms" },
];

const GOV_SCENARIOS = [
  { scenario: "A pharmaceutical company spent 12 years and $900M developing a new cancer drug. Without protection, generic manufacturers could immediately copy it at a fraction of the cost, making future drug development unprofitable.", best: "patent", exp: "Patents are the primary tool for encouraging pharmaceutical R&D. A 20-year exclusive right allows the inventor to charge above-cost prices long enough to recoup development costs — creating the incentive to invest in the first place." },
  { scenario: "The NIH (National Institutes of Health) wants to advance basic medical research that is too early-stage and too uncertain for any private firm to fund, but could enable breakthrough treatments 20 years from now.", best: "direct", exp: "Direct government funding is most appropriate for basic research with diffuse benefits and long time horizons that the private sector won't fund. NIH-funded research has been estimated to add $69B to GDP and support 7M jobs." },
  { scenario: "Congress wants to stimulate private-sector innovation across ALL industries without picking which technologies to support — letting thousands of firms decide for themselves where to invest in R&D.", best: "tax", exp: "R&E tax credits give a blanket incentive across all industries — firms choose which projects to fund. This avoids government 'picking winners' while still closing some of the gap between private and social returns on R&D." },
  { scenario: "A state university has developed promising new solar cell technology. A private firm wants to commercialize it but needs access to the university's equipment and researchers during product development.", best: "coop", exp: "University-industry partnerships bridge the gap between basic research (universities) and commercialization (firms). Bayh-Dole Act (1980) enabled universities to patent federally-funded research and license it to private firms — accelerating technology transfer." },
];

function GovPolicyStation({ onComplete }: { onComplete: () => void }) {
  const [scenIdx, setScenIdx] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [doneScens, setDoneScens] = useState<number[]>([]);
  const [marked, setMarked] = useState(false);
  const scen = GOV_SCENARIOS[scenIdx];
  const allDone = doneScens.length >= GOV_SCENARIOS.length - 1 && checked;

  function next() {
    setDoneScens(p => [...p, scenIdx]);
    if (scenIdx < GOV_SCENARIOS.length - 1) { setScenIdx(scenIdx + 1); setChoice(null); setChecked(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {GOV_SCENARIOS.map((_, i) => (
          <span key={i} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold border-2 ${i === scenIdx ? "border-primary bg-primary text-primary-foreground" : doneScens.includes(i) ? "border-green-500 bg-green-100 text-green-800" : "border-border text-muted-foreground"}`}>{i + 1}</span>
        ))}
      </div>
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Scenario {scenIdx + 1}</p>
        <p className="text-sm text-foreground">{scen.scenario}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">Which government policy tool BEST fits this situation?</p>
        <div className="space-y-2">
          {GOV_POLICIES.map(p => {
            const sel = choice === p.id;
            const isCorrect = checked && p.id === scen.best;
            const isWrong = checked && sel && p.id !== scen.best;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (checked) {
              if (isCorrect) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
              else if (isWrong) cls = "border-red-400 bg-red-50 text-red-700";
            }
            return (
              <button key={p.id} onClick={() => { if (!checked) setChoice(p.id); }}
                disabled={checked} aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                <p className="font-semibold">{isCorrect && "✓ "}{p.label}</p>
                <p className="text-xs mt-0.5 opacity-75">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
      {checked && <div className="rounded-xl bg-muted p-4 text-sm" role="alert"><p className="font-semibold text-foreground mb-1">{choice === scen.best ? "✓ Correct!" : "Not quite."}</p><p className="text-muted-foreground">{scen.exp}</p></div>}
      {!checked
        ? <button onClick={() => { if (choice) setChecked(true); }} disabled={!choice} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Check Answer</button>
        : <div className="space-y-3">
            {scenIdx < GOV_SCENARIOS.length - 1 && !doneScens.includes(scenIdx) && <button onClick={next} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next Scenario →</button>}
            {(allDone || (doneScens.length >= GOV_SCENARIOS.length - 1 && checked)) && !marked && <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>}
            {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
          </div>
      }
    </div>
  );
}

// ─── Station 4: 4 Types of Goods Classifier ───
type GoodType = "private" | "public" | "club" | "common";
const GOOD_LABELS: Record<GoodType, string> = {
  private: "Private Good (Excludable + Rival)",
  public: "Public Good (Non-excludable + Non-rival)",
  club: "Club Good (Excludable + Non-rival)",
  common: "Common Good (Non-excludable + Rival)",
};
const GOOD_COLORS: Record<GoodType, string> = {
  private: "border-blue-400 bg-blue-50 text-blue-800",
  public: "border-green-500 bg-green-50 text-green-800",
  club: "border-purple-400 bg-purple-50 text-purple-800",
  common: "border-amber-400 bg-amber-50 text-amber-800",
};
const GOOD_EXAMPLES = [
  { name: "A slice of pizza", correct: "private" as GoodType, exp: "Private good: you can be excluded (you must pay), and your eating it means less for others (rival). Classic private good." },
  { name: "National defense", correct: "public" as GoodType, exp: "Public good: the military protects everyone regardless of whether they pay taxes (non-excludable), and protecting one person doesn't reduce protection for others (non-rival)." },
  { name: "Netflix streaming (before password sharing rules)", correct: "club" as GoodType, exp: "Club good: you need a subscription to access (excludable), but streaming a movie doesn't reduce quality for other subscribers (non-rival until congestion)." },
  { name: "Ocean fisheries", correct: "common" as GoodType, exp: "Common good: anyone can fish the ocean (non-excludable), but every fish caught reduces what's available for others (rival). Classic 'tragedy of the commons.'" },
  { name: "A public fireworks display", correct: "public" as GoodType, exp: "Public good: you can't prevent neighbors from watching (non-excludable), and one person watching doesn't reduce others' enjoyment (non-rival). Classic public good — market underprovides." },
  { name: "A gym membership (members can use all equipment)", correct: "club" as GoodType, exp: "Club good: non-members are excluded, but the treadmill is available to all members simultaneously (non-rival) — until it gets too crowded (congestion point)." },
  { name: "Clean air in a city (before pollution)", correct: "public" as GoodType, exp: "Public good: no one can be excluded from breathing clean air, and one person breathing it doesn't reduce air quality for others. Environmental goods are often public goods." },
  { name: "A pair of shoes", correct: "private" as GoodType, exp: "Private good: you must buy them (excludable), and your wearing them prevents others from wearing the same pair (rival)." },
  { name: "A congested highway during rush hour", correct: "common" as GoodType, exp: "Common good: the highway is technically open to all (non-excludable), but during rush hour each additional driver slows down everyone else (rival — congestion). Public goods can become common goods under congestion." },
  { name: "Cable TV signal", correct: "club" as GoodType, exp: "Club good: you need a subscription to decode the signal (excludable), and one household watching doesn't affect signal quality for others (non-rival)." },
  { name: "A lighthouse beacon", correct: "public" as GoodType, exp: "Classic public good: the beacon is visible to all ships in range (non-excludable), and one ship using it for navigation doesn't reduce its availability to others (non-rival)." },
  { name: "Groundwater from a shared aquifer", correct: "common" as GoodType, exp: "Common good: neighbors can all pump from the shared aquifer (non-excludable), but each gallon pumped reduces what's available to others (rival). Overuse without coordination leads to depletion." },
];

const ALL_TYPES: GoodType[] = ["private", "public", "club", "common"];

function GoodsTypesStation({ onComplete }: { onComplete: () => void }) {
  const [choices, setChoices] = useState<Record<string, GoodType | null>>(() => Object.fromEntries(GOOD_EXAMPLES.map(e => [e.name, null])));
  const [checked, setChecked] = useState(false);
  const [marked, setMarked] = useState(false);
  const allChosen = GOOD_EXAMPLES.every(e => choices[e.name] !== null);
  const score = GOOD_EXAMPLES.filter(e => choices[e.name] === e.correct).length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm font-semibold text-primary mb-2">The Four Types of Goods</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white rounded-lg p-2 border border-border">
            <p className="font-semibold text-foreground">Excludable?</p>
            <p className="text-muted-foreground">Can someone be prevented from using the good?</p>
          </div>
          <div className="bg-white rounded-lg p-2 border border-border">
            <p className="font-semibold text-foreground">Rival?</p>
            <p className="text-muted-foreground">Does one person's use reduce availability for others?</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-primary text-primary-foreground"><th className="px-3 py-2"></th><th className="px-3 py-2 text-center">Excludable</th><th className="px-3 py-2 text-center">Non-Excludable</th></tr></thead>
          <tbody>
            <tr className="border-b border-border"><td className="px-3 py-2 font-semibold bg-muted/30">Rival</td><td className="px-3 py-2 text-center"><span className="text-blue-700 font-semibold">Private Good</span><br/><span className="text-muted-foreground">food, clothing, shoes</span></td><td className="px-3 py-2 text-center"><span className="text-amber-700 font-semibold">Common Good</span><br/><span className="text-muted-foreground">ocean fish, groundwater</span></td></tr>
            <tr><td className="px-3 py-2 font-semibold bg-muted/30">Non-Rival</td><td className="px-3 py-2 text-center"><span className="text-purple-700 font-semibold">Club Good</span><br/><span className="text-muted-foreground">Netflix, gym, cable TV</span></td><td className="px-3 py-2 text-center"><span className="text-green-700 font-semibold">Public Good</span><br/><span className="text-muted-foreground">defense, fireworks, lighthouse</span></td></tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_TYPES.map(t => <span key={t} className={`px-2 py-1 rounded-full text-xs font-semibold border-2 ${GOOD_COLORS[t]}`}>{GOOD_LABELS[t]}</span>)}
      </div>
      <div className="space-y-3">
        {GOOD_EXAMPLES.map(ex => {
          const chosen = choices[ex.name];
          const isCorrect = checked && chosen === ex.correct;
          const isWrong = checked && chosen !== null && chosen !== ex.correct;
          return (
            <div key={ex.name} className={`rounded-xl border-2 p-4 transition-all ${checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-300 bg-red-50" : "border-border") : "border-border bg-card"}`}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm text-foreground">{ex.name}</span>
                {checked && isWrong && <span className="text-xs text-red-600 font-semibold">→ {GOOD_LABELS[ex.correct].split(" (")[0]}</span>}
                {checked && isCorrect && <span className="text-xs text-green-700 font-semibold">✓</span>}
              </div>
              <div className="flex flex-wrap gap-1">
                {ALL_TYPES.map(t => {
                  const sel = chosen === t;
                  let cls = sel ? GOOD_COLORS[t] + " border-current" : "border-border text-muted-foreground hover:border-primary/40";
                  if (checked && t === ex.correct) cls = GOOD_COLORS[t] + " border-current";
                  else if (checked && sel && t !== ex.correct) cls = "border-red-400 bg-red-100 text-red-700";
                  return (
                    <button key={t} onClick={() => { if (!checked) setChoices(p => ({ ...p, [ex.name]: t })); }}
                      disabled={checked} aria-pressed={sel}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                      {GOOD_LABELS[t].split(" (")[0]}
                    </button>
                  );
                })}
              </div>
              {checked && <p className="text-xs mt-2 text-muted-foreground italic">{ex.exp}</p>}
            </div>
          );
        })}
      </div>
      {!checked
        ? <button onClick={() => { if (allChosen) setChecked(true); }} disabled={!allChosen}
            className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Check My Answers</button>
        : <div className="space-y-3">
            <div className="rounded-xl bg-muted p-4 text-center">
              <p className="font-bold text-lg">{score} / {GOOD_EXAMPLES.length}</p>
              <p className="text-sm text-muted-foreground">{score >= 10 ? "Excellent — you know all four types!" : score >= 8 ? "Good — review the reference table for any misses." : "Review the 2×2 table and focus on excludability and rivalry."}</p>
            </div>
            {!marked && <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>}
            {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
          </div>
      }
    </div>
  );
}

// ─── Station 5: Free Rider Problem & Solutions ───
const FREERIDER_STEPS = [
  {
    title: "The Free Rider Problem",
    content: "A free rider is someone who benefits from a public good without paying for it.\n\nWhy it happens with public goods:\n• Non-excludable: you can't prevent non-payers from using the good\n• Non-rival: using it doesn't cost others anything\n• Rational response: 'If I can benefit without paying, why should I pay?'\n\nResult: If everyone free rides, the good isn't provided at all — or is severely underprovided.\n\nExample: A neighborhood wants to hire security guards to patrol the area. If 9 of 10 households chip in, the 10th household gets the same protection for free. Each household has an incentive to be the free rider.",
    question: "Why does the free rider problem lead to underprovision of public goods by private markets?",
    opts: ["Markets always overprice public goods", "Since people can benefit without paying, they have incentive not to pay — reducing revenue for providers until provision becomes unsustainable", "Public goods are too expensive for any firm to produce", "Government regulation prevents private provision of public goods"],
    correct: 1,
    exp: "The free rider problem breaks the market mechanism. Without payment, providers can't cover costs and won't supply the good. This is the fundamental reason public goods require non-market solutions — typically government provision funded through taxation (mandatory contribution).",
  },
  {
    title: "The Tragedy of the Commons",
    content: "Common goods face a different problem: the tragedy of the commons.\n\nCharacteristics: Non-excludable + Rival\n• Anyone can use the resource (non-excludable)\n• Each use reduces availability for others (rival)\n\nThe tragedy: Each individual acting rationally depletes a shared resource:\n• Ocean fishing: each boat catches as many fish as possible → overfishing → fishery collapse\n• Groundwater: each farmer pumps as much as needed → aquifer depleted\n• Highway congestion: each driver adds to the jam\n\nSolutions:\n✓ Regulations (fishing quotas, water rights)\n✓ Property rights (privatize the resource)\n✓ Cooperative management (community agreements)\n✗ Voluntary restraint alone rarely works",
    question: "The 'tragedy of the commons' describes:",
    opts: ["The underprovision of public goods by free riders", "The overuse and depletion of shared non-excludable but rival resources when each user acts in self-interest", "The monopoly problem in natural resource markets", "The failure of government to provide public goods"],
    correct: 1,
    exp: "Tragedy of the commons: individually rational behavior (use the resource while you can) leads to collective ruin (the resource is depleted). No single user has an incentive to conserve because others will simply take what they leave. Requires collective action — regulations, quotas, or property rights — to solve.",
  },
  {
    title: "Solutions to the Free Rider Problem",
    content: "Markets and governments have found creative ways to overcome the free rider problem:\n\n1. Government provision through taxation\n   National defense, public roads, basic research\n   Taxes make payment mandatory — eliminating free riding\n\n2. Indirect market provision\n   Commercial radio/TV: advertisers pay, listeners get content free\n   The 'free' content is the bait; advertisers are the real customers\n\n3. Mixed models\n   Public parks: basic access free, concessions/parking fees charged\n   National parks: free to enter, fee for camping\n\n4. Social pressure and norms\n   Neighborhood associations, community fundraisers\n   'Naming rights' — donors get recognition for contributing\n\n5. Technology (excludability solutions)\n   Scrambled cable signals → subscriptions\n   Digital rights management → paid streaming",
    question: "How does commercial radio solve the free rider problem for broadcasting?",
    opts: ["It requires all listeners to pay a monthly subscription", "Advertisers pay for the programming — listeners get content free, but the good is financed by a third party", "The government subsidizes all commercial radio stations", "Listeners must earn 'credits' by listening to advertisements"],
    correct: 1,
    exp: "Indirect market provision: advertisers pay broadcasters to reach listeners. The 'public good' (the broadcast) is financed by a third party who gains access to listeners' attention — a creative market solution to the free rider problem that doesn't require government.",
  },
  {
    title: "Education & Health as Positive Externalities",
    content: "Education and public health generate massive positive externalities — they're not pure public goods, but the market underprovides them:\n\nEducation:\n• Private return: 10–15% for U.S. college degree\n• Social returns: lower crime rates, better health outcomes, more stable democracy, economic growth\n• Result: society benefits more from your education than you capture → government subsidizes\n\nVaccination:\n• Private benefit: you're protected from the flu\n• Positive externality: you protect everyone around you (herd immunity)\n• Without subsidy: underuse of vaccination → preventable outbreaks\n\nPublic health infrastructure:\n• Clean water and sanitation — historically the biggest driver of life expectancy\n• No individual would pay for city-wide sewage systems → government provision\n\nCore insight: wherever social benefits exceed private benefits, markets underprovide and government intervention can improve outcomes.",
    question: "Why do governments subsidize education and vaccination rather than leaving them entirely to private markets?",
    opts: ["Because private markets cannot produce educational services", "Because education and vaccination generate positive externalities — social benefits exceed private benefits, so markets underprovide", "To eliminate all private production of education and health", "Because these goods are pure public goods (non-rival and non-excludable)"],
    correct: 1,
    exp: "Education and vaccination aren't pure public goods (they're excludable and rival to some degree), but they have large positive externalities. Private markets underprovide because individuals don't capture all the social benefits. Subsidies, public schools, and vaccination programs bring provision closer to the socially optimal level.",
  },
];

function FreeRiderStation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState(false);
  const cur = FREERIDER_STEPS[step];
  const stepAns = answers[step] ?? null;
  const allDone = FREERIDER_STEPS.every((_, i) => feedback[i] !== undefined);

  function check() {
    if (stepAns === null) return;
    setFeedback(prev => ({ ...prev, [step]: stepAns === cur.correct ? `✓ Correct! ${cur.exp}` : `Not quite. ${cur.exp}` }));
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {FREERIDER_STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition ${i === step ? "border-primary bg-primary text-primary-foreground" : feedback[i] ? "border-green-400 bg-green-50 text-green-700" : "border-border text-muted-foreground"}`}>
            {feedback[i] ? "✓ " : ""}Step {i + 1}
          </button>
        ))}
      </div>
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="font-semibold text-primary text-sm mb-2">{cur.title}</p>
        <p className="text-sm text-foreground whitespace-pre-line">{cur.content}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">{cur.question}</p>
        <div className="space-y-2">
          {cur.opts.map((opt, oi) => {
            const sel = stepAns === oi;
            const hasFb = feedback[step] !== undefined;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (hasFb) {
              if (oi === cur.correct) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
              else if (sel) cls = "border-red-400 bg-red-100 text-red-700";
            }
            return (
              <button key={oi} onClick={() => { if (!feedback[step]) setAnswers(p => ({ ...p, [step]: oi })); }}
                disabled={!!feedback[step]} aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                {hasFb && oi === cur.correct && "✓ "}{opt}
              </button>
            );
          })}
        </div>
      </div>
      {feedback[step] && (
        <div className={`rounded-xl p-4 text-sm ${feedback[step].startsWith("✓") ? "bg-green-50 border border-green-400 text-green-800" : "bg-amber-50 border border-amber-300 text-amber-800"}`} role="alert">
          {feedback[step]}
        </div>
      )}
      {!feedback[step]
        ? <button onClick={check} disabled={stepAns === null} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Check Answer</button>
        : step < FREERIDER_STEPS.length - 1
          ? <button onClick={() => setStep(step + 1)} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next Step →</button>
          : allDone && !marked
            ? <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
            : marked ? <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p> : null
      }
    </div>
  );
}

// ─── Quiz ───
const QUIZ_BANK = [
  { q: "Why do markets tend to UNDERINVEST in innovation?", opts: ["Firms are risk-averse and never invest in new technology", "Innovators capture only a fraction of total social benefits — the rest spills over to others who didn't pay, reducing the private return on R&D", "Government regulation prevents firms from patenting inventions", "Competition makes innovation impossible"], correct: 1, multi: false, exp: "Positive externalities from innovation: social benefits exceed private benefits. Since inventors can't capture all spillovers, private markets provide less R&D than the socially optimal amount." },
  { q: "Which government tool is BEST for encouraging a pharmaceutical company to invest in drug development?", opts: ["Direct R&D grants from NIH", "Patent protection giving exclusive rights to produce and sell the drug", "R&E tax credits on all R&D spending", "University-industry research partnerships"], correct: 1, multi: false, exp: "Patents are the primary tool for pharmaceutical innovation — they give the firm a temporary monopoly to recoup the enormous investment. Without patent protection, generic competitors would immediately copy the drug, making the investment unprofitable." },
  { q: "A public good is defined as:", opts: ["Any good provided by the government", "A good that is non-excludable (can't prevent use) AND non-rival (one person's use doesn't reduce others')", "A good with no externalities", "A good that is free to consumers"], correct: 1, multi: false, exp: "Public good: non-excludable (costly or impossible to prevent non-payers from using) AND non-rival (my use doesn't reduce your ability to use it). National defense, lighthouse beacons, and fireworks are classic examples." },
  { q: "A common good is characterized by:", opts: ["Excludable and non-rival", "Non-excludable and rival — anyone can use it, but use by one reduces availability for others", "Non-excludable and non-rival", "Excludable and rival"], correct: 1, multi: false, exp: "Common good: non-excludable (open access) + rival (use depletes the resource). Ocean fisheries and groundwater aquifers are classic examples. Open access + rivalry = tragedy of the commons." },
  { q: "The free rider problem arises because:", opts: ["Public goods are too expensive for any individual to buy", "Since non-payers can't be excluded from using a non-excludable good, individuals have incentive to use it without paying", "Government refuses to provide public goods", "Public goods have no value to consumers"], correct: 1, multi: false, exp: "If you can benefit from a good without paying, rational behavior is not to pay. When many people free ride, the good is underprovided or not provided at all — market failure requiring government action." },
  { q: "The tragedy of the commons describes:", opts: ["Government failure to provide public goods", "Overuse and depletion of shared non-excludable rival resources when each user acts in self-interest", "The problem of free riders on public goods", "Underinvestment in innovation due to spillovers"], correct: 1, multi: false, exp: "Tragedy of the commons: non-excludable + rival = open access leads to overuse. Each individual rationally uses as much as they can before it runs out, leading to collective depletion. Ocean overfishing is the textbook example." },
  { q: "Commercial radio broadcasting solves the free rider problem by:", opts: ["Requiring all listeners to pay a subscription", "Having advertisers pay for the broadcast — listeners get content free while advertisers pay to reach their audience", "Government subsidizing all radio stations", "Making radio signals excludable through encryption"], correct: 1, multi: false, exp: "Indirect market provision: advertisers pay to access listeners' attention. The 'public good' (broadcast) is financed by a willing third party. This market solution doesn't require government or mandatory payment." },
  { q: "Governments subsidize education because:", opts: ["Education is a pure public good (non-rival and non-excludable)", "Education generates large positive externalities — social benefits (lower crime, better health, economic growth) exceed private returns, so markets underprovide", "Private schools are illegal", "All education must be provided by government"], correct: 1, multi: false, exp: "Education isn't a pure public good (it's excludable and somewhat rival), but it has large positive externalities. Societies benefit from an educated population beyond what individuals capture privately — justifying public subsidies." },
  { q: "Which of the following are examples of PUBLIC GOODS? (Select all that apply)", opts: ["National defense", "A Netflix subscription", "A lighthouse beacon guiding all ships", "Clean air before pollution"], correct: [0, 2, 3], multi: true, exp: "Public goods: national defense (non-excludable, non-rival), lighthouse beacons (non-excludable, non-rival), clean air (non-excludable, non-rival). Netflix is a CLUB good — excludable (subscription required) but non-rival (streaming one show doesn't reduce others' access)." },
  { q: "Which of the following correctly distinguish club goods from public goods? (Select all that apply)", opts: ["Club goods are excludable; public goods are not", "Both club goods and public goods are non-rival", "Club goods are rival; public goods are non-rival", "Public goods are excludable; club goods are not"], correct: [0, 1], multi: true, exp: "Club good = excludable + non-rival. Public good = non-excludable + non-rival. The key difference is excludability — club goods can charge members; public goods cannot. Both are non-rival (use by one doesn't reduce availability for others)." },
];

function QuizStation({ onPass, onFail }: { onPass: (score: number, results: { correct: boolean; exp: string }[]) => void; onFail: (score: number, results: { correct: boolean; exp: string }[]) => void }) {
  const [questions] = useState(() => shuffle(QUIZ_BANK).map(q => {
    const s = shuffleOpts(q.opts, q.correct);
    return { ...q, opts: s.opts, correct: s.correct };
  }));
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const q = questions[currentQ];
  const isChecked = !!checked[currentQ];

  function isAnswerCorrect(qIdx: number): boolean {
    const question = questions[qIdx];
    const given = answers[qIdx];
    if (question.multi) {
      const correct = (question.correct as number[]).slice().sort().join(",");
      const userArr = Array.isArray(given) ? (given as number[]).slice().sort().join(",") : "";
      return correct === userArr;
    }
    return given === question.correct;
  }

  function hasSelection(qIdx: number): boolean {
    const given = answers[qIdx];
    if (questions[qIdx].multi) return Array.isArray(given) && (given as number[]).length > 0;
    return given !== undefined;
  }

  function handleSelect(idx: number) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [currentQ]: idx }));
  }

  function handleToggle(idx: number) {
    if (isChecked) return;
    setAnswers(prev => {
      const curr = (prev[currentQ] as number[] | undefined) ?? [];
      return { ...prev, [currentQ]: curr.includes(idx) ? curr.filter(x => x !== idx) : [...curr, idx] };
    });
  }

  function handleCheck() {
    if (!hasSelection(currentQ)) return;
    setChecked(prev => ({ ...prev, [currentQ]: true }));
  }

  const allAnswered = questions.every((_, i) => hasSelection(i));
  const score = questions.filter((_, i) => isAnswerCorrect(i)).length;

  function handleSubmit() {
    const results = questions.map((q, i) => ({ correct: isAnswerCorrect(i), exp: q.exp }));
    if (score >= 9) onPass(score, results);
    else onFail(score, results);
  }

  const isCorrectForQ = isChecked && isAnswerCorrect(currentQ);

  function optionStyle(i: number): string {
    const correctAnswers = q.multi ? (q.correct as number[]) : [q.correct as number];
    const userAnswer = answers[currentQ];
    const userSelected = q.multi ? (Array.isArray(userAnswer) && (userAnswer as number[]).includes(i)) : userAnswer === i;
    const isInCorrectSet = correctAnswers.includes(i);
    if (!isChecked) return userSelected ? "bg-primary/10 border-primary text-foreground" : "border-border text-foreground hover:border-primary/40";
    if (isInCorrectSet) return "bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-300";
    if (userSelected && !isInCorrectSet) return "bg-red-50 border-red-300 text-red-800";
    return "border-border text-foreground opacity-50";
  }

  function navDotStyle(i: number): string {
    if (i === currentQ) return "bg-primary";
    if (checked[i]) return isAnswerCorrect(i) ? "bg-emerald-400" : "bg-red-400";
    if (hasSelection(i)) return "bg-primary/40";
    return "bg-muted";
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Question {currentQ + 1} of {questions.length}</span>
        <span className="text-xs text-muted-foreground">{Object.keys(checked).length} / {questions.length} checked</span>
      </div>

      <div className="flex gap-2">
        {questions.map((_, i) => (
          <button key={i} onClick={() => setCurrentQ(i)}
            className={`flex-1 h-2 rounded-full transition-all ${navDotStyle(i)}`}
            aria-label={`Question ${i + 1}`} />
        ))}
      </div>

      <div className="rounded-xl bg-card border-2 border-border p-5">
        {q.multi && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Select ALL that apply</span>
          </div>
        )}
        <p className="text-sm font-semibold text-foreground mb-4">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, i) => {
            const userAnswer = answers[currentQ];
            const isSelected = q.multi ? (Array.isArray(userAnswer) && (userAnswer as number[]).includes(i)) : userAnswer === i;
            if (q.multi) {
              return (
                <button key={i} onClick={() => handleToggle(i)} disabled={isChecked}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all flex items-start gap-3 ${optionStyle(i)} ${isChecked ? "cursor-default" : ""}`}>
                  <span className={`shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? "bg-primary border-primary text-white" : "border-current opacity-50"}`}>
                    {isSelected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </span>
                  <span><span className="font-semibold mr-1">{String.fromCharCode(65 + i)}.</span>{opt}</span>
                </button>
              );
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={isChecked}
                className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${optionStyle(i)} ${isChecked ? "cursor-default" : ""}`}>
                <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>

        {!isChecked && hasSelection(currentQ) && (
          <button onClick={handleCheck}
            className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            Check Answer
          </button>
        )}
        {isChecked && (
          <div className={`mt-4 p-3 rounded-xl text-sm ${isCorrectForQ ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"} text-foreground`}>
            <strong>{isCorrectForQ ? "✓ Correct! " : "✗ Not quite. "}</strong>{q.exp}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          ← Previous
        </button>
        {currentQ < questions.length - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Question →
          </button>
        ) : allAnswered ? (
          <button onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700">
            Submit Quiz
          </button>
        ) : (
          <span className="text-xs text-muted-foreground">Answer all questions to submit</span>
        )}
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
        <p className="text-amber-700 font-medium">You scored {score} out of 10.</p>
        <p className="text-sm text-amber-700">Mastery requires 9 out of 10. Review the stations and try again.</p>
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 text-sm text-amber-800 font-semibold">This screen cannot be submitted. Only the final Results screen counts.</div>
        <button onClick={onRetry} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition"><RotateCcw className="inline w-4 h-4 mr-2" />Retry Quiz</button>
      </div>
    </div>
  );
}

function ResultsScreen({ score, results, onRetry }: { score: number; results: { correct: boolean; exp: string }[]; onRetry: () => void }) {
  const [reflection, setReflection] = useState("");
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const [studentName, setStudentName] = useState("");
  const pct = Math.round((score / 10) * 100);
  const grade =
    score === 10 ? { label: "Excellent",    color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", msg: "Perfect score! You've mastered the key concepts." } :
    score >= 8   ? { label: "Strong",       color: "text-blue-600",    bg: "bg-blue-50 border-blue-200",       msg: "Solid understanding — review any questions you missed." } :
    score >= 6   ? { label: "Developing",   color: "text-amber-600",   bg: "bg-amber-50 border-amber-200",     msg: "Good foundation. Revisit the stations before moving on." } :
                   { label: "Needs Review", color: "text-red-600",     bg: "bg-red-50 border-red-200",         msg: "Go back through the stations before the next class." };

  function handlePrint() {
    if (!studentName.trim()) { alert("Please enter your name before printing."); return; }
    const items = results.map((r, i) => '<p style="border-left:4px solid ' + (r.correct ? '#16a34a' : '#dc2626') + ';background:' + (r.correct ? '#f0fdf4' : '#fef2f2') + ';padding:6px 10px;margin:3px 0;font-size:12px"><b>Q' + (i+1) + ' ' + (r.correct ? '✓' : '✗') + ':</b> ' + r.exp + '</p>').join('');
    const w = window.open("", "_blank", "width=820,height=960");
    if (!w) return;
    w.document.write(
      '<html><head><title>ECO 211 ECONLAB</title><style>body{font-family:Arial,sans-serif;padding:20px;max-width:680px;margin:0 auto}@media print{button{display:none}}</style></head><body>'
      + '<h2 style="margin:0">ECO 211 ECONLAB - Lab Complete</h2>'
      + '<p style="color:#475569;margin:2px 0">Chapter 13: Positive Externalities & Public Goods</p>'
      + '<p style="font-size:22px;font-weight:bold;background:#1e2d4a;color:white;display:inline-block;padding:4px 16px;border-radius:99px;margin:8px 0">' + score + ' / 10</p>'
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<h3 style="font-size:13px;margin:0 0 6px">Question Review</h3>' + items
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<p style="font-size:13px"><b>Exit Ticket:</b></p><p style="border:1px solid #ccc;padding:8px;border-radius:4px;font-size:13px;min-height:40px">' + (reflection || '') + '</p>'
      + '<p style="font-size:13px;margin-top:12px"><b>Student Name:</b></p><p style="border:1px solid #000;padding:8px;border-radius:4px;font-size:14px;font-weight:bold">' + studentName + '</p>'
      + '<p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:16px;padding-top:8px">ECO 211 · Chapter 13: Positive Externalities & Public Goods · Printed ' + new Date().toLocaleDateString() + ' · Access for free at https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction</p>'
      + '</body></html>'
    );
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 600);
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 mb-4">
          <Award size={36} className="text-primary" />
        </div>
        <div className="font-bold text-5xl text-foreground mb-1">{score}/10</div>
        <div className="text-lg text-muted-foreground mb-4">{pct}% — {grade.label}</div>
        <div className={`inline-block px-5 py-3 rounded-xl border text-sm ${grade.bg} ${grade.color} font-medium max-w-sm`}>{grade.msg}</div>
        <div className="mt-6 pt-6 border-t border-border text-left space-y-3">
          <div className="text-xs font-semibold text-foreground">ECO 211 ECONLAB · Chapter 13: Positive Externalities & Public Goods</div>
          <div>
            <label htmlFor="student-name" className="text-xs font-semibold text-foreground block mb-1">Your Name (required for submission)</label>
            <input id="student-name" type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="First and Last Name"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <button onClick={handlePrint}
            className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
            🖨️ Print / Save as PDF
          </button>
          <p className="text-xs text-muted-foreground text-center">In the print dialog, choose "Save as PDF" and submit to Brightspace.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-3">Question Review</h3>
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className={`p-3 rounded-xl text-sm border-l-4 ${r.correct ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"}`}>
              <span className="font-bold text-xs">{r.correct ? "✓" : "✗"}</span>
              <span className="font-semibold text-foreground ml-1">Q{i+1}: </span>
              <span className="text-muted-foreground">{r.exp}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-2">Exit Ticket (Optional)</h3>
        <p className="text-xs text-muted-foreground mb-3">In 2–3 sentences: What is one thing from this lab that surprised you or changed how you think about this topic?</p>
        <textarea value={reflection} onChange={e => setReflection(e.target.value)} rows={3}
          placeholder="Type your reflection here…"
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground" />
        <p className="text-xs text-muted-foreground mt-1">Your reflection will appear in the printed PDF.</p>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onRetry}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          ↺ Start Over
        </button>
      </div>
    </div>
  );
}


function Header({ station, onStation, completed }: { station: Station; onStation: (s: Station) => void; completed: Set<Station> }) {
  const stations: { id: Station; label: string }[] = [
    { id: "intro", label: "Dashboard" },
    { id: "recap", label: "Recap" },
    { id: "innovation", label: "Innovation" },
    { id: "govpolicy", label: "Gov. Policy" },
    { id: "goodstypes", label: "Goods Types" },
    { id: "freerider", label: "Free Rider" },
    { id: "quiz", label: "Quiz" },
  ];
  const CONTENT_STATIONS: Station[] = ["recap","innovation","govpolicy","goodstypes","freerider"];
  const allDone = CONTENT_STATIONS.every(s => completed.has(s as Station));
  const stationOrder: Station[] = ["intro","recap","innovation","govpolicy","goodstypes","freerider","quiz","results","not-yet"];
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
            <div className="font-display font-semibold text-sm leading-none text-sidebar-foreground">ECO 211 ECONLAB</div>
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 13</div>
          </div>
        </div>
        <a href="https://www.perplexity.ai/computer/a/eco-211-econlab-course-hub-h76o7OX6SpisjlWADnIRGg" target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-sidebar-foreground/80 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-sidebar-accent shrink-0">
          ← Course Hub <span className="sr-only">(opens in new tab)</span>
        </a>
        <div className="hidden sm:flex items-center gap-1 flex-wrap">
          {stations.map((s) => {
            const idx = stationOrder.indexOf(s.id as Station);
            const done = idx < currentIdx;
            const active = s.id === station;
            if (s.id === "quiz" && !allDone) {
              return <span key={s.id} title="Complete all stations first" className="px-3 py-1.5 rounded-full text-xs font-medium text-sidebar-foreground/35 cursor-not-allowed select-none">🔒 {s.label}</span>;
            }
            return (
              <button key={s.id} onClick={() => onStation(s.id as Station)}
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

export default function EconLab() {
  const [station, setStation] = useState<Station>("intro");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const [studentName, setStudentName] = useState("");
  const mainRef = useRef<HTMLDivElement>(null);

  const STATIONS = [
    { id: "recap",      label: "📚 Ch12 Recap",                   short: "Recap",       desc: "Review negative externalities and environmental policy tools" },
    { id: "innovation", label: "💡 Innovation & Spillovers",       short: "Innovation",  desc: "Why markets underinvest in R&D and why spillovers create market failure" },
    { id: "govpolicy",  label: "🏛️ Government Policy Matcher",    short: "Gov. Policy", desc: "Match 4 R&D scenarios to the best government innovation tool" },
    { id: "goodstypes", label: "📦 4 Types of Goods Classifier",   short: "Goods Types", desc: "Classify 12 goods as private, public, club, or common" },
    { id: "freerider",  label: "🚴 Free Rider & Public Goods",     short: "Free Rider",  desc: "4-step walkthrough: free rider problem, tragedy of commons, solutions" },
  ];

  const allStationsDone = STATIONS.every(s => completed.has(s.id));
  function markDone(id: string) { setCompleted(prev => new Set([...prev, id])); setStation("intro"); }
  function handlePass(score: number, results: { correct: boolean; exp: string }[]) { setQuizScore(score); setQuizResults(results); try { localStorage.setItem("econlab211_done_ch13", "true"); } catch (_) {} setStation("results"); }
  function handleFail(score: number, results: { correct: boolean; exp: string }[]) { setQuizScore(score); setQuizResults(results); setStation("not-yet"); }

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded z-50">Skip to main content</a>
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}

      <Header station={station} onStation={setStation} completed={completed} />

      <main id="main-content" ref={mainRef} className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {station === "intro" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-primary/5 border-2 border-primary/20 p-5">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Key Idea</p>
              <p className="text-base font-semibold text-foreground">"When Markets Underprovide: Innovation, Knowledge, and Public Goods"</p>
              <p className="text-sm text-muted-foreground mt-1">Positive externalities cause markets to underprovide. Knowledge spills over to others; public goods benefit everyone without payment. Understanding WHY markets fail here — and what policies help — is the final piece of the market failure puzzle.</p>
            </div>
            <button onClick={() => setShowSummary(true)} className="w-full text-left rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 transition flex items-center gap-2">
              <span>📄</span><span>Need a refresher? <span className="text-primary font-semibold underline">View the Chapter 13 summary.</span></span>
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              {STATIONS.map(s => {
                const done = completed.has(s.id);
                return (
                  <button key={s.id} onClick={() => setStation(s.id as Station)}
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
            {allStationsDone
              ? <button onClick={() => setStation("quiz")} className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-base transition flex items-center justify-center gap-2"><Award size={20} /> Take the Quiz</button>
              : <div className="w-full py-4 bg-muted text-muted-foreground/60 rounded-xl font-bold text-base text-center">🔒 Quiz — Complete all stations to unlock</div>
            }
          </div>
        )}

        {station !== "intro" && station !== "quiz" && station !== "not-yet" && station !== "results" && (
          <div className="space-y-4">
            <div role="alert" aria-live="polite" className="sr-only" />
            {station === "recap"      && <RecapStation      onComplete={() => markDone("recap")}      />}
            {station === "innovation" && <InnovationStation onComplete={() => markDone("innovation")} />}
            {station === "govpolicy"  && <GovPolicyStation  onComplete={() => markDone("govpolicy")}  />}
            {station === "goodstypes" && <GoodsTypesStation onComplete={() => markDone("goodstypes")} />}
            {station === "freerider"  && <FreeRiderStation  onComplete={() => markDone("freerider")}  />}
          </div>
        )}

        {station === "quiz" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
  
              <h2 className="text-base font-bold text-foreground">🎯 Chapter 13 Quiz</h2>
            </div>
            <QuizStation
              onPass={(score, results) => { setQuizScore(score); setQuizResults(results); try { localStorage.setItem("econlab211_done_ch13", "true"); } catch (_) {} setStation("results"); }}
              onFail={(score, results) => { setQuizScore(score); setQuizResults(results); setStation("not-yet"); }}
            />
          </div>
        )}
      {station === "not-yet" && <NotYetScreen score={quizScore} onRetry={() => setStation("quiz")} />}
      {station === "results" && <ResultsScreen score={quizScore} results={quizResults} onRetry={() => { setQuizScore(0); setQuizResults([]); setCompleted(new Set()); setStation("intro"); }} />}
      </main>
    </>
  );
}
