# NextBlock -- Product Design Document

**Author**: Alessandro
**Date**: February 12, 2026
**Status**: V8 -- Restructured for MVP product overview
**Purpose**: Product reference document for NextBlock -- what it does, how it works, why it matters. For internal reference and partner-facing presentations.

---

## 1. Executive Summary

NextBlock gives institutional allocators access to insurance-backed yield -- 8-16% APY, structurally uncorrelated to equities, rates, and crypto markets. We tokenize insurance portfolios using traditional quota share cession model, now executed on-chain for transparency, liquidity, and 24/7 settlement. An integrated AI analytics layer provides the institutional-grade risk reporting, compliance documentation, and investor suitability matching that treasury teams require.

**The market**: The global insurance market is $16T, with $300B+ in capital locked in insurance pools. Less than 0.004% of insurance assets are tokenized today. Insurance-backed yield is one of the most attractive untapped asset classes for institutional allocators -- high single-digit to mid-teen returns with no structural correlation to traditional markets.

**The platform**: NextBlock is not an insurer and not a vault manager. It is open infrastructure. It's a three-layer protocol where insurers tokenize policies, independent vault managers curate diversified portfolios, and investors deposit capital to earn yield. Any vault manager can deploy strategies on top. This is the difference between being a product (one team, one vault) and being a platform (unlimited strategies, unlimited vault managers).

---

## 2. The Opportunity

### 2.1 Why Now

Three converging forces make tokenized insurance yield viable in 2026 in a way it was not before:

1. **Regulatory clarity**: MiCA (Markets in Crypto-Assets Regulation) provides the first comprehensive regulatory framework for tokenized financial instruments in Europe.

2. **RWA momentum**: Real-world asset tokenization has grown from near-zero to $8-12B today (treasury bills $4B, real estate $3B). BCG projects $10-16T tokenized by 2030. Insurance ($16T market) remains the largest untapped asset class -- and the one with the most natural fit for on-chain settlement (parametric triggers, transparent claim records, automated premium accrual).

3. **Reinsurance capital demand**: Post-COVID and post-climate catastrophe cycles, reinsurers are actively seeking alternative capital sources. Cat bond issuance hit record levels. ILS capacity ($100B AUM) cannot keep up with demand. Tokenization opens this asset class beyond the traditional $100K+ minimum, 3-7 year lock-up structures that limit participation to sovereign wealth funds and top-tier reinsurers.

### 2.2 The Core Question

How does tokenization enable access to insurance yield?

Insurance premiums are paid upfront by policyholders. The "yield" for capital providers comes from premiums collected minus claims paid over time. But who provides the capital that backs the policies? How do outside investors participate? This document maps the complete architecture from policyholder premium to investor yield.

### 2.3 Insurance Yield in One Formula

```
Investor Yield = (Premiums Collected - Claims Paid - Expenses) / Capital Deployed
```

Over a portfolio: collect $1M in premiums, pay $600K in claims, $100K in expenses = $300K yield on deployed capital. If $5M was required to back the portfolio, that's 6% return on capital. The **loss ratio** (claims / premiums) determines profitability. NextBlock investors are providing underwriting capital and being compensated with a share of premiums for taking on insurance risk.

### 2.4 NextBlock's Business Model: Reinsurance Tokenization

NextBlock's model is functionally analogous to a quota share cession. Two models, used in sequence:

**Model A: In-Force Book Cession (MVP)**

The insurer already has an active portfolio with capital locked against it. They tokenize that existing book, ceding a share of risk and remaining unearned premium to vault investors. The insurer frees capital to write new business.

```
Insurer has existing in-force book ($50M coverage, policies active)
  -> Cedes 50% via whole-portfolio obligatory quota share
  -> NextBlock tokenizes the cession (each policy = on-chain asset)
  -> Vault investors deposit capital, replacing insurer's locked capital
  -> Insurer frees capital to grow
  -> Vault receives 50% of remaining premium, pays 50% of claims
```

