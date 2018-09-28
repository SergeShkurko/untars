let ymaps;

export default class ContactsMap {
  static init() {
    const element = document.querySelector('#contacts-map');
    return element ? new ContactsMap({
      placemarks: [{
        coordinates: [55.755150, 37.609739],
        address: 'Москва, ул. Большая Никитская 3, офис 506',
        name: 'Адрес регистрации:',
      }, {
        coordinates: [55.738759, 37.593983],
        address: 'Москва, ул. Остоженка, 38, офис 56',
        name: 'Адрес для корреспонденции:',
      }],
    }) : null;
  }

  constructor(options) {
    this.placemarks = options.placemarks;
    this.pinPath = window.location.hostname === 'localhost' ? './static/img/svg/map-pin.svg' : '/local/templates/main/build/static/img/svg/map-pin.svg';
    ({
      ymaps
    } = window);
    ymaps.ready(() => {
      this.createMap();
    });
  }
  createMap(coords = [55.74717666, 37.60117114]) {
    this.map = new ymaps.Map('contacts-map', {
      center: coords,
      zoom: 14,
      controls: ['zoomControl'],
    });
    this.map.behaviors.disable('multiTouch');
    this.addPlacemarks(this.placemarks);
  }

  addPlacemarks(data) {
    data.forEach((element) => {
      this.map.geoObjects.add(this.createPlacemark(element));
    });
  }

  createPlacemark(data) {
    const self = this;
    const myBalloonLayout = ymaps.templateLayoutFactory.createClass(`
      <div class="baloon">
        <div class="baloon__title">{{properties.name}}</div>
        <div class="baloon__text">{{properties.address}}</div>
        <div class="baloon__close-icon">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="14">
            <g transform="translate(-6 -6)">
              <path fill-rule="nonzero" d="M13,14.4142136 L7.87347584,19.5407377 C7.55527778,19.8589358 7.20172439,19.9296465 6.98959236,19.7175144 L6.28248558,19.0104076 C6.07035354,18.7982756 6.14106422,18.4447222 6.45926227,18.1265242 L11.5857864,13 L6.45926227,7.87347584 C6.14106422,7.55527778 6.07035354,7.20172439 6.28248558,6.98959236 L6.98959236,6.28248558 C7.20172439,6.07035354 7.55527778,6.14106422 7.87347584,6.45926227 L13,11.5857864 L18.1265242,6.45926227 C18.4447222,6.14106422 18.7982756,6.07035354 19.0104076,6.28248558 L19.7175144,6.98959236 C19.9296465,7.20172439 19.8589358,7.55527778 19.5407377,7.87347584 L14.4142136,13 L19.5407377,18.1265242 C19.8589358,18.4447222 19.9296465,18.7982756 19.7175144,19.0104076 L19.0104076,19.7175144 C18.7982756,19.9296465 18.4447222,19.8589358 18.1265242,19.5407377 L13,14.4142136 Z"></path>
            </g>
          </svg>
        </div>
      </div>
    `, {
      build() {
        myBalloonLayout.superclass.build.call(this);
        document.querySelector('.baloon__close-icon').addEventListener('click', (event) => {
          event.preventDefault();
          self.map.balloon.close();
        });
      },
    });

    const newPlacemark = new ymaps.Placemark(data.coordinates, {
      address: data.address,
      name: data.name,
    }, {
      iconLayout: 'default#image',
      iconImageHref: this.pinPath,
      iconImageSize: [34, 41],
      iconImageOffset: [-5, -30],
      balloonContentLayout: myBalloonLayout,
      balloonPanelMaxMapArea: 0,
      balloonCloseButton: false,
    });
    return newPlacemark;
  }
}
// 55.755150, 37.609739
