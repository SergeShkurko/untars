export default class InputContainer {
  constructor(element) {
    this.input = element;
    this.container = this.input.closest('.input-container');
    this.parentForm = this.input.closest('form');
    this.placeholder = this.container.querySelector('.input-container__placeholder');

    this.classes = {
      hasFocus: 'input-container_has_focus',
      hasValue: 'input-container_has_value',
    };
  }

  init() {
    this.handlers();
    this.setHasValue(this.isEmpty);
  }

  handlers() {
    if (this.parentForm !== null) {
      // because reset in parent form not trigger events on form elements
      this.parentForm
        .addEventListener('reset', () => {
          setTimeout(() => {
            this.setHasValue(this.isEmpty);
          }, 1);
        });
    }

    this.input
      .addEventListener('focus', () => {
        this.setHasFocus(true);
      });

    this.input
      .addEventListener('blur', () => {
        this.setHasFocus(false);
      });

    this.input
      .addEventListener('input', () => {
        this.setHasValue(this.isEmpty);
      });

    this.input
      .addEventListener('change', () => {
        this.setHasValue(this.isEmpty);
      });
  }

  setHasFocus(value) {
    if (value) {
      this.container.classList.add(this.classes.hasFocus);
    } else {
      this.container.classList.remove(this.classes.hasFocus);
    }
  }

  setHasValue(value) {
    if (value) {
      this.container.classList.add(this.classes.hasValue);
    } else {
      this.container.classList.remove(this.classes.hasValue);
    }
  }

  get isEmpty() {
    return !!this.input.value;
  }
}
