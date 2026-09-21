const KEYS = {
  settings: "reliefrelay.settings.v2",
  metrics: "reliefrelay.metrics.v2",
  queue: "reliefrelay.queue.v2",
  activity: "reliefrelay.activity.v2"
};

const form = document.querySelector("#request-form");
const formMessage = document.querySelector("#formMessage");
const submitButton = document.querySelector("#submitButton");
const loadSampleButton = document.querySelector("#loadSampleButton");
const activityLog = document.querySelector("#activityLog");
const clearLogButton = document.querySelector("#clearLogButton");

const settingsDialog = document.querySelector("#settingsDialog");
const settingsButton = document.querySelector("#settingsButton");
const saveSettingsButton = document.querySelector("#saveSettingsButton");
const modeSelect = document.querySelector("#modeSelect");
const webhookInput = document.querySelector("#webhookInput");

const modeBadge = document.querySelector("#modeBadge");
const networkBadge = document.querySelector("#networkBadge");
const requestsMetric = document.querySelector("#requestsMetric");
const urgentMetric = document.querySelector("#urgentMetric");
const queuedMetric = document.querySelector("#queuedMetric");
const heroStatus = document.querySelector("#heroStatus");
const systemState = document.querySelector("#systemState");

const routeBadge = document.querySelector("#routeBadge");
const routeDestination = document.querySelector("#routeDestination");
const routeReason = document.querySelector("#routeReason");
const detailsInput = document.querySelector("#details");
const characterCount = document.querySelector("#characterCount");

const DEFAULT_SETTINGS = {
  mode: "demo",
  webhookUrl: ""
};

const DEFAULT_METRICS = {
  processed: 0,
  urgent: 0,
  synced: 0
};

