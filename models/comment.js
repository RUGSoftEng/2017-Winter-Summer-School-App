'use strict';

const mongoose = require('mongoose'),
	Schema = mongoose.Schema;


const CommentSchema = new Schema({
	text: {
		type: String,
		required: 'A comment needs to have a text',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now()
	},
	author: {
		type: String,
		required: 'A comment needs an author',
		trim: true
	},
	posterID: {
		type: String,
		trim: true,
		required: 'A comment needs the id of the poster'
	},
	imgURL: {
		type: String,
		default: "",
		trim: true
	},
	parentThread: {
		type: String,
		required: 'A comment needs a parent thread'
	},
	edited: {
		type: Date
	}
});

mongoose.model('comment', CommentSchema);
