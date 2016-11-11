var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	first_name: {type: String, minlength: 2, required: true},
	last_name: {type: String, minlength: 2, required: true},
	email: {type: String, minlength: 3, required: true},
	password: {type: String, minlength: 6, required: true},
	userid: {type: String, required: true, index: true},
	confirm: {type: Boolean, required: true, default: false}
}, {timestamps: true});

mongoose.model('User', UserSchema);
