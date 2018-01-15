const router  = require('express').Router();
const auth    = require('../../config/lib/authorisation.js');
const Generalinfo = require('mongoose').model('generalinfo');
const logger = require(process.cwd() + '/config/lib/logger');

router.delete('/API/generalinfo', auth.isAuthorised("ALTER_GENERAL_INFO"), function (req, res) {
	Generalinfo.findOneAndRemove({
		'_id': req.param('id')
	}, function (err) {
		if (err) {
			logger.warning('Can not delete general info\n' + err);
			res.send(400);
		} else {
			res.send(200);
		}
	});

});

router.put('/API/generalinfo', auth.isAuthorised("ALTER_GENERAL_INFO"), function (req, res) {
	Generalinfo.findOneAndUpdate({
		'_id': req.param('id')
	}, {
		$set: {
			title: req.param('title'),
			description: req.param('description'),
			category: req.param('category')
		}
	}, function (err) {
		if (err) {
			logger.warning('Can not edit general info\n' + err);
			res.send(400);
		} else {
			res.send(200);
		}
	});

});


router.post('/API/generalinfo', auth.isAuthorised("ALTER_GENERAL_INFO"), function (req, res) {
	const newGeneralInfo = new Generalinfo(req.body);
	newGeneralInfo.save(function (err) {
		if (err) {
			logger.warning(err);
		}
		res.redirect('/main');
	});

});

router.get('/API/generalinfo', function (req, res) {
	Generalinfo
		.find({})
		.sort({ $natural: -1 })
		.limit(req.param('count') || 200)
		.exec(function (err, generalinfo) {
			if (err) {
				logger.warning('Can not retrieve general info\n' + err);
				res.send(400);
			} else res.send(generalinfo);
		});
});

module.exports = router;
