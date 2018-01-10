const UserRights = require("../public/dist/js/userRights.js");
const mongoose = require('mongoose');
/**
 * A function that validates whether the user is logged in, and if not redirect them to the log in page.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.isLoggedIn = function (req, res, next) {
	if (process.env.NODE_ENV === "test") {
		return next();
	}
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
};

/**
 * A helper function to check if all rights in an array are satisfied.
 *
 * @param {string[]} names - A list of access rights strings
 * @param {Object} user - The req.user object.
 * @returns {boolean}
 */
function hasAllRights(names, user) {
	var hasRights = true;
	names.forEach(function (name) {
		hasRights &= UserRights.userHasRights(user, name);
	});
	return hasRights;
}

/**
 * A custom function that checks whether the user is authorised to perform a request (/access a webpage).
 * It is build on top of the Passport library @see {@link http://passportjs.org/}
 *
 * @see {@link ./userRights.js}
 * @param {(string|string[])} name - one or more access right strings as defined in UserRights
 * @returns {Function}
 */
exports.isAuthorised = function (name) {
	return function (req, res, next) {
		if (req.isAuthenticated()) {
			if (name.constructor === Array && hasAllRights(name, req.user)) {
				return next();
			} else if (UserRights.userHasRights(req.user, name)) {
				return next();
			}
			let err = new Error('Not authenticated');
			err.status = 403;
			next(err);
		} else {
			res.redirect('/');
		}
	}
};



