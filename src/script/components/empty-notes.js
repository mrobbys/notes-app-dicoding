class EmptyNotes extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  connectedCallback() {
    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        text-align: center;
        padding: 3rem 1rem;
        color: #888;
        grid-column: 1 / -1;
      }

      .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: #555;
      }
    `;
  }

  render() {
    this._shadowRoot.innerHTML = '';
    this._updateStyle();
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="empty-notes">
        <div class="empty-icon">📝</div>
        <p>Note Kosong :(</p>
      </div>
    `;
  }
}

customElements.define('empty-notes', EmptyNotes);
