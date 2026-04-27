// Build ECO 211 Midterm Exam Revised - DOCX
const docx = require('docx');
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  Header, Footer, PageNumber, TabStopType, TabStopPosition,
  convertInchesToTwip
} = docx;

const FONT = "Arial";
const BODY_SIZE = 22;        // 11pt = 22 half-points
const SMALL_SIZE = 20;       // 10pt
const HEADER_SIZE = 20;      // 10pt
const CHAPTER_SIZE = 26;     // 13pt
const TITLE_SIZE = 28;       // 14pt
const ACCENT = "01696F";     // Hydra Teal
const MUTED = "7A7974";
const DARK = "28251D";
const BORDER = "D4D1CA";

// ---- Helper builders ----------------------------------------------------

function p(text, opts = {}) {
  const runs = Array.isArray(text)
    ? text
    : [new TextRun({ text, font: FONT, size: opts.size || BODY_SIZE, bold: opts.bold || false, color: opts.color || DARK, italics: opts.italics || false })];
  return new Paragraph({
    children: runs,
    alignment: opts.alignment || AlignmentType.LEFT,
    spacing: { before: opts.before || 0, after: opts.after || 60, line: 300 },
    indent: opts.indent || undefined,
    border: opts.border || undefined,
  });
}

function blankLine(size) {
  return new Paragraph({ children: [new TextRun({ text: "", font: FONT, size: size || BODY_SIZE })], spacing: { after: 80 } });
}

// Teal underlined chapter header
function chapterHeader(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: CHAPTER_SIZE, bold: true, color: ACCENT, underline: { type: "single", color: ACCENT } })],
    spacing: { before: 360, after: 120 },
    border: { bottom: { color: ACCENT, size: 12, style: BorderStyle.SINGLE, space: 4 } },
  });
}

// Question header line: "Q# [LABEL]   TYPE — 0.625 pts"
function questionHeader(qNum, label, type) {
  return new Paragraph({
    children: [
      new TextRun({ text: `Q${qNum}. `, font: FONT, size: BODY_SIZE, bold: true, color: DARK }),
      new TextRun({ text: label, font: FONT, size: SMALL_SIZE, bold: true, italics: true, color: ACCENT }),
      new TextRun({ text: `   ${type} — 0.625 pts`, font: FONT, size: SMALL_SIZE, color: MUTED }),
    ],
    spacing: { before: 240, after: 80 },
    keepNext: true,
  });
}

// Bold question stem
function questionStem(stem) {
  return new Paragraph({
    children: [new TextRun({ text: stem, font: FONT, size: BODY_SIZE, bold: true, color: DARK })],
    spacing: { after: 120, line: 300 },
    keepNext: true,
  });
}

