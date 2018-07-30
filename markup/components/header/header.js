import TweenLite from 'gsap/TweenLite';
import 'gsap/CSSPlugin';
import utils from '../../static/js/utils/utils';


class SearchBar {
  constructor(options) {
    this.input = options.input;
    this.toggleButton = options.toggleButton;
    this.timeout = options.timeout || 0;
  }

  onFocus() {
    this.toggleButton.classList.add('active');
  }

  onFocusOut() {
    this.toggleButton.classList.remove('active');
  }

  bindEvents() {
    this.input.addEventListener('focus', () => {
      this.onFocus();
    });
    this.input.addEventListener('blur', () => {
      this.onFocusOut();
    });
    this.toggleButton.addEventListener('click', () => {
      setTimeout(() => {
        this.input.focus();
      }, this.timeout);
    });
  }
}

class PageHeader {
  constructor(options) {
    this.classes = PageHeader.generateClasses(options.baseClass, options.extraClasses);
    this.delay = options.delay;
    this.shown = false;
    this.animating = false;
    this.speed = 0.3;
    this.searchBar = new SearchBar({
      input: document.querySelector(`.${this.classes.searchBar}`),
      toggleButton: document.querySelector(`.${this.classes.searchButton}`),
      timeout: 300,
    });
  }

  static generateClasses(baseClass, extraClasses = {}) {
    const defaultClasses = {
      baseClass,
      searchBar: `${baseClass}__searchbar`,
      invisibleOnShow: `${baseClass}__invisible-on-show`,
      visibleOnShow: `${baseClass}__visible-on-show`,
      hiddenOnShow: `${baseClass}__hidden-on-show`,
      shownOnShow: `${baseClass}__shown-on-show`,
      toggleButton: 'js-toggle-menu',
      searchButton: 'js-toggle-search',
    };

    return Object.assign(defaultClasses, extraClasses);
  }

  fadeOut(item) {
    TweenLite.to(item, this.speed, {
      'pointer-events': 'none',
      opacity: 0,
    });
  }

  fadeIn(item) {
    TweenLite.to(item, this.speed, {
      onComplete() {
        TweenLite.set(item, {
          clearProps: 'pointer-events',
        });
      },
      opacity: 1,
    });
  }

  show(item) {
    TweenLite.to(item, this.speed, {
      onStart() {
        TweenLite.set(item, {
          clearProps: 'display',
        });
      },
      opacity: 1,
      position: 'unset',
    });
  }

  hide(item) {
    TweenLite.to(item, this.speed, {
      opacity: 0,
      onComplete() {
        TweenLite.set(item, {
          display: 'none',
        });
      },
      position: 'absolute',
      right: 15,
    });
  }

  debounce() {
    if (!utils.isMobile) {
      if (this.shown) {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '17px';
      } else {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = 0;
      }
    } else {
      const scrollArea = document.querySelector('.page-header__collapsed');
      scrollArea.addEventListener('touchstart', (event) => {
        scrollArea.previousClientY = event.touches[0].clientY;
      });
      scrollArea.addEventListener('touchmove', (event) => {
        const currentScrollTop = scrollArea.scrollTop;
        const maxScroll = scrollArea.scrollHeight - scrollArea.offsetHeight;
        const currentClientY = event.touches[0].clientY;
        const deltaY = scrollArea.previousClientY - currentClientY;
        if (
          (currentScrollTop === maxScroll && deltaY > 0) ||
          (currentScrollTop === 0 && deltaY < 0)
        ) {
          event.preventDefault();
        }
        scrollArea.previousClientY = currentClientY;
      });
    }
  }

  animate() {
    if (this.animating) return;
    this.animating = true;
    document.querySelector(`.${this.classes.baseClass}`).classList.toggle(`${this.classes.baseClass}_is_shown`);
    const elementsToFadeOut = this.shown ? `.${this.classes.visibleOnShow}` : `.${this.classes.invisibleOnShow}`;
    const elementsToFadeIn = this.shown ? `.${this.classes.invisibleOnShow}` : `.${this.classes.visibleOnShow}`;
    const elementsToHide = this.shown ? `.${this.classes.shownOnShow}` : `.${this.classes.hiddenOnShow}`;
    const elementsToShow = this.shown ? `.${this.classes.hiddenOnShow}` : `.${this.classes.shownOnShow}`;
    this.fadeOut(document.querySelectorAll(elementsToFadeOut));
    this.hide(document.querySelectorAll(elementsToHide));

    this.fadeIn(document.querySelectorAll(elementsToFadeIn));
    this.show(document.querySelectorAll(elementsToShow));
    this.shown = !this.shown;
    this.debounce();
    this.animating = false;
  }

  bindEvents() {
    document.querySelector(`.${this.classes.toggleButton}`)
      .addEventListener('click', (event) => {
        event.currentTarget.classList.toggle('active');
        this.animate();
      });
    document.querySelector(`.${this.classes.searchButton}`)
      .addEventListener('click', () => {
        const toggleButton = document.querySelector(`.${this.classes.toggleButton}`);
        if (!this.shown) {
          toggleButton.classList.add('active');
          this.animate();
        }
      });
    this.searchBar.bindEvents();
  }
}

const header = new PageHeader({
  baseClass: 'page-header',
});

header.bindEvents();


document.addEventListener('DOMContentLoaded', () => {
  if (utils.isMobile) {
    const mobileSearchBar = new SearchBar({
      input: document.querySelector('.header-collapsed-searchbar__input'),
      toggleButton: document.querySelector('.header-collapsed-searchbar__icon'),
      timeout: 300,
    });
    mobileSearchBar.bindEvents();
  }
});
