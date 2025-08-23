// --- Positive & Negative Signals ---
const POSITIVE_SUBJECT = [
  "application",
  "applied",
  "application received",
  "thanks for applying",
  "we received your application",
  "your application",
  "job application",
  "career portal",
  "recruiter",
  "talent acquisition",
];

const POSITIVE_BODY = [
  "thank you for applying",
  "we received your application",
  "your application has been received",
  "we’ll review your application",
  "our recruiting team",
  "talent acquisition",
];

const NEGATIVE_HINTS = [
  "sale",
  "discount",
  "offer",
  "course",
  "webinar",
  "newsletter",
  "subscribe",
  "unsubscribe",
  "₹",
  "promo",
  "deal",
  "buy now",
];

const ATS_DOMAINS = [
  "greenhouse.io",
  "lever.co",
  "workday.com",
  "smartrecruiters.com",
  "successfactors.com",
  "jobvite.com",
  "icims.com",
];

// --- Helper: Stronger Application Detection ---
function isLikelyApplication({ subject, bodyText, from }) {
  let score = 0;

  const s = (subject || "").toLowerCase();
  const b = (bodyText || "").toLowerCase();
  const f = (from || "").toLowerCase();

  // --- Subject & Body Positive Keywords ---
  if (POSITIVE_SUBJECT.some((k) => s.includes(k))) score += 3;
  if (POSITIVE_BODY.some((k) => b.includes(k))) score += 3;

  // --- Sender Domain ---
  if (ATS_DOMAINS.some((d) => f.includes(d))) score += 4;
  if (/@(jobs|careers|recruiting|talent)\./.test(f)) score += 3;

  // --- Negative Signals ---
  if (NEGATIVE_HINTS.some((k) => s.includes(k) || b.includes(k))) score -= 4;
  if (/@(udemy|coursera|promotions|newsletter)\./.test(f)) score -= 5;

  // --- Threshold ---
  return score >= 3; // ✅ Consider as application if score strong enough
}

// --- Helper: Crude parsing for company + role ---
function parseJobDetails(subject) {
  let company = "Unknown";
  let role = "Software Engineer"; // default

  // try extracting from subject
  if (/google/i.test(subject)) company = "Google";
  if (/microsoft/i.test(subject)) company = "Microsoft";
  if (/linkedin/i.test(subject)) company = "LinkedIn";

  if (subject.match(/SDE|Engineer|Developer|Intern/i)) {
    role = subject.match(/SDE|Engineer|Developer|Intern/i)[0];
  }

  return { company, role };
}

module.exports = { parseJobDetails, isLikelyApplication };