**Model B: Prospective Treaty (Production)**

Once the relationship is proven, the vault pre-commits capacity to risk categories before new policies are written. The insurer underwrites new policies knowing that a defined share will automatically cede to the vault.

### 2.5 Capital Deployment: Ring-Fenced Contracts

The vault does not simply hold investor capital waiting for claims. It actively deploys capital to reinsurers via ring-fenced smart contracts.

```
Investor deposits $100K into vault
  |-- $80K (80%) -> Ring-fenced contract with reinsurer
  |     - Reinsurer can draw ONLY for covered claims
  |     - Capital returns to vault at policy expiry (if not consumed)
  |     - Reinsurer gets real deployable capital (their motivation)
  |
  +-- $20K (20%) -> Liquidity buffer (stays in vault)
        - Available for instant investor withdrawals
        - Replenished by: premium income + returning capital from expired policies
```

The deployed capital sits in a smart contract with strict draw-down rights. The reinsurer can only withdraw funds to pay covered claims. At policy expiry, remaining capital automatically returns to the vault.

---

## 3. Platform Architecture

### 3.1 Three-Layer Architecture + AI Analytics

NextBlock operates as open infrastructure with three distinct layers, plus a cross-cutting AI analytics layer:

| Layer                    | Actor                     | Role                                      | Provides                                                                                   | Receives                                                               |
| ------------------------ | ------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **1. Tokenization**      | NextBlock Protocol        | Infrastructure                            | Smart contracts for policy tokenization, vault factory, claim processing rails             | Protocol fees                                                          |
| **2. Supply + Curation** | Insurers + Vault Managers | Risk origination + portfolio curation     | Tokenized policies with defined terms; vault strategies selecting from available policies  | Fresh capital (insurers); management/performance fees (vault managers) |
| **3. Demand**            | Investors                 | Capital provision                         | Stablecoin deposits that back insurance policies                                           | Vault share tokens; yield from premiums minus claims minus fees        |
| **Cross-cutting**        | Braino.ai AI Layer        | Risk analytics + institutional interfaces | Predictive risk scoring, compliance reporting, investor profiling, professional dashboards | Integrated across all three layers                                     |

```
  Policyholder                                    Investor
  (buys insurance                              (provides capital,
   from insurer)                                earns yield)
       |                                             |
       | pays premium                     deposits $ |
       v                                             v
  +-----------+    tokenizes policy    +---------------------+
  |  INSURER  | --------------------> | NEXTBLOCK PROTOCOL   |
  |  (risk    |    via NextBlock      | (Layer 1:            |
  |  originator)   infrastructure     |  tokenization infra) |
  +-----------+                       +----------+-----------+
       ^                                         |
       |                               tokenized policies
       | shares premium               available as on-chain
       | retains partial risk          assets
       |                                         |
       |                                         v
       |                              +---------------------+
       |                              | VAULT MANAGER        |
       |                              | (Layer 2: curation)  |
       |                              | Selects policies,    |
       |                              | builds portfolio     |
       |                              +----------+----------+
       |                                         |
       |                               creates vault with
       |                               selected policies
       |                                         |
       |                                         v
       |                              +---------------------+
       +-- claim payout (if event) -- | VAULT                |
                                      | Deploys capital to   |
                                      | ring-fenced contracts|
                                      +---------------------+
```

### 3.2 Policy Verification Taxonomy

Policies are organized by **how claims are verified**, not by what they insure. This is the honest story of where blockchain adds value and where it doesn't.

| Category             | Verification                                                       | Example Sources                              | Strength                             | Limitation                         |
| -------------------- | ------------------------------------------------------------------ | -------------------------------------------- | ------------------------------------ | ---------------------------------- |
| **On-chain**         | Trigger verifiable directly on-chain (price feeds, contract state) | DeFi covers, crypto price protection         | Trustless, instant, no oracle needed | Limited to crypto-native events    |
| **Oracle-dependent** | Real-world event verified via third-party oracle                   | Parametric weather, flight delay, earthquake | Automatable, binary payout           | Oracle trust assumption            |
| **Off-chain**        | Claims assessed manually by insurer, tokenized representation      | Surety, D&O, liability, commercial fire      | Covers any real-world risk           | Not trustless, manual verification |

