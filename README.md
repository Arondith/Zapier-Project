# ReliefRelay — Disaster Response Automation

**ReliefRelay** is a web + Zapier automation portfolio project that explores a real coordination problem: during disasters, assistance requests can arrive faster than teams can manually organize, encode, route, acknowledge, and track them.

The project turns an unstructured request into a traceable workflow:

**Community request → validation → transparent routing support → Zapier webhook → case log → responder notification → acknowledgement → human review**

> ReliefRelay is a portfolio prototype, not an emergency service. It is designed to demonstrate responsible automation architecture for NGOs, local governments, volunteer groups, and humanitarian teams.

## Project Preview

![ReliefRelay project preview](https://d2ol7oe51mr4n9.cloudfront.net/user_3JGUTZnbwjVtgPxRXiNMsjQVIk0/9867c920-911e-4276-aa70-7bba444d2788.png)

## Why this is a stronger automation portfolio

This is not just a contact form connected to Zapier. It demonstrates:

- a real-world operational problem
- structured humanitarian intake
- explainable rule-based routing
- offline-aware queuing for unstable connectivity
- retry behavior when connectivity returns
- Zapier webhook integration
- multi-system workflow design
- data minimization and privacy warnings
- accessible responsive UI
- human-in-the-loop safeguards
- optional AI summarization without AI-only emergency decisions

## The problem it addresses

In a disaster response environment, information may arrive through calls, text messages, forms, social media, or volunteers. Teams can lose time retyping the same information into spreadsheets, forwarding screenshots, deciding who should receive a request, and sending manual acknowledgements.

ReliefRelay demonstrates how automation can reduce that coordination overhead while keeping the actual response decision with people.

## Architecture

~~~mermaid
flowchart LR
    A[Community assistance form] --> B[Client-side validation]
    B --> C[Explainable routing rules]
    C --> D{Online?}
    D -- No --> E[Local retry queue]
    E --> D
    D -- Yes --> F[Zapier Catch Hook]
    F --> G[Case log: Sheets / Airtable / CRM]
    F --> H[Responder channel: Slack / Email / Teams]
    F --> I[Acknowledgement]
    F --> J[Optional AI summary]
    G --> K[Human review and assignment]
    H --> K
    J --> K
~~~

## Routing model

Routing is intentionally simple and explainable.

Examples:

- **Critical**: immediate danger, trapped requester, rescue / evacuation request
- **High**: unsafe location, time-sensitive medical or shelter need, or vulnerability context combined with essential needs
- **Standard**: requests without a critical/high routing condition

The routing reason is included in the payload. No request is automatically denied or closed based on its tier.

## Offline-aware behavior

When Zapier mode is enabled:

1. If the browser is online, the request is sent to the configured Zapier webhook.
2. If the browser is offline or the handoff fails, the request is stored in a local retry queue.
3. When connectivity returns, ReliefRelay automatically attempts to sync queued requests.

This is a portfolio implementation using browser localStorage. A production deployment should use encrypted local persistence and a secure backend.

## Zapier workflow

Recommended Zap:

1. **Webhooks by Zapier — Catch Hook**
2. **Formatter by Zapier** — normalize fields and timestamps
3. **Google Sheets / Airtable / CRM** — create the case record
4. **Paths / Filter** — branch by `routeTier` and `routeDestination`
5. **Slack / Gmail / Microsoft Teams** — notify the relevant response team
6. **Email / SMS provider** — send a safe acknowledgement
7. **Optional AI step** — summarize the request for responders
8. **Human review** — verify, assign, contact, and close the request

See [docs/ZAPIER_SETUP.md](docs/ZAPIER_SETUP.md).

## Key payload fields

~~~json
{
  "requestId": "16be4cce-...",
  "fullName": "Maria Santos",
  "contact": "0917-000-0000",
  "location": "Riverside Community, Sample City",
  "requestType": "shelter",
  "peopleAffected": 5,
  "urgency": "today",
  "safetyStatus": "unsafe",
  "vulnerabilities": ["child", "older-person"],
  "details": "Sample scenario...",
  "routeTier": "high",
  "routeDestination": "Shelter and displacement support",
  "routeReason": "current location marked unsafe; time-sensitive shelter need; additional vulnerability context provided",
  "humanReviewRequired": true
}
~~~

## Tech stack

- HTML5
- modern responsive CSS
- vanilla JavaScript
- Webhooks by Zapier
- browser localStorage
- service worker / offline shell
- REST-style structured payloads

No framework or build step is required.

## Run locally

Because service workers require HTTP/HTTPS, use a local web server instead of opening the file directly.

Python:

~~~bash
python -m http.server 8000
~~~

Then visit:

~~~text
http://localhost:8000
~~~

The app works in **Demo Mode** without a Zapier account.

## Connect a real Zap

1. Create a Zap.
2. Choose **Webhooks by Zapier**.
3. Select **Catch Hook**.
4. Copy the generated hook URL.
5. Open ReliefRelay.
6. Open **Automation Settings**.
7. Change mode to **Zapier webhook**.
8. Paste the hook URL.
9. Submit the built-in sample scenario.
10. Confirm that Zapier receives the payload.

Do not commit the webhook URL to this repository.

## Responsible automation principles

ReliefRelay intentionally includes safeguards:

- no automated denial of assistance
- no AI-only emergency triage
- visible routing reasons
- explicit human review flag
- no production secrets in source code
- fictional/test data warning
- minimal intake fields
- production security limitations documented openly

For a real deployment, the webhook handoff should move behind an authenticated backend with rate limiting, encrypted storage, audit logs, role-based access, secure secret management, and organization-approved response procedures.

## Portfolio talking point

> I built ReliefRelay to demonstrate how web development and Zapier automation can solve a coordination problem rather than just automate a business form. The frontend structures disaster-assistance requests, creates an explainable routing tier, handles temporary connectivity loss with a retry queue, and can hand the request to Zapier for logging, team notification, acknowledgement, and optional AI summarization. Human review remains mandatory.

## Project structure

- `index.html` — responsive humanitarian intake and response console
- `styles.css` — accessible interface and mobile layout
- `app.js` — validation, routing, retry queue, metrics, Zapier handoff
- `sw.js` — offline shell cache
- `manifest.webmanifest` — installable web app metadata
- `samples/request.json` — sample webhook payload
- `docs/ZAPIER_SETUP.md` — Zapier setup guide
- `docs/INTERVIEW_NOTES.md` — recruiter / interview explanation
- `docs/IMPACT_AND_SAFETY.md` — scope, safeguards, and production limitations

## Author

**Charles Luke Templonuevo**

Portfolio: https://charles-luke-templonuevo.vercel.app/

GitHub: https://github.com/Arondith
