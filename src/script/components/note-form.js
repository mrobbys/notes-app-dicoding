class NoteForm extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _formSubmitHandler = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  connectedCallback() {
    this.render();
    const form = this._shadowRoot.querySelector("form");
    const titleInput = this._shadowRoot.querySelector("#title");
    const bodyInput = this._shadowRoot.querySelector("#body");
    const submitButton = this._shadowRoot.querySelector(
      "button[type='submit']",
    );

    this._formSubmitHandler = (e) => {
      e.preventDefault();
      this._addNote();
    };

    form?.addEventListener("submit", this._formSubmitHandler);
    form?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        titleInput.focus();
        this._addNote();
      }
    });

    // validation
    const updateButtonState = () => {
      const titleValue = titleInput.value;
      const bodyValue = bodyInput.value;
      const titleInvalid = titleValue.length > 0 && titleValue.length < 3;
      const bodyInvalid = bodyValue.length > 0 && bodyValue.length < 5;
      submitButton.disabled =
        !titleValue || !bodyValue || titleInvalid || bodyInvalid;
    };

    if (titleInput) {
      titleInput.addEventListener("input", () => {
        this._validateTitle();
        updateButtonState();
      });
    }

    if (bodyInput) {
      bodyInput.addEventListener("input", () => {
        this._validateBody();
        updateButtonState();
      });
    }

    updateButtonState();
  }

  disconnectedCallback() {
    const form = this._shadowRoot.querySelector("form");
    if (form && this._formSubmitHandler) {
      form.removeEventListener("submit", this._formSubmitHandler);
      form.removeEventListener("keydown", this._formSubmitHandler);
    }
  }

  _addFormListener() {
    if (!form) {
      alert("Form tidak ditemukan");
      return;
    }

    this._formSubmitHandler = (e) => {
      e.preventDefault();
      this._addNote();
    };
  }

  _validateTitle() {
    const titleInput = this._shadowRoot.querySelector("#title");
    const titleError = this._shadowRoot.querySelector("#title-error");
    if (titleInput.value.length > 0 && titleInput.value.length < 3) {
      titleError.textContent = "Panjang judul minimal 3 karakter";
    } else {
      titleError.textContent = "";
    }
  }

  _validateBody() {
    const bodyInput = this._shadowRoot.querySelector("#body");
    const bodyError = this._shadowRoot.querySelector("#body-error");
    if (bodyInput.value.length > 0 && bodyInput.value.length < 5) {
      bodyError.textContent = "Panjang isi catatan minimal 5 karakter";
    } else {
      bodyError.textContent = "";
    }
  }

  _addNote() {
    const titleInput = this._shadowRoot.querySelector("#title");
    const bodyInput = this._shadowRoot.querySelector("#body");
    const titleError = this._shadowRoot.querySelector("#title-error");
    const bodyError = this._shadowRoot.querySelector("#body-error");

    // state error
    let isValid = true;

    if (titleError.textContent || bodyError.textContent) {
      isValid = false;
    }

    if (!titleInput.value || !bodyInput.value) {
      isValid = false;
    }

    if (!isValid) return;

    this.dispatchEvent(
      new CustomEvent("note-added", {
        detail: {
          title: titleInput.value,
          body: bodyInput.value,
        },
        bubbles: true,
        composed: true,
      }),
    );

    this._shadowRoot.querySelector("form").reset();

    // reset state error
    titleError.textContent = "";
    bodyError.textContent = "";
  }

  _updateStyle() {
    this._style.textContent = `
    .note-form {
      background-color: white;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .note-form h2 {
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-group input,
    .form-group textarea {
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    .form-group textarea {
      resize: none;
      height: 150px;
    }

    .note-form button {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 4px;
      background-color: #4b7bec;
      color: white;
      cursor: pointer;
    }

    #title-error, #body-error {
      color: red;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    button:disabled {
      background-color: #a5b1c2;
      cursor: not-allowed;
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
      <section class="note-form">
        <h2>Tambah Catatan</h2>
        <form>
          <div class="form-group">
            <label for="title">Judul</label>
            <input
              type="text"
              id="title"
              placeholder="Judul catatan"
            />
            <small id="title-error"></small>
          </div>

          <div class="form-group">
            <label for="body">Isi Catatan</label>
            <textarea
              id="body"
              rows="4"
              placeholder="Isi catatan"
              
            ></textarea>
            <small id="body-error"></small>
          </div>

          <button type="submit">Tambah</button>
        </form>
      </section>
    `;
  }
}

customElements.define("note-form", NoteForm);
