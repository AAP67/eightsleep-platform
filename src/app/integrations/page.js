'use client'

import { useState } from 'react'

// ============================================================
// INTEGRATION DATA
// ============================================================
const integrations = [
  {
    id: 'strava',
    name: 'Strava',
    icon: '🏃',
    category: 'Fitness',
    color: 'orange',
    colors: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', accent: '#f97316' },
    tagline: 'Know which workouts actually improve recovery',
    problem: 'Strava tracks every run, ride, and swim — but has zero visibility into whether that workout helped or hurt your recovery overnight.',
    dataIn: [
      { field: 'activity_type', example: '"running"', desc: 'Type of workout' },
      { field: 'start_time', example: '"18:30"', desc: 'When the workout started' },
      { field: 'duration_min', example: '42', desc: 'Duration in minutes' },
      { field: 'intensity', example: '7.2', desc: 'Relative effort (1-10)' },
      { field: 'heart_rate_avg', example: '156', desc: 'Average heart rate' },
    ],
    dataOut: [
      { field: 'sleep_score', example: '78', desc: 'Overall sleep quality' },
      { field: 'deep_sleep_delta', example: '+14%', desc: 'Change vs user baseline' },
      { field: 'hrv_delta', example: '+6ms', desc: 'HRV change from baseline' },
      { field: 'recovery_score', example: '82', desc: 'Overnight recovery index' },
      { field: 'time_to_sleep_delta', example: '-4min', desc: 'Fell asleep faster' },
    ],
    insight: 'Evening runs (5-7pm) at moderate intensity improve this user\'s deep sleep by 14% and HRV by 6ms. But high-intensity HIIT after 8pm drops deep sleep by 11%.',
    recommendation: 'Strava suggests morning slots for HIIT, keeps evening slots for moderate runs. Recovery page shows "Last night: +14% deep sleep from yesterday\'s run."',
    podAction: 'Pod pre-cools 2°F on days with high-intensity workouts, starting 30 min before detected bedtime.',
    beforeAfter: {
      before: { label: 'Without Eight Sleep', text: 'Strava shows "Great run!" — no recovery data. User wonders if evening HIIT is hurting sleep. No way to know.' },
      after: { label: 'With Eight Sleep', text: 'Strava shows "Your 6pm run added +14% deep sleep last night. Evening runs work well for you — keep it up." User trusts the recommendation.' },
    },
  },
  {
    id: 'calm',
    name: 'Calm',
    icon: '🧘',
    category: 'Meditation',
    color: 'blue',
    colors: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', accent: '#3b82f6' },
    tagline: 'Prove meditation works — for each user specifically',
    problem: 'Calm has 100M+ downloads but can\'t prove their meditations improve sleep. Retention suffers because users don\'t see measurable results.',
    dataIn: [
      { field: 'session_type', example: '"sleep_story"', desc: 'Meditation type' },
      { field: 'duration_min', example: '20', desc: 'Session length' },
      { field: 'start_time', example: '"21:45"', desc: 'When session started' },
      { field: 'completed', example: 'true', desc: 'Finished the session' },
      { field: 'category', example: '"body_scan"', desc: 'Content category' },
    ],
    dataOut: [
      { field: 'time_to_sleep_delta', example: '-8min', desc: 'Fell asleep faster' },
      { field: 'deep_sleep_delta', example: '+9%', desc: 'More deep sleep' },
      { field: 'hrv_delta', example: '+4ms', desc: 'Better HRV' },
      { field: 'wake_events', example: '-2', desc: 'Fewer night wakings' },
      { field: 'sleep_score_delta', example: '+6', desc: 'Score improvement' },
    ],
    insight: 'Body scan meditations at 9-10pm reduce this user\'s time to fall asleep by 8 minutes. Sleep stories are less effective. 20 min is the sweet spot — 10 min shows no effect.',
    recommendation: 'Calm prioritizes body scan content at 9pm in the user\'s feed. Shows "Last night: fell asleep 8 min faster after your meditation." on the home screen.',
    podAction: 'Pod begins gradual cooling during the meditation session, reaching target temp exactly when the session ends.',
    beforeAfter: {
      before: { label: 'Without Eight Sleep', text: 'User meditates for 2 weeks, doesn\'t feel different, cancels subscription. Calm has no data to show it worked.' },
      after: { label: 'With Eight Sleep', text: '"Your body scan meditations have improved your sleep score by 6 points on average. You fall asleep 8 min faster on meditation nights." User keeps subscribing.' },
    },
  },
  {
    id: 'noom',
    name: 'Noom',
    icon: '🍽️',
    category: 'Nutrition',
    color: 'green',
    colors: { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', accent: '#22c55e' },
    tagline: 'Close the loop between what you eat and how you sleep',
    problem: 'Noom tracks meals and provides coaching, but has no objective signal on how meal timing, macros, or alcohol affect that night\'s sleep quality.',
    dataIn: [
      { field: 'last_meal_time', example: '"21:15"', desc: 'Last meal timestamp' },
      { field: 'calories_total', example: '2180', desc: 'Daily calorie intake' },
      { field: 'alcohol_drinks', example: '2', desc: 'Alcohol units consumed' },
      { field: 'caffeine_last', example: '"14:30"', desc: 'Last caffeine timestamp' },
      { field: 'macro_carb_pct', example: '45%', desc: 'Carb ratio' },
    ],
    dataOut: [
      { field: 'rem_sleep_delta', example: '-18%', desc: 'REM impacted by alcohol' },
      { field: 'deep_sleep_delta', example: '-8%', desc: 'Late meal effect' },
      { field: 'respiratory_rate', example: '+1.2', desc: 'Elevated breathing rate' },
      { field: 'time_to_sleep_delta', example: '+12min', desc: 'Longer to fall asleep' },
      { field: 'sleep_score_delta', example: '-9', desc: 'Score drop' },
    ],
    insight: 'Meals after 9pm cost this user 8% deep sleep. Each alcoholic drink reduces REM by ~9%. Caffeine after 2pm adds 12 min to time-to-sleep. Late carb-heavy meals are worse than late protein meals.',
    recommendation: 'Noom nudges "Try eating dinner before 8:30pm — your sleep improves when you do" and flags afternoon caffeine. Weekly report shows food-sleep correlation trends.',
    podAction: 'On high-alcohol nights, Pod drops temp 3°F lower than usual to counteract alcohol-induced overheating during sleep.',
    beforeAfter: {
      before: { label: 'Without Eight Sleep', text: 'Noom says "log your meals!" but gives no feedback on how food timing affects sleep. User doesn\'t connect late dinners to poor mornings.' },
      after: { label: 'With Eight Sleep', text: '"You ate after 9pm 4 times this week — those nights averaged 8 fewer points on sleep. Moving dinner earlier could recover 30+ points weekly." User changes behavior.' },
    },
  },
  {
    id: 'peloton',
    name: 'Peloton',
    icon: '🚴',
    category: 'Fitness',
    color: 'red',
    colors: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', accent: '#ef4444' },
    tagline: 'Optimize workout scheduling for recovery, not just fitness',
    problem: 'Peloton programs workouts for cardiovascular and strength gains. It has no data on whether the user actually recovered from yesterday\'s session before prescribing today\'s.',
    dataIn: [
      { field: 'class_type', example: '"HIIT_ride"', desc: 'Workout class type' },
      { field: 'duration_min', example: '45', desc: 'Class duration' },
      { field: 'output_kj', example: '380', desc: 'Total energy output' },
      { field: 'avg_heart_rate', example: '162', desc: 'Average HR' },
      { field: 'time_of_day', example: '"07:00"', desc: 'When class was taken' },
    ],
    dataOut: [
      { field: 'recovery_score', example: '64', desc: 'Overnight recovery' },
      { field: 'hrv_trend', example: 'declining', desc: '3-day HRV direction' },
      { field: 'deep_sleep_pct', example: '14%', desc: 'Deep sleep percentage' },
      { field: 'sleep_debt_hrs', example: '3.2', desc: 'Accumulated sleep debt' },
      { field: 'readiness_score', example: '58', desc: 'Ready for intensity?' },
    ],
    insight: 'This user recovers well from morning rides but poorly from evening HIIT. After 2 consecutive high-output days, HRV drops 15% and recovery scores dip below 60. Rest day needed.',
    recommendation: 'Peloton suggests "Recovery ride today — your HRV has been declining for 2 days" instead of pushing another HIIT class. Programs morning slots for intense classes.',
    podAction: 'After detecting low recovery scores for 2+ nights, Pod extends the cool-down phase and delays the wake-up thermal alarm by 15 minutes.',
    beforeAfter: {
      before: { label: 'Without Eight Sleep', text: 'Peloton pushes "Crush this 45-min HIIT!" on a day when the user\'s HRV shows they\'re under-recovered. User overtains, gets injured, churns.' },
      after: { label: 'With Eight Sleep', text: '"Your recovery is at 58 today. We\'ve swapped your scheduled HIIT for a 30-min recovery ride. Your body will thank you tomorrow." User stays healthy, stays subscribed.' },
    },
  },
  {
    id: 'zyrtec',
    name: 'Zyrtec / Allergy Apps',
    icon: '🌿',
    category: 'Health',
    color: 'teal',
    colors: { text: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30', accent: '#2dd4bf' },
    tagline: 'Connect environmental triggers to sleep disruption',
    problem: 'Allergy apps track pollen and AQI but can\'t measure how these environmental factors actually affect individual sleep quality and breathing patterns overnight.',
    dataIn: [
      { field: 'aqi', example: '124', desc: 'Air Quality Index' },
      { field: 'pollen_count', example: '88', desc: 'Local pollen level' },
      { field: 'allergen_type', example: '"tree_pollen"', desc: 'Dominant allergen' },
      { field: 'medication_taken', example: 'true', desc: 'Antihistamine taken' },
      { field: 'outdoor_hours', example: '3.5', desc: 'Time spent outdoors' },
    ],
    dataOut: [
      { field: 'respiratory_rate_delta', example: '+2.1', desc: 'Elevated breathing' },
      { field: 'wake_events', example: '+4', desc: 'More night wakings' },
      { field: 'deep_sleep_delta', example: '-12%', desc: 'Less deep sleep' },
      { field: 'snoring_minutes', example: '+22', desc: 'Increased snoring' },
      { field: 'sleep_score_delta', example: '-11', desc: 'Score impact' },
    ],
    insight: 'This user\'s sleep is highly sensitive to AQI above 80 — respiratory rate increases 2.1 breaths/min and deep sleep drops 12%. Tree pollen specifically causes +22 min snoring. Antihistamines reduce the impact by ~60%.',
    recommendation: 'App sends proactive alert: "Pollen is high tomorrow — take your antihistamine before bed. Your sleep typically drops 11 points on high-pollen days without medication."',
    podAction: 'Pod automatically raises head elevation by 5° on high-AQI nights to improve airway positioning. Temperature drops 2°F to reduce inflammation.',
    beforeAfter: {
      before: { label: 'Without Eight Sleep', text: 'App says "pollen is high today." User takes medication sometimes, doesn\'t connect bad sleep nights to environmental triggers.' },
      after: { label: 'With Eight Sleep', text: '"High pollen nights cost you 11 sleep points. When you took Zyrtec beforehand, the impact dropped to just 4 points. Tonight\'s forecast: high pollen. Reminder set." User takes action.' },
    },
  },
]

// ============================================================
// DATA FLOW ROW COMPONENT
// ============================================================
function DataRow({ field, example, desc, direction, color }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors group">
      <div className={`w-1.5 h-1.5 rounded-full ${direction === 'in' ? 'bg-green-500' : 'bg-blue-500'}`} />
      <code className="text-xs font-mono text-slate-400 w-40 shrink-0">{field}</code>
      <code className={`text-xs font-mono ${direction === 'in' ? 'text-green-400/70' : 'text-blue-400/70'}`}>{JSON.stringify(example)}</code>
      <span className="text-xs text-slate-600 ml-auto hidden md:block">{desc}</span>
    </div>
  )
}

// ============================================================
// INTEGRATION DETAIL VIEW
// ============================================================
function IntegrationDetail({ app }) {
  const [activeTab, setActiveTab] = useState('flow')

  const tabs = [
    { id: 'flow', label: 'Data Flow' },
    { id: 'insight', label: 'Intelligence' },
    { id: 'impact', label: 'Before / After' },
  ]

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex gap-1 bg-[#0a0a12] rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${
              activeTab === tab.id
                ? `${app.colors.bg} ${app.colors.text}`
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'flow' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Data In */}
            <div className="p-5 rounded-xl bg-[#0a0a12] border border-slate-800/40">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-green-400 tracking-wider uppercase">Data In</span>
                <span className="text-xs text-slate-600 ml-auto">{app.name} → Eight Sleep</span>
              </div>
              <div className="space-y-0.5">
                {app.dataIn.map((d, i) => (
                  <DataRow key={i} {...d} direction="in" color={app.colors} />
                ))}
              </div>
            </div>

            {/* Data Out */}
            <div className="p-5 rounded-xl bg-[#0a0a12] border border-slate-800/40">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">Outcomes Back</span>
                <span className="text-xs text-slate-600 ml-auto">Eight Sleep → {app.name}</span>
              </div>
              <div className="space-y-0.5">
                {app.dataOut.map((d, i) => (
                  <DataRow key={i} {...d} direction="out" color={app.colors} />
                ))}
              </div>
            </div>

            {/* Pod Action */}
            <div className="md:col-span-2 p-5 rounded-xl bg-[#0a0a12] border border-slate-800/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🛏️</span>
                <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase">Pod Actuation</span>
                <span className="text-[10px] text-slate-600 bg-purple-500/10 px-2 py-0.5 rounded-full ml-2">Step 4</span>
              </div>
              <p className="text-sm text-slate-400">{app.podAction}</p>
            </div>
          </div>
        )}

        {activeTab === 'insight' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-[#0a0a12] border border-slate-800/40">
              <div className="text-xs font-semibold text-purple-400 tracking-wider uppercase mb-3">Pattern Discovered</div>
              <p className="text-slate-300 leading-relaxed">{app.insight}</p>
            </div>
            <div className="p-6 rounded-xl bg-[#0a0a12] border border-slate-800/40">
              <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-3">Recommendation Sent Back</div>
              <p className="text-slate-300 leading-relaxed">{app.recommendation}</p>
            </div>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-red-950/10 border border-red-900/20">
              <div className="text-xs font-semibold text-red-400 tracking-wider uppercase mb-3">{app.beforeAfter.before.label}</div>
              <p className="text-sm text-slate-400 leading-relaxed">{app.beforeAfter.before.text}</p>
            </div>
            <div className="p-6 rounded-xl bg-green-950/10 border border-green-900/20">
              <div className="text-xs font-semibold text-green-400 tracking-wider uppercase mb-3">{app.beforeAfter.after.label}</div>
              <p className="text-sm text-slate-400 leading-relaxed">{app.beforeAfter.after.text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// PAGE
// ============================================================
export default function Integrations() {
  const [selectedApp, setSelectedApp] = useState('strava')
  const activeApp = integrations.find(a => a.id === selectedApp)

  return (
    <>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#06060a]/90 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-lg">🛏️</span>
            <span className="text-sm font-bold text-white tracking-wide">Eight Sleep Platform</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
            <a href="/#loop" className="hover:text-white transition-colors">The Loop</a>
            <a href="/#steps" className="hover:text-white transition-colors">6 Steps</a>
            <span className="text-white font-medium">Integrations</span>
            <a href="/demo" className="hover:text-white transition-colors">Demo</a>
            <a href="/api" className="hover:text-white transition-colors">API</a>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-blue-400 border border-blue-500/30 rounded-full bg-blue-500/5 mb-6">
              Integration Showcase
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Five apps. One feedback loop.
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl">
              Each integration sends intervention data in, receives sleep outcomes back, and uses the insight to improve their product. Click any app to explore the full data exchange.
            </p>
          </div>

          {/* App selector */}
          <div className="flex flex-wrap gap-3 mb-8">
            {integrations.map(app => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedApp === app.id
                    ? `${app.colors.bg} ${app.colors.border} ${app.colors.text}`
                    : 'bg-[#0a0a12] border-slate-800/40 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <span className="text-xl">{app.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-semibold">{app.name}</div>
                  <div className="text-[10px] opacity-60">{app.category}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected app detail */}
          {activeApp && (
            <div className="p-8 rounded-2xl bg-[#0e0e16] border border-slate-800/50">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{activeApp.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{activeApp.name}</h2>
                  <p className={`text-sm ${activeApp.colors.text} mt-1`}>{activeApp.tagline}</p>
                  <p className="text-sm text-slate-500 mt-3 max-w-2xl">{activeApp.problem}</p>
                </div>
              </div>

              <IntegrationDetail app={activeApp} />
            </div>
          )}

          {/* Summary insight */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-900/20 text-center">
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Five apps. Five different data streams flowing in. Five sets of outcomes flowing back.
              Each app gets smarter. And Eight Sleep now has the richest model of <span className="text-white font-semibold">what actually affects this user&apos;s health</span> — across
              fitness, nutrition, stress, environment, and mindfulness.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              No single app could build this picture alone. Together, they create something none of them could.
            </p>
          </div>

          {/* Next */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <a href="/demo" className="px-8 py-3.5 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm">
              See the Live Demo →
            </a>
            <a href="/api" className="px-8 py-3.5 border border-slate-700 text-slate-300 font-medium rounded-lg hover:border-slate-500 transition-colors text-sm">
              API Documentation
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
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
