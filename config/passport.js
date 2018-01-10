const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt-nodejs');
var Users = require('mongoose').model('account');

module.exports = function (passport) {
    Users.count({},function(err, count) {
		passport.use('login', new LocalStrategy(
			function (usern, password, done) {
				console.log(count);
				if(count === 0) {
					return done(null,{_id:"firstlogin"})
				}
				Users.findOne({username: usern}, function (err, user) {
                    console.log(user.password);
					if (typeof user !== 'undefined' && !err && user !== null) {
						bcrypt.compare(password, user.password, function (err, res) {
                            if (res === true) {
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
    });

    passport.serializeUser(function (user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function (id, done) {
        if(id === "firstlogin") {
            var user = {_id:"firstlogin",username:"admin",password:"",rank:"admin"};
            done(null, user);
        }
        else {
            Users.findOne({_id: id}, function (err, user) {
                if (typeof user === 'undefined' || err)
                    console.log('Error in deserializing user');
                done(null, user);
            });
		}
	});

};