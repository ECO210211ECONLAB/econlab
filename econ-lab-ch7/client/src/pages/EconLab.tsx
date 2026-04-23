import { useState, useRef } from "react";
import { ChevronRight, ChevronLeft, Award, BarChart2, BookOpen, RotateCcw, TrendingUp, Zap } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "recap" | "rule70" | "ingredients" | "convergence" | "policies" | "fredchart" | "productivity" | "quiz" | "results" | "not-yet";

// ─────────────────────────────────────────────
// FRED Data (source: Federal Reserve Bank of St. Louis)
// ─────────────────────────────────────────────
const FRED_GDPPC: [number, number][] = [[1947, 15204.0], [1948, 15530.0], [1949, 15032.0], [1950, 16764.0], [1951, 17375.0], [1952, 18001.0], [1953, 17797.0], [1954, 17960.0], [1955, 18808.0], [1956, 18845.0], [1957, 18582.0], [1958, 18764.0], [1959, 19296.0], [1960, 19065.0], [1961, 19970.0], [1962, 20521.0], [1963, 21276.0], [1964, 22075.0], [1965, 23656.0], [1966, 24446.0], [1967, 24836.0], [1968, 25813.0], [1969, 26076.0], [1970, 25710.0], [1971, 26510.0], [1972, 28055.0], [1973, 28913.0], [1974, 28088.0], [1975, 28520.0], [1976, 29469.0], [1977, 30626.0], [1978, 32318.0], [1979, 32366.0], [1980, 31990.0], [1981, 32095.0], [1982, 31337.0], [1983, 33513.0], [1984, 35072.0], [1985, 36210.0], [1986, 36931.0], [1987, 38238.0], [1988, 39328.0], [1989, 40015.0], [1990, 39759.0], [1991, 39694.0], [1992, 40881.0], [1993, 41423.0], [1994, 42618.0], [1995, 43044.0], [1996, 44421.0], [1997, 45862.0], [1998, 47555.0], [1999, 49281.0], [2000, 50190.0], [2001, 49783.0], [2002, 50302.0], [2003, 51986.0], [2004, 53242.0], [2005, 54317.0], [2006, 55216.0], [2007, 55857.0], [2008, 53941.0], [2009, 53531.0], [2010, 54569.0], [2011, 54979.0], [2012, 55403.0], [2013, 56642.0], [2014, 57702.0], [2015, 58470.0], [2016, 59296.0], [2017, 60674.0], [2018, 61619.0], [2019, 63360.0], [2020, 62605.0], [2021, 66011.0], [2022, 66433.0], [2023, 68089.0], [2024, 69168.0], [2025, 70249.0]]; // [year, real GDP per capita, 2017 dollars]
const FRED_GDPPC_GROWTH: [number, number][] = [[1948, 2.14], [1949, -3.21], [1950, 11.52], [1951, 3.64], [1952, 3.6], [1953, -1.13], [1954, 0.92], [1955, 4.72], [1956, 0.2], [1957, -1.4], [1958, 0.98], [1959, 2.84], [1960, -1.2], [1961, 4.75], [1962, 2.76], [1963, 3.68], [1964, 3.76], [1965, 7.16], [1966, 3.34], [1967, 1.6], [1968, 3.93], [1969, 1.02], [1970, -1.4], [1971, 3.11], [1972, 5.83], [1973, 3.06], [1974, -2.85], [1975, 1.54], [1976, 3.33], [1977, 3.93], [1978, 5.52], [1979, 0.15], [1980, -1.16], [1981, 0.33], [1982, -2.36], [1983, 6.94], [1984, 4.65], [1985, 3.24], [1986, 1.99], [1987, 3.54], [1988, 2.85], [1989, 1.75], [1990, -0.64], [1991, -0.16], [1992, 2.99], [1993, 1.33], [1994, 2.88], [1995, 1.0], [1996, 3.2], [1997, 3.24], [1998, 3.69], [1999, 3.63], [2000, 1.84], [2001, -0.81], [2002, 1.04], [2003, 3.35], [2004, 2.42], [2005, 2.02], [2006, 1.66], [2007, 1.16], [2008, -3.43], [2009, -0.76], [2010, 1.94], [2011, 0.75], [2012, 0.77], [2013, 2.24], [2014, 1.87], [2015, 1.33], [2016, 1.41], [2017, 2.32], [2018, 1.56], [2019, 2.83], [2020, -1.19], [2021, 5.44], [2022, 0.64], [2023, 2.49], [2024, 1.58], [2025, 1.56]]; // [year, annual growth %]

const NBER_RECESSIONS: [number, number, number, number][] = [
  [1948,10,1949,10],[1953,7,1954,5],[1957,8,1958,4],[1960,4,1961,2],
  [1969,12,1970,11],[1973,11,1975,3],[1980,1,1980,7],[1981,8,1982,11],
  [1990,7,1991,3],[2001,3,2001,11],[2007,12,2009,6],[2020,2,2020,4],
];

// ─────────────────────────────────────────────
// Station Data
// ─────────────────────────────────────────────

// Station 1 — Rule of 70 Calculator
type Rule70State = { input: string; attempts: number; correct: boolean };
const RULE70_PROBLEMS = [
  {
    id: 1,
    title: "Basic Rule of 70",
    context: "China's economy has been growing at approximately 7% per year. Using the Rule of 70, approximately how many years will it take for China's GDP to double?",
    formula: "Years to double = 70 ÷ Growth Rate (%)",
    correctAnswer: 10,
    tolerance: 0.6,
    unit: "years",
    hint: "Divide 70 by the growth rate. At 7% growth: 70 ÷ 7 = ?",
    explanation: "70 ÷ 7 = 10 years. At 7% annual growth, the economy doubles every decade. This is why China's rapid growth transformed it from a low-income to a middle-income country in a single generation.",
  },
  {
    id: 2,
    title: "U.S. Long-Run Growth",
    context: "The U.S. economy has grown at an average of about 2% per year in real GDP per capita over the long run. How many years does it take for the average American's living standard to double?",
    formula: "Years to double = 70 ÷ Growth Rate (%)",
    correctAnswer: 35,
    tolerance: 1,
    unit: "years",
    hint: "Divide 70 by 2. This is why long-run growth of just 2% compounds into dramatically higher living standards over generations.",
    explanation: "70 ÷ 2 = 35 years. A child born today at 2% growth will see living standards double by age 35. Their grandchildren will see standards 4× higher. Modest annual growth compresses into enormous generational gains.",
  },
  {
    id: 3,
    title: "Comparing Growth Rates",
    context: "Country A grows at 1% per year. Country B grows at 4% per year. How many more years does it take Country A to double compared to Country B?",
    formula: "Years to double = 70 ÷ Growth Rate. Find the DIFFERENCE between the two.",
    correctAnswer: 52.5,
    tolerance: 3,
    unit: "years difference",
    hint: "Calculate both doubling times separately (70÷1 and 70÷4), then subtract. The difference shows how much the growth rate gap matters.",
    explanation: "Country A: 70÷1 = 70 years. Country B: 70÷4 = 17.5 years. Difference = 52.5 years. A 3 percentage point difference in growth rates means Country A takes 52.5 extra years to double — more than two additional generations. This is why economists obsess over small differences in growth rates.",
  },
];

