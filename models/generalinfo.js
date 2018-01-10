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
		enum: require('../public/dist/js/categories').categories,
		required: 'General information requires a category'
	}
});

mongoose.model('generalinfo', GeneralinfoSchema);