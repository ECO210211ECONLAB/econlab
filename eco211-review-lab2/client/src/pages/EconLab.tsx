import { useState, useRef } from "react";
import { ChevronLeft, Award, RotateCcw, BookOpen } from "lucide-react";

type Section = "intro" | "externalities" | "envtools" | "goodstype" | "innovation" | "quiz" | "results" | "not-yet";

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
  { ch: "Ch12", title: "Environmental Protection & Negative Externalities", bullets: [
    "Externality = spillover to third parties not in the transaction",
    "Negative externality: social cost > private cost → overproduction",
    "Command-and-control: sets limits/technology — inflexible, no incentive to go beyond",
    "Pollution charge: tax per unit — firms reduce where abatement < tax",
    "Cap-and-trade: total cap + tradeable permits — same goal, lower total cost",
    "Coase Theorem: clear property rights + low bargaining costs → private solution",
    "Optimal pollution: MB of reduction = MC of reduction (NOT zero)",
    "Global externalities (climate) require international cooperation",
  ]},
  { ch: "Ch13", title: "Positive Externalities & Public Goods", bullets: [
    "Positive externality: social benefit > private benefit → underproduction",
    "Innovation spillovers → markets underinvest in R&D",
    "Gov. tools: patents, direct R&D funding, R&E tax credits, university partnerships",
    "Public good: non-excludable + non-rival (defense, lighthouse, clean air)",
    "Club good: excludable + non-rival (Netflix, gym, cable TV)",
    "Common good: non-excludable + rival (ocean fish, groundwater) → tragedy of commons",
    "Private good: excludable + rival (pizza, shoes, clothing)",
    "Free rider problem: can't exclude non-payers → underprovision",
    "Solutions: government taxation, indirect markets, social pressure, technology",
  ]},
];

function ReferenceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="ref-title">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 id="ref-title" className="text-lg font-bold text-foreground">📚 Ch12–13 Quick Reference</h2>
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

// ─── Section 1: Externalities Classifier ───
type ExtType = "negative" | "positive" | "none";
const EXT_LABELS: Record<ExtType, string> = { negative: "Negative Externality", positive: "Positive Externality", none: "No Externality" };
const EXT_COLORS: Record<ExtType, string> = { negative: "border-red-400 bg-red-50 text-red-800", positive: "border-green-500 bg-green-50 text-green-800", none: "border-blue-400 bg-blue-50 text-blue-800" };

const EXT_ITEMS = [
  { name: "A power plant emits mercury into a river used by downstream communities", correct: "negative" as ExtType, exp: "Classic negative externality. The power plant's production imposes health and ecosystem costs on people who had no role in the electricity transaction." },
  { name: "Basic medical research at a university produces new knowledge", correct: "positive" as ExtType, exp: "Positive externality. New knowledge is non-excludable — other researchers, firms, and society build on it for free. This is why governments fund basic research." },
  { name: "A construction firm buys and uses cement", correct: "none" as ExtType, exp: "No externality. The purchase is between the firm and the supplier — no cost or benefit spills over to uninvolved third parties." },
  { name: "A beekeeper's bees pollinate neighboring apple orchards", correct: "positive" as ExtType, exp: "Positive externality. The beekeeper keeps bees for honey but the neighboring orchard gets free pollination — a spillover benefit to a third party." },
  { name: "Automobile exhaust contributes to urban smog", correct: "negative" as ExtType, exp: "Negative externality. Each driver's transaction (buying gasoline) imposes pollution costs on pedestrians, cyclists, and urban residents who bear health costs without consent." },
  { name: "A firm purchases office computers for internal use only", correct: "none" as ExtType, exp: "No externality. The transaction and its effects are entirely contained within the firm — no third-party spillover." },
  { name: "You get vaccinated against measles", correct: "positive" as ExtType, exp: "Positive externality (herd immunity). Your vaccination protects not just you but also immunocompromised people around you who cannot be vaccinated." },
  { name: "A logging company clears old-growth forest for timber", correct: "negative" as ExtType, exp: "Negative externality. Habitat destruction, carbon release, and watershed damage impose costs on biodiversity, downstream communities, and future generations." },
];
const ALL_EXT: ExtType[] = ["negative", "positive", "none"];

