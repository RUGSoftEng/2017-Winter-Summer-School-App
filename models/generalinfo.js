'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var GeneralinfoSchema = new Schema({
	title: {
		type: String,
		required: 'General information requires a title',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	description: {
		type: String,
		required: 'General information requires a description',
		trim: true
	},
	category: {
		type: String,
		enum: require('../config/categories')
	}
});

mongoose.model('generalinfo', GeneralinfoSchema);