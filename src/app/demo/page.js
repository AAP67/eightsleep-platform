'use client'

import { useState, useMemo } from 'react'
import { generateDemoData } from '../../lib/demo-data'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, ReferenceArea, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts'

// ============================================================
// STEP NAVIGATION
// ============================================================
const STEPS = [
  { id: 0, label: '90 Days of Data', tag: 'Collect' },
  { id: 1, label: 'Patterns Discovered', tag: 'Analyze' },
  { id: 2, label: 'Recommendation Sent', tag: 'Feedback' },
  { id: 3, label: 'The Result', tag: 'Impact' },
]

// ============================================================
// CUSTOM TOOLTIP
// ============================================================
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null

  return (
    <div className="bg-[#12121a] border border-slate-700 rounded-lg px-4 py-3 shadow-xl text-xs">
      <div className="text-slate-400 mb-1">{d.date}</div>
      <div className="text-white font-semibold">{d.workout?.type || 'Rest'}</div>
      {d.workout?.time && <div className="text-slate-500">at {d.workout.time}</div>}
      <div className="mt-2 space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Sleep Score</span>
          <span className="text-blue-400 font-mono">{d.sleep?.score}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Deep Sleep</span>
          <span className="text-purple-400 font-mono">{d.sleep?.deepSleepPct}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">HRV</span>
          <span className="text-green-400 font-mono">{d.sleep?.hrv}ms</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// STEP 0 — Raw Data
// ============================================================
function StepCollect({ data }) {
  const chartData = data.filter(d => d.phase === 'discovery').map(d => ({
    ...d,
    dayLabel: `Day ${d.day}`,
    scoreColor: d.workout.type === 'Evening HIIT' ? '#ef4444' :
                d.workout.timeOfDay === 'morning' ? '#22c55e' :
                d.workout.category === 'rest' ? '#6b7280' : '#3b82f6',
  }))

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white">90 Days: Strava Workouts × Eight Sleep Scores</h3>
        <p className="mt-2 text-sm text-slate-400">Every dot is a night. Color = workout type that day. The pattern isn&apos;t obvious yet — that&apos;s why you need the platform.</p>
      </div>

      <div className="p-6 rounded-xl bg-[#0a0a12] border border-slate-800/40">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
            <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} interval={9} />
            <YAxis domain={[40, 100]} tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={72} stroke="#334155" strokeDasharray="4 4" label={{ value: 'Avg', fill: '#475569', fontSize: 10 }} />
            <Line type="monotone" dataKey="sleep.score" stroke="#3b82f6" strokeWidth={1.5} dot={(props) => {
              const { cx, cy, payload } = props
              const color = payload.scoreColor
              return <circle key={props.key} cx={cx} cy={cy} r={3} fill={color} fillOpacity={0.8} stroke="none" />
            }} />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /><span className="text-slate-500">Morning workout</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span className="text-slate-500">Evening moderate</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="text-slate-500">Evening HIIT</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-gray-500" /><span className="text-slate-500">Rest day</span></div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Nights tracked', value: '90', sub: 'continuous' },
          { label: 'Workouts logged', value: data.filter(d => d.phase === 'discovery' && d.workout.category !== 'rest').length.toString(), sub: 'from Strava' },
          { label: 'Avg sleep score', value: '72', sub: 'baseline' },
          { label: 'Data points', value: '2,160+', sub: 'per user' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-lg bg-[#0a0a12] border border-slate-800/40 text-center">
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            <div className="text-[10px] text-slate-600">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// STEP 1 — Pattern Discovery
// ============================================================
function StepAnalyze({ data, stats }) {
  const discovery = data.filter(d => d.phase === 'discovery')

  // Group by workout type
  const groups = {}
  discovery.forEach(d => {
    const key = d.workout.type
    if (!groups[key]) groups[key] = { scores: [], type: d.workout.type, timeOfDay: d.workout.timeOfDay, category: d.workout.category }
    groups[key].scores.push(d.sleep.score)
  })

  const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length
  const barData = Object.values(groups)
    .map(g => ({
      type: g.type,
      avgScore: parseFloat(mean(g.scores).toFixed(1)),
      count: g.scores.length,
      timeOfDay: g.timeOfDay,
      category: g.category,
    }))
    .sort((a, b) => b.avgScore - a.avgScore)

  const getBarColor = (entry) => {
    if (entry.type === 'Evening HIIT') return '#ef4444'
    if (entry.timeOfDay === 'morning') return '#22c55e'
    if (entry.category === 'light') return '#a78bfa'
    return '#3b82f6'
  }

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white">Pattern Discovery: What Actually Affects Your Sleep</h3>
        <p className="mt-2 text-sm text-slate-400">The attribution engine correlates each workout type with sleep outcomes. One pattern jumps out immediately.</p>
      </div>

      <div className="p-6 rounded-xl bg-[#0a0a12] border border-slate-800/40">
        <div className="text-xs text-slate-500 mb-4">Average sleep score by workout type</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 10, right: 10, bottom: 40, left: 0 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
            <XAxis type="number" domain={[55, 85]} tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="type" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} width={120} />
            <Tooltip
              contentStyle={{ background: '#12121a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: '#e2e8f0' }}
              formatter={(val, name) => [`${val} avg score`, `${barData.find(d => d.avgScore === val)?.count || ''} nights`]}
            />
            <ReferenceLine x={mean(discovery.map(d => d.sleep.score))} stroke="#475569" strokeDasharray="4 4" />
            <Bar dataKey="avgScore" radius={[0, 4, 4, 0]} barSize={24}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry)} fillOpacity={entry.type === 'Evening HIIT' ? 1 : 0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key finding */}
      <div className="mt-6 p-6 rounded-xl bg-red-950/15 border border-red-900/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <div className="text-sm font-bold text-red-400">Critical Pattern Found</div>
            <p className="mt-2 text-sm text-slate-300">
              <span className="text-white font-semibold">Evening HIIT</span> is this user&apos;s #1 sleep disruptor.
              Across {stats.discovery.eveningHiitCount} sessions, average sleep score was <span className="text-red-400 font-mono">{stats.discovery.eveningHiitAvgScore}</span> — well
              below the {stats.discovery.avgScore} baseline. Morning workouts of the same intensity score <span className="text-green-400 font-mono">6-8 points higher</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-6 rounded-xl bg-green-950/15 border border-green-900/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <div className="text-sm font-bold text-green-400">Positive Pattern</div>
            <p className="mt-2 text-sm text-slate-300">
              <span className="text-white font-semibold">Morning runs and cycling</span> consistently produce the best sleep scores.
              Evening yoga and moderate evening runs also help — it&apos;s specifically <em>high-intensity evening work</em> that hurts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// STEP 2 — Recommendation
// ============================================================
function StepFeedback({ stats }) {
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white">Recommendation Sent Back to Strava</h3>
        <p className="mt-2 text-sm text-slate-400">The platform sends attributed insights back via API. Strava uses them to adjust its suggestions for this specific user.</p>
      </div>

      {/* API Response Mock */}
      <div className="p-6 rounded-xl bg-[#0a0a12] border border-slate-800/40 font-mono text-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-amber-400 font-sans text-xs font-semibold tracking-wider uppercase">API Response → Strava</span>
          <span className="text-slate-600 font-sans ml-auto">POST /v1/insights/webhook</span>
        </div>
        <pre className="text-slate-400 overflow-x-auto leading-relaxed">{`{
  "user_id": "usr_8sleep_k4r4n",
  "integration": "strava",
  "insights": [
    {
      "type": "negative_correlation",
      "trigger": "Evening HIIT (after 7pm)",
      "impact": {
        "sleep_score": -6.2,
        "deep_sleep_pct": -3.8,
        "time_to_sleep_min": +8.4
      },
      "confidence": 0.87,
      "sample_size": ${stats.discovery.eveningHiitCount},
      "recommendation": "AVOID_TIMESLOT",
      "details": "Shift high-intensity sessions to before 12pm"
    },
    {
      "type": "positive_correlation",
      "trigger": "Morning exercise (before 9am)",
      "impact": {
        "sleep_score": +5.8,
        "deep_sleep_pct": +2.4,
        "hrv": +4.2
      },
      "confidence": 0.82,
      "recommendation": "PREFER_TIMESLOT",
      "details": "Morning workouts of any intensity improve sleep"
    }
  ],
  "pod_adjustment": {
    "on_evening_hiit": "cool_2F_extra",
    "on_morning_workout": "standard_profile"
  }
}`}</pre>
      </div>

      {/* What Strava does with this */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#0e0e16] border border-slate-800/40">
          <div className="text-xs font-semibold text-orange-400 tracking-wider uppercase mb-3">Strava Actions</div>
          <div className="space-y-4">
            {[
              { action: 'Suggest morning slots for HIIT classes', detail: 'When user opens Strava at 7pm to start a HIIT workout, show: "Morning HIIT works better for your sleep. Schedule for 7am tomorrow?"' },
              { action: 'Show recovery attribution on activity feed', detail: '"Yesterday\'s 6am run → +14% deep sleep last night" appears on the workout summary card' },
              { action: 'Add sleep impact to weekly report', detail: 'Strava weekly email includes "Your best sleep nights this week all followed morning workouts"' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-sm text-white font-medium">{item.action}</div>
                <div className="text-xs text-slate-500 mt-1">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#0e0e16] border border-slate-800/40">
          <div className="text-xs font-semibold text-blue-400 tracking-wider uppercase mb-3">Pod Auto-Adjusts</div>
          <div className="space-y-4">
            {[
              { action: 'Pre-cool on intense workout days', detail: 'If Strava reports a high-intensity session, Pod drops temp 2°F below normal starting 30 min before usual bedtime' },
              { action: 'Extend cool-down phase', detail: 'Post-exercise cortisol stays elevated — Pod holds cooler temp 30 min longer than normal profile' },
              { action: 'Delay morning alarm after poor recovery', detail: 'If HRV is trending down after 2+ intense days, thermal alarm shifts 15 min later' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-sm text-white font-medium">{item.action}</div>
                <div className="text-xs text-slate-500 mt-1">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// STEP 3 — The Result
// ============================================================
function StepImpact({ data, stats }) {
  const chartData = data.map(d => ({
    ...d,
    day: d.day,
  }))

  // Rolling 7-day average
  const rollingData = chartData.map((d, i) => {
    const start = Math.max(0, i - 6)
    const window = chartData.slice(start, i + 1)
    const avg = window.reduce((sum, w) => sum + w.sleep.score, 0) / window.length
    return { ...d, rollingAvg: parseFloat(avg.toFixed(1)) }
  })

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white">30 Days Later: The Loop Working</h3>
        <p className="mt-2 text-sm text-slate-400">User followed Strava&apos;s adjusted recommendations. No more evening HIIT. Morning workouts prioritized. Pod pre-adjusting every night.</p>
      </div>

      {/* Full chart with before/after */}
      <div className="p-6 rounded-xl bg-[#0a0a12] border border-slate-800/40">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={rollingData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
            <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} interval={14} />
            <YAxis domain={[55, 90]} tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceArea x1={91} x2={120} fill="#22c55e" fillOpacity={0.04} />
            <ReferenceLine x={90} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Recommendations Applied', fill: '#22c55e', fontSize: 10, position: 'top' }} />
            <Line type="monotone" dataKey="rollingAvg" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="sleep.score" stroke="#3b82f6" strokeWidth={0} dot={(props) => {
              const { cx, cy, payload } = props
              const opacity = payload.phase === 'optimized' ? 0.9 : 0.3
              const color = payload.phase === 'optimized' ? '#22c55e' : '#3b82f6'
              return <circle key={props.key} cx={cx} cy={cy} r={2} fill={color} fillOpacity={opacity} stroke="none" />
            }} />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 flex gap-6 justify-center text-xs">
          <div className="flex items-center gap-1.5"><div className="w-6 h-0.5 bg-blue-500 rounded" /><span className="text-slate-500">7-day rolling average</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-30" /><span className="text-slate-500">Before</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /><span className="text-slate-500">After recommendations</span></div>
        </div>
      </div>

      {/* Impact metrics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Sleep Score', before: stats.discovery.avgScore, after: stats.optimized.avgScore, delta: stats.improvement.score, unit: '', good: stats.improvement.score > 0 },
          { label: 'HRV', before: stats.discovery.avgHrv, after: stats.optimized.avgHrv, delta: stats.improvement.hrv, unit: 'ms', good: stats.improvement.hrv > 0 },
          { label: 'Deep Sleep', before: stats.discovery.avgDeepSleep, after: stats.optimized.avgDeepSleep, delta: stats.improvement.deepSleep, unit: '%', good: stats.improvement.deepSleep > 0 },
          { label: 'Time to Sleep', before: stats.discovery.avgTimeToSleep, after: stats.optimized.avgTimeToSleep, delta: stats.improvement.timeToSleep, unit: 'min', good: stats.improvement.timeToSleep < 0 },
        ].map((m, i) => (
          <div key={i} className="p-5 rounded-xl bg-[#0a0a12] border border-slate-800/40">
            <div className="text-xs text-slate-500 mb-2">{m.label}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{m.after}{m.unit}</span>
              <span className={`text-sm font-mono ${m.good ? 'text-green-400' : 'text-red-400'}`}>
                {m.delta > 0 ? '+' : ''}{m.delta}{m.unit}
              </span>
            </div>
            <div className="text-[10px] text-slate-600 mt-1">was {m.before}{m.unit}</div>
          </div>
        ))}
      </div>

      {/* The punchline */}
      <div className="mt-8 p-8 rounded-xl bg-gradient-to-r from-green-950/20 to-blue-950/20 border border-green-900/20 text-center">
        <p className="text-lg text-white font-semibold">
          One integration. One recommendation. Measurable improvement in 30 days.
        </p>
        <p className="mt-3 text-sm text-slate-400 max-w-lg mx-auto">
          Now multiply this by Calm, Noom, Peloton, and every other health app.
          Each one sends context. Each one gets smarter. The user&apos;s Pod gets better every night.
          That&apos;s the platform.
        </p>
      </div>
    </div>
  )
}

// ============================================================
// PAGE
// ============================================================
export default function Demo() {
  const [step, setStep] = useState(0)
  const { data, stats } = useMemo(() => generateDemoData(), [])

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
            <span className="text-white font-medium">Demo</span>
            <a href="/api-docs" className="hover:text-white transition-colors">API</a>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-orange-400 border border-orange-500/30 rounded-full bg-orange-500/5">
                Live Demo
              </span>
              <span className="text-sm text-slate-600">Strava × Eight Sleep</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              The feedback loop, working.
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl">
              120 days of synthetic data. One user. One integration. Watch the system discover what works, send the insight back, and improve sleep outcomes.
            </p>
          </div>

          {/* Step selector */}
          <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  step === s.id
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : step > s.id
                    ? 'bg-green-500/5 border-green-500/20 text-green-400/60'
                    : 'bg-[#0a0a12] border-slate-800/40 text-slate-500 hover:border-slate-700'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.id ? 'bg-blue-500/20 text-blue-400' :
                  step > s.id ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  {step > s.id ? '✓' : s.id + 1}
                </span>
                <div className="text-left">
                  <div className="text-xs font-semibold">{s.label}</div>
                  <div className="text-[10px] opacity-50">{s.tag}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Step content */}
          <div className="min-h-[500px]">
            {step === 0 && <StepCollect data={data} />}
            {step === 1 && <StepAnalyze data={data} stats={stats} />}
            {step === 2 && <StepFeedback stats={stats} />}
            {step === 3 && <StepImpact data={data} stats={stats} />}
          </div>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              className={`px-6 py-3 text-sm font-medium rounded-lg border transition-colors ${
                step === 0 ? 'border-slate-800 text-slate-700 cursor-not-allowed' : 'border-slate-700 text-slate-300 hover:border-slate-500 cursor-pointer'
              }`}
              disabled={step === 0}
            >
              ← Previous
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 text-sm font-semibold rounded-lg bg-white text-black hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Next Step →
              </button>
            ) : (
              <a href="/api-docs" className="px-6 py-3 text-sm font-semibold rounded-lg bg-white text-black hover:bg-slate-200 transition-colors">
                Explore the API →
              </a>
            )}
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
