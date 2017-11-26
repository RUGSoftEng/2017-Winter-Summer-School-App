'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var TokenSchema = new Schema({
	token: {
		type: String,
		required: 'The token identifier is required.',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('token', TokenSchema);