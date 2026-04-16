# 9. Risks and Safeguards

## Risk Matrix

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 1 | Zap runs on every Airtable update, not just status changes | High | Medium | Add Filter step in Zap B to check status value |
| 2 | Duplicate Slack alerts for same event | Medium | Low | Add deduplication filter; Zep 409 on duplicate user is safe to ignore |
| 3 | Zapier polling delay causes stale reminders | High | Low | Accept 1–15 min delay; use Airtable Automations + webhook for time-critical events |
| 4 | Scoring formula breaks on missing/null fields | Medium | Medium | Default all scoring inputs in Code step; never produce NaN |
| 5 | Zep user not created before interaction logged | Low | Medium | Zap order: enable D after A; add a Zep "upsert" approach (create if not exists) |
| 6 | Airtable API rate limit hit | Low | Low | Zapier adds retries by default; limit Zap frequency if needed |
| 7 | Zapier task limit exceeded | Low | Low | Monitor usage weekly; upgrade plan or disable non-critical Zaps |
| 8 | Sensitive lead data exposed via Slack | Medium | High | Use private channel; never post raw_message to Slack; only post summaries |
| 9 | Airtable personal access token expires or rotates | Low | High | Set calendar reminder to rotate token every 90 days |
| 10 | Zep Cloud service outage | Low | Low | Memory writes are non-blocking; Airtable stays as primary SoT |
| 11 | Lead imported in bulk with non-New status | Medium | Low | Zap A Filter step (Step 6) prevents task creation for non-New leads |
| 12 | Multiple open tasks per lead | Medium | Low | Zap B Task close only handles first found; use Airtable Automation for bulk close |

---

## Detailed Failure Cases and Mitigations

### 1. Zap B Fires on Every Airtable Update (Not Just Status)

**Problem:** Airtable's Zapier "Updated Record" trigger fires whenever any field changes — including when Zap A writes the priority_score. This can cause Zap B to loop: Zap A updates score → Zap B fires → Zap B tries to set follow-up date for a lead that isn't "Contacted."

**Safeguard:**
```
// In Zap B, Step 2: Filter
Condition: {{status}} exactly matches "Contacted"
           OR {{status}} exactly matches "Qualified"
           OR {{status}} contains "Closed"

// Only proceed if one of these is true.
// All other updates (score writes, date updates) will stop the Zap here.
```

**Additional guard:** Add a `status_changed_at` timestamp field to Airtable (Last Modified Time, scoped to the `status` field only). Then filter in Zap B: only run if `status_changed_at` is within the last 5 minutes.

---

### 2. Duplicate Slack Alerts

**Problem:** If a lead is updated twice quickly (e.g., operator clicks save twice), Zap B fires twice and sends two Slack alerts.

**Safeguard:**
- Use Zapier's built-in deduplication: Zapier automatically deduplicates triggers by record ID within a short window on most plans.
- For extra protection, add a `last_zap_b_at` timestamp field to Airtable. Zap B writes the current timestamp there after running. Add a Filter: only proceed if `last_zap_b_at` is null or more than 5 minutes old.

---

### 3. Null/Missing Scoring Inputs Break the Code Step

**Problem:** A lead added without `follower_count` or `engagement_level` will cause the scoring JavaScript to produce `NaN` or error out, stopping the Zap.

**Safeguard — defensive defaults in the Code step:**
```javascript
const followerCount = parseInt(inputData.follower_count) || 0;
const engagementLevel = inputData.engagement_level || 'Unknown';
const brandingIssue = inputData.branding_issue || 'Unknown';
const businessType = inputData.business_type || 'Other';
const leadSource = inputData.lead_source || 'Other';
const interactionCount = parseInt(inputData.interaction_count) || 0;
```

All maps include a fallback (`?? default`) so unknown values don't break scoring.

**Additional safeguard:** Add a `priority_score >= 0` validator in the Airtable field (Number, min = 0). This prevents accidental nulls from showing in the Priority Queue.

---

### 4. Zep User Not Found When Interaction Is Logged

**Problem:** If an interaction is logged before Zap A has run (e.g., operator adds an interaction row for an existing pre-automation lead), Zap D will fail because no Zep user exists yet.

