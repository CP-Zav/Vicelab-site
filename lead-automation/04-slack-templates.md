# 4. Slack Message Templates

All templates are written in Slack Block Kit JSON format. In Zapier's "Send Channel Message" action, paste the JSON into the **Blocks** field. Plain text fallbacks are included for every template (for use if your Zapier plan doesn't support blocks).

Replace `{{variables}}` with actual Zapier field mappings.

---

## Template 1 — New Lead Alert

**Used by:** Zap A, Step 5  
**Channel:** `#leads`  
**Tone:** Informational. Quick scan. Decision: "Is this worth pursuing?"

### Block Kit JSON
```json
[
  {
    "type": "header",
    "text": {
      "type": "plain_text",
      "text": "New Lead — {{brand_name}}"
    }
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*Instagram:*\n@{{instagram_handle}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Type:*\n{{business_type}}"
      },
      {
        "type": "mrkdwn",
        "text": "*City:*\n{{city}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Followers:*\n{{follower_count}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Engagement:*\n{{engagement_level}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Source:*\n{{lead_source}}"
      }
    ]
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*Priority Score:* `{{priority_score}}/100` ({{priority_tier}})\n*Branding Issue:* {{branding_issue}}"
    }
  },
  {
    "type": "divider"
  },
  {
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": "Lead ID: VL-{{lead_id}} · Source: {{lead_source}} · Follow-up task created for +2 days"
      }
    ]
  }
]
```

### Plain Text Fallback
```
New Lead: {{brand_name}} (@{{instagram_handle}})
Type: {{business_type}} | City: {{city}}
Followers: {{follower_count}} | Engagement: {{engagement_level}}
Priority: {{priority_score}}/100 ({{priority_tier}}) | Branding: {{branding_issue}}
Source: {{lead_source}} | ID: VL-{{lead_id}}
Follow-up task created.
```

---

## Template 2 — High-Priority Lead Alert

**Used by:** Zap B, Step 6 (status → Qualified)  
**Channel:** `#leads`  
**Tone:** Urgent. Action required.

### Block Kit JSON
```json
[
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ":fire: *HIGH PRIORITY LEAD — ACTION REQUIRED*"
    }
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*Lead:*\n{{brand_name}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Status:*\nQualified :white_check_mark:"
      },
      {
        "type": "mrkdwn",
        "text": "*Instagram:*\n@{{instagram_handle}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Priority Score:*\n`{{priority_score}}/100`"
      }
    ]
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*Next step:* Send proposal. Task created — due tomorrow."
    }
  },
  {
    "type": "actions",
    "elements": [
      {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Open in Airtable"
        },
        "url": "https://airtable.com/{{AIRTABLE_BASE_ID}}/{{AIRTABLE_LEADS_TABLE_ID}}/{{record_id}}",
        "style": "primary"
      }
    ]
  }
]
```

### Plain Text Fallback
```
FIRE HIGH PRIORITY — QUALIFIED LEAD
{{brand_name}} (@{{instagram_handle}}) has been marked Qualified.
Priority Score: {{priority_score}}/100
Next step: Send proposal. Task due tomorrow.
```

---

## Template 3 — Follow-up Reminder

**Used by:** Zap C (on-time follow-up)  
**Channel:** `#leads`  
**Tone:** Prompt. Low friction. "Glance and act."

### Block Kit JSON
```json
[
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ":alarm_clock: *Follow-up Due Today*"
    }
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*Lead:*\n{{brand_name}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Instagram:*\n@{{instagram_handle}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Status:*\n{{status}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Priority:*\n{{priority_tier}} ({{priority_score}})"
      }
    ]
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*Last contact:* {{last_contact_date}}\n*Notes:* {{notes}}"
    }
  },
  {
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": "Scheduled follow-up · VL-{{lead_id}} · Update status in Airtable when done"
      }
    ]
  }
]
```

