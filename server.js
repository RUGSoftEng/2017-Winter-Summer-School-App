var express = require('express');
var app = express();

require('./config/initialiseApp')(app);

var control = require('./config/addControllers')(app);
control.addControllers();

var defaultPort = 8080;
app.listen(defaultPort);
console.log(defaultPort + ' is the port');
