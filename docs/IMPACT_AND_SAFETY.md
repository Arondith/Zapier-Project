# Impact and Safety — ReliefRelay

ReliefRelay is designed as a portfolio prototype for a real coordination challenge: receiving, structuring, routing, and tracking assistance requests during disasters or community emergencies.

It is not an emergency dispatch system and should not be deployed as one without domain experts, legal/privacy review, security engineering, operational testing, and approved response procedures.

## Intended value

A production-grade system inspired by this prototype could help reduce:

- repeated manual data entry
- lost or incomplete request information
- delayed forwarding between teams
- duplicate spreadsheets and message threads
- inconsistent acknowledgement
- unclear ownership of incoming cases
- time spent copying the same request into multiple tools

Automation is most useful here when it handles repetitive coordination work while responders keep authority over decisions.

## Human-in-the-loop design

ReliefRelay sets:

`humanReviewRequired: true`

for every request.

The routing tier is a workflow hint, not a final emergency assessment.

The system must not:

- deny assistance automatically
- determine medical treatment
- replace dispatch professionals
- infer vulnerability from protected characteristics
- use an AI summary as the only source of truth
- hide why a request was routed to a particular queue

## Explainable routing

The prototype uses explicit conditions selected by the person submitting the form.

Examples:

- immediate danger → Critical
- trapped / unable to leave → Critical
- rescue or evacuation need → Critical
- unsafe current location → High
- time-sensitive medical or shelter need → High
- vulnerability context with an essential need → High

The payload stores `routeReason` so a reviewer can see what triggered the route.

These rules are demonstration logic, not authoritative humanitarian triage standards. A real organization must define and validate its own protocol.

## Privacy

The public portfolio asks testers to use fictional information.

A real deployment should apply:

- data minimization
- encryption in transit and at rest
- role-based access control
- secure authentication
- retention and deletion rules
- audit logs
- protected backups
- breach-response procedures
- privacy notices and consent appropriate to the deployment
- strict controls over data copied into chat, email, or AI systems

## AI use

An optional AI step can summarize a long request for a human responder.

Recommended boundaries:

- preserve the original request beside the summary
- instruct the model not to invent facts
- do not allow the model to change the route tier
- treat model output as unverified
- never let model output automatically close or deny a case
- avoid sending sensitive data to an AI provider unless the deployment is approved to do so

## Connectivity

The browser prototype uses localStorage to queue failed live-mode handoffs.

This is useful for demonstrating resilience, but localStorage is not appropriate for storing sensitive humanitarian data in production.

Production alternatives should use encrypted offline storage, secure synchronization, idempotency, retry/backoff, and conflict resolution.

## Security limitations of the portfolio build

The Zapier webhook URL is entered at runtime and stored in the browser.

That is intentionally simple for a portfolio demonstration. In production:

1. the browser should call a backend API
2. the backend should authenticate and validate requests
3. the Zapier secret should remain server-side
4. abuse protection and rate limiting should be applied
5. observability should record failures without leaking sensitive data

## What "impact" means for this project

The project does not claim that software alone solves disaster response.

Its goal is narrower and practical: show how thoughtful automation can reduce coordination friction, preserve traceability, and help people spend less time moving data between tools and more time reviewing and responding to real needs.
