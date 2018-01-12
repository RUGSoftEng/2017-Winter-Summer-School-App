exports.start = function (callback) {
	"use strict";

	var app = require('express')();

	require('./mongoose')(function () {
		require('./initialiseApp')(app);
		require('./addControllers')(app).addControllers();

		var defaultPort = process.env.PORT || 8800;
		app.listen(defaultPort, function () {
			console.log('Our app is running on port:' + defaultPort);
			exports.app = app;
			if (callback)
				callback(app);
		});
	});
};