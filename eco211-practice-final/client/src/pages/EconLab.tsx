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
    steps: ["Perfect Competition", "Monopolistic Competition", "Oligopoly", "Monopoly"],
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


  // ── Ch10: Oligopoly & Game Theory ────────────────────────────────────────


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

  // ── Ch8 · Perfect Competition (new) ──────────────────────────────────
  {
    id: 41, type: "mc", topic: "Ch8 · Shutdown Decision",
    q: "A raspberry farm has market price $2.50/pack. Its Average Variable Cost at the profit-maximizing quantity is $2.80/pack and Average Total Cost is $3.50/pack. What should the firm do in the short run?",
    opts: [
      "Continue operating — price covers part of total cost.",
      "Shut down immediately — price is below average variable cost.",
      "Continue operating — any revenue is better than zero.",
      "Shut down — any loss means shutdown is optimal in the short run.",
    ],
    correct: 1,
    exp: "Shutdown rule: shut down if Price < AVC. Here P = $2.50 < AVC = $2.80 — the firm cannot cover variable costs (workers, materials). Staying open increases losses. If P were between AVC and ATC (loss but covering variable costs), the firm should stay open in the short run to minimize losses.",
  },
  {
    id: 42, type: "mc", topic: "Ch8 · Long-Run Entry & Exit",
    q: "In a perfectly competitive market, a firm is currently earning positive economic profit. What will happen in the long run?",
    opts: [
      "The firm keeps above-normal profits since it earned them first.",
      "New firms enter, supply increases, price falls until economic profit returns to zero.",
      "The firm lowers its price to prevent new entrants from competing.",
      "The government imposes a windfall profit tax, returning profit to consumers.",
    ],
    correct: 1,
    exp: "Positive economic profit attracts new entrants. More firms increase market supply, driving price down until P = minimum ATC and economic profit = 0. This is long-run equilibrium: P = MR = MC = AC. The gold rush analogy from your slides: profits attract prospectors until the gold runs out.",
  },
  {
    id: 43, type: "multi", topic: "Ch8 · Industry Types",
    q: "Which of the following correctly describe an INCREASING-COST industry in the long run? Select ALL that apply.",
    opts: [
      "As demand rises and new firms enter, input prices rise (scarce workers get bid up).",
      "The long-run supply curve is upward-sloping.",
      "As demand rises and new firms enter, costs fall due to economies of scale.",
      "Entry of new firms drives the long-run equilibrium price higher than the original price.",
      "The long-run supply curve is downward-sloping.",
    ],
    correct: [0, 1, 3],
    exp: "In an increasing-cost industry, expansion bids up key input prices. Each new firm faces higher costs, so the long-run equilibrium price is higher — producing an upward-sloping long-run supply curve. Options C and E describe a decreasing-cost industry (tech industries benefiting from economies of scale).",
  },
  // ── Ch11 · Monopoly & Antitrust (new) ─────────────────────────────────
  {
    id: 44, type: "mc", topic: "Ch11 · HHI & Concentration",
    q: "An industry has 5 firms with market shares of 40%, 30%, 15%, 10%, and 5%. What is the approximate HHI, and how would the FTC likely view a major merger in this market?",
    opts: [
      "HHI ≈ 100; the FTC would likely approve any merger.",
      "HHI ≈ 2,750; above 1,800 — the FTC would likely challenge a merger between the two largest firms.",
      "HHI ≈ 10,000; this is a pure monopoly.",
      "HHI ≈ 500; below 1,000 — the FTC would likely approve with no scrutiny.",
    ],
    correct: 1,
    exp: "HHI = 40² + 30² + 15² + 10² + 5² = 1,600 + 900 + 225 + 100 + 25 = 2,850 (≈ 2,750 range). Above 1,800 = highly concentrated — FTC likely to challenge mergers among top firms. HHI squares each share, giving heavy weight to the largest firm. A merger of the top two (40%+30%=70%) would push HHI dramatically higher.",
  },
  {
    id: 45, type: "multi", topic: "Ch11 · Antitrust Law",
    q: "Which of the following are examples of ILLEGAL anticompetitive behavior under U.S. antitrust law? Select ALL that apply.",
    opts: [
      "Three competing airlines secretly agree to charge identical fares on overlapping routes.",
      "A pharmaceutical company earns high profits from a valid patent on a drug.",
      "Two vitamin manufacturers agree each will only sell to certain customers, dividing the market.",
      "A large firm prices below average variable cost to drive a new entrant out of business.",
      "A merger between two small firms in a market with 50+ competitors.",
    ],
    correct: [0, 2, 3],
    exp: "Price-fixing cartels (A) and market allocation schemes (C) are per se illegal under the Sherman Antitrust Act. Predatory pricing below AVC (D) is illegal when intent is to destroy competition (classic case from slides: International Vitamin Cartel). Having a patent monopoly (B) is legal — innovation-based monopoly is protected. A merger of tiny firms in a competitive market (E) raises no antitrust concern.",
  },
  {
    id: 46, type: "match", topic: "Ch11 · Regulatory Options",
    instruction: "Match each natural monopoly regulatory approach on the left with its key characteristic on the right.",
    items: [
      "Unregulated Monopoly",
      "Price = Marginal Cost (P = MC)",
      "Price = Average Cost (P = AC)",
      "Price Cap Regulation",
    ],
    categories: [
      "Theoretically efficient but requires government subsidy — firm loses money at this price",
      "Firm sets MR = MC, earns high profit, underproduces — consumers harmed",
      "Firm covers all costs and earns normal profit — most common practical approach",
      "Regulator sets maximum price for several years; firm profits by cutting costs faster than the cap",
    ],
    correct: [1, 0, 2, 3],
    exp: "Unregulated monopoly maximizes profit (MR=MC) — high price, low output, consumers harmed. P=MC is socially optimal but firm loses money without subsidy. P=AC lets the firm break even — most commonly used in practice. Price cap gives the firm cost-cutting incentives since savings become profit.",
  },
  {
    id: 47, type: "mc", topic: "Ch11 · Deregulation",
    q: "The 1978 Airline Deregulation Act removed government control over fares and routes. Which best describes the long-run effect?",
    opts: [
      "Airfares rose as airlines competed for profit rather than accepting regulated returns.",
      "No meaningful change — regulated and deregulated markets produce identical outcomes.",
      "Airfares dropped roughly one-third over two decades and the number of air passengers doubled.",
      "Service quality collapsed — deregulation caused a dramatic rise in safety incidents.",
    ],
    correct: 2,
    exp: "Airline deregulation is a textbook case: fares fell ~1/3, passenger numbers doubled, planes flew fuller, and service expanded to more cities. Some airlines went bankrupt (Pan Am, Eastern) while new competitors emerged. Safety continued to improve — FAA safety regulation was NOT removed, only pricing and route controls were deregulated.",
  },
];

