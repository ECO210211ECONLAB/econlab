import { useState, useRef } from "react";
import { ChevronLeft, Award, RotateCcw } from "lucide-react";

type Station = "intro" | "recap" | "externalities" | "cmdcontrol" | "markettools" | "tradeoff" | "international" | "quiz" | "results" | "not-yet";

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

const CH12_SUMMARY = [
  { heading: "12.1 — The Economics of Pollution", body: "Economic production can cause environmental damage. An externality occurs when an exchange between a buyer and seller has an impact on a third party who is not part of the exchange. A negative externality imposes costs on third parties; a positive externality provides benefits. If those imposing a negative externality had to account for the broader social cost, they would have an incentive to reduce pollution. Because resources are not allocated efficiently, externalities lead to market failure." },
  { heading: "12.2 — Command-and-Control Regulation", body: "Command-and-control regulation sets specific limits for pollution emissions and/or specific pollution-control technologies that firms must use. Although such regulations have helped protect the environment, they have three shortcomings: they provide no incentive for going beyond the limits they set; they offer limited flexibility on where and how to reduce pollution; and they often have politically-motivated loopholes." },
  { heading: "12.3 — Market-Oriented Environmental Tools", body: "Examples of market-oriented environmental policies include pollution charges (taxes per unit of pollution), marketable permits (cap-and-trade), and better-defined property rights (Coase theorem). Market-oriented policies include taxes, markets, and property rights so that those who impose negative externalities must face the social cost of their actions." },
  { heading: "12.4 — The Benefits and Costs of U.S. Environmental Laws", body: "We can make a strong case, taken as a whole, that the benefits of U.S. environmental regulation have outweighed the costs. As the extent of environmental regulation increases, additional expenditures on environmental protection will probably have increasing marginal costs and decreasing marginal benefits. This pattern suggests that the flexibility and cost savings of market-oriented environmental policies will become more important." },
  { heading: "12.5 — International Environmental Issues", body: "Certain global environmental issues, such as global warming and biodiversity, spill over national borders and require addressing with some form of international agreement." },
  { heading: "12.6 — The Tradeoff between Economic Output and Environmental Protection", body: "Depending on their different income levels and political preferences, countries are likely to make different choices about allocative efficiency — the choice between economic output and environmental protection along the production possibility frontier. However, all countries should prefer to make a choice that shows productive efficiency — a choice on the PPF rather than inside it." },
];

function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="summary-title">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 id="summary-title" className="text-lg font-bold text-foreground">📄 Chapter 12 Summary</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" aria-label="Close">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {CH12_SUMMARY.map((sec, i) => (
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

