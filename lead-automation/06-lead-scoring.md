# 6. Lead Scoring Logic

## Overview

Scoring runs from 0–100. Higher score = higher priority = reach out sooner.

Two versions:
1. **Simple rules-based** — Implemented now in Zapier Code step (JavaScript). Deterministic. Easy to debug and tune.
2. **Future-ready model** — Architecture for a predictive model that replaces the rules-based version with no Zapier changes required.

---

## Version 1 — Rules-Based Scoring

### Scoring Dimensions

| Dimension | Max Points | Rationale |
|-----------|-----------|-----------|
| Follower count | 20 | Larger audiences = more potential impact from ViceLab work |
| Engagement level | 20 | High engagement = active, real audience = stronger social proof for ViceLab |
| Branding issue severity | 20 | More broken = more urgent need = easier sell |
| Business type fit | 15 | Event brands and creators align best with ViceLab's offer |
| Lead source quality | 10 | Inbound > referral > outbound (warm vs cold) |
| Interaction history | 10 | Active conversation = warmer lead |
| Recency | 5 | Recently contacted = in-context lead |

**Total: 100 points**

---

### Scoring Rules (Pseudo-code)

```
score = 0

// 1. FOLLOWER COUNT (0-20 pts)
if follower_count >= 100000  → score += 20
if follower_count >= 50000   → score += 16
if follower_count >= 20000   → score += 12
if follower_count >= 10000   → score += 8
if follower_count >= 5000    → score += 5
if follower_count >= 1000    → score += 2
else                         → score += 0

// 2. ENGAGEMENT LEVEL (0-20 pts)
if engagement_level == "6%+"   → score += 20
if engagement_level == "3-6%"  → score += 14
if engagement_level == "1-3%"  → score += 7
if engagement_level == "<1%"   → score += 2
if engagement_level == "Unknown" → score += 4  // mild positive: unknown = not disqualifying

// 3. BRANDING ISSUE (0-20 pts)
if branding_issue == "Severe"   → score += 20
if branding_issue == "Moderate" → score += 14
if branding_issue == "Minor"    → score += 7
if branding_issue == "None"     → score += 0
if branding_issue == "Unknown"  → score += 8  // worth investigating

// 4. BUSINESS TYPE FIT (0-15 pts)
if business_type == "Event Brand"          → score += 15
if business_type == "Creator/Influencer"   → score += 13
if business_type == "Small Business"       → score += 10
if business_type == "Venue"                → score += 8
if business_type == "Agency"               → score += 5
if business_type == "Other"                → score += 3

// 5. LEAD SOURCE QUALITY (0-10 pts)
if lead_source == "DM Inquiry"             → score += 10  // they came to you
if lead_source == "Referral"               → score += 9
if lead_source == "Event"                  → score += 7
if lead_source == "Website"                → score += 6
if lead_source == "Instagram Outreach"     → score += 3  // you initiated, coldest
if lead_source == "Other"                  → score += 3

// 6. INTERACTION HISTORY (0-10 pts)
if interaction_count >= 5  → score += 10
if interaction_count >= 3  → score += 7
if interaction_count >= 1  → score += 4
else                       → score += 0

// 7. RECENCY (0-5 pts)
days_since_contact = days since last_contact_date
if days_since_contact == 0   → score += 5
if days_since_contact <= 3   → score += 4
if days_since_contact <= 7   → score += 2
if days_since_contact <= 14  → score += 1
else                         → score += 0

return min(score, 100)
```

---

### JavaScript Implementation (Zapier Code Step)

```javascript
// Zapier Code by Zapier — JavaScript
// Input fields: follower_count, engagement_level, branding_issue,
//               business_type, lead_source, interaction_count,
//               last_contact_date

const followerCount    = parseInt(inputData.follower_count) || 0;
const engagementLevel  = inputData.engagement_level || 'Unknown';
const brandingIssue    = inputData.branding_issue || 'Unknown';
const businessType     = inputData.business_type || 'Other';
const leadSource       = inputData.lead_source || 'Other';
const interactionCount = parseInt(inputData.interaction_count) || 0;
const lastContactDate  = inputData.last_contact_date
                           ? new Date(inputData.last_contact_date)
                           : null;

let score = 0;
const breakdown = [];

// 1. Follower count (0-20)
let followerPts = 0;
if      (followerCount >= 100000) followerPts = 20;
else if (followerCount >= 50000)  followerPts = 16;
else if (followerCount >= 20000)  followerPts = 12;
else if (followerCount >= 10000)  followerPts = 8;
else if (followerCount >= 5000)   followerPts = 5;
else if (followerCount >= 1000)   followerPts = 2;
score += followerPts;
breakdown.push(`followers: ${followerPts}`);

// 2. Engagement (0-20)
const engMap = { '6%+': 20, '3–6%': 14, '1–3%': 7, '<1%': 2, 'Unknown': 4 };
const engPts = engMap[engagementLevel] ?? 4;
score += engPts;
breakdown.push(`engagement: ${engPts}`);

// 3. Branding issue (0-20)
const brandMap = { 'Severe': 20, 'Moderate': 14, 'Minor': 7, 'None': 0, 'Unknown': 8 };
const brandPts = brandMap[brandingIssue] ?? 0;
score += brandPts;
breakdown.push(`branding: ${brandPts}`);

// 4. Business type fit (0-15)
const typeMap = {
  'Event Brand': 15, 'Creator/Influencer': 13, 'Small Business': 10,
  'Venue': 8, 'Agency': 5, 'Other': 3
};
const typePts = typeMap[businessType] ?? 3;
score += typePts;
breakdown.push(`type: ${typePts}`);

// 5. Lead source (0-10)
const sourceMap = {
  'DM Inquiry': 10, 'Referral': 9, 'Event': 7,
  'Website': 6, 'Instagram Outreach': 3, 'Other': 3
};
const sourcePts = sourceMap[leadSource] ?? 3;
score += sourcePts;
breakdown.push(`source: ${sourcePts}`);

// 6. Interaction history (0-10)
let interactionPts = 0;
if      (interactionCount >= 5) interactionPts = 10;
else if (interactionCount >= 3) interactionPts = 7;
else if (interactionCount >= 1) interactionPts = 4;
score += interactionPts;
breakdown.push(`interactions: ${interactionPts}`);

// 7. Recency (0-5)
let recencyPts = 0;
if (lastContactDate) {
  const daysSince = Math.floor((Date.now() - lastContactDate.getTime()) / 86400000);
  if      (daysSince === 0)  recencyPts = 5;
  else if (daysSince <= 3)   recencyPts = 4;
  else if (daysSince <= 7)   recencyPts = 2;
  else if (daysSince <= 14)  recencyPts = 1;
}
score += recencyPts;
breakdown.push(`recency: ${recencyPts}`);

const finalScore = Math.min(score, 100);
const tier = finalScore >= 75 ? 'High' : finalScore >= 45 ? 'Medium' : 'Low';

output = {
  priority_score: finalScore,
  priority_tier: tier,
  score_breakdown: breakdown.join(' | ')
};
```

