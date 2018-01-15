const router = require('express').Router();

// sends 404 for random urls
router.get('/', function (req, res) {
	res.render('notFound.ejs', {user: req.user});
});

module.exports = router;
