const router = require('express').Router();
const auth = require(process.cwd() + '/config/lib/authorisation.js');
const User = require('mongoose').model('account');
const logger = require(process.cwd() + '/config/lib/logger');

router.delete('/API/user', auth.isAuthorised("ALTER_USERS"), function (req, res) {
	if (req.param('id') == req.user._id) {
		res.send(400);
	} else {
		User.findOneAndRemove({
			'_id': req.param('id')
		}, function (err) {
			if (err) {
				logger.warning("Can not delete user\n" + err);
				res.send(400);
			} else {
				res.send(200);
			}
		});
	}
});


router.post('/API/user', auth.isAuthorised("ALTER_USERS"), function (req, res) {
	var newAccount = new User(req.body);
	newAccount.save(function (err) {
		var alert = null;
		if (err) {
			logger.warning("Can not add new user\n" + err);
		}
	});
	res.redirect('/options');
});

router.get('/API/user', auth.isAuthorised("VIEW_OPTIONS"), function (req, res) {
	User
		.find({}, ['_id', 'username', 'rank', 'school']) // Do not show hashed password
		.limit(req.param('count') || 20)
		.exec(function (err, users) {
			if (err) {
				logger.warning('Can not retrieve users\n' + err);
				res.send(400);
			} else res.send(users);
		});
});


module.exports = router;
