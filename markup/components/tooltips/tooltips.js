import Tooltip from 'tooltip.js';

export default (context = document) => {
  const tooltipElements = [...context.querySelectorAll('[data-tooltip]')];

  tooltipElements.forEach((element) => {
    const tooltip = new Tooltip(element, {
      title: element.getAttribute('data-title') || element.getAttribute('title'),
      trigger: 'hover',
    });
    // debugger
    tooltip.hide();
  });

  document.addEventListener('touchstart', () => {
    const tooltip = document.querySelector('.tooltip[aria-hidden="false"]');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  });
}
