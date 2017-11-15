"use strict";

var mongoose = require('mongoose');

module.exports = function (callback) {
	const db = mongoose.connect('mongodb://localhost/summer-schools');
	mongoose.connection.on('error', function (err) {
		console.error('MongoDB error: %s', err);
	});

	mongoose.connection.on('open', function () {
		mongoose.Promise = global.Promise;
		require('require-dir')('../models');

		callback();
	});
};