**Safeguard:** In Zap D, Step 3 (Zep memory push), use an "error handler" path:
- If Webhooks returns 4xx → attempt POST to create user first, then retry memory push
- Alternatively, add a Zap D Step 2.5: check if `zep_user_id` is empty on the lead; if so, create the Zep user before adding memory

**Simpler approach:** Run a one-time backfill: for all existing leads without a `zep_user_id`, bulk-create Zep users via a manual Zapier run or a simple script.

---

### 5. Sensitive Data in Slack

**Problem:** The `raw_message` field may contain private conversation excerpts. Posting to Slack risks exposure if the channel has unexpected members.

**Safeguards:**
- Slack templates only use `message_summary`, not `raw_message`
- `raw_message` field is never mapped into any Zapier Slack step
- Set `#leads` as a private channel
- Periodically audit Slack channel members

---

### 6. Airtable API Token Rotation

**Problem:** Airtable personal access tokens can be set to expire. If they expire without rotation, all Zaps fail silently.

**Safeguard:**
- Set token expiry to maximum (or "No expiry" if allowed)
- Set a recurring calendar reminder every 60 days: "Check Airtable API token"
- Test the Airtable Zap connection monthly by running a manual test

---

### 7. Zapier Task Budget

**Problem:** At 750 tasks/month on Starter, a high lead volume month could exhaust the budget, causing Zaps to pause until the next billing cycle.

**Estimate at 50 leads/month:**
- Zap A: 50 leads × 9 steps = ~450 tasks
- Zap B: ~3 status changes/lead × 50 = ~150 tasks × 3 steps = ~450 tasks
- Zap C: 31 days × 1 step = ~31 tasks (per lead found)
- Zap D: ~100 interactions × 7 steps = ~700 tasks

**Total estimate: ~1,600 tasks/month at 50 leads** — exceeds Starter.

**Options:**
- Consolidate steps (reduce per-Zap step count where possible)
- Use Airtable Automations for non-Zep actions (task creation, date math) and reserve Zapier only for Slack + Zep
- Upgrade to Zapier Professional (2,000 tasks/month) at ~$49/mo

---

### 8. Zap C Processes Only One Lead Per Run

**Problem:** The daily Zap C schedule finds one overdue lead and sends one reminder. If you have 10 overdue leads, only one gets processed each day.

**Options:**
1. **Looping by Zapier** (paid add-on, ~$20/mo): Processes all records from the search in one Zap run.
2. **Airtable Automation alternative**: Create an Airtable automation that fires for each overdue lead individually and sends a direct Slack message. No Zapier needed for this step.
3. **Accept the limitation**: If you have at most 5 overdue leads on any given day, the daily reminder will catch up within 5 days. For a solo operator with <50 leads in pipeline, this is often acceptable.

---

### 9. Status Can Be Set to Terminal Prematurely

**Problem:** Operator accidentally sets a lead to "Closed Lost" when they meant "On Hold". Zap B immediately cancels all tasks.

**Safeguard:**
- Airtable doesn't have an "undo" for Zap-triggered actions.
- Add a `status_locked` checkbox field to Leads. Zap B checks: if `status_locked = true`, skip all actions and Slack an alert instead.
- Alternatively, add a 15-minute delay in Zap B between trigger and action (Zapier has a built-in Delay step) — enough time to catch the mistake.
- Train habit: only use "Closed" status after confirming, never as a temp state.

---

## Monitoring Checklist (Weekly)

- [ ] Review Zapier task history — look for failed Zap runs
- [ ] Check Airtable "Overdue Follow-ups" view — anything lingering >7 days?
- [ ] Review Zap error logs in Zapier dashboard
- [ ] Spot-check 2–3 recent leads: confirm Zep memory has been populated
- [ ] Confirm #leads channel activity matches expected lead volume
- [ ] Monthly: rotate Airtable API token, check Zep usage

---

## Escalation Path

If the system fails in a way that blocks operations:

1. **Zapier Zap failing:** Check Zapier dashboard → Zap History → view error → fix and re-run.
2. **Airtable unreachable:** Work from Slack notes; backfill Airtable when restored.
3. **Zep unreachable:** Memory writes fail silently — leads are still tracked in Airtable. Backfill memory when Zep is restored using interaction records.
4. **Slack bot down:** Critical alerts missed — check #leads manually in Airtable Priority Queue view.

The system degrades gracefully: Airtable is always the source of truth. Slack and Zep are value-add layers, not critical path.
