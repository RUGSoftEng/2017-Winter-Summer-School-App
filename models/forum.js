'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ForumSchema = new Schema({
	title: {
		type: String,
		required: 'Title can not be empty',
		trim: true
	},
	description: {
		type: String,
		required: 'Description can not be empty',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	author: {
		type: String,
		required: 'A thread needs an author',
		trim: true
	},
	posterID: {
		type: String,
		trim: true,
		required: 'A thread needs the id of the poster'
	},
	imgurl: {
		type: String,
		trim: true
	},
	comments: { // todo: validate inserted comments?
		type: Array,
		default: []
	}
});

mongoose.model('forum', ForumSchema);