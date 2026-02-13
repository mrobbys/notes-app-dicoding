class NoteSearch extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _searchInputHandler = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  connectedCallback() {
    this.render();
    const searchInput = this._shadowRoot.querySelector("#searchNote");
    if (searchInput) {
      searchInput.addEventListener("input", () => this._searchNote());
    }
  }

  disconnectedCallback() {
    const searchInput = this._shadowRoot.querySelector("#searchNote");
    if (searchInput && this._searchInputHandler) {
      searchInput.removeEventListener("input", this._searchInputHandler);
    }
  }

  _searchNote() {
    const query = this._shadowRoot.querySelector("#searchNote").value;

    this.dispatchEvent(
      new CustomEvent("note-searched", {
        detail: {
          query,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _updateStyle() {
    this._style.textContent = `
    .note-search input{
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      max-width: 500px;
      border: 1px solid #dcdde1;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      font-size: 14px;
    }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <section class="note-search">
        <input type="search" id="searchNote" placeholder="Search notes..." />
      </section>
    `;
  }
}

customElements.define("note-search", NoteSearch);
