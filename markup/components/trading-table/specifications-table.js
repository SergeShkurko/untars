import TradingTable from './trading-table';
import {
  bitNumber
} from '../../static/js/utils/utils';

const SpecificationsEnum = {
  spread: 'spread',
  contracts: 'contracts',
  levels: 'levels',
  swapLong: 'swap-long',
  swapShort: 'swap-short',
}

const POINT = 'POINT';

export default class SpecificationsTable extends TradingTable {
  constructor(view, options) {
    super(view, options);
    this.levelsColumnTooltip = document.querySelector('[data-column-key="levels"]').getAttribute('data-title')
    this.swapLongColumnTooltip = document.querySelector('[data-column-key="swap-long"]').getAttribute('data-title')
    this.swapShortColumnTooltip = document.querySelector('[data-column-key="swap-short"]').getAttribute('data-title')
  }

  buildMobileDetails(targetRow) {
    const cells = Object.keys(targetRow.cells);
    const template = `
      <table class="specifications-mobile">
        <tbody class="specifications-mobile__body">
          ${cells.map((cell) => {
            if (cell === 'symbol' || cell === 'spread') return '';
              const title = (cell === 'levels')
                ? this.levelsColumnTooltip
                : (cell === 'swap-long')
                  ? this.swapLongColumnTooltip
                  : (cell === 'swap-short')
                    ? this.swapShortColumnTooltip
                    : null

              const mobileRow = `
              <tr class="specifications-mobile__row" ${!!title ? `data-tooltip="data-tooltip" data-title="${title}"` : ''}>
                  <td class="specifications-mobile__cell">
                      ${targetRow.cells[cell].html}
                  </td>
              </tr>`;
            return mobileRow;
          }).join('')}
        </tbody>
      </table>`;
    return template;
  }

  /**
   * Function applies a formula to an induvidual column
   *
   * (!) Be ware that some columns may rely on the others which makes the column
   * order really matter.
   *
   * If we want to save more data of the particular row to the state, just return an
   * object with "html" property.
   *
   * @param  {string} columnName
   * @param  {Object} cellData
   * @param  {Array}  existingCells
   * @param  {Object} options
   *
   * @return {Object|string}
   */
  calculateCellValue(columnName, value, rowData) {
    const column = this.columns.find(element => element.key === columnName);
    let result = value;

    const defaultItem = (column, result, tooltipMark = false) => ({
      value: result,
      sortData: result,
      html: `
        <div class="${this.classNames.cellTitle}">
          ${column.title}
          ${tooltipMark ? '<span class="trading-table__tooltip-mark"></span>' : ''}
        </div>
        <div class="${this.classNames.cellValue}">
          ${result}
        </div>`,
    });

    switch (columnName) {
      case SpecificationsEnum.swapShort:
      case SpecificationsEnum.swapLong:
        result = (this.currencies().selected === POINT) ?
          value.value :
          this._calculateValues(rowData, value.value);
        return {
          value: result,
          sortData: result,
          html: `
            <div class="${this.classNames.cellTitle}">
              ${column.title}
              <span class="trading-table__tooltip-mark"></span>
            </div>
            <div
              class="${this.classNames.cellValue}
              ${result >= 0 ? `${this.classNames.cellValue}_is_dynamic-up` : `${this.classNames.cellValue}_is_dynamic-down`}">
              ${+parseFloat(result).toFixed(2)}
            </div>`,
        };
      case SpecificationsEnum.spread:
        result = (this.currencies().selected === POINT) ?
          value :
          this._calculateValues(rowData, value);
        return defaultItem(column, +parseFloat(result).toFixed(2));
      case SpecificationsEnum.contracts:
        result = `${bitNumber(parseFloat(parseFloat(rowData['contracts']['value']) * this.amountInLots).toFixed(0))} ${rowData['contracts']['currency']}`
        return defaultItem(column, result);
      case SpecificationsEnum.levels:
        return defaultItem(column, result, true);
      default:
        return defaultItem(column, result);
    }
  }

  _calculateValues(rowData, value) {
    const selectedCurrency = this.currencies().selected,
      symbol = `USD/${rowData['symbol'].substring(4, 7).toUpperCase()}`,
      targetSymbol = `USD/${selectedCurrency}`,
      course = this.getCourseBySymbol(symbol),
      targetCourse = this.getCourseBySymbol(targetSymbol),
      contracts = parseInt(rowData['contracts']['value']),
      accuracy = parseFloat(rowData['accuracy']);

    let result = (this.amountInCurrency * accuracy * value / course);

    if (Math.abs(result) === Infinity) return 0

    return (selectedCurrency === 'USD') ? result : result * targetCourse
  }
}
