import autoAnimate from '@formkit/auto-animate';

class NoteList extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  connectedCallback() {
    this.render();

    autoAnimate(this);
  }

  _updateStyle() {
    this._style.textContent = `
    :host{
      display: block;
      }
    .note-list{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
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
    <section class="note-list">
      <slot></slot>
    </section>
    `;
  }
}

customElements.define('note-list', NoteList);
