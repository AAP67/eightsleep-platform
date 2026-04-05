/**
 * SleepStack Attribution Engine
 * 
 * Takes the 90-day dataset and provides:
 * 1. Global correlations — which signals matter most across all nights
 * 2. Per-night attribution — what drove THIS night's sleep score
 * 3. Recommendations — actionable suggestions based on patterns
 * 4. Trends — rolling averages and comparisons
 */

// ============================================================
// FEATURE EXTRACTION — flatten nested day object into signals
// ============================================================

export function extractFeatures(day) {
  return {
    // Environment
    aqi: day.environment.aqi,
    outdoorTempF: day.environment.outdoorTempF,
    humidity: day.environment.humidity,
    pollenCount: day.environment.pollenCount,

    // Cognitive Load
    meetingHours: day.cognitiveLoad.meetingHours,
    backToBackMeetings: day.cognitiveLoad.backToBackMeetings,
    slackMessages: day.cognitiveLoad.slackMessages,

    // Lifestyle
    exerciseIntensity: day.lifestyle.exerciseIntensity,
    afternoonCaffeine: day.lifestyle.afternoonCaffeine ? 1 : 0,
    caffeineMg: day.lifestyle.caffeineMg,
    alcoholDrinks: day.lifestyle.alcoholDrinks,
    lateMeal: day.lifestyle.lateMeal ? 1 : 0,

    // Pod
    podTempDeviation: day.pod.effectiveDeviation,
    autopilotEnabled: day.pod.autopilotEnabled ? 1 : 0,

    // Derived
    isWeekend: day.isWeekend ? 1 : 0,
  };
}

// Feature metadata for display
export const FEATURE_META = {
  aqi:                { label: 'Air Quality (AQI)',       layer: 'environment',    icon: '🌫️', direction: 'lower_better', unit: '' },
  outdoorTempF:       { label: 'Outdoor Temperature',     layer: 'environment',    icon: '🌡️', direction: 'neutral',      unit: '°F' },
  humidity:           { label: 'Humidity',                 layer: 'environment',    icon: '💧', direction: 'neutral',      unit: '%' },
  pollenCount:        { label: 'Pollen Count',             layer: 'environment',    icon: '🌿', direction: 'lower_better', unit: '' },
  meetingHours:       { label: 'Meeting Hours',            layer: 'cognitive',      icon: '📅', direction: 'lower_better', unit: 'hrs' },
  backToBackMeetings: { label: 'Back-to-Back Meetings',   layer: 'cognitive',      icon: '🔄', direction: 'lower_better', unit: '' },
  slackMessages:      { label: 'Slack Messages',           layer: 'cognitive',      icon: '💬', direction: 'lower_better', unit: '' },
  exerciseIntensity:  { label: 'Exercise Intensity',       layer: 'lifestyle',      icon: '🏃', direction: 'higher_better', unit: '/10' },
  afternoonCaffeine:  { label: 'Afternoon Caffeine',       layer: 'lifestyle',      icon: '☕', direction: 'lower_better', unit: '' },
  caffeineMg:         { label: 'Total Caffeine',           layer: 'lifestyle',      icon: '☕', direction: 'lower_better', unit: 'mg' },
  alcoholDrinks:      { label: 'Alcohol',                  layer: 'lifestyle',      icon: '🍷', direction: 'lower_better', unit: 'drinks' },
  lateMeal:           { label: 'Late Meal (after 9pm)',    layer: 'lifestyle',      icon: '🍽️', direction: 'lower_better', unit: '' },
  podTempDeviation:   { label: 'Pod Temp Deviation',       layer: 'pod',            icon: '🛏️', direction: 'lower_better', unit: '°F' },
  autopilotEnabled:   { label: 'Autopilot Enabled',        layer: 'pod',            icon: '🤖', direction: 'higher_better', unit: '' },
  isWeekend:          { label: 'Weekend',                  layer: 'other',          icon: '📆', direction: 'neutral',      unit: '' },
};

