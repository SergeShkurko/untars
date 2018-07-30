import Tooltip from 'tooltip.js';
import maskInput from 'vanilla-text-mask';
import TweenLite from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';
import 'gsap/CSSPlugin';
import InputContainer from '../input-container/input-container';

const inputs = document.querySelectorAll('.form__input');

const setCaretPosition = (ctrl, pos) => {
  // Modern browsers
  // if (ctrl.setSelectionRange) {
  ctrl.setSelectionRange(pos, pos);
  // IE8 and below
  // } else if (ctrl.createTextRange) {
  //   var range = ctrl.createTextRange();
  //   range.collapse(true);
  //   range.moveEnd('character', pos);
  //   range.moveStart('character', pos);
  //   range.select();
  // }
}


if (inputs.length) {
  [...inputs].forEach((input) => {
    const container = new InputContainer(input);
    container.init();
  });
}


class Maskifier {
  constructor(options) {
    this.inputs = options.inputs;
    this.masks = options.masks;
  }

  init() {
    [...this.inputs].forEach((input) => {
      if (input.getAttribute('data-mask')) {
        const maskifiedInput = maskInput({
          inputElement: input,
          mask: this.masks[input.getAttribute('data-mask')]
        });
        if (input.getAttribute('data-mask') === 'phone') {
          const events = ['mouseup', 'touchend'];
          events.forEach((item) => {
            input.addEventListener(item, (event) => {
              if (!input.value.length) {
                input.value += '+7 (___) ___ - __ - __';
              }
              const inputEvent = new Event('input', {
                'bubbles': true,
                'cancelable': true
              });
              setTimeout(() => {
                input.dispatchEvent(inputEvent);
              }, 5);
              setTimeout(() => {
                const numbers = input.value.match(/\d/g);
                console.log(numbers)
                const lastNumber = numbers ? numbers.reverse()[0] : 0;
                const pos = lastNumber ? input.value.lastIndexOf(lastNumber) + 1 : 0;
                if (lastNumber) {
                  setCaretPosition(input, pos);
                }
              }, 5);
            });
          })
          input.addEventListener('blur', () => {
            const numbers = input.value.match(/\d/g);
            if (numbers && numbers.length === 1) {
              input.value = null;
              input.closest('.input-container_has_value').classList.remove('input-container_has_value');
            }
          })
        }
      }
    });
  }
}

class Validator {
  constructor(options) {
    this.form = options.form;
    this.inputs = this.form.querySelectorAll('input');
    this.patterns = options.patterns;
  }

  setInvalid(input) {
    input.closest('.input-container').classList.add('invalid-input');
    this.form.classList.add('invalid');
  }

  setValid(input) {
    input.closest('.input-container').classList.remove('invalid-input');
    this.form.classList.remove('invalid');
  }

  checkValidity(input) {
    const regex = this.patterns[input.getAttribute('data-type')];
    if (!regex.test(input.value)) {
      input.invalid = true;
      this.setInvalid(input);
      input.tooltip.show();
      this.timeout = setTimeout(() => {
        this.setValid(input);
        Validator.hideTooltip(input);
      }, 1500);
    } else {
      input.invalid = false;
      return true;
    }
    return false;
  }

  validateAll() {
    let valid = false;
    [...this.inputs].forEach((input) => {
      if (input.isRequired || input.invalid) {
        valid = this.checkValidity(input);
      }
    });
    return new Promise((resolve, reject) => {
      if (!valid) {
        return reject(valid);
      }
      return resolve(valid);
    });
  }

  static hideTooltip(input) {
    if (input.tooltip._tooltipNode) {
      input.tooltip._tooltipNode.classList.add('fadeOut');
      setTimeout(() => {
        input.tooltip.hide();
        input.tooltip._tooltipNode.classList.remove('fadeOut');
      }, 300);
    }
  }

  static createTooltip(input) {
    input.tooltip = new Tooltip(input, {
      title: `<span class="tooltip-error">${input.getAttribute('data-invalid-message')}</span>`,
      html: true,
      trigger: 'manual',
      placement: 'bottom',
    });
  }

