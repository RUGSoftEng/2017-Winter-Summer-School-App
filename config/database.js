var testing = false;
process.argv.forEach(function (val, index, array) {
    if(val === 'test') testing = true;
});

exports.isLoggedIn = function (req, res, next) {
    if (testing === true || req.isAuthenticated())
        return next();

    res.redirect('/');
};

exports.mongojs = require('mongojs');
exports.db      = exports.mongojs('mongodb://admin:summerwinter@ds119370.mlab.com:19370/summerwinter', ['announcements', 'generalinfo']);