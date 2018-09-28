const util = require('util'),
  fs = require('fs')

const readFileAsync = util.promisify(fs.readFile),
  writeFileAsync = util.promisify(fs.writeFile)

async function replaceRegexInFile(file, data){
  let contents = await readFileAsync(file, 'utf8')
  data.forEach(({from, to}) => {
    contents = contents.replace(from, to)
  });
  await writeFileAsync(file, contents, 'utf8')
  return true
}

if (fs.existsSync('./markup/static/js/main.js')) {
  replaceRegexInFile('./markup/static/js/main.js', [{
    from: 'babel-polyfill',
    to: '@babel/polyfill',
  }])
  console.log('Success replace polifill import in "./markup/static/js/main.js"')
} else console.log('File not exist "./markup/static/js/main.js"')

if (fs.existsSync('./markup/components/head/head.pug')) {
  replaceRegexInFile('./markup/components/head/head.pug', [{
    from: '|<!--[if IE 8 ]><link href="%=static=%css/main_ie8%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><![endif]-->',
    to: '',
  },{
    from: '|<!--[if IE 9 ]><link href="%=static=%css/main_ie9%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><![endif]-->',
    to: '',
  },{
    from: '|<!--[if (gt IE 9)|!(IE)]><!--><link href="%=static=%css/main%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><!--<![endif]-->',
    to: '',
  },{
    from: '|<!--[if lt IE 9 ]><script src="%=static=%js/separate-js/html5shiv-3.7.2.min.js" type="text/javascript"></script><meta content="no" http-equiv="imagetoolbar"><![endif]-->',
    to: '',
  }])
  console.log('Success cleanup code "./markup/components/head/head.pug"')
} else console.log('File not exist "./markup/components/head/head.pug"')

{
  const path = fs.existsSync('./markup/pages/_template.pug')
    ? './markup/pages/_template.pug'
    : fs.existsSync('./markup/pages/template.pug')
      ? './markup/pages/template.pug'
      : null

  if (path === null) return console.log('Can\'t find pages template. File name contains "teplate"?')

  replaceRegexInFile(path, [{
    from: 'script(src=\'%=static=%js/separate-js/svg4everybody.min.js\')',
    to: '',
  },{
    from: 'script svg4everybody();',
    to: '',
  },{
    from: 'script(src=\'%=static=%js/main%=hash=%%=min=%.js\')',
    to: '',
  }])
  console.log(`Success cleanup code ${path}`)
}

/*

,{
    from: '',
    to: '',
  }

*/
