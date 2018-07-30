export default class Swith {
  /**
   * @param {HTMLDivElement} swith
   */
  constructor(swith) {
    this.onChangeListeners = []
    this.onInput = swith.querySelector('input[value=on]')
    this.offInput = swith.querySelector('input[value=off]')

    this.onInput.addEventListener('change', () => this._callOnChangeListener(true))
    this.offInput.addEventListener('change', () => this._callOnChangeListener(false))
  }

  /**
   * Toggle status
   * @return {boolean}
   */
  get checked() {
    return this.onInput.checked && !this.offInput.checked
  }

  /**
   * @param {boolean|undefined} value
   */
  toggle(value) {
    if (value != null) {
      (value) ? this._toggleOn() : this._toggleOff()
    } else {
      (!this.checked) ? this._toggleOn() : this._toggleOff()
    }
  }

  /**
   * @private
   */
  _toggleOn() {
    this.onInput.checked = true
    this.offInput.checked = false
    this._callOnChangeListener(true)
  }

  /**
   * @private
   */
  _toggleOff() {
    this.onInput.checked = false
    this.offInput.checked = true
    this._callOnChangeListener(false)
  }

  /**
   * On change callback
   * @param {Function} listener
   */
  addOnChangeListener(listener) {
    this.onChangeListeners.push(listener)
  }

  /**
   * @private
   * @param {any}
   */
  _callOnChangeListener(...args) {
    this.onChangeListeners.forEach((listener, _index) => {
      if (!(listener instanceof Function)) return
      listener(...args)
    })
  }
}
