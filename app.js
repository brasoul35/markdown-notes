// Main app logic for the notes.
// Notes are kept in an array and saved to localStorage so they
// are still there when the page is reopened.

var notes = [];
var currentId = null;

// grab the elements we need
var noteList = document.getElementById("noteList");
var noteTitle = document.getElementById("noteTitle");
var noteBody = document.getElementById("noteBody");
var preview = document.getElementById("preview");
var searchBox = document.getElementById("searchBox");

// load saved notes from the browser
function loadNotes() {
  var saved = localStorage.getItem("notes");
  if (saved) {
    notes = JSON.parse(saved);
  }
}

// save the notes array to the browser
function saveToStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// show the list of notes on the left side
function drawList() {
  var search = searchBox.value.toLowerCase();
  noteList.innerHTML = "";

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    // filter by search text (title or body)
    var text = (note.title + " " + note.body).toLowerCase();
    if (search !== "" && text.indexOf(search) === -1) {
      continue;
    }

    var li = document.createElement("li");
    li.textContent = note.title === "" ? "(untitled)" : note.title;
    if (note.id === currentId) {
      li.className = "active";
    }
    // use a closure so each item remembers its own id
    li.onclick = (function (id) {
      return function () {
        openNote(id);
      };
    })(note.id);

    noteList.appendChild(li);
  }
}

// find a note by its id
function findNote(id) {
  for (var i = 0; i < notes.length; i++) {
    if (notes[i].id === id) {
      return notes[i];
    }
  }
  return null;
}

// open a note in the editor
function openNote(id) {
  var note = findNote(id);
  if (note === null) {
    return;
  }
  currentId = id;
  noteTitle.value = note.title;
  noteBody.value = note.body;
  updatePreview();
  drawList();
}

// make a brand new empty note
function newNote() {
  var note = {
    id: Date.now(),
    title: "",
    body: ""
  };
  notes.push(note);
  currentId = note.id;
  noteTitle.value = "";
  noteBody.value = "";
  updatePreview();
  saveToStorage();
  drawList();
}

// save the note that is currently open
function saveNote() {
  if (currentId === null) {
    newNote();
  }
  var note = findNote(currentId);
  if (note === null) {
    return;
  }
  note.title = noteTitle.value;
  note.body = noteBody.value;
  saveToStorage();
  drawList();
}

// delete the current note
function deleteNote() {
  if (currentId === null) {
    return;
  }
  var newList = [];
  for (var i = 0; i < notes.length; i++) {
    if (notes[i].id !== currentId) {
      newList.push(notes[i]);
    }
  }
  notes = newList;
  currentId = null;
  noteTitle.value = "";
  noteBody.value = "";
  preview.innerHTML = "";
  saveToStorage();
  drawList();
}

// update the live markdown preview
function updatePreview() {
  preview.innerHTML = renderMarkdown(noteBody.value);
}

// download the current note as a .md file
function exportNote() {
  var name = noteTitle.value.trim();
  if (name === "") {
    name = "note";
  }
  var blob = new Blob([noteBody.value], { type: "text/markdown" });
  var url = URL.createObjectURL(blob);

  var link = document.createElement("a");
  link.href = url;
  link.download = name + ".md";
  link.click();

  URL.revokeObjectURL(url);
}

// switch between light and dark mode and remember the choice
var themeBtn = document.getElementById("themeBtn");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark");
    themeBtn.textContent = "Dark Mode";
  }
}

function toggleTheme() {
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "light");
    applyTheme("light");
  } else {
    localStorage.setItem("theme", "dark");
    applyTheme("dark");
  }
}

// connect the buttons and inputs
document.getElementById("newNoteBtn").onclick = newNote;
document.getElementById("saveBtn").onclick = saveNote;
document.getElementById("exportBtn").onclick = exportNote;
document.getElementById("deleteBtn").onclick = deleteNote;
themeBtn.onclick = toggleTheme;
noteBody.oninput = updatePreview;
searchBox.oninput = drawList;

// start the app
applyTheme(localStorage.getItem("theme"));
loadNotes();
drawList();
