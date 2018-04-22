"use strict";

const chalk = require("chalk");
const slack = require("./slack");
// The only place where we are allowed to call console.log
/* eslint-disable no-console */
const log = console.log;
const err = console.error;
/* eslint-enable no-console */
const error = chalk.bold.red;
const inform = chalk.blue.italic;
const date = chalk.white.bgBlue;
const warning = chalk.bold.yellow;

const logAll = process.env.LOG_ALL === "true";
const env = require("../config").env;
const debug = process.env.DEBUG === "true";


/**
 * Logs a warning message in bold yellow.
 *
 * @param {[string]} messages
 */
exports.warning = function (...messages) {
	log(date(new Date()));
	log(warning(...["Warning:", ...messages]));
	log();

};

/**
 * Logs an informative message to the screen in blue italic.
 *
 * @param {[object]} messages
 */
exports.inform = function (...messages) {
	if (logAll || env === "dev") {
		log(inform(...messages));
	}
};

/**
 * Logs debugging messages to the screen in green if the debug variable is set.
 *
 * @param {[object]} messages
 */
exports.debug = function (...messages) {
	if (logAll || debug) {
		log(chalk.bold.cyan("Debug: "));
		log(chalk.green(...messages));
	}
};

/**
 * Logs an underlined error in bold red. This should only be called when something quite bad has
 * happened which we absolutely do not want and expect to occur.
 *
 * @param {[string]} messages
 */
exports.error = async function (...messages) {
	if (env === "prod") {
		try {
			await slack.post(...["=".repeat(60), "The app threw an error:\n", ...messages]);
		} catch (exception) {
			err(error(exception));
		}
	}
	log();
	log(date(new Date()));
	err(error(messages));
	log();
};

/**
 * This function throws an error and stops the application from running.
 * Only use this function in very extreme scenario's! If you are uncertain whether to use error or
 * fatalError, use error instead!
 *
 * @param {[object]} messages
 * @throws Error
 */
exports.fatalError = async function (...messages) {
	await exports.error(messages);
	throw new Error(messages);
};

process.on("uncaughtException", async function (exception) {
	try {
		await exports.error(exception.stack);
	} catch (nestedException) {
		log(error(nestedException));
	}
	process.exit(1);
});

process.on("unhandledRejection", async function (exception) {
	try {
		await exports.error(exception.stack);
	} catch (nestedException) {
		log(error(nestedException));
	}
	process.exit(2);
});
