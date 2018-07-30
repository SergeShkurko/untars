import dateRangePicker from 'static/js/plugins/jquery.daterangepicker';
import NewsComponent from 'components/news-page/news-page';

const newsComponent = document.querySelector('[data-component="news"]');
const news = newsComponent ? new NewsComponent(newsComponent) : null;

export default class Calendar {
  static init() {
    const calendar = document.querySelector('[data-component="calendar"]');

    return calendar ? new Calendar(calendar) : null;
  }

  constructor(element) {
    this.element = element;
    this.button = this.element.querySelector('.datepicker-button');
    this.closeButton = this.element.querySelector('.datepicker-modal__close');
    this.calendarWrapper = this.element.querySelector('.datepicker-modal');
    this.inputWrapper = this.element.querySelector('.datepicker-modal__inputs');
    this.beginInput = this.element.querySelector('.datepicker-modal__date_begin input');
    this.endInput = this.element.querySelector('.datepicker-modal__date_end input');
    this.datepickerSelector = '.date-picker-wrapper';
    this.bindEvents();
  }

  closeModalDatepicker() {
    if (window.innerWidth < 768) {
      $(this.inputWrapper).data('dateRangePicker').clear();
      document.querySelector('[data-type="all-time"]').click();

    }

    this.calendarWrapper.classList.remove('datepicker-modal_active');
    this.button.classList.remove('datepicker-button_active');
    this.beginInput.classList.remove('active');
    this.endInput.classList.remove('active');
  }

  formatDate(date) {
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;

    let mm = date.getMonth() + 1;

    if (mm < 10) mm = '0' + mm;

    let yy = date.getFullYear();

    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
  }

  bindEvents() {
    this.button.addEventListener('click', (event) => {
      this.button.classList.contains('datepicker-button_active')
        ? this.button.classList.remove('datepicker-button_active')
        : this.button.classList.add('datepicker-button_active');

      this.calendarWrapper.classList.contains('datepicker-modal_active')
          ? this.calendarWrapper.classList.remove('datepicker-modal_active')
          : this.calendarWrapper.classList.add('datepicker-modal_active');

      this.beginInput.classList.add('active');
      this.beginInput.click();
      this.beginInput.focus();
    });

    this.closeButton.addEventListener('click', (event) => {
        this.closeModalDatepicker();
    });

    $(this.inputWrapper).dateRangePicker({
      inline: true,
      alwaysOpen: true,
      showShortcuts: false,
      selectForward: true,
      showTopbar: false,
      startOfWeek: 'monday',
      language: 'ru',
      format: 'DD.MM.YYYY',
      container: '.datepicker-modal',
      customArrowPrevSymbol: `<div class="arrow-prev">
                                <svg width="7px" height="12px" viewBox="0 0 7 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                  <g stroke="none" stroke-width="1" fill-rule="evenodd"> <g transform="translate(-477.000000, -617.000000)" fill="#6D7986" fill-rule="nonzero"> <g transform="translate(200.000000, 493.000000)"> <g transform="translate(44.000000, 54.000000)"> <g> <path d="M239.74815,76.5940617 L234.467986,81.7537109 C234.132104,82.0820964 233.587529,82.0820964 233.25181,81.7537109 C232.916063,81.4256175 232.916063,80.8934816 233.25181,80.5654148 L237.923939,75.9999137 L233.251946,71.4345719 C232.916199,71.1063457 232.916199,70.574263 233.251946,70.2461696 C233.587692,69.9179435 234.13224,69.9179435 234.468122,70.2461696 L239.748285,75.4058985 C239.916159,75.5700248 240,75.7849029 240,75.9998871 C240,76.2149776 239.915995,76.430015 239.74815,76.5940617 Z"></path> </g> </g> </g> </g> </g>
                                </svg>
                              </div>`,
      customArrowNextSymbol: `<div class="arrow-next">
                                <svg width="7px" height="12px" viewBox="0 0 7 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                  <g stroke="none" stroke-width="1" fill-rule="evenodd"> <g transform="translate(-477.000000, -617.000000)" fill="#6D7986" fill-rule="nonzero"> <g transform="translate(200.000000, 493.000000)"> <g transform="translate(44.000000, 54.000000)"> <g> <path d="M239.74815,76.5940617 L234.467986,81.7537109 C234.132104,82.0820964 233.587529,82.0820964 233.25181,81.7537109 C232.916063,81.4256175 232.916063,80.8934816 233.25181,80.5654148 L237.923939,75.9999137 L233.251946,71.4345719 C232.916199,71.1063457 232.916199,70.574263 233.251946,70.2461696 C233.587692,69.9179435 234.13224,69.9179435 234.468122,70.2461696 L239.748285,75.4058985 C239.916159,75.5700248 240,75.7849029 240,75.9998871 C240,76.2149776 239.915995,76.430015 239.74815,76.5940617 Z"></path> </g> </g> </g> </g> </g>
                                </svg>
                              </div>`,
      hoveringTooltip: false,
      getValue: function() {
        return ($('#startDate').val() && $('#endDate').val()) ?  $('#startDate').val() + ' to ' + $('#endDate').val() : '';
      },
      setValue: (s, s1, s2) => {
        $(this.beginInput).val(s1);
        $(this.endInput).val(s2);
      },
      customOpenAnimation: function(cb) {
          $(this).fadeIn(300, cb);
      },
      customCloseAnimation: function(cb) {
          $(this).fadeOut(300, cb);
      }
    })
    .bind('datepicker-first-date-selected', (event, obj) => {
      $(this.beginInput).val(this.formatDate(obj.date1));
      this.endInput.focus();
    })
    .bind('datepicker-open', () => {
      this.beginInput.value = '';
      this.beginInput.focus();
    })
    .bind('datepicker-change', (event, obj) => {
      if (window.innerWidth >= 768) {
        this.calendarWrapper.classList.remove('datepicker-modal_active');
        this.button.classList.remove('datepicker-button_active');
        this.button.classList.add('datepicker-button_select');
        document.querySelector('.time-link_active') ? document.querySelector('.time-link_active').classList.remove('time-link_active') : '';
        news.selectTime(event);
      } else {
        document.querySelector('.time-link_active') ? document.querySelector('.time-link_active').classList.remove('time-link_active') : '';
        news.selectTime(event);
        document.querySelector(this.datepickerSelector).style.display = 'none';
      }
    });

    $(this.beginInput).change(function() {
        if (!$(this).val()) {
          $('.datepicker-modal__inputs').data('dateRangePicker').clear();
        }
    });

    $(this.endInput).change(function() {
        if (!$(this).val()) {
          $('.datepicker-modal__inputs').data('dateRangePicker').clear();
        }
    });
  }
}
