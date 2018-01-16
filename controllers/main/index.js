const router = require('express').Router();
const auth = require(process.cwd() + '/config/lib/authorisation.js');

router.get('/main', auth.isAuthorised("ACCESS_MAIN_OVERVIEW"), function (req, res) {
	res.render('loggedIn.ejs', {
		user: req.user || {}
	});
});

module.exports = router;
