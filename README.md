# Инструкция по переходу с tars

### markup/static/js/main.js 
```pug
// Заменить:

'babel-polyfill' -> '@babel/polyfill'
```

-----------------------------------------

### markup/components/head/head.pug
```pug
// Удалить:

|<!--[if IE 8 ]><link href="%=static=%css/main_ie8%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><![endif]-->
|<!--[if IE 9 ]><link href="%=static=%css/main_ie9%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><![endif]-->
|<!--[if (gt IE 9)|!(IE)]><!--><link href="%=static=%css/main%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><!--<![endif]-->

// Удалить:

|<!--[if lt IE 9 ]><script src="%=static=%js/separate-js/html5shiv-3.7.2.min.js" type="text/javascript"></script><meta content="no" http-equiv="imagetoolbar"><![endif]-->
```

-----------------------------------------

### markup/pages/_template.pug (или template.pug)
```pug
// Удалить: 

script(src='%=static=%js/separate-js/svg4everybody.min.js')
script svg4everybody();

// Удалить:

script(src='%=static=%js/main%=hash=%%=min=%.js')
```

-----------------------------------------

### All *.pug
```pug
// Заменить:

%=static=%img -> static/img/
```

-----------------------------------------

### All *.styl
```pug
// Заменить:

%=static=% -> static/img/
minified-svg/ -> svg/
```

-----------------------------------------

### markup/static/stylus/fonts.styl
Поправить пути к шрифтам. Например:
```pug
url('../fonts/Roboto.eot') -> url('static/fonts/Roboto.eot')
```

-----------------------------------------

### Удалить
- markup/static/stylus/sprite-generator-templates/
- markup/static/stylus/sprites-stylus/
- markup/static/stylus/separate-css/
- markup/static/stylus/libraries/
- markup/static/stylus/plugins/
- markup/static/stylus/etc/
- markup/static/stylus/entry/

-----------------------------------------

### Создать файл markup/static/stylus/entry.styl
Точка входа для стилей, одержащая импорты остальных стилей. Например:
```css
@import '../../../node_modules/swiper/dist/css/swiper.min.css';
@import '../../../node_modules/choices.js/assets/styles/css/choices.min.css';

@import './normalize.styl';
@import './vars.styl';
@import './fonts.styl';
@import './mixins.styl';
@import './_grid.styl';
@import './_rupture_config.styl';

@import './common.styl';

@import '../../components/**/*.styl';
```
