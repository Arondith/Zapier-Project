# Zapier Setup — ReliefRelay

This guide connects the ReliefRelay humanitarian intake prototype to a real Zapier workflow.

> Use fictional data while testing. This portfolio project is not an emergency service.

## 1. Create the webhook trigger

1. Create a new Zap.
2. Choose **Webhooks by Zapier**.
3. Select **Catch Hook**.
4. Copy the generated webhook URL.
5. Open ReliefRelay in your browser.
6. Open **Automation Settings**.
7. Select **Zapier webhook**.
8. Paste the Catch Hook URL and save.
9. Click **Load sample scenario** and submit it.

Expected fields include:

- requestId
- fullName
- contact
- location
- requestType
- peopleAffected
- urgency
- safetyStatus
- vulnerabilities
- details
- routeTier
- routeDestination
- routeReason
- source
- humanReviewRequired
- submittedAt

## 2. Create a case log

A simple portfolio implementation can use Google Sheets or Airtable.

Suggested columns:

Request ID | Submitted At | Name | Contact | Area | Need | People | Urgency | Safety | Vulnerability Context | Route Tier | Destination | Route Reason | Details | Status | Assigned To

Set the initial status to **New — Human Review Required**.

## 3. Route by destination

Use **Paths by Zapier** or filters.

Example paths:

- Emergency response / evacuation desk
- Health and medical coordination
- Water, sanitation, and relief distribution
- Relief distribution
- Shelter and displacement support
- Protection and accessibility support
- Infrastructure / utilities coordination
- General response desk

Do not use the routing tier to automatically deny or close cases.

## 4. Notify responders

Possible actions:

- Slack channel message
- Gmail alert
- Microsoft Teams message
- task creation in a project or case-management system

Recommended alert content:

- request ID
- request type
- area
- people affected
- urgency
- safety status
- route tier
- route reason
- human review required

Avoid exposing unnecessary personal details in shared channels.

## 5. Send an acknowledgement

If the deployment has an approved communication process, send a confirmation that the request was received.

Example:

"Your assistance request has been received and is awaiting review by a response team. This confirmation does not guarantee dispatch or a specific response time. If there is immediate danger, contact the appropriate local emergency service."

## 6. Optional AI summarization

AI can help summarize long situation descriptions, but it should not make the final emergency decision.

Prompt example:

"Summarize this assistance request for a human responder in four bullets: need, location context, safety/urgency, and key access constraints. Preserve uncertainty. Do not invent facts. Do not change the route tier."

Keep the original request visible beside the AI summary.

## 7. Test routing cases

Use at least these test scenarios:

### Critical
- requestType: rescue
- urgency: immediate
- safetyStatus: trapped

Expected: **Critical → Emergency response / evacuation desk**

### High
- requestType: shelter
- urgency: today
- safetyStatus: unsafe
- vulnerability: child

Expected: **High → Shelter and displacement support**

### Standard
- requestType: infrastructure
- urgency: routine
- safetyStatus: safe

Expected: **Standard → Infrastructure / utilities coordination**

## 8. Test offline queue behavior

1. Enable Zapier mode.
2. Disconnect your internet connection.
3. Submit a fictional request.
4. Confirm that **Waiting to sync** increases.
5. Restore connectivity.
6. Confirm that ReliefRelay attempts to send queued requests.

## Production security requirements

The browser-to-Zapier connection is appropriate for a portfolio demonstration, but a real deployment should:

- submit through a secure backend
- keep webhook URLs and credentials server-side
- authenticate staff access
- encrypt sensitive data
- rate-limit public endpoints
- use bot / abuse protection
- implement audit logging
- establish retention and deletion policies
- define incident handling
- comply with applicable privacy and humanitarian data-protection requirements

## Portfolio evidence to capture

After configuring the Zap, add screenshots of:

- Catch Hook trigger
- sample payload received
- case row created
- Paths / Filter logic
- responder notification
- optional AI summary
- successful end-to-end test

Use fictional data in all screenshots.
