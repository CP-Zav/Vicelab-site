# 7. Step-by-Step Implementation Checklist

Complete in order. Each phase builds on the previous.

---

## Phase 1 — Airtable Setup (Day 1, ~2 hours)

### 1.1 Create the Base
- [ ] Log in to Airtable
- [ ] Create new Base: `ViceLab CRM`
- [ ] Delete the default empty table

### 1.2 Build the Leads Table
- [ ] Rename default table to `Leads`
- [ ] Add all fields from [02-airtable-schema.md](./02-airtable-schema.md) — Leads table section
- [ ] Set field types exactly as specified (Single select, Number, Date, etc.)
- [ ] Add all dropdown options for `status`, `business_type`, `engagement_level`, `branding_issue`, `lead_source`
- [ ] Add the `priority_tier` Formula field: `IF({priority_score} >= 75, "High", IF({priority_score} >= 45, "Medium", "Low"))`
- [ ] Add the `days_since_contact` Formula field: `DATETIME_DIFF(TODAY(), {last_contact_date}, 'days')`
- [ ] Lock the `priority_score` field description: "Managed by Zapier — do not edit manually"

### 1.3 Build the Interactions Table
- [ ] Create new table: `Interactions`
- [ ] Add all fields from schema
- [ ] Set `lead_id` as Linked Record → Leads
- [ ] Add `brand_name` as Lookup field via `lead_id` link

### 1.4 Build the Tasks Table
- [ ] Create new table: `Tasks`
- [ ] Add all fields from schema
- [ ] Set `lead_id` as Linked Record → Leads
- [ ] Add `brand_name` as Lookup field via `lead_id` link

### 1.5 Create Views
- [ ] Leads → Pipeline (Kanban by status)
- [ ] Leads → Priority Queue (Grid, sort priority_score DESC)
- [ ] Leads → Follow-up Calendar (Calendar, date = next_followup_date)
- [ ] Leads → Overdue Follow-ups (Grid, filter: next_followup_date < TODAY AND status not Closed)
- [ ] Tasks → Open Tasks (Grid, filter: status = Open or In Progress, sort due_date ASC)
- [ ] Tasks → Overdue Tasks (Grid, filter: status = Open AND due_date < TODAY)

### 1.6 API Credentials
- [ ] Go to Airtable Account → API → Create personal access token
- [ ] Grant scope: `data.records:read`, `data.records:write`
- [ ] Note: Base ID (starts with `app...`) from API docs URL
- [ ] Note: Table IDs for Leads, Interactions, Tasks
- [ ] Store in a secure note (1Password, Notion private page, etc.)

### 1.7 Add a Test Lead
- [ ] Add one real or fake lead manually to verify fields work
- [ ] Confirm all Formula fields compute correctly

---

## Phase 2 — Slack Setup (Day 1, ~30 min)

### 2.1 Create Slack Bot
- [ ] Go to api.slack.com/apps → Create App → From Scratch
- [ ] Name: `ViceLab CRM`
- [ ] Select your workspace
- [ ] Go to OAuth & Permissions → Bot Token Scopes → Add: `chat:write`, `chat:write.public`
- [ ] Install App to Workspace
- [ ] Copy Bot OAuth Token (`xoxb-...`)

### 2.2 Create Channels
- [ ] Create `#leads` channel in Slack
- [ ] Invite the ViceLab CRM bot: `/invite @ViceLabCRM`
- [ ] (Optional) Create `#leads-priority` and invite bot

### 2.3 Test Slack
- [ ] Use Postman or curl to send a test message to `#leads` via the bot token
  ```bash
  curl -X POST https://slack.com/api/chat.postMessage \
    -H "Authorization: Bearer xoxb-YOUR-TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"channel":"#leads","text":"ViceLab CRM bot connected."}'
  ```
- [ ] Confirm message appears in Slack

---

## Phase 3 — Zep Setup (Day 1, ~30 min)

### Option A: Zep Cloud
- [ ] Sign up at cloud.getzep.com
- [ ] Create a new project
- [ ] Copy API key
- [ ] Test: Create a test user via API (Postman or curl)
  ```bash
  curl -X POST https://api.getzep.com/api/v2/users \
    -H "Authorization: Api-Key YOUR_ZEP_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"user_id":"test-user-1","first_name":"Test Lead"}'
  ```
- [ ] Confirm 201 response

### Option B: Zep Self-Hosted
- [ ] Provision VPS (DigitalOcean, Hetzner, etc.) with Docker installed
- [ ] Run: `docker run -d -p 8000:8000 ghcr.io/getzep/zep:latest`
- [ ] Test: `curl http://your-vps-ip:8000/api/v2/users`
- [ ] Set up firewall to allow only your IP on port 8000 (security)

---

## Phase 4 — Zapier Setup (Day 2, ~3–4 hours)

### 4.1 Connect Apps
- [ ] In Zapier, connect Airtable account using API key
- [ ] Connect Slack account using bot OAuth token
- [ ] Enable Webhooks by Zapier (built-in, no install needed)

### 4.2 Build Zap D First (Interaction Logger)

> Build D before A so Zep users exist before interactions are logged.

- [ ] Create Zap: New Record in Airtable → Interactions table
- [ ] Add Step 2: Airtable → Find Lead record by ID
- [ ] Add Step 3: Webhooks → POST to Zep memory endpoint
- [ ] Add Step 4: Filter → Only if outcome = Objection Raised
  - [ ] Sub-step: Webhooks → POST to Zep facts endpoint
