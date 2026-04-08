// ---------------------------------------------------------------------------
// Lead Scoring Engine
// Pure utility — no side effects, no API calls, no database access.
// Scores incoming inquiries (general + venue) on a 0-100 scale.
// ---------------------------------------------------------------------------

// ---- Type definitions -----------------------------------------------------

export interface InquiryScoreInput {
  service?: string | null;
  budget?: string | null;
  eventDate?: string | null;
  phone?: string | null;
  email: string;
  details?: string | null;
  guestCount?: number | null;
}

export interface VenueScoreInput {
  monthlyBudget: string; // 'under-2k' | '2k-5k' | '5k-10k' | '10k-plus'
  capacity?: number | null;
  decisionMaker?: string | null; // 'owner' | 'gm' | 'event-manager'
  timeline?: string | null; // 'asap' | 'next-month' | 'next-season'
  goal?: string[] | null;
  hasDancePocket?: boolean | null;
  roomPhotos?: unknown[] | null;
  instagram?: string | null;
}

export interface ScoreResult {
  score: number; // 0-100, integer
  tier: 'hot' | 'warm' | 'cool' | 'cold';
  estimatedValue: number; // EUR
}

export interface VenueScoreResult extends ScoreResult {
  monthlyValue: number; // EUR/month
  annualValue: number; // EUR/year
}

export interface BudgetParseResult {
  min: number;
  max: number;
  tier: string;
}

// ---- Tier classification --------------------------------------------------

export function getScoreTier(score: number): 'hot' | 'warm' | 'cool' | 'cold' {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  if (score >= 40) return 'cool';
  return 'cold';
}

// ---- Budget parsing -------------------------------------------------------

/**
 * Parse freeform budget strings into structured min/max/tier.
 *
 * Handles patterns like:
 *   "EUR 5,000-10,000"  "5000€"  "under 2000"  "10k+"  "2k-5k"
 *   null / undefined / ""
 */
