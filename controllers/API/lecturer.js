"use strict";

const router = require("express").Router();
const auth = require("../../config/lib/authorisation.js");
const multer = require("multer");
const crypto = require("crypto");
const mime = require("mime");
const fs = require("fs");
const Lecturer = require("mongoose").model("lecturer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./views/images/");
	},
	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			cb(null, raw.toString("hex") + Date.now() + "." + mime.extension(file.mimetype));
		});
	}
});
const upload = multer({ storage: storage });

router.delete("/API/lecturer", auth.isAuthorised("ALTER_LECTURERS"), function (req, res, next) {
	// first get the document so you can delete the old picture path.
	Lecturer.findOneAndRemove({ _id: req.query.id }, function (err, user) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			if (user.imagepath) { // image is optional
				fs.unlink("." + "/views/" + user.imagepath, function (err) {
					if (err) {
						err.shouldReload = true;
						err.status = 400;
						next(err);
					} else {
						res.sendStatus(200);
					}
				});
			} else {
				res.sendStatus(200);
			}
		}
	});
});


router.post("/API/lecturer", upload.single("img[]"), auth.isAuthorised("ALTER_LECTURERS"), function (req, res, next) {
	const newLecturer = new Lecturer({
		name: req.body.title,
		description: req.body.description,
		imagepath: typeof req.file !== "undefined" ? "/images/" + req.file.filename : undefined,
		website: req.body.website,
		school: req.body.school
	});
	newLecturer.save(function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.redirect("/lecturerpage");
		}
	});
});

router.put("/API/lecturer", auth.isAuthorised("ALTER_LECTURERS"), function (req, res, next) {
	Lecturer.findOneAndUpdate({ "_id": req.query.id }, {
		name: req.query.title,
		description: req.query.description,
		imagepath: req.query.imagepath,
		website: req.query.website
	}, function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.get("/API/lecturer", function (req, res, next) {
	if (req.query.id) {
		req.query._id = req.query.id;
		delete req.query.id;
	}
	const count = parseInt(req.query.count);
	delete req.query.count;
	Lecturer
		.find(req.query)
		.sort({ $natural: -1 })
		.limit(count || 200)
		.exec(function (err, lecturers) {
			if (err) {
				err.apiCall = true;
				err.status = 400;
				next(err);
			} else {
				res.send(lecturers);
			}
		});

});


module.exports = router;
