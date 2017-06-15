var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
require('./passport')(passport);

module.exports = function (app) {
    app.set('view engine', 'ejs');
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(session({
        secret: 'summerwinter',
        saveUninitialized: true,
        resave: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(express.static('views'));
};