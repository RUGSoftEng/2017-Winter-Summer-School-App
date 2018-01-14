const UserRights = require(process.cwd() + "/public/dist/js/userRights.js");
const config = require('./../config');

/**
 * A function that validates whether the user is logged in, and if not redirect them to the log in page.
 * If we are in the testing environment, this check is skipped.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated() || config.isTestEnv())
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
const hasAllRights = function (names, user) {
	let hasRights = true;
	names.forEach(function (name) {
		hasRights &= UserRights.userHasRights(user, name);
	});
	return hasRights;
};

/**
 * A custom function that checks whether the user is authorised to perform a request (/access a webpage).
 * It is build on top of the Passport library @see {@link http://passportjs.org/}
 * If we are in the testing environment no authorisation is performed.
 *
 * @see {@link /public/dist/js/userRights.js}
 * @param {(string|string[])} name - one or more access right strings as defined in UserRights
 * @returns {Function}
 */
exports.isAuthorised = function (name) {
	return function (req, res, next) {
		if (req.isAuthenticated() || config.isTestEnv()) {
			if (name.constructor === Array && hasAllRights(name, req.user)) {
				return next();
			} else if (UserRights.userHasRights(req.user, name) || config.isTestEnv()) {
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



