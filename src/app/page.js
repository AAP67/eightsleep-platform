'use client'

import { useState, useEffect } from 'react'

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#06060a]/90 backdrop-blur-lg border-b border-slate-800/50' : ''
    }`}>
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛏️</span>
          <span className="text-sm font-bold text-white tracking-wide">Eight Sleep Platform</span>
        </div>
        <a href="/demo" className="text-sm text-slate-400 hover:text-white transition-colors">See it work →</a>
      </div>
    </nav>
  )
}

function Hero() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setVisible(true) }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[#06060a]">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/6 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h1 className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="block text-5xl md:text-7xl font-bold tracking-tight text-white leading-[0.95]">
            Every health app
          </span>
          <span className="block text-5xl md:text-7xl font-bold tracking-tight text-white leading-[0.95] mt-2">
            is flying blind.
          </span>
        </h1>

        <p className={`mt-8 text-lg md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          They tell you what to do. They can&apos;t tell you if it worked.
          Eight Sleep can fix that for all of them.
        </p>

        <div className={`mt-10 transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <a href="#problem" className="px-8 py-3.5 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm">
            Here&apos;s how
          </a>
        </div>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section id="problem" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#0e0e16] border border-slate-800/50">
            <span className="text-2xl">🏃</span>
            <div className="mt-3 text-white font-semibold">Strava</div>
            <div className="mt-1 text-sm text-slate-400">&ldquo;Great 5K run at 6pm!&rdquo;</div>
            <div className="mt-4 text-sm text-red-400/80 italic">Did it help or hurt your sleep?</div>
            <div className="text-xs text-slate-600 mt-1">Strava will never know.</div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e0e16] border border-slate-800/50">
            <span className="text-2xl">🧘</span>
            <div className="mt-3 text-white font-semibold">Calm</div>
            <div className="mt-1 text-sm text-slate-400">&ldquo;20 min meditation before bed&rdquo;</div>
            <div className="mt-4 text-sm text-red-400/80 italic">Did it actually improve deep sleep?</div>
            <div className="text-xs text-slate-600 mt-1">Calm will never know.</div>
          </div>
        </div>

        <p className="mt-10 text-lg text-slate-300 leading-relaxed text-center max-w-xl mx-auto">
          These apps can&apos;t measure outcomes. So users can&apos;t feel impact. So they churn.
          <span className="block mt-3 text-white font-semibold">Eight Sleep has the outcome data they&apos;re missing.</span>
        </p>
      </div>
    </section>
  )
}

function TheLoop() {
  const [step, setStep] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto) return
    const t = setInterval(() => setStep(s => (s + 1) % 3), 3000)
    return () => clearInterval(t)
  }, [auto])

  const steps = [
    {
      num: '1',
      title: 'App sends what happened',
      example: 'Strava → "5K run at 6pm, moderate intensity"',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
    },
    {
      num: '2',
      title: 'Eight Sleep measures the night',
      example: 'Pod → sleep score 78, deep sleep +14%, HRV +6ms',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
    {
      num: '3',
      title: 'Insight flows back — app gets smarter',
      example: 'Strava ← "Evening runs improve this user\'s sleep. Suggest more."',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
  ]

  return (
    <section className="py-24 px-6 bg-[#08080d]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
          The feedback loop.
        </h2>
        <p className="mt-3 text-slate-400 text-center max-w-md mx-auto">
          Health apps send context in. Eight Sleep measures the outcome. The insight flows back. Repeat every night.
        </p>

        <div className="mt-12 space-y-4"
             onMouseEnter={() => setAuto(false)}
             onMouseLeave={() => setAuto(true)}>
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => { setStep(i); setAuto(false) }}
              className={`w-full text-left p-5 rounded-xl border transition-all duration-500 cursor-pointer ${
                step === i
                  ? `${s.bg} ${s.border}`
                  : 'bg-[#0a0a12] border-slate-800/30 opacity-40'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className={`text-2xl font-bold font-mono ${step === i ? s.color : 'text-slate-700'}`}>{s.num}</span>
                <div>
                  <div className={`font-semibold ${step === i ? 'text-white' : 'text-slate-600'}`}>{s.title}</div>
                  <div className={`mt-1.5 text-xs font-mono ${step === i ? 'text-slate-400' : 'text-slate-700'}`}>{s.example}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 max-w-sm mx-auto">
          After 30 nights, Strava doesn&apos;t just know you ran — it knows how running affects <em>your</em> sleep. Multiply this by every health app.
        </p>
      </div>
    </section>
  )
}

function WhyThisMatters() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
          Why Eight Sleep.
        </h2>

        <div className="mt-10 space-y-6 max-w-xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-blue-400 text-xs font-bold">1</span>
            </div>
            <div>
              <div className="text-white font-semibold">Only device that measures passively, every night, for 8 hours</div>
              <div className="text-sm text-slate-500 mt-1">No wearable friction. No self-reporting. Just sleep on it.</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-blue-400 text-xs font-bold">2</span>
            </div>
            <div>
              <div className="text-white font-semibold">1 billion+ hours of biometric data already collected</div>
              <div className="text-sm text-slate-500 mt-1">The dataset exists. The infrastructure exists. This is an unlock, not a build.</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-blue-400 text-xs font-bold">3</span>
            </div>
            <div>
              <div className="text-white font-semibold">The Pod can act, not just report</div>
              <div className="text-sm text-slate-500 mt-1">Temperature, elevation, alarms — the Pod adjusts based on what the ecosystem learns. No other device closes this loop.</div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-900/20 text-center max-w-xl mx-auto">
          <p className="text-slate-300 leading-relaxed">
            Each app that connects makes Eight Sleep&apos;s data richer. Each insight makes every connected app smarter. The user model compounds. The moat widens. No competitor can replicate a dataset built by the entire health ecosystem.
          </p>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white">See it work.</h2>
        <p className="mt-3 text-slate-400">
          120 days of data. One integration. Watch the system discover what works, send the insight back, and improve sleep.
        </p>
        <div className="mt-8">
          <a href="/demo" className="px-10 py-4 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm">
            Live Demo →
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-slate-800/50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="text-sm text-slate-600">
          A product vision by <a href="https://francium77.com" className="text-slate-400 hover:text-white transition-colors">Karan</a>
        </div>
        <a href="https://github.com/AAP67" className="text-sm text-slate-600 hover:text-slate-400 transition-colors">GitHub</a>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <TheLoop />
        <WhyThisMatters />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