- [ ] Add Step 5: Code by Zapier (JS) — scoring logic from [06-lead-scoring.md](./06-lead-scoring.md)
- [ ] Add Step 6: Formatter → today's date
- [ ] Add Step 7: Airtable → Update Lead (last_contact_date + priority_score)
- [ ] Test with a real interaction record
- [ ] Enable Zap D

### 4.3 Build Zap A (New Lead)
- [ ] Create Zap: New Record in Airtable → Leads table
- [ ] Add Step 2: Code by Zapier (JS) — scoring logic
- [ ] Add Step 3: Formatter → clean instagram handle
- [ ] Add Step 4: Code by Zapier (JS) — due date = TODAY + 2
- [ ] Add Step 5: Airtable → Update Lead (priority_score + zep_user_id)
- [ ] Add Step 6: Slack → Send message to #leads (paste Block Kit JSON from [04-slack-templates.md](./04-slack-templates.md))
- [ ] Add Step 7: Filter → status = "New"
- [ ] Add Step 8: Airtable → Create Task (follow-up)
- [ ] Add Step 9: Webhooks → POST to Zep (create user)
- [ ] Test with the test lead from Phase 1
- [ ] Verify Slack message appears, task created, Zep user created
- [ ] Enable Zap A

### 4.4 Build Zap B (Status Updated)
- [ ] Create Zap: Updated Record in Airtable → Leads table
- [ ] Add Step 2: Filter → status = "Contacted"
  - [ ] Sub-step: Code (date +3)
  - [ ] Sub-step: Airtable → Update Lead (next_followup_date)
- [ ] Add Step 3: Filter → status = "Qualified"
  - [ ] Sub-step: Slack → High-priority alert
  - [ ] Sub-step: Code (date +1)
  - [ ] Sub-step: Airtable → Create Task (Send Proposal)
- [ ] Add Step 4: Filter → status contains "Closed"
  - [ ] Sub-step: Airtable → Search Tasks (open tasks for lead)
  - [ ] Sub-step: Airtable → Update Task (status = Cancelled)
  - [ ] Sub-step: Slack → Won or Lost notification (use a Filter to differentiate)
- [ ] Test by updating a lead's status to "Contacted", then "Qualified"
- [ ] Verify follow-up date set, Slack alerts sent
- [ ] Enable Zap B

### 4.5 Build Zap C (Follow-up Reminder)
- [ ] Create Zap: Schedule by Zapier → Every day at 9:00 AM
- [ ] Add Step 2: Code → today's date string + overdue threshold
- [ ] Add Step 3: Airtable → Search Leads (next_followup_date <= today, not Closed)
- [ ] Add Step 4: Filter → records found
- [ ] Add Step 5: Code → classify overdue vs due-today
- [ ] Add Step 6: Slack → send reminder (switch template based on overdue flag)
- [ ] Add Step 7: Airtable → Search Tasks (open follow-up for this lead)
- [ ] Add Step 8: Filter → no open task found
  - [ ] Sub-step: Airtable → Create Task
- [ ] Test by temporarily setting a lead's next_followup_date to yesterday
- [ ] Enable Zap C

---

## Phase 5 — Verify End-to-End (Day 2–3, ~1 hour)

### Acceptance Test Checklist

- [ ] **Test A:** Add a new lead → Confirm Slack alert in #leads, task created in Tasks, Zep user created
- [ ] **Test B:** Change lead status to Contacted → Confirm next_followup_date set to +3 days
- [ ] **Test C:** Change lead status to Qualified → Confirm Slack high-priority alert, "Send Proposal" task created
- [ ] **Test D:** Change lead status to Closed Won → Confirm open tasks cancelled, Slack Won notification
- [ ] **Test E:** Add an Interaction → Confirm Zep memory updated, last_contact_date updated, score recalculated
- [ ] **Test F:** Set next_followup_date to yesterday on a lead → Run Zap C manually → Confirm Slack reminder sent
- [ ] **Test G:** Retrieve Zep memory for test lead → Confirm summary populated after 2+ interactions

---

## Phase 6 — Ongoing Operations (Week 1+)

- [ ] Add real leads and monitor first week of automations
- [ ] Check Zapier task usage — stay under 750 tasks/mo on Starter
- [ ] Review Airtable Priority Queue daily
- [ ] Respond to Slack reminders and update Airtable statuses
- [ ] Monthly: Export Leads table, review Won/Lost ratio, tune scoring weights
- [ ] After ~50 leads: consider building the predictive scoring model (see [06-lead-scoring.md](./06-lead-scoring.md) V2 section)

---

## Environment Variables — Master List

Store all of these securely (1Password, Notion private doc, or encrypted .env file):

```env
# Airtable
AIRTABLE_API_KEY=pat_XXXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_LEADS_TABLE_ID=tblXXXXXXXXXXXXXX
AIRTABLE_INTERACTIONS_TABLE_ID=tblXXXXXXXXXXXXXX
AIRTABLE_TASKS_TABLE_ID=tblXXXXXXXXXXXXXX

# Slack
SLACK_BOT_TOKEN=xoxb-XXXXXXXXXXXX-XXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX
SLACK_CHANNEL_LEADS=#leads
SLACK_CHANNEL_PRIORITY=#leads-priority

# Zep
ZEP_API_KEY=z_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ZEP_BASE_URL=https://api.getzep.com

# Future (Claude API for AI-assisted drafting)
CLAUDE_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
