# Interview Notes — ReliefRelay

## 30-second explanation

ReliefRelay is a disaster-assistance workflow prototype I built to demonstrate practical Zapier automation. Instead of automating a generic contact form, I focused on a coordination problem: response teams can receive many requests through different channels and spend time manually encoding, forwarding, and sorting them.

The app validates a structured assistance request, creates an explainable routing tier, queues the request if connectivity is unavailable, and can send it to a Zapier Catch Hook for case logging, responder notification, acknowledgement, and optional AI summarization. Human review is always required.

## What I built directly

- responsive accessible frontend
- humanitarian request intake
- form validation
- explainable routing rules
- unique request IDs
- structured webhook payload
- Zapier webhook mode
- demo simulation mode
- local offline/retry queue
- connection-state handling
- saved activity log and metrics
- service-worker app shell
- detailed workflow and security documentation

## What Zapier can handle

- webhook intake
- Formatter cleanup
- Google Sheets / Airtable / CRM case creation
- Paths or Filter routing
- Slack / Teams / email alerts
- requester acknowledgement
- optional AI summary
- downstream task creation

## Why this is an automation project, not just a website

The frontend is only the intake surface. The important engineering problem is moving one validated request reliably through multiple systems without retyping the data.

The project separates:

1. data capture
2. routing logic
3. automation handoff
4. downstream integrations
5. human response

That means the destination tools can change without rebuilding the public form.

## Explain the routing

The routing is intentionally rule-based and visible.

Critical examples:
- immediate danger
- trapped requester
- rescue / evacuation request

High examples:
- unsafe location
- time-sensitive medical or shelter need
- vulnerability context combined with essential needs

The app records the reason in the payload. It never automatically denies a request.

## Why not let AI determine emergency priority?

Because emergency response has high consequences and incomplete information. AI can summarize or organize text, but a trained person should verify urgency and decide what action to take.

That is why ReliefRelay includes `humanReviewRequired: true`.

## Offline behavior

If live Zapier mode is enabled but the browser has no connection, the app keeps the request in a local queue. When the browser comes back online, it attempts to send queued items.

For a real deployment, I would replace localStorage with encrypted offline persistence and sync through a secure backend.

## Production improvements

- backend API proxy
- authentication and role-based access
- secure secret storage
- encrypted database
- idempotency keys
- server-side validation
- rate limiting
- CAPTCHA or abuse prevention
- retry/backoff strategy
- centralized logs and monitoring
- case status updates
- audit trail
- tests for routing logic
- privacy/retention controls
- localization and multilingual support
- organization-approved emergency protocols

## Strong interview statement

"I use automation to remove repetitive coordination work, not human responsibility. ReliefRelay shows that approach: code structures and routes information, Zapier connects systems, and humans remain accountable for the actual response."

## Skills demonstrated

Zapier, webhooks, HTML, CSS, JavaScript, offline-aware frontend design, workflow automation, structured data, routing logic, integration design, debugging, documentation, accessibility, privacy-aware engineering, and human-in-the-loop AI design.
