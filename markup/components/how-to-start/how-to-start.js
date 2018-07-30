import Tabs from '../tabs/tabs';

const setupScrollIcons = (tab) => {
  const allItemsContainer = tab.querySelector('.how-to-start__items')

  if (window.innerWidth >= 776) return;

  const allFeatures = [...tab.querySelectorAll('.feature')];
  allFeatures.forEach((element) => element.addEventListener('click', (event) => {
    if (!(event.offsetX > element.offsetWidth)) return;
    allItemsContainer.scroll({
      left: allItemsContainer.scrollLeft + 170,
      behavior: 'smooth',
    })
  }))
}

export default () => {
  const tabsElement = document.querySelector('.how-to-start');
  if (tabsElement) {
    const featureTabs = [...document.querySelectorAll('.how-to-start__tab')]

    if (featureTabs.length > 0) {
      const tabs = new Tabs('how-to-start', tabsElement);
      tabs.init();
      featureTabs.forEach(setupScrollIcons)
    } else {
      setupScrollIcons(tabsElement)
    }
  }
}
