export default class Currencies {

  constructor(currencies, bindOnChange = true, baseClassName = 'currencies-dropdown') {
    this.onChangeListeners = []
    this.currencies = currencies
    this.classNames = this._makeClassNames(baseClassName)

    bindOnChange && this._bindOnChange()
  }

  get selected() {
    let selectedItem = null

    return this.currencies.value.toUpperCase()
  }

  select(currenciName = '') {
    this.currencies.childNodes.forEach((item, _index) => {
      if (!(item instanceof HTMLElement)) return
      const currenci = item.value.toUpperCase()

      if (currenci === currenciName.toUpperCase()) {
        this.currencies.value = currenciName.toUpperCase()
        this._callOnChangeListener(currenci)
        return
      }
    })
  }

  toggleDisabled(currencyName = '') {
    this.disabled(currencyName)
      ? this.enable(currencyName)
      : this.disable(currencyName);
  }

  disabled(currencyName = '') {
    let disabledItem = false;

    Array.prototype.forEach.call(this.currencies.childNodes, (item, _index) => {
      if (!(item instanceof HTMLElement)) return
      const currency = item.value.toUpperCase(),
            classList = item.classList;

      if (currency === currencyName.toUpperCase()
          && item.classList.contains(this.classNames.itemDisabled)) {
        disabledItem = true
        return
      }
    })

    return disabledItem
  }

  enable(currencyName = '') {
    Array.prototype.forEach.call(this.currencies.childNodes, (item, _index) => {
      if (!(item instanceof HTMLElement)) return;
      const currency = item.value.toUpperCase();

      if (currency === currencyName.toUpperCase()) {
        item.classList.remove(this.classNames.itemDisabled)
        this.select(currency)
      }
    })
  }

  disable(currencyName = '') {
    Array.prototype.forEach.call(this.currencies.childNodes, (item, _index) => {
      if (!(item instanceof HTMLElement)) return;
      const currency = item.value.toUpperCase(),
            classList = item.classList;

      if (currency === currencyName.toUpperCase()) {
        classList.add(this.classNames.itemDisabled)
        if (this.selected === currency) this._selectNotDisabled();
        return
      }
    })
  }

  _selectNotDisabled() {
    let succsess = false;
    Array.prototype.forEach.call(this.currencies.childNodes, (item, _index) => {
      if (!(item instanceof HTMLElement) || succsess) return
      const currency = item.value.toUpperCase();

      if (!item.classList.contains(this.classNames.itemDisabled)) {
        succsess = true;
        this.currencies.value = currency
        this._callOnChangeListener(currency);
      }
    })
  }

  _bindOnChange() {
    this.currencies.addEventListener('change', (item) => {
      this._callOnChangeListener(item.value)
    })
  }

  _makeClassNames(baseClassName) {
    return {
      itemDisabled: `${baseClassName}__item_disabled`
    }
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
