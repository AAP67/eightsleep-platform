'use client'

import { useState, useEffect, useMemo } from 'react'

// ============================================================
// INTEGRATION DATA
// ============================================================
const INTEGRATIONS = [
  {
    id: 'strava',
    name: 'Strava',
    icon: '🏃',
    category: 'Fitness',
    signals: ['workout type', 'timing', 'intensity', 'heart rate'],
    color: '#f97316',
    dataPoints: 4,
  },
  {
    id: 'calm',
    name: 'Calm',
    icon: '🧘',
    category: 'Meditation',
    signals: ['session type', 'duration', 'time of day', 'completion'],
    color: '#3b82f6',
    dataPoints: 4,
  },
  {
    id: 'noom',
    name: 'Noom',
    icon: '🍽️',
    category: 'Nutrition',
    signals: ['meal timing', 'calories', 'alcohol', 'caffeine'],
    color: '#22c55e',
    dataPoints: 5,
  },
  {
    id: 'peloton',
    name: 'Peloton',
    icon: '🚴',
    category: 'Fitness',
    signals: ['class type', 'output', 'heart rate', 'schedule'],
    color: '#ef4444',
    dataPoints: 4,
  },
  {
    id: 'zyrtec',
    name: 'Zyrtec',
    icon: '🌿',
    category: 'Allergy',
    signals: ['AQI', 'pollen', 'medication', 'outdoor time'],
    color: '#2dd4bf',
    dataPoints: 4,
  },
  {
    id: 'whoop',
    name: 'Whoop',
    icon: '⌚',
    category: 'Wearable',
    signals: ['strain', 'recovery', 'HRV baseline', 'activity'],
    color: '#a855f7',
    dataPoints: 5,
  },
  {
    id: 'headspace',
    name: 'Headspace',
    icon: '🧠',
    category: 'Mental Health',
    signals: ['focus sessions', 'stress check-ins', 'wind-down', 'mood'],
    color: '#f59e0b',
    dataPoints: 4,
  },
  {
    id: 'macrofactor',
    name: 'MacroFactor',
    icon: '📊',
    category: 'Nutrition',
    signals: ['macros', 'meal timing', 'hydration', 'supplements'],
    color: '#06b6d4',
    dataPoints: 5,
  },
]

// ============================================================
// FLYWHEEL RING (animated SVG)
// ============================================================
function FlywheelRing({ connected, total }) {
  const speed = connected === 0 ? 0 : 20 / (connected * 0.7)
  const opacity = Math.min(0.15 + connected * 0.1, 0.9)

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Outer spinning ring */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 200"
        style={{
          animation: connected > 0 ? `spin ${speed}s linear infinite` : 'none',
        }}
      >
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={opacity} />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity={opacity * 0.7} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={opacity} />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="none" stroke="url(#ringGrad)" strokeWidth="2" strokeDasharray={`${connected * 40} ${(total - connected) * 40}`} strokeLinecap="round" />
      </svg>

      {/* Inner ring */}
      <svg
        className="absolute inset-6 md:inset-8"
        viewBox="0 0 200 200"
        style={{
          animation: connected > 0 ? `spinReverse ${speed * 1.5}s linear infinite` : 'none',
        }}
      >
        <circle cx="100" cy="100" r="85" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray={`${connected * 30} ${(total - connected) * 30}`} strokeLinecap="round" opacity={opacity * 0.5} />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">🛏️</div>
          <div className="text-[10px] font-bold text-blue-400 tracking-wider mt-1">EIGHT SLEEP</div>
          <div className="text-3xl font-bold text-white mt-1">{connected}</div>
          <div className="text-[10px] text-slate-500">integrations</div>
        </div>
      </div>

      {/* Connected app icons orbiting */}
      {INTEGRATIONS.slice(0, connected).map((app, i) => {
        const angle = (i / Math.max(connected, 1)) * 360 - 90
        const radius = 46
        const x = 50 + radius * Math.cos((angle * Math.PI) / 180)
        const y = 50 + radius * Math.sin((angle * Math.PI) / 180)
        return (
          <div
            key={app.id}
            className="absolute w-8 h-8 rounded-full bg-[#12121a] border border-slate-700 flex items-center justify-center text-sm transition-all duration-700"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              borderColor: app.color + '60',
            }}
          >
            {app.icon}
          </div>
        )
      })}

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </div>
  )
}

