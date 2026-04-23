import { useState } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type MCQ    = { id: number; type: "mc";    topic: string; q: string; opts: string[]; correct: number; exp: string };
type MultiQ = { id: number; type: "multi"; topic: string; q: string; opts: string[]; correct: number[]; exp: string };
type MatchQ = { id: number; type: "match"; topic: string; instruction: string; items: string[]; categories: string[]; correct: number[]; exp: string };
type OrderQ = { id: number; type: "order"; topic: string; instruction: string; steps: string[]; exp: string };
type Question = MCQ | MultiQ | MatchQ | OrderQ;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────
// QUESTION BANK — 40 questions (ECO 211 Practice Final)
// ─────────────────────────────────────────────
const QUESTION_BANK: Question[] = [
  // ── Ch7: Production, Costs & Industry Structure ──────────────────────────
  {
    id: 1, type: "order", topic: "Ch7 · Market Structures",
    instruction: "Rank the following market structures from the one with the MOST firms (1) to the one with the FEWEST firms (4).",
    steps: ["Monopoly", "Oligopoly", "Monopolistic Competition", "Perfect Competition"],
    exp: "Perfect Competition has the most firms (thousands of price-takers). Monopolistic Competition has many firms. Oligopoly has a small number of large firms. Monopoly has one firm.",
  },
  {
    id: 2, type: "multi", topic: "Ch7 · Perfect Competition",
    q: "Which of the following are characteristics that BOTH perfect competition AND monopolistic competition share?",
    opts: [
      "Many buyers and sellers in the market.",
      "No significant barriers to entry or exit.",
      "Firms are price-takers with no market power.",
      "Firms earn zero economic profit in the long run.",
      "Products are identical and interchangeable across all sellers.",
    ],
    correct: [0, 1, 3],
    exp: "Both structures have many firms and easy entry/exit, and both end up at zero economic profit in the long run. They differ in that monopolistic competitors sell differentiated (not identical) products and have some pricing power.",
  },
  {
    id: 3, type: "mc", topic: "Ch7 · Perfect Competition",
    q: "A small dairy farmer sells milk in a perfectly competitive market where the equilibrium price is $3.20 per gallon. The farmer decides to charge $3.80 per gallon. What is the most likely outcome?",
    opts: [
      "The farmer earns higher revenue because milk is a necessity.",
      "The farmer sells zero gallons — buyers purchase identical milk for $3.20 from competitors.",
      "The farmer captures buyers who prefer locally sourced milk.",
      "The farmer's revenue rises because demand for milk is inelastic.",
      "Other farmers follow and raise their prices too, supporting the $3.80 price.",
    ],
    correct: 1,
    exp: "In perfect competition, products are identical. No buyer will pay $3.80 when they can get the same milk for $3.20 elsewhere. The farmer loses all customers — the hallmark of a price-taker.",
  },
  {
    id: 4, type: "mc", topic: "Ch7 · Cost Concepts",
    q: "A firm's total cost (TC) at Q=5 is $60 and at Q=6 is $67. What is the Marginal Cost (MC) of the 6th unit?",
    opts: ["$60", "$67", "$7", "$11.17"],
    correct: 2,
    exp: "MC = ΔTC / ΔQ = ($67 − $60) / (6 − 5) = $7. Marginal cost is the additional cost of producing one more unit, not the average cost.",
  },
  {
    id: 5, type: "multi", topic: "Ch7 · Perfect Competition",
    q: "Which of the following statements are TRUE about a perfectly competitive firm's short-run production decision?",
    opts: [
      "The firm produces where MR = MC to maximize profit.",
      "The firm shuts down if price falls below average variable cost.",
      "The firm can influence market price by changing its output level.",
      "The firm's marginal revenue equals the market price.",
      "The firm earns positive economic profit whenever P > AVC.",
    ],
    correct: [0, 1, 3],
    exp: "Competitive firms maximize profit at MR = MC (where MR = P), shut down when P < AVC, and are price-takers (MR = P). Earning P > AVC only avoids shutdown — profit requires P > ATC.",
  },
  {
    id: 6, type: "match", topic: "Ch7 · Perfect Competition",
    instruction: "Match each perfect competition concept on the left with its correct definition on the right.",
    items: ["Allocative Efficiency", "Productive Efficiency", "Price Taker", "Zero Economic Profit", "Long-Run Equilibrium"],
    categories: ["P = MC — resources allocated to their highest-valued use", "P = minimum ATC — production at lowest possible cost", "A firm that accepts the market price as given", "TR exactly covers all explicit and implicit costs", "The state where P = MR = MC = minimum ATC"],
    correct: [0, 1, 2, 3, 4],
    exp: "Perfect competition in long-run equilibrium achieves all five conditions simultaneously: P = MC (allocative), P = min ATC (productive), firms are price-takers, economic profit = 0, and all cost curves intersect optimally.",
  },
  // ── Ch8: Perfect Competition (applied) ───────────────────────────────────
  {
    id: 7, type: "mc", topic: "Ch8 · Profit Maximization",
    q: "A competitive firm has MC = $9 and MR = $9. Average Total Cost (ATC) is $12 at this output. What does this tell us?",
    opts: [
      "The firm should increase output because MR > MC.",
      "The firm is at its profit-maximizing quantity but is earning an economic loss.",
      "The firm should shut down because price is below ATC.",
      "The firm is earning a normal profit because MR = MC.",
      "The firm should decrease output to reduce losses.",
    ],
    correct: 1,
    exp: "MR = MC means the firm is producing the profit-maximizing (loss-minimizing) quantity. But since P = MR = $9 < ATC = $12, the firm is making a loss of $3 per unit. It should continue in the short run only if P ≥ AVC.",
  },
  {
    id: 8, type: "mc", topic: "Ch8 · Long-Run Efficiency",
    q: "In long-run equilibrium, perfectly competitive firms achieve allocative efficiency. This condition is met because:",
    opts: [
      "Firms maximize profit by producing where MC is at its minimum point.",
      "Competition drives price down to marginal cost, ensuring resources flow to their most valued uses.",
      "Firms produce the maximum possible output regardless of costs.",
      "The government regulates prices to equal marginal cost.",
      "Entry of new firms increases the market price to cover average total cost.",
    ],
    correct: 1,
    exp: "Allocative efficiency (P = MC) occurs because competitive pressure drives price to its lowest sustainable level — marginal cost. At this point, the price paid by consumers exactly reflects the opportunity cost of production.",
  },
  // ── Ch9: Monopoly ─────────────────────────────────────────────────────────
  {
    id: 9, type: "mc", topic: "Ch9 · Barriers to Entry",
    q: "A pharmaceutical company holds an exclusive government-granted right to sell a patented drug for 20 years. A major tech company dominates cloud computing partly because its data centers cost $10 billion to build, giving it massive cost advantages over potential rivals. Which two barriers to entry do these scenarios illustrate?",
    opts: [
      "Trade Secret and Predatory Pricing",
      "Control of Physical Resource and Intimidation",
      "Legal Monopoly (Patent) and Economies of Scale (Natural Monopoly)",
      "Copyright and Exclusive Licensing",
      "Brand Loyalty and Network Effects",
    ],
    correct: 2,
    exp: "A government patent is a legal monopoly — the law grants exclusive rights. Extremely high fixed costs creating large economies of scale is the basis of natural monopoly, where one firm can serve the market at lower average cost than multiple firms.",
  },
  {
    id: 10, type: "multi", topic: "Ch9 · Intellectual Property",
    q: "Which of the following are examples of intellectual property protection that grant temporary or ongoing exclusive rights?",
    opts: [
      "A patent on a new manufacturing process.",
      "A trademark on a company's logo and brand name.",
      "A copyright protecting a published novel.",
      "A trade secret protecting a proprietary recipe (e.g., Coca-Cola formula).",
      "A government antitrust lawsuit breaking up a monopoly.",
    ],
    correct: [0, 1, 2, 3],
    exp: "Patents, trademarks, copyrights, and trade secrets are all forms of intellectual property protection — they give creators/innovators legal exclusivity. Antitrust lawsuits are the opposite — they reduce market concentration rather than grant exclusive rights.",
  },
  {
    id: 11, type: "match", topic: "Ch9 · Barriers to Entry",
    instruction: "Match each barrier-to-entry TYPE on the left with the correct real-world scenario on the right.",
    items: ["Natural Monopoly", "Legal Monopoly (Copyright)", "Control of a Physical Resource", "Intimidation via Predatory Pricing"],
    categories: [
      "A city's natural gas pipeline — duplicating the infrastructure would be wasteful and cost-prohibitive.",
      "A publishing house holds the exclusive right to reproduce and sell a bestselling author's series.",
      "A single mining company controls 90% of the world's supply of a mineral critical for EV batteries.",
      "A dominant airline slashes ticket prices on a new route below cost until the upstart carrier exits.",
    ],
    correct: [0, 1, 2, 3],
    exp: "Natural monopoly arises from infrastructure economics. Copyright protects creative works. Control of a scarce resource creates a resource-based barrier. Predatory pricing is a strategic intimidation barrier — temporarily unprofitable but effective at deterring entry.",
  },
  {
    id: 12, type: "multi", topic: "Ch9 · Monopoly Profit Max",
    q: "Which of the following conditions must hold at a monopolist's profit-maximizing output level?",
    opts: [
      "Marginal Revenue equals Marginal Cost (MR = MC).",
      "Price equals Average Total Cost (P = ATC).",
      "Price is read from the demand curve at the profit-maximizing quantity.",
      "Price exceeds Average Total Cost (P > ATC) if the monopolist earns positive economic profit.",
      "Price equals Marginal Cost (P = MC) to achieve allocative efficiency.",
    ],
    correct: [0, 2, 3],
    exp: "A monopolist maximizes profit at MR = MC, then charges the price consumers are willing to pay (read from the demand curve). Profit exists when P > ATC. P = ATC would imply zero profit (breakeven), not profit maximization. P = MC is competitive pricing — monopolists never achieve this voluntarily.",
  },
  // ── Ch9-10: Monopoly Decision Making & MonComp ───────────────────────────
  {
    id: 13, type: "match", topic: "Ch9 · Monopoly Decision Making",
    instruction: "Match each monopoly concept on the left with its role in the monopolist's decision-making process on the right.",
    items: [
      "The MR = MC intersection",
      "The demand curve at the profit-maximizing quantity",
      "The gap between Price and Average Total Cost",
      "P > MC at optimal output",
    ],
    categories: [
      "Sets the profit-maximizing quantity of output.",
      "Sets the price the monopolist charges consumers.",
      "Determines the per-unit profit margin.",
      "Shows that monopoly creates allocative inefficiency (deadweight loss).",
    ],
    correct: [0, 1, 2, 3],
    exp: "The monopolist's four-step decision: (1) find MR=MC to set quantity, (2) go up to the demand curve to set price, (3) compare P vs ATC for profit, (4) recognize P > MC as the source of allocative inefficiency.",
  },
  {
    id: 14, type: "multi", topic: "Ch9 · Long-Run Monopoly",
    q: "Which of the following barriers to entry enable a monopolist to sustain positive economic profit in the long run?",
    opts: [
      "Paying slightly higher wages than competitors (a surmountable cost disadvantage for rivals).",
      "Owning the only deposit of a key mineral input necessary for production.",
      "Holding a government-granted patent on the core product or process.",
      "Having a decades-long history of brand recognition protected as a trade secret.",
      "Operating in an industry where economies of scale are so large that only one firm can survive profitably.",
    ],
    correct: [1, 2, 3, 4],
    exp: "Durable monopoly requires substantial barriers: control of scarce resources, legal protection (patents), trade secrets, or natural monopoly from economies of scale. Simply paying high wages doesn't prevent entry — rivals could match those wages and still compete.",
  },
  // ── Ch10: Monopolistic Competition & Oligopoly ───────────────────────────
  {
    id: 15, type: "multi", topic: "Ch10 · Product Differentiation",
    q: "Which of the following are examples of product differentiation through means OTHER than the physical product itself?",
    opts: [
      "A coffee shop located in a busy train station with no other coffee nearby.",
      "A hotel chain with a 24-hour satisfaction guarantee and free rebooking.",
      "A car manufacturer uses a stronger steel alloy in the frame.",
      "A clothing brand's social media campaign associating its products with celebrity lifestyle.",
      "A restaurant that redesigns its menu to use locally sourced ingredients.",
    ],
    correct: [0, 1, 3],
    exp: "Location (train station), service guarantee (24-hour rebooking), and brand image (celebrity association) are all non-physical differentiation. Using stronger steel or local ingredients are physical product improvements — the good itself is materially different.",
  },
  {
    id: 16, type: "mc", topic: "Ch10 · Monopolistic Competition Long Run",
    q: "A monopolistically competitive firm is currently earning economic LOSSES in the short run. What long-run adjustment should we expect?",
    opts: [
      "New firms enter the market, shifting existing firms' demand curves further left.",
      "Existing firms exit the market, shifting remaining firms' demand curves to the right until P = AC.",
      "The government provides subsidies to prevent further exit.",
      "The firm raises its price to cover losses, attracting more customers.",
      "Firms merge to form an oligopoly and recover profits through mutual interdependence.",
    ],
    correct: 1,
    exp: "Economic losses trigger exit in monopolistic competition. As firms leave, the remaining firms face less competition — their demand curves shift right (more customers, higher prices possible) until economic profit returns to zero (P = AC).",
  },
  {
    id: 17, type: "mc", topic: "Ch10 · Monopolistic Competition Efficiency",
    q: "Why does monopolistic competition result in 'excess capacity' compared to perfect competition?",
    opts: [
      "Firms produce too much output, driving prices below minimum average cost.",
      "Firms produce less than the output at minimum average cost because their downward-sloping demand curve creates a tangency above minimum ATC.",
      "Firms invest too heavily in advertising, raising costs above competitive levels.",
      "Government regulation forces firms to maintain unused production capacity.",
      "Firms collude to restrict output and keep prices high.",
    ],
    correct: 1,
    exp: "Excess capacity: in monopolistic competition, long-run equilibrium occurs where the downward-sloping demand curve is tangent to ATC — above its minimum point. Firms produce less than the efficient scale, leaving capacity unused. This is the cost of product variety.",
  },
  {
    id: 18, type: "mc", topic: "Ch10 · MonComp Profit Max",
    q: "A monopolistically competitive firm finds that at its current output level, MR = $18 and MC = $22. Price is $30 and ATC is $35. What should the firm do to maximize profit?",
    opts: [
      "Increase output because P > ATC.",
      "Maintain current output because the firm is close to MR = MC.",
      "Decrease output — MR < MC means each additional unit adds more to cost than to revenue.",
      "Raise price to cover the loss (P < ATC).",
      "Exit the market immediately because the firm is making a loss.",
    ],
    correct: 2,
    exp: "When MR < MC, the last unit costs more to produce than it generates in revenue. The firm should reduce output until MR = MC. Note: P < ATC means a short-run loss, but the firm should not exit until the long-run adjustment plays out.",
  },
  {
    id: 19, type: "match", topic: "Ch10 · Market Structures",
    instruction: "Match each market structure characteristic on the left with the market structure it best describes on the right.",
    items: [
      "A few large firms, high barriers to entry, and strategic interdependence.",
      "One firm selling a unique product with no close substitutes.",
      "Many firms selling similar but differentiated products with easy entry.",
      "Thousands of firms selling identical products with no pricing power.",
      "Firms cooperate or compete strategically because rivals' decisions affect their own profits.",
    ],
    categories: ["Oligopoly", "Monopoly", "Monopolistic Competition", "Perfect Competition", "Oligopoly (Mutual Interdependence)"],
    correct: [0, 1, 2, 3, 4],
    exp: "Oligopoly: few large firms, high barriers. Monopoly: one firm, unique product. Monopolistic Competition: many differentiated firms, easy entry. Perfect Competition: many identical products. Mutual interdependence is the defining feature of oligopoly — each firm's strategy depends on rivals' reactions.",
  },
  {
    id: 20, type: "mc", topic: "Ch10 · Monopolistic Competition Trade-offs",
    q: "What is the PRIMARY social cost of monopolistic competition compared to perfect competition?",
    opts: [
      "Monopolistic competitors earn permanent economic profits at consumers' expense.",
      "Firms operate with excess capacity and charge P > MC, resulting in both productive and allocative inefficiency.",
      "Monopolistic competition eliminates all product variety from the market.",
      "Firms in monopolistic competition face no competition and behave like monopolists.",
      "Advertising in monopolistic competition is always wasteful and provides no consumer benefit.",
    ],
    correct: 1,
    exp: "The social cost of monopolistic competition: firms produce below minimum ATC (productive inefficiency) and charge P > MC (allocative inefficiency). These arise because each firm faces a downward-sloping demand curve rather than the horizontal curve of perfect competition.",
  },
  {
    id: 21, type: "mc", topic: "Ch10 · Advertising",
    q: "From an economics perspective, why might advertising in monopolistic competition be considered partially BENEFICIAL to society even though it raises costs?",
    opts: [
      "Advertising reduces average total cost by increasing the scale of production.",
      "Advertising provides consumers with information about product characteristics, helping them find better matches for their preferences.",
      "Advertising eliminates the downward-sloping demand curve, making firms more like perfect competitors.",
      "Advertising guarantees that the advertising firm achieves allocative efficiency.",
      "Advertising reduces barriers to entry by making it easier for new firms to enter.",
    ],
    correct: 1,
    exp: "Advertising can be beneficial when it conveys genuine information — helping consumers find products that suit them. The debate in economics is between informative advertising (socially useful) and persuasive advertising (primarily redistributes demand without adding value). Monopolistic competition involves both.",
  },
  // ── Ch10: Oligopoly & Game Theory ────────────────────────────────────────
  {
    id: 22, type: "mc", topic: "Ch10 · Game Theory",
    q: "In the game matrix below, Player Row can choose Top or Bottom; Player Column can choose Left or Right. Payoffs are (Row, Column):\n\n• Top/Left: ($8, $6)  • Top/Right: ($3, $9)\n• Bottom/Left: ($12, $4)  • Bottom/Right: ($5, $7)\n\nWhat is Player Row's payoff if Row chooses Bottom and Column chooses Right?",
    opts: ["$12", "$4", "$5", "$7"],
    correct: 2,
    exp: "Reading the matrix: Bottom/Right gives payoffs of ($5, $7). Player Row (first number) receives $5. Player Column (second number) receives $7.",
  },
  {
    id: 23, type: "mc", topic: "Ch10 · Prisoner's Dilemma",
    q: "Two competing airlines (SkyWing and AirBridge) can each set fares as High or Low. Profits (in $millions): High/High: each earns $8M. High/Low: SkyWing earns $2M, AirBridge earns $14M. Low/High: SkyWing earns $14M, AirBridge earns $2M. Low/Low: each earns $4M. If both airlines act in their own self-interest, what is the Nash equilibrium?",
    opts: [
      "Both set High fares, each earning $8M — the cooperative outcome.",
      "SkyWing sets Low, AirBridge sets High — SkyWing earns $14M.",
      "Both set Low fares, each earning $4M — the dominant strategy equilibrium.",
      "Both set High fares after negotiating a secret agreement.",
      "AirBridge sets Low, SkyWing sets High — AirBridge earns $14M.",
    ],
    correct: 2,
    exp: "This is a prisoner's dilemma. For each airline, Low is the dominant strategy regardless of what the rival does (Low beats High by $14M vs $8M if rival goes High, and $4M vs $2M if rival goes Low). Nash equilibrium: both choose Low → $4M each, despite $8M/$8M being collectively better.",
  },
  {
    id: 24, type: "mc", topic: "Ch10 · Oligopoly",
    q: "Two competing gas stations located across the street from each other have never communicated or made any agreement, yet they always charge exactly the same price. Each monitors the other's price and adjusts immediately. This is an example of:",
    opts: [
      "Explicit collusion — a formal cartel arrangement.",
      "Tacit collusion — price coordination achieved through observation and matching without formal agreement.",
      "Perfect competition — prices naturally converge in any competitive market.",
      "Natural monopoly — both stations face the same cost structure.",
      "Predatory pricing — one station is trying to drive the other out of business.",
    ],
    correct: 1,
    exp: "Tacit collusion is price coordination without explicit communication — firms signal and match each other's prices through observation. It is difficult to prosecute legally (no agreement exists) but produces outcomes similar to a cartel.",
  },
  {
    id: 25, type: "multi", topic: "Ch10 · Oligopoly",
    q: "Which of the following help explain why oligopolists often do NOT engage in aggressive price competition even without explicit agreements?",
    opts: [
      "Each firm knows that a price cut will likely be matched by rivals, yielding little market share gain.",
      "High barriers to entry protect existing firms' profits without requiring price cuts.",
      "Price wars reduce industry profits for all firms — the kinked demand curve logic.",
      "Oligopolists are legally required to maintain stable prices.",
      "Mutual interdependence makes each firm reluctant to trigger a price war.",
    ],
    correct: [0, 1, 2, 4],
    exp: "Oligopolists avoid price wars because: rivals match cuts (gains are temporary), high barriers protect profits, price wars erode everyone's margins, and mutual interdependence creates strategic restraint. There is no legal requirement to maintain prices — that would be illegal price-fixing.",
  },
  {
    id: 26, type: "multi", topic: "Ch10 · Game Theory",
    q: "Which of the following statements accurately describe a Nash Equilibrium?",
    opts: [
      "It is a situation where no player can improve their own payoff by changing their strategy, given what all other players are doing.",
      "It always produces the best possible outcome for all players combined.",
      "It can occur even when the outcome is worse for all players than some other possible outcome.",
      "Game theory is used to analyze strategic interactions because players' outcomes depend on others' decisions.",
      "In a prisoner's dilemma, the Nash Equilibrium is always the cooperative outcome.",
    ],
    correct: [0, 2, 3],
    exp: "Nash Equilibrium: no player wants to deviate given others' strategies (correct). It can be suboptimal collectively — the prisoner's dilemma Nash equilibrium (both defect) is worse than mutual cooperation. Game theory applies precisely because payoffs depend on rivals' choices. The Nash equilibrium in prisoner's dilemma is mutual defection, NOT cooperation.",
  },
  // ── Ch11: Monopoly & Antitrust ────────────────────────────────────────────
  {
    id: 27, type: "match", topic: "Ch11 · Antitrust & Game Theory",
    instruction: "Match each antitrust/game theory concept on the left with its correct definition on the right.",
    items: ["Dominant Strategy", "Nash Equilibrium", "Collusion", "Antitrust Laws", "Deadweight Loss"],
    categories: [
      "The strategy that produces the highest payoff for a player regardless of what rivals do.",
      "A stable outcome where no player benefits from changing strategy given others' strategies.",
      "Firms coordinate prices or output — explicitly illegal under U.S. antitrust law.",
      "Legislation designed to prevent anti-competitive practices and promote market competition.",
      "The loss of economic efficiency (consumer + producer surplus) due to monopoly underproduction.",
    ],
    correct: [0, 1, 2, 3, 4],
    exp: "These five concepts form the core of oligopoly analysis and antitrust policy: dominant strategies drive Nash equilibria; collusion is the illegal version of cooperation; antitrust laws exist to prevent it; and deadweight loss measures the social cost of market power.",
  },
  {
    id: 28, type: "mc", topic: "Ch11 · Oligopoly vs Other Structures",
    q: "Why is predicting the price and output in an oligopoly more difficult than in perfect competition or monopoly?",
    opts: [
      "Oligopolists always collude, making their behavior unpredictable.",
      "Oligopolists face perfectly elastic demand, complicating price-setting.",
      "Each oligopolist's optimal decision depends on rivals' strategies — and rivals' strategies also depend on each other, creating strategic interdependence.",
      "Oligopolies are too small to be analyzed with standard economic tools.",
      "Government regulations prevent oligopolists from announcing their prices publicly.",
    ],
    correct: 2,
    exp: "Strategic interdependence is what makes oligopoly uniquely complex. In perfect competition, the market price is given. In monopoly, there is no rival. In oligopoly, firm A's best strategy depends on what firm B does — and firm B's strategy depends on A. This requires game theory, not just supply-and-demand analysis.",
  },
  // ── Ch12: Environmental Economics ────────────────────────────────────────
  {
    id: 29, type: "match", topic: "Ch12 · Environmental Economics",
    instruction: "Match each environmental economics concept on the left with its correct definition or effect on the right.",
    items: [
      "Negative Externality",
      "Social Cost",
      "Pigouvian Tax",
      "Market Failure",
      "Coase Theorem",
    ],
    categories: [
      "A cost imposed on a third party who is not part of the transaction.",
      "Private production costs plus the external harm imposed on society.",
      "A tax set equal to the marginal external cost, internalizing the externality.",
      "A situation where the free market produces too much or too little of a good.",
      "If property rights are well-defined and transaction costs are low, parties can negotiate an efficient outcome without government intervention.",
    ],
    correct: [0, 1, 2, 3, 4],
    exp: "Negative externalities → social cost > private cost → market overproduces → market failure. A Pigouvian tax corrects this by making the polluter pay the full social cost. The Coase Theorem offers an alternative: private bargaining can solve externalities when transaction costs are low.",
  },
  {
    id: 30, type: "multi", topic: "Ch12 · Pollution Policy",
    q: "Which of the following are market-based (price/incentive-based) approaches to reducing pollution, as distinct from command-and-control regulation?",
    opts: [
      "A pollution tax charged per ton of CO₂ emitted.",
      "A government standard requiring all factories to install specific scrubbers.",
      "A cap-and-trade system that issues tradeable emission permits.",
      "A per-unit subsidy paid to firms for each ton of pollution they reduce.",
      "A law banning a specific toxic chemical entirely.",
    ],
    correct: [0, 2, 3],
    exp: "Market-based tools use prices and incentives: pollution taxes (raise the cost of polluting), cap-and-trade (create a market for pollution rights), and abatement subsidies (reward reduction). Requiring specific equipment or banning substances outright are command-and-control — they mandate behavior rather than create incentives.",
  },
  {
    id: 31, type: "multi", topic: "Ch12 · Command & Control",
    q: "Which of the following are limitations of command-and-control (C&C) environmental regulation?",
    opts: [
      "C&C provides no incentive for firms to reduce pollution beyond the mandated level.",
      "C&C allows individual firms to choose the least-cost method of meeting environmental goals.",
      "C&C standards may not minimize the total cost of achieving a given level of pollution reduction across firms.",
      "C&C is often subject to political influence, resulting in loopholes or exemptions for powerful industries.",
      "C&C always achieves greater pollution reduction than market-based alternatives.",
    ],
    correct: [0, 2, 3],
    exp: "C&C weaknesses: no incentive beyond compliance, one-size-fits-all standards ignore differences in abatement costs across firms (leading to higher total cost), and political processes can create loopholes. Market-based tools are more flexible and cost-efficient — firms with low abatement costs do more of the reducing.",
  },
  {
    id: 32, type: "multi", topic: "Ch12 · Cap-and-Trade",
    q: "Why are pollution taxes considered an effective market-based tool for reducing negative externalities?",
    opts: [
      "They raise the private cost of polluting to equal the social cost, internalizing the externality.",
      "They give firms flexibility — each firm decides whether to reduce pollution or pay the tax.",
      "They guarantee that total pollution reaches exactly zero.",
      "They generate government revenue that can fund environmental cleanup or reduce other taxes.",
      "They eliminate all deadweight loss associated with pollution immediately.",
    ],
    correct: [0, 1, 3],
    exp: "Pollution taxes work by raising the price of polluting to reflect social cost (Pigouvian logic). Firms choose their lowest-cost response — some reduce emissions, others pay the tax. Revenue is generated. But they don't guarantee zero pollution (that would require a prohibitive tax), and deadweight loss may persist if the tax doesn't perfectly match marginal external cost.",
  },
  // ── Ch12-13: Externalities & Public Goods ────────────────────────────────
  {
    id: 33, type: "mc", topic: "Ch12 · Optimal Pollution Reduction",
    q: "A city is considering reducing carbon emissions from its bus fleet. Each 10% reduction costs progressively more (rising MC), while each successive 10% reduction provides progressively less air quality benefit (declining MB). Based on efficient resource allocation, when should the city STOP reducing emissions?",
    opts: [
      "After achieving a 50% reduction, since this is a reasonable compromise.",
      "Only when emissions reach zero — health benefits always exceed costs.",
      "When the Marginal Cost of further reduction equals the Marginal Benefit of further reduction.",
      "When the total cost of the program equals the city's annual environmental budget.",
      "When political pressure from residents stops — economic analysis is not relevant here.",
    ],
    correct: 2,
    exp: "The efficiency rule: reduce pollution until MC = MB. Before this point, another unit of reduction generates more benefit than cost — worth doing. Beyond this point, further reduction costs more than the benefit it provides — not worth doing. The optimal level of pollution is rarely zero.",
  },
  {
    id: 34, type: "multi", topic: "Ch12 · Environmental Cost-Benefit",
    q: "When economists perform cost-benefit analysis of environmental regulations, which of the following are typically counted as COSTS of the regulation?",
    opts: [
      "The compliance costs firms incur to install pollution-control equipment.",
      "The value of statistical lives saved due to reduced pollution-related illness.",
      "Higher prices consumers pay for goods produced under stricter environmental standards.",
      "Reduced output and employment in regulated industries in the short run.",
      "The increased recreational value of cleaner rivers and lakes.",
    ],
    correct: [0, 2, 3],
    exp: "Costs of regulation: compliance costs (equipment), higher consumer prices, and short-run output/employment reductions. Benefits include lives saved and improved environmental amenities (recreation, health) — these appear on the benefit side of the ledger.",
  },
  // ── Ch13: Positive Externalities, Public Goods & Innovation ──────────────
  {
    id: 35, type: "multi", topic: "Ch13 · R&D Underinvestment",
    q: "Which of the following government policies are designed to correct the private sector's tendency to underinvest in R&D?",
    opts: [
      "R&D tax credits that reduce firms' tax liability in proportion to their research spending.",
      "Antitrust enforcement that breaks up companies investing too much in R&D.",
      "Patent protection that grants innovators temporary monopoly rights over their inventions.",
      "Government funding of basic research at universities and national laboratories.",
      "Trade tariffs that protect domestic industries from foreign competition.",
    ],
    correct: [0, 2, 3],
    exp: "R&D underinvestment stems from knowledge spillovers — private return < social return. Corrections: R&D tax credits raise the private return, patents protect the innovator's investment, and government-funded basic research fills the gap where private investment is least likely. Antitrust and tariffs are unrelated to R&D incentives.",
  },
  {
    id: 36, type: "mc", topic: "Ch13 · Patents & Innovation",
    q: "Why does basic research (e.g., mapping the human genome) require more government funding than applied research (e.g., developing a specific drug)?",
    opts: [
      "Basic research always costs more than applied research.",
      "Basic research generates knowledge that is non-excludable — any firm can use it without paying, so private firms underinvest.",
      "Government scientists are more skilled at basic research than private researchers.",
      "Applied research is funded by patents, while basic research cannot be patented at all.",
      "Basic research takes longer, making it unattractive for short-term focused private investors.",
    ],
    correct: 1,
    exp: "Basic research produces general knowledge (a public good) — once published, it's non-excludable (anyone can build on it). The innovating firm can't capture enough of the social return to justify the investment. Applied research is more excludable (patents can protect specific applications), so private firms fund it more readily.",
  },
  {
    id: 37, type: "match", topic: "Ch13 · Innovation Policy",
    instruction: "Match each government innovation policy tool on the left with its key feature or limitation on the right.",
    items: [
      "Direct Government R&D Spending",
      "R&D Tax Credits",
      "Subsidies (e.g., for education, vaccines)",
      "Intellectual Property Rights (Patents)",
      "Cooperative Research Ventures",
    ],
    categories: [
      "Subject to political influence — funding decisions may reflect lobbying rather than scientific merit.",
      "Cost-effective incentive — firms invest private dollars in exchange for reduced taxes.",
      "Addresses positive externalities by helping consumers/producers capture more of the social benefit.",
      "Transforms knowledge from a public good into a temporary private good — enabling market provision of innovation.",
      "Bridges the gap between academic knowledge and commercial application through government-industry partnerships.",
    ],
    correct: [0, 1, 2, 3, 4],
    exp: "Each tool has a distinct mechanism: direct spending is prone to politics; tax credits leverage private effort efficiently; subsidies correct positive externalities; patents privatize knowledge temporarily; cooperative ventures connect public and private R&D. A mix of all five is typically used.",
  },
  {
    id: 38, type: "mc", topic: "Ch13 · Public Goods & Free Rider",
    q: "A public radio station is funded entirely by voluntary listener donations. Many listeners enjoy the broadcast but do not donate. The station consistently raises less than it needs. This illustrates:",
    opts: [
      "The tragedy of the commons — the radio signal is being overused and depleted.",
      "A club good problem — the station should charge a membership fee to exclude non-payers.",
      "The free rider problem — non-excludability allows listeners to consume the good without contributing.",
      "Market failure due to negative externalities from broadcasting.",
      "The station is inefficient and should adopt a for-profit model.",
    ],
    correct: 2,
    exp: "Public radio is non-excludable (you can't prevent people from listening) and non-rival (one person's listening doesn't reduce the signal for others). This creates the free rider problem — rational individuals wait for others to fund the good. This is why public goods are systematically underprovided by private markets.",
  },
  {
    id: 39, type: "multi", topic: "Ch13 · Tragedy of the Commons",
    q: "Which of the following are recognized solutions to the tragedy of the commons?",
    opts: [
      "Converting the common resource to private property (assigning clear property rights).",
      "Allowing unrestricted access so the market equilibrium determines usage.",
      "Government regulation imposing usage limits, licenses, or seasonal restrictions.",
      "Community-based governance where users cooperate to set and enforce sustainable limits.",
      "Subsidizing heavier use to maximize short-run economic output from the resource.",
    ],
    correct: [0, 2, 3],
    exp: "Three main solutions to the commons tragedy: privatization (Coase: clear property rights → efficient private bargaining), regulation (government quotas, licenses, seasons), and community governance (Ostrom: local users cooperate on sustainable rules). Unrestricted access perpetuates the tragedy; subsidizing use makes it worse.",
  },
  {
    id: 40, type: "match", topic: "Ch13 · Types of Goods",
    instruction: "Match each type of good on the left with its defining characteristics and the associated economic challenge on the right.",
    items: [
      "Private Good",
      "Club Good",
      "Common Resource",
      "Public Good",
      "Positive Externality Good (e.g., education)",
    ],
    categories: [
      "Excludable and rival — markets provide efficiently; no significant market failure in provision.",
      "Excludable and non-rival — markets can provide but may exclude too many users given zero marginal cost of additional consumption.",
      "Non-excludable and rival — leads to overuse and depletion (tragedy of the commons).",
      "Non-excludable and non-rival — free rider problem leads to underprovision by private markets.",
      "Excludable but generates positive spillovers — private provision leads to underproduction relative to social optimum.",
    ],
    correct: [0, 1, 2, 3, 4],
    exp: "The 2×2 grid: Private (excl+rival), Club (excl+non-rival), Common (non-excl+rival), Public (non-excl+non-rival). Education is a special case — excludable (tuition) but generates positive externalities, so private provision underproduces relative to the social optimum.",
  },
];

