'use client'

import { useState, useMemo } from 'react'
import { generateDemoData } from '../../lib/demo-data'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, ReferenceArea, Cell
} from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-[#12121a] border border-slate-700 rounded-lg px-4 py-3 shadow-xl text-xs">
      <div className="text-slate-400">{d.date}</div>
      <div className="text-white font-semibold mt-1">{d.workout?.type || 'Rest'}</div>
      {d.workout?.time && <div className="text-slate-500">at {d.workout.time}</div>}
      <div className="mt-2 flex justify-between gap-4">
        <span className="text-slate-500">Sleep Score</span>
        <span className="text-blue-400 font-mono">{d.sleep?.score}</span>
      </div>
    </div>
  )
}

export default function Demo() {
  const [view, setView] = useState('pattern')
  const { data, stats } = useMemo(() => generateDemoData(), [])
  const discovery = data.filter(d => d.phase === 'discovery')
  const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length

  // Bar chart data
  const groups = {}
  discovery.forEach(d => {
    const key = d.workout.type
    if (!groups[key]) groups[key] = { scores: [], type: key, timeOfDay: d.workout.timeOfDay, category: d.workout.category }
    groups[key].scores.push(d.sleep.score)
  })
  const barData = Object.values(groups)
    .map(g => ({ type: g.type, avgScore: parseFloat(mean(g.scores).toFixed(1)), count: g.scores.length, timeOfDay: g.timeOfDay, category: g.category }))
    .sort((a, b) => b.avgScore - a.avgScore)
  const getBarColor = (e) => e.type === 'Evening HIIT' ? '#ef4444' : e.timeOfDay === 'morning' ? '#22c55e' : e.category === 'light' ? '#a78bfa' : '#3b82f6'

  // Rolling average for result chart
  const rollingData = data.map((d, i) => {
    const start = Math.max(0, i - 6)
    const window = data.slice(start, i + 1)
    return { ...d, rollingAvg: parseFloat((window.reduce((s, w) => s + w.sleep.score, 0) / window.length).toFixed(1)) }
  })

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#06060a]/90 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-lg">🛏️</span>
            <span className="text-sm font-bold text-white tracking-wide">Eight Sleep Platform</span>
          </a>
          <span className="text-sm text-white font-medium">Live Demo</span>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🏃</span>
              <span className="text-sm text-slate-500">Strava × Eight Sleep</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              The feedback loop, working.
            </h1>
            <p className="mt-3 text-slate-400 max-w-lg">
              90 days of Strava workouts paired with Eight Sleep sleep data. The system finds a pattern. The recommendation is applied. Sleep improves.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex gap-1 bg-[#0a0a12] rounded-lg p-1 w-fit mb-8">
            <button
              onClick={() => setView('pattern')}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                view === 'pattern' ? 'bg-blue-500/10 text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              What we found
            </button>
            <button
              onClick={() => setView('result')}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                view === 'result' ? 'bg-green-500/10 text-green-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              What happened
            </button>
          </div>

          {/* === PATTERN VIEW === */}
          {view === 'pattern' && (
            <div>
              <div className="p-6 rounded-xl bg-[#0a0a12] border border-slate-800/40">
                <div className="text-xs text-slate-500 mb-4">Average sleep score by workout type — 90 days</div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
                    <XAxis type="number" domain={[55, 85]} tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="type" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} width={120} />
                    <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: '#e2e8f0' }} formatter={(val) => [`${val} avg score`]} />
                    <ReferenceLine x={mean(discovery.map(d => d.sleep.score))} stroke="#475569" strokeDasharray="4 4" />
                    <Bar dataKey="avgScore" radius={[0, 4, 4, 0]} barSize={22}>
                      {barData.map((entry, i) => (
                        <Cell key={i} fill={getBarColor(entry)} fillOpacity={entry.type === 'Evening HIIT' ? 1 : 0.6} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 p-5 rounded-xl bg-red-950/15 border border-red-900/30">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🚨</span>
                  <div>
                    <div className="text-sm font-bold text-red-400">Evening HIIT is the #1 sleep disruptor</div>
                    <p className="mt-1 text-sm text-slate-400">
                      Across {stats.discovery.eveningHiitCount} sessions, avg sleep score was <span className="text-red-400 font-mono">{stats.discovery.eveningHiitAvgScore}</span> — well
                      below the {stats.discovery.avgScore} baseline. Morning workouts of the same intensity score 6-8 points higher.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-5 rounded-xl bg-[#0a0a12] border border-slate-800/40">
                <div className="text-xs text-slate-500 mb-2">Recommendation sent back to Strava:</div>
                <p className="text-sm text-slate-300">
                  &ldquo;Shift high-intensity workouts to before noon. Keep evening slots for moderate runs and yoga. Your sleep will thank you.&rdquo;
                </p>
              </div>

              <div className="mt-8 text-center">
                <button onClick={() => setView('result')} className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm cursor-pointer">
                  See what happened →
                </button>
              </div>
            </div>
          )}

          {/* === RESULT VIEW === */}
          {view === 'result' && (
            <div>
              <div className="p-6 rounded-xl bg-[#0a0a12] border border-slate-800/40">
                <div className="text-xs text-slate-500 mb-4">Sleep score — 120 days (90 before + 30 after recommendation)</div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={rollingData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                    <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} interval={14} />
                    <YAxis domain={[55, 90]} tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceArea x1={91} x2={120} fill="#22c55e" fillOpacity={0.04} />
                    <ReferenceLine x={90} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Recommendation applied', fill: '#22c55e', fontSize: 10, position: 'top' }} />
                    <Line type="monotone" dataKey="rollingAvg" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="sleep.score" stroke="#3b82f6" strokeWidth={0} dot={(props) => {
                      const { cx, cy, payload } = props
                      const color = payload.phase === 'optimized' ? '#22c55e' : '#3b82f6'
                      const opacity = payload.phase === 'optimized' ? 0.9 : 0.25
                      return <circle key={props.key} cx={cx} cy={cy} r={2} fill={color} fillOpacity={opacity} stroke="none" />
                    }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-3 flex gap-6 justify-center text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-5 h-0.5 bg-blue-500 rounded" /><span className="text-slate-500">7-day avg</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500 opacity-30" /><span className="text-slate-500">Before</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-slate-500">After</span></div>
                </div>
              </div>

              {/* Impact numbers */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Sleep Score', before: stats.discovery.avgScore, after: stats.optimized.avgScore, delta: stats.improvement.score, unit: '', good: stats.improvement.score > 0 },
                  { label: 'HRV', before: stats.discovery.avgHrv, after: stats.optimized.avgHrv, delta: stats.improvement.hrv, unit: 'ms', good: stats.improvement.hrv > 0 },
                  { label: 'Deep Sleep', before: stats.discovery.avgDeepSleep, after: stats.optimized.avgDeepSleep, delta: stats.improvement.deepSleep, unit: '%', good: stats.improvement.deepSleep > 0 },
                  { label: 'Time to Sleep', before: stats.discovery.avgTimeToSleep, after: stats.optimized.avgTimeToSleep, delta: stats.improvement.timeToSleep, unit: 'min', good: stats.improvement.timeToSleep < 0 },
                ].map((m, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#0a0a12] border border-slate-800/40">
                    <div className="text-xs text-slate-500">{m.label}</div>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xl font-bold text-white">{m.after}{m.unit}</span>
                      <span className={`text-xs font-mono ${m.good ? 'text-green-400' : 'text-red-400'}`}>
                        {m.delta > 0 ? '+' : ''}{m.delta}{m.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 rounded-xl bg-green-950/15 border border-green-900/20 text-center">
                <p className="text-sm text-slate-300">
                  <span className="text-white font-semibold">One integration. One recommendation. Measurable improvement in 30 days.</span>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Now multiply by Calm, Noom, Peloton, and every other health app.
                </p>
              </div>

              <div className="mt-8 text-center">
                <a href="/" className="text-sm text-slate-500 hover:text-white transition-colors">← Back to the vision</a>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-10 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-sm text-slate-600">
            A product vision by <a href="https://francium77.com" className="text-slate-400 hover:text-white transition-colors">Karan</a>
          </div>
          <a href="https://github.com/AAP67" className="text-sm text-slate-600 hover:text-slate-400 transition-colors">GitHub</a>
        </div>
      </footer>
    </>
  )
}
