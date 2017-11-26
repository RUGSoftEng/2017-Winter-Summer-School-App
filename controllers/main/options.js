const express = require('express');

const router = express.Router();
const data   = require('../../config/database.js');
const Alert  = require('../../config/alert.js');

router.get('/options', data.isAuthorised("VIEW_OPTIONS"), function (req, res) {
	const user = req.user || "";
	var alert = new Alert();
	alert.initiate(req);

	data.db.accounts.find(function (err, docs) {
		data.db.loginCodes.find(function (err, docs2) {
			data.db.forum.find(function (err, docs3) {
				data.db.schools.find(function (err, docs4) {
					res.render('options.ejs', {
						user: user,
						accounts: docs,
						loginCodes: docs2,
						forum: docs3,
						schools: docs4,
						alert: alert
					});
				});
			});
		});
	});
});

module.exports = router;
