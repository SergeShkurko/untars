const
  util = require('util'),
  fs = require('fs'),
  path = require('path')

const
  existsAsync = util.promisify(fs.exists),
  unlinkAsync = util.promisify(fs.unlink),
  readFileAsync = util.promisify(fs.readFile),
  writeFileAsync = util.promisify(fs.writeFile)

const
  info = (...args) => console.log('\x1b[36m', ...args, '\x1b[0m'),
  success = (...args) => console.log('\x1b[32m', ...args, '\x1b[0m'),
  error = (...args) => console.log('\x1b[31m', ...args, '\x1b[0m')

/**
 * Replace content in file
 * @param {string} file
 * @param {{[action: string]: string]}[]} data
 * @returns {Promise<boolean>} Has changes
 */
async function replaceRegexInFile(file, data) {
  if (!(await existsAsync(file))) throw new Error(`Файл "${file}" не найден`)
  const source = await readFileAsync(file, 'utf8')
  let result = source
  data.forEach(({ remove, from, to }) =>
    (result = result.replace(new RegExp(remove || from, 'g'), remove ? '' : to))
  )
  !(result === source) && await writeFileAsync(file, result, 'utf8')
  return !(result === source)
}

/**
 * Make flat list files
 * @param {string} dir Dir name
 * @returns {string[]} Flat list
 */
const readDir = (dir) =>
  fs.readdirSync(dir)
    .reduce((files, file) =>
      fs.statSync(path.join(dir, file)).isDirectory() ?
        files.concat(readDir(path.join(dir, file))) :
        files.concat(path.join(dir, file)),
      [])

const
  allMarkupFiles = readDir('./markup/'),
  templates = allMarkupFiles.filter((filename) => filename.split('.').pop() === 'pug'),
  styles = allMarkupFiles.filter((filename) => filename.split('.').pop() === 'styl')

replaceRegexInFile('./markup/static/js/main.js', [{
    from: 'babel-polyfill',
    to: '@babel/polyfill',
  }])
  .then((hasChanges) => hasChanges
    ? success('Успешная замена полифилла в "./markup/static/js/main.js". Не забудбте поставить @babel/polyfill при помощи npm/yarn')
    : info('Нет токенов для замены в "./markup/static/js/main.js"'))
  .catch(() => error('Файл не найден "./markup/static/js/main.js"'))

replaceRegexInFile('./markup/components/head/head.pug', [{
    remove: '|<!--[if IE 8 ]><link href="%=static=%css/main_ie8%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><![endif]-->',
  }, {
    remove: '|<!--[if IE 9 ]><link href="%=static=%css/main_ie9%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><![endif]-->',
  }, {
    remove: '|<!--[if (gt IE 9)|!(IE)]><!--><link href="%=static=%css/main%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><!--<![endif]-->',
  }, {
    remove: '|<!--[if lt IE 9 ]><script src="%=static=%js/separate-js/html5shiv-3.7.2.min.js" type="text/javascript"></script><meta content="no" http-equiv="imagetoolbar"><![endif]-->',
  }])
  .then((hasChanges) => hasChanges
    ? success('Успешная очистка кода в "./markup/components/head/head.pug"')
    : info('Нет токенов для замены в "./markup/components/head/head.pug"'))
  .catch(() => error('Файл не найден "./markup/components/head/head.pug"'))

{
  const path = fs.existsSync('./markup/pages/_template.pug')
    ? './markup/pages/_template.pug'
    : fs.existsSync('./markup/pages/template.pug')
      ? './markup/pages/template.pug'
      : null

  if (path === null) return error('Не могу найти файл шаблона для страниц. Возможно его название не содержит в себе "teplate"?')

  replaceRegexInFile(path, [{
      remove: 'script(src=\'%=static=%js/separate-js/svg4everybody.min.js\')',
    }, {
      remove: 'script svg4everybody();',
    }, {
      remove: 'script(src=\'%=static=%js/main%=hash=%%=min=%.js\')',
    }])
    .then((hasChanges) => hasChanges
      ? success(`Успешная очистка кода в ${path}`)
      : info(`Нет токенов для замены в ${path}`))
}

{
  info('\x1b[47m\x1b[30m[PUG]\x1b[0m\x1b[36m Замена "%=static=%" на нормальные пути в шаблонах...')
  Promise
    .all(templates.map((template) => replaceRegexInFile(template, [{
      from: '%=static=%',
      to: 'static/',
    }])))
    .then((result) => {
      const replacedTokensLength = result.filter((hasChanges) => hasChanges).length
      replacedTokensLength > 0
        ? success(`\x1b[47m\x1b[30m[PUG]\x1b[0m\x1b[32m Успешно заменено в ${replacedTokensLength} файлах`)
        : info(`\x1b[47m\x1b[30m[PUG]\x1b[0m\x1b[36m Нет токенов для замены`)
    })
}

{
  info('\x1b[47m\x1b[30m[STYLUS]\x1b[0m\x1b[36m Замена "%=static=%" на нормальные пути в стилях...')
  Promise
    .all(styles.map((style) => replaceRegexInFile(style, [{
      from: '%=static=%',
      to: 'static/img/',
    }, {
      from: 'minified-svg/',
      to: 'svg/',
    }])))
    .then((result) => {
      const replacedTokensLength = result.filter((hasChanges) => hasChanges).length
      replacedTokensLength > 0
        ? success(`\x1b[47m\x1b[30m[STYLUS]\x1b[0m\x1b[32m Успешно заменено в ${replacedTokensLength} файлах`)
        : info(`\x1b[47m\x1b[30m[STYLUS]\x1b[0m\x1b[36m Нет токенов для замены`)
    })
}

replaceRegexInFile('./markup/static/stylus/fonts.styl', [{
    from: /\.\.\/fonts\//g,
    to: 'static/fonts/',
  }])
  .then((hasChanges) => hasChanges
    ? success('Успешно исправлены пути шрифта в "./markup/static/stylus/fonts.styl"')
    : info('Нет токенов для замены в "./markup/static/stylus/fonts.styl"'))
  .catch(() => error('Файл не найден "./markup/static/stylus/fonts.styl"'))

unlinkAsync('./markup/components/default_component_scheme.json')
  .then(() => success('Успешно удален "./markup/components/default_component_scheme.json"'))
  .catch(() => info('Файл для удаления не найден "./markup/components/default_component_scheme.json"'))