  init() {
    [...this.inputs].forEach((input) => {
      if (input.getAttribute('data-required')) {
        input.isRequired = true;
      }
      Validator.createTooltip(input);
      input.addEventListener('blur', () => {
        if (input.value.length) {
          this.checkValidity(input);
        } else {
          input.invalid = false;
        }
      });
      input.addEventListener('focus', () => {
        Validator.hideTooltip(input);
        input.closest('.input-container').classList.remove('valid');
      });
    });
  }
}

class Form {
  static createForm(options) {
    const form = document.querySelector(`.${options.baseClass}`);

    return form ? new Form(options) : null;
  }
  constructor(options) {
    this.form = document.querySelector(`.${options.baseClass}`);
    this.classes = {
      form: options.baseClass,
      input: `${options.baseClass}__input`,
      InputContainer: `${options.baseClass}__input-wrapper`,
    };
    this.validator = new Validator({
      form: this.form,
      patterns: {
        name: /^[a-zA-Z]+|[а-яА-Я]+$/,
        phone: /^\+7\s\(\d{3,}\)\s\d{3,}\s-\s\d{2,}\s-\s\d{2,}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      },
    });
    this.maskifier = new Maskifier({
      inputs: this.form.querySelectorAll(`.${this.classes.input}`),
      masks: {
        phone: ['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', '-', ' ', /\d/, /\d/, ' ', '-', ' ', /\d/, /\d/],
        date: [/([0 - 2]\d | 3[01])/, '.', /(0\d | 1[012])/, '.', /(\d{ 4 })/],
      },
    });
  }

  request() {
    const data = serialize(this.form);
    const url = this.form.getAttribute('action');
    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      })
      .then(() => {
        this.animateButton();
      })
      .then(() => {
        this.form.reset();
      });
  }

  animateButton() {
    const button = this.form.querySelector('.form__button');
    const icon = button.querySelector('.button__icon');
    const text = button.querySelector('.button__text');
    const progressbar = this.form.querySelector('.progressbar');
    const progressbarOuter = progressbar.querySelector('.progressbar__line_outer');
    const animation = new TimelineLite();
    animation
      .to(button, 0.3, {
        opacity: 0,
        onComplete() {
          text.textContent = 'Отправлено';
        },
      })
      .set(button, {
        display: 'none',
      })
      .set(progressbar, {
        display: 'block',
      })
      .fromTo(progressbar, 0.3, {
        opacity: 0.1,
      }, {
        opacity: 1,
      })
      .set(icon, {
        display: 'flex',
      })
      .to(progressbarOuter, 0.6, {
        width: '100%',
      })
      .to(progressbar, 0.3, {
        delay: 0.2,
        opacity: 0,
        onComplete() {
          TweenLite.set(progressbarOuter, {
            width: '0',
          });
          TweenLite.set(progressbar, {
            clearProps: 'display',
          });
        },
      })
      .to(button, 0.3, {
        onStart() {
          TweenLite.set(button, {
            clearProps: 'display',
          });
        },
        opacity: 1,
      })
      .to(button, 0.3, {
        onStart() {
          TweenLite.set(button, {
            clearProps: 'display',
          });
        },
        opacity: 1,
      })
      .to([icon, text], 0.3, {
        delay: 1,
        opacity: 0,
        onComplete() {
          text.textContent = 'Отправить';
        },
      })
      .set(icon, {
        clearProps: 'all',
      })
      .to(text, 0.3, {
        opacity: 1,
      });
  }

  init() {
    this.maskifier.init();
    this.validator.init();
    document.querySelector(`.${this.classes.form}`)
      .addEventListener('submit', (event) => {
        event.preventDefault();
        if (!this.validating) {
          this.validating = true;
          this.validator.validateAll()
            .then(() => {
              this.request();
            });
          setTimeout(() => {
            this.validating = false;
          }, 1500);
        }
      });
  }
}

const mainForm = Form.createForm({
  baseClass: 'form',
});

if (mainForm) {
  mainForm.init();
}

if (document.querySelector('[data-component="news"]')) {
  const mask = new Maskifier({
    inputs: document.querySelectorAll(`.datepicker-modal__input`),
    masks: {
      phone: ['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', '-', ' ', /\d/, /\d/, ' ', '-', ' ', /\d/, /\d/],
      date: [/[0-3]/, /[0-9]/, '.', /[0-1]/, /[0-9]/, '.', /[1-2]/, /\d/, /\d/, /\d/],
    },
  });

  mask.init();
}
