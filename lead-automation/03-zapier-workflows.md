# 3. Zapier Workflows

## Overview

| Zap | Name | Trigger | Key Actions | Tasks/run |
|-----|------|---------|-------------|-----------|
| A | New Lead Alert | New Airtable record | Score → Slack alert → Task → Zep user | ~5 |
| B | Lead Status Updated | Updated Airtable record | Route by status → date math → Slack | ~3 |
| C | Follow-up Reminder | Scheduled (daily 9am) | Find overdue leads → Slack reminder → ensure task | ~3 |
| D | Interaction Logged | New Airtable Interaction record | Push to Zep → update last_contact_date → rescore | ~4 |

> **Plan requirement:** All four Zaps require Zapier Starter ($19.99/mo) for multi-step Zaps and Code by Zapier steps. The Code steps run JavaScript and are needed for scoring and date math.

---

## Zap A — New Lead Created

### Purpose
When a new lead is added to Airtable, score it, alert Slack, create a follow-up task, and initialize Zep memory.

### Trigger
```
App:    Airtable
Event:  New Record
Table:  Leads
```

### Step-by-Step

```
Step 1: TRIGGER — Airtable: New Record in Leads
  Output: All lead fields

Step 2: CODE — Calculate Priority Score (JavaScript)
  Input:
    follower_count    = {{step1.follower_count}}
    engagement_level  = {{step1.engagement_level}}
    branding_issue    = {{step1.branding_issue}}
    business_type     = {{step1.business_type}}
    lead_source       = {{step1.lead_source}}
  Output: priority_score (0-100), score_breakdown (string)

  [See scoring logic in 06-lead-scoring.md]

Step 3: FORMATTER — Format Instagram handle
  App:    Formatter by Zapier
  Event:  Text → Replace
  Input:  {{step1.instagram_handle}}
  Find:   @
  Replace: (empty)
  Output: clean_handle

Step 4: AIRTABLE — Update Record (write score back)
  Table:  Leads
  Record: {{step1.id}}
  Fields:
    priority_score = {{step2.priority_score}}
    zep_user_id    = vl-lead-{{step1.lead_id}}

Step 5: SLACK — Send Channel Message to #leads
  Message: [See Slack template: New Lead Alert in 04-slack-templates.md]
  Use blocks payload for formatted message.

Step 6: FILTER — Only continue if status = "New"
  App:    Filter by Zapier
  Condition: {{step1.status}} exactly matches "New"

Step 7: AIRTABLE — Create Record in Tasks
  Table:  Tasks
  Fields:
    lead_id    = {{step1.id}}   (linked record)
    task_type  = "Follow-up DM"
    due_date   = [TODAY + 2 days — see date math below]
    status     = "Open"
    task_notes = "Initial follow-up for new lead: {{step1.brand_name}}"
    created_by = "Zap A"

Step 8: ZEP — Create User (HTTP POST)
  URL:     https://api.getzep.com/api/v2/users
  Method:  POST
  Headers: Authorization: Api-Key {{ZEP_API_KEY}}
  Body:
    {
      "user_id":   "vl-lead-{{step1.lead_id}}",
      "email":     "{{step1.instagram_handle}}@instagram.lead",
      "first_name": "{{step1.brand_name}}",
      "metadata": {
        "business_type": "{{step1.business_type}}",
        "city":          "{{step1.city}}",
        "lead_source":   "{{step1.lead_source}}",
        "airtable_id":   "{{step1.id}}"
      }
    }
```

### Date Math for Step 7 (due_date = TODAY + 2)

Use a Code by Zapier step before Step 7:

```javascript
// Code by Zapier — JavaScript
const today = new Date();
today.setDate(today.getDate() + 2);
const dueDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
output = { due_date: dueDate };
```

### Notes
- Step 6 filter stops the Zap for leads already in non-New states (e.g., if you import old leads).
- Step 8 uses Zapier's built-in "Webhooks by Zapier" action in POST mode for the Zep API call.
- If Zep returns a 409 (user already exists), the Zap continues — this is safe to ignore.

---

## Zap B — Lead Status Updated

### Purpose
When a lead's status changes in Airtable, take the appropriate action: set follow-up date, send priority Slack alert, or close tasks.

### Trigger
```
App:    Airtable
Event:  Updated Record
Table:  Leads
Condition: "status" field changed  ← enable "Trigger on field change" if available
```

> **Note:** Airtable's Zapier integration may not support field-level change detection on all plans. As a workaround, the Zap runs on any update and uses Filter steps to route by status value.

