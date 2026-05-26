const MAY_DAYS = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  month: "May",
}));

const SEED_DAY = 28;
const SLOT_COUNT = 5;
const CENTER_INDEX = 2;
const TRANSITION_MS = 350;

const MOCK_RIDES = [
  {
    id: "mock-a",
    icons: [
      { icon: "fa-wifi", active: true },
      { icon: "fa-suitcase", active: true },
      { icon: "fa-bolt", active: false },
    ],
    users: [
      { type: "img", src: "images/man-black.png", alt: "User 1" },
      { type: "img", src: "https://randomuser.me/api/portraits/women/44.jpg", alt: "User 2" },
    ],
    origin: "Chicago",
    originTime: "20:00",
    destination: "Oak Park",
    destTime: "22:30",
    distance: "Distance 15, 8 km",
  },
  {
    id: "mock-b",
    icons: [
      { icon: "fa-wifi", active: false },
      { icon: "fa-suitcase", active: true },
    ],
    users: [
      { type: "child" },
      { type: "img", src: "https://randomuser.me/api/portraits/women/65.jpg", alt: "User 3" },
      { type: "img", src: "https://randomuser.me/api/portraits/men/32.jpg", alt: "User 4" },
    ],
    origin: "New York",
    originTime: "21:45",
    destination: "Park Avenue",
    destTime: "22:40",
    distance: "Distance 19, 3 km",
  },
];

const ridesByDay = {
  [SEED_DAY]: [0, 1],
};

let selectedDay = SEED_DAY;
let slotWidth = 0;
let isAnimating = false;

let datePicker = null;
let track = null;
let boxContainer = null;
let indicatorDay = null;
let indicatorMonth = null;

function getVisibleSlots(centerDay) {
  return Array.from({ length: SLOT_COUNT }, (_, i) => {
    const day = centerDay + (i - CENTER_INDEX);
    if (day >= 1 && day <= MAY_DAYS.length) return day;
    return null;
  });
}

function getMonthLabel(day) {
  return MAY_DAYS.find((d) => d.day === day)?.month ?? "May";
}

function measureSlotWidth() {
  if (!datePicker) return;
  const styles = getComputedStyle(datePicker);
  const itemW = parseFloat(styles.getPropertyValue("--date-item-width")) || 60;
  const gap = parseFloat(styles.getPropertyValue("--date-gap")) || 4;
  slotWidth = itemW + gap;
}

function measureSlotWidthFromDOM() {
  const slots = track?.querySelectorAll(".date-slot");
  if (slots && slots.length >= 2) {
    slotWidth = slots[1].offsetLeft - slots[0].offsetLeft;
    return;
  }
  measureSlotWidth();
}

function updateIndicator() {
  if (!indicatorDay || !indicatorMonth) return;
  indicatorDay.textContent = String(selectedDay);
  indicatorMonth.textContent = getMonthLabel(selectedDay);
}

function createDateButton(day) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "date-item";
  btn.dataset.day = String(day);
  btn.setAttribute("role", "listitem");
  btn.setAttribute("aria-label", `${day} de ${getMonthLabel(day)}`);
  if (day === selectedDay) {
    btn.setAttribute("aria-current", "date");
  }

  btn.innerHTML = `
    <section class="month-down">
      <span class="month-top-slot" aria-hidden="true"></span>
      <p class="n-month">${day}</p>
      <p class="month-label">${getMonthLabel(day)}</p>
    </section>
  `;

  return btn;
}

function createEmptySlot() {
  const slot = document.createElement("div");
  slot.className = "date-slot date-slot--empty";
  slot.setAttribute("aria-hidden", "true");
  return slot;
}

function createDateSlot(day) {
  if (day === null) return createEmptySlot();

  const slot = document.createElement("div");
  slot.className = "date-slot";
  slot.appendChild(createDateButton(day));
  return slot;
}

function renderDateTrack() {
  if (!track) return;

  track.replaceChildren();
  getVisibleSlots(selectedDay).forEach((day) => {
    track.appendChild(createDateSlot(day));
  });
  measureSlotWidthFromDOM();
}

function resetTrackAfterAnimation(newSelectedDay) {
  if (selectedDay !== SEED_DAY) {
    delete ridesByDay[selectedDay];
  }

  selectedDay = newSelectedDay;
  isAnimating = false;

  track.style.transition = "none";
  renderDateTrack();
  track.style.transform = "translateX(0)";
  void track.offsetWidth;
  track.style.transition = "transform 0.35s ease";

  updateIndicator();
  renderRideCards();
}

