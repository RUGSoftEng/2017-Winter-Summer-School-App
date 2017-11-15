/*
 * This controller serves as an API to add tokens (FireBase user tokens) to
 * our database. The mobile application can send a post request to this url
 * which would then be stored in the database by this controller.
 * TODO: Verify token, increase security
 */

var express = require('express');
var router  = express.Router();
var Token = require('mongoose').model('token');

router.post('/token', function (req, res) {
	// adds a new token
	var newToken = new Token({
		token: req.body.id
	});

	newToken.save(function (err, result) {
		if (err) {
			console.log(err);
			res.send(400);
		} else {
			res.send(200);
		}
	});
});


module.exports = router;
