import { useState, useRef, useEffect } from "react";
import { RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type QType = "mc" | "multi" | "match" | "order";

interface BaseQ {
  id: number;
  type: QType;
  topic: string; // chapter tag
  exp: string;   // explanation shown after answering
}
interface MCQ extends BaseQ { type: "mc"; q: string; opts: string[]; correct: number; }
interface MultiQ extends BaseQ { type: "multi"; q: string; opts: string[]; correct: number[]; }
interface MatchQ extends BaseQ { type: "match"; instruction: string; items: string[]; categories: string[]; correct: number[]; /* index into categories for each item */ }
interface OrderQ extends BaseQ { type: "order"; instruction: string; steps: string[]; /* correct order is 0,1,2... */ }

type Question = MCQ | MultiQ | MatchQ | OrderQ;

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleMCOpts(q: MCQ): MCQ {
  const idx = q.opts.map((_, i) => i);
  const shuffled = shuffle(idx);
  return { ...q, opts: shuffled.map(i => q.opts[i]), correct: shuffled.indexOf(q.correct) };
}

function shuffleMultiOpts(q: MultiQ): MultiQ {
  const idx = q.opts.map((_, i) => i);
  const shuffled = shuffle(idx);
  return { ...q, opts: shuffled.map(i => q.opts[i]), correct: q.correct.map(c => shuffled.indexOf(c)) };
}

// ─────────────────────────────────────────────
// QUESTION BANK — 45 questions
// ─────────────────────────────────────────────
const QUESTION_BANK: Question[] = [

  // ── MATCHING: GDP approaches ──────────────────────────────────────────
  {
    id: 1, type: "match", topic: "Ch6 · GDP",
    instruction: "Match each item to the correct approach for calculating GDP.",
    items: ["Wages and salaries paid to workers", "Profits earned by business owners", "Interest and dividends paid to capital owners", "Rent payments for land use", "Consumer spending on goods and services", "Government purchases of goods and services", "Business investment in new equipment", "Net exports (exports minus imports)"],
    categories: ["Expenditure Approach", "Income Approach"],
    correct:    [1, 1, 1, 1, 0, 0, 0, 0],
    exp: "Income Approach sums payments to factors of production (wages, profits, interest, rent). Expenditure Approach sums C + I + G + (X − M)."
  },

  // ── MATCHING: GDP included / not included ─────────────────────────────
  {
    id: 2, type: "match", topic: "Ch6 · GDP",
    instruction: "Classify each item as Included in GDP or Not Included in GDP.",
    items: ["A new home built by a construction company", "The purchase of shares of Apple stock", "Corn purchased by a food manufacturer for processing", "Government spending on a new courthouse", "A used car sold at a dealership", "Your monthly Netflix subscription", "Social Security benefit payments", "Machinery exported to Germany"],
    categories: ["Included in GDP", "Not Included in GDP"],
    correct:    [0, 1, 1, 0, 1, 0, 1, 0],
    exp: "GDP counts final goods and services produced domestically this period. Stocks, used goods, intermediate goods, and transfer payments are excluded."
  },

  // ── MATCHING: Employment status ───────────────────────────────────────
  {
    id: 3, type: "match", topic: "Ch8 · Unemployment",
    instruction: "Classify each person's employment status.",
    items: ["A teacher working full-time at a public school", "A college graduate actively applying for entry-level positions", "A 15-year-old high school student not working", "A retiree collecting Social Security", "A laid-off factory worker who gave up searching for work 3 months ago", "A stay-at-home parent not seeking paid work", "A worker holding two part-time jobs", "A person who was laid off yesterday and starts job searching today"],
    categories: ["Employed", "Unemployed", "Not in Labor Force"],
    correct:    [0, 1, 2, 2, 2, 2, 0, 1],
    exp: "Employed = working for pay. Unemployed = not working but actively seeking work. Not in Labor Force = not working and not seeking work (retirees, students, discouraged workers, stay-at-home parents, those under 16)."
  },

  // ── MATCHING: Type of unemployment ───────────────────────────────────
  {
    id: 4, type: "match", topic: "Ch8 · Unemployment",
    instruction: "Match each scenario with the type of unemployment.",
    items: ["A travel agent loses her job as more people book trips online", "A ski instructor is unemployed during summer months", "A financial analyst is laid off during a recession", "A recent graduate declines a low-paying offer to search for a better fit", "A steelworker is permanently displaced by automated robots", "A nurse relocates to a new city and is between jobs"],
    categories: ["Frictional", "Cyclical", "Structural"],
    correct:    [2, 0, 1, 0, 2, 0],
    exp: "Structural = skills/technology mismatch (permanent). Cyclical = recession-driven. Frictional = short-term between jobs or searching for better fit."
  },

  // ── MATCHING: M1 / M2 / Neither ──────────────────────────────────────
  {
    id: 5, type: "match", topic: "Ch14 · Money",
    instruction: "Classify each item: M1 (and therefore M2), Exclusive to M2, or Neither.",
    items: ["$500 cash in your wallet", "$3,000 in a 6-month Certificate of Deposit", "$800 in your checking account", "A $2,000 credit card limit", "$1,500 in a money market mutual fund", "$200 traveler's checks"],
    categories: ["M1, and therefore M2", "Exclusive to M2", "Neither"],
    correct:    [0, 1, 0, 2, 1, 0],
    exp: "M1: currency, demand deposits, traveler's checks. M2 adds CDs, money market funds, savings deposits. Credit cards are neither — they represent debt, not money."
  },

  // ── MATCHING: GDP approaches (Version B) ─────────────────────────────
  {
    id: 6, type: "match", topic: "Ch6 · GDP",
    instruction: "Match each component to the correct GDP calculation approach.",
    items: ["Military spending by the federal government", "Household spending on groceries", "Foreign earnings repatriated by a U.S. firm", "New factory construction by a corporation", "Royalties paid to musicians", "U.S. exports of agricultural products"],
    categories: ["Expenditure Approach", "Income Approach"],
    correct:    [0, 0, 1, 0, 1, 0],
    exp: "Expenditure: C, I, G, net exports. Income: factor payments — wages, profits, rent, interest. Royalties are income to capital owners."
  },

  // ── MATCHING: Employment (Version B) ─────────────────────────────────
  {
    id: 7, type: "match", topic: "Ch8 · Unemployment",
    instruction: "Classify each person's employment status.",
    items: ["An active-duty Marine", "A doctoral student who tutors for pay", "A 70-year-old who has not worked in 10 years", "A laid-off restaurant manager actively sending out resumes", "A freelance graphic designer working 30 hours/week", "A homemaker not looking for paid employment"],
    categories: ["Employed", "Unemployed", "Not in Labor Force"],
    correct:    [2, 0, 2, 1, 0, 2],
    exp: "The BLS unemployment rate is a civilian measure. Active duty military are excluded from the civilian labor force and classified as Not in Labor Force. Paid civilian workers (tutors, freelancers) are Employed. Actively seeking civilian work = Unemployed. Retirees, homemakers, and military are Not in Labor Force."
  },

  // ── MATCHING: Type of unemployment (Version B) ────────────────────────
  {
    id: 8, type: "match", topic: "Ch8 · Unemployment",
    instruction: "Match each scenario with the type of unemployment.",
    items: ["A coal miner is permanently displaced as the region switches to natural gas", "A marketing consultant voluntarily left her job and is looking for a better opportunity", "A construction worker is laid off as homebuilding slows sharply in a recession", "A department store cashier loses her job to self-checkout kiosks", "A teacher is laid off because the local government faces a budget crisis during a downturn", "A college professor takes a sabbatical to research before returning to teaching"],
    categories: ["Frictional", "Cyclical", "Structural"],
    correct:    [2, 0, 1, 2, 1, 0],
    exp: "Structural = permanent skill/technology mismatch. Cyclical = caused by recession. Frictional = voluntary or temporary between-jobs transitions."
  },

  // ── MC: AD shift effects ──────────────────────────────────────────────
  {
    id: 9, type: "mc", topic: "Ch11 · AD-AS",
    q: "In the AD-AS model, if Aggregate Demand (AD) increases while Short-Run Aggregate Supply (SRAS) remains unchanged, what happens to the price level and real GDP?",
    opts: ["Price level falls; real GDP increases", "Price level increases; real GDP increases", "Price level increases; real GDP falls", "Both price level and real GDP remain unchanged"],
    correct: 1,
    exp: "A rightward shift in AD moves the equilibrium up and to the right along the upward-sloping SRAS — both the price level and real GDP increase."
  },

  // ── MC: SRAS shift effects ────────────────────────────────────────────
  {
    id: 10, type: "mc", topic: "Ch11 · AD-AS",
    q: "In the AD-AS model, if Short-Run Aggregate Supply (SRAS) increases (shifts right) while AD remains unchanged, what happens?",
    opts: ["Price level rises; real GDP falls", "Price level falls; real GDP falls", "Price level falls; real GDP increases", "Price level rises; real GDP increases"],
    correct: 2,
    exp: "A rightward SRAS shift moves equilibrium down and to the right along the AD curve — the price level falls and real GDP increases (a favorable supply shock)."
  },

  // ── MC: AD-AS Breaking News — confidence drops ───────────────────────
  {
    id: 11, type: "mc", topic: "Ch11 · AD-AS",
    q: "Breaking News: A major banking crisis triggers a sharp drop in consumer and business confidence. Which AD-AS outcome is most likely?",
    opts: [
      "AD shifts right → price level and real GDP both rise",
      "AD shifts left → price level falls and real GDP falls",
      "SRAS shifts right → price level falls and real GDP rises",
      "SRAS shifts left → price level rises and real GDP falls"
    ],
    correct: 1,
    exp: "Falling confidence reduces consumption (C) and investment (I), shifting AD left. The result is a lower price level and lower real GDP — a recessionary gap."
  },

  // ── MC: AD-AS Breaking News — productivity gain ───────────────────────
  {
    id: 12, type: "mc", topic: "Ch11 · AD-AS",
    q: "Breaking News: A major advance in renewable energy dramatically reduces production costs for most industries. Which AD-AS outcome is most likely?",
    opts: [
      "AD shifts left → price level and real GDP both fall",
      "SRAS shifts left → price level rises and real GDP falls",
      "SRAS shifts right → price level falls and real GDP rises",
      "AD shifts right → price level rises and real GDP rises"
    ],
    correct: 2,
    exp: "Lower production costs shift SRAS to the right — a favorable supply shock. Price level falls and real GDP rises. This is distinct from an AD shift."
  },

  // ── MC: AD-AS Breaking News — tax cut ────────────────────────────────
  {
    id: 13, type: "mc", topic: "Ch11 · AD-AS",
    q: "Breaking News: Congress passes a large personal income tax cut. Which AD-AS change is most likely?",
    opts: [
      "SRAS shifts right → lower prices, higher output",
      "AD shifts right → higher price level and higher real GDP",
      "AD shifts left → lower price level and lower real GDP",
      "SRAS shifts left → higher prices, lower output"
    ],
    correct: 1,
    exp: "A tax cut raises household disposable income, boosting consumption (C) and shifting AD to the right — raising both the price level and real GDP."
  },

  // ── MC: FRED GDP growth rate pattern ─────────────────────────────────
  {
    id: 14, type: "mc", topic: "Ch6 · GDP",
    q: "Based on historical FRED data showing real GDP growth rates with shaded recession periods: what consistent pattern appears during every recession?",
    opts: ["Real GDP growth rate increases sharply", "Real GDP growth rate shows no consistent pattern", "Real GDP growth rate turns negative or drops sharply", "Real GDP growth rate gradually rises over several years"],
    correct: 2,
    exp: "Every recession (shaded period) coincides with a sharp drop in the real GDP growth rate, which often turns negative. This is the definition of a recession — two or more consecutive quarters of negative real GDP growth."
  },

  // ── MC: GDP growth rate formula ───────────────────────────────────────
  {
    id: 15, type: "mc", topic: "Ch6 · GDP",
    q: "Real GDP in Q2 2024 was $23,200 billion. Real GDP in Q2 2023 was $22,600 billion. Which formula correctly calculates the year-over-year real GDP growth rate?",
    opts: [
      "[(22,600 − 23,200) / 23,200] × 100",
      "(23,200 / 22,600) × 100",
      "[(23,200 − 22,600) / 22,600] × 100",
      "(23,200 − 22,600) only"
    ],
    correct: 2,
    exp: "Growth rate = [(New − Old) / Old] × 100. The base (denominator) is the earlier year (22,600). Answer: [(23,200 − 22,600) / 22,600] × 100 = 2.65%."
  },

  // ── MC: Unemployment rate formula ─────────────────────────────────────
  {
    id: 16, type: "mc", topic: "Ch8 · Unemployment",
    q: "A country has 150 million employed persons, 10 million unemployed persons, and 280 million persons over age 16. What is the correct formula for the unemployment rate?",
    opts: [
      "[10 / 280] × 100",
      "[150 / 10] × 100",
      "[10 / 150] × 100",
      "[10 / (10 + 150)] × 100"
    ],
    correct: 3,
    exp: "Unemployment rate = (Unemployed / Labor Force) × 100. Labor force = Employed + Unemployed = 150 + 10 = 160 million. Rate = [10/160] × 100 = 6.25%."
  },

  // ── MC: Real rate of return ───────────────────────────────────────────
  {
    id: 17, type: "mc", topic: "Ch9 · Inflation",
    q: "Your savings account earns a 4% nominal annual return. The annual inflation rate is 6%. What is your real rate of return?",
    opts: ["4%", "6% − 4% = 2%", "4% − 6% = −2%", "4% / 6% = 0.67%"],
    correct: 2,
    exp: "Real return = Nominal return − Inflation rate = 4% − 6% = −2%. Your purchasing power is actually declining despite the positive nominal return."
  },

  // ── MC: CPI inflation formula ──────────────────────────────────────────
  {
    id: 18, type: "mc", topic: "Ch9 · Inflation",
    q: "The CPI was 255 in January 2021 and rose to 280 in January 2022. What is the annual inflation rate?",
    opts: [
      "[(255 − 280) / 280] × 100",
      "[(280 − 255) / 255] × 100",
      "280 − 255",
      "[255 / 280] × 100"
    ],
    correct: 1,
    exp: "Inflation rate = [(New CPI − Old CPI) / Old CPI] × 100 = [(280 − 255) / 255] × 100 = 9.8%. The base is always the earlier period."
  },

  // ── MC: Unemployment rate calculation (Version B) ─────────────────────
  {
    id: 19, type: "mc", topic: "Ch8 · Unemployment",
    q: "A country has 175 million employed, 12 million unemployed, and 300 million adults over 16. What is the unemployment rate?",
    opts: [
      "[12 / 300] × 100 = 4.0%",
      "[12 / 175] × 100 = 6.9%",
      "[12 / (12 + 175)] × 100 = 6.4%",
      "[175 / 12] × 100 = 1,458%"
    ],
    correct: 2,
    exp: "Labor force = employed + unemployed = 175 + 12 = 187 million. Unemployment rate = 12/187 × 100 = 6.4%. The total adult population is irrelevant to this formula."
  },

  // ── MC: GDP growth rate (Version B) ───────────────────────────────────
  {
    id: 20, type: "mc", topic: "Ch6 · GDP",
    q: "Real GDP was $21,500 billion in 2022 and $22,300 billion in 2023. Which correctly calculates the growth rate?",
    opts: [
      "[(21,500 − 22,300) / 22,300] × 100 = −3.6%",
      "[(22,300 − 21,500) / 21,500] × 100 = 3.7%",
      "(22,300 / 21,500) × 100 = 103.7%",
      "(22,300 − 21,500) = $800 billion"
    ],
    correct: 1,
    exp: "Growth rate = [(New − Old) / Old] × 100 = [(22,300 − 21,500) / 21,500] × 100 = 3.72%. The denominator is always the base (earlier) year."
  },

  // ── MULTI: Combined fiscal + monetary policy scenario ─────────────────
  {
    id: 21, type: "multi", topic: "Ch15+17 · Policy",
    q: "The unemployment rate is 3% and inflation is 8%. The government raises income taxes, cuts spending, AND the Fed raises the IORB. Select ALL correct statements about what will happen.",
    opts: [
      "Inflation is the primary macroeconomic problem",
      "Recession is the primary macroeconomic problem",
      "Real GDP will decrease",
      "Real GDP will increase",
      "The price level will decrease",
      "The price level will increase",
      "The impact on real GDP is indeterminate"
    ],
    correct: [0, 2, 4],
    exp: "With 3% unemployment (near full employment) and 8% inflation, the primary problem is inflation. Both contractionary fiscal policy (tax hikes + spending cuts) and contractionary monetary policy (↑ IORB) reduce AD → real GDP falls and price level falls."
  },

  // ── MULTI: AD decreases effects ──────────────────────────────────────
  {
    id: 22, type: "multi", topic: "Ch11 · AD-AS",
    q: '"Aggregate Demand decreases." Select ALL correct effects on the economy.',
    opts: [
      "Real GDP increases",
      "Real GDP decreases",
      "No change in real GDP",
      "Price level increases",
      "Price level decreases",
      "No change in the price level",
      "Unemployment increases",
      "Unemployment decreases",
      "No change in unemployment"
    ],
    correct: [1, 4, 6],
    exp: "A leftward AD shift moves the equilibrium down and to the left along SRAS: real GDP falls, price level falls, and unemployment rises (fewer workers needed at lower output)."
  },

  // ── MULTI: SRAS decreases effects ────────────────────────────────────
  {
    id: 23, type: "multi", topic: "Ch11 · AD-AS",
    q: '"Short-Run Aggregate Supply decreases (shifts left)." Select ALL correct effects.',
    opts: [
      "Real GDP increases",
      "Real GDP decreases",
      "No change in real GDP",
      "Price level increases",
      "Price level decreases",
      "No change in the price level",
      "Unemployment increases",
      "Unemployment decreases",
      "No change in unemployment"
    ],
    correct: [1, 3, 6],
    exp: "A leftward SRAS shift (e.g. oil shock) moves equilibrium up and to the left: real GDP falls, price level rises (stagflation), and unemployment rises."
  },

  // ── MULTI: Expansionary fiscal policy impacts ─────────────────────────
  {
    id: 24, type: "multi", topic: "Ch17 · Fiscal Policy",
    q: "Headline: Major new legislation increases government spending significantly without raising taxes. Select ALL likely impacts on the economy.",
    opts: [
      "Real GDP will increase",
      "Real GDP will decrease",
      "The price level will increase",
      "The price level will decrease",
      "It is not possible to determine the impact on either real GDP or the price level"
    ],
    correct: [0, 2],
    exp: "↑G shifts AD right → both real GDP and price level rise. This is standard expansionary fiscal policy. The outcome is determinate because only AD shifts."
  },

  // ── MULTI: Recession headline impacts ────────────────────────────────
  {
    id: 25, type: "multi", topic: "Ch11 · AD-AS",
    q: "Headline: Fears of an upcoming recession cause businesses to cancel investment projects and consumers to cut spending. What are the likely impacts?",
    opts: [
      "Real GDP will increase",
      "Real GDP will decrease",
      "The price level will increase",
      "The price level will decrease",
      "It is not possible to determine the impact on either real GDP or the price level"
    ],
    correct: [1, 3],
    exp: "Falling investment and consumption shift AD left → real GDP falls and price level falls. The impact is determinate — only AD shifts, not SRAS."
  },

  // ── MULTI: SRAS increases impacts ────────────────────────────────────
  {
    id: 26, type: "multi", topic: "Ch11 · AD-AS",
    q: '"Short-Run Aggregate Supply increases (shifts right)." Select ALL correct effects.',
    opts: [
      "Real GDP increases",
      "Real GDP decreases",
      "No change in real GDP",
      "Price level increases",
      "Price level decreases",
      "No change in the price level",
      "Unemployment increases",
      "Unemployment decreases",
      "No change in unemployment"
    ],
    correct: [0, 4, 7],
    exp: "A rightward SRAS shift (favorable supply shock) moves equilibrium down and to the right: real GDP rises, price level falls, and unemployment falls."
  },

  // ── MULTI: Combined contractionary policy ─────────────────────────────
  {
    id: 27, type: "multi", topic: "Ch15+17 · Policy",
    q: "The unemployment rate is 10% and inflation is 1%. The Fed lowers the IORB and the government increases spending on infrastructure. Select ALL correct statements.",
    opts: [
      "Recession is the primary macroeconomic problem",
      "Inflation is the primary macroeconomic problem",
      "Real GDP will increase",
      "Real GDP will decrease",
      "The price level will increase",
      "The price level will decrease",
      "The impact on real GDP is indeterminate"
    ],
    correct: [0, 2, 4],
    exp: "10% unemployment with 1% inflation signals recession as the primary problem. Both expansionary fiscal (↑G) and expansionary monetary (↓IORB) policy shift AD right → real GDP rises and price level rises."
  },

  // ── MULTI: Contractionary fiscal + expansionary monetary ──────────────
  {
    id: 28, type: "multi", topic: "Ch15+17 · Policy",
    q: "The government cuts spending and raises taxes (contractionary fiscal policy). The Fed simultaneously lowers interest rates (expansionary monetary policy). What can be determined about the effects?",
    opts: [
      "Real GDP will definitely increase",
      "Real GDP will definitely decrease",
      "The impact on real GDP is indeterminate",
      "The price level will definitely increase",
      "The price level will definitely decrease",
      "The impact on the price level is indeterminate"
    ],
    correct: [2, 5],
    exp: "When fiscal and monetary policy push in opposite directions (one contracts AD, the other expands it), the net effect on both real GDP and the price level is indeterminate without knowing the relative magnitude of each policy."
  },

  // ── ORDERING: Contractionary monetary policy chain ────────────────────
  {
    id: 29, type: "order", topic: "Ch15 · Monetary Policy",
    instruction: "The Fed implements contractionary monetary policy to reduce inflation. Put the following steps in the correct order from first to last.",
    steps: [
      "FOMC increases the target range for the Federal Funds Rate",
      "The Federal Reserve raises the Interest on Reserve Balances (IORB)",
      "Through arbitrage, banks prefer to park reserves at the Fed rather than lend in the federal funds market",
      "The federal funds rate rises to align with the new IORB",
      "Market interest rates (mortgages, auto loans, business loans) rise",
      "Consumer and business borrowing and spending decrease",
      "Aggregate demand decreases, leading to lower real GDP growth and reduced inflation"
    ],
    exp: "The transmission chain: FOMC sets target → raises IORB → arbitrage drives FFR up → market rates rise → borrowing/spending fall → AD decreases → inflation falls."
  },

  // ── ORDERING: Expansionary monetary policy chain ─────────────────────
  {
    id: 30, type: "order", topic: "Ch15 · Monetary Policy",
    instruction: "The Fed implements expansionary monetary policy to fight a recession. Put the following steps in the correct order from first to last.",
    steps: [
      "FOMC decreases the target range for the Federal Funds Rate",
      "The Federal Reserve lowers the Interest on Reserve Balances (IORB)",
      "Banks find it more profitable to lend in the federal funds market than park reserves at the Fed",
      "The federal funds rate falls as reserve supply in the market increases",
      "Market interest rates (mortgages, car loans, business credit) fall",
      "Consumers and businesses borrow and spend more",
      "Aggregate demand increases, raising real GDP and reducing unemployment"
    ],
    exp: "The expansion chain: FOMC cuts target → lowers IORB → banks lend out reserves → FFR falls → market rates fall → borrowing rises → AD increases → GDP rises."
  },

  // ── MC: G component of GDP ────────────────────────────────────────────
  {
    id: 31, type: "mc", topic: "Ch6 · GDP",
    q: "Which of the following would be counted in the Government (G) component of U.S. GDP using the Expenditure Method?",
    opts: [
      "A resident of Ohio sells a used truck to a resident of Indiana",
      "A foreign exchange student buys a U.S.-made textbook",
      "NASA purchases a newly manufactured rocket from a U.S. aerospace firm",
      "The federal government issues a Social Security check to a retired worker",
      "A private university uses endowment funds to renovate a dormitory"
    ],
    correct: 2,
    exp: "G counts government purchases of newly produced goods and services. NASA buying a new rocket is a government purchase. Transfer payments (Social Security) are NOT counted in G — they don't involve new production."
  },

  // ── MULTI: Valid GDP expenditure components ───────────────────────────
  {
    id: 32, type: "multi", topic: "Ch6 · GDP",
    q: "Which of the following activities are valid components of C + I + G + (X − M) used to calculate GDP? Select ALL that apply.",
    opts: [
      "New business inventories added but not yet sold to final consumers",
      "A pension fund's purchase of corporate bonds on the stock market",
      "A city government hires a construction firm to build a new fire station",
      "Wheat sold by a farmer to a bread manufacturer (intermediate good)",
      "A family pays a domestic cleaning service $200/week"
    ],
    correct: [0, 2, 4],
    exp: "GDP counts: new inventories (investment, I), government purchases of new output (G), and household spending on services (C). Financial transactions (bonds) and intermediate goods are excluded to avoid double-counting."
  },

  // ── MC: Institutional conditions for growth ───────────────────────────
  {
    id: 33, type: "mc", topic: "Ch7 · Growth",
    q: "Which scenario best illustrates the institutional condition most critical for translating physical and human capital investment into sustained long-run economic growth?",
    opts: [
      "A government consolidates all manufacturing into state-run enterprises to achieve economies of scale",
      "A country increases the average years of education among workers, growing its human capital stock",
      "A government funds research universities, assuming innovation will naturally follow scientific investment",
      "A legal system where courts reliably enforce contracts, protecting the expected returns from investment",
      "A government guarantees all citizens free access to food and shelter as a baseline"
    ],
    correct: 3,
    exp: "Rule of law and secure property rights are the essential institutional condition. Without reliable contract enforcement, investors cannot trust that future profits from current investments are protected — so investment stalls."
  },

  // ── MC: Employment classification scenario ────────────────────────────
  {
    id: 34, type: "mc", topic: "Ch8 · Unemployment",
    q: "A dental hygienist works 15 hours/week and is actively seeking full-time work. A laid-off accountant stopped applying for jobs after 8 months of rejection. How does the BLS classify each?",
    opts: [
      "Both are classified as officially unemployed",
      "The hygienist is employed; the accountant is out of the labor force",
      "The hygienist is unemployed; the accountant is employed",
      "The hygienist is out of the labor force; the accountant is unemployed",
      "The hygienist is underemployed; the accountant is unemployed"
    ],
    correct: 1,
    exp: "Anyone doing ANY paid work — even part-time — is classified as Employed (though the hygienist may be underemployed). The accountant stopped searching → discouraged worker → Not in Labor Force (not counted as unemployed in the official rate)."
  },

  // ── MC: CPI substitution bias ─────────────────────────────────────────
  {
    id: 35, type: "mc", topic: "Ch9 · Inflation",
    q: "If the CPI were calculated using a perfectly fixed basket of goods over many years, the measured inflation rate would most likely:",
    opts: [
      "Accurately reflect the true cost of living due to the simplicity of the method",
      "Tend toward zero as substitution bias and quality bias cancel out",
      "Overstate the true rise in the cost of living by ignoring substitution toward cheaper goods and quality improvements",
      "Understate inflation by failing to capture price increases in newly introduced goods"
    ],
    correct: 2,
    exp: "A fixed basket ignores substitution bias (consumers switch to cheaper alternatives when prices rise) and quality/new goods bias (product improvements reduce the real cost). Both cause the CPI to overstate the true rise in living costs."
  },

  // ── MC: Inflation — price confusion ──────────────────────────────────
  {
    id: 36, type: "mc", topic: "Ch9 · Inflation",
    q: "High and variable inflation inhibits market efficiency primarily by causing price confusion. Which example best illustrates this problem?",
    opts: [
      "Inflation transfers wealth from creditors to debtors as loans are repaid with devalued dollars",
      "A restaurant owner cannot tell if a sudden rise in ingredient costs reflects greater demand for her food or general price level inflation",
      "Businesses must spend real resources frequently reprinting price lists and menus",
      "An investor earns a 6% nominal return but fails to realize the real return is negative because inflation is 8%",
      "Workers demand higher nominal wages during inflation to preserve their real purchasing power"
    ],
    correct: 1,
    exp: "Price confusion means producers cannot distinguish between a relative price change (specific to their market) and a general price level increase. The restaurant owner example is the classic illustration — she cannot tell if the signal to expand is real or just inflation noise."
  },

  // ── MC: M1/M2 transaction effect ─────────────────────────────────────
  {
    id: 37, type: "mc", topic: "Ch14 · Money",
    q: "A customer withdraws $3,000 from a money market account and deposits it into a checking account. What is the effect on M1 and M2?",
    opts: [
      "M1 falls by $3,000; M2 remains unchanged",
      "M1 increases by $3,000; M2 remains unchanged",
      "Both M1 and M2 increase by $3,000",
      "M1 increases by $3,000; M2 decreases by $3,000",
      "M1 remains unchanged; M2 decreases by $3,000"
    ],
    correct: 1,
    exp: "A money market account is in M2 but not M1. Moving funds to a checking account (M1) increases M1 by $3,000. But since both accounts are in M2, total M2 is unchanged — the funds just moved from the M2-only portion into M1."
  },

  // ── MC: Expansionary monetary policy tools (ample reserves) ─────────
  {
    id: 38, type: "mc", topic: "Ch15 · Monetary Policy",
    q: "In the current ample reserves environment, which combination of Fed actions best achieves expansionary monetary policy to fight a recession?",
    opts: [
      "Lowering the IORB and lowering the ON RRP rate, reducing the target FFR range",
      "Selling Treasury bonds in open market operations to drain reserves",
      "Conducting reverse repos to reduce liquidity in money markets",
      "Raising the IORB and Discount Rate to encourage banks to hold more reserves",
      "Lowering the Discount Rate below the IORB to incentivize arbitrage borrowing"
    ],
    correct: 0,
    exp: "In the ample reserves regime, the Fed controls the FFR by setting IORB (ceiling/floor) and ON RRP (floor). Expansionary policy = lower IORB + lower ON RRP → lower FFR → lower market rates → more borrowing → ↑AD."
  },

  // ── MC: Fiscal policy time lag ────────────────────────────────────────
  {
    id: 39, type: "mc", topic: "Ch17 · Fiscal Policy",
    q: "A critical limitation of discretionary fiscal stimulus is that the three time lags (recognition, legislative, implementation) may cause the stimulus to arrive:",
    opts: [
      "Before the recession begins, destabilizing an already-growing economy",
      "After the economy has already self-corrected, potentially adding inflationary pressure",
      "Simultaneously with automatic stabilizers, doubling the intended effect",
      "Only in presidential election years due to political constraints",
      "At the same time as monetary policy, guaranteeing a coordinated response"
    ],
    correct: 1,
    exp: "The recognition lag (months before data confirms recession), legislative lag (6–18 months to pass a bill), and implementation lag (months/years to spend funds) mean fiscal policy often arrives too late — after the recession ends — potentially causing inflation."
  },

  // ── MC: Most prompt stimulus mechanism ───────────────────────────────
  {
    id: 40, type: "mc", topic: "Ch17 · Fiscal Policy",
    q: "When an economy falls sharply below potential GDP, which policy mechanism is generally considered the most prompt and reliable automatic response?",
    opts: [
      "Automatic stabilizers (unemployment insurance, food stamps, progressive income tax), which kick in immediately without new legislation",
      "Discretionary infrastructure spending, known for its rapid implementation",
      "Expansionary monetary policy, which shifts SRAS outward and avoids crowding out",
      "Discretionary tax cuts, which directly boost long-run aggregate supply",
      "Contractionary fiscal policy to build credibility and attract foreign investment"
    ],
    correct: 0,
    exp: "Automatic stabilizers respond immediately to economic conditions — no legislation required. Unemployment benefits rise, tax collections fall, SNAP enrollment grows — all cushioning the fall in AD automatically."
  },

  // ── MC: Government G component (Version B) ────────────────────────────
  {
    id: 41, type: "mc", topic: "Ch6 · GDP",
    q: "Which activity is counted in the Government (G) component of GDP?",
    opts: [
      "A state government issues a welfare payment to a low-income family",
      "A county government purchases newly constructed police vehicles from a domestic manufacturer",
      "The U.S. Treasury issues new bonds to finance a deficit",
      "A federal agency sells an old building it owns",
      "Congress approves a tax refund sent to all households"
    ],
    correct: 1,
    exp: "G = government purchases of new goods and services. Buying new police vehicles counts. Transfer payments (welfare, tax refunds), bond issuance, and asset sales are excluded — they don't represent new production."
  },

  // ── MC: Economic growth — institutional condition (Version B) ─────────
  {
    id: 42, type: "mc", topic: "Ch7 · Growth",
    q: "Which policy best reflects the neoclassical prescription for long-run economic growth?",
    opts: [
      "A large government spending stimulus during a recession to restore aggregate demand",
      "Price controls to keep inflation below 2% regardless of economic conditions",
      "Investment in research, property rights protection, and deregulation to shift LRAS rightward",
      "A central bank commitment to keep interest rates at zero to encourage borrowing",
      "Trade barriers to protect domestic industries from foreign competition"
    ],
    correct: 2,
    exp: "Neoclassical growth theory emphasizes supply-side factors: investment in physical and human capital, secure property rights, and reducing barriers to innovation — all shifting LRAS rightward over time."
  },

  // ── MC: M1/M2 classification ──────────────────────────────────────────
  {
    id: 43, type: "mc", topic: "Ch14 · Money",
    q: "Which of the following is included in M2 but NOT in M1?",
    opts: [
      "Currency in circulation",
      "Checkable (demand) deposits at commercial banks",
      "A small-denomination Certificate of Deposit (CD)",
      "Traveler's checks",
      "Coins in circulation"
    ],
    correct: 2,
    exp: "M1 includes currency, coins, demand deposits, and traveler's checks. M2 adds less-liquid assets: savings deposits, small CDs, and money market mutual funds. CDs are in M2 only."
  },

  // ── MC: Money multiplier ───────────────────────────────────────────────
  {
    id: 44, type: "mc", topic: "Ch14 · Money",
    q: "A bank receives $20 million in new deposits. The reserve requirement is 5%. If the full money multiplier effect occurs, what is the total new money created in the banking system?",
    opts: ["$20 million", "$100 million", "$200 million", "$400 million"],
    correct: 3,
    exp: "Money multiplier = 1 ÷ 0.05 = 20. Total money created = 20 × $20M = $400M. The $20M deposit supports $400M in total deposits through repeated lending and re-depositing."
  },

  // ── MULTI: GDP included / not included (Version B) ────────────────────
  {
    id: 45, type: "multi", topic: "Ch6 · GDP",
    q: "Which of the following are included in U.S. GDP? Select ALL that apply.",
    opts: [
      "A new apartment complex built by a real estate developer",
      "Used furniture purchased at a garage sale",
      "Government spending on a new naval destroyer manufactured domestically",
      "A household's payment to a domestic landscaping service",
      "Dividend income received by shareholders from a U.S. company",
      "A U.S. company sells software to a client in France"
    ],
    correct: [0, 2, 3, 5],
    exp: "GDP includes new domestic production: new construction (A), government purchases of new goods (C), household services spending (D), and exports (F). Used goods (B) are excluded; dividend income (E) is a financial transfer, not new production."
  },
];

// ─────────────────────────────────────────────
// Draw 30 questions, balanced by type
// ─────────────────────────────────────────────
function drawQuestions(): Question[] {
  // Ensure good type mix — guarantee at least 2 of each type, then fill rest randomly
  const byType: { [k: string]: Question[] } = { mc: [], multi: [], match: [], order: [] };
  for (const q of QUESTION_BANK) byType[q.type].push(q);

  const drawn: Question[] = [];
  // Take all matching (5 unique matching sets)
  drawn.push(...shuffle(byType.match).slice(0, 5));
  // Take both ordering questions
  drawn.push(...shuffle(byType.order).slice(0, 2));
  // Take 12 multi-select
  drawn.push(...shuffle(byType.multi).slice(0, 10));
  // Fill remaining with MC
  const remaining = 30 - drawn.length;
  drawn.push(...shuffle(byType.mc).slice(0, remaining));

  // Shuffle question ORDER only — answer option order is preserved as authored
  return shuffle(drawn);
}

// ─────────────────────────────────────────────
// Matching Question Component
// ─────────────────────────────────────────────
function MatchQuestion({ q, onAnswer }: { q: MatchQ; onAnswer: (correct: boolean) => void }) {
  // Shuffle items but preserve correct mapping
  const [shuffledItems] = useState(() => {
    const idx = q.items.map((_, i) => i);
    const shuffled = shuffle(idx);
    return shuffled.map(i => ({ text: q.items[i], correctCat: q.correct[i] }));
  });
  const [placed, setPlaced] = useState<(number | null)[]>(new Array(shuffledItems.length).fill(null));
  const [checked, setChecked] = useState(false);

  const allPlaced = placed.every(p => p !== null);
  const score = shuffledItems.filter((item, i) => placed[i] === item.correctCat).length;
  const allCorrect = score === shuffledItems.length;

  function place(itemIdx: number, catIdx: number) {
    if (checked) return;
    setPlaced(prev => { const n = [...prev]; n[itemIdx] = catIdx; return n; });
  }

  function check() {
    setChecked(true);
    onAnswer(allCorrect);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground italic">{q.instruction}</p>

      {/* Items with category buttons */}
      <div className="space-y-2">
        {shuffledItems.map((item, i) => {
          const cat = placed[i];
          const isCorrect = checked && cat === item.correctCat;
          const isWrong = checked && cat !== null && cat !== item.correctCat;
          return (
            <div key={i} className={`rounded-xl border-2 p-3 transition-all ${checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-400 bg-red-50" : "border-border bg-card") : "border-border bg-card"}`}>
              <p className="text-sm font-medium text-foreground mb-2">
                {checked && (isCorrect ? "✓ " : isWrong ? "✗ " : "")}{item.text}
                {isWrong && <span className="text-xs text-red-600 ml-2">→ {q.categories[item.correctCat]}</span>}
              </p>
              {!checked && (
                <div className="flex gap-2 flex-wrap">
                  {q.categories.map((cat, ci) => (
                    <button key={ci} onClick={() => place(i, ci)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${placed[i] === ci ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}
              {checked && cat !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {q.categories[cat]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {checked && (
        <div role="alert" aria-live="polite" className={`p-3 rounded-xl text-sm ${allCorrect ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"}`}>
          <span className="font-semibold">{allCorrect ? "✓ Perfect! " : `${score}/${shuffledItems.length} correct. `}</span>{q.exp}
        </div>
      )}
      {!checked && (
        <button onClick={check} disabled={!allPlaced}
          className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
          Check Answers
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Ordering Question Component
// ─────────────────────────────────────────────
function OrderQuestion({ q, onAnswer }: { q: OrderQ; onAnswer: (correct: boolean) => void }) {
  const [shuffledSteps] = useState(() => {
    const idx = q.steps.map((_, i) => i);
    const shuffled = shuffle(idx);
    return shuffled; // shuffled[i] = original index of step placed at position i
  });
  const [placed, setPlaced] = useState<(number | null)[]>(new Array(q.steps.length).fill(null));
  const [checked, setChecked] = useState(false);

  const availableOrigIdx = shuffledSteps.filter(oi => !placed.includes(oi));
  const allPlaced = placed.every(p => p !== null);
  const correct = placed.every((p, i) => p === i);

  function placeStep(slotIdx: number, origIdx: number) {
    if (checked) return;
    setPlaced(prev => { const n = [...prev]; n[slotIdx] = origIdx; return n; });
  }

  function removeStep(slotIdx: number) {
    if (checked) return;
    setPlaced(prev => { const n = [...prev]; n[slotIdx] = null; return n; });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground italic">{q.instruction}</p>

      {/* Available steps */}
      {availableOrigIdx.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Steps to place:</p>
          {availableOrigIdx.map(oi => (
            <div key={oi} className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground">
              {q.steps[oi]}
              <div className="flex gap-1 mt-1 flex-wrap">
                {placed.map((p, slotIdx) => p === null ? (
                  <button key={slotIdx} onClick={() => placeStep(slotIdx, oi)}
                    className="text-xs px-2 py-0.5 bg-primary/10 hover:bg-primary/20 text-primary rounded font-medium transition">
                    → Step {slotIdx + 1}
                  </button>
                ) : null)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slots */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your order:</p>
        {placed.map((origIdx, slotIdx) => {
          const isCorrect = checked && origIdx === slotIdx;
          const isWrong = checked && origIdx !== null && origIdx !== slotIdx;
          return (
            <div key={slotIdx} className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 min-h-[40px] transition ${
              checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-400 bg-red-50" : "border-border bg-muted")
              : origIdx !== null ? "border-primary/40 bg-primary/5" : "border-dashed border-border bg-muted/50"
            }`}>
              <span className="text-xs font-bold text-muted-foreground w-14 flex-shrink-0">Step {slotIdx + 1}</span>
              {origIdx !== null ? (
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span className="text-xs text-foreground">{checked && (isCorrect ? "✓ " : "✗ ")}{q.steps[origIdx]}</span>
                  {!checked && <button onClick={() => removeStep(slotIdx)} className="text-muted-foreground hover:text-red-500 text-xs font-bold">✕</button>}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">empty — place a step here</span>
              )}
            </div>
          );
        })}
      </div>

      {checked && (
        <div role="alert" aria-live="polite" className={`p-3 rounded-xl text-sm ${correct ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"}`}>
          <span className="font-semibold">{correct ? "✓ Perfect order! " : "Not quite. "}</span>{q.exp}
        </div>
      )}
      {!checked && (
        <button onClick={() => { setChecked(true); onAnswer(correct); }} disabled={!allPlaced}
          className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
          Check My Order
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MC + Multi-Select Question Component
// ─────────────────────────────────────────────
function ChoiceQuestion({ q, onAnswer }: { q: MCQ | MultiQ; onAnswer: (correct: boolean) => void }) {
  const [sel, setSel] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const isMulti = q.type === "multi";

  function toggle(i: number) {
    if (submitted) return;
    setSel(prev => isMulti ? (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]) : [i]);
  }

  function isCorrectNow() {
    if (isMulti) {
      const c = (q as MultiQ).correct;
      return c.length === sel.length && c.every(x => sel.includes(x));
    }
    return sel[0] === (q as MCQ).correct;
  }

  function submit() {
    if (!sel.length) return;
    setSubmitted(true);
    onAnswer(isCorrectNow());
  }

  return (
    <div className="space-y-2">
      {isMulti && <p className="text-xs text-primary font-semibold">Select all that apply</p>}
      <div className="space-y-2">
        {q.opts.map((opt, i) => {
          const isSel = sel.includes(i);
          const isCorrect = isMulti ? (q as MultiQ).correct.includes(i) : (q as MCQ).correct === i;
          let cls = "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ";
          if (!submitted) cls += isSel ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card hover:border-primary/40 text-foreground";
          else if (isCorrect) cls += "border-green-500 bg-green-50 text-green-800";
          else if (isSel) cls += "border-red-400 bg-red-50 text-red-700";
          else cls += "border-border bg-card text-muted-foreground";
          return <button key={i} className={cls} onClick={() => toggle(i)} disabled={submitted}>{isMulti ? (isSel ? "☑ " : "☐ ") : ""}{opt}</button>;
        })}
      </div>
      {submitted && (
        <div role="alert" aria-live="polite" className={`p-3 rounded-xl text-sm border-l-4 ${isCorrectNow() ? "border-green-400 bg-green-50 text-green-800" : "border-red-400 bg-red-50 text-red-800"}`}>
          <span className="font-semibold">{isCorrectNow() ? "✓ Correct! " : "✗ Not quite. "}</span>{q.exp}
        </div>
      )}
      {!submitted && (
        <button onClick={submit} disabled={!sel.length}
          className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
          Submit Answer
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Results Screen
// ─────────────────────────────────────────────
function ResultsScreen({ results, onRestart }: { results: { qNum: number; topic: string; correct: boolean }[]; onRestart: () => void }) {
  const [studentName, setStudentName] = useState("");
  const score = results.filter(r => r.correct).length;
  const pct = Math.round((score / results.length) * 100);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-6xl">{pct >= 70 ? "🏆" : "📖"}</div>
          <h2 className="text-3xl font-bold text-foreground">Practice Exam Complete</h2>
          <p className="text-muted-foreground">ECO 210 · Principles of Macroeconomics</p>
          <div className={`inline-block px-6 py-2 rounded-full text-xl font-bold mt-2 ${pct >= 70 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
            {score} / {results.length} &nbsp;·&nbsp; {pct}%
          </div>
        </div>

        {/* By-topic breakdown */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground text-sm">Results by Question</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {results.map((r, i) => (
              <div key={i} className={`px-3 py-2 rounded-xl text-xs border-l-4 ${r.correct ? "border-green-400 bg-green-50 text-green-800" : "border-red-400 bg-red-50 text-red-700"}`}>
                <span className="font-bold">Q{r.qNum} {r.correct ? "✓" : "✗"}</span>
                <span className="text-xs ml-1 opacity-75">{r.topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic performance summary */}
        {(() => {
          const topicMap: { [t: string]: { correct: number; total: number } } = {};
          results.forEach(r => {
            const t = r.topic.split(" · ")[0];
            if (!topicMap[t]) topicMap[t] = { correct: 0, total: 0 };
            topicMap[t].total++;
            if (r.correct) topicMap[t].correct++;
          });
          return (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm">Performance by Chapter</h3>
              <div className="space-y-1.5">
                {Object.entries(topicMap).sort().map(([topic, data]) => {
                  const pct = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={topic} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{topic}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${pct >= 70 ? "bg-green-500" : "bg-amber-500"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-foreground w-12 text-right">{data.correct}/{data.total}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Name + print */}
        <div className="space-y-3">
          <div>
            <label htmlFor="student-name-input" className="text-sm font-semibold text-foreground block mb-1">Your Name (required for submission)</label>
            <input id="student-name-input" type="text" value={studentName} onChange={e => setStudentName(e.target.value)}
              placeholder="First and Last Name"
              className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none" />
          </div>
          <button
            onClick={() => {
              if (!studentName.trim()) { alert("Please enter your name before printing."); return; }
              const items = results.map((r, i) => '<p style="border-left:4px solid ' + (r.correct ? '#16a34a' : '#dc2626') + ';background:' + (r.correct ? '#f0fdf4' : '#fef2f2') + ';padding:6px 10px;margin:3px 0;font-size:12px"><b>Q' + r.qNum + ' ' + (r.correct ? '✓' : '✗') + ':</b> ' + r.topic + '</p>').join('');
              const topicMap: { [t: string]: { correct: number; total: number } } = {};
              results.forEach(r => { const t = r.topic.split(' · ')[0]; if (!topicMap[t]) topicMap[t] = { correct: 0, total: 0 }; topicMap[t].total++; if (r.correct) topicMap[t].correct++; });
              const topicRows = Object.entries(topicMap).sort().map(([t, d]) => '<tr><td style="padding:4px 8px">' + t + '</td><td style="padding:4px 8px;text-align:center">' + d.correct + '/' + d.total + '</td><td style="padding:4px 8px;text-align:center">' + Math.round(d.correct/d.total*100) + '%</td></tr>').join('');
              const html = '<html><head><title>ECO 210 Practice Final</title><style>body{font-family:Arial,sans-serif;padding:20px;max-width:680px;margin:0 auto}@media print{button{display:none}}</style></head><body>'
                + '<h2 style="margin:0">ECO 210 - Practice Final Exam</h2>'
                + '<p style="color:#475569;margin:2px 0">Principles of Macroeconomics</p>'
                + '<p style="font-size:22px;font-weight:bold;background:#1e2d4a;color:white;display:inline-block;padding:4px 16px;border-radius:99px;margin:8px 0">' + score + ' / ' + results.length + ' &nbsp;·&nbsp; ' + pct + '%</p>'
                + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
                + '<h3 style="font-size:13px;margin:0 0 6px">By Chapter</h3>'
                + '<table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px"><tr style="background:#1e2d4a;color:white"><th style="padding:4px 8px;text-align:left">Chapter</th><th style="padding:4px 8px">Score</th><th style="padding:4px 8px">%</th></tr>' + topicRows + '</table>'
                + '<h3 style="font-size:13px;margin:0 0 6px">Question Detail</h3>' + items
                + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
                + '<p style="font-size:13px;margin-top:12px"><b>Student Name:</b></p><p style="border:1px solid #000;padding:8px;border-radius:4px;font-size:14px;font-weight:bold">' + studentName + '</p>'
                + '<p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:16px;padding-top:8px">ECO 210 Practice Final - Printed ' + new Date().toLocaleDateString() + ' - Submit this PDF to Brightspace</p>'
                + '</body></html>';
              const w = window.open('', '_blank', 'width=820,height=960');
              if (w) { w.document.write(html); w.document.close(); w.focus(); setTimeout(function(){ w.print(); }, 600); }
            }}
            className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
            🖨️ Print / Save as PDF <span className="sr-only">(opens print dialog in new window)</span>
          </button>
          <p className="text-xs text-muted-foreground text-center bg-muted rounded-xl p-3">In the print dialog, choose "Save as PDF" and submit to Brightspace.</p>
        </div>

        <button onClick={onRestart} className="w-full py-2.5 bg-muted hover:bg-accent text-muted-foreground rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
          <RotateCcw size={14} /> Take Another Version
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Intro Screen
// ─────────────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
  const HUB_URL = "https://www.perplexity.ai/computer/a/eco-210-econlab-course-hub-JgrfOPjHQ5iSYovw19FfIg";
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-lg w-full p-8 space-y-6 text-center">
        <div className="text-6xl">📝</div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">ECO 210 Practice Final Exam</h1>
          <p className="text-muted-foreground text-sm">Principles of Macroeconomics</p>
        </div>
        <div className="bg-muted rounded-xl p-4 text-left space-y-2 text-sm text-foreground">
          <p><span className="font-semibold">30 questions</span> — drawn randomly from a question bank of 45</p>
          <p><span className="font-semibold">Question types:</span> multiple choice, multi-select, matching, and sequencing</p>
          <p><span className="font-semibold">Coverage:</span> Ch6 (GDP) · Ch7 (Growth) · Ch8 (Unemployment) · Ch9 (Inflation) · Ch11 (AD-AS) · Ch14 (Money) · Ch15 (Monetary Policy) · Ch17 (Fiscal Policy)</p>
          <p><span className="font-semibold">Feedback:</span> Correct answer and explanation shown after each question</p>
          <p><span className="font-semibold">Submission:</span> Print your Results screen as a PDF and submit to Brightspace</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm text-foreground">
          💡 Each version draws questions in a different random order. Take it multiple times to practice across different question sets.
        </div>
        <button onClick={onStart}
          className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-base transition">
          Start Practice Exam →
        </button>
        <a href={HUB_URL} target="_blank" rel="noopener noreferrer"
          className="block text-xs text-muted-foreground hover:text-foreground transition">
          ← Return to Course Hub
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────
type AppState = "intro" | "exam" | "results";

export default function EconLab() {
  const [appState, setAppState] = useState<AppState>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<{ qNum: number; topic: string; correct: boolean }[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);

  function startExam() {
    const qs = drawQuestions();
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswered(false);
    setResults([]);
    setAppState("exam");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAnswer(correct: boolean) {
    const q = questions[currentIdx];
    setResults(prev => [...prev, { qNum: currentIdx + 1, topic: q.topic, correct }]);
    setAnswered(true);
  }

  function nextQuestion() {
    if (currentIdx + 1 >= questions.length) {
      setAppState("results");
    } else {
      setCurrentIdx(i => i + 1);
      setAnswered(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (appState === "intro") return <IntroScreen onStart={startExam} />;
  if (appState === "results") return <ResultsScreen results={results} onRestart={startExam} />;

  const q = questions[currentIdx];
  const progress = Math.round((currentIdx / questions.length) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground shadow-md sticky top-0 z-50" role="banner">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" role="presentation">
              <rect width="32" height="32" rx="8" fill="hsl(38 95% 50%)"/>
              <path d="M6 22 L10 16 L14 19 L18 11 L22 14 L26 8" stroke="hsl(222 30% 10%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="26" cy="8" r="2" fill="hsl(222 30% 10%)"/>
            </svg>
            <div>
              <div className="font-display font-semibold text-sm leading-none text-sidebar-foreground">ECO 210 ECONLAB</div>
              <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Practice Final Exam</div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-xs">
            <div className="flex-1 bg-sidebar-accent rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-sidebar-foreground/80 whitespace-nowrap font-semibold">{currentIdx + 1} / {questions.length}</span>
          </div>
        </div>
      </header>

      <a href="#main-content" className="skip-to-content">Skip to main content</a>

      <main id="main-content" ref={mainRef} className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        {/* Question header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{q.topic}</span>
            <span className="text-xs text-muted-foreground">
              {q.type === "mc" ? "Single choice" : q.type === "multi" ? "Select all that apply" : q.type === "match" ? "Matching" : "Put in order"}
            </span>
          </div>
          {(q.type === "mc" || q.type === "multi") && (
            <div className="bg-muted rounded-xl p-4 mb-3">
              <p className="font-semibold text-foreground leading-snug">{(q as MCQ | MultiQ).q}</p>
            </div>
          )}
        </div>

        {/* Question body */}
        {q.type === "mc" && <ChoiceQuestion key={currentIdx} q={q as MCQ} onAnswer={handleAnswer} />}
        {q.type === "multi" && <ChoiceQuestion key={currentIdx} q={q as MultiQ} onAnswer={handleAnswer} />}
        {q.type === "match" && <MatchQuestion key={currentIdx} q={q as MatchQ} onAnswer={handleAnswer} />}
        {q.type === "order" && <OrderQuestion key={currentIdx} q={q as OrderQ} onAnswer={handleAnswer} />}

        {/* Next button */}
        {answered && (
          <button onClick={nextQuestion}
            className="w-full mt-4 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold transition">
            {currentIdx + 1 < questions.length ? "Next Question →" : "See My Results"}
          </button>
        )}
      </main>
    </div>
  );
}
