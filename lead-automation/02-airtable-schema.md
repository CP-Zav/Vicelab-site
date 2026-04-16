# 2. Airtable Schema

## Base Name: `ViceLab CRM`

Create one Airtable Base with the following tables. Tables are linked by record ID via Linked Record fields.

---

## Table 1: Leads

**Purpose:** Master record for every potential client. One row = one lead.

| Field Name | Airtable Type | Options / Notes |
|---|---|---|
| `lead_id` | Autonumber | Auto-generated. Use as a stable identifier prefix: `VL-{n}` |
| `brand_name` | Single line text | Primary record name field |
| `instagram_handle` | Single line text | Store without `@`. Validate format in Zapier. |
| `business_type` | Single select | Options: `Event Brand`, `Creator/Influencer`, `Small Business`, `Agency`, `Venue`, `Other` |
| `city` | Single line text | City only. Country optional. |
| `follower_count` | Number | Integer. Pull manually or via Instagram API if available. |
| `engagement_level` | Single select | Options: `<1%`, `1–3%`, `3–6%`, `6%+`, `Unknown` |
| `branding_issue` | Single select | Options: `None`, `Minor`, `Moderate`, `Severe`, `Unknown` — your assessment of their brand health |
| `lead_source` | Single select | Options: `Instagram Outreach`, `Referral`, `Event`, `DM Inquiry`, `Website`, `Other` |
| `status` | Single select | Options: `New`, `Contacted`, `In Conversation`, `Qualified`, `Proposal Sent`, `Closed Won`, `Closed Lost`, `On Hold` |
| `priority_score` | Number | 0–100. Calculated by Zapier and written back via API. |
| `priority_tier` | Formula | `IF({priority_score} >= 75, "High", IF({priority_score} >= 45, "Medium", "Low"))` |
| `last_contact_date` | Date | Date only (no time). Updated by Zap D on each interaction. |
| `next_followup_date` | Date | Date only. Set by Zap B when status changes to Contacted. |
| `days_since_contact` | Formula | `DATETIME_DIFF(TODAY(), {last_contact_date}, 'days')` — useful for overdue detection |
| `owner` | Single line text | Operator name or initials. Defaults to "VP" (ViceLab). |
| `notes` | Long text | Free-form. Internal notes only. |
| `zep_user_id` | Single line text | Zep user ID. Written by Zap A when lead is created. Format: `vl-lead-{lead_id}` |
| `interaction_count` | Count | Linked count of Interactions records |
| `created_at` | Created time | Auto-set by Airtable |
| `updated_at` | Last modified time | Auto-set by Airtable |

### Status Flow (Kanban)

```
New → Contacted → In Conversation → Qualified → Proposal Sent → Closed Won
                                                              └─────────────→ Closed Lost
On Hold (can re-enter at any stage)
```

### Recommended Views

| View Name | Type | Filter / Sort |
|-----------|------|--------------|
| Pipeline | Kanban | Group by: status |
| Priority Queue | Grid | Sort: priority_score DESC, Filter: status != Closed Won/Lost |
| Follow-up Calendar | Calendar | Date field: next_followup_date |
| Overdue Follow-ups | Grid | Filter: next_followup_date < TODAY() AND status not Closed |
| My Leads | Grid | Filter: owner = "VP" |

---

## Table 2: Interactions

**Purpose:** Log every touchpoint with a lead. One row = one interaction.

| Field Name | Airtable Type | Options / Notes |
|---|---|---|
| `interaction_id` | Autonumber | Auto-generated |
| `lead_id` | Linked record → Leads | Links to the parent Lead record |
| `brand_name` | Lookup → lead_id | Pulls brand_name from linked Lead (read-only) |
| `channel` | Single select | Options: `Instagram DM`, `Email`, `WhatsApp`, `Phone`, `In Person`, `Slack`, `Other` |
| `direction` | Single select | Options: `Outbound` (you reached out), `Inbound` (they reached out) |
| `message_summary` | Long text | 1–3 sentence summary. This is what goes to Zep memory. |
| `raw_message` | Long text | Full message text (optional). Stored locally, not sent to Zep. |
| `outcome` | Single select | Options: `No Reply`, `Replied`, `Interested`, `Not Interested`, `Meeting Booked`, `Follow-up Needed`, `Objection Raised` |
| `objection_notes` | Long text | Only fill if outcome = Objection Raised. Goes to Zep as a fact. |
| `timestamp` | Date/Time | When the interaction occurred. Set manually or auto-created. |
| `created_at` | Created time | When this record was added to Airtable |

