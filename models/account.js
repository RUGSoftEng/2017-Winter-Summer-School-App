'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs');
const saltRounds = 8;

/**
 * Validation for the usernames
 * A username needs to be between 4 and 20 alphanumerical characters long.
 *
 * @param {string} username
 * @return {boolean}
 * @private
 */
var validateUsername = function (username) {
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
var validatePassword = function (password) {
	const regex = /^[a-zA-Z0-9!@#$_]{8,30}$/;
	return password && regex.test(password);
};

var AccountSchema = new Schema({
	username: {
		type: String,
		unique: 'Username already exists',
		required: 'Username can not be empty',
		validate: [validateUsername, 'A username needs to be between 4 and 20 characters and can only contain alphanumerical characters.']
	},
	password: {
		type: String,
		required: 'Password can not be empty',
		validate: [validatePassword, 'A password needs to be between 8 and 30 characters long and can only have alphanumerical characters and !@#$_']
	},
	rank: {
		type: String,
		enum: require('../config/userRights').roles,
		required: 'A user needs a role.'
	},
	school: {
		type: Schema.ObjectId,
		ref: 'school'
	}
});

/**
 * Hook a pre save method to hash the password
 */
AccountSchema.pre('save', function (next) {
	const oldPassword = this.password;
	this.password = this.hashPassword(this.password);
	if (oldPassword === this.password) {
		var err = new Error('Unable to hash password');
	}
	next(err);
});

/**
 * Create instance method for hashing a password
 */
AccountSchema.methods.hashPassword = function (password) {
	bcrypt.hash(password, saltRounds, null, function (err, hash) {
		return err ? password : hash;
	});
};

mongoose.model('account', AccountSchema);