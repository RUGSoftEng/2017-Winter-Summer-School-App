const router = require('express').Router();
const auth = require(process.cwd() + '/config/lib/authorisation.js');
const LoginCode = require('mongoose').model('loginCode');
const UserRights = require(process.cwd() + '/public/dist/js/userRights');
const logger = require(process.cwd() + '/config/lib/logger');

router.post('/API/loginCode', auth.isAuthorised("ALTER_LOGIN_CODES"), function (req, res) {
	const code = new LoginCode(req.body);
	code.save(function (err) {
		if (err) {
			logger.warning('Can not add login code\n' + err);
		}
		res.redirect('/options');
	});
});

router.get('/API/loginCode', function (req, res) {
	if(req.param('code')) {
		LoginCode.findOne({ code: req.param('code') }, function (err, code) {
			res.send(code ? code.school : 400);
		});
	} else if(UserRights.userHasRights(req.user, "VIEW_OPTIONS")) {
		LoginCode
			.find({})
			.limit(req.param('count') || 20)
			.exec(function (err, codes) {
				if (err) {
					logger.warning('Can not retrieve login code\n' + err);
					res.send(400);
				} else res.send(codes);
			});
	} else res.send(403);
});

router.delete('/API/loginCode', auth.isAuthorised("ALTER_LOGIN_CODES"), function (req, res) {
	LoginCode.findOneAndRemove({
		'_id': req.param('id')
	}, function (err) {
		if (err) {
			logger.warning('Can not delete login code\n' + err);
			res.send(400);
		} else res.send(200);
	});
});


module.exports = router;
