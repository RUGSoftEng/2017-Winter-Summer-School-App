'use strict';

const mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Validation for the login codes
 * A login code needs to be 8 alphanumerical characters long.
 *
 * @param {string} code
 * @return {boolean}
 * @private
 */
const validateCode = function (code) {
	const regex = /^[a-zA-Z0-9]{8}$/;
	return code && regex.test(code);
};

const LoginCodeSchema = new Schema({
	code: {
		type: String,
		unique: 'Code already exists',
		required: 'Username can not be empty',
		validate: [validateCode, 'A code needs to be 8 characters long and can only contain alphanumerical characters.']
	},
	created: {
		type: Date,
		default: Date.now
	},
	school: {
		type: Schema.ObjectId,
		ref: 'school'
	}
});

mongoose.model('loginCode', LoginCodeSchema);
