"use strict";

/**
 * An object that should contain every user rank as a property.
 * Every user rank should be of type [string], where every string denotes the
 * actions that that user may perform.
 *
 * @type {{admin: [string], coordinator: [string], student: [string]}}
 */

const UserRights = {

	admin: [
		"ACCESS_MAIN_OVERVIEW",
		"ALTER_LOGIN_CODES",
		"ALTER_LECTURERS",
		"ALTER_GENERAL_INFO",
		"ALTER_SCHOOLS",
		"ALTER_CALENDAR",
		"ALTER_ANNOUNCEMENTS",
		"ALTER_USERS",
		"VIEW_OPTIONS",
		"OVERVIEW_GENERAL_INFO",
		"OVERVIEW_ANNOUNCE",
		"OVERVIEW_LECTURERS"
	],

	// A coordinator for a specific school. May only perform actions related to a specific school.
	coordinator: [
		"ACCESS_MAIN_OVERVIEW",
		"ALTER_LECTURER",
		"ALTER_GENERAL_INFO",
		"ALTER_ANNOUNCEMENTS",
		"ALTER_CALENDAR",
		"OVERVIEW_GENERAL_INFO",
		"OVERVIEW_ANNOUNCE",
		"OVERVIEW_LECTURERS"
	],

	student: ["ACCESS_MAIN_OVERVIEW"]
};

/**
 * Validates if a user with a certain role is allowed to perform a certain action.
 *
 * @param {Object} user - The req.user object
 * @param {string} name
 * @returns {boolean}
 */
exports.userHasRights = function (user, name) {
	return user.rank ? UserRights[user.rank].indexOf(name) > -1 : false;
};

exports.roles = [];

Object.keys(UserRights).forEach(function(key) {
	exports.roles.push(key);
});

