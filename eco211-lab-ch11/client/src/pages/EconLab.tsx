import { useState, useRef } from "react";
import { ChevronLeft, Award, RotateCcw } from "lucide-react";

type Station = "intro" | "recap" | "hhi" | "merger" | "anticomp" | "natmonreg" | "deregulation" | "quiz" | "results" | "not-yet";

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
const CH11_SUMMARY = [
  { heading: "11.1 — Corporate Mergers", body: "A corporate merger involves two private firms joining together. An acquisition refers to one firm buying another firm. In either case, two formerly independent firms become one firm. Antitrust laws seek to ensure active competition in markets, sometimes by preventing large firms from forming through mergers and acquisitions, sometimes by regulating business practices that might restrict competition, and sometimes by breaking up large firms into smaller competitors. A four-firm concentration ratio is one way of measuring the extent of competition in a market. We calculate it by adding the market shares of the four largest firms in the market. A Herfindahl-Hirschman Index (HHI) is another way of measuring the extent of competition in a market. We calculate it by taking the market shares of all firms in the market, squaring them, and then summing the total. The forces of globalization and new communications and information technology have increased the level of competition that many firms face." },
  { heading: "11.2 — Regulating Anticompetitive Behavior", body: "Antitrust authorities block firms from openly colluding to form a cartel that will reduce output and raise prices. Companies sometimes attempt to find other ways around these restrictions and, consequently, many antitrust cases involve restrictive practices that can reduce competition in certain circumstances, like tie-in sales, bundling, and predatory pricing." },
  { heading: "11.3 — Regulating Natural Monopolies", body: "In the case of a natural monopoly, market competition will not work well and so, rather than allowing an unregulated monopoly to raise price and reduce output, the government may wish to regulate price and/or output. Common examples of regulation are public utilities, the regulated firms that often provide electricity and water service. Cost-plus regulation refers to government regulating a firm which sets the price that a firm can charge over a period of time by looking at the firm's accounting costs and then adding a normal rate of profit. Price cap regulation refers to government regulation of a firm where the government sets a price level several years in advance. In this case, the firm can either earn high profits if it manages to produce at lower costs or sell a higher quantity than expected or suffer low profits or losses if costs are high or it sells less than expected." },
  { heading: "11.4 — The Great Deregulation Experiment", body: "The U.S. economy experienced a wave of deregulation in the late 1970s and early 1980s, when the government eliminated a number of regulations that had set prices and quantities produced in a number of industries. Major accounting scandals in the early 2000s and, more recently, the Great Recession have spurred new regulation to prevent similar occurrences in the future. Regulatory capture occurs when the regulated industries end up having a strong influence over what regulations exist." },
];

function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="summary-title">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 id="summary-title" className="text-lg font-bold text-foreground">📄 Chapter 11 Summary</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" aria-label="Close">&times;</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {CH11_SUMMARY.map((sec, i) => (
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