export function parseBudgetRange(budget: string | null | undefined): BudgetParseResult {
  if (!budget || !budget.trim()) {
    return { min: 0, max: 0, tier: 'unknown' };
  }

  const raw = budget
    .toLowerCase()
    .replace(/eur|€/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract all numbers — handle "k" notation and thousand separators
  const extractNumber = (s: string): number => {
    // Handle "k" notation: "10k" → 10000, "5.5k" → 5500
    const kMatch = s.match(/([\d.,]+)\s*k/i);
    if (kMatch) {
      const num = parseFloat(kMatch[1].replace(/,/g, ''));
      return isNaN(num) ? 0 : num * 1000;
    }
    // Regular numbers with possible thousand separators
    // "5,000" → 5000, "5.000" → 5000 (if followed by 3 digits)
    const cleaned = s
      .replace(/(\d)[,.](\d{3})\b/g, '$1$2') // strip thousand separators
      .replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // Check for "under" / "below" / "less than" patterns
  if (/under|below|less\s*than|moins\s*de|</.test(raw)) {
    const num = extractNumber(raw);
    const max = num > 0 ? num : 2000;
    return { min: 0, max, tier: classifyBudgetTier(0, max) };
  }

  // Check for "plus" / "+" / "above" / "more than" patterns
  if (/\+|plus|above|more\s*than|over|au\s*dessus/.test(raw)) {
    const num = extractNumber(raw.replace(/\+/, ''));
    const min = num > 0 ? num : 10000;
    return { min, max: min * 2, tier: classifyBudgetTier(min, min * 2) };
  }

  // Check for range patterns: "5000-10000", "5k-10k", "5,000 to 10,000"
  const rangeParts = raw.split(/\s*[-–—]\s*|\s+to\s+|\s+a\s+/);
  if (rangeParts.length >= 2) {
    const min = extractNumber(rangeParts[0]);
    const max = extractNumber(rangeParts[1]);
    if (min > 0 || max > 0) {
      return {
        min: Math.min(min, max),
        max: Math.max(min, max),
        tier: classifyBudgetTier(Math.min(min, max), Math.max(min, max)),
      };
    }
  }

  // Single number
  const num = extractNumber(raw);
  if (num > 0) {
    return { min: num, max: num, tier: classifyBudgetTier(num, num) };
  }

  return { min: 0, max: 0, tier: 'unknown' };
}

function classifyBudgetTier(min: number, max: number): string {
  const mid = (min + max) / 2;
  if (mid <= 0) return 'unknown';
  if (max <= 2000) return 'under-2k';
  if (mid <= 5000) return '2k-5k';
  if (mid <= 10000) return '5k-10k';
  return '10k-plus';
}

// ---- General inquiry scoring ----------------------------------------------

export function calculateInquiryScore(input: InquiryScoreInput): ScoreResult {
  const budgetPoints = scoreBudget(input.budget);
  const servicePoints = scoreService(input.service);
  const detailPoints = scoreDetailQuality(input.details);
  const timelinePoints = scoreTimeline(input.eventDate);
  const contactPoints = scoreContact(input.phone, input.email);

  const score = clampScore(budgetPoints + servicePoints + detailPoints + timelinePoints + contactPoints);
  const tier = getScoreTier(score);
  const estimatedValue = estimateInquiryValue(input.budget);

  return { score, tier, estimatedValue };
}

function scoreBudget(budget: string | null | undefined): number {
  const parsed = parseBudgetRange(budget);
  switch (parsed.tier) {
    case '10k-plus': return 35;
    case '5k-10k': return 28;
    case '2k-5k': return 20;
    case 'under-2k': return 10;
    default: return 5;
  }
}

function scoreService(service: string | null | undefined): number {
  if (!service) return 5;
  switch (service) {
    case 'wedding-film': return 20;
    case 'hybrid-package': return 18;
    case 'editorial-commercial': return 15;
    case 'event-production': return 12;
    case 'dj-performance': return 10;
    default: return 5;
  }
}

function scoreDetailQuality(details: string | null | undefined): number {
  if (!details) return 0;
  const len = details.trim().length;
  if (len >= 500) return 15;
  if (len >= 200) return 12;
  if (len >= 50) return 8;
  return 3;
}

function scoreTimeline(eventDate: string | null | undefined): number {
  if (!eventDate) return 3;
  const lower = eventDate.toLowerCase();

  // Urgent keywords (FR + EN)
  if (/asap|urgent|this month|cette semaine|ce mois|immédiat/.test(lower)) return 15;
  // Soon keywords
  if (/next month|soon|prochain|bientôt/.test(lower)) return 10;
  // This-year keywords
  if (/this year|2026|2027|cette année/.test(lower)) return 6;

  return 3;
}

function scoreContact(phone: string | null | undefined, email: string): number {
  const hasPhone = !!phone && phone.trim().length > 0;
  const hasEmail = !!email && email.trim().length > 0;

  if (hasPhone && hasEmail) return 15;
  if (hasPhone) return 8;
  if (hasEmail) return 7;
  return 0;
}

function estimateInquiryValue(budget: string | null | undefined): number {
  const parsed = parseBudgetRange(budget);
  switch (parsed.tier) {
    case '10k-plus': return 15000;
    case '5k-10k': return 7500;
    case '2k-5k': return 3500;
    case 'under-2k': return 1500;
    default: return 1000;
  }
}

// ---- Venue inquiry scoring ------------------------------------------------

export function calculateVenueScore(input: VenueScoreInput): VenueScoreResult {
  const budgetPoints = scoreMonthlyBudget(input.monthlyBudget);
  const capacityPoints = scoreCapacity(input.capacity);
  const decisionMakerPoints = scoreDecisionMaker(input.decisionMaker);
  const timelinePoints = scoreVenueTimeline(input.timeline);
  const goalPoints = scoreGoals(input.goal);
  const dancePoints = input.hasDancePocket ? 5 : 0;
  const photoPoints = scorePhotos(input.roomPhotos);
  const instagramPoints = input.instagram && input.instagram.trim().length > 0 ? 5 : 0;

  const score = clampScore(
    budgetPoints + capacityPoints + decisionMakerPoints + timelinePoints +
    goalPoints + dancePoints + photoPoints + instagramPoints
  );
  const tier = getScoreTier(score);
  const { monthlyValue, annualValue } = estimateVenueValue(input.monthlyBudget);

  return { score, tier, estimatedValue: annualValue, monthlyValue, annualValue };
}

function scoreMonthlyBudget(monthlyBudget: string): number {
  switch (monthlyBudget) {
    case '10k-plus': return 30;
    case '5k-10k': return 25;
    case '2k-5k': return 15;
    case 'under-2k': return 5;
    default: return 0;
  }
}

function scoreCapacity(capacity: number | null | undefined): number {
  if (!capacity || capacity <= 0) return 0;
  if (capacity >= 500) return 15;
  if (capacity >= 300) return 13;
  if (capacity >= 100) return 10;
  return 5;
}

function scoreDecisionMaker(decisionMaker: string | null | undefined): number {
  if (!decisionMaker) return 0;
  switch (decisionMaker) {
    case 'owner': return 15;
    case 'gm': return 12;
    case 'event-manager': return 8;
    default: return 0;
  }
}

function scoreVenueTimeline(timeline: string | null | undefined): number {
  if (!timeline) return 0;
  switch (timeline) {
    case 'asap': return 15;
    case 'next-month': return 10;
    case 'next-season': return 5;
    default: return 0;
  }
}

function scoreGoals(goals: string[] | null | undefined): number {
  if (!goals || goals.length === 0) return 0;
  const count = goals.length;
  if (count >= 4) return 10;
  if (count === 3) return 8;
  if (count === 2) return 6;
  return 3;
}

function scorePhotos(photos: unknown[] | null | undefined): number {
  if (!photos || photos.length === 0) return 0;
  if (photos.length >= 3) return 5;
  return 3;
}

function estimateVenueValue(monthlyBudget: string): { monthlyValue: number; annualValue: number } {
  switch (monthlyBudget) {
    case '10k-plus': return { monthlyValue: 12500, annualValue: 150000 };
    case '5k-10k': return { monthlyValue: 7500, annualValue: 90000 };
    case '2k-5k': return { monthlyValue: 3500, annualValue: 42000 };
    case 'under-2k': return { monthlyValue: 1500, annualValue: 18000 };
    default: return { monthlyValue: 0, annualValue: 0 };
  }
}

// ---- Helpers --------------------------------------------------------------

function clampScore(raw: number): number {
  return Math.max(0, Math.min(100, Math.round(raw)));
}
