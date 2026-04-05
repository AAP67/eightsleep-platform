/**
 * SleepStack — Synthetic Data Generator
 * 
 * Generates 90 days of realistic, correlated data across 4 signal layers:
 * 1. Environment (AQI, outdoor temp, humidity, pollen)
 * 2. Cognitive Load (meeting hours, back-to-back meetings, Slack messages)
 * 3. Lifestyle (exercise intensity, caffeine mg + timing, alcohol, last meal hour)
 * 4. Eight Sleep Pod (bed temp setting, deviation from optimal)
 * 
 * Sleep outcomes (score, HRV, deep sleep %, REM %, respiratory rate, time to sleep)
 * are DERIVED from these inputs with realistic weights + noise.
 */

const fs = require('fs');

// --- Utility functions ---
function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// Day of year for seasonal effects (0-365)
function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// --- Configuration ---
const START_DATE = new Date('2026-01-15');
const NUM_DAYS = 90;
const USER_OPTIMAL_POD_TEMP = 68; // degrees F — user's personal sweet spot

// Wildfire smoke event (simulates a bad AQI week)
const SMOKE_START = 55; // day index
const SMOKE_END = 61;

// Heavy work sprint
const SPRINT_START = 30;
const SPRINT_END = 37;

// --- Generate each day ---
function generateDay(date, dayIndex) {
  const weekend = isWeekend(date);
  const doy = dayOfYear(date);
  
  // ========== ENVIRONMENT LAYER ==========
  
  // AQI: Berkeley baseline 15-45, seasonal variation, smoke event spikes
  let aqi;
  if (dayIndex >= SMOKE_START && dayIndex <= SMOKE_END) {
    aqi = Math.round(gaussianRandom(140, 30));
  } else {
    const seasonalBase = 25 + 10 * Math.sin((doy / 365) * 2 * Math.PI);
    aqi = Math.round(gaussianRandom(seasonalBase, 10));
  }
  aqi = clamp(aqi, 5, 200);

  // Outdoor temp: Bay Area Jan-Apr range (45-72°F)
  const seasonalTemp = 52 + 8 * Math.sin(((doy - 30) / 365) * 2 * Math.PI);
  const outdoorTemp = Math.round(gaussianRandom(seasonalTemp, 5));

  // Humidity: 50-80% range
  const humidity = clamp(Math.round(gaussianRandom(65, 10)), 30, 95);

  // Pollen: low in Jan/Feb, rising in Mar/Apr
  const pollenSeasonal = Math.max(0, (doy - 60) * 0.8);
  const pollen = clamp(Math.round(gaussianRandom(pollenSeasonal, 15)), 0, 120);

  // ========== COGNITIVE LOAD LAYER ==========
  
  let meetingHours, backToBack, slackMessages;
  
  if (weekend) {
    meetingHours = Math.random() < 0.15 ? Math.round(gaussianRandom(1, 0.5)) : 0;
    backToBack = 0;
    slackMessages = clamp(Math.round(gaussianRandom(10, 8)), 0, 40);
  } else {
    // Sprint weeks have heavier load
    const isSprint = dayIndex >= SPRINT_START && dayIndex <= SPRINT_END;
    const meetingBase = isSprint ? 5.5 : 3.5;
    meetingHours = clamp(parseFloat(gaussianRandom(meetingBase, 1.2).toFixed(1)), 0, 9);
    backToBack = clamp(Math.round(meetingHours * gaussianRandom(0.35, 0.1)), 0, 5);
    slackMessages = clamp(Math.round(gaussianRandom(isSprint ? 85 : 55, 20)), 5, 160);
  }

  // ========== LIFESTYLE LAYER ==========
  
  // Exercise: 0-10 intensity scale, ~4-5x/week pattern
  const exerciseChance = weekend ? 0.6 : 0.7;
  const didExercise = Math.random() < exerciseChance;
  const exerciseIntensity = didExercise ? clamp(Math.round(gaussianRandom(6, 2)), 1, 10) : 0;
  const exerciseType = !didExercise ? 'none' : 
    exerciseIntensity >= 7 ? randomChoice(['running', 'HIIT', 'cycling']) :
    exerciseIntensity >= 4 ? randomChoice(['weights', 'swimming', 'yoga']) :
    randomChoice(['walking', 'stretching', 'light yoga']);

  // Caffeine: mg consumed + last caffeine hour (24hr)
  const caffeineMg = clamp(Math.round(gaussianRandom(weekend ? 150 : 220, 80)), 0, 500);
  // Last caffeine hour: 8-17 range, occasionally late
  const lastCaffeineHour = caffeineMg === 0 ? null : 
    clamp(Math.round(gaussianRandom(weekend ? 11 : 14, 2)), 7, 19);
  const afternoonCaffeine = lastCaffeineHour !== null && lastCaffeineHour >= 14;

  // Alcohol: 0-3 drinks, more likely on weekends
  const drinkChance = weekend ? 0.45 : 0.2;
  const alcoholDrinks = Math.random() < drinkChance ? 
    clamp(Math.round(gaussianRandom(2, 0.8)), 1, 4) : 0;

  // Last meal hour: typically 18-21, occasionally late
  const lastMealHour = clamp(parseFloat(gaussianRandom(weekend ? 20 : 19.5, 1).toFixed(1)), 17, 23);
  const lateMeal = lastMealHour >= 21;

  // ========== EIGHT SLEEP POD LAYER ==========
  
  // Pod temp setting: user varies around their optimal (65-72°F)
  const podTempSetting = clamp(
    Math.round(gaussianRandom(USER_OPTIMAL_POD_TEMP, 2.5)),
    60, 76
  );
  const podTempDeviation = Math.abs(podTempSetting - USER_OPTIMAL_POD_TEMP);

  // Autopilot enabled ~70% of the time
  const autopilotEnabled = Math.random() < 0.7;
  
  // If autopilot is on, Pod adjusts closer to optimal overnight
  const effectivePodDeviation = autopilotEnabled ? podTempDeviation * 0.4 : podTempDeviation;

  // ========== DERIVE SLEEP OUTCOMES ==========
  
  const baseline = 82;
  
  // Calculate sleep score from inputs
  let sleepScore = baseline
    - 0.08 * Math.max(0, aqi - 30)           // AQI penalty above 30
    - 1.8 * meetingHours                       // cognitive load
    - 0.8 * backToBack                         // extra penalty for b2b
    - 0.01 * slackMessages                     // minor Slack effect
    + 1.2 * Math.min(exerciseIntensity, 7)     // exercise helps (diminishing above 7)
    - 1.0 * Math.max(0, exerciseIntensity - 7) // too intense hurts
    - (afternoonCaffeine ? 4.5 : 0)            // afternoon caffeine penalty
    - 0.015 * caffeineMg                       // total caffeine mild effect
    - 4.5 * alcoholDrinks                      // alcohol big penalty
    - (lateMeal ? 3.0 : 0)                     // late meal penalty
    - 1.5 * effectivePodDeviation              // Pod temp deviation
    + (weekend ? 2 : 0)                        // weekend bonus (less stress)
    + gaussianRandom(0, 4);                    // random noise

  sleepScore = clamp(Math.round(sleepScore), 35, 99);

  // HRV: correlated with sleep score but own distribution
  const hrv = clamp(
    Math.round(gaussianRandom(35 + (sleepScore - 70) * 0.6, 6)),
    15, 80
  );

  // Deep sleep %: 10-25% range, correlated with score
  const deepSleepPct = clamp(
    parseFloat((12 + (sleepScore - 70) * 0.25 + gaussianRandom(0, 2.5)).toFixed(1)),
    5, 30
  );

  // REM %: 15-25% range, hurt by alcohol especially
  const remPct = clamp(
    parseFloat((20 - 2.5 * alcoholDrinks + gaussianRandom(0, 2)).toFixed(1)),
    8, 28
  );

  // Respiratory rate: 12-18, slightly elevated with AQI/alcohol
  const respiratoryRate = clamp(
    parseFloat((14.5 + 0.005 * aqi + 0.3 * alcoholDrinks + gaussianRandom(0, 0.6)).toFixed(1)),
    11, 20
  );

  // Time to fall asleep (minutes): affected by caffeine, stress, Pod temp
  const timeToSleep = clamp(
    Math.round(
      12
      + (afternoonCaffeine ? 8 : 0)
      + 1.5 * meetingHours
      + 2 * effectivePodDeviation
      - 1 * exerciseIntensity
      + gaussianRandom(0, 5)
    ),
    3, 55
  );

  // Total sleep hours: 5.5-9hr range
  const totalSleepHours = clamp(
    parseFloat((6.8 + (sleepScore - 70) * 0.04 + (weekend ? 0.5 : 0) + gaussianRandom(0, 0.4)).toFixed(1)),
    4.5, 9.5
  );

  // Bed time and wake time
  const bedtimeHour = weekend ? 23.5 : 22.5;
  const bedtime = clamp(parseFloat(gaussianRandom(bedtimeHour, 0.5).toFixed(1)), 21, 25);
  const wakeTime = parseFloat((bedtime + totalSleepHours + (timeToSleep / 60)).toFixed(1));

  return {
    date: date.toISOString().split('T')[0],
    dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
    isWeekend: weekend,

    // Environment
    environment: {
      aqi,
      outdoorTempF: outdoorTemp,
      humidity,
      pollenCount: pollen,
    },

    // Cognitive Load
    cognitiveLoad: {
      meetingHours,
      backToBackMeetings: backToBack,
      slackMessages,
    },

    // Lifestyle
    lifestyle: {
      exerciseIntensity,
      exerciseType,
      caffeineMg,
      lastCaffeineHour,
      afternoonCaffeine,
      alcoholDrinks,
      lastMealHour,
      lateMeal,
    },

    // Eight Sleep Pod
    pod: {
      tempSettingF: podTempSetting,
      optimalTempF: USER_OPTIMAL_POD_TEMP,
      tempDeviation: podTempDeviation,
      autopilotEnabled,
      effectiveDeviation: parseFloat(effectivePodDeviation.toFixed(1)),
    },

    // Sleep Outcomes (from Eight Sleep)
    sleep: {
      score: sleepScore,
      hrv,
      deepSleepPct,
      remPct,
      lightSleepPct: parseFloat((100 - deepSleepPct - remPct - gaussianRandom(5, 1)).toFixed(1)),
      respiratoryRate,
      timeToSleepMin: timeToSleep,
      totalSleepHours,
      bedtime: formatTime(bedtime),
      wakeTime: formatTime(wakeTime % 24),
    },
  };
}