// ─────────────────────────────────────────────
// Draw all 40 questions in fixed authored order (no random draw — all 40 map to real exam)
// ─────────────────────────────────────────────
function drawQuestions(): Question[] {
  return QUESTION_BANK; // all 40, in authored order
}

// ─────────────────────────────────────────────
// Matching Question Component
// ─────────────────────────────────────────────
function MatchQuestion({ q, onAnswer }: { q: MatchQ; onAnswer: (correct: boolean) => void }) {
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

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground italic">{q.instruction}</p>
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
                      {cat.length > 40 ? cat.substring(0, 38) + "…" : cat}
                    </button>
                  ))}
                </div>
              )}
              {checked && cat !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {q.categories[cat].length > 40 ? q.categories[cat].substring(0, 38) + "…" : q.categories[cat]}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {checked && (
        <div className={`p-3 rounded-xl text-sm ${allCorrect ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"}`}>
          <span className="font-semibold">{allCorrect ? "✓ Perfect! " : `${score}/${shuffledItems.length} correct. `}</span>{q.exp}
        </div>
      )}
      {!checked && (
        <button onClick={() => { setChecked(true); onAnswer(allCorrect); }} disabled={!allPlaced}
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
    return shuffle(idx);
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
      {availableOrigIdx.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Items to place:</p>
          {availableOrigIdx.map(oi => (
            <div key={oi} className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground">
              {q.steps[oi]}
              <div className="flex gap-1 mt-1 flex-wrap">
                {placed.map((p, slotIdx) => p === null ? (
                  <button key={slotIdx} onClick={() => placeStep(slotIdx, oi)}
                    className="text-xs px-2 py-0.5 bg-primary/10 hover:bg-primary/20 text-primary rounded font-medium transition">
                    → Position {slotIdx + 1}
                  </button>
                ) : null)}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your ranking:</p>
        {placed.map((origIdx, slotIdx) => {
          const isCorrect = checked && origIdx === slotIdx;
          const isWrong = checked && origIdx !== null && origIdx !== slotIdx;
          return (
            <div key={slotIdx} className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 min-h-[40px] transition ${
              checked ? (isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-red-400 bg-red-50" : "border-border bg-muted")
              : origIdx !== null ? "border-primary/40 bg-primary/5" : "border-dashed border-border bg-muted/50"
            }`}>
              <span className="text-xs font-bold text-muted-foreground w-20 flex-shrink-0">#{slotIdx + 1}</span>
              {origIdx !== null ? (
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span className="text-xs text-foreground">{checked && (isCorrect ? "✓ " : "✗ ")}{q.steps[origIdx]}</span>
                  {!checked && <button onClick={() => removeStep(slotIdx)} className="text-muted-foreground hover:text-red-500 text-xs font-bold">✕</button>}
                </div>
              ) : <span className="text-xs text-muted-foreground italic">empty</span>}
            </div>
          );
        })}
      </div>
      {checked && (
        <div className={`p-3 rounded-xl text-sm ${correct ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"}`}>
          <span className="font-semibold">{correct ? "✓ Correct! " : "Not quite. "}</span>{q.exp}
        </div>
      )}
      {!checked && (
        <button onClick={() => { setChecked(true); onAnswer(correct); }} disabled={!allPlaced}
          className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground rounded-xl font-semibold transition">
          Check My Ranking
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
    if (isMulti) { const c = (q as MultiQ).correct; return c.length === sel.length && c.every(x => sel.includes(x)); }
    return sel[0] === (q as MCQ).correct;
  }
  function submit() {
    if (!sel.length) return;
    setSubmitted(true);
    onAnswer(isCorrectNow());
  }

  return (
    <div className="space-y-2">
      {isMulti && <p className="text-xs text-primary font-semibold uppercase tracking-wide">Select all that apply</p>}
      <div className="space-y-2">
        {q.opts.map((opt, i) => {
          const isSel = sel.includes(i);
          const isCorrect = isMulti ? (q as MultiQ).correct.includes(i) : (q as MCQ).correct === i;
          let cls = "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ";
          if (!submitted) cls += isSel ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card hover:border-primary/40 text-foreground";
          else if (isCorrect) cls += "border-green-500 bg-green-50 text-green-800";
          else if (isSel) cls += "border-red-400 bg-red-50 text-red-700";
          else cls += "border-border bg-card text-muted-foreground";
          return <button key={i} className={cls} onClick={() => toggle(i)} disabled={submitted}>{isMulti ? (isSel ? "☑ " : "☐ ") : ""}{opt}</button>;
        })}
      </div>
      {submitted && (
        <div className={`p-3 rounded-xl text-sm border-l-4 ${isCorrectNow() ? "border-green-400 bg-green-50 text-green-800" : "border-red-400 bg-red-50 text-red-800"}`}>
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

  function handlePrint() {
    if (!studentName.trim()) { alert("Please enter your name before printing."); return; }
    const items = results.map((r) => '<p style="border-left:4px solid ' + (r.correct ? '#16a34a' : '#dc2626') + ';background:' + (r.correct ? '#f0fdf4' : '#fef2f2') + ';padding:6px 10px;margin:3px 0;font-size:12px"><b>Q' + r.qNum + ' ' + (r.correct ? '✓' : '✗') + ':</b> ' + r.topic + '</p>').join('');
    const topicMap: { [t: string]: { correct: number; total: number } } = {};
    results.forEach(r => { const t = r.topic.split(' · ')[0]; if (!topicMap[t]) topicMap[t] = { correct: 0, total: 0 }; topicMap[t].total++; if (r.correct) topicMap[t].correct++; });
    const topicRows = Object.entries(topicMap).sort().map(([t, d]) => '<tr><td style="padding:4px 8px">' + t + '</td><td style="padding:4px 8px;text-align:center">' + d.correct + '/' + d.total + '</td><td style="padding:4px 8px;text-align:center">' + Math.round(d.correct / d.total * 100) + '%</td></tr>').join('');
    const w = window.open('', '_blank', 'width=820,height=960');
    if (!w) return;
    w.document.write('<html><head><title>ECO 211 Practice Final</title><style>body{font-family:Arial,sans-serif;padding:20px;max-width:680px;margin:0 auto}@media print{button{display:none}}</style></head><body>'
      + '<h2 style="margin:0">ECO 211 ECONLAB — Practice Final Exam</h2>'
      + '<p style="color:#475569;margin:2px 0">Principles of Microeconomics</p>'
      + '<p style="font-size:22px;font-weight:bold;background:#1e2d4a;color:white;display:inline-block;padding:4px 16px;border-radius:99px;margin:8px 0">' + score + ' / ' + results.length + ' &nbsp;·&nbsp; ' + pct + '%</p>'
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<h3 style="font-size:13px;margin:0 0 6px">Performance by Chapter</h3>'
      + '<table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px"><tr style="background:#1e2d4a;color:white"><th style="padding:4px 8px;text-align:left">Chapter</th><th style="padding:4px 8px">Score</th><th style="padding:4px 8px">%</th></tr>' + topicRows + '</table>'
      + '<h3 style="font-size:13px;margin:0 0 6px">Question-by-Question Results</h3>' + items
      + '<hr style="border:1px solid #e2e8f0;margin:12px 0">'
      + '<p style="font-size:13px;margin-top:12px"><b>Student Name:</b></p><p style="border:1px solid #000;padding:8px;border-radius:4px;font-size:14px;font-weight:bold">' + studentName + '</p>'
      + '<p style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;margin-top:16px;padding-top:8px">ECO 211 ECONLAB · Practice Final Exam · Printed ' + new Date().toLocaleDateString() + ' · Access for free at https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction</p>'
      + '</body></html>');
    w.document.close();
    setTimeout(() => w.print(), 600);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-6xl">{pct >= 70 ? "🏆" : "📖"}</div>
          <h2 className="text-3xl font-bold text-foreground">Practice Exam Complete</h2>
          <p className="text-muted-foreground">ECO 211 · Principles of Microeconomics</p>
          <div className={`inline-block px-6 py-2 rounded-full text-xl font-bold mt-2 ${pct >= 70 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
            {score} / {results.length} &nbsp;·&nbsp; {pct}%
          </div>
        </div>

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

        {(() => {
          const topicMap: { [t: string]: { correct: number; total: number } } = {};
          results.forEach(r => { const t = r.topic.split(' · ')[0]; if (!topicMap[t]) topicMap[t] = { correct: 0, total: 0 }; topicMap[t].total++; if (r.correct) topicMap[t].correct++; });
          return (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm">Performance by Chapter</h3>
              <div className="space-y-1.5">
                {Object.entries(topicMap).sort().map(([topic, data]) => {
                  const p = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={topic} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{topic}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${p >= 70 ? "bg-green-500" : "bg-amber-500"}`} style={{ width: `${p}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-foreground w-12 text-right">{data.correct}/{data.total}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        <div className="space-y-3">
          <div>
            <label htmlFor="student-name-input" className="text-sm font-semibold text-foreground block mb-1">Your Name (required for submission)</label>
            <input id="student-name-input" type="text" value={studentName} onChange={e => setStudentName(e.target.value)}
              placeholder="First and Last Name"
              className="w-full border-2 border-border rounded-xl px-3 py-2 text-sm bg-card text-foreground focus:border-primary focus:outline-none" />
          </div>
          <button onClick={handlePrint}
            className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-sm transition">
            🖨️ Print / Save as PDF
          </button>
          <p className="text-xs text-muted-foreground text-center">In the print dialog, choose "Save as PDF" and submit to Brightspace.</p>
          <button onClick={onRestart} className="w-full py-2 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition">
            ↺ Restart Practice Exam
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Practice Exam Component
// ─────────────────────────────────────────────
function PracticeExam() {
  const [questions] = useState(() => drawQuestions());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<{ qNum: number; topic: string; correct: boolean }[]>([]);
  const [done, setDone] = useState(false);

  function handleAnswer(correct: boolean) {
    const q = questions[currentIdx];
    const newResults = [...results, { qNum: q.id, topic: q.topic, correct }];
    setResults(newResults);
    if (currentIdx + 1 < questions.length) {
      setTimeout(() => setCurrentIdx(i => i + 1), 800);
    } else {
      setTimeout(() => setDone(true), 800);
    }
  }

  if (done) return <ResultsScreen results={results} onRestart={() => { setResults([]); setCurrentIdx(0); setDone(false); }} />;

  const q = questions[currentIdx];
  const progress = Math.round(((currentIdx) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header style={{ backgroundColor: "hsl(222,42%,19%)" }} className="text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">ECO 211 ECONLAB</p>
            <p className="text-sm font-bold text-white">Practice Final Exam</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/70">{currentIdx + 1} / {questions.length}</span>
            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">{q.topic}</span>
            <span className="text-xs text-muted-foreground">Question {currentIdx + 1} of {questions.length}</span>
          </div>
          {q.type !== "match" && q.type !== "order" && (
            <p className="text-base font-semibold text-foreground whitespace-pre-line">{q.q}</p>
          )}
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          {q.type === "match"  && <MatchQuestion  q={q as MatchQ}  onAnswer={handleAnswer} />}
          {q.type === "order"  && <OrderQuestion  q={q as OrderQ}  onAnswer={handleAnswer} />}
          {(q.type === "mc" || q.type === "multi") && <ChoiceQuestion q={q as MCQ | MultiQ} onAnswer={handleAnswer} />}
        </div>

        {/* Progress dots */}
        <div className="flex gap-1 mt-4 justify-center flex-wrap">
          {questions.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${
              i < results.length ? (results[i].correct ? "bg-green-500" : "bg-red-400") :
              i === currentIdx ? "bg-primary" : "bg-muted"
            }`} />
          ))}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────
export default function EconLab() {
  const [started, setStarted] = useState(false);

  if (started) return <PracticeExam />;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-lg w-full p-8 space-y-6 text-center">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">ECO 211 ECONLAB</p>
          <h1 className="text-3xl font-bold text-foreground">Practice Final Exam</h1>
          <p className="text-muted-foreground mt-2">Principles of Microeconomics · Chapters 7–13</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2 text-sm text-foreground">
          <p>📋 <strong>40 questions</strong> covering all exam topics</p>
          <p>✍️ Question types: Multiple choice, Select all that apply, Matching, Ranking</p>
          <p>💡 Immediate feedback with explanation after each question</p>
          <p>📊 Results by chapter + printable PDF summary</p>
          <p>⚠️ <strong>These are practice questions — similar concepts, different wording than the real exam.</strong></p>
        </div>
        <button onClick={() => setStarted(true)}
          className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold text-lg transition">
          Begin Practice Exam →
        </button>
        <p className="text-xs text-muted-foreground">Access for free at <a href="https://openstax.org/books/principles-microeconomics-3e/pages/1-introduction" target="_blank" rel="noopener noreferrer" className="underline">OpenStax Microeconomics 3e</a></p>
      </div>
    </div>
  );
}
