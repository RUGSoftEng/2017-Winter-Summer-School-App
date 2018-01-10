const flash         = require('connect-flash');
const morgan        = require('morgan');
const cookieParser  = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser    = require('body-parser');
const express       = require('express');
const session       = require('express-session');
const passport      = require('passport');
const UserRights    = require('../public/dist/js/userRights.js');
require('./passport')(passport);

module.exports = function (app) {
	app.set('view engine', 'ejs');
	app.use(morgan('dev'));
	app.use(cookieParser());
	app.use(bodyParser());
	app.use(cookieSession({
		secret: 'summerwinter',
		saveUninitialized: true,
		resave: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use(express.static('views'));
	app.locals.isAuthorised = UserRights.userHasRights;
};