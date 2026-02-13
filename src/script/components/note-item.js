class NoteItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: null,
  };

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this.render();
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
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
    
    .note-meta {
      margin-top: auto;
      font-size: 0.8rem;
      color: #888;
      display: flex;
      justify-content: space-between;
    }
    
    .note-meta small {
      text-transform: capitalize;  
    }

    .badge {
      padding: 0.2em 0.7em;
      border-radius: 12px;
      font-weight: bold;
      color: white;
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
    <article class="note-item">
      <h3>${this._note.title}</h3>
      <p>${this._note.body}</p>
      <div class="note-meta">
        <small class="badge ${
          this._note.archived ? "badge-archived" : "badge-unarchived"
        }">
          ${this._note.archived ? "Archived" : "Unarchived"}
        </small>
        <small>Created At: ${new Date(this._note.createdAt).toLocaleDateString(
          "id-ID",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        )}</small>
      </div>
    </article>
    `;
  }
}

customElements.define("note-item", NoteItem);
