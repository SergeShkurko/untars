export default {
  get scrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  },
  get isMobile() {
    return window.innerWidth - document.documentElement.clientWidth === 0;
  },
};
