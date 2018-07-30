export default class Tabs {
  constructor(baseClass, container) {
    this.container = container;

    this.classes = {
      heading: {
        active: `${baseClass}__link_is_active`,
        item: `${baseClass}__link`,
      },
      content: {
        active: `${baseClass}__tab_is_active`,
        show: `${baseClass}__tab_is_show`,
        item: `${baseClass}__tab`,
      },
    };

    this.store = [];

    this.links = this.container.querySelectorAll(`.${this.classes.heading.item}`);
  }

  init() {
    this.handlers();
  }

  handlers() {
    this.tabs = [...this.links].reduce((acc, element) => {
      const tab = this.container.querySelector(`[data-tab="${element.getAttribute('data-target')}"]`);

      if (tab) {
        acc.push(tab);
      }

      element.addEventListener('click', (event) => {
        event.preventDefault();
        this.toggleTab(element, tab);
      });

      return acc;
    }, []);
  }

  showTab(link, target) {
    [...this.links].forEach((element) => {
      element.classList.remove(this.classes.heading.active);
    });

    target.classList.add(this.classes.content.active);

    setTimeout(() => {
      target.classList.add(this.classes.content.show);
    }, 0);

    link.classList.add(this.classes.heading.active);

    const event = new CustomEvent('show', {
      detail: {
        element: target,
        tab: target.getAttribute('data-tab'),
      },
    });

    // Crutch for triggering wow.js animation
    window.scrollTo(window.scrollX || window.pageXOffset, window.scrollY || window.pageYOffset + 1);

    this.triggerEvent(event);
  }

  hideTab(link, target) {
    [...this.links].forEach((element) => {
      element.classList.remove(this.classes.heading.active);
    });

    target.classList.remove(this.classes.content.active);
    target.classList.remove(this.classes.content.show);
    link.classList.add(this.classes.heading.active);

    const event = new CustomEvent('hide', {
      detail: {
        element: target,
        tab: target.getAttribute('data-tab'),
      },
    });

    this.triggerEvent(event);
  }

  toggleTab(link, target) {
    if (!target) {
      return;
    }

    this.tabs.forEach((tab) => {
      if (tab.getAttribute('data-tab') === target.getAttribute('data-tab') && !tab.classList.contains(this.classes.content.active)) {
        this.showTab(link, tab);
      } else if (tab.getAttribute('data-tab') !== target.getAttribute('data-tab') && tab.classList.contains(this.classes.content.active)) {
        this.hideTab(link, tab);
      }
    });
  }

  subscribe(event, callback) {
    this.store.push({
      event,
      callback,
    });
  }

  dispatch(event, element) {
    [...this.store].forEach((subscriber) => {
      if (subscriber.event === event) {
        subscriber.callback(element);
      }
    });
  }

  triggerEvent(event) {
    this.container.dispatchEvent(event);
  }
}
