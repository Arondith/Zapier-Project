# LeadFlow Automation

A portfolio project that demonstrates practical web development and business-process automation with Zapier.

LeadFlow captures a prospect from a responsive web form, prepares structured lead data, and sends it to a Zapier webhook. The Zap can then route the lead into Google Sheets, email, Slack, CRM tools, or an AI enrichment step.

## Why this project exists

This project was built to demonstrate the kind of work expected from a Web Developer / Automation Specialist:

- Build a polished client-facing web interface
- Send structured data to external services
- Connect a website to Zapier through webhooks
- Automate repetitive lead-handling tasks
- Apply validation and priority scoring
- Design workflows that can be extended with AI
- Document the automation so another developer can maintain it

## Automation flow

~~~mermaid
flowchart LR
    A[Website Lead Form] --> B[JavaScript Validation]
    B --> C[Priority Scoring]
    C --> D[Zapier Catch Hook]
    D --> E[Formatter / Cleanup]
    E --> F[Google Sheets or CRM]
    E --> G[Email Acknowledgement]
    E --> H[Slack / Team Alert]
    E --> I[Optional AI Summary]
~~~

## Features

- Responsive HTML/CSS/JavaScript interface
- Demo mode that works without a Zapier account
- Live Zapier webhook mode
- Lead priority scoring
- Local activity log
- Runtime webhook configuration saved in the browser
- Sample JSON payload for testing
- Detailed Zapier setup guide
- No framework or build step required

## Quick start

1. Clone the repository.
2. Open index.html in a browser.
3. Leave the project in Demo Mode to test the interface.
4. To connect Zapier, create a Catch Hook in Zapier.
5. Open Automation Settings in the app.
6. Change the mode to Zapier Webhook and paste your Catch Hook URL.
7. Submit a test lead and confirm that Zapier receives the payload.

See docs/ZAPIER_SETUP.md for the full automation setup.

## Example payload

~~~json
{
  "name": "Jordan Lee",
  "email": "jordan@example.com",
  "company": "Northstar Studio",
  "service": "Web Automation",
  "budget": "5000+",
  "message": "We need to automate website leads and client follow-ups.",
  "priority": "High",
  "score": 85,
  "source": "LeadFlow Portfolio",
  "submittedAt": "2026-09-21T08:30:00.000Z"
}
~~~

## Suggested Zap

Trigger: Webhooks by Zapier - Catch Hook

Actions:
1. Formatter by Zapier - normalize incoming fields
2. Google Sheets - create lead row
3. Filter or Paths - branch on lead priority
4. Gmail or Email by Zapier - send acknowledgement
5. Slack - notify the team for high-priority leads
6. Optional AI step - summarize the request for the sales team

## Tech stack

HTML, CSS, JavaScript, Zapier Webhooks, REST-style payloads, browser localStorage

## Portfolio talking point

"I built a lead-intake automation that connects a custom web interface to Zapier through a webhook. The workflow validates and scores incoming leads, then Zapier can store the lead, notify a team, send follow-up communication, and optionally enrich the request with AI."

## Security note

Do not commit a private production webhook URL to this public repository. The demo stores a webhook URL only in the current browser using localStorage.

## Project structure

- index.html - portfolio interface
- styles.css - responsive UI
- app.js - form validation, scoring, demo/live automation logic
- samples/lead.json - sample webhook payload
- docs/ZAPIER_SETUP.md - step-by-step Zapier configuration
- docs/INTERVIEW_NOTES.md - concise explanation for recruiters/interviews

## Author

Charles Luke Templonuevo

Portfolio: https://charles-luke-templonuevo.vercel.app/

GitHub: https://github.com/Arondith
