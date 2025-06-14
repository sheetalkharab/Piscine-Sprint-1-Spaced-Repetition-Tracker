// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.
// script.js
import { getUserIds } from "./common.mjs";
import { addData, getData } from "./storage.mjs";

export function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export function addMonths(date, months) {
  const d = date.getDate();
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  // month-rollover fix
  if (newDate.getDate() < d) newDate.setDate(0);
  return newDate;
}

export function getRevisionDates(startDate) {
  const base = new Date(startDate);
  return [
    new Date(base.getTime() + 7 * 24 * 60 * 60 * 1000), // +1 week
    addMonths(base, 1), // +1 month
    addMonths(base, 3), // +3 months
    addMonths(base, 6), // +6 months
    addMonths(base, 12), // +12 months
  ];
}


if (typeof document !== "undefined") {
  const userSelect = document.getElementById("user-select");
  const topicInput = document.getElementById("topic-name");
  const dateInput = document.getElementById("start-date");
  const agendaMessage = document.getElementById("agenda-message");
  const agendaList = document.getElementById("agenda-list");
  const topicForm = document.getElementById("topic-form");

  // initialize
  dateInput.value = formatDate(new Date());
  let currentUser = null;

  function populateDropdown() {
    getUserIds().forEach((userID) => {
      const opt = document.createElement("option");
      opt.value = userID;
      opt.textContent = `User ${userID}`;
      userSelect.appendChild(opt);
    });
  }

  function showAgenda(data) {
  agendaMessage.innerHTML = "";
  agendaList.innerHTML = "";

  if (!data || data.length === 0) {
    agendaMessage.textContent = "No agenda found";
    return;
  }

  const today = new Date(formatDate(new Date()));
  const futureDates = data
    .filter((d) => new Date(d.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (futureDates.length === 0) {
    agendaMessage.textContent = "No upcoming revisions. All in the past.";
    return;
  }

  futureDates.forEach((d) => {
    const li = document.createElement("li");
    li.textContent = `${d.topic}, ${new Date(d.date).toLocaleDateString()}`;
    agendaList.appendChild(li);
  });
}

  topicForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const topic = topicInput.value.trim();
  const date = dateInput.value;

  const dates = getRevisionDates(date);
  const newEntries = dates.map((date) => ({ topic, date }));

  addData(currentUser, newEntries);
  showAgenda(getData(currentUser));

  topicForm.reset();
  dateInput.value = formatDate(new Date());
  });

  userSelect.addEventListener("change", () => {
    const selectedUser = userSelect.value;
    currentUser = selectedUser || null;

    if (!currentUser) {
      agendaMessage.textContent = "Please select a user.";
      agendaList.innerHTML = "";
      return;
    }
    const agenda = getData(currentUser);
    showAgenda(agenda);
  });

  populateDropdown();
}
