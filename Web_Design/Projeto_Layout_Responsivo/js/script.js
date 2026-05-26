const TAB_MESSAGES = {
  message: "There are no messages. Come back later.",
  rating: "There is nothing here. Maybe later.",
  feed: "There is nothing here either. Come back later.",
  decline: "Yeah, there is nothing here now either. Come back later.",
};

let activeTab = "ride";
let rideDeclined = false;

let tabButtons = [];
let ridePanel = null;
let emptyPanel = null;
let emptyMessage = null;

function updateTabStyles() {
  tabButtons.forEach((btn) => {
    const isActive = btn.dataset.tab === activeTab;
    btn.setAttribute("aria-selected", isActive ? "true" : "false");

    btn.style.backgroundColor = isActive ? "#eb5b95" : "#ffffff";

    const svg = btn.querySelector("svg");
    if (svg) svg.style.fill = isActive ? "#ffffff" : "#a5a2be";

    const span = btn.querySelector("span");
    if (span) span.style.color = isActive ? "#ffffff" : "#a5a2be";
  });
}

function setActiveTab(tabId) {
  activeTab = tabId;
  updateTabStyles();
  renderPanel();
}

function renderPanel() {
  if (!ridePanel || !emptyPanel || !emptyMessage) return;

  const showRideContent = activeTab === "ride" && !rideDeclined;

  if (showRideContent) {
    ridePanel.hidden = false;
    emptyPanel.hidden = true;
    return;
  }

  ridePanel.hidden = true;
  emptyPanel.hidden = false;

  if (activeTab === "ride" && rideDeclined) {
    emptyMessage.textContent = TAB_MESSAGES.decline;
    return;
  }

  emptyMessage.textContent = TAB_MESSAGES[activeTab] ?? "";
}

function handleDecline() {
  rideDeclined = true;
  renderPanel();
}

function handleAccept() {
  window.location.href = "ride.html";
}

function bindTabs() {
  const nav = document.querySelector(".top-actions");
  if (!nav) return;

  nav.addEventListener("click", (e) => {
    const tabBtn = e.target.closest(".icon-main[data-tab]");
    if (!tabBtn) return;
    setActiveTab(tabBtn.dataset.tab);
  });
}

function bindRideActions() {
  const declineBtn = document.getElementById("btn-decline");
  const acceptBtn = document.getElementById("btn-accept");

  declineBtn?.addEventListener("click", handleDecline);
  acceptBtn?.addEventListener("click", handleAccept);
}

function init() {
  tabButtons = Array.from(document.querySelectorAll(".icon-main[data-tab]"));
  ridePanel = document.getElementById("ride-panel");
  emptyPanel = document.getElementById("empty-panel");
  emptyMessage = document.getElementById("empty-message");

  bindTabs();
  bindRideActions();
  updateTabStyles();
  renderPanel();
}

document.addEventListener("DOMContentLoaded", init);