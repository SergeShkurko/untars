import '@babel/polyfill';
import 'whatwg-fetch';

import './polyfills/closest';
import './polyfills/serialize';
import './polyfills/customEvent';
import './polyfills/after';
import './polyfills/remove';
import './polyfills/forEach';

import '../stylus/entry.styl';

import Creative from 'components/creative'

function init(component) {
  try {
    (typeof component === 'function' && 'constructor' in component.prototype)
      ? new component()
      : null;
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  [
    Creative,
  ].map(init);
})
