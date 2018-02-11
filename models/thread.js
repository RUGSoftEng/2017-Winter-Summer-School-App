"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const ThreadSchema = new Schema({
	title: {
		type: String,
		required: "Title can not be empty",
		trim: true
	},
	description: {
		type: String,
		required: "Description can not be empty",
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	author: {
		type: String,
		required: "A thread needs an author",
		trim: true
	},
	posterID: {
		type: String,
		trim: true,
		required: "A thread needs the id of the poster"
	},
	imgURL: {
		type: String,
		trim: true
	},
	comments: {
		type: [String],
		default: []
	},
	school: {
		type: Schema.ObjectId,
		required: "A thread needs to be associated with some school."
	},
	edited: {type: Date}
});

mongoose.model("thread", ThreadSchema);