// ─────────────────────────────────────────────
// Draw all 40 questions in fixed authored order (no random draw — all 40 map to real exam)
// ─────────────────────────────────────────────
function drawQuestions(): Question[] {
  // Pool: 43 questions across Ch7-Ch13. Draw 30 balanced by type.
  const byType: { [k: string]: Question[] } = { mc: [], multi: [], match: [], order: [] };
  for (const q of QUESTION_BANK) byType[q.type].push(q);

  const drawn: Question[] = [];
  // All match questions (up to 7)
  drawn.push(...shuffle(byType.match).slice(0, 7));
  // All order questions (1)
  drawn.push(...shuffle(byType.order).slice(0, 1));
  // Multi-select (up to 10)
  drawn.push(...shuffle(byType.multi).slice(0, 10));
  // Fill remaining with MC to reach 30
  const remaining = 30 - drawn.length;
  drawn.push(...shuffle(byType.mc).slice(0, remaining));

  return shuffle(drawn);
}

// ─────────────────────────────────────────────
// Matching Question Component
// ─────────────────────────────────────────────
function MatchQuestion({ q, onAnswer, isSubmitted }: { q: MatchQ; onAnswer: (correct: boolean) => void; isSubmitted: boolean }) {
  const [shuffledItems] = useState(() => {
    const idx = q.items.map((_, i) => i);
    const shuffled = shuffle(idx);
    return shuffled.map(i => ({ text: q.items[i], correctCat: q.correct[i] }));
  });
  // Shuffle the categories displayed on the right independently
  const [shuffledCats] = useState(() => shuffle(q.categories.map((c, i) => ({ text: c, origIdx: i }))));
  const [placed, setPlaced] = useState<(number | null)[]>(new Array(shuffledItems.length).fill(null));
  const [checked, setChecked] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const allPlaced = placed.every(p => p !== null);
  const score = shuffledItems.filter((item, i) => placed[i] === item.correctCat).length;
  const allCorrect = score === shuffledItems.length;

  function selectItem(i: number) {
    if (checked) return;
    setSelectedItem(prev => prev === i ? null : i);
  }

  function assignCat(catOrigIdx: number) {
    if (checked || selectedItem === null) return;
    setPlaced(prev => { const n = [...prev]; n[selectedItem] = catOrigIdx; return n; });
    setSelectedItem(null);
  }

  function clearItem(i: number) {
    if (checked) return;
    setPlaced(prev => { const n = [...prev]; n[i] = null; return n; });
    setSelectedItem(i);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground italic">{q.instruction}</p>
      {!checked && selectedItem !== null && (
        <p className="text-xs font-semibold text-primary">Now click a definition on the right to match it →</p>
      )}
      {!checked && selectedItem === null && !allPlaced && (
        <p className="text-xs text-muted-foreground">Click a concept on the left to select it, then click its matching definition on the right.</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {/* Left column — concepts */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Concept</p>
          {shuffledItems.map((item, i) => {
            const catIdx = placed[i];
            const isCorrect = checked && catIdx === item.correctCat;
            const isWrong = checked && catIdx !== null && catIdx !== item.correctCat;
            const isSelected = selectedItem === i;
            let cls = "w-full text-left rounded-xl border-2 p-2.5 text-xs font-semibold transition cursor-pointer ";
            if (checked) cls += isCorrect ? "border-green-400 bg-green-50 text-green-800" : isWrong ? "border-red-400 bg-red-50 text-red-700" : "border-border bg-card text-muted-foreground";
            else if (isSelected) cls += "border-primary bg-primary/10 text-primary";
            else if (catIdx !== null) cls += "border-green-300 bg-green-50/50 text-foreground";
            else cls += "border-border bg-card text-foreground hover:border-primary/40";
            return (
              <button key={i} onClick={() => catIdx !== null && !checked ? clearItem(i) : selectItem(i)} className={cls}>
                {checked && (isCorrect ? "✓ " : isWrong ? "✗ " : "")}{item.text}
                {catIdx !== null && !checked && <span className="block text-xs text-muted-foreground mt-1 font-normal">→ {q.categories[catIdx]}</span>}
                {isWrong && checked && <span className="block text-xs text-red-500 mt-1 font-normal">Should be: {q.categories[item.correctCat]}</span>}
              </button>
            );
          })}
        </div>
        {/* Right column — definitions */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Definition</p>
          {shuffledCats.map((cat, ci) => {
            const isUsed = placed.includes(cat.origIdx);
            const isSelected = selectedItem !== null;
            let cls = "w-full text-left rounded-xl border-2 p-2.5 text-xs transition ";
            if (checked) cls += "border-border bg-muted text-muted-foreground cursor-default";
            else if (isUsed) cls += "border-green-200 bg-green-50/30 text-muted-foreground cursor-pointer hover:border-primary/40";
            else if (isSelected) cls += "border-primary/40 bg-card text-foreground cursor-pointer hover:border-primary hover:bg-primary/5";
            else cls += "border-border bg-card text-foreground cursor-default";
            return (
              <button key={ci} onClick={() => !isUsed && isSelected ? assignCat(cat.origIdx) : undefined} className={cls} disabled={checked}>
                {cat.text}
                {isUsed && !checked && <span className="block text-xs text-green-600 mt-0.5 font-semibold">✓ matched</span>}
              </button>
            );
          })}
        </div>
      </div>
      {checked && (
        <div className={`p-3 rounded-xl text-sm ${allCorrect ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"}`}>
          <span className="font-semibold">{allCorrect ? "✓ Perfect! " : `${score}/${shuffledItems.length} correct. `}</span>{q.exp}
        </div>
      )}
      {!checked && (
        <button onClick={() => { setChecked(true); onAnswer(allCorrect); }} disabled={!allPlaced || isSubmitted}
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
function OrderQuestion({ q, onAnswer, isSubmitted }: { q: OrderQ; onAnswer: (correct: boolean) => void; isSubmitted: boolean }) {
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
          return <button key={i} className={cls} onClick={() => toggle(i)} disabled={submitted}><span className="whitespace-normal break-words text-left block">{isMulti ? (isSel ? "☑ " : "☐ ") : ""}{String.fromCharCode(65+i)}. {opt}</span></button>;
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
  const [checked, setChecked] = useState(false);

  function handleAnswer(correct: boolean) {
    const q = questions[currentIdx];
    const newResults = [...results, { qNum: q.id, topic: q.topic, correct }];
    setResults(newResults);
    setChecked(true);
  }

  function handleNext() {
    setChecked(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
    } else {
      setDone(true);
    }
  }

  if (done) return <ResultsScreen results={results} onRestart={() => { setResults([]); setCurrentIdx(0); setDone(false); setChecked(false); }} />;

  const q = questions[currentIdx];
  const progress = Math.round(((currentIdx) / questions.length) * 100);
  const isLast = currentIdx + 1 >= questions.length;

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
          {q.type === "match"  && <MatchQuestion  key={q.id} q={q as MatchQ}  onAnswer={handleAnswer} isSubmitted={checked} />}
          {q.type === "order"  && <OrderQuestion  key={q.id} q={q as OrderQ}  onAnswer={handleAnswer} isSubmitted={checked} />}
          {(q.type === "mc" || q.type === "multi") && <ChoiceQuestion key={q.id} q={q as MCQ | MultiQ} onAnswer={handleAnswer} checked={checked} />}
        </div>
        {checked && (
          <div className="mt-4">
            <button type="button" onClick={handleNext}
              className="w-full py-3 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-semibold text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary">
              {isLast ? "Submit Exam →" : "Next Question →"}
            </button>
          </div>
        )}

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

      </div>
    </div>
  );
}
