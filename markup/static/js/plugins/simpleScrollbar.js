define([], function () {
  const w = window,
    d = document;

  var raf = w.requestAnimationFrame || w.setImmediate || function (c) { return setTimeout(c, 0); };

  function initEl(el) {
    if (el.hasOwnProperty('data-simple-scrollbar')) return;
    Object.defineProperty(el, 'data-simple-scrollbar', new ss(el));
  }

  // Mouse drag handler
  function dragDealer(el, context) {
    var lastPageY;

    el.addEventListener('mousedown', function (e) {
      lastPageY = e.pageY;
      el.classList.add('ss-grabbed');
      d.body.classList.add('ss-grabbed');

      d.addEventListener('mousemove', drag);
      d.addEventListener('mouseup', stop);

      return false;
    });

    function drag(e) {
      var delta = e.pageY - lastPageY;
      lastPageY = e.pageY;

      raf(function () {
        context.el.scrollTop += delta / context.scrollRatio;
      });
    }

    function stop() {
      el.classList.remove('ss-grabbed');
      d.body.classList.remove('ss-grabbed');
      d.removeEventListener('mousemove', drag);
      d.removeEventListener('mouseup', stop);
    }
  }

  // Constructor
  function ss(el) {
    this.target = el;

    this.direction = window.getComputedStyle(this.target).direction;

    this.bar = '<div class="ss-scroll">';

    this.wrapper = d.createElement('div');
    this.wrapper.setAttribute('class', 'ss-wrapper');

    this.el = d.createElement('div');
    this.el.setAttribute('class', 'ss-content');

    if (this.direction === 'rtl') {
      this.el.classList.add('rtl');
    }

    this.wrapper.appendChild(this.el);

    while (this.target.firstChild) {
      this.el.appendChild(this.target.firstChild);
    }
    this.target.appendChild(this.wrapper);

    this.target.insertAdjacentHTML('beforeend', this.bar);
    this.bar = this.target.lastChild;

    dragDealer(this.bar, this);
    this.moveBar();

    this.el.addEventListener('scroll', this.moveBar.bind(this));
    this.el.addEventListener('mouseenter', this.moveBar.bind(this));

    this.target.classList.add('ss-container');

    this.target.style.height = 'auto';

    var targetProp = window.getComputedStyle(this.target);
    var tMaxHeight = parseInt(targetProp.maxHeight);
    var tHeight = Math.round(parseFloat(this.target.offsetHeight));

    // hack to make it work with max-height (scroll only works with fixed height)
    if (tMaxHeight > 0 && tHeight >= tMaxHeight) {
      this.target.style.height = targetProp.maxHeight;
    }
  }

  ss.prototype = {
    update: function (e) {
      var element = this.el
      var currentTop = element.scrollTop

      this.target.style.height = 'auto';
      // this.target.removeAttribute('style');

      var targetProp = window.getComputedStyle(this.target);
      var tMaxHeight = parseInt(targetProp.maxHeight);
      var tHeight = Math.round(parseFloat(this.target.offsetHeight));

      if (tMaxHeight > 0 && tHeight >= tMaxHeight) {
        this.target.style.height = targetProp.maxHeight;
        element.scrollTop = currentTop
      }

      this.moveBar();
    },
    to: function (to, duration) {

      var _this = this;
      var element = _this.el;

      scroll(to, duration, element)

      function scroll(to, duration, element) {
        if (duration <= 0) {
          return;
        };
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 10;

        setTimeout(function () {
          element.scrollTop = element.scrollTop + perTick;
          if (element.scrollTop === to) {
            return;
          }
          scroll(to, duration - 10, element);
        }, 10);
      }

    },
    moveBar: function (e) {
      var totalHeight = this.el.scrollHeight,
        ownHeight = this.el.clientHeight,
        _this = this;

      this.scrollRatio = ownHeight / totalHeight;

      var barWidth = _this.bar.clientWidth > 0 ? _this.bar.clientWidth : 9;

      var isRtl = _this.direction === 'rtl';

      var right = isRtl ?
        (_this.target.clientWidth - barWidth + 18) :
        (_this.target.clientWidth - barWidth) * -1;

      raf(function () {
        // Hide scrollbar if no scrolling is possible
        if (_this.scrollRatio >= 1) {
          _this.bar.classList.add('ss-hidden')
        } else {
          _this.bar.classList.remove('ss-hidden')
          _this.bar.style.cssText = 'height:' + Math.max(_this.scrollRatio * 100, 10) +
            '%; top:' + (_this.el.scrollTop / totalHeight) * 100 +
            '%;right:' + right + 'px;';
        }
      });
    }
  }

  function initAll() {
    var nodes = d.querySelectorAll('*[ss-container]');

    for (var i = 0; i < nodes.length; i++) {
      initEl(nodes[i]);
    }
  }

  d.addEventListener('DOMContentLoaded', initAll);
  ss.initEl = initEl;
  ss.initAll = initAll;

  return ss
});
