const config        = require('../config');
const flash         = require('connect-flash');
const morgan        = require('morgan');
const cookieParser  = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser    = require('body-parser');
const express       = require('express');
const passport      = require('passport');
require('./passport')(passport);

module.exports = function (app) {
	app.set('view engine', 'ejs');
	if (config.isDevelopmentEnv())
		app.use(morgan('dev'));

	app.use(cookieParser());
	app.use(bodyParser.json({ extended: true }));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(cookieSession({
		secret: config.sessionSecret,
		saveUninitialized: true,
		resave: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use(express.static('views'));
};
