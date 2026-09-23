/**
 * RoomieMatch Compatibility Algorithm
 * Computes lifestyle compatibility percentage and category breakdown between two profiles.
 */

// Category Weights (Sum = 100%)
const WEIGHTS = {
  budget: 0.25,
  sleepSchedule: 0.15,
  cleanliness: 0.15,
  smoking: 0.15,
  pets: 0.10,
  cooking: 0.10,
  guests: 0.05,
  socialPreference: 0.05
};

/**
 * Calculates budget compatibility score based on range overlap (0 - 100)
 */
function calculateBudgetScore(minA, maxA, minB, maxB) {
  if (minA === undefined || maxA === undefined || minB === undefined || maxB === undefined) {
    return 50; // Fallback neutral score if budget is incomplete
  }

  const overlapMin = Math.max(minA, minB);
  const overlapMax = Math.min(maxA, maxB);

  // Overlap exists
  if (overlapMax >= overlapMin) {
    const overlapAmount = overlapMax - overlapMin;
    const spanA = maxA - minA || 1;
    const spanB = maxB - minB || 1;
    const avgSpan = (spanA + spanB) / 2;
    const overlapRatio = Math.min(1, overlapAmount / avgSpan);
    
    // 75 to 100 for overlapping ranges
    return Math.round(75 + overlapRatio * 25);
  }

  // No overlap: calculate distance gap between ranges
  const gap = overlapMin - overlapMax;
  const maxAcceptableGap = Math.max(minA, minB) * 0.5 || 5000;
  const gapRatio = Math.min(1, gap / maxAcceptableGap);
  
  // 70 down to 0 based on gap distance
  return Math.round(Math.max(0, 70 - gapRatio * 70));
}

/**
 * Calculates sleep schedule compatibility
 */
function calculateSleepScore(sleepA, sleepB) {
  if (!sleepA || !sleepB) return 50;
  if (sleepA === sleepB) return 100;
  if (sleepA === 'Flexible' || sleepB === 'Flexible') return 85;
  // Early Bird vs Night Owl
  return 30;
}

/**
 * Calculates cleanliness compatibility based on level scale distance
 */
function calculateCleanlinessScore(cleanA, cleanB) {
  if (!cleanA || !cleanB) return 50;
  
  const levels = { 'Very Clean': 3, 'Clean': 2, 'Moderate': 1, 'Relaxed': 0 };
  const valA = levels[cleanA] ?? 2;
  const valB = levels[cleanB] ?? 2;
  const distance = Math.abs(valA - valB);

  if (distance === 0) return 100;
  if (distance === 1) return 80;
  if (distance === 2) return 45;
  return 10;
}

/**
 * Calculates smoking preference compatibility
 */
function calculateSmokingScore(smokeA, smokeB) {
  if (!smokeA || !smokeB) return 50;
  if (smokeA === smokeB) return 100;
  
  if ((smokeA === 'Non-Smoker' && smokeB === 'Regularly') || (smokeA === 'Regularly' && smokeB === 'Non-Smoker')) {
    return 0; // High incompatibility
  }
  if (smokeA === 'Non-Smoker' || smokeB === 'Non-Smoker') return 50;
  return 75; // Occasionally vs Regularly
}

/**
 * Calculates pet preference compatibility
 */
function calculatePetScore(petsA, petsB) {
  if (!petsA || !petsB) return 50;
  if (petsA === petsB) return 100;
  if (petsA === 'Flexible' || petsB === 'Flexible') return 90;
  // Pet Friendly vs No Pets
  return 20;
}

/**
 * Calculates cooking habit compatibility
 */
function calculateCookingScore(cookA, cookB) {
  if (!cookA || !cookB) return 50;
  const levels = { 'Cooks Often': 2, 'Sometimes': 1, 'Rarely': 0 };
  const valA = levels[cookA] ?? 1;
  const valB = levels[cookB] ?? 1;
  const distance = Math.abs(valA - valB);

  if (distance === 0) return 100;
  if (distance === 1) return 80;
  return 50;
}

/**
 * Calculates guest preference compatibility
 */
function calculateGuestScore(guestsA, guestsB) {
  if (!guestsA || !guestsB) return 50;
  const levels = { 'Frequently': 2, 'Sometimes': 1, 'Rarely': 0 };
  const valA = levels[guestsA] ?? 1;
  const valB = levels[guestsB] ?? 1;
  const distance = Math.abs(valA - valB);

  if (distance === 0) return 100;
  if (distance === 1) return 80;
  return 40;
}

/**
 * Calculates social preference compatibility
 */
function calculateSocialScore(socialA, socialB) {
  if (!socialA || !socialB) return 50;
  const levels = { 'Very Social': 3, 'Social': 2, 'Balanced': 1, 'Quiet': 0 };
  const valA = levels[socialA] ?? 1;
  const valB = levels[socialB] ?? 1;
  const distance = Math.abs(valA - valB);

  if (distance === 0) return 100;
  if (distance === 1) return 85;
  if (distance === 2) return 55;
  return 25;
}

/**
 * Main function: Calculates overall lifestyle compatibility & breakdown
 * @param {Object} profileA 
 * @param {Object} profileB 
 * @returns {Object} { overallScore: number, breakdown: Object }
 */
export const calculateCompatibility = (profileA, profileB) => {
  // Safe handling if either profile is null/undefined
  if (!profileA || !profileB) {
    return {
      overallScore: 0,
      breakdown: {
        budget: 0,
        sleepSchedule: 0,
        cleanliness: 0,
        smoking: 0,
        pets: 0,
        cooking: 0,
        guests: 0,
        socialPreference: 0
      }
    };
  }

  const breakdown = {
    budget: calculateBudgetScore(profileA.minBudget, profileA.maxBudget, profileB.minBudget, profileB.maxBudget),
    sleepSchedule: calculateSleepScore(profileA.sleepSchedule, profileB.sleepSchedule),
    cleanliness: calculateCleanlinessScore(profileA.cleanliness, profileB.cleanliness),
    smoking: calculateSmokingScore(profileA.smoking, profileB.smoking),
    pets: calculatePetScore(profileA.pets, profileB.pets),
    cooking: calculateCookingScore(profileA.cooking, profileB.cooking),
    guests: calculateGuestScore(profileA.guests, profileB.guests),
    socialPreference: calculateSocialScore(profileA.socialPreference, profileB.socialPreference)
  };

  const overallWeightedScore = 
    breakdown.budget * WEIGHTS.budget +
    breakdown.sleepSchedule * WEIGHTS.sleepSchedule +
    breakdown.cleanliness * WEIGHTS.cleanliness +
    breakdown.smoking * WEIGHTS.smoking +
    breakdown.pets * WEIGHTS.pets +
    breakdown.cooking * WEIGHTS.cooking +
    breakdown.guests * WEIGHTS.guests +
    breakdown.socialPreference * WEIGHTS.socialPreference;

  const overallScore = Math.min(100, Math.max(0, Math.round(overallWeightedScore)));

  return {
    overallScore,
    breakdown
  };
};
