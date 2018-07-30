export default class Currencies {

  constructor(currencies, bindOnClick = true, baseClassName = 'currencies-tabs') {
    this.onChangeListeners = []
    this.currencies = currencies
    this.classNames = this._makeClassNames(baseClassName)

    bindOnClick && this.bindOnClick()
  }

  get selected() {
    let selectedItem = null;

    Array.prototype.forEach.call(this.currencies.childNodes, (item, _index) => {
      if (!(item instanceof HTMLElement) || selectedItem !== null) return
      if (item.classList.contains(this.classNames.itemActive)) {
        selectedItem = item.getAttribute('data-currency').toUpperCase();
        return
      }
    })
    return selectedItem
  }

  select(currencyName = '') {
    Array.prototype.forEach.call(this.currencies.childNodes, (item, _index) => {
      if (!(item instanceof HTMLElement)) return
      const currency = item.getAttribute('data-currency').toUpperCase()

      if (currency === currencyName.toUpperCase()) {
        item.classList.add(this.classNames.itemActive)
        this._callOnChangeListener(currency)
        return
      } else {
        item.classList.remove(this.classNames.itemActive)
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
      const currency = item.getAttribute('data-currency').toUpperCase(),
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
      if (!(item instanceof HTMLElement)) return
      const currency = item.getAttribute('data-currency').toUpperCase()

      if (currency === currencyName.toUpperCase()) {
        item.classList.remove(this.classNames.itemDisabled)
        this.select(currency)
      }
    })
  }

  disable(currencyName = '') {
    Array.prototype.forEach.call(this.currencies.childNodes, (item, _index) => {
      if (!(item instanceof HTMLElement)) return
      const currency = item.getAttribute('data-currency').toUpperCase(),
            classList = item.classList;

      if (currency === currencyName.toUpperCase()) {
        classList.add(this.classNames.itemDisabled)
        if (this.selected === currency) {
          classList.remove(this.classNames.itemActive)
          this._selectNotDisabled()
        } else {
          classList.remove(this.classNames.itemActive)
        }
        return
      }
    })
  }

  _selectNotDisabled() {
    let succsess = false;
    Array.prototype.forEach.call(this.currencies.childNodes, (item, _index) => {
      if (!(item instanceof HTMLElement) || succsess) return
      const currency = item.getAttribute('data-currency').toUpperCase();

      if (!item.classList.contains(this.classNames.itemDisabled)) {
        succsess = true
        item.classList.add(this.classNames.itemActive);
        this._callOnChangeListener(currency);
      }
    })
  }

  _makeClassNames(baseClassName) {
    return {
      item: `${baseClassName}__item`,
      itemActive: `${baseClassName}__item_active`,
      itemDisabled: `${baseClassName}__item_disabled`
    }
  }

  bindOnClick() {
    Array.prototype.forEach.call(this.currencies.childNodes, (item, _index) => {
      if (!(item instanceof HTMLElement)) return
      item.addEventListener('click', () => this.select(item.getAttribute('data-currency')))
    })
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
