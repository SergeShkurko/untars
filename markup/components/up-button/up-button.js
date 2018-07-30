import TweenLite from 'gsap/TweenLite';
import 'gsap/ScrollToPlugin';

const button = document.querySelector('.up-button');

function scrollY() {
  return window.scrollY || window.pageYOffset
}

button.addEventListener('click', () => {
  if (scrollY() > 0) {
    TweenLite.to(window, 0.8, { scrollTo: 0, autoKill: false });
  }
});

let buttonShown = false;

const toggleButton = () => {
  if (scrollY() > 799 && !buttonShown) {
    buttonShown = true;
    TweenLite.fromTo(button, 0.3, {
      display: 'flex',
      opacity: 0,
    }, {
      opacity: 1,
    });
  } else if (buttonShown && scrollY() < 800) {
    buttonShown = false;
    TweenLite.to(button, 0.3, {
      opacity: 0,
      onComplete() {
        TweenLite.set(button, {
          clearProps: 'display',
        });
      },
    });
  }
};

window.addEventListener('scroll', toggleButton);
window.addEventListener('load', toggleButton);
