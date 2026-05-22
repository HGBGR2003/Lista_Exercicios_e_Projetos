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

function setActiveTab(tabId) {
  if (tabId === activeTab) return;

  activeTab = tabId;

  tabButtons.forEach((btn) => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });

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

  if (activeTab !== "ride") {
    setActiveTab("ride");
    return;
  }

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
  renderPanel();
}

document.addEventListener("DOMContentLoaded", init);
