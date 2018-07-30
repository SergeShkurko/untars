const utils = {
  get scrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  },
};

document.addEventListener('DOMContentLoaded', () => {
  utils.isMobile = window.innerWidth - document.documentElement.clientWidth === 0;
}, false);

export function validateNumber(input, defaultInput = 0) {
  if (input == '' || Number(input) === 0) return input
  return $.isNumeric(input) ? input : defaultInput
}

/**
 * Reverse string
 * *
 * @example
 * qwerty -> ytrewq
 * *
 * @param {string} input
 * @return {string}
 */
export function reverseString(input) {
  return input.split('').reverse().join('')
}

/**
 * Bit number
 * *
 * @example
 * 100000000 -> 100 000 000
 * *
 * @param {number|string} input
 * @return {string}
 */
export function bitNumber(input) {
  const source = (typeof input === 'number' ? String(input) : input),
        array = reverseString(source).match(/.{1,3}/g).reverse()

  return array.map((value) => reverseString(value)).join(' ')
}

export class ValidateNumberInput {
  constructor(input, defaultValue = 1, method = 'input') {
    this._input = input

    this._input.addEventListener(method, (event) => {
      if (this._input.value == '') return
      this._input.value = validateNumber(event.target.value, defaultValue)
    })
    this._input.addEventListener('change', (event) => {
      if (this._minVal != null && this._input.value < this._minVal)
        this._input.value = this._minVal
      else if (this._maxVal != null && this._input.value > this._maxVal)
        this._input.value = this._maxVal
    })
    return this
  }

  min(minVal) {
    this._minVal = minVal
    return this
  }

  max(maxVal) {
    this._maxVal = maxVal
    return this
  }
}

export default utils;
