import Utils from "../utils.js";
import Notes from "../data/notes-data.js";

const home = () => {
  const noteForm = document.querySelector("note-form");
  const noteList = document.querySelector("note-list");
  const noteSearch = document.querySelector("note-search");

  const showNoteItems = (query) => {
    const res = Notes.searchNotes(query);
    displayResults(res);
    Utils.showElement(noteList);
  };

  const onSearchNoteHandler = (e) => {
    e.preventDefault();
    const { query } = e.detail;
    displayResults(Notes.searchNotes(query));
  };

  const displayResults = (notes) => {
    const noteItemsElements = notes.map((note) => {
      const noteItemElement = document.createElement("note-item");
      noteItemElement.note = note;
      return noteItemElement;
    });

    Utils.emptyElement(noteList);
    noteList.append(...noteItemsElements);
  };

  // add note
  noteForm.addEventListener("note-added", (e) => {
    try {
      const { title, body } = e.detail;
      Notes.addNote({ title, body });
      showNoteItems();
    } catch (error) {
      alert("Gagal menambahkan catatan!");
      console.error("Error adding note:", error);
    }
  });

  noteSearch.addEventListener("note-searched", onSearchNoteHandler);
  showNoteItems();
};

export default home;
