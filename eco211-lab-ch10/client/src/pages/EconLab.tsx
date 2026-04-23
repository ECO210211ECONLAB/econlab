import { useState, useRef } from "react";
import { ChevronLeft, Award, RotateCcw } from "lucide-react";

type Station = "intro" | "recap" | "structures" | "moncomp" | "prisoner" | "oligopoly" | "quiz" | "results" | "not-yet";

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

// ─── Summary ───
const CH10_SUMMARY = [
  {
    heading: "10.1 — Monopolistic Competition",
    body: "Monopolistic competition refers to a market where many firms sell differentiated products. Differentiated products can arise from characteristics of the good or service, location from which the firm sells the product, intangible aspects of the product, and perceptions of the product. The perceived demand curve for a monopolistically competitive firm is downward-sloping, which shows that it is a price maker and chooses a combination of price and quantity. However, the perceived demand curve for a monopolistic competitor is more elastic than the perceived demand curve for a monopolist, because the monopolistic competitor has direct competition, unlike the pure monopolist. A profit-maximizing monopolistic competitor will seek out the quantity where marginal revenue is equal to marginal cost. If the firms in a monopolistically competitive industry are earning economic profits, the industry will attract entry until profits are driven down to zero in the long run. If the firms in a monopolistically competitive industry are suffering economic losses, then the industry will experience exit of firms until economic losses are driven up to zero in the long run. A monopolistically competitive firm is not productively efficient because it does not produce at the minimum of its average cost curve. A monopolistically competitive firm is not allocatively efficient because it does not produce where P = MC, but instead produces where P > MC. Monopolistically competitive industries do offer benefits to consumers in the form of greater variety and incentives for improved products and services.",
  },
  {
    heading: "10.2 — Oligopoly",
    body: "An oligopoly is a situation where a few firms sell most or all of the goods in a market. Oligopolists earn their highest profits if they can band together as a cartel and act like a monopolist by reducing output and raising price. Since each member of the oligopoly can benefit individually from expanding output, such collusion often breaks down — especially since explicit collusion is illegal. The prisoner's dilemma is an example of the application of game theory to analysis of oligopoly. It shows how, in certain situations, all sides can benefit from cooperative behavior rather than self-interested behavior. However, the challenge for the parties is to find ways to encourage cooperative behavior.",
  },
];

function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="summary-title">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 id="summary-title" className="text-lg font-bold text-foreground">📄 Chapter 10 Summary</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" aria-label="Close">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {CH10_SUMMARY.map((sec, i) => (
            <div key={i}>
              <h3 className="font-semibold text-primary mb-1">{sec.heading}</h3>
              <p className="text-sm text-foreground leading-relaxed">{sec.body}</p>
            </div>
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

