/*
 * This controller serves as an API to add tokens (FireBase user tokens) to
 * our database. The mobile application can send a post request to this url
 * which would then be stored in the database by this controller.
 * TODO: Verify token, increase security
 */

const router  = require('express').Router();
const Token = require('mongoose').model('token');
const logger = require(process.cwd() + '/config/lib/logger');

router.post('/API/token', function (req, res) {
	// adds a new token
	const newToken = new Token({
		token: req.body.id
	});

	newToken.save(function (err) {
		if (err) {
			logger.warning('Can not add token\n' + err);
			res.send(400);
		} else {
			res.send(200);
		}
	});
});


module.exports = router;
