// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds, getData, setData} from "./storage.js";



const userSelect = document.getElementById("user-select");
const bookmarksDiv = document.getElementById("bookmarks");
const form = document.getElementById("bookmark-form");
let currentUser = null;

window.onload = function () {
  
  populateUserDropdown();
  userSelect.addEventListener("change", onUserChange);
  form.addEventListener("submit", onFormSubmit);
  
 // To fill dropdown with user IDs
  function populateUserDropdown() {
  const users = getUserIds();
  userSelect.innerHTML = `<option value="">-- Select a user --</option>`;
  users.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `User ${id}`;
    userSelect.appendChild(option);
  });
}

// To load selected user's bookmark
function onUserChange() {
  currentUser = userSelect.value;
  if (currentUser) {
    displayBookmarks(currentUser);
  } else {
    bookmarksDiv.innerHTML = "";
  }
}

// To render bookmarks in a list
function displayBookmarks(userId) {
  let bookmarks = getData(userId);
  if (!bookmarks) {
    bookmarks = [];
  }
  if (bookmarks.length === 0) {
    bookmarksDiv.innerText = "No bookmarks found for this user.";
    return;
  }

  bookmarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  //to create dynamically a list of bookmarks for current user and display on page
  const list = document.createElement("ul");

  for (const bm of bookmarks) {
    const item = document.createElement("li");

    const link = document.createElement("a");
    link.href = bm.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = bm.title;
    link.setAttribute("aria-label", `Bookmark titled ${bm.title}`);

    item.appendChild(link);

    const descText = document.createTextNode(` - ${bm.description}`);
    item.appendChild(descText);
    
    //To  add time stamp
    const timestamp = document.createElement("small");
    timestamp.textContent = new Date(bm.createdAt).toLocaleString();

    const timestampWrapper = document.createElement("div");
    timestampWrapper.appendChild(timestamp);
    item.appendChild(timestampWrapper);

    list.appendChild(item);
  }

  bookmarksDiv.innerHTML = "";
  bookmarksDiv.appendChild(list);
}


//To add new bookmark to current user
function onFormSubmit(event) {
  event.preventDefault();
  if (!currentUser) {
    alert("Please select a user first.");
    return;
  }

  const url = document.getElementById("url").value.trim();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!url || !title || !description) return;


  // To build a new bookmark object
  const newBookmark = {
    url,
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  const existing = getData(currentUser) || [];
  existing.push(newBookmark);
  setData(currentUser, existing);

  form.reset();
  displayBookmarks(currentUser);
};
}