// ─── Station 1: Ch10 Recap ───
const RECAP_QS = [
  { q: "Which market structure has MANY sellers of DIFFERENTIATED products with EASY entry and exit?", opts: ["Perfect competition", "Monopolistic competition", "Oligopoly", "Monopoly"], correct: 1, exp: "Monopolistic competition: many sellers + differentiated products + easy entry. Product differentiation is the key feature separating it from perfect competition." },
  { q: "In the long run, a monopolistically competitive firm earns:", opts: ["Maximum economic profit", "Zero economic profit", "A government-regulated profit", "Losses due to excess capacity"], correct: 1, exp: "Easy entry competes away profits. In long-run equilibrium, P = AC and economic profit = 0 — just like perfect competition, but with P > MC still (some inefficiency remains)." },
  { q: "An oligopoly is BEST defined as:", opts: ["Many sellers of identical products", "A single seller with no close substitutes", "A few dominant firms with high barriers to entry and interdependent decisions", "Many sellers of differentiated products"], correct: 2, exp: "Oligopoly = few dominant firms + high barriers + strategic interdependence. Each firm must consider rivals' reactions when making decisions." },
  { q: "The prisoner's dilemma explains why cartel agreements tend to break down because:", opts: ["Governments always break up cartels immediately", "Each firm has an individual incentive to defect/cheat even when mutual cooperation benefits all", "Firms prefer competitive outcomes", "Cartels only work in perfectly competitive markets"], correct: 1, exp: "Defecting is the dominant strategy for each individual firm. Even though all would benefit from cooperation, the temptation to cheat is too strong — cartels collapse from within." },
  { q: "Explicit price-fixing among competing firms is:", opts: ["Legal when it stabilizes markets", "Legal only for natural monopolies", "Illegal under U.S. antitrust law", "Legal in oligopoly markets only"], correct: 2, exp: "Price-fixing cartels are illegal under the Sherman Antitrust Act. The DOJ actively prosecutes firms that coordinate prices — executives can face prison time." },
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


const HHI_MARKETS: {
  name: string;
  firms: { name: string; share: number }[];
  top4: number[];
  correct4firm: number;
  allShares: number[];
  correctHHI: number;
  answer: string;
  exp: string;
}[] = [
  {
    name: "Smartphones",
    firms: [{ name: "Apple", share: 28 }, { name: "Samsung", share: 25 }, { name: "Xiaomi", share: 13 }, { name: "Google", share: 10 }, { name: "Motorola", share: 8 }, { name: "OnePlus", share: 6 }, { name: "All Others", share: 10 }],
    top4: [28, 25, 13, 10], correct4firm: 76,
    allShares: [28, 25, 13, 10, 8, 6, 10],
    correctHHI: 1878,
    answer: "Highly Concentrated", exp: "HHI = 1,878 — above 1,800. The DOJ would scrutinize any proposed merger. Apple and Samsung together hold over half the market.",
  },
  {
    name: "U.S. Airlines",
    firms: [{ name: "American", share: 20 }, { name: "Delta", share: 19 }, { name: "United", share: 18 }, { name: "Southwest", share: 17 }, { name: "Alaska", share: 8 }, { name: "JetBlue", share: 6 }, { name: "Spirit", share: 7 }, { name: "Frontier", share: 5 }],
    top4: [20, 19, 18, 17], correct4firm: 74,
    allShares: [20, 19, 18, 17, 8, 6, 7, 5],
    correctHHI: 1548,
    answer: "Moderately Concentrated", exp: "HHI = 1,548 — in the 1,000–1,800 range. The DOJ/FTC would give any merger in the U.S. airline market case-by-case scrutiny.",
  },
  {
    name: "Beer (U.S.)",
    firms: [{ name: "AB InBev", share: 38 }, { name: "Molson Coors", share: 26 }, { name: "Constellation Brands", share: 14 }, { name: "Heineken USA", share: 12 }, { name: "Pabst Brewing", share: 6 }, { name: "All Others", share: 4 }],
    top4: [38, 26, 14, 12], correct4firm: 90,
    allShares: [38, 26, 14, 12, 6, 4],
    correctHHI: 2512,
    answer: "Highly Concentrated", exp: "HHI = 2,512 — above 1,800. The DOJ/FTC would likely challenge any merger in the U.S. beer market. AB InBev and Molson Coors alone hold 64% of the market.",
  },
  {
    name: "U.S. Grocery Retail",
    firms: [{ name: "Walmart", share: 22 }, { name: "Kroger", share: 9 }, { name: "Costco", share: 8 }, { name: "Amazon/Whole Foods", share: 7 }, { name: "Albertsons", share: 6 }, { name: "Publix", share: 5 }, { name: "Aldi", share: 5 }, { name: "Target", share: 4 }],
    top4: [22, 9, 8, 7], correct4firm: 46,
    allShares: [22, 9, 8, 7, 6, 5, 5, 4],
    correctHHI: 780,
    answer: "Unconcentrated", exp: "HHI = 780 — below 1,000. The DOJ/FTC would not challenge mergers in this market. Grocery retail is fragmented with many regional and national competitors.",
  },
];


function HHIStation({ onComplete }: { onComplete: () => void }) {
  const [mktIdx, setMktIdx] = useState(0);
  const [phase, setPhase] = useState<"learn" | "calc4firm" | "calchhi" | "result">("learn");
  const [user4firm, setUser4firm] = useState("");
  const [userHHI, setUserHHI] = useState("");
  const [fb4firm, setFb4firm] = useState("");
  const [fbHHI, setFbHHI] = useState("");
  const [attempts4, setAttempts4] = useState(0);
  const [attemptsH, setAttemptsH] = useState(0);
  const [doneMkts, setDoneMkts] = useState<number[]>([]);
  const [marked, setMarked] = useState(false);
  const mkt = HHI_MARKETS[mktIdx];
  const allDone = doneMkts.length >= HHI_MARKETS.length - 1 && phase === "result";

  function check4firm() {
    const val = parseInt(user4firm);
    const newAtt = attempts4 + 1; setAttempts4(newAtt);
    if (val === mkt.correct4firm) { setFb4firm(`✓ Correct! 4-Firm Ratio = ${mkt.top4.join(" + ")} = ${mkt.correct4firm}%.`); setPhase("calchhi"); }
    else if (newAtt === 1) setFb4firm(`Not quite. Add the market shares of the top 4 firms: ${mkt.top4.join(", ")}.`);
    else { setFb4firm(`The answer is ${mkt.correct4firm}%. Sum the top 4 shares: ${mkt.top4.join(" + ")} = ${mkt.correct4firm}%.`); setPhase("calchhi"); }
  }

  function checkHHI() {
    const val = parseInt(userHHI);
    const newAtt = attemptsH + 1; setAttemptsH(newAtt);
    const tolerance = 0;
    if (Math.abs(val - mkt.correctHHI) <= tolerance) {
      setFbHHI(`✓ Correct! HHI ≈ ${mkt.correctHHI} (sum of squared market shares).`); setPhase("result");
    } else if (newAtt === 1) setFbHHI(`Not quite. Square each market share and sum them all: ${mkt.allShares.map(s => `${s}²`).join(" + ")}.`);
    else { setFbHHI(`The HHI is approximately ${mkt.correctHHI}. Square each share and add: ${mkt.allShares.map(s => s * s).join(" + ")} = ${mkt.correctHHI}.`); setPhase("result"); }
  }

  function nextMarket() {
    setDoneMkts(p => [...p, mktIdx]);
    if (mktIdx < HHI_MARKETS.length - 1) {
      setMktIdx(mktIdx + 1); setPhase("learn"); setUser4firm(""); setUserHHI("");
      setFb4firm(""); setFbHHI(""); setAttempts4(0); setAttemptsH(0);
    }
  }

  return (
    <div className="space-y-5">
      {/* Market tabs */}
      <div className="flex gap-2 flex-wrap">
        {HHI_MARKETS.map((m, i) => (
          <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${i === mktIdx ? "border-primary bg-primary text-primary-foreground" : doneMkts.includes(i) ? "border-green-400 bg-green-50 text-green-700" : "border-border text-muted-foreground"}`}>
            {doneMkts.includes(i) ? "✓ " : ""}{m.name}
          </span>
        ))}
      </div>

      {/* Learn phase */}
      {phase === "learn" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
            <p className="text-sm font-semibold text-primary mb-2">Two Tools for Measuring Market Concentration</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 border border-border">
                <p className="font-semibold text-foreground mb-1">4-Firm Concentration Ratio</p>
                <p className="text-muted-foreground text-xs">Sum the market shares of the 4 largest firms.</p>
                <p className="text-xs mt-1"><span className="font-semibold">Under 50%</span> = Not concentrated</p>
                <p className="text-xs"><span className="font-semibold">50–80%</span> = Moderately concentrated</p>
                <p className="text-xs"><span className="font-semibold">Over 80%</span> = Highly concentrated</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-border">
                <p className="font-semibold text-foreground mb-1">HHI (Herfindahl-Hirschman Index)</p>
                <p className="text-muted-foreground text-xs">Square each firm's market share, then sum all.</p>
                <p className="text-xs mt-1"><span className="font-semibold">Under 1,000</span> = Likely approve mergers</p>
                <p className="text-xs"><span className="font-semibold">1,000–1,800</span> = Case-by-case scrutiny</p>
                <p className="text-xs"><span className="font-semibold">Over 1,800</span> = Likely challenge mergers</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border-2 border-border bg-card p-4">
            <p className="text-sm font-semibold text-foreground mb-3">Market: {mkt.name}</p>
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-primary text-primary-foreground"><th className="px-3 py-2 text-left">Firm</th><th className="px-3 py-2 text-right">Market Share</th><th className="px-3 py-2 text-right">Share²</th></tr></thead>
              <tbody>
                {mkt.firms.map((f, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                    <td className="px-3 py-2 text-foreground">{f.name}</td>
                    <td className="px-3 py-2 text-right text-foreground">{f.share}%</td>
                    <td className="px-3 py-2 text-right text-muted-foreground text-xs">{f.share}² = {f.share * f.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 font-medium">
            👉 Review the firm data above, then click <strong>Calculate the Ratios</strong> to get started.
          </div>
          <button onClick={() => setPhase("calc4firm")} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">
            Calculate the Ratios →
          </button>
        </div>
      )}

      {/* 4-firm calc */}
      {(phase === "calc4firm" || phase === "calchhi" || phase === "result") && (
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-border bg-card p-4">
            <p className="text-sm font-semibold mb-2 text-foreground">Market: {mkt.name}</p>
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-primary text-primary-foreground"><th className="px-2 py-1.5 text-left">Firm</th><th className="px-2 py-1.5 text-right">Share</th><th className="px-2 py-1.5 text-right">Share²</th></tr></thead>
              <tbody>
                {mkt.firms.map((f, i) => (
                  <tr key={i} className={i < 4 ? "bg-blue-50" : i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                    <td className="px-2 py-1 text-foreground">{f.name}{i < 4 ? " ★" : ""}</td>
                    <td className="px-2 py-1 text-right">{f.share}%</td>
                    <td className="px-2 py-1 text-right text-muted-foreground">{f.share * f.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-1">★ Top 4 firms (highlighted)</p>
          </div>

          {/* 4-firm input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">4-Firm Concentration Ratio (%):</label>
            <div className="flex gap-2">
              <input type="number" value={user4firm} onChange={e => setUser4firm(e.target.value)}
                disabled={phase !== "calc4firm"}
                className={`flex-1 border-2 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary ${phase !== "calc4firm" ? "bg-muted text-muted-foreground" : "border-border"}`}
                placeholder="Enter sum of top 4 shares" />
              {phase === "calc4firm" && <button onClick={check4firm} disabled={!user4firm} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-40">Check</button>}
            </div>
            {fb4firm && <p className={`text-sm rounded-lg p-3 ${fb4firm.startsWith("✓") ? "bg-green-50 text-green-800 border border-green-300" : "bg-amber-50 text-amber-800 border border-amber-300"}`}>{fb4firm}</p>}
          </div>

          {/* HHI input */}
          {(phase === "calchhi" || phase === "result") && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Herfindahl-Hirschman Index (HHI):</label>
              <div className="flex gap-2">
                <input type="number" value={userHHI} onChange={e => setUserHHI(e.target.value)}
                  disabled={phase !== "calchhi"}
                  className={`flex-1 border-2 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary ${phase !== "calchhi" ? "bg-muted text-muted-foreground" : "border-border"}`}
                  placeholder="Enter sum of squared shares" />
                {phase === "calchhi" && <button onClick={checkHHI} disabled={!userHHI} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-40">Check</button>}
              </div>
              {fbHHI && <p className={`text-sm rounded-lg p-3 ${fbHHI.startsWith("✓") ? "bg-green-50 text-green-800 border border-green-300" : "bg-amber-50 text-amber-800 border border-amber-300"}`}>{fbHHI}</p>}
            </div>
          )}

          {phase === "result" && (
            <div className="rounded-xl bg-muted p-4 space-y-1">
              <p className="font-semibold text-foreground">FTC Verdict: {mkt.name}</p>
              <p className="text-sm text-muted-foreground">{mkt.exp}</p>
            </div>
          )}

          {phase === "result" && (
            <div className="space-y-3">
              {mktIdx < HHI_MARKETS.length - 1 && !doneMkts.includes(mktIdx) && (
                <button onClick={nextMarket} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next Market →</button>
              )}
              {(allDone || (doneMkts.length >= HHI_MARKETS.length - 1 && phase === "result")) && !marked && (
                <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
              )}
              {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Station 3: Merger Review Simulator ───
type MergerVerdict = "approve" | "condition" | "block";
const MERGER_CASES = [
  {
    title: "Two Small Bakeries Merge",
    desc: "Two local bakeries in a large city each have 3% market share. The city has over 200 bakeries. The merged firm would have 6% market share. HHI change: minimal.",
    correct: "approve" as MergerVerdict,
    exp: "With hundreds of competitors and a combined share of just 6%, this merger poses no competitive threat. The FTC routinely approves mergers in unconcentrated markets. Efficiency gains may even benefit consumers.",
  },
  {
    title: "Kinder Morgan + El Paso Pipeline ($21B)",
    desc: "Kinder Morgan proposes to acquire El Paso Corporation, which would give the merged firm control of 80,000+ miles of natural gas pipeline — the largest natural gas pipeline network in the U.S. HHI jumps significantly above 1,800.",
    correct: "condition" as MergerVerdict,
    exp: "The FTC allowed this merger but required divestitures — Kinder Morgan had to sell certain pipeline assets to maintain competition on specific routes. 'Approve with conditions' is the most common real-world outcome for large mergers.",
  },
  {
    title: "Top Two Wireless Carriers Propose to Merge",
    desc: "The two largest U.S. wireless carriers (combined 65% market share) propose to merge into a single firm. The market HHI would jump from ~2,700 to over 4,200. Only one major competitor would remain.",
    correct: "block" as MergerVerdict,
    exp: "Merging the two dominant players in an already highly concentrated market would likely harm consumers through higher prices and reduced innovation. The FTC would almost certainly block this merger outright.",
  },
  {
    title: "Two Mid-Sized Airline Mergers",
    desc: "Airline A (18% market share) proposes to acquire Airline B (12% market share). Combined share: 30%. The four-firm ratio goes from 70% to 82%. HHI rises from 1,350 to 1,690.",
    correct: "condition" as MergerVerdict,
    exp: "The HHI increase (340 points, crossing into moderately concentrated territory) triggers scrutiny but not an outright block. The FTC would likely require the merged firm to give up certain routes or gates where competition would be harmed.",
  },
];

const MERGER_VERDICT_LABELS: Record<MergerVerdict, string> = {
  approve: "✓ Approve",
  condition: "⚠️ Approve with Conditions",
  block: "✗ Block the Merger",
};
const MERGER_VERDICT_COLORS: Record<MergerVerdict, string> = {
  approve: "border-green-500 bg-green-50 text-green-800",
  condition: "border-amber-400 bg-amber-50 text-amber-800",
  block: "border-red-500 bg-red-50 text-red-800",
};

function MergerStation({ onComplete }: { onComplete: () => void }) {
  const [caseIdx, setCaseIdx] = useState(0);
  const [choice, setChoice] = useState<MergerVerdict | null>(null);
  const [checked, setChecked] = useState(false);
  const [doneCases, setDoneCases] = useState<number[]>([]);
  const [marked, setMarked] = useState(false);
  const mc = MERGER_CASES[caseIdx];
  const allDone = doneCases.length >= MERGER_CASES.length - 1 && checked;

  function next() {
    setDoneCases(p => [...p, caseIdx]);
    if (caseIdx < MERGER_CASES.length - 1) { setCaseIdx(caseIdx + 1); setChoice(null); setChecked(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {MERGER_CASES.map((_, i) => (
          <span key={i} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold border-2 ${i === caseIdx ? "border-primary bg-primary text-primary-foreground" : doneCases.includes(i) ? "border-green-500 bg-green-100 text-green-800" : "border-border text-muted-foreground"}`}>{i + 1}</span>
        ))}
      </div>
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">FTC Merger Review — Case {caseIdx + 1}</p>
        <p className="font-semibold text-foreground mb-2">{mc.title}</p>
        <p className="text-sm text-foreground">{mc.desc}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">As the FTC regulator, what is your decision?</p>
        <div className="space-y-2">
          {(["approve", "condition", "block"] as MergerVerdict[]).map(v => {
            const sel = choice === v;
            const isCorrect = checked && v === mc.correct;
            const isWrong = checked && sel && v !== mc.correct;
            let cls = sel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-foreground hover:border-primary/40";
            if (checked) {
              if (isCorrect) cls = MERGER_VERDICT_COLORS[v];
              else if (isWrong) cls = "border-red-400 bg-red-50 text-red-700";
            }
            return (
              <button key={v} onClick={() => { if (!checked) setChoice(v); }}
                disabled={checked} aria-pressed={sel}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                {isCorrect && "→ "}{MERGER_VERDICT_LABELS[v]}
                {checked && v === mc.correct && <span className="ml-2 text-xs font-normal">(Correct decision)</span>}
              </button>
            );
          })}
        </div>
      </div>
      {checked && <div className="rounded-xl bg-muted p-4 text-sm" role="alert"><p className="font-semibold text-foreground mb-1">{choice === mc.correct ? "✓ Correct!" : "Not quite."}</p><p className="text-muted-foreground">{mc.exp}</p></div>}
      {!checked
        ? <button onClick={() => { if (choice) setChecked(true); }} disabled={!choice} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition">Render My Decision</button>
        : <div className="space-y-3">
            {caseIdx < MERGER_CASES.length - 1 && !doneCases.includes(caseIdx) && <button onClick={next} className="w-full py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next Case →</button>}
            {(allDone || (doneCases.length >= MERGER_CASES.length - 1 && checked)) && !marked && <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>}
            {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
          </div>
      }
    </div>
  );
}

// ─── Station 4: Anticompetitive Behavior Classifier ───
type LegalStatus = "legal" | "illegal" | "gray";
const LEGAL_LABELS: Record<LegalStatus, string> = { legal: "Legal", illegal: "Illegal", gray: "Gray Area (Depends on Context)" };
const LEGAL_COLORS: Record<LegalStatus, string> = { legal: "border-green-500 bg-green-50 text-green-800", illegal: "border-red-500 bg-red-50 text-red-800", gray: "border-amber-400 bg-amber-50 text-amber-800" };

const ANTICOMP_EXAMPLES = [
  { scenario: "Three airlines secretly meet and agree to all charge the same fare on the Chicago-Dallas route.", correct: "illegal" as LegalStatus, exp: "This is explicit price-fixing — a cartel. Illegal under the Sherman Antitrust Act. Executives can face criminal prosecution and prison time." },
  { scenario: "Ford Motor Company requires all Ford dealers to sell only Ford vehicles (not competing brands).", correct: "legal" as LegalStatus, exp: "This exclusive dealing arrangement is legal because it promotes competition between dealers (all selling the same brand), not against it. Ford v. GM competition continues." },
  { scenario: "A major cable company gives a single retailer the exclusive right to sell all cable TV brands in a region.", correct: "illegal" as LegalStatus, exp: "This exclusive dealing arrangement reduces retailer competition (consumers can only buy from one retailer). Illegal under antitrust law — it harms competition at the retail level." },
  { scenario: "A software company bundles its word processor, spreadsheet, and email app together and sells them as a package.", correct: "gray" as LegalStatus, exp: "Bundling is often legal (consumers may prefer the package) but can be anticompetitive if the firm has market power and uses bundling to foreclose rivals. Evaluated case by case." },
  { scenario: "A dominant firm drops its prices to below average variable cost specifically to drive a new entrant out of business, planning to raise prices again afterward.", correct: "illegal" as LegalStatus, exp: "Predatory pricing — deliberately selling below cost to eliminate a rival — is illegal. The intent to drive out competition and then raise prices is the key element." },
  { scenario: "A restaurant chain negotiates lower prices with suppliers by promising to buy large volumes.", correct: "legal" as LegalStatus, exp: "Negotiating volume discounts is legitimate competitive behavior. It reflects genuine cost savings, not anticompetitive exclusion." },
  { scenario: "Microsoft required PC manufacturers to install Internet Explorer and not pre-install Netscape Navigator.", correct: "illegal" as LegalStatus, exp: "The DOJ found this constituted illegal exclusive dealing — using Windows monopoly power to control the browser market. Microsoft lost the antitrust case in 2000." },
  { scenario: "A phone manufacturer requires customers to also buy its phone case to get the warranty.", correct: "gray" as LegalStatus, exp: "Tying sales (must buy Product B to get Product A) can be legal when there's a legitimate product integration reason, but illegal if the firm has market power and uses it to foreclose rivals." },
];

function AnticompStation({ onComplete }: { onComplete: () => void }) {
  const [choices, setChoices] = useState<Record<string, LegalStatus | null>>(() => Object.fromEntries(ANTICOMP_EXAMPLES.map(e => [e.scenario.slice(0, 30), null])));
  const [checked, setChecked] = useState(false);
  const [marked, setMarked] = useState(false);
  const keys = ANTICOMP_EXAMPLES.map(e => e.scenario.slice(0, 30));
  const allChosen = keys.every(k => choices[k] !== null);
  const score = ANTICOMP_EXAMPLES.filter((e, i) => choices[keys[i]] === e.correct).length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm font-semibold text-primary mb-1">Legal or Illegal?</p>
        <p className="text-sm text-muted-foreground">Antitrust law isn't always black and white. For each business practice, decide whether it is legal, illegal, or a gray area that depends on context.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["legal", "illegal", "gray"] as LegalStatus[]).map(s => <span key={s} className={`px-2 py-1 rounded-full text-xs font-semibold border-2 ${LEGAL_COLORS[s]}`}>{LEGAL_LABELS[s]}</span>)}
      </div>
      <div className="space-y-4">
        {ANTICOMP_EXAMPLES.map((ex, i) => {
          const key = keys[i];
          const chosen = choices[key];
          const isCorrect = checked && chosen === ex.correct;
          const isWrong = checked && chosen !== null && chosen !== ex.correct;
          return (
            <div key={i} className={`rounded-xl border-2 p-4 transition-all ${checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-300 bg-red-50" : "border-border") : "border-border bg-card"}`}>
              <p className="text-sm text-foreground mb-2">{ex.scenario}</p>
              {checked && isWrong && <p className="text-xs text-red-600 font-semibold mb-2">→ Correct: {LEGAL_LABELS[ex.correct]}</p>}
              {checked && isCorrect && <p className="text-xs text-green-700 font-semibold mb-2">✓ Correct</p>}
              <div className="flex flex-wrap gap-1">
                {(["legal", "illegal", "gray"] as LegalStatus[]).map(s => {
                  const sel = chosen === s;
                  let cls = sel ? LEGAL_COLORS[s] + " border-current" : "border-border text-muted-foreground hover:border-primary/40";
                  if (checked && s === ex.correct) cls = LEGAL_COLORS[s] + " border-current";
                  else if (checked && sel && s !== ex.correct) cls = "border-red-400 bg-red-100 text-red-700";
                  return (
                    <button key={s} onClick={() => { if (!checked) setChoices(prev => ({ ...prev, [key]: s })); }}
                      disabled={checked} aria-pressed={sel}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${cls}`}>
                      {LEGAL_LABELS[s]}
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
              <p className="font-bold text-lg">{score} / {ANTICOMP_EXAMPLES.length}</p>
              <p className="text-sm text-muted-foreground">{score >= 7 ? "Sharp antitrust instincts!" : "Review the explanations — the gray areas are the hardest part."}</p>
            </div>
            {!marked && <button onClick={() => { setMarked(true); onComplete(); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>}
            {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Station Complete</p>}
          </div>
      }
    </div>
  );
}

// ─── Station 5: Natural Monopoly Regulation Review ───
const NATMON_QS = [
  { q: "Cost-plus regulation sets price based on:", opts: ["The firm's marginal cost", "The firm's accounting costs plus a normal profit rate", "Whatever price the market will bear", "The price a competitive market would produce"], correct: 1, exp: "Cost-plus regulation: regulators look at actual accounting costs, add a normal profit, and set that as the allowed price. Problem: removes incentive to cut costs — higher costs mean higher allowed prices." },
  { q: "Price cap regulation sets:", opts: ["Price equal to marginal cost", "A maximum price for several years in advance — the firm profits by cutting costs faster than caps fall", "Price equal to average cost each year", "A minimum price to protect the firm"], correct: 1, exp: "Price cap regulation: a price ceiling is set years in advance. If the firm cuts costs faster than the cap falls, it profits. This creates strong efficiency incentives — the main advantage over cost-plus." },
  { q: "The main PROBLEM with cost-plus regulation is:", opts: ["The firm earns too little profit to survive", "It removes the firm's incentive to control costs — higher costs mean higher allowed prices", "It forces price below average cost", "It requires government subsidies"], correct: 1, exp: "Cost-plus removes cost-cutting incentives. The firm knows any cost increase will be passed on to consumers via higher allowed prices. This is called the 'gold-plating' problem." },
  { q: "Why can't a natural monopoly simply be broken into competing firms?", opts: ["It is illegal to break up any monopoly", "Breaking it up destroys economies of scale — each smaller firm has higher average costs, potentially raising prices", "Natural monopolies always operate at minimum average cost", "Competition requires identical products, which utilities don't provide"], correct: 1, exp: "Natural monopolies exist because one firm can produce at lower cost than multiple firms. Breaking it up sacrifices those scale economies — consumers could end up paying MORE for duplicate infrastructure." },
  { q: "Regulatory capture occurs when:", opts: ["The government successfully controls a natural monopoly", "Regulated industries gain strong influence over the regulatory process — regulations end up serving industry, not the public", "A firm captures market share from rivals", "A regulator sets prices below average cost"], correct: 1, exp: "Regulatory capture: the regulated industry ends up influencing who sits on regulatory boards, what information regulators receive, and what rules get written — turning regulation into a barrier to entry rather than a consumer protection." },
];

function NatMonRegStation({ onComplete }: { onComplete: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(NATMON_QS.length).fill(null));
  const [checked, setChecked] = useState<boolean[]>(Array(NATMON_QS.length).fill(false));
  const [marked, setMarked] = useState(false);
  const q = NATMON_QS[qIdx];
  const ans = answers[qIdx];
  const isChecked = checked[qIdx];
  const allDone = checked.every(Boolean);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Question {qIdx + 1} of {NATMON_QS.length}</span>
        <div className="flex gap-1">{NATMON_QS.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === qIdx ? "bg-primary" : checked[i] ? (answers[i] === NATMON_QS[i].correct ? "bg-green-500" : "bg-red-400") : "bg-muted"}`} />)}</div>
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
            {qIdx < NATMON_QS.length - 1
              ? <button onClick={() => setQIdx(qIdx + 1)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next →</button>
              : allDone && !marked
                ? <button onClick={() => { setMarked(true); onComplete(); }} className="flex-1 py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
                : marked ? <p className="flex-1 text-center text-green-700 font-semibold text-sm py-3">✓ Station Complete</p> : null
            }
          </div>
      }
    </div>
  );
}

// ─── Station 6: Deregulation & Regulatory Capture ───
const DEREG_STEPS = [
  {
    title: "The Deregulation Wave (1970s–1980s)",
    content: "By the late 1970s, economists and policymakers increasingly believed that price and quantity regulations in many industries were harming consumers rather than helping them — creating inefficiency, high prices, and protected incumbents.\n\nIndustries deregulated:\n• Airlines (1978 Airline Deregulation Act)\n• Trucking\n• Railroads\n• Natural gas\n• Bank interest rates\n\nThe experiment: What happens when government removes price controls and lets competition work?",
    question: "The primary argument FOR deregulating industries like airlines and trucking was:",
    opts: ["Government price controls were efficiently setting prices at competitive levels", "Regulations had become tools that protected incumbent firms from competition, raising prices for consumers", "Deregulation would allow firms to form cartels more easily", "Competition was already strong in regulated industries"],
    correct: 1,
    exp: "Regulations had evolved to protect incumbents — preventing new airlines from entering routes, keeping trucking prices artificially high. Deregulation was intended to restore competitive pressures.",
  },
  {
    title: "Results of Deregulation",
    content: "Airline deregulation results (1978 → 2000s):\n✓ Airfares dropped by approximately one-third\n✓ Passenger volume doubled\n✓ Planes flew fuller (more efficient)\n✓ Service expanded to more cities\n✗ Firm bankruptcies and market turmoil\n✗ Some job losses and displacement\n✗ New concentration concerns (hub dominance)\n\nGeneral pattern across deregulated industries: prices fell, access increased, but ongoing vigilance was needed to prevent re-concentration.",
    question: "Airline deregulation in 1978 resulted in:",
    opts: ["Higher prices as airlines took advantage of less regulation", "Airfares falling by approximately one-third and passenger volume doubling", "Immediate market stability with no firm bankruptcies", "Government ownership of all major airlines"],
    correct: 1,
    exp: "Deregulation worked: airfares fell about one-third over two decades, passenger volume doubled, and planes flew fuller. However, famous airlines disappeared (Pan Am, Eastern) and new concerns about hub dominance emerged.",
  },
  {
    title: "Regulatory Capture",
    content: "A key risk of regulation: the regulated industries end up controlling the regulators.\n\nHow capture happens:\n• Industry suggests who should be on regulatory boards\n• Industry provides most of the information regulators use\n• Industry lobbyists argue constantly with board members\n• Regulators get offered well-paying jobs in the industry after their government service\n\nResult: regulations that were designed to protect consumers become barriers to entry that protect incumbent firms.",
    question: "Regulatory capture is BEST defined as:",
    opts: ["Government successfully controlling a monopoly to protect consumers", "Regulated industries gaining strong influence over the regulatory process — regulations end up serving industry interests, not the public", "A regulator setting prices below average cost", "An industry forming a cartel with government approval"],
    correct: 1,
    exp: "Regulatory capture flips the purpose of regulation — instead of protecting consumers from concentrated power, regulations become tools that protect existing firms from new competition. The 'revolving door' between industry and regulators accelerates this.",
  },
  {
    title: "Re-Regulation After Market Failures",
    content: "Deregulation wasn't the end of the story. Major market failures triggered new waves of regulation:\n\n📊 Enron/WorldCom Scandals (2001–2002): Massive accounting fraud → Sarbanes-Oxley Act (2002) — required stronger financial transparency and executive accountability.\n\n💰 Great Recession (2008–2009): Financial deregulation contributed to the housing bubble and collapse → Dodd-Frank Act (2010) — reformed financial regulation, aimed to end 'too big to fail' bailouts.\n\nCore principle: Markets need a legal framework to function — contract enforcement, fraud prevention, and competition policy.",
    question: "The Dodd-Frank Act (2010) was passed primarily in response to:",
    opts: ["Airline deregulation problems in the 1980s", "The Great Recession and financial crisis caused in part by inadequate financial regulation", "Monopoly power in the technology sector", "Regulatory capture in the trucking industry"],
    correct: 1,
    exp: "Dodd-Frank was a direct response to the 2008–2009 financial crisis. Financial deregulation in the 1990s–2000s had allowed excessive risk-taking. Dodd-Frank reimposed regulations to prevent another crisis and end 'too big to fail' bailouts.",
  },
];

function DeregStation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState(false);
  const cur = DEREG_STEPS[step];
  const stepAns = answers[step] ?? null;
  const allDone = DEREG_STEPS.every((_, i) => feedback[i] !== undefined);

  function check() {
    if (stepAns === null) return;
    setFeedback(prev => ({ ...prev, [step]: stepAns === cur.correct ? `✓ Correct! ${cur.exp}` : `Not quite. ${cur.exp}` }));
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {DEREG_STEPS.map((s, i) => (
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
        : step < DEREG_STEPS.length - 1
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
  { q: "The Four-Firm Concentration Ratio is calculated by:", opts: ["Squaring the market shares of all firms and summing them", "Adding the market shares of the four largest firms", "Dividing total industry revenue by the number of firms", "Multiplying the HHI by the number of firms"], correct: 1, multi: false, exp: "4-Firm Ratio = sum of market shares of the top 4 firms. Simple but limited — it doesn't distinguish between equally-sized firms vs. one dominant firm." },
  { q: "A Herfindahl-Hirschman Index (HHI) of 2,500 indicates:", opts: ["A moderately competitive market — FTC will approve any merger", "A highly concentrated market — FTC likely to challenge mergers", "A perfectly competitive market", "A natural monopoly requiring regulation"], correct: 1, multi: false, exp: "HHI > 1,800 = highly concentrated. The FTC would likely scrutinize and potentially challenge mergers that raise HHI above this threshold." },
  { q: "Antitrust authorities can respond to a proposed merger by:", opts: ["Only approving or blocking — no middle options", "Approving, blocking, or approving with conditions (requiring divestitures)", "Only blocking mergers above $1 billion", "Approving all mergers that improve efficiency"], correct: 1, multi: false, exp: "The FTC has three options: approve, block, or approve with conditions (requiring the merged firm to divest assets or routes to preserve competition). Approval with conditions is most common for large mergers." },
  { q: "Which of the following is ILLEGAL under U.S. antitrust law?", opts: ["Negotiating volume discounts with suppliers", "Requiring dealers to sell only your brand of products", "Competing firms secretly agreeing to fix prices", "Selling a bundled package of products"], correct: 2, multi: false, exp: "Explicit price-fixing between competitors is illegal under the Sherman Antitrust Act — regardless of whether it 'stabilizes' markets. Executives can face criminal prosecution." },
  { q: "Cost-plus regulation of a natural monopoly sets price based on:", opts: ["The marginal cost of production", "The firm's accounting costs plus a normal profit rate", "The competitive market price", "A price ceiling set years in advance"], correct: 1, multi: false, exp: "Cost-plus: regulators calculate the firm's actual costs and add a normal profit. Problem: removes incentive to cut costs — higher costs mean higher allowed prices." },
  { q: "The main ADVANTAGE of price cap regulation over cost-plus regulation is:", opts: ["Price caps guarantee the firm a profit", "Price caps remove the firm's incentive to control costs", "Price caps create strong incentives for efficiency — firms profit by cutting costs faster than caps fall", "Price caps always set price equal to marginal cost"], correct: 2, multi: false, exp: "Price caps are set years in advance — independent of actual costs. Firms that cut costs earn more profit. This is the key efficiency advantage over cost-plus, where cost savings are passed back to the regulator." },
  { q: "Regulatory capture occurs when:", opts: ["A government regulator successfully controls a monopoly", "Regulated industries gain strong influence over the regulatory process", "A firm captures market share from rivals through competition", "A natural monopoly is broken up into smaller firms"], correct: 1, multi: false, exp: "Regulatory capture: the regulated industry ends up influencing who regulates them, what information regulators receive, and what rules get written — regulations serve industry, not consumers." },
  { q: "The Dodd-Frank Act (2010) was passed primarily in response to:", opts: ["The airline deregulation problems of the 1980s", "The Great Recession and financial crisis caused partly by inadequate financial regulation", "Monopoly power in the technology sector", "Antitrust concerns about corporate mergers"], correct: 1, multi: false, exp: "Dodd-Frank was a direct response to the 2008–09 financial crisis. It reimposed financial regulations to prevent another crisis and aimed to end 'too big to fail' bailouts." },
  { q: "Which of the following correctly describe the HHI? (Select all that apply)", opts: ["It is calculated by squaring each firm's market share and summing the results", "An HHI under 1,000 suggests the market is not highly concentrated", "It gives greater weight to larger firms than to smaller ones", "It is calculated by summing (not squaring) market shares"], correct: [0, 1, 2], multi: true, exp: "HHI = sum of squared market shares. Squaring gives more weight to large firms. HHI < 1,000 = low concentration; HHI > 1,800 = high concentration. Summing without squaring gives the 4-firm ratio, not HHI." },
  { q: "Which of the following are restrictive practices that may reduce competition and face antitrust scrutiny? (Select all that apply)", opts: ["Tie-in sales (must buy Product B to get Product A)", "Volume discount negotiations with suppliers", "Predatory pricing (pricing below cost to eliminate a rival)", "Exclusive dealing that forecloses rivals from the market"], correct: [0, 2, 3], multi: true, exp: "Tie-in sales, predatory pricing, and exclusive dealing that harms competition are all practices that antitrust authorities scrutinize. Volume discounts are a normal business practice — not anticompetitive." },
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
      + '<p style="color:#475569;margin:2px 0">Chapter 11: Monopoly and Antitrust Policy</p>'
      + '<p style="font-size:22px;font-weight:bold;background:#1e2d4a;color:white;display:inline-block;padding:4px 16px;border-radius:99px;margin:8px 0">' + score + ' / 10</p>'
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<h3 style="font-size:13px;margin:0 0 6px">Question Review</h3>' + items
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<p style="font-size:13px"><b>Exit Ticket:</b></p><p style="border:1px solid #ccc;padding:8px;border-radius:4px;font-size:13px;min-height:40px">' + (reflection || '') + '</p>'
      + '<p style="font-size:13px;margin-top:12px"><b>Student Name:</b></p><p style="border:1px solid #000;padding:8px;border-radius:4px;font-size:14px;font-weight:bold">' + studentName + '</p>'
      + '<p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:16px;padding-top:8px">ECO 211 · Chapter 11: Monopoly and Antitrust Policy · Printed ' + new Date().toLocaleDateString() + ' · Access for free at https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction</p>'
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
          <div className="text-xs font-semibold text-foreground">ECO 211 ECONLAB · Chapter 11: Monopoly and Antitrust Policy</div>
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
    { id: "hhi", label: "HHI Calc" },
    { id: "merger", label: "Mergers" },
    { id: "anticomp", label: "Anticomp." },
    { id: "natmonreg", label: "Nat. Mon." },
    { id: "deregulation", label: "Deregulation" },
    { id: "quiz", label: "Quiz" },
  ];
  const CONTENT_STATIONS: Station[] = ["recap","hhi","merger","anticomp","natmonreg","deregulation"];
  const allDone = CONTENT_STATIONS.every(s => completed.has(s as Station));
  const stationOrder: Station[] = ["intro","recap","hhi","merger","anticomp","natmonreg","deregulation","quiz","results","not-yet"];
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
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 11</div>
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
    { id: "recap",       label: "📚 Ch10 Recap",                  short: "Recap",       desc: "Review monopolistic competition and oligopoly before antitrust" },
    { id: "hhi",         label: "📊 HHI & Concentration Ratios",  short: "HHI Calc",    desc: "Calculate 4-firm ratios and HHI for 3 real markets" },
    { id: "merger",      label: "🏛️ Merger Review Simulator",     short: "Mergers",     desc: "Play FTC regulator — approve, condition, or block 4 real merger cases" },
    { id: "anticomp",    label: "⚖️ Legal or Illegal?",           short: "Anticomp.",   desc: "Classify 8 business practices: legal, illegal, or gray area" },
    { id: "natmonreg",   label: "🔌 Natural Monopoly Regulation", short: "Nat. Mon.",   desc: "5 questions on cost-plus, price cap, and regulatory capture" },
    { id: "deregulation",label: "✈️ Deregulation & Capture",      short: "Deregulation",desc: "4-step walkthrough of the deregulation wave and its consequences" },
  ];

  const allStationsDone = STATIONS.every(s => completed.has(s.id));
  function markDone(id: string) { setCompleted(prev => new Set([...prev, id])); setStation("intro"); }
  function handlePass(score: number, results: { correct: boolean; exp: string }[]) { setQuizScore(score); setQuizResults(results); try { localStorage.setItem("econlab211_done_ch11", "true"); } catch (_) {} setStation("results"); }
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
              <p className="text-base font-semibold text-foreground">"Balancing Market Power with Competition"</p>
              <p className="text-sm text-muted-foreground mt-1">Large firms create efficiencies but can harm consumers. Antitrust law uses mergers, concentration measures (HHI), and behavior regulation to balance the tension between scale and competition — while regulators must guard against being captured by the industries they oversee.</p>
            </div>
            <button onClick={() => setShowSummary(true)} className="w-full text-left rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 transition flex items-center gap-2">
              <span>📄</span><span>Need a refresher? <span className="text-primary font-semibold underline">View the Chapter 11 summary.</span></span>
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
            {station === "recap"        && <RecapStation     onComplete={() => markDone("recap")}        />}
            {station === "hhi"          && <HHIStation        onComplete={() => markDone("hhi")}          />}
            {station === "merger"       && <MergerStation     onComplete={() => markDone("merger")}       />}
            {station === "anticomp"     && <AnticompStation   onComplete={() => markDone("anticomp")}     />}
            {station === "natmonreg"    && <NatMonRegStation  onComplete={() => markDone("natmonreg")}    />}
            {station === "deregulation" && <DeregStation      onComplete={() => markDone("deregulation")} />}
          </div>
        )}

        {station === "quiz" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
  
              <h2 className="text-base font-bold text-foreground">🎯 Chapter 11 Quiz</h2>
            </div>
            <QuizStation
              onPass={(score, results) => { setQuizScore(score); setQuizResults(results); try { localStorage.setItem("econlab211_done_ch11", "true"); } catch (_) {} setStation("results"); }}
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
