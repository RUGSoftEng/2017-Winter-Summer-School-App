var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var passport = require('passport');
var app = express();
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongojs = require('mongojs')
//this is the database connected to the app the first part of the parenthesis
//is the mongodb database and the second part the collections you use
var db = mongojs('mongodb://admin:summerwinter@ds119370.mlab.com:19370/summerwinter',['announcements','generalinfo'])

require('./config/passport')(passport);

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({
    secret: 'summerwinter',
    saveUninitialized: true,
    resave: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/routes.js')(app,db,passport);


app.listen(8080);
console.log('8080 is the magic port');
