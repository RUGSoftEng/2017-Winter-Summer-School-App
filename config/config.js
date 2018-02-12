"use strict";

const _ = require("lodash");
const logger = require("./lib/logger");
const environments = ["dev", "prod", "test"];

/**
 * Validates whether the environment was properly set.
 */
const validateEnvironment = function () {
	if (!process.env.NODE_ENV) {
		process.env.NODE_ENV = environments[0];
		logger.warning("The node environment is not set! \n"
			+ "\tUsing default environment '" + process.env.NODE_ENV + "'.");
	}
	if (environments.indexOf(process.env.NODE_ENV) === -1) {
		logger.fatalError("The environment is unknown! It must be one of the following: \n'"
			+ environments.join("' or '") + "'");
	}
};

/**
 * Validates the secrets - checking whether they have been set properly when running
 * in a production environment.
 * @param {*} config
 */
const validateSecrets = function (config) {
	if (config.isProductionEnv()) {
		if (config.sessionSecret === "default_secret")
			logger.warning("Session secret is not set in production environment!\n" +
				"For security reasons it should be set to some unique string.");
	}
};

/**
 * Returns an object with whatever functions we want the config object to contain
 *
 * @returns
 * {{isProductionEnv: isProductionEnv, isTestEnv: isTestEnv, isDevelopmentEnv: isDevelopmentEnv}}
 */
const getConfigFunctions = function () {
	return {
		/**
		 * Returns whether the application is running in a production environment
		 * @returns {boolean}
		 */
		isProductionEnv: function () {
			return this.env === "prod";
		},
		/**
		 * Returns whether the application is running in a testing environment
		 * @returns {boolean}
		 */
		isTestEnv: function () {
			return this.env === "test";
		},
		/**
		 * Returns whether the application is running in a development environment
		 * @returns {boolean}
		 */
		isDevelopmentEnv: function () {
			return this.env === "dev";
		}
	};
};


/**
 * Initializes a configuration object and returns it.
 *
 * @returns {*}
 */
const initConfig = function () {
	validateEnvironment();
	const env = process.env.NODE_ENV;
	let config = _.merge(require("./env/common.js"), require("./env/" + env + ".js"));
	config.env = env;
	config = _.merge(config, getConfigFunctions());
	validateSecrets(config);
	return config;
};

module.exports = initConfig();
