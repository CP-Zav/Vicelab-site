# 5. Zep Memory Design

## What Zep Provides

Zep is a memory layer for AI applications. In this system, it stores the *relationship history* for each lead — summaries, objections, key facts — so that when you go to reach out to a lead weeks later, you can retrieve what was previously discussed and use it to draft a better message.

Think of Zep as a CRM notes field that:
- Auto-summarizes long conversation histories
- Lets you search semantically ("what did this lead say about pricing?")
- Can be read by an AI model to generate personalized outreach

---

## Memory Architecture

```
Per Lead: One Zep User
  └── Messages (interactions logged chronologically)
        └── Auto-summarized by Zep after ~5 messages
  └── Facts (discrete, structured pieces of info)
        └── "Raised price objection on 2025-04-10"
        └── "Interested in branding package, not events"
        └── "Best contact time: evenings"
```

**Zep Concepts Used:**

| Concept | What it is | How we use it |
|---------|-----------|---------------|
| User | A persistent entity in Zep | One per lead (mapped via `zep_user_id`) |
| Memory | A set of messages for a user | One memory per lead, messages added each interaction |
| Message | A single exchange in a conversation | Each Interaction record = one message |
| Fact | A discrete, extracted piece of information | Objections, preferences, key context |
| Summary | Auto-generated condensation of messages | Retrieved before drafting outreach |

---

## User ID Mapping

Each lead gets a deterministic, human-readable Zep user ID:

```
zep_user_id = "vl-lead-{lead_id}"

Examples:
  VL-1  → vl-lead-1
  VL-42 → vl-lead-42
```

This ID is:
- Written to the Airtable `zep_user_id` field by Zap A
- Used by Zap D to look up the correct Zep user when posting interactions
- Stable — never changes even if the lead's name or handle changes

---

## API Calls Required (Minimal Set)

Only 4 endpoint types are needed for this entire integration.

### 1. Create User (Zap A — once per lead)

```http
POST https://api.getzep.com/api/v2/users
Authorization: Api-Key {{ZEP_API_KEY}}
Content-Type: application/json

{
  "user_id":    "vl-lead-42",
  "email":      "soundsbymax@instagram.lead",
  "first_name": "Sounds By Max",
  "metadata": {
    "business_type": "Creator/Influencer",
    "city":          "Miami",
    "lead_source":   "Instagram Outreach",
    "airtable_id":   "recXXXXXXXXXXXXXX"
  }
}
```

Response: `201 Created` with user object. If `409 Conflict` (user exists), ignore and continue.

---

### 2. Add Memory (Zap D — every interaction)

```http
POST https://api.getzep.com/api/v2/users/vl-lead-42/memory
Authorization: Api-Key {{ZEP_API_KEY}}
Content-Type: application/json

{
  "messages": [
    {
      "role":      "assistant",
      "role_type": "assistant",
      "content":   "Sent initial DM introducing ViceLab branding services. Highlighted their inconsistent color palette.",
      "metadata": {
        "channel":   "Instagram DM",
        "outcome":   "No Reply",
        "timestamp": "2025-04-10T14:30:00Z"
      }
    }
  ]
}
```

- `role: "assistant"` = outbound (you reaching out)
- `role: "user"` = inbound (they replied)
- Zep auto-summarizes after accumulating enough messages

---

### 3. Add Fact (Zap D — only when outcome = Objection Raised)

```http
POST https://api.getzep.com/api/v2/users/vl-lead-42/facts
Authorization: Api-Key {{ZEP_API_KEY}}
Content-Type: application/json

{
  "content": "Objection on 2025-04-12: Said their budget is too tight for a full rebrand right now. Open to a smaller logo refresh package."
}
```

Facts are pinned and always included in retrieved memory — they don't get summarized away.

---

### 4. Get Memory (Manual retrieval before outreach — no Zapier required)

```http
GET https://api.getzep.com/api/v2/users/vl-lead-42/memory
Authorization: Api-Key {{ZEP_API_KEY}}
```

Response includes:
- `summary` — Zep's auto-generated summary of all interactions
- `messages` — recent raw messages
- `facts` — all pinned facts

**How to use this manually:**
1. Look up the lead in Airtable, copy their `zep_user_id`.
2. Make the GET request (use a browser extension like Requestly, Postman, or a simple script).
3. Paste the summary into your drafting context before composing the outreach message.

**Optional upgrade:** Hook this into Claude API or another LLM to auto-draft the outreach message using the retrieved memory as system context.

---

## Memory Schema (What Gets Stored)

### Structured Interaction Record (via message content)

```
[2025-04-10] Outbound · Instagram DM
Sent intro DM. Mentioned logo inconsistency. No reply after 3 days.
Outcome: No Reply
```

### Fact Record (objection/preference)

```
Budget objection (2025-04-12): Open to small package, not full rebrand.
Best channel: Instagram DM (no email)
Best time: Evenings (mentioned they're usually free after 6pm)
```

---

## Memory Retrieval Workflow (Before Outreach)

```
Before you DM a lead:

1. Look up zep_user_id in Airtable → e.g., "vl-lead-42"
2. GET /users/vl-lead-42/memory
3. Read:
   - summary     → what has been said, overall arc
   - facts       → objections, preferences, constraints
   - last message → what was the last thing discussed
4. Draft outreach that references this context
5. After sending, add new Interaction record in Airtable
   → Zap D pushes it to Zep automatically
```

---

## Optional: AI-Assisted Drafting (Future Upgrade)

Once memory retrieval is working, plug it into Claude API:

```python
# Pseudo-code — requires Claude API key
import anthropic
import requests

def draft_outreach(zep_user_id, lead_name):
    # 1. Retrieve memory
    memory = requests.get(
        f"https://api.getzep.com/api/v2/users/{zep_user_id}/memory",
        headers={"Authorization": f"Api-Key {ZEP_API_KEY}"}
    ).json()

    summary = memory.get("summary", "No prior contact.")
    facts = "\n".join([f["content"] for f in memory.get("facts", [])])

    # 2. Draft with Claude
    client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=500,
        system=f"""You are drafting a DM for ViceLab, a branding and design studio.
Lead name: {lead_name}
Prior contact summary: {summary}
Key facts and objections: {facts}
Keep the message short, warm, and specific to their situation.""",
        messages=[
            {"role": "user", "content": "Draft a follow-up DM for this lead."}
        ]
    )
    return response.content[0].text
```

---

## Zep Setup Steps

### Option A: Zep Cloud (Recommended — no infra)
1. Sign up at cloud.getzep.com
2. Create a new project → copy API key
3. Store as `ZEP_API_KEY` in Zapier (use a Zapier Storage or hardcode in Code steps)
4. Free tier includes limited users. Check current pricing at getzep.com.

### Option B: Zep Community (Self-hosted)
1. Requires a VPS (e.g., DigitalOcean $6/mo Droplet) with Docker
2. `docker run -d -p 8000:8000 ghcr.io/getzep/zep:latest`
3. Replace API base URL in all calls: `http://your-vps-ip:8000/api/v2/...`
4. No API key needed on Community edition (or configure one via env vars)

> **Assumption:** This design assumes Zep Cloud. If self-hosting, replace all base URLs and remove the `Api-Key` auth header.

---

## Zep Environment Variables

```
ZEP_API_KEY=z_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ZEP_BASE_URL=https://api.getzep.com   # or http://your-vps:8000 if self-hosted
ZEP_PROJECT_ID=proj_XXXXXXXXXX        # only needed for Zep Cloud multi-project setups
```
