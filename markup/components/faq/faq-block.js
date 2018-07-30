import TweenLite from 'gsap/TweenLite';

export default class FAQBlock {
  static getTemplate(data) {
    if (data.category == null) return;
    let template = `
      <div class="faq-head">
        <div class="faq-head__category">
            <div class="category">
              <div class="category__icon">${data.category.icon}</div>
              <span class="category__text">${data.category.name}</span>
            </div>
        </div>
        <div class="faq-head__title">${data.title}</div>
        <div class="faq-head__text">${data.head_text}</div>
      </div>`;
    if (data.content) {
      template += `
        <div class="faq-body">${data.content}</div>
        <div class="faq-toggle">
          <div class="faq-toggle__text">Читать полностью</div>
          <div class="faq-toggle__icon">
            <svg width="12" height="7" viewBox="0 0 16 9" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.20792 8.67619L.32839 1.88741c-.43785-.43185-.43785-1.13202 0-1.56365.43745-.43168 1.14697-.43168 1.58439 0l6.08733 6.00702L14.08724.32393c.43763-.43167 1.14708-.43167 1.58453 0 .43764.43167.43764 1.13181 0 1.56366L8.79213 8.67637C8.5733 8.8922 8.2868 9 8.00015 9c-.28679 0-.5735-.10801-.79223-.32381z" fill="#B5BBC2" fill-rule="nonzero"></path>
            </svg>
          </div>
        </div>
      `;
    }
    return template;
  }

  constructor(element) {
    this.element = element;
    this.head = element.querySelector('.faq-head');
    this.body = element.querySelector('.faq-body');
    this.toggle = element.querySelector('.faq-toggle');

    let size;

    if (window.innerWidth <= 768 && window.innerWidth > 500) {
      size = 300;
    } else if (window.innerWidth <= 500) {
      size = 195;
    } else {
      size = 400;
    }

    if (this.body.textContent.length < size) {
      this.toggle.style.display = 'none';
      this.body.style.height = 'auto';
    } else {
      if (this.toggle) {
        this.toggleText = this.toggle.querySelector('.faq-toggle__text');
        this.head.addEventListener('click', (event) => {
          event.preventDefault();
          if (!this.isOpen) {
            this.toggleBody();
          }
        });
        this.toggle.addEventListener('click', (event) => {
          event.preventDefault();
          this.toggleBody();
        });
      }
    }
  }

  toggleBody() {
    if (this.isOpen) {
      TweenLite.to(this.body, 0.3, {
        height: 0,
        onComplete: () => {
          this.element.classList.remove('faq-block_open');
          this.head.classList.remove('faq-block_open');
          this.toggleText.innerHTML = 'Читать полностью';
        },
      });
    } else {
      TweenLite.set(this.body, { height: 'auto' });
      this.element.classList.add('faq-block_open');
      this.head.classList.add('faq-block_open');
      this.toggleText.innerHTML = 'Свернуть';
      TweenLite.from(this.body, 0.3, { height: 0 });
    }
  }

  get isOpen() {
    return this.element.classList.contains('faq-block_open');
  }
}
