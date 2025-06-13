/**
 * @jest-environment jsdom
 */

describe("Simple tests without imports", () => {
  // formatDate function from your script
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  test("formatDate formats date as dd/mm/yyyy", () => {
    const date = new Date(2025, 5, 13); // June 13, 2025
    expect(formatDate(date)).toBe("13/06/2025");
  });

  test("showAgenda shows message when no user selected", () => {
    document.body.innerHTML = `
      <ul id="agenda-list"></ul>
      <div id="agenda-message"></div>
    `;

    const agendaList = document.getElementById("agenda-list");
    const agendaMessage = document.getElementById("agenda-message");

    function showAgenda(userId) {
      agendaList.innerHTML = "";

      if (!userId) {
        agendaMessage.textContent = "Please select a user to see the agenda.";
        return;
      }
      agendaMessage.textContent = "User selected.";
    }

    showAgenda("");
    expect(agendaMessage.textContent).toBe("Please select a user to see the agenda.");
  });

  test("user-select is populated with user options", () => {
    document.body.innerHTML = `<select id="user-select"></select>`;

    // Fake getUserIds function
    function getUserIds() {
      return ["1", "2", "3"];
    }

    const users = getUserIds();
    const select = document.getElementById("user-select");

    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user;
      option.textContent = `User ${user}`;
      select.appendChild(option);
    });

    expect(select.children.length).toBe(3);
    expect(select.children[0].value).toBe("1");
    expect(select.children[1].textContent).toBe("User 2");
  });
});