// ─── Station 1: Ch9 Recap ───
const RECAP_QS = [
  { q: "A monopolist's Marginal Revenue (MR) is:", opts: ["Equal to price", "Greater than price", "Less than price", "Equal to zero at all quantities"], correct: 2, exp: "For a monopolist, selling one more unit requires lowering the price on ALL units — so MR < Price always." },
  { q: "A monopolist maximizes profit by producing where:", opts: ["Price = Average Cost", "MR = MC, then charging the demand-curve price", "Total Revenue is maximized", "Price = Marginal Cost"], correct: 1, exp: "MR = MC identifies the profit-maximizing quantity; the price is then read from the demand curve at that quantity — always higher than MR." },
  { q: "Compared to a perfectly competitive market, a monopolist produces:", opts: ["More output at a lower price", "Less output at a higher price", "The same output at a higher price", "Less output at the same price"], correct: 1, exp: "Monopolists restrict output below the competitive level and charge a higher price, creating deadweight loss." },
  { q: "A natural monopoly is best regulated using:", opts: ["P = MC (allocatively efficient but requires subsidy)", "P = AC (financially viable, no subsidy needed)", "No regulation at all", "Breaking the firm into many small competitors"], correct: 1, exp: "P = AC regulation is most practical: the firm covers its costs without a government subsidy while keeping prices below unregulated monopoly levels." },
  { q: "Which barrier to entry arises when one firm can supply the entire market at lower cost than multiple firms due to economies of scale?", opts: ["Patent protection", "Resource control", "Natural monopoly", "Predatory pricing"], correct: 2, exp: "Natural monopoly: economies of scale are so large that a single firm is more efficient than any combination of smaller firms." },
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


type Structure = "perfect" | "monopoly" | "oligopoly" | "moncomp";

const ALL_STRUCTURES: Structure[] = ["perfect", "monopoly", "oligopoly", "moncomp"];

const STRUCT_LABELS: Record<Structure, string> = {
  perfect:  "Perfect Competition",
  monopoly: "Monopoly",
  oligopoly:"Oligopoly",
  moncomp:  "Monopolistic Competition",
};

const STRUCT_COLORS: Record<Structure, string> = {
  perfect:  "bg-blue-100 text-blue-800 border-blue-300",
  monopoly: "bg-red-100 text-red-800 border-red-300",
  oligopoly:"bg-amber-100 text-amber-800 border-amber-300",
  moncomp:  "bg-purple-100 text-purple-800 border-purple-300",
};

const STRUCT_EXAMPLES: { name: string; correct: Structure; exp: string }[] = [
  { name: "Wheat farming in Kansas",          correct: "perfect",   exp: "Thousands of identical farmers, all price-takers — the textbook example of perfect competition." },
  { name: "Local tap water utility",          correct: "monopoly",  exp: "Natural monopoly — high fixed infrastructure costs make one provider most efficient." },
  { name: "U.S. commercial airlines",         correct: "oligopoly", exp: "A few dominant carriers (Delta, United, Southwest) with high barriers to entry." },
  { name: "Coffee shops (e.g. Starbucks vs. local cafés)", correct: "moncomp", exp: "Many sellers with differentiated products (ambiance, menu, location) and easy entry." },
  { name: "Smartphone manufacturing",         correct: "oligopoly", exp: "Dominated by Apple and Samsung — high R&D costs and brand loyalty create barriers." },
  { name: "Foreign currency exchange",        correct: "perfect",   exp: "Millions of buyers/sellers, homogeneous product, price-taking behavior." },
  { name: "Cable/internet provider in a city",correct: "monopoly",  exp: "Often a single provider per area — high infrastructure costs create a natural monopoly." },
  { name: "Fast food restaurants",            correct: "moncomp",   exp: "Many firms (McDonald's, Burger King, Wendy's) with differentiated menus and easy entry." },
  { name: "Major commercial banks (top 5)",   correct: "oligopoly", exp: "A few large banks (JPMorgan, BofA, Wells Fargo) dominate with significant market power." },
  { name: "Hair salons in a city",            correct: "moncomp",   exp: "Many stylists with differentiated services (location, style, reputation) and low entry barriers." },
  { name: "Stock exchange (NYSE)",            correct: "perfect",   exp: "Identical shares, many buyers/sellers, transparent pricing — approaches perfect competition." },
  { name: "OPEC oil cartel members",          correct: "oligopoly", exp: "A few dominant producers that coordinate output — a textbook oligopoly/cartel example." },
];

function StructuresStation({ onComplete }: { onComplete: () => void }) {
  const [choices, setChoices] = useState<Record<string, Structure | null>>(() => Object.fromEntries(STRUCT_EXAMPLES.map(e => [e.name, null])));
  const [checked, setChecked] = useState(false);
  const [marked, setMarked] = useState(false);
  const allChosen = STRUCT_EXAMPLES.every(e => choices[e.name] !== null);
  const score = STRUCT_EXAMPLES.filter(e => choices[e.name] === e.correct).length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm font-semibold text-primary mb-1">The Four Market Structures</p>
        <p className="text-sm text-muted-foreground">For each example, identify which market structure it best represents. Then check your answers.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_STRUCTURES.map(s => <span key={s} className={`px-2 py-1 rounded-full text-xs font-semibold border-2 ${STRUCT_COLORS[s]}`}>{STRUCT_LABELS[s]}</span>)}
      </div>
      <div className="space-y-3">
        {STRUCT_EXAMPLES.map(ex => {
          const chosen = choices[ex.name];
          const isCorrect = checked && chosen === ex.correct;
          const isWrong = checked && chosen !== null && chosen !== ex.correct;
          return (
            <div key={ex.name} className={`rounded-xl border-2 p-4 transition-all ${checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-300 bg-red-50" : "border-border") : "border-border bg-card"}`}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-foreground">{ex.name}</span>
                {checked && isWrong && <span className="text-xs text-red-600 font-semibold">→ {STRUCT_LABELS[ex.correct]}</span>}
                {checked && isCorrect && <span className="text-xs text-green-700 font-semibold">✓ Correct</span>}
              </div>
              <div className="flex flex-wrap gap-1">
                {ALL_STRUCTURES.map(s => {
                  const sel = chosen === s;
                  let cls = sel ? STRUCT_COLORS[s] + " border-current" : "border-border text-muted-foreground hover:border-primary/40";
                  if (checked && s === ex.correct) cls = STRUCT_COLORS[s] + " border-current";
                  else if (checked && sel && s !== ex.correct) cls = "border-red-400 bg-red-100 text-red-700";
                  return (
                    <button key={s} onClick={() => { if (!checked) setChoices(prev => ({ ...prev, [ex.name]: s })); }}
                      disabled={checked} aria-pressed={sel}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                      {STRUCT_LABELS[s]}
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
              <p className="font-bold text-lg">{score} / {STRUCT_EXAMPLES.length}</p>
              <p className="text-sm text-muted-foreground">{score >= 10 ? "Excellent — you know your market structures!" : score >= 8 ? "Good — review the explanations for any misses." : "Study the explanations — these distinctions are fundamental."}</p>
            </div>
            {!marked && <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>}
            {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
          </div>
      }
    </div>
  );
}

// ─── Station 3: Monopolistic Competition Explorer ───
const MC_STEPS = [
  {
    title: "What Makes It Monopolistic Competition?",
    content: "Monopolistic competition combines features of both competition AND monopoly:\n• Many sellers (like perfect competition)\n• Differentiated products — each firm's product is slightly different (like monopoly)\n• Easy entry and exit (like perfect competition)\n• Some pricing power — each firm faces a downward-sloping demand curve (like monopoly)\n\nExamples: restaurants, hair salons, clothing brands, gas stations.",
    question: "Which characteristic MOST distinguishes monopolistic competition from perfect competition?",
    opts: ["Many sellers", "Product differentiation — each firm's product is slightly different", "Easy entry and exit", "Price-taking behavior"],
    correct: 1,
    exp: "Product differentiation is the defining feature. Each firm has a slightly unique product, giving it some pricing power and a downward-sloping demand curve — unlike the horizontal demand curve of a perfect competitor.",
  },
  {
    title: "Short Run: Profit or Loss",
    content: "In the short run, a monopolistically competitive firm behaves like a monopolist:\n• Faces a downward-sloping demand curve\n• Sets MR = MC to maximize profit\n• Charges the price on its demand curve\n• Can earn positive profit, zero profit, or suffer losses\n\nBUT unlike a monopolist, there are many close substitutes — so the demand curve is much more elastic (flatter).",
    question: "In the short run, a monopolistically competitive firm that is earning economic profit expects:",
    opts: ["New firms to exit, raising its profits further", "New firms to enter the market, attracted by the profit signal", "Government to regulate its price", "Nothing — short-run profits are permanent"],
    correct: 1,
    exp: "Profit is a signal. Easy entry means new firms can enter, increasing the number of substitutes and reducing each existing firm's demand until profits are competed away.",
  },
  {
    title: "Long Run: Zero Profit Equilibrium",
    content: "Because entry is easy, economic profits attract new firms. New entrants:\n• Offer more variety (more substitutes)\n• Steal customers from existing firms\n• Shift each firm's demand curve LEFT and make it MORE elastic\n\nThis continues until: P = AC and Economic Profit = $0\n\nNote: unlike perfect competition, at long-run equilibrium P > MC and firms don't produce at minimum AC — some productive and allocative inefficiency remains.",
    question: "In long-run equilibrium, a monopolistically competitive firm earns:",
    opts: ["Maximum economic profit (like a monopolist)", "Zero economic profit (like perfect competition in the long run)", "A government-regulated profit", "Negative economic profit permanently"],
    correct: 1,
    exp: "Free entry competes away profits just like in perfect competition — but the equilibrium differs because firms produce with excess capacity and P > MC (some inefficiency remains).",
  },
  {
    title: "The Trade-Off: Variety vs. Efficiency",
    content: "Monopolistic competition is inefficient compared to perfect competition:\n✗ Not productively efficient (doesn't produce at minimum AC — excess capacity)\n✗ Not allocatively efficient (P > MC)\n\nBut it offers real consumer benefits:\n✓ Greater product variety\n✓ Incentives for product improvement and innovation\n✓ Firms compete on quality, not just price\n\nThis trade-off — efficiency vs. variety — is an ongoing debate in economics.",
    question: "Which of the following is a BENEFIT of monopolistic competition that partially offsets its inefficiency?",
    opts: ["Lower prices than perfect competition", "Greater product variety and innovation incentives", "Firms earn zero profit, like perfect competition", "Allocative efficiency (P = MC)"],
    correct: 1,
    exp: "Monopolistic competition generates greater product variety and stronger innovation incentives than perfect competition. Consumers value having choices — this variety is the 'payment' for the slight inefficiency.",
  },
];

function MonCompStation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState(false);
  const cur = MC_STEPS[step];
  const stepAns = answers[step] ?? null;
  const allDone = MC_STEPS.every((_, i) => feedback[i] !== undefined);

  function check() {
    if (stepAns === null) return;
    const correct = stepAns === cur.correct;
    setFeedback(prev => ({ ...prev, [step]: correct ? `✓ Correct! ${cur.exp}` : `Not quite. ${cur.exp}` }));
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {MC_STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition ${i === step ? "border-primary bg-primary text-primary-foreground" : feedback[i] ? "border-green-400 bg-green-50 text-green-700" : "border-border text-muted-foreground"}`}>
            {feedback[i] ? "✓ " : ""}{s.title.split(":")[0]}
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
              <button key={oi} onClick={() => { if (!feedback[step]) setAnswers(prev => ({ ...prev, [step]: oi })); }}
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
        : step < MC_STEPS.length - 1
          ? <button onClick={() => setStep(step + 1)} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next Step →</button>
          : allDone && !marked
            ? <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
            : marked ? <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p> : null
      }
    </div>
  );
}

// ─── Station 4: Prisoner's Dilemma ───
type PDChoice = "cooperate" | "defect" | null;
const PAYOFF: Record<string, Record<string, { you: number; them: number }>> = {
  cooperate: { cooperate: { you: 3, them: 3 }, defect: { you: 0, them: 5 } },
  defect: { cooperate: { you: 5, them: 0 }, defect: { you: 1, them: 1 } },
};

function PrisonerStation({ onComplete }: { onComplete: () => void }) {
  const [round, setRound] = useState(1);
  const [yourChoice, setYourChoice] = useState<PDChoice>(null);
  const [result, setResult] = useState<{ you: number; them: number; theirChoice: string } | null>(null);
  const [totalYou, setTotalYou] = useState(0);
  const [totalThem, setTotalThem] = useState(0);
  const [history, setHistory] = useState<{ round: number; you: string; them: string; youPts: number; themPts: number }[]>([]);
  const [phase, setPhase] = useState<"play" | "reflect">("play");
  const [reflectAns, setReflectAns] = useState<number | null>(null);
  const [reflectChecked, setReflectChecked] = useState(false);
  const [marked, setMarked] = useState(false);
  const MAX_ROUNDS = 5;

  // Computer always defects (dominant strategy) unless round>3 it cooperates to show cooperation benefits
  function getTheirChoice(r: number): "cooperate" | "defect" {
    // Defect first 3 rounds, then cooperate to illustrate both outcomes
    return r <= 3 ? "defect" : "cooperate";
  }

  function submit() {
    if (!yourChoice) return;
    const theirChoice = getTheirChoice(round);
    const payoff = PAYOFF[yourChoice][theirChoice];
    setResult({ you: payoff.you, them: payoff.them, theirChoice });
    setTotalYou(t => t + payoff.you);
    setTotalThem(t => t + payoff.them);
    setHistory(h => [...h, { round, you: yourChoice, them: theirChoice, youPts: payoff.you, themPts: payoff.them }]);
  }

  function nextRound() {
    if (round >= MAX_ROUNDS) { setPhase("reflect"); return; }
    setRound(r => r + 1);
    setYourChoice(null);
    setResult(null);
  }

  const REFLECT_Q = "Based on the game, why do oligopolists often fail to maintain a cartel agreement even when it benefits all members?";
  const REFLECT_OPTS = [
    "Because governments always break up cartels immediately",
    "Each firm has an individual incentive to cheat (defect) for higher profits, even though mutual cooperation would give everyone a better outcome",
    "Because cartel members always cooperate when profits are high",
    "Because cartels are only possible in perfectly competitive markets",
  ];
  const REFLECT_CORRECT = 1;

  if (phase === "reflect") {
    return (
      <div className="space-y-5">
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
          <p className="font-semibold text-primary mb-2">Game Over — Your Results</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 text-center border border-border">
              <p className="text-xs text-muted-foreground">Your Total</p>
              <p className="text-2xl font-bold text-primary">{totalYou} pts</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border border-border">
              <p className="text-xs text-muted-foreground">Rival's Total</p>
              <p className="text-2xl font-bold text-muted-foreground">{totalThem} pts</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-primary text-primary-foreground"><th className="px-3 py-2">Round</th><th className="px-3 py-2">You</th><th className="px-3 py-2">Rival</th><th className="px-3 py-2">Your Pts</th><th className="px-3 py-2">Rival Pts</th></tr></thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                  <td className="px-3 py-1.5 text-center">{h.round}</td>
                  <td className={`px-3 py-1.5 text-center font-semibold ${h.you === "cooperate" ? "text-green-700" : "text-red-600"}`}>{h.you}</td>
                  <td className={`px-3 py-1.5 text-center font-semibold ${h.them === "cooperate" ? "text-green-700" : "text-red-600"}`}>{h.them}</td>
                  <td className="px-3 py-1.5 text-center">{h.youPts}</td>
                  <td className="px-3 py-1.5 text-center">{h.themPts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl bg-muted p-4 text-sm text-foreground space-y-1">
          <p className="font-semibold">Key Insight:</p>
          <p className="text-muted-foreground">The payoff matrix shows why cartels are unstable. Each firm's best individual move is always to defect (undercut or overproduce) — even when mutual cooperation would give everyone more. This is exactly why oligopoly collusion breaks down, and why it must be illegal to even attempt it.</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">{REFLECT_Q}</p>
          <div className="space-y-2">
            {REFLECT_OPTS.map((opt, oi) => {
              const sel = reflectAns === oi;
              let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
              if (reflectChecked) {
                if (oi === REFLECT_CORRECT) cls = "border-green-500 bg-green-100 text-green-800 font-semibold";
                else if (sel) cls = "border-red-400 bg-red-100 text-red-700";
              }
              return (
                <button key={oi} onClick={() => { if (!reflectChecked) setReflectAns(oi); }}
                  disabled={reflectChecked} aria-pressed={sel}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                  {reflectChecked && oi === REFLECT_CORRECT && "✓ "}{opt}
                </button>
              );
            })}
          </div>
        </div>
        {!reflectChecked
          ? <button onClick={() => { if (reflectAns !== null) setReflectChecked(true); }} disabled={reflectAns === null}
              className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Check Answer</button>
          : !marked
            ? <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
            : <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>
        }
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="font-semibold text-primary mb-1">🎮 The Oligopoly Pricing Game</p>
        <p className="text-sm text-muted-foreground">You and a rival firm both produce widgets. Each round you can cooperate (keep price high) or defect (undercut/overproduce). You don't know what your rival will choose.</p>
      </div>
      {/* Payoff table */}
      <div className="rounded-xl bg-card border border-border p-3">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Payoff Matrix (points per round)</p>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr><th className="p-2"></th><th className="p-2 text-center text-green-700">Rival: Cooperate</th><th className="p-2 text-center text-red-600">Rival: Defect</th></tr>
          </thead>
          <tbody>
            <tr className="bg-green-50">
              <td className="p-2 font-semibold text-green-700">You: Cooperate</td>
              <td className="p-2 text-center"><span className="font-bold text-green-700">You: 3</span> / Rival: 3</td>
              <td className="p-2 text-center"><span className="font-bold text-red-600">You: 0</span> / Rival: 5</td>
            </tr>
            <tr className="bg-red-50">
              <td className="p-2 font-semibold text-red-600">You: Defect</td>
              <td className="p-2 text-center"><span className="font-bold text-green-700">You: 5</span> / Rival: 0</td>
              <td className="p-2 text-center"><span className="font-bold text-red-600">You: 1</span> / Rival: 1</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Round {round} of {MAX_ROUNDS}</span>
        <span className="text-sm text-muted-foreground">Score: You {totalYou} | Rival {totalThem}</span>
      </div>
      {!result ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">What's your move?</p>
          <button onClick={() => setYourChoice("cooperate")}
            className={`w-full py-4 rounded-xl border-2 font-bold text-sm transition ${yourChoice === "cooperate" ? "border-green-500 bg-green-100 text-green-800" : "border-border bg-card hover:border-green-400"}`}>
            🤝 Cooperate — Keep price high (hope rival does too)
          </button>
          <button onClick={() => setYourChoice("defect")}
            className={`w-full py-4 rounded-xl border-2 font-bold text-sm transition ${yourChoice === "defect" ? "border-red-400 bg-red-100 text-red-700" : "border-border bg-card hover:border-red-400"}`}>
            ⚡ Defect — Undercut rival for higher individual profit
          </button>
          <button onClick={submit} disabled={!yourChoice}
            className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">
            Lock In My Choice →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className={`rounded-xl p-4 border-2 ${result.you > result.them ? "border-green-400 bg-green-50" : result.you === result.them ? "border-blue-400 bg-blue-50" : "border-red-400 bg-red-50"}`}>
            <p className="font-bold text-foreground mb-1">Round {round} Result</p>
            <p className="text-sm">You chose: <strong className={yourChoice === "cooperate" ? "text-green-700" : "text-red-600"}>{yourChoice}</strong> | Rival chose: <strong className={result.theirChoice === "cooperate" ? "text-green-700" : "text-red-600"}>{result.theirChoice}</strong></p>
            <p className="text-sm mt-1">You earned <strong className="text-lg">{result.you} pts</strong> | Rival earned {result.them} pts</p>
            {yourChoice === "cooperate" && result.theirChoice === "defect" && <p className="text-xs text-red-600 mt-1 italic">You cooperated but got exploited. This is why agreements are hard to maintain.</p>}
            {yourChoice === "defect" && result.theirChoice === "cooperate" && <p className="text-xs text-green-700 mt-1 italic">You defected and gained the maximum — but what happens when your rival retaliates next round?</p>}
            {yourChoice === "cooperate" && result.theirChoice === "cooperate" && <p className="text-xs text-green-700 mt-1 italic">Mutual cooperation! Both firms benefit — but can you trust this will continue?</p>}
            {yourChoice === "defect" && result.theirChoice === "defect" && <p className="text-xs text-amber-700 mt-1 italic">Mutual defection — both firms earn less than if they had cooperated. The classic prisoner's dilemma outcome.</p>}
          </div>
          <button onClick={nextRound} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">
            {round >= MAX_ROUNDS ? "See Results →" : "Next Round →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Station 5: Oligopoly & Cartel Simulator ───
const CARTEL_STEPS = [
  {
    title: "What Is an Oligopoly?",
    content: "An oligopoly is a market dominated by a few large firms. Key features:\n• Few sellers (can be 2-10 dominant firms)\n• Products may be identical or differentiated\n• High barriers to entry\n• Interdependence — each firm's decisions affect rivals\n\nExamples: U.S. wireless carriers, commercial aircraft, oil-producing nations (OPEC), major airlines.",
    question: "What makes oligopoly fundamentally different from the other market structures?",
    opts: ["Firms are price takers", "Firm decisions are interdependent — each firm must consider rivals' reactions", "Products are always identical", "There are no barriers to entry"],
    correct: 1,
    exp: "Interdependence is the defining feature of oligopoly. When Boeing decides pricing, it must consider Airbus's response. When one airline raises fares, it watches whether rivals match. No other market structure has this strategic dimension.",
  },
  {
    title: "The Cartel Temptation",
    content: "If oligopolists could cooperate perfectly, they'd act like a monopolist:\n• Collectively restrict output below competitive level\n• Raise price above competitive level\n• Split the monopoly profit among members\n\nThis is a cartel — and it's ILLEGAL in the U.S. and most countries. The Department of Justice actively prosecutes cartels.\n\nReal example: The Lysine Cartel (ADM and others) — fixed prices on livestock feed additive. Executives went to prison.",
    question: "Why would rational oligopolists want to form a cartel?",
    opts: ["To be more productively efficient", "To earn higher combined profits by acting like a monopolist", "To comply with government regulation", "To eliminate all barriers to entry"],
    correct: 1,
    exp: "A cartel lets oligopolists collectively earn monopoly-level profits — more than they'd earn competing against each other. The temptation is powerful, which is why antitrust law must make it illegal.",
  },
  {
    title: "Why Cartels Break Down",
    content: "Even when a cartel forms, it tends to break down because:\n• Each member can secretly cheat — produce more than the agreed quota\n• A cheating member earns more profit (undercuts the cartel price)\n• When others notice, they retaliate by also expanding output\n• The cartel collapses back toward competitive prices\n\nThis is exactly the prisoner's dilemma you just played: the dominant strategy for each individual firm is to defect — even though everyone is worse off when all defect.",
    question: "A cartel member secretly produces more than its agreed quota. This is called:",
    opts: ["Predatory pricing", "Cheating on the cartel agreement — the dominant strategy that breaks cartels down", "Allocative efficiency", "Regulatory capture"],
    correct: 1,
    exp: "Cartel cheating is the dominant strategy for each individual member. The higher output lowers the cartel price, but the cheating firm gains market share. When all members cheat, the cartel collapses — exactly the prisoner's dilemma outcome.",
  },
  {
    title: "Oligopoly vs. Competition — The Spectrum",
    content: "Oligopoly outcomes depend on how firms behave:\n\n🏆 Full Collusion (cartel): Output and price like monopoly. Maximum joint profit. Illegal, unstable.\n\n⚖️ Cournot Competition: Firms independently choose quantities. Output and price between monopoly and perfect competition.\n\n🔵 Perfect Competition Outcome: If enough rivals enter or collusion fully breaks down, prices approach competitive levels.\n\nAntitrust policy tries to push markets toward the competitive end of this spectrum.",
    question: "As collusion breaks down in an oligopoly, prices tend to move toward:",
    opts: ["Monopoly price (higher)", "Competitive price (lower)", "Zero", "The cartel-agreed price"],
    correct: 1,
    exp: "When cartel cooperation breaks down and firms compete independently, they expand output and prices fall toward competitive levels — closer to what perfect competition would produce.",
  },
];

function OligopolyStation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState(false);
  const cur = CARTEL_STEPS[step];
  const stepAns = answers[step] ?? null;
  const allDone = CARTEL_STEPS.every((_, i) => feedback[i] !== undefined);

  function check() {
    if (stepAns === null) return;
    const correct = stepAns === cur.correct;
    setFeedback(prev => ({ ...prev, [step]: correct ? `✓ Correct! ${cur.exp}` : `Not quite. ${cur.exp}` }));
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {CARTEL_STEPS.map((s, i) => (
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
              <button key={oi} onClick={() => { if (!feedback[step]) setAnswers(prev => ({ ...prev, [step]: oi })); }}
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
        : step < CARTEL_STEPS.length - 1
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
  { q: "Which market structure is characterized by MANY sellers of DIFFERENTIATED products with EASY entry and exit?", opts: ["Perfect competition", "Monopolistic competition", "Oligopoly", "Monopoly"], correct: 1, multi: false, exp: "Monopolistic competition: many sellers + product differentiation + easy entry/exit. The key word is 'differentiated' — that's what separates it from perfect competition." },
  { q: "In a monopolistically competitive market, what happens in the long run if firms are earning positive economic profit?", opts: ["Existing firms increase output to maximize profit", "New firms enter, increasing competition and driving profits toward zero", "The government intervenes to regulate prices", "Firms exit until only the most efficient remain"], correct: 1, multi: false, exp: "Easy entry attracts new firms when profit is positive. New entrants steal market share, shifting each firm's demand left until economic profit = 0." },
  { q: "A monopolistically competitive firm is NOT allocatively efficient because:", opts: ["It produces at minimum Average Cost", "It produces where P = MC", "It produces where P > MC — consumers value additional output more than it costs to produce", "It earns zero economic profit in the long run"], correct: 2, multi: false, exp: "Allocative efficiency requires P = MC. A monopolistic competitor charges P > MC — the same inefficiency as a monopolist, but smaller in degree." },
  { q: "Which of the following is a BENEFIT of monopolistic competition compared to perfect competition?", opts: ["Lower prices and more output", "Greater product variety and stronger incentives for product improvement", "Productive efficiency (firms produce at minimum AC)", "Allocative efficiency (P = MC)"], correct: 1, multi: false, exp: "Monopolistic competition generates more variety and innovation incentives. This is the consumer benefit that partially offsets the efficiency losses." },
  { q: "An oligopoly is best defined as:", opts: ["A market with one seller and no close substitutes", "A market with many sellers of identical products", "A market dominated by a few large firms with significant barriers to entry", "A market with many sellers of differentiated products"], correct: 2, multi: false, exp: "Oligopoly: few dominant firms + high barriers to entry. The key feature is that each firm's decisions are interdependent — actions of one affect the others." },
  { q: "The prisoner's dilemma illustrates why oligopoly collusion is unstable because:", opts: ["Government always breaks up cartels before they form", "Each firm has an individual incentive to defect and undercut the agreement, even though mutual cooperation would benefit all", "Firms always prefer competitive outcomes", "Collusion is only possible when products are identical"], correct: 1, multi: false, exp: "Defecting is the dominant strategy for each individual firm — even when all would be better off cooperating. This is why cartel agreements tend to collapse from within." },
  { q: "Explicit price-fixing collusion among competing firms is:", opts: ["Legal when it benefits consumers", "Legal if the firms are small", "Illegal under U.S. antitrust law", "Legal only in oligopoly markets"], correct: 2, multi: false, exp: "Explicit collusion (cartels, price-fixing) is illegal under the Sherman Antitrust Act. The DOJ actively investigates and prosecutes firms that engage in price-fixing." },
  { q: "When an oligopoly cartel breaks down, prices tend to move:", opts: ["Higher — toward monopoly price", "Lower — toward competitive price", "To zero — firms give away products", "To the cartel's agreed price"], correct: 1, multi: false, exp: "When collusion breaks down and firms compete independently, they expand output and prices fall toward the competitive level — exactly what antitrust policy aims to achieve." },
  { q: "Which of the following correctly describe monopolistic competition? (Select all that apply)", opts: ["Many sellers", "Differentiated products", "Identical products (homogeneous)", "Easy entry and exit"], correct: [0, 1, 3], multi: true, exp: "Monopolistic competition has: many sellers, differentiated products, and easy entry/exit. Identical (homogeneous) products describe perfect competition, not monopolistic competition." },
  { q: "Which of the following are features of an oligopoly? (Select all that apply)", opts: ["Few dominant firms", "High barriers to entry", "Firm decisions are interdependent", "Free and easy entry for all firms"], correct: [0, 1, 2], multi: true, exp: "Oligopoly = few dominant firms + high barriers to entry + strategic interdependence. Easy entry would undermine the concentrated market structure that defines oligopoly." },
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
      + '<p style="color:#475569;margin:2px 0">Chapter 10: Monopolistic Competition & Oligopoly</p>'
      + '<p style="font-size:22px;font-weight:bold;background:#1e2d4a;color:white;display:inline-block;padding:4px 16px;border-radius:99px;margin:8px 0">' + score + ' / 10</p>'
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<h3 style="font-size:13px;margin:0 0 6px">Question Review</h3>' + items
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<p style="font-size:13px"><b>Exit Ticket:</b></p><p style="border:1px solid #ccc;padding:8px;border-radius:4px;font-size:13px;min-height:40px">' + (reflection || '') + '</p>'
      + '<p style="font-size:13px;margin-top:12px"><b>Student Name:</b></p><p style="border:1px solid #000;padding:8px;border-radius:4px;font-size:14px;font-weight:bold">' + studentName + '</p>'
      + '<p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:16px;padding-top:8px">ECO 211 · Chapter 10: Monopolistic Competition & Oligopoly · Printed ' + new Date().toLocaleDateString() + ' · Access for free at https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction</p>'
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
          <div className="text-xs font-semibold text-foreground">ECO 211 ECONLAB · Chapter 10: Monopolistic Competition & Oligopoly</div>
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
    { id: "structures", label: "Structures" },
    { id: "moncomp", label: "Mon. Comp." },
    { id: "prisoner", label: "PD Game" },
    { id: "oligopoly", label: "Oligopoly" },
    { id: "quiz", label: "Quiz" },
  ];
  const CONTENT_STATIONS: Station[] = ["recap","structures","moncomp","prisoner","oligopoly"];
  const allDone = CONTENT_STATIONS.every(s => completed.has(s as Station));
  const stationOrder: Station[] = ["intro","recap","structures","moncomp","prisoner","oligopoly","quiz","results","not-yet"];
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
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 10</div>
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
    { id: "recap",      label: "📚 Ch9 Recap",                    short: "Recap",       desc: "Review monopoly concepts before exploring the middle ground" },
    { id: "structures", label: "🗂️ 4 Market Structures Sorter",   short: "Structures",  desc: "Classify 12 real markets across all 4 market structure types" },
    { id: "moncomp",    label: "☕ Monopolistic Competition",      short: "Mon. Comp.",  desc: "4-step guided tour: differentiation, short run, long run, trade-offs" },
    { id: "prisoner",   label: "🎮 Prisoner's Dilemma Game",       short: "PD Game",     desc: "Play 5 rounds of the oligopoly pricing game — then reflect" },
    { id: "oligopoly",  label: "🏭 Oligopoly & Cartel Simulator",  short: "Oligopoly",   desc: "Understand cartel formation, temptation to cheat, and collapse" },
  ];

  const allStationsDone = STATIONS.every(s => completed.has(s.id));
  function markDone(id: string) { setCompleted(prev => new Set([...prev, id])); setStation("intro"); }
  function handlePass(score: number, results: { correct: boolean; exp: string }[]) { setQuizScore(score); setQuizResults(results); try { localStorage.setItem("econlab211_done_ch10", "true"); } catch (_) {} setStation("results"); }
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
              <p className="text-base font-semibold text-foreground">"The Middle Ground"</p>
              <p className="text-sm text-muted-foreground mt-1">Most real markets fall between the extremes of perfect competition and monopoly. Monopolistic competition brings variety through product differentiation; oligopoly brings strategic interdependence and the ever-present temptation to collude.</p>
            </div>
            <button onClick={() => setShowSummary(true)} className="w-full text-left rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 transition flex items-center gap-2">
              <span>📄</span><span>Need a refresher? <span className="text-primary font-semibold underline">View the Chapter 10 summary.</span></span>
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
            {station === "structures" && <StructuresStation onComplete={() => markDone("structures")} />}
            {station === "moncomp"    && <MonCompStation    onComplete={() => markDone("moncomp")}    />}
            {station === "prisoner"   && <PrisonerStation   onComplete={() => markDone("prisoner")}   />}
            {station === "oligopoly"  && <OligopolyStation  onComplete={() => markDone("oligopoly")}  />}
          </div>
        )}

        {station === "quiz" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
  
              <h2 className="text-base font-bold text-foreground">🎯 Chapter 10 Quiz</h2>
            </div>
            <QuizStation
              onPass={(score, results) => { setQuizScore(score); setQuizResults(results); try { localStorage.setItem("econlab211_done_ch10", "true"); } catch (_) {} setStation("results"); }}
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
