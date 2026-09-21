# Zapier Setup Guide

This guide turns the LeadFlow frontend into a real automation.

## 1. Create the trigger

In Zapier:

1. Create a new Zap.
2. Choose Webhooks by Zapier.
3. Select Catch Hook as the trigger event.
4. Copy the generated webhook URL.
5. Open LeadFlow in your browser.
6. Open Automation Settings.
7. Select Zapier Webhook.
8. Paste the Catch Hook URL and save.
9. Submit a test lead.

Zapier should detect fields such as:

- name
- email
- company
- service
- budget
- message
- priority
- score
- source
- submittedAt

## 2. Normalize data

Add Formatter by Zapier if you want to clean or standardize fields.

Useful examples:

- Capitalize a company name
- Format submittedAt as a readable date
- Convert the score to a number
- Create a combined lead summary

## 3. Store the lead

A simple portfolio-friendly action is Google Sheets.

Create columns for:

Name | Email | Company | Service | Budget | Priority | Score | Message | Submitted At

Then add Google Sheets - Create Spreadsheet Row and map the webhook fields.

You can replace Google Sheets with Airtable, HubSpot, Notion, Salesforce, or another supported destination.

## 4. Route high-priority leads

Use Filter by Zapier or Paths.

Example condition:

priority exactly matches High

When true, trigger a faster notification path.

Possible actions:

- Slack channel message
- Gmail notification
- Microsoft Teams message
- CRM task
- SMS through a supported provider

## 5. Send an acknowledgement

Add Gmail or Email by Zapier.

Example subject:

Thanks for your project request, {{name}}

Example body:

We received your request for {{service}}. Your project has been added to our workflow and a team member can review the details.

Do not include the internal priority score in the customer-facing acknowledgement unless the business specifically wants it exposed.

## 6. Optional AI step

To demonstrate AI automation, add an AI action supported by your Zapier account.

A useful task is to summarize the lead for the sales or development team.

Prompt idea:

Summarize this project request in three bullets. Identify the requested service, likely technical needs, and the most important follow-up question. Do not invent information that is not in the submission.

Inputs:

- service
- company
- message
- budget

The generated summary can then be inserted into Slack, email, a CRM note, or a spreadsheet column.

## 7. Test the complete workflow

Submit at least three different leads:

1. Low-budget general request
2. Medium-budget web development request
3. High-budget automation or AI workflow request

Confirm that:

- Zapier receives every payload
- The destination contains the correct fields
- High-priority routing behaves correctly
- Emails or notifications contain the intended data
- No webhook URL or account credential is committed to GitHub

## Portfolio evidence

For a stronger portfolio, add screenshots after you configure the Zap:

- Zap overview
- Webhook trigger test
- Google Sheets row creation
- High-priority filter or path
- Final Slack/email notification

Place screenshots in an assets directory and reference them from the main README.

## Security

A Zapier Catch Hook URL can be abused if publicly exposed.

Do not:

- commit a production webhook URL
- place credentials in app.js
- commit API keys
- expose private customer data in screenshots

Use test data for portfolio demonstrations.
