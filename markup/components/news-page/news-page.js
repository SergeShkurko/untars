import NewsBlock from './news-block';

export default class NewsComponent {
  constructor(element) {
    this.element = element;
    this.list = element.querySelector('.news-list');
    this.blocks = Array.from(this.element.querySelectorAll('.news-block'));
    this.links = Array.from(this.element.querySelectorAll('.category-link'));
    this.times = Array.from(this.element.querySelectorAll('.time-link'));

    const category = window.location.search.match(/section=([^&]+)(?:&.*)?$/);
    const startTime = window.location.search.match(/startTime=([^&]+)(?:&.*)?$/);
    const endTime = window.location.search.match(/startTime=([^&]+)(?:&.*)?$/);
    const typeTime = window.location.search.match(/typeTime=([^&]+)(?:&.*)?$/);

    this.searchTimeout = null;
    this.category = category ? category[1] : null;
    this.startTime = startTime ? startTime[1] : null;
    this.endTime = endTime ? endTime[1] : null;
    this.typeTime = typeTime ? typeTime[1] : null;

    window.history.replaceState({ section: this.category, typeTime: this.typeTime, startTime: this.startTime, endTime: this.endTime }, '', window.location.href);

    window.onpopstate = (event) => {
      const {state} = event;

      if (state) {
        this.category = state.section;
        this.typeTime = state.typeTime;
        this.startTime = state.startTime;
        this.endTime = state.endTime;
      }

      this.clearList();
      this.requestNews();
    };

    this.selectTime = this.selectTime.bind(this);

    this.links.map(link => link.addEventListener('click', this.selectCategory.bind(this)));
    this.times.map(time => time.addEventListener('click', this.selectTime));

    this.initNewsBlocks();
  }

  formatDate(date) {
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;

    let mm = date.getMonth() + 1;

    if (mm < 10) mm = '0' + mm;

    let yy = date.getFullYear();

    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
  }

  selectCategory(event) {
    event.preventDefault();

    const target = event.currentTarget;
    const href = target.getAttribute('href');
    const selectorHead = document.querySelector('.news-categories__header');

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

    this.setHistory();

    this.clearList();
    this.requestNews();
  }

  selectTime(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const typeTime = target.getAttribute('data-type');

    const current = Array.from(document.querySelectorAll('.time-link_active'));
    const datepickerButton = document.querySelector('.datepicker-button');
    const newCurrentLinks = Array.from(document.querySelectorAll(`[data-type="${typeTime}"]`));

    datepickerButton.classList.remove('datepicker-button_select');
    current.map(link => link.classList.remove('time-link_active'));
    newCurrentLinks.map(link => link.classList.add('time-link_active'));

    switch (typeTime) {
      case 'range': {
        this.startTime = target.querySelector('.datepicker-modal__date_begin input').value;
        this.endTime = target.querySelector('.datepicker-modal__date_end input').value;
        this.typeTime = 'range';
        datepickerButton.classList.add('datepicker-button_select');
      }
        break;
      case 'all-time': {
          this.startTime = null;
          this.endTime = null;
          this.typeTime = 'all-time';
        }
        break;
      case 'week':
        {
          const startWeek = new Date().getTime() - 7 * 1000 * 60 * 60 * 24;
          this.startTime = this.formatDate(new Date(startWeek));
          this.endTime = this.formatDate(new Date());
          this.typeTime = 'week';
        }
        break;
      case 'month':
        {
          const start = new Date().getTime() - 30 * 1000 * 60 * 60 * 24;
          this.startTime = this.formatDate(new Date(start));
          this.endTime = this.formatDate(new Date());
          this.typeTime = 'month';
        }
        break;
    }

    this.setHistory();
    this.clearList();
    this.requestNews();
  }

  initNewsBlocks() {
    this.blocks.map(block => new NewsBlock(block));
  }

  requestNews(query) {
    const headers = new Headers({'X-Requested-With': 'XMLHttpRequest'});
    let url;

    url = `/api/news/?${this.getUrlQuery(query)}`;

    if ( window.location.href.indexOf('localhost') !== -1 ) {
      url = `api/news.json`;
    }

    return fetch(url, {headers})
      .then(response => response.json())
      .then((data) => {
        this.data = data;
      })
      .then(this.setNewBlocks.bind(this));
  }

  clearList() {
    this.blocks.map(block => block.remove());
    this.blocks = Array();

    while (this.list.firstChild) {
      this.list.removeChild(this.list.firstChild);
    }
  }

  setNewBlocks() {
    this.blocks = this.data.elements.map((news) => {
      const newBlock = document.createElement('a');
      newBlock.classList.add('news-block');
      newBlock.setAttribute('href', news.url);
      newBlock.innerHTML = NewsBlock.getTemplate(news);
      this.list.appendChild(newBlock);

      return newBlock;
    });

    if (document.querySelector('.news-pagination')) {
      document.querySelector('.news-pagination').parentElement.removeChild(document.querySelector('.news-pagination'));
    }

    if (this.data.pagination != "") {
      const paginationBlock = document.createElement('div');
      paginationBlock.classList.add('news-pagination')
      paginationBlock.innerHTML = this.data.pagination;
      document.querySelector('.content__main').appendChild(paginationBlock);
    }

    this.initNewsBlocks();
  }

  getUrlQuery() {
    const query = '';
    return `${this.category ? `section=${this.category}` : ''}${this.category && this.startTime ? '&' : ''}${this.startTime ? `startTime=${this.startTime}` : ''}${(this.category || this.startTime) && this.endTime ? '&' : ''}${this.endTime ? `endTime=${this.endTime}` : ''}${(this.category || this.startTime || this.endTime) && this.typeTime ? '&' : ''}${this.typeTime ? `typeTime=${this.typeTime}` : ''}`;
  }

  setHistory() {
    window.history.pushState({
        section: this.category,
        startTime: this.startTime,
        endTime: this.endTime,
        typeTime: this.typeTime,
      }, '', `${window.location.href.replace(/\?.+$/, '')}?${this.getUrlQuery()}`,);
  }
}
