"use strict";

function submitForm() {
  const input = document.querySelector(".input").value;
  const formObject = {
    text: input,
  };
  if (input) {
    document.querySelector(".panel").textContent = input;
    document.querySelector(".input").value = "";
    document
      .querySelector(".notification")
      .classList.add("notification_active");
    localStorage.setItem("text", JSON.stringify(formObject));
  } else {
    return;
  }
}
function inputChange(e) {
  if (e.code == "Enter" || e.code == "NumpadEnter") {
    submitForm();
  }
}