### Step-by-Step

```
Step 1: TRIGGER — Airtable: Updated Record in Leads
  Output: All lead fields (current values)

Step 2: FILTER PATH A — Status = "Contacted"
  Condition: {{step1.status}} exactly matches "Contacted"
  → If true, continue to steps 3-4
  → If false, skip to Path B

  Step 3: CODE — Calculate follow-up date (TODAY + 3)
    JavaScript:
      const d = new Date();
      d.setDate(d.getDate() + 3);
      output = { followup_date: d.toISOString().split('T')[0] };

  Step 4: AIRTABLE — Update Record
    Table:  Leads
    Record: {{step1.id}}
    Fields:
      next_followup_date = {{step3.followup_date}}
      last_contact_date  = [TODAY]

Step 5: FILTER PATH B — Status = "Qualified"
  Condition: {{step1.status}} exactly matches "Qualified"
  → If true, continue to steps 6-7

  Step 6: SLACK — Send to #leads (HIGH PRIORITY format)
    [See Slack template: High-Priority Lead Alert]

  Step 7: AIRTABLE — Create Task (if none exists — note: Zapier can't check; create anyway)
    task_type  = "Send Proposal"
    due_date   = [TODAY + 1]
    status     = "Open"
    created_by = "Zap B"

Step 8: FILTER PATH C — Status = "Closed Won" OR "Closed Lost"
  Condition: {{step1.status}} contains "Closed"

  Step 9: AIRTABLE — Search Records in Tasks
    Filter: lead_id = {{step1.id}} AND status = "Open"

  Step 10: AIRTABLE — Update Record (close each open task)
    Table:  Tasks
    Record: {{step9.id}}
    Fields:
      status     = "Cancelled"
      task_notes = "Auto-closed: lead moved to {{step1.status}}"

  Step 11: SLACK — Send Won/Lost notification
    [See Slack template: Lead Won / Lost Notification]
```

> **Limitation:** Step 10 only closes one Task record per Zap run. If a lead has multiple open tasks, you'll need a Zap with a "Looping by Zapier" action (paid add-on) or handle this in Airtable's native automation instead.

### Airtable Native Automation Alternative (Recommended for task closing)

```
Trigger: Status field changes to "Closed Won" or "Closed Lost"
Action:  Find records in Tasks WHERE lead_id = this record AND status = Open
Action:  Update each found record → status = "Cancelled"
```

This handles bulk task closing better than Zapier for this specific step.

---

## Zap C — Follow-up Reminder

### Purpose
Every morning, scan for leads whose follow-up date is today or overdue, and send Slack reminders.

### Trigger
```
App:    Schedule by Zapier
Event:  Every Day at 9:00 AM (your timezone)
```

### Step-by-Step

```
Step 1: TRIGGER — Schedule: Every day at 9:00 AM

Step 2: CODE — Build today's date string
  JavaScript:
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    const overdueThreshold = twoDaysAgo.toISOString().split('T')[0];
    output = { today: todayStr, overdue_threshold: overdueThreshold };

Step 3: AIRTABLE — Search Records in Leads
  Filter formula: AND(
    IS_BEFORE({next_followup_date}, DATEADD(TODAY(), 1, 'days')),
    NOT(OR({status} = "Closed Won", {status} = "Closed Lost")),
    NOT({next_followup_date} = "")
  )
  Sort: next_followup_date ASC
  Max records: 10

Step 4: FILTER — Stop if no records found
  Condition: {{step3.id}} exists

Step 5: CODE — Classify each lead as due-today vs overdue
  JavaScript:
    const followupDate = new Date(inputData.next_followup_date);
    const today = new Date(inputData.today);
    const diffDays = Math.floor((today - followupDate) / (1000 * 60 * 60 * 24));
    const isOverdue = diffDays > 2;
    output = {
      is_overdue: isOverdue ? "true" : "false",
      days_overdue: diffDays > 0 ? diffDays : 0
    };

Step 6: SLACK — Send message to #leads
  Template: Follow-up Reminder (or Overdue Reminder if {{step5.is_overdue}} = "true")
  [See 04-slack-templates.md]

Step 7: AIRTABLE — Search Tasks for this lead
  Filter: lead_id = {{step3.id}} AND status = "Open" AND task_type = "Follow-up DM"

Step 8: FILTER — Only create task if none found
  Condition: {{step7.id}} does NOT exist

  Step 9: AIRTABLE — Create Record in Tasks
    task_type  = "Follow-up DM"
    due_date   = [TODAY]
    status     = "Open"
    task_notes = "Auto-created by reminder Zap — follow-up overdue"
    created_by = "Zap C"
```