Each category maps to a different claim trigger mechanism in the smart contracts:

```
On-chain:        ANYONE calls checkClaim() -> reads oracle price -> auto-triggers
Oracle-dep:      ORACLE_REPORTER calls reportEvent() -> auto-triggers linked policies
Off-chain:       INSURER_ADMIN calls submitClaim(amount) -> manual, permissioned only
```

### 3.3 Architecture Diagram

```
+-------------------------------------------------------------------+
|  AI & ANALYTICS LAYER (Braino.ai)                                  |
|  Risk Scoring | Reporting | Profiling | Professional UI            |
|  Spans all layers -- see Section 3.4                               |
+-------------------------------------------------------------------+
+-------------------------------------------------------------------+
|  LAYER 1: TOKENIZATION (NextBlock Protocol)                        |
|                                                                    |
|  Tokenized Policy Marketplace:                                     |
|  13 policies across 3 verification types                           |
|  (4 on-chain, 4 oracle-dependent, 5 off-chain)                    |
|                                                                    |
|  Any insurer can tokenize policies through NextBlock.              |
|  Each policy is an on-chain asset with transparent terms           |
|  and its verification type clearly labeled.                        |
+--------------------------------------------------------------------+
|  LAYER 2: CURATION (Vault Managers)                                |
|                                                                    |
|  8 vaults with different strategies:                               |
|  Balanced Core | Digital Asset Shield | Parametric Shield          |
|  Conservative Yield | Catastrophe & Specialty                      |
|  Traditional Lines | Technology & Specialty | Multi-Line Diversified|
|                                                                    |
|  Each vault manager selects policies and sets allocations           |
|  independently. Same policies can appear in multiple vaults.       |
+--------------------------------------------------------------------+
|  LAYER 3: INVESTORS                                                |
|                                                                    |
|  Investors choose which vault based on:                            |
|  strategy, risk/return profile, verification type coverage, fees   |
|  Each vault issues its own share token ($ONyc).                    |
+--------------------------------------------------------------------+
```

### 3.4 AI & Analytics Layer

NextBlock includes an AI-powered analytics layer that provides four capabilities across the platform. The underlying technology has been validated by top CET1 financial institutions, including a deployment at the Banque de France.

**Predictive Risk Scoring** -- Each tokenized policy and vault receives an AI-generated risk score based on portfolio risk modeling, dynamic allocation analysis, and loss ratio prediction. Vault managers use these signals for rebalancing and portfolio optimization. Investors and treasury teams see risk scores alongside yield data for informed allocation decisions.

**Institutional Reporting** -- Automated generation of vault performance reports, risk breakdowns, and compliance documentation. Designed for internal risk committees and regulatory requirements. Reports are structured and exportable.

**Investor Profiling & Suitability** -- AI-driven risk appetite matching that maps an allocator's parameters to appropriate vault tiers. Supports MiFID II suitability compliance for institutional allocation.

**Professional Analytics Interface** -- Institutional-grade dashboards with portfolio composition tools, correlation analysis, drawdown visualization, VaR, and Sharpe ratios. Designed for the interface quality that treasury teams and portfolio managers expect.

These capabilities span all three architectural layers: risk scoring at the policy level (Layer 1), rebalancing signals for vault managers (Layer 2), and analytics dashboards for investors (Layer 3). AI analytics integration is the primary deliverable of the MVP phase.

### 3.5 The Platform Story

**Without the vault manager model**: NextBlock is one team managing one vault. It scales linearly with the team's capacity. It is a product.

**With the vault manager model**: NextBlock is a platform. Third-party experts deploy strategies. Each new manager brings their own expertise, investors, and distribution channels. NextBlock captures fees on all of it.

