export const SortOrder = {
  asc: 0,
  desc: 1,
};

export const Placeholder = {
  empty: 0,
  loading: 1,
  detail: 2,
};

export default class BaseTable {
  constructor(view, options) {
    this.view = view;

    this.state = {};
    this.columns = [];
    this.rows = [];
    this.classNames = BaseTable.getClassNames(options.baseClass, options.classNamesForAppend);

    this.sortParam = {
      key: null,
      order: SortOrder.desc,
    };

    this.sortByColumn = this.sortByColumn.bind(this);

    Object.assign(this, options);

    this.tHead = view.querySelector('thead');
    if (this.tHead) {
      this.columns = BaseTable.getColumnsFromHeader(this.tHead);
    }

    this.tBody = view.querySelector('tbody');
    if (this.tBody === null) {
      const tBody = document.createElement('tbody');
      this.tBody = view.appendChild(tBody);
    }
  }

  isNumeric(columnValue) {
    return !isNaN(parseFloat(columnValue)) && isFinite(columnValue);
  }

  /**
   * Sorts "rows" array in the state.
   *
   * @param  {string} column
   * @return {void}
   */
  sortByColumn(column) {
    const { sortParam } = this;
    let sCallback;

    if (this.rows == null || this.rows.length < 2) {
      return;
    }

    if (sortParam.key && sortParam.key === column) {
      sortParam.order = sortParam.order ? SortOrder.asc : SortOrder.desc;
    } else {
      sortParam.order = SortOrder.asc;
    }
    sortParam.key = column;

    if (typeof this.rows[0].cells[column] === 'object') {
      sCallback = (a, b) => {
        // debugger
        const sourceA = a.cells[column].sortData;
        const sourceB = b.cells[column].sortData;
        const numA = (this.isNumeric(sourceA) && this.isNumeric(sourceB)) ? parseFloat(sourceA) : sourceA;
        const numB = (this.isNumeric(sourceA) && this.isNumeric(sourceB)) ? parseFloat(sourceB) : sourceB;

        if (sortParam.order) {
          if (numB > numA) {
            return 1;
          }

          return -1;
        } else if (numA > numB) {
          return 1;
        }

        return -1;
      };
    } else {
      sCallback = (a, b) => {
        if (sortParam.order) {
          return b.cells[column] - a.cells[column];
        }
        return a.cells[column] - b.cells[column];
      };
    }

    // sort an array in place
    this.rows.sort(sCallback);
  }

  /**
   * Builds a single tr with its td children
   *
   * @param  {Object}   rowData       Bond response data
   * @param  {number}   rowIdx        The row's index in teh table
   * @param  {function} calcCellValue Callback used to calculate a value for each cell
   * @param  {[type]}   options       Extra values
   * @return {[type]}
   */
  createTr(rowData, rowIdx, calcCellValue) {
    const row = {};

    const tr = document.createElement('tr');

    // store the row position index on a DOM node
    tr.rowIdx = rowIdx;
    tr.rowId = rowData.id;

    tr.classList.add(this.classNames.row);

    row.nTr = tr;
    row.cells = {};
    row.id = rowData.id;

    // direct mapping of the value in the state
    this.columns.forEach((column, columnIdx) => {
      const nTd = document.createElement('td');

      nTd.classList.add(this.classNames.cell);

      nTd.cellIdx = {
        row: rowIdx,
        column: columnIdx,
      };

      const cellValue = calcCellValue.call(this, column.key, rowData[column.key], rowData);

      /* By returning an object with an html property, we can store additional
       * data in the state */
      nTd.innerHTML = cellValue.html.trim();

      row.cells[column.key] = cellValue;
      /*
       * If column has the dynamics growth, we will add an additional class to it
       */
      tr.appendChild(nTd);
    });
    return row;
  }

  /**
   * Set table placeholder
   *
   * @param {number} type - Placeholder type. Please use enum {Placeholder}
   */
  setPlaceholder(type = Placeholder.loading) {
    const tableBody = this.tBody;
    tableBody.innerHTML = '';

    const wrapper = document.createElement('tr');
    wrapper.classList.add(this.classNames.placeholder);

    const td = document.createElement('td');

    switch (type) {
      case Placeholder.empty:
        td.innerHTML = this.view.getAttribute('data-empty-text') || 'Ошибка получения данных';
        td.classList.add(this.classNames.placeholderText);
        td.setAttribute('colspan', this.tHead.querySelectorAll('th').length);
        break;

      case Placeholder.loading:
        td.classList.add(this.classNames.placeholderLoad);
        td.setAttribute('colspan', this.tHead.querySelectorAll('th').length);
        break;

      case Placeholder.detail:
        td.innerHTML = this.view.getAttribute('data-empty-detail') || 'Ошибка получения данных';
        td.classList.add(this.classNames.placeholderText);
        td.setAttribute('colspan', this.tHead.querySelectorAll('th').length);
        break;
      default:
        break;
    }

    wrapper.appendChild(td);
    tableBody.appendChild(wrapper);
  }

  /**
   * The function traverses the table header and collects the columns
   *
   * @param  {HTMLElement} tHead
   * @return {Object}      The object with columns data
   */
  static getColumnsFromHeader(tHead) {
    const tableHeadings = tHead.querySelectorAll('th[data-column-key]');
    const columns = [];

    [...tableHeadings].forEach((heading, index) => {
      columns.push({
        id: index,
        key: heading.getAttribute('data-column-key'),
        sortable: heading.getAttribute('data-sortable'),
        dynamics: heading.getAttribute('data-dynamics'),
        title: heading.textContent.replace(/([\n])/g, '').replace(/(\s{2,})/g, ' ').trim(),
        tooltip: heading.getAttribute('data-title') || '',
      });
    });

    return columns;
  }

  static getClassNames(baseClass, classNamesForAppend = {}) {
    const newClassNames = {};

    Object.assign(newClassNames, {
      baseClass,
      tableEmpty: `${baseClass}--empty`,
      headRow: `${baseClass}__head-row`,
      headCell: `${baseClass}__head-cell`,
      body: `${baseClass}__body`,
      row: `${baseClass}__row`,
      cell: `${baseClass}__cell`,
      cellTitle: `${baseClass}__cell-title`,
      cellValue: `${baseClass}__cell-value`,
      placeholder: `${baseClass}__placeholder`,
      placeholderText: `${baseClass}__placeholder-text`,
      placeholderLoad: `${baseClass}__placeholder-spinner`,
      mobileDetails: `${baseClass}__mobile-details`,
    });

    Object.keys(classNamesForAppend).forEach((key) => {
      newClassNames[key] = classNamesForAppend[key].replace('%', baseClass);
    });

    return newClassNames;
  }
}
