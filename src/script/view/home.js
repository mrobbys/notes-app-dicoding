import Utils from '../utils.js';
import Notes from '../data/notes-data.js';

const home = () => {
  const noteForm = document.querySelector('note-form');
  const noteList = document.querySelector('note-list');
  const noteSearch = document.querySelector('note-search');
  const noteFilter = document.querySelector('note-filter');
  const loadingIndicator = document.querySelector('loading-indicator');

  let currentFilter = 'all';
  let currentQuery = '';

  // show/hide loading
  const showLoading = () => Utils.showElement(loadingIndicator);
  const hideLoading = () => Utils.hideElement(loadingIndicator);

  const onFilterChangeHandler = (e) => {
    e.preventDefault();
    currentFilter = e.detail.filter;
    applyFilterAndSearch();
  };

  const onSearchNoteHandler = (e) => {
    e.preventDefault();
    currentQuery = e.detail.query;
    applyFilterAndSearch();
  };

  const applyFilterAndSearch = () => {
    let notes = Notes.filterNotes(currentFilter);
    if (currentQuery) {
      const lowerCaseQuery = currentQuery.trim().toLowerCase();
      notes = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(lowerCaseQuery) ||
          note.body.toLowerCase().includes(lowerCaseQuery)
      );
    }

    displayResults(notes);
  };

  // fetch notes
  const fetchNotes = async () => {
    showLoading();
    try {
      await Notes.fetchNotes();
      applyFilterAndSearch();
    } catch (error) {
      toast.error('Error', 'Failed to fetch notes. Please try again.');
      console.error('Error fetching notes:', error);
    } finally {
      hideLoading();
    }
  };

  const displayResults = (notes) => {
    Utils.emptyElement(noteList);

    // if notes is empty, show empty notes component
    if (notes.length === 0) {
      const emptyNotes = document.createElement('empty-notes');
      noteList.appendChild(emptyNotes);
      return;
    }

    const noteItemsElements = notes.map((note) => {
      const noteItemElement = document.createElement('note-item');
      noteItemElement.note = note;
      return noteItemElement;
    });

    noteList.prepend(...noteItemsElements);
  };

  const resetFilters = () => {
    currentFilter = 'all';
    currentQuery = '';
    noteSearch.value = '';
    noteFilter.value = 'all';
  }
  
  // add note using async/await from api dicoding
  noteForm.addEventListener('note-added', async (e) => {
    e.preventDefault();

    showLoading();
    try {
      const { title, body } = e.detail;
      await Notes.addNote({ title, body });

      resetFilters();

      applyFilterAndSearch();
      toast.success('Success', 'Note added successfully.');
    } catch (error) {
      toast.error('Error', 'Failed to add note. Please try again.');
      console.error('Error adding note:', error);
    } finally {
      hideLoading();
    }
  });

  // toggle archive note
  noteList.addEventListener('toggle-archive-note', async (e) => {
    e.preventDefault();

    const noteId = e.detail.id;

    showLoading();
    try {
      await Notes.toggleArchiveNote(noteId);
      applyFilterAndSearch();
      toast.success('Success', 'Note updated successfully.');
    } catch (error) {
      toast.error('Error', 'Failed to update note. Please try again.');
      console.error('Error updating note:', error);
    } finally {
      hideLoading();
    }
  });

  // delete note
  noteList.addEventListener('delete-note', async (e) => {
    e.preventDefault();

    const noteId = e.detail.id;

    toast.deleteNote(
      'Delete Note',
      'Are you sure you want to delete this note?',
      async () => {
        // Callback dipanggil setelah user klik "Yes"
        showLoading();
        try {
          await Notes.deleteNote(noteId);
          applyFilterAndSearch();
          toast.success('Success', 'Note deleted successfully.');
        } catch (error) {
          toast.error('Error', 'Failed to delete note. Please try again.');
          console.error('Error deleting note:', error);
        } finally {
          hideLoading();
        }
      }
    );
  });

  const init = () => {
    hideLoading();
    noteSearch.addEventListener('note-searched', onSearchNoteHandler);
    noteFilter.addEventListener('filter-changed', onFilterChangeHandler);
    fetchNotes();
  };

  init();
};

export default home;
