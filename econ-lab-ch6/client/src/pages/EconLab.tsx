import { useState, useRef, useEffect } from "react";
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, Award, BarChart2, BookOpen, RotateCcw, Zap, DollarSign, TrendingUp } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "counts" | "components" | "calculator" | "cycle" | "fredchart" | "limitations" | "quiz" | "results" | "not-yet";

// ─────────────────────────────────────────────
// FRED Data (source: Federal Reserve Bank of St. Louis)
// ─────────────────────────────────────────────
const FRED_GDP_NOMINAL: [number, number][] = [[1947, 259.7], [1948, 280.4], [1949, 270.6], [1950, 319.9], [1951, 356.2], [1952, 380.8], [1953, 386.0], [1954, 399.7], [1955, 437.1], [1956, 460.5], [1957, 474.9], [1958, 499.6], [1959, 528.6], [1960, 540.2], [1961, 580.6], [1962, 612.3], [1963, 653.9], [1964, 697.3], [1965, 771.9], [1966, 833.3], [1967, 881.4], [1968, 968.0], [1969, 1038.1], [1970, 1088.6], [1971, 1190.3], [1972, 1328.9], [1973, 1476.3], [1974, 1599.7], [1975, 1761.8], [1976, 1934.3], [1977, 2164.3], [1978, 2476.9], [1979, 2723.9], [1980, 2985.6], [1981, 3280.8], [1982, 3402.6], [1983, 3794.7], [1984, 4148.6], [1985, 4444.1], [1986, 4657.6], [1987, 5008.0], [1988, 5399.5], [1989, 5747.2], [1990, 6004.7], [1991, 6264.5], [1992, 6680.8], [1993, 7013.7], [1994, 7455.3], [1995, 7772.6], [1996, 8259.8], [1997, 8765.9], [1998, 9294.0], [1999, 9900.2], [2000, 10435.7], [2001, 10660.5], [2002, 11061.4], [2003, 11772.2], [2004, 12527.2], [2005, 13324.2], [2006, 14039.6], [2007, 14715.1], [2008, 14608.2], [2009, 14651.2], [2010, 15309.5], [2011, 15842.3], [2012, 16420.4], [2013, 17192.0], [2014, 17912.1], [2015, 18435.1], [2016, 19089.4], [2017, 20037.1], [2018, 20917.9], [2019, 21933.2], [2020, 22087.2], [2021, 24813.6], [2022, 26770.5], [2023, 28424.7], [2024, 29825.2], [2025, 31422.5]]; // billions, current dollars
const FRED_GDP_REAL: [number, number][]    = [[1947, 2206.5], [1948, 2292.4], [1949, 2257.4], [1950, 2559.2], [1951, 2699.2], [1952, 2843.9], [1953, 2858.8], [1954, 2936.9], [1955, 3130.1], [1956, 3192.6], [1957, 3203.9], [1958, 3289.0], [1959, 3439.8], [1960, 3470.3], [1961, 3692.3], [1962, 3851.4], [1963, 4050.1], [1964, 4259.0], [1965, 4619.5], [1966, 4827.5], [1967, 4956.5], [1968, 5202.2], [1969, 5308.6], [1970, 5299.7], [1971, 5531.0], [1972, 5912.2], [1973, 6150.1], [1974, 6030.5], [1975, 6184.5], [1976, 6451.2], [1977, 6774.6], [1978, 7225.8], [1979, 7318.5], [1980, 7315.7], [1981, 7410.8], [1982, 7303.8], [1983, 7880.8], [1984, 8320.2], [1985, 8668.2], [1986, 8920.2], [1987, 9319.3], [1988, 9673.4], [1989, 9938.8], [1990, 9998.7], [1991, 10115.3], [1992, 10558.6], [1993, 10834.0], [1994, 11279.9], [1995, 11528.1], [1996, 12037.8], [1997, 12577.5], [1998, 13191.7], [1999, 13828.0], [2000, 14229.8], [2001, 14253.6], [2002, 14537.6], [2003, 15162.8], [2004, 15670.9], [2005, 16136.7], [2006, 16561.9], [2007, 16915.2], [2008, 16485.3], [2009, 16502.8], [2010, 16960.9], [2011, 17222.6], [2012, 17489.9], [2013, 18016.1], [2014, 18500.0], [2015, 18892.2], [2016, 19304.4], [2017, 19882.4], [2018, 20304.9], [2019, 20985.4], [2020, 20791.9], [2021, 21988.7], [2022, 22278.3], [2023, 23033.8], [2024, 23586.5], [2025, 24055.7]]; // billions, chained 2017 dollars

// NBER recession shading [startYear, startMonth, endYear, endMonth]
const RECESSIONS: [number,number,number,number][] = [
  [1948,10,1949,10],[1953,7,1954,5],[1957,8,1958,4],[1960,4,1961,2],
  [1969,12,1970,11],[1973,11,1975,3],[1980,1,1980,7],[1981,7,1982,11],
  [1990,7,1991,3],[2001,3,2001,11],[2007,12,2009,6],[2020,2,2020,4],
];

// ─────────────────────────────────────────────
// Station Data
// ─────────────────────────────────────────────

// Station 1 — Does It Count?
type CountsAnswer = "yes" | "no" | null;
const COUNTS_ITEMS = [
  { id: 1, item: "A loaf of bread sold at a grocery store", answer: "yes" as CountsAnswer, explanation: "A final good sold to its end consumer. Counted in C (Consumption)." },
  { id: 2, item: "Wheat sold from a farm to a flour mill", answer: "no" as CountsAnswer, explanation: "An intermediate good used to produce something else. Counting it would double-count the final bread." },
  { id: 3, item: "A Social Security check sent to a retiree", answer: "no" as CountsAnswer, explanation: "A transfer payment — the government redistributes existing income, no new production occurs." },
  { id: 4, item: "A BMW car assembled in Spartanburg, South Carolina", answer: "yes" as CountsAnswer, explanation: "Production occurred within U.S. borders. Location of production determines GDP assignment, not company nationality." },
  { id: 5, item: "A used 2018 Honda Civic sold on Craigslist", answer: "no" as CountsAnswer, explanation: "It was counted when first sold new in 2018. Including it again would double-count the same production." },
  { id: 6, item: "A homeowner mowing their own lawn", answer: "no" as CountsAnswer, explanation: "Non-market household production — no transaction occurs. If they hired someone to do it, that would count." },
  { id: 7, item: "A contractor builds a brand-new house", answer: "yes" as CountsAnswer, explanation: "New residential construction counts as Investment (I), not Consumption, because housing provides services over many years." },
  { id: 8, item: "An iPhone assembled in China, sold to a U.S. consumer", answer: "no" as CountsAnswer, explanation: "It appears in C (+$1,000) but is subtracted in imports (−$1,000). Net effect on U.S. GDP: zero. Production was abroad." },
  { id: 9, item: "A city government hires workers to repave a road", answer: "yes" as CountsAnswer, explanation: "Government purchases of goods and services count as G. Note: the wages paid are also counted through G spending." },
  { id: 10, item: "An illegal drug sale between two individuals", answer: "no" as CountsAnswer, explanation: "Not recorded in official market transactions. GDP only captures legal market activity, so this production is missed entirely." },
];

// Station 2 — What Component?
type GDPComponent = "C" | "I" | "G" | "NX_export" | "NX_import" | null;
const COMPONENT_ITEMS = [
  { id: 1, item: "A family buys a week's worth of groceries", answer: "C" as GDPComponent, explanation: "Household spending on non-durable goods → Consumption (C), the largest component at ~68% of U.S. GDP." },
  { id: 2, item: "Apple builds a new data center in Texas", answer: "I" as GDPComponent, explanation: "Business fixed investment — creating new physical capital. Investment (I) is NOT buying stocks; it means building productive capacity." },
  { id: 3, item: "The U.S. Army buys F-35 fighter jets", answer: "G" as GDPComponent, explanation: "Government spending on goods and services (G). Note: transfer payments like Social Security are excluded from G." },
  { id: 4, item: "Boeing sells a 787 Dreamliner to Japan Airlines", answer: "NX_export" as GDPComponent, explanation: "An export — U.S. production sold abroad. Exports ADD to GDP via Net Exports (NX = Exports − Imports)." },
  { id: 5, item: "A U.S. consumer buys a Toyota made in Japan", answer: "NX_import" as GDPComponent, explanation: "An import — foreign production sold domestically. Imports are SUBTRACTED from NX to correct for the fact that C already counted this spending." },
  { id: 6, item: "A developer builds a new apartment complex", answer: "I" as GDPComponent, explanation: "Residential investment — new construction counts as I. The apartments provide housing services over many years." },
  { id: 7, item: "A student pays tuition at a state university", answer: "C" as GDPComponent, explanation: "Household spending on a service (education) → Consumption (C). Services make up nearly half of all U.S. consumption." },
  { id: 8, item: "Congress funds construction of a new interstate bridge", answer: "G" as GDPComponent, explanation: "Government spending on infrastructure → G. This is one of the largest categories within G after defense." },
  { id: 9, item: "A manufacturing firm buys industrial robots for its assembly line", answer: "I" as GDPComponent, explanation: "Business equipment investment → I. This is exactly the kind of physical capital accumulation that drives long-run productivity growth." },
  { id: 10, item: "A family pays a plumber to fix a broken pipe", answer: "C" as GDPComponent, explanation: "Household spending on a service → Consumption (C). Even repair services count — production of a service occurred." },
];

