class AppBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
    div {
      display: block;
      width: 100%;
      background-color: #4b7bec;
      color: white;
      padding: .25rem;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
      text-align: center;
    }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `      
      <div>
        <h1>Notes App</h1>
      </div>
    `;
  }
}

customElements.define("app-bar", AppBar);
