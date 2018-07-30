import FAQBlock from './faq-block';

export default class FAQComponent {
  static init() {
    const faq = document.querySelector('[data-component="faq"]');

    return faq ? new FAQComponent(faq) : null;
  }

  constructor(element) {
    this.element = element;
    this.list = element.querySelector('.faq-list');
    this.blocks = Array.from(this.element.querySelectorAll('.faq-block'));
    this.links = Array.from(this.element.querySelectorAll('.category-link'));
    this.search = document.querySelector('.content-search__input');

    const category = window.location.search.match(/section=([^&]+)(?:&.*)?$/);
    const search = window.location.search.match(/query=([^&]+)(?:&.*)?$/);
    this.searchTimeout = null;
    this.category = category ? category[1] : null;
    this.search.value = search ? search[1] : '';

    window.history.replaceState({ category: this.category, search: this.search.value }, '', window.location.href);

    window.onpopstate = (event) => {
      const { state } = event;
      this.category = state.category;
      this.search.value = state.search;
      this.clearList();
      this.requestFAQ(this.search.value);
    };

    this.links.map(link => link.addEventListener('click', this.selectCategory.bind(this)));
    this.search.addEventListener('keypress', () => {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.clearList();
        this.setHistory();
        this.requestFAQ(this.search.value);
      }, 300);
    });

    this.initFAQBlocks();
  }

  selectCategory(event) {
    event.preventDefault();

    const target = event.currentTarget;
    const href = target.getAttribute('href');
    const selectorHead = document.querySelector('.faq-categories__header');

    const current = Array.from(document.querySelectorAll('.category-link_active'));
    const newCurrentLinks = Array.from(document.querySelectorAll(`[href="${href}"]`));

    current.map(link => link.classList.remove('category-link_active'));
    newCurrentLinks.map(link => link.classList.add('category-link_active'));

    if (selectorHead) {
      selectorHead.firstElementChild.remove();
      selectorHead.appendChild(target.cloneNode(true));
      selectorHead.click();
    }

    this.category = href.replace(/#/g, '');
    this.search.value = '';
    this.setHistory();

    this.clearList();
    this.requestFAQ();
  }

  initFAQBlocks() {
    this.blocks.map(block => new FAQBlock(block));
  }

  requestFAQ(query) {
    const headers = new Headers({
      'X-Requested-With': 'XMLHttpRequest',
    });
    return fetch(`/api/faq/?${this.getUrlQuery(query)}`, { headers })
      .then(response => response.json())
      .then((data) => {
        this.data = data;
      })
      .then(this.setNewBlocks.bind(this));
  }

  clearList() {
    this.blocks.map(block => block.remove());
    this.blocks.length = 0;
  }

  setNewBlocks() {
    this.blocks = this.data.map((faq) => {
      console.log(faq)
      const newBlock = document.createElement('div');

      newBlock.classList.add('faq-block');
      newBlock.innerHTML = FAQBlock.getTemplate(faq);
      if (faq.content) {
        newBlock.classList.add('faq-block_cursor-pointer');
      }
      this.list.appendChild(newBlock);

      return newBlock;
    });

    this.initFAQBlocks();
  }

  getUrlQuery() {
    const query = this.search.value;
    return `${this.category ? `section=${this.category}` : ''}${this.category && query ? '&' : ''}${query ? `query=${query}` : ''}`;
  }

  setHistory() {
    window.history.pushState(
      { category: this.category, search: this.search.value },
      '',
      `${window.location.href.replace(/\?.+$/, '')}?${this.getUrlQuery()}`,
    );
  }
}
