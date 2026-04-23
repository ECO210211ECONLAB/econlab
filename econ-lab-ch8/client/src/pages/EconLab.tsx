import { useState, useRef } from "react";
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, Award, BarChart2, Users, Zap, BookOpen, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "recap" | "sorter" | "classifier" | "iceberg" | "lfpr" | "formula" | "nairu" | "fredchart" | "quiz" | "results" | "not-yet";

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const SORTER_PEOPLE = [
  { id: 1, name: "Marcus, 34", description: "Works 40 hrs/wk as a nurse. Got a promotion last month.", answer: "employed", hint: "Working for pay at any hours = employed." },
  { id: 2, name: "Priya, 22", description: "Just graduated. Sent out 15 résumés this week. Available to start Monday.", answer: "unemployed", hint: "Not working + actively searching + available = unemployed." },
  { id: 3, name: "Carl, 67", description: "Retired teacher. Enjoys gardening and watching the grandkids.", answer: "nilf", hint: "Retirees are not in the labor force." },
  { id: 4, name: "Sofia, 19", description: "Full-time college student. No job, not looking for one.", answer: "nilf", hint: "Full-time students not seeking work are not in the labor force." },
  { id: 5, name: "Devon, 28", description: "Lost his job 8 months ago. Gave up applying — nothing fits his skills.", answer: "nilf", hint: "Discouraged workers who stopped searching are not in the labor force. This is the hidden iceberg!" },
  { id: 6, name: "Amara, 41", description: "Helps run her family's restaurant 20+ hrs/wk. No paycheck — it's family business.", answer: "employed", hint: "15+ unpaid hours in a family business = employed by BLS rules." },
  { id: 7, name: "Tomás, 31", description: "Engineer on paid parental leave for 6 weeks.", answer: "employed", hint: "Temporarily absent (vacation, illness, parental leave) still counts as employed." },
  { id: 8, name: "Keisha, 26", description: "Has a part-time barista job but wants full-time work. Applies daily.", answer: "employed", hint: "She IS employed (working for pay). Though underemployed, the official count still marks her employed." },
  { id: 9, name: "Raj, 15", description: "Sophomore in high school. No job.", answer: "nilf", hint: "Under 16 years old: automatically not in the labor force." },
  { id: 10, name: "Linda, 45", description: "Laid off 3 weeks ago. Actively interviewing at two companies this week.", answer: "unemployed", hint: "On layoff + actively looking = unemployed." },
];

const CLASSIFIER_SCENARIOS = [
  { id: 1, scenario: "The economy enters a recession. A car dealership lays off 8 salespeople because nobody is buying.", answer: "cyclical", explanation: "This is cyclical — directly caused by an economic downturn reducing demand." },
  { id: 2, scenario: "A college grad quits her job at a marketing firm to look for a better one closer to home. She's job-hunting for 3 weeks.", answer: "frictional", explanation: "Normal job-switching transition. She's not unemployed due to the economy or a skills gap — just between jobs." },
  { id: 3, scenario: "A travel agent loses her job as online booking platforms replace traditional agencies entirely.", answer: "structural", explanation: "Technology permanently eliminated the role. This is structural — a skills mismatch between old and new economy." },
  { id: 4, scenario: "A factory worker is laid off when the plant closes during a broad recession, but the plant never reopens even after recovery.", answer: "structural", explanation: "Tricky — started as cyclical but became structural when the whole industry restructured. Structural wins." },
  { id: 5, scenario: "A software engineer takes 6 weeks between jobs to negotiate the best offer from three companies competing for her.", answer: "frictional", explanation: "Classic frictional — voluntary transition, no economic crisis, no skills gap. Short-term and healthy." },
  { id: 6, scenario: "An assembly line worker is replaced by a robotic welding arm. Similar jobs are disappearing across the industry.", answer: "structural", explanation: "Automation creating a permanent skills mismatch = structural unemployment." },
  { id: 7, scenario: "A hotel lays off 200 housekeepers during a nationwide economic slowdown when bookings drop 40%.", answer: "cyclical", explanation: "Directly tied to the business cycle downturn. Will likely recover when the economy does." },
  { id: 8, scenario: "A new college grad takes 5 weeks sending applications before landing her first job.", answer: "frictional", explanation: "New entrants searching for first jobs are the textbook definition of frictional unemployment." },
];

