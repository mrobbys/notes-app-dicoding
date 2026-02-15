class NoteSearch extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _debounceTimer = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  connectedCallback() {
    this.render();
    const searchInput = this._shadowRoot.querySelector('#searchNote');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this._handleInput(e);
      });
    }
  }

  _handleInput(e) {
    const query = e.target.value;

    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent('note-searched', {
          detail: {
            query
          },
          bubbles: true,
          composed: true
        })
      );
    }, 500);
  }

  set value(val) {
    const searchInput = this._shadowRoot.querySelector('#searchNote');
    if (searchInput) {
      searchInput.value = val;
    }
  }

  get value() {
    const searchInput = this._shadowRoot.querySelector('#searchNote');
    return searchInput ? searchInput.value : '';
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
      }
    
      .note-search{
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: white;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
    .note-search input{
      display: block;
      width: 100%;
      height: 100%;
      padding: 0.75rem 1rem;
      border: none;
      outline: none;
      font-size: 14px;
    }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="note-search">
        <input type="search" id="searchNote" placeholder="Search notes..." autocomplete="off" />
      </div>
    `;
  }
}

customElements.define('note-search', NoteSearch);
