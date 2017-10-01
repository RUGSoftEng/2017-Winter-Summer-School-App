var UserRights = require("./userRights.js");

exports.isLoggedIn = function(req, res, next) {
		if (process.env.NODE_ENV === "test"){
			return next();
		}
	    if (req.isAuthenticated())
	        return next();

	    res.redirect('/');

};

exports.isAuthorised = function(name) {
	return function (req, res, next) {
		if(req.isAuthenticated()) {
			if(UserRights.userHasRights(req.user, name)) {
				return next();
			}
			res.send(403);
		} else {
			res.redirect('/');
		}
	}
};

exports.mongojs = require('mongojs');
exports.db = exports.mongojs('summer-schools');

