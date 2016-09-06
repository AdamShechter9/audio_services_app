var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
	first_name: {type: String, minlength: 2, required: true},
	last_name: {type: String, minlength: 2, required: true},
	email: {type: String, minlength: 3, required: true},
	text: {type: String, minlength: 3, required: true},
	read: {type: Boolean, default: false},
	title: {type: String}
	userid: {type: String, required: true}
}, {timestamps: true});

mongoose.model('Message', MessageSchema);