// ─── Station 1: Ch11 Recap ───
const RECAP_QS = [
  { q: "The Herfindahl-Hirschman Index (HHI) is calculated by:", opts: ["Summing the top 4 firms' market shares", "Squaring each firm's market share and summing all results", "Dividing industry revenue by number of firms", "Multiplying the 4-firm ratio by 100"], correct: 1, exp: "HHI = sum of squared market shares. A pure monopoly (100% share) has HHI = 10,000. HHI > 1,800 indicates high concentration." },
  { q: "The FTC's three possible decisions on a merger are:", opts: ["Only approve or block", "Approve, block, or approve with conditions (require asset divestitures)", "Investigate, fine, or nationalize", "Regulate prices, break up, or ignore"], correct: 1, exp: "FTC: approve (most common), block (rare), or approve with conditions — usually requiring the merged firm to sell certain assets to preserve competition in affected markets." },
  { q: "Price cap regulation creates stronger efficiency incentives than cost-plus because:", opts: ["It sets P = MC", "The firm profits by cutting costs faster than the fixed cap declines — unlike cost-plus where cost savings go back to consumers", "It guarantees a normal profit", "It requires no government oversight"], correct: 1, exp: "Price cap: ceiling set years in advance. Firm keeps any savings below the cap as profit. Cost-plus: the firm passes all costs through to allowed prices — no incentive to reduce them." },
  { q: "Which business practice is clearly ILLEGAL under U.S. antitrust law?", opts: ["Bundling products in a package sale", "Negotiating volume discounts with suppliers", "Competitors secretly agreeing to fix prices", "Selling only through a single distributor"], correct: 2, exp: "Explicit price-fixing (forming a cartel to coordinate prices) is illegal under the Sherman Antitrust Act. Executives face criminal prosecution." },
  { q: "Regulatory capture describes:", opts: ["A regulator successfully controlling prices for consumers", "Regulated industries gaining influence over the regulatory process — regulations serve industry, not the public", "A firm capturing market share from rivals", "Government ownership of a natural monopoly"], correct: 1, exp: "Regulatory capture: the revolving door between industry and regulators, information asymmetry, and lobbying cause regulations to protect incumbents rather than consumers." },
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


type ExtType = "negative" | "positive" | "none";

const EXT_LABELS: Record<ExtType, string> = {
  negative: "Negative Externality",
  positive: "Positive Externality",
  none:     "No Significant Externality",
};

const EXT_COLORS: Record<ExtType, string> = {
  negative: "bg-red-100 text-red-800 border-red-300",
  positive: "bg-green-100 text-green-800 border-green-300",
  none:     "bg-slate-100 text-slate-700 border-slate-300",
};

const EXT_EXAMPLES: { name: string; correct: ExtType; exp: string }[] = [
  { name: "A factory emits smoke that damages nearby crops", correct: "negative", exp: "Classic negative externality — third parties (farmers) bear costs they didn't choose." },
  { name: "A homeowner installs solar panels, reducing grid demand for neighbors", correct: "positive", exp: "Neighbors benefit from lower grid prices without paying for the panels." },
  { name: "A student gets vaccinated against flu", correct: "positive", exp: "Reduces transmission risk for others — a positive externality (herd immunity benefit)." },
  { name: "A driver burns gasoline, adding CO₂ to the atmosphere", correct: "negative", exp: "Carbon emissions impose climate costs on society — a negative externality." },
  { name: "A bakery sells bread at market price with no spillovers", correct: "none", exp: "A straightforward market transaction — all costs and benefits are internalized." },
  { name: "A beekeeper's hives pollinate neighboring orchards", correct: "positive", exp: "Orchards benefit from pollination without paying the beekeeper — positive externality." },
  { name: "A loud bar plays music that disturbs nearby residents", correct: "negative", exp: "Noise imposes costs on third parties — a negative externality." },
  { name: "A neighbor plants a beautiful garden visible from the street", correct: "positive", exp: "Passersby enjoy the beauty for free — a positive externality (aesthetic benefit)." },
];

function ExternalitiesStation({ onComplete }: { onComplete: () => void }) {
  const [choices, setChoices] = useState<Record<string, ExtType | null>>(() => Object.fromEntries(EXT_EXAMPLES.map(e => [e.name, null])));
  const [checked, setChecked] = useState(false);
  const [marked, setMarked] = useState(false);
  const allChosen = EXT_EXAMPLES.every(e => choices[e.name] !== null);
  const score = EXT_EXAMPLES.filter(e => choices[e.name] === e.correct).length;
  const ALL_TYPES: ExtType[] = ["negative", "positive", "none"];

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm font-semibold text-primary mb-1">Externality Classifier</p>
        <p className="text-sm text-muted-foreground">An externality is a spillover cost or benefit from a transaction that falls on a third party not involved in the exchange. Classify each example as a negative externality, positive externality, or no externality.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_TYPES.map(t => <span key={t} className={`px-2 py-1 rounded-full text-xs font-semibold border-2 ${EXT_COLORS[t]}`}>{EXT_LABELS[t]}</span>)}
      </div>
      <div className="space-y-3">
        {EXT_EXAMPLES.map(ex => {
          const chosen = choices[ex.name];
          const isCorrect = checked && chosen === ex.correct;
          const isWrong = checked && chosen !== null && chosen !== ex.correct;
          return (
            <div key={ex.name} className={`rounded-xl border-2 p-4 transition-all ${checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-300 bg-red-50" : "border-border") : "border-border bg-card"}`}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm text-foreground">{ex.name}</span>
                {checked && isWrong && <span className="text-xs text-red-600 font-semibold">→ {EXT_LABELS[ex.correct]}</span>}
                {checked && isCorrect && <span className="text-xs text-green-700 font-semibold">✓ Correct</span>}
              </div>
              <div className="flex flex-wrap gap-1">
                {ALL_TYPES.map(t => {
                  const sel = chosen === t;
                  let cls = sel ? EXT_COLORS[t] + " border-current" : "border-border text-muted-foreground hover:border-primary/40";
                  if (checked && t === ex.correct) cls = EXT_COLORS[t] + " border-current";
                  else if (checked && sel && t !== ex.correct) cls = "border-red-400 bg-red-100 text-red-700";
                  return (
                    <button key={t} onClick={() => { if (!checked) setChoices(p => ({ ...p, [ex.name]: t })); }}
                      disabled={checked} aria-pressed={sel}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                      {EXT_LABELS[t]}
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
              <p className="font-bold text-lg">{score} / {EXT_EXAMPLES.length}</p>
              <p className="text-sm text-muted-foreground">{score >= 9 ? "Strong grasp of externalities!" : "Review the explanations — focus on who bears the spillover cost or benefit."}</p>
            </div>
            {!marked && <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>}
            {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
          </div>
      }
    </div>
  );
}

// ─── Station 3: Command & Control vs. Market Tools ───
const CMD_STEPS = [
  {
    title: "Command-and-Control Regulation",
    content: "Command-and-control (C&C) regulation tells firms exactly what to do:\n• Set specific emission limits (e.g., 'no more than X tons of SO₂ per year')\n• Or require specific technology (e.g., 'install a scrubber on all smokestacks')\n\nExamples: EPA's emission standards, catalytic converter requirements, smokestack regulations.\n\nShortcomings of C&C:\n✗ No incentive to reduce pollution BELOW the legal limit\n✗ No flexibility — all firms must meet the same standard even if costs differ greatly\n✗ Politically motivated loopholes (older plants often exempt)",
    question: "Which of the following is a shortcoming of command-and-control regulation?",
    opts: ["It provides strong incentives to reduce pollution below the legal limit", "It is highly flexible, allowing firms to choose the cheapest way to reduce pollution", "It provides no incentive to reduce pollution beyond what the law requires", "It eliminates all political influence over environmental policy"],
    correct: 2,
    exp: "C&C sets a floor, not a ceiling. Once a firm meets the standard, there is zero financial incentive to reduce pollution further. Market-oriented tools continuously incentivize reduction.",
  },
  {
    title: "Pollution Charges (Pigouvian Tax)",
    content: "A pollution charge is a tax per unit of pollution emitted. Firm's logic:\n• If abatement cost < tax → reduce pollution (cheaper to clean up)\n• If abatement cost > tax → pay the tax (cheaper to pollute and pay)\n\nExample: $1,000 tax per ton of particulate emissions.\n• Firm A's cheapest abatement: $300, $500, $900 per ton → reduces first 3 tons\n• Stops at ton 4 where abatement cost ($1,500) exceeds the tax ($1,000)\n\nResult: Firms reduce pollution where it's cheapest to do so — efficient allocation of pollution reduction.",
    question: "A pollution charge of $500/ton is levied. A firm can reduce pollution by 1 ton for $300. What should the firm do?",
    opts: ["Pay the $500 tax — it's easier than reducing pollution", "Reduce pollution by 1 ton — the $300 abatement cost is less than the $500 tax", "Lobby the government to remove the tax", "Increase production to spread the tax over more units"],
    correct: 1,
    exp: "If abatement cost ($300) < tax ($500), the firm saves money by reducing pollution. This is the key efficiency mechanism: firms reduce pollution where it's cheapest, regardless of what their rivals do.",
  },
  {
    title: "Marketable Permits (Cap-and-Trade)",
    content: "Cap-and-trade: government sets a total cap on emissions and distributes permits. Firms can buy and sell permits.\n\nHow it works:\n• Government issues permits = total allowed pollution\n• Firms must hold one permit per unit of pollution\n• Firms with cheap abatement: reduce emissions, sell extra permits\n• Firms with expensive abatement: buy permits instead of reducing\n\nReal example: U.S. Acid Rain Program (SO₂ cap-and-trade)\n• Cap: 8.95M tons SO₂ by 2010\n• Result: Same environmental goal achieved at half the expected cost\n\nShrinking cap over time = total pollution decreases.",
    question: "In a cap-and-trade system, which firms will sell their unused permits?",
    opts: ["Firms with the highest abatement costs — it's cheaper for them to buy permits", "Firms with the lowest abatement costs — they can reduce pollution cheaply and sell extra permits for profit", "The government — it always retains the permits", "Only new firms entering the market"],
    correct: 1,
    exp: "Firms with cheap abatement reduce MORE than required, then sell their unused permits for profit. Firms with expensive abatement buy permits instead of cleaning up. This ensures pollution reduction happens where it's cheapest — achieving the same goal at lower total cost.",
  },
  {
    title: "Property Rights & the Coase Theorem",
    content: "Coase Theorem: when property rights are clearly defined and bargaining costs are low, parties can negotiate to the efficient outcome — regardless of who initially owns the rights.\n\nExamples:\n• NYC Watershed: City paid upstate farmers to reduce runoff (cheaper than building filtration plants)\n• SO₂ cap-and-trade: Government defined emission rights, firms traded to efficiency\n• Airport noise: Airports buy 'noise easements' from nearby homeowners\n\nLimitations: Works when:\n✓ Few parties involved\n✓ Property rights are clearly defined\n✓ Bargaining costs are low\n✗ Fails for global problems (millions of parties, unclear rights)",
    question: "The Coase Theorem suggests that private bargaining can solve externality problems when:",
    opts: ["The government sets the tax at exactly the right level", "Property rights are clear and bargaining costs are low", "There are millions of parties involved in the externality", "The externality crosses national borders"],
    correct: 1,
    exp: "The Coase Theorem applies when: few parties, clear property rights, and low transaction costs. When millions of parties are involved (like climate change), bargaining breaks down and government policy is needed.",
  },
];

function CmdControlStation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState(false);
  const cur = CMD_STEPS[step];
  const stepAns = answers[step] ?? null;
  const allDone = CMD_STEPS.every((_, i) => feedback[i] !== undefined);

  function check() {
    if (stepAns === null) return;
    setFeedback(prev => ({ ...prev, [step]: stepAns === cur.correct ? `✓ Correct! ${cur.exp}` : `Not quite. ${cur.exp}` }));
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {CMD_STEPS.map((s, i) => (
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
        : step < CMD_STEPS.length - 1
          ? <button onClick={() => setStep(step + 1)} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next Step →</button>
          : allDone && !marked
            ? <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
            : marked ? <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p> : null
      }
    </div>
  );
}

// ─── Station 4: The PPF Tradeoff ───
const TRADEOFF_QS = [
  { q: "The Production Possibility Frontier (PPF) shows the tradeoff between economic output and environmental protection. Point M is INSIDE the PPF. This means:", opts: ["The economy is productively efficient", "The economy is wasting resources — it could have more output AND more environmental protection by moving to the frontier", "The economy has chosen more environmental protection over output", "The economy has reached maximum environmental protection"], correct: 1, exp: "Any point inside the PPF represents productive inefficiency — resources are being wasted. Moving from inside the PPF to the frontier improves BOTH outcomes simultaneously. Market-oriented environmental tools help move from M toward the frontier." },
  { q: "The optimal level of pollution control is where:", opts: ["Pollution is reduced to zero", "Marginal Benefit of reducing pollution = Marginal Cost of reducing pollution", "All firms use the same pollution control technology", "The government mandates the maximum reduction possible"], correct: 1, exp: "Optimal pollution is NOT zero — zero pollution would mean zero production (starvation is worse than pollution). The optimal level is where MB = MC of pollution reduction. Beyond this point, cleanup costs exceed the benefits." },
  { q: "As environmental regulations become more extensive and stringent:", opts: ["Marginal costs of further regulation stay constant", "Marginal benefits of further cleanup increase and marginal costs decrease", "Marginal costs of further cleanup increase AND marginal benefits decrease", "Market-oriented tools become less important"], correct: 2, exp: "Low-hanging fruit first: early regulations address the cheapest pollution to fix and the most harmful. As regulations expand, the remaining pollution is increasingly expensive to reduce while the remaining harm is less severe. This pattern strengthens the case for flexible, market-oriented tools." },
  { q: "Two countries differ in income level. Why might they choose different points on the environmental-economic tradeoff?", opts: ["Lower-income countries always prioritize environment over growth", "Higher-income countries always prioritize growth over environment", "Countries may have different preferences and income constraints — richer countries can afford to trade more output for environmental protection", "All countries must make the same tradeoff under international law"], correct: 2, exp: "Environmental protection is often a normal good — as incomes rise, people demand more of it. Lower-income countries may prioritize economic growth to meet basic needs; higher-income countries may favor stricter environmental standards. Both can be efficient choices on their own PPFs." },
  { q: "Why does global warming require international agreements rather than just national policy?", opts: ["Because each country can solve climate change on its own", "Because CO₂ emissions in one country affect the climate of all countries — it's a global externality that crosses borders", "Because international law already mandates uniform carbon taxes", "Because only wealthy countries emit CO₂"], correct: 1, exp: "Global warming is a global externality. CO₂ emitted anywhere affects everyone. No single nation acting alone can solve it — this creates a prisoner's dilemma at the international level, requiring coordinated agreements like the Paris Agreement." },
];

function TradeoffStation({ onComplete }: { onComplete: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(TRADEOFF_QS.length).fill(null));
  const [checked, setChecked] = useState<boolean[]>(Array(TRADEOFF_QS.length).fill(false));
  const [marked, setMarked] = useState(false);
  const q = TRADEOFF_QS[qIdx];
  const ans = answers[qIdx];
  const isChecked = checked[qIdx];
  const allDone = checked.every(Boolean);
  const score = TRADEOFF_QS.filter((q, i) => answers[i] === q.correct).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Question {qIdx + 1} of {TRADEOFF_QS.length}</span>
        <div className="flex gap-1">{TRADEOFF_QS.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === qIdx ? "bg-primary" : checked[i] ? (answers[i] === TRADEOFF_QS[i].correct ? "bg-green-500" : "bg-red-400") : "bg-muted"}`} />)}</div>
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
            {qIdx < TRADEOFF_QS.length - 1
              ? <button onClick={() => setQIdx(qIdx + 1)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next →</button>
              : allDone && !marked
                ? <div className="flex-1 space-y-2">
                    <div className="rounded-xl bg-muted p-3 text-center text-sm"><span className="font-bold">{score}/{TRADEOFF_QS.length}</span> correct</div>
                    <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
                  </div>
                : marked ? <p className="flex-1 text-center text-green-700 font-semibold text-sm py-3">✓ Station Complete</p> : null
            }
          </div>
      }
    </div>
  );
}

// ─── Station 5: Policy Tool Matcher ───
const POLICY_SCENARIOS = [
  {
    scenario: "A city has thousands of households and small businesses that emit carbon from gas stoves, car trips, and heating. The government wants to reduce total city-wide carbon emissions efficiently without telling each household what to do.",
    best: "charge" as const,
    why: "A carbon tax (pollution charge) works best when there are millions of small polluters. Each household/business faces the same price signal and reduces pollution where it's cheapest for them — no need to regulate each decision individually. Example: carbon taxes on gasoline.",
  },
  {
    scenario: "A river valley has 12 large industrial plants that discharge into the same waterway. The EPA wants to cut total discharge by 40% while achieving this at the lowest possible total cost across all plants.",
    best: "capTrade" as const,
    why: "Cap-and-trade works best with dozens of large, identifiable polluters with varying abatement costs. Plants with cheap cleanup do more and sell permits; plants with expensive cleanup buy permits. Same environmental goal, lower total cost. Example: the Clean Air Act's SO₂ cap-and-trade.",
  },
  {
    scenario: "A small airport generates noise that disturbs a nearby residential neighborhood (50 homeowners). Residents and the airport both know who is affected. Legal ownership of airspace noise rights has just been established by the courts.",
    best: "property" as const,
    why: "With clear property rights, few parties, and low bargaining costs, the Coase Theorem applies. The airport and homeowners can negotiate directly — airport buys noise easements, or residents pay airport to use quieter flight paths. No government regulation needed.",
  },
];

const POLICY_OPTIONS = [
  { id: "charge", label: "Pollution Charge (Tax per unit of pollution)", desc: "Best for millions of small polluters — price signal incentivizes reduction without dictating how" },
  { id: "capTrade", label: "Marketable Permits (Cap-and-Trade)", desc: "Best for dozens of large polluters — firms trade permits, achieving the cap at lowest total cost" },
  { id: "property", label: "Property Rights / Coase Theorem", desc: "Best when few parties, clear rights, low bargaining costs — private negotiation solves the externality" },
  { id: "cmdControl", label: "Command-and-Control Regulation", desc: "Direct limits or technology mandates — uniform but inflexible" },
];

function InternationalStation({ onComplete }: { onComplete: () => void }) {
  const [scenIdx, setScenIdx] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [doneScens, setDoneScens] = useState<number[]>([]);
  const [marked, setMarked] = useState(false);
  const scen = POLICY_SCENARIOS[scenIdx];
  const allDone = doneScens.length >= POLICY_SCENARIOS.length - 1 && checked;

  function next() {
    setDoneScens(p => [...p, scenIdx]);
    if (scenIdx < POLICY_SCENARIOS.length - 1) { setScenIdx(scenIdx + 1); setChoice(null); setChecked(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {POLICY_SCENARIOS.map((_, i) => (
          <span key={i} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold border-2 ${i === scenIdx ? "border-primary bg-primary text-primary-foreground" : doneScens.includes(i) ? "border-green-500 bg-green-100 text-green-800" : "border-border text-muted-foreground"}`}>{i + 1}</span>
        ))}
      </div>
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Scenario {scenIdx + 1}</p>
        <p className="text-sm text-foreground">{scen.scenario}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">Which environmental policy tool is BEST suited for this situation?</p>
        <div className="space-y-2">
          {POLICY_OPTIONS.map(opt => {
            const sel = choice === opt.id;
            const isCorrect = checked && opt.id === scen.best;
            const isWrong = checked && sel && opt.id !== scen.best;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (checked) {
              if (isCorrect) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
              else if (isWrong) cls = "border-red-400 bg-red-50 text-red-700";
            }
            return (
              <button key={opt.id} onClick={() => { if (!checked) setChoice(opt.id); }}
                disabled={checked} aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                <p className={`font-semibold ${isCorrect ? "text-green-800" : ""}`}>{isCorrect && "✓ "}{opt.label}</p>
                <p className="text-xs mt-0.5 opacity-75">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
      {checked && <div className="rounded-xl bg-muted p-4 text-sm" role="alert"><p className="font-semibold mb-1 text-foreground">{choice === scen.best ? "✓ Correct!" : "Not quite."}</p><p className="text-muted-foreground">{scen.why}</p></div>}
      {!checked
        ? <button onClick={() => { if (choice) setChecked(true); }} disabled={!choice} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Check Answer</button>
        : <div className="space-y-3">
            {scenIdx < POLICY_SCENARIOS.length - 1 && !doneScens.includes(scenIdx) && <button onClick={next} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next Scenario →</button>}
            {(allDone || (doneScens.length >= POLICY_SCENARIOS.length - 1 && checked)) && !marked && <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>}
            {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
          </div>
      }
    </div>
  );
}

// ─── Quiz ───
const QUIZ_BANK = [
  { q: "An externality is defined as:", opts: ["A tax on pollution", "A spillover cost or benefit from a transaction that falls on a third party not involved in the exchange", "A government regulation on production", "The total social cost of production"], correct: 1, multi: false, exp: "Externality = spillover to third parties. Negative externalities impose costs; positive externalities provide benefits. Both cause market failure because the market price doesn't reflect the full social impact." },
  { q: "A steel mill that dumps chemicals into a river is creating:", opts: ["A positive externality", "A negative externality — costs are imposed on third parties (downstream users) not part of the steel transaction", "No externality — the river is public property", "A market failure only if regulated"], correct: 1, multi: false, exp: "Classic negative externality: the steel transaction between producer and buyer imposes pollution costs on third parties (fishers, towns, wildlife) who had no role in the exchange." },
  { q: "Command-and-control regulation's main shortcoming is:", opts: ["It reduces pollution too quickly", "Firms have no incentive to reduce pollution below the legal limit, and there is no flexibility in how to reduce", "It gives firms too much flexibility", "It only applies to large firms"], correct: 1, multi: false, exp: "C&C sets a floor: once the limit is met, there is zero financial incentive to do better. All firms face the same standard regardless of their different costs — which is inefficient." },
  { q: "A pollution charge works by:", opts: ["Requiring all firms to install the same cleanup technology", "Setting a tax per unit of pollution — firms reduce pollution where it's cheapest for them", "Distributing tradeable permits among polluters", "Defining property rights over clean air"], correct: 1, multi: false, exp: "Pollution charge: tax per unit emitted. Firms compare abatement cost to the tax — if abatement is cheaper, they clean up; if not, they pay and pollute. This ensures reduction happens where it's cheapest." },
  { q: "In a cap-and-trade system, who is most likely to SELL their emission permits?", opts: ["Firms with high abatement costs — it's too expensive to clean up", "Firms with low abatement costs — they reduce more than required and sell extra permits for profit", "The government — it holds all permits initially", "Firms that have already met their cap"], correct: 1, multi: false, exp: "Low-cost abaters reduce pollution beyond their cap and sell the surplus permits. High-cost abaters buy permits instead of cleaning up. This ensures the cap is met at the lowest total cost across all firms." },
  { q: "The Coase Theorem states that if property rights are clear and bargaining costs are low:", opts: ["Government regulation is always required to solve externalities", "Private parties can negotiate to the efficient outcome without government intervention", "Pollution will be set at zero through private agreement", "Only large corporations can benefit from property rights"], correct: 1, multi: false, exp: "Coase Theorem: with clear property rights and low transaction costs, the affected parties negotiate to the efficient outcome regardless of who initially owns the rights. Works best with few parties; fails for global problems." },
  { q: "The optimal level of pollution control is where:", opts: ["Pollution is reduced to zero", "Marginal cost of abatement = Marginal benefit of reducing pollution", "All firms use the best available technology", "Government mandates the maximum feasible reduction"], correct: 1, multi: false, exp: "Optimal pollution is NOT zero — reducing pollution to zero would eliminate all production. The efficient level is where MB = MC of pollution reduction. Beyond this point, the cleanup costs more than the benefit gained." },
  { q: "Global warming requires international cooperation because:", opts: ["Each country can solve climate change on its own", "CO₂ emissions in any country affect the global climate — a global externality that no single nation can solve alone", "Only wealthy countries emit greenhouse gases", "International law already mandates equal emissions per country"], correct: 1, multi: false, exp: "CO₂ mixes globally — no country can solve climate change unilaterally. This creates a global prisoner's dilemma: each country benefits from others reducing emissions but faces costs to reduce its own. International agreements (Paris Agreement) attempt to coordinate action." },
  { q: "Which of the following are market-oriented environmental policy tools? (Select all that apply)", opts: ["Pollution charges (taxes per unit of pollution)", "Command-and-control emission limits", "Marketable permits (cap-and-trade)", "Well-defined property rights enabling private bargaining"], correct: [0, 2, 3], multi: true, exp: "Market-oriented tools: pollution charges, cap-and-trade, and property rights (Coase theorem). Command-and-control (direct regulation) is NOT market-oriented — it tells firms exactly what to do rather than using price signals." },
  { q: "Which of the following correctly describe negative externalities and how they cause market failure? (Select all that apply)", opts: ["The social cost exceeds the private cost", "The market produces too much output compared to the socially optimal level", "Externalities lead to underproduction", "Firms that don't pay social costs have an incentive to overproduce"], correct: [0, 1, 3], multi: true, exp: "Negative externality: social cost > private cost → overproduction. Firms ignore external costs, so they produce more than is socially optimal. Externalities lead to OVER-production (negative) or UNDER-production (positive) — not the same direction." },
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
      + '<p style="color:#475569;margin:2px 0">Chapter 12: Environmental Protection & Negative Externalities</p>'
      + '<p style="font-size:22px;font-weight:bold;background:#1e2d4a;color:white;display:inline-block;padding:4px 16px;border-radius:99px;margin:8px 0">' + score + ' / 10</p>'
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<h3 style="font-size:13px;margin:0 0 6px">Question Review</h3>' + items
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<p style="font-size:13px"><b>Exit Ticket:</b></p><p style="border:1px solid #ccc;padding:8px;border-radius:4px;font-size:13px;min-height:40px">' + (reflection || '') + '</p>'
      + '<p style="font-size:13px;margin-top:12px"><b>Student Name:</b></p><p style="border:1px solid #000;padding:8px;border-radius:4px;font-size:14px;font-weight:bold">' + studentName + '</p>'
      + '<p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:16px;padding-top:8px">ECO 211 · Chapter 12: Environmental Protection & Negative Externalities · Printed ' + new Date().toLocaleDateString() + ' · Access for free at https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction</p>'
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
          <div className="text-xs font-semibold text-foreground">ECO 211 ECONLAB · Chapter 12: Environmental Protection & Negative Externalities</div>
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
    { id: "externalities", label: "Externalities" },
    { id: "cmdcontrol", label: "Reg. Tools" },
    { id: "tradeoff", label: "Tradeoffs" },
    { id: "international", label: "Policy Match" },
    { id: "quiz", label: "Quiz" },
  ];
  const CONTENT_STATIONS: Station[] = ["recap","externalities","cmdcontrol","tradeoff","international"];
  const allDone = CONTENT_STATIONS.every(s => completed.has(s as Station));
  const stationOrder: Station[] = ["intro","recap","externalities","cmdcontrol","tradeoff","international","quiz","results","not-yet"];
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
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 12</div>
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
    { id: "recap",       label: "📚 Ch11 Recap",                    short: "Recap",       desc: "Review antitrust and regulation before market failures" },
    { id: "externalities",label: "🌊 Externality Classifier",       short: "Externalities",desc: "Classify 10 real-world examples as negative, positive, or no externality" },
    { id: "cmdcontrol",  label: "📋 Regulation Tools Explorer",     short: "Reg. Tools",  desc: "4-step walkthrough: C&C, pollution charges, cap-and-trade, Coase theorem" },
    { id: "tradeoff",    label: "⚖️ Costs, Benefits & the PPF",    short: "Tradeoffs",   desc: "5 questions on optimal pollution, marginal analysis, and the PPF tradeoff" },
    { id: "international",label: "🌍 Policy Tool Matcher",          short: "Policy Match",desc: "Match 3 real pollution scenarios to the best environmental policy tool" },
  ];

  const allStationsDone = STATIONS.every(s => completed.has(s.id));
  function markDone(id: string) { setCompleted(prev => new Set([...prev, id])); setStation("intro"); }
  function handlePass(score: number, results: { correct: boolean; exp: string }[]) { setQuizScore(score); setQuizResults(results); try { localStorage.setItem("econlab211_done_ch12", "true"); } catch (_) {} setStation("results"); }
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
              <p className="text-base font-semibold text-foreground">"When Markets Fail: The Price of Pollution"</p>
              <p className="text-sm text-muted-foreground mt-1">Markets are powerful but imperfect — externalities cause them to overproduce pollution and underprovide environmental protection. The question isn't whether to regulate, but how: rigid command-and-control rules, or flexible market-oriented tools that put a price on pollution?</p>
            </div>
            <button onClick={() => setShowSummary(true)} className="w-full text-left rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 transition flex items-center gap-2">
              <span>📄</span><span>Need a refresher? <span className="text-primary font-semibold underline">View the Chapter 12 summary.</span></span>
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
            {station === "recap"        && <RecapStation        onComplete={() => markDone("recap")}        />}
            {station === "externalities"&& <ExternalitiesStation onComplete={() => markDone("externalities")} />}
            {station === "cmdcontrol"   && <CmdControlStation   onComplete={() => markDone("cmdcontrol")}   />}
            {station === "tradeoff"     && <TradeoffStation      onComplete={() => markDone("tradeoff")}     />}
            {station === "international"&& <InternationalStation onComplete={() => markDone("international")} />}
          </div>
        )}

        {station === "quiz" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
  
              <h2 className="text-base font-bold text-foreground">🎯 Chapter 12 Quiz</h2>
            </div>
            <QuizStation
              onPass={(score, results) => { setQuizScore(score); setQuizResults(results); try { localStorage.setItem("econlab211_done_ch12", "true"); } catch (_) {} setStation("results"); }}
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