### Plain Text Fallback
```
REMINDER: Follow-up due today
{{brand_name}} (@{{instagram_handle}}) — {{status}}
Priority: {{priority_tier}} ({{priority_score}}/100)
Last contact: {{last_contact_date}}
Notes: {{notes}}
VL-{{lead_id}}
```

---

## Template 4 — Overdue Reminder

**Used by:** Zap C (follow-up overdue by 2+ days)  
**Channel:** `#leads`  
**Tone:** Escalated. Slightly urgent. No panic, just accountability.

### Block Kit JSON
```json
[
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ":rotating_light: *Overdue Follow-up — {{days_overdue}} Day(s) Late*"
    }
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*Lead:*\n{{brand_name}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Instagram:*\n@{{instagram_handle}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Status:*\n{{status}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Was due:*\n{{next_followup_date}}"
      }
    ]
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*Action needed:* Contact {{brand_name}} today or mark as On Hold / Closed Lost."
    }
  },
  {
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": "Overdue escalation · VL-{{lead_id}} · Priority: {{priority_tier}}"
      }
    ]
  }
]
```

### Plain Text Fallback
```
OVERDUE {{days_overdue}} DAY(S): {{brand_name}} (@{{instagram_handle}})
Status: {{status}} | Was due: {{next_followup_date}}
Action: Contact today or mark On Hold / Closed Lost.
VL-{{lead_id}}
```

---

## Template 5 — Lead Won

**Used by:** Zap B, Step 11 (status → Closed Won)  
**Channel:** `#leads`  
**Tone:** Celebratory. Clean.

### Block Kit JSON
```json
[
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ":trophy: *Lead Won — {{brand_name}}*"
    }
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*Instagram:*\n@{{instagram_handle}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Type:*\n{{business_type}}"
      },
      {
        "type": "mrkdwn",
        "text": "*City:*\n{{city}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Final Score:*\n{{priority_score}}/100"
      }
    ]
  },
  {
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": "All open tasks cancelled · VL-{{lead_id}} · Source: {{lead_source}}"
      }
    ]
  }
]
```

### Plain Text Fallback
```
WON: {{brand_name}} (@{{instagram_handle}})
Type: {{business_type}} | City: {{city}}
Score: {{priority_score}}/100 | Source: {{lead_source}}
All tasks closed. VL-{{lead_id}}
```

---

## Template 6 — Lead Lost

**Used by:** Zap B, Step 11 (status → Closed Lost)  
**Channel:** `#leads`  
**Tone:** Matter-of-fact. Log it and move on.

### Block Kit JSON
```json
[
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ":x: *Lead Lost — {{brand_name}}*"
    }
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*Instagram:*\n@{{instagram_handle}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Type:*\n{{business_type}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Notes:*\n{{notes}}"
      },
      {
        "type": "mrkdwn",
        "text": "*Score at close:*\n{{priority_score}}/100"
      }
    ]
  },
  {
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": "Tasks cancelled · VL-{{lead_id}} · Review notes to improve targeting"
      }
    ]
  }
]
```

### Plain Text Fallback
```
LOST: {{brand_name}} (@{{instagram_handle}})
Type: {{business_type}}
Notes: {{notes}}
Score: {{priority_score}}/100
VL-{{lead_id}} | Review notes for future targeting.
```

---

## Slack Channel Setup

```
#leads          — All lead events (primary channel)
#leads-priority — Optional: only Qualified/Won events (reduces noise)
```

### Bot Setup
1. Go to api.slack.com → Create App → From scratch.
2. Name it "ViceLab CRM" — use your logo.
3. Add OAuth scope: `chat:write`, `chat:write.public`.
4. Install to workspace, copy Bot Token (`xoxb-...`).
5. Add the bot to `#leads`.
6. Paste Bot Token into Zapier Slack connection.

### Message Routing in Zapier
- All templates post to `#leads` by default.
- For High-Priority alert: add a second Slack step that also posts to `#leads-priority` (or DMs you directly).
- To DM yourself instead of a channel: set Recipient to your Slack user ID (`U0XXXXXXXXX`).