// Station 2 — Four Ingredients Sorter
type IngredientType = "physical" | "human" | "technology" | "institutions" | null;
const INGREDIENT_ITEMS = [
  // Ch7 content (10 items)
  { id: 1, item: "A new highway connecting rural farms to urban markets", answer: "physical" as IngredientType, explanation: "Physical capital — new infrastructure that increases the productive capacity of the economy by reducing transportation costs and connecting producers to markets.", review: false, reviewLabel: "" },
  { id: 2, item: "A community college offers a free coding bootcamp to unemployed workers", answer: "human" as IngredientType, explanation: "Human capital — investment in worker skills and education. Retrained workers become more productive, directly boosting potential GDP.", review: false, reviewLabel: "" },
  { id: 3, item: "A pharmaceutical company invents a new drug that cuts hospital stays in half", answer: "technology" as IngredientType, explanation: "Technology — a new production method that gets more output from the same inputs. Better medical technology improves productivity across the entire healthcare sector.", review: false, reviewLabel: "" },
  { id: 4, item: "A country establishes an independent judiciary that enforces contracts reliably", answer: "institutions" as IngredientType, explanation: "Institutions — reliable contract enforcement encourages investment by reducing the risk that business deals will be broken. Strong legal institutions are a foundation of economic development.", review: false, reviewLabel: "" },
  { id: 5, item: "A factory purchases 50 new CNC machine tools", answer: "physical" as IngredientType, explanation: "Physical capital — new machinery that workers use to produce more output per hour. Investment in physical capital is one of the most direct drivers of productivity growth.", review: false, reviewLabel: "" },
  { id: 6, item: "A government eliminates corruption in its customs agency", answer: "institutions" as IngredientType, explanation: "Institutions — reducing corruption lowers the 'tax' on doing business and makes property rights more secure. Countries with cleaner institutions consistently grow faster than equally-resourced corrupt ones.", review: false, reviewLabel: "" },
  { id: 7, item: "MIT researchers publish a breakthrough in battery storage technology", answer: "technology" as IngredientType, explanation: "Technology — new knowledge that improves productive capacity. Unlike physical capital, technology is non-rival: one firm's use doesn't prevent others from using the same knowledge.", review: false, reviewLabel: "" },
  { id: 8, item: "A company sends its engineers to a 3-month advanced manufacturing training program", answer: "human" as IngredientType, explanation: "Human capital — employer-provided training that increases worker skills and productivity. Human capital investment, like physical capital, can be depleted (workers retire or leave) and must be continuously rebuilt.", review: false, reviewLabel: "" },
  { id: 9, item: "A developing country adopts GAAP accounting standards for its corporations", answer: "institutions" as IngredientType, explanation: "Institutions — standardized accounting makes firms more transparent and trustworthy to investors. Better financial institutions reduce the cost of capital and encourage investment.", review: false, reviewLabel: "" },
  { id: 10, item: "Solar panel efficiency improves by 30% through materials science research", answer: "technology" as IngredientType, explanation: "Technology — a process improvement that produces the same output (electricity) at lower cost. Energy technology advances have historically been major drivers of economic growth.", review: false, reviewLabel: "" },
];