// ============================================================
// METRICS PANEL
// ============================================================
function MetricsPanel({ connected }) {
  const metrics = useMemo(() => {
    const base = {
      signalsPerNight: 8,
      patternAccuracy: 62,
      recommendationROI: 0,
      userModelDepth: 1,
      competitiveGap: 0,
      dataPointsDaily: 8,
    }

    const perApp = [
      { signals: 4, accuracy: 5, roi: 3, depth: 0.8, gap: 8, points: 4 },
      { signals: 4, accuracy: 6, roi: 4, depth: 1.0, gap: 10, points: 4 },
      { signals: 5, accuracy: 4, roi: 5, depth: 1.2, gap: 12, points: 5 },
      { signals: 4, accuracy: 3, roi: 3, depth: 0.9, gap: 9, points: 4 },
      { signals: 4, accuracy: 4, roi: 3, depth: 0.7, gap: 7, points: 4 },
      { signals: 5, accuracy: 3, roi: 4, depth: 1.1, gap: 11, points: 5 },
      { signals: 4, accuracy: 5, roi: 4, depth: 0.9, gap: 8, points: 4 },
      { signals: 5, accuracy: 3, roi: 3, depth: 1.0, gap: 10, points: 5 },
    ]

    let result = { ...base }
    for (let i = 0; i < connected; i++) {
      const app = perApp[i]
      result.signalsPerNight += app.signals
      result.patternAccuracy = Math.min(96, result.patternAccuracy + app.accuracy)
      result.recommendationROI += app.roi
      result.userModelDepth += app.depth
      result.competitiveGap += app.gap
      result.dataPointsDaily += app.points
    }

    return result
  }, [connected])

  const items = [
    {
      label: 'Signals per night',
      value: metrics.signalsPerNight,
      suffix: '',
      desc: 'Data points ingested nightly',
      color: connected > 0 ? 'text-blue-400' : 'text-slate-500',
    },
    {
      label: 'Pattern accuracy',
      value: metrics.patternAccuracy,
      suffix: '%',
      desc: 'Attribution confidence',
      color: metrics.patternAccuracy > 80 ? 'text-green-400' : metrics.patternAccuracy > 70 ? 'text-amber-400' : 'text-slate-500',
    },
    {
      label: 'Recommendation impact',
      value: `+${metrics.recommendationROI}`,
      suffix: ' pts',
      desc: 'Avg sleep score improvement',
      color: metrics.recommendationROI > 15 ? 'text-green-400' : metrics.recommendationROI > 5 ? 'text-blue-400' : 'text-slate-500',
    },
    {
      label: 'User model depth',
      value: metrics.userModelDepth.toFixed(1),
      suffix: 'x',
      desc: 'vs single-source model',
      color: metrics.userModelDepth > 5 ? 'text-purple-400' : metrics.userModelDepth > 2 ? 'text-blue-400' : 'text-slate-500',
    },
    {
      label: 'Competitive moat',
      value: `+${metrics.competitiveGap}`,
      suffix: '%',
      desc: 'Data advantage vs competitors',
      color: metrics.competitiveGap > 50 ? 'text-green-400' : metrics.competitiveGap > 20 ? 'text-amber-400' : 'text-slate-500',
    },
    {
      label: 'Daily data points',
      value: metrics.dataPointsDaily,
      suffix: '',
      desc: 'Per user per day',
      color: 'text-blue-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <div key={i} className="p-4 rounded-xl bg-[#0a0a12] border border-slate-800/40 transition-all duration-500">
          <div className="text-xs text-slate-500 mb-1">{item.label}</div>
          <div className={`text-2xl font-bold transition-colors duration-500 ${item.color}`}>
            {item.value}{item.suffix}
          </div>
          <div className="text-[10px] text-slate-600 mt-1">{item.desc}</div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// MOAT VISUALIZATION
// ============================================================
function MoatChart({ connected }) {
  const years = ['Today', 'Year 1', 'Year 2', 'Year 3']
  const eightSleepData = years.map((_, i) => {
    const base = 1 + connected * 0.5
    return Math.round(base * Math.pow(1.5 + connected * 0.1, i))
  })
  const competitorData = years.map((_, i) => Math.round(1 * Math.pow(1.2, i)))
  const maxVal = Math.max(...eightSleepData, ...competitorData)

  return (
    <div className="p-6 rounded-xl bg-[#0a0a12] border border-slate-800/40">
      <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-6">Data Advantage Over Time</div>
      <div className="space-y-4">
        {years.map((year, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-xs text-slate-500 w-14 shrink-0">{year}</span>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <div
                  className="h-5 rounded-r bg-gradient-to-r from-blue-600 to-purple-500 transition-all duration-700"
                  style={{ width: `${(eightSleepData[i] / maxVal) * 100}%`, minWidth: '4px' }}
                />
                <span className="text-xs text-blue-400 font-mono">{eightSleepData[i]}x</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-5 rounded-r bg-slate-700 transition-all duration-700"
                  style={{ width: `${(competitorData[i] / maxVal) * 100}%`, minWidth: '4px' }}
                />
                <span className="text-xs text-slate-500 font-mono">{competitorData[i]}x</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-6 text-xs">
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-gradient-to-r from-blue-600 to-purple-500" /><span className="text-slate-500">Eight Sleep Platform</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-slate-700" /><span className="text-slate-500">Closed competitor</span></div>
      </div>
    </div>
  )
}

// ============================================================
// CROSS-APP INSIGHT EXAMPLES
// ============================================================
function CrossAppInsights({ connected }) {
  const allInsights = [
    { apps: ['strava'], min: 1, text: 'Evening HIIT drops your deep sleep by 11%. Morning sessions of the same intensity don\'t.', type: 'Single-app' },
    { apps: ['strava', 'calm'], min: 2, text: 'Meditation after intense workouts reduces the sleep penalty from -11% to -3%. The combination matters.', type: 'Cross-app' },
    { apps: ['strava', 'noom'], min: 3, text: 'High-carb meals within 2 hours of evening exercise compound the sleep impact. Protein meals don\'t.', type: 'Cross-app' },
    { apps: ['strava', 'calm', 'noom'], min: 3, text: 'Your optimal evening routine: moderate run → light meal before 8pm → body scan meditation. This sequence averages 86 sleep score vs 68 baseline.', type: 'Multi-app' },
    { apps: ['strava', 'peloton', 'noom', 'calm'], min: 4, text: 'Your recovery pattern: 2 intense days followed by yoga + early dinner produces the highest HRV rebound. 3 intense days in a row tanks HRV for 48 hours.', type: 'Multi-app' },
    { apps: ['strava', 'noom', 'zyrtec'], min: 5, text: 'On high-pollen days, your outdoor runs hurt sleep MORE than indoor Peloton rides of the same intensity. Environmental + exercise interaction detected.', type: 'Cross-domain' },
    { apps: ['strava', 'calm', 'noom', 'peloton', 'zyrtec', 'whoop'], min: 6, text: 'Your personal sleep formula: morning exercise + last meal before 8pm + meditation + low AQI + Pod at 67°F = 92nd percentile sleep. Missing any single factor costs 4-8 points.', type: 'Full-stack' },
    { apps: ['all'], min: 7, text: 'Across all data sources, your #1 sleep lever is meal timing (r=-0.52), followed by exercise timing (r=0.48), then meditation (r=0.31). No single app could have discovered this ranking.', type: 'Meta-insight' },
  ]

  const visible = allInsights.filter(i => connected >= i.min)

  if (visible.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-[#0a0a12] border border-slate-800/40 text-center">
        <p className="text-sm text-slate-600">Add integrations to see cross-app insights emerge</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">Insights unlocked</div>
      {visible.map((insight, i) => {
        const typeColors = {
          'Single-app': 'bg-slate-500/10 text-slate-400',
          'Cross-app': 'bg-blue-500/10 text-blue-400',
          'Multi-app': 'bg-purple-500/10 text-purple-400',
          'Cross-domain': 'bg-amber-500/10 text-amber-400',
          'Full-stack': 'bg-green-500/10 text-green-400',
          'Meta-insight': 'bg-red-500/10 text-red-400',
        }
        const isNew = insight.min === connected

        return (
          <div key={i} className={`p-4 rounded-xl bg-[#0a0a12] border transition-all duration-500 ${
            isNew ? 'border-blue-500/40 shadow-lg shadow-blue-500/5' : 'border-slate-800/40'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${typeColors[insight.type]}`}>{insight.type}</span>
              {isNew && <span className="text-[10px] text-blue-400 animate-pulse">NEW</span>}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{insight.text}</p>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================
// PAGE
// ============================================================
export default function Flywheel() {
  const [connected, setConnected] = useState(0)

  const addNext = () => {
    if (connected < INTEGRATIONS.length) setConnected(connected + 1)
  }
  const reset = () => setConnected(0)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#06060a]/90 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-lg">🛏️</span>
            <span className="text-sm font-bold text-white tracking-wide">Eight Sleep Platform</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
            <a href="/#loop" className="hover:text-white transition-colors">The Loop</a>
            <a href="/#steps" className="hover:text-white transition-colors">6 Steps</a>
            <a href="/integrations" className="hover:text-white transition-colors">Integrations</a>
            <a href="/demo" className="hover:text-white transition-colors">Demo</a>
            <a href="/api-docs" className="hover:text-white transition-colors">API</a>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-green-400 border border-green-500/30 rounded-full bg-green-500/5 mb-6">
              Network Effects
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              The Data Flywheel
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl">
              Each integration makes every other integration more valuable. Add apps one by one and watch the compounding effect.
            </p>
          </div>

          {/* Main layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Flywheel + controls */}
            <div>
              <FlywheelRing connected={connected} total={INTEGRATIONS.length} />

              {/* Add integration button */}
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={addNext}
                  disabled={connected >= INTEGRATIONS.length}
                  className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    connected >= INTEGRATIONS.length
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-slate-200'
                  }`}
                >
                  {connected >= INTEGRATIONS.length
                    ? 'All connected'
                    : `+ Add ${INTEGRATIONS[connected].name}`}
                </button>
                {connected > 0 && (
                  <button onClick={reset} className="px-4 py-3 text-sm text-slate-500 hover:text-white transition-colors cursor-pointer">
                    Reset
                  </button>
                )}
              </div>

              {/* Connected apps list */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {INTEGRATIONS.map((app, i) => (
                  <button
                    key={app.id}
                    onClick={() => setConnected(i < connected ? connected : i + 1)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all duration-500 cursor-pointer ${
                      i < connected
                        ? 'bg-[#0e0e16] border-slate-700 text-white'
                        : 'bg-[#08080d] border-slate-800/30 text-slate-600'
                    }`}
                  >
                    <span>{app.icon}</span>
                    <span>{app.name}</span>
                  </button>
                ))}
              </div>

              {/* Moat chart */}
              <div className="mt-8">
                <MoatChart connected={connected} />
              </div>
            </div>

            {/* Right: Metrics + insights */}
            <div className="space-y-8">
              <MetricsPanel connected={connected} />
              <CrossAppInsights connected={connected} />
            </div>
          </div>

          {/* Bottom punchline */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-900/20 text-center">
            <h3 className="text-2xl font-bold text-white">This is why open wins.</h3>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto leading-relaxed">
              A closed system can only build what its internal team prioritizes.
              An open platform compounds intelligence from the entire health ecosystem.
              After 8 integrations, the user model is <span className="text-white font-semibold">8x richer</span> than
              anything a single company could build. That gap widens every day.
            </p>
            <p className="mt-4 text-sm text-slate-500 max-w-md mx-auto">
              Every app that connects makes the platform more valuable for every other app.
              That&apos;s the network effect. That&apos;s the moat. That&apos;s the platform.
            </p>

            <div className="mt-8">
              <a href="/" className="px-8 py-3.5 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                ← Back to the Vision
              </a>
            </div>
          </div>
        </div>
      </main>

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
    </>
  )
}
