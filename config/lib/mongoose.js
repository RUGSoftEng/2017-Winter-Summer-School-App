"use strict";

const mongoose = require("mongoose");
const config = require("./../config");
const logger = require("./logger");

module.exports = function (callback) {
	mongoose.connect("mongodb://" + config.db.host + "/" + config.db.name, { useMongoClient: true });
	mongoose.connection.on("error", function (err) {
		logger.error("MongoDB error: " + err);
	});

	mongoose.connection.on("open", function () {
		logger.debug("Mongoose connection opened.");
		mongoose.Promise = global.Promise;
		require("require-dir")(config.dir + "/models");

		callback();
	});
};
