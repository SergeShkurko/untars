export default class SearchBar {
  static init() {
    const searchWrapper = document.querySelector('.content-search');
    return searchWrapper ? new SearchBar() : null;
  }

  constructor() {
    this.wrapper = document.querySelector('.content-search');
    this.input = this.wrapper.querySelector('.content-search__input');
    this.clearButton = this.wrapper.querySelector('.content-search__clear-button');
    // debugger
    this.bindEvents();
  }

  showClearButton() {
    this.clearButton.style.display = 'block';
  }

  hideClearButton() {
    this.clearButton.style.display = 'none';
  }

  clearInput() {
    this.input.value = '';
    this.input.focus();
  }

  bindEvents() {
    this.clearButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.clearInput();
      this.hideClearButton();
    });
    const inputEvents = ['input', 'paste', 'cut'];
    inputEvents.forEach((eventName) => {
      this.input.addEventListener(eventName, () => {
        if (this.input.value.length) {
          this.showClearButton();
        } else {
          this.hideClearButton();
        }
      });
    });
  }
}
