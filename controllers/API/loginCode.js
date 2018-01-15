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
	if(req.query.code) {
		LoginCode.findOne({ code: req.query.code }, function (err, code) {
			if (err || !code) {
				logger.warning("Could not find login code\n" + (err || 'The code does not exist'));
				res.sendStatus(400);
			} else res.send(code);
		});
	} else if(UserRights.userHasRights(req.user, "VIEW_OPTIONS")) {
		LoginCode
			.find({})
			.limit(req.query.count || 20)
			.exec(function (err, codes) {
				if (err) {
					logger.warning('Can not retrieve login code\n' + err);
					res.sendStatus(400);
				} else res.send(codes);
			});
	} else res.sendStatus(403);
});

router.delete('/API/loginCode', auth.isAuthorised("ALTER_LOGIN_CODES"), function (req, res) {
	LoginCode.findOneAndRemove({
		'_id': req.body.id
	}, function (err) {
		if (err) {
			logger.warning('Can not delete login code\n' + err);
			res.sendStatus(400);
		} else res.sendStatus(200);
	});
});


module.exports = router;
