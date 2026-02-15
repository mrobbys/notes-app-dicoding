import autoAnimate from '@formkit/auto-animate';
import Utils from '../utils.js';

class NoteForm extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _formSubmitHandler = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  connectedCallback() {
    this.render();

    const formGroups = this._shadowRoot.querySelectorAll('.form-group');
    formGroups.forEach((group) => {
      autoAnimate(group);
    });

    const form = this._shadowRoot.querySelector('form');
    const titleInput = this._shadowRoot.querySelector('#title');
    const bodyInput = this._shadowRoot.querySelector('#body');
    const submitButton = this._shadowRoot.querySelector(
      "button[type='submit']"
    );

    this._formSubmitHandler = (e) => {
      e.preventDefault();
      this._addNote();
    };

    form?.addEventListener('submit', this._formSubmitHandler);
    form?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        titleInput.focus();
        this._addNote();
      }
    });

    // validation
    const updateButtonState = () => {
      const titleValue = titleInput.value.trim();
      const bodyValue = bodyInput.value.trim();
      const titleInvalid = titleValue.length > 0 && titleValue.length < 5;
      const bodyInvalid = bodyValue.length > 0 && bodyValue.length < 5;
      submitButton.disabled =
        !titleValue || !bodyValue || titleInvalid || bodyInvalid;
    };

    if (titleInput) {
      titleInput.addEventListener('input', () => {
        this._validateTitle();
        updateButtonState();
      });
    }

    if (bodyInput) {
      bodyInput.addEventListener('input', () => {
        this._validateBody();
        updateButtonState();
      });
    }

    updateButtonState();
  }

  disconnectedCallback() {
    const form = this._shadowRoot.querySelector('form');
    if (form && this._formSubmitHandler) {
      form.removeEventListener('submit', this._formSubmitHandler);
      form.removeEventListener('keydown', this._formSubmitHandler);
    }
  }

  _addFormListener() {
    if (!form) {
      alert('Form tidak ditemukan');
      return;
    }

    this._formSubmitHandler = (e) => {
      e.preventDefault();
      this._addNote();
    };
  }

  _validateTitle() {
    const titleInput = this._shadowRoot.querySelector('#title');
    const titleGroup = titleInput.parentElement;
    const oldError = titleGroup.querySelector('#title-error');
    const isInvalid =
      titleInput.value.trim().length > 0 && titleInput.value.trim().length < 5;

    // if invalid and error element not exist, create error element
    if (isInvalid && !oldError) {
      Utils.createErrorElement(
        'title-error',
        'Panjang judul minimal 5 karakter',
        titleGroup
      );
    }

    // if valid and error element exist, delete error element
    if (!isInvalid && oldError) {
      oldError.remove();
    }
  }

  _validateBody() {
    const bodyInput = this._shadowRoot.querySelector('#body');
    const bodyGroup = bodyInput.parentElement;
    const oldError = bodyGroup.querySelector('#body-error');
    const isInvalid =
      bodyInput.value.trim().length > 0 && bodyInput.value.trim().length < 5;

    // if invalid and error element not exist, create error element
    if (isInvalid && !oldError) {
      Utils.createErrorElement(
        'body-error',
        'Panjang isi minimal 5 karakter',
        bodyGroup
      );
    }

    // if valid and error element exist, delete error element
    if (!isInvalid && oldError) {
      oldError.remove();
    }
  }

  _addNote() {
    const titleInput = this._shadowRoot.querySelector('#title');
    const bodyInput = this._shadowRoot.querySelector('#body');
    const titleError = this._shadowRoot.querySelector('#title-error');
    const bodyError = this._shadowRoot.querySelector('#body-error');

    // state error
    let isValid = true;

    if (titleError || bodyError) {
      isValid = false;
    }

    if (!titleInput.value.trim() || !bodyInput.value.trim()) {
      isValid = false;
    }

    if (!isValid) return;

    this.dispatchEvent(
      new CustomEvent('note-added', {
        detail: {
          title: titleInput.value.trim(),
          body: bodyInput.value.trim()
        },
        bubbles: true,
        composed: true
      })
    );

    this._shadowRoot.querySelector('form').reset();

    // delete error element if exist
    const allErrors = this._shadowRoot.querySelectorAll("small[id$='-error']");
    allErrors.forEach((error) => error.remove());
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
      min-height: 100px;
      height: 100px;
    }

    .note-form button {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 4px;
      background-color: #4b7bec;
      color: white;
      cursor: pointer;
    }

    .form-group small {
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
    this._shadowRoot.innerHTML = '';
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
          </div>

          <div class="form-group">
            <label for="body">Isi Catatan</label>
            <textarea
              id="body"
              placeholder="Isi catatan"
            ></textarea>
          </div>

          <button type="submit">Tambah</button>
        </form>
      </section>
    `;
  }
}

customElements.define('note-form', NoteForm);