function ExternalitiesSection({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [choices, setChoices] = useState<Record<string, ExtType | null>>(() => Object.fromEntries(EXT_ITEMS.map(e => [e.name, null])));
  const [checked, setChecked] = useState(false);
  const [marked, setMarked] = useState(false);
  const allChosen = EXT_ITEMS.every(e => choices[e.name] !== null);
  const score = EXT_ITEMS.filter(e => choices[e.name] === e.correct).length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm font-semibold text-primary mb-1">Section 1 — Externality Identifier</p>
        <p className="text-sm text-muted-foreground">Classify each example as a negative externality, positive externality, or no externality. Remember: an externality only exists when a third party NOT involved in the transaction is affected.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_EXT.map(t => <span key={t} className={`px-2 py-1 rounded-full text-xs font-semibold border-2 ${EXT_COLORS[t]}`}>{EXT_LABELS[t]}</span>)}
      </div>
      <div className="space-y-3">
        {EXT_ITEMS.map(ex => {
          const chosen = choices[ex.name];
          const isCorrect = checked && chosen === ex.correct;
          const isWrong = checked && chosen !== null && chosen !== ex.correct;
          return (
            <div key={ex.name} className={`rounded-xl border-2 p-4 transition-all ${checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-300 bg-red-50" : "border-border") : "border-border bg-card"}`}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm text-foreground">{ex.name}</span>
                {checked && isWrong && <span className="text-xs text-red-600 font-semibold">→ {EXT_LABELS[ex.correct]}</span>}
                {checked && isCorrect && <span className="text-xs text-green-700 font-semibold">✓</span>}
              </div>
              <div className="flex flex-wrap gap-1">
                {ALL_EXT.map(t => {
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
              <p className="font-bold text-lg">{score} / {EXT_ITEMS.length}</p>
              <p className="text-sm text-muted-foreground">{score >= 7 ? "Strong externality instincts!" : "Review the key: a third party must be affected, and they must NOT be part of the original transaction."}</p>
            </div>
            {!marked && <button onClick={() => { setMarked(true); onComplete(score, EXT_ITEMS.length); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>}
            {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Section Complete</p>}
          </div>
      }
    </div>
  );
}

// ─── Section 2: Environmental Policy Tool Application ───
const ENV_SCENARIOS = [
  { q: "The EPA wants to reduce SO₂ emissions from 500 coal power plants by 40% at the lowest possible total cost — allowing plants with cheap cleanup to do more and sell credits to plants with expensive cleanup.", opts: ["Command-and-control: require all 500 plants to cut SO₂ by 40%", "Cap-and-trade: issue permits equal to 60% of current emissions, let plants buy/sell", "Pollution charge: tax each ton of SO₂ emitted", "Coase Theorem: negotiate between each plant and affected communities"], correct: 1, exp: "Cap-and-trade is ideal for many large, identifiable polluters with varying abatement costs. Plants with cheap cleanup reduce more and sell permits; plants with expensive cleanup buy permits. Same 40% reduction achieved at minimum total cost — the Acid Rain Program proved this works." },
  { q: "A city wants to reduce carbon from household driving, gas stoves, and heating across millions of households — using a price signal that lets each household decide how to reduce their own carbon.", opts: ["Cap-and-trade: issue household driving permits", "Command-and-control: ban all gas stoves", "Pollution charge (carbon tax): tax carbon per unit across all fuel use", "Coase Theorem: homeowners negotiate with utility companies"], correct: 2, exp: "Pollution charges (carbon taxes) work best for millions of small polluters. A price per unit of carbon lets households and businesses reduce wherever it's cheapest for them — driving less, switching appliances, improving insulation — without dictating the method." },
  { q: "A small airport generates noise that disturbs 30 nearby homeowners. Courts have just ruled that homeowners have a legal right to quiet enjoyment of their property. The airport and homeowners know each other and negotiation is easy.", opts: ["Government imposes command-and-control flight restrictions", "Pollution charge: tax each flight by decibel level", "Cap-and-trade noise permits", "Coase Theorem: airport and homeowners negotiate directly — airport buys noise easements or pays for soundproofing"], correct: 3, exp: "Coase Theorem applies when: few parties, clear property rights, low bargaining costs. The homeowners' property rights are now clear; there are only 30 of them. Private negotiation reaches the efficient outcome — no government regulation needed." },
  { q: "EPA analysis shows that reducing particulate pollution from 20 ppm to 10 ppm costs $5B per year but reduces healthcare costs and productivity losses by $15B per year. Is this regulation justified?", opts: ["No — any cost is too high for environmental regulation", "Yes — the benefit ($15B) exceeds the cost ($5B), so the marginal benefit of this reduction exceeds marginal cost", "No — command-and-control always costs more than market-oriented tools", "Yes — all pollution should be reduced to zero regardless of cost"], correct: 1, exp: "Benefit-cost analysis: if MB > MC, the regulation is justified. Here, $15B benefit > $5B cost — the regulation improves social welfare. Environmental regulations should be evaluated this way, not with the assumption that all pollution must be eliminated." },
  { q: "Climate change is caused by CO₂ emitted globally. The U.S. alone cannot solve it — China and India must also reduce emissions. No single country has an incentive to bear full costs while others free ride.", opts: ["The U.S. should act alone — it is the most responsible emitter", "This is a global negative externality requiring international agreements — no single nation can solve it", "Cap-and-trade within the U.S. will solve global climate change", "The Coase Theorem: nations will negotiate the efficient solution without government involvement"], correct: 1, exp: "Global negative externality: CO₂ mixes globally, so the harm and the solution both cross borders. This creates an international prisoner's dilemma — each country benefits if others reduce but has incentive to free ride. International agreements (Paris Agreement) are needed to coordinate action." },
];

function EnvToolsSection({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [scenarios] = useState(() => ENV_SCENARIOS.map(s => { const sh = shuffleOpts(s.opts, s.correct); return { ...s, opts: sh.opts, correct: sh.correct as number }; }));
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(scenarios.length).fill(null));
  const [checked, setChecked] = useState<boolean[]>(Array(scenarios.length).fill(false));
  const [marked, setMarked] = useState(false);
  const q = scenarios[qIdx];
  const ans = answers[qIdx];
  const isChecked = checked[qIdx];
  const allDone = checked.every(Boolean);
  const score = scenarios.filter((s, i) => answers[i] === s.correct).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Scenario {qIdx + 1} of {scenarios.length}</span>
        <div className="flex gap-1">{scenarios.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === qIdx ? "bg-primary" : checked[i] ? (answers[i] === scenarios[i].correct ? "bg-green-500" : "bg-red-400") : "bg-muted"}`} />)}</div>
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
            {qIdx < scenarios.length - 1
              ? <button onClick={() => setQIdx(qIdx + 1)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next →</button>
              : allDone && !marked
                ? <div className="flex-1 space-y-2">
                    <div className="rounded-xl bg-muted p-3 text-center text-sm"><span className="font-bold">{score}/{scenarios.length}</span> correct</div>
                    <button onClick={() => { setMarked(true); onComplete(score, scenarios.length); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
                  </div>
                : marked ? <p className="flex-1 text-center text-green-700 font-semibold text-sm py-3">✓ Section Complete</p> : null
            }
          </div>
      }
    </div>
  );
}

// ─── Section 3: 4 Types of Goods Grand Sorter ───
type GoodType = "private" | "public" | "club" | "common";
const GOOD_LABELS: Record<GoodType, string> = { private: "Private Good", public: "Public Good", club: "Club Good", common: "Common Good" };
const GOOD_COLORS: Record<GoodType, string> = { private: "border-blue-400 bg-blue-50 text-blue-800", public: "border-green-500 bg-green-50 text-green-800", club: "border-purple-400 bg-purple-50 text-purple-800", common: "border-amber-400 bg-amber-50 text-amber-800" };
const GOOD_DEFS: Record<GoodType, string> = { private: "Excludable + Rival", public: "Non-excludable + Non-rival", club: "Excludable + Non-rival", common: "Non-excludable + Rival" };

const GOOD_ITEMS = [
  { name: "GPS navigation system (open to all)", correct: "public" as GoodType, exp: "Public good: anyone with a GPS receiver can use it (non-excludable), and one person's navigation doesn't reduce signal for others (non-rival). Developed by DoD — no private firm would have funded it." },
  { name: "A paid parking garage (limited spaces)", correct: "private" as GoodType, exp: "Private good: non-members can be excluded (payment required) and when your car takes a space, others can't use it (rival — limited capacity)." },
  { name: "Spotify Premium music streaming", correct: "club" as GoodType, exp: "Club good: subscription required (excludable), but one person streaming a song doesn't reduce quality for other subscribers (non-rival until server congestion)." },
  { name: "A wild salmon population in an open ocean fishery", correct: "common" as GoodType, exp: "Common good: any fishing boat can catch salmon (non-excludable), but each salmon caught reduces the population for others (rival). Open access + rivalry = tragedy of commons risk." },
  { name: "National public radio broadcast", correct: "public" as GoodType, exp: "Public good: anyone with a radio receives the signal (non-excludable), and one listener doesn't reduce signal quality for others (non-rival). Classic public good — market underprovides without membership drives or government funding." },
  { name: "A private golf course (membership required)", correct: "club" as GoodType, exp: "Club good: non-members are excluded (membership fee), and the course can accommodate many players simultaneously without degradation (non-rival until overcrowded)." },
  { name: "A city park bench", correct: "public" as GoodType, exp: "Public good (mostly): anyone can sit (non-excludable), and one person sitting doesn't prevent others from using other benches in the park (non-rival). Though a single bench becomes rival when crowded." },
  { name: "A sweater", correct: "private" as GoodType, exp: "Private good: you must buy it (excludable), and your wearing it means no one else can wear the same sweater simultaneously (rival)." },
  { name: "Urban groundwater from a shared aquifer", correct: "common" as GoodType, exp: "Common good: all property owners above the aquifer can pump water (non-excludable), but each gallon pumped depletes what's available for others (rival). Classic tragedy of the commons." },
  { name: "A private university's online course platform (login required)", correct: "club" as GoodType, exp: "Club good: login/enrollment required (excludable), but one student watching a lecture doesn't reduce access for other enrolled students (non-rival)." },
];
const ALL_TYPES: GoodType[] = ["private", "public", "club", "common"];

function GoodsTypeSection({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [choices, setChoices] = useState<Record<string, GoodType | null>>(() => Object.fromEntries(GOOD_ITEMS.map(e => [e.name, null])));
  const [checked, setChecked] = useState(false);
  const [marked, setMarked] = useState(false);
  const allChosen = GOOD_ITEMS.every(e => choices[e.name] !== null);
  const score = GOOD_ITEMS.filter(e => choices[e.name] === e.correct).length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm font-semibold text-primary mb-2">Section 3 — 4 Types of Goods</p>
        <div className="grid grid-cols-2 gap-1.5">
          {ALL_TYPES.map(t => (
            <div key={t} className={`rounded-lg p-2 border-2 ${GOOD_COLORS[t]}`}>
              <p className="text-xs font-bold">{GOOD_LABELS[t]}</p>
              <p className="text-xs opacity-75">{GOOD_DEFS[t]}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {GOOD_ITEMS.map(ex => {
          const chosen = choices[ex.name];
          const isCorrect = checked && chosen === ex.correct;
          const isWrong = checked && chosen !== null && chosen !== ex.correct;
          return (
            <div key={ex.name} className={`rounded-xl border-2 p-4 transition-all ${checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-300 bg-red-50" : "border-border") : "border-border bg-card"}`}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm text-foreground">{ex.name}</span>
                {checked && isWrong && <span className="text-xs text-red-600 font-semibold">→ {GOOD_LABELS[ex.correct]}</span>}
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
                      {GOOD_LABELS[t]}
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
              <p className="font-bold text-lg">{score} / {GOOD_ITEMS.length}</p>
              <p className="text-sm text-muted-foreground">{score >= 9 ? "Excellent — you've mastered all four types!" : "Review the 2×2 grid: ask 'Can someone be excluded?' then 'Does one person's use reduce others'?'"}</p>
            </div>
            {!marked && <button onClick={() => { setMarked(true); onComplete(score, GOOD_ITEMS.length); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>}
            {marked && <p className="text-center text-green-700 font-semibold text-sm">✓ Section Complete</p>}
          </div>
      }
    </div>
  );
}

// ─── Section 4: Innovation & Public Goods Scenarios ───
const INNOV_QS = [
  { q: "A biotech firm develops a new cancer immunotherapy. Without protection, competitors could immediately manufacture generics. Which government policy BEST ensures the firm can recoup its $1B R&D investment?", opts: ["Direct NIH grant after the drug is developed", "Patent protection giving the firm exclusive rights to produce and sell for 20 years", "R&E tax credit on R&D spending", "A university partnership to share research costs"], correct: 1, exp: "Patents are the primary incentive for pharmaceutical innovation. The exclusive right allows the firm to charge above-cost prices long enough to recoup development costs. Without patents, the innovation wouldn't happen — no firm would invest $1B for competitors to immediately copy." },
  { q: "The market produces $30M in R&D for a new technology, but economists estimate the socially optimal investment is $52M. The $22M gap is due to:", opts: ["Government over-regulation of the R&D market", "Positive externalities — the social benefits of the innovation exceed what the firm can capture privately", "Negative externalities from the production process", "Insufficient competition in the product market"], correct: 1, exp: "The R&D investment gap = positive externalities. The firm invests based on private return; the social return (including spillovers to other firms, workers, consumers) is much higher. Government must subsidize the gap through grants, tax credits, or IP protection." },
  { q: "National defense, a lighthouse beacon, and clean air (before pollution) are all public goods because:", opts: ["They are provided by the government", "They are non-excludable (can't prevent use) AND non-rival (one person's use doesn't reduce others')", "They are free to all consumers", "Markets would overproduce them without regulation"], correct: 1, exp: "Public goods: non-excludable + non-rival. The key is both properties together. Government provides them because markets underprovide — free riders benefit without paying, making private provision financially unviable." },
  { q: "The 'tragedy of the commons' most directly applies to which type of resource?", opts: ["National defense (public good)", "Netflix streaming (club good)", "Ocean fisheries (common good — non-excludable + rival)", "A private farm (private good)"], correct: 2, exp: "Tragedy of the commons: non-excludable + rival. With open access, each fisher maximizes their individual catch — collectively leading to overfishing and fishery collapse. Solutions require property rights, quotas, or cooperative management." },
  { q: "Government subsidizes flu vaccinations rather than leaving vaccination entirely to private markets because:", opts: ["Flu shots are a pure public good (non-rival and non-excludable)", "Vaccination generates positive externalities (herd immunity) — social benefits exceed private benefits, so markets underprovide", "Private firms cannot produce vaccines", "Flu vaccination has no private benefit — only social benefit"], correct: 1, exp: "Flu vaccination isn't a pure public good (you can be excluded from getting a shot, and there's a limited supply). But it has large positive externalities — herd immunity protects those who can't be vaccinated. Markets underprovide, justifying subsidies." },
  { q: "The free rider problem explains why markets fail to provide public goods because:", opts: ["Public goods are too costly for any firm to produce profitably", "Since non-payers can't be excluded, individuals have no incentive to pay voluntarily — undermining revenue for providers", "Government regulations prevent private provision of public goods", "Public goods generate negative externalities that reduce demand"], correct: 1, exp: "Free rider problem: rational individuals avoid paying for a good they can use regardless of payment. When many free ride, revenues collapse and the good isn't provided — or is severely underprovided. This is why public goods require non-market solutions." },
];

function InnovationSection({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [scenarios] = useState(() => INNOV_QS.map(s => { const sh = shuffleOpts(s.opts, s.correct); return { ...s, opts: sh.opts, correct: sh.correct as number }; }));
  const [answers, setAnswers] = useState<(number | null)[]>(Array(scenarios.length).fill(null));
  const [checked, setChecked] = useState<boolean[]>(Array(scenarios.length).fill(false));
  const [marked, setMarked] = useState(false);
  const q = scenarios[qIdx];
  const ans = answers[qIdx];
  const isChecked = checked[qIdx];
  const allDone = checked.every(Boolean);
  const score = scenarios.filter((q, i) => answers[i] === q.correct).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Question {qIdx + 1} of {scenarios.length}</span>
        <div className="flex gap-1">{scenarios.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === qIdx ? "bg-primary" : checked[i] ? (answers[i] === scenarios[i].correct ? "bg-green-500" : "bg-red-400") : "bg-muted"}`} />)}</div>
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
            {qIdx < scenarios.length - 1
              ? <button onClick={() => setQIdx(qIdx + 1)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Next →</button>
              : allDone && !marked
                ? <div className="flex-1 space-y-2">
                    <div className="rounded-xl bg-muted p-3 text-center text-sm"><span className="font-bold">{score}/{scenarios.length}</span> correct</div>
                    <button onClick={() => { setMarked(true); onComplete(score, scenarios.length); }} className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition">Mark Complete ✓</button>
                  </div>
                : marked ? <p className="flex-1 text-center text-green-700 font-semibold text-sm py-3">✓ Section Complete</p> : null
            }
          </div>
      }
    </div>
  );
}

// ─── Cumulative Quiz — 15 questions, 13/15 gate ───
const QUIZ_POOL = [
  { q: "A negative externality causes:", opts: ["Underproduction — the market produces too little", "Overproduction — firms ignore social costs and produce too much", "Efficient production — market equilibrium equals social optimum", "Zero production — firms shut down when externalities exist"], correct: 1, multi: false, exp: "Negative externality: social cost > private cost. Firms ignore costs imposed on others, so they produce more than is socially optimal — overproduction, not underproduction." },
  { q: "A positive externality causes:", opts: ["Overproduction — the market produces too much", "Underproduction — private returns are less than social returns, so not enough is produced", "Efficient production at the competitive equilibrium", "No change in output — externalities only affect price"], correct: 1, multi: false, exp: "Positive externality: social benefit > private benefit. Since producers can't capture all the spillover value, they produce less than the socially optimal quantity — underproduction." },
  { q: "Command-and-control regulation's main weakness compared to market-oriented tools is:", opts: ["It completely eliminates pollution", "It provides no incentive to reduce pollution below the legal limit and offers no flexibility in how to reduce", "It is too flexible, allowing firms to choose unsafe cleanup methods", "It automatically adjusts to changing environmental conditions"], correct: 1, multi: false, exp: "C&C: once a firm meets the standard, there is zero incentive to do better. All firms face the same standard regardless of their different abatement costs — inefficient. Market tools provide continuous incentives and flexibility." },
  { q: "In a cap-and-trade system, the environmental goal is achieved at lower cost than uniform C&C because:", opts: ["All firms are required to reduce by the same amount", "Firms with cheap abatement do more and sell permits; firms with expensive abatement buy permits — pollution cuts happen where they're cheapest", "The government sets the permit price equal to the marginal cost of pollution", "Permits eliminate all pollution at no cost"], correct: 1, multi: false, exp: "Cap-and-trade achieves cost-effectiveness through permit trading. Low-cost abaters reduce beyond their cap and earn revenue selling permits; high-cost abaters buy permits instead of expensive cleanup. Same total reduction, lower total cost — efficiency through market allocation." },
  { q: "The Coase Theorem works BEST when:", opts: ["Millions of parties are affected by the externality", "Borders are crossed and international law applies", "Property rights are clear, parties are few, and bargaining costs are low", "Government sets the optimal pollution tax level"], correct: 2, multi: false, exp: "Coase Theorem: private bargaining reaches efficient outcome when: (1) property rights are clearly defined, (2) few parties involved, (3) transaction costs are low. Fails for global problems (climate change) with millions of parties." },
  { q: "Optimal pollution is NOT zero because:", opts: ["Zero pollution would mean zero production — eliminating all output to eliminate all pollution is too costly", "Pollution charges can never reduce pollution to zero", "Command-and-control laws require some baseline pollution level", "No country has ever achieved zero pollution"], correct: 0, multi: false, exp: "Optimal pollution: reduce until MB = MC of abatement. Beyond that point, the cost of further cleanup exceeds the benefit. Zero pollution = zero production in most industries — obviously too extreme. Society accepts some pollution in exchange for the output it enables." },
  { q: "A public good is characterized by:", opts: ["Being excludable and rival", "Being non-excludable (cannot prevent use) AND non-rival (one's use doesn't reduce others')", "Being provided exclusively by government", "Being free of charge to all consumers"], correct: 1, multi: false, exp: "Public good: non-excludable + non-rival. These two properties together cause market underprovision. Non-excludability enables free riding; non-rivalry means there's no congestion cost to letting free riders use it." },
  { q: "Which is a CLUB good?", opts: ["National defense", "Ocean fisheries", "Netflix streaming subscription", "Groundwater from a shared aquifer"], correct: 2, multi: false, exp: "Club good: excludable (subscription required) + non-rival (one person streaming doesn't reduce quality for others). National defense = public good. Ocean fisheries = common good. Groundwater = common good." },
  { q: "The tragedy of the commons occurs with:", opts: ["Public goods (non-excludable + non-rival)", "Club goods (excludable + non-rival)", "Common goods (non-excludable + rival) — open access leads to overuse and depletion", "Private goods (excludable + rival)"], correct: 2, multi: false, exp: "Tragedy of the commons: non-excludable + rival. Open access means anyone can use the resource; rivalry means each use depletes it for others. Result: individually rational overuse → collective collapse. Ocean fisheries, groundwater, congested roads." },
  { q: "Markets underinvest in R&D because:", opts: ["R&D is too risky for any firm", "Innovators capture only a fraction of total social benefits — the rest spills over to others who didn't pay", "Government prohibits private R&D investment", "R&D never generates positive returns"], correct: 1, multi: false, exp: "Innovation positive externality: new knowledge, technologies, and processes benefit society well beyond what the inventor captures. Since private return < social return, the market provides less R&D than is socially optimal — justifying government intervention." },
  { q: "The free rider problem arises because:", opts: ["Public goods are too expensive for individuals to purchase", "Since non-payers can't be excluded from a public good, individuals rationally avoid paying — undermining private provision", "Government regulations discourage private provision of public goods", "Free riders generate negative externalities for paying users"], correct: 1, multi: false, exp: "Free rider: if you can benefit without paying (non-excludable), rational behavior is not to pay. When many free ride, providers can't cover costs and don't supply the good — markets underprovide public goods." },
  { q: "Governments subsidize education because:", opts: ["Education is a pure public good (non-excludable, non-rival)", "Education generates large positive externalities — social benefits far exceed private returns, so markets underprovide", "Private firms are legally prohibited from providing education", "Education reduces GDP and must be incentivized"], correct: 1, multi: false, exp: "Education has large positive externalities (lower crime, better health, more innovation, democratic stability). Private markets underprovide because students don't capture all the social value they create. Subsidies bring provision closer to the social optimum." },
  { q: "Which of the following correctly describe positive externalities? (Select all that apply)", opts: ["Social benefits exceed private benefits", "Markets overproduce goods with positive externalities", "Inventors capture only part of the total value their innovations create", "Government subsidies can help correct the underproduction"], correct: [0, 2, 3], multi: true, exp: "Positive externalities: social > private benefits (correct); markets UNDERPRODUCE (not overproduce) — wrong answer; inventors capture only fraction of value (correct, that's why they underinvest); subsidies correct underproduction (correct)." },
  { q: "Which of the following are examples of COMMON goods? (Select all that apply)", opts: ["Wild fish in international waters", "A highway during rush hour (congested, no toll)", "Spotify music streaming", "Groundwater in a shared rural aquifer"], correct: [0, 1, 3], multi: true, exp: "Common goods: non-excludable + rival. Wild ocean fish (open access, finite), congested highway (open access, each car slows others), shared groundwater (open access, each gallon depletes supply) — all common goods. Spotify = club good (excludable subscription)." },
  { q: "Which government tools can help solve the market failure caused by positive externalities from innovation? (Select all that apply)", opts: ["Patent protection (exclusive rights for limited period)", "Direct government R&D funding (universities, national labs)", "Command-and-control regulations on innovation output", "R&E tax credits on firm R&D spending"], correct: [0, 1, 3], multi: true, exp: "Positive externality from innovation → underinvestment. Solutions: patents (give inventors more of the social value), direct funding (government pays for R&D with broad benefits), R&E tax credits (reduce cost of private R&D). Command-and-control regulates pollution — not a tool for encouraging innovation." },
];


// ─── Quiz Bank (Ch12–13, 15 questions) ───────────────────────────────────────
type QA = { q: string; opts: string[]; correct: number; multi?: boolean; exp: string };

const QUIZ_QUESTIONS: QA[] = [
  { q: "A negative externality occurs when:", opts: ["A firm earns more profit than expected", "A transaction imposes costs on a third party not involved in the exchange", "A consumer pays more than their willingness to pay", "A firm produces below the socially optimal quantity"], correct: 1, exp: "Negative externalities are spillover costs borne by third parties. The classic example: a factory pollutes a river, imposing costs on downstream communities who didn't agree to the transaction." },
  { q: "When negative externalities exist, the free market produces:", opts: ["Less than the socially optimal quantity", "More than the socially optimal quantity", "Exactly the socially optimal quantity", "Zero output"], correct: 1, exp: "Negative externalities: private costs < social costs. Firms ignore the external cost, so they overproduce relative to the social optimum. The market quantity > efficient quantity." },
  { q: "A Pigouvian tax on pollution is designed to:", opts: ["Generate government revenue to clean up pollution directly", "Internalize the negative externality by raising the private cost equal to the social cost", "Ban pollution entirely", "Subsidize firms that don't pollute"], correct: 1, exp: "A Pigouvian tax = the marginal external cost. It makes the polluter pay the full social cost of their activity, aligning private and social incentives without banning production." },
  { q: "Command-and-control regulation sets:", opts: ["A price on pollution based on its social cost", "Specific limits or standards (e.g., emission caps) that firms must meet", "Voluntary targets firms are encouraged to hit", "Taxes on consumers who buy polluting products"], correct: 1, exp: "Command-and-control: direct regulation specifying what firms must do (e.g., install scrubbers, cap emissions at X tons). It's less flexible than market-based approaches but can guarantee specific outcomes." },
  { q: "A cap-and-trade system for pollution works by:", opts: ["Taxing all firms equally regardless of their pollution level", "Setting a total pollution cap and allowing firms to buy and sell pollution permits", "Banning the most polluting firms from operating", "Requiring all firms to use the same clean technology"], correct: 1, exp: "Cap-and-trade: the government sets a total cap and issues permits. Firms that can reduce pollution cheaply do so and sell excess permits; firms with high abatement costs buy permits. Pollution is reduced at minimum total cost." },
  { q: "The socially optimal level of pollution is:", opts: ["Zero — all pollution should be eliminated", "Where the Marginal Cost of abatement equals the Marginal Benefit of abatement", "Whatever level the market produces naturally", "As much as possible, since production benefits the economy"], correct: 1, exp: "Socially optimal pollution: MC of reducing pollution = MB of reducing pollution. Going to zero pollution is usually too costly; the last unit of cleanup costs more than the benefit it provides." },
  { q: "A positive externality in education means that:", opts: ["Students earn higher wages after graduating", "Society as a whole benefits beyond just the individual student — creating external benefits", "Schools make a profit from tuition", "Education reduces negative externalities from pollution"], correct: 1, exp: "Positive externalities in education: an educated workforce benefits employers, reduces crime, improves civic participation, and generates innovation — all benefits beyond what the individual student captures in their own wages." },
  { q: "When positive externalities exist, the free market produces:", opts: ["More than the socially optimal quantity", "Less than the socially optimal quantity", "Exactly the socially optimal quantity", "The same quantity regardless of externalities"], correct: 1, exp: "Positive externalities: private benefits < social benefits. Individuals ignore the external benefits they create, so they underproduce relative to the social optimum. Government subsidies can correct this." },
  { q: "A public good is characterized by:", opts: ["Being provided only by the government", "Being non-excludable and non-rival in consumption", "High production costs that prevent private provision", "Being available only to those who pay"], correct: 1, exp: "Public goods: non-excludable (can't prevent non-payers from consuming) AND non-rival (one person's consumption doesn't reduce availability for others). Examples: national defense, lighthouses, fireworks." },
  { q: "The free-rider problem occurs because:", opts: ["Prices are set too high by monopolists", "Non-excludable goods can be consumed without paying — reducing private incentive to provide them", "Public goods are too expensive to produce efficiently", "Government subsidies crowd out private investment"], correct: 1, exp: "Free-rider: once a public good is provided, non-payers can consume it. Knowing this, individuals underreport their true willingness to pay and wait for others to fund it — leading to underprovision." },
  { q: "Which of the following is a public good?", opts: ["A movie shown in a theater", "A cable TV subscription", "National defense", "A toll road"], correct: 2, exp: "National defense: non-excludable (protects everyone in the country) and non-rival (protecting one person doesn't reduce protection for others). Theater movies are excludable; cable is excludable; toll roads exclude non-payers." },
  { q: "Markets underinvest in basic research (R&D) because:", opts: ["Research is always unprofitable", "Knowledge is a public good — once discovered, others can use it without paying", "The government bans private R&D spending", "Researchers prefer to work for universities"], correct: 1, exp: "Knowledge spillovers: once basic research is published, competitors can use the findings without compensating the inventor. The private return < social return → underinvestment. This justifies government funding of basic research." },
  { q: "Patents address the underinvestment in innovation by:", opts: ["Taxing firms that copy innovations", "Granting temporary monopoly rights so innovators can earn returns on R&D", "Requiring firms to publish all research findings immediately", "Subsidizing all firms in innovative industries"], correct: 1, exp: "A patent grants 20 years of exclusive rights. This lets the innovator charge above-competitive prices long enough to recoup R&D costs — creating an incentive to innovate in the first place. The trade-off: temporary monopoly power vs. dynamic innovation." },
  { q: "Command-and-control regulation is preferred over market-based tools when:", opts: ["Flexibility across firms is most important", "Precise, guaranteed outcomes are needed (e.g., eliminating a highly toxic substance entirely)", "The government wants firms to find the lowest-cost solution", "Pollution is evenly distributed across many firms"], correct: 1, exp: "Command-and-control excels when society needs certainty — like banning a specific carcinogen. Market-based tools are more efficient when total pollution reduction matters more than which specific firms reduce it." },
  { q: "Which policy tool directly subsidizes positive externalities?", opts: ["A Pigouvian tax on the activity", "A per-unit subsidy equal to the marginal external benefit", "A cap-and-trade permit system", "A command-and-control standard"], correct: 1, exp: "A Pigouvian subsidy = marginal external benefit. It lowers the private cost by the external benefit amount, inducing producers/consumers to increase the activity to the socially optimal level." },
];

function QuizStation({ onPass, onFail }: { onPass: (score: number, results: { correct: boolean; exp: string }[]) => void; onFail: (score: number, results: { correct: boolean; exp: string }[]) => void }) {
  const [questions] = useState(() => shuffle(QUIZ_QUESTIONS).map(q => { const s = shuffleOpts(q.opts, q.correct); return { ...q, opts: s.opts, correct: s.correct }; }));
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const q = questions[currentQ];
  const isChecked = !!checked[currentQ];
  const isCorrect = isChecked && answers[currentQ] === q.correct;

  function hasSelection(qi: number): boolean {
    const given = answers[qi];
    if (questions[qi].multi) return Array.isArray(given) && (given as number[]).length > 0;
    return given !== undefined;
  }

  function handleSelect(oi: number) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [currentQ]: oi }));
  }

  function handleToggle(oi: number) {
    if (isChecked) return;
    setAnswers(prev => {
      const curr = (prev[currentQ] as number[] | undefined) ?? [];
      return { ...prev, [currentQ]: curr.includes(oi) ? curr.filter(x => x !== oi) : [...curr, oi] };
    });
  }

  function handleCheck() {
    if (!hasSelection(currentQ)) return;
    setChecked(prev => ({ ...prev, [currentQ]: true }));
  }

  function isAnswerCorrect(qi: number): boolean {
    const question = questions[qi];
    const given = answers[qi];
    if (question.multi) {
      const correct = (question.correct as number[]).slice().sort().join(",");
      const userArr = Array.isArray(given) ? (given as number[]).slice().sort().join(",") : "";
      return correct === userArr;
    }
    return given === question.correct;
  }

  const allAnswered = questions.every((_, i) => hasSelection(i));
  const score = questions.filter((_, i) => isAnswerCorrect(i)).length;

  function handleSubmit() {
    const results = questions.map((q, i) => ({
      correct: answers[i] === q.correct,
      exp: q.exp,
    }));
    if (score >= 13) onPass(score, results);
    else onFail(score, results);
  }

  function navDotStyle(i: number): string {
    if (i === currentQ) return "bg-primary";
    if (checked[i]) return isAnswerCorrect(i) ? "bg-emerald-400" : "bg-red-400";
    if (hasSelection(i)) return "bg-primary/40";
    return "bg-muted";
  }

  function optionStyle(i: number): string {
    const userAnswer = answers[currentQ];
    const isSelected = q.multi ? (Array.isArray(userAnswer) && (userAnswer as number[]).includes(i)) : userAnswer === i;
    const isCorrectOpt = q.multi ? (q.correct as number[]).includes(i) : q.correct === i;
    if (!isChecked) return isSelected ? "bg-primary/10 border-primary text-foreground" : "border-border text-foreground hover:border-primary/40";
    if (isCorrectOpt) return "bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-300";
    if (isSelected && !isCorrectOpt) return "bg-red-50 border-red-300 text-red-800";
    return "border-border text-foreground opacity-50";
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Question {currentQ + 1} of {questions.length}</span>
        <span className="text-xs text-muted-foreground">{Object.keys(checked).length} / {questions.length} checked</span>
      </div>

      <div className="flex gap-1.5">
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
            return (
              <button key={i} onClick={() => q.multi ? handleToggle(i) : handleSelect(i)} disabled={isChecked}
                className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${optionStyle(i)} ${isChecked ? "cursor-default" : ""}`}>
                <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>
        {!isChecked && hasSelection(currentQ) && (
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
          className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          ← Previous
        </button>
        {currentQ < questions.length - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)}
            className="text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Question →
          </button>
        ) : allAnswered ? (
          <button onClick={handleSubmit}
            className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all">
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
        <p className="text-amber-700 font-medium">You scored {score} out of 15.</p>
        <p className="text-sm text-amber-700">Mastery requires 13 out of 15. Review the sections and use the Quick Reference if needed.</p>
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 text-sm text-amber-800 font-semibold">This screen cannot be submitted. Only the final Results screen counts.</div>
        <button onClick={onRetry} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition"><RotateCcw className="inline w-4 h-4 mr-2" />Retry Quiz</button>
      </div>
    </div>
  );
}

function ResultsScreen({ score, name, setName, onRetry, sectionScores, quizResults }: {
  score: number; name: string; setName: (n: string) => void; onRetry: () => void;
  sectionScores: Record<string, { score: number; total: number }>;
  quizResults: { correct: boolean; exp: string }[];
}) {
  const SECTION_LABELS: Record<string,string> = { externalities:"Externalities", envtools:"Policy Tools", goodstype:"Types of Goods", innovation:"Innovation & Public Goods" };
  function handlePrint() {
    const w = window.open("", "_blank", "width=820,height=960");
    if (!w) return;
    const now = new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
    const sectionRows = Object.entries(sectionScores).map(([id,s]) =>
      `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0">${SECTION_LABELS[id]||id}</td><td style="padding:6px 10px;border:1px solid #e2e8f0;text-align:center;font-weight:bold;color:${s.score===s.total?"#16a34a":"#475569"}">${s.score}/${s.total}</td></tr>`
    ).join("");
    const quizRows = quizResults.map((r,i) =>
      `<tr style="background:${r.correct?"#f0fdf4":"#fef2f2"}">
        <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;font-weight:bold;color:${r.correct?"#16a34a":"#dc2626"}">${r.correct?"✓":"✗"}</td>
        <td style="padding:8px;border:1px solid #e2e8f0;font-size:11px;color:#475569">Q${i+1}: ${r.exp}</td>
      </tr>`
    ).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>ECO 211 Review Lab 3 Results</title>
    <style>body{font-family:Arial,sans-serif;max-width:720px;margin:40px auto;color:#1e293b;padding:0 20px}h1{font-size:1.4rem;color:#1a2744;border-bottom:3px solid #1a2744;padding-bottom:8px}h2{font-size:1rem;color:#1a2744;margin-top:24px}table{width:100%;border-collapse:collapse;margin-top:8px}th{background:#1a2744;color:white;padding:8px 10px;text-align:left;font-size:12px}.footer{margin-top:40px;font-size:.75rem;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px}</style>
    </head><body>
    <h1>ECO 211 ECONLAB — Review Lab 3: Chapters 12–13</h1>
    <p><strong>Student:</strong> ${name||"—"} &nbsp;&nbsp; <strong>Date:</strong> ${now}</p>
    <p><strong>Quiz Score:</strong> ${score}/15 &nbsp;&nbsp; <strong>Status:</strong> ${score>=13?"✓ Mastery Achieved":"Needs Review"}</p>
    <h2>Station Scores</h2>
    <table><thead><tr><th>Station</th><th style="width:80px;text-align:center">Score</th></tr></thead><tbody>${sectionRows}</tbody></table>
    <h2>Quiz Question Review (15 Questions)</h2>
    <table><thead><tr><th style="width:30px"></th><th>Explanation</th></tr></thead><tbody>${quizRows}</tbody></table>
    <div class="footer">ECO 211 ECONLAB · Review Lab 3: Chapters 12–13 · Access for free at https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction</div>
    </body></html>`);
    w.document.close(); setTimeout(() => w.print(), 600);
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-5">
        <div className="text-center">
          <Award className="w-16 h-16 text-green-500 mx-auto mb-3" />
          <p className="text-4xl font-bold text-green-600">{score} / 15</p>
          <p className="text-sm text-muted-foreground mt-1">ECO 211 Review Lab 3 · Chapters 12–13</p>
        </div>
        {Object.keys(sectionScores).length > 0 && (
          <div className="bg-muted rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-foreground">Station Scores</p>
            {[{id:"externalities",label:"Externalities"},{id:"envtools",label:"Policy Tools"},{id:"goodstype",label:"Types of Goods"},{id:"innovation",label:"Innovation & Public Goods"}].map(s => sectionScores[s.id] && (
              <div key={s.id} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{s.label}</span>
                <span className={`font-bold ${sectionScores[s.id].score===sectionScores[s.id].total?"text-green-600":"text-amber-600"}`}>{sectionScores[s.id].score}/{sectionScores[s.id].total}</span>
              </div>
            ))}
          </div>
        )}
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1" htmlFor="student-name">Your Name (required for credit)</label>
          <input id="student-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First and Last Name"
            className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        {quizResults.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <p className="text-xs font-bold text-foreground">Quiz Question Review</p>
            {quizResults.map((r,i) => (
              <div key={i} className={`rounded-xl border p-3 ${r.correct?"border-green-200 bg-green-50":"border-red-200 bg-red-50"}`}>
                <p className={`text-xs font-bold ${r.correct?"text-green-700":"text-red-600"}`}>{r.correct?"✓":"✗"} Q{i+1}</p>
                <p className={`text-xs mt-0.5 ${r.correct?"text-green-700":"text-red-600"}`}>{r.exp}</p>
              </div>
            ))}
          </div>
        )}
        <button onClick={handlePrint} disabled={!name.trim()} className="w-full py-3 rounded-xl bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground font-bold text-sm transition">🖨️ Print / Save as PDF</button>
        <button onClick={onRetry} className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">↺ Start Over</button>
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
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const [sectionScores, setSectionScores] = useState<Record<string, { score: number; total: number }>>({}); 
  const [studentName, setStudentName] = useState("");
  const mainRef = useRef<HTMLDivElement>(null);

  const SECTIONS = [
    { id: "externalities", label: "🌊 Externality Identifier",        short: "Externalities", desc: "Classify 8 examples as negative, positive, or no externality" },
    { id: "envtools",      label: "🔧 Environmental Policy Tool Lab",  short: "Policy Tools",  desc: "5 applied scenarios — choose the best policy tool for each" },
    { id: "goodstype",     label: "📦 4 Types of Goods Sorter",        short: "Goods Types",   desc: "Classify 10 goods across the 2×2 excludability/rivalry grid" },
    { id: "innovation",    label: "💡 Innovation & Public Goods",       short: "Innovation",    desc: "6 applied questions on spillovers, government policy, and public goods" },
  ];

  const allSectionsDone = SECTIONS.every(s => completed.has(s.id));
  function markDone(id: string, score?: number, total?: number) { if (score !== undefined && total !== undefined) setSectionScores(prev => ({ ...prev, [id]: { score, total } })); setCompleted(prev => new Set([...prev, id])); setSection("intro"); }
  function handlePass(score: number, results?: { correct: boolean; exp: string }[]) { setQuizScore(score); if (results) setQuizResults(results); try { localStorage.setItem("econlab211_done_review2", "true"); } catch (_) {} setSection("results"); }
  function handleFail(score: number, results?: { correct: boolean; exp: string }[]) { setQuizScore(score); if (results) setQuizResults(results); setSection("not-yet"); }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {section === "not-yet" && <NotYetScreen score={quizScore} onRetry={() => setSection("quiz")} />}
      {section === "results" && <ResultsScreen score={quizScore} name={studentName} setName={setStudentName} onRetry={() => { setQuizScore(0); setCompleted(new Set()); setSection("intro"); }} sectionScores={sectionScores} quizResults={quizResults} />}
      {section !== "results" && section !== "not-yet" && (<>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded z-50">Skip to main content</a>
      {showRef && <ReferenceModal onClose={() => setShowRef(false)} />}

      <header style={{ backgroundColor: "hsl(222,42%,19%)" }} className="text-white px-4 py-3 shadow-lg sticky top-0 z-50" role="banner">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">ECO 211 ECONLAB</p>
              <p className="text-sm font-bold text-white truncate">Review Lab 3 · Chapters 12–13</p>
            </div>
            <a href="https://www.perplexity.ai/computer/a/eco-211-econlab-course-hub-h76o7OX6SpisjlWADnIRGg" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex text-white/80 hover:text-white text-xs font-medium whitespace-nowrap items-center gap-1 transition shrink-0">
              <ChevronLeft className="w-3.5 h-3.5" />Course Hub
            </a>
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
            {allSectionsDone
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
                  <p className="text-xl font-bold text-foreground">Chapters 12–13</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">You've completed the market failure cluster — negative externalities, positive externalities, public goods, and the tools governments use to correct them. This review synthesizes both chapters before you move forward.</p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {["Ch12 Environmental Protection & Negative Externalities", "Ch13 Positive Externalities & Public Goods"].map((ch, i) => (
                  <div key={i} className="bg-white rounded-lg p-2 text-center border border-border">
                    <p className="text-xs font-semibold text-primary">{ch}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowRef(true)} className="w-full text-left rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 transition flex items-center gap-2">
              <BookOpen size={16} className="text-primary shrink-0" />
              <span>Need a refresher? <span className="text-primary font-semibold underline">Open the Ch12–13 Quick Reference.</span></span>
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
            {allSectionsDone
              ? <button onClick={() => setSection("quiz")} className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-base transition flex items-center justify-center gap-2">
                  <Award size={20} /> Take the Cumulative Quiz (15 Questions)
                </button>
              : <div className="w-full py-4 bg-muted text-muted-foreground/60 rounded-xl font-bold text-base text-center">🔒 Quiz — Complete all sections to unlock · 13/15 required for mastery</div>
            }
          </div>
        )}

        {section !== "intro" && section !== "quiz" && section !== "not-yet" && section !== "results" && (
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
            {section === "externalities" && <ExternalitiesSection onComplete={(sc,t) => markDone("externalities",sc,t)} />}
            {section === "envtools"      && <EnvToolsSection      onComplete={(sc,t) => markDone("envtools",sc,t)}      />}
            {section === "goodstype"     && <GoodsTypeSection      onComplete={(sc,t) => markDone("goodstype",sc,t)}     />}
            {section === "innovation"    && <InnovationSection     onComplete={(sc,t) => markDone("innovation",sc,t)}    />}
          </div>
        )}

        {section === "quiz" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">

              <button onClick={() => setShowRef(true)} className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-border text-muted-foreground hover:border-primary/40 transition">📚 Quick Ref</button>
              <h2 className="text-base font-bold text-foreground">🎯 Cumulative Quiz — Chapters 12–13</h2>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-xs text-amber-800 font-semibold">
              15 questions drawn from the Ch12–13 bank. Mastery = 13/15 correct.
            </div>
            <QuizStation
              onPass={(score, results) => handlePass(score, results)}
              onFail={(score, results) => handleFail(score, results)}
            />
          </div>
        )}
      </main>
    </>)}
    </div>
  );
}
