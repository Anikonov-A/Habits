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
function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = "";
  }
}

function validateForm(form, fields) {
  const formData = new FormData(form);
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    form[field].classList.remove("error");
    if (!field) {
      form[field].classList.add("error");
      return;
    }
    res[field] = fieldValue;
  }
  let isValid = true;
  for (const field of fields) {
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
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
    activeHabit.days.length / activeHabit.target > 1
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
  event.preventDefault();
  const data = validateForm(event.target, ["comment"]);
  if (!data) {
    return;
  }
  habits = habits.map((h) => {
    if (h.id === globalActiveHabitId) {
      return {
        ...h,
        days: h.days.concat([{ comment: data.comment }]),
      };
    }
    return h;
  });

  resetForm(event.target, ["comment"]);
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
//Working with habits
function setIcon(context, icon) {
  page.popup.form["icon"].value = icon;
  const activeIcon = document.querySelector(".icon.icon--active");
  activeIcon.classList.remove("icon--active");
  context.classList.add("icon--active");
}
function addHabit(event) {
  event.preventDefault();
  const data = validateForm(event.target, ["name", "icon", "target"]);
  if (!data) {
    return;
  }
  const maxId = habits.reduce(
    (acc, habit) => (acc > habit.id ? acc : habit.id),
    0
  );
  habits.push({
    id: maxId + 1,
    name: data.name,
    target: data.target,
    icon: data.icon,
    days: [],
  });
  resetForm(event.target, ["name", "target"]);
  togglePopup();
  rerender(maxId + 1);
  saveData();
}
//Init
(() => {
  loadData();
  rerender(habits[0].id);
})();