// Answer option
function option(symbol, text) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${symbol}  `, font: FONT, size: BODY_SIZE, color: DARK }),
      new TextRun({ text, font: FONT, size: BODY_SIZE, color: DARK }),
    ],
    indent: { left: convertInchesToTwip(0.35) },
    spacing: { after: 60, line: 300 },
  });
}

function mcOption(text) { return option("\u25CB", text); }    // ○
function msOption(text) { return option("\u25A1", text); }    // □

// Order item
function orderItem(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: "_______   ", font: FONT, size: BODY_SIZE, color: DARK }),
      new TextRun({ text, font: FONT, size: BODY_SIZE, color: DARK }),
    ],
    indent: { left: convertInchesToTwip(0.35) },
    spacing: { after: 80, line: 300 },
  });
}

// Cell helper
function cell(text, opts = {}) {
  const isHeader = opts.header || false;
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({
        text: String(text),
        font: FONT,
        size: opts.size || BODY_SIZE,
        bold: isHeader || opts.bold || false,
        color: isHeader ? "FFFFFF" : DARK,
      })],
      alignment: opts.alignment || AlignmentType.LEFT,
      spacing: { before: 40, after: 40 },
    })],
    shading: isHeader ? { fill: ACCENT, type: ShadingType.CLEAR, color: "auto" } : (opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR, color: "auto" } : undefined),
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
  });
}

const TABLE_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  left: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  right: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
};

// Matching question: 3-column table (Term | blank | Definition)
function matchTable(leftItems, rightItems) {
  const maxLen = Math.max(leftItems.length, rightItems.length);
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      cell("Term", { header: true, alignment: AlignmentType.LEFT, width: 45 }),
      cell("Answer", { header: true, alignment: AlignmentType.CENTER, width: 10 }),
      cell("Definition", { header: true, alignment: AlignmentType.LEFT, width: 45 }),
    ],
  });
  const rows = [headerRow];
  for (let i = 0; i < maxLen; i++) {
    const left = leftItems[i] || "";
    const right = rightItems[i] || "";
    rows.push(new TableRow({
      children: [
        cell(left, { alignment: AlignmentType.LEFT, width: 45, shading: i % 2 === 1 ? "F7F6F2" : undefined }),
        cell("____", { alignment: AlignmentType.CENTER, width: 10, shading: i % 2 === 1 ? "F7F6F2" : undefined }),
        cell(right, { alignment: AlignmentType.LEFT, width: 45, shading: i % 2 === 1 ? "F7F6F2" : undefined }),
      ],
    }));
  }
  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TABLE_BORDERS,
  });
}

// ---- Build content ------------------------------------------------------

const children = [];

// Title block
children.push(new Paragraph({
  children: [new TextRun({ text: "ECO 211 — Principles of Microeconomics", font: FONT, size: TITLE_SIZE, bold: true, color: DARK })],
  alignment: AlignmentType.CENTER,
  spacing: { after: 80 },
}));
children.push(new Paragraph({
  children: [new TextRun({ text: "Midterm Exam (Revised)", font: FONT, size: 26, bold: true, color: ACCENT })],
  alignment: AlignmentType.CENTER,
  spacing: { after: 240 },
}));

// Student info line
children.push(new Paragraph({
  children: [
    new TextRun({ text: "Name: ", font: FONT, size: BODY_SIZE, bold: true, color: DARK }),
    new TextRun({ text: "_______________________", font: FONT, size: BODY_SIZE, color: DARK }),
    new TextRun({ text: "    |    Date: ", font: FONT, size: BODY_SIZE, bold: true, color: DARK }),
    new TextRun({ text: "_______________", font: FONT, size: BODY_SIZE, color: DARK }),
    new TextRun({ text: "    |    Section: ", font: FONT, size: BODY_SIZE, bold: true, color: DARK }),
    new TextRun({ text: "_______________", font: FONT, size: BODY_SIZE, color: DARK }),
  ],
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  border: {
    top: { style: BorderStyle.SINGLE, size: 6, color: BORDER, space: 6 },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: BORDER, space: 6 },
  },
}));

// Directions block (italic)
children.push(p(
  "Time limit: 45 minutes. There are 32 questions worth 0.625 points each (20 points total). Question types include multiple choice, multi-select, and matching. Once the exam begins, you may not leave the room. Remove everything from your desk except something to write with. No electronics, notes, books, earbuds, headphones, or hats. Failing to follow these instructions could result in an academic violation.",
  { italics: true, color: MUTED, after: 200, size: SMALL_SIZE }
));

// =============== CHAPTER 1 ===============
children.push(chapterHeader("Chapter 1 — Introduction to Economics"));

// Q1
children.push(questionHeader(1, "[KEPT — Q1 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("At its core, economics is best defined as the study of how people and societies …"));
children.push(mcOption("maximize corporate profits"));
children.push(mcOption("manage money and financial markets"));
children.push(mcOption("allocate scarce resources among competing uses"));
children.push(mcOption("avoid government regulation"));

// Q2
children.push(questionHeader(2, "[KEPT — Q2 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("Which example is most squarely microeconomics?"));
children.push(mcOption("Why the unemployment rate rose last year"));
children.push(mcOption("How a coffee shop sets its price for cold brew"));
children.push(mcOption("How the Federal Reserve sets interest rates"));
children.push(mcOption("Why the inflation rate fell in June"));

// Q3
children.push(questionHeader(3, "[KEPT — Q3 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("According to Adam Smith's insight about specialization, division of labor primarily increases …"));
children.push(mcOption("unemployment, because tasks are repetitive"));
children.push(mcOption("productivity, by allowing workers to focus on specific tasks"));
children.push(mcOption("inequality, by concentrating wealth"));
children.push(mcOption("the need for government planning"));

// Q4
children.push(questionHeader(4, "[KEPT — Q4 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("Which statement best explains how division and specialization of labor, combined with voluntary trade in free markets, increase productivity and raise standards of living?"));
children.push(mcOption("Trade increases living standards primarily by eliminating competition; specialization reduces productivity because workers do fewer types of tasks."));
children.push(mcOption("Specialization increases productivity only when the government assigns jobs; trade mainly redistributes existing goods and does not affect total output."));
children.push(mcOption("Specialization lets workers and firms focus on tasks where they are relatively more productive, improving skills and efficiency; trade then allows people to exchange for goods they don't produce, expanding consumption possibilities beyond what they could make alone—raising overall output and living standards."));
children.push(mcOption("Higher living standards come mostly from self-sufficiency; specialization and trade make economies dependent and therefore poorer."));

// Q5
children.push(questionHeader(5, "[KEPT — Q5 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("In a market economy, which statement is most accurate?"));
children.push(mcOption("A central authority sets most prices and wages"));
children.push(mcOption("Private individuals own the means of production and prices coordinate decisions"));
children.push(mcOption("Underground markets replace legal markets by design"));
children.push(mcOption("Firms must produce what the government orders"));

// Q6
children.push(questionHeader(6, "[KEPT — Q6 from original]", "MULTI-SELECT"));
children.push(questionStem("Features commonly associated with a command economy include: (Select all that apply)"));
children.push(msOption("State ownership of many enterprises"));
children.push(msOption("Government sets many output targets and prices"));
children.push(msOption("Greater likelihood of underground (black) markets"));
children.push(msOption("Private ownership predominates and prices are decentralized"));
children.push(msOption("Central planning allocates resources"));

// =============== CHAPTER 2 ===============
children.push(chapterHeader("Chapter 2 — Choice In A World Of Scarcity"));

// Q7
children.push(questionHeader(7, "[KEPT — Q7 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("Points on a PPF (production possibilities frontier) are …"));
children.push(mcOption("allocatively efficient by definition"));
children.push(mcOption("attainable but productively inefficient"));
children.push(mcOption("productively efficient combinations"));
children.push(mcOption("unattainable"));

// Q8
children.push(questionHeader(8, "[KEPT — Q8 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("Moving along a bowed-out PPF from left to right, the opportunity cost of the x-axis good generally …"));
children.push(mcOption("falls then rises"));
children.push(mcOption("rises (law of increasing opportunity cost)"));
children.push(mcOption("becomes zero at the endpoints"));
children.push(mcOption("stays constant"));

// Q9
children.push(questionHeader(9, "[KEPT — Q9 from original]", "MULTI-SELECT"));
children.push(questionStem("Which situations are consistent with a point inside the current PPF? (Select all that apply)"));
children.push(msOption("Technological regression shifting the PPF inward"));
children.push(msOption("Idle resources/unemployment"));
children.push(msOption("Waste/inefficiency"));
children.push(msOption("Underutilization of capacity"));
children.push(msOption("Productive efficiency"));

// Q10
children.push(questionHeader(10, "[KEPT — Q10 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("Using a Production Possibilities Frontier (PPF), which option best contrasts productive efficiency and allocative efficiency?"));
children.push(mcOption("Productive efficiency occurs when the economy produces inside the PPF (to conserve resources). Allocative efficiency occurs when it produces outside the PPF (to maximize growth)."));
children.push(mcOption("Productive efficiency occurs when the economy produces on the PPF (no resources wasted). Allocative efficiency occurs when the economy produces the mix of goods on the PPF that best matches society's preferences (where marginal benefit equals marginal opportunity cost)."));
children.push(mcOption("Productive efficiency means producing at the highest possible output of one good only. Allocative efficiency means producing equal amounts of both goods."));
children.push(mcOption("Productive efficiency occurs when prices are stable. Allocative efficiency occurs when GDP is rising."));

// Q11
children.push(questionHeader(11, "[NEW]", "MULTIPLE CHOICE"));
children.push(questionStem("Selena paid $8 for a movie ticket. Thirty minutes in, she realizes the movie is terrible and she is miserable watching it. A rational economic decision-maker should:"));
children.push(mcOption("Stay — she already paid $8 so she should get her money's worth."));
children.push(mcOption("Leave — the $8 is a sunk cost that cannot be recovered; the only relevant question is whether the next 90 minutes are worth more watching the movie or doing something else."));
children.push(mcOption("Stay — leaving would mean the $8 was completely wasted."));
children.push(mcOption("Leave only if she can get a refund at the box office."));

// Q12
children.push(questionHeader(12, "[NEW]", "MULTIPLE CHOICE"));
children.push(questionStem("Alphonso is deciding whether to work an extra Saturday shift for $60 or attend a professional networking event. He values the networking opportunity at $85. According to marginal analysis, what should Alphonso do?"));
children.push(mcOption("Take the shift — $60 in certain income outweighs uncertain networking benefits."));
children.push(mcOption("Attend the networking event — the marginal benefit ($85) exceeds the marginal cost (the forgone $60 wage)."));
children.push(mcOption("Take the shift — money in hand is always the rational choice."));
children.push(mcOption("It doesn't matter — both options have positive value so either is correct."));

// =============== CHAPTER 3 ===============
children.push(chapterHeader("Chapter 3 — Demand & Supply"));

// Q13
children.push(questionHeader(13, "[KEPT — Q13 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("If a good has many close substitutes and its price increases, what is the most likely outcome?"));
children.push(mcOption("Quantity demanded will fall significantly"));
children.push(mcOption("The supply curve will shift left"));
children.push(mcOption("Consumers will continue buying the same amount"));
children.push(mcOption("Demand will become perfectly inelastic"));

// Q14
children.push(questionHeader(14, "[KEPT — Q15 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("Which statement best reflects the economic definition of \u201Cdemand\u201D and identifies the TWO essentials for a consumer to have effective demand?"));
children.push(mcOption("Demand is the relationship showing the quantities consumers are willing and able to buy at different prices; effective demand requires (1) willingness to buy and (2) ability to pay (purchasing power)."));
children.push(mcOption("Demand is the quantity of a good consumers want; effective demand requires (1) a low price and (2) many competing sellers."));
children.push(mcOption("Demand is the total amount of a good produced; effective demand requires (1) firms to supply it and (2) consumers to purchase it."));
children.push(mcOption("Demand is a consumer's desire for a product; effective demand requires (1) liking the product and (2) having time to shop."));

// Q15
children.push(questionHeader(15, "[KEPT — Q16 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("If the supply of coffee decreases due to poor harvest, what is the likely effect on equilibrium price and quantity?"));
children.push(mcOption("Price rises, quantity falls"));
children.push(mcOption("Price falls, quantity falls"));
children.push(mcOption("Price rises, quantity rises"));
children.push(mcOption("Price falls, quantity rises"));

// Q16 (matching)
children.push(questionHeader(16, "[KEPT — Q17 from original]", "MATCHING"));
children.push(questionStem("Match the term with its correct definition."));
children.push(matchTable(
  ["Shortage", "Equilibrium Price", "Price Floor", "Price Ceiling", "Surplus"],
  [
    "A. A legally established maximum price",
    "B. A legally established minimum price",
    "C. The price where supply equals demand",
    "D. When quantity supplied exceeds quantity demanded",
    "E. When quantity demanded exceeds quantity supplied",
  ]
));

// Q17
children.push(questionHeader(17, "[KEPT — Q19 from original]", "MULTI-SELECT"));
children.push(questionStem("Which THREE of the following would cause the demand curve for hamburgers to shift (not just a movement along the demand curve)? Select exactly THREE."));
children.push(msOption("The price of hamburgers rises from $6 to $7."));
children.push(msOption("The average income of consumers increases, and hamburgers are a normal good."));
children.push(msOption("The price of hot dogs (a substitute) increases."));
children.push(msOption("A new study convinces people that hamburgers are unhealthy, reducing consumer preferences for them."));
children.push(msOption("The government places a per-unit tax on hamburger sellers, raising the market price consumers pay."));
children.push(msOption("Restaurants improve the speed of service, so consumers can buy hamburgers at a lower price."));

// Q18
children.push(questionHeader(18, "[KEPT — Q20 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("Which of the following events would cause a movement along the supply curve for gasoline, rather than a shift of the entire curve?"));
children.push(mcOption("A new, more efficient oil refining technology is developed."));
children.push(mcOption("The price of crude oil, a key input, increases."));
children.push(mcOption("The market price of gasoline increases due to higher summer travel demand."));
children.push(mcOption("The U.S. government subsidizes gasoline production."));

// Q19
children.push(questionHeader(19, "[REVISED — based on Q26+Q27 from original]", "MULTI-SELECT"));
children.push(questionStem("A city government is considering two policies: (A) setting a rent ceiling below the market equilibrium rent, and (B) setting a minimum wage above the market equilibrium wage. Which of the following outcomes correctly describe the effects of these price controls? Select ALL that apply."));
children.push(msOption("Policy A (rent ceiling) will create a shortage of apartments — quantity demanded exceeds quantity supplied."));
children.push(msOption("Policy A (rent ceiling) will create a surplus of apartments — landlords will supply more at the lower price."));
children.push(msOption("Policy B (minimum wage above equilibrium) will create a surplus of labor — unemployment rises."));
children.push(msOption("Policy B (minimum wage above equilibrium) will create a shortage of labor — firms cannot find enough workers."));
children.push(msOption("Both policies result in deadweight loss and reduce market efficiency."));

// =============== CHAPTER 4 ===============
children.push(chapterHeader("Chapter 4 — Labor & Financial Markets"));

// Q20
children.push(questionHeader(20, "[KEPT — Q24 from original]", "MULTI-SELECT"));
children.push(questionStem("Which factors would SHIFT labor DEMAND for nurses to the RIGHT? (Select all that apply)"));
children.push(msOption("A city regulation requiring more nurses per patient for certain procedures."));
children.push(msOption("A rise in the current wage for nurses."));
children.push(msOption("A living-wage ordinance that sets a wage floor for city jobs."));
children.push(msOption("A fall in the price of complementary inputs (e.g., hospital equipment)."));
children.push(msOption("An increase in patient demand for hospital services."));

// Q21
children.push(questionHeader(21, "[KEPT — Q25 from original]", "MULTI-SELECT"));
children.push(questionStem("Which policies would SHIFT the labor SUPPLY of nurses to the RIGHT? (Select all that apply)"));
children.push(msOption("Expanded child-care benefits for working parents."));
children.push(msOption("Tougher licensing requirements for nursing jobs."));
children.push(msOption("Very long unemployment benefits that discourage job search."));
children.push(msOption("Population growth or immigration that increases the pool of potential workers."));
children.push(msOption("Government subsidies for nursing schools or students."));

// Q22
children.push(questionHeader(22, "[KEPT — Q29 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("Why is the demand for auto-assembly workers said to be a 'derived demand'?"));
children.push(mcOption("Because workers directly set the market wage through unions."));
children.push(mcOption("Because labor markets do not reach equilibrium without government intervention."));
children.push(mcOption("Because the demand for labor depends on the demand for the product being produced."));
children.push(mcOption("Because increases in wages always increase labor demand."));

// Q23
children.push(questionHeader(23, "[KEPT — Q31 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("If the legal minimum wage is set slightly BELOW the market equilibrium wage for unskilled labor in a city, the result is:"));
children.push(mcOption("A decrease in labor demand due to the law of demand."));
children.push(mcOption("No effect on wages or employment because the floor is non-binding."));
children.push(mcOption("A binding price floor that creates a labor surplus (unemployment)."));
children.push(mcOption("A labor shortage that drives wages upward."));

// Q24
children.push(questionHeader(24, "[KEPT — Q38 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("Which of the following results in a rightward shift of the market demand curve for labor?"));
children.push(mcOption("an increase in demand for the firm's product"));
children.push(mcOption("a decrease in labor productivity"));
children.push(mcOption("a decrease in the firm's product price"));
children.push(mcOption("an increase in the wage rate"));

// Q25
children.push(questionHeader(25, "[KEPT — Q39 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("A widespread increase in business confidence, where firms expect future investments to be highly profitable, would most likely cause what change in the financial market?"));
children.push(mcOption("A rightward shift in the supply for financial capital."));
children.push(mcOption("A rightward shift in the demand for financial capital."));
children.push(mcOption("A leftward shift in the supply for financial capital."));
children.push(mcOption("A movement down along the demand curve for financial capital."));

// =============== CHAPTER 5 ===============
children.push(chapterHeader("Chapter 5 — Elasticity"));

// Q26
children.push(questionHeader(26, "[KEPT — Q33 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("A firm faces demand for its product with Ed = 1.2. If it raises price by 5%, what happens to total revenue?"));
children.push(mcOption("Unchanged"));
children.push(mcOption("Increases"));
children.push(mcOption("Decreases"));
children.push(mcOption("Indeterminate from given information"));

// Q27
children.push(questionHeader(27, "[KEPT — Q36 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("If Demand is inelastic, and Supply is elastic, who bears more of the burden of a tax?"));
children.push(mcOption("Split Evenly"));
children.push(mcOption("Consumers"));
children.push(mcOption("Producers"));

// Q28
children.push(questionHeader(28, "[KEPT — Q37 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("If Demand is elastic, and Supply is inelastic, who bears more of the burden of a tax?"));
children.push(mcOption("Producers"));
children.push(mcOption("Split Evenly"));
children.push(mcOption("Consumers"));

// =============== CHAPTER 6 ===============
children.push(chapterHeader("Chapter 6 — Consumer Choices"));

// Q29
children.push(questionHeader(29, "[KEPT — Q11 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("A consumer who maximizes utility with positive prices will choose a bundle where …"));
children.push(mcOption("marginal utilities of the goods are equal"));
children.push(mcOption("marginal utility per dollar is equalized across goods"));
children.push(mcOption("average utility equals marginal utility"));
children.push(mcOption("total utility equals income"));

// Q30
children.push(questionHeader(30, "[NEW]", "MULTIPLE CHOICE"));
children.push(questionStem("José has a budget of $56. T-shirts cost $14 each and movies cost $7 each. At his current consumption, the marginal utility of the last T-shirt is 22 utils and the marginal utility of the last movie is 11 utils. Is José maximizing his utility?"));
children.push(mcOption("Yes — MU of T-shirts (22) is higher than MU of movies (11), so he should buy more T-shirts."));
children.push(mcOption("No — MU/P for T-shirts is 22/14 \u2248 1.57 and MU/P for movies is 11/7 \u2248 1.57; since they are equal, he is already at the optimum."));
children.push(mcOption("No — MU/P for T-shirts is 22/14 \u2248 1.57 and MU/P for movies is 11/7 \u2248 1.57; he should reallocate spending toward whichever has higher MU/P."));
children.push(mcOption("Yes — as long as he spends his entire budget, utility is maximized."));

// Q31
children.push(questionHeader(31, "[NEW]", "MULTIPLE CHOICE"));
children.push(questionStem("Rosa receives a raise and her income increases. She responds by buying more restaurant meals but fewer packages of instant ramen noodles. Based on this behavior, restaurant meals are a _______ good and instant ramen is a _______ good."));
children.push(mcOption("inferior; normal"));
children.push(mcOption("normal; inferior"));
children.push(mcOption("normal; normal"));
children.push(mcOption("inferior; inferior"));

// Q32
children.push(questionHeader(32, "[REVISED — based on Q12 from original]", "MULTIPLE CHOICE"));
children.push(questionStem("Alex receives a surprise tax refund of $500. That same week, Alex owes an unexpected $500 phone bill. In net terms Alex is no worse off — yet Alex feels far more upset about the bill than happy about the refund, and refuses to pay the bill from the tax refund (mentally labeled \u201Cvacation money\u201D). Which behavioral economics concepts best explain Alex's reaction?"));
children.push(mcOption("Opportunity cost and comparative advantage: Alex recognizes money has alternative uses and specializes spending based on relative efficiency."));
children.push(mcOption("Diminishing marginal utility and the law of demand: Alex values each additional dollar less as income rises."));
children.push(mcOption("Sunk cost fallacy and marginal analysis: Alex considers past expenditures when making current decisions."));
children.push(mcOption("Loss aversion and mental accounting: Alex feels the pain of the $500 loss more intensely than the pleasure of the $500 gain, and treats money differently depending on which mental \u201Caccount\u201D it belongs to — even though money is fungible."));

// End-of-exam marker
children.push(new Paragraph({
  children: [new TextRun({ text: "— End of Exam —", font: FONT, size: BODY_SIZE, bold: true, color: ACCENT })],
  alignment: AlignmentType.CENTER,
  spacing: { before: 360, after: 120 },
}));

// ---- Header & Footer ----------------------------------------------------

const headerPara = new Paragraph({
  children: [
    new TextRun({ text: "ECO 211 — Principles of Microeconomics", font: FONT, size: HEADER_SIZE, bold: true, color: DARK }),
    new TextRun({ text: "  |  Midterm Exam", font: FONT, size: HEADER_SIZE, color: MUTED }),
  ],
  alignment: AlignmentType.CENTER,
  border: { bottom: { color: BORDER, size: 6, style: BorderStyle.SINGLE, space: 4 } },
});

const footerPara = new Paragraph({
  children: [
    new TextRun({ text: "Each question worth 0.625 points  |  Total: 20 points", font: FONT, size: HEADER_SIZE, color: MUTED }),
    new TextRun({ text: "\t\tPage ", font: FONT, size: HEADER_SIZE, color: MUTED }),
    new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: HEADER_SIZE, color: MUTED }),
    new TextRun({ text: " of ", font: FONT, size: HEADER_SIZE, color: MUTED }),
    new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: HEADER_SIZE, color: MUTED }),
  ],
  tabStops: [
    { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
  ],
  border: { top: { color: BORDER, size: 6, style: BorderStyle.SINGLE, space: 4 } },
});

// ---- Document -----------------------------------------------------------

const doc = new Document({
  creator: "ECO 211",
  title: "ECO 211 Midterm Exam (Revised)",
  styles: {
    default: {
      document: { run: { font: FONT, size: BODY_SIZE, color: DARK } },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(0.85),
          bottom: convertInchesToTwip(0.85),
          left: convertInchesToTwip(0.9),
          right: convertInchesToTwip(0.9),
          header: convertInchesToTwip(0.4),
          footer: convertInchesToTwip(0.4),
        },
      },
    },
    headers: { default: new Header({ children: [headerPara] }) },
    footers: { default: new Footer({ children: [footerPara] }) },
    children,
  }],
});

(async () => {
  const buffer = await Packer.toBuffer(doc);
  const out = "/home/user/workspace/ECO211-Midterm-Exam-Revised.docx";
  fs.writeFileSync(out, buffer);
  console.log("Wrote", out, buffer.length, "bytes");
})();
