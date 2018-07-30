import Swiper from 'swiper';

const mainSlider = new Swiper('.main-slider', {
  init: false,
  speed: 600,
  spaceBetween: 0,
  navigation: {
    nextEl: '.main-slider__control_next',
    prevEl: '.main-slider__control_prev',
  },
  pagination: {
    el: '.main-slider__bullets',
    type: 'bullets',
    bulletClass: 'main-slider__bullet',
    bulletActiveClass: 'main-slider__bullet_is_active',
    clickable: true,
  },
  fadeEffect: {
    crossFade: true,
  },
  effect: 'fade',
  loop: true,
  threshold: 30,
  parallax: true,
});
if (document.querySelector('.main-slider')) {
  mainSlider.init();
}
