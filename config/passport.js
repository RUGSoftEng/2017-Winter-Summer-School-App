const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt-nodejs');
var Users = require('mongoose').model('account');

module.exports = function (passport) {

	passport.use('login', new LocalStrategy(
		function (usern, password, done) {
			Users.findOne({username: usern}, function (err, user) {
				if (typeof user !== 'undefined' && !err) {
					bcrypt.compare(password, user.password, function (err, res) {
						if (res == true) {
							return done(null, user);
						} else {
							return done(null, false, {"message": "Invalid password."});
						}
					});

				} else {
					return done(null, false, {"message": "Invalid username."});
				}
			});
		})
	);

	passport.serializeUser(function (user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function (id, done) {
		Users.findOne({_id: id}, function (err, user) {

			if (typeof user === 'undefined' || err)
				console.log('Error in deserializing user');
			done(null, user);
		});
	});

};