### Recommended Views

| View Name | Type | Filter |
|-----------|------|--------|
| All Interactions | Grid | None (newest first) |
| Objections Log | Grid | Filter: outcome = Objection Raised |
| Recent Activity | Grid | Filter: created_at in last 7 days |

---

## Table 3: Tasks

**Purpose:** Action items tied to leads. Think of this as a simple to-do queue.

| Field Name | Airtable Type | Options / Notes |
|---|---|---|
| `task_id` | Autonumber | Auto-generated |
| `lead_id` | Linked record → Leads | Links to parent Lead |
| `brand_name` | Lookup → lead_id | Pulls brand_name from linked Lead |
| `task_type` | Single select | Options: `Follow-up DM`, `Send Proposal`, `Schedule Call`, `Research Lead`, `Close Out`, `Custom` |
| `due_date` | Date | When this task should be completed |
| `status` | Single select | Options: `Open`, `In Progress`, `Done`, `Cancelled` |
| `task_notes` | Long text | Context for this specific task |
| `created_by` | Single select | Options: `Manual`, `Zap A`, `Zap B`, `Zap C` — helps debug automation |
| `created_at` | Created time | Auto-set |

### Recommended Views

| View Name | Type | Filter / Sort |
|-----------|------|--------------|
| Open Tasks | Grid | Filter: status = Open or In Progress, Sort: due_date ASC |
| Overdue Tasks | Grid | Filter: status = Open AND due_date < TODAY() |
| Task Calendar | Calendar | Date field: due_date |

---

## Table 4: Accounts (Optional)

**Purpose:** Use if a single business entity has multiple contacts or lead records. Useful for event brands with multiple decision-makers.

| Field Name | Airtable Type | Notes |
|---|---|---|
| `account_id` | Autonumber | |
| `account_name` | Single line text | Company/brand entity name |
| `leads` | Linked record → Leads | All contacts under this account |
| `account_type` | Single select | `Event Brand`, `Agency`, `Venue`, `Creator Network` |
| `account_notes` | Long text | |
| `created_at` | Created time | |

> **Skip this table initially.** Add it only when you have multiple contacts per brand.

---

## Table 5: Memory Index (Optional)

**Purpose:** Track which Zep memory sessions exist for which leads. Useful as a lookup table to avoid creating duplicate Zep users.

| Field Name | Airtable Type | Notes |
|---|---|---|
| `lead_id` | Linked record → Leads | |
| `zep_user_id` | Single line text | Same value stored on Lead record |
| `memory_initialized` | Checkbox | True once Zap A has created the Zep user |
| `last_memory_push` | Date/Time | Last time an interaction was pushed to Zep |
| `memory_facts_count` | Number | Manually tracked or updated by Zap D |

> **Skip this table initially.** The `zep_user_id` field on the Leads table is sufficient. Add this only if you want a dedicated memory audit trail.

---

## Airtable API Setup

1. Go to **Account → API** to get your personal access token.
2. Enable **Airtable API** on the base.
3. Note your **Base ID** (starts with `app...`) from the API docs URL.
4. These values go into Zapier as connection credentials.

```
AIRTABLE_API_KEY=pat_XXXXXXXXXXXXXXXXXXXX   # Personal Access Token
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_LEADS_TABLE_ID=tblXXXXXXXXXXXXXX
AIRTABLE_INTERACTIONS_TABLE_ID=tblXXXXXXXXXXXXXX
AIRTABLE_TASKS_TABLE_ID=tblXXXXXXXXXXXXXX
```

---

## Field Validation Notes

- `instagram_handle`: Strip leading `@` using Zapier formatter before storing.
- `follower_count`: Must be a positive integer. Default to `0` if unknown. Never leave blank (breaks scoring formula).
- `engagement_level`: Default to `Unknown` on creation. Prompt operator to fill via Slack message.
- `priority_score`: Do not make this field editable by hand. Let Zapier own it. Use a locked view or field description to warn.
- `status`: Never delete options — add `Closed Won`/`Closed Lost` as terminal states. Zapier checks for exact string matches.
