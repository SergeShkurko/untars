import Swiper from 'swiper';

export default class AdaptiveSlider {
  constructor(options) {
    this.config = options.config;
    this.breakpoints = Object.keys(this.config);
    this.elementSelector = options.elementSelector;
    this.biggestBreakpoint = Math.max(...this.breakpoints);
  }

  createSlider(breakpoint) {
    if (this.initializedSlider) {
      this.initializedSlider.destroy();
    }
    this.currentBreakpoint = breakpoint;
    this.initializedSlider = new Swiper(this.elementSelector, this.config[breakpoint]);
    this.initializedSlider.init();
  }

  init() {
    this.breakpoints.forEach((breakpoint, index) => {
      const previousBreakpoint = this.breakpoints[index - 1] || 0;
      const condition = window.innerWidth < breakpoint
        && window.innerWidth > previousBreakpoint
        && (!this.currentBreakpoint || this.currentBreakpoint !== breakpoint);
      if (condition) {
        this.createSlider(breakpoint);
        this.currentBreakpoint = breakpoint;
      }
      window.addEventListener('resize', () => {
        if (window.innerWidth < breakpoint
          && window.innerWidth > previousBreakpoint
          && (!this.currentBreakpoint || this.currentBreakpoint !== breakpoint)) {
          this.createSlider(breakpoint);
        }
        if (this.initializedSlider
          && window.innerWidth > this.biggestBreakpoint) {
          this.initializedSlider.destroy();
          this.initializedSlider = null;
          this.currentBreakpoint = null;
        }
      });
    });
  }
}