const INGREDIENT_LABELS: Record<string, { label: string; color: string; bg: string; short: string }> = {
  physical:     { label: "Physical Capital",  short: "Physical",     color: "text-blue-700 dark:text-blue-300",   bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" },
  human:        { label: "Human Capital",     short: "Human",        color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" },
  technology:   { label: "Technology",        short: "Technology",   color: "text-purple-700 dark:text-purple-300",  bg: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800" },
  institutions: { label: "Institutions",      short: "Institutions", color: "text-amber-700 dark:text-amber-300",   bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800" },
};

// Station 4 — Growth Policy Matcher
const POLICY_MATCHES = [
  { id: 1, policy: "Government funds university research in quantum computing", ingredient: "technology", explanation: "Public R&D funding builds the knowledge base that private firms later commercialize. Basic research is underprovided by markets because knowledge is hard to patent and easy to copy." },
  { id: 2, policy: "A country expands access to secondary education in rural areas", ingredient: "human", explanation: "Education is the most direct investment in human capital. Access to secondary schooling is strongly correlated with economic growth in developing countries." },
  { id: 3, policy: "A city builds a new port with deep-water berths", ingredient: "physical", explanation: "Infrastructure investment is classic physical capital accumulation. Better ports reduce shipping costs, expand markets, and raise the productivity of all firms that use them." },
  { id: 4, policy: "A nation passes a strong intellectual property law protecting patents", ingredient: "institutions", explanation: "Patent protection is an institutional innovation that makes technology investment more profitable — a key reason innovation flourishes in market economies." },
  { id: 5, policy: "A firm adopts lean manufacturing and eliminates waste", ingredient: "technology", explanation: "Process innovation — doing more with the same inputs — is technology in the economist's sense. Lean manufacturing was a major driver of productivity growth in manufacturing." },
  { id: 6, policy: "An apprenticeship program pairs young workers with skilled tradespeople", ingredient: "human", explanation: "Apprenticeships transfer tacit skills that can't be learned from books — exactly the kind of human capital that raises worker productivity and wages simultaneously." },
];

// Station 5 — FRED Questions
const FREDPC_QUESTIONS = [
  {
    id: 1,
    question: "Real GDP per capita rose from about $15,000 in 1947 to about $70,000 in 2025. Approximately how many times did it multiply?",
    options: ["About 2× — it roughly doubled", "About 4.6× — consistent with ~2% average annual growth over 78 years", "About 10× — growth was faster than most realize", "About 1.5× — most gains went to inflation, not real growth"],
    answer: 1,
    explanation: "At 2% annual growth over 78 years, the Rule of 70 says roughly 2.2 doublings (78÷35), meaning about 4.6×. The actual figure ($15,204 → $70,249) is 4.6×, confirming the long-run growth rate has been close to 2% per capita. Each doubling represents an entire generation gaining access to new goods, services, and opportunities their parents couldn't afford.",
  },
  {
    id: 2,
    question: "Looking at the growth rate chart, the 1950s–60s show consistently high growth while the 1970s–80s show volatility and lower averages. What best explains this shift?",
    options: [
      "The U.S. switched from manufacturing to services, which grow slower",
      "Two OPEC oil shocks in 1973 and 1979 disrupted supply, triggering stagflation and volatile growth",
      "Population growth slowed, reducing GDP per capita mechanically",
      "The space program ended, removing a major source of technological spillovers",
    ],
    answer: 1,
    explanation: "The oil shocks of 1973 and 1979 were supply-side disruptions that simultaneously raised costs and reduced output — creating stagflation (high inflation + slow growth). This broke the stable growth pattern of the postwar era and triggered years of volatility. The productivity slowdown of the 1970s is one of the most studied puzzles in macroeconomics.",
  },
  {
    id: 3,
    question: "Real GDP per capita declined in 2009 and briefly in 2020. What do these contractions tell us about growth?",
    options: [
      "Growth is linear — it always moves upward regardless of shocks",
      "Growth is not guaranteed; severe demand or supply shocks can reverse years of gains temporarily",
      "GDP per capita is unreliable because it ignores population changes",
      "Both 2009 and 2020 were caused by the same underlying structural problem",
    ],
    answer: 1,
    explanation: "Long-run growth is positive but not smooth. The 2009 contraction erased several years of gains; the 2020 COVID shock was sharper but shorter. Both show that growth is a tendency, not a guarantee — and that the level of GDP per capita reached in any given year can be temporarily lost. Recovery, not the trend line, is what requires policy attention.",
  },
  {
    id: 4,
    question: "The 1990s show a sustained growth acceleration. What drove the strongest per-capita growth of the post-1970 era?",
    options: [
      "A massive increase in physical capital investment from NAFTA",
      "The IT revolution — rapid diffusion of computers and the internet raised productivity across industries",
      "Baby Boomers reaching peak productivity years simultaneously",
      "Federal budget surpluses that freed up capital for private investment",
    ],
    answer: 1,
    explanation: "The 1990s technology boom was driven by the commercialization of the internet and rapid adoption of personal computers and networks. IT investment raised productivity across virtually every sector — finance, retail, manufacturing, logistics. This is a textbook example of how a general-purpose technology (GPT) can accelerate growth economy-wide.",
  },
  {
    id: 5,
    question: "What does the long-run chart most powerfully illustrate about economic growth?",
    options: [
      "That growth is primarily driven by government policy choices",
      "That small, sustained differences in annual growth rates compound into enormous differences in living standards over decades",
      "That growth rates have been declining since the 1950s and will eventually reach zero",
      "That GDP per capita is a better measure of well-being than any alternative",
    ],
    answer: 1,
    explanation: "The chart's most important lesson is compounding. At 2% annual growth, living standards quadruple every 70 years. A country that grows 1% faster doesn't just end up 1% richer — it ends up dramatically richer over a generation. This is why the difference between 1% and 3% long-run growth is not minor: it's the difference between relative stagnation and transformation.",
  },
];

// Station 6 — Productivity & Living Standards
const PRODUCTIVITY_REVEALS = [
  {
    id: 1,
    claim: "Productivity growth is the only sustainable source of higher real wages",
    explanation: "Wages can rise temporarily from tight labor markets or minimum wage laws. But sustained real wage growth — higher purchasing power over time — requires workers to produce more per hour. If a worker produces $50/hr of output today and $60/hr tomorrow (productivity +20%), wages can rise $10 sustainably. Without productivity growth, wage increases just cause inflation and cancel out.",
  },
  {
    id: 2,
    claim: "A country can grow GDP by working more hours OR by working more productively — but only one is sustainable",
    explanation: "You can boost GDP by adding workers or extending hours — but there are physical limits. You can't work 25 hours a day. Productivity growth (more output per hour worked) has no ceiling — technology and knowledge can keep improving indefinitely. This is why economists focus on productivity as the key driver of long-run growth, not just labor force expansion.",
  },
  {
    id: 3,
    claim: "The U.S. standard of living is roughly 4.6× higher than in 1947 mainly because each worker produces far more per hour, not because Americans work more hours",
    explanation: "Average U.S. work hours have actually fallen slightly since 1947. The entire 4.6× improvement in living standards came from doing more with each hour worked — better tools, better knowledge, better organizational methods. This is productivity growth at work over 78 years.",
  },
  {
    id: 4,
    claim: "Productivity differences explain most of the gap between rich and poor countries",
    explanation: "A worker in a wealthy country isn't more hardworking than a worker in a poor country — often the opposite. The difference is what they work WITH: better machines, better institutions, better-trained colleagues, more reliable infrastructure, more sophisticated supply chains. Remove the tools and institutions, and the 'productive' worker isn't more productive. This is the key insight behind foreign aid and development policy debates.",
  },
  {
    id: 5,
    claim: "The Four Ingredients of Growth all ultimately work by raising productivity",
    explanation: "Physical capital gives workers better tools. Human capital makes workers more skilled. Technology lets the same inputs produce more output. Institutions reduce friction and wasted effort. All four raise output per worker-hour. There is no sustainable growth path that doesn't involve at least one of these productivity drivers — and the fastest-growing economies typically invest in all four simultaneously.",
  },
];

// Quiz Questions
const QUIZ_QUESTIONS: Array<{
  question: string; options: string[]; answer: number | number[]; multi?: boolean; explanation: string;
}> = [
  {
    question: "Using the Rule of 70, if an economy grows at 3.5% per year, approximately how many years will it take for GDP to double?",
    options: ["10 years", "20 years", "35 years", "50 years"],
    answer: 1,
    explanation: "70 ÷ 3.5 = 20 years. The Rule of 70 is a quick mental math tool: divide 70 by the growth rate to find the doubling time. At 3.5% growth, the economy doubles every 20 years — meaning in a 60-year career, a worker could see living standards double three times.",
  },
  {
    question: "Which of the following is an example of investment in HUMAN capital?",
    options: [
      "A firm buys 20 new industrial robots",
      "A city builds a new water treatment plant",
      "A company pays for its employees to earn professional certifications",
      "A government builds a new research laboratory",
    ],
    answer: 2,
    explanation: "Professional certifications increase worker skills and productivity — that's human capital. Robots and labs are physical capital (tangible tools). The water plant is infrastructure (physical capital). Human capital investments improve the quality of the workforce itself.",
  },
  {
    question: "The 'catch-up effect' in economic growth theory predicts that:",
    options: [
      "Rich countries will eventually stop growing as they run out of productive investments",
      "Poor countries tend to grow faster than rich countries because they can adopt existing technologies cheaply",
      "Countries with natural resources always catch up to industrialized nations",
      "Trade deficits prevent developing countries from achieving convergence",
    ],
    answer: 1,
    explanation: "The catch-up effect (convergence hypothesis) says poor countries can grow faster by importing and adapting technologies that rich countries spent decades developing. A farmer in Ethiopia adopting a smartphone-based weather app gets gains that took Silicon Valley engineers years to produce — at essentially zero marginal cost.",
  },
  {
    question: "Why do economists consider INSTITUTIONS a key ingredient of economic growth?",
    options: [
      "Institutions provide the physical infrastructure workers need to be productive",
      "Strong institutions reduce uncertainty, protect property rights, and make investment less risky — encouraging more of it",
      "Institutions are primarily important for distributing income, not for generating it",
      "Only democratic institutions promote growth; authoritarian institutions always reduce it",
    ],
    answer: 1,
    explanation: "Institutions are the 'rules of the game' — property rights, contract enforcement, corruption levels, legal systems. When these work well, investment is more attractive because returns are more secure. When they fail, even abundant physical and human capital sits idle. This is why equally-resourced countries can have dramatically different growth trajectories.",
  },
  {
    question: "Real GDP per capita in the U.S. grew from about $15,000 in 1947 to $70,000 in 2025. This growth primarily reflects:",
    options: [
      "Americans working more hours per year than in 1947",
      "A larger population producing more total output",
      "Higher productivity — each worker producing substantially more output per hour worked",
      "More women entering the workforce, adding labor hours",
    ],
    answer: 2,
    explanation: "Real GDP per capita (per person) strips out population effects. Average work hours have actually declined slightly since 1947. The entire improvement in per-capita living standards came from productivity growth — workers producing far more per hour using better tools, knowledge, and institutions.",
  },
  {
    question: "Country X grows at 1% per year. Country Y grows at 4% per year. How many years does it take each to double, and what is the difference?",
    options: [
      "X: 35 years, Y: 17.5 years — 17.5-year difference",
      "X: 70 years, Y: 17.5 years — 52.5-year difference",
      "X: 70 years, Y: 35 years — 35-year difference",
      "X: 100 years, Y: 25 years — 75-year difference",
    ],
    answer: 1,
    explanation: "Rule of 70: Country X doubles in 70÷1 = 70 years. Country Y doubles in 70÷4 = 17.5 years. Difference = 52.5 years — more than two full generations. A 3 percentage point growth rate difference doesn't just make Y slightly richer; it makes Y dramatically richer over time. This is the most important lesson of the Rule of 70.",
  },
  {
    question: "Which of the following best explains why technology is especially powerful as a driver of economic growth?",
    options: [
      "Technology is tangible — it can be directly measured and tracked by governments",
      "Unlike physical capital, technology is non-rival — one firm using it doesn't prevent others from using the same knowledge",
      "Technology automatically transfers from rich countries to poor countries through trade",
      "Technological progress has accelerated every decade since the Industrial Revolution",
    ],
    answer: 1,
    explanation: "Technology (knowledge) is non-rival: if Apple discovers a better chip design, that doesn't prevent Samsung from potentially discovering a similar one. Physical capital is rival — if Apple buys a machine, Samsung can't use the same machine. This non-rivalry is why technological progress can power sustained growth without facing diminishing returns the same way physical capital does.",
  },
  {
    question: "A country has abundant natural resources but slow economic growth. Which explanation is most consistent with growth theory?",
    options: [
      "Natural resources always produce growth automatically through export revenues",
      "Weak institutions — corruption, poor contract enforcement, insecure property rights — may prevent natural resources from translating into broad-based investment and growth",
      "The country must be experiencing a demographic dividend that offsets the resource advantage",
      "Natural resources only drive growth in temperate climates due to agricultural productivity",
    ],
    answer: 1,
    explanation: "The 'resource curse' — countries with abundant resources often grow slower than resource-poor ones — is one of the most documented findings in development economics. The mechanism: resource wealth funds corrupt elites who have no incentive to build the institutions (property rights, rule of law, contract enforcement) that generate broad-based growth.",
  },
  // Q9 and Q10 multi-select
  {
    question: "Which of the following policies would DIRECTLY build human capital? Select ALL that apply.",
    options: [
      "Subsidizing tuition at community colleges",
      "Building a new toll highway between two cities",
      "Funding employer-sponsored job training programs",
      "Passing a law requiring independent audits of public companies",
      "Expanding Pell Grants to cover vocational certifications",
    ],
    answer: [0, 2, 4],
    multi: true,
    explanation: "Three directly build human capital: subsidized tuition (A), employer-sponsored training (C), and Pell Grants for certifications (E) — all increase worker skills and productivity. The highway (B) is physical capital. Independent audit requirements (D) strengthen institutions. Knowing which lever does what is essential for evaluating growth policy.",
  },
  {
    question: "Which of the following correctly describe why small differences in long-run growth rates matter enormously? Select ALL that apply.",
    options: [
      "Due to compounding, a 1% higher growth rate doubles living standards roughly 35 years sooner",
      "Growth rate differences only matter over very short time horizons",
      "A country growing 1% faster than another will be dramatically wealthier after 100 years due to exponential compounding",
      "The Rule of 70 shows that doubling time is highly sensitive to the growth rate",
      "Higher growth rates always require sacrificing present consumption for investment",
    ],
    answer: [0, 2, 3],
    multi: true,
    explanation: "Three are correct: 1% more growth shortens doubling time by ~35 years (A), compounding makes even small rate differences enormous over 100 years (C), and the Rule of 70 quantifies exactly this sensitivity (D). Option B is wrong — the whole point is that growth differences matter over LONG horizons, not short ones. Option E is sometimes true but not always — TFP (technology) growth can raise output without sacrificing consumption.",
  },
];

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────
const STATION_META: { id: Station; title: string; desc: string; gated?: boolean }[] = [
  { id: "recap",        title: "📚 Chapter 6 Recap",      desc: "5 quick questions from Chapter 6 — start here before new content" },
  { id: "rule70",       title: "Rule of 70",             desc: "Calculate doubling times from growth rates — 3 problems with hints", gated: true },
  { id: "ingredients",  title: "Four Ingredients",       desc: "Classify 10 investments as Physical Capital, Human Capital, Technology, or Institutions" },
  { id: "convergence",  title: "Convergence Explorer",   desc: "See how the catch-up effect works with an interactive chart" },
  { id: "policies",     title: "Growth Policy Matcher",  desc: "Match 6 real policies to the growth ingredient they build" },
  { id: "fredchart",    title: "Reading the Data",       desc: "Analyze 78 years of U.S. real GDP per capita from FRED" },
  { id: "productivity", title: "Productivity & Living Standards", desc: "Explore why productivity is the only sustainable source of real wage growth" },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function Header({ station, onStation, completed }: { station: Station; onStation: (s: Station) => void; completed: Set<Station> }) {
  const stations: { id: Station; label: string }[] = [
    { id: "intro",       label: "Dashboard" },
    { id: "recap",       label: "Ch6 Recap" },
    { id: "rule70",      label: "Rule of 70" },
    { id: "ingredients", label: "Ingredients" },
    { id: "convergence", label: "Convergence" },
    { id: "policies",    label: "Policies" },
    { id: "fredchart",   label: "FRED Chart" },
    { id: "productivity",label: "Productivity" },
    { id: "quiz",        label: "Quiz" },
  ];
  const stationOrder: Station[] = ["intro","recap","rule70","ingredients","convergence","policies","fredchart","productivity","quiz","results","not-yet"];
  const currentIdx = stationOrder.indexOf(station);
  const contentStations: Station[] = ["recap","rule70","ingredients","convergence","policies","fredchart","productivity"];
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
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 7</div>
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
const CH7_SUMMARY = [
  {
    section: "7.1 The Relatively Recent Arrival of Economic Growth",
    body: "Since the early nineteenth century, there has been a spectacular process of long-run economic growth during which the world's leading economies—mostly those in Western Europe and North America—expanded GDP per capita at an average rate of about 2% per year. In the last half-century, countries like Japan, South Korea, and China have shown the potential to catch up. The Industrial Revolution facilitated the extensive process of economic growth, that economists often refer to as modern economic growth. This increased worker productivity and trade, as well as the development of governance and market institutions.",
  },
  {
    section: "7.2 Labor Productivity and Economic Growth",
    body: "We can measure productivity, the value of what is produced per worker, or per hour worked, as the level of GDP per worker or GDP per hour. The United States experienced a productivity slowdown between 1973 and 1989. Since then, U.S. productivity has rebounded for the most part, but annual growth in productivity in the nonfarm business sector has been less than one percent each year between 2011 and 2016. It is not clear what productivity growth will be in the coming years.\n\nThe rate of productivity growth is the primary determinant of an economy's rate of long-term economic growth and higher wages. Over decades and generations, seemingly small differences of a few percentage points in the annual rate of economic growth make an enormous difference in GDP per capita. An aggregate production function specifies how certain inputs in the economy, like human capital, physical capital, and technology, lead to the output measured as GDP per capita.\n\nCompound interest and compound growth rates behave in the same way as productivity rates. Seemingly small changes in percentage points can have big impacts on income over time.",
  },
  {
    section: "7.3 Components of Economic Growth",
    body: "Over decades and generations, seemingly small differences of a few percentage points in the annual rate of economic growth make an enormous difference in GDP per capita. Capital deepening refers to an increase in the amount of capital per worker, either human capital per worker, in the form of higher education or skills, or physical capital per worker. Technology, in its economic meaning, refers broadly to all new methods of production, which includes major scientific inventions but also small inventions and even better forms of management or other types of institutions. A healthy climate for growth in GDP per capita consists of improvements in human capital, physical capital, and technology, in a market-oriented environment with supportive public policies and institutions.",
  },
  {
    section: "7.4 Economic Convergence",
    body: "When countries with lower GDP levels per capita catch up to countries with higher GDP levels per capita, we call the process convergence. Convergence can occur even when both high- and low-income countries increase investment in physical and human capital with the objective of growing GDP. This is because the impact of new investment in physical and human capital on a low-income country may result in huge gains as new skills or equipment combine with the labor force. In higher-income countries, however, a level of investment equal to that of the low income country is not likely to have as big an impact, because the more developed country most likely already has high levels of capital investment.\n\nTherefore, the marginal gain from this additional investment tends to be successively less and less. Higher income countries are more likely to have diminishing returns to their investments and must continually invent new technologies. This allows lower-income economies to have a chance for convergent growth. However, many high-income economies have developed economic and political institutions that provide a healthy economic climate for an ongoing stream of technological innovations. Continuous technological innovation can counterbalance diminishing returns to investments in human and physical capital.",
  },
];

function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-card border border-card-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <div className="font-display font-bold text-base text-foreground">Chapter 7 Summary</div>
            <div className="text-xs text-muted-foreground mt-0.5">OpenStax Macroeconomics 3rd Edition</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground text-lg font-bold">&times;</button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {CH7_SUMMARY.map((item, i) => (
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
        <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wide mb-4">Chapter 7</span>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Economic Growth</h1>
        <p className="text-muted-foreground text-base">Why Some Economies Grow Faster Than Others</p>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-foreground">
        💡 <strong>Key idea:</strong> Sustained economic growth — the kind that raises living standards generation after generation — doesn't happen by accident. It requires deliberate investment in four specific ingredients. Complete all 6 stations in any order, then take the quiz.
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
// Station: Chapter 6 Recap
// ─────────────────────────────────────────────
const RECAP_QUESTIONS_6: Array<{
  question: string; options: string[]; answer: number | number[]; multi?: boolean; explanation: string;
}> = [
  {
    question: "A Toyota Camry is assembled at Toyota's plant in Georgetown, Kentucky, by American workers. Does this count in U.S. GDP, and if so, which component?",
    options: [
      "No — Toyota is a Japanese company so it counts in Japan's GDP",
      "Yes — it counts in C (Consumption) when a U.S. consumer buys it",
      "Yes — it counts in I (Investment) because it is manufactured output",
      "Yes — it counts in NX as a domestic export",
    ],
    answer: 1,
    explanation: "GDP counts production within U.S. borders regardless of company nationality. The car is final output sold to a consumer → Consumption (C). Location of production is what matters for GDP assignment.",
  },
  {
    question: "A state government pays construction workers to rebuild a collapsed bridge. Which GDP component does this represent?",
    options: [
      "C — because workers spend their wages on consumer goods",
      "I — because it creates a long-lasting capital asset",
      "G — government purchases of goods and services",
      "NX — because some materials may be imported",
    ],
    answer: 2,
    explanation: "Government spending on goods and services → G. Note: transfer payments like Social Security are NOT counted in G. Only spending where the government receives a good or service in return qualifies.",
  },
  {
    question: "Nominal GDP rose 8% last year. The GDP Price Index rose 6% over the same period. Approximately what was real GDP growth?",
    options: [
      "8% — nominal GDP captures all growth",
      "14% — you add the rates together",
      "About 2% — subtract inflation from nominal growth",
      "6% — equal to the price level change",
    ],
    answer: 2,
    explanation: "Real GDP growth ≈ Nominal growth − Inflation = 8% − 6% = 2%. Most of the nominal increase was prices rising, not more goods and services being produced. This is exactly why economists track real, not nominal, GDP.",
  },
  {
    question: "Which of the following are correctly EXCLUDED from GDP? Select ALL that apply.",
    options: [
      "A Social Security check mailed to a retired teacher",
      "Steel sold from a steel mill to an auto manufacturer",
      "A new laptop bought by a student at Best Buy",
      "A used couch sold on Facebook Marketplace",
      "A homeowner paints their own house over the weekend",
    ],
    answer: [0, 1, 3, 4],
    multi: true,
    explanation: "Excluded: Social Security (transfer payment — no production), steel to auto plant (intermediate good), used couch (counted when first sold new), homeowner's own labor (non-market production). The new laptop IS counted — it's a final good purchased by a consumer.",
  },
  {
    question: "GDP rises after a hurricane destroys a city and the government spends $50 billion on reconstruction. What does this reveal about GDP as a measure of well-being?",
    options: [
      "Nothing unusual — reconstruction correctly reflects higher economic activity",
      "GDP counts spending on damage repair as positive even though society is no better off than before the disaster",
      "GDP overstates growth because reconstruction is counted in G rather than I",
      "The price deflator should be adjusted during disaster recovery",
    ],
    answer: 1,
    explanation: "This is a key GDP limitation: it cannot distinguish spending that creates new value from spending that merely restores what was lost. Rebuilding after a hurricane brings GDP back to pre-hurricane levels, not higher. Real well-being fell, but GDP suggests a boom.",
  },
];

function RecapStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({}); 
  const [checked, setChecked] = useState<Record<number, boolean>>({}); 

  const q = RECAP_QUESTIONS_6[current];
  const isChecked = checked[current];
  const allChecked = RECAP_QUESTIONS_6.every((_, i) => checked[i]);

  function hasSelection(qIdx: number): boolean {
    const given = answers[qIdx];
    if (RECAP_QUESTIONS_6[qIdx].multi) return Array.isArray(given) && (given as number[]).length > 0;
    return given !== undefined;
  }

  function isCorrectQ(qIdx: number): boolean {
    const question = RECAP_QUESTIONS_6[qIdx];
    const given = answers[qIdx];
    if (question.multi) {
      const correct = (question.answer as number[]).slice().sort().join(",");
      const userArr = Array.isArray(given) ? (given as number[]).slice().sort().join(",") : "";
      return correct === userArr;
    }
    return given === question.answer;
  }

  function handleSelect(idx: number) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [current]: idx }));
  }

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
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300">📚 Start here — Chapter 6 Review</span>
        </div>
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Chapter 6 Recap: GDP</h2>
        <p className="text-sm text-muted-foreground">5 questions using new scenarios from Chapter 6. Retrieval practice before new material helps it stick — try these before diving into Chapter 7 content.</p>
      </div>

      <div className="flex gap-2 mb-5">
        {RECAP_QUESTIONS_6.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`flex-1 h-2 rounded-full transition-all ${navDotStyle(i)}`} />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        {q.multi && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Select ALL that apply</span>
          </div>
        )}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Question {current + 1} of {RECAP_QUESTIONS_6.length}</span>
        </div>
        <p className="text-base font-medium text-foreground mb-5 leading-relaxed">{q.question}</p>
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
        {current < RECAP_QUESTIONS_6.length - 1 ? (
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
// Station: Rule of 70 Calculator
// ─────────────────────────────────────────────
function Rule70Station({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [probIdx, setProbIdx] = useState(0);
  const [states, setStates] = useState<Rule70State[]>(RULE70_PROBLEMS.map(() => ({ input: "", attempts: 0, correct: false })));

  const prob = RULE70_PROBLEMS[probIdx];
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

  function attemptMsg(): string | null {
    if (state.attempts === 1) return "Not quite — check your arithmetic and try again.";
    if (state.attempts === 2) return `💡 Hint: ${prob.hint}`;
    if (state.attempts >= 3) return `Answer: ${prob.correctAnswer} ${prob.unit}`;
    return null;
  }

  function msgColor() {
    if (state.attempts >= 3) return "text-red-600 dark:text-red-400";
    if (state.attempts === 2) return "text-amber-600 dark:text-amber-400";
    return "text-muted-foreground";
  }

  function inputColor() {
    if (state.correct) return "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30";
    if (state.attempts === 0) return "border-border bg-background";
    if (state.attempts >= 2) return "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30";
    return "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30";
  }

  const allSolved = states.every(s => s.correct || s.attempts >= 3);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Rule of 70 Calculator</h2>
        <p className="text-sm text-muted-foreground">Apply the Rule of 70 to find doubling times. <strong className="text-foreground">Round to 1 decimal place.</strong></p>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-4 mb-5">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">The Rule of 70</div>
        <div className="font-mono text-sm text-foreground font-bold">Years to double = 70 ÷ Annual Growth Rate (%)</div>
        <div className="text-xs text-muted-foreground mt-1">Example: 2% growth → 70 ÷ 2 = 35 years to double</div>
      </div>

      <div className="flex gap-2 mb-5">
        {RULE70_PROBLEMS.map((p, i) => {
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
          Your Answer ({prob.unit}) <span className="normal-case font-normal">— round to 1 decimal</span>
        </label>
        <div className="flex items-center gap-3">
          <input type="number" step="0.1" placeholder="e.g. 20" value={state.input}
            onChange={e => updateInput(e.target.value)} disabled={state.correct}
            className={`w-40 px-3 py-2 rounded-lg border text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground ${inputColor()}`} />
          {state.correct && <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ Correct</span>}
          {!state.correct && state.attempts >= 3 && <span className="text-sm font-semibold text-red-600 dark:text-red-400">✗ {prob.correctAnswer} {prob.unit}</span>}
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
        {probIdx < RULE70_PROBLEMS.length - 1 ? (
          <button onClick={() => setProbIdx(probIdx + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Problem <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>

      <NavButtons onBack={onBack} onNext={onComplete} nextLabel="Mark Complete ✓" nextDisabled={!allSolved} />
      {!allSolved && <p className="text-xs text-center text-muted-foreground mt-2">Solve all 3 problems to mark complete ({states.filter(s => s.correct || s.attempts >= 3).length}/3 done).</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Four Ingredients Sorter
// ─────────────────────────────────────────────
function IngredientsStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, IngredientType>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const card = INGREDIENT_ITEMS[current];
  const selected = answers[current];
  const isChecked = checked[current];
  const isCorrect = selected === card.answer;
  const allChecked = INGREDIENT_ITEMS.every((_, i) => checked[i]);

  const choices: IngredientType[] = ["physical", "human", "technology", "institutions"];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Four Ingredients of Growth</h2>
        <p className="text-sm text-muted-foreground">Classify each investment or policy into the growth ingredient it represents. The first two are Chapter 6 review items — they connect GDP concepts to growth theory.</p>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {choices.map(c => {
          const meta = INGREDIENT_LABELS[c!];
          return (
            <div key={c} className={`p-2.5 rounded-lg border text-xs ${meta.bg}`}>
              <div className={`font-bold ${meta.color}`}>{meta.label}</div>
              <div className="text-muted-foreground mt-0.5 leading-tight">
                {c === "physical" ? "Machines, buildings, infrastructure" : c === "human" ? "Skills, education, training" : c === "technology" ? "Knowledge, processes, innovation" : "Rules, laws, property rights"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-4">
        {INGREDIENT_ITEMS.map((item, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === current ? "bg-primary" :
              checked[i] ? (answers[i] === INGREDIENT_ITEMS[i].answer ? "bg-emerald-400" : "bg-red-400") :
              answers[i] ? "bg-primary/40" : "bg-muted"
            }`} />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Item {current + 1} of {INGREDIENT_ITEMS.length}</span>

        </div>
        <p className="text-base font-medium text-foreground mb-5 leading-relaxed">{card.item}</p>

        <div className="grid grid-cols-2 gap-2">
          {choices.map(val => {
            const isSel = selected === val;
            const isCorrectOpt = card.answer === val;
            const meta = INGREDIENT_LABELS[val!];
            return (
              <button key={val} onClick={() => !isChecked && setAnswers(prev => ({ ...prev, [current]: val }))}
                disabled={isChecked}
                data-testid={`ingredient-${val}`}
                className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all text-left ${
                  isChecked ? (isCorrectOpt ? meta.bg + " ring-2 ring-emerald-400" : isSel && !isCorrectOpt ? "bg-red-50 dark:bg-red-950/30 border-red-300 text-red-800 dark:text-red-200" : "bg-muted border-border text-muted-foreground opacity-40 cursor-default")
                  : isSel ? "bg-primary/10 border-primary text-foreground" : "bg-muted hover:bg-accent text-foreground border-border"
                }`}>
                <span className={`font-bold mr-1 ${meta.color}`}>{meta.short}</span>
              </button>
            );
          })}
        </div>

        {!isChecked && selected && (
          <button onClick={() => setChecked(prev => ({ ...prev, [current]: true }))}
            className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
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
        {current < INGREDIENT_ITEMS.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>

      <NavButtons onBack={onBack} onNext={allChecked ? onComplete : undefined} nextDisabled={!allChecked} nextLabel="Mark Complete ✓" />
      {!allChecked && <p className="text-xs text-center text-muted-foreground mt-2">Check your answer on each item to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Convergence Explorer
// ─────────────────────────────────────────────
// Real-world GDP per capita data (2023, World Bank PPP, thousands USD)
const CONVERGENCE_COUNTRIES = [
  { name: "USA", gdppc1960: 18580, gdppc2023: 80300, growth: 2.3, region: "Developed" },
  { name: "South Korea", gdppc1960: 1900, gdppc2023: 56700, growth: 5.8, region: "Catch-up" },
  { name: "China", gdppc1960: 750, gdppc2023: 22400, growth: 5.2, region: "Catch-up" },
  { name: "Japan", gdppc1960: 8000, gdppc2023: 49700, growth: 3.4, region: "Catch-up" },
  { name: "Germany", gdppc1960: 15200, gdppc2023: 63500, growth: 2.2, region: "Developed" },
  { name: "India", gdppc1960: 960, gdppc2023: 9200, growth: 3.6, region: "Developing" },
  { name: "Brazil", gdppc1960: 4400, gdppc2023: 18100, growth: 2.4, region: "Developing" },
  { name: "Nigeria", gdppc1960: 1700, gdppc2023: 5800, growth: 1.9, region: "Developing" },
];

function ConvergenceStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const country = CONVERGENCE_COUNTRIES.find(c => c.name === selected);
  const W = 340, H = 180;
  const maxGDP = 85000;
  const minGDP = 0;

  function xScale(gdp: number) { return 20 + (gdp / maxGDP) * (W - 40); }
  function yScale(growth: number) {
    const minG = 1.5, maxG = 6.5;
    return H - 20 - ((growth - minG) / (maxG - minG)) * (H - 40);
  }

  const REGION_COLORS: Record<string, string> = {
    "Developed": "#ef4444",
    "Catch-up": "#22c55e",
    "Developing": "#f59e0b",
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Convergence Explorer</h2>
        <p className="text-sm text-muted-foreground">The catch-up effect predicts that poorer countries grow faster than rich ones. Explore the data — click a country to see its story.</p>
      </div>

      {/* Scatter plot: initial GDP per capita vs. growth rate */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm text-foreground">Starting Wealth vs. Growth Rate (1960–2023)</h3>
        </div>
        <div className="flex justify-center">
          <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full max-w-sm">
            {/* Grid */}
            {[20000,40000,60000,80000].map(v => (
              <line key={v} x1={xScale(v)} y1={20} x2={xScale(v)} y2={H-20} stroke="currentColor" strokeOpacity={0.07} strokeWidth={1}/>
            ))}
            {[2,3,4,5,6].map(v => (
              <line key={v} x1={20} y1={yScale(v)} x2={W-20} y2={yScale(v)} stroke="currentColor" strokeOpacity={0.07} strokeWidth={1}/>
            ))}
            {/* Trend line (downward — poorer = faster) */}
            <line x1={xScale(500)} y1={yScale(5.5)} x2={xScale(80000)} y2={yScale(2.1)} stroke="currentColor" strokeOpacity={0.15} strokeWidth={1.5} strokeDasharray="4,3"/>
            {/* Countries */}
            {CONVERGENCE_COUNTRIES.map(c => {
              const cx = xScale(c.gdppc1960);
              const cy = yScale(c.growth);
              const isSel = selected === c.name;
              const color = REGION_COLORS[c.region];
              return (
                <g key={c.name} onClick={() => setSelected(c.name)} style={{ cursor: "pointer" }}>
                  <circle cx={cx} cy={cy} r={isSel ? 10 : 7} fill={color} fillOpacity={isSel ? 1 : 0.7}
                    stroke={isSel ? "white" : color} strokeWidth={isSel ? 2 : 0} />
                  <text x={cx} y={cy - 13} textAnchor="middle" fontSize={8} fill="currentColor" fillOpacity={0.7}>{c.name}</text>
                </g>
              );
            })}
            {/* Axes labels */}
            <text x={W/2} y={H+25} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.5}>GDP per capita in 1960 (starting wealth)</text>
            <text x={8} y={H/2} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.5} transform={`rotate(-90, 8, ${H/2})`}>Avg. growth rate</text>
          </svg>
        </div>
        <div className="flex gap-4 justify-center mt-2 text-xs">
          {Object.entries(REGION_COLORS).map(([region, color]) => (
            <span key={region} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: color }} />
              {region}
            </span>
          ))}
        </div>
      </div>

      {/* Country detail */}
      {country ? (
        <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
          <h3 className="font-display font-bold text-base text-foreground mb-3">{country.name} — {country.region}</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">GDP/capita 1960</div>
              <div className="font-display font-bold text-foreground">${(country.gdppc1960/1000).toFixed(1)}K</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">GDP/capita 2023</div>
              <div className="font-display font-bold text-primary">${(country.gdppc2023/1000).toFixed(1)}K</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Avg. Growth Rate</div>
              <div className="font-display font-bold text-foreground">{country.growth}%/yr</div>
            </div>
          </div>
          <div className="text-xs text-foreground bg-primary/10 border border-primary/20 rounded-lg p-3">
            <strong>Multiplier: </strong>{(country.gdppc2023 / country.gdppc1960).toFixed(1)}× richer than in 1960.
            {country.region === "Catch-up" ? " This is catch-up convergence in action — starting poor allowed rapid adoption of existing technologies." :
             country.region === "Developed" ? " Rich countries grow slower because they're already at the technological frontier — there's nothing to 'catch up' to." :
             " This country hasn't fully capitalized on the catch-up effect — institutional barriers or instability may have slowed technology adoption."}
          </div>
        </div>
      ) : (
        <div className="bg-muted rounded-xl p-5 mb-5 text-center text-sm text-muted-foreground">
          Click a country on the chart to see its growth story.
        </div>
      )}

      {!revealed ? (
        <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
          <h3 className="font-semibold text-sm text-foreground mb-2">The Key Insight</h3>
          <p className="text-xs text-muted-foreground mb-3">Notice the downward-sloping trend line. What does it tell you? Try clicking the countries, then reveal the explanation.</p>
          <button onClick={() => setRevealed(true)} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Reveal the Convergence Insight
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 mb-5 text-sm text-foreground">
          <strong>The Catch-Up Effect:</strong> The downward slope confirms that poorer countries in 1960 generally grew faster. South Korea and China — starting very poor — grew at 5–6% annually and multiplied living standards 10–30×. Rich countries like the USA and Germany grew steadier at 2–2.5% because they were already at the frontier. <strong>But notice Nigeria and Brazil:</strong> convergence isn't automatic. Countries that failed to build strong institutions, invest in education, and maintain stability didn't catch up even when they started poor.
        </div>
      )}

      <NavButtons onBack={onBack} onNext={revealed ? onComplete : undefined} nextDisabled={!revealed} nextLabel="Mark Complete ✓" />
      {!revealed && <p className="text-xs text-center text-muted-foreground mt-2">Explore the countries and reveal the insight to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Growth Policy Matcher
// ─────────────────────────────────────────────
function PoliciesStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const card = POLICY_MATCHES[current];
  const selected = answers[current];
  const isChecked = checked[current];
  const isCorrect = selected === card.ingredient;
  const allChecked = POLICY_MATCHES.every((_, i) => checked[i]);

  const choices = ["physical", "human", "technology", "institutions"];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Growth Policy Matcher</h2>
        <p className="text-sm text-muted-foreground">Each policy below builds one of the four growth ingredients. Match them correctly.</p>
      </div>

      <div className="flex gap-1.5 mb-5">
        {POLICY_MATCHES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === current ? "bg-primary" :
              checked[i] ? (answers[i] === POLICY_MATCHES[i].ingredient ? "bg-emerald-400" : "bg-red-400") :
              answers[i] ? "bg-primary/40" : "bg-muted"
            }`} />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        <span className="text-xs font-semibold text-muted-foreground">Policy {current + 1} of {POLICY_MATCHES.length}</span>
        <p className="text-base font-medium text-foreground mt-2 mb-5 leading-relaxed">{card.policy}</p>

        <div className="grid grid-cols-2 gap-2">
          {choices.map(val => {
            const isSel = selected === val;
            const isCorrectOpt = card.ingredient === val;
            const meta = INGREDIENT_LABELS[val];
            return (
              <button key={val} onClick={() => !isChecked && setAnswers(prev => ({ ...prev, [current]: val }))}
                disabled={isChecked} data-testid={`policy-${val}`}
                className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  isChecked ? (isCorrectOpt ? meta.bg + " ring-2 ring-emerald-400" : isSel && !isCorrectOpt ? "bg-red-50 dark:bg-red-950/30 border-red-300 text-red-800 dark:text-red-200" : "bg-muted border-border text-muted-foreground opacity-40 cursor-default")
                  : isSel ? "bg-primary/10 border-primary text-foreground" : "bg-muted hover:bg-accent text-foreground border-border"
                }`}>
                <span className={`font-bold mr-1 ${meta.color}`}>{meta.short}</span>
              </button>
            );
          })}
        </div>

        {!isChecked && selected && (
          <button onClick={() => setChecked(prev => ({ ...prev, [current]: true }))}
            className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check Answer
          </button>
        )}
        {isChecked && (
          <div className={`mt-4 p-3 rounded-xl text-sm border ${isCorrect ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"} text-foreground`}>
            <strong>{isCorrect ? "✓ Correct! " : `✗ This builds ${INGREDIENT_LABELS[card.ingredient].label}. `}</strong>{card.explanation}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          <ChevronLeft size={16}/> Previous
        </button>
        {current < POLICY_MATCHES.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors">
            Next Policy <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>

      <NavButtons onBack={onBack} onNext={allChecked ? onComplete : undefined} nextDisabled={!allChecked} nextLabel="Mark Complete ✓" />
      {!allChecked && <p className="text-xs text-center text-muted-foreground mt-2">Check your answer on each policy to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Reading the Data (FRED)
// ─────────────────────────────────────────────
function FredChartStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [showGrowth, setShowGrowth] = useState(false);
  const [tooltip, setTooltip] = useState<{ year: number; val: number; x: number } | null>(null);

  const q = FREDPC_QUESTIONS[questionIdx];
  const selected = answers[questionIdx];
  const isChecked = checked[questionIdx];
  const isCorrect = selected === q.answer;
  const allChecked = FREDPC_QUESTIONS.every((_, i) => checked[i]);

  const W = 600, H = 200, PAD = { top: 10, right: 15, bottom: 28, left: 52 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  // Level chart
  const levels = FRED_GDPPC;
  const minYr = levels[0][0], maxYr = levels[levels.length-1][0];
  const maxLevel = Math.max(...levels.map(d => d[1]));
  function xL(yr: number) { return PAD.left + ((yr - minYr) / (maxYr - minYr)) * chartW; }
  function yL(v: number)  { return PAD.top + chartH - (v / maxLevel) * chartH; }
  const levelPath = levels.map(([yr, v], i) => `${i===0?"M":"L"}${xL(yr).toFixed(1)},${yL(v).toFixed(1)}`).join(" ");

  // Growth rate chart
  const growths = FRED_GDPPC_GROWTH;
  const minGr = -5, maxGr = 13;
  function yG(v: number) { return PAD.top + chartH - ((v - minGr) / (maxGr - minGr)) * chartH; }
  const growthPath = growths.map(([yr, v], i) => `${i===0?"M":"L"}${xL(yr).toFixed(1)},${yG(v).toFixed(1)}`).join(" ");
  const zeroY = yG(0);
  const twoY  = yG(2);

  const recBands = [
    [1948,1949],[1953,1954],[1957,1958],[1960,1961],[1969,1971],
    [1973,1975],[1980,1981],[1982,1983],[1990,1991],[2001,2002],[2007,2009],[2019.9,2020.8]
  ];

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / rect.width * W;
    const yr = Math.round(minYr + ((rawX - PAD.left) / chartW) * (maxYr - minYr));
    if (showGrowth) {
      const entry = growths.find(d => d[0] === yr);
      if (entry) setTooltip({ year: yr, val: entry[1], x: xL(yr) });
    } else {
      const entry = levels.find(d => d[0] === yr);
      if (entry) setTooltip({ year: yr, val: entry[1], x: xL(yr) });
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Reading the Data — GDP per Capita</h2>
        <p className="text-sm text-muted-foreground">78 years of U.S. real GDP per capita from FRED. Toggle between level and growth rate views. Hover to explore.</p>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm text-foreground">
            {showGrowth ? "Annual Growth Rate (%) — Real GDP per Capita" : "Real GDP per Capita — 2017 Dollars (1947–2025)"}
          </h3>
          <button onClick={() => { setShowGrowth(v => !v); setTooltip(null); }}
            className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-semibold hover:bg-primary/20 transition-all">
            {showGrowth ? "Show Level" : "Show Growth Rate"}
          </button>
        </div>
        <div className="relative" onMouseLeave={() => setTooltip(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseMove={handleMouseMove} style={{ cursor: "crosshair" }} role="img" aria-label="Interactive data chart. Hover to explore data points.">
            {recBands.map(([s, e], i) => (
              <rect key={i} x={xL(s as number)} y={PAD.top} width={Math.max(2, xL(e as number) - xL(s as number))} height={chartH} fill="rgba(156,163,175,0.15)" />
            ))}
            {showGrowth ? (
              <>
                {[-4,-2,0,2,4,6,8,10,12].map(v => {
                  const y = yG(v);
                  if (y < PAD.top - 2 || y > PAD.top + chartH + 2) return null;
                  return (
                    <g key={v}>
                      <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="currentColor" strokeOpacity={v===0?0.3:0.07} strokeWidth={v===0?1.5:1}/>
                      <text x={PAD.left-4} y={y+4} textAnchor="end" fontSize={9} fill="currentColor" fillOpacity={0.4}>{v}%</text>
                    </g>
                  );
                })}
                <line x1={PAD.left} y1={twoY} x2={W-PAD.right} y2={twoY} stroke="#22c55e" strokeOpacity={0.4} strokeWidth={1} strokeDasharray="4,3"/>
                <path d={growthPath} fill="none" stroke="hsl(38 95% 50%)" strokeWidth={1.5}/>
              </>
            ) : (
              <>
                {[0,15000,30000,45000,60000,75000].map(v => {
                  const y = yL(v);
                  if (y < PAD.top - 2 || y > PAD.top + chartH + 2) return null;
                  return (
                    <g key={v}>
                      <line x1={PAD.left} y1={y} x2={W-PAD.right} y2={y} stroke="currentColor" strokeOpacity={0.07} strokeWidth={1}/>
                      <text x={PAD.left-4} y={y+4} textAnchor="end" fontSize={9} fill="currentColor" fillOpacity={0.4}>
                        {v===0?"$0":`$${v/1000}K`}
                      </text>
                    </g>
                  );
                })}
                <path d={levelPath} fill="none" stroke="hsl(38 95% 50%)" strokeWidth={2}/>
              </>
            )}
            {[1950,1960,1970,1980,1990,2000,2010,2020].map(yr => (
              <text key={yr} x={xL(yr)} y={H-6} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.4}>{yr}</text>
            ))}
            {tooltip && <line x1={tooltip.x} y1={PAD.top} x2={tooltip.x} y2={PAD.top+chartH} stroke="white" strokeOpacity={0.3} strokeWidth={1} strokeDasharray="3,3"/>}
          </svg>
          {tooltip && (
            <div className={`absolute top-2 bg-card border border-card-border rounded-lg p-2 text-xs shadow-md pointer-events-none ${tooltip.year > 1985 ? "left-2" : "right-2"}`}>
              <div className="font-bold text-foreground mb-1">{tooltip.year}</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"/>
                {showGrowth ? <><strong>{tooltip.val.toFixed(1)}%</strong> growth</> : <><strong>${(tooltip.val/1000).toFixed(1)}K</strong>/capita</>}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-5 mt-1 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-primary inline-block rounded"/> {showGrowth ? "Annual Growth %" : "Real GDP/Capita (2017 $)"}</span>
          {showGrowth && <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 border-t border-dashed border-emerald-500 inline-block"/> 2% trend</span>}
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block bg-gray-200 dark:bg-gray-700 rounded-sm border border-gray-300 dark:border-gray-600"/> Recession</span>
        </div>
      </div>

      {/* Questions */}
      <div className="flex gap-1.5 mb-4">
        {FREDPC_QUESTIONS.map((_, i) => (
          <button key={i} onClick={() => setQuestionIdx(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === questionIdx ? "bg-primary" :
              checked[i] ? (answers[i] === FREDPC_QUESTIONS[i].answer ? "bg-emerald-400" : "bg-red-400") :
              answers[i] !== undefined ? "bg-primary/40" : "bg-muted"
            }`} />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-5 mb-4">
        <span className="text-xs font-semibold text-muted-foreground">Question {questionIdx + 1} of {FREDPC_QUESTIONS.length}</span>
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
                <span className="font-semibold mr-2">{String.fromCharCode(65+i)}.</span>{opt}
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
        {questionIdx < FREDPC_QUESTIONS.length - 1 ? (
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
// Station: Productivity & Living Standards
// ─────────────────────────────────────────────
function ProductivityStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const allChecked = PRODUCTIVITY_REVEALS.every((_, i) => checked[i]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Productivity & Living Standards</h2>
        <p className="text-sm text-muted-foreground">Each statement below makes a claim about productivity and growth. Read it carefully, then reveal the explanation.</p>
      </div>

      <div className="flex gap-1.5 mb-5">
        {PRODUCTIVITY_REVEALS.map((_, i) => (
          <div key={i} className={`flex-1 h-2 rounded-full transition-all ${checked[i] ? "bg-emerald-400" : "bg-muted"}`} />
        ))}
      </div>

      <div className="space-y-3 mb-5">
        {PRODUCTIVITY_REVEALS.map((item, i) => (
          <div key={item.id} className="bg-card border border-card-border rounded-xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${checked[i] ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>
                  {checked[i] ? "✓" : i + 1}
                </span>
                <p className={`text-sm font-semibold leading-snug ${checked[i] ? "text-foreground" : "text-foreground"}`}>{item.claim}</p>
              </div>
            </div>
            {!checked[i] ? (
              <div className="px-4 pb-4">
                <button onClick={() => setChecked(prev => ({ ...prev, [i]: true }))} data-testid={`productivity-reveal-${i}`}
                  className="w-full py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-all">
                  Reveal Explanation
                </button>
              </div>
            ) : (
              <div className="px-4 pb-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs text-foreground leading-relaxed">
                  {item.explanation}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <NavButtons onBack={onBack} onNext={allChecked ? onComplete : undefined} nextDisabled={!allChecked} nextLabel="Mark Complete ✓" />
      {!allChecked && <p className="text-xs text-center text-muted-foreground mt-2">Reveal all {PRODUCTIVITY_REVEALS.length} explanations to mark complete ({Object.keys(checked).length}/{PRODUCTIVITY_REVEALS.length} revealed).</p>}
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
                  <span><span className="font-semibold mr-1">{String.fromCharCode(65+i)}.</span> {opt}</span>
                </button>
              );
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={isChecked} data-testid={`quiz-option-${i}`}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${isChecked ? optionStyle(i) + " cursor-default" : optionStyle(i)}`}>
                <span className="font-semibold mr-2">{String.fromCharCode(65+i)}.</span> {opt}
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
  0: { station: "rule70",       label: "Rule of 70" },
  1: { station: "ingredients",  label: "Four Ingredients" },
  2: { station: "convergence",  label: "Convergence Explorer" },
  3: { station: "ingredients",  label: "Four Ingredients" },
  4: { station: "fredchart",    label: "FRED Chart" },
  5: { station: "rule70",       label: "Rule of 70" },
  6: { station: "ingredients",  label: "Four Ingredients" },
  7: { station: "ingredients",  label: "Four Ingredients" },
  8: { station: "ingredients",  label: "Four Ingredients" },
  9: { station: "rule70",       label: "Rule of 70" },
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
          Review the stations linked below, then retake.
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
  if (typeof window !== 'undefined') { try { localStorage.setItem('econlab_done_ch7', 'true'); } catch(e) {} }
  const [reflection, setReflection] = useState("");
  const [studentName, setStudentName] = useState("");
  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
  const grade =
    score === 10 ? { label: "Excellent",   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-700", msg: "Perfect score! You've mastered the fundamentals of economic growth." } :
    score >= 8  ? { label: "Strong",       color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-700",    msg: "Solid understanding — review the questions you missed and you'll be set." } :
    score >= 6  ? { label: "Developing",   color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-700",  msg: "Good foundation. Revisit the Four Ingredients and Rule of 70 stations." } :
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
          <div className="font-semibold text-foreground mb-1">ECO 210 ECONLAB · Chapter 7: Economic Growth</div>
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
                + '<p style="color:#475569;margin:2px 0">Chapter 7: Economic Growth</p>'
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
        <p className="text-xs text-muted-foreground mb-3">In 2–3 sentences: What is one thing from today's lab that changed how you think about why some countries are rich and others aren't?</p>
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
        {station === "recap"       && <RecapStation onComplete={() => complete("recap")} onBack={() => go("intro")} />}
        {station === "rule70"      && <Rule70Station onComplete={() => complete("rule70")} onBack={() => go("intro")} />}
        {station === "ingredients" && <IngredientsStation onComplete={() => complete("ingredients")} onBack={() => go("intro")} />}
        {station === "convergence" && <ConvergenceStation onComplete={() => complete("convergence")} onBack={() => go("intro")} />}
        {station === "policies"    && <PoliciesStation onComplete={() => complete("policies")} onBack={() => go("intro")} />}
        {station === "fredchart"   && <FredChartStation onComplete={() => complete("fredchart")} onBack={() => go("intro")} />}
        {station === "productivity"&& <ProductivityStation onComplete={() => complete("productivity")} onBack={() => go("intro")} />}
        {station === "quiz"        && <QuizStation onNext={handleQuizComplete} onBack={() => go("intro")} />}
        {station === "not-yet"     && <NotYetStation score={quizScore} wrongIndices={wrongIndices} onRetake={() => go("quiz")} onGoToStation={go} />}
        {station === "results"     && <ResultsStation score={quizScore} results={quizResults} onRestart={() => { setQuizScore(0); setWrongIndices([]); setCompleted(new Set()); go("intro"); }} />}
            <div role="alert" aria-live="polite" className="sr-only" id="lab-feedback" />
    </main>
    </div>
  );
}
