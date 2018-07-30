import Choices from 'choices.js';

let ymaps;

class MapSidebar {
  constructor(options) {
    this.container = options.container;
    this.classes = {
      base: options.baseClass,
      container: `${options.baseClass}__container`,
      header: `${options.baseClass}__header`,
      close: `${options.baseClass}__close`,
      closeIcon: `${options.baseClass}__close-icon`,
      closeText: `${options.baseClass}__close-text`,
      content: `${options.baseClass}__content`,
      city: `${options.baseClass}__city`,
      address: `${options.baseClass}__address`,
      hoursWrapper: `${options.baseClass}__schedule`,
      hoursTitle: `${options.baseClass}__schedule-title`,
      caret: `${options.baseClass}__caret`,
      hoursDropdown: `${options.baseClass}__schedule-dropdown`,
      hoursItem: `${options.baseClass}__schedule-item`,
      phones: `${options.baseClass}__phones`,
      phone: `${options.baseClass}__phone`,
      phoneTitle: `${options.baseClass}__phone-title`,
      phoneNumber: `${options.baseClass}__phone-number`,
      metroWrapper: `${options.baseClass}__metro-wrapper`,
      metro: `${options.baseClass}__metro`,
      metroTitle: `${options.baseClass}__metro-title`,
      metroColor: `${options.baseClass}__metro-color`,
      metroName: `${options.baseClass}__metro-name`,
      metroDistance: `${options.baseClass}__metro-distance`,
    };
    this.content = {};
  }

  show() {
    this.element.classList.add(`${this.classes.base}_is_shown`);
  }

  hide() {
    this.element.classList.remove(`${this.classes.base}_is_shown`);
  }

  render() {
    const parent = document.createElement('div');
    parent.className = this.classes.base;
    parent.innerHTML = `
      <div class="${this.classes.container} ${this.classes.header}">
        <div class="${this.classes.close}">
          <div class="${this.classes.closeIcon}">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="12">
              <path d="M26.4156.1805c-.2329-.2407-.6206-.2407-.8616 0-.233.2325-.233.6194 0 .8514l4.3692 4.3611H.6032C.2672 5.3936 0 5.6602 0 5.9957c0 .3354.2671.6107.6032.6107h29.32l-4.3692 4.353c-.233.2407-.233.6282 0 .8601.241.2407.6293.2407.8616 0l5.4036-5.3935c.241-.2325.241-.6195 0-.8514L26.4156.1805z"></path>
            </svg>
          </div>
          <div class="${this.classes.closeText}">Все офисы</div>
        </div>
      </div>
      <div class="${this.classes.container} ${this.classes.content}">
        <div class="${this.classes.city}"></div>
        <div class="${this.classes.address}"></div>
        <div class="${this.classes.hoursWrapper}">
          <div class="${this.classes.hoursTitle}"></div>
          <div class="${this.classes.hoursDropdown}"></div>
        </div>
        <div class="${this.classes.phones}"></div>
      </div>
    `;
    // <div class="${this.classes.metroTitle}">Ближайшее метро</div>
    // <div class="${this.classes.metroWrapper}"></div>
    this.content.city = parent.querySelector(`.${this.classes.city}`);
    this.content.address = parent.querySelector(`.${this.classes.address}`);
    this.content.hoursTitle = parent.querySelector(`.${this.classes.hoursTitle}`);
    this.content.hoursDropdown = parent.querySelector(`.${this.classes.hoursDropdown}`);
    this.content.phones = parent.querySelector(`.${this.classes.phones}`);
    // this.content.metroWrapper = parent.querySelector(`.${this.classes.metroWrapper}`);
    this.element = parent;
    this.container.appendChild(parent);
  }

  update(data) {
    const metadata = data.properties.CompanyMetaData;
    this.content.city.textContent = 'Москва';
    this.content.address.textContent = metadata.address;
    this.renderWorkingHours(metadata.Hours);
    this.renderPhones(metadata.Phones);
    // let metro = ymaps.geocode(data.geometries[0].coordinates.reverse(), { kind: 'metro' });
    // metro.then((res) => {
    //   let q = res;
    //   let nearest = res.geoObjects.get(0);
    //   let props = nearest.properties.getAll();
    // })
    // this.renderMetro(data.properties.Stops.items);
    this.show();
  }

