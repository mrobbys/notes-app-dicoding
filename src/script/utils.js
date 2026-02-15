class Utils {
  static emptyElement(element) {
    element.innerHTML = '';
  }

  static showElement(element) {
    element.style.display = 'block';
    element.hidden = false;
    element.disabled = false;
  }

  static hideElement(element) {
    element.style.display = 'none';
    element.hidden = true;
    element.disabled = true;
  }

  static createErrorElement(id, message, targetElement) {
    const errorElement = document.createElement('small');
    errorElement.id = id;
    errorElement.textContent = message;
    targetElement.appendChild(errorElement);
  }
}

export default Utils;
