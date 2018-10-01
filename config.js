const { title } = require('./package.json')

module.exports = {
  /**
   * Папка для результатов сборки
   * P.S. staging - тестовое окружение
   */
  buildDestination: {
    development: `${__dirname}/development`,
    production: `${__dirname}/production`,
    staging: `${__dirname}/staging`,
  },
  /**
   * Системные уведомления о статусе сборки
   * Boolean или объект с настройками https://www.npmjs.com/package/webpack-build-notifier
   * @type {null|boolean|Object}
   */
  notify: {
    title,
  },
  /**
   * Конфигурация dev сервера - https://webpack.js.org/configuration/dev-server/
   */
  devServer: {
    port: 3004,
  }
}
