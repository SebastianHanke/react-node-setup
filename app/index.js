var component = require('./component');
var app = document.createElement('div');

/*
* import style files into project
* */
require('./main.styl');

document.body.appendChild(app);

app.appendChild(component());