> **Note:** Zap C only processes the first record returned by the Airtable search in a single run without Looping by Zapier. For multiple overdue leads, use Looping by Zapier (paid add-on) or run the Zap trigger at higher frequency and accept one notification per run per lead.
>
> **Simple workaround:** Create a separate Airtable Automation for each overdue lead that fires independently via webhook to Zapier. Or use Airtable's built-in automation to send Slack messages for follow-up dates without Zapier at all for this step.

---

## Zap D — Interaction Logged

### Purpose
When a new Interaction record is added, push it to Zep memory, update the Lead's last_contact_date, and recalculate priority score.

### Trigger
```
App:    Airtable
Event:  New Record
Table:  Interactions
```

### Step-by-Step

```
Step 1: TRIGGER — Airtable: New Record in Interactions
  Output: All interaction fields including linked lead_id

Step 2: AIRTABLE — Find Record in Leads
  Search: id = {{step1.lead_id}}
  Output: Full lead record (for scoring inputs)

Step 3: WEBHOOKS — POST to Zep (add memory)
  URL:    https://api.getzep.com/api/v2/users/{{step2.zep_user_id}}/memory
  Method: POST
  Headers: Authorization: Api-Key {{ZEP_API_KEY}}
           Content-Type: application/json
  Body:
    {
      "messages": [
        {
          "role": "{{step1.direction == 'Inbound' ? 'user' : 'assistant'}}",
          "role_type": "{{step1.direction == 'Inbound' ? 'user' : 'assistant'}}",
          "content": "{{step1.message_summary}}",
          "metadata": {
            "channel":   "{{step1.channel}}",
            "outcome":   "{{step1.outcome}}",
            "timestamp": "{{step1.timestamp}}"
          }
        }
      ]
    }

Step 4: [OPTIONAL] WEBHOOKS — POST fact to Zep if objection raised
  Condition: {{step1.outcome}} = "Objection Raised"
  URL:    https://api.getzep.com/api/v2/users/{{step2.zep_user_id}}/facts
  Method: POST
  Body:
    {
      "content": "Objection raised on {{step1.timestamp}}: {{step1.objection_notes}}"
    }

Step 5: CODE — Recalculate priority score
  [Same scoring logic as Zap A Step 2 — see 06-lead-scoring.md]
  Additional input: interaction_count = {{step2.interaction_count}}
  Output: new_priority_score

Step 6: FORMATTER — Today's date
  App:    Formatter by Zapier
  Event:  Date/Time → Format
  Input:  now
  Format: YYYY-MM-DD
  Output: today_date

Step 7: AIRTABLE — Update Record in Leads
  Record: {{step2.id}}
  Fields:
    last_contact_date = {{step6.today_date}}
    priority_score    = {{step5.new_priority_score}}
```

### Zep Memory Note
Zep automatically summarizes messages added via the memory endpoint. After ~5 messages, Zep creates a summary that replaces raw messages in retrieved context, keeping memory efficient.

---

## Zapier Zap Configuration Checklist

- [ ] Connected Airtable account in Zapier
- [ ] Connected Slack account in Zapier (bot or user token with `chat:write` scope)
- [ ] Webhooks by Zapier enabled (built-in, no setup)
- [ ] Set environment variables in Zapier (use "App" connections or store keys in Code step variables):
  - `ZEP_API_KEY` — Zep API key
  - `AIRTABLE_BASE_ID` — from Airtable API docs
- [ ] Test each Zap with a sample lead before going live
- [ ] Enable Zaps in this order: D → A → B → C (D first so Zep users exist before interactions are logged)

---

## Zapier Limitations Summary

| Limitation | Impact | Workaround |
|-----------|--------|-----------|
| Polling (1–15 min delay) | Leads alerts not instant | Airtable Automation + Webhook trigger |
| No looping without paid add-on | Zap C only processes 1 overdue lead | Looping by Zapier or Airtable Automation |
| No conditional branching natively | Status routing uses multiple Filter steps | Paths by Zapier (paid) for cleaner routing |
| Airtable field-change detection | Zap B fires on any update | Add a Filter step to check status value |
| Rate limits | Airtable: 5 req/sec; Zep: varies | Add delays between steps if needed |
