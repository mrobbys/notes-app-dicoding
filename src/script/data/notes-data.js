const data = [];

const BASE_URL = 'https://notes-api.dicoding.dev/v2';

class notesData {
  static setNotes(notes) {
    data.splice(0, data.length, ...notes);
    this.sortByCreatedAt();
  }

  static sortByCreatedAt() {
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async fetchNotes() {
    try {
      const res = await fetch(`${BASE_URL}/notes`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await res.json();
      if (result.error) {
        throw new Error(result.message);
      }

      const notes = result.data;
      this.setNotes(notes);
      return data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }

  static async addNote({ title, body }) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, body })
    };

    try {
      const res = await fetch(`${BASE_URL}/notes`, options);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await res.json();
      if (result.error) {
        throw new Error(result.message);
      }

      const newNote = result.data;
      data.unshift(newNote);

      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }

  static async toggleArchiveNote(id) {
    const options = {
      method: 'POST'
    };

    // check note, if archived, then url is /unarchive, if unarchived, then url is /archive
    const note = data.find((note) => note.id === id);
    if (!note) {
      throw new Error('Note not found');
    }
    const url = `${BASE_URL}/notes/${id}/${note.archived ? 'unarchive' : 'archive'}`;
    
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await res.json();
      if (result.error) {
        throw new Error(result.message);
      }
      
      note.archived = !note.archived;
      return note;
    } catch (error) {
      console.error('Error toggling archive note:', error);
      throw error;
    }
  }
  
  static async deleteNote(id) {
    const options = {
      method: 'DELETE'
    };

    try {
      const res = await fetch(`${BASE_URL}/notes/${id}`, options);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await res.json();
      if (result.error) {
        throw new Error(result.message);
      }

      const index = data.findIndex((note) => note.id === id);
      if (index !== -1) {
        data.splice(index, 1);
      }

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  static filterNotes(filter = 'all') {
    let filtered = data;

    if (filter === 'unarchived') {
      filtered = data.filter((note) => note.archived === false);
    } else if (filter === 'archived') {
      filtered = data.filter((note) => note.archived === true);
    }
    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
}

export default notesData;
