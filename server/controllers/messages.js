// CONTROLLER
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

module.exports = {
	getMessages: function (req, res) {
		// get all messages for user
		console.log("check messages for user", req.session.email);
		Message.find({userid: req.session.userid}, function (err, messages) {
			// console.log("all messages for", req.session.email, messages);
			if (messages == null || messages === undefined) {
				res.json({messages: []});
			} else {
				res.json({messages: messages});
			}
		})
	},
	getAllMessages: function (req, res) {
		// get all messages for user
		console.log("check messages for admin", req.session.email);
		Message.find({}, function (err, messages) {
			// console.log("all messages for admin");
			if (messages == null || messages === undefined) {
				res.json({messages: []});
			} else {
				res.json({messages: messages});
			}
		})
	},
	readMessage: function (req, res) {
		console.log("marking message as read", req.body._id);
		Message.findOne({_id: req.body._id}, function (err, message) {
			if (message == null || message === undefined) {
				res.json({error: "not found"});
			} else {
				message.read = true;
				message.save(function(err) {
					res.json({message: "marked as read"});
				})
			}
		})
	},
	archiveMessage: function (req, res) {
		console.log("marking message as archived", req.body._id);
		Message.findOne({_id: req.body._id}, function (err, message) {
			if (message == null || message === undefined) {
				res.json({error: "not found"});
			} else {
				message.userid = "archived";
				message.save(function(err) {
					res.json({message: "marked as archived"});
				})
			}
		})
	},
	createMessage: function (req, res) {
		console.log("create a new message from", req.session.name);
		// console.log(req.body);

		var newMessage = new Message();
		newMessage.title = req.body.title;
		newMessage.text = req.body.text;
		newMessage.name = req.body.name;
		newMessage.email = req.body.email;
		newMessage.read = false;
		newMessage.userid = req.body.userid;
		newMessage.to = req.body.to;

		newMessage.save(function (err) {
			console.log("saving message");
		});

		res.json("success");
		
	},
	uploadFile: function (req, res) {
		console.log("upload a file from ", req.session.name);
		res.end();
	}

}
