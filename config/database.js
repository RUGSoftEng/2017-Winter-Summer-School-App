exports.isLoggedIn = function(req, res, next) {
	
	    if (req.isAuthenticated())
	        return next();
	
	    res.redirect('/');
};

exports.mongojs = require('mongojs');
exports.db = exports.mongojs('mongodb://admin:summerwinter@ds119370.mlab.com:19370/summerwinter',['announcements','generalinfo']);