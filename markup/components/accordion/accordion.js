import TweenLite from 'gsap/TweenLite';

export default class Accordion {
  static get accordionClasses() {
    return [
      {
        class: 'accordion-pane',
        mobileOnly: false,
      },
      {
        class: 'faq-categories',
        mobileOnly: true,
      },
      {
        class: 'news-categories',
        mobileOnly: true,
      },
    ];
  }

  static init() {
    Accordion.accordionClasses.forEach((block) => {
      const accordions = [...document.querySelectorAll(`.${block.class}${block.mobileOnly ? '_mobile' : ''}`)];

      accordions.map(accordion => new Accordion(accordion, block.class));
    });
  }

  constructor(element, baseClass) {
    this.element = element;
    this.header = element.querySelector(`.${baseClass}__header`);
    this.body = element.querySelector(`.${baseClass}__body`);
    this.baseClass = baseClass;

    if (this.isOpen) {
      TweenLite.set(this.body, { height: 'auto' });
    } else {
      TweenLite.set(this.body, { height: 0 });
    }

    this.header.addEventListener('click', () => {
      if (this.isOpen) {
        TweenLite.to(this.body, 0.3, {
          height: 0,
          onComplete: () => {
            this.element.classList.remove(`${baseClass}_open`);
          },
        });
      } else {
        TweenLite.set(this.body, { height: 'auto' });
        this.element.classList.add(`${baseClass}_open`);
        TweenLite.from(this.body, 0.3, { height: 0 });
      }
    });
  }

  get isOpen() {
    return this.element.classList.contains(`${this.baseClass}_open`);
  }
}
