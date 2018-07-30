import Tabs from '../tabs/tabs';

const tabsElement = document.querySelector('.input-output');
if (tabsElement) {
  const tabs = new Tabs('input-output', tabsElement);
  tabs.init();
}