  renderWorkingHours(data) {
    const week = {
      Monday: 'Понедельник',
      Tuesday: 'Вторник',
      Wednesday: 'Среда',
      Thursday: 'Четверг',
      Friday: 'Пятница',
      Saturday: 'Суббота',
      Sunday: 'Воскресенье',
    };
    const workDays = [];
    let workSchedule = '';
    this.content.hoursTitle.textContent = data.State.text;
    const formatTime = time => `${time.from.slice(0, 5)} - ${time.to.slice(0, 5)}`;
    const createDay = (name, time) => {
      const oneDay = `
        <div class="${this.classes.hoursItem}">
          <span>${name}</span>
          <span>${time}</span>
        </div>
      `;
      workSchedule += oneDay;
    };
    data.Availabilities.forEach((days) => {
      const scheduleGroup = Object.keys(days);
      scheduleGroup.forEach((day) => {
        if (day === 'Intervals') return;
        const time = formatTime(days.Intervals[0]);
        createDay(week[day], time);
        workDays.push(day);
      });
    });
    const daysOfWeek = Object.keys(week);
    daysOfWeek.forEach((day) => {
      if (!(workDays.indexOf(day) + 1)) {
        createDay(week[day], 'Выходной');
      }
    });
    this.content.hoursDropdown.innerHTML = workSchedule;
  }

  renderPhones(phones) {
    let phonesContent = '';
    phones.forEach((phone) => {
      const template = `
        <div class="${this.classes.phone}">
          <div class=${this.classes.phoneTitle}>${phone.info || 'Для физических лиц'}</div>
          <div class="${this.classes.phoneNumber}">${phone.formatted}</div>
        </div>
      `;
      phonesContent += template;
    });
    this.content.phones.innerHTML = phonesContent;
  }

  renderMetro(data) {
    let content = '';
    data.forEach((metro) => {
      const template = `
        <div class="${this.classes.metro}">
          <div class="${this.classes.metroColor}"
            style="background-color: ${metro.Style.color}"></div>
          <div class="${this.classes.metroName}">${metro.name}</div>
          <div class="${this.classes.metroDistance}">${metro.Distance.text}</div>
        </div>
      `;
      content += template;
    });
    this.content.metroWrapper.innerHTML = content;
  }

  toggleDropdown() {
    this.content.hoursTitle.classList.toggle(`${this.classes.hoursTitle}_toggled`);
    this.content.hoursDropdown.classList.toggle(`${this.classes.hoursDropdown}_toggled`);
  }

  bindEvents() {
    this.element.querySelector(`.${this.classes.close}`)
      .addEventListener('click', () => {
        this.hide();
      });

    this.content.hoursTitle
      .addEventListener('click', () => {
        this.toggleDropdown();
      });
  }

  init() {
    this.render();
    this.bindEvents();
  }
}
export default class OfficeMap {
  static init() {
    const initialElement = document.querySelector('#map');
    return initialElement ? new OfficeMap(initialElement) : null;
  }

  static toggleSelect(value) {
    const activeAttribute = 'data-selected';
    const itemSelector = '.map-select .choices__list--dropdown .choices__item';
    let activeOption = document.querySelector(`${itemSelector}[${activeAttribute}]`);
    const chosenOption = document.querySelector(`${itemSelector}[data-value='${value}']`);
    if (!activeOption) {
      activeOption = document.querySelector(`${itemSelector}[aria-selected="true"]`);
    }
    activeOption.removeAttribute(activeAttribute);
    chosenOption.setAttribute(activeAttribute, 'true');
  }

  constructor(container) {
    this.container = container;
    this.url = container.getAttribute('data-url');
    this.pinPath = window.location.hostname === 'localhost' ? './static/img/minified-svg/map-pin.svg' : '/local/templates/main/build/static/img/minified-svg/map-pin.svg';
    this.sidebar = new MapSidebar({
      container: document.querySelector('.map-wrapper'),
      baseClass: 'map-sidebar',
    });
    this.initDropDown();
    this.bindEvents();
    ({ ymaps } = window);
    ymaps.ready(() => {
      this.sidebar.init();
      this.initMap();
    });
  }