// Layer display metadata
export const LAYER_META = {
  environment: { label: 'Environment',    color: '#22c55e', icon: '🌍' },
  cognitive:   { label: 'Cognitive Load',  color: '#f59e0b', icon: '🧠' },
  lifestyle:   { label: 'Lifestyle',       color: '#8b5cf6', icon: '🏃' },
  pod:         { label: 'Eight Sleep Pod', color: '#3b82f6', icon: '🛏️' },
  other:       { label: 'Other',           color: '#6b7280', icon: '📆' },
};


// ============================================================
// STATISTICS HELPERS
// ============================================================

function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr) {
  const m = mean(arr);
  const squaredDiffs = arr.map(x => (x - m) ** 2);
  return Math.sqrt(mean(squaredDiffs));
}

function pearsonCorrelation(xs, ys) {
  const n = xs.length;
  if (n === 0) return 0;
  const mx = mean(xs);
  const my = mean(ys);
  const sx = std(xs);
  const sy = std(ys);
  if (sx === 0 || sy === 0) return 0;

  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += ((xs[i] - mx) / sx) * ((ys[i] - my) / sy);
  }
  return sum / n;
}

function zScore(value, arr) {
  const m = mean(arr);
  const s = std(arr);
  if (s === 0) return 0;
  return (value - m) / s;
}


// ============================================================
// 1. GLOBAL CORRELATIONS
// ============================================================

/**
 * Compute Pearson correlation of each feature vs a sleep metric
 * across the full dataset.
 * 
 * Returns sorted array: [{ feature, correlation, absCorrelation, meta }]
 */
export function computeCorrelations(data, sleepMetric = 'score') {
  const features = Object.keys(FEATURE_META);
  const allFeatures = data.map(d => extractFeatures(d));
  const sleepValues = data.map(d => d.sleep[sleepMetric]);

  const correlations = features.map(feature => {
    const featureValues = allFeatures.map(f => f[feature]);
    const r = pearsonCorrelation(featureValues, sleepValues);
    return {
      feature,
      correlation: parseFloat(r.toFixed(3)),
      absCorrelation: parseFloat(Math.abs(r).toFixed(3)),
      meta: FEATURE_META[feature],
    };
  });

  // Sort by absolute correlation strength
  correlations.sort((a, b) => b.absCorrelation - a.absCorrelation);
  return correlations;
}


// ============================================================
// 2. PER-NIGHT ATTRIBUTION
// ============================================================

/**
 * For a given night, calculate how much each feature contributed
 * to the sleep score being above or below average.
 * 
 * Method: contribution = correlation * z-score of that feature
 * This gives a signed value: positive = helped sleep, negative = hurt it.
 * 
 * Returns: {
 *   date, sleepScore, avgScore, delta,
 *   factors: [{ feature, value, zScore, correlation, contribution, meta }],
 *   layerSummary: { environment: X, cognitive: Y, lifestyle: Z, pod: W }
 * }
 */
export function attributeNight(data, dayIndex) {
  const day = data[dayIndex];
  const features = Object.keys(FEATURE_META);
  const allFeatures = data.map(d => extractFeatures(d));
  const sleepScores = data.map(d => d.sleep.score);
  const dayFeatures = extractFeatures(day);
  const avgScore = mean(sleepScores);

  const factors = features.map(feature => {
    const featureValues = allFeatures.map(f => f[feature]);
    const r = pearsonCorrelation(featureValues, sleepScores);
    const z = zScore(dayFeatures[feature], featureValues);
    const contribution = r * z;

    return {
      feature,
      value: dayFeatures[feature],
      zScore: parseFloat(z.toFixed(2)),
      correlation: parseFloat(r.toFixed(3)),
      contribution: parseFloat(contribution.toFixed(3)),
      absContribution: parseFloat(Math.abs(contribution).toFixed(3)),
      meta: FEATURE_META[feature],
    };
  });

  // Sort by absolute contribution
  factors.sort((a, b) => b.absContribution - a.absContribution);

  // Layer summary — sum contributions by layer
  const layerSummary = {};
  for (const layer of Object.keys(LAYER_META)) {
    const layerFactors = factors.filter(f => f.meta.layer === layer);
    layerSummary[layer] = parseFloat(
      layerFactors.reduce((sum, f) => sum + f.contribution, 0).toFixed(3)
    );
  }

  return {
    date: day.date,
    dayOfWeek: day.dayOfWeek,
    sleepScore: day.sleep.score,
    avgScore: parseFloat(avgScore.toFixed(1)),
    delta: parseFloat((day.sleep.score - avgScore).toFixed(1)),
    factors,
    layerSummary,
    sleepData: day.sleep,
    rawDay: day,
  };
}


