# Инструкция по переходу с tars

Воспользуйтесь скриптом `remove-tars`: `node remove-tars`

Так же проследуйте инструкциям ниже. Многие необходимые действия автоматизированны в скрипте, в названии инструкции они отмечены `(X)`, те же, что необходимо сделать в ручную отмечены `(Y)`

### `(X)` markup/static/js/main.js
```pug
// Заменить:

'babel-polyfill' -> '@babel/polyfill'
```

-----------------------------------------

### `(X)` markup/components/head/head.pug
```pug
// Удалить:

|<!--[if IE 8 ]><link href="%=static=%css/main_ie8%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><![endif]-->
|<!--[if IE 9 ]><link href="%=static=%css/main_ie9%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><![endif]-->
|<!--[if (gt IE 9)|!(IE)]><!--><link href="%=static=%css/main%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><!--<![endif]-->

// Удалить:

|<!--[if lt IE 9 ]><script src="%=static=%js/separate-js/html5shiv-3.7.2.min.js" type="text/javascript"></script><meta content="no" http-equiv="imagetoolbar"><![endif]-->
```

-----------------------------------------

### `(X)` markup/pages/_template.pug (или template.pug)
```pug
// Удалить: 

script(src='%=static=%js/separate-js/svg4everybody.min.js')
script svg4everybody();

// Удалить:

script(src='%=static=%js/main%=hash=%%=min=%.js')
```

-----------------------------------------

### `(X)` All *.pug
```pug
// Заменить:

%=static=% -> static/
```

-----------------------------------------

### `(X)` All *.styl
```pug
// Заменить:

%=static=% -> static/img/
minified-svg/ -> svg/
```

-----------------------------------------

### `(X)` markup/static/stylus/fonts.styl
Поправить пути к шрифтам. Например:
```pug
url('../fonts/Roboto.eot') -> url('static/fonts/Roboto.eot')
```

-----------------------------------------

### `(Y)` Удалить
Перед удалением убедитесь, что в файлах нет пользовательского кода и библиотек
- markup/static/stylus/sprite-generator-templates/
- markup/static/stylus/sprites-stylus/
- markup/static/stylus/separate-css/
- markup/static/stylus/libraries/
- markup/static/stylus/plugins/
- markup/static/stylus/etc/
- markup/static/stylus/entry/
- markup/static/stylus/GUI.styl

Так же удалите неиспользуемые файлы в `markup/static/stylus/`

-----------------------------------------

### `(Y)` Создать файл markup/static/stylus/entry.styl
Точка входа для стилей, одержащая импорты остальных стилей представленна ниже:
Обратите внимание на именование файлов и поправте файлы в папке `stylus` в соответсвии с представленными ниже названиями
```css
/* Load config fpr library */ 
@import './rupture-config.styl';

/* Mixins, which are specific for current project */
@import './mixins.styl';

/* Stylus for used fonts */
@import './fonts.styl';

/* Vars, which are specific for current project */
@import './vars.styl';

/* Reset default browser styles  */
@import './normalize.styl';

/* Common styles for current project */
@import './common.styl';

/* Include all components */
@import '../../components/**/*.styl';
```
