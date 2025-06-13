// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.


import { getUserIds } from "./common.mjs";
import { addData, getData } from "./storage.mjs";

// DOM Elements
const userSelect = document.getElementById("user-select");
const topicInput = document.getElementById("topic-name");
const dateInput = document.getElementById("start-date");
const agendaMessage = document.getElementById("agenda-message");
const agendaList = document.getElementById("agenda-list");
const topicForm = document.getElementById("topic-form");

// track active user (updated when dropdown changes)
let currentUser = null;

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

dateInput.value = formatDate(new Date());

function addMonths(date, months) {
  const newDate = new Date(date);
  const d = newDate.getDate();
  newDate.setMonth(newDate.getMonth() + months);

  // Handle month rollover
  if (newDate.getDate() < d) {
    newDate.setDate(0);
  }

  return newDate;
}

function getRevisionDates(startDate) {
  const baseDate = new Date(startDate);

  return [
    new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000), // +1 week
    addMonths(baseDate, 1), // +1 month
    addMonths(baseDate, 3), // +3 months
    addMonths(baseDate, 6), // +6 months
    addMonths(baseDate, 12), // +1 year
  ];
}

function populateDropdown() {
  const users = getUserIds();
  users.forEach((userID) => {
    const option = document.createElement("option");
    option.value = userID;
    option.textContent = `User ${userID}`;
    userSelect.appendChild(option);
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
    agendaMessage.textContent =
      "No upcoming revisions. All entries are in the past.";
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
  const newEntries = dates.map((date) => ({
    topic,
    date,
  }));

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