  initDropDown() {
    this.dropDown = new Choices('.map-select__select', {
      noResultsText: 'Не найдено',
      noChoicesText: 'Не найдено',
      placeholder: true,
      placeholderValue: 'Начните поиск',
      itemSelectText: '',
      loadingText: 'Загрузка',
      callbackOnCreateTemplates(template) {
        const { classNames } = this.config;
        return {
          dropdown: () => {
            const layout = template(`
            <div
              class="${classNames.list} ${classNames.listDropdown}"
              aria-expanded="false"
              >
              <span class="choices__search-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" viewBox="0 0 22 22">
                    <g transform="translate(-2 -2)">
                      <path fill-rule="nonzero" d="M23.6655 22.0385l-5.4234-5.4457c1.3945-1.6004 2.1585-3.614 2.1585-5.7103C20.4006 5.9848 16.2733 2 11.2003 2S2 5.9848 2 10.8825s4.1273 8.8825 9.2003 8.8825c1.9045 0 3.7193-.5546 5.271-1.6074l5.4645 5.4871c.2285.229.5357.3553.8649.3553.3116 0 .6072-.1147.8316-.3232.4768-.443.492-1.1776.0332-1.6383zM11.2003 4.3172c3.7497 0 6.8002 2.9451 6.8002 6.5653 0 3.6202-3.0505 6.5653-6.8002 6.5653-3.7497 0-6.8002-2.9451-6.8002-6.5653 0-3.6202 3.0505-6.5653 6.8002-6.5653z"></path>
                    </g>
                  </svg>
                </span>
            </div>
            `);
            return layout;
          },
          item: (data) => {
            const layout = template(`
              <div class="${classNames.item} choices__selected-item ${data.highlighted ? classNames.highlightedState : classNames.itemSelectable}" data-item data-id="${data.id}" data-value="${data.value}" ${data.active ? 'aria-selected="true"' : ''} ${data.disabled ? 'aria-disabled="true"' : ''}>
                <span class="choices__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <g fill="#B5BBC2" fill-rule="nonzero">
                        <path d="M217.929097,78.6304144 C217.76355,78.9608443 217.361484,79.0945141 217.031056,78.9289658 L198.370072,71.491223 C198.14316,71.3778253 197.999884,71.1459323 198.000002,70.8922773 C197.999924,70.8605165 198.002159,70.8287557 198.006707,70.7972694 C198.0478,70.5125202 198.26636,70.2858815 198.549421,70.2344761 L206.716736,67.7165058 L209.2347,59.5491539 C209.27246,59.342199 209.405384,59.1650444 209.593517,59.0708992 C209.924023,58.9055078 210.326011,59.0393344 210.49144,59.3698427 L217.929097,78.0309198 C218.023634,78.2195632 218.023634,78.441771 217.929097,78.6304144 Z" transform="translate(-198 -59)"/>
                    </g>
                  </svg>
                </span>
                ${data.label}
              </div>
            `);
            return layout;
          },
        };
      },
    });
    setTimeout(() => {
      const input = document.querySelector('input.choices__input');
      input.setAttribute('placeholder', 'Начните поиск');
      input.addEventListener('cut', () => {
        setTimeout(() => {
          this.dropDown.clearInput();
        }, 1);
      });
    }, 1000);
  }

  getData(city) {
    const headers = new Headers({
      'X-Requested-With': 'XMLHttpRequest',
    });
    fetch(`${this.url}?city=${city}`, { headers })
      .then(response => response.json())
      .then((responseData) => {
        this.clusterer.removeAll();
        return responseData;
      })
      .then((responseData) => {
        this.addPlacemarks(responseData.features);
        this.map.setCenter(responseData.coordinates, 11, {
          checkZoomRange: true,
        });
      });
  }

  addPlacemarks(data) {
    const placemarks = data.map(element => this.createPlacemark(element));
    this.clusterer.add(placemarks);
  }

  createPlacemark(element) {
    const self = this;
    const myPlacemark = new ymaps.Placemark(element.geometry.coordinates.reverse(), {}, {
      iconLayout: 'default#image',
      iconImageHref: self.pinPath,
      iconImageSize: [34, 41],
      iconImageOffset: [-5, -30],
    });
    myPlacemark.events.add('click', () => {
      this.sidebar.update(element);
    });
    return myPlacemark;
  }

  createMap(coords = [55.74, 37.58]) {
    this.map = new ymaps.Map('map', {
      center: coords,
      zoom: 11,
      controls: ['zoomControl'],
    });
    this.clusterer = new ymaps.Clusterer({
      preset: 'islands#redClusterIcons',
      iconColor: '#e30000',
    });
    this.map.geoObjects.add(this.clusterer);
  }

  initMap() {
    ymaps.geolocation.get()
      .then((res) => {
        const bounds = res.geoObjects.position;
        this.createMap(bounds);
        const metaData = res.geoObjects.get(0).properties.get('metaDataProperty');
        const city = metaData.GeocoderMetaData.Address.Components.find(item => item.kind === 'locality').name;
        return city;
      })
      .then((city) => {
        this.getData(city);
        return this.dropDown.setValueByChoice(city);
      })
      .then(() => {
        OfficeMap.toggleSelect(this.dropDown.getValue(true));
        document.querySelector('[data-modal-target="map"]')
          .addEventListener('click', () => {
            setTimeout(() => {
              this.map.container.fitToViewport();
            }, 100);
          });
      });
  }

  bindEvents() {
    this.dropDown.passedElement.addEventListener('choice', (event) => {
      const { value } = event.detail.choice;
      this.getData(value);
      setTimeout(() => {
        OfficeMap.toggleSelect(value);
      }, 1);
    });
  }
}