| NextBlock          | Lloyd's of London                  |
| ------------------ | ---------------------------------- |
| NextBlock Protocol | Lloyd's marketplace + settlement   |
| Policy Marketplace | Lloyd's "slip" market              |
| Vault Manager      | Managing agent running a syndicate |
| Vault              | A Lloyd's syndicate                |
| Investor           | A "Name" providing capital         |

---

## 4. How Investors Earn

### 4.1 Yield Mechanics

```
Investor Yield = (Premiums Earned x Cession Share) - Claims Paid - Fees
                 --------------------------------------------------------
                              Capital Deposited
```

The vault share token ($ONyc) increases in value as premiums are earned pro-rata over time. Premium earning is a function of time passing, not of claims not occurring. Claims are a separate deduction from NAV when they happen. The vault's NAV formula: `totalAssets = USDC balance - unearned premiums - pending claims - accrued fees`.

**Deployment ratio** -- the vault manager's most important lever:

| Deployment Ratio | Buffer | Yield Impact       | Liquidity                               |
| ---------------- | ------ | ------------------ | --------------------------------------- |
| 90%              | 10%    | Maximum yield      | Low buffer, relies on secondary market  |
| 80%              | 20%    | ~0.5-1% yield drag | Standard, handles most withdrawal needs |
| 70%              | 30%    | ~1-2% yield drag   | Conservative, high liquidity            |

### 4.2 Money Flow Example

**Vault at the moment of deposit** (example: Balanced Core vault):

The vault manager has curated a portfolio of tokenized policies across all three verification categories. The vault holds investor deposits plus insurer premiums. ~80% of capital is deployed to ring-fenced contracts backing policies, ~20% retained as liquidity buffer.

**Scenario A: No claims for 90 days**

```
Day 0:   $10,000.00  (deposit)
Day 30:  $10,075.00  (share of premiums earned, net of fees)
Day 60:  $10,152.00  (short-term policy expired, premium fully earned)
Day 90:  $10,230.00  (more policies expired, premiums fully earned)

Annualized yield: ~9.2%
```

**Scenario B: One major claim at day 45**

```
Day 0:   $10,000.00
Day 30:  $10,075.00  (premiums accruing normally)
Day 45:  CLAIM EVENT -- on-chain policy triggers (permissionless verification)
         Vault pays claim from deployed capital. NAV drops proportionally.
Day 45:  $9,495.00   (-5.05% from peak)
Day 90:  $9,605.00   (partial recovery from remaining policy premiums)

Net result: -3.95% over 90 days
Without diversification (single policy): -100%
```

The investor does not receive premiums as a separate payment. Premiums increase the vault's NAV, which increases the share price. The investor realizes gains when they withdraw.

| Question                         | Answer                                                                                  |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| How much can I expect from $10K? | $600-$1,200/year (6-12% APY) depending on vault strategy and loss ratio                 |
| Is my capital locked?            | No hard lock. Can exit via liquidity buffer or secondary market at current NAV          |
| Do I get premiums immediately?   | Premium increases vault NAV over time (linear accrual), captured via rising share price |

### 4.3 Liquidity Model

Investor capital is deployed to reinsurers via ring-fenced contracts -- it cannot be returned on demand. Five liquidity mechanisms address this:

**Layer 1: Liquidity Buffer (15-20% of vault)** -- Instant withdrawals up to buffer size. Replenished continuously by premium income and returning deployed capital. Handles >90% of withdrawal requests in normal conditions.

**Layer 2: Staggered Policy Expiry** -- Vault manager curates policies with different maturity dates. Capital returns regularly as policies expire. A well-managed vault has capital returning every 2-4 weeks.

**Layer 3: Secondary Market ($ONyc Trading)** -- Vault share tokens are standard ERC-20. Investors can sell to other investors at any time. No impact on vault capital -- only ownership changes.

