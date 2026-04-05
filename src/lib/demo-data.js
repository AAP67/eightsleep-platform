/**
 * Strava × Eight Sleep Demo Data
 * 
 * 90 days of "discovery" phase — workouts happen naturally, patterns emerge
 * 30 days of "optimized" phase — recommendations applied, sleep improves
 */

function seededRandom(seed) {
  let s = seed
  return function() {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function gaussianFromRng(rng, mean = 0, stdev = 1) {
  const u = 1 - rng()
  const v = rng()
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return z * stdev + mean
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

export function generateDemoData() {
  const rng = seededRandom(42)
  const data = []

  const workoutTypes = [
    { type: 'Morning Run', time: '06:30', intensity: 6, category: 'moderate', timeOfDay: 'morning' },
    { type: 'Morning HIIT', time: '07:00', intensity: 8.5, category: 'intense', timeOfDay: 'morning' },
    { type: 'Evening Run', time: '18:00', intensity: 5.5, category: 'moderate', timeOfDay: 'evening' },
    { type: 'Evening HIIT', time: '19:30', intensity: 8, category: 'intense', timeOfDay: 'evening' },
    { type: 'Lunch Walk', time: '12:30', intensity: 3, category: 'light', timeOfDay: 'midday' },
    { type: 'Evening Yoga', time: '20:00', intensity: 3, category: 'light', timeOfDay: 'evening' },
    { type: 'Morning Cycling', time: '06:00', intensity: 7, category: 'moderate', timeOfDay: 'morning' },
    { type: 'Rest Day', time: null, intensity: 0, category: 'rest', timeOfDay: null },
  ]

  // Phase 1: Discovery (90 days) — natural workout distribution
  for (let i = 0; i < 90; i++) {
    const date = new Date('2026-01-15')
    date.setDate(date.getDate() + i)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6

    // Natural workout selection — mix of everything
    let workout
    const roll = rng()
    if (roll < 0.12) workout = workoutTypes[0] // Morning Run
    else if (roll < 0.18) workout = workoutTypes[1] // Morning HIIT
    else if (roll < 0.30) workout = workoutTypes[2] // Evening Run
    else if (roll < 0.45) workout = workoutTypes[3] // Evening HIIT — frequent
    else if (roll < 0.55) workout = workoutTypes[4] // Lunch Walk
    else if (roll < 0.62) workout = workoutTypes[5] // Evening Yoga
    else if (roll < 0.70) workout = workoutTypes[6] // Morning Cycling
    else workout = workoutTypes[7] // Rest Day

    // Sleep score derived from workout
    let sleepBase = 72
    if (workout.category === 'rest') sleepBase += gaussianFromRng(rng, 0, 3)
    else if (workout.category === 'light') sleepBase += gaussianFromRng(rng, 3, 2)
    else if (workout.category === 'moderate' && workout.timeOfDay === 'morning') sleepBase += gaussianFromRng(rng, 6, 3)
    else if (workout.category === 'moderate' && workout.timeOfDay === 'evening') sleepBase += gaussianFromRng(rng, 4, 3)
    else if (workout.category === 'intense' && workout.timeOfDay === 'morning') sleepBase += gaussianFromRng(rng, 3, 3)
    else if (workout.category === 'intense' && workout.timeOfDay === 'evening') sleepBase += gaussianFromRng(rng, -6, 4)

    // Weekend bonus
    if (isWeekend) sleepBase += 2

    // Random noise
    sleepBase += gaussianFromRng(rng, 0, 3)

    const sleepScore = clamp(Math.round(sleepBase), 40, 98)
    const deepSleep = clamp(parseFloat((12 + (sleepScore - 70) * 0.25 + gaussianFromRng(rng, 0, 2)).toFixed(1)), 5, 30)
    const hrv = clamp(Math.round(35 + (sleepScore - 70) * 0.6 + gaussianFromRng(rng, 0, 5)), 15, 75)
    const timeToSleep = clamp(Math.round(15 - (sleepScore - 70) * 0.3 + gaussianFromRng(rng, 0, 4)), 3, 45)

    data.push({
      date: date.toISOString().split('T')[0],
      day: i + 1,
      phase: 'discovery',
      workout: {
        type: workout.type,
        time: workout.time,
        intensity: workout.intensity + parseFloat(gaussianFromRng(rng, 0, 0.5).toFixed(1)),
        category: workout.category,
        timeOfDay: workout.timeOfDay,
        duration: workout.category === 'rest' ? 0 : clamp(Math.round(gaussianFromRng(rng, 40, 10)), 15, 75),
      },
      sleep: {
        score: sleepScore,
        deepSleepPct: deepSleep,
        hrv: hrv,
        timeToSleepMin: timeToSleep,
      },
    })
  }

  // Phase 2: Optimized (30 days) — recommendations applied
  // Shift: no more evening HIIT, morning HIIT instead. Keep evening runs. More consistency.
  for (let i = 0; i < 30; i++) {
    const date = new Date('2026-04-15')
    date.setDate(date.getDate() + i)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6

    let workout
    const roll = rng()
    if (roll < 0.25) workout = workoutTypes[0] // Morning Run — more frequent
    else if (roll < 0.40) workout = workoutTypes[1] // Morning HIIT — moved from evening
    else if (roll < 0.55) workout = workoutTypes[2] // Evening Run — kept
    // NO evening HIIT — eliminated by recommendation
    else if (roll < 0.62) workout = workoutTypes[4] // Lunch Walk
    else if (roll < 0.72) workout = workoutTypes[5] // Evening Yoga
    else if (roll < 0.82) workout = workoutTypes[6] // Morning Cycling
    else workout = workoutTypes[7] // Rest Day

    let sleepBase = 72
    if (workout.category === 'rest') sleepBase += gaussianFromRng(rng, 0, 3)
    else if (workout.category === 'light') sleepBase += gaussianFromRng(rng, 3, 2)
    else if (workout.category === 'moderate' && workout.timeOfDay === 'morning') sleepBase += gaussianFromRng(rng, 6, 3)
    else if (workout.category === 'moderate' && workout.timeOfDay === 'evening') sleepBase += gaussianFromRng(rng, 4, 3)
    else if (workout.category === 'intense' && workout.timeOfDay === 'morning') sleepBase += gaussianFromRng(rng, 3, 3)
    else if (workout.category === 'intense' && workout.timeOfDay === 'evening') sleepBase += gaussianFromRng(rng, -6, 4)

    if (isWeekend) sleepBase += 2
    sleepBase += gaussianFromRng(rng, 0, 2.5) // slightly less noise — more consistent

    const sleepScore = clamp(Math.round(sleepBase), 40, 98)
    const deepSleep = clamp(parseFloat((12 + (sleepScore - 70) * 0.25 + gaussianFromRng(rng, 0, 2)).toFixed(1)), 5, 30)
    const hrv = clamp(Math.round(35 + (sleepScore - 70) * 0.6 + gaussianFromRng(rng, 0, 5)), 15, 75)
    const timeToSleep = clamp(Math.round(15 - (sleepScore - 70) * 0.3 + gaussianFromRng(rng, 0, 3)), 3, 45)

    data.push({
      date: date.toISOString().split('T')[0],
      day: 90 + i + 1,
      phase: 'optimized',
      workout: {
        type: workout.type,
        time: workout.time,
        intensity: workout.intensity + parseFloat(gaussianFromRng(rng, 0, 0.5).toFixed(1)),
        category: workout.category,
        timeOfDay: workout.timeOfDay,
        duration: workout.category === 'rest' ? 0 : clamp(Math.round(gaussianFromRng(rng, 40, 10)), 15, 75),
      },
      sleep: {
        score: sleepScore,
        deepSleepPct: deepSleep,
        hrv: hrv,
        timeToSleepMin: timeToSleep,
      },
    })
  }

  // Compute statistics
  const discovery = data.filter(d => d.phase === 'discovery')
  const optimized = data.filter(d => d.phase === 'optimized')

  const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length

  // Pattern analysis from discovery phase
  const byCategory = {}
  discovery.forEach(d => {
    const key = `${d.workout.timeOfDay}_${d.workout.category}`
    if (!byCategory[key]) byCategory[key] = []
    byCategory[key].push(d.sleep.score)
  })

  const patterns = Object.entries(byCategory).map(([key, scores]) => ({
    key,
    label: key.replace('_', ' '),
    avgScore: parseFloat(mean(scores).toFixed(1)),
    count: scores.length,
  })).sort((a, b) => b.avgScore - a.avgScore)

  const stats = {
    discovery: {
      avgScore: parseFloat(mean(discovery.map(d => d.sleep.score)).toFixed(1)),
      avgHrv: parseFloat(mean(discovery.map(d => d.sleep.hrv)).toFixed(0)),
      avgDeepSleep: parseFloat(mean(discovery.map(d => d.sleep.deepSleepPct)).toFixed(1)),
      avgTimeToSleep: parseFloat(mean(discovery.map(d => d.sleep.timeToSleepMin)).toFixed(0)),
      eveningHiitCount: discovery.filter(d => d.workout.type === 'Evening HIIT').length,
      eveningHiitAvgScore: parseFloat(mean(discovery.filter(d => d.workout.type === 'Evening HIIT').map(d => d.sleep.score)).toFixed(1)),
    },
    optimized: {
      avgScore: parseFloat(mean(optimized.map(d => d.sleep.score)).toFixed(1)),
      avgHrv: parseFloat(mean(optimized.map(d => d.sleep.hrv)).toFixed(0)),
      avgDeepSleep: parseFloat(mean(optimized.map(d => d.sleep.deepSleepPct)).toFixed(1)),
      avgTimeToSleep: parseFloat(mean(optimized.map(d => d.sleep.timeToSleepMin)).toFixed(0)),
    },
    patterns,
    improvement: {
      score: parseFloat((mean(optimized.map(d => d.sleep.score)) - mean(discovery.map(d => d.sleep.score))).toFixed(1)),
      hrv: parseFloat((mean(optimized.map(d => d.sleep.hrv)) - mean(discovery.map(d => d.sleep.hrv))).toFixed(0)),
      deepSleep: parseFloat((mean(optimized.map(d => d.sleep.deepSleepPct)) - mean(discovery.map(d => d.sleep.deepSleepPct))).toFixed(1)),
      timeToSleep: parseFloat((mean(optimized.map(d => d.sleep.timeToSleepMin)) - mean(discovery.map(d => d.sleep.timeToSleepMin))).toFixed(0)),
    },
  }

  return { data, stats }
}
