document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMenu();
  initScheduleControls();
  initDirectionLinks();
  renderSchedule();
  initReveal();
  initStudioGallery();
  initDemoDialog();
});

// Шапка: прозрачная над фото, с фоном после прокрутки

function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

// Плавное появление блоков при прокрутке

function initReveal() {
  const items = Array.from(document.querySelectorAll("[data-reveal]"));
  document.documentElement.classList.add("reveal-ready");
  if (!items.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Небольшая задержка между соседними карточками одной группы
  const counters = new Map();
  items.forEach((el) => {
    const parent = el.parentElement;
    const index = counters.get(parent) || 0;
    counters.set(parent, index + 1);
    el.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 90}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  items.forEach((el) => observer.observe(el));
}

// Мобильное меню

function initMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("primary-menu");
  if (!toggle || !menu) return;
  document.documentElement.classList.add("menu-ready");

  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Открыть меню");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });
}

//Управление расписанием: дни + направления

function initScheduleControls() {
  const dayTabs = document.getElementById("schedule-days");
  const typeChips = document.getElementById("schedule-types");
  if (!dayTabs || !typeChips) return;

  dayTabs.innerHTML = DAY_ORDER.map(
    (day, i) => `
      <button type="button" data-value="${day}" aria-pressed="${i === 0 ? "true" : "false"}">
        ${day}
      </button>`
  ).join("");

  typeChips.innerHTML = [{ id: "all", name: "Все" }, ...DIRECTIONS]
    .map(
      (d, i) => `
      <button type="button" data-value="${d.id}" aria-pressed="${i === 0 ? "true" : "false"}">
        ${d.name}
      </button>`
    )
    .join("");

  const onClick = (event) => {
    const button = event.target.closest("button[data-value]");
    if (!button) return;
    const group = button.closest("[role='group']");
    group.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    renderSchedule();
  };

  dayTabs.addEventListener("click", onClick);
  typeChips.addEventListener("click", onClick);
}

function getActiveValue(groupId) {
  const group = document.getElementById(groupId);
  const active = group && group.querySelector("button[aria-pressed='true']");
  return active ? active.dataset.value : null;
}

function setActiveValue(groupId, value) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll("button").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.value === value));
  });
}

function resetScheduleFilters() {
  setActiveValue("schedule-days", DAY_ORDER[0]);
  setActiveValue("schedule-types", "all");
  renderSchedule();
}

// Вспомогательные функции

function getDirectionName(typeId) {
  const direction = DIRECTIONS.find((d) => d.id === typeId);
  return direction ? direction.name : "Занятие";
}

function getCoachName(coachId) {
  const coach = COACHES.find((c) => c.id === coachId);
  return coach ? coach.name : "Уточняется";
}

function addMinutes(time, minutes) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor((total / 60) % 24)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value);
  return div.innerHTML;
}

// Отрисовка расписания

function renderSchedule() {
  const list = document.getElementById("schedule-list");
  const dayHeading = document.getElementById("schedule-day-heading");
  if (!list) return;

  if (!SCHEDULE.length) {
    list.innerHTML = `<p class="schedule-empty">Расписание уточняется, напишите администратору.</p>`;
    return;
  }

  const day = getActiveValue("schedule-days") || DAY_ORDER[0];
  const typeId = getActiveValue("schedule-types") || "all";

  if (dayHeading) dayHeading.textContent = DAY_LABELS[day] || day;

  const items = SCHEDULE.filter((item) => {
    const dayMatch = item.day === day;
    const typeMatch = typeId === "all" || item.typeId === typeId;
    return dayMatch && typeMatch;
  }).sort((a, b) => {
    const timeDiff = a.time.localeCompare(b.time);
    if (timeDiff !== 0) return timeDiff;
    return getDirectionName(a.typeId).localeCompare(getDirectionName(b.typeId), "ru");
  });

  if (!items.length) {
    list.innerHTML = `
      <div class="schedule-empty">
        <p>По выбранным условиям занятий нет.</p>
        <button type="button" class="btn btn-outline" data-reset-schedule>Сбросить фильтры</button>
      </div>`;
    list.querySelector("[data-reset-schedule]").addEventListener("click", resetScheduleFilters);
    return;
  }

  list.innerHTML = items
    .map((item, index) => {
      const directionName = escapeHtml(getDirectionName(item.typeId));
      const coachName = escapeHtml(getCoachName(item.coachId));
      const endTime = addMinutes(item.time, item.durationMinutes);
      const contactHref = buildContactLink({
        direction: getDirectionName(item.typeId),
        day: item.day,
        time: item.time,
      });
      return `
        <div class="schedule-row" style="--i:${index}">
          <div class="schedule-row-time">${escapeHtml(item.time)}&nbsp;–&nbsp;${escapeHtml(endTime)}</div>
          <div class="schedule-row-info">
            <span class="schedule-row-title">${directionName}</span>
            <span class="schedule-row-coach">${coachName}</span>
          </div>
          <a class="btn btn-primary btn-sm" href="${contactHref}" data-demo="true">Записаться</a>
        </div>`;
    })
    .join("");

  list.querySelectorAll('a[data-demo="true"]').forEach((link) => {
    link.addEventListener("click", handleDemoContactClick);
  });
}

