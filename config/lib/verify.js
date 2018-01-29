"use strict";

exports.getEmptyOrUndefinedStrings = function (strings, callback) {
	const undefOrEmpty = [];
	for (let i = 0; i < strings.length; i++) {
		if (typeof (strings[i]) === "undefined" || strings[i].length === 0) {
			undefOrEmpty.push(strings[i]);
		}
	}
	callback(undefOrEmpty);
};