function animateToDay(newSelectedDay, clickedIndex) {
  const slots = track.querySelectorAll(".date-slot");
  if (!slots.length) return;

  const targetIndex =
    clickedIndex >= 0 ? clickedIndex : slots.length > 1 ? CENTER_INDEX : 0;

  measureSlotWidthFromDOM();
  const offset = (CENTER_INDEX - targetIndex) * slotWidth;

  isAnimating = true;

  const onEnd = (e) => {
    if (e.propertyName !== "transform") return;
    track.removeEventListener("transitionend", onEnd);
    clearTimeout(fallbackTimer);
    resetTrackAfterAnimation(newSelectedDay);
  };

  const fallbackTimer = setTimeout(() => {
    track.removeEventListener("transitionend", onEnd);
    if (isAnimating) {
      resetTrackAfterAnimation(newSelectedDay);
    }
  }, TRANSITION_MS + 50);

  track.addEventListener("transitionend", onEnd);
  track.style.transform = `translateX(${offset}px)`;
}

function handleDateClick(e) {
  const btn = e.target.closest(".date-item");
  if (!btn || isAnimating) return;

  const newDay = Number(btn.dataset.day);
  if (newDay === selectedDay) return;

  const slot = btn.closest(".date-slot");
  const clickedIndex = slot
    ? Array.from(track.children).indexOf(slot)
    : CENTER_INDEX;

  if (clickedIndex === CENTER_INDEX) {
    if (selectedDay !== SEED_DAY) {
      delete ridesByDay[selectedDay];
    }
    selectedDay = newDay;
    updateIndicator();
    renderRideCards();
    return;
  }

  animateToDay(newDay, clickedIndex);
}

function iconClass(active) {
  return active ? "icon-small active" : "icon-small";
}

function renderUsers(users) {
  return users
    .map((user) => {
      if (user.type === "child") {
        return `<div class="box-users-child" aria-hidden="true"><i class="fa-solid fa-child"></i></div>`;
      }
      return `<img src="${user.src}" alt="${user.alt}">`;
    })
    .join("");
}

function renderIcons(icons) {
  return icons
    .map((item) => `<i class="fa-solid ${item.icon} ${iconClass(item.active)}"></i>`)
    .join("");
}

function createRideCard(mock) {
  const section = document.createElement("section");
  section.className = "box";
  section.dataset.rideId = mock.id;

  section.innerHTML = `
    <div class="box-header-icons">
      <div class="box-icons-group">
        ${renderIcons(mock.icons)}
      </div>
      <div class="box-users">
        ${renderUsers(mock.users)}
      </div>
    </div>
    <div class="route-section">
      <div class="route-row">
        <span class="route-origin-marker" aria-hidden="true"></span>
        <div class="route-item-body">
          <p class="location-name">${mock.origin}</p>
          <p class="time-info">${mock.originTime}</p>
        </div>
      </div>
      <div class="route-row route-row--middle">
        <div class="route-line-wrap" aria-hidden="true">
          <span class="route-line-segment"></span>
        </div>
        <p class="distance-section">${mock.distance}</p>
      </div>
      <div class="route-row">
        <span class="route-dest-marker" aria-hidden="true"></span>
        <div class="route-item-body">
          <p class="location-name">${mock.destination}</p>
          <p class="time-info">${mock.destTime}</p>
        </div>
      </div>
    </div>
  `;

  return section;
}

function createAddCard() {
  const section = document.createElement("section");
  section.className = "box box--add";
  section.innerHTML = `
    <button type="button" class="box--add__btn" aria-label="Adicionar viagem">
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
    </button>
  `;
  return section;
}

function getRideCount(day) {
  return ridesByDay[day]?.length ?? 0;
}

function renderRideCards() {
  if (!boxContainer) return;

  boxContainer.replaceChildren();

  const count = getRideCount(selectedDay);
  for (let i = 0; i < count; i += 1) {
    const mockIndex = ridesByDay[selectedDay][i];
    boxContainer.appendChild(createRideCard(MOCK_RIDES[mockIndex]));
  }

  if (count < MOCK_RIDES.length) {
    boxContainer.appendChild(createAddCard());
  }
}

function handleAddCardClick(e) {
  const addSection = e.target.closest(".box--add");
  if (!addSection) return;

  const day = selectedDay;

  if (day === SEED_DAY) return;

  if (!ridesByDay[day]) {
    ridesByDay[day] = [];
  }

  const nextIndex = ridesByDay[day].length;
  if (nextIndex >= MOCK_RIDES.length) return;

  ridesByDay[day].push(nextIndex);
  renderRideCards();
}

function setupResizeObserver() {
  if (!datePicker || typeof ResizeObserver === "undefined") {
    measureSlotWidth();
    return;
  }

  const ro = new ResizeObserver(() => {
    measureSlotWidthFromDOM();
  });
  ro.observe(datePicker);
  measureSlotWidth();
}

function init() {
  datePicker = document.querySelector(".date-picker");
  track = document.getElementById("date-track");
  boxContainer = document.getElementById("box-1");
  indicatorDay = document.getElementById("indicator-day");
  indicatorMonth = document.getElementById("indicator-month");

  selectedDay = SEED_DAY;

  setupResizeObserver();
  renderDateTrack();
  updateIndicator();
  renderRideCards();

  track.addEventListener("click", handleDateClick);
  boxContainer.addEventListener("click", handleAddCardClick);
}

document.addEventListener("DOMContentLoaded", init);