# ViceLab Lead Automation System

Production-ready lead pipeline using Airtable + Zapier + Slack + Zep.

## Document Index

| # | File | Contents |
|---|------|----------|
| 1 | [01-architecture.md](./01-architecture.md) | System architecture and data flow |
| 2 | [02-airtable-schema.md](./02-airtable-schema.md) | Full Airtable base design and field types |
| 3 | [03-zapier-workflows.md](./03-zapier-workflows.md) | All four Zapier automation workflows |
| 4 | [04-slack-templates.md](./04-slack-templates.md) | Slack Block Kit message templates |
| 5 | [05-zep-memory.md](./05-zep-memory.md) | Zep integration and memory design |
| 6 | [06-lead-scoring.md](./06-lead-scoring.md) | Rules-based and future-ready scoring |
| 7 | [07-implementation-checklist.md](./07-implementation-checklist.md) | Step-by-step setup checklist |
| 8 | [08-payloads.json](./08-payloads.json) | Example JSON payloads for every workflow |
| 9 | [09-risks-safeguards.md](./09-risks-safeguards.md) | Failure cases and mitigation strategies |

## Quick Reference — Stack

| Tool | Role | Cost tier |
|------|------|-----------|
| Airtable | Source of truth, CRM | Free → Team |
| Zapier | Automation glue | Starter (750 tasks/mo) |
| Slack | Alerts and work queue | Free (search-limited) |
| Zep | Conversation memory | Community (self-hosted) or Cloud |

## Weak Assumptions (Read First)

1. **Zep Cloud vs self-hosted** — This design targets Zep Cloud (managed). Self-hosted on a VPS works but requires a Docker setup. Flagged in [05-zep-memory.md](./05-zep-memory.md).
2. **Zapier date math** — Zapier's built-in date formatter can add days to a date field, but the exact step naming varies by plan. Pseudo-code is provided and noted where custom code steps may be needed (Code by Zapier — JavaScript/Python, available on Starter+).
3. **Airtable webhooks vs polling** — Zapier triggers on Airtable using polling (every 1–15 min depending on plan), not true webhooks. For near-real-time, consider Airtable Automations to call a webhook endpoint instead (flagged in architecture).
4. **Slack Block Kit** — Templates use Block Kit JSON. Zapier's "Send Channel Message" action supports blocks via the `blocks` payload field on paid Zapier plans. On free Zapier, plain text fallbacks are provided.
5. **Lead scoring automation** — The scoring formula runs inside a Zapier "Code by Zapier" step (JavaScript). This requires Zapier Starter or above. A no-code approximation using Airtable Formulas is also provided as a fallback.
6. **Zep session vs user memory** — This design uses Zep's User Memory (persistent across sessions) rather than session-scoped memory, which is more appropriate for a long-running sales relationship.