**Layer 4: Protocol-Owned Liquidity (Production)** -- NextBlock maintains a protocol-owned liquidity pool as buyer of last resort at a defined discount.

**Layer 5: Redemption Queue (Last Resort)** -- FIFO queue for redemptions when buffer is empty. Fills as policies expire and capital returns. Guaranteed exit, but with delay tied to policy maturity schedule.

**Tail risk scenario**: In a severe catastrophe year (multiple correlated claims + market panic), buffer depletion, steep secondary market discounts, and growing redemption queues are all possible. In 2017-2018, ILS funds experienced exactly this after Hurricanes Harvey, Irma, and Maria -- secondary market discounts reached 15-20%, and some funds gated redemptions for 6-12 months. NextBlock's short-duration parametric and DeFi policies (30-180 days) mean capital returns faster than traditional ILS (3-7 year lock), naturally filling redemption queues within one quarter.

**Honest framing**: "Your capital earns 8-16% because it is deployed and at risk. In normal conditions, you can exit in seconds via the buffer or secondary market. In stressed conditions, exits may take weeks and may involve a discount. This is the trade-off for earning insurance yield."

### 4.4 Yield Scenarios

| Scenario                         | Premiums | Claims        | Net           | Yield on Capital    |
| -------------------------------- | -------- | ------------- | ------------- | ------------------- |
| Best case (no claims)            | $6,100   | $0            | $6,100        | 7.6% annualized     |
| Expected (20-30% loss ratio)     | $6,100   | $1,200-$1,800 | $4,300-$4,900 | 5.4-6.1% annualized |
| Moderate claims (50% loss ratio) | $6,100   | $3,050        | $3,050        | 3.8% annualized     |
| Heavy claims (one major)         | $6,100   | $50,000       | -$43,900      | Capital loss        |
| Catastrophic (two major claims)  | $6,100   | $90,000       | -$83,900      | Severe capital loss |

Note: With a diversified portfolio of 13 policies across 3 verification types, concentration risk is significantly lower than a single-policy exposure. Loss ratios vary by line: on-chain DeFi (5-15%), oracle-dependent parametric (20-50%), off-chain traditional (55-75%). In production, Braino's predictive AI provides real-time loss ratio predictions and risk-adjusted yield projections per vault.

---

## 5. User Journeys

### 5.1 Journey 1: Bank Treasury Allocation (Primary)

This journey shows how a bank deposits its own treasury capital into NextBlock vaults. The bank is the investor -- no intermediary client. This is the primary institutional flow and demonstrates Braino's analytics layer.

```
STEP 1: DISCOVERY
  Bank treasury team accesses NextBlock institutional dashboard
  Sees: Available vaults with AI-generated risk scores (powered by Braino)
  AI profiling: "Based on your treasury risk parameters,
  Balanced Core vault matches your allocation criteria"

STEP 2: DUE DILIGENCE
  Treasury team reviews vault detail with Braino analytics:
  - AI risk score per policy (predicted loss ratios, confidence intervals)
  - Portfolio correlation analysis across verification types
  - Historical simulation: "How would this vault have performed
    during the 2017 hurricane season?"
  - Drawdown analysis, VaR, Sharpe ratio
  - Downloadable compliance report (auto-generated in 633ms)

STEP 3: ALLOCATION
  Treasury deposits capital from bank reserves into vault
  Receives vault share tokens ($ONyc)
  Confirmation: "Your treasury capital is backing N insurance
  policies across on-chain, oracle, and off-chain verification"

STEP 4: MONITORING
  Ongoing treasury dashboard:
  - Real-time NAV and yield accrual
  - AI-generated weekly/monthly performance reports
  - Claim event notifications with Braino impact analysis
  - Risk drift alerts (if portfolio risk profile changes)
  - Exportable reports for internal risk committees and regulators
```

Banks already manage treasury allocations across asset classes. NextBlock + Braino gives them the familiar institutional interface (risk scores, compliance reports, suitability matching) on top of a novel asset class. The Braino layer removes the "crypto UX" friction that blocks institutional adoption.

