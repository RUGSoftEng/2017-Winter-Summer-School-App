"use strict";

const config = require('../config');
const logger = require('./logger');

module.exports.start = function (callback) {

	const app = require('express')();

	require('./mongoose')(function () {
		require('./initialiseApp')(app);
		require('./addControllers')(app).addControllers();

		app.listen(config.port, function () {
			logger.inform('Server has started!\n\nCurrent time:\t\t' + new Date());
			logger.inform('Server name:\t\t' + config.application.name);
			logger.inform('Server environment:\t' + config.env);
			logger.inform('Server domain:\t\t' + config.domain);
			logger.inform('Server version:\t\t' + config.application.version);
			logger.inform('Database name:\t\t' + config.db.name);

			exports.app = app;
			if (callback)
				callback(app);
		});
	});
};
