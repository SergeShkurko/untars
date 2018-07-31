### markup/static/js/main.js 
```pug
// Change:

'babel-polyfill' -> '@babel/polyfill'
```
### markup/components/head/head.pug
```pug
// Remove:

|<!--[if IE 8 ]><link href="%=static=%css/main_ie8%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><![endif]-->
|<!--[if IE 9 ]><link href="%=static=%css/main_ie9%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><![endif]-->
|<!--[if (gt IE 9)|!(IE)]><!--><link href="%=static=%css/main%=hash=%%=min=%.css" rel="stylesheet" type="text/css"><!--<![endif]-->

// Remove:

|<!--[if lt IE 9 ]><script src="%=static=%js/separate-js/html5shiv-3.7.2.min.js" type="text/javascript"></script><meta content="no" http-equiv="imagetoolbar"><![endif]-->
```

### markup/pages/_template.pug
```pug
// Remove: 

script(src='%=static=%js/separate-js/svg4everybody.min.js')
script svg4everybody();

// Remove:

script(src='%=static=%js/main%=hash=%%=min=%.js')
```