function formatTime(decimalHour) {
  const h = Math.floor(decimalHour) % 24;
  const m = Math.round((decimalHour % 1) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// --- Generate full dataset ---
const data = [];
for (let i = 0; i < NUM_DAYS; i++) {
  const date = new Date(START_DATE);
  date.setDate(date.getDate() + i);
  data.push(generateDay(date, i));
}

// --- Summary stats ---
const scores = data.map(d => d.sleep.score);
const avgScore = (scores.reduce((a, b) => a + b) / scores.length).toFixed(1);
const minScore = Math.min(...scores);
const maxScore = Math.max(...scores);

console.log(`\n✅ Generated ${NUM_DAYS} days of synthetic data`);
console.log(`📅 ${data[0].date} → ${data[data.length - 1].date}`);
console.log(`😴 Sleep Score: avg ${avgScore} | min ${minScore} | max ${maxScore}`);
console.log(`🔥 Smoke event: days ${SMOKE_START}-${SMOKE_END}`);
console.log(`💼 Sprint week: days ${SPRINT_START}-${SPRINT_END}`);

// --- Write output ---
fs.writeFileSync(
  './data/sleepstack-data.json',
  JSON.stringify(data, null, 2)
);
console.log(`\n📁 Written to ./data/sleepstack-data.json`);

// Also write a compact version for the frontend
fs.writeFileSync(
  './data/sleepstack-data.min.json',
  JSON.stringify(data)
);
console.log(`📁 Written to ./data/sleepstack-data.min.json`);
