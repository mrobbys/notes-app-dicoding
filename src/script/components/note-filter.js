class NoteFilter extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  connectedCallback() {
    this.render();

    const select = this._shadowRoot.querySelector('select');
    select?.addEventListener('change', (e) => {
      this.dispatchEvent(
        new CustomEvent('filter-changed', {
          detail: { filter: e.target.value },
          bubbles: true,
          composed: true
        })
      );
    });
  }

  set value(val) {
    const select = this._shadowRoot.querySelector('select');
    if (select) {
      select.value = val;
    }
  }

  get value() {
    const select = this._shadowRoot.querySelector('select');
    return select ? select.value : 'all';
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
      }

      .filter-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 0.5rem;
        background-color: white;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      label {
        font-weight: 500;
        font-size: 0.9rem;
        color: #555;
      }

      select {
        padding: 0.75rem 1rem;
        border: 1px solid #dcdde1;
        border-radius: 5px;
        background-color: white;
        font-size: 14px;
        cursor: pointer;
        outline: none;
        transition: border-color 0.2s ease;
      }

      select:hover {
        border-color: #4b7bec;
      }

      select:focus {
        border-color: #4b7bec;
        box-shadow: 0 0 0 3px rgba(75, 123, 236, 0.1);
      }

      @media (max-width: 768px) {
      .filter-container {
        justify-content: center;
      }
}
    `;
  }

  render() {
    this._shadowRoot.innerHTML = '';
    this._updateStyle();
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="filter-container">
        <label for="filter">Filter:</label>
        <select id="filter">
          <option value="all" selected>All Notes</option>
          <option value="unarchived">Unarchived</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    `;
  }
}

customElements.define('note-filter', NoteFilter);