// Кнопки контакта (демо-режим)

function buildContactLink() { return '#contact'; }

function handleDemoContactClick(event) {
  event.preventDefault();
  const row = event.currentTarget.closest('.schedule-row');
  const title = row?.querySelector('.schedule-row-title')?.textContent;
  const time = row?.querySelector('.schedule-row-time')?.textContent;
  const day = document.getElementById('schedule-day-heading')?.textContent;
  const selection = document.getElementById('contact-selection');
  selection.hidden = !title;
  selection.textContent = title ? `${title} · ${day}, ${time}` : '';
  document.getElementById('contact-demo').showModal();
}
function initDemoDialog() {
  const dialog = document.getElementById('contact-demo');
  for(const button of dialog.querySelectorAll('.dialog-close, #close-contact')) button.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if(event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
}

// Ссылки «Направления → Расписание»

function initDirectionLinks() {
  document.querySelectorAll("[data-filter-type]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveValue("schedule-types", link.dataset.filterType);
      const first = [...SCHEDULE].filter(x => x.typeId === link.dataset.filterType).sort((a,b) => DAY_ORDER.indexOf(a.day)-DAY_ORDER.indexOf(b.day) || a.time.localeCompare(b.time))[0];
      if(first) setActiveValue("schedule-days", first.day);
      renderSchedule();
      document.getElementById("schedule").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
  });

  document.querySelectorAll('[data-demo="true"]').forEach((link) => {
    if (!link.closest("#schedule-list")) {
      link.addEventListener("click", handleDemoContactClick);
    }
  });
}

// Галерея: ручное управление, превью, стрелки и свайп
function initStudioGallery() {
 const root = document.querySelector('.studio-gallery');
 if(!root) return;
 const slides = [...root.querySelectorAll('.studio-slide')];
 const thumbs = [...root.querySelectorAll('.studio-thumb')];
 let active = 0;
 function show(index, announce=true) {
  active = (index + slides.length) % slides.length;
  slides.forEach((slide,i) => slide.hidden = i !== active);
  thumbs.forEach((button,i) => button.setAttribute('aria-pressed', String(i===active)));
  if(announce) root.querySelector('.studio-gallery-status').textContent = `${slides[active].querySelector('figcaption').textContent}, фото ${active+1} из ${slides.length}`;
 }
 root.querySelector('.studio-arrows').hidden = false;
 root.querySelector('.studio-thumbs').hidden = false;
 thumbs.forEach((button,i) => button.addEventListener('click', () => show(i)));
 root.querySelector('[data-gallery-prev]').addEventListener('click', () => show(active-1));
 root.querySelector('[data-gallery-next]').addEventListener('click', () => show(active+1));
 root.addEventListener('keydown', event => {
  if(event.key==='ArrowLeft' || event.key==='ArrowRight') { event.preventDefault(); show(active+(event.key==='ArrowRight'?1:-1)); }
 });
 const stage = root.querySelector('.studio-stage'); let start=null;
 stage.addEventListener('pointerdown', event => {
  if(event.target.closest('button') || (event.pointerType==='mouse' && event.button!==0)) return;
  start={x:event.clientX,y:event.clientY};stage.setPointerCapture?.(event.pointerId);
 });
 stage.addEventListener('pointerup', event => {
  if(!start) return;
  const dx=event.clientX-start.x,dy=event.clientY-start.y;
  if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) show(active+(dx<0?1:-1));start=null;
 });
 stage.addEventListener('pointercancel', () => start=null);
 show(0,false);
}