---

### Airtable Formula Fallback (No-Code Alternative)

If you can't use Zapier Code steps, approximate scoring with this Airtable formula in a `priority_score_formula` field:

```
IF({follower_count} >= 50000, 16,
  IF({follower_count} >= 10000, 8,
  IF({follower_count} >= 1000, 2, 0)))
+
IF({engagement_level} = "6%+", 20,
  IF({engagement_level} = "3–6%", 14,
  IF({engagement_level} = "1–3%", 7, 4)))
+
IF({branding_issue} = "Severe", 20,
  IF({branding_issue} = "Moderate", 14,
  IF({branding_issue} = "Minor", 7, 0)))
+
IF({business_type} = "Event Brand", 15,
  IF({business_type} = "Creator/Influencer", 13,
  IF({business_type} = "Small Business", 10, 5)))
+
IF({lead_source} = "DM Inquiry", 10,
  IF({lead_source} = "Referral", 9, 3))
```

This gives a score out of ~80. Normalize by dividing by 0.8 in a separate formula field. Airtable formula scores are read-only and auto-update — no Zapier needed.

---

### Score Tiers

| Tier | Range | Meaning | Default action |
|------|-------|---------|---------------|
| High | 75–100 | Strong fit, high urgency | Follow up within 24h |
| Medium | 45–74 | Worth pursuing, lower urgency | Follow up within 3 days |
| Low | 0–44 | Weak fit or low signal | Queue for batch outreach |

---

## Version 2 — Future-Ready Predictive Scoring

### Architecture

Replace the Zapier Code step with an API call to a scoring microservice:

```
Zap A / Zap D:
  Instead of: Code step (scoring logic)
  Call:        POST https://api.vicelab.co/score-lead
               Body: { all lead fields }
               Response: { priority_score, priority_tier, model_version }
```

The microservice can be implemented as:
- A **Cloudflare Worker** (free, serverless, fast) running the current rule-based logic
- Later upgraded to a **trained classifier** (logistic regression or XGBoost) without changing Zapier at all

### Training Data Requirements

To train a predictive model you'll need:
- ~100+ closed leads with labeled outcomes (Won/Lost)
- Features: all current scoring inputs
- Label: `1 = Closed Won`, `0 = Closed Lost`

Export from Airtable as CSV when you have enough data.

### Suggested Feature Additions for V2 Model

| New Feature | Source | Why |
|------------|--------|-----|
| `days_to_first_reply` | Interactions table | Faster reply = warmer lead |
| `num_objections` | Count of Objection Raised interactions | More objections = harder sell |
| `avg_reply_rate` | Interactions direction ratio | They reply more = higher intent |
| `niche_match_score` | Manual field (0-5) | How closely their brand fits ViceLab's aesthetic |
| `seasonal_boost` | Calendar-based | Event brands score higher in Q4/Q1 |

### Scoring API Contract (for future implementation)

```json
// Request
POST /score-lead
{
  "lead_id":         "VL-42",
  "follower_count":  25000,
  "engagement_level": "3–6%",
  "branding_issue":  "Moderate",
  "business_type":   "Event Brand",
  "lead_source":     "Referral",
  "interaction_count": 2,
  "last_contact_date": "2025-04-10"
}

// Response
{
  "priority_score":  74,
  "priority_tier":   "Medium",
  "score_breakdown": "followers: 12 | engagement: 14 | branding: 14 | type: 15 | source: 9 | interactions: 7 | recency: 3",
  "model_version":   "rules-v1"
}
```

When you upgrade to a trained model, `model_version` changes to `"ml-v1"` — nothing else in Zapier changes.
