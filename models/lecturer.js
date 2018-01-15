'use strict';

const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Validator = require('validator');

const validateUrl = function(url) {
	return Validator.isURL(url);
};

const LecturerSchema = new Schema({
	name: {
		type: String,
		required: 'Lecturers require a name.',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	description: {
		type: String,
		required: 'Lecturers require a description.',
		trim: true
	},
	website: {
		type: String,
		trim: true,
		validate: [validateUrl, 'The given URL does not seem to be valid.']
	},
	imagepath: {
		type: String
	}
});

mongoose.model('lecturer', LecturerSchema);
