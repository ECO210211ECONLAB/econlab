import { useState, useRef } from "react";
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, Award, BarChart2, ShoppingCart, TrendingUp, BookOpen, RotateCcw, Zap } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "recap" | "basket" | "cpi" | "history" | "winners" | "deflation" | "fedtarget" | "fredchart" | "quiz" | "results" | "not-yet";

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

// Station 1 — Basket Builder
const BASKET_ITEMS = [
  { id: 1, name: "Rent / Housing", emoji: "🏠", actualWeight: 42, category: "Housing" },
  { id: 2, name: "Car & Gas", emoji: "🚗", actualWeight: 15, category: "Transportation" },
  { id: 3, name: "Groceries & Dining", emoji: "🍔", actualWeight: 15, category: "Food & Beverages" },
  { id: 4, name: "Doctor & Hospital", emoji: "💊", actualWeight: 9, category: "Medical Care" },
  { id: 5, name: "Tuition & Books", emoji: "🎓", actualWeight: 7, category: "Education & Comm." },
  { id: 6, name: "Streaming & Hobbies", emoji: "🎮", actualWeight: 6, category: "Recreation" },
  { id: 7, name: "Clothing & Shoes", emoji: "👟", actualWeight: 3, category: "Apparel" },
  { id: 8, name: "Toiletries & Misc.", emoji: "🧴", actualWeight: 3, category: "Other" },
];

// Station 2 — CPI Calculator
const CPI_PROBLEMS = [
  {
    id: 1,
    title: "Simple 3-Item Basket",
    context: "Milltown tracks inflation with just three items. In the base year the basket cost $200. This year it costs $214.",
    baseYear: 100,
    baseCost: 200,
    currentCost: 214,
    items: [
      { name: "Rent", basePrice: 100, currentPrice: 107, qty: 1 },
      { name: "Groceries", basePrice: 60, currentPrice: 64, qty: 1 },
      { name: "Gas", basePrice: 40, currentPrice: 43, qty: 1 },
    ],
    correctCPI: 107.0,
    correctInflation: 7.0,
  },
  {
    id: 2,
    title: "Real CPI Example",
    context: "The BLS reported CPI of 313.1 in June 2024 and 321.5 in June 2025. What was the annual inflation rate?",
    baseYear: null,
    baseCost: null,
    currentCost: null,
    items: [],
    priorCPI: 313.1,
    currentCPI: 321.5,
    correctCPI: 321.5,
    correctInflation: 2.7,
    isCPIToInflation: true,
  },
];

// Station 3 — History Timeline
const HISTORY_EPISODES = [
  {
    id: "postWW1",
    year: "1918–1920",
    label: "Post-WWI Spike",
    rate: 20,
    color: "#ef4444",
    cause: "demand",
    summary: "After WWI, pent-up consumer demand exploded and government spending wound down slowly. Prices surged ~20% as too many dollars chased too few goods. The Fed raised rates sharply, triggering the short but severe recession of 1920–21.",
    tag: "Demand Surge",
  },
  {
    id: "depression",
    year: "1930s",
    label: "Great Depression Deflation",
    rate: -10,
    color: "#3b82f6",
    cause: "demand collapse",
    summary: "Deflation of ~10% as demand collapsed after the 1929 crash. Consumers delayed purchases expecting cheaper prices tomorrow — which made things worse. Banks failed, firms cut prices and wages, unemployment hit ~25%. A classic deflationary spiral.",
    tag: "Demand Collapse",
  },
  {
    id: "postWW2",
    year: "1946–1948",
    label: "Post-WWII Surge",
    rate: 14,
    color: "#f97316",
    cause: "demand + supply",
    summary: "WWII price controls lifted. Soldiers returned, married, and spent. Meanwhile factories were converting back from war production. Demand hit supply hard — inflation hit 14%. The Fed and Treasury struggled over how aggressively to respond.",
    tag: "Controls Lifted",
  },
  {
    id: "stagflation",
    year: "1970s",
    label: "Great Inflation / Stagflation",
    rate: 13,
    color: "#dc2626",
    cause: "supply shock + policy",
    summary: "Two OPEC oil shocks (1973, 1979) combined with expansionary monetary policy. Inflation hit 13% while unemployment was also high — 'stagflation,' which standard theory said was impossible. The Fed under Arthur Burns was slow to act, fearing recession.",
    tag: "Oil Shock + Policy",
  },
  {
    id: "volcker",
    year: "1980–1982",
    label: "Volcker Disinflation",
    rate: 3,
    color: "#22c55e",
    cause: "tight money",
    summary: "Fed Chair Paul Volcker raised interest rates to nearly 20% to break inflation. It worked — inflation fell from 13% to 3% — but at enormous cost: the worst recession since the Depression, with unemployment hitting 10.8%. A masterclass in the painful tradeoffs of monetary policy.",
    tag: "Tight Money",
  },
  {
    id: "moderation",
    year: "1990–2020",
    label: "Great Moderation",
    rate: 2.5,
    color: "#22c55e",
    cause: "credible policy",
    summary: "Thirty years of inflation near 2–3%. Central bank independence, credible inflation targets, and globalization (cheap imports) all contributed. Many economists worried inflation was dead — which made the 2021 surge even more surprising.",
    tag: "Stable Era",
  },
  {
    id: "covid",
    year: "2021–2022",
    label: "Post-COVID Surge",
    rate: 9,
    color: "#ef4444",
    cause: "demand + supply + money",
    summary: "The perfect storm: demand surged (stimulus checks, reopening), supply chains were still broken (chips, shipping), and the Fed had massively expanded the money supply. CPI hit 9.1% in June 2022 — the highest since 1981. The Fed raised rates 11 times in 2022–23 to bring it down.",
    tag: "Triple Shock",
  },
];

// Station 4 — Winners & Losers
type WLCategory = "hurt" | "helped" | "depends" | null;
const WL_CARDS = [
  { id: 1, scenario: "Maya borrowed $20,000 at a fixed 3% rate to start her business. Inflation surged to 8%.", answer: "helped" as WLCategory, explanation: "Her real interest rate is 3% − 8% = −5%. She's effectively being paid to borrow — repaying in dollars worth much less than she borrowed." },
  { id: 2, scenario: "Carlos retired with a fixed pension of $3,000/month. No COLA included.", answer: "hurt" as WLCategory, explanation: "His nominal income is frozen while grocery bills, utilities, and healthcare rise every year. His purchasing power erodes steadily." },
  { id: 3, scenario: "Priya has $50,000 in a savings account earning 1.5% interest. Inflation is 6%.", answer: "hurt" as WLCategory, explanation: "Real return = 1.5% − 6% = −4.5%. Her money loses purchasing power every year even though her balance grows in dollar terms." },
  { id: 4, scenario: "Devon bought a house in 2015 with a 30-year fixed mortgage at 3.5%. Inflation is now 7%.", answer: "helped" as WLCategory, explanation: "His monthly payment is fixed while the home's value and rents around him rise. He's paying back cheaper dollars, and his asset is appreciating." },
  { id: 5, scenario: "Anika is a landlord whose leases expire annually and can be repriced.", answer: "helped" as WLCategory, explanation: "She resets rents to market rates each year, keeping pace with or beating inflation. Housing is one of the largest CPI components for a reason." },
  { id: 6, scenario: "James lent his friend $10,000 at 2% for 5 years. Inflation averaged 6% during that time.", answer: "hurt" as WLCategory, explanation: "Real return = 2% − 6% = −4% per year. He received back dollars worth significantly less in real terms. Lenders lose when inflation exceeds loan rates." },
  { id: 7, scenario: "A union worker with a COLA clause in their contract during a period of 5% inflation.", answer: "depends" as WLCategory, explanation: "It depends on the COLA terms. If the clause fully adjusts wages to match inflation, they break even. Partial COLAs still erode real wages. And COLA raises may lag behind actual price increases by months." },
  { id: 8, scenario: "A technology company holding $500M in cash reserves during a period of 6% inflation.", answer: "hurt" as WLCategory, explanation: "Cash is the classic inflation loser. The $500M buys 6% less in real goods and services each year. Companies with large cash holdings face 'cash drag' during inflationary periods." },
];

// Station 5 — Good vs. Bad Deflation
type DeflationType = "good" | "bad" | null;
const DEFLATION_CARDS = [
  { id: 1, scenario: "Flat-screen TV prices fall from $2,000 to $400 over 10 years as manufacturing improves.", answer: "good" as DeflationType, explanation: "Productivity-driven deflation — more TVs are produced at lower cost. Consumers get more value per dollar. This is the 'Bourgeois Deal' McCloskey describes: innovation makes everyone better off." },
  { id: 2, scenario: "During 2008, consumers stopped buying cars and homes because they expected prices to fall further.", answer: "bad" as DeflationType, explanation: "Demand-collapse deflation. When consumers delay spending expecting cheaper prices, firms lose revenue, lay off workers, who then spend less — a deflationary spiral. This made the Great Depression devastating." },
  { id: 3, scenario: "Computing power costs 1/1,000th of what it did 20 years ago due to Moore's Law.", answer: "good" as DeflationType, explanation: "Classic supply-side deflation from technological progress. The same dollar buys enormously more computing power. This enables new industries and raises living standards without causing economic contraction." },
  { id: 4, scenario: "Japan in the 1990s: prices fell slowly for a decade as the economy stagnated and people hoarded cash.", answer: "bad" as DeflationType, explanation: "Japan's 'Lost Decade' showed the trap: with deflation expected, cash becomes the best investment. People save instead of spend. Businesses don't invest. The economy stagnates even with near-zero interest rates — the 'liquidity trap.'" },
  { id: 5, scenario: "Solar panel costs have dropped 90% in 10 years due to manufacturing scale and innovation.", answer: "good" as DeflationType, explanation: "Supply-driven price declines from learning curves and scale economies. The entire energy sector benefits, carbon emissions fall, and consumers pay less for electricity. No demand collapse — just better technology." },
  { id: 6, scenario: "Home prices fell 30% in 2008–2009 as foreclosures flooded the market.", answer: "bad" as DeflationType, explanation: "Asset-price deflation driven by forced selling and collapsing demand. Homeowners saw their net worth evaporate. Banks became insolvent as collateral values plunged. This amplified the financial crisis and nearly caused a second Great Depression." },
];

// Station 6 — Fed 2% Target (slider)
// Handled inline in component

