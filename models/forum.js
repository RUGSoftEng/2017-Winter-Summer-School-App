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
        default: Date.now()
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
    imgURL: {
        type: String,
        trim: true
    },
    comments: {
        type: [String],
        default: []
    },
    edited: {
        type: Date
    }
});
mongoose.model('forum', ForumSchema);

var CommentSchema = new Schema({
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
        trim: true
    },
    edited: {
        type: Date
    }
});
mongoose.model('comment', CommentSchema);