let settings = loadJSON(KEYS.settings, DEFAULT_SETTINGS);
let metrics = loadJSON(KEYS.metrics, DEFAULT_METRICS);
let queue = loadJSON(KEYS.queue, []);
let activity = loadJSON(KEYS.activity, []);
let isSyncing = false;

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredCloneSafe(fallback);
    return JSON.parse(raw);
  } catch {
    return structuredCloneSafe(fallback);
  }
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createRequestId() {
  if (globalThis.crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  return `rr-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getCheckedValues(name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

function getDraftRequest() {
  const data = Object.fromEntries(new FormData(form).entries());

  return {
    requestType: data.requestType || "",
    urgency: data.urgency || "",
    safetyStatus: data.safetyStatus || "",
    vulnerabilities: getCheckedValues("vulnerability")
  };
}

function computeRoute(request) {
  const reasons = [];
  let tier = "standard";

  const isImmediate =
    request.urgency === "immediate" ||
    request.safetyStatus === "trapped" ||
    request.requestType === "rescue";

  if (isImmediate) {
    tier = "critical";
    if (request.urgency === "immediate") reasons.push("immediate action selected");
    if (request.safetyStatus === "trapped") reasons.push("requester reports being trapped");
    if (request.requestType === "rescue") reasons.push("rescue or evacuation requested");
  } else {
    const isHigh =
      request.safetyStatus === "unsafe" ||
      (request.requestType === "medical" && ["today", "soon"].includes(request.urgency)) ||
      (request.requestType === "shelter" && request.urgency === "today") ||
      (request.vulnerabilities.length > 0 &&
        ["medical", "water", "food", "shelter", "protection"].includes(request.requestType));

    if (isHigh) {
      tier = "high";
      if (request.safetyStatus === "unsafe") reasons.push("current location marked unsafe");
      if (request.requestType === "medical") reasons.push("medical assistance requested");
      if (request.requestType === "shelter") reasons.push("time-sensitive shelter need");
      if (request.vulnerabilities.length > 0) reasons.push("additional vulnerability context provided");
    }
  }

  if (reasons.length === 0) {
    reasons.push("no critical or high-priority routing condition selected");
  }

  const destinations = {
    rescue: "Emergency response / evacuation desk",
    medical: "Health and medical coordination",
    water: "Water, sanitation, and relief distribution",
    food: "Relief distribution",
    shelter: "Shelter and displacement support",
    protection: "Protection and accessibility support",
    infrastructure: "Infrastructure / utilities coordination",
    other: "General response desk"
  };

  return {
    tier,
    destination: destinations[request.requestType] || "General response desk",
    reason: reasons.join("; ")
  };
}

function buildRequest() {
  const data = Object.fromEntries(new FormData(form).entries());
  const vulnerabilities = getCheckedValues("vulnerability");
  const route = computeRoute({
    requestType: data.requestType,
    urgency: data.urgency,
    safetyStatus: data.safetyStatus,
    vulnerabilities
  });

  return {
    requestId: createRequestId(),
    fullName: data.fullName.trim(),
    contact: data.contact.trim(),
    location: data.location.trim(),
    requestType: data.requestType,
    peopleAffected: Number(data.peopleAffected),
    urgency: data.urgency,
    safetyStatus: data.safetyStatus,
    vulnerabilities,
    details: data.details.trim(),
    routeTier: route.tier,
    routeDestination: route.destination,
    routeReason: route.reason,
    source: "ReliefRelay Portfolio",
    humanReviewRequired: true,
    submittedAt: new Date().toISOString()
  };
}

function validateRequest(request) {
  if (!request.fullName) return "Enter a requester name.";
  if (!request.contact) return "Enter a safe contact method.";
  if (!request.location) return "Enter a community or area.";
  if (!request.requestType) return "Select the type of assistance.";
  if (!Number.isFinite(request.peopleAffected) || request.peopleAffected < 1) {
    return "Enter at least one affected person.";
  }
  if (!request.urgency) return "Select an urgency level.";
  if (!request.safetyStatus) return "Select the current safety status.";
  if (!request.details) return "Describe the situation and requested assistance.";
  if (!document.querySelector("#consent").checked) {
    return "Confirm that you are using fictional/test data in this public prototype.";
  }
  return "";
}

function updateRoutingPreview() {
  const draft = getDraftRequest();
  const route = computeRoute(draft);

  routeBadge.className = `route-badge ${route.tier}`;
  routeBadge.textContent =
    route.tier === "critical" ? "Critical" : route.tier === "high" ? "High" : "Standard";
  routeDestination.textContent = route.destination;
  routeReason.textContent = route.reason;
}

function addActivity(title, detail, type = "standard") {
  activity.unshift({
    id: createRequestId(),
    title,
    detail,
    type,
    at: new Date().toISOString()
  });

  activity = activity.slice(0, 14);
  saveJSON(KEYS.activity, activity);
  renderActivity();
}

function renderActivity() {
  if (activity.length === 0) {
    activityLog.innerHTML = '<li class="empty-log">No workflow activity yet.</li>';
    return;
  }

  activityLog.innerHTML = "";

  activity.forEach((entry) => {
    const item = document.createElement("li");
    item.className = entry.type;

    const title = document.createElement("strong");
    title.textContent = entry.title;

    const detail = document.createElement("small");
    const time = new Date(entry.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    detail.textContent = `${entry.detail} · ${time}`;

    item.append(title, detail);
    activityLog.append(item);
  });
}

function renderState() {
  const isLive = settings.mode === "zapier";
  const online = navigator.onLine;

  modeBadge.textContent = isLive ? "Zapier Webhook" : "Demo Mode";
  modeBadge.className = `status-badge ${isLive ? "live" : "demo"}`;

  networkBadge.textContent = online ? "Online" : "Offline";
  networkBadge.className = `status-badge ${online ? "online" : "offline"}`;

  requestsMetric.textContent = metrics.processed;
  urgentMetric.textContent = metrics.urgent;
  queuedMetric.textContent = queue.length;

  systemState.textContent = !online
    ? "Offline queue active"
    : queue.length > 0
      ? "Sync pending"
      : isLive
        ? "Zapier mode ready"
        : "Demo system ready";

  heroStatus.textContent = isLive
    ? online
      ? "Live mode is enabled. Valid test submissions will be sent to the configured Zapier webhook."
      : "You are offline. New live-mode submissions will be queued locally until connectivity returns."
    : "Demo mode simulates routing and downstream automation without sending data externally.";

  modeSelect.value = settings.mode;
  webhookInput.value = settings.webhookUrl;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runDemoWorkflow(request) {
  const steps = [
    ["Request validated", "Required operational fields passed validation.", "success"],
    [
      "Routing support generated",
      `${request.routeTier.toUpperCase()} · ${request.routeDestination}`,
      request.routeTier
    ],
    ["Record prepared", `Structured payload created as ${request.requestId.slice(0, 12)}…`, "success"],
    ["Case log simulated", "A real Zap can append the request to Sheets, Airtable, or a case-management tool.", "success"],
    ["Responder alert simulated", "A real Zap can notify the appropriate response channel and send an acknowledgement.", "success"]
  ];

  for (const [title, detail, type] of steps) {
    addActivity(title, detail, type);
    await wait(240);
  }
}

async function postToZapier(request) {
  if (!settings.webhookUrl) {
    throw new Error("Add your Zapier Catch Hook URL in Automation Settings.");
  }

  if (!settings.webhookUrl.startsWith("https://hooks.zapier.com/")) {
    throw new Error("Use a Zapier Catch Hook URL from hooks.zapier.com.");
  }

  const body = new FormData();

  Object.entries(request).forEach(([key, value]) => {
    body.append(key, Array.isArray(value) ? value.join(", ") : String(value));
  });

  await fetch(settings.webhookUrl, {
    method: "POST",
    body,
    mode: "no-cors"
  });
}

function enqueueRequest(request, reason) {
  const alreadyQueued = queue.some((item) => item.request.requestId === request.requestId);
  if (alreadyQueued) return;

  queue.push({
    request,
    queuedAt: new Date().toISOString(),
    attempts: 0,
    lastError: reason
  });

  saveJSON(KEYS.queue, queue);
  addActivity("Queued for retry", `${request.requestId.slice(0, 8)} · ${reason}`, "high");
  renderState();
}

async function flushQueue() {
  if (isSyncing || settings.mode !== "zapier" || !navigator.onLine || queue.length === 0) {
    return;
  }

  isSyncing = true;
  addActivity("Queue sync started", `${queue.length} request(s) waiting`, "standard");

  const remaining = [];

  for (const item of queue) {
    try {
      item.attempts += 1;
      await postToZapier(item.request);
      metrics.synced += 1;
      addActivity("Queued request synced", item.request.requestId.slice(0, 12), "success");
    } catch (error) {
      remaining.push({
        ...item,
        lastError: error.message
      });
    }
  }

  queue = remaining;
  saveJSON(KEYS.queue, queue);
  saveJSON(KEYS.metrics, metrics);
  isSyncing = false;
  renderState();
}

async function processRequest(request) {
  if (settings.mode === "demo") {
    await runDemoWorkflow(request);
    return "Demo workflow completed.";
  }

  if (!navigator.onLine) {
    enqueueRequest(request, "Browser is offline");
    return "Request queued locally and will retry when the connection returns.";
  }

  try {
    addActivity("Sending to Zapier", `${request.routeTier.toUpperCase()} · ${request.routeDestination}`, request.routeTier);
    await postToZapier(request);
    metrics.synced += 1;
    addActivity("Zapier handoff sent", request.requestId.slice(0, 12), "success");
    return "Request sent to the configured Zapier webhook.";
  } catch (error) {
    enqueueRequest(request, error.message);
    return "Zapier could not be reached, so the request was queued locally for retry.";
  }
}

function loadSample() {
  document.querySelector("#fullName").value = "Maria Santos";
  document.querySelector("#contact").value = "0917-000-0000";
  document.querySelector("#location").value = "Riverside Community, Sample City";
  document.querySelector("#requestType").value = "shelter";
  document.querySelector("#peopleAffected").value = "5";
  document.querySelector("#urgency").value = "today";
  document.querySelector("#safetyStatus").value = "unsafe";
  document.querySelector('input[name="vulnerability"][value="child"]').checked = true;
  document.querySelector('input[name="vulnerability"][value="older-person"]').checked = true;
  detailsInput.value =
    "Sample scenario: flooding damaged the house. The family moved to higher ground but needs temporary shelter, drinking water, and information about the nearest safe evacuation site.";
  document.querySelector("#consent").checked = true;
  characterCount.textContent = detailsInput.value.length;
  updateRoutingPreview();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("input", () => {
  characterCount.textContent = detailsInput.value.length;
  updateRoutingPreview();
});

form.addEventListener("change", updateRoutingPreview);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const request = buildRequest();
  const validationError = validateRequest(request);

  formMessage.className = "form-message";
  formMessage.textContent = "";

  if (validationError) {
    formMessage.classList.add("error");
    formMessage.textContent = validationError;
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Processing request…";
  heroStatus.textContent = "Processing the request through the workflow.";

  try {
    const resultMessage = await processRequest(request);

    metrics.processed += 1;
    if (["critical", "high"].includes(request.routeTier)) {
      metrics.urgent += 1;
    }

    saveJSON(KEYS.metrics, metrics);
    renderState();

    formMessage.classList.add("success");
    formMessage.textContent = `${resultMessage} Routing: ${request.routeTier.toUpperCase()} → ${request.routeDestination}.`;
    heroStatus.textContent = "Workflow completed. Human review is still required.";
    form.reset();
    characterCount.textContent = "0";
    updateRoutingPreview();
  } catch (error) {
    addActivity("Workflow error", error.message, "critical");
    formMessage.classList.add("error");
    formMessage.textContent = error.message;
    heroStatus.textContent = "The workflow needs attention.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Process assistance request";
  }
});

loadSampleButton.addEventListener("click", loadSample);

settingsButton.addEventListener("click", () => {
  modeSelect.value = settings.mode;
  webhookInput.value = settings.webhookUrl;

  if (typeof settingsDialog.showModal === "function") {
    settingsDialog.showModal();
  } else {
    settingsDialog.setAttribute("open", "");
  }
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
  saveJSON(KEYS.settings, settings);
  renderState();

  if (settingsDialog.open) {
    settingsDialog.close();
  }

  flushQueue();
});

clearLogButton.addEventListener("click", () => {
  activity = [];
  saveJSON(KEYS.activity, activity);
  renderActivity();
});

window.addEventListener("online", () => {
  renderState();
  addActivity("Connection restored", "Attempting to sync queued requests.", "success");
  flushQueue();
});

window.addEventListener("offline", () => {
  renderState();
  addActivity("Connection lost", "Live-mode requests will wait in the local queue.", "high");
});

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Offline form queue still works through localStorage even if service-worker registration fails.
    });
  });
}

renderActivity();
renderState();
updateRoutingPreview();
flushQueue();