const COMPONENT_LABELS: Record<string, { short: string; color: string; bg: string }> = {
  C:         { short: "C",  color: "text-blue-700 dark:text-blue-300",   bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" },
  I:         { short: "I",  color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" },
  G:         { short: "G",  color: "text-purple-700 dark:text-purple-300",  bg: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800" },
  NX_export: { short: "NX+", color: "text-amber-700 dark:text-amber-300",   bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800" },
  NX_import: { short: "NX−", color: "text-red-700 dark:text-red-300",     bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" },
};

// Station 3 — Calculator
type CalcState = { input: string; attempts: number; correct: boolean };
const CALC_PROBLEMS = [
  {
    id: 1,
    title: "Calculating Real GDP",
    context: "In 2022, the U.S. had a Nominal GDP of $25,463 billion. The GDP Price Index (with 2017 as the base year) was 121.7. Calculate Real GDP.",
    formula: "Real GDP = (Nominal GDP ÷ Price Index) × 100",
    hint: "Divide Nominal GDP by the Price Index, then multiply by 100. Think of it as removing the inflation markup from the nominal figure.",
    correctAnswer: 20923.2,
    tolerance: 15,
    unit: "$ billion",
    explanation: "Real GDP = ($25,463 ÷ 121.7) × 100 = $20,923B. The difference shows how much of the nominal increase since 2017 was just inflation, not real growth.",
  },
  {
    id: 2,
    title: "GDP Growth Rate",
    context: "U.S. Real GDP was $21,376 billion in 2021 and $23,315 billion in 2022 (chained 2017 dollars). Calculate the real GDP growth rate.",
    formula: "Growth Rate = (New − Old) ÷ Old × 100",
    hint: "Divide by the OLD value (2021), not the new one. A common mistake is dividing by the larger, more recent number.",
    correctAnswer: 9.1,
    tolerance: 0.4,
    unit: "%",
    explanation: "Growth Rate = ($23,315 − $21,376) ÷ $21,376 × 100 = 9.1%. This was an unusually strong post-COVID rebound year.",
  },
  {
    id: 3,
    title: "Real vs. Nominal: Did We Actually Grow?",
    context: "Country X had Nominal GDP of $500B in 2020 and $560B in 2021. The price level rose by 12% during that period. Did real output increase or decrease, and by approximately how much?",
    formula: "Step 1: Real GDP (current yr) = Nominal GDP ÷ (1 + inflation rate)\nStep 2: Growth Rate = (Real GDP current − Real GDP base) ÷ Real GDP base × 100",
    hint: "Adjust the current year nominal GDP for inflation first: divide by (1 + inflation rate). Then compare to the base year to find the real growth rate.",
    correctAnswer: 0.0,
    tolerance: 0.5,
    unit: "% real growth",
    explanation: "Real GDP₂₀₂₁ = $560B ÷ 1.12 = $500B — identical to 2020. The entire nominal 12% increase was inflation. Zero real growth despite rising numbers.",
  },
];

// Station 4 — Business Cycle
const CYCLE_EVENTS = [
  { id: "peak_2007",    year: 2007, label: "Peak (2007)", type: "peak",      desc: "The economy reached its pre-crisis high in late 2007 before the financial crisis hit." },
  { id: "trough_2009",  year: 2009, label: "Trough (2009)", type: "trough",  desc: "Real GDP bottomed out in mid-2009 — the worst point of the Great Recession." },
  { id: "expansion",    year: 2012, label: "Expansion (2010–2019)", type: "expansion", desc: "The longest expansion in U.S. history — 128 months of continuous growth." },
  { id: "peak_2020",    year: 2020, label: "COVID Shock (Feb 2020)", type: "peak", desc: "The shortest recession on record — just 2 months. GDP fell 9% in Q2 2020." },
  { id: "recovery",     year: 2021, label: "Recovery (2021)", type: "expansion", desc: "GDP rebounded sharply as vaccines rolled out and stimulus supported demand." },
];

const CYCLE_QUESTIONS = [
  { question: "Which labeled point shows the post-COVID recovery in 2021?", answer: "recovery", hint: "GDP rebounded strongly in 2021 with vaccine rollout and stimulus support. Look for the sharp rise after the COVID shock." },
  { question: "Which labeled point marks the TROUGH of the Great Recession — the lowest point before recovery began?", answer: "trough_2009", hint: "A trough is the lowest GDP point. The Great Recession officially ended in mid-2009." },
  { question: "Which labeled point represents the COVID-19 economic shock in early 2020?", answer: "peak_2020", hint: "COVID caused the sharpest but shortest recession on record — GDP fell 9% in Q2 2020." },
  { question: "Which labeled point marks the PEAK just before the Great Recession — the highest GDP before the downturn?", answer: "peak_2007", hint: "A peak is the high point before a downturn. Look at 2007 just before the financial crisis hit." },
  { question: "Which labeled region corresponds to the longest economic expansion in U.S. post-WWII history?", answer: "expansion", hint: "The 2010–2019 expansion lasted 128 months — look for the long stretch between the two recessions." },
];

// Station 5 — GDP Limitations
const LIMITATIONS = [
  { id: 1, limitation: "Leisure time is ignored", explanation: "A country where everyone works 80-hour weeks may have higher GDP but lower quality of life than one with 40-hour weeks. GDP cannot distinguish between them." },
  { id: 2, limitation: "Household production is excluded", explanation: "When you cook dinner at home — zero GDP. When you order delivery — it counts. Yet both result in a meal. Non-market production is invisible to GDP." },
  { id: 3, limitation: "Environmental damage isn't subtracted", explanation: "Clear-cutting a forest raises GDP through timber sales, but we don't subtract the lost ecosystem services, biodiversity, or future recreational value." },
  { id: 4, limitation: "Income inequality is hidden", explanation: "GDP could rise while all gains go to the top 1%. A country with $100,000 average GDP where half the population earns $10,000 looks the same as one with equal distribution." },
  { id: 5, limitation: "Quality improvements are undervalued", explanation: "A smartphone today costs the same as one in 2010 but is vastly more capable. GDP counts the same dollar amount, missing the enormous improvement in real value." },
  { id: 6, limitation: "Well-being and happiness aren't measured", explanation: "Bhutan famously tracks 'Gross National Happiness' instead. Higher GDP correlates with well-being but doesn't guarantee it — mental health, community, and purpose are invisible to GDP." },
];

// Station 6 — Quiz
const QUIZ_QUESTIONS: Array<{
  question: string; options: string[]; answer: number | number[]; multi?: boolean; explanation: string;
}> = [
  {
    question: "Which of the following is correctly counted in U.S. GDP?",
    options: [
      "Wheat sold from a Kansas farm to a flour mill in Ohio",
      "A BMW car assembled at its Spartanburg, South Carolina plant",
      "A Social Security payment to a retired teacher",
      "A used 2019 Ford F-150 sold on Craigslist",
    ],
    answer: 1,
    explanation: "The BMW counts because it was produced within U.S. borders — location of production is what matters, not company nationality. Wheat to the mill is intermediate (double-counting risk), Social Security is a transfer payment, and used goods were already counted when new.",
  },
  {
    question: "When economists say GDP = C + I + G + NX, what does 'I' (Investment) mean?",
    options: [
      "Households buying stocks and bonds on Wall Street",
      "Business spending on new physical capital, plus new residential construction",
      "Interest payments on government debt",
      "International capital flows into the U.S. economy",
    ],
    answer: 1,
    explanation: "Economic investment means creating new productive capacity — factories, equipment, software, and new housing. Buying stocks is financial investment, which redistributes existing assets but doesn't create new production.",
  },
  {
    question: "The U.S. imports a $1,000 iPhone assembled in China. What is the NET effect on U.S. GDP?",
    options: [
      "+$1,000 (counted in Consumption)",
      "−$1,000 (subtracted as an import)",
      "$0 (counted in C, then subtracted in NX)",
      "+$1,000 minus Apple's profit margin",
    ],
    answer: 2,
    explanation: "The iPhone appears in Consumption (+$1,000) because a U.S. consumer bought it. But it's simultaneously subtracted as an import (−$1,000) in NX. Net effect: zero — correctly reflecting that no U.S. production occurred.",
  },
  {
    question: "Real GDP differs from Nominal GDP because:",
    options: [
      "Real GDP includes government spending; Nominal GDP does not",
      "Real GDP adjusts for inflation using constant prices, revealing true changes in production",
      "Real GDP is calculated quarterly; Nominal GDP is calculated annually",
      "Real GDP counts only manufacturing; Nominal GDP includes services",
    ],
    answer: 1,
    explanation: "Nominal GDP uses current-year prices and can rise simply because prices increased. Real GDP uses constant base-year prices, so changes reflect actual changes in the volume of goods and services produced — true economic growth.",
  },
  {
    question: "During a recession, which of the following is most likely to occur?",
    options: [
      "Real GDP rises, unemployment falls, inflation accelerates",
      "Real GDP falls, unemployment rises, business investment contracts",
      "Nominal GDP falls but Real GDP remains stable",
      "Government transfer payments fall as fewer people need assistance",
    ],
    answer: 1,
    explanation: "Recessions are defined by falling real GDP, rising unemployment, and contracting business activity. Transfer payments (unemployment insurance, food assistance) actually INCREASE during recessions as more people qualify.",
  },
  {
    question: "U.S. Nominal GDP rose from $21T in 2020 to $23T in 2021. If the price level rose 6%, approximately what was real GDP growth?",
    options: [
      "9.5% — the full nominal increase",
      "About 3.5% — after removing the 6% inflation",
      "6% — equal to the inflation rate",
      "0% — price increases cancel all nominal gains",
    ],
    answer: 1,
    explanation: "Nominal growth ≈ 9.5% ($21T→$23T). Subtract inflation: 9.5% − 6% ≈ 3.5% real growth. Real GDP = Nominal GDP growth minus inflation. This is why tracking real vs. nominal is so important.",
  },
  {
    question: "Why does GDP understate the true economic contribution of a stay-at-home parent who raises children and manages a household?",
    options: [
      "Childcare is classified as a negative externality in national accounts",
      "Household production has no market price, so it is excluded from GDP entirely",
      "The BLS surveys only formal employers, missing informal work",
      "GDP counts household production at 50% of its market equivalent",
    ],
    answer: 1,
    explanation: "GDP only counts market transactions with a recorded price. If the same parent hired a nanny and housekeeper, those services would count. The identical work performed at home counts for nothing — a well-known GDP limitation.",
  },
  {
    question: "Which GDP component is largest in the United States?",
    options: [
      "Investment (I) — business spending drives growth",
      "Government (G) — federal spending dominates",
      "Consumption (C) — household spending at roughly 68%",
      "Net Exports (NX) — the U.S. exports more than it imports",
    ],
    answer: 2,
    explanation: "Consumption (C) accounts for roughly 68% of U.S. GDP. Investment is about 17%, Government around 18%, and Net Exports are actually negative (the U.S. imports more than it exports, so NX ≈ −3%).",
  },
  // Q9 and Q10 multi-select
  {
    question: "Which of the following transactions are correctly EXCLUDED from GDP? Select ALL that apply.",
    options: [
      "A wheat farmer sells grain to a cereal manufacturer",
      "A retiree receives a monthly Social Security check",
      "A family buys a newly constructed home from a developer",
      "A consumer buys a used car from a private seller",
      "Amazon pays wages to its warehouse workers",
    ],
    answer: [0, 1, 3],
    multi: true,
    explanation: "Excluded: wheat to the manufacturer (intermediate good — double counting risk), Social Security (transfer payment — no production), used car (already counted when new). Included: new home (residential investment) and wages (workers receive income for production, counted through G and C spending).",
  },
  {
    question: "Which of the following correctly describe limitations of GDP as a measure of well-being? Select ALL that apply.",
    options: [
      "GDP ignores the distribution of income across the population",
      "GDP counts environmental damage from industrial production but not its cleanup",
      "GDP excludes non-market household production like cooking and childcare",
      "GDP always overestimates living standards in developing countries",
      "GDP misses quality improvements when prices stay the same",
    ],
    answer: [0, 2, 4],
    multi: true,
    explanation: "Three real limitations: income inequality is hidden in the average (A), non-market household production is excluded (C), and quality improvements at the same price are missed (E). GDP doesn't systematically 'count environmental damage' — it just ignores environmental costs entirely. And GDP per capita (PPP) is often used to compare living standards across countries, which corrects some but not all distortions.",
  },
];

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────
const STATION_META: { id: Station; title: string; desc: string; gated?: boolean }[] = [
  { id: "counts",      title: "Does It Count?",      desc: "Classify 10 transactions: counted in GDP or not?" },
  { id: "components",  title: "What Component?",     desc: "Sort spending into C, I, G, or NX — the four GDP components" },
  { id: "calculator",  title: "GDP Calculator",      desc: "Calculate real GDP, growth rates, and inflation adjustments", gated: true },
  { id: "cycle",       title: "Business Cycle",      desc: "Identify peaks, troughs, and expansions on a real GDP chart" },
  { id: "fredchart",   title: "Reading the Data",    desc: "Analyze 75 years of Real vs. Nominal GDP from FRED" },
  { id: "limitations", title: "GDP Limitations",     desc: "What GDP misses — and why it still matters" },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function Header({ station, onStation, completed }: { station: Station; onStation: (s: Station) => void; completed: Set<Station> }) {
  const stations: { id: Station; label: string }[] = [
    { id: "intro",       label: "Dashboard" },
    { id: "counts",      label: "Does It Count?" },
    { id: "components",  label: "Components" },
    { id: "calculator",  label: "Calculator" },
    { id: "cycle",       label: "Business Cycle" },
    { id: "fredchart",   label: "FRED Chart" },
    { id: "limitations", label: "Limitations" },
    { id: "quiz",        label: "Quiz" },
  ];
  const stationOrder: Station[] = ["intro","counts","components","calculator","cycle","fredchart","limitations","quiz","results","not-yet"];
  const currentIdx = stationOrder.indexOf(station);
  const contentStations: Station[] = ["counts","components","calculator","cycle","fredchart","limitations"];
  const allStationsDone = contentStations.every(s => completed.has(s));

  return (
    <header role="banner" className="bg-secondary text-secondary-foreground shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="ECO 210 ECONLAB logo">
            <rect width="32" height="32" rx="8" fill="hsl(38 95% 50%)"/>
            <path d="M6 22 L10 16 L14 19 L18 11 L22 14 L26 8" stroke="hsl(222 30% 10%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="26" cy="8" r="2" fill="hsl(222 30% 10%)"/>
          </svg>
          <div>
            <div className="font-display font-semibold text-sm leading-none text-sidebar-foreground">ECO 210 ECONLAB</div>
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 6</div>
          </div>
        </div>


        {/* Back to Hub */}
        <a href="https://www.perplexity.ai/computer/a/eco-210-econlab-course-hub-JgrfOPjHQ5iSYovw19FfIg" target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-sidebar-foreground/80 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-sidebar-accent shrink-0">
          ← Course Hub <span className="sr-only">(opens in new tab)</span>
        </a>
        <div className="hidden sm:flex items-center gap-1 flex-wrap">
          {stations.map((s) => {
            const idx = stationOrder.indexOf(s.id);
            const done = idx < currentIdx;
            const active = s.id === station;
            if (s.id === "quiz" && !allStationsDone) {
              return (
                <span key={s.id} data-testid={`nav-${s.id}`} title="Complete all stations first"
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-sidebar-foreground/35 cursor-not-allowed select-none">
                  🔒 {s.label}
                </span>
              );
            }
            return (
              <button key={s.id} onClick={() => onStation(s.id)} data-testid={`nav-${s.id}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active ? "bg-primary text-primary-foreground"
                  : done ? "bg-sidebar-accent text-sidebar-foreground/90"
                  : "text-sidebar-foreground/75 hover:text-white"
                }`}>
                {done && !active ? "✓ " : ""}{s.label}
              </button>
            );
          })}
        </div>

        <div className="hidden md:block w-24">
          <div className="h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(currentIdx / (stations.length - 1)) * 100}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavButtons({ onBack, onNext, backLabel = "Back", nextLabel = "Continue", nextDisabled = false }:
  { onBack?: () => void; onNext?: () => void; backLabel?: string; nextLabel?: string; nextDisabled?: boolean }) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
      {onBack ? (
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={16} /> {backLabel}
        </button>
      ) : <div />}
      {onNext && (
        <button onClick={onNext} disabled={nextDisabled} data-testid="btn-next"
          className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          {nextLabel} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Intro / Dashboard
// ─────────────────────────────────────────────
const CH6_SUMMARY = [
  {
    section: "6.1 Measuring the Size of the Economy: Gross Domestic Product",
    body: "Economists generally express the size of a nation's economy as its gross domestic product (GDP), which measures the value of the output of all final goods and services produced within the country in a year. Economists measure GDP by taking the quantities of all goods and services produced, multiplying them by their prices, and summing the total. Since GDP measures what is bought and sold in the economy, we can measure it either by the sum of what is purchased in the economy or what is produced.\n\nWe can divide demand into consumption, investment, government, exports, and imports. We can divide what is produced in the economy into durable goods, nondurable goods, services, structures, and inventories. To avoid double counting, GDP counts only final output of goods and services, not the production of intermediate goods or the value of labor in the chain of production.",
  },
  {
    section: "6.2 Adjusting Nominal Values to Real Values",
    body: "The nominal value of an economic statistic is the commonly announced value. The real value is the value after adjusting for changes in inflation. To convert nominal economic data from several different years into real, inflation-adjusted data, the starting point is to choose a base year arbitrarily and then use a price index to convert the measurements so that economists measure them in the money prevailing in the base year.",
  },
  {
    section: "6.3 Tracking Real GDP over Time",
    body: "Over the long term, U.S. real GDP has increased dramatically. At the same time, GDP has not increased the same amount each year. The speeding up and slowing down of GDP growth represents the business cycle. When GDP declines significantly, a recession occurs. A longer and deeper decline is a depression. Recessions begin at the business cycle's peak and end at the trough.",
  },
  {
    section: "6.4 Comparing GDP among Countries",
    body: "Since we measure GDP in a country's currency, in order to compare different countries' GDPs, we need to convert them to a common currency. One way to do that is with the exchange rate, which is the price of one country's currency in terms of another. Once we express GDPs in a common currency, we can compare each country's GDP per capita by dividing GDP by population. Countries with large populations often have large GDPs, but GDP alone can be a misleading indicator of a nation's wealth. A better measure is GDP per capita.",
  },
  {
    section: "6.5 How Well GDP Measures the Well-Being of Society",
    body: "GDP is an indicator of a society's standard of living, but it is only a rough indicator. GDP does not directly take account of leisure, environmental quality, levels of health and education, activities conducted outside the market, changes in inequality of income, increases in variety, increases in technology, or the (positive or negative) value that society may place on certain types of output.",
  },
];

function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Modal */}
      <div className="relative bg-card border border-card-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <div className="font-display font-bold text-base text-foreground">Chapter 6 Summary</div>
            <div className="text-xs text-muted-foreground mt-0.5">OpenStax Macroeconomics 3rd Edition</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground text-lg font-bold">&times;</button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {CH6_SUMMARY.map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold text-sm text-foreground mb-2 leading-snug">{item.section}</h3>
              {item.body.split('\n\n').map((para, j) => (
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
        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Close & Return to Lab
          </button>
        </div>
      </div>
    </div>
  );
}

function IntroStation({ completed, onGoTo }: { completed: Set<Station>; onGoTo: (s: Station) => void }) {
  const allDone = STATION_META.every(s => completed.has(s.id));
  const [showSummary, setShowSummary] = useState(false);
  return (
    <div className="max-w-2xl mx-auto">
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wide mb-4">Chapter 6</span>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">The Macroeconomic Perspective</h1>
        <p className="text-muted-foreground text-base">Measuring Economic Performance with GDP</p>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-foreground">
        💡 <strong>Key idea:</strong> GDP is the economy's scoreboard — but knowing what's on it, what's off it, and what it can't measure is what separates real understanding from memorization. Complete all 6 stations in any order, then take the quiz.
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

        <button onClick={() => allDone ? onGoTo("quiz") : undefined} data-testid="dashboard-quiz" disabled={!allDone}
          className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${
            allDone ? "bg-primary text-primary-foreground border-primary hover:opacity-90 active:scale-[0.99]"
                    : "bg-muted border-border opacity-50 cursor-not-allowed"
          }`}>
          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
            allDone ? "bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground"
                    : "bg-muted-foreground/20 border-muted-foreground/30 text-muted-foreground"
          }`}>
            {allDone ? <Award size={18} /> : "🔒"}
          </div>
          <div className="flex-1 min-w-0">
            <span className={`font-semibold text-sm ${allDone ? "text-primary-foreground" : "text-muted-foreground"}`}>Quiz</span>
            <p className={`text-xs mt-0.5 ${allDone ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {allDone ? "10 questions — need 9/10 — screenshot your score" : "Complete all 6 stations to unlock"}
            </p>
          </div>
          <ChevronRight size={16} className={`shrink-0 ${allDone ? "text-primary-foreground" : "text-muted-foreground"}`} />
        </button>
      </div>
      {!allDone && <p className="text-xs text-center text-muted-foreground">{completed.size} of {STATION_META.length} stations complete</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Does It Count?
// ─────────────────────────────────────────────
function CountsStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, CountsAnswer>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const card = COUNTS_ITEMS[current];
  const selected = answers[current];
  const isChecked = checked[current];
  const isCorrect = selected === card.answer;
  const allChecked = COUNTS_ITEMS.every((_, i) => checked[i]);

  function handleSelect(ans: CountsAnswer) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [current]: ans }));
  }

  function handleCheck() {
    if (!selected) return;
    setChecked(prev => ({ ...prev, [current]: true }));
  }

  const score = COUNTS_ITEMS.filter((c, i) => answers[i] === c.answer).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Does It Count in GDP?</h2>
        <p className="text-sm text-muted-foreground">For each transaction, decide: is it counted in U.S. GDP or not? Check each answer to see the explanation.</p>
      </div>

      <div className="flex gap-1.5 mb-5">
        {COUNTS_ITEMS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === current ? "bg-primary" :
              checked[i] ? (answers[i] === COUNTS_ITEMS[i].answer ? "bg-emerald-400" : "bg-red-400") :
              answers[i] ? "bg-primary/40" : "bg-muted"
            }`} />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Transaction {current + 1} of {COUNTS_ITEMS.length}</span>
          {allChecked && <span className="text-xs font-semibold text-primary">{score}/{COUNTS_ITEMS.length} correct</span>}
        </div>
        <p className="text-base font-medium text-foreground mb-5 leading-relaxed">{card.item}</p>

        <div className="grid grid-cols-2 gap-3">
          {([["yes","✅ Counted in GDP","bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200"],
             ["no","❌ Not Counted","bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200"]] as const).map(([val, label, checkedStyle]) => {
            const isSel = selected === val;
            const isCorrectOpt = card.answer === val;
            return (
              <button key={val} onClick={() => handleSelect(val as CountsAnswer)} disabled={isChecked} data-testid={`counts-${val}`}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  isChecked ? (isCorrectOpt ? checkedStyle + " ring-2 ring-offset-1 ring-emerald-400" : isSel && !isCorrectOpt ? "bg-red-50 dark:bg-red-950/30 border-red-300 text-red-800 dark:text-red-200" : "bg-muted border-border text-muted-foreground opacity-50 cursor-default")
                  : isSel ? "bg-primary/10 border-primary text-foreground" : "bg-muted hover:bg-accent text-foreground border-border"
                }`}>
                {label}
              </button>
            );
          })}
        </div>

        {!isChecked && selected && (
          <button onClick={handleCheck} data-testid="counts-check" className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
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
        {current < COUNTS_ITEMS.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>

      <NavButtons onBack={onBack} onNext={allChecked ? onComplete : undefined} nextDisabled={!allChecked} nextLabel="Mark Complete ✓" />
      {!allChecked && <p className="text-xs text-center text-muted-foreground mt-2">Check your answer on each transaction to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: What Component?
// ─────────────────────────────────────────────
function ComponentsStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, GDPComponent>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const card = COMPONENT_ITEMS[current];
  const selected = answers[current];
  const isChecked = checked[current];
  const isCorrect = selected === card.answer;
  const allChecked = COMPONENT_ITEMS.every((_, i) => checked[i]);

  const choices: GDPComponent[] = ["C", "I", "G", "NX_export", "NX_import"];
  const choiceLabels: Record<string, string> = {
    C: "C — Consumption", I: "I — Investment", G: "G — Government", NX_export: "NX — Export (+)", NX_import: "NX — Import (−)",
  };

  function handleSelect(val: GDPComponent) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [current]: val }));
  }

  function handleCheck() {
    if (!selected) return;
    setChecked(prev => ({ ...prev, [current]: true }));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">What Component Is It?</h2>
        <p className="text-sm text-muted-foreground">Each transaction belongs in one of the four GDP components. Classify each and check your answer.</p>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-4 mb-4">
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold">
          {Object.entries(COMPONENT_LABELS).map(([k, v]) => (
            <div key={k} className={`p-2 rounded-lg border ${v.bg}`}>
              <div className={`text-lg font-display font-black ${v.color}`}>{v.short}</div>
              <div className="text-muted-foreground mt-0.5 leading-tight">{k === "NX_export" ? "Exports +" : k === "NX_import" ? "Imports −" : k === "C" ? "Consumption" : k === "I" ? "Investment" : "Government"}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 mb-4">
        {COMPONENT_ITEMS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === current ? "bg-primary" :
              checked[i] ? (answers[i] === COMPONENT_ITEMS[i].answer ? "bg-emerald-400" : "bg-red-400") :
              answers[i] ? "bg-primary/40" : "bg-muted"
            }`} />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        <span className="text-xs font-semibold text-muted-foreground">Transaction {current + 1} of {COMPONENT_ITEMS.length}</span>
        <p className="text-base font-medium text-foreground mt-2 mb-5 leading-relaxed">{card.item}</p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {choices.map(val => {
            const isSel = selected === val;
            const isCorrectOpt = card.answer === val;
            const meta = COMPONENT_LABELS[val];
            return (
              <button key={val} onClick={() => handleSelect(val)} disabled={isChecked} data-testid={`comp-${val}`}
                className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  isChecked ? (isCorrectOpt ? meta.bg + " ring-2 ring-emerald-400" : isSel && !isCorrectOpt ? "bg-red-50 dark:bg-red-950/30 border-red-300 text-red-800 dark:text-red-200" : "bg-muted border-border text-muted-foreground opacity-40 cursor-default")
                  : isSel ? "bg-primary/10 border-primary text-foreground" : "bg-muted hover:bg-accent text-foreground border-border"
                }`}>
                <span className={`font-semibold text-sm ${meta.color}`}>
                  {val === "NX_export" ? "NX (Export +)" : val === "NX_import" ? "NX (Import −)" : val === "C" ? "C — Consumption" : val === "I" ? "I — Investment" : "G — Government"}
                </span>
              </button>
            );
          })}
        </div>

        {!isChecked && selected && (
          <button onClick={handleCheck} data-testid="comp-check" className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
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
        {current < COMPONENT_ITEMS.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>

      <NavButtons onBack={onBack} onNext={allChecked ? onComplete : undefined} nextDisabled={!allChecked} nextLabel="Mark Complete ✓" />
      {!allChecked && <p className="text-xs text-center text-muted-foreground mt-2">Check your answer on each transaction to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: GDP Calculator
// ─────────────────────────────────────────────
function CalculatorStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [probIdx, setProbIdx] = useState(0);
  const [states, setStates] = useState<CalcState[]>(CALC_PROBLEMS.map(() => ({ input: "", attempts: 0, correct: false })));

  const prob = CALC_PROBLEMS[probIdx];
  const state = states[probIdx];
  const filled = state.input.trim() !== "";
  const canCheck = filled && !state.correct;

  function withinTolerance(input: string, correct: number, tol: number): boolean {
    const val = parseFloat(input);
    return !isNaN(val) && Math.abs(val - correct) <= tol;
  }

  function updateInput(val: string) {
    if (state.correct) return;
    setStates(prev => prev.map((s, i) => i === probIdx ? { ...s, input: val } : s));
  }

  function handleCheck() {
    const isRight = withinTolerance(state.input, prob.correctAnswer, prob.tolerance);
    setStates(prev => prev.map((s, i) => {
      if (i !== probIdx) return s;
      return { ...s, correct: isRight, attempts: isRight ? s.attempts : s.attempts + 1 };
    }));
  }

  function msgColor() {
    if (state.attempts >= 3) return "text-red-600 dark:text-red-400";
    if (state.attempts === 2) return "text-amber-600 dark:text-amber-400";
    return "text-muted-foreground";
  }

  function attemptMsg(): string | null {
    if (state.attempts === 1) return "Not quite — check your arithmetic and try again.";
    if (state.attempts === 2) return `💡 Hint: ${prob.hint}`;
    if (state.attempts >= 3) return `Answer: ${prob.correctAnswer}${prob.unit === "%" ? "%" : " " + prob.unit}`;
    return null;
  }

  function inputColor() {
    if (state.correct) return "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30";
    if (state.attempts === 0) return "border-border bg-background";
    if (state.attempts >= 2) return "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30";
    return "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30";
  }

  const allSolved = states.every((s, i) => s.correct || s.attempts >= 3);

  const solvedCount = states.filter((s, i) => s.correct || s.attempts >= 3).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">GDP Calculator</h2>
        <p className="text-sm text-muted-foreground">Work through each problem using the formulas. <strong className="text-foreground">Round to 1 decimal place.</strong></p>
      </div>

      <div className="flex gap-2 mb-5">
        {CALC_PROBLEMS.map((p, i) => {
          const s = states[i];
          const solved = s.correct || s.attempts >= 3;
          return (
            <button key={p.id} onClick={() => setProbIdx(i)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                i === probIdx ? "bg-primary text-primary-foreground border-primary"
                : solved ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                : "bg-muted text-muted-foreground border-border hover:bg-accent"
              }`}>
              {solved ? "✓ " : ""}Problem {p.id}
            </button>
          );
        })}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <h3 className="font-semibold text-sm text-foreground mb-2">{prob.title}</h3>
        <p className="text-sm text-foreground leading-relaxed mb-4">{prob.context}</p>
        <div className="bg-muted rounded-lg p-3 font-mono text-xs text-foreground">{prob.formula}</div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
          Your Answer {prob.unit === "%" ? "(%)" : `(${prob.unit})`} <span className="normal-case font-normal">— round to 1 decimal</span>
        </label>
        <div className="flex items-center gap-3">
          <input type="number" step="0.1" placeholder="Enter answer…" value={state.input}
            onChange={e => updateInput(e.target.value)} disabled={state.correct}
            className={`w-40 px-3 py-2 rounded-lg border text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground ${inputColor()}`} />
          {state.correct && <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ Correct</span>}
          {!state.correct && state.attempts >= 3 && <span className="text-sm font-semibold text-red-600 dark:text-red-400">✗ {prob.correctAnswer}{prob.unit === "%" ? "%" : ""}</span>}
        </div>
        {!state.correct && attemptMsg() && (
          <p className={`text-xs mt-1.5 font-medium ${msgColor()}`}>{attemptMsg()}</p>
        )}

        {canCheck && (
          <button onClick={handleCheck} className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check My Answer
          </button>
        )}

        {(state.correct || state.attempts >= 3) && (
          <div className={`mt-4 p-3 rounded-xl text-sm border ${state.correct ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"} text-foreground`}>
            {state.correct ? <><strong>✓ Correct!</strong> {prob.explanation}</> : <><strong>Answer shown.</strong> {prob.explanation}</>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setProbIdx(Math.max(0, probIdx - 1))} disabled={probIdx === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          <ChevronLeft size={16}/> Previous
        </button>
        {probIdx < CALC_PROBLEMS.length - 1 ? (
          <button onClick={() => setProbIdx(probIdx + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Problem <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>

      <NavButtons onBack={onBack} onNext={onComplete} nextLabel="Mark Complete ✓" nextDisabled={!allSolved} />
      {!allSolved && <p className="text-xs text-center text-muted-foreground mt-2">Solve all 3 problems to mark complete ({solvedCount}/3 done).</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Business Cycle
// ─────────────────────────────────────────────
function CycleStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const q = CYCLE_QUESTIONS[questionIdx];
  const selected = answers[questionIdx];
  const isChecked = checked[questionIdx];
  const isCorrect = selected === q.answer;
  const allChecked = CYCLE_QUESTIONS.every((_, i) => checked[i]);

  // Simplified business cycle chart data — real GDP index (2007=100) for key years
  const chartPoints = [
    { id: "peak_2007",  x: 0,   y: 100, label: "A" },
    { id: "trough_2009",x: 20,  y: 94,  label: "B" },
    { id: "expansion",  x: 55,  y: 115, label: "C" },
    { id: "peak_2020",  x: 75,  y: 118, label: "D" },
    { id: "recovery",   x: 95,  y: 128, label: "E" },
  ];

  // Additional intermediate points for smooth line
  const linePoints = [
    [0,100],[5,101],[10,99],[15,96],[20,94],[25,95],[35,100],[45,107],[55,115],[62,117],[70,119],[75,118],[78,109],[82,112],[87,120],[95,128]
  ];

  const W = 320, H = 160;
  const minY = 90, maxY = 132;
  function toSVG(x: number, y: number): [number, number] {
    return [Math.round((x / 100) * W), Math.round(H - ((y - minY) / (maxY - minY)) * H)];
  }

  const pathD = linePoints.map(([x, y], i) => {
    const [sx, sy] = toSVG(x, y);
    return `${i === 0 ? "M" : "L"}${sx},${sy}`;
  }).join(" ");

  // Recession shading: 2007–2009 and brief 2020
  const recShades = [
    { x1: 0, x2: 20 },   // 2007–2009
    { x1: 75, x2: 82 },  // 2020
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Business Cycle Identifier</h2>
        <p className="text-sm text-muted-foreground">Study the chart below, then answer each question by selecting the labeled point that best matches.</p>
      </div>

      {/* Chart */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm text-foreground">U.S. Real GDP — Indexed (2007 = 100)</h3>
          <span className="text-xs text-muted-foreground">2007–2024</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" style={{ maxHeight: "200px" }}>
          {/* Recession shading */}
          {recShades.map((r, i) => {
            const [x1] = toSVG(r.x1, minY);
            const [x2] = toSVG(r.x2, minY);
            return <rect key={i} x={x1} y={0} width={x2 - x1} height={H} fill="rgba(239,68,68,0.08)" />;
          })}
          {/* Grid lines */}
          {[95, 100, 105, 110, 115, 120, 125].map(v => {
            const [, sy] = toSVG(0, v);
            return <line key={v} x1={0} y1={sy} x2={W} y2={sy} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />;
          })}
          {/* GDP line */}
          <path d={pathD} fill="none" stroke="hsl(38 95% 50%)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          {/* Labeled points */}
          {chartPoints.map(pt => {
            const [sx, sy] = toSVG(pt.x, pt.y);
            const isSelected = selected === pt.id;
            const isAns = q.answer === pt.id;
            const wasChecked = isChecked;
            const fill = wasChecked && isAns ? "#22c55e" : wasChecked && isSelected && !isAns ? "#ef4444" : isSelected ? "hsl(38 95% 50%)" : "hsl(var(--card))";
            return (
              <g key={pt.id} onClick={() => !isChecked && setAnswers(prev => ({ ...prev, [questionIdx]: pt.id }))}
                style={{ cursor: isChecked ? "default" : "pointer" }}>
                <circle cx={sx} cy={sy} r={10} fill={fill} stroke="hsl(38 95% 50%)" strokeWidth={2} />
                <text x={sx} y={sy + 4} textAnchor="middle" fontSize={10} fontWeight="bold"
                  fill={fill === "hsl(var(--card))" ? "hsl(38 95% 50%)" : "white"}>
                  {pt.label}
                </text>
              </g>
            );
          })}
          {/* X axis labels */}
          {[{x:0,l:"2007"},{x:20,l:"2009"},{x:55,l:"2015"},{x:75,l:"2020"},{x:95,l:"2024"}].map(({x,l}) => {
            const [sx] = toSVG(x, minY);
            return <text key={l} x={sx} y={H + 16} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.5}>{l}</text>;
          })}
        </svg>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-sm"/> Recession</span>
          <span className="flex items-center gap-1"><span className="w-4 h-0.5 inline-block bg-primary rounded"/><span className="w-4 h-0.5 inline-block bg-primary rounded hidden"/> Real GDP</span>
        </div>
      </div>

      {/* Questions */}
      <div className="flex gap-1.5 mb-4">
        {CYCLE_QUESTIONS.map((_, i) => (
          <button key={i} onClick={() => setQuestionIdx(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === questionIdx ? "bg-primary" :
              checked[i] ? (answers[i] === CYCLE_QUESTIONS[i].answer ? "bg-emerald-400" : "bg-red-400") :
              answers[i] ? "bg-primary/40" : "bg-muted"
            }`} />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-5 mb-4">
        <span className="text-xs font-semibold text-muted-foreground">Question {questionIdx + 1} of {CYCLE_QUESTIONS.length}</span>
        <p className="text-base font-medium text-foreground mt-2 mb-4 leading-relaxed">{q.question}</p>
        <p className="text-xs text-muted-foreground mb-3">Click a labeled point (A–E) on the chart above, then check your answer.</p>

        {selected && (
          <div className="text-sm text-foreground mb-3">
            Selected: <strong className="text-primary">{chartPoints.find(p => p.id === selected)?.label}</strong> — {CYCLE_EVENTS.find(e => e.id === selected)?.label}
          </div>
        )}

        {!isChecked && selected && (
          <button onClick={() => setChecked(prev => ({ ...prev, [questionIdx]: true }))} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check Answer
          </button>
        )}
        {isChecked && (
          <div className={`p-3 rounded-xl text-sm border ${isCorrect ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"} text-foreground`}>
            <strong>{isCorrect ? "✓ Correct! " : `✗ The answer is Point ${chartPoints.find(p => p.id === q.answer)?.label}. `}</strong>
            {CYCLE_EVENTS.find(e => e.id === q.answer)?.desc}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setQuestionIdx(Math.max(0, questionIdx - 1))} disabled={questionIdx === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          <ChevronLeft size={16}/> Previous
        </button>
        {questionIdx < CYCLE_QUESTIONS.length - 1 ? (
          <button onClick={() => setQuestionIdx(questionIdx + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Question <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>

      <NavButtons onBack={onBack} onNext={allChecked ? onComplete : undefined} nextDisabled={!allChecked} nextLabel="Mark Complete ✓" />
      {!allChecked && <p className="text-xs text-center text-muted-foreground mt-2">Answer all {CYCLE_QUESTIONS.length} questions to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Reading the Data (FRED Chart)
// ─────────────────────────────────────────────
const FRED_QUESTIONS = [
  {
    id: 1,
    question: "In approximately what year are the Nominal GDP and Real GDP lines closest together, and why?",
    options: [
      "1947 — the earliest data point, so both start at the same value",
      "Around 2017 — because that is the base year; both lines use 2017 prices",
      "2020 — because COVID caused both to fall equally",
      "2024 — because inflation has been tamed, closing the gap",
    ],
    answer: 1,
    explanation: "The base year for this Real GDP series is 2017, meaning prices are held constant at 2017 levels. At the base year, Nominal and Real GDP are equal by definition — there is no inflation adjustment to make. Before 2017, Real GDP is higher (past prices were lower); after 2017, Nominal GDP is higher (prices have risen).",
  },
  {
    id: 2,
    question: "Looking at the chart, how many NBER-defined recessions can you count from 1947 to 2024?",
    options: ["6–7 recessions", "10–12 recessions", "3–4 recessions", "15+ recessions"],
    answer: 1,
    explanation: "There have been 12 recessions since WWII (1948–49, 1953–54, 1957–58, 1960–61, 1969–70, 1973–75, 1980, 1981–82, 1990–91, 2001, 2007–09, 2020). The shaded gray bars on the chart represent each one. Note how most are brief relative to the expansions between them.",
  },
  {
    id: 3,
    question: "After 2020, the gap between Nominal and Real GDP widened significantly. What does this tell us?",
    options: [
      "Real output fell sharply after the pandemic",
      "A large share of the nominal GDP increase was driven by inflation, not real production growth",
      "The U.S. changed its base year, shifting the Real GDP line down",
      "Import growth exceeded export growth, reducing NX and Real GDP",
    ],
    answer: 1,
    explanation: "When Nominal GDP rises faster than Real GDP, it means prices — not output volume — are driving the difference. The 2021–22 inflation surge (peaking at 9.1% CPI in June 2022) caused exactly this: nominal values rose sharply, but real production growth was more modest. The widening gap IS the inflation.",
  },
  {
    id: 4,
    question: "During the 2007–2009 Great Recession, which GDP component fell most sharply?",
    options: [
      "Government spending (G) — federal budget cuts during the crisis",
      "Net Exports (NX) — a global trade collapse",
      "Investment (I) — construction and business investment collapsed as credit froze",
      "Consumption (C) — consumers stopped all spending overnight",
    ],
    answer: 2,
    explanation: "Investment fell most sharply — residential construction had already been collapsing since 2006, and when credit markets froze in 2008, business investment plunged too. Consumption fell but more gradually (sticky wages, unemployment insurance). Government actually INCREASED spending (stimulus). This is why Keynesian economists argue investment volatility is the core driver of business cycles.",
  },
  {
    id: 5,
    question: "Using the Rule of 70: at a 2% annual growth rate, how many years does it take for the economy to double? And at 3%, how many years?",
    options: [
      "2% → 35 years to double; 3% → about 23 years to double",
      "2% → 140 years to double; 3% → 70 years to double",
      "2% → 20 years to double; 3% → 10 years to double",
      "Both 2% and 3% take about 30 years — the difference is negligible",
    ],
    answer: 0,
    explanation: "Rule of 70: Years to double = 70 ÷ growth rate. At 2%: 70 ÷ 2 = 35 years. At 3%: 70 ÷ 3 ≈ 23 years. That 12-year difference compounds dramatically over time — an economy growing at 3% instead of 2% produces nearly twice as much wealth over a century. This is why economists obsess over small differences in long-run growth rates.",
  },
];

function FredChartStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [tooltip, setTooltip] = useState<{ year: number; nom: number; real: number; x: number; y: number } | null>(null);

  const q = FRED_QUESTIONS[questionIdx];
  const selected = answers[questionIdx];
  const isChecked = checked[questionIdx];
  const isCorrect = selected === q.answer;
  const allChecked = FRED_QUESTIONS.every((_, i) => checked[i]);

  // Chart geometry
  const W = 600, H = 220, PAD = { top: 10, right: 20, bottom: 28, left: 52 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const years = FRED_GDP_NOMINAL.map(d => d[0]);
  const minYear = years[0], maxYear = years[years.length - 1];
  const nomVals = FRED_GDP_NOMINAL.map(d => d[1]);
  const realVals = FRED_GDP_REAL.map(d => d[1]);
  const maxVal = Math.max(...nomVals, ...realVals);

  function xScale(year: number) { return PAD.left + ((year - minYear) / (maxYear - minYear)) * chartW; }
  function yScale(val: number)  { return PAD.top + chartH - (val / maxVal) * chartH; }

  const nomPath  = FRED_GDP_NOMINAL.map(([yr, v], i) => `${i===0?"M":"L"}${xScale(yr).toFixed(1)},${yScale(v).toFixed(1)}`).join(" ");
  const realPath = FRED_GDP_REAL.map(([yr, v], i) => `${i===0?"M":"L"}${xScale(yr).toFixed(1)},${yScale(v).toFixed(1)}`).join(" ");

  // Recession shading (annual approximation)
  const recBands = [
    [1948,1949],[1953,1954],[1957,1958],[1960,1961],[1969,1971],
    [1973,1975],[1980,1981],[1982,1983],[1990,1991],[2001,2002],[2007,2009],[2019.9,2020.8]
  ];

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / rect.width * W;
    const year = Math.round(minYear + ((rawX - PAD.left) / chartW) * (maxYear - minYear));
    const nomEntry  = FRED_GDP_NOMINAL.find(d => d[0] === year);
    const realEntry = FRED_GDP_REAL.find(d => d[0] === year);
    if (nomEntry && realEntry) {
      setTooltip({ year, nom: nomEntry[1], real: realEntry[1], x: xScale(year), y: yScale(nomEntry[1]) });
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Reading the Data</h2>
        <p className="text-sm text-muted-foreground">75 years of U.S. GDP data from FRED. Hover over the chart to see values, then answer the questions below.</p>
      </div>

      {/* FRED Chart */}
      <div className="bg-card border border-card-border rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm text-foreground">U.S. GDP — Nominal vs. Real (1947–2024)</h3>
          <span className="text-xs text-muted-foreground">Source: FRED (BEA)</span>
        </div>
        <div className="relative" onMouseLeave={() => setTooltip(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full"
            onMouseMove={handleMouseMove} style={{ cursor: "crosshair" }} role="img" aria-label="Interactive data chart. Hover to explore data points.">
            {/* Recession shading */}
            {recBands.map(([s, e], i) => (
              <rect key={i} x={xScale(s)} y={PAD.top} width={xScale(e + 1) - xScale(s)} height={chartH} fill="rgba(156,163,175,0.15)" />
            ))}
            {/* Y grid */}
            {[0, 5000, 10000, 15000, 20000, 25000, 30000].map(v => {
              const y = yScale(v);
              if (y < PAD.top || y > PAD.top + chartH) return null;
              return (
                <g key={v}>
                  <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="currentColor" strokeOpacity={0.07} strokeWidth={1} />
                  <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize={9} fill="currentColor" fillOpacity={0.4}>
                    {v === 0 ? "$0" : `$${v/1000}T`}
                  </text>
                </g>
              );
            })}
            {/* X axis labels */}
            {[1950,1960,1970,1980,1990,2000,2010,2020].map(yr => (
              <text key={yr} x={xScale(yr)} y={H - 6} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.4}>{yr}</text>
            ))}
            {/* Lines */}
            <path d={nomPath}  fill="none" stroke="#ef4444" strokeWidth={1.5} />
            <path d={realPath} fill="none" stroke="hsl(38 95% 50%)" strokeWidth={2} />
            {/* Tooltip line */}
            {tooltip && (
              <line x1={tooltip.x} y1={PAD.top} x2={tooltip.x} y2={PAD.top + chartH} stroke="white" strokeOpacity={0.3} strokeWidth={1} strokeDasharray="3,3" />
            )}
          </svg>
          {/* Tooltip box */}
          {tooltip && (
            <div className={`absolute top-2 bg-card border border-card-border rounded-lg p-2 text-xs shadow-md pointer-events-none ${tooltip.year > 1985 ? "left-2" : "right-2"}`}>
              <div className="font-bold text-foreground mb-1">{tooltip.year}</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Nominal: <strong>${(tooltip.nom / 1000).toFixed(1)}T</strong></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Real: <strong>${(tooltip.real / 1000).toFixed(1)}T</strong></div>
              <div className="text-muted-foreground mt-1">Gap: +${((tooltip.nom - tooltip.real)/1000).toFixed(1)}T</div>
            </div>
          )}
        </div>
        <div className="flex gap-5 mt-2 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-red-500 inline-block rounded" /> Nominal GDP (current $)</span>
          <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-primary inline-block rounded" /> Real GDP (2017 $)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block bg-gray-200 dark:bg-gray-700 rounded-sm border border-gray-300 dark:border-gray-600" /> Recession</span>
        </div>
      </div>

      {/* Questions */}
      <div className="flex gap-1.5 mb-4">
        {FRED_QUESTIONS.map((_, i) => (
          <button key={i} onClick={() => setQuestionIdx(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === questionIdx ? "bg-primary" :
              checked[i] ? (answers[i] === FRED_QUESTIONS[i].answer ? "bg-emerald-400" : "bg-red-400") :
              answers[i] !== undefined ? "bg-primary/40" : "bg-muted"
            }`} />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-5 mb-4">
        <span className="text-xs font-semibold text-muted-foreground">Question {questionIdx + 1} of {FRED_QUESTIONS.length}</span>
        <p className="text-base font-medium text-foreground mt-2 mb-4 leading-relaxed">{q.question}</p>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isSel = selected === i;
            const isCorrectOpt = q.answer === i;
            return (
              <button key={i} onClick={() => !isChecked && setAnswers(prev => ({ ...prev, [questionIdx]: i }))}
                disabled={isChecked}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  isChecked ? (isCorrectOpt ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-300" : isSel && !isCorrectOpt ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200" : "bg-muted border-border text-muted-foreground opacity-50 cursor-default")
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
        {questionIdx < FRED_QUESTIONS.length - 1 ? (
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
// Station: GDP Limitations
// ─────────────────────────────────────────────
function LimitationsStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const item = LIMITATIONS[current];
  const allChecked = LIMITATIONS.every((_, i) => checked[i]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">GDP Limitations</h2>
        <p className="text-sm text-muted-foreground">GDP is powerful but imperfect. Read each limitation and click Reveal to understand why it matters.</p>
      </div>

      <div className="flex gap-1.5 mb-5">
        {LIMITATIONS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === current ? "bg-primary" : checked[i] ? "bg-emerald-400" : "bg-muted"
            }`} />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        <span className="text-xs font-semibold text-muted-foreground">Limitation {current + 1} of {LIMITATIONS.length}</span>
        <h3 className="font-display font-bold text-lg text-foreground mt-2 mb-4">{item.limitation}</h3>

        {!checked[current] ? (
          <button onClick={() => setChecked(prev => ({ ...prev, [current]: true }))} data-testid={`limit-reveal-${current}`}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Reveal Explanation
          </button>
        ) : (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground leading-relaxed">
            {item.explanation}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          <ChevronLeft size={16}/> Previous
        </button>
        {current < LIMITATIONS.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>

      <NavButtons onBack={onBack} onNext={allChecked ? onComplete : undefined} nextDisabled={!allChecked} nextLabel="Mark Complete ✓" />
      {!allChecked && <p className="text-xs text-center text-muted-foreground mt-2">Reveal all {LIMITATIONS.length} limitations to mark complete ({Object.keys(checked).length}/{LIMITATIONS.length} revealed).</p>}
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
      const curr = (prev[currentQ] as number[] | undefined) ?? [];
      return { ...prev, [currentQ]: curr.includes(idx) ? curr.filter(x => x !== idx) : [...curr, idx] };
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
    const userSelected = q.multi ? (Array.isArray(userAnswer) ? (userAnswer as number[]).includes(i) : false) : userAnswer === i;
    const isInCorrectSet = correctAnswers.includes(i);
    if (!isChecked) return userSelected ? "bg-primary/10 border-primary text-foreground" : "bg-muted hover:bg-accent hover:text-accent-foreground text-foreground border-border";
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
            const isSelected = q.multi ? (Array.isArray(userAnswer) ? (userAnswer as number[]).includes(i) : false) : userAnswer === i;
            if (q.multi) {
              return (
                <button key={i} onClick={() => handleToggle(i)} disabled={isChecked} data-testid={`quiz-option-${i}`}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-start gap-3 ${isChecked ? optionStyle(i) + " cursor-default" : optionStyle(i)}`}>
                  <span className={`shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? "bg-primary border-primary" : "border-current opacity-50"}`}>
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
// Station: Not Yet
// ─────────────────────────────────────────────
const QUESTION_STATION_MAP: Record<number, { station: Station; label: string }> = {
  0: { station: "counts",      label: "Does It Count?" },
  1: { station: "components",  label: "What Component?" },
  2: { station: "components",  label: "What Component?" },
  3: { station: "calculator",  label: "GDP Calculator" },
  4: { station: "cycle",       label: "Business Cycle" },
  5: { station: "calculator",  label: "GDP Calculator" },
  6: { station: "limitations", label: "GDP Limitations" },
  7: { station: "components",  label: "What Component?" },
  8: { station: "counts",      label: "Does It Count?" },
  9: { station: "limitations", label: "GDP Limitations" },
};

function NotYetStation({ score, wrongIndices, onRetake, onGoToStation }:
  { score: number; wrongIndices: number[]; onRetake: () => void; onGoToStation: (s: Station) => void }) {
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
  if (typeof window !== 'undefined') { try { localStorage.setItem('econlab_done_ch6', 'true'); } catch(e) {} }
  const [reflection, setReflection] = useState("");
  const [studentName, setStudentName] = useState("");
  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
  const grade =
    score === 10 ? { label: "Excellent",   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-700", msg: "Perfect score! You've mastered the fundamentals of GDP measurement." } :
    score >= 8  ? { label: "Strong",       color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-700",    msg: "Solid understanding — review the questions you missed and you'll be set." } :
    score >= 6  ? { label: "Developing",   color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-700",  msg: "Good foundation. Revisit the components and calculator stations." } :
                  { label: "Needs Review", color: "text-red-600 dark:text-red-400",      bg: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-700",          msg: "Go back through the stations before the next class." };
  return (
    <div className="max-w-2xl mx-auto">
      <div data-testid="results-card" className="bg-card border border-card-border rounded-2xl p-8 mb-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 mb-4">
          <Award size={36} className="text-primary" />
        </div>
        <div className="font-display text-5xl font-bold text-foreground mb-1">{score}/{QUIZ_QUESTIONS.length}</div>
        <div className="text-lg text-muted-foreground mb-4">{pct}% — {grade.label}</div>
        <div className={`inline-block px-5 py-3 rounded-xl border text-sm ${grade.bg} ${grade.color} font-medium max-w-sm`}>{grade.msg}</div>
        <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
          <div className="font-semibold text-foreground mb-1">ECO 210 ECONLAB · Chapter 6: GDP</div>
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
                + '<p style="color:#475569;margin:2px 0">Chapter 6: GDP</p>'
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
        <p className="text-xs text-muted-foreground mb-3">In 2–3 sentences: What is one thing from today's lab that surprised you or changed how you think about GDP?</p>
        <textarea value={reflection} onChange={e => setReflection(e.target.value)} data-testid="exit-ticket" rows={3}
          placeholder="Type your reflection here…"
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground" />
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
// Main
// ─────────────────────────────────────────────
export default function EconLab() {
  const [station, setStation] = useState<Station>("intro");
  const [completed, setCompleted] = useState<Set<Station>>(new Set());
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<{ correct: boolean; exp: string }[]>([]);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const MASTERY = 9;

  function scrollTop() { contentRef.current?.scrollTo({ top: 0, behavior: "smooth" }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function go(s: Station) { setStation(s); scrollTop(); }
  function complete(s: Station) { setCompleted(prev => new Set([...prev, s])); go("intro"); }
  function handleQuizComplete(score: number, results: { correct: boolean; exp: string }[]) { setQuizScore(score); setQuizResults(results); if (score >= MASTERY) go("results"); else go("not-yet");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <Header station={station} onStation={go} completed={completed} />
      <main id="main-content" ref={contentRef} className="flex-1 px-4 py-8">
        {station === "intro"       && <IntroStation completed={completed} onGoTo={go} />}
        {station === "counts"      && <CountsStation onComplete={() => complete("counts")} onBack={() => go("intro")} />}
        {station === "components"  && <ComponentsStation onComplete={() => complete("components")} onBack={() => go("intro")} />}
        {station === "calculator"  && <CalculatorStation onComplete={() => complete("calculator")} onBack={() => go("intro")} />}
        {station === "cycle"       && <CycleStation onComplete={() => complete("cycle")} onBack={() => go("intro")} />}
        {station === "fredchart"   && <FredChartStation onComplete={() => complete("fredchart")} onBack={() => go("intro")} />}
        {station === "limitations" && <LimitationsStation onComplete={() => complete("limitations")} onBack={() => go("intro")} />}
        {station === "quiz"        && <QuizStation onNext={handleQuizComplete} onBack={() => go("intro")} />}
        {station === "not-yet"     && <NotYetStation score={quizScore} wrongIndices={wrongIndices} onRetake={() => go("quiz")} onGoToStation={go} />}
        {station === "results"     && <ResultsStation score={quizScore} results={quizResults} onRestart={() => { setQuizScore(0); setWrongIndices([]); setCompleted(new Set()); go("intro"); }} />}
            <div role="alert" aria-live="polite" className="sr-only" id="lab-feedback" />
    </main>
    </div>
  );
}
