var express = require('express');
var app     = express();

require('./config/initialiseApp')(app);

var control = require('./config/addControllers')(app);
control.addControllers();

var defaultPort = process.env.PORT || 8800;

app.listen(defaultPort, function () {
    console.log('Our app is running on port:' + defaultPort);
});

exports.app = app;
