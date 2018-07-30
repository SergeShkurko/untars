import TweenLite from 'gsap/TweenLite';
import Tabs from '../tabs/tabs';

export default class Information {
  static init() {
    const information = document.querySelector('.information');

    return information ? new Information(information) : null;
  }

  constructor(element) {
    this.element = element;
    this.tabs = new Tabs('information', this.element);
    this.tabs.init();

    this.createButtonWrapper();
    this.left = this.createButton('left');
    this.right = this.createButton('right');
    this.upButton = document.querySelector('.up-button');

    this.tableWrappers = Array.from(this.element.querySelectorAll('.info-table'));

    this.tableWrappers.forEach((wrapper) => {
      wrapper.addEventListener('scroll', () => {
        if (!this.isScrolling) {
          this.toggleButtons();
        }
      });
    });

    this.element.addEventListener('show', () => {
      this.toggleButtons();
    });

    this.right.addEventListener('click', this.scrollRight.bind(this));
    this.left.addEventListener('click', this.scrollLeft.bind(this));
    window.addEventListener('scroll', this.toggleButtonWrapper.bind(this));

    this.isScrolling = false;
    this.toggleButtons();
  }

  createButtonWrapper() {
    const pageWrapper = document.querySelector('.page-wrapper');
    this.buttonWrapper = document.createElement('div');
    this.buttonWrapper.classList.add('info-buttons');
    pageWrapper.appendChild(this.buttonWrapper);
  }

  /**
   * Creates scroll-button
   *
   * @param {string} type
   * @returns {Element}
   * @memberof Information
   */
  createButton(type) {
    const button = document.createElement('div');
    button.classList.add('info-button', `info-button_${type}`);
    button.innerHTML = `
      <div class="info-button__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12">
          <path d="M.2519 6.594l5.2801 5.1597c.3359.3284.8805.3284 1.2162 0a.8269.8269 0 0 0 0-1.1883L2.076 6l4.672-4.5653a.827.827 0 0 0 0-1.1884c-.3358-.3283-.8803-.3283-1.2162 0L.2517 5.4059A.8278.8278 0 0 0 0 5.9999c0 .215.084.4301.2519.5942z"></path>
        </svg>
      </div>
    `;
    this.buttonWrapper.appendChild(button);
    return button;
  }

  /**
   * Scrolls to nearest right cell
   *
   * @memberof Information
   */
  scrollRight() {
    const table = this.activeTableWrapper;
    const currentScrollLeft = table.scrollLeft;
    const cells = Array.from(table.querySelectorAll('th'));
    const closestCell = cells.find(cell => cell.offsetLeft > currentScrollLeft);

    this.isScrolling = true;
    TweenLite.to(table, 0.3, {
      scrollLeft: closestCell.offsetLeft,
      onComplete: this.toggleButtons.bind(this),
      overwrite: 'none',
    });
  }

  /**
   * Scrolls to nearest left cell
   *
   * @memberof Information
   */
  scrollLeft() {
    const table = this.activeTableWrapper;
    const currentScrollLeft = table.scrollLeft;
    const cells = Array.from(table.querySelectorAll('th'));
    const closestCell = cells.reverse().find(cell => cell.offsetLeft < currentScrollLeft);

    this.isScrolling = true;
    TweenLite.to(table, 0.3, {
      scrollLeft: closestCell.offsetLeft,
      onComplete: this.toggleButtons.bind(this),
      overwrite: 'none',
    });
  }

  /**
   * Changes visibility of scroll-buttons
   *
   * @memberof Information
   */
  toggleButtons() {
    const tableWrapper = this.activeTableWrapper;
    const maxScroll = this.activeTable.clientWidth - tableWrapper.clientWidth;

    this.isScrolling = false;

    Promise.all([
      this.toggleButton(tableWrapper.scrollLeft === maxScroll, 'right'),
      this.toggleButton(tableWrapper.scrollLeft === 0, 'left'),
    ]).then((results) => {
      if (results.some(result => result)) {
        this.moveUpButton(); // move up-button if one of scroll-buttons changed visibility
      }
    });
  }

  /**
   * Toggles visibility of scroll-button
   *
   * @param {boolean} condition
   * @param {string} buttonType
   * @returns {Promise}
   * @memberof Information
   */
  toggleButton(condition, buttonType) {
    const button = this[buttonType];
    return new Promise((resolve) => {
      if (condition) {
        TweenLite.to(button, 0.3, {
          opacity: 0,
          x: 20,
          onStart() {
            button.classList.add('info-button_toggling');
          },
          onComplete() {
            button.classList.add('info-button_hidden');
            button.classList.remove('info-button_toggling');
            console.log('removed class');
            resolve(true);
          },
        });
      } else if (button.classList.contains('info-button_hidden')) {
        TweenLite.fromTo(button, 0.3, { opacity: 0, x: 20 }, {
          opacity: 1,
          x: 0,
          onStart() {
            button.classList.add('info-button_toggling');
            button.classList.remove('info-button_hidden');
            resolve(true);
          },
          onComplete() {
            button.classList.remove('info-button_toggling');
          },
        });
      } else {
        resolve(false);
      }
    });
  }

  /**
   * Changes horizontal position of up-button on mobile
   *
   * @memberof Information
   */
  moveUpButton() {
    if (window.innerWidth < 768) {
      TweenLite.to(this.upButton, 0.3, {
        x: -(this.buttonWrapper.clientWidth + 8),
      });
    } else {
      TweenLite.set(this.upButton, { x: 0 });
    }
  }

  /**
   * Toggles visibility of all scroll-buttons container
   * if scrolled off table
   * @returns {boolean}
   * @memberof Information
   */
  toggleButtonWrapper() {
    const table = this.activeTableWrapper;
    if (!table) {
      return false;
    }
    const tableOffset = (table.offsetTop + table.clientHeight) - 300;
    if (tableOffset <= window.scrollY) {
      if (!this.areButtonsHidden) {
        TweenLite.to(this.buttonWrapper, 0.3, {
          x: 60,
          opacity: 0,
          onComplete: () => {
            this.buttonWrapper.classList.add('info-buttons_hidden');
          },
        });
        TweenLite.to(this.upButton, 0.3, { x: 0 });
      }
    } else if (this.areButtonsHidden) {
      TweenLite.fromTo(this.buttonWrapper, 0.3, { x: 60, opacity: 0 }, {
        x: 0,
        opacity: 1,
        onStart: () => {
          this.buttonWrapper.classList.remove('info-buttons_hidden');
          this.moveUpButton();
        },
      });
    }
    return true;
  }

  get activeTableWrapper() {
    return this.element.querySelector('.information__tab_is_active .info-table');
  }

  get activeTable() {
    return this.element.querySelector('.information__tab_is_active table');
  }

  get areButtonsHidden() {
    return this.buttonWrapper.classList.contains('info-buttons_hidden');
  }
}
