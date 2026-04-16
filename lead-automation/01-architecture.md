# 1. System Architecture

## Overview

ViceLab's lead pipeline is a lightweight, solo-operator CRM automation built on four best-of-breed SaaS tools with no custom backend required.

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                             │
│  Instagram DMs · Event inquiries · Referrals · Manual entry     │
└─────────────────────────┬───────────────────────────────────────┘
                          │ manual or form input
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AIRTABLE (Source of Truth)                   │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌────────┐  ┌─────────────┐  │
│  │  Leads   │  │ Interactions │  │ Tasks  │  │  Accounts   │  │
│  └────┬─────┘  └──────┬───────┘  └───┬────┘  └─────────────┘  │
│       │               │              │                          │
└───────┼───────────────┼──────────────┼──────────────────────────┘
        │               │              │
        │ record events (polling ~5min)│
        ▼               ▼              │
┌─────────────────────────────────────┼──────────────────────────┐
│                 ZAPIER (Automation Hub)                         │
│                                     │                          │
│  Zap A: New Lead ──────────────────►│                          │
│  Zap B: Lead Updated ──────────────►│ creates/closes Tasks     │
│  Zap C: Follow-up Reminder ─────────┘                          │
│  Zap D: Interaction Logged                                      │
│                                                                 │
│  [Score calc] [Date math] [Status routing] [Field updates]      │
└──────┬──────────────────────────────────────────────┬───────────┘
       │                                              │
       ▼                                              ▼
┌──────────────────┐                    ┌─────────────────────────┐
│   SLACK          │                    │   ZEP (Memory Layer)    │
│                  │                    │                         │
│  #leads channel  │                    │  Per-lead User Memory   │
│  · New lead alert│                    │  · Conversation history │
│  · Priority ping │                    │  · Objections stored    │
│  · Reminders     │                    │  · Context retrieved    │
│  · Won/Lost      │                    │    before outreach      │
└──────────────────┘                    └─────────────────────────┘
```

## Component Roles

### Airtable
- **Role:** Primary CRM and data store. All lead data lives here.
- **Why:** Spreadsheet familiarity, powerful filtering/views, native Zapier integration, form support for lead capture.
- **Key views to create:** Pipeline (Kanban by status), Follow-up Calendar (by next_followup_date), Priority Queue (sorted by priority_score desc).

### Zapier
- **Role:** Automation glue between all tools. No backend server required.
- **Trigger mechanism:** Polls Airtable every 1–15 minutes depending on plan. For faster response, see "Airtable Automations + Webhook" pattern below.
- **Required plan:** Starter ($19.99/mo) for multi-step Zaps and Code steps. Free tier (2-step Zaps only) limits you to simple alert-only workflows.

### Slack
- **Role:** Operator work queue and alert surface. Slack becomes the "inbox" for actionable lead events.
- **Channels needed:** `#leads` (all lead activity), `#leads-priority` (optional, Qualified/Won/Lost only).
- **Interaction model:** Slack messages are read-only notifications. Actions happen back in Airtable.

### Zep
- **Role:** Long-term memory layer for each lead relationship. Stores conversation summaries, key objections, and brand context that persists across follow-up cycles.
- **Why not just Airtable notes?** Zep enables semantic search ("what objections did this lead raise?"), structured memory facts, and future AI-assisted drafting.
- **API surface used:** User Memory API (create user, add memory, get memory). Minimal — three endpoint types.

## Data Flow by Event

| Event | Source | Through Zapier? | Destinations |
|-------|--------|-----------------|--------------|
| New lead added | Airtable (manual/form) | Yes (Zap A) | Slack alert, Task created, score written back to Airtable |
| Lead status changed | Airtable | Yes (Zap B) | Slack alert, follow-up date set, tasks closed |
| Follow-up date reached | Scheduled Zap or Airtable date | Yes (Zap C) | Slack reminder, task ensured |
| Interaction logged | Airtable | Yes (Zap D) | Zep memory updated, last_contact_date updated, score recalculated |
| Future outreach drafted | Manual (operator) | No | Zep memory retrieved → operator uses context |

## Faster Alternative: Airtable Automations + Webhook

> **Optional upgrade** — requires no extra cost if on Airtable Team+.

Instead of relying on Zapier polling, you can use Airtable's native Automations to fire a webhook the instant a record changes:

```
Airtable Automation:
  Trigger: Record matches condition (e.g., Status = "Qualified")
  Action: Send webhook → your Zapier "Catch Hook" URL

Zapier:
  Trigger: Webhooks by Zapier (Catch Hook)
  Actions: (same as current Zaps)
```

This gives near-instant triggering instead of 1–15 minute polling lag. Use this pattern for the "Qualified" and "Won" status changes where speed matters.

## Sequence Diagram — New Lead Flow

```
Operator         Airtable        Zapier          Slack          Zep
   │                │               │               │             │
   │─ adds lead ───►│               │               │             │
   │                │               │               │             │
   │                │◄── poll ──────│ (every 5min)  │             │
   │                │─── record ───►│               │             │
   │                │               │─ calc score   │             │
   │                │               │─ write score─►│(update AT)  │
   │                │               │─ post alert ─►│             │
   │                │               │─ create task─►│(update AT)  │
   │                │               │               │             │
   ── later: interaction logged ──────────────────────────────────
   │                │               │               │             │
   │─ adds interaction►│            │               │             │
   │                │◄── poll ──────│               │             │
   │                │─── record ───►│               │             │
   │                │               │─ add memory ─────────────►  │
   │                │               │─ update date─►│(update AT)  │
   │                │               │               │             │
```

## Cost Estimate (Solo Operator)

| Tool | Plan | Monthly Cost |
|------|------|-------------|
| Airtable | Free (up to 1000 records) | $0 |
| Zapier | Starter (750 tasks/mo) | ~$20 |
| Slack | Free | $0 |
| Zep | Community (self-hosted) | $0 + VPS |
| Zep | Cloud Starter | ~$0–$49 |
| **Total** | | **~$20–$70/mo** |

At 750 Zapier tasks/month: ~25 leads/month with all 4 Zaps = ~100 tasks. You have significant headroom on Starter.
