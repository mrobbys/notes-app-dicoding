class NoteItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: null
  };

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  connectedCallback() {
    this.render();
    this._attachEventListeners();
  }

  _toggleArchive() {
    const noteItem = this._shadowRoot.querySelector('.note-item');
    const noteId = noteItem.dataset.id;

    this.dispatchEvent(
      new CustomEvent('toggle-archive-note', {
        detail: { id: noteId },
        bubbles: true,
        composed: true
      })
    );
  }

  disconnectedCallback() {
    this._removeEventListeners();
  }

  _attachEventListeners() {
    const archivedBtn = this._shadowRoot.querySelector('.archived-btn');
    const trashBtn = this._shadowRoot.querySelector('.trash-btn');

    archivedBtn?.addEventListener('click', this._toggleArchiveHandler);
    trashBtn?.addEventListener('click', this._deleteNoteHandler);
  }

  _removeEventListeners() {
    const archivedBtn = this._shadowRoot.querySelector('.archived-btn');
    const trashBtn = this._shadowRoot.querySelector('.trash-btn');

    archivedBtn?.removeEventListener('click', this._toggleArchiveHandler);
    trashBtn?.removeEventListener('click', this._deleteNoteHandler);
  }

  _toggleArchiveHandler = (e) => {
    e.preventDefault();
    this._toggleArchive();
  };

  _deleteNoteHandler = (e) => {
    e.preventDefault();
    this._deleteNote();
  };

  _deleteNote() {
    const noteItem = this._shadowRoot.querySelector('.note-item');
    const noteId = noteItem.dataset.id;

    this.dispatchEvent(
      new CustomEvent('delete-note', {
        detail: { id: noteId },
        bubbles: true,
        composed: true
      })
    );
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  set note(value) {
    this._note = value;
    this.render();
  }

  get note() {
    return this._note;
  }

  _updateStyle() {
    this._style.textContent = `
    :host {
      display: block;
      border-radius: 8px;
      background-color: white;
      border: 1px solid #ddd;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

    .note-item {
      position: relative;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .note-item h3 {
      margin-bottom: 0.5rem;
    }

    .note-item p {
      font-size: 0.9rem;
      color: #555;
    }
    
    .trash-container {
      position: absolute;
      top: 15px;
      right: 15px;
    }

    .trash-btn{
      background: none;
      border: none;
      padding: 0;
    }
    
    .trash-container svg {
      width: 20px;
      height: 20px;
      color: #888;
      opacity: 0.6;
      cursor: pointer;
      transition: all .3s ease
    }

    .trash-container svg:hover {
      opacity: 1;
      color: #f44335;
    }
    
    .note-meta {
      margin-top: auto;
      font-size: 0.8rem;
      color: #888;
      display: flex;
      justify-content: space-between;
      text-transform: capitalize;  
    }
    
    .badge {
      padding: 0.2em 0.7em;
      border-radius: 12px;
      font-weight: bold;
      color: white;
      outline: none;
      border: none;
      cursor: pointer;
      transition: all .3s ease;
    }
      
    .badge:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .badge-archived {
      background-color: #4caf50;
    }
      
    .badge-unarchived {
      background-color: #f44336;
    }
    `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
    <article class="note-item" data-id="${this._note.id}">
      <div class="trash-container">
      <button class="trash-btn" aria-label="Delete Note">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 2H4V0H12V2H15V4H1V2Z" fill="currentColor"/>
          <path clip-rule="evenodd" d="M13 6H3V16H13V6ZM9 9H7V13H9V9Z" fill="currentColor" fill-rule="evenodd"/>
        </svg>
        </button>
      </div>
      <h3>${this._note.title}</h3>
      <p>${this._note.body}</p>
      <div class="note-meta">
        <button class="archived-btn badge ${
          this._note.archived ? 'badge-archived' : 'badge-unarchived'
        }">
          ${this._note.archived ? 'Archived' : 'Unarchived'}
        </button>
        <small>Created At: ${new Date(this._note.createdAt).toLocaleDateString(
          'id-ID',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }
        )}</small>
      </div>
    </article>
    `;

    this._attachEventListeners();
  }
}

customElements.define('note-item', NoteItem);
