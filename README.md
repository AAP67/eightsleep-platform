# Eight Sleep Platform

**The Outcome Layer for Every Health App**

Health apps guess at outcomes. Eight Sleep measures the truth — every night, passively, clinically. This is a product vision prototype demonstrating how Eight Sleep can become the platform that closes the feedback loop for the entire health ecosystem.

## Live Demo

→ [View the site](https://eightsleep-platform.vercel.app)

## The Thesis

Every health app has the same problem: they can't prove they work. Calm can't prove meditation improves sleep. Strava can't prove your evening run helped recovery. Eight Sleep sits on the richest continuous biometric dataset in consumer hardware — open that data as a two-way API, and every health app gets smarter while Eight Sleep builds an unassailable data moat.

## Pages

| Page | Route | What it shows |
|------|-------|---------------|
| **Landing** | `/` | Core thesis, feedback loop diagram, 6-step platform journey, value prop |
| **Integrations** | `/integrations` | 5 real health apps (Strava, Calm, Noom, Peloton, Zyrtec) with full data exchange specs |
| **Live Demo** | `/demo` | Working Strava × Eight Sleep feedback loop — 120 days of data, pattern discovery, recommendation, measurable improvement |
| **API Docs** | `/api-docs` | Developer portal with endpoints, OAuth, permission scopes, rate limits, webhooks, quickstart |
| **Flywheel** | `/flywheel` | Interactive network effects visualization — add integrations and watch the moat widen |

## The 6-Step Platform Journey

1. **Inbound Data Layer** — External context flows in (already live via Terra/Apple Health)
2. **Outcome Attribution API** — Partner apps query sleep outcomes of their interventions
3. **Closed-Loop Feedback** — Apps adjust recommendations based on outcomes
4. **Pod as Actuator** — Trusted partners get scoped write access to Pod controls
5. **Health Intelligence Network** — Cross-app data creates an unassailable moat
6. **Monetization Layer** — Revenue share, enterprise API, cohort data licensing

## Tech Stack

- **Framework:** Next.js 14 (App Router, static export)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Fonts:** DM Sans + JetBrains Mono
- **Data:** Synthetic (90-120 days, seeded for reproducibility)
- **Deploy:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect the GitHub repo to Vercel for automatic deploys.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.js              # Landing page
│   │   ├── layout.js            # Root layout + meta
│   │   ├── globals.css          # Global styles
│   │   ├── integrations/        # Integration showcase
│   │   ├── demo/                # Live feedback loop demo
│   │   ├── api-docs/            # Developer portal
│   │   └── flywheel/            # Network effects visualization
│   └── lib/
│       ├── attribution.js       # Correlation engine
│       └── demo-data.js         # Strava demo data generator
├── public/data/
│   └── sleepstack-data.json     # 90-day synthetic dataset
├── generate-data.js             # Full dataset generator
└── README.md
```

Built by [Karan](https://francium77.com) | [GitHub](https://github.com/AAP67)
