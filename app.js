const STORAGE_KEY = "leadflow-settings";
const METRICS_KEY = "leadflow-metrics";

const form = document.querySelector("#lead-form");
const formMessage = document.querySelector("#formMessage");
const submitButton = document.querySelector("#submitButton");
const activityLog = document.querySelector("#activityLog");
const clearLogButton = document.querySelector("#clearLogButton");

const settingsDialog = document.querySelector("#settingsDialog");
const settingsButton = document.querySelector("#settingsButton");
const saveSettingsButton = document.querySelector("#saveSettingsButton");
const modeSelect = document.querySelector("#modeSelect");
const webhookInput = document.querySelector("#webhookInput");
const modeBadge = document.querySelector("#modeBadge");

const leadsMetric = document.querySelector("#leadsMetric");
const priorityMetric = document.querySelector("#priorityMetric");
const runsMetric = document.querySelector("#runsMetric");
const heroStatus = document.querySelector("#heroStatus");

const defaultSettings = {
  mode: "demo",
  webhookUrl: ""
};

const defaultMetrics = {
  leads: 0,
  highPriority: 0,
  runs: 0
};

let settings = loadJSON(STORAGE_KEY, defaultSettings);
let metrics = loadJSON(METRICS_KEY, defaultMetrics);

function loadJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? { ...fallback, ...JSON.parse(value) } : { ...fallback };
  } catch {
    return { ...fallback };
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function updateInterface() {
  const isLive = settings.mode === "zapier";

  modeBadge.textContent = isLive ? "Zapier Webhook" : "Demo Mode";
  modeBadge.classList.toggle("live", isLive);
  modeBadge.classList.toggle("demo", !isLive);

  modeSelect.value = settings.mode;
  webhookInput.value = settings.webhookUrl;

  leadsMetric.textContent = metrics.leads;
  priorityMetric.textContent = metrics.highPriority;
  runsMetric.textContent = metrics.runs;

  heroStatus.textContent = isLive
    ? "Live mode is enabled. Submissions will be sent to the configured Zapier webhook."
    : "Ready for a demo submission.";
}

function scoreLead(data) {
  let score = 30;

  const budgetScore = {
    "under-1000": 5,
    "1000-2500": 15,
    "2500-5000": 25,
    "5000+": 35
  };

  score += budgetScore[data.budget] || 0;

  if (["Web Automation", "API Integration", "AI Workflow"].includes(data.service)) {
    score += 15;
  }

  if (data.company.trim()) {
    score += 5;
  }

  if (data.message.trim().length >= 80) {
    score += 10;
  }

  return Math.min(score, 100);
}

function getPriority(score) {
  if (score >= 75) return "High";
  if (score >= 50) return "Medium";
  return "Normal";
}

function getFormData() {
  const data = Object.fromEntries(new FormData(form).entries());
  const score = scoreLead(data);

  return {
    ...data,
    priority: getPriority(score),
    score,
    source: "LeadFlow Portfolio",
    submittedAt: new Date().toISOString()
  };
}

function validateLead(data) {
  if (!data.name.trim()) return "Please enter a name.";
  if (!data.email.trim() || !data.email.includes("@")) return "Please enter a valid email.";
  if (!data.service) return "Please select a service.";
  if (!data.budget) return "Please select a budget range.";
  if (!data.message.trim()) return "Please describe the project request.";
  return "";
}

function addLog(title, detail) {
  const empty = activityLog.querySelector(".empty-log");
  if (empty) empty.remove();

  const item = document.createElement("li");
  const heading = document.createElement("strong");
  const meta = document.createElement("small");

  heading.textContent = title;
  meta.textContent = detail;

  item.append(heading, meta);
  activityLog.prepend(item);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runDemoAutomation(payload) {
  const stages = [
    ["Lead validated", "Required fields passed client-side validation."],
    ["Priority calculated", `${payload.priority} priority · score ${payload.score}/100`],
    ["Webhook simulated", "Demo mode prepared the structured Zapier payload."],
    ["CRM action simulated", "Lead would be stored in Google Sheets or a connected CRM."],
    ["Notification simulated", "High-value leads can trigger email or Slack notifications."]
  ];

  for (const [title, detail] of stages) {
    addLog(title, detail);
    await wait(250);
  }
}

async function sendToZapier(payload) {
  if (!settings.webhookUrl) {
    throw new Error("Add your Zapier Catch Hook URL in Automation Settings.");
  }

  if (!settings.webhookUrl.startsWith("https://hooks.zapier.com/")) {
    throw new Error("The webhook URL should be a Zapier hooks.zapier.com address.");
  }

  const body = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    body.append(key, String(value));
  });

  addLog("Sending webhook", "Posting structured lead data to Zapier.");

  await fetch(settings.webhookUrl, {
    method: "POST",
    body
  });

  addLog("Webhook sent", "Zapier received the submission request.");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = getFormData();
  const validationError = validateLead(payload);

  formMessage.className = "form-message";
  formMessage.textContent = "";

  if (validationError) {
    formMessage.classList.add("error");
    formMessage.textContent = validationError;
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Running automation...";
  heroStatus.textContent = "Processing lead through the workflow.";

  try {
    addLog("Lead received", `${payload.name} · ${payload.service}`);

    if (settings.mode === "zapier") {
      await sendToZapier(payload);
    } else {
      await runDemoAutomation(payload);
    }

    metrics.leads += 1;
    metrics.runs += 1;

    if (payload.priority === "High") {
      metrics.highPriority += 1;
    }

    saveJSON(METRICS_KEY, metrics);
    updateInterface();

    formMessage.classList.add("success");
    formMessage.textContent = `Automation completed. Lead priority: ${payload.priority} (${payload.score}/100).`;
    heroStatus.textContent = "Automation completed successfully.";
    form.reset();
  } catch (error) {
    addLog("Automation error", error.message);
    formMessage.classList.add("error");
    formMessage.textContent = error.message;
    heroStatus.textContent = "The latest automation run needs attention.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Run automation";
  }
});

settingsButton.addEventListener("click", () => {
  modeSelect.value = settings.mode;
  webhookInput.value = settings.webhookUrl;
  settingsDialog.showModal();
});

saveSettingsButton.addEventListener("click", (event) => {
  event.preventDefault();

  const nextSettings = {
    mode: modeSelect.value,
    webhookUrl: webhookInput.value.trim()
  };

  if (
    nextSettings.mode === "zapier" &&
    nextSettings.webhookUrl &&
    !nextSettings.webhookUrl.startsWith("https://hooks.zapier.com/")
  ) {
    webhookInput.setCustomValidity("Use a Zapier Catch Hook URL from hooks.zapier.com.");
    webhookInput.reportValidity();
    return;
  }

  webhookInput.setCustomValidity("");
  settings = nextSettings;
  saveJSON(STORAGE_KEY, settings);
  updateInterface();
  settingsDialog.close();
});

clearLogButton.addEventListener("click", () => {
  activityLog.innerHTML = '<li class="empty-log">No automation runs yet.</li>';
});

updateInterface();
