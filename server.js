"use strict";

var app = require('express')();

require('./config/mongoose')(function() {
	require('./config/initialiseApp')(app);
	require('./config/addControllers')(app).addControllers();

	var defaultPort = process.env.PORT || 8800;
	app.listen(defaultPort, function () {
		console.log('Our app is running on port:' + defaultPort);
	});
});

exports.app = app;
