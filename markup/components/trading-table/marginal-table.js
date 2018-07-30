import TradingTable from './trading-table';
import {
  Placeholder
} from './baseTable';
import { bitNumber } from '../../static/js/utils/utils';

const MarginEnum = {
  funds50k: 'funds50k',
  margin50k: 'margin50k',
  funds200k: 'funds200k',
  margin200k: 'margin200k',
  funds200kk: 'funds200kk',
  margin200kk: 'margin200kk',
  fundsMore200kk: 'fundsMore200kk',
  marginMore200kk: 'marginMore200kk'
}

export default class MarginalTable extends TradingTable {
  buildMobileDetails(targetRow) {
    const cells = {
      '50k': 'до $50 000',
      '200k': 'от $50 000\n до $200 000',
      '200kk': 'от $200 000\n до $2 000 000',
      More200kk: 'свыше\n $2 000 000',
    };
    const template = `
      <table class="marginal-mobile">
        <thead class="marginal-mobile__head">
          <tr class="marginal-mobile__head-row">
            <th class="marginal-mobile__head-cell" colspan="2">
              <span>Средства (или эквивалент в валюте счёта)</span>
            </th>
            <th class="marginal-mobile__head-cell" colspan="2">
              <span>Маржа, в валюте счёта</span>
            </th>
          </tr>
        </thead>
        <tbody class="marginal-mobile__body">
          ${Object.keys(cells).map((cell) => {
            if (cell === 'symbol') return '';
            const mobileRow = `
              <tr class="marginal-mobile__row">
                  <td class="marginal-mobile__cell">
                    <span>${cells[cell]}</span>
                  </td>
                  <td class="marginal-mobile__cell">
                    <span>${targetRow.cells[`funds${cell}`].value.view}</span>
                  </td>
                  <td class="marginal-mobile__cell">
                    <span>${targetRow.cells[`margin${cell}`].value}</span>
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
   * (!) Be ware that some columns may rely on the others which
   * makes the column order really matter.
   *
   * If we want to save more data of the particular row to the state,
   * just return an object with "html" property.
   *
   * @param  {string} columnName
   * @param  {Object|string|number} value
   * @param  {Object} rowData
   *
   * @return {Object|string}
   */
  calculateCellValue(columnName, value, rowData) {
    switch (columnName) {
      case MarginEnum.margin50k:
      case MarginEnum.margin200k:
      case MarginEnum.margin200kk:
      case MarginEnum.marginMore200kk:
        return this._calculateMargin(rowData, columnName.replace(/margin/g,'funds'));

      default:
        return {
          value,
          sortData: (typeof value === 'object') ? value.value : value,
          html: (typeof value === 'object') ? `
          <div
            class="${this.classNames.cellValue} ${value.dynamic ? `${this.classNames.cellValue}_is_dynamic-${value.dynamic}` : ''}">
            ${value.view}
          </div>` : `
          <div
            class="${this.classNames.cellValue}">
            ${value}
          </div>`,
        };
    }
  }

  _calculateMargin(rowData, fundsName) {
    const contracts = rowData['contracts'],
          funds = rowData[fundsName].value,
          symbol = `${rowData['symbol'].substring(0, 3).toUpperCase()}/${this.currencies().selected}`,
          course = this.getCourseBySymbol(symbol)

    const result = parseFloat(contracts * this.amountInLots * funds * course).toFixed(0)

    return {
      value: result,
      sortData: 0,
      html: `<div
        class="${this.classNames.cellValue}">
        ${bitNumber(result)}
      </div>`,
    }
  }
}
