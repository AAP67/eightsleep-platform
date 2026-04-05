'use client'

import { useState } from 'react'

// ============================================================
// CODE BLOCK
// ============================================================
function Code({ children, language = 'json', title }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg overflow-hidden bg-[#08080d] border border-slate-800/40 mt-3">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a12] border-b border-slate-800/30">
          <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">{title}</span>
          <button onClick={copy} className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="p-4 text-xs font-mono text-slate-400 overflow-x-auto leading-relaxed whitespace-pre">{children}</pre>
    </div>
  )
}

// ============================================================
// ENDPOINT COMPONENT
// ============================================================
function Endpoint({ method, path, description, auth, scopes, request, response, rateLimit, children }) {
  const [open, setOpen] = useState(false)
  const methodColors = {
    GET: 'bg-green-500/10 text-green-400 border-green-500/30',
    POST: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    PUT: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    DELETE: 'bg-red-500/10 text-red-400 border-red-500/30',
  }

  return (
    <div className="rounded-xl border border-slate-800/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#0a0a12] transition-colors cursor-pointer"
      >
        <span className={`px-2.5 py-1 text-[10px] font-bold font-mono rounded border ${methodColors[method]}`}>
          {method}
        </span>
        <code className="text-sm text-white font-mono">{path}</code>
        <span className="text-xs text-slate-500 ml-auto hidden md:block">{description}</span>
        <svg className={`w-4 h-4 text-slate-600 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-800/30 pt-4 space-y-4">
          <p className="text-sm text-slate-400">{description}</p>

          <div className="flex flex-wrap gap-3">
            {auth && (
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                🔐 {auth}
              </span>
            )}
            {scopes?.map((s, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                scope: {s}
              </span>
            ))}
            {rateLimit && (
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20">
                ⏱ {rateLimit}
              </span>
            )}
          </div>

          {request && <Code title="Request">{request}</Code>}
          {response && <Code title="Response">{response}</Code>}
          {children}
        </div>
      )}
    </div>
  )
}

// ============================================================
// SECTION
// ============================================================
function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-white mb-6 pt-12">{title}</h2>
      {children}
    </section>
  )
}

// ============================================================
// PAGE
// ============================================================
export default function ApiDocs() {
  const sidebarItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'auth', label: 'Authentication' },
    { id: 'scopes', label: 'Permission Scopes' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'webhooks', label: 'Webhooks' },
    { id: 'rate-limits', label: 'Rate Limits' },
    { id: 'quickstart', label: 'Quickstart' },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#06060a]/90 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-lg">🛏️</span>
            <span className="text-sm font-bold text-white tracking-wide">Eight Sleep Platform</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
            <a href="/#loop" className="hover:text-white transition-colors">The Loop</a>
            <a href="/#steps" className="hover:text-white transition-colors">6 Steps</a>
            <a href="/integrations" className="hover:text-white transition-colors">Integrations</a>
            <a href="/demo" className="hover:text-white transition-colors">Demo</a>
            <span className="text-white font-medium">API</span>
            <a href="/flywheel" className="hover:text-white transition-colors">Flywheel</a>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-48 shrink-0">
            <div className="sticky top-28 space-y-1">
              <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-600 mb-3">API Reference</div>
              {sidebarItems.map(item => (
                <a key={item.id} href={`#${item.id}`} className="block text-sm text-slate-500 hover:text-white py-1.5 transition-colors">
                  {item.label}
                </a>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-purple-400 border border-purple-500/30 rounded-full bg-purple-500/5">
                  Developer Portal
                </span>
                <span className="text-[10px] font-mono text-slate-600">v1.0</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                API Documentation
              </h1>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl">
                The Eight Sleep Outcome Attribution API. Send interventions, receive sleep outcomes, close the feedback loop.
              </p>
            </div>

            <div className="space-y-2">
              {/* ========== OVERVIEW ========== */}
              <Section id="overview" title="Overview">
                <div className="p-6 rounded-xl bg-[#0e0e16] border border-slate-800/40 space-y-4 text-sm text-slate-400 leading-relaxed">
                  <p>
                    The Eight Sleep Platform API enables health and wellness applications to participate in a two-way feedback loop with Eight Sleep&apos;s sleep measurement infrastructure. Partner apps send <strong className="text-white">intervention data</strong> (workouts, meditations, meals, environmental context) and receive <strong className="text-white">attributed sleep outcomes</strong> back.
                  </p>
                  <p>The API operates at three permission tiers:</p>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    {[
                      { tier: 'Read Outcomes', color: 'text-green-400 bg-green-500/10', desc: 'Query sleep impact of your interventions. No raw biometric access.' },
                      { tier: 'Read Biometrics', color: 'text-blue-400 bg-blue-500/10', desc: 'Access detailed sleep stages, HRV, respiratory data. Requires user consent.' },
                      { tier: 'Write Pod', color: 'text-purple-400 bg-purple-500/10', desc: 'Adjust Pod temperature, elevation, alarms. Requires approval + review.' },
                    ].map((t, i) => (
                      <div key={i} className="p-4 rounded-lg bg-[#0a0a12] border border-slate-800/30">
                        <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded ${t.color}`}>{t.tier}</span>
                        <p className="mt-3 text-xs text-slate-500">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">Base URL: <code className="text-slate-400">https://api.eightsleep.com/platform/v1</code></p>
                </div>
              </Section>

              {/* ========== AUTHENTICATION ========== */}
              <Section id="auth" title="Authentication">
                <div className="p-6 rounded-xl bg-[#0e0e16] border border-slate-800/40 text-sm text-slate-400">
                  <p className="mb-4">All API requests use OAuth 2.0 with PKCE. Users grant scoped permissions through Eight Sleep&apos;s consent flow.</p>

                  <div className="space-y-3 mb-6">
                    {[
                      { step: '1', label: 'Register your app', desc: 'Create a developer account and register your application to receive client_id' },
                      { step: '2', label: 'Authorization request', desc: 'Redirect user to Eight Sleep consent screen with requested scopes' },
                      { step: '3', label: 'User grants access', desc: 'User reviews requested permissions and approves the integration' },
                      { step: '4', label: 'Token exchange', desc: 'Exchange authorization code for access_token and refresh_token' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#0a0a12]">
                        <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">{s.step}</span>
                        <div>
                          <div className="text-white text-xs font-medium">{s.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Code title="Authorization Request">{`GET https://auth.eightsleep.com/oauth/authorize
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/callback
  &response_type=code
  &scope=outcomes:read interventions:write
  &code_challenge=PKCE_CHALLENGE
  &code_challenge_method=S256
  &state=RANDOM_STATE`}</Code>

                  <Code title="Token Exchange">{`POST https://auth.eightsleep.com/oauth/token
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "client_id": "YOUR_CLIENT_ID",
  "code": "AUTH_CODE",
  "redirect_uri": "https://yourapp.com/callback",
  "code_verifier": "PKCE_VERIFIER"
}

→ Response:
{
  "access_token": "esp_live_abc123...",
  "refresh_token": "espr_abc123...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "outcomes:read interventions:write"
}`}</Code>
                  <p className="mt-4 text-xs text-slate-600">Include the token in all requests: <code className="text-slate-400">Authorization: Bearer esp_live_abc123...</code></p>
                </div>
              </Section>

              {/* ========== SCOPES ========== */}
              <Section id="scopes" title="Permission Scopes">
                <div className="p-6 rounded-xl bg-[#0e0e16] border border-slate-800/40">
                  <div className="space-y-3">
                    {[
                      { scope: 'interventions:write', tier: 'Standard', desc: 'Send intervention data (workouts, meals, meditations, etc.)', risk: 'Low' },
                      { scope: 'outcomes:read', tier: 'Standard', desc: 'Read attributed sleep outcomes for your interventions', risk: 'Low' },
                      { scope: 'insights:read', tier: 'Standard', desc: 'Read personalized pattern insights and correlations', risk: 'Low' },
                      { scope: 'biometrics:read', tier: 'Enhanced', desc: 'Access raw sleep stages, HRV, heart rate, respiratory rate', risk: 'Medium' },
                      { scope: 'pod:temp:write', tier: 'Approved', desc: 'Adjust Pod temperature within safe bounds (±5°F)', risk: 'High' },
                      { scope: 'pod:elevation:write', tier: 'Approved', desc: 'Adjust Pod elevation (0-20°)', risk: 'High' },
                      { scope: 'pod:alarm:write', tier: 'Approved', desc: 'Set or adjust wake alarms', risk: 'Medium' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-[#0a0a12]">
                        <code className="text-xs font-mono text-purple-400 w-44 shrink-0">{s.scope}</code>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          s.tier === 'Standard' ? 'bg-green-500/10 text-green-400' :
                          s.tier === 'Enhanced' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>{s.tier}</span>
                        <span className="text-xs text-slate-500 flex-1">{s.desc}</span>
                        <span className={`text-[10px] ${
                          s.risk === 'Low' ? 'text-green-500/50' : s.risk === 'Medium' ? 'text-amber-500/50' : 'text-red-500/50'
                        }`}>{s.risk} risk</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-slate-600"><strong className="text-slate-400">Approved</strong> scopes require app review by Eight Sleep&apos;s platform team before production access is granted. Safety constraints enforced server-side.</p>
                </div>
              </Section>

              {/* ========== ENDPOINTS ========== */}
              <Section id="endpoints" title="Endpoints">
                <div className="space-y-3">
                  <Endpoint
                    method="POST"
                    path="/v1/interventions"
                    description="Send an intervention event"
                    auth="Bearer token"
                    scopes={['interventions:write']}
                    rateLimit="100/min"
                    request={`POST /v1/interventions
Content-Type: application/json

{
  "user_id": "usr_k4r4n",
  "source": "strava",
  "type": "workout",
  "timestamp": "2026-04-05T18:30:00Z",
  "data": {
    "activity_type": "running",
    "duration_min": 42,
    "intensity": 7.2,
    "heart_rate_avg": 156,
    "calories": 480
  }
}`}
                    response={`{
  "id": "int_8f3k2j",
  "status": "accepted",
  "attribution_available_after": "2026-04-06T12:00:00Z",
  "message": "Intervention logged. Outcomes available after next sleep session."
}`}
                  />

                  <Endpoint
                    method="GET"
                    path="/v1/outcomes"
                    description="Query attributed sleep outcomes for your interventions"
                    auth="Bearer token"
                    scopes={['outcomes:read']}
                    rateLimit="60/min"
                    request={`GET /v1/outcomes?intervention_id=int_8f3k2j

# Or query by date range:
GET /v1/outcomes?start=2026-04-01&end=2026-04-05&source=strava`}
                    response={`{
  "outcomes": [
    {
      "intervention_id": "int_8f3k2j",
      "intervention_type": "workout",
      "intervention_summary": "42min run at 7.2 intensity, 18:30",
      "sleep_date": "2026-04-05",
      "attribution": {
        "sleep_score_delta": +4.2,
        "deep_sleep_pct_delta": +2.1,
        "hrv_delta": +3.8,
        "time_to_sleep_delta": -2.4,
        "confidence": 0.78
      },
      "baseline": {
        "sleep_score_avg_30d": 72.4,
        "deep_sleep_pct_avg_30d": 18.2
      }
    }
  ]
}`}
                  />

                  <Endpoint
                    method="GET"
                    path="/v1/insights"
                    description="Get personalized pattern insights from historical data"
                    auth="Bearer token"
                    scopes={['insights:read']}
                    rateLimit="10/min"
                    request={`GET /v1/insights?user_id=usr_k4r4n&source=strava&min_confidence=0.7`}
                    response={`{
  "insights": [
    {
      "type": "negative_correlation",
      "trigger": "Evening HIIT (after 19:00)",
      "impact": {
        "sleep_score": -6.2,
        "deep_sleep_pct": -3.8,
        "time_to_sleep_min": +8.4
      },
      "confidence": 0.87,
      "sample_size": 24,
      "recommendation": "AVOID_TIMESLOT",
      "suggested_alternative": "Morning HIIT (before 09:00)"
    },
    {
      "type": "positive_correlation",
      "trigger": "Morning run (before 09:00)",
      "impact": {
        "sleep_score": +5.8,
        "deep_sleep_pct": +2.4,
        "hrv": +4.2
      },
      "confidence": 0.82,
      "sample_size": 18,
      "recommendation": "PREFER_TIMESLOT"
    }
  ],
  "data_window": "90 days",
  "last_updated": "2026-04-05T08:00:00Z"
}`}
                  />

                  <Endpoint
                    method="GET"
                    path="/v1/biometrics/sleep"
                    description="Access detailed sleep biometrics for a given night"
                    auth="Bearer token"
                    scopes={['biometrics:read']}
                    rateLimit="30/min"
                    request={`GET /v1/biometrics/sleep?user_id=usr_k4r4n&date=2026-04-05`}
                    response={`{
  "date": "2026-04-05",
  "score": 78,
  "stages": {
    "deep_pct": 22.1,
    "rem_pct": 19.4,
    "light_pct": 53.2,
    "awake_pct": 5.3
  },
  "biometrics": {
    "hrv_avg_ms": 42,
    "heart_rate_avg_bpm": 58,
    "respiratory_rate_avg": 14.8,
    "time_to_sleep_min": 11,
    "total_sleep_hrs": 7.4
  },
  "pod": {
    "temp_setting_f": 68,
    "autopilot_enabled": true,
    "adjustments_made": 3
  }
}`}
                  />

                  <Endpoint
                    method="POST"
                    path="/v1/pod/adjust"
                    description="Request a Pod adjustment (requires approval)"
                    auth="Bearer token"
                    scopes={['pod:temp:write']}
                    rateLimit="5/min"
                    request={`POST /v1/pod/adjust
Content-Type: application/json

{
  "user_id": "usr_k4r4n",
  "adjustments": [
    {
      "type": "temperature",
      "value": -2,
      "unit": "fahrenheit_delta",
      "reason": "post_hiit_cooldown",
      "start": "2026-04-05T22:00:00Z",
      "duration_hours": 3
    }
  ],
  "source": "strava",
  "trigger": "int_8f3k2j"
}`}
                    response={`{
  "id": "adj_9x2m1p",
  "status": "applied",
  "adjustments_applied": 1,
  "safety_check": "passed",
  "bounds": {
    "temp_min_f": 60,
    "temp_max_f": 76,
    "max_delta_f": 5
  }
}`}
                  />
                </div>
              </Section>

              {/* ========== WEBHOOKS ========== */}
              <Section id="webhooks" title="Webhooks">
                <div className="p-6 rounded-xl bg-[#0e0e16] border border-slate-800/40 text-sm text-slate-400">
                  <p className="mb-4">Register a webhook URL to receive real-time sleep outcomes as they become available, instead of polling the outcomes endpoint.</p>

                  <Code title="Webhook Registration">{`POST /v1/webhooks
Content-Type: application/json

{
  "url": "https://api.strava.com/eightsleep/webhook",
  "events": ["outcome.ready", "insight.updated"],
  "secret": "whsec_your_signing_secret"
}`}</Code>

                  <Code title="Webhook Payload (outcome.ready)">{`POST https://api.strava.com/eightsleep/webhook
X-EightSleep-Signature: sha256=abc123...
Content-Type: application/json

{
  "event": "outcome.ready",
  "timestamp": "2026-04-06T10:30:00Z",
  "data": {
    "user_id": "usr_k4r4n",
    "intervention_id": "int_8f3k2j",
    "sleep_date": "2026-04-05",
    "attribution": {
      "sleep_score_delta": +4.2,
      "deep_sleep_pct_delta": +2.1,
      "confidence": 0.78
    }
  }
}`}</Code>
                  <p className="mt-4 text-xs text-slate-600">Verify webhook signatures using HMAC-SHA256 with your signing secret. Retry policy: 3 attempts with exponential backoff.</p>
                </div>
              </Section>

              {/* ========== RATE LIMITS ========== */}
              <Section id="rate-limits" title="Rate Limits">
                <div className="p-6 rounded-xl bg-[#0e0e16] border border-slate-800/40">
                  <div className="space-y-2">
                    {[
                      { endpoint: 'POST /v1/interventions', limit: '100 req/min', burst: '20 req/sec', tier: 'Standard' },
                      { endpoint: 'GET /v1/outcomes', limit: '60 req/min', burst: '10 req/sec', tier: 'Standard' },
                      { endpoint: 'GET /v1/insights', limit: '10 req/min', burst: '2 req/sec', tier: 'Standard' },
                      { endpoint: 'GET /v1/biometrics/*', limit: '30 req/min', burst: '5 req/sec', tier: 'Enhanced' },
                      { endpoint: 'POST /v1/pod/adjust', limit: '5 req/min', burst: '1 req/sec', tier: 'Approved' },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-[#0a0a12] text-xs">
                        <code className="text-slate-400 font-mono w-48 shrink-0">{r.endpoint}</code>
                        <span className="text-slate-500 w-28">{r.limit}</span>
                        <span className="text-slate-600 w-24">{r.burst}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ml-auto ${
                          r.tier === 'Standard' ? 'bg-green-500/10 text-green-400' :
                          r.tier === 'Enhanced' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>{r.tier}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-slate-600">Rate limit headers included in every response: <code className="text-slate-400">X-RateLimit-Remaining</code>, <code className="text-slate-400">X-RateLimit-Reset</code>. 429 responses include <code className="text-slate-400">Retry-After</code>.</p>
                </div>
              </Section>

              {/* ========== QUICKSTART ========== */}
              <Section id="quickstart" title="Quickstart: Build Your First Integration">
                <div className="p-6 rounded-xl bg-[#0e0e16] border border-slate-800/40 text-sm text-slate-400 space-y-6">
                  <p>Get from zero to a working feedback loop in 15 minutes.</p>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold">1</span>
                      <span className="text-white font-medium text-xs">Install the SDK</span>
                    </div>
                    <Code title="Terminal">{`npm install @eightsleep/platform-sdk`}</Code>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold">2</span>
                      <span className="text-white font-medium text-xs">Initialize and authenticate</span>
                    </div>
                    <Code title="app.js">{`import { EightSleepPlatform } from '@eightsleep/platform-sdk'

const esp = new EightSleepPlatform({
  clientId: 'YOUR_CLIENT_ID',
  redirectUri: 'https://yourapp.com/callback',
  scopes: ['interventions:write', 'outcomes:read']
})

// Redirect user to consent screen
const authUrl = esp.getAuthorizationUrl()

// After callback, exchange code for token
const tokens = await esp.exchangeCode(authCode)`}</Code>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold">3</span>
                      <span className="text-white font-medium text-xs">Send an intervention</span>
                    </div>
                    <Code title="app.js">{`const intervention = await esp.interventions.create({
  userId: 'usr_k4r4n',
  type: 'workout',
  timestamp: new Date().toISOString(),
  data: {
    activity_type: 'running',
    duration_min: 42,
    intensity: 7.2
  }
})

console.log(intervention.id) // "int_8f3k2j"
console.log(intervention.attribution_available_after)`}</Code>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold">4</span>
                      <span className="text-white font-medium text-xs">Read the outcome (next morning)</span>
                    </div>
                    <Code title="app.js">{`const outcome = await esp.outcomes.get(intervention.id)

console.log(outcome.attribution.sleep_score_delta) // +4.2
console.log(outcome.attribution.deep_sleep_pct_delta) // +2.1
console.log(outcome.attribution.confidence) // 0.78

// Show user: "Your run improved sleep by 4.2 points"`}</Code>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold">5</span>
                      <span className="text-white font-medium text-xs">Get personalized insights (after 30+ days)</span>
                    </div>
                    <Code title="app.js">{`const insights = await esp.insights.list({
  userId: 'usr_k4r4n',
  minConfidence: 0.7
})

insights.forEach(insight => {
  console.log(insight.trigger) // "Evening HIIT (after 19:00)"
  console.log(insight.impact.sleep_score) // -6.2
  console.log(insight.recommendation) // "AVOID_TIMESLOT"
})

// Adjust your app's recommendations based on these insights`}</Code>
                  </div>

                  <div className="p-4 rounded-lg bg-green-950/15 border border-green-900/20">
                    <p className="text-xs text-green-400">
                      That&apos;s it. Five steps to a working feedback loop. Your app sends interventions, Eight Sleep measures outcomes, and you use the insights to make better recommendations for each individual user.
                    </p>
                  </div>
                </div>
              </Section>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-purple-950/20 to-blue-950/20 border border-purple-900/20 text-center">
              <h3 className="text-xl font-bold text-white">Ready to integrate?</h3>
              <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
                See the feedback loop in action with real data, or explore how specific health apps would integrate.
              </p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <a href="/demo" className="px-8 py-3.5 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                  Live Demo
                </a>
                <a href="/integrations" className="px-8 py-3.5 border border-slate-700 text-slate-300 font-medium rounded-lg hover:border-slate-500 transition-colors text-sm">
                  Integration Showcase
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>

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
