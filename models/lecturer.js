'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Validator = require('validator');

var validateUrl = function(url) {
	return Validator.isURL(url);
};

var LecturerSchema = new Schema({
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