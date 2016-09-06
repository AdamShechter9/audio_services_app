// CONTROLLER
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

module.exports = {
	getMessages: function (req, res) {
		// get all messages for user
		console.log("check messages for user", req.session.email);
		Message.find({userid: req.session.userid}, function (err, messages) {
			console.log("all messages for", req.session.email, messages);
			if (messages == null || messages === undefined) {
				res.json({messages: []});
			} else {
				res.json({messages: messages});
			}
		})
		
	},
	createMessage: function (req, res) {
		console.log("create a new message from", req.session.name);
		// console.log(req.body);

		var newMessage = new Message();
		newMessage.title = req.body.title;
		newMessage.text = req.body.text;
		newMessage.name = req.session.name;
		newMessage.email = req.session.email;
		newMessage.read = false;
		newMessage.userid = req.session.userid;
		newMessage.to = "Warp9 Audio";

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