### 5.2 Journey 2: Investor

```
STEP 1: DISCOVERY
  Investor lands on NextBlock dashboard
  Sees 8 vaults with different strategies, APYs, risk levels,
  and verification type coverage

STEP 2: UNDERSTANDING
  Clicks into a vault detail page:
  - Policy breakdown with verification type labels
  - Allocation weights, premium rates, expiry timelines
  - Deployment ratio visualization (e.g., 80% deployed / 20% buffer)
  - Fee structure, yield accrual, NAV performance
  - AI-generated risk score (Braino)
  "I can see exactly what my money backs"

STEP 3: DEPOSIT
  Deposits stablecoins (USDC) via inline sidebar (Morpho-style)
  Receives vault share tokens ($ONyc)

STEP 4: YIELD ACCRUAL
  Dashboard shows yield ticking up as policies earn premiums
  Policy timeline shows which policies expire next

STEP 5: CLAIM EVENT
  If a claim triggers, three different verification paths visible:
  - On-chain: anyone can verify, contract auto-triggers
  - Oracle: automated via trusted data source
  - Off-chain: insurer assesses and reports
  NAV drops proportionally. Other policies continue earning.

STEP 6: WITHDRAWAL
  Withdraws at current NAV from liquidity buffer
```

### 5.3 Journey 3: Claim Event Comparison ("Same Claim, Different Impact")

Multiple vaults share policies. When a shared policy triggers a claim, each vault reacts independently based on its strategy and diversification:

- A vault holding the triggered policy plus 4 other uncorrelated policies absorbs the impact with moderate NAV decline
- A vault concentrated in the same risk category takes a larger proportional hit
- A vault that excludes that policy type entirely is unaffected

This IS the platform story -- vault managers have different philosophies about risk, verification trust, and diversification. The investor chooses. NextBlock wins either way.

### 5.4 Journey 4: Vault Manager / Curator

The curator page provides:

- Available policy pool (all tokenized policies with verification labels, coverage, premiums)
- Vault management (create vault, select policies from pool, set allocations and fees)
- Simulation controls for demo: advance time, trigger claim events per verification type, reset

This shows NextBlock as infrastructure: "Any vault manager can build a strategy from these building blocks."

### 5.5 Frontend Overview

The prototype frontend has three pages plus an inline sidebar:

1. **Vault Discovery** -- 8 vault cards with name, manager, APY, risk level, TVL, policy count, verification types
2. **Vault Detail** -- Policy breakdown, allocation weights, yield accrual, deployment ratio, with inline deposit/withdraw sidebar (Morpho-style)
3. **Admin / Curator** -- Vault management, simulation controls, policy pool

---

## 6. Off-Chain Insurance (Traditional Lines)

Off-chain policies represent the connection between NextBlock and traditional insurance. The insurer has an existing portfolio, tokenizes it through NextBlock, and claims are assessed manually by the insurer.

The key difference from on-chain and oracle-dependent policies: there is no oracle involved. The insurer directly approves the claim after manual assessment. Only the `INSURER_ADMIN` can trigger these claims -- not permissionless, not oracle-driven. This limitation is labeled honestly.

```
BEFORE TOKENIZATION:
  Insurer holds 100% of risk and 100% of premium
  Insurer's capital is LOCKED backing these policies

AFTER TOKENIZATION (quota share cession of in-force book):
  Insurer retains 50% of risk, gets 50% of remaining unearned premium
  Vault investors take 50% of risk, get 50% of remaining unearned premium
  Insurer's capital is FREED -- they can write new business
```

This is where blockchain is infrastructure, not verification. The policy exists on-chain for transparency and liquidity. But the claim decision is made by a human. Vault managers can choose whether to include off-chain policies or not -- some vaults (e.g., Digital Asset Shield) explicitly exclude them.

