// import SimpleScrollbar from 'simple-scrollbar';
import Tabs from '../tabs/tabs';
import SpecificationsTable from './specifications-table';
import MarginalTable from './marginal-table';
import Swith from '../swith';
import CurrenciesTabs from '../currencies/currenciesTabs';
import CurrenciesDropdown from '../currencies/currenciesDropdown';
import {
  ValidateNumberInput
} from '../../static/js/utils/utils';

export default class TradeConditions {
  static init() {
    const initialElement = document.querySelector('.trading-conditions');
    return initialElement ? new TradeConditions(initialElement) : null;
  }

  constructor(element) {
    this.element = element;
    this.tabs = new Tabs('trading-conditions', this.element);
    this.tabs.init();

    const amount = document.getElementById('tradingTableAmount'),
          validateAmount = new ValidateNumberInput(amount);
    validateAmount.min(0.01).max(1000);
    amount.addEventListener('change', (input) => {
      this.reRenderTables()
    });

    const swith = new Swith(document.getElementById('tradingTableSwith'));
    swith.addOnChangeListener((value) => {
      amount.value = (value) ? '1' : '100000';
      value ? validateAmount.min(0.01).max(1000) : validateAmount.min(1000).max(100000000);
      this.reRenderTables()
    })

    this.currenciesTabs = new CurrenciesTabs(document.getElementById('tradingTableCurrenciesTabs'));
    this.currenciesTabs.addOnChangeListener((item) => this.reRenderTables());
    // window.ct = this.currenciesTabs

    this.currenciesDropdown = new CurrenciesDropdown(document.getElementById('tradingTableCurrenciesDropdown'));
    this.currenciesDropdown.addOnChangeListener((item) => this.reRenderTables());
    // window.cd = this.currenciesDropdown

    this.element.addEventListener('show', (item, detail) => {
      this.currenciesTabs.toggleDisabled('POINT');
      this.currenciesDropdown.toggleDisabled('POINT');
    })

    // console.error('DEBUG');

    const config = {
      baseClass: 'trading-table',
      // coursesUrl: 'http://5b156417c17fa9001477114c.mockapi.io/api/courses',
      coursesUrl: '/api/courses/',
      amount,
      swith,
      currencies: () => this.currenciesController,
    }

    this.SpecificationsTable = new SpecificationsTable(element.querySelector('.specifications-table .trading-table__table'), {
      ...config,
      // url: 'http://5b156417c17fa9001477114c.mockapi.io/api/specifications',
      url: '/api/specifications/',
    });

    this.MarginalTable = new MarginalTable(element.querySelector('.marginal-table .trading-table__table'), {
      ...config,
      // url: 'http://5b156417c17fa9001477114c.mockapi.io/api/marginal',
      url: '/api/marginal/',
    });
  }

  reRenderTables() {
    this.SpecificationsTable.reRender();
    this.MarginalTable.reRender();
  }

  get currenciesController() {
    return (window.innerWidth >= 768) ?
      this.currenciesTabs :
      this.currenciesDropdown
  }
}
