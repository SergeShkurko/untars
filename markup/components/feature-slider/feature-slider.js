import AdaptiveSlider from '../adaptive-slider/adaptive-slider';

export default class MainFeaturesSlider {
  static init() {
    const element = document.querySelector('.feature-slider');
    return element ? new MainFeaturesSlider() : null;
  }

  constructor() {
    this.config = {
      elementSelector: '.feature-slider',
      config: {
        768: {
          init: false,
          speed: 200,
          freeModeMomentum: false,
          slidesPerView: 1,
          longSwipes: false,
          fadeEffect: {
            crossFade: true,
          },
          effect: 'fade',
          pagination: {
            el: '.feature-slider__bullets',
            type: 'bullets',
            bulletClass: 'feature-slider__bullet',
            bulletActiveClass: 'feature-slider__bullet_is_active',
            clickable: true,
          },
        },
      },
    };

    this.slider = new AdaptiveSlider(this.config);
    this.slider.init();
  }
}
