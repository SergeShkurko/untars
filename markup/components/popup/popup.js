import TweenLite from 'gsap/TweenLite';
import 'gsap/CSSPlugin';
// import utils from '../../static/js/utils/utils';

const showPopup = (id) => {
  const popup = document.querySelector(`[data-modal='${id}']`);
  // if (!utils.isMobile) {
  //   popup.style.paddingRight = '17px';
  // }
  TweenLite.to(popup, 0.3, {
    onStart() {
      TweenLite.set(popup, {
        display: 'flex',
      });
      TweenLite.set(document.body, {
        overflow: 'hidden',
      });
    },
    opacity: 1,
  });
};

const hidePopup = (popup) => {
  // if (!utils.isMobile) {
  //   popup.style.paddingRight = 0;
  // }
  TweenLite.to(popup, 0.3, {
    opacity: 0,
    onComplete() {
      TweenLite.set(popup, {
        clearProps: 'display',
      });
      TweenLite.set(document.body, {
        clearProps: 'overflow',
      });
    },
  });
};


[...document.querySelectorAll('[data-modal-target]')].forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const target = button.getAttribute('data-modal-target');
    showPopup(target);
  });
});

[...document.querySelectorAll('.popup__close-button')].forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const parent = button.closest('.popup');
    hidePopup(parent);
  });
});
