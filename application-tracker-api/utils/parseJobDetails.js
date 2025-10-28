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

// --- Helper: Enhanced parsing for company + role ---
function parseJobDetails(subject) {
  let company = "Unknown";
  let role = "Unknown";

  // Common email subject patterns:
  // 1. "Your application for [Role] at [Company]"
  // 2. "[Company]: Thank you for applying for [Role]"
  // 3. "[Role] application received - [Company]"
  // 4. "[Company] - [Role] application confirmation"

  // First, clean up the subject
  subject = subject.replace(/Re:|Fwd:|FW:/gi, "").trim();

  // Try to extract role first as it's often more specific
  const rolePatterns = [
    /(?:for|position of|role of|as(?: a)?|the) ((?:Sr\.?|Senior |Lead |Staff |Principal |Junior |Jr\.? |)?[A-Z][a-zA-Z\d\s]+(?:Developer|Engineer|Manager|Designer|Architect|Consultant|Analyst|Administrator|Lead|Expert|Specialist|Director|VP|Head|Professional))/,
    /((?:Sr\.?|Senior |Lead |Staff |Principal |Junior |Jr\.? |)?[A-Z][a-zA-Z\d\s]+(?:Developer|Engineer|Manager|Designer|Architect|Consultant|Analyst|Administrator|Lead|Expert|Specialist|Director|VP|Head|Professional)) (?:position|role|opportunity)/,
    /(?:Sr\.?|Senior |Lead |Staff |Principal |Junior |Jr\.? |)?(?:Software|Full[- ]Stack|Backend|Frontend|DevOps|Cloud|Data|ML|AI|Mobile|Web|QA|Test) (?:Developer|Engineer|Architect)/i,
  ];

  for (let pattern of rolePatterns) {
    const match = subject.match(pattern);
    if (match && match[1]) {
      role = match[1].trim();
      break;
    }
  }

  // Then try to extract company
  const companyPatterns = [
    // Match company name between 'to' and 'successfully'
    /(?:to\s+)([A-Z][A-Za-z0-9._&\s-]+?)(?:\s+successfully)/,
    // Match company name after common prepositions
    /(?:at|to|with|from|@|for)\s+([A-Z][A-Za-z0-9._&\s-]+?)(?=\s+(?:Team|LLC|Inc|Corp|Ltd)|[-:|]|$)/,
    // Match at start of subject
    /^([A-Z][A-Za-z0-9._&\s-]+?)(?=\s+(?:Team|LLC|Inc|Corp|Ltd)|[:|\-]|$)/,
    // Match after common prefixes
    /(?:Welcome to|Thank you from|Application at)\s+([A-Z][A-Za-z0-9._&\s-]+?)(?=\s+(?:Team|LLC|Inc|Corp|Ltd)|[-:|]|$)/,
  ];

  for (let pattern of companyPatterns) {
    const match = subject.match(pattern);
    if (match && match[1]) {
      company = match[1]
        .trim()
        .replace(/(?:Team|LLC|Inc|Corp|Ltd)$/i, "")
        .trim();
      break;
    }
  }

  // If role is still unknown but we found common keywords, use them
  if (role === "Unknown") {
    const roleKeywords = subject.match(
      /(?:SDE|Engineer|Developer|Intern|Manager|Designer|Architect|Consultant|Analyst|Administrator|Lead|Expert|Specialist|Director)/i
    );
    if (roleKeywords) {
      role = roleKeywords[0];
    } else {
      role = "Software Engineer"; // default fallback
    }
  }

  return { company, role };
}

module.exports = { parseJobDetails, isLikelyApplication };
