var express = require('express');
var controller = require('./controller');

var app = express();

app.set('view engine', 'ejs');
app.use('/assets', express.static('./assets'));

controller(app);

app.listen(3000);
console.log('Listening on port: 3000');