// multi: true means answers is number[] (multi-select), otherwise number (single)
const QUIZ_QUESTIONS: Array<{
  question: string;
  options: string[];
  answer: number | number[];
  multi?: boolean;
  explanation: string;
}> = [
  // ── Questions 1–5: standard single-select ──
  {
    question: "The official unemployment rate (U-3) measures:",
    options: [
      "Everyone without a job",
      "People without work who actively searched in the past 4 weeks and are available",
      "People without work plus discouraged workers",
      "Part-time workers who want full-time jobs",
    ],
    answer: 1,
    explanation: "U-3 counts only people who are jobless, actively looked in the past 4 weeks, AND are available now. It misses discouraged workers and the underemployed entirely."
  },
  {
    question: "Devon gave up job-searching after 8 months of rejection. He is officially counted as:",
    options: [
      "Unemployed",
      "Structurally unemployed",
      "Not in the labor force",
      "Cyclically unemployed",
    ],
    answer: 2,
    explanation: "Discouraged workers who've stopped actively searching fall out of the labor force completely and vanish from the official unemployment rate — that's the iceberg effect."
  },
  {
    question: "Why do recessions cause unemployment instead of just lower wages?",
    options: [
      "Workers are legally protected from wage cuts",
      "Wages are 'sticky downward' — firms find it easier to lay off than to cut pay",
      "The Federal Reserve prevents wage cuts",
      "Workers always prefer unemployment to pay cuts",
    ],
    answer: 1,
    explanation: "Wages are sticky downward due to minimum wage laws, efficiency wages, union contracts, and morale effects. A 10% pay cut feels worse than not getting a raise — so firms lay off instead of cutting pay."
  },
  {
    question: "An AI writing tool permanently replaces 500 legal document reviewers whose skills don't transfer to new tech jobs. This is:",
    options: [
      "Frictional unemployment",
      "Cyclical unemployment",
      "Structural unemployment",
      "Not unemployment at all",
    ],
    answer: 2,
    explanation: "Technology permanently eliminating a job category creates a skills mismatch = structural unemployment. It's not a short transition (frictional) or a business-cycle dip (cyclical) — the jobs are gone."
  },
  {
    question: "The NAIRU is sometimes called the economy's 'speed limit' because:",
    options: [
      "The government sets a maximum unemployment rate by law",
      "Pushing unemployment below it causes inflation to accelerate",
      "It prevents GDP from growing faster than 3% per year",
      "It is the maximum rate the Federal Reserve legally allows",
    ],
    answer: 1,
    explanation: "Below the NAIRU (~4.5–5.5% in the U.S.), employers bid up wages to attract scarce workers, feeding into higher prices. That's why the Fed raised rates when unemployment dropped below 4% in 2017–2019."
  },
  // ── Questions 6–8: harder single-select ──
  {
    question: "The U-6 rate is typically about double the U-3 rate. Which workers does U-6 include that U-3 misses?",
    options: [
      "Retirees who want to return to work",
      "Discouraged workers, marginally attached workers, and involuntary part-timers",
      "Workers earning below the poverty line",
      "Military personnel and prison inmates",
    ],
    answer: 1,
    explanation: "U-6 adds three hidden groups: discouraged workers (gave up searching), marginally attached workers (searched sometime in the past year but not recently), and involuntary part-timers (want full-time, stuck part-time). All are invisible to U-3."
  },
  {
    question: "In April 2020, U.S. unemployment jumped from 4.4% to 14.8% in a single month — the sharpest spike on record. What type of unemployment was this primarily?",
    options: [
      "Structural — businesses permanently automated millions of jobs",
      "Frictional — tens of millions of workers voluntarily left jobs to search for better ones",
      "Cyclical — the COVID lockdowns caused a sudden, massive collapse in demand for labor",
      "Natural rate — the economy was simply at its normal long-run equilibrium",
    ],
    answer: 2,
    explanation: "The COVID shock was a sudden demand collapse — businesses shut down or laid off workers not because of a structural shift in skills, but because the economy was forcibly stopped. Textbook cyclical unemployment, on a historic scale."
  },
  {
    question: "Which factor would most likely LOWER the natural rate of unemployment over time?",
    options: [
      "A large cohort of young workers entering the labor market simultaneously",
      "A significant increase in the minimum wage above the market equilibrium",
      "Widespread adoption of online job platforms like LinkedIn that speed up matching",
      "A major reduction in job retraining and education investment",
    ],
    answer: 2,
    explanation: "Better job-matching technology (LinkedIn, Indeed, etc.) shortens the frictional period — workers find jobs faster, reducing the natural rate. Young worker surges and high minimum wages tend to raise it; less retraining raises structural unemployment."
  },
  // ── Questions 9–10: multi-select (harder) ──
  {
    question: "Which of the following are legitimate reasons wages tend to be 'sticky downward'? Select ALL that apply.",
    options: [
      "Minimum wage laws prevent cuts below the legal floor",
      "Workers who receive pay cuts may shirk or quit, reducing firm productivity (efficiency wages)",
      "The Federal Reserve directly controls firm-level wage decisions",
      "Union contracts lock in wages for the contract period",
      "Cutting pay damages morale in ways a layoff of someone else does not",
    ],
    answer: [0, 1, 3, 4],
    multi: true,
    explanation: "Four real reasons: (1) minimum wage laws, (2) efficiency wage theory — cutting wages can backfire if your best workers leave or morale collapses, (3) union contracts, and (4) the asymmetry of morale — your coworker's layoff doesn't hurt you the same way your own pay cut does. The Fed does NOT set individual firm wages."
  },
  {
    question: "The U.S. unemployment rate has fluctuated dramatically over time but shows no long-run upward or downward trend despite major economic changes. Which of the following help explain why? Select ALL that apply.",
    options: [
      "An aging population means fewer young workers churning between jobs, which lowers the natural rate",
      "Better job-matching technology (internet, staffing firms) has offset factors that might raise unemployment",
      "The government manipulates the data to always show 4–6%",
      "Structural unemployment from technology is offset by new industries creating new jobs",
      "Globalization permanently eliminated all frictional unemployment by outsourcing mobile jobs",
    ],
    answer: [0, 1, 3],
    multi: true,
    explanation: "Three real forces keep unemployment from trending: (1) demographics — an aging workforce has fewer young job-hoppers, (2) better matching technology offsets upward pressure, and (3) creative destruction — technology destroys old jobs but creates new ones. The BLS data is real and methodologically consistent; globalization reduced some jobs but didn't eliminate frictional unemployment."
  },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function Header({ station, onStation, completed }: { station: Station; onStation: (s: Station) => void; completed: Set<Station> }) {
  const stations: { id: Station; label: string; icon: typeof BarChart2 }[] = [
    { id: "intro",      label: "Dashboard",    icon: BookOpen },
    { id: "recap",      label: "Ch7 Recap",    icon: BookOpen },
    { id: "sorter",     label: "Who Counts?",  icon: Users },
    { id: "classifier", label: "3 Types",      icon: BarChart2 },
    { id: "iceberg",    label: "Iceberg",      icon: Zap },
    { id: "lfpr",       label: "LFPR",         icon: BarChart2 },
    { id: "formula",    label: "Formula Lab",  icon: Zap },
    { id: "nairu",      label: "Speed Limit",  icon: Zap },
    { id: "fredchart",  label: "FRED Chart",   icon: BarChart2 },
    { id: "quiz",       label: "Quiz",         icon: Award },
  ];

  const stationOrder: Station[] = ["intro", "recap", "sorter", "classifier", "iceberg", "lfpr", "formula", "nairu", "fredchart", "quiz", "results", "not-yet"];
  const currentIdx = stationOrder.indexOf(station);
  const contentStations: Station[] = ["recap","sorter","classifier","iceberg","lfpr","formula","nairu","fredchart"];
  const allStationsDone = contentStations.every(s => completed.has(s));

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
            <div className="font-display font-semibold text-sm leading-none text-sidebar-foreground">ECO 210 ECONLAB</div>
            <div className="text-xs text-sidebar-foreground/80 leading-none mt-0.5">Chapter 8</div>
          </div>
        </div>

        {/* Back to Hub */}
        <a href="https://www.perplexity.ai/computer/a/eco-210-econlab-course-hub-JgrfOPjHQ5iSYovw19FfIg" target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-sidebar-foreground/80 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-sidebar-accent shrink-0">
          ← Course Hub <span className="sr-only">(opens in new tab)</span>
        </a>

        {/* Progress dots — desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {stations.map((s, i) => {
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
const CH8_SUMMARY = [
  {
    section: "8.1 How Economists Define and Compute Unemployment Rate",
    body: "Unemployment imposes high costs. Unemployed individuals experience loss of income and stress. An economy with high unemployment suffers an opportunity cost of unused resources. We can divide the adult population into those in the labor force and those out of the labor force. In turn, we divide those in the labor force into employed and unemployed. A person without a job must be willing and able to work and actively looking for work to be counted as unemployed; otherwise, a person without a job is counted as out of the labor force. Economists define the unemployment rate as the number of unemployed persons divided by the number of persons in the labor force (not the overall adult population). The Current Population Survey (CPS) conducted by the United States Census Bureau measures the percentage of the labor force that is unemployed. The establishment payroll survey by the Bureau of Labor Statistics measures the net change in jobs created for the month.",
  },
  {
    section: "8.2 Patterns of Unemployment",
    body: "The U.S. unemployment rate rises during periods of recession and depression, but falls back to the range of 4% to 6% when the economy is strong. The unemployment rate never falls to zero. Despite enormous growth in the size of the U.S. population and labor force in the twentieth century, along with other major trends like globalization and new technology, the unemployment rate shows no long-term rising trend.\n\nUnemployment rates differ by group: higher for African-Americans and Hispanic people than for White people; higher for less educated than more educated; higher for the young than the middle-aged. Women's unemployment rates used to be higher than men's, but in recent years men's and women's unemployment rates have been very similar. In recent years, unemployment rates in the United States have compared favorably with unemployment rates in most other high-income economies.",
  },
  {
    section: "8.3 What Causes Changes in Unemployment over the Short Run",
    body: "Cyclical unemployment rises and falls with the business cycle. In a labor market with flexible wages, wages will adjust in such a market so that quantity demanded of labor always equals the quantity supplied of labor at the equilibrium wage. Economists have proposed many theories for why wages might not be flexible, but instead may adjust only in a \"sticky\" way, especially when it comes to downward adjustments: implicit contracts, efficiency wage theory, adverse selection of wage cuts, insider-outsider model, and relative wage coordination.",
  },
  {
    section: "8.4 What Causes Changes in Unemployment over the Long Run",
    body: "The natural rate of unemployment is the rate of unemployment that the economic, social, and political forces in the economy would cause even when the economy is not in a recession. These factors include the frictional unemployment that occurs when people either choose to change jobs or are put out of work for a time by the shifts of a dynamic and changing economy. They also include any laws concerning conditions of hiring and firing that have the undesired side effect of discouraging job formation. They also include structural unemployment, which occurs when demand shifts permanently away from a certain type of job skill.",
  },
];

function SummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-card border border-card-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <div className="font-display font-bold text-base text-foreground">Chapter 8 Summary</div>
            <div className="text-xs text-muted-foreground mt-0.5">OpenStax Macroeconomics 3rd Edition</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground text-lg font-bold">&times;</button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {CH8_SUMMARY.map((item, i) => (
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
  { id: "recap",      title: "📚 Chapter 7 Recap",     desc: "5 quick questions from Chapter 7 — start here before new content" },
  { id: "sorter",     title: "Who Counts?",  desc: "Sort 10 real people into Employed / Unemployed / Not in Labor Force" },
  { id: "classifier", title: "3 Types",      desc: "Classify unemployment scenarios as frictional, structural, or cyclical" },
  { id: "iceberg",    title: "The Iceberg",  desc: "Discover how much unemployment the official rate misses" },
  { id: "lfpr",       title: "LFPR",         desc: "Explore the Labor Force Participation Rate and why it matters" },
  { id: "formula",    title: "Formula Lab",  desc: "Calculate the unemployment rate and LFPR — must solve all 3 problems", gated: true },
  { id: "nairu",      title: "Speed Limit",  desc: "Explore the NAIRU and what happens when you push past it" },
  { id: "fredchart",  title: "Reading the Data", desc: "Analyze 75+ years of U.S. unemployment data from FRED" },
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
        <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wide mb-4">Chapter 8</span>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Unemployment</h1>
        <p className="text-muted-foreground text-base">Measuring, Understanding, and Explaining Joblessness</p>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-foreground">
        💡 <strong>Key idea:</strong> The unemployment rate looks simple — but it hides more than it reveals. Complete all 8 stations in any order, then take the quiz.
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
// Station: Chapter 7 Recap
// ─────────────────────────────────────────────
const RECAP_QUESTIONS_7: Array<{
  question: string; options: string[]; answer: number | number[]; multi?: boolean; explanation: string;
}> = [
  {
    question: "An economy grows at 1.4% per year in real GDP per capita. Using the Rule of 70, how long will it take for the average living standard to double?",
    options: [
      "About 14 years",
      "About 30 years",
      "About 50 years",
      "About 70 years",
    ],
    answer: 2,
    explanation: "70 ÷ 1.4 = 50 years. At 1.4% growth — close to the U.S. post-2008 average — it takes half a century to double living standards. Compare to the 1950s at 2.5%: 70 ÷ 2.5 = 28 years. Small differences in growth rates have enormous long-run consequences.",
  },
  {
    question: "South Korea in 1960 had GDP per capita similar to Ghana. By 2023, South Korea was roughly 10× richer. What primarily explains South Korea's growth?",
    options: [
      "South Korea discovered significant oil and mineral reserves",
      "South Korea invested simultaneously in education, infrastructure, technology adoption, and strong institutions",
      "South Korea had favorable geography that reduced trade costs",
      "South Korea received extraordinary foreign aid from the United States",
    ],
    answer: 1,
    explanation: "South Korea's growth miracle is the textbook case of catch-up convergence through all four growth ingredients firing simultaneously: universal education (human capital), heavy investment in infrastructure and industry (physical capital), technology licensing (technology), and strong rule of law (institutions). All four working together is rare — and explains the extraordinary outcome.",
  },
  {
    question: "A government invests $10 billion in a nationwide high-speed internet network. Which growth ingredient does this primarily build?",
    options: [
      "Human capital — workers will be better trained once connected",
      "Physical capital — new infrastructure raises productive capacity for every business and household",
      "Institutions — reliable infrastructure signals government competence",
      "Technology — the internet itself is a new production method",
    ],
    answer: 1,
    explanation: "The internet network is physical capital — a durable asset that workers and firms use to produce more output. What flows over the network (knowledge, services) is technology, but the network itself is physical capital, just as highways and electricity grids were in the 20th century.",
  },
  {
    question: "Which of the following correctly describe why institutions matter for economic growth? Select ALL that apply.",
    options: [
      "Secure property rights encourage investment by protecting returns",
      "Reliable contract enforcement reduces the cost and risk of doing business",
      "Strong institutions automatically guarantee rapid catch-up growth",
      "Corruption acts as an unpredictable tax on investment that discourages capital formation",
    ],
    answer: [0, 1, 3],
    multi: true,
    explanation: "Three are correct: property rights (A), contract enforcement (B), and corruption reduction (D) all lower the cost and risk of investment. Option C is wrong — institutions are necessary but not sufficient. All four growth ingredients must work together.",
  },
  {
    question: "Real wages in the U.S. have roughly quadrupled since 1947. This is primarily because:",
    options: [
      "Union membership rose sharply, forcing employers to pay more",
      "The government set higher minimum wages every decade",
      "Each worker now produces far more output per hour due to better tools, skills, and knowledge",
      "Americans work significantly more hours per year than in 1947",
    ],
    answer: 2,
    explanation: "Productivity growth is the only sustainable source of real wage growth. Average U.S. work hours have slightly declined since 1947. The entire 4× improvement in real wages came from workers producing more per hour — better machines, higher skills, better processes.",
  },
];

function RecapStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({}); 
  const [checked, setChecked] = useState<Record<number, boolean>>({}); 
  const q = RECAP_QUESTIONS_7[current];
  const isChecked = checked[current];
  const allChecked = RECAP_QUESTIONS_7.every((_, i) => checked[i]);

  function hasSelection(qIdx: number): boolean {
    const given = answers[qIdx];
    if (RECAP_QUESTIONS_7[qIdx].multi) return Array.isArray(given) && (given as number[]).length > 0;
    return given !== undefined;
  }
  function isCorrectQ(qIdx: number): boolean {
    const question = RECAP_QUESTIONS_7[qIdx];
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
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300">📚 Start here — Chapter 7 Review</span>
        </div>
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Chapter 7 Recap: Economic Growth</h2>
        <p className="text-sm text-muted-foreground">5 questions using new scenarios from Chapter 7. Try these before starting Chapter 8 content — spaced retrieval improves retention.</p>
      </div>
      <div className="flex gap-2 mb-5">
        {RECAP_QUESTIONS_7.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`flex-1 h-2 rounded-full transition-all ${navDotStyle(i)}`} />
        ))}
      </div>
      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        {q.multi && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Select ALL that apply</span>
          </div>
        )}
        <span className="text-xs font-semibold text-muted-foreground">Question {current + 1} of {RECAP_QUESTIONS_7.length}</span>
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
        {current < RECAP_QUESTIONS_7.length - 1 ? (
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
// Station: Sorter
// ─────────────────────────────────────────────
type SorterCategory = "employed" | "unemployed" | "nilf" | null;

function SorterStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [answers, setAnswers] = useState<Record<number, SorterCategory>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const totalAnswered = Object.keys(answers).length;
  const totalCorrect = SORTER_PEOPLE.filter(p => answers[p.id] === p.answer).length;
  const allAnswered = totalAnswered === SORTER_PEOPLE.length;
  const allChecked = SORTER_PEOPLE.every(p => checked[p.id]);

  function handleAnswer(personId: number, category: SorterCategory) {
    if (checked[personId]) return;
    setAnswers(prev => ({ ...prev, [personId]: category }));
  }

  function handleCheck(personId: number) {
    if (!answers[personId]) return;
    setChecked(prev => ({ ...prev, [personId]: true }));
  }

  function handleReveal(personId: number) {
    setRevealed(prev => ({ ...prev, [personId]: true }));
  }

  const categories = [
    { id: "employed" as SorterCategory, label: "Employed", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800" },
    { id: "unemployed" as SorterCategory, label: "Unemployed", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800" },
    { id: "nilf" as SorterCategory, label: "Not in Labor Force", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-bold text-xl text-foreground">Who Counts? The Sorting Challenge</h2>
          <span className="text-sm font-semibold text-muted-foreground">{totalAnswered}/10 sorted</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          For each person, pick their BLS labor market category. Then hit <strong>Check</strong> to see if you're right.
        </p>
        <div className="flex gap-4 text-xs">
          {categories.map(c => (
            <span key={c.id} className={`px-2.5 py-1 rounded-full border font-semibold ${c.bg} ${c.color}`}>{c.label}</span>
          ))}
        </div>
      </div>

      {allAnswered && (
        <div className="mb-6 p-4 rounded-xl bg-card border border-card-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-display font-bold text-foreground">{totalCorrect}/10</span>
            <div>
              <div className="font-semibold text-sm text-foreground">
                {totalCorrect === 10 ? "Perfect! 🎉" : totalCorrect >= 7 ? "Great work!" : totalCorrect >= 5 ? "Good start!" : "Keep reviewing!"}
              </div>
              <div className="text-xs text-muted-foreground">Review any misses below</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {SORTER_PEOPLE.map(person => {
          const selected = answers[person.id];
          const isChecked = checked[person.id];
          const isCorrect = selected === person.answer;
          const isRevealed = revealed[person.id];

          return (
            <div key={person.id} className={`bg-card border rounded-xl p-4 transition-all ${
              isChecked
                ? isCorrect ? "border-emerald-300 dark:border-emerald-700" : "border-red-300 dark:border-red-700"
                : "border-card-border"
            }`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="font-semibold text-foreground">{person.name}</span>
                  <p className="text-sm text-muted-foreground mt-0.5">{person.description}</p>
                </div>
                {isChecked && (
                  <span className="shrink-0 mt-0.5">
                    {isCorrect ? <CheckCircle size={20} className="text-emerald-500" /> : <XCircle size={20} className="text-red-500" />}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleAnswer(person.id, cat.id)}
                    disabled={isChecked}
                    data-testid={`sorter-${person.id}-${cat.id}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selected === cat.id
                        ? isChecked
                          ? isCorrect ? "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/50 dark:border-emerald-600 dark:text-emerald-200" : "bg-red-100 border-red-300 text-red-800 dark:bg-red-900/50 dark:border-red-600 dark:text-red-200"
                          : `${cat.bg} ${cat.color} scale-105`
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    } disabled:cursor-default`}
                  >
                    {cat.label}
                  </button>
                ))}

                {!isChecked && selected && (
                  <button
                    onClick={() => handleCheck(person.id)}
                    data-testid={`check-${person.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all ml-auto"
                  >
                    Check ✓
                  </button>
                )}

                {isChecked && !isCorrect && !isRevealed && (
                  <button onClick={() => handleReveal(person.id)} className="text-xs text-primary underline ml-2">
                    Why?
                  </button>
                )}
              </div>

              {isChecked && !isCorrect && isRevealed && (
                <div className="mt-2 p-2.5 rounded-lg bg-primary/10 text-xs text-foreground border border-primary/20">
                  <strong>Correct: {categories.find(c => c.id === person.answer)?.label}. </strong>
                  {person.hint}
                </div>
              )}
              {isChecked && isCorrect && isRevealed && (
                <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-xs text-foreground border border-emerald-200 dark:border-emerald-800">
                  ✓ {person.hint}
                </div>
              )}
              {isChecked && isCorrect && !isRevealed && (
                <button onClick={() => handleReveal(person.id)} className="text-xs text-primary underline mt-1 block">
                  Why is this right?
                </button>
              )}
            </div>
          );
        })}
      </div>

      <NavButtons onBack={onBack} onNext={allChecked ? onComplete : undefined} nextDisabled={!allChecked} nextLabel="Mark Complete ✓" />
      {allAnswered && !allChecked && <p className="text-xs text-center text-muted-foreground mt-2">Check your answer on each person to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Type Classifier
// ─────────────────────────────────────────────
function ClassifierStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [currentCard, setCurrentCard] = useState(0);

  const allDone = CLASSIFIER_SCENARIOS.every(s => checked[s.id]);
  const correct = CLASSIFIER_SCENARIOS.filter(s => answers[s.id] === s.answer).length;

  const typeColors: Record<string, string> = {
    frictional: "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-200",
    structural: "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/40 dark:border-purple-700 dark:text-purple-200",
    cyclical: "bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900/40 dark:border-orange-700 dark:text-orange-200",
  };

  const types = [
    { id: "frictional", label: "Frictional", desc: "Normal job transitions" },
    { id: "structural", label: "Structural", desc: "Skills mismatch" },
    { id: "cyclical", label: "Cyclical", desc: "Business cycle downturns" },
  ];

  const scenario = CLASSIFIER_SCENARIOS[currentCard];
  const selected = answers[scenario.id];
  const isChecked = checked[scenario.id];
  const isCorrect = selected === scenario.answer;

  function handleSelect(type: string) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [scenario.id]: type }));
  }

  function handleCheck() {
    if (!selected) return;
    setChecked(prev => ({ ...prev, [scenario.id]: true }));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">The 3 Types of Unemployment</h2>
        <p className="text-sm text-muted-foreground">Read each scenario and classify it. {CLASSIFIER_SCENARIOS.length} scenarios total.</p>
      </div>

      {/* Type reference */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {types.map(t => (
          <div key={t.id} className={`p-3 rounded-lg border text-center ${typeColors[t.id]}`}>
            <div className="font-semibold text-xs">{t.label}</div>
            <div className="text-xs opacity-75 mt-0.5">{t.desc}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        {CLASSIFIER_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrentCard(i)}
            data-testid={`classifier-card-${i}`}
            className={`w-7 h-7 rounded-full text-xs font-bold transition-all border ${
              i === currentCard
                ? "bg-primary text-primary-foreground border-primary"
                : checked[s.id]
                ? answers[s.id] === s.answer
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-red-400 text-white border-red-400"
                : "bg-muted text-muted-foreground border-border hover:bg-accent"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">{Object.keys(checked).length}/{CLASSIFIER_SCENARIOS.length} done</span>
      </div>

      {/* Card */}
      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        <p className="text-base text-foreground leading-relaxed mb-5">
          "{scenario.scenario}"
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              disabled={isChecked}
              data-testid={`classify-${scenario.id}-${t.id}`}
              className={`py-2.5 px-3 rounded-lg text-sm font-semibold border transition-all ${
                selected === t.id
                  ? isChecked
                    ? isCorrect ? "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/50 dark:border-emerald-600 dark:text-emerald-200" : "bg-red-100 border-red-300 text-red-800 dark:bg-red-900/50 dark:border-red-600 dark:text-red-200"
                    : `${typeColors[t.id]} scale-105`
                  : isChecked && t.id === scenario.answer
                  ? "ring-2 ring-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 text-emerald-800 dark:text-emerald-200"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:cursor-default"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!isChecked && selected && (
          <button onClick={handleCheck} data-testid={`check-classify-${scenario.id}`} className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all">
            Check Answer
          </button>
        )}

        {isChecked && (
          <div className={`p-3 rounded-lg text-sm ${isCorrect ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-foreground" : "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-foreground"}`}>
            {isCorrect ? "✓ Correct! " : `✗ The answer is ${scenario.answer}. `}
            {scenario.explanation}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentCard(Math.max(0, currentCard - 1))}
          disabled={currentCard === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16}/> Prev
        </button>
        {allDone ? (
          <span className="text-sm font-semibold text-foreground">{correct}/{CLASSIFIER_SCENARIOS.length} correct</span>
        ) : (
          <span className="text-xs text-muted-foreground">Card {currentCard + 1} of {CLASSIFIER_SCENARIOS.length}</span>
        )}
        <button
          onClick={() => setCurrentCard(Math.min(CLASSIFIER_SCENARIOS.length - 1, currentCard + 1))}
          disabled={currentCard === CLASSIFIER_SCENARIOS.length - 1}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          Next <ChevronRight size={16}/>
        </button>
      </div>

      <NavButtons onBack={onBack} onNext={allDone ? onComplete : undefined} nextDisabled={!allDone} nextLabel="Mark Complete ✓" />
      {!allDone && <p className="text-xs text-center text-muted-foreground mt-2">Check your answer on each scenario to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Iceberg (U-3 vs U-6)
// ─────────────────────────────────────────────
function IcebergStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());

  const groups = [
    { id: "employed", label: "Employed", count: 155.2, color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-300", pct: 59 },
    { id: "official-unemployed", label: "Officially Unemployed (U-3)", count: 6.9, color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-300", pct: 2.6 },
    { id: "discouraged", label: "Discouraged Workers", count: 0.5, color: "bg-orange-400", textColor: "text-orange-700 dark:text-orange-300", pct: 0.2 },
    { id: "marginally-attached", label: "Marginally Attached", count: 1.2, color: "bg-red-400", textColor: "text-red-700 dark:text-red-300", pct: 0.5 },
    { id: "part-time-involuntary", label: "Involuntary Part-Time", count: 4.3, color: "bg-rose-600", textColor: "text-rose-700 dark:text-rose-300", pct: 1.6 },
    { id: "nilf", label: "Not in Labor Force", count: 100.1, color: "bg-slate-400", textColor: "text-slate-600 dark:text-slate-400", pct: 38.2 },
  ];

  const infos: Record<string, { title: string; body: string; visible: boolean }> = {
    employed: { title: "Employed (155.2M)", body: "Working for pay at any hours, unpaid family business (15+ hrs), or temporarily absent. They're in the labor force and NOT unemployed. This is most working-age Americans.", visible: true },
    "official-unemployed": { title: "Officially Unemployed — U-3 (6.9M)", body: "Jobless + actively searched in past 4 weeks + available now. This is the number you see in headlines. But it's just the visible tip of the iceberg.", visible: true },
    discouraged: { title: "Discouraged Workers (0.5M)", body: "Want work, are available, but have given up searching because they believe no jobs exist for them. They don't count in U-3 at all — they've fallen out of the labor force.", visible: false },
    "marginally-attached": { title: "Marginally Attached (1.2M)", body: "Want and are available for work, looked sometime in the past year — but not in the past 4 weeks (for reasons other than discouragement: child care, illness, etc.). Also excluded from U-3.", visible: false },
    "part-time-involuntary": { title: "Involuntary Part-Time (4.3M)", body: "Working part-time only because they can't find full-time work, or their hours were cut. They're counted as EMPLOYED in U-3, but are not fully employed. The U-6 rate captures them.", visible: false },
    nilf: { title: "Not in Labor Force (100.1M)", body: "Retirees, students, stay-at-home parents, and others not seeking work. Not in the labor force at all — not counted anywhere in unemployment statistics.", visible: true },
  };

  const hiddenGroups = ["discouraged", "marginally-attached", "part-time-involuntary"];
  const U3 = ((6.9 / (155.2 + 6.9)) * 100).toFixed(1);
  const U6 = (((6.9 + 0.5 + 1.2 + 4.3) / (155.2 + 6.9 + 0.5 + 1.2)) * 100).toFixed(1);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">The Iceberg Effect</h2>
        <p className="text-sm text-muted-foreground">The official unemployment rate only shows the tip. Click each group to reveal what's hidden below the surface.</p>
      </div>

      {/* Iceberg visual */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <div className="relative">
          {/* Water line */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-blue-300 dark:bg-blue-700" />
            <span className="text-xs text-blue-500 font-semibold whitespace-nowrap">Official Statistics Surface</span>
            <div className="flex-1 h-px bg-blue-300 dark:bg-blue-700" />
          </div>

          {/* Above water */}
          <div className="mb-1">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-semibold">Above the surface — what headlines show</p>
            <div className="space-y-2">
              {groups.filter(g => infos[g.id]?.visible).filter(g => g.id !== "nilf").map(g => (
                <button
                  key={g.id}
                  onClick={() => { setSelected(selected === g.id ? null : g.id); setSeen(prev => new Set([...prev, g.id])); }}
                  data-testid={`iceberg-${g.id}`}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${selected === g.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-accent/50"}`}
                >
                  <div className={`w-3 h-3 rounded-full shrink-0 ${g.color}`} />
                  <span className="text-sm font-medium text-foreground flex-1">{g.label}</span>
                  <span className="text-sm font-bold text-foreground">{g.count}M</span>
                </button>
              ))}
            </div>
          </div>

          {/* Below water */}
          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-semibold">Below the surface — hidden from headlines</p>
            <div className="space-y-2">
              {hiddenGroups.map(gId => {
                const g = groups.find(x => x.id === gId)!;
                return (
                  <button
                    key={g.id}
                    onClick={() => { setSelected(selected === g.id ? null : g.id); setSeen(prev => new Set([...prev, g.id])); }}
                    data-testid={`iceberg-${g.id}`}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${selected === g.id ? "border-primary bg-primary/5" : "border-dashed border-border hover:border-primary/40 hover:bg-accent/50"}`}
                  >
                    <div className={`w-3 h-3 rounded-full shrink-0 ${g.color}`} />
                    <span className="text-sm font-medium text-foreground flex-1">{g.label}</span>
                    <span className="text-sm font-bold text-foreground">{g.count}M</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NILF */}
          <div className="mt-4 pt-4 border-t border-border">
            {groups.filter(g => g.id === "nilf").map(g => (
              <button
                key={g.id}
                onClick={() => { setSelected(selected === g.id ? null : g.id); setSeen(prev => new Set([...prev, g.id])); }}
                data-testid={`iceberg-${g.id}`}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${selected === g.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-accent/50"}`}
              >
                <div className={`w-3 h-3 rounded-full shrink-0 ${g.color}`} />
                <span className="text-sm font-medium text-muted-foreground flex-1">{g.label}</span>
                <span className="text-sm font-bold text-muted-foreground">{g.count}M</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info panel */}
        {selected && (
          <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/25">
            <h3 className="font-semibold text-sm text-foreground mb-1">{infos[selected]?.title}</h3>
            <p className="text-sm text-muted-foreground">{infos[selected]?.body}</p>
          </div>
        )}
      </div>

      {/* U-3 vs U-6 comparison */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <h3 className="font-display font-semibold text-base text-foreground mb-3">U-3 vs U-6: The Full Picture</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-800 text-center">
            <div className="font-display text-3xl font-bold text-amber-700 dark:text-amber-400">{U3}%</div>
            <div className="font-semibold text-xs text-amber-800 dark:text-amber-300 mt-1">U-3 (Official)</div>
            <div className="text-xs text-muted-foreground mt-1">What headlines report</div>
          </div>
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-800 text-center">
            <div className="font-display text-3xl font-bold text-rose-700 dark:text-rose-400">{U6}%</div>
            <div className="font-semibold text-xs text-rose-800 dark:text-rose-300 mt-1">U-6 (Full Measure)</div>
            <div className="text-xs text-muted-foreground mt-1">Adds hidden unemployed</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          U-6 is typically ~<strong>double</strong> the official rate. It adds discouraged, marginally attached, and involuntary part-time workers.
        </p>
      </div>

      {(() => { const total = 4; const allSeen = seen.size >= total; return (<><NavButtons onBack={onBack} onNext={allSeen ? onComplete : undefined} nextDisabled={!allSeen} nextLabel="Mark Complete ✓" />{!allSeen && <p className="text-xs text-center text-muted-foreground mt-2">Click each group to explore it before marking complete ({seen.size}/{total} seen).</p>}</>); })()}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: LFPR
// ─────────────────────────────────────────────
const LFPR_SCENARIOS = [
  {
    id: "baseline",
    label: "Baseline Economy",
    population: 250,
    employed: 148,
    unemployed: 12,
    nilf: 90,
    context: "A typical mid-sized city with a healthy mix of workers, retirees, and students.",
  },
  {
    id: "aging",
    label: "Aging Population",
    population: 250,
    employed: 118,
    unemployed: 8,
    nilf: 124,
    context: "Many baby boomers have retired. Despite low unemployment, fewer people are working overall.",
  },
  {
    id: "recession",
    label: "Deep Recession",
    population: 250,
    employed: 115,
    unemployed: 28,
    nilf: 107,
    context: "A severe downturn. Many workers have given up searching and dropped out of the labor force.",
  },
  {
    id: "boom",
    label: "Economic Boom",
    population: 250,
    employed: 165,
    unemployed: 9,
    nilf: 76,
    context: "Strong growth has pulled stay-at-home parents and students back into the workforce.",
  },
];

function LFPRStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [scenarioId, setScenarioId] = useState("baseline");
  const [revealed, setRevealed] = useState(false);

  const sc = LFPR_SCENARIOS.find(s => s.id === scenarioId)!;
  const laborForce = sc.employed + sc.unemployed;
  const u3 = (sc.unemployed / laborForce) * 100;
  const lfpr = (laborForce / sc.population) * 100;

  // Bar chart proportions
  const empPct  = (sc.employed    / sc.population) * 100;
  const unempPct = (sc.unemployed / sc.population) * 100;
  const nilfPct  = (sc.nilf       / sc.population) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Labor Force Participation Rate</h2>
        <p className="text-sm text-muted-foreground">The unemployment rate only tells part of the story. The LFPR reveals how many working-age adults are actually engaged with the labor market.</p>
      </div>

      {/* Formula reveal */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <h3 className="font-semibold text-sm text-foreground mb-3">The Two Formulas</h3>
        <div className="grid gap-3">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Unemployment Rate (U-3)</div>
            <div className="font-mono text-sm text-foreground">
              U-3 = <span className="text-red-600 dark:text-red-400 font-bold">Unemployed</span> ÷ (<span className="text-red-600 dark:text-red-400 font-bold">Unemployed</span> + <span className="text-emerald-600 dark:text-emerald-400 font-bold">Employed</span>) × 100
            </div>
            <div className="text-xs text-muted-foreground mt-1">Denominator = Labor Force only (excludes NILF)</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Labor Force Participation Rate</div>
            <div className="font-mono text-sm text-foreground">
              LFPR = (<span className="text-red-600 dark:text-red-400 font-bold">Unemployed</span> + <span className="text-emerald-600 dark:text-emerald-400 font-bold">Employed</span>) ÷ <span className="text-blue-600 dark:text-blue-400 font-bold">Working-Age Population</span> × 100
            </div>
            <div className="text-xs text-muted-foreground mt-1">Denominator = ALL working-age adults (including NILF)</div>
          </div>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <h3 className="font-semibold text-sm text-foreground mb-3">Explore Scenarios</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {LFPR_SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => { setScenarioId(s.id); setRevealed(false); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                scenarioId === s.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground italic mb-4">{sc.context}</p>

        {/* Stacked population bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Working-Age Population: <strong className="text-foreground">{sc.population} people</strong></span>
          </div>
          <div className="flex h-8 rounded-lg overflow-hidden border border-border">
            <div
              className="bg-emerald-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
              style={{ width: `${empPct}%` }}
              title={`Employed: ${sc.employed}`}
            >
              {empPct > 12 ? sc.employed : ""}
            </div>
            <div
              className="bg-red-400 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
              style={{ width: `${unempPct}%` }}
              title={`Unemployed: ${sc.unemployed}`}
            >
              {unempPct > 6 ? sc.unemployed : ""}
            </div>
            <div
              className="bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-foreground text-xs font-bold transition-all duration-500"
              style={{ width: `${nilfPct}%` }}
              title={`NILF: ${sc.nilf}`}
            >
              {nilfPct > 8 ? sc.nilf : ""}
            </div>
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"/><span className="text-muted-foreground">Employed ({sc.employed})</span></span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block"/><span className="text-muted-foreground">Unemployed ({sc.unemployed})</span></span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-slate-300 dark:bg-slate-600 inline-block"/><span className="text-muted-foreground">NILF ({sc.nilf})</span></span>
          </div>
        </div>

        {/* Key insight callout */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs text-foreground">
          <strong>Notice:</strong> The labor force = Employed + Unemployed = <strong>{laborForce}</strong> people.
          NILF (<strong>{sc.nilf}</strong>) are <em>outside</em> the labor force — they don't affect U-3 at all,
          but they pull down the LFPR.
        </div>
      </div>

      {/* Try-it-yourself callout */}
      <div className="bg-secondary/30 border border-secondary/50 rounded-xl p-4 mb-5 flex items-start gap-3">
        <span className="text-xl shrink-0">✏️</span>
        <div>
          <p className="text-sm font-semibold text-foreground mb-0.5">Try it yourself first</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Using the formulas and numbers above, calculate both rates on paper or in your head <em>before</em> clicking Reveal.
            Pick a scenario, look at the counts, and work through the division. Then check — you'll remember it much better.
          </p>
        </div>
      </div>

      {/* Calculated rates */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-foreground">Check Your Work</h3>
          {!revealed && (
            <button
              onClick={() => setRevealed(true)}
              className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Reveal Answers
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted rounded-xl">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">U-3 Rate</div>
            {revealed ? (
              <>
                <div className="font-display text-3xl font-bold text-red-600 dark:text-red-400">{u3.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground mt-1">{sc.unemployed} ÷ {laborForce} × 100</div>
              </>
            ) : (
              <div className="font-display text-3xl font-bold text-muted-foreground">?</div>
            )}
          </div>
          <div className="text-center p-4 bg-muted rounded-xl">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">LFPR</div>
            {revealed ? (
              <>
                <div className="font-display text-3xl font-bold text-blue-600 dark:text-blue-400">{lfpr.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground mt-1">{laborForce} ÷ {sc.population} × 100</div>
              </>
            ) : (
              <div className="font-display text-3xl font-bold text-muted-foreground">?</div>
            )}
          </div>
        </div>

        {revealed && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-foreground">
            <strong>Key distinction:</strong> U-3 is {u3.toFixed(1)}% but LFPR is only {lfpr.toFixed(1)}%.
            A low unemployment rate can coexist with a low participation rate — that’s what makes LFPR so important for understanding the true health of the labor market.
          </div>
        )}
      </div>

      <NavButtons onBack={onBack} onNext={revealed ? onComplete : undefined} nextDisabled={!revealed} nextLabel="Mark Complete ✓" />
      {!revealed && <p className="text-xs text-center text-muted-foreground mt-2">Try calculating the rates yourself, then click Reveal Answers to mark complete.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Formula Lab
// ─────────────────────────────────────────────
const FORMULA_PROBLEMS = [
  {
    id: 1,
    context: "Millbrook is a small city. The BLS surveys 500 working-age residents and finds: 310 have jobs, 40 are actively job-searching and available, and 150 have given up looking or aren't interested in working.",
    employed: 310,
    unemployed: 40,
    nilf: 150,
    population: 500,
  },
  {
    id: 2,
    context: "Riverdale just went through a tech layoff wave. Of 800 working-age adults: 430 are employed, 95 lost their jobs and are actively searching, and 275 are out of the labor force (retirees, students, discouraged workers).",
    employed: 430,
    unemployed: 95,
    nilf: 275,
    population: 800,
  },
  {
    id: 3,
    context: "Sunridge is a retirement community. Of 600 working-age adults: 180 work full or part time, 15 are actively looking for work, and 405 are retired, caring for family, or otherwise not in the labor force.",
    employed: 180,
    unemployed: 15,
    nilf: 405,
    population: 600,
  },
];

type FormulaState = {
  u3Input: string;
  lfprInput: string;
  u3Attempts: number;   // 0=untried, 1=1 wrong, 2=hint shown, 3=answer shown
  lfprAttempts: number;
  u3Correct: boolean;
  lfprCorrect: boolean;
};

function FormulaLabStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [problemIdx, setProblemIdx] = useState(0);
  const [states, setStates] = useState<FormulaState[]>(
    FORMULA_PROBLEMS.map(() => ({ u3Input: "", lfprInput: "", u3Attempts: 0, lfprAttempts: 0, u3Correct: false, lfprCorrect: false }))
  );

  const prob = FORMULA_PROBLEMS[problemIdx];
  const state = states[problemIdx];
  const laborForce = prob.employed + prob.unemployed;
  const correctU3   = parseFloat(((prob.unemployed / laborForce) * 100).toFixed(1));
  const correctLFPR = parseFloat(((laborForce / prob.population) * 100).toFixed(1));

  function withinTolerance(input: string, correct: number): boolean {
    const val = parseFloat(input);
    return !isNaN(val) && Math.abs(val - correct) < 0.6;
  }

  const bothFilled = state.u3Input.trim() !== "" && state.lfprInput.trim() !== "";
  const bothDone = state.u3Correct && state.lfprCorrect;
  // Can submit if both fields filled and neither is locked correct yet
  const canCheck = bothFilled && !(state.u3Correct && state.lfprCorrect);

  function handleCheck() {
    const u3Right = withinTolerance(state.u3Input, correctU3);
    const lfprRight = withinTolerance(state.lfprInput, correctLFPR);
    setStates(prev => prev.map((s, i) => {
      if (i !== problemIdx) return s;
      return {
        ...s,
        u3Correct: u3Right,
        lfprCorrect: lfprRight,
        u3Attempts:   u3Right   ? s.u3Attempts   : s.u3Attempts + 1,
        lfprAttempts: lfprRight ? s.lfprAttempts : s.lfprAttempts + 1,
      };
    }));
  }

  function updateField(field: "u3Input" | "lfprInput", value: string) {
    // Don't allow editing a field that's already correct
    if (field === "u3Input"   && state.u3Correct)   return;
    if (field === "lfprInput" && state.lfprCorrect) return;
    setStates(prev => prev.map((s, i) =>
      i === problemIdx ? { ...s, [field]: value } : s
    ));
  }

  // Per-field feedback helpers
  function fieldStatus(isCorrect: boolean, attempts: number, correctVal: number): {
    color: string; msg: string | null; showAnswer: boolean;
  } {
    if (isCorrect) return { color: "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30", msg: null, showAnswer: false };
    if (attempts === 0) return { color: "border-border bg-background", msg: null, showAnswer: false };
    if (attempts === 1) return { color: "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30", msg: "Not quite — try again.", showAnswer: false };
    if (attempts === 2) return { color: "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30", msg: "Hint: make sure you're using the right denominator.", showAnswer: false };
    return { color: "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30", msg: `Answer: ${correctVal}%`, showAnswer: true };
  }

  const u3Status   = fieldStatus(state.u3Correct,   state.u3Attempts,   correctU3);
  const lfprStatus = fieldStatus(state.lfprCorrect, state.lfprAttempts, correctLFPR);

  const allSolved = states.every((s, i) => {
    const p = FORMULA_PROBLEMS[i];
    const lf = p.employed + p.unemployed;
    const cU3 = parseFloat(((p.unemployed / lf) * 100).toFixed(1));
    const cLFPR = parseFloat(((lf / p.population) * 100).toFixed(1));
    // Solved if both correct OR both have had answer revealed (3+ attempts)
    const u3Done   = s.u3Correct   || s.u3Attempts >= 3;
    const lfprDone = s.lfprCorrect || s.lfprAttempts >= 3;
    return u3Done && lfprDone;
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Formula Lab</h2>
        <p className="text-sm text-muted-foreground">Read each scenario and calculate the unemployment rate and LFPR yourself. <strong className="text-foreground">Round your answers to 1 decimal place</strong> (e.g., 7.3 not 7.333). Use the formula shown under each input box.</p>
      </div>

      {/* Problem tabs */}
      <div className="flex gap-2 mb-5">
        {FORMULA_PROBLEMS.map((p, i) => {
          const ps = states[i];
          const pp = FORMULA_PROBLEMS[i];
          const lf = pp.employed + pp.unemployed;
          const cu = parseFloat(((pp.unemployed / lf) * 100).toFixed(1));
          const cl = parseFloat(((lf / pp.population) * 100).toFixed(1));
          const solved = ps.checked && withinTolerance(ps.u3Input, cu) && withinTolerance(ps.lfprInput, cl);
          return (
            <button
              key={p.id}
              onClick={() => setProblemIdx(i)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                i === problemIdx
                  ? "bg-primary text-primary-foreground border-primary"
                  : solved
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent"
              }`}
            >
              {solved ? "✓ " : ""}Problem {p.id}
            </button>
          );
        })}
      </div>

      {/* Scenario */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <p className="text-sm text-foreground leading-relaxed mb-4">{prob.context}</p>

        {/* Visual breakdown */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Employed", value: prob.employed, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
            { label: "Unemployed", value: prob.unemployed, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30" },
            { label: "Not in Labor Force", value: prob.nilf, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-900/50" },
          ].map(item => (
            <div key={item.label} className={`text-center p-3 rounded-lg ${item.bg}`}>
              <div className={`font-display text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center">Working-Age Population: <strong className="text-foreground">{prob.population}</strong></div>
      </div>

      {/* Input area */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Your Calculations</h3>
        <div className="grid gap-5">

          {/* U-3 */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">Unemployment Rate (U-3) % <span className="normal-case font-normal">— round to 1 decimal</span></label>
            <div className="text-xs text-muted-foreground mb-2 font-mono">Unemployed ÷ (Unemployed + Employed) × 100</div>
            <div className="flex items-center gap-3">
              <input
                type="number" step="0.1" placeholder="e.g. 7.3"
                value={state.u3Input}
                onChange={e => updateField("u3Input", e.target.value)}
                disabled={state.u3Correct}
                className={`w-32 px-3 py-2 rounded-lg border text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground ${u3Status.color}`}
              />
              {state.u3Correct && <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ Correct</span>}
              {!state.u3Correct && state.u3Attempts >= 3 && <span className="text-sm font-semibold text-red-600 dark:text-red-400">✗ {correctU3}%</span>}
            </div>
            {!state.u3Correct && u3Status.msg && (
              <p className={`text-xs mt-1.5 font-medium ${state.u3Attempts >= 3 ? "text-red-600 dark:text-red-400" : state.u3Attempts === 2 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
                {state.u3Attempts === 2 ? "💡 Hint: make sure you're dividing by the labor force (Employed + Unemployed), not total population." : u3Status.msg}
              </p>
            )}
          </div>

          {/* LFPR */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">Labor Force Participation Rate (LFPR) % <span className="normal-case font-normal">— round to 1 decimal</span></label>
            <div className="text-xs text-muted-foreground mb-2 font-mono">(Employed + Unemployed) ÷ Working-Age Population × 100</div>
            <div className="flex items-center gap-3">
              <input
                type="number" step="0.1" placeholder="e.g. 70.0"
                value={state.lfprInput}
                onChange={e => updateField("lfprInput", e.target.value)}
                disabled={state.lfprCorrect}
                className={`w-32 px-3 py-2 rounded-lg border text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground ${lfprStatus.color}`}
              />
              {state.lfprCorrect && <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ Correct</span>}
              {!state.lfprCorrect && state.lfprAttempts >= 3 && <span className="text-sm font-semibold text-red-600 dark:text-red-400">✗ {correctLFPR}%</span>}
            </div>
            {!state.lfprCorrect && lfprStatus.msg && (
              <p className={`text-xs mt-1.5 font-medium ${state.lfprAttempts >= 3 ? "text-red-600 dark:text-red-400" : state.lfprAttempts === 2 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
                {state.lfprAttempts === 2 ? "💡 Hint: make sure you're dividing by total working-age population (including NILF), not just the labor force." : lfprStatus.msg}
              </p>
            )}
          </div>
        </div>

        {canCheck && !bothDone && (
          <button onClick={handleCheck} className="w-full mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all">
            Check My Answers
          </button>
        )}

        {bothDone && (
          <div className="mt-4 p-3 rounded-xl text-sm border bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
            <strong>✓ Both correct!</strong> Labor Force = {prob.employed} + {prob.unemployed} = {laborForce}. U-3 = {prob.unemployed}/{laborForce} = <strong>{correctU3}%</strong>. LFPR = {laborForce}/{prob.population} = <strong>{correctLFPR}%</strong>.
          </div>
        )}
      </div>

      {/* Problem navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setProblemIdx(Math.max(0, problemIdx - 1))}
          disabled={problemIdx === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16}/> Previous
        </button>
        {problemIdx < FORMULA_PROBLEMS.length - 1 ? (
          <button
            onClick={() => setProblemIdx(problemIdx + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors"
          >
            Next Problem <ChevronRight size={16}/>
          </button>
        ) : null}
      </div>

      <NavButtons
        onBack={onBack}
        onNext={onComplete}
        nextLabel="Mark Complete ✓"
        nextDisabled={!allSolved}
      />
      {!allSolved && (
        <p className="text-xs text-center text-muted-foreground mt-2">Solve all 3 problems correctly to mark complete.</p>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────
// FRED Data
// ─────────────────────────────────────────────
const FRED_UNEMPLOYMENT: [number,number,number][] = [[1948, 1, 3.4], [1948, 2, 3.8], [1948, 3, 4.0], [1948, 4, 3.9], [1948, 5, 3.5], [1948, 6, 3.6], [1948, 7, 3.6], [1948, 8, 3.9], [1948, 9, 3.8], [1948, 10, 3.7], [1948, 11, 3.8], [1948, 12, 4.0], [1949, 1, 4.3], [1949, 2, 4.7], [1949, 3, 5.0], [1949, 4, 5.3], [1949, 5, 6.1], [1949, 6, 6.2], [1949, 7, 6.7], [1949, 8, 6.8], [1949, 9, 6.6], [1949, 10, 7.9], [1949, 11, 6.4], [1949, 12, 6.6], [1950, 1, 6.5], [1950, 2, 6.4], [1950, 3, 6.3], [1950, 4, 5.8], [1950, 5, 5.5], [1950, 6, 5.4], [1950, 7, 5.0], [1950, 8, 4.5], [1950, 9, 4.4], [1950, 10, 4.2], [1950, 11, 4.2], [1950, 12, 4.3], [1951, 1, 3.7], [1951, 2, 3.4], [1951, 3, 3.4], [1951, 4, 3.1], [1951, 5, 3.0], [1951, 6, 3.2], [1951, 7, 3.1], [1951, 8, 3.1], [1951, 9, 3.3], [1951, 10, 3.5], [1951, 11, 3.5], [1951, 12, 3.1], [1952, 1, 3.2], [1952, 2, 3.1], [1952, 3, 2.9], [1952, 4, 2.9], [1952, 5, 3.0], [1952, 6, 3.0], [1952, 7, 3.2], [1952, 8, 3.4], [1952, 9, 3.1], [1952, 10, 3.0], [1952, 11, 2.8], [1952, 12, 2.7], [1953, 1, 2.9], [1953, 2, 2.6], [1953, 3, 2.6], [1953, 4, 2.7], [1953, 5, 2.5], [1953, 6, 2.5], [1953, 7, 2.6], [1953, 8, 2.7], [1953, 9, 2.9], [1953, 10, 3.1], [1953, 11, 3.5], [1953, 12, 4.5], [1954, 1, 4.9], [1954, 2, 5.2], [1954, 3, 5.7], [1954, 4, 5.9], [1954, 5, 5.9], [1954, 6, 5.6], [1954, 7, 5.8], [1954, 8, 6.0], [1954, 9, 6.1], [1954, 10, 5.7], [1954, 11, 5.3], [1954, 12, 5.0], [1955, 1, 4.9], [1955, 2, 4.7], [1955, 3, 4.6], [1955, 4, 4.7], [1955, 5, 4.3], [1955, 6, 4.2], [1955, 7, 4.0], [1955, 8, 4.2], [1955, 9, 4.1], [1955, 10, 4.3], [1955, 11, 4.2], [1955, 12, 4.2], [1956, 1, 4.0], [1956, 2, 3.9], [1956, 3, 4.2], [1956, 4, 4.0], [1956, 5, 4.3], [1956, 6, 4.3], [1956, 7, 4.4], [1956, 8, 4.1], [1956, 9, 3.9], [1956, 10, 3.9], [1956, 11, 4.3], [1956, 12, 4.2], [1957, 1, 4.2], [1957, 2, 3.9], [1957, 3, 3.7], [1957, 4, 3.9], [1957, 5, 4.1], [1957, 6, 4.3], [1957, 7, 4.2], [1957, 8, 4.1], [1957, 9, 4.4], [1957, 10, 4.5], [1957, 11, 5.1], [1957, 12, 5.2], [1958, 1, 5.8], [1958, 2, 6.4], [1958, 3, 6.7], [1958, 4, 7.4], [1958, 5, 7.4], [1958, 6, 7.3], [1958, 7, 7.5], [1958, 8, 7.4], [1958, 9, 7.1], [1958, 10, 6.7], [1958, 11, 6.2], [1958, 12, 6.2], [1959, 1, 6.0], [1959, 2, 5.9], [1959, 3, 5.6], [1959, 4, 5.2], [1959, 5, 5.1], [1959, 6, 5.0], [1959, 7, 5.1], [1959, 8, 5.2], [1959, 9, 5.5], [1959, 10, 5.7], [1959, 11, 5.8], [1959, 12, 5.3], [1960, 1, 5.2], [1960, 2, 4.8], [1960, 3, 5.4], [1960, 4, 5.2], [1960, 5, 5.1], [1960, 6, 5.4], [1960, 7, 5.5], [1960, 8, 5.6], [1960, 9, 5.5], [1960, 10, 6.1], [1960, 11, 6.1], [1960, 12, 6.6], [1961, 1, 6.6], [1961, 2, 6.9], [1961, 3, 6.9], [1961, 4, 7.0], [1961, 5, 7.1], [1961, 6, 6.9], [1961, 7, 7.0], [1961, 8, 6.6], [1961, 9, 6.7], [1961, 10, 6.5], [1961, 11, 6.1], [1961, 12, 6.0], [1962, 1, 5.8], [1962, 2, 5.5], [1962, 3, 5.6], [1962, 4, 5.6], [1962, 5, 5.5], [1962, 6, 5.5], [1962, 7, 5.4], [1962, 8, 5.7], [1962, 9, 5.6], [1962, 10, 5.4], [1962, 11, 5.7], [1962, 12, 5.5], [1963, 1, 5.7], [1963, 2, 5.9], [1963, 3, 5.7], [1963, 4, 5.7], [1963, 5, 5.9], [1963, 6, 5.6], [1963, 7, 5.6], [1963, 8, 5.4], [1963, 9, 5.5], [1963, 10, 5.5], [1963, 11, 5.7], [1963, 12, 5.5], [1964, 1, 5.6], [1964, 2, 5.4], [1964, 3, 5.4], [1964, 4, 5.3], [1964, 5, 5.1], [1964, 6, 5.2], [1964, 7, 4.9], [1964, 8, 5.0], [1964, 9, 5.1], [1964, 10, 5.1], [1964, 11, 4.8], [1964, 12, 5.0], [1965, 1, 4.9], [1965, 2, 5.1], [1965, 3, 4.7], [1965, 4, 4.8], [1965, 5, 4.6], [1965, 6, 4.6], [1965, 7, 4.4], [1965, 8, 4.4], [1965, 9, 4.3], [1965, 10, 4.2], [1965, 11, 4.1], [1965, 12, 4.0], [1966, 1, 4.0], [1966, 2, 3.8], [1966, 3, 3.8], [1966, 4, 3.8], [1966, 5, 3.9], [1966, 6, 3.8], [1966, 7, 3.8], [1966, 8, 3.8], [1966, 9, 3.7], [1966, 10, 3.7], [1966, 11, 3.6], [1966, 12, 3.8], [1967, 1, 3.9], [1967, 2, 3.8], [1967, 3, 3.8], [1967, 4, 3.8], [1967, 5, 3.8], [1967, 6, 3.9], [1967, 7, 3.8], [1967, 8, 3.8], [1967, 9, 3.8], [1967, 10, 4.0], [1967, 11, 3.9], [1967, 12, 3.8], [1968, 1, 3.7], [1968, 2, 3.8], [1968, 3, 3.7], [1968, 4, 3.5], [1968, 5, 3.5], [1968, 6, 3.7], [1968, 7, 3.7], [1968, 8, 3.5], [1968, 9, 3.4], [1968, 10, 3.4], [1968, 11, 3.4], [1968, 12, 3.4], [1969, 1, 3.4], [1969, 2, 3.4], [1969, 3, 3.4], [1969, 4, 3.4], [1969, 5, 3.4], [1969, 6, 3.5], [1969, 7, 3.5], [1969, 8, 3.5], [1969, 9, 3.7], [1969, 10, 3.7], [1969, 11, 3.5], [1969, 12, 3.5], [1970, 1, 3.9], [1970, 2, 4.2], [1970, 3, 4.4], [1970, 4, 4.6], [1970, 5, 4.8], [1970, 6, 4.9], [1970, 7, 5.0], [1970, 8, 5.1], [1970, 9, 5.4], [1970, 10, 5.5], [1970, 11, 5.9], [1970, 12, 6.1], [1971, 1, 5.9], [1971, 2, 5.9], [1971, 3, 6.0], [1971, 4, 5.9], [1971, 5, 5.9], [1971, 6, 5.9], [1971, 7, 6.0], [1971, 8, 6.1], [1971, 9, 6.0], [1971, 10, 5.8], [1971, 11, 6.0], [1971, 12, 6.0], [1972, 1, 5.8], [1972, 2, 5.7], [1972, 3, 5.8], [1972, 4, 5.7], [1972, 5, 5.7], [1972, 6, 5.7], [1972, 7, 5.6], [1972, 8, 5.6], [1972, 9, 5.5], [1972, 10, 5.6], [1972, 11, 5.3], [1972, 12, 5.2], [1973, 1, 4.9], [1973, 2, 5.0], [1973, 3, 4.9], [1973, 4, 5.0], [1973, 5, 4.9], [1973, 6, 4.9], [1973, 7, 4.8], [1973, 8, 4.8], [1973, 9, 4.8], [1973, 10, 4.6], [1973, 11, 4.8], [1973, 12, 4.9], [1974, 1, 5.1], [1974, 2, 5.2], [1974, 3, 5.1], [1974, 4, 5.1], [1974, 5, 5.1], [1974, 6, 5.4], [1974, 7, 5.5], [1974, 8, 5.5], [1974, 9, 5.9], [1974, 10, 6.0], [1974, 11, 6.6], [1974, 12, 7.2], [1975, 1, 8.1], [1975, 2, 8.1], [1975, 3, 8.6], [1975, 4, 8.8], [1975, 5, 9.0], [1975, 6, 8.8], [1975, 7, 8.6], [1975, 8, 8.4], [1975, 9, 8.4], [1975, 10, 8.4], [1975, 11, 8.3], [1975, 12, 8.2], [1976, 1, 7.9], [1976, 2, 7.7], [1976, 3, 7.6], [1976, 4, 7.7], [1976, 5, 7.4], [1976, 6, 7.6], [1976, 7, 7.8], [1976, 8, 7.8], [1976, 9, 7.6], [1976, 10, 7.7], [1976, 11, 7.8], [1976, 12, 7.8], [1977, 1, 7.5], [1977, 2, 7.6], [1977, 3, 7.4], [1977, 4, 7.2], [1977, 5, 7.0], [1977, 6, 7.2], [1977, 7, 6.9], [1977, 8, 7.0], [1977, 9, 6.8], [1977, 10, 6.8], [1977, 11, 6.8], [1977, 12, 6.4], [1978, 1, 6.4], [1978, 2, 6.3], [1978, 3, 6.3], [1978, 4, 6.1], [1978, 5, 6.0], [1978, 6, 5.9], [1978, 7, 6.2], [1978, 8, 5.9], [1978, 9, 6.0], [1978, 10, 5.8], [1978, 11, 5.9], [1978, 12, 6.0], [1979, 1, 5.9], [1979, 2, 5.9], [1979, 3, 5.8], [1979, 4, 5.8], [1979, 5, 5.6], [1979, 6, 5.7], [1979, 7, 5.7], [1979, 8, 6.0], [1979, 9, 5.9], [1979, 10, 6.0], [1979, 11, 5.9], [1979, 12, 6.0], [1980, 1, 6.3], [1980, 2, 6.3], [1980, 3, 6.3], [1980, 4, 6.9], [1980, 5, 7.5], [1980, 6, 7.6], [1980, 7, 7.8], [1980, 8, 7.7], [1980, 9, 7.5], [1980, 10, 7.5], [1980, 11, 7.5], [1980, 12, 7.2], [1981, 1, 7.5], [1981, 2, 7.4], [1981, 3, 7.4], [1981, 4, 7.2], [1981, 5, 7.5], [1981, 6, 7.5], [1981, 7, 7.2], [1981, 8, 7.4], [1981, 9, 7.6], [1981, 10, 7.9], [1981, 11, 8.3], [1981, 12, 8.5], [1982, 1, 8.6], [1982, 2, 8.9], [1982, 3, 9.0], [1982, 4, 9.3], [1982, 5, 9.4], [1982, 6, 9.6], [1982, 7, 9.8], [1982, 8, 9.8], [1982, 9, 10.1], [1982, 10, 10.4], [1982, 11, 10.8], [1982, 12, 10.8], [1983, 1, 10.4], [1983, 2, 10.4], [1983, 3, 10.3], [1983, 4, 10.2], [1983, 5, 10.1], [1983, 6, 10.1], [1983, 7, 9.4], [1983, 8, 9.5], [1983, 9, 9.2], [1983, 10, 8.8], [1983, 11, 8.5], [1983, 12, 8.3], [1984, 1, 8.0], [1984, 2, 7.8], [1984, 3, 7.8], [1984, 4, 7.7], [1984, 5, 7.4], [1984, 6, 7.2], [1984, 7, 7.5], [1984, 8, 7.5], [1984, 9, 7.3], [1984, 10, 7.4], [1984, 11, 7.2], [1984, 12, 7.3], [1985, 1, 7.3], [1985, 2, 7.2], [1985, 3, 7.2], [1985, 4, 7.3], [1985, 5, 7.2], [1985, 6, 7.4], [1985, 7, 7.4], [1985, 8, 7.1], [1985, 9, 7.1], [1985, 10, 7.1], [1985, 11, 7.0], [1985, 12, 7.0], [1986, 1, 6.7], [1986, 2, 7.2], [1986, 3, 7.2], [1986, 4, 7.1], [1986, 5, 7.2], [1986, 6, 7.2], [1986, 7, 7.0], [1986, 8, 6.9], [1986, 9, 7.0], [1986, 10, 7.0], [1986, 11, 6.9], [1986, 12, 6.6], [1987, 1, 6.6], [1987, 2, 6.6], [1987, 3, 6.6], [1987, 4, 6.3], [1987, 5, 6.3], [1987, 6, 6.2], [1987, 7, 6.1], [1987, 8, 6.0], [1987, 9, 5.9], [1987, 10, 6.0], [1987, 11, 5.8], [1987, 12, 5.7], [1988, 1, 5.7], [1988, 2, 5.7], [1988, 3, 5.7], [1988, 4, 5.4], [1988, 5, 5.6], [1988, 6, 5.4], [1988, 7, 5.4], [1988, 8, 5.6], [1988, 9, 5.4], [1988, 10, 5.4], [1988, 11, 5.3], [1988, 12, 5.3], [1989, 1, 5.4], [1989, 2, 5.2], [1989, 3, 5.0], [1989, 4, 5.2], [1989, 5, 5.2], [1989, 6, 5.3], [1989, 7, 5.2], [1989, 8, 5.2], [1989, 9, 5.3], [1989, 10, 5.3], [1989, 11, 5.4], [1989, 12, 5.4], [1990, 1, 5.4], [1990, 2, 5.3], [1990, 3, 5.2], [1990, 4, 5.4], [1990, 5, 5.4], [1990, 6, 5.2], [1990, 7, 5.5], [1990, 8, 5.7], [1990, 9, 5.9], [1990, 10, 5.9], [1990, 11, 6.2], [1990, 12, 6.3], [1991, 1, 6.4], [1991, 2, 6.6], [1991, 3, 6.8], [1991, 4, 6.7], [1991, 5, 6.9], [1991, 6, 6.9], [1991, 7, 6.8], [1991, 8, 6.9], [1991, 9, 6.9], [1991, 10, 7.0], [1991, 11, 7.0], [1991, 12, 7.3], [1992, 1, 7.3], [1992, 2, 7.4], [1992, 3, 7.4], [1992, 4, 7.4], [1992, 5, 7.6], [1992, 6, 7.8], [1992, 7, 7.7], [1992, 8, 7.6], [1992, 9, 7.6], [1992, 10, 7.3], [1992, 11, 7.4], [1992, 12, 7.4], [1993, 1, 7.3], [1993, 2, 7.1], [1993, 3, 7.0], [1993, 4, 7.1], [1993, 5, 7.1], [1993, 6, 7.0], [1993, 7, 6.9], [1993, 8, 6.8], [1993, 9, 6.7], [1993, 10, 6.8], [1993, 11, 6.6], [1993, 12, 6.5], [1994, 1, 6.6], [1994, 2, 6.6], [1994, 3, 6.5], [1994, 4, 6.4], [1994, 5, 6.1], [1994, 6, 6.1], [1994, 7, 6.1], [1994, 8, 6.0], [1994, 9, 5.9], [1994, 10, 5.8], [1994, 11, 5.6], [1994, 12, 5.5], [1995, 1, 5.6], [1995, 2, 5.4], [1995, 3, 5.4], [1995, 4, 5.8], [1995, 5, 5.6], [1995, 6, 5.6], [1995, 7, 5.7], [1995, 8, 5.7], [1995, 9, 5.6], [1995, 10, 5.5], [1995, 11, 5.6], [1995, 12, 5.6], [1996, 1, 5.6], [1996, 2, 5.5], [1996, 3, 5.5], [1996, 4, 5.6], [1996, 5, 5.6], [1996, 6, 5.3], [1996, 7, 5.5], [1996, 8, 5.1], [1996, 9, 5.2], [1996, 10, 5.2], [1996, 11, 5.4], [1996, 12, 5.4], [1997, 1, 5.3], [1997, 2, 5.2], [1997, 3, 5.2], [1997, 4, 5.1], [1997, 5, 4.9], [1997, 6, 5.0], [1997, 7, 4.9], [1997, 8, 4.8], [1997, 9, 4.9], [1997, 10, 4.7], [1997, 11, 4.6], [1997, 12, 4.7], [1998, 1, 4.6], [1998, 2, 4.6], [1998, 3, 4.7], [1998, 4, 4.3], [1998, 5, 4.4], [1998, 6, 4.5], [1998, 7, 4.5], [1998, 8, 4.5], [1998, 9, 4.6], [1998, 10, 4.5], [1998, 11, 4.4], [1998, 12, 4.4], [1999, 1, 4.3], [1999, 2, 4.4], [1999, 3, 4.2], [1999, 4, 4.3], [1999, 5, 4.2], [1999, 6, 4.3], [1999, 7, 4.3], [1999, 8, 4.2], [1999, 9, 4.2], [1999, 10, 4.1], [1999, 11, 4.1], [1999, 12, 4.0], [2000, 1, 4.0], [2000, 2, 4.1], [2000, 3, 4.0], [2000, 4, 3.8], [2000, 5, 4.0], [2000, 6, 4.0], [2000, 7, 4.0], [2000, 8, 4.1], [2000, 9, 3.9], [2000, 10, 3.9], [2000, 11, 3.9], [2000, 12, 3.9], [2001, 1, 4.2], [2001, 2, 4.2], [2001, 3, 4.3], [2001, 4, 4.4], [2001, 5, 4.3], [2001, 6, 4.5], [2001, 7, 4.6], [2001, 8, 4.9], [2001, 9, 5.0], [2001, 10, 5.3], [2001, 11, 5.5], [2001, 12, 5.7], [2002, 1, 5.7], [2002, 2, 5.7], [2002, 3, 5.7], [2002, 4, 5.9], [2002, 5, 5.8], [2002, 6, 5.8], [2002, 7, 5.8], [2002, 8, 5.7], [2002, 9, 5.7], [2002, 10, 5.7], [2002, 11, 5.9], [2002, 12, 6.0], [2003, 1, 5.8], [2003, 2, 5.9], [2003, 3, 5.9], [2003, 4, 6.0], [2003, 5, 6.1], [2003, 6, 6.3], [2003, 7, 6.2], [2003, 8, 6.1], [2003, 9, 6.1], [2003, 10, 6.0], [2003, 11, 5.8], [2003, 12, 5.7], [2004, 1, 5.7], [2004, 2, 5.6], [2004, 3, 5.8], [2004, 4, 5.6], [2004, 5, 5.6], [2004, 6, 5.6], [2004, 7, 5.5], [2004, 8, 5.4], [2004, 9, 5.4], [2004, 10, 5.5], [2004, 11, 5.4], [2004, 12, 5.4], [2005, 1, 5.3], [2005, 2, 5.4], [2005, 3, 5.2], [2005, 4, 5.2], [2005, 5, 5.1], [2005, 6, 5.0], [2005, 7, 5.0], [2005, 8, 4.9], [2005, 9, 5.0], [2005, 10, 5.0], [2005, 11, 5.0], [2005, 12, 4.9], [2006, 1, 4.7], [2006, 2, 4.8], [2006, 3, 4.7], [2006, 4, 4.7], [2006, 5, 4.6], [2006, 6, 4.6], [2006, 7, 4.7], [2006, 8, 4.7], [2006, 9, 4.5], [2006, 10, 4.4], [2006, 11, 4.5], [2006, 12, 4.4], [2007, 1, 4.6], [2007, 2, 4.5], [2007, 3, 4.4], [2007, 4, 4.5], [2007, 5, 4.4], [2007, 6, 4.6], [2007, 7, 4.7], [2007, 8, 4.6], [2007, 9, 4.7], [2007, 10, 4.7], [2007, 11, 4.7], [2007, 12, 5.0], [2008, 1, 5.0], [2008, 2, 4.9], [2008, 3, 5.1], [2008, 4, 5.0], [2008, 5, 5.4], [2008, 6, 5.6], [2008, 7, 5.8], [2008, 8, 6.1], [2008, 9, 6.1], [2008, 10, 6.5], [2008, 11, 6.8], [2008, 12, 7.3], [2009, 1, 7.8], [2009, 2, 8.3], [2009, 3, 8.7], [2009, 4, 9.0], [2009, 5, 9.4], [2009, 6, 9.5], [2009, 7, 9.5], [2009, 8, 9.6], [2009, 9, 9.8], [2009, 10, 10.0], [2009, 11, 9.9], [2009, 12, 9.9], [2010, 1, 9.8], [2010, 2, 9.8], [2010, 3, 9.9], [2010, 4, 9.9], [2010, 5, 9.6], [2010, 6, 9.4], [2010, 7, 9.4], [2010, 8, 9.5], [2010, 9, 9.5], [2010, 10, 9.4], [2010, 11, 9.8], [2010, 12, 9.3], [2011, 1, 9.1], [2011, 2, 9.0], [2011, 3, 9.0], [2011, 4, 9.1], [2011, 5, 9.0], [2011, 6, 9.1], [2011, 7, 9.0], [2011, 8, 9.0], [2011, 9, 9.0], [2011, 10, 8.8], [2011, 11, 8.6], [2011, 12, 8.5], [2012, 1, 8.3], [2012, 2, 8.3], [2012, 3, 8.2], [2012, 4, 8.2], [2012, 5, 8.2], [2012, 6, 8.2], [2012, 7, 8.2], [2012, 8, 8.1], [2012, 9, 7.8], [2012, 10, 7.8], [2012, 11, 7.7], [2012, 12, 7.9], [2013, 1, 8.0], [2013, 2, 7.7], [2013, 3, 7.5], [2013, 4, 7.6], [2013, 5, 7.5], [2013, 6, 7.5], [2013, 7, 7.3], [2013, 8, 7.2], [2013, 9, 7.2], [2013, 10, 7.2], [2013, 11, 6.9], [2013, 12, 6.7], [2014, 1, 6.6], [2014, 2, 6.7], [2014, 3, 6.7], [2014, 4, 6.2], [2014, 5, 6.3], [2014, 6, 6.1], [2014, 7, 6.2], [2014, 8, 6.1], [2014, 9, 5.9], [2014, 10, 5.7], [2014, 11, 5.8], [2014, 12, 5.6], [2015, 1, 5.7], [2015, 2, 5.5], [2015, 3, 5.4], [2015, 4, 5.4], [2015, 5, 5.6], [2015, 6, 5.3], [2015, 7, 5.2], [2015, 8, 5.1], [2015, 9, 5.0], [2015, 10, 5.0], [2015, 11, 5.1], [2015, 12, 5.0], [2016, 1, 4.8], [2016, 2, 4.9], [2016, 3, 5.0], [2016, 4, 5.1], [2016, 5, 4.8], [2016, 6, 4.9], [2016, 7, 4.8], [2016, 8, 4.9], [2016, 9, 5.0], [2016, 10, 4.9], [2016, 11, 4.7], [2016, 12, 4.7], [2017, 1, 4.7], [2017, 2, 4.6], [2017, 3, 4.4], [2017, 4, 4.4], [2017, 5, 4.4], [2017, 6, 4.3], [2017, 7, 4.3], [2017, 8, 4.4], [2017, 9, 4.3], [2017, 10, 4.2], [2017, 11, 4.2], [2017, 12, 4.1], [2018, 1, 4.0], [2018, 2, 4.1], [2018, 3, 4.0], [2018, 4, 4.0], [2018, 5, 3.8], [2018, 6, 4.0], [2018, 7, 3.8], [2018, 8, 3.8], [2018, 9, 3.7], [2018, 10, 3.8], [2018, 11, 3.8], [2018, 12, 3.9], [2019, 1, 4.0], [2019, 2, 3.8], [2019, 3, 3.8], [2019, 4, 3.7], [2019, 5, 3.6], [2019, 6, 3.6], [2019, 7, 3.7], [2019, 8, 3.6], [2019, 9, 3.5], [2019, 10, 3.6], [2019, 11, 3.6], [2019, 12, 3.6], [2020, 1, 3.6], [2020, 2, 3.5], [2020, 3, 4.4], [2020, 4, 14.8], [2020, 5, 13.2], [2020, 6, 11.0], [2020, 7, 10.2], [2020, 8, 8.4], [2020, 9, 7.8], [2020, 10, 6.9], [2020, 11, 6.7], [2020, 12, 6.7], [2021, 1, 6.4], [2021, 2, 6.2], [2021, 3, 6.1], [2021, 4, 6.1], [2021, 5, 5.8], [2021, 6, 5.9], [2021, 7, 5.4], [2021, 8, 5.1], [2021, 9, 4.7], [2021, 10, 4.5], [2021, 11, 4.1], [2021, 12, 3.9], [2022, 1, 4.0], [2022, 2, 3.9], [2022, 3, 3.7], [2022, 4, 3.7], [2022, 5, 3.6], [2022, 6, 3.6], [2022, 7, 3.5], [2022, 8, 3.6], [2022, 9, 3.5], [2022, 10, 3.6], [2022, 11, 3.6], [2022, 12, 3.5], [2023, 1, 3.5], [2023, 2, 3.6], [2023, 3, 3.5], [2023, 4, 3.4], [2023, 5, 3.6], [2023, 6, 3.6], [2023, 7, 3.5], [2023, 8, 3.7], [2023, 9, 3.7], [2023, 10, 3.9], [2023, 11, 3.7], [2023, 12, 3.8], [2024, 1, 3.7], [2024, 2, 3.9], [2024, 3, 3.9], [2024, 4, 3.9], [2024, 5, 3.9], [2024, 6, 4.1], [2024, 7, 4.2], [2024, 8, 4.2], [2024, 9, 4.1], [2024, 10, 4.1], [2024, 11, 4.2], [2024, 12, 4.1], [2025, 1, 4.0], [2025, 2, 4.2], [2025, 3, 4.2], [2025, 4, 4.2], [2025, 5, 4.3], [2025, 6, 4.1], [2025, 7, 4.3], [2025, 8, 4.3], [2025, 9, 4.4], [2025, 11, 4.5], [2025, 12, 4.4], [2026, 1, 4.3], [2026, 2, 4.4], [2026, 3, 4.3]]; // [year, month, rate]

const NBER_RECESSIONS: [number,number,number,number][] = [
  [1948,10,1949,10],[1953,7,1954,5],[1957,8,1958,4],[1960,4,1961,2],
  [1969,12,1970,11],[1973,11,1975,3],[1980,1,1980,7],[1981,7,1982,11],
  [1990,7,1991,3],[2001,3,2001,11],[2007,12,2009,6],[2020,2,2020,4],
];

const UNEMP_QUESTIONS = [
  {
    id: 1,
    question: "The unemployment rate peaked at 14.8% in April 2020. What type of unemployment does this primarily represent?",
    options: [
      "Structural — workers' skills no longer matched available jobs",
      "Frictional — workers voluntarily between jobs during the pandemic",
      "Cyclical — a sudden collapse in demand caused mass layoffs during COVID lockdowns",
      "Seasonal — normal fluctuation tied to the spring hiring cycle",
    ],
    answer: 2,
    explanation: "The COVID spike was almost entirely cyclical unemployment — the economy shut down suddenly, demand collapsed, and employers laid off millions. Skills were not the issue (structural) and workers were not voluntarily leaving (frictional). It resolved quickly once the economy reopened, which is characteristic of cyclical unemployment.",
  },
  {
    id: 2,
    question: "The unemployment rate tends to rise quickly during recessions but fall slowly during recoveries. What best explains this asymmetry?",
    options: [
      "Employers hire faster than they fire due to training costs",
      "Sticky wages and rehiring lags mean employers expand cautiously; layoffs are quick decisions",
      "The BLS changes its survey methodology during recessions",
      "Discouraged workers re-enter the labor force faster than jobs are created",
    ],
    answer: 1,
    explanation: "Layoffs are immediate decisions. Rehiring involves uncertainty about whether demand will last, training costs, and adjustment lags. This asymmetry — fast up, slow down — is well-documented and is one reason recessions cause lasting damage even after 'recovery' begins.",
  },
  {
    id: 3,
    question: "During 2010–2019 (the post-Great Recession expansion), unemployment fell from about 10% to 3.5%. What does the chart suggest about this period?",
    options: [
      "The fastest unemployment decline ever recorded",
      "A gradual, sustained improvement over nearly a decade — the longest expansion on record",
      "Unemployment fell because discouraged workers stopped looking, reducing the measured rate",
      "The improvement stalled around 5% due to structural unemployment floors",
    ],
    answer: 1,
    explanation: "The 2009–2020 expansion lasted 128 months — the longest in U.S. history. Unemployment fell from 10% to 3.5% at a gradual pace, reflecting a slow but real labor market recovery. The chart shows this as a long, steady decline rather than a sharp drop.",
  },
  {
    id: 4,
    question: "What is the approximate 'natural rate' of unemployment (NAIRU) that the U.S. economy gravitates toward during healthy expansions?",
    options: [
      "0–1% — the economy should aim for nearly zero unemployment",
      "4–5% — a combination of frictional and structural unemployment always exists",
      "8–10% — recessions push rates above this sustainable floor",
      "15–20% — representing workers who are permanently outside the labor market",
    ],
    answer: 1,
    explanation: "Even in healthy economies, frictional unemployment (workers between jobs) and structural unemployment (skills mismatch) keep the rate above zero. The U.S. NAIRU is estimated at about 4–5%. The 2019 rate of 3.5% was actually below NAIRU, suggesting an exceptionally tight labor market.",
  },
  {
    id: 5,
    question: "Looking at the full unemployment chart from 1948 to today, what is the most striking long-run pattern?",
    options: [
      "Unemployment has trended steadily upward as automation displaces workers",
      "Each recession produces a permanent increase in the baseline unemployment rate",
      "Unemployment fluctuates cyclically around a relatively stable long-run average of 5–6%",
      "Unemployment was higher before 1980 and has steadily declined since",
    ],
    answer: 2,
    explanation: "Despite 12 recessions, two wars, oil shocks, financial crises, and a pandemic, the U.S. unemployment rate has cycled around a relatively stable long-run average. There is no secular upward trend from automation, and each recession — even severe ones — has eventually been followed by recovery. This is one of the strongest empirical regularities in macroeconomics.",
  },
];

function UnempChartStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [tooltip, setTooltip] = useState<{ year: number; month: number; rate: number; x: number } | null>(null);

  const q = UNEMP_QUESTIONS[questionIdx];
  const selected = answers[questionIdx];
  const isChecked = checked[questionIdx];
  const isCorrect = selected === q.answer;
  const allChecked = UNEMP_QUESTIONS.every((_, i) => checked[i]);

  const W = 600, H = 200, PAD = { top: 10, right: 15, bottom: 28, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  // Convert to flat array with fractional year for x position
  const points = FRED_UNEMPLOYMENT.map(([yr, mo, rate]) => ({ fYear: yr + (mo - 1) / 12, rate }));
  const minYear = points[0].fYear, maxYear = points[points.length - 1].fYear;
  const maxRate = 16;

  function xScale(fy: number) { return PAD.left + ((fy - minYear) / (maxYear - minYear)) * chartW; }
  function yScale(v: number)  { return PAD.top + chartH - (v / maxRate) * chartH; }

  const pathD = points.map((p, i) => {
    const x = xScale(p.fYear).toFixed(1), y = yScale(p.rate).toFixed(1);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  // Recession bands as fractional years
  const recBands = NBER_RECESSIONS.map(([sy, sm, ey, em]) => ({
    x1: xScale(sy + (sm - 1) / 12), x2: xScale(ey + (em - 1) / 12)
  }));

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / rect.width * W;
    const fYear = minYear + ((rawX - PAD.left) / chartW) * (maxYear - minYear);
    // Find nearest point
    let nearest = points[0];
    let minDist = Infinity;
    let nearestData = FRED_UNEMPLOYMENT[0];
    FRED_UNEMPLOYMENT.forEach(([yr, mo, rate], i) => {
      const fy = yr + (mo - 1) / 12;
      const dist = Math.abs(fy - fYear);
      if (dist < minDist) { minDist = dist; nearest = points[i]; nearestData = FRED_UNEMPLOYMENT[i]; }
    });
    if (minDist < 2) {
      setTooltip({ year: nearestData[0], month: nearestData[1], rate: nearestData[2], x: xScale(nearest.fYear) });
    }
  }

  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">Reading the Data — Unemployment</h2>
        <p className="text-sm text-muted-foreground">75+ years of U.S. unemployment data from FRED. Hover over the chart to explore, then answer the questions.</p>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm text-foreground">U.S. Unemployment Rate — Monthly (1948–2026)</h3>
          <span className="text-xs text-muted-foreground">Source: FRED (BLS)</span>
        </div>
        <div className="relative" onMouseLeave={() => setTooltip(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseMove={handleMouseMove} style={{ cursor: "crosshair" }} role="img" aria-label="Interactive data chart. Hover to explore data points.">
            {recBands.map((r, i) => (
              <rect key={i} x={r.x1} y={PAD.top} width={Math.max(0, r.x2 - r.x1)} height={chartH} fill="rgba(156,163,175,0.15)" />
            ))}
            {[0, 2, 4, 6, 8, 10, 12, 14].map(v => {
              const y = yScale(v);
              return (
                <g key={v}>
                  <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="currentColor" strokeOpacity={0.07} strokeWidth={1} />
                  <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize={9} fill="currentColor" fillOpacity={0.4}>{v}%</text>
                </g>
              );
            })}
            {[1950,1960,1970,1980,1990,2000,2010,2020].map(yr => (
              <text key={yr} x={xScale(yr)} y={H - 6} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.4}>{yr}</text>
            ))}
            <path d={pathD} fill="none" stroke="hsl(38 95% 50%)" strokeWidth={1.5} />
            {tooltip && <line x1={tooltip.x} y1={PAD.top} x2={tooltip.x} y2={PAD.top + chartH} stroke="white" strokeOpacity={0.3} strokeWidth={1} strokeDasharray="3,3" />}
          </svg>
          {tooltip && (
            <div className={`absolute top-2 bg-card border border-card-border rounded-lg p-2 text-xs shadow-md pointer-events-none ${tooltip.year > 1985 ? "left-2" : "right-2"}`}>
              <div className="font-bold text-foreground mb-1">{MONTH_NAMES[tooltip.month - 1]} {tooltip.year}</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Rate: <strong>{tooltip.rate}%</strong></div>
            </div>
          )}
        </div>
        <div className="flex gap-5 mt-1 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-primary inline-block rounded" /> Unemployment Rate (%)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block bg-gray-200 dark:bg-gray-700 rounded-sm border border-gray-300 dark:border-gray-600" /> Recession</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-4">
        {UNEMP_QUESTIONS.map((_, i) => (
          <button key={i} onClick={() => setQuestionIdx(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === questionIdx ? "bg-primary" :
              checked[i] ? (answers[i] === UNEMP_QUESTIONS[i].answer ? "bg-emerald-400" : "bg-red-400") :
              answers[i] !== undefined ? "bg-primary/40" : "bg-muted"
            }`} />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-5 mb-4">
        <span className="text-xs font-semibold text-muted-foreground">Question {questionIdx + 1} of {UNEMP_QUESTIONS.length}</span>
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
        {questionIdx < UNEMP_QUESTIONS.length - 1 ? (
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
// Speedometer SVG component
// ─────────────────────────────────────────────
function Speedometer({ uRate }: { uRate: number }) {
  // Map uRate 2–10 onto needle angle: 2% = far right (+70°), 10% = far left (-70°)
  // Center (NAIRU ~5%) = 0°. Arc spans -70° to +70° from bottom-center.
  const MIN = 2, MAX = 10;
  const clamp = Math.min(MAX, Math.max(MIN, uRate));
  // Needle: 2% → hot (right side), 10% → cold (left side)
  // Map: 2→+65°, 10→-65° (reversed: lower uRate = more inflationary = right)
  const needleDeg = 65 - ((clamp - MIN) / (MAX - MIN)) * 130;
  // Convert to SVG arc path — gauge center at (100, 100), radius 72
  const cx = 100, cy = 98, r = 72;

  function polarToXY(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  // Build color arc segments: hot (red) → warm (orange) → green (NAIRU) → cool (blue) → cold (deep blue)
  const segments = [
    { start: -65, end: -30, color: "#3b82f6" },   // deep recession (cold/blue)
    { start: -30, end: -5,  color: "#f59e0b" },   // below full employment (amber)
    { start: -5,  end:  5,  color: "#22c55e" },   // NAIRU zone (green)
    { start:  5,  end:  35, color: "#f97316" },   // overheating (orange)
    { start:  35, end:  65, color: "#ef4444" },   // severely overheated (red)
  ];

  function arcPath(startDeg: number, endDeg: number, innerR: number, outerR: number) {
    const s1 = polarToXY(startDeg, outerR);
    const e1 = polarToXY(endDeg, outerR);
    const s2 = polarToXY(endDeg, innerR);
    const e2 = polarToXY(startDeg, innerR);
    const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    return `M ${s1.x} ${s1.y} A ${outerR} ${outerR} 0 ${large} 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y} Z`;
  }

  // Needle path
  const needleTip = polarToXY(needleDeg, 60);
  const needleLeft = polarToXY(needleDeg - 90, 6);
  const needleRight = polarToXY(needleDeg + 90, 6);

  // Zone label ticks
  const ticks = [
    { rate: 2, label: "2%" }, { rate: 3.5, label: "3.5%" },
    { rate: 5, label: "5%" }, { rate: 7, label: "7%" }, { rate: 10, label: "10%" }
  ];

  function rateToAngle(rate: number) {
    return 65 - ((rate - MIN) / (MAX - MIN)) * 130;
  }

  return (
    <svg viewBox="0 0 200 120" className="w-full max-w-xs mx-auto" aria-label="NAIRU speedometer">
      {/* Background */}
      <rect width="200" height="120" rx="12" fill="transparent" />

      {/* Arc segments */}
      {segments.map((seg, i) => (
        <path key={i} d={arcPath(seg.start, seg.end, 56, 78)} fill={seg.color} opacity="0.85" />
      ))}

      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={54} fill="white" className="dark:fill-gray-900" opacity="0.95" />

      {/* NAIRU zone tick mark */}
      {(() => {
        const nairuAngle = rateToAngle(5.0);
        const inner = polarToXY(nairuAngle, 55);
        const outer = polarToXY(nairuAngle, 80);
        return <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />;
      })()}

      {/* Rate tick labels */}
      {ticks.map(t => {
        const angle = rateToAngle(t.rate);
        const pos = polarToXY(angle, 87);
        return (
          <text key={t.rate} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="6" fill="currentColor" opacity="0.6" fontFamily="var(--font-sans)">
            {t.label}
          </text>
        );
      })}

      {/* Needle */}
      <polygon
        points={`${needleTip.x},${needleTip.y} ${needleLeft.x},${needleLeft.y} ${needleRight.x},${needleRight.y}`}
        fill="hsl(222 30% 20%)"
        className="dark:fill-gray-200"
        opacity="0.9"
      />
      {/* Needle center pivot */}
      <circle cx={cx} cy={cy} r={5} fill="hsl(38 95% 50%)" />
      <circle cx={cx} cy={cy} r={2.5} fill="hsl(222 30% 15%)" className="dark:fill-white" />

      {/* Zone labels inside */}
      <text x="30" y="105" textAnchor="middle" fontSize="5.5" fill="#3b82f6" fontFamily="var(--font-sans)" fontWeight="600">RECESSION</text>
      <text x="170" y="105" textAnchor="middle" fontSize="5.5" fill="#ef4444" fontFamily="var(--font-sans)" fontWeight="600">OVERHEATED</text>
      <text x={cx} y="88" textAnchor="middle" fontSize="5.5" fill="#16a34a" fontFamily="var(--font-sans)" fontWeight="700">NAIRU</text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// Station: NAIRU Speed Limit
// ─────────────────────────────────────────────
function NAIRUStation({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [uRate, setURate] = useState(5.0);
  const [sliderMoved, setSliderMoved] = useState(false);

  const nairu = 5.0;
  const diff = uRate - nairu;

  function getZone() {
    if (uRate > 7) return { label: "Deep Recession", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800", icon: "📉", desc: "Cyclical unemployment dominates. Businesses are cutting jobs. The Fed may cut rates to stimulate demand." };
    if (uRate > nairu + 0.5) return { label: "Below Full Employment", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800", icon: "📊", desc: "Labor market is slack. Wages are subdued. Workers have less bargaining power. Inflation pressure is low." };
    if (Math.abs(diff) <= 0.5) return { label: "Full Employment Zone (NAIRU)", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800", icon: "✅", desc: "The 'Goldilocks' zone. Only frictional and structural unemployment remain. Inflation is stable. This is the Fed's target." };
    if (uRate < 3.5) return { label: "Severely Overheated", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800", icon: "🔥", desc: "Extreme wage-price spiral. Employers are desperately bidding up wages. Inflation accelerates rapidly. The Fed is raising rates aggressively." };
    return { label: "Overheating — Inflation Risk", color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800", icon: "⚠️", desc: "Below NAIRU — employers compete for scarce workers, bidding up wages. This feeds into higher prices. The Fed monitors closely and may raise interest rates." };
  }

  const zone = getZone();

  const scenarios = [
    { rate: 3.5, label: "2019 peak", desc: "2019: Rate hit 3.5% — below NAIRU. Wages rose, but inflation stayed moderate, surprising many economists." },
    { rate: 4.2, label: "Nov 2021", desc: "Nov 2021: Still recovering from COVID. Rate falling fast, inflation surging. The Fed was slow to respond." },
    { rate: 14.8, label: "Apr 2020", desc: "April 2020: COVID shock. Largest single-month jump on record — 4.4% to 14.8% in 30 days." },
    { rate: 10.0, label: "2009 peak", desc: "Oct 2009: Great Recession peak. Years of elevated unemployment followed." },
    { rate: 5.0, label: "Natural rate", desc: "~5% NAIRU: The economy's speed limit. Below this, inflation tends to accelerate." },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground mb-1">The NAIRU: Economy's Speed Limit</h2>
        <p className="text-sm text-muted-foreground">Drag the slider to set the unemployment rate. Watch the gauge — and see what happens to the labor market and inflation.</p>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-5">
        {/* Gauge + rate side by side */}
        <div className="flex items-center gap-6 mb-5">
          <div className="flex-1">
            <Speedometer uRate={uRate} />
          </div>
          <div className="text-center shrink-0 w-32">
            <div className="font-display text-5xl font-bold text-foreground">{uRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground mt-1">Unemployment</div>
            <div className={`mt-2 text-xs font-bold px-2 py-1 rounded-full border ${zone.bg} ${zone.color}`}>{zone.icon} {zone.label}</div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative mb-2 px-2">
          <div className="relative h-8 flex items-center">
            <div className="absolute left-0 right-0 h-3 rounded-full overflow-hidden">
              <div className="h-full w-full" style={{
                background: "linear-gradient(to right, hsl(0 72% 50%), hsl(38 95% 55%), hsl(120 50% 45%), hsl(200 80% 55%), hsl(220 80% 50%))",
              }} />
            </div>
            <div
              className="absolute top-0 h-8 flex flex-col items-center pointer-events-none z-10"
              style={{ left: `${((10 - nairu) / (10 - 2)) * 100}%`, transform: "translateX(-50%)" }}
            >
              <div className="w-0.5 h-full bg-emerald-500/60" />
            </div>
            <input
              type="range" aria-label="Slider"
              min={2}
              max={10}
              step={0.1}
              value={uRate}
              onChange={e => { setURate(parseFloat(e.target.value)); setSliderMoved(true); }}
              data-testid="nairu-slider"
              className="relative w-full h-3 appearance-none bg-transparent cursor-pointer z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-card [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>← Hot (2%)</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">NAIRU ~5%</span>
            <span>Cold (10%) →</span>
          </div>
        </div>

        {/* Zone description */}
        <div className={`p-3 rounded-xl border mt-3 ${zone.bg}`}>
          <p className="text-sm text-foreground leading-relaxed">{zone.desc}</p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            {
              label: "Wage Pressure",
              value: uRate < nairu - 1 ? "Very High" : uRate < nairu ? "Elevated" : uRate < nairu + 1.5 ? "Moderate" : "Low",
              color: uRate < nairu - 1 ? "text-red-600 dark:text-red-400" : uRate < nairu ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
            },
            {
              label: "Inflation Risk",
              value: uRate < nairu - 1 ? "🔥 High" : uRate < nairu ? "⚠️ Rising" : uRate < nairu + 2 ? "✅ Stable" : "📉 Low",
              color: uRate < nairu - 1 ? "text-red-600 dark:text-red-400" : uRate < nairu ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400"
            },
            {
              label: "Fed Response",
              value: uRate < nairu - 1 ? "Raise Rates" : uRate < nairu ? "Watch Closely" : uRate > nairu + 2 ? "Cut Rates" : "Hold Steady",
              color: "text-foreground"
            }
          ].map(m => (
            <div key={m.label} className="text-center p-3 bg-muted rounded-lg">
              <div className={`text-xs font-bold ${m.color}`}>{m.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical scenarios */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <h3 className="font-semibold text-sm text-foreground mb-3">Try Historical Scenarios</h3>
        <div className="flex flex-wrap gap-2">
          {scenarios.map(s => (
            <button
              key={s.label}
              onClick={() => setURate(s.rate)}
              data-testid={`scenario-${s.rate}`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                Math.abs(uRate - s.rate) < 0.05
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {s.label}: {s.rate}%
            </button>
          ))}
        </div>
        {scenarios.find(s => Math.abs(uRate - s.rate) < 0.05) && (
          <p className="text-xs text-muted-foreground mt-3 italic">
            {scenarios.find(s => Math.abs(uRate - s.rate) < 0.05)?.desc}
          </p>
        )}
      </div>

      <div className="bg-secondary/20 border border-secondary/30 rounded-xl p-4 mb-5 text-sm text-foreground">
        <strong>Key takeaway:</strong> The NAIRU (~4.5–5.5% for the U.S.) acts as the economy's speed limit. Pushing unemployment below it doesn't make the economy better — it just creates inflation. The Fed aims to land right in the Goldilocks zone.
      </div>

      <NavButtons onBack={onBack} onNext={sliderMoved ? onComplete : undefined} nextDisabled={!sliderMoved} nextLabel="Mark Complete ✓" />
      {!sliderMoved && <p className="text-xs text-center text-muted-foreground mt-2">Explore the slider to see what happens at different unemployment rates.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station: Quiz
// ─────────────────────────────────────────────
function QuizStation({ onNext, onBack }: { onNext: (score: number, results: { correct: boolean; exp: string }[]) => void; onBack: () => void }) {
  const [questions] = useState(() =>
    shuffle(QUIZ_QUESTIONS).map(q => shuffleOpts({ ...q, options: q.options }))
  );
  const [currentQ, setCurrentQ] = useState(0);
  // answers: single-select stores number; multi-select stores number[]
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const q = QUIZ_QUESTIONS[currentQ];
  const isChecked = checked[currentQ];

  // ── helpers ──
  function isAnswerCorrect(qIdx: number): boolean {
    const question = QUIZ_QUESTIONS[qIdx];
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
    if (QUIZ_QUESTIONS[qIdx].multi) return Array.isArray(given) && (given as number[]).length > 0;
    return given !== undefined;
  }

  // ── single-select handler ──
  function handleSelect(idx: number) {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [currentQ]: idx }));
  }

  // ── multi-select toggle ──
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
  // ── per-option styling helpers ──
  const isCorrectForQ = isChecked && isAnswerCorrect(currentQ);

  function optionStyle(i: number): string {
    const correctAnswers = q.multi ? (q.answer as number[]) : [q.answer as number];
    const userAnswer = answers[currentQ];
    const userSelected = q.multi
      ? (Array.isArray(userAnswer) ? (userAnswer as number[]).includes(i) : false)
      : userAnswer === i;
    const isInCorrectSet = correctAnswers.includes(i);

    if (!isChecked) {
      // pre-check state
      return userSelected
        ? "bg-primary/10 border-primary text-foreground"
        : "bg-muted hover:bg-accent hover:text-accent-foreground text-foreground border-border";
    }
    // post-check state
    if (isInCorrectSet) {
      // always highlight correct options green after check
      return "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-300 dark:ring-emerald-700";
    }
    if (userSelected && !isInCorrectSet) {
      // wrong selection
      return "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200";
    }
    return "bg-muted text-foreground border-border opacity-50";
  }

  // Progress dot color per question
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
          <span className="text-sm font-semibold text-muted-foreground">Q {currentQ + 1} / {QUIZ_QUESTIONS.length}</span>
        </div>
        <p className="text-sm text-muted-foreground">Screenshot your final score to submit to your instructor.</p>
      </div>

      {/* Q progress bar */}
      <div className="flex gap-2 mb-6">
        {QUIZ_QUESTIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            data-testid={`quiz-nav-${i}`}
            className={`flex-1 h-2 rounded-full transition-all ${navDotStyle(i)}`}
          />
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-4">
        {/* Multi-select label */}
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
              // Checkbox style
              return (
                <button
                  key={i}
                  onClick={() => handleToggle(i)}
                  disabled={isChecked}
                  data-testid={`quiz-option-${i}`}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-start gap-3 ${
                    isChecked ? optionStyle(i) + " cursor-default" : optionStyle(i)
                  }`}
                >
                  <span className={`shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected ? "bg-primary border-primary" : "border-current opacity-50"
                  }`}>
                    {isSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span><span className="font-semibold mr-1">{String.fromCharCode(65 + i)}.</span> {opt}</span>
                </button>
              );
            }

            // Single-select (original radio style)
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={isChecked}
                data-testid={`quiz-option-${i}`}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  isChecked ? optionStyle(i) + " cursor-default" : optionStyle(i)
                }`}
              >
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
          <div className={`mt-4 p-3 rounded-xl text-sm ${
            isCorrectForQ
              ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-foreground"
              : "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-foreground"
          }`}>
            <strong>{isCorrectForQ ? "✓ Correct! " : "✗ Not quite. "}</strong>
            {q.explanation}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16}/> Previous
        </button>
        {currentQ < QUIZ_QUESTIONS.length - 1 ? (
          <button
            onClick={() => setCurrentQ(currentQ + 1)}
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-colors"
          >
            Next Question <ChevronRight size={16}/>
          </button>
        ) : allAnswered ? (
          <button
            onClick={handleSubmit}
            data-testid="quiz-submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
          >
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
// Maps quiz question indices to the station most relevant for review
const QUESTION_STATION_MAP: Record<number, { station: Station; label: string }> = {
  0: { station: "sorter",     label: "Who Counts?" },
  1: { station: "iceberg",    label: "Iceberg" },
  2: { station: "nairu",      label: "Speed Limit" },
  3: { station: "classifier", label: "3 Types" },
  4: { station: "nairu",      label: "Speed Limit" },
  5: { station: "iceberg",    label: "Iceberg" },
  6: { station: "classifier", label: "3 Types" },
  7: { station: "nairu",      label: "Speed Limit" },
  8: { station: "nairu",      label: "Speed Limit" },
  9: { station: "nairu",      label: "Speed Limit" },
};

function NotYetStation({
  score,
  wrongIndices,
  onRetake,
  onGoToStation,
}: {
  score: number;
  wrongIndices: number[];
  onRetake: () => void;
  onGoToStation: (s: Station) => void;
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

      {/* Review links */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
        <h3 className="font-semibold text-sm text-foreground mb-1">Questions to revisit</h3>
        <p className="text-xs text-muted-foreground mb-3">These questions tripped you up. Click a station to review, then come back and retake.</p>
        <div className="space-y-2">
          {wrongIndices.map(i => (
            <div key={i} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted">
              <div>
                <span className="text-xs font-bold text-muted-foreground">Q{i + 1} • </span>
                <span className="text-xs text-foreground">{QUIZ_QUESTIONS[i].question.substring(0, 70)}{QUIZ_QUESTIONS[i].question.length > 70 ? "…" : ""}</span>
              </div>
              <button
                onClick={() => onGoToStation(QUESTION_STATION_MAP[i].station)}
                className="shrink-0 text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                Review: {QUESTION_STATION_MAP[i].label}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">Review the stations above, then retake.</div>
        <button
          onClick={onRetake}
          data-testid="btn-retake"
          className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
        >
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
  if (typeof window !== 'undefined') { try { localStorage.setItem('econlab_done_ch8', 'true'); } catch(e) {} }
  const [reflection, setReflection] = useState("");
  const [studentName, setStudentName] = useState("");
  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  const grade =
    score === 10 ? { label: "Excellent",   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-700", msg: "Perfect score! You’ve mastered the core concepts of unemployment measurement." } :
    score >= 8  ? { label: "Strong",       color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-700",    msg: "Solid understanding — review the questions you missed and you’ll be set." } :
    score >= 6  ? { label: "Developing",   color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-700",  msg: "Good foundation. Revisit the sorting and classifier stations to sharpen your understanding." } :
                  { label: "Needs Review", color: "text-red-600 dark:text-red-400",      bg: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-700",          msg: "Go back through the interactive stations before the next class. Focus on the iceberg and NAIRU sections." };

  return (
    <div className="max-w-2xl mx-auto">

      {/* Score card — screenshot target */}
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
          <div className="font-semibold text-foreground mb-1">Econ Lab · Chapter 8: Unemployment</div>
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
                + '<p style="color:#475569;margin:2px 0">Chapter 8: Unemployment</p>'
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

      {/* Question review */}
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

      {/* Exit ticket */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-sm text-foreground mb-2">Exit Ticket (Optional)</h3>
        <p className="text-xs text-muted-foreground mb-3">In 2–3 sentences: What is one thing from today’s lab that surprised you or changed how you think about unemployment?</p>
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
        <button
          onClick={onRestart}
          data-testid="btn-restart"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw size={14} /> Start Over
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

  // Mark station complete and return to dashboard
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
        {station === "sorter"     && <SorterStation onComplete={() => complete("sorter")} onBack={() => go("intro")} />}
        {station === "classifier" && <ClassifierStation onComplete={() => complete("classifier")} onBack={() => go("intro")} />}
        {station === "iceberg"    && <IcebergStation onComplete={() => complete("iceberg")} onBack={() => go("intro")} />}
        {station === "lfpr"       && <LFPRStation onComplete={() => complete("lfpr")} onBack={() => go("intro")} />}
        {station === "formula"    && <FormulaLabStation onComplete={() => complete("formula")} onBack={() => go("intro")} />}
        {station === "nairu"      && <NAIRUStation onComplete={() => complete("nairu")} onBack={() => go("intro")} />}
        {station === "fredchart"   && <UnempChartStation onComplete={() => complete("fredchart")} onBack={() => go("intro")} />}
        {station === "quiz"       && <QuizStation onNext={handleQuizComplete} onBack={() => go("intro")} />}
        {station === "not-yet"    && <NotYetStation score={quizScore} wrongIndices={wrongIndices} onRetake={() => go("quiz")} onGoToStation={go} />}
        {station === "results"    && <ResultsStation score={quizScore} results={quizResults} onRestart={() => { setQuizScore(0); setWrongIndices([]); setCompleted(new Set()); go("intro"); }} />}
            <div role="alert" aria-live="polite" className="sr-only" id="lab-feedback" />
    </main>
    </div>
  );
}
// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Station = "intro" | "recap" | "sorter" | "classifier" | "iceberg" | "lfpr" | "formula" | "nairu" | "fredchart" | "quiz" | "results" | "not-yet";

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
