import './styles/style.css';
import './script/components/index.js';

import home from './script/view/home.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'izitoast/dist/js/iziToast.min.js';
const iziToastOptions = {
  timeout: 3000,
  position: 'topCenter',
  closeOnEscape: true,
  closeOnClick: true,
  pauseOnHover: false,
  progressBar: false
};
const toast = {
  success: (title, message) => {
    iziToast.success({
      ...iziToastOptions,
      backgroundColor: '#78e08f',
      title: title,
      message: message
    });
  },
  error: (title, message) => {
    iziToast.error({
      ...iziToastOptions,
      backgroundColor: '#ff8787',
      title: title,
      message: message
    });
  },
  deleteNote: (title, message, onConfirm) => {
    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      displayMode: 'once',
      zIndex: 999,
      title: title,
      message: message,
      position: 'center',
      buttons: [
        [
          '<button>Yes</button>',
          (instance, toast) => {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            if (onConfirm) onConfirm();
          },
          true
        ],
        [
          '<button>No</button>',
          (instance, toast) => {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          }
        ]
      ]
    });
  }
};
window.toast = toast;

document.addEventListener('DOMContentLoaded', () => {
  home();
});