Braino's predictive AI is particularly valuable for off-chain policies where manual assessment benefits from data-driven risk evaluation. AI-powered loss ratio prediction helps vault managers assess off-chain policy risk with higher confidence, bridging the trust gap between fully automated on-chain claims and manual insurer assessments.

---

## 7. Prototype Overview

The prototype is deployed on Base Sepolia with 13 policies across all three verification types and 8 vaults demonstrating diverse strategies. For implementation details, see the [Technical Specification](hackathon-technical-spec.md).

### 7.1 Policies (13)

| ID  | Name                   | Verification     | Coverage | Premium (rate) | Duration |
| --- | ---------------------- | ---------------- | -------- | -------------- | -------- |
| P1  | BTC Price Protection   | On-chain         | $50,000  | $2,500 (5%)    | 90 days  |
| P2  | Flight Delay           | Oracle-dependent | $15,000  | $1,200 (8%)    | 60 days  |
| P3  | Commercial Fire        | Off-chain        | $40,000  | $2,400 (6%)    | 180 days |
| P4  | ETH Crash Protection   | On-chain         | $30,000  | $1,800 (6%)    | 90 days  |
| P5  | BTC Catastrophe Cover  | On-chain         | $100,000 | $6,000 (6%)    | 180 days |
| P6  | Stablecoin Depeg Guard | On-chain         | $25,000  | $3,000 (12%)   | 365 days |
| P7  | Hurricane Season Cover | Oracle-dependent | $80,000  | $8,000 (10%)   | 180 days |
| P8  | Earthquake Protection  | Oracle-dependent | $60,000  | $4,200 (7%)    | 365 days |
| P9  | Drought Index          | Oracle-dependent | $20,000  | $2,000 (10%)   | 120 days |
| P10 | Marine Cargo           | Off-chain        | $45,000  | $3,600 (8%)    | 90 days  |
| P11 | Professional Liability | Off-chain        | $35,000  | $1,750 (5%)    | 365 days |
| P12 | Cyber Insurance        | Off-chain        | $70,000  | $5,600 (8%)    | 180 days |
| P13 | Equipment Breakdown    | Off-chain        | $55,000  | $3,850 (7%)    | 365 days |

Distribution: 4 on-chain, 4 oracle-dependent, 5 off-chain. Total coverage: $625,000. Total annual premium equivalent: ~$45,900.

### 7.2 Vaults (8)

| Vault | Name                    | Policies            | Buffer | Fee   | Strategy                                                                 |
| ----- | ----------------------- | ------------------- | ------ | ----- | ------------------------------------------------------------------------ |
| A     | Balanced Core           | P1,P2,P3,P7,P10     | 20%    | 0.5%  | Full-spectrum diversification across all verification types              |
| B     | Digital Asset Shield    | P1,P4,P5,P6         | 25%    | 1.0%  | On-chain only -- automated verification, no human in the loop            |
| C     | Parametric Shield       | P2,P7,P8,P9         | 25%    | 0.75% | Oracle-dependent only -- real-world parametric events                    |
| D     | Conservative Yield      | P3,P10,P11,P13      | 30%    | 0.25% | Off-chain traditional lines -- lower yield, higher buffer                |
| E     | Catastrophe & Specialty | P5,P7,P8,P12        | 20%    | 1.5%  | High-coverage cat and specialty risks -- higher yield, higher volatility |
| F     | Traditional Lines       | P3,P10,P11          | 25%    | 0.5%  | Pure traditional insurance -- commercial and professional                |
| G     | Technology & Specialty  | P6,P12,P13          | 20%    | 1.0%  | Emerging tech risks -- cyber, stablecoin, equipment                      |
| H     | Multi-Line Diversified  | P1,P2,P3,P7,P10,P12 | 20%    | 0.75% | Maximum diversification across 6 policies and all verification types     |

Policies are shared across vaults (e.g., P1 appears in vaults A, B, and H). Each vault independently backs and processes claims for shared policies -- demonstrating the platform thesis.

### 7.3 Smart Contracts