// ============================================================
// 3. RECOMMENDATIONS ENGINE
// ============================================================

/**
 * Generate actionable recommendations based on:
 * - Tonight's known inputs (calendar, AQI forecast, etc.)
 * - Historical patterns from the dataset
 * 
 * Takes a partial "tomorrow" object and the full dataset.
 */
export function generateRecommendations(data, tomorrow = null) {
  const correlations = computeCorrelations(data, 'score');
  const recs = [];

  // Get averages for context
  const allFeatures = data.map(d => extractFeatures(d));
  const avgByFeature = {};
  for (const feat of Object.keys(FEATURE_META)) {
    avgByFeature[feat] = mean(allFeatures.map(f => f[feat]));
  }

  // If we have tomorrow's data, give contextual recs
  if (tomorrow) {
    const tf = extractFeatures(tomorrow);

    // High AQI
    if (tf.aqi > 80) {
      recs.push({
        priority: 'high',
        layer: 'environment',
        title: 'Poor Air Quality Tonight',
        message: `AQI is ${tf.aqi} — above the 80 threshold. Consider closing windows and lowering Pod temp by 2°F to compensate for respiratory impact.`,
        impact: 'Historically drops your sleep score by ~5-8 points.',
      });
    }

    // Heavy meeting day
    if (tf.meetingHours > 5) {
      recs.push({
        priority: 'high',
        layer: 'cognitive',
        title: 'Heavy Meeting Day',
        message: `${tf.meetingHours} hours of meetings today. Plan a 30-min wind-down buffer before bed — no screens, lower Pod temp gradually.`,
        impact: 'Days with 5+ meeting hours reduce your sleep score by ~10 points on average.',
      });
    }

    // Afternoon caffeine warning
    if (tf.afternoonCaffeine) {
      recs.push({
        priority: 'high',
        layer: 'lifestyle',
        title: 'Afternoon Caffeine Detected',
        message: `Caffeine after 2pm adds ~8 minutes to your time-to-sleep and costs ~4-5 points on your sleep score.`,
        impact: 'Consider switching to decaf after 1pm.',
      });
    }

    // Alcohol
    if (tf.alcoholDrinks >= 2) {
      recs.push({
        priority: 'medium',
        layer: 'lifestyle',
        title: 'Alcohol Will Impact REM',
        message: `${tf.alcoholDrinks} drinks tonight will likely suppress REM sleep by 15-20%. Enable Autopilot and expect the Pod to run cooler.`,
        impact: 'Each drink costs ~4.5 points on your sleep score.',
      });
    }

    // No exercise
    if (tf.exerciseIntensity === 0) {
      recs.push({
        priority: 'low',
        layer: 'lifestyle',
        title: 'No Exercise Today',
        message: 'Even a 20-minute walk can improve deep sleep by 5-8%. Not too late for a short evening walk.',
        impact: 'Moderate exercise days average 6 points higher on sleep score.',
      });
    }

    // Pod temp deviation
    if (tf.podTempDeviation > 3) {
      recs.push({
        priority: 'medium',
        layer: 'pod',
        title: 'Pod Temp Far From Optimal',
        message: `Your Pod is set ${tf.podTempDeviation}°F from your optimal (68°F). Consider enabling Autopilot to auto-correct overnight.`,
        impact: 'Each degree of deviation costs ~1.5 points.',
      });
    }
  }

  // Always include top pattern-based insights
  const topNegative = correlations.find(c => c.correlation < -0.2 && c.absCorrelation > 0.3);
  if (topNegative) {
    recs.push({
      priority: 'insight',
      layer: topNegative.meta.layer,
      title: `Biggest Sleep Disruptor: ${topNegative.meta.label}`,
      message: `Across 90 days, ${topNegative.meta.label} has the strongest negative correlation (r=${topNegative.correlation}) with your sleep score.`,
      impact: 'Reducing this factor would have the highest expected ROI on sleep quality.',
    });
  }

  const topPositive = correlations.find(c => c.correlation > 0.2 && c.absCorrelation > 0.3);
  if (topPositive) {
    recs.push({
      priority: 'insight',
      layer: topPositive.meta.layer,
      title: `Biggest Sleep Booster: ${topPositive.meta.label}`,
      message: `${topPositive.meta.label} has the strongest positive correlation (r=${topPositive.correlation}) with better sleep.`,
      impact: 'Prioritizing this factor consistently would improve your baseline sleep score.',
    });
  }

  return recs;
}


