import '@babel/polyfill';
import WOW from 'wowjs';
import 'whatwg-fetch';

import './polyfills/closest_matches';
import './polyfills/serialize';
import './polyfills/customEvent';
import './polyfills/after';
import './polyfills/remove';
import './polyfills/forEach';

import Tooltips from 'components/tooltips/tooltips';
import HowToStart from 'components/how-to-start/how-to-start';

import 'components/header/header';
import 'components/main/main';
import 'components/main-features/main-features';
import 'components/form/form';
import 'components/popup/popup';
import 'components/input-output/input-output';
import 'components/up-button/up-button';
import 'components/example-slider/example-slider';

import MainScreenSlider from 'components/main-default/main-default';
import MainFeaturesSlider from 'components/feature-slider/feature-slider';
import OfficeMap from 'components/map/map';
import TradeConditions from 'components/trading-table/bundle';
import Accordion from 'components/accordion/accordion';
import FAQComponent from 'components/faq/faq';
// import NewsComponent from 'components/news-page/news-page';
import Calendar from 'components/calendar/calendar';
import Information from 'components/information/information';
import SearchBar from 'components/search/search';
import ContactsMap from 'components/contacts/contacts';

// import '../stylus/fonts.styl'

// import '../stylus/vars.styl'
// import '../stylus/mixins.styl'
// import '../stylus/normalize.styl'
// import '../stylus/_grid.styl'
// import '../stylus/_rupture_config.styl'

// import '../stylus/common.styl'

const init = (component) =>
  ('init' in component)
    ? component.init()
    : (typeof component === 'function')
      ? component()
      : null

document.addEventListener('DOMContentLoaded', () => {
  window.wow = new WOW.WOW({
    offset: 0,
    live: true,
  });
  window.wow.init();
  [
    Tooltips,
    HowToStart,
    Accordion,
    Information,
    TradeConditions,
    OfficeMap,
    FAQComponent,
    SearchBar,
    // NewsComponent,
    Calendar,
    MainScreenSlider,
    MainFeaturesSlider,
    ContactsMap,
  ].map(init);
});
