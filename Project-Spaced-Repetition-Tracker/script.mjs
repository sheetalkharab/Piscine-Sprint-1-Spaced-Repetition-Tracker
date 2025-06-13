// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds } from "./common.mjs";

window.onload = function () {
  const users = getUserIds();
  //document.querySelector("body").innerText = `There are ${users.length} users`;
  const select = document.getElementById("user-select");
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user;
    option.textContent = `User ${user}`;
    select.appendChild(option);
  });

  const dateInput = document.getElementById("start-date");
  dateInput.valueAsDate = new Date();

  const agendaList = document.getElementById("agenda-list");
  const agendaMessage = document.getElementById("agenda-message");
  const form = document.getElementById("topic-form");

  let agendas = JSON.parse(localStorage.getItem("agendas")) || {};

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function showAgenda(userId) {
    agendaList.innerHTML = "";

    if (!userId) {
      agendaMessage.textContent = "Please select a user to see the agenda.";
      return;
    }

    const userAgenda = agendas[userId] || [];

    const today = new Date();
    const futureRevisions = [];

    userAgenda.forEach((topicItem) => {
      topicItem.revisions.forEach((revDate) => {
        today.setHours(0, 0, 0, 0);
        if (revDate >= today) {
          futureRevisions.push({ topic: topicItem.topic, date: new Date(revDate) });
        }
      });
    });

    futureRevisions.sort((a, b) => a.date - b.date);

    if (futureRevisions.length === 0) {
      agendaMessage.textContent = "No agenda for this user.";
      return;
    } else {
      agendaMessage.textContent = "";
    }

    futureRevisions.forEach(({ topic, date }) => {
      const li = document.createElement("li");
      li.textContent = `${topic}, ${formatDate(date)}`;
      agendaList.appendChild(li);
    });
  }

  select.addEventListener("change", (e) => {
    showAgenda(e.target.value);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const userId = select.value;
    const topic = document.getElementById("topic-name").value.trim();
    const startDateStr = dateInput.value;

    if (!userId) {
      alert("Please select a user first.");
      return;
    }
    if (!topic) {
      alert("Please enter a topic name.");
      return;
    }
    if (!startDateStr) {
      alert("Please select a start date.");
      return;
    }

    const startDate = new Date(startDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // zero out time for comparison
    startDate.setHours(0, 0, 0, 0);

    const revisions = [];

    function addDays(date, days) {
      const d = new Date(date);
      if(days==0)
      {
        d.setDate(d.getDate() );
      return d;
      }
      d.setDate(d.getDate() + days);
      return d;
    }
   

    function addMonths(date, months) {
  const d = new Date(date);
  const targetMonth = d.getMonth() + months;
  d.setMonth(targetMonth);

  if (d.getMonth() !== (targetMonth % 12)) {
    d.setDate(0);
  }
  return d;
}


    revisions.push(addDays(startDate, 7));
    revisions.push(addMonths(startDate, 1));
    revisions.push(addMonths(startDate, 3));
    revisions.push(addMonths(startDate, 6));
    revisions.push(addMonths(startDate, 12));

    if (!agendas[userId]) {
      agendas[userId] = [];
    }

    agendas[userId].push({ topic, revisions });

    localStorage.setItem("agendas", JSON.stringify(agendas));

    form.reset();
    dateInput.valueAsDate = new Date();

    showAgenda(userId);

  });
};
localStorage.clear();