6 contracts: MockUSDC, MockOracle, PolicyRegistry, InsuranceVault (ERC-4626), VaultFactory, ClaimReceipt (soulbound ERC-721). Built with Solidity 0.8.24, OpenZeppelin v5.5, Foundry. Frontend: Next.js, React 19, wagmi v2, Tailwind CSS. See [Technical Specification](hackathon-technical-spec.md) for full implementation details.

### 7.4 Deferred to Production

- Braino AI integration (risk scoring, reporting, profiling, professional UI)
- ERC-3643 compliance wrapper for institutional distribution
- PT/YT split (Pendle-style) for secondary liquidity
- NXB governance / utility token
- Real oracle integration (prototype uses mocks)
- Multi-pool aggregation (10-20 pools across DeFi, parametric, and reinsurance)
- Policyholder-facing flows
- Redemption gates and protocol-owned liquidity

---

## 8. Competitive Position

No competitor in the tokenized insurance space offers the combination of open infrastructure, multi-asset aggregation, and AI-powered institutional analytics:

| Capability                  | OnRe Finance                         | Nexus Mutual                    | Ensuro                         | NextBlock + Braino                                         |
| --------------------------- | ------------------------------------ | ------------------------------- | ------------------------------ | ---------------------------------------------------------- |
| **Architecture**            | Single reinsurance pool, Solana-only | DeFi insurance mutual, Ethereum | Single parametric protocol     | Open vault infrastructure, any chain                       |
| **Risk Analytics**          | Basic pool metrics                   | Community-driven assessments    | Parametric-only, limited scope | AI risk scoring, loss prediction (Braino)                  |
| **Institutional Reporting** | Manual, not structured               | On-chain data only              | Basic dashboards               | 2.4M+ reports/yr, compliance-ready (Braino)                |
| **Investor Profiling**      | Not available                        | Not available                   | Not available                  | MiFID II suitability matching (Braino)                     |
| **Professional UI**         | Standard DeFi interface              | Crypto-native interface         | Minimal interface              | COGNITIVE PRO-style institutional dashboard                |
| **Asset Coverage**          | Reinsurance only                     | DeFi only                       | Parametric only                | Multi-asset: DeFi + parametric + reinsurance + traditional |
| **Liquidity**               | Quarterly redemptions                | 91d-2yr withdrawal              | Protocol-dependent             | Liquidity buffer + secondary market + redemption queue     |

### Structural Advantages

1. **Open infrastructure (Morpho-style)**: Only platform where third-party vault managers can deploy insurance yield strategies independently
2. **Verification taxonomy**: Honest framework showing where blockchain adds trustless verification vs. automation vs. transparency
3. **Multi-asset aggregation**: Covers DeFi + parametric + reinsurance + traditional (10-20 pools vs. competitors' single pool)
4. **On-chain transparency**: Every premium, claim, and fee verifiable on-chain. Soulbound claim receipts provide auditable settlement trail
5. **AI analytics (Braino)**: Institutional-grade risk tooling that no competitor offers. Banks require this level of risk infrastructure before allocating treasury capital

---

## 9. Roadmap

### Prototype (Built)

13 policies across 3 verification types, 8 vaults with diverse strategies, full claim verification demo with three distinct trigger paths. Smart contracts deployed on Base Sepolia. Frontend with vault discovery, detail pages, and admin/curator controls. See [Technical Specification](hackathon-technical-spec.md).

### MVP (Next)

- Braino AI integration: risk scoring API, institutional reporting, investor profiling
- ERC-3643 compliance wrapper for institutional distribution channels
- First institutional pilot with bank treasury allocation
- Mainnet deployment on Base

### Production

- Multi-pool aggregation (10-20 pools across DeFi insurance, parametric, and reinsurance)
- PT/YT split (Pendle-style) for secondary liquidity and yield trading
- NXB governance token (staking for yield boost, funded by protocol revenue)
- Bank distribution via B2B2C channel
- Redemption gates, protocol-owned liquidity, and advanced liquidity management