// Station 7 — Quiz
const QUIZ_QUESTIONS: Array<{
  question: string;
  options: string[];
  answer: number | number[];
  multi?: boolean;
  explanation: string;
}> = [
  // Q1–5 standard
  {
    question: "The CPI measures inflation by tracking:",
    options: [
      "The price of a single representative good like a gallon of milk",
      "The weighted average price of a fixed basket of goods and services typical consumers buy",
      "The average wage increase across all industries",
      "The price level of all goods produced in the economy including business inputs",
    ],
    answer: 1,
    explanation: "The CPI tracks a weighted basket of ~80,000 products across categories like housing, food, transportation — weighted by how much consumers actually spend on each category. Housing at 42% dominates because it's most people's biggest expense.",
  },
  {
    question: "Why does housing receive the highest weight (42%) in the CPI basket?",
    options: [
      "The government sets housing weights for political reasons",
      "Housing prices are the most volatile and thus most important to track",
      "Consumers spend more of their income on housing than any other category",
      "The BLS surveys only urban renters, who spend most income on rent",
    ],
    answer: 2,
    explanation: "Weights in the CPI reflect actual spending patterns from the Consumer Expenditure Survey. Since Americans spend more on housing than any other category, it gets the largest weight. The basket reflects reality — not a policy choice.",
  },
  {
    question: "Core CPI excludes food and energy because:",
    options: [
      "Food and energy don't affect most Americans' cost of living",
      "The BLS lacks reliable price data for food and energy",
      "Food and energy prices are highly volatile due to weather and geopolitics, which would obscure the underlying inflation trend",
      "The Fed is legally prohibited from including energy in its inflation measure",
    ],
    answer: 2,
    explanation: "Core CPI strips out noise. A hurricane can spike gas prices for a week — that's not underlying inflation. The Fed uses core CPI to distinguish temporary disruptions from persistent trends. After Hurricane Katrina, headline CPI jumped while core barely moved — correctly signaling a temporary shock.",
  },
  {
    question: "Which of the following is an example of the substitution bias in the CPI?",
    options: [
      "A new iPhone with a better camera costs the same as last year's model",
      "Beef prices rise 20% so consumers buy more chicken, but the CPI basket still assumes old beef quantities",
      "A new streaming service enters the market and isn't included in the CPI yet",
      "Social Security benefits are adjusted annually with a COLA",
    ],
    answer: 1,
    explanation: "Substitution bias: the CPI assumes a fixed basket, but consumers substitute cheaper alternatives when prices rise. If beef gets expensive and people switch to chicken, actual spending rises less than the fixed-basket CPI suggests. The CPI overstates the cost-of-living increase.",
  },
  {
    question: "During a period of unexpected inflation, who benefits most?",
    options: [
      "A retiree on a fixed pension with no COLA",
      "A bank that issued 20-year fixed-rate mortgages last year",
      "A homeowner with a 30-year fixed mortgage bought before inflation surged",
      "A saver with money in a low-interest savings account",
    ],
    answer: 2,
    explanation: "The homeowner wins: their mortgage payment is fixed in nominal terms while their home value rises with inflation. They repay in cheaper dollars. Fixed pensioners, mortgage lenders, and cash savers all lose — their real income or returns fall as prices rise.",
  },
  // Q6–8 harder
  {
    question: "CPI June 2024 = 313.1 and CPI June 2025 = 321.5. What is the approximate annual inflation rate?",
    options: [
      "0.84%",
      "2.7%",
      "8.4%",
      "3.1%",
    ],
    answer: 1,
    explanation: "(321.5 − 313.1) / 313.1 × 100 = 8.4 / 313.1 × 100 ≈ 2.7%. This is the standard CPI inflation formula. The base is the earlier period's CPI, not 100. A common mistake is dividing by 321.5 (the new value) instead of 313.1 (the old value).",
  },
  {
    question: "The 2021–22 inflation surge reached ~9%. Which combination of factors best explains it?",
    options: [
      "Government price controls were removed after the pandemic",
      "OPEC cut oil production, just like in the 1970s",
      "Demand surged from stimulus + supply chains were disrupted + the Fed had expanded the money supply",
      "Wage growth outpaced productivity for the first time since the 1970s",
    ],
    answer: 2,
    explanation: "The 2021–22 surge had three simultaneous causes: demand surged (stimulus checks + reopening), supply was constrained (semiconductor shortages, shipping costs up 5–10x), and the money supply had been greatly expanded. This 'triple shock' was unlike prior inflationary episodes which typically had one dominant cause.",
  },
  {
    question: "Japan's 'Lost Decade' of deflation in the 1990s was harmful primarily because:",
    options: [
      "Japan's export industries were destroyed by cheap Chinese competition",
      "Deflation caused consumers to delay purchases expecting lower prices, reducing demand, causing layoffs and further deflation",
      "The Bank of Japan raised interest rates too aggressively, choking off growth",
      "Deflation was caused by a productivity boom that also eliminated jobs",
    ],
    answer: 1,
    explanation: "Bad deflation creates a self-reinforcing trap: if prices will be lower tomorrow, why buy today? Delayed spending → less revenue → layoffs → less spending → more deflation. Japan's economy stagnated for a decade despite near-zero interest rates, showing how hard deflationary spirals are to escape.",
  },
  // Q9–10 multi-select
  {
    question: "Which of the following are legitimate biases that cause the CPI to OVERSTATE the true cost of living? Select ALL that apply.",
    options: [
      "Substitution bias — consumers switch to cheaper alternatives, but CPI assumes fixed quantities",
      "Income bias — the CPI doesn't account for wage increases that offset price rises",
      "Quality bias — products improve over time, so the same price buys more value",
      "New goods bias — new products (like smartphones) take time to enter the basket, missing early price drops",
      "Urban bias — the CPI only surveys cities, missing rural areas where prices are lower",
    ],
    answer: [0, 2, 3],
    multi: true,
    explanation: "Three real biases: (1) Substitution — fixed basket overstates costs since people adapt. (2) Quality — better products at same price = deflation the CPI misses. (3) New goods — expensive new items join the basket late, missing the initial high-to-low price drop. Income bias and urban bias are not standard CPI bias categories. Together, these biases overstate inflation by roughly 0.5%/year.",
  },
  {
    question: "Which of the following correctly describe how indexing protects against inflation? Select ALL that apply.",
    options: [
      "Social Security benefits are adjusted annually using CPI changes",
      "TIPS (Treasury Inflation-Protected Securities) guarantee a real return above inflation",
      "Tax brackets have been indexed since 1981 to prevent 'bracket creep'",
      "All employer wages are legally required to include annual COLA adjustments",
      "Adjustable-rate mortgages transfer inflation risk from lenders to borrowers",
    ],
    answer: [0, 1, 2, 4],
    multi: true,
    explanation: "Four correct: Social Security COLAs, TIPS real returns, indexed tax brackets (prevents inflation pushing you into higher brackets without real income gains), and ARMs (lenders charge lower initial rates because the rate adjusts with inflation, shifting risk to borrowers). Employer COLAs are NOT legally required — they're voluntary and many workers lack them entirely.",
  },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function Header({ station, onStation, completed }: { station: Station; onStation: (s: Station) => void; completed: Set<Station> }) {
  const stations: { id: Station; label: string; icon: typeof BarChart2 }[] = [
    { id: "intro",      label: "Dashboard",    icon: BookOpen },
    { id: "basket",     label: "Basket",       icon: ShoppingCart },
    { id: "cpi",        label: "CPI Math",     icon: BarChart2 },
    { id: "history",    label: "History",      icon: TrendingUp },
    { id: "winners",    label: "Who Wins?",    icon: Zap },
    { id: "deflation",  label: "Deflation",    icon: TrendingUp },
    { id: "fedtarget",  label: "2% Target",    icon: Zap },
    { id: "fredchart",  label: "FRED Chart",   icon: BarChart2 },
    { id: "quiz",       label: "Quiz",         icon: Award },
  ];

  const stationOrder: Station[] = ["intro", "recap", "basket", "cpi", "history", "winners", "deflation", "fedtarget", "fredchart", "quiz", "results", "not-yet"];
  const currentIdx = stationOrder.indexOf(station);
  const contentStations: Station[] = ["recap","basket","cpi","history","winners","deflation","fedtarget","fredchart"];
  const allStationsDone = contentStations.every(s => completed.has(s));

  return (
    <header role="banner" className="bg-secondary text-secondary-foreground shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Econ Lab logo">
            <rect width="32" height="32" rx="8" fill="hsl(38 95% 50%)"/>
            <path d="M6 22 L10 16 L14 19 L18 11 L22 14 L26 8" stroke="hsl(222 30% 10%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="26" cy="8" r="2" fill="hsl(222 30% 10%)"/>
          </svg>
          <div>
            <div className="font-display font-semibold text-sm leading-none text-sidebar-foreground">ECO 210 ECONLAB</div>
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 9</div>
          </div>
        </div>

        {/* Back to Hub */}
        <a href="https://www.perplexity.ai/computer/a/eco-210-econlab-course-hub-JgrfOPjHQ5iSYovw19FfIg" target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-sidebar-foreground/80 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-sidebar-accent shrink-0">
          ← Course Hub <span className="sr-only">(opens in new tab)</span>
        </a>

        {/* Progress dots — desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {stations.map((s) => {
            const idx = stationOrder.indexOf(s.id);
            const done = idx < currentIdx;
            const active = s.id === station;
            return s.id === "quiz" && !allStationsDone ? (
                <span
                  key={s.id}
                  data-testid={`nav-${s.id}`}
                  title="Complete all stations first"
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-sidebar-foreground/35 cursor-not-allowed select-none"
                >
                  🔒 {s.label}
                </span>
              ) : (
                <button
                  key={s.id}
                  onClick={() => onStation(s.id)}
                  data-testid={`nav-${s.id}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : done
                      ? "bg-sidebar-accent text-sidebar-foreground/90"
                      : "text-sidebar-foreground/75 hover:text-white"
                  }`}
                >
                  {done && !active ? "✓ " : ""}{s.label}
                </button>
              );
          })}
        </div>

        {/* Mobile label */}
        <div className="sm:hidden text-sm font-medium text-sidebar-foreground/80">
          {currentIdx + 1} / {stations.length}
        </div>

        {/* Progress bar */}
        <div className="w-24 hidden md:block">
          <div className="h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(currentIdx / (stations.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavButtons({
  onBack, onNext, backLabel = "Back", nextLabel = "Continue", nextDisabled = false
}: {
  onBack?: () => void; onNext?: () => void; backLabel?: string; nextLabel?: string; nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
      {onBack ? (
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={16} /> {backLabel}
        </button>
      ) : <div />}
      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          data-testid="btn-next"
          className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 active:opacity-80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {nextLabel} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Intro
// ─────────────────────────────────────────────
const CH9_SUMMARY = [
  {
    section: "9.1 Tracking Inflation",
    body: "Economists measure the price level by using a basket of goods and services and calculating how the total cost of buying that basket of goods will increase over time. Economists often express the price level in terms of index numbers, which transform the cost of buying the basket of goods and services into a series of numbers in the same proportion to each other, but with an arbitrary base year of 100. We measure the inflation rate as the percentage change between price levels or index numbers over time.",
  },
  {
    section: "9.2 How to Measure Changes in the Cost of Living",
    body: "Measuring price levels with a fixed basket of goods will always have two problems: the substitution bias, by which a fixed basket of goods does not allow for buying more of what becomes relatively less expensive and less of what becomes relatively more expensive; and the quality/new goods bias, by which a fixed basket cannot account for improvements in quality and the advent of new goods. These problems can be reduced in degree—for example, by allowing the basket of goods to evolve over time—but we cannot totally eliminate them.\n\nThe most commonly cited measure of inflation is the Consumer Price Index (CPI), which is based on a basket of goods representing what the typical consumer buys. The Core Inflation Index further breaks down the CPI by excluding volatile economic commodities. Several price indices are not based on baskets of consumer goods. The GDP deflator is based on all GDP components. The Producer Price Index is based on prices of supplies and inputs bought by producers of goods and services. An Employment Cost Index measures wage inflation in the labor market. An International Price Index is based on the prices of merchandise that is exported or imported.",
  },
  {
    section: "9.3 How the U.S. and Other Countries Experience Inflation",
    body: "In the U.S. economy, the annual inflation rate in the last two decades has typically been around 2% to 4%. The periods of highest inflation in the United States in the twentieth century occurred during the years after World Wars I and II, and in the 1970s. The period of lowest inflation—actually, with deflation—was the 1930s Great Depression.",
  },
  {
    section: "9.4 The Confusion Over Inflation",
    body: "Unexpected inflation will tend to hurt those whose money received, in terms of wages and interest payments, does not rise with inflation. In contrast, inflation can help those who owe money that they can pay in less valuable, inflated dollars. Low rates of inflation have relatively little economic impact over the short term. Over the medium and the long term, even low rates of inflation can complicate future planning. High rates of inflation can muddle price signals in the short term and prevent market forces from operating efficiently, and can vastly complicate long-term savings and investment decisions.",
  },
  {
    section: "9.5 Indexing and Its Limitations",
    body: "A payment is indexed if it is automatically adjusted for inflation. Examples of indexing in the private sector include wage contracts with cost-of-living adjustments (COLAs) and loan agreements like adjustable-rate mortgages (ARMs). Examples of indexing in the public sector include tax brackets and Social Security payments.",
  },
];

function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-card border border-card-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <div className="font-display font-bold text-base text-foreground">Chapter 9 Summary</div>
            <div className="text-xs text-muted-foreground mt-0.5">OpenStax Macroeconomics 3rd Edition</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground text-lg font-bold">&times;</button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {CH9_SUMMARY.map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold text-sm text-foreground mb-2 leading-snug">{item.section}</h3>
              {item.body.split("\n\n").map((para, j) => (
                <p key={j} className="text-sm text-muted-foreground leading-relaxed mb-2 last:mb-0">{para}</p>
              ))}
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
        <div className="px-6 py-4 border-t border-border shrink-0">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Close & Return to Lab
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Dashboard (Intro)
// ─────────────────────────────────────────────
const STATION_META: { id: Station; title: string; desc: string; gated?: boolean }[] = [
  { id: "recap",     title: "📚 Chapter 8 Recap",      desc: "5 quick questions from Chapter 8 — start here before new content" },
  { id: "basket",    title: "Price Basket",  desc: "Guess how the BLS weights everyday items in the CPI basket" },
  { id: "cpi",       title: "CPI Math",      desc: "Calculate the inflation rate — must solve both problems", gated: true },
  { id: "history",   title: "History",       desc: "Explore 100 years of inflation episodes and what caused each one" },
  { id: "winners",   title: "Who Wins?",     desc: "Sort scenarios: who is helped, hurt, or uncertain by inflation" },
  { id: "deflation", title: "Deflation",     desc: "Classify price drops as good (productivity) or bad (demand collapse)" },
  { id: "fedtarget", title: "2% Target",     desc: "Explore why the Fed targets 2% inflation — not 0%" },
  { id: "fredchart",  title: "Reading the Data", desc: "Analyze 75+ years of U.S. CPI inflation data from FRED" },
];

function IntroStation({
  completed,
  onGoTo,
}: {
  completed: Set<Station>;
  onGoTo: (s: Station) => void;
}) {
  const allDone = STATION_META.every(s => completed.has(s.id));
  const [showSummary, setShowSummary] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wide mb-4">Chapter 9</span>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Inflation</h1>
        <p className="text-muted-foreground text-base">Tracking, Measuring, and Understanding Rising Prices</p>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-foreground">
        💡 <strong>Key idea:</strong> Inflation isn't just prices going up — it's about who gains and who loses when the purchasing power of every dollar quietly shrinks. Complete all 8 stations in any order, then take the quiz.
      </div>

      {/* Chapter Summary link */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted border border-border mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">📄</span>
          <span className="text-sm text-foreground">Need a refresher? View the chapter summary.</span>
        </div>
        <button onClick={() => setShowSummary(true)}
          className="text-xs px-3 py-1.5 rounded-lg bg-card border border-border text-primary font-semibold hover:bg-accent transition-all shrink-0">
          Open Summary
        </button>
      </div>

      {/* Station cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {STATION_META.map((s, i) => {
          const done = completed.has(s.id);
          return (
            <button key={s.id} onClick={() => onGoTo(s.id)} data-testid={`dashboard-${s.id}`}
              className={`rounded-xl border-2 p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary
                ${done ? "border-green-400 bg-green-50" : "border-border bg-card hover:border-primary/40"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-bold ${done ? "text-green-700" : "text-foreground"}`}>{s.title}</span>
                {done && <span className="text-green-600 text-lg">✓</span>}
              </div>
              <span className="text-xs text-muted-foreground">{done ? "Completed" : s.desc}</span>
            </button>
          );
        })}

        {/* Quiz card — locked until all done */}
        <button
          onClick={() => allDone ? onGoTo("quiz") : undefined}
          data-testid="dashboard-quiz"
          disabled={!allDone}
          className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${
            allDone
              ? "bg-primary text-primary-foreground border-primary hover:opacity-90 active:scale-[0.99]"
              : "bg-muted border-border opacity-50 cursor-not-allowed"
          }`}
        >
          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
            allDone ? "bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground" : "bg-muted-foreground/20 border-muted-foreground/30 text-muted-foreground"
          }`}>
            {allDone ? <Award size={18} /> : "🔒"}
          </div>
          <div className="flex-1 min-w-0">
            <span className={`font-semibold text-sm ${allDone ? "text-primary-foreground" : "text-muted-foreground"}`}>Quiz</span>
            <p className={`text-xs mt-0.5 ${allDone ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {allDone ? "10 questions — need 9/10 — screenshot your score" : "Complete all 8 stations to unlock"}
            </p>
          </div>
          <ChevronRight size={16} className={`shrink-0 ${allDone ? "text-primary-foreground" : "text-muted-foreground"}`} />
        </button>
      </div>

      {!allDone && (
        <p className="text-xs text-center text-muted-foreground">
          {completed.size} of {STATION_META.length} stations complete
        </p>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────
// Station: Chapter 8 Recap
// ─────────────────────────────────────────────
const RECAP_QUESTIONS_8: Array<{
  question: string; options: string[]; answer: number | number[]; multi?: boolean; explanation: string;
}> = [
  {
    question: "Marcus lost his job 8 months ago and sent out 200 résumés with no offers. Last month he stopped searching out of discouragement. How does the BLS classify Marcus RIGHT NOW?",
    options: [
      "Unemployed — he still wants a job and would take one if offered",
      "Not in the Labor Force — he stopped actively searching in the past 4 weeks",
      "Frictionally unemployed — he is between jobs",
      "Underemployed — he is working below his skill level",
    ],
    answer: 1,
    explanation: "Once Marcus stopped actively searching in the past 4 weeks, the BLS reclassifies him from Unemployed to Not in the Labor Force. He becomes a discouraged worker — counted in U-6 but not U-3. This is why U-3 can fall during a weak economy: workers like Marcus disappear from both the numerator and denominator of the unemployment rate.",
  },
  {
    question: "A coal miner loses her job as power plants switch to natural gas. Her skills don't match available jobs in the region. What type of unemployment is this?",
    options: [
      "Frictional — she is temporarily between jobs while searching",
      "Cyclical — the economy is in recession and demand for all labor fell",
      "Structural — a long-run industry shift has made her specific skills less demanded",
      "Seasonal — coal demand fluctuates with winter heating needs",
    ],
    answer: 2,
    explanation: "Structural unemployment occurs when a permanent change in the economy creates a skills mismatch. Unlike frictional unemployment, it doesn't resolve through job search alone — retraining or relocation is required. The coal-to-natural-gas transition is a classic structural shift.",
  },
  {
    question: "Milltown has 600 working-age adults: 380 employed, 45 unemployed and actively searching, and 175 not in the labor force. What are the LFPR and U-3 rate?",
    options: [
      "LFPR = 63.3%, U-3 = 10.6%",
      "LFPR = 70.8%, U-3 = 10.6%",
      "LFPR = 70.8%, U-3 = 7.5%",
      "LFPR = 89.4%, U-3 = 10.6%",
    ],
    answer: 1,
    explanation: "Labor Force = 380 + 45 = 425. LFPR = 425 ÷ 600 × 100 = 70.8%. U-3 = 45 ÷ 425 × 100 = 10.6%. Key: LFPR uses ALL working-age adults (600) as denominator; U-3 uses only the labor force (425). Mixing up these denominators is the most common formula error.",
  },
  {
    question: "The official U-3 rate is 4.2% but U-6 is 8.1%. What does this gap reveal?",
    options: [
      "The BLS makes systematic measurement errors that U-6 corrects",
      "U-6 captures discouraged workers and involuntary part-time workers that U-3 misses, revealing hidden labor market weakness",
      "U-6 counts workers in the informal economy that U-3 excludes",
      "The gap only matters during recessions, not in normal economic conditions",
    ],
    answer: 1,
    explanation: "U-6 = U-3 + discouraged workers + marginally attached + involuntary part-time workers. A wide gap signals true labor market weakness beyond what U-3 shows. Post-2008, the gap widened dramatically as millions worked part-time involuntarily or stopped searching.",
  },
  {
    question: "Which of the following would cause U-3 to FALL even if the labor market is not actually improving? Select ALL that apply.",
    options: [
      "Discouraged workers stop searching and exit the labor force",
      "Firms hire more workers at full-time hours",
      "A wave of early retirements removes older workers from the labor force",
      "Workers take involuntary part-time jobs but still want full-time work",
      "Recent graduates decide to stay in school rather than job search",
    ],
    answer: [0, 2, 4],
    multi: true,
    explanation: "U-3 falls when unemployed workers leave the labor force — without any new job creation. Discouraged workers (A), early retirees (C), and students delaying job search (E) all reduce the labor force, shrinking both the numerator and denominator of U-3. Option B is actual hiring (improves the market). Option D (involuntary part-time) is hidden unemployment captured by U-6, not a cause of U-3 falling.",
  },
];

function RecapStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({}); 
  const [checked, setChecked] = useState<Record<number, boolean>>({}); 
  const q = RECAP_QUESTIONS_8[current];
  const isChecked = checked[current];
  const allChecked = RECAP_QUESTIONS_8.every((_, i) => checked[i]);

  function hasSelection(qIdx: number): boolean {
    const given = answers[qIdx];
    if (RECAP_QUESTIONS_8[qIdx].multi) return Array.isArray(given) && (given as number[]).length > 0;
    return given !== undefined;
  }
  function isCorrectQ(qIdx: number): boolean {
    const question = RECAP_QUESTIONS_8[qIdx];
    const given = answers[qIdx];
    if (question.multi) {
      const correct = (question.answer as number[]).slice().sort().join(",");
      const userArr = Array.isArray(given) ? (given as number[]).slice().sort().join(",") : "";
      return correct === userArr;
    }
    return given === question.answer;
  }
  function handleSelect(idx: number) { if (isChecked) return; setAnswers(prev => ({ ...prev, [current]: idx })); }
  function handleToggle(idx: number) {
    if (isChecked) return;
    setAnswers(prev => {
      const curr2 = (prev[current] as number[] | undefined) ?? [];
      return { ...prev, [current]: curr2.includes(idx) ? curr2.filter(x => x !== idx) : [...curr2, idx] };
    });
  }
  function navDotStyle(i: number) {
    if (i === current) return "bg-primary";
    if (checked[i]) return isCorrectQ(i) ? "bg-emerald-400" : "bg-red-400";
    if (hasSelection(i)) return "bg-primary/40";
    return "bg-muted";
  }
  function optionStyle(i: number): string {
    const correctAnswers = q.multi ? (q.answer as number[]) : [q.answer as number];
    const userAnswer = answers[current];
    const userSelected = q.multi ? (Array.isArray(userAnswer) ? (userAnswer as number[]).includes(i) : false) : userAnswer === i;
    const isInCorrectSet = correctAnswers.includes(i);
    if (!isChecked) return userSelected ? "bg-primary/10 border-primary text-foreground" : "bg-muted hover:bg-accent hover:text-accent-foreground text-foreground border-border";
    if (isInCorrectSet) return "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-300 dark:ring-emerald-700";
    if (userSelected && !isInCorrectSet) return "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200";
    return "bg-muted text-foreground border-border opacity-50";
  }
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 mb-3">
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300">📚 Start here — Chapter 8 Review</span>
        </div>
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Chapter 8 Recap: Unemployment</h2>
        <p className="text-sm text-muted-foreground">5 questions using new scenarios from Chapter 8. Try these before starting Chapter 9 content — spaced retrieval improves retention.</p>
      </div>
      <div className="flex gap-2 mb-5">
        {RECAP_QUESTIONS_8.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`flex-1 h-2 rounded-full transition-all ${navDotStyle(i)}`} />
        ))}
      </div>
      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        {q.multi && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Select ALL that apply</span>
          </div>
        )}
        <span className="text-xs font-semibold text-muted-foreground">Question {current + 1} of {RECAP_QUESTIONS_8.length}</span>
        <p className="text-base font-medium text-foreground mt-3 mb-5 leading-relaxed">{q.question}</p>
        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            const userAnswer = answers[current];
            const isSelected = q.multi ? (Array.isArray(userAnswer) ? (userAnswer as number[]).includes(i) : false) : userAnswer === i;
            if (q.multi) {
              return (
                <button key={i} onClick={() => handleToggle(i)} disabled={isChecked}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-start gap-3 ${isChecked ? optionStyle(i) + " cursor-default" : optionStyle(i)}`}>
                  <span className={`shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? "bg-primary border-primary" : "border-current opacity-50"}`}>
                    {isSelected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </span>
                  <span><span className="font-semibold mr-1">{String.fromCharCode(65 + i)}.</span> {opt}</span>
                </button>
              );
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={isChecked}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${isChecked ? optionStyle(i) + " cursor-default" : optionStyle(i)}`}>
                <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
              </button>
            );
          })}
        </div>
        {!isChecked && hasSelection(current) && (
          <button onClick={() => setChecked(prev => ({ ...prev, [current]: true }))}
            className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check Answer
          </button>
        )}
        {isChecked && (
          <div className={`mt-4 p-3 rounded-xl text-sm border ${isCorrectQ(current) ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"} text-foreground`}>
            <strong>{isCorrectQ(current) ? "✓ Correct! " : "✗ Not quite. "}</strong>{q.explanation}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          <ChevronLeft size={16}/> Previous
        </button>
        {current < RECAP_QUESTIONS_8.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Question <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>
      <NavButtons onBack={onBack} onNext={allChecked ? onComplete : undefined} nextDisabled={!allChecked} nextLabel="Mark Complete ✓" />
      {!allChecked && <p className="text-xs text-center text-muted-foreground mt-2">Check your answer on each question to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Price Basket Builder
// ─────────────────────────────────────────────
function BasketStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [guesses, setGuesses] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);

  const totalGuessed = Object.values(guesses).reduce((a, b) => a + b, 0);
  const allGuessed = Object.keys(guesses).length === BASKET_ITEMS.length;

  function setGuess(id: number, val: number) {
    setGuesses(prev => ({ ...prev, [id]: val }));
  }

  // Sort by actual weight descending for reveal
  const sorted = [...BASKET_ITEMS].sort((a, b) => b.actualWeight - a.actualWeight);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Price Basket Builder</h2>
        <p className="text-sm text-muted-foreground">The BLS weights each category by how much of their income typical consumers spend on it. Drag each slider to your best guess — then reveal the real weights.</p>
      </div>

      {/* Formula box */}
      <div className="bg-card border border-card-border rounded-xl p-4 mb-5">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">CPI Inflation Formula</div>
        <div className="font-mono text-sm text-foreground">Inflation Rate = (Current CPI − Prior CPI) ÷ Prior CPI × 100</div>
        <div className="text-xs text-muted-foreground mt-1">Or equivalently: [(New basket cost − Old basket cost) ÷ Old basket cost] × 100</div>
      </div>

      {!revealed ? (
        <>
          <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-foreground">Your Weight Guesses</h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${Math.abs(totalGuessed - 100) < 1 ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>
                Total: {totalGuessed}% {Math.abs(totalGuessed - 100) < 1 ? "✓" : "(should sum to 100%)"}
              </span>
            </div>
            <div className="space-y-4">
              {BASKET_ITEMS.map(item => (
                <div key={item.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{item.emoji} {item.name}</span>
                    <span className="text-sm font-semibold text-foreground w-12 text-right">{guesses[item.id] ?? 0}%</span>
                  </div>
                  <input
                    type="range" aria-label="Slider"
                    min={0}
                    max={50}
                    step={1}
                    value={guesses[item.id] ?? 0}
                    onChange={e => setGuess(item.id, parseInt(e.target.value))}
                    data-testid={`basket-slider-${item.id}`}
                    className="w-full h-2 appearance-none bg-muted rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card [&::-webkit-slider-thumb]:shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setRevealed(true)}
            data-testid="btn-reveal-basket"
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all mb-2"
          >
            Reveal Real BLS Weights
          </button>
          <p className="text-xs text-center text-muted-foreground mb-4">Don't worry about getting it perfect — the reveal is usually a surprise.</p>
        </>
      ) : (
        <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
          <h3 className="font-semibold text-sm text-foreground mb-4">Your Guess vs. Reality</h3>
          <div className="space-y-3">
            {sorted.map(item => {
              const guess = guesses[item.id] ?? 0;
              const diff = guess - item.actualWeight;
              return (
                <div key={item.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-foreground">{item.emoji} {item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">You: {guess}%</span>
                      <span className="font-bold text-primary">Actual: {item.actualWeight}%</span>
                      <span className={`font-semibold ${Math.abs(diff) <= 3 ? "text-emerald-600 dark:text-emerald-400" : diff > 0 ? "text-red-500" : "text-blue-500"}`}>
                        {diff > 0 ? "+" : ""}{diff}
                      </span>
                    </div>
                  </div>
                  {/* Stacked bar */}
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-primary/30 rounded-full transition-all" style={{ width: `${(guess / 50) * 100}%` }} />
                    <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all" style={{ width: `${(item.actualWeight / 50) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-xs text-foreground">
            <strong>The big surprise for most people:</strong> Housing (42%) dominates the basket. Food and transportation are tied at 15% each. Everything else — education, recreation, clothing, medical — together add up to just 28%. This is why rent increases hit CPI so hard.
          </div>
        </div>
      )}

      <NavButtons onBack={onBack} onNext={revealed ? onComplete : undefined} nextDisabled={!revealed} nextLabel="Mark Complete ✓" />
      {!revealed && <p className="text-xs text-center text-muted-foreground mt-2">Try your guesses first, then reveal the real BLS weights to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: CPI Calculator
// ─────────────────────────────────────────────
type CPIState = { inflationInput: string; attempts: number; correct: boolean; };

function CPIStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [problemIdx, setProblemIdx] = useState(0);
  const [states, setStates] = useState<CPIState[]>(
    CPI_PROBLEMS.map(() => ({ inflationInput: "", attempts: 0, correct: false }))
  );

  const prob = CPI_PROBLEMS[problemIdx];
  const state = states[problemIdx];

  function withinTolerance(input: string, correct: number): boolean {
    const val = parseFloat(input);
    return !isNaN(val) && Math.abs(val - correct) < 0.2;
  }

  const filled = state.inflationInput.trim() !== "";
  const canCheck = filled && !state.correct;

  function updateField(value: string) {
    if (state.correct) return;
    setStates(prev => prev.map((s, i) => i === problemIdx ? { ...s, inflationInput: value } : s));
  }

  function handleCheck() {
    const isRight = withinTolerance(state.inflationInput, prob.correctInflation);
    setStates(prev => prev.map((s, i) => {
      if (i !== problemIdx) return s;
      return { ...s, correct: isRight, attempts: isRight ? s.attempts : s.attempts + 1 };
    }));
  }

  function attemptMsg(attempts: number): string | null {
    if (attempts === 1) return "Not quite — try again.";
    if (attempts === 2) return "💡 Hint: divide by the older/prior value, not the newer one.";
    if (attempts >= 3) return `Answer: ${prob.correctInflation}%`;
    return null;
  }

  function inputColor(): string {
    if (state.correct) return "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30";
    if (state.attempts === 0) return "border-border bg-background";
    if (state.attempts >= 3) return "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30";
    if (state.attempts === 2) return "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30";
    return "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30";
  }

  const allSolved = states.every((s, i) => {
    return s.correct || s.attempts >= 3;
  });

  const p = prob as any;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">CPI Math</h2>
        <p className="text-sm text-muted-foreground">Calculate the inflation rate from each scenario. <strong className="text-foreground">Round to 1 decimal place.</strong></p>
      </div>

      {/* Problem tabs */}
      <div className="flex gap-2 mb-5">
        {CPI_PROBLEMS.map((pr, i) => {
          const ps = states[i];
          const solved = ps.correct || ps.attempts >= 3;
          return (
            <button
              key={pr.id}
              onClick={() => setProblemIdx(i)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                i === problemIdx
                  ? "bg-primary text-primary-foreground border-primary"
                  : solved
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent"
              }`}
            >
              {solved ? "✓ " : ""}Problem {pr.id}
            </button>
          );
        })}
      </div>

      {/* Scenario card */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <h3 className="font-semibold text-sm text-foreground mb-2">{prob.title}</h3>
        <p className="text-sm text-foreground leading-relaxed mb-4">{prob.context}</p>

        {/* Show item breakdown for problem 1 */}
        {prob.items && prob.items.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-muted-foreground uppercase mb-2">
              <span>Item</span><span className="text-right">Base Price</span><span className="text-right">Current Price</span><span className="text-right">Change</span>
            </div>
            {prob.items.map((item: any) => (
              <div key={item.name} className="grid grid-cols-4 gap-2 text-sm py-1.5 border-t border-border">
                <span className="text-foreground">{item.name}</span>
                <span className="text-right text-muted-foreground">${item.basePrice}</span>
                <span className="text-right text-foreground">${item.currentPrice}</span>
                <span className={`text-right font-semibold ${item.currentPrice > item.basePrice ? "text-red-600 dark:text-red-400" : "text-emerald-600"}`}>
                  +{(((item.currentPrice - item.basePrice) / item.basePrice) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
            <div className="grid grid-cols-4 gap-2 text-sm py-1.5 border-t border-border font-semibold">
              <span className="text-foreground">Total Basket</span>
              <span className="text-right text-muted-foreground">${prob.baseCost}</span>
              <span className="text-right text-foreground">${prob.currentCost}</span>
              <span className="text-right text-red-600 dark:text-red-400">↑</span>
            </div>
          </div>
        )}

        {/* Formula reminder */}
        <div className="bg-muted rounded-lg p-3 mb-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Formula</div>
          {p.isCPIToInflation ? (
            <div className="font-mono text-xs text-foreground">(Current CPI − Prior CPI) ÷ Prior CPI × 100</div>
          ) : (
            <div className="font-mono text-xs text-foreground">(New Cost − Old Cost) ÷ Old Cost × 100</div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <h3 className="font-semibold text-sm text-foreground mb-3">Your Calculation</h3>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
            Inflation Rate % <span className="normal-case font-normal">— round to 1 decimal</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number" step="0.1" placeholder="e.g. 5.2"
              value={state.inflationInput}
              onChange={e => updateField(e.target.value)}
              disabled={state.correct}
              className={`w-32 px-3 py-2 rounded-lg border text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground ${inputColor()}`}
            />
            {state.correct && <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ Correct</span>}
            {!state.correct && state.attempts >= 3 && <span className="text-sm font-semibold text-red-600 dark:text-red-400">✗ {prob.correctInflation}%</span>}
          </div>
          {!state.correct && attemptMsg(state.attempts) && (
            <p className={`text-xs mt-1.5 font-medium ${state.attempts >= 3 ? "text-red-600 dark:text-red-400" : state.attempts === 2 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
              {attemptMsg(state.attempts)}
            </p>
          )}
        </div>

        {canCheck && (
          <button onClick={handleCheck} className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check My Answer
          </button>
        )}

        {(state.correct || state.attempts >= 3) && (
          <div className={`mt-4 p-3 rounded-xl text-sm border ${
            state.correct
              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
          }`}>
            {state.correct ? (
              <><strong>✓ Correct!</strong> {p.isCPIToInflation
                ? `(${p.currentCPI} − ${p.priorCPI}) ÷ ${p.priorCPI} × 100 = ${prob.correctInflation}%`
                : `(${prob.currentCost} − ${prob.baseCost}) ÷ ${prob.baseCost} × 100 = ${prob.correctInflation}%`
              }</>
            ) : (
              <><strong>Answer shown.</strong> {p.isCPIToInflation
                ? `(${p.currentCPI} − ${p.priorCPI}) ÷ ${p.priorCPI} × 100 = ${prob.correctInflation}%`
                : `(${prob.currentCost} − ${prob.baseCost}) ÷ ${prob.baseCost} × 100 = ${prob.correctInflation}%`
              } Remember: always divide by the <em>prior/older</em> value.</>
            )}
          </div>
        )}
      </div>

      {/* Problem nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setProblemIdx(Math.max(0, problemIdx - 1))} disabled={problemIdx === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          <ChevronLeft size={16}/> Previous
        </button>
        {problemIdx < CPI_PROBLEMS.length - 1 && (
          <button onClick={() => setProblemIdx(problemIdx + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Problem <ChevronRight size={16}/>
          </button>
        )}
      </div>

      <NavButtons onBack={onBack} onNext={onComplete} nextLabel="Mark Complete ✓" nextDisabled={!allSolved} />
      {!allSolved && <p className="text-xs text-center text-muted-foreground mt-2">Solve both problems correctly to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Inflation Through History
// ─────────────────────────────────────────────
function HistoryStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>("postWW1");
  const [seen, setSeen] = useState<Set<string>>(new Set(["postWW1"]));

  const ep = HISTORY_EPISODES.find(e => e.id === selected);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Inflation Through History</h2>
        <p className="text-sm text-muted-foreground">Click each episode to see what caused it and what happened next. Notice the pattern: inflation is never just one thing.</p>
      </div>

      {/* Visual bar chart timeline */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <div className="flex items-end gap-2 h-36 mb-3">
          {HISTORY_EPISODES.map(e => {
            const height = Math.abs(e.rate);
            const maxRate = 20;
            const barH = (height / maxRate) * 100;
            const isNeg = e.rate < 0;
            const isActive = selected === e.id;
            return (
              <button
                key={e.id}
                onClick={() => { setSelected(e.id); setSeen(prev => new Set([...prev, e.id])); }}
                data-testid={`history-${e.id}`}
                className={`flex-1 flex flex-col items-center gap-1 group transition-all`}
                style={{ alignItems: "center" }}
              >
                {/* Bar */}
                <div className="w-full flex flex-col-reverse items-center" style={{ height: "120px" }}>
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${isActive ? "opacity-100 ring-2 ring-offset-1 ring-primary" : "opacity-70 hover:opacity-90"}`}
                    style={{
                      height: `${barH}%`,
                      minHeight: "4px",
                      backgroundColor: e.color,
                    }}
                  />
                </div>
                <span className={`text-xs font-semibold transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} style={{ fontSize: "9px", lineHeight: "1.2", textAlign: "center" }}>
                  {e.year}
                </span>
              </button>
            );
          })}
        </div>
        {/* Y axis labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>← Earlier</span>
          <span className="text-center">Inflation Rate (% at peak)</span>
          <span>More Recent →</span>
        </div>
      </div>

      {/* Episode detail */}
      {ep && (
        <div className="bg-card border border-card-border rounded-xl p-5 mb-5 transition-all">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-display font-bold text-base text-foreground">{ep.label}</h3>
              <span className="text-xs text-muted-foreground">{ep.year}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs px-2 py-1 rounded-full font-semibold border" style={{ backgroundColor: ep.color + "20", borderColor: ep.color + "60", color: ep.color }}>
                {ep.tag}
              </span>
              <span className="font-display text-2xl font-bold" style={{ color: ep.color }}>
                {ep.rate > 0 ? "+" : ""}{ep.rate}%
              </span>
            </div>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{ep.summary}</p>
        </div>
      )}

      {/* Key insight */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-5 text-sm text-foreground">
        <strong>Pattern to notice:</strong> Every major inflation spike follows one of three causes — demand surges (too much money chasing goods), supply shocks (fewer goods to buy), or monetary expansion (too many dollars). The 2021–22 surge was unusual because all three hit at once.
      </div>

      {(() => { const allSeen = seen.size >= HISTORY_EPISODES.length; return (<><NavButtons onBack={onBack} onNext={allSeen ? onComplete : undefined} nextDisabled={!allSeen} nextLabel="Mark Complete ✓" />{!allSeen && <p className="text-xs text-center text-muted-foreground mt-2">Click each episode on the chart to explore it ({seen.size}/{HISTORY_EPISODES.length} viewed).</p>}</>); })()}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Winners & Losers
// ─────────────────────────────────────────────
function WinnersStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, WLCategory>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const card = WL_CARDS[current];
  const selected = answers[current];
  const isChecked = checked[current];
  const isCorrect = selected === card.answer;
  const allAnswered = WL_CARDS.every((_, i) => checked[i]);

  function handleSelect(cat: WLCategory) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [current]: cat }));
  }

  function handleCheck() {
    if (!selected) return;
    setChecked(prev => ({ ...prev, [current]: true }));
  }

  const categories: { id: WLCategory; label: string; color: string; bg: string }[] = [
    { id: "hurt",    label: "😟 Hurt by inflation",    color: "text-red-600 dark:text-red-400",    bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" },
    { id: "helped",  label: "😊 Helped by inflation",  color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" },
    { id: "depends", label: "🤔 It depends",           color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800" },
  ];

  const score = WL_CARDS.filter((c, i) => answers[i] === c.answer).length;
  const allCheckedW = WL_CARDS.every((_, i) => checked[i]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Winners & Losers</h2>
        <p className="text-sm text-muted-foreground">Read each scenario and decide: does inflation help this person, hurt them, or does it depend on the details?</p>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-5">
        {WL_CARDS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === current ? "bg-primary" :
              checked[i] ? (answers[i] === WL_CARDS[i].answer ? "bg-emerald-400" : "bg-red-400") :
              answers[i] ? "bg-primary/40" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Scenario {current + 1} of {WL_CARDS.length}</span>
          {allAnswered && <span className="text-xs font-semibold text-primary">{score}/{WL_CARDS.length} correct</span>}
        </div>
        <p className="text-base font-medium text-foreground mb-5 leading-relaxed">{card.scenario}</p>

        <div className="grid gap-2">
          {categories.map(cat => {
            const isSel = selected === cat.id;
            const isCorrectCat = card.answer === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                disabled={isChecked}
                data-testid={`wl-${cat.id}`}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  isChecked
                    ? isCorrectCat
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-300"
                      : isSel && !isCorrectCat
                      ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200"
                      : "bg-muted text-muted-foreground border-border opacity-50 cursor-default"
                    : isSel
                    ? "bg-primary/10 border-primary text-foreground"
                    : "bg-muted hover:bg-accent hover:text-accent-foreground text-foreground border-border"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {!isChecked && selected && (
          <button onClick={handleCheck} data-testid="wl-check" className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check Answer
          </button>
        )}

        {isChecked && (
          <div className={`mt-4 p-3 rounded-xl text-sm border ${isCorrect ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"} text-foreground`}>
            <strong>{isCorrect ? "✓ Correct! " : "✗ Not quite. "}</strong>{card.explanation}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          <ChevronLeft size={16}/> Previous
        </button>
        {current < WL_CARDS.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Scenario <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>

      <NavButtons onBack={onBack} onNext={allCheckedW ? onComplete : undefined} nextDisabled={!allCheckedW} nextLabel="Mark Complete ✓" />
      {!allCheckedW && <p className="text-xs text-center text-muted-foreground mt-2">Check your answer on each scenario to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Good vs. Bad Deflation
// ─────────────────────────────────────────────
function DeflationStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, DeflationType>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const allCheckedD = DEFLATION_CARDS.every((_, i) => checked[i]);

  const card = DEFLATION_CARDS[current];
  const selected = answers[current];
  const isChecked = checked[current];
  const isCorrect = selected === card.answer;

  function handleSelect(type: DeflationType) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [current]: type }));
  }

  function handleCheck() {
    if (!selected) return;
    setChecked(prev => ({ ...prev, [current]: true }));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Good vs. Bad Deflation</h2>
        <p className="text-sm text-muted-foreground">Not all falling prices are the same. Classify each scenario as productivity-driven (good) or demand-collapse (bad).</p>
      </div>

      {/* Explainer cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3">
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">✅ Good Deflation</div>
          <p className="text-xs text-foreground leading-relaxed">Prices fall because innovation or efficiency produces <em>more goods at lower cost</em>. Living standards rise. No demand collapse.</p>
        </div>
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
          <div className="text-xs font-bold text-red-700 dark:text-red-300 mb-1">❌ Bad Deflation</div>
          <p className="text-xs text-foreground leading-relaxed">Prices fall because <em>demand has collapsed</em>. Consumers wait for lower prices, causing layoffs, which cause less spending — a spiral.</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-5">
        {DEFLATION_CARDS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === current ? "bg-primary" :
              checked[i] ? (answers[i] === DEFLATION_CARDS[i].answer ? "bg-emerald-400" : "bg-red-400") :
              answers[i] ? "bg-primary/40" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        <span className="text-xs font-semibold text-muted-foreground">Scenario {current + 1} of {DEFLATION_CARDS.length}</span>
        <p className="text-base font-medium text-foreground mt-2 mb-5 leading-relaxed">{card.scenario}</p>

        <div className="grid grid-cols-2 gap-3">
          {(["good", "bad"] as DeflationType[]).map(type => {
            const isSel = selected === type;
            const isCorrectType = card.answer === type;
            return (
              <button
                key={type}
                onClick={() => handleSelect(type)}
                disabled={isChecked}
                data-testid={`deflation-${type}`}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  isChecked
                    ? isCorrectType
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-300"
                      : isSel
                      ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200"
                      : "bg-muted text-muted-foreground border-border opacity-50 cursor-default"
                    : isSel
                    ? "bg-primary/10 border-primary text-foreground"
                    : "bg-muted hover:bg-accent hover:text-accent-foreground text-foreground border-border"
                }`}
              >
                {type === "good" ? "✅ Good Deflation" : "❌ Bad Deflation"}
              </button>
            );
          })}
        </div>

        {!isChecked && selected && (
          <button onClick={handleCheck} data-testid="deflation-check" className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check Answer
          </button>
        )}

        {isChecked && (
          <div className={`mt-4 p-3 rounded-xl text-sm border ${isCorrect ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"} text-foreground`}>
            <strong>{isCorrect ? "✓ Correct! " : "✗ Not quite. "}</strong>{card.explanation}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          <ChevronLeft size={16}/> Previous
        </button>
        {current < DEFLATION_CARDS.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>

      <NavButtons onBack={onBack} onNext={allCheckedD ? onComplete : undefined} nextDisabled={!allCheckedD} nextLabel="Mark Complete ✓" />
      {!allCheckedD && <p className="text-xs text-center text-muted-foreground mt-2">Check your answer on each scenario to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: The Fed's 2% Target
// ─────────────────────────────────────────────
function FedTargetStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [rate, setRate] = useState(2.0);
  const [sliderMoved, setSliderMoved] = useState(false);

  function getZone() {
    if (rate === 0)    return { label: "Zero Inflation", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800", icon: "🧊", desc: "Sounds ideal — but dangerous. With zero inflation, any unexpected price drop tips into deflation. The Fed loses the ability to use real negative interest rates as stimulus. Debt burdens feel heavier. The risk of a deflationary trap rises sharply." };
    if (rate <= 1)     return { label: "Too Low", color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800", icon: "🧊", desc: "Very low inflation provides little cushion against deflation. If the economy hits a shock, the Fed has less room to maneuver. Japan spent decades stuck near zero, unable to escape its stagnation trap." };
    if (rate <= 3)     return { label: "Goldilocks Zone (Fed Target)", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800", icon: "✅", desc: "The Fed's 2% sweet spot. Enough inflation to give monetary policy room to maneuver (real negative rates possible), encourage spending over hoarding, and allow gradual debt erosion — without distorting price signals or eroding purchasing power significantly." };
    if (rate <= 5)     return { label: "Elevated — Watch Closely", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800", icon: "⚠️", desc: "Above the Fed's comfort zone. Price signals start to blur — is that price rise inflation or genuine scarcity? Savers see real returns evaporate. The Fed will likely tighten. Redistribution from savers to debtors accelerates." };
    if (rate <= 9)     return { label: "High Inflation", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800", icon: "🔥", desc: "Serious damage zone. We saw this in 2022 at ~9%. Business planning becomes very hard. Workers demand cost-of-living raises, feeding a wage-price spiral. Fixed-income savers are devastated. The Fed raises rates aggressively — risking recession." };
    return { label: "Hyperinflation Territory", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800", icon: "💥", desc: "Economic collapse territory. Zimbabwe (79.6 billion%), Weimar Germany (millions percent). Currency becomes worthless faster than you can spend it. People barter. Stores stop posting prices. Society loses the shared price system that makes markets function." };
  }

  const zone = getZone();

  const snapPoints = [
    { rate: 0,   label: "0%",    desc: "Japan 2000s" },
    { rate: 2,   label: "2%",    desc: "Fed target" },
    { rate: 3.5, label: "3.5%",  desc: "2023 US" },
    { rate: 9,   label: "9%",    desc: "2022 peak" },
    { rate: 14,  label: "14%",   desc: "1970s US" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Why 2%? The Fed's Inflation Target</h2>
        <p className="text-sm text-muted-foreground">The Fed doesn't target zero inflation. Drag the slider to see why different levels of inflation create very different economic conditions.</p>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-5">
        {/* Rate display */}
        <div className="text-center mb-5">
          <div className="font-display text-5xl font-bold text-foreground">{rate.toFixed(1)}%</div>
          <div className="text-sm text-muted-foreground mt-1">Annual Inflation Rate</div>
          <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold border ${zone.bg} ${zone.color}`}>
            {zone.icon} {zone.label}
          </div>
        </div>

        {/* Slider */}
        <div className="relative mb-2 px-2">
          <div className="relative h-8 flex items-center">
            <div className="absolute left-0 right-0 h-3 rounded-full overflow-hidden">
              <div className="h-full w-full" style={{
                background: "linear-gradient(to right, #3b82f6 0%, #22c55e 15%, #22c55e 25%, #f59e0b 40%, #f97316 65%, #ef4444 100%)"
              }} />
            </div>
            {/* 2% marker */}
            <div className="absolute top-0 h-8 flex flex-col items-center pointer-events-none z-10"
              style={{ left: `${(2 / 20) * 100}%`, transform: "translateX(-50%)" }}>
              <div className="w-0.5 h-full bg-emerald-500/80" />
            </div>
            <input
              type="range" aria-label="Slider" min={0} max={20} step={0.1}
              value={rate}
              onChange={e => { setRate(parseFloat(e.target.value)); setSliderMoved(true); }}
              data-testid="fed-slider"
              className="relative w-full h-3 appearance-none bg-transparent cursor-pointer z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-card [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0% (Deflation risk)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">2% Fed target</span>
            <span>20% (Hyperinflation)</span>
          </div>
        </div>

        {/* Zone explanation */}
        <div className={`p-4 rounded-xl border mt-4 ${zone.bg}`}>
          <p className="text-sm text-foreground leading-relaxed">{zone.desc}</p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Saver Real Return", value: rate <= 2 ? "OK" : rate <= 5 ? "Eroding" : "Negative", color: rate <= 2 ? "text-emerald-600 dark:text-emerald-400" : rate <= 5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400" },
            { label: "Price Signal Clarity", value: rate <= 2 ? "Clear" : rate <= 5 ? "Fuzzy" : "Broken", color: rate <= 2 ? "text-emerald-600 dark:text-emerald-400" : rate <= 5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400" },
            { label: "Long-Term Planning", value: rate <= 2 ? "Easy" : rate <= 5 ? "Harder" : "Very Hard", color: rate <= 2 ? "text-emerald-600 dark:text-emerald-400" : rate <= 5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400" },
          ].map(m => (
            <div key={m.label} className="text-center p-3 bg-muted rounded-lg">
              <div className={`text-xs font-bold ${m.color}`}>{m.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Snap to historical examples */}
      <div className="bg-card border border-card-border rounded-xl p-4 mb-5">
        <h3 className="font-semibold text-sm text-foreground mb-3">Try Historical Rates</h3>
        <div className="flex flex-wrap gap-2">
          {snapPoints.map(s => (
            <button key={s.rate} onClick={() => setRate(s.rate)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                Math.abs(rate - s.rate) < 0.1
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
              }`}>
              {s.desc}: {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-secondary/20 border border-secondary/30 rounded-xl p-4 mb-5 text-sm text-foreground">
        <strong>Why not 0%?</strong> Three reasons: (1) Zero gives no cushion against deflation. (2) The Fed needs the option of negative real interest rates during recessions. (3) Small positive inflation encourages spending over hoarding, keeping the economy moving.
      </div>

      <NavButtons onBack={onBack} onNext={sliderMoved ? onComplete : undefined} nextDisabled={!sliderMoved} nextLabel="Mark Complete ✓" />
      {!sliderMoved && <p className="text-xs text-center text-muted-foreground mt-2">Explore the slider to see how different inflation rates affect the economy.</p>}
    </div>
  );
}


// ─────────────────────────────────────────────
// FRED CPI Data
// ─────────────────────────────────────────────
const NBER_RECESSIONS_CPI: [number,number,number,number][] = [
  [1948,10,1949,10],[1953,7,1954,5],[1957,8,1958,4],[1960,4,1961,2],
  [1969,12,1970,11],[1973,11,1975,3],[1980,1,1980,7],[1981,8,1982,11],
  [1990,7,1991,3],[2001,3,2001,11],[2007,12,2009,6],[2020,2,2020,4],
];

const FRED_CPI_YOY: [number,number,number][] = [[1948, 1, 10.24], [1948, 2, 9.48], [1948, 3, 6.82], [1948, 4, 8.27], [1948, 5, 9.38], [1948, 6, 9.38], [1948, 7, 9.76], [1948, 8, 9.06], [1948, 9, 6.65], [1948, 10, 6.11], [1948, 11, 4.77], [1948, 12, 2.73], [1949, 1, 1.39], [1949, 2, 1.01], [1949, 3, 1.74], [1949, 4, 0.42], [1949, 5, -0.42], [1949, 6, -0.95], [1949, 7, -2.87], [1949, 8, -2.99], [1949, 9, -2.5], [1949, 10, -2.63], [1949, 11, -1.9], [1949, 12, -1.83], [1950, 1, -2.08], [1950, 2, -1.25], [1950, 3, -1.13], [1950, 4, -1.13], [1950, 5, -0.59], [1950, 6, -0.17], [1950, 7, 1.56], [1950, 8, 2.11], [1950, 9, 2.48], [1950, 10, 3.51], [1950, 11, 3.8], [1950, 12, 5.8], [1951, 1, 7.95], [1951, 2, 9.4], [1951, 3, 9.48], [1951, 4, 9.6], [1951, 5, 9.34], [1951, 6, 8.58], [1951, 7, 7.64], [1951, 8, 6.86], [1951, 9, 6.94], [1951, 10, 6.78], [1951, 11, 6.99], [1951, 12, 5.96], [1952, 1, 4.22], [1952, 2, 2.25], [1952, 3, 1.97], [1952, 4, 2.08], [1952, 5, 1.85], [1952, 6, 2.31], [1952, 7, 2.97], [1952, 8, 3.21], [1952, 9, 2.31], [1952, 10, 2.03], [1952, 11, 1.41], [1952, 12, 0.91], [1953, 1, 0.72], [1953, 2, 0.68], [1953, 3, 0.91], [1953, 4, 0.87], [1953, 5, 0.87], [1953, 6, 0.9], [1953, 7, 0.41], [1953, 8, 0.6], [1953, 9, 0.98], [1953, 10, 0.97], [1953, 11, 0.6], [1953, 12, 0.6], [1954, 1, 1.13], [1954, 2, 1.5], [1954, 3, 1.13], [1954, 4, 0.64], [1954, 5, 0.86], [1954, 6, 0.64], [1954, 7, 0.26], [1954, 8, 0.0], [1954, 9, -0.3], [1954, 10, -0.85], [1954, 11, -0.26], [1954, 12, -0.37], [1955, 1, -0.63], [1955, 2, -0.63], [1955, 3, -0.52], [1955, 4, -0.26], [1955, 5, -0.59], [1955, 6, -0.85], [1955, 7, -0.37], [1955, 8, -0.48], [1955, 9, 0.15], [1955, 10, 0.37], [1955, 11, 0.37], [1955, 12, 0.37], [1956, 1, 0.22], [1956, 2, 0.15], [1956, 3, 0.37], [1956, 4, 0.52], [1956, 5, 0.97], [1956, 6, 1.65], [1956, 7, 1.98], [1956, 8, 2.21], [1956, 9, 1.86], [1956, 10, 2.57], [1956, 11, 2.34], [1956, 12, 2.83], [1957, 1, 3.13], [1957, 2, 3.5], [1957, 3, 3.61], [1957, 4, 3.71], [1957, 5, 3.59], [1957, 6, 3.54], [1957, 7, 3.3], [1957, 8, 3.55], [1957, 9, 3.55], [1957, 10, 2.94], [1957, 11, 3.27], [1957, 12, 3.04], [1958, 1, 3.51], [1958, 2, 3.24], [1958, 3, 3.63], [1958, 4, 3.62], [1958, 5, 3.36], [1958, 6, 2.85], [1958, 7, 2.48], [1958, 8, 2.33], [1958, 9, 2.08], [1958, 10, 2.08], [1958, 11, 1.9], [1958, 12, 1.76], [1959, 1, 1.29], [1959, 2, 1.05], [1959, 3, 0.35], [1959, 4, 0.14], [1959, 5, 0.35], [1959, 6, 0.69], [1959, 7, 0.9], [1959, 8, 0.83], [1959, 9, 1.18], [1959, 10, 1.52], [1959, 11, 1.38], [1959, 12, 1.52], [1960, 1, 1.24], [1960, 2, 1.41], [1960, 3, 1.52], [1960, 4, 1.93], [1960, 5, 1.83], [1960, 6, 1.72], [1960, 7, 1.37], [1960, 8, 1.47], [1960, 9, 1.23], [1960, 10, 1.36], [1960, 11, 1.47], [1960, 12, 1.36], [1961, 1, 1.6], [1961, 2, 1.46], [1961, 3, 1.46], [1961, 4, 0.91], [1961, 5, 0.91], [1961, 6, 0.78], [1961, 7, 1.25], [1961, 8, 1.11], [1961, 9, 1.25], [1961, 10, 0.77], [1961, 11, 0.67], [1961, 12, 0.67], [1962, 1, 0.67], [1962, 2, 0.9], [1962, 3, 1.11], [1962, 4, 1.34], [1962, 5, 1.34], [1962, 6, 1.24], [1962, 7, 1.0], [1962, 8, 1.14], [1962, 9, 1.47], [1962, 10, 1.33], [1962, 11, 1.33], [1962, 12, 1.23], [1963, 1, 1.33], [1963, 2, 1.23], [1963, 3, 1.13], [1963, 4, 0.89], [1963, 5, 0.89], [1963, 6, 1.32], [1963, 7, 1.56], [1963, 8, 1.55], [1963, 9, 0.99], [1963, 10, 1.22], [1963, 11, 1.32], [1963, 12, 1.65], [1964, 1, 1.64], [1964, 2, 1.41], [1964, 3, 1.41], [1964, 4, 1.54], [1964, 5, 1.54], [1964, 6, 1.31], [1964, 7, 1.08], [1964, 8, 0.98], [1964, 9, 1.17], [1964, 10, 1.2], [1964, 11, 1.4], [1964, 12, 1.2], [1965, 1, 1.1], [1965, 2, 1.2], [1965, 3, 1.2], [1965, 4, 1.39], [1965, 5, 1.61], [1965, 6, 1.93], [1965, 7, 1.81], [1965, 8, 1.61], [1965, 9, 1.74], [1965, 10, 1.7], [1965, 11, 1.73], [1965, 12, 1.92], [1966, 1, 1.92], [1966, 2, 2.56], [1966, 3, 2.78], [1966, 4, 2.87], [1966, 5, 2.76], [1966, 6, 2.44], [1966, 7, 2.75], [1966, 8, 3.49], [1966, 9, 3.57], [1966, 10, 3.79], [1966, 11, 3.56], [1966, 12, 3.36], [1967, 1, 3.2], [1967, 2, 2.87], [1967, 3, 2.55], [1967, 4, 2.54], [1967, 5, 2.32], [1967, 6, 2.84], [1967, 7, 2.93], [1967, 8, 2.6], [1967, 9, 2.6], [1967, 10, 2.59], [1967, 11, 3.1], [1967, 12, 3.28], [1968, 1, 3.65], [1968, 2, 3.64], [1968, 3, 3.94], [1968, 4, 3.93], [1968, 5, 4.23], [1968, 6, 4.2], [1968, 7, 4.49], [1968, 8, 4.48], [1968, 9, 4.46], [1968, 10, 4.75], [1968, 11, 4.42], [1968, 12, 4.71], [1969, 1, 4.69], [1969, 2, 4.68], [1969, 3, 5.25], [1969, 4, 5.52], [1969, 5, 5.51], [1969, 6, 5.48], [1969, 7, 5.44], [1969, 8, 5.43], [1969, 9, 5.7], [1969, 10, 5.67], [1969, 11, 5.93], [1969, 12, 5.9], [1970, 1, 6.16], [1970, 2, 6.42], [1970, 3, 6.09], [1970, 4, 6.06], [1970, 5, 6.04], [1970, 6, 6.01], [1970, 7, 5.71], [1970, 8, 5.69], [1970, 9, 5.66], [1970, 10, 5.63], [1970, 11, 5.6], [1970, 12, 5.57], [1971, 1, 5.28], [1971, 2, 4.72], [1971, 3, 4.44], [1971, 4, 4.16], [1971, 5, 4.4], [1971, 6, 4.38], [1971, 7, 4.37], [1971, 8, 4.36], [1971, 9, 4.08], [1971, 10, 3.81], [1971, 11, 3.54], [1971, 12, 3.27], [1972, 1, 3.26], [1972, 2, 3.76], [1972, 3, 3.5], [1972, 4, 3.49], [1972, 5, 3.23], [1972, 6, 2.96], [1972, 7, 2.96], [1972, 8, 2.95], [1972, 9, 3.19], [1972, 10, 3.18], [1972, 11, 3.41], [1972, 12, 3.41], [1973, 1, 3.64], [1973, 2, 3.86], [1973, 3, 4.83], [1973, 4, 5.3], [1973, 5, 5.53], [1973, 6, 6.0], [1973, 7, 5.74], [1973, 8, 7.4], [1973, 9, 7.36], [1973, 10, 8.06], [1973, 11, 8.25], [1973, 12, 8.94], [1974, 1, 9.6], [1974, 2, 10.0], [1974, 3, 10.14], [1974, 4, 10.07], [1974, 5, 10.71], [1974, 6, 10.86], [1974, 7, 11.54], [1974, 8, 10.89], [1974, 9, 11.95], [1974, 10, 11.84], [1974, 11, 12.2], [1974, 12, 12.1], [1975, 1, 11.75], [1975, 2, 11.21], [1975, 3, 10.46], [1975, 4, 10.19], [1975, 5, 9.26], [1975, 6, 9.18], [1975, 7, 9.53], [1975, 8, 8.62], [1975, 9, 7.91], [1975, 10, 7.65], [1975, 11, 7.38], [1975, 12, 7.13], [1976, 1, 6.69], [1976, 2, 6.27], [1976, 3, 6.06], [1976, 4, 5.85], [1976, 5, 6.21], [1976, 6, 5.98], [1976, 7, 5.56], [1976, 8, 5.72], [1976, 9, 5.49], [1976, 10, 5.46], [1976, 11, 5.06], [1976, 12, 5.04], [1977, 1, 5.2], [1977, 2, 6.08], [1977, 3, 6.43], [1977, 4, 6.95], [1977, 5, 6.74], [1977, 6, 6.7], [1977, 7, 6.67], [1977, 8, 6.63], [1977, 9, 6.42], [1977, 10, 6.39], [1977, 11, 6.71], [1977, 12, 6.68], [1978, 1, 6.81], [1978, 2, 6.24], [1978, 3, 6.38], [1978, 4, 6.5], [1978, 5, 7.14], [1978, 6, 7.44], [1978, 7, 7.73], [1978, 8, 7.86], [1978, 9, 8.48], [1978, 10, 8.93], [1978, 11, 8.87], [1978, 12, 8.99], [1979, 1, 9.25], [1979, 2, 9.84], [1979, 3, 10.25], [1979, 4, 10.49], [1979, 5, 10.7], [1979, 6, 11.08], [1979, 7, 11.45], [1979, 8, 11.84], [1979, 9, 11.88], [1979, 10, 12.07], [1979, 11, 12.59], [1979, 12, 13.25], [1980, 1, 13.87], [1980, 2, 14.16], [1980, 3, 14.59], [1980, 4, 14.59], [1980, 5, 14.43], [1980, 6, 14.27], [1980, 7, 13.15], [1980, 8, 12.89], [1980, 9, 12.77], [1980, 10, 12.63], [1980, 11, 12.63], [1980, 12, 12.35], [1981, 1, 11.79], [1981, 2, 11.39], [1981, 3, 10.61], [1981, 4, 10.14], [1981, 5, 9.79], [1981, 6, 9.7], [1981, 7, 10.77], [1981, 8, 10.82], [1981, 9, 10.97], [1981, 10, 10.27], [1981, 11, 9.58], [1981, 12, 8.91], [1982, 1, 8.26], [1982, 2, 7.61], [1982, 3, 6.88], [1982, 4, 6.62], [1982, 5, 6.91], [1982, 6, 7.18], [1982, 7, 6.56], [1982, 8, 5.97], [1982, 9, 4.94], [1982, 10, 5.03], [1982, 11, 4.48], [1982, 12, 3.83], [1983, 1, 3.71], [1983, 2, 3.48], [1983, 3, 3.59], [1983, 4, 4.0], [1983, 5, 3.44], [1983, 6, 2.47], [1983, 7, 2.36], [1983, 8, 2.46], [1983, 9, 2.76], [1983, 10, 2.75], [1983, 11, 3.16], [1983, 12, 3.79], [1984, 1, 4.29], [1984, 2, 4.69], [1984, 3, 4.89], [1984, 4, 4.55], [1984, 5, 4.33], [1984, 6, 4.33], [1984, 7, 4.31], [1984, 8, 4.3], [1984, 9, 4.28], [1984, 10, 4.27], [1984, 11, 4.15], [1984, 12, 4.04], [1985, 1, 3.53], [1985, 2, 3.61], [1985, 3, 3.79], [1985, 4, 3.58], [1985, 5, 3.57], [1985, 6, 3.66], [1985, 7, 3.46], [1985, 8, 3.35], [1985, 9, 3.25], [1985, 10, 3.24], [1985, 11, 3.51], [1985, 12, 3.79], [1986, 1, 3.97], [1986, 2, 3.2], [1986, 3, 2.15], [1986, 4, 1.59], [1986, 5, 1.68], [1986, 6, 1.77], [1986, 7, 1.67], [1986, 8, 1.58], [1986, 9, 1.76], [1986, 10, 1.57], [1986, 11, 1.28], [1986, 12, 1.19], [1987, 1, 1.36], [1987, 2, 1.91], [1987, 3, 2.84], [1987, 4, 3.68], [1987, 5, 3.67], [1987, 6, 3.75], [1987, 7, 3.93], [1987, 8, 4.29], [1987, 9, 4.27], [1987, 10, 4.36], [1987, 11, 4.53], [1987, 12, 4.33], [1988, 1, 4.13], [1988, 2, 3.94], [1988, 3, 3.83], [1988, 4, 3.99], [1988, 5, 3.98], [1988, 6, 3.96], [1988, 7, 4.13], [1988, 8, 4.11], [1988, 9, 4.18], [1988, 10, 4.26], [1988, 11, 4.25], [1988, 12, 4.41], [1989, 1, 4.48], [1989, 2, 4.65], [1989, 3, 4.89], [1989, 4, 5.03], [1989, 5, 5.28], [1989, 6, 5.17], [1989, 7, 5.06], [1989, 8, 4.62], [1989, 9, 4.44], [1989, 10, 4.59], [1989, 11, 4.66], [1989, 12, 4.64], [1990, 1, 5.2], [1990, 2, 5.26], [1990, 3, 5.24], [1990, 4, 4.71], [1990, 5, 4.37], [1990, 6, 4.67], [1990, 7, 4.82], [1990, 8, 5.7], [1990, 9, 6.17], [1990, 10, 6.38], [1990, 11, 6.2], [1990, 12, 6.25], [1991, 1, 5.65], [1991, 2, 5.31], [1991, 3, 4.82], [1991, 4, 4.81], [1991, 5, 5.03], [1991, 6, 4.7], [1991, 7, 4.37], [1991, 8, 3.8], [1991, 9, 3.4], [1991, 10, 2.85], [1991, 11, 3.07], [1991, 12, 2.98], [1992, 1, 2.67], [1992, 2, 2.82], [1992, 3, 3.19], [1992, 4, 3.18], [1992, 5, 3.02], [1992, 6, 3.01], [1992, 7, 3.16], [1992, 8, 3.07], [1992, 9, 2.99], [1992, 10, 3.28], [1992, 11, 3.12], [1992, 12, 2.97], [1993, 1, 3.25], [1993, 2, 3.25], [1993, 3, 3.02], [1993, 4, 3.16], [1993, 5, 3.22], [1993, 6, 3.0], [1993, 7, 2.85], [1993, 8, 2.84], [1993, 9, 2.76], [1993, 10, 2.75], [1993, 11, 2.74], [1993, 12, 2.81], [1994, 1, 2.45], [1994, 2, 2.52], [1994, 3, 2.65], [1994, 4, 2.36], [1994, 5, 2.29], [1994, 6, 2.49], [1994, 7, 2.7], [1994, 8, 2.9], [1994, 9, 2.97], [1994, 10, 2.61], [1994, 11, 2.6], [1994, 12, 2.6], [1995, 1, 2.87], [1995, 2, 2.86], [1995, 3, 2.79], [1995, 4, 3.13], [1995, 5, 3.12], [1995, 6, 3.04], [1995, 7, 2.83], [1995, 8, 2.62], [1995, 9, 2.55], [1995, 10, 2.74], [1995, 11, 2.6], [1995, 12, 2.53], [1996, 1, 2.79], [1996, 2, 2.72], [1996, 3, 2.84], [1996, 4, 2.83], [1996, 5, 2.83], [1996, 6, 2.82], [1996, 7, 2.88], [1996, 8, 2.81], [1996, 9, 3.0], [1996, 10, 3.06], [1996, 11, 3.25], [1996, 12, 3.38], [1997, 1, 3.04], [1997, 2, 3.03], [1997, 3, 2.77], [1997, 4, 2.43], [1997, 5, 2.24], [1997, 6, 2.23], [1997, 7, 2.17], [1997, 8, 2.29], [1997, 9, 2.22], [1997, 10, 2.09], [1997, 11, 1.89], [1997, 12, 1.7], [1998, 1, 1.63], [1998, 2, 1.44], [1998, 3, 1.38], [1998, 4, 1.44], [1998, 5, 1.69], [1998, 6, 1.62], [1998, 7, 1.75], [1998, 8, 1.62], [1998, 9, 1.43], [1998, 10, 1.49], [1998, 11, 1.48], [1998, 12, 1.61], [1999, 1, 1.67], [1999, 2, 1.67], [1999, 3, 1.73], [1999, 4, 2.28], [1999, 5, 2.09], [1999, 6, 1.97], [1999, 7, 2.14], [1999, 8, 2.26], [1999, 9, 2.63], [1999, 10, 2.56], [1999, 11, 2.62], [1999, 12, 2.68], [2000, 1, 2.79], [2000, 2, 3.22], [2000, 3, 3.76], [2000, 4, 3.01], [2000, 5, 3.13], [2000, 6, 3.73], [2000, 7, 3.6], [2000, 8, 3.35], [2000, 9, 3.46], [2000, 10, 3.45], [2000, 11, 3.44], [2000, 12, 3.44], [2001, 1, 3.72], [2001, 2, 3.53], [2001, 3, 2.98], [2001, 4, 3.22], [2001, 5, 3.56], [2001, 6, 3.19], [2001, 7, 2.72], [2001, 8, 2.72], [2001, 9, 2.59], [2001, 10, 2.13], [2001, 11, 1.89], [2001, 12, 1.6], [2002, 1, 1.2], [2002, 2, 1.14], [2002, 3, 1.36], [2002, 4, 1.64], [2002, 5, 1.24], [2002, 6, 1.07], [2002, 7, 1.47], [2002, 8, 1.75], [2002, 9, 1.52], [2002, 10, 2.03], [2002, 11, 2.25], [2002, 12, 2.48], [2003, 1, 2.76], [2003, 2, 3.15], [2003, 3, 3.03], [2003, 4, 2.18], [2003, 5, 1.89], [2003, 6, 1.95], [2003, 7, 2.06], [2003, 8, 2.22], [2003, 9, 2.38], [2003, 10, 2.04], [2003, 11, 1.93], [2003, 12, 2.04], [2004, 1, 2.03], [2004, 2, 1.69], [2004, 3, 1.74], [2004, 4, 2.29], [2004, 5, 2.9], [2004, 6, 3.17], [2004, 7, 2.94], [2004, 8, 2.55], [2004, 9, 2.54], [2004, 10, 3.19], [2004, 11, 3.62], [2004, 12, 3.34], [2005, 1, 2.84], [2005, 2, 3.05], [2005, 3, 3.21], [2005, 4, 3.36], [2005, 5, 2.87], [2005, 6, 2.54], [2005, 7, 3.07], [2005, 8, 3.65], [2005, 9, 4.74], [2005, 10, 4.35], [2005, 11, 3.34], [2005, 12, 3.34], [2006, 1, 4.02], [2006, 2, 3.64], [2006, 3, 3.42], [2006, 4, 3.61], [2006, 5, 3.98], [2006, 6, 4.18], [2006, 7, 4.1], [2006, 8, 3.93], [2006, 9, 2.01], [2006, 10, 1.41], [2006, 11, 1.97], [2006, 12, 2.52], [2007, 1, 2.08], [2007, 2, 2.42], [2007, 3, 2.8], [2007, 4, 2.59], [2007, 5, 2.71], [2007, 6, 2.69], [2007, 7, 2.32], [2007, 8, 1.9], [2007, 9, 2.83], [2007, 10, 3.61], [2007, 11, 4.37], [2007, 12, 4.11], [2008, 1, 4.29], [2008, 2, 4.14], [2008, 3, 3.97], [2008, 4, 3.9], [2008, 5, 4.09], [2008, 6, 4.94], [2008, 7, 5.5], [2008, 8, 5.31], [2008, 9, 4.95], [2008, 10, 3.73], [2008, 11, 1.1], [2008, 12, -0.02], [2009, 1, -0.11], [2009, 2, 0.01], [2009, 3, -0.45], [2009, 4, -0.58], [2009, 5, -1.02], [2009, 6, -1.23], [2009, 7, -1.96], [2009, 8, -1.48], [2009, 9, -1.38], [2009, 10, -0.22], [2009, 11, 1.91], [2009, 12, 2.81], [2010, 1, 2.62], [2010, 2, 2.15], [2010, 3, 2.29], [2010, 4, 2.21], [2010, 5, 2.0], [2010, 6, 1.12], [2010, 7, 1.34], [2010, 8, 1.15], [2010, 9, 1.12], [2010, 10, 1.17], [2010, 11, 1.08], [2010, 12, 1.44], [2011, 1, 1.7], [2011, 2, 2.12], [2011, 3, 2.62], [2011, 4, 3.08], [2011, 5, 3.46], [2011, 6, 3.5], [2011, 7, 3.58], [2011, 8, 3.75], [2011, 9, 3.81], [2011, 10, 3.52], [2011, 11, 3.45], [2011, 12, 3.06], [2012, 1, 3.01], [2012, 2, 2.9], [2012, 3, 2.58], [2012, 4, 2.27], [2012, 5, 1.74], [2012, 6, 1.65], [2012, 7, 1.42], [2012, 8, 1.69], [2012, 9, 1.95], [2012, 10, 2.16], [2012, 11, 1.8], [2012, 12, 1.76], [2013, 1, 1.68], [2013, 2, 2.02], [2013, 3, 1.52], [2013, 4, 1.14], [2013, 5, 1.39], [2013, 6, 1.72], [2013, 7, 1.89], [2013, 8, 1.54], [2013, 9, 1.09], [2013, 10, 0.88], [2013, 11, 1.23], [2013, 12, 1.51], [2014, 1, 1.56], [2014, 2, 1.12], [2014, 3, 1.61], [2014, 4, 2.02], [2014, 5, 2.17], [2014, 6, 2.06], [2014, 7, 1.97], [2014, 8, 1.72], [2014, 9, 1.68], [2014, 10, 1.61], [2014, 11, 1.23], [2014, 12, 0.65], [2015, 1, -0.23], [2015, 2, -0.09], [2015, 3, -0.02], [2015, 4, -0.1], [2015, 5, 0.04], [2015, 6, 0.18], [2015, 7, 0.23], [2015, 8, 0.24], [2015, 9, 0.01], [2015, 10, 0.13], [2015, 11, 0.44], [2015, 12, 0.64], [2016, 1, 1.24], [2016, 2, 0.85], [2016, 3, 0.89], [2016, 4, 1.17], [2016, 5, 1.08], [2016, 6, 1.08], [2016, 7, 0.87], [2016, 8, 1.06], [2016, 9, 1.55], [2016, 10, 1.69], [2016, 11, 1.68], [2016, 12, 2.05], [2017, 1, 2.51], [2017, 2, 2.81], [2017, 3, 2.44], [2017, 4, 2.18], [2017, 5, 1.86], [2017, 6, 1.64], [2017, 7, 1.73], [2017, 8, 1.93], [2017, 9, 2.18], [2017, 10, 2.02], [2017, 11, 2.17], [2017, 12, 2.13], [2018, 1, 2.15], [2018, 2, 2.26], [2018, 3, 2.33], [2018, 4, 2.47], [2018, 5, 2.78], [2018, 6, 2.81], [2018, 7, 2.85], [2018, 8, 2.64], [2018, 9, 2.33], [2018, 10, 2.49], [2018, 11, 2.15], [2018, 12, 2.0], [2019, 1, 1.49], [2019, 2, 1.52], [2019, 3, 1.88], [2019, 4, 2.0], [2019, 5, 1.8], [2019, 6, 1.67], [2019, 7, 1.83], [2019, 8, 1.74], [2019, 9, 1.68], [2019, 10, 1.73], [2019, 11, 2.09], [2019, 12, 2.32], [2020, 1, 2.6], [2020, 2, 2.34], [2020, 3, 1.49], [2020, 4, 0.31], [2020, 5, 0.2], [2020, 6, 0.72], [2020, 7, 1.0], [2020, 8, 1.28], [2020, 9, 1.39], [2020, 10, 1.23], [2020, 11, 1.18], [2020, 12, 1.32], [2021, 1, 1.37], [2021, 2, 1.67], [2021, 3, 2.67], [2021, 4, 4.13], [2021, 5, 4.92], [2021, 6, 5.3], [2021, 7, 5.25], [2021, 8, 5.15], [2021, 9, 5.35], [2021, 10, 6.24], [2021, 11, 6.9], [2021, 12, 7.17], [2022, 1, 7.56], [2022, 2, 7.94], [2022, 3, 8.57], [2022, 4, 8.23], [2022, 5, 8.54], [2022, 6, 8.98], [2022, 7, 8.46], [2022, 8, 8.22], [2022, 9, 8.19], [2022, 10, 7.76], [2022, 11, 7.12], [2022, 12, 6.4], [2023, 1, 6.33], [2023, 2, 5.96], [2023, 3, 4.92], [2023, 4, 4.95], [2023, 5, 4.13], [2023, 6, 3.07], [2023, 7, 3.29], [2023, 8, 3.72], [2023, 9, 3.69], [2023, 10, 3.25], [2023, 11, 3.13], [2023, 12, 3.32], [2024, 1, 3.09], [2024, 2, 3.16], [2024, 3, 3.49], [2024, 4, 3.36], [2024, 5, 3.24], [2024, 6, 2.97], [2024, 7, 2.94], [2024, 8, 2.61], [2024, 9, 2.43], [2024, 10, 2.58], [2024, 11, 2.72], [2024, 12, 2.87], [2025, 1, 2.99], [2025, 2, 2.8], [2025, 3, 2.38], [2025, 4, 2.33], [2025, 5, 2.38], [2025, 6, 2.68], [2025, 7, 2.74], [2025, 8, 2.94], [2025, 9, 3.02], [2025, 11, 2.7], [2025, 12, 2.65], [2026, 1, 2.39], [2026, 2, 2.43]]; // [year, month, yoy_pct]

const CPI_QUESTIONS = [
  {
    id: 1,
    question: "CPI peaked at approximately 14.6% in 1980. What caused this, and how was it brought down?",
    options: [
      "Demand-pull inflation from excessive government spending; cured by tax increases",
      "Cost-push inflation from two OPEC oil shocks (1973, 1979) plus loose monetary policy; cured by Fed Chair Volcker raising rates to nearly 20%",
      "Hyperinflation caused by money-printing to fund the Vietnam War; cured by price controls",
      "Supply-chain inflation from Cold War sanctions; cured when détente reduced import costs",
    ],
    answer: 1,
    explanation: "The Great Inflation of the 1970s combined two supply shocks (OPEC oil embargoes raising energy costs) with expansionary monetary policy. Fed Chair Paul Volcker's 'shock therapy' — raising interest rates to nearly 20% — broke inflation expectations but caused the worst recession since the Depression. Inflation fell from 13% to 3% by 1983.",
  },
  {
    id: 2,
    question: "CPI was negative (deflation) briefly in 2009. Why is deflation potentially more dangerous than moderate inflation?",
    options: [
      "Deflation raises real wages, making workers too expensive to hire",
      "Deflation causes consumers to delay purchases expecting lower prices, reducing demand further — a deflationary spiral",
      "The CPI formula overstates deflation, making it appear worse than it is",
      "Deflation is always temporary and self-correcting, so it poses no real risk",
    ],
    answer: 1,
    explanation: "The deflationary trap: if prices will be lower tomorrow, why buy today? Delayed spending → lower revenue → more layoffs → less spending → further deflation. Japan's 'Lost Decade' showed how hard it is to escape once this spiral begins. The 2009 deflation was brief because massive stimulus (TARP, ARRA) prevented a full spiral.",
  },
  {
    id: 3,
    question: "CPI hit 9.1% in June 2022 — the highest since 1981. Looking at the chart, how does the 2021–22 surge compare to the 1970s inflation?",
    options: [
      "They were identical in both cause and severity",
      "2021–22 was much shorter and lower peak than the 1970s, which lasted nearly a decade above 6%",
      "2021–22 was actually more severe than the 1970s in terms of duration",
      "The 1970s inflation was mostly core CPI; 2021–22 was only energy prices",
    ],
    answer: 1,
    explanation: "The 1970s inflation lasted nearly a decade (1973–1982) with multiple waves above 10%. The 2021–22 surge peaked at 9.1% but fell back toward 3% within two years as the Fed raised rates 11 times. The chart clearly shows the 1970s episode as broader and more prolonged — though 2021–22 was still the worst inflation in 40 years.",
  },
  {
    id: 4,
    question: "CPI was remarkably stable near 2–3% from roughly 1990 to 2020. What factors contributed to this 'Great Moderation' of inflation?",
    options: [
      "Government price controls kept inflation artificially low during this period",
      "Credible Fed inflation targeting, globalization (cheap imports), and improved monetary policy frameworks",
      "Oil prices were permanently low, eliminating the main source of inflation",
      "Slow economic growth meant demand never exceeded supply, keeping prices stable",
    ],
    answer: 1,
    explanation: "Three factors drove the Great Moderation: (1) The Fed adopted informal then formal 2% inflation targeting, anchoring expectations. (2) Globalization flooded markets with cheap goods from low-wage countries. (3) Improved monetary frameworks meant the Fed responded faster to inflationary pressures. The 2021 surge showed these factors are not permanent.",
  },
  {
    id: 5,
    question: "The Fed targets 2% inflation — not 0%. Based on what you see in the chart, what happens when inflation gets very close to or below 0%?",
    options: [
      "Nothing unusual — near-zero inflation is the optimal policy target",
      "Deflation risk emerges, as seen in 2009; the 2% buffer gives the Fed room to maneuver before deflation takes hold",
      "GDP automatically contracts when inflation falls below 1%",
      "The Fed raises taxes to prevent deflation in these situations",
    ],
    answer: 1,
    explanation: "The 2009 dip into negative CPI territory shows why the Fed targets 2% rather than 0% — zero provides no buffer against deflationary shocks. With 2% as the target, inflation can fall 2 percentage points before crossing into dangerous territory. The Fed also needs the ability to set real interest rates below zero (negative real rates = nominal rate minus inflation), which requires positive inflation.",
  },
];

function CPIChartStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [tooltip, setTooltip] = useState<{ year: number; month: number; rate: number; x: number } | null>(null);

  const q = CPI_QUESTIONS[questionIdx];
  const selected = answers[questionIdx];
  const isChecked = checked[questionIdx];
  const isCorrect = selected === q.answer;
  const allChecked = CPI_QUESTIONS.every((_, i) => checked[i]);

  const W = 600, H = 200, PAD = { top: 10, right: 15, bottom: 28, left: 44 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const points = FRED_CPI_YOY.map(([yr, mo, rate]) => ({ fYear: yr + (mo - 1) / 12, rate }));
  const minYear = points[0].fYear, maxYear = points[points.length - 1].fYear;
  const minRate = -4, maxRate = 16;

  function xScale(fy: number) { return PAD.left + ((fy - minYear) / (maxYear - minYear)) * chartW; }
  function yScale(v: number)  { return PAD.top + chartH - ((v - minRate) / (maxRate - minRate)) * chartH; }

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.fYear).toFixed(1)},${yScale(p.rate).toFixed(1)}`).join(" ");
  const zeroY = yScale(0);
  const twoY  = yScale(2);

  const recBands = NBER_RECESSIONS_CPI.map(([sy, sm, ey, em]) => ({
    x1: xScale(sy + (sm - 1) / 12), x2: xScale(ey + (em - 1) / 12)
  }));

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / rect.width * W;
    const fYear = minYear + ((rawX - PAD.left) / chartW) * (maxYear - minYear);
    let minDist = Infinity, nearestIdx = 0;
    FRED_CPI_YOY.forEach(([yr, mo], i) => {
      const fy = yr + (mo - 1) / 12;
      const dist = Math.abs(fy - fYear);
      if (dist < minDist) { minDist = dist; nearestIdx = i; }
    });
    if (minDist < 2) {
      const [yr, mo, rate] = FRED_CPI_YOY[nearestIdx];
      setTooltip({ year: yr, month: mo, rate, x: xScale(yr + (mo - 1) / 12) });
    }
  }

  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Reading the Data — Inflation (CPI)</h2>
        <p className="text-sm text-muted-foreground">75+ years of U.S. CPI year-over-year inflation from FRED. Hover to explore historical episodes, then answer the questions.</p>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm text-foreground">U.S. CPI — Year-over-Year Inflation Rate (1948–2026)</h3>
          <span className="text-xs text-muted-foreground">Source: FRED (BLS)</span>
        </div>
        <div className="relative" onMouseLeave={() => setTooltip(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseMove={handleMouseMove} style={{ cursor: "crosshair" }} role="img" aria-label="Interactive data chart. Hover to explore data points.">
            {recBands.map((r, i) => (
              <rect key={i} x={r.x1} y={PAD.top} width={Math.max(0, r.x2 - r.x1)} height={chartH} fill="rgba(156,163,175,0.15)" />
            ))}
            {[-2, 0, 2, 4, 6, 8, 10, 12, 14].map(v => {
              const y = yScale(v);
              if (y < PAD.top - 2 || y > PAD.top + chartH + 2) return null;
              return (
                <g key={v}>
                  <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                    stroke={v === 0 ? "currentColor" : "currentColor"} strokeOpacity={v === 0 ? 0.3 : 0.07} strokeWidth={v === 0 ? 1.5 : 1} />
                  <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize={9} fill="currentColor" fillOpacity={0.4}>{v}%</text>
                </g>
              );
            })}
            {/* Fed 2% target line */}
            <line x1={PAD.left} y1={twoY} x2={W - PAD.right} y2={twoY} stroke="#22c55e" strokeOpacity={0.4} strokeWidth={1} strokeDasharray="4,3" />
            <text x={W - PAD.right - 2} y={twoY - 3} textAnchor="end" fontSize={8} fill="#22c55e" fillOpacity={0.7}>2% target</text>
            {[1950,1960,1970,1980,1990,2000,2010,2020].map(yr => (
              <text key={yr} x={xScale(yr)} y={H - 6} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.4}>{yr}</text>
            ))}
            <path d={pathD} fill="none" stroke="hsl(38 95% 50%)" strokeWidth={1.5} />
            {tooltip && <line x1={tooltip.x} y1={PAD.top} x2={tooltip.x} y2={PAD.top + chartH} stroke="white" strokeOpacity={0.3} strokeWidth={1} strokeDasharray="3,3" />}
          </svg>
          {tooltip && (
            <div className={`absolute top-2 bg-card border border-card-border rounded-lg p-2 text-xs shadow-md pointer-events-none ${tooltip.year > 1985 ? "left-2" : "right-2"}`}>
              <div className="font-bold text-foreground mb-1">{MONTH_NAMES[tooltip.month - 1]} {tooltip.year}</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> CPI YoY: <strong>{tooltip.rate.toFixed(1)}%</strong></div>
            </div>
          )}
        </div>
        <div className="flex gap-5 mt-1 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-primary inline-block rounded" /> CPI YoY %</span>
          <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 border-t border-dashed border-emerald-500 inline-block" /> Fed 2% Target</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block bg-gray-200 dark:bg-gray-700 rounded-sm border border-gray-300 dark:border-gray-600" /> Recession</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-4">
        {CPI_QUESTIONS.map((_, i) => (
          <button key={i} onClick={() => setQuestionIdx(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === questionIdx ? "bg-primary" :
              checked[i] ? (answers[i] === CPI_QUESTIONS[i].answer ? "bg-emerald-400" : "bg-red-400") :
              answers[i] !== undefined ? "bg-primary/40" : "bg-muted"
            }`} />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-5 mb-4">
        <span className="text-xs font-semibold text-muted-foreground">Question {questionIdx + 1} of {CPI_QUESTIONS.length}</span>
        <p className="text-base font-medium text-foreground mt-2 mb-4 leading-relaxed">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isSel = selected === i;
            const isCorrectOpt = q.answer === i;
            return (
              <button key={i} onClick={() => !isChecked && setAnswers(prev => ({ ...prev, [questionIdx]: i }))} disabled={isChecked}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  isChecked ? (isCorrectOpt ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-300" : isSel ? "bg-red-50 dark:bg-red-950/30 border-red-300 text-red-800 dark:text-red-200" : "bg-muted border-border text-muted-foreground opacity-50 cursor-default")
                  : isSel ? "bg-primary/10 border-primary text-foreground" : "bg-muted hover:bg-accent text-foreground border-border"
                }`}>
                <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>
        {!isChecked && selected !== undefined && (
          <button onClick={() => setChecked(prev => ({ ...prev, [questionIdx]: true }))} className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check Answer
          </button>
        )}
        {isChecked && (
          <div className={`mt-4 p-3 rounded-xl text-sm border ${isCorrect ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"} text-foreground`}>
            <strong>{isCorrect ? "✓ Correct! " : "✗ Not quite. "}</strong>{q.explanation}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setQuestionIdx(Math.max(0, questionIdx - 1))} disabled={questionIdx === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          <ChevronLeft size={16}/> Previous
        </button>
        {questionIdx < CPI_QUESTIONS.length - 1 ? (
          <button onClick={() => setQuestionIdx(questionIdx + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Question <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>
      <NavButtons onBack={onBack} onNext={allChecked ? onComplete : undefined} nextDisabled={!allChecked} nextLabel="Mark Complete ✓" />
      {!allChecked && <p className="text-xs text-center text-muted-foreground mt-2">Answer all 5 questions to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Quiz
// ─────────────────────────────────────────────

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle answer options while keeping correct answer tracking
function shuffleOpts<T extends { options: string[]; answer: number | number[] }>(q: T): T {
  const indices = q.options.map((_, i) => i);
  const shuffled = shuffle(indices);
  const newOptions = shuffled.map(i => q.options[i]);
  const newAnswer = Array.isArray(q.answer)
    ? (q.answer as number[]).map(a => shuffled.indexOf(a))
    : shuffled.indexOf(q.answer as number);
  return { ...q, options: newOptions, answer: newAnswer };
}


function QuizStation({ onNext, onBack }: { onNext: (score: number, results: { correct: boolean; exp: string }[]) => void; onBack: () => void }) {
  const [questions] = useState(() =>
    shuffle(QUIZ_QUESTIONS).map(q => shuffleOpts({ ...q, options: q.options }))
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const q = questions[currentQ];
  const isChecked = checked[currentQ];

  function isAnswerCorrect(qIdx: number): boolean {
    const question = questions[qIdx];
    const given = answers[qIdx];
    if (question.multi) {
      const correct = (question.answer as number[]).slice().sort().join(",");
      const userArr = Array.isArray(given) ? (given as number[]).slice().sort().join(",") : "";
      return correct === userArr;
    }
    return given === question.answer;
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
      const current = (prev[currentQ] as number[] | undefined) ?? [];
      const already = current.includes(idx);
      return { ...prev, [currentQ]: already ? current.filter(x => x !== idx) : [...current, idx] };
    });
  }

  function handleCheck() {
    if (!hasSelection(currentQ)) return;
    setChecked(prev => ({ ...prev, [currentQ]: true }));
  }

  const allAnswered = QUIZ_QUESTIONS.every((_, i) => hasSelection(i));
  const score = QUIZ_QUESTIONS.filter((_, i) => isAnswerCorrect(i)).length;

  function handleSubmit() {
    const results = QUIZ_QUESTIONS.map((q, i) => ({ correct: isAnswerCorrect(i), exp: q.explanation }));
    onNext(score, results);
  }
  const isCorrectForQ = isChecked && isAnswerCorrect(currentQ);

  function optionStyle(i: number): string {
    const correctAnswers = q.multi ? (q.answer as number[]) : [q.answer as number];
    const userAnswer = answers[currentQ];
    const userSelected = q.multi
      ? (Array.isArray(userAnswer) ? (userAnswer as number[]).includes(i) : false)
      : userAnswer === i;
    const isInCorrectSet = correctAnswers.includes(i);
    if (!isChecked) {
      return userSelected
        ? "bg-primary/10 border-primary text-foreground"
        : "bg-muted hover:bg-accent hover:text-accent-foreground text-foreground border-border";
    }
    if (isInCorrectSet) return "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-300 dark:ring-emerald-700";
    if (userSelected && !isInCorrectSet) return "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200";
    return "bg-muted text-foreground border-border opacity-50";
  }

  function navDotStyle(i: number): string {
    if (i === currentQ) return "bg-primary";
    if (checked[i]) return isAnswerCorrect(i) ? "bg-emerald-400" : "bg-red-400";
    if (hasSelection(i)) return "bg-primary/40";
    return "bg-muted";
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-bold text-xl text-foreground">Assessment Quiz</h2>
          <span className="text-sm font-semibold text-muted-foreground">Q {currentQ + 1} / {questions.length}</span>
        </div>
        <p className="text-sm text-muted-foreground">Screenshot your final score to submit to your instructor.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {QUIZ_QUESTIONS.map((_, i) => (
          <button key={i} onClick={() => setCurrentQ(i)} data-testid={`quiz-nav-${i}`}
            className={`flex-1 h-2 rounded-full transition-all ${navDotStyle(i)}`} />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        {q.multi && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Select ALL that apply</span>
          </div>
        )}
        <p className="text-base font-medium text-foreground mb-5">{q.question}</p>

        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            const userAnswer = answers[currentQ];
            const isSelected = q.multi
              ? (Array.isArray(userAnswer) ? (userAnswer as number[]).includes(i) : false)
              : userAnswer === i;

            if (q.multi) {
              return (
                <button key={i} onClick={() => handleToggle(i)} disabled={isChecked} data-testid={`quiz-option-${i}`}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-start gap-3 ${isChecked ? optionStyle(i) + " cursor-default" : optionStyle(i)}`}>
                  <span className={`shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isSelected ? "bg-primary border-primary" : "border-current opacity-50"}`}>
                    {isSelected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </span>
                  <span><span className="font-semibold mr-1">{String.fromCharCode(65 + i)}.</span> {opt}</span>
                </button>
              );
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={isChecked} data-testid={`quiz-option-${i}`}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${isChecked ? optionStyle(i) + " cursor-default" : optionStyle(i)}`}>
                <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
              </button>
            );
          })}
        </div>

        {!isChecked && hasSelection(currentQ) && (
          <button onClick={handleCheck} data-testid="quiz-check" className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check Answer
          </button>
        )}

        {isChecked && (
          <div className={`mt-4 p-3 rounded-xl text-sm ${isCorrectForQ ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800"} text-foreground`}>
            <strong>{isCorrectForQ ? "✓ Correct! " : "✗ Not quite. "}</strong>{q.explanation}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          <ChevronLeft size={16}/> Previous
        </button>
        {currentQ < questions.length - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Question <ChevronRight size={16}/>
          </button>
        ) : allAnswered ? (
          <button onClick={handleSubmit} data-testid="quiz-submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
            <Award size={16}/> See My Results
          </button>
        ) : (
          <span className="text-xs text-muted-foreground">Answer all questions to submit</span>
        )}
      </div>

      <NavButtons onBack={onBack} />
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Not Yet (mastery gate)
// ─────────────────────────────────────────────
const QUESTION_STATION_MAP: Record<number, { station: Station; label: string }> = {
  0: { station: "basket",    label: "Price Basket" },
  1: { station: "basket",    label: "Price Basket" },
  2: { station: "fedtarget", label: "2% Target" },
  3: { station: "basket",    label: "Price Basket" },
  4: { station: "winners",   label: "Who Wins?" },
  5: { station: "cpi",       label: "CPI Math" },
  6: { station: "history",   label: "History" },
  7: { station: "deflation", label: "Deflation" },
  8: { station: "basket",    label: "Price Basket" },
  9: { station: "winners",   label: "Who Wins?" },
};

function NotYetStation({ score, wrongIndices, onRetake, onGoToStation }: {
  score: number; wrongIndices: number[]; onRetake: () => void; onGoToStation: (s: Station) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div data-testid="not-yet-card" className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-8 mb-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/40 mb-4">
          <span className="text-4xl">📚</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-amber-800 dark:text-amber-200 mb-3">Not quite there yet</h2>
        <p className="text-sm text-amber-700 dark:text-amber-300 max-w-sm mx-auto leading-relaxed">
          You scored <strong>{score}/10</strong> — you need <strong>9 out of 10</strong> to complete this lab.
          Review the stations linked below, then retake the quiz.
        </p>
        <p className="text-xs text-amber-600/70 dark:text-amber-400/50 mt-4 italic">
          This screen cannot be submitted. Only the final Results screen counts.
        </p>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <h3 className="font-semibold text-sm text-foreground mb-1">Questions to revisit</h3>
        <p className="text-xs text-muted-foreground mb-3">Click a station to review, then come back and retake.</p>
        <div className="space-y-2">
          {wrongIndices.map(i => (
            <div key={i} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted">
              <div>
                <span className="text-xs font-bold text-muted-foreground">Q{i + 1} • </span>
                <span className="text-xs text-foreground">{QUIZ_QUESTIONS[i].question.substring(0, 70)}{QUIZ_QUESTIONS[i].question.length > 70 ? "…" : ""}</span>
              </div>
              <button onClick={() => onGoToStation(QUESTION_STATION_MAP[i].station)}
                className="shrink-0 text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all">
                Review: {QUESTION_STATION_MAP[i].label}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">Review the stations above, then retake.</div>
        <button onClick={onRetake} data-testid="btn-retake"
          className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
          <RotateCcw size={14}/> Retake Quiz
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Results
// ─────────────────────────────────────────────
function ResultsStation({ score, results, onRestart }: { score: number; results: { correct: boolean; exp: string }[]; onRestart: () => void }) {
  // Mark lab complete in localStorage for Hub tracking
  if (typeof window !== 'undefined') { try { localStorage.setItem('econlab_done_ch9', 'true'); } catch(e) {} }
  const [reflection, setReflection] = useState("");
  const [studentName, setStudentName] = useState("");
  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  const grade =
    score === 10 ? { label: "Excellent",   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-700", msg: "Perfect score! You've mastered the core concepts of inflation measurement." } :
    score >= 8  ? { label: "Strong",       color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-700",    msg: "Solid understanding — review the questions you missed and you'll be set." } :
    score >= 6  ? { label: "Developing",   color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-700",  msg: "Good foundation. Revisit the basket and winners stations to sharpen your understanding." } :
                  { label: "Needs Review", color: "text-red-600 dark:text-red-400",      bg: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-700",          msg: "Go back through the interactive stations before the next class. Focus on the CPI math and deflation sections." };

  return (
    <div className="max-w-2xl mx-auto">
      <div data-testid="results-card" className="bg-card border border-card-border rounded-2xl p-8 mb-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 mb-4">
          <Award size={36} className="text-primary" />
        </div>
        <div className="font-display text-5xl font-bold text-foreground mb-1">{score}/{QUIZ_QUESTIONS.length}</div>
        <div className="text-lg text-muted-foreground mb-4">{pct}% — {grade.label}</div>
        <div className={`inline-block px-5 py-3 rounded-xl border text-sm ${grade.bg} ${grade.color} font-medium max-w-sm`}>
          {grade.msg}
        </div>
        <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
          <div className="font-semibold text-foreground mb-1">Econ Lab · Chapter 9: Inflation</div>
          <div className="mt-4 space-y-3 text-left">
            <div>
              <label htmlFor="student-name-input" className="text-xs font-semibold text-foreground block mb-1">Your Name (required for submission)</label>
              <input
                id="student-name-input"
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="First and Last Name"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
                      <button
            onClick={() => {
              if (!studentName.trim()) { alert("Please enter your name before printing."); return; }
              const html = '<html><head><title>ECO 210 ECONLAB</title><style>body{font-family:Arial,sans-serif;padding:20px;max-width:680px;margin:0 auto}@media print{button{display:none}}</style></head><body>'
                + '<h2 style="margin:0">ECO 210 ECONLAB - Lab Complete</h2>'
                + '<p style="color:#475569;margin:2px 0">Chapter 9: Inflation</p>'
                + '<p style="font-size:22px;font-weight:bold;background:#1e2d4a;color:white;display:inline-block;padding:4px 16px;border-radius:99px;margin:8px 0">' + score + ' / 10</p>'
                + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
                + '<h3 style="font-size:13px;margin:0 0 6px">Question Review</h3>' + results.map((r, i) => '<p style="border-left:4px solid ' + (r.correct ? '#16a34a' : '#dc2626') + ';background:' + (r.correct ? '#f0fdf4' : '#fef2f2') + ';padding:6px 10px;margin:3px 0;font-size:12px"><b>Q' + (i+1) + ' ' + (r.correct ? '\u2713' : '\u2717') + ':</b> ' + r.exp + '</p>').join('')
                + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
                + '<p style="font-size:13px"><b>Reflection:</b></p><p style="border:1px solid #ccc;padding:8px;border-radius:4px;font-size:13px;min-height:40px">' + (reflection || '') + '</p>'
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
            <p className="text-xs text-muted-foreground text-center">In the print dialog, choose "Save as PDF" and submit the file to Brightspace.</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
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

      <div className="bg-card border border-card-border rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-sm text-foreground mb-2">Exit Ticket (Optional)</h3>
        <p className="text-xs text-muted-foreground mb-3">In 2–3 sentences: What is one thing from today's lab that surprised you or changed how you think about inflation?</p>
        <textarea
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          data-testid="exit-ticket"
          rows={3}
          placeholder="Type your reflection here…"
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground mt-1">Screenshot this page after writing your reflection to include it with your submission.</p>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onRestart} data-testid="btn-restart"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <RotateCcw size={14}/> Start Over
        </button>
        <div className="text-xs text-muted-foreground italic">Great work today.</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
export default function EconLab() {
  const [station, setStation] = useState<Station>("intro");
  const [completed, setCompleted] = useState<Set<Station>>(new Set());
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const MASTERY_THRESHOLD = 9;

  function scrollTop() {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function go(s: Station) {
    setStation(s);
    scrollTop();
  }

  function complete(s: Station) {
    setCompleted(prev => new Set([...prev, s]));
    go("intro");
  }

  function handleQuizComplete(score: number, results: { correct: boolean; exp: string }[]) {
    setQuizScore(score);
    setQuizResults(results);
    if (score >= MASTERY_THRESHOLD) {
      go("results");
    } else {
      go("not-yet");
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <Header station={station} onStation={go} completed={completed} />
      <main id="main-content" ref={contentRef} className="flex-1 px-4 py-8">
        {station === "intro"      && <IntroStation completed={completed} onGoTo={go} />}
        {station === "recap"      && <RecapStation onComplete={() => complete("recap")} onBack={() => go("intro")} />}
        {station === "basket"     && <BasketStation onComplete={() => complete("basket")} onBack={() => go("intro")} />}
        {station === "cpi"        && <CPIStation onComplete={() => complete("cpi")} onBack={() => go("intro")} />}
        {station === "history"    && <HistoryStation onComplete={() => complete("history")} onBack={() => go("intro")} />}
        {station === "winners"    && <WinnersStation onComplete={() => complete("winners")} onBack={() => go("intro")} />}
        {station === "deflation"  && <DeflationStation onComplete={() => complete("deflation")} onBack={() => go("intro")} />}
        {station === "fedtarget"  && <FedTargetStation onComplete={() => complete("fedtarget")} onBack={() => go("intro")} />}
        {station === "fredchart"   && <CPIChartStation onComplete={() => complete("fredchart")} onBack={() => go("intro")} />}
        {station === "quiz"       && <QuizStation onNext={handleQuizComplete} onBack={() => go("intro")} />}
        {station === "not-yet"    && <NotYetStation score={quizScore} wrongIndices={wrongIndices} onRetake={() => go("quiz")} onGoToStation={go} />}
        {station === "results"    && <ResultsStation score={quizScore} results={quizResults} onRestart={() => { setQuizScore(0); setWrongIndices([]); setCompleted(new Set()); go("intro"); }} />}
            <div role="alert" aria-live="polite" className="sr-only" id="lab-feedback" />
    </main>
    </div>
  );
}