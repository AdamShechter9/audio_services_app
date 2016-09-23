var ADMIN = "warp9mixmaster@gmail.com";
var ADMINTITLE = "Warp9 Audio";
// CONTROLLER
var mongoose = require('mongoose');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
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
        // create an incoming form object
        var form = new formidable.IncomingForm();
        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = true;
        // store all uploads in the /uploads/userid directory
        // make one if directory doesn't exist
        if(!fs.existsSync(path.join(__dirname, '../../client/uploads/' + req.session.userid))){
            fs.mkdirSync(path.join(__dirname, '../../client/uploads/' + req.session.userid), 0o766, function(err){
                if(err){
                    console.log(err);
                    response.send("ERROR! Can't make the directory! \n");    // echo the result back
                }
            });
        }
        form.uploadDir = path.join(__dirname, '../../client/uploads/' + req.session.userid);
        // every time a file has been uploaded successfully,
        // rename it to it's original name
        form.on('file', function(field, file) {
            fs.rename(file.path, path.join(form.uploadDir, file.name));
        });
        // log any errors that occur
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });
        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
            var newMessage = new Message();
            newMessage.title = "New Upload from "+req.session.name;
            newMessage.text = "A new upload was made by " + req.session.name + " for " + ADMINTITLE + ".";
            newMessage.name = req.session.name;
            newMessage.email = req.session.email;
            newMessage.read = false;
            newMessage.userid = req.session.userid;
            newMessage.to = ADMIN;

            newMessage.save(function (err) {
                console.log("saving message");
            });
            res.end('success');
        });
        // parse the incoming request containing the form data
        form.parse(req);

	}
};
