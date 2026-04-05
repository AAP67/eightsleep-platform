'use client'

import { useState, useEffect } from 'react'

// ============================================================
// NAV
// ============================================================
function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#06060a]/90 backdrop-blur-lg border-b border-slate-800/50' : ''
    }`}>
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛏️</span>
          <span className="text-sm font-bold text-white tracking-wide">Eight Sleep Platform</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
          <a href="#loop" className="hover:text-white transition-colors">The Loop</a>
          <a href="#steps" className="hover:text-white transition-colors">6 Steps</a>
          <a href="/integrations" className="hover:text-white transition-colors">Integrations</a>
          <a href="/demo" className="hover:text-white transition-colors">Demo</a>
          <a href="/api" className="hover:text-white transition-colors">API</a>
        </div>
      </div>
    </nav>
  )
}

// ============================================================
// HERO SECTION
// ============================================================
function Hero() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setVisible(true) }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[#06060a]">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/6 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-[0.2em] uppercase text-blue-400 border border-blue-500/30 rounded-full bg-blue-500/5">
            Product Vision
          </span>
        </div>

        <h1 className={`mt-8 transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95]">
            The Outcome Layer
          </span>
          <span className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent leading-[0.95] mt-2">
            for Every Health App
          </span>
        </h1>

        <p className={`mt-8 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Health apps guess at outcomes. Eight Sleep measures the truth — every night, passively, clinically.
          Open that data as a two-way API, and the entire health ecosystem gets smarter.
        </p>

        <div className={`mt-10 flex items-center justify-center gap-4 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <a href="#loop" className="px-8 py-3.5 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm">
            See the Loop
          </a>
          <a href="#steps" className="px-8 py-3.5 border border-slate-700 text-slate-300 font-medium rounded-lg hover:border-slate-500 transition-colors text-sm">
            The 6 Steps
          </a>
        </div>

        <div className={`mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto transition-all duration-700 delay-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { value: '1B+', label: 'Hours of sleep data' },
            { value: '35+', label: 'Countries' },
            { value: '8hrs', label: 'Nightly ground truth' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1 tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

// ============================================================
// THE PROBLEM
// ============================================================
function Problem() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          Every health app has the same problem.
        </h2>
        <p className="mt-6 text-xl text-slate-400 leading-relaxed max-w-3xl">
          They tell you what to do. They can&apos;t tell you if it worked.
        </p>

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {[
            { app: 'Calm', action: '"Meditate 20 min before bed"', question: 'Did it improve deep sleep?', icon: '🧘' },
            { app: 'Strava', action: '"Great 5K run at 6pm"', question: 'Did it help or hurt recovery?', icon: '🏃' },
            { app: 'Noom', action: '"Last meal logged at 9:30pm"', question: 'Did late eating affect REM?', icon: '🍽️' },
            { app: 'Peloton', action: '"45 min HIIT completed"', question: 'Was that too intense for tonight?', icon: '🚴' },
          ].map((item, i) => (
            <div key={i} className="group relative p-6 rounded-2xl bg-[#0e0e16] border border-slate-800/50 hover:border-slate-700/80 transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-blue-400">{item.app}</div>
                  <div className="mt-1 text-white font-medium">{item.action}</div>
                  <div className="mt-3 text-sm text-red-400/80 italic">{item.question}</div>
                  <div className="mt-1 text-xs text-slate-600">No answer. No feedback loop. No learning.</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-950/30 to-purple-950/30 border border-blue-900/20">
          <p className="text-lg text-slate-300 leading-relaxed">
            The result: <span className="text-white font-semibold">health app retention is terrible.</span> Users can&apos;t feel impact, so they churn.
            The apps that should be helping people are flying blind because they don&apos;t have <span className="text-blue-400">outcome data</span>.
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// THE FEEDBACK LOOP
// ============================================================
function FeedbackLoop() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4)
    }, 2500)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const steps = [
    {
      id: 0, label: 'Intervention', description: 'Health app sends what the user did today',
      example: 'Strava → "5K run at 6pm, moderate intensity"',
      color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30',
    },
    {
      id: 1, label: 'Measurement', description: 'Eight Sleep Pod passively measures that night',
      example: 'Pod → Sleep score 78, HRV 42ms, Deep sleep 22%',
      color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30',
    },
    {
      id: 2, label: 'Attribution', description: 'Platform correlates intervention with outcome',
      example: '"Evening runs improve this user\'s deep sleep by 14%"',
      color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30',
    },
    {
      id: 3, label: 'Feedback', description: 'Insight flows back — app adjusts its recommendation',
      example: 'Strava ← "Suggest evening runs more often for this user"',
      color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30',
    },
  ]

  return (
    <section id="loop" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white">The Two-Way Feedback Loop</h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Eight Sleep becomes the ground truth. Every health app plugs in, measures what works, and gets smarter.
          </p>
        </div>

        <div className="mt-20 relative">
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#0e0e16] border-2 border-blue-500/40 items-center justify-center z-10">
            <div className="text-center">
              <div className="text-2xl">🛏️</div>
              <div className="text-[10px] font-semibold text-blue-400 mt-1 tracking-wider">EIGHT SLEEP</div>
              <div className="text-[9px] text-slate-500">Ground Truth</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"
               onMouseEnter={() => setIsAutoPlaying(false)}
               onMouseLeave={() => setIsAutoPlaying(true)}>
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => { setActiveStep(step.id); setIsAutoPlaying(false) }}
                className={`text-left p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                  activeStep === step.id
                    ? `${step.bg} ${step.border} scale-[1.02] shadow-lg`
                    : 'bg-[#0a0a12] border-slate-800/40 opacity-50 hover:opacity-75'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-mono font-bold ${activeStep === step.id ? step.color : 'text-slate-600'}`}>
                    {step.id + 1}
                  </span>
                  <div>
                    <div className={`text-sm font-bold tracking-wide ${activeStep === step.id ? step.color : 'text-slate-500'}`}>
                      {step.label}
                    </div>
                    <div className={`text-sm mt-0.5 ${activeStep === step.id ? 'text-slate-300' : 'text-slate-600'}`}>
                      {step.description}
                    </div>
                  </div>
                </div>
                <div className={`mt-4 text-xs font-mono px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeStep === step.id ? 'bg-black/30 text-slate-300' : 'bg-transparent text-slate-700'
                }`}>
                  {step.example}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeStep === step.id ? `${step.color.replace('text-', 'bg-')} scale-125` : 'bg-slate-700'
                  }`} />
                  {i < steps.length - 1 && (
                    <div className={`w-8 h-px transition-all duration-300 ${
                      activeStep > i ? 'bg-slate-500' : 'bg-slate-800'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            The loop repeats every night. Each cycle makes the app smarter about <span className="text-white">this specific user</span>.
            After 30 days, Strava doesn&apos;t just know you ran — it knows exactly how running affects <em>your</em> sleep.
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// THE 6 STEPS
// ============================================================
function PlatformSteps() {
  const steps = [
    { number: '01', title: 'Inbound Data Layer', status: 'Live today', statusColor: 'text-green-400 bg-green-500/10',
      description: 'External context flows into Eight Sleep. Activity data from Apple Health, wearables via Terra, workout metrics. One-directional — data comes in to improve Autopilot.',
      detail: 'Eight Sleep already does this. The foundation exists.' },
    { number: '02', title: 'Outcome Attribution API', status: 'The unlock', statusColor: 'text-blue-400 bg-blue-500/10',
      description: 'Eight Sleep opens a read-only API. Partner apps query: "My user did X — what happened to their sleep?" They get attributed outcomes back. Eight Sleep keeps the raw data.',
      detail: 'Low risk. You\'re sharing insights, not biometrics.' },
    { number: '03', title: 'Closed-Loop Feedback', status: 'The flywheel starts', statusColor: 'text-purple-400 bg-purple-500/10',
      description: 'Apps adjust recommendations based on outcomes. Strava stops suggesting evening HIIT for users whose sleep it hurts. Noom nudges earlier meals for users whose REM is affected.',
      detail: 'Every improvement generates new data that flows back to Eight Sleep.' },
    { number: '04', title: 'Pod as Actuator', status: 'The platform moment', statusColor: 'text-amber-400 bg-amber-500/10',
      description: 'Trusted partners get scoped write access to Pod controls. Calm triggers a pre-sleep temperature ramp. A fertility app adjusts Pod temp based on cycle phase.',
      detail: 'The Pod becomes programmable infrastructure.' },
    { number: '05', title: 'Health Intelligence Network', status: 'The data moat', statusColor: 'text-red-400 bg-red-500/10',
      description: 'Dozens of apps sending interventions and reading outcomes. Eight Sleep builds the largest dataset of "what actually affects human health, measured nightly, across millions."',
      detail: 'This is the dataset that powers the Longevity Twin.' },
    { number: '06', title: 'Monetization Layer', status: 'The business', statusColor: 'text-emerald-400 bg-emerald-500/10',
      description: 'Revenue share on premium insights. Enterprise API pricing. Anonymized cohort data for research and pharma. "Eight Sleep Verified" certification for apps that prove they improve outcomes.',
      detail: 'Each step is independently valuable. No big-bang required.' },
  ]

  return (
    <section id="steps" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white">6 Steps to Becoming the Platform</h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">Each step is independently valuable. Each one makes the next obvious.</p>
        </div>

        <div className="relative">
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-transparent" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="relative pl-16">
                <div className="absolute left-0 top-0 w-[54px] h-[54px] rounded-full bg-[#0e0e16] border border-slate-800 flex items-center justify-center">
                  <span className="text-sm font-mono font-bold text-slate-400">{step.number}</span>
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    <span className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${step.statusColor}`}>
                      {step.status}
                    </span>
                  </div>
                  <p className="mt-3 text-slate-400 leading-relaxed">{step.description}</p>
                  <p className="mt-2 text-sm text-slate-600 italic">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// VALUE PROPOSITION
// ============================================================
function ValueProp() {
  const stakeholders = [
    { who: 'For Health Apps', icon: '📱', color: 'from-green-500/20 to-green-500/0', borderColor: 'border-green-500/20',
      points: [
        'Finally prove your product works — with clinical-grade data',
        'Personalize recommendations per user, not per cohort',
        'Reduce churn by showing measurable sleep improvement',
        'Access the highest-fidelity overnight biometric stream available',
      ] },
    { who: 'For Eight Sleep', icon: '🛏️', color: 'from-blue-500/20 to-blue-500/0', borderColor: 'border-blue-500/20',
      points: [
        'Build the data moat no competitor can replicate',
        'Revenue from API access and premium insights',
        'User lock-in — 3 connected apps means they never switch',
        'Richer user models than you could ever build alone',
      ] },
    { who: 'For Users', icon: '🧬', color: 'from-purple-500/20 to-purple-500/0', borderColor: 'border-purple-500/20',
      points: [
        'Every health app you use actually learns what works for you',
        'Your Pod adapts to your full life, not just body temperature',
        'One source of truth across all your health tools',
        'Interventions backed by your own overnight data',
      ] },
  ]

  return (
    <section className="py-32 px-6 bg-[#08080d]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white">Everyone wins.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {stakeholders.map((s, i) => (
            <div key={i} className={`relative p-8 rounded-2xl bg-gradient-to-b ${s.color} border ${s.borderColor} overflow-hidden`}>
              <span className="text-4xl">{s.icon}</span>
              <h3 className="mt-4 text-lg font-bold text-white">{s.who}</h3>
              <ul className="mt-6 space-y-3">
                {s.points.map((point, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="text-slate-600 mt-0.5">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// THE ANALOGY
// ============================================================
function Analogy() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Apple tried to own health and fitness entirely.
        </h2>
        <p className="mt-6 text-lg text-slate-400 leading-relaxed">
          It didn&apos;t work until they opened HealthKit and let every app plug in.
          The platform became more valuable than any single feature they could have built.
        </p>

        <div className="mt-16 grid grid-cols-2 gap-8 max-w-lg mx-auto">
          <div className="p-6 rounded-2xl bg-red-950/20 border border-red-900/20">
            <div className="text-sm font-bold text-red-400">Closed</div>
            <p className="mt-2 text-sm text-slate-500">
              Build every insight in-house. Limited by internal roadmap. Hundreds of features.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-green-950/20 border border-green-900/20">
            <div className="text-sm font-bold text-green-400">Open</div>
            <p className="mt-2 text-sm text-slate-500">
              Ecosystem builds the intelligence. Own the data layer. Thousands of use cases.
            </p>
          </div>
        </div>

        <p className="mt-12 text-slate-500 text-sm italic max-w-md mx-auto">
          Eight Sleep will never build a better meditation app than Calm, or a better nutrition tracker than Noom.
          But it can make all of them better.
        </p>
      </div>
    </section>
  )
}

// ============================================================
// CTA
// ============================================================
function CTA() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-b from-blue-950/30 to-[#08080d] border border-blue-900/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Explore the vision</h2>
          <p className="mt-4 text-slate-400 max-w-md mx-auto">
            See how the feedback loop works with real data, explore the API, and understand the flywheel.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/integrations" className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm text-center">
              Integration Showcase
            </a>
            <a href="/demo" className="w-full sm:w-auto px-8 py-3.5 border border-slate-700 text-slate-300 font-medium rounded-lg hover:border-slate-500 transition-colors text-sm text-center">
              Live Demo
            </a>
            <a href="/api" className="w-full sm:w-auto px-8 py-3.5 border border-slate-700 text-slate-300 font-medium rounded-lg hover:border-slate-500 transition-colors text-sm text-center">
              API Docs
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-slate-800/50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-600">
          A product vision by <a href="https://francium77.com" className="text-slate-400 hover:text-white transition-colors">Karan</a>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-600">
          <a href="https://github.com/AAP67" className="hover:text-slate-400 transition-colors">GitHub</a>
          <a href="https://francium77.com" className="hover:text-slate-400 transition-colors">Portfolio</a>
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// PAGE
// ============================================================
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <FeedbackLoop />
        <PlatformSteps />
        <ValueProp />
        <Analogy />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
