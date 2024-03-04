"use strict";

let habits = [];
const HABIT_KEY = "HABIT_KEY";
//Page
const page = {
  menu: document.querySelector(".menu__list"),
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

// Render
function rerenderMenu(activeHabit) {
  if (!activeHabit) {
    return;
  }
  for (const habit of habits) {
    const existed = document.querySelector(`[data-menu-id="${habit.id}"]`);
    if (!existed) {
      const element = document.createElement("button");
      element.setAttribute("data-menu-id", habit.id);
      element.classList.add("menu__item");
      element.addEventListener("click", () => rerender(habit.id));
      element.innerHTML = `<img src='./img/${habit.icon}.svg' alt='${habit.name}' />`;
      console.log(element);
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
function rerender(activeHabitId) {
  const activeHabit = habits.find((h) => h.id === activeHabitId);
  rerenderMenu(activeHabit);
}

//Init
(() => {
  loadData();
  rerender(habits[0].id);
})();
