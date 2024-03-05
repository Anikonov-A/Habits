"use strict";

let habits = [];
const HABIT_KEY = "HABIT_KEY";
let globalActiveHabitId;
//Page
const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    title: document.querySelector(".title"),
    progressPercent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover-bar"),
  },
  content: {
    daysWrapper: document.querySelector(".main__wrapper"),
    day: document.querySelector(".habit__day"),
    comment: document.querySelector(".habit__comment"),
  },
  popup: {
    index: document.getElementById("add-popup"),
    form: document.querySelector(".popup__form"),
  },
};
// Utilits
function loadData() {
  const habitsString = localStorage.getItem(HABIT_KEY);
  const habitsArr = JSON.parse(habitsString);
  if (Array.isArray(habitsArr)) {
    habits = habitsArr;
  }
}
function saveData() {
  localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
}
function togglePopup() {
  if (page.popup.index.classList.contains("cover--hidden")) {
    page.popup.index.classList.remove("cover--hidden");
  } else {
    page.popup.index.classList.add("cover--hidden");
  }
}

// Render
function rerenderMenu(activeHabit) {
  for (const habit of habits) {
    const existed = document.querySelector(`[data-menu-id="${habit.id}"]`);
    if (!existed) {
      const element = document.createElement("button");
      element.setAttribute("data-menu-id", habit.id);
      element.classList.add("menu__item");
      element.addEventListener("click", () => rerender(habit.id));
      element.innerHTML = `<img src='./img/${habit.icon}.svg' alt='${habit.name}' />`;
      if (activeHabit.id === habit.id) {
        element.classList.add("menu__item_active");
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabit.id === habit.id) {
      existed.classList.add("menu__item_active");
    } else {
      existed.classList.remove("menu__item_active");
    }
  }
}
function renderHead(activeHabit) {
  page.header.title.innerText = activeHabit.name;
  const progress =
    activeHabit.days.lenght / activeHabit.target > 1
      ? 100
      : (activeHabit.days.length / activeHabit.target) * 100;

  page.header.progressPercent.innerText = `${progress.toFixed(0)}%`;
  page.header.progressCoverBar.style.width = `${progress}%`;
}
function rerenderContent(activeHabit) {
  page.content.daysWrapper.innerHTML = "";
  for (const i in activeHabit.days) {
    const element = document.createElement("div");
    element.classList.add("habit");
    element.innerHTML = `<div class="habit__day">Day ${Number(i) + 1}</div>
						<div class="habit__comment">${activeHabit.days[i].comment}</div>
						<button class="habit__delete" onclick='deleteDay(${i})'>
							<img src="img/delete.svg" alt="delete day ${Number(i) + 1}">
						</button>`;
    page.content.daysWrapper.appendChild(element);
  }
  page.content.day.innerHTML = `Day ${activeHabit.days.length + 1}`;
}

function rerender(activeHabitId) {
  globalActiveHabitId = activeHabitId;
  const activeHabit = habits.find((h) => h.id === activeHabitId);
  if (!activeHabit) {
    return;
  }
  rerenderMenu(activeHabit);
  renderHead(activeHabit);
  rerenderContent(activeHabit);
}
//Work with days
function addDays(event) {
  const form = event.target;
  event.preventDefault();
  const data = new FormData(form);
  const comment = data.get("comment");
  form["comment"].classList.remove("error");
  if (!comment) {
    form["comment"].classList.add("error");
    return;
  }
  habits = habits.map((h) => {
    if (h.id === globalActiveHabitId) {
      return {
        ...h,
        days: h.days.concat([{ comment }]),
      };
    }
    return h;
  });

  form["comment"].value = "";
  rerender(globalActiveHabitId);
  saveData();
}
function deleteDay(index) {
  habits = habits.map((h) => {
    if (h.id === globalActiveHabitId) {
      h.days.splice(index, 1);
      return {
        ...h,
        days: h.days,
      };
    }
    return h;
  });
  rerender(globalActiveHabitId);
  saveData();
}

//Init
(() => {
  loadData();
  rerender(habits[0].id);
})();
