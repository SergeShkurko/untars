import TimelineLite from 'gsap/TimelineLite';
import TweenLite from 'gsap/TweenLite';
import 'gsap/EasePack';
import 'gsap/CSSPlugin';
import 'static/js/plugins/drawsvg';
import utils from 'static/js/utils/utils';

class FeatureAnimation {
  constructor(icons) {
    this.icons = icons;
    this.iconsAmount = this.icons.length;
    this.checkAnimation = this.checkAnimation.bind(this);
  }

  static isInViewport(icon) {
    const rect = icon.getBoundingClientRect();
    if (
      rect.top >= 0 &&
      rect.left >= 0 &&
      (rect.bottom - (rect.height / 2)) <=
      (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    ) {
      return true;
    }
    return false;
  }

  checkAnimation() {
    [...this.icons].forEach((icon) => {
      if (FeatureAnimation.isInViewport(icon)) {
        if (icon.animated) return;
        icon.style.visibility = 'visible';
        this.iconsAmount = this.iconsAmount - 1;
        const iconName = icon.getAttribute('id');
        this[`animate${iconName}`]();
        icon.animated = true;
      }
    });
    if (this.iconsAmount === 0) {
      window.removeEventListener('scroll', this.checkAnimation);
    }
  }

  animateChart() {
    const outerAnimation = new TimelineLite();
    const innerAnimation = new TimelineLite();

    const chart = document.querySelector('#Chart');
    const bottom = chart.querySelector('.bottom');
    const firstBar = chart.querySelector('.bar-1');
    const secondBar = chart.querySelector('.bar-2');
    const thirdBar = chart.querySelector('.bar-3');
    const fourthBar = chart.querySelector('.bar-4');
    const firstBarFills = chart.querySelectorAll('.bar-1-fill');
    const secondBarFills = chart.querySelectorAll('.bar-2-fill');
    const thirdBarFills = chart.querySelectorAll('.bar-3-fill');
    const arrow = chart.querySelector('.arrow');
    const arrowTip = chart.querySelector('.arrow-tip');

    TweenLite.fromTo(bottom, 0.6, {
      drawSVG: 0,
    }, {
      drawSVG: '100%',
    });

    outerAnimation
      .staggerFromTo([firstBar, secondBar, thirdBar, fourthBar], 1, {
        y: 90,
      }, {
        y: 0,
        scaleY: 1.2,
        ease: Elastic.easeOut.config(1, 0.75),
      }, 0.2)
    innerAnimation
      .staggerFromTo([firstBarFills, secondBarFills, thirdBarFills], 1, {
        y: 90,
      }, {
        y: 0,
        scaleY: 1.2,
        ease: Elastic.easeOut.config(1, 0.75),
      }, 0.2)
      .fromTo(arrow, 0.45, {
        drawSVG: 0,
      }, {
        drawSVG: '100%',
      }, '-=0.7')
      .fromTo(arrowTip, 0.2, {
        drawSVG: 0,
      }, {
        drawSVG: '100%',
      }, '-=0.4');
  };

  animatePercent() {
    const outerAnimation = new TimelineLite();
    const innerAnimation = new TimelineLite();

    const chart = document.querySelector('#Percent');
    const shadow = chart.querySelector('.shadow');
    const innerLine = chart.querySelector('.innerLine');
    const outerLine = chart.querySelector('.outerLine');
    const arrowTip = chart.querySelector('.arrowTip');
    const cirleTop = chart.querySelector('.cirleTop');
    const cirleBottom = chart.querySelector('.cirleBottom');
    const percentLine = chart.querySelector('.percentLine');

    outerAnimation
      .staggerFromTo([cirleBottom, cirleTop, percentLine], 0.8, {
        drawSVG: 0,
      }, {
        drawSVG: '100%',
        ease: Power2.easeOut,
      }, 0.2)

    innerAnimation
      .fromTo(innerLine, 1.1, {
        drawSVG: 0,
      }, {
        ease: Power2.easeOut,
        drawSVG: '100%',
      })
      .fromTo(shadow, 0.5, {
        opacity: 0,
      }, {
        opacity: 1,
      }, '-=0.5')
      .fromTo(outerLine, 0.5, {
        drawSVG: 0,
      }, {
        ease: Power2.easeOut,
        drawSVG: '100%',
      }, '-=0.5')
      .fromTo(arrowTip, 0.3, {
        drawSVG: 0,
      }, {
        ease: Power2.easeOut,
        drawSVG: '100%',
      }, '-=0.3')
  }

  animateShield() {
    const animation = new TimelineLite();

    const chart = document.querySelector('#Shield');
    const shadow = chart.querySelector('.shadow');
    const innerLine = chart.querySelector('.innerLine');
    const outerLine = chart.querySelector('.outerLine');
    const innerColor = chart.querySelector('.innerColor');
    const letter = chart.querySelector('.letter');

    animation
      .staggerFromTo([innerLine, outerLine], 1, {
        drawSVG: '50% 50%',
      }, {
        drawSVG: '100%',
        ease: Power2.easeOut,
      }, 0.2)
      .fromTo(innerColor, 0.7, {
        opacity: 0,
      }, {
        opacity: 1,
        ease: Power2.easeOut,
      }, '-=0.4')
      .fromTo(shadow, 0.6, {
        opacity: 0,
      }, {
        opacity: 0.2,
        ease: Power2.easeOut,
      }, '-=0.7')
      .fromTo(letter, 0.9, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'center',
      }, {
        scale: 1,
        opacity: 1,
        ease: Elastic.easeOut.config(1, 0.75),
      }, '-=0.5');
  }

  animateAvailable() {
    const animation = new TimelineLite();

    const chart = document.querySelector('#Available');
    const innerLine = chart.querySelector('.innerLine');
    const outerLine = chart.querySelector('.outerLine');
    const leg = chart.querySelector('.leg');
    const stand = chart.querySelector('.stand');
    const innerFill = chart.querySelector('.innerFill');
    const check = chart.querySelector('.check');

    animation
      .fromTo(stand, 0.5, {
        drawSVG: '50% 50%'
      }, {
        drawSVG: '100%',
        ease: Power2.easeOut,
      })
      .fromTo(leg, 0.5, {
        drawSVG: '0'
      }, {
        drawSVG: '100%',
        ease: Power2.easeOut,
      }, '-=0.3')
      .fromTo(outerLine, 0.9, {
        drawSVG: '50% 50%'
      }, {
        drawSVG: '100%',
        ease: Power2.easeOut,
      }, '-=0.3')
      .fromTo(innerLine, 0.5, {
        drawSVG: '50% 50%'
      }, {
        drawSVG: '100%',
        ease: Power2.easeOut,
      }, '-=0.5')
      .fromTo(innerFill, 0.6, {
        opacity: 0,
      }, {
        opacity: 1,
        ease: Power2.easeOut,
      }, '-=0.5')
      .fromTo(check, 1.1, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'center',
      }, {
        scale: 1,
        opacity: 1,
        ease: Elastic.easeOut.config(1, 0.75),
      }, '-=0.5');
  }

  bindEvents() {
    window.addEventListener('scroll', this.checkAnimation);
    window.addEventListener('load', this.checkAnimation);
  }
}

const iconsAnimation = new FeatureAnimation(document.querySelectorAll('#Chart, #Percent, #Shield, #Available'));
iconsAnimation.bindEvents();
