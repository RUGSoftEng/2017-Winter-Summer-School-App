"use strict";

const { WebClient } = require("@slack/client");

const slack = require("../config").slack;
const web = new WebClient(slack.token);
const startTime = new Date();
const messagesPerHour = 12;
let messageCount = 0;

// This is a dependency of the logger, so we cant use the logger here.
/* eslint-disable no-console */

/**
 * Posts a message to slack.
 *
 * @param {[object]} messages
 */
module.exports.post = function (...messages) {
	const hours = Math.abs((new Date()) - startTime) / 36e5;
	if ((hours + 1) * messagesPerHour < messageCount) {
		return Promise.reject("Too many messages sent.");
	}

	messageCount++;

	const now = new Date();
	const nowString = now.toString();
	const message = nowString + ":\n" + messages.join("\n");
	return new Promise(function (resolve, reject) {
		web.chat.postMessage({
			channel: slack.conversationId,
			text: message
		})
			.then(() => {
				resolve();
			})
			.catch((msg) => {
				reject();
				console.error(msg);
			});
	});
};
/* eslint-enable no-console */