// ============================================================
// 4. TRENDS & ROLLING STATS
// ============================================================

/**
 * Compute rolling averages for sleep score and each layer's contribution.
 * Window size default = 7 days.
 */
export function computeTrends(data, windowSize = 7) {
  const nights = data.map((_, i) => attributeNight(data, i));
  const trends = [];

  for (let i = 0; i < nights.length; i++) {
    const windowStart = Math.max(0, i - windowSize + 1);
    const window = nights.slice(windowStart, i + 1);

    trends.push({
      date: nights[i].date,
      dayOfWeek: nights[i].dayOfWeek,
      sleepScore: nights[i].sleepScore,
      rollingAvgScore: parseFloat(mean(window.map(n => n.sleepScore)).toFixed(1)),
      rollingLayers: {
        environment: parseFloat(mean(window.map(n => n.layerSummary.environment)).toFixed(2)),
        cognitive: parseFloat(mean(window.map(n => n.layerSummary.cognitive)).toFixed(2)),
        lifestyle: parseFloat(mean(window.map(n => n.layerSummary.lifestyle)).toFixed(2)),
        pod: parseFloat(mean(window.map(n => n.layerSummary.pod)).toFixed(2)),
      },
      // Individual metrics for detail views
      hrv: nights[i].sleepData.hrv,
      deepSleepPct: nights[i].sleepData.deepSleepPct,
      remPct: nights[i].sleepData.remPct,
      timeToSleepMin: nights[i].sleepData.timeToSleepMin,
    });
  }

  return trends;
}


// ============================================================
// 5. SUMMARY STATS
// ============================================================

/**
 * High-level stats for the dashboard header.
 */
export function computeSummary(data) {
  const scores = data.map(d => d.sleep.score);
  const hrvs = data.map(d => d.sleep.hrv);
  const deepPcts = data.map(d => d.sleep.deepSleepPct);

  // Last 7 vs previous 7
  const last7 = scores.slice(-7);
  const prev7 = scores.slice(-14, -7);
  const weekTrend = mean(last7) - mean(prev7);

  // Best and worst days
  const bestIdx = scores.indexOf(Math.max(...scores));
  const worstIdx = scores.indexOf(Math.min(...scores));

  // Weekday vs weekend
  const weekdayScores = data.filter(d => !d.isWeekend).map(d => d.sleep.score);
  const weekendScores = data.filter(d => d.isWeekend).map(d => d.sleep.score);

  return {
    avgScore: parseFloat(mean(scores).toFixed(1)),
    avgHrv: parseFloat(mean(hrvs).toFixed(0)),
    avgDeepSleep: parseFloat(mean(deepPcts).toFixed(1)),
    last7Avg: parseFloat(mean(last7).toFixed(1)),
    prev7Avg: parseFloat(mean(prev7).toFixed(1)),
    weekTrend: parseFloat(weekTrend.toFixed(1)),
    weekTrendDirection: weekTrend > 0 ? 'up' : weekTrend < 0 ? 'down' : 'flat',
    bestNight: { date: data[bestIdx].date, score: scores[bestIdx] },
    worstNight: { date: data[worstIdx].date, score: scores[worstIdx] },
    weekdayAvg: parseFloat(mean(weekdayScores).toFixed(1)),
    weekendAvg: parseFloat(mean(weekendScores).toFixed(1)),
    totalNights: data.length,
  };
}
