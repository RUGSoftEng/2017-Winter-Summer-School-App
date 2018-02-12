"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const bcrypt = require("bcrypt-nodejs");
const saltRounds = 8;

/**
 * Validation for the usernames
 * A username needs to be between 4 and 20 alphanumerical characters long.
 *
 * @param {string} username
 * @return {boolean}
 * @private
 */
const validateUsername = function (username) {
	const regex = /^[a-zA-Z0-9]{4,20}$/;
	return username && regex.test(username);
};

/**
 * Validation for the passwords
 * A password needs to be between 8 and 30 characters long and may only contain.
 *
 * @param {string} password
 * @return {boolean}
 * @private
 */
const validatePassword = function (password) {
	const regex = /^[a-zA-Z0-9!@#$_]{8,30}$/;
	return password && regex.test(password);
};

const removeSchoolIfAdmin = function (school) {
	if (this.rank !== "admin") {
		return school;
	}
};

const AccountSchema = new Schema({
	username: {
		type: String,
		unique: "Username already exists",
		required: "Username can not be empty",
		validate: [validateUsername, "A username needs to be between 4 and 20 " +
		"characters and can only contain alphanumerical characters."]
	},
	password: {
		type: String,
		required: "Password can not be empty",
		validate: [validatePassword, "A password needs to be between 8 and 30 characters long" +
		" and can only have alphanumerical characters and !@#$_"]
	},
	rank: {
		type: String,
		enum: require("../public/dist/js/userRights").roles,
		required: "A user needs a role."
	},
	school: {
		type: Schema.ObjectId,
		set: removeSchoolIfAdmin,
		ref: "school"
	}
});

/**
 * Hook a pre save method to hash the password
 */
AccountSchema.pre("save", function (next) {
	const user = this;

	if (!user.isModified("password")) return next();
	bcrypt.genSalt(saltRounds, function (err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});


mongoose.model("account", AccountSchema);
