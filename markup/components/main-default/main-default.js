import AdaptiveSlider from '../adaptive-slider/adaptive-slider';

export default class MainScreenSlider {
  static init() {
    const faq = document.querySelector('.main-screen__footer');
    return faq ? new MainScreenSlider() : null;
  }

  constructor() {
    this.config = {
      elementSelector: '.main-screen__footer',
      config: {
        1280: {
          init: false,
          speed: 600,
          freeModeMomentum: false,
          slidesPerView: 2,
          slidesPerGroup: 2,
          grabCursor: true,
          pagination: {
            el: '.main-slider__bullets',
            type: 'bullets',
            bulletClass: 'main-slider__bullet',
            bulletActiveClass: 'main-slider__bullet_is_active',
            clickable: true,
          },
        },
        // 980: {
        //   init: false,
        //   speed: 600,
        //   freeModeMomentum: false,
        //   slidesPerView: 2,
        //   slidesPerGroup: 2,
        //   grabCursor: true,
        //   pagination: {
        //     el: '.main-slider__bullets',
        //     type: 'bullets',
        //     bulletClass: 'main-slider__bullet',
        //     bulletActiveClass: 'main-slider__bullet_is_active',
        //     clickable: true,
        //   },
        // },
        768: {
          init: false,
          speed: 600,
          freeModeMomentum: false,
          slidesPerView: 1,
          longSwipes: false,
          fadeEffect: {
            crossFade: true,
          },
          grabCursor: true,
          effect: 'fade',
          pagination: {
            el: '.main-slider__bullets',
            type: 'bullets',
            bulletClass: 'main-slider__bullet',
            bulletActiveClass: 'main-slider__bullet_is_active',
            clickable: true,
          },
        },
      },
    };
    this.slider = new AdaptiveSlider(this.config);
    this.slider.init();
  }
}

// const initSlider = () => {
//   mainScreenFeatures = new Swiper('.main-screen__footer', {
//     init: false,
//     speed: 600,
//     freeModeMomentum: false,
//     slidesPerView: 'auto',
//     longSwipes: false,
//     fadeEffect: {
//       crossFade: false,
//     },
//     effect: 'fade',
//     pagination: {
//       el: '.main-slider__bullets',
//       type: 'bullets',
//       bulletClass: 'main-slider__bullet',
//       bulletActiveClass: 'main-slider__bullet_is_active',
//       clickable: true,
//     },
//     breakpoints: {
//       768: {
//         slidesPerView: 1,
//       },
//       threshold: 30,
//     },
//   });
//   mainScreenFeatures.init();
// };
