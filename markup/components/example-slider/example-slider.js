import Swiper from 'swiper';
import Tooltip from 'tooltip.js';

const exampleSlider = new Swiper('.example-slider', {
  init: false,
  slidesPerView: 'auto',
  speed: 500,
  grabCursor: true,
  spaceBetween: 32,
  slideToClickedSlide: true,
  breakpoints: {
    768: {
      centeredSlides: true
    }
  },
  on: {
    progress: function (progress) {
      if (!document.getElementById('progress')) {
        let progressLine = document.createElement('div');
        progressLine.id = 'progress';
        document.querySelector('.example-slider__controls-wrapper').appendChild(progressLine);
      }

      document.getElementById('progress').style.width = `${progress * 100}%`;
    },
    slideChange: function () {
      if (this.previousIndex < this.activeIndex) {
        Array.prototype.forEach.call(document.querySelectorAll('.example-slider__bullet'), (bullet,index) => {

          if (index < this.activeIndex) {
            document.querySelectorAll('.example-slider__bullet')[index].classList.add('example-slider__bullet_active');
          }

        });

      } else {
        Array.prototype.forEach.call(document.querySelectorAll('.example-slider__bullet'), (bullet,index) => {

          if (index > this.activeIndex) {
            document.querySelectorAll('.example-slider__bullet')[index].classList.remove('example-slider__bullet_active');
          }

        });
      }

    }
  },
  pagination: {
    el: '.example-slider__bullets',
    type: 'bullets',
    bulletClass: 'example-slider__bullet-wrapper',
    bulletActiveClass: 'example-slider__bullet-wrapper_is_active',
    clickable: true,
    renderBullet: function (index, className) {
      return '<div class="' + className + '"><span class="example-slider__bullet" data-tooltip title="Факт ' + (index + 1) +'"></span></div>';
    }
  }
});

if (document.querySelector('.example-slider')) {
  exampleSlider.init();
  const tooltipElements = document.querySelectorAll('[data-tooltip]');

  [...tooltipElements].forEach((element) => {
    const tooltip = new Tooltip(element, {
      title: element.getAttribute('data-title') || element.getAttribute('title'),
      trigger: 'hover',
    });
    // debugger
    tooltip.hide();
  });

  document.addEventListener('touchstart', () => {
    const tooltip = document.querySelector('.tooltip[aria-hidden="false"]');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  });
}
