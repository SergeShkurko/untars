import TweenLite from 'gsap/TweenLite';

export default class NewsBlock {
  static getTemplate(data) {
    let template;

    if (data.img) {
      template = `<div class="news-block__image">
        <img class="news-block__img" src="${data.img}" alt="" role = "presentation">
      </div>`;
    } else {
      template = ``;
    }

    template += `<div class="news-block__content">
        <div class="news-head">
          <div class="news-head__category">
              <div class="category">
                <div class="category__icon">${data.category.icon}</div>
                <span class="category__text">${data.category.name}</span>
              </div>
          </div>
          <div class="news-head__title">${data.title}</div>
          <div class="news-head__text">${data.head_text}</div>
        </div>
        <div class="news-bottom">
          <div class="news-bottom__date">${data.date}</div>
          <div class="news-toggle__arrow">
            <svg width="22px" height="12px" viewBox="0 0 22 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="AF-arrow" transform="translate(-853.000000, -1147.000000)" fill="#6D7986" fill-rule="nonzero">
                        <g transform="translate(853.000000, 1147.000000)">
                            <path d="M16.4156395,0.180471502 C16.1827089,-0.0601571674 15.7950343,-0.0601571674 15.5539594,0.180471502 C15.3210288,0.412970825 15.3210288,0.799927739 15.5539594,1.03188511 L19.9231717,5.39300876 L0.603230387,5.39300876 C0.267137129,5.39355072 0,5.6601933 0,5.99566435 C0,6.3311354 0.267137129,6.60644928 0.603230387,6.60644928 L19.9231717,6.60644928 L15.5539594,10.9594436 C15.3210288,11.2000723 15.3210288,11.5875711 15.5539594,11.8195285 C15.7950343,12.0601572 16.1832519,12.0601572 16.4156395,11.8195285 L21.8191938,6.42597778 C22.0602687,6.19347846 22.0602687,5.80652154 21.8191938,5.57456418 L16.4156395,0.180471502 Z" id="right-arrow-gray-icon-copy"></path>
                        </g>
                    </g>
                </g>
            </svg>
          </div>
        </div>
      </div>
    `;

    return template;
  }

  constructor(element) {
    this.element = element;
    this.head = element.querySelector('.news-head');
  }
}