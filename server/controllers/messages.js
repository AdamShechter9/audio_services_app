// CONTROLLER
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

module.exports = {
	getMessages: function (req, res) {
		// get all messages for user
		console.log("check messages for user", req.session.email);
		res.end();
	},
	createMessage: function (req, res) {
		console.log("create a new message from", req.session.name);
		res.end();
	},
	uploadFile: function (req, res) {
		console.log("upload a file from ", req.session.name);
		res.end();
	}

}
