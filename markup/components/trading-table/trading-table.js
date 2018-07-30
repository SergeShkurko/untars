import SimpleScrollbar from 'static/js/plugins/simpleScrollbar';
import Tooltips from 'components/tooltips/tooltips';
import BaseTable, {
  SortOrder,
  Placeholder
} from './baseTable';

export default class TradingTable extends BaseTable {
  constructor(view, options) {
    super(view, options); // inherit from the base class
    this.options = options;
    this.url = options.url;
    this.coursesUrl = options.coursesUrl

    this.swith = options.swith
    this.amount = options.amount
    this.currencies = options.currencies

    this.rows = [];
    this.setPlaceholder(Placeholder.loading);
    this.getData();
    this.bindEvents();
    this.placeholder = [];
    this.calculateCellValue = this.calculateCellValue ? this.calculateCellValue.bind(this) : null;
  }

  /**
   * @param {string} symbol
   */
  getCourseBySymbol(symbol) {
    let course = 0
    this.courses.forEach((searchSymbol, _index) => {
      if (symbol.toLowerCase() === searchSymbol.symbol.toLowerCase()) course = parseFloat(searchSymbol.course)
    })
    return course
  }

  get amountInLots() {
    const amount = Number(this.amount.value);

    return this.swith.checked ? amount : amount / 100000
  }

  get amountInCurrency() {
    const amount = Number(this.amount.value);

    return this.swith.checked ? amount * 100000 : amount
  }

  initialRender(data) {
    if (!data || (data && data.length === 0) || data.error) {
      return this.setPlaceholder(Placeholder.empty);
    }
    this.setPlaceholder(Placeholder.loading);
    if (!this.data) this.data = data
    this.rows = data.map((rowData, index) => this.createTr(rowData, index, this.calculateCellValue));
    this.render();
  }

  /**
   * Insert the table rows into the DOM
   */
  render() {
    if (this.rows.length === 0) {
      this.setPlaceholder(Placeholder.empty);
    } else {
      /*
       * Render table body
       */
      const tableBody = this.tBody;
      tableBody.querySelector('div, tr').remove();
      const table = document.createElement('table');
      table.classList.add(`${this.classNames.baseClass}__content`);
      this.rows.forEach((row) => {
        table.appendChild(row.nTr);
      });
      tableBody.appendChild(table);
      this.content = table;
      this.scrollbar = new SimpleScrollbar(tableBody);
      this.scrollbar.update();
      if (this.lastMobileOpenRow !== undefined && window.innerWidth <= 768) {
        const targetRow = this.getRow(this.lastMobileOpenRow)
        this.showMobileDetails(targetRow, targetRow.nTr)
      }
    }
  }

  update() {
    this.content.querySelector('*').remove();
    this.rows.forEach((row) => {
      this.content.appendChild(row.nTr);
    });
    this.scrollbar.update();
  }

  reRender() {
    this.initialRender(this.data)
  }

  bindEvents() {
    this.tHead.addEventListener('click', (event) => {
      const target = event.target.closest('[data-sortable]');
      if (target) {
        event.stopPropagation();
        const columnName = target.getAttribute('data-column-key');
        this.sortByColumn(columnName);
        this.update();
        const viewClasses = {
            base: `${this.classNames.baseClass}__sort`,
            asc: `${this.classNames.baseClass}__sort_asc`,
            desc: `${this.classNames.baseClass}__sort_desc`
          },
          sortStatusViewClassList = target.querySelector(`.${viewClasses.base}`).classList,
          asc = (classList) => {
            classList.add(viewClasses.asc);
            classList.remove(viewClasses.desc);
          },
          desc = (classList) => {
            classList.remove(viewClasses.asc);
            classList.add(viewClasses.desc);
          },
          disable = (classList) => {
            classList.remove(viewClasses.asc);
            classList.remove(viewClasses.desc);
          };

        // Disable all enabled sortViews
        [...this.tHead.querySelectorAll(`.${viewClasses.base}`)].forEach((element) => disable(element.classList));

        (this.sortParam.order === SortOrder.asc) ? asc(sortStatusViewClassList): desc(sortStatusViewClassList);
      }
    });

    this.view.addEventListener('click', (event) => {
      if (window.innerWidth > 768) return;

      const target = event.target.closest(`.${this.classNames.row}`),
        details = event.target.closest(`.${this.classNames.mobileDetails}`);

      if (!!details || !target) return;

      event.stopPropagation();
      const {
        rowId
      } = target,
      targetRow = this.getRow(rowId);

      (targetRow.mobileDetailShown) ?
      this.hideMobileDetails(targetRow): this.showMobileDetails(targetRow);
    });
  }

  hideMobileDetails(targetRow) {
    const {
      nTr: rowElement
    } = targetRow

    rowElement.classList.remove(`${this.classNames.row}_is_open`);
    setTimeout(() => {
      targetRow.mobileDetailShown = false;
      targetRow.mobileDetailView.remove();
      this.scrollbar.update();
      // this.scrollbar.to(rowElement.offsetTop - 10, 150);
      this.scrollbar.to(rowElement.offsetTop, 150);
      delete this.lastMobileOpenRow
    }, 310);
  }

  showMobileDetails(targetRow) {
    const {
      nTr: rowElement
    } = targetRow

    rowElement.classList.add(`${this.classNames.row}_is_open`);
    const detailsWrapper = document.createElement('td');
    detailsWrapper.className = `${this.classNames.baseClass}__mobile-details`;
    const detailsTemplate = this.buildMobileDetails(targetRow);
    detailsWrapper.innerHTML = detailsTemplate;
    rowElement.appendChild(detailsWrapper);
    targetRow.mobileDetailShown = true;
    targetRow.mobileDetailView = detailsWrapper;
    Tooltips(targetRow.mobileDetailView);
    setTimeout(() => {
      this.scrollbar.update();
      // this.scrollbar.to(rowElement.offsetTop - 10, 150);
      this.scrollbar.to(rowElement.offsetTop, 150);
      this.lastMobileOpenRow = targetRow.id
    }, 310);
  }

  getRow = (id) =>
    this.rows.find(element => +id === +element.nTr.rowId);

  getData() {
    const headers = new Headers({
      'X-Requested-With': 'XMLHttpRequest',
    });
    Promise.all([
        fetch(this.url, {
          headers
        }),
        fetch(this.coursesUrl, {
          headers
        })
      ])
      .then(([dataResponse, coursesResponse]) =>
        Promise.all([dataResponse.json(), coursesResponse.json()])
      )
      .then(([dataResponse, coursesData]) => {
        this.courses = coursesData;
        this.initialRender(dataResponse);
      })
      .catch((error) => this.setPlaceholder(Placeholder.empty));
  }
}
