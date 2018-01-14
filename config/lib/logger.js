"use strict";

const chalk = require('chalk');
const log = console.log;
const error = chalk.bold.red.underline;
const inform = chalk.blue.italic;
const date = chalk.white.bgBlue;
const warning = chalk.bold.yellow;

const logAll = process.env.LOG_ALL === "true";
const env = process.env.NODE_ENV;
const debug = process.env.DEBUG === "true";


/**
 * Logs a warning message in bold yellow.
 *
 * @param {string} message
 */
exports.warning = function (message) {
	log(date(new Date()));
	log(warning("Warning: " + message));
	log();

};

/**
 * Logs an informative message to the screen in blue italic.
 *
 * @param {string} message
 */
exports.inform = function (message) {
	if (logAll || env === "dev") {
		log(inform(message));
	}
};

/**
 * Logs debugging messages to the screen in green if the debug variable is set.
 *
 * @param {string} message
 */
exports.debug = function (message) {
	if (logAll || debug) {
		log(chalk.bold.cyan("Debug: ") + chalk.green(message));
	}
};

/**
 * Logs an underlined error in bold red. This should only be called when something quite bad has happened
 * which we absolutely do not want and expect to occur.
 *
 * TODO: send email to all developers
 *
 * @param {string} message
 */
exports.error = function (message) {
	log();
	log(date(new Date()));
	console.error(error("Error: " + message));
	log();
};

/**
 * This function throws an error and stops the application from running.
 * Only use this function in very extreme scenario's! If you are uncertain whether to use error or fatalError
 * use error instead!
 *
 * @param {string} message
 * @throws Error
 */
exports.fatalError = function (message) {
	log();
	log(date(new Date()));
	throw new Error(error(message));
};


