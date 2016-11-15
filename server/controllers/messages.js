var ADMIN = "warp9mixmaster@gmail.com";
var ADMINTITLE = "Warp9 Audio";
// CONTROLLER
var mongoose = require('mongoose');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var Message = mongoose.model('Message');
var mailgun = require('mailgun-js')({apiKey: "key-731e882fcc6208dd54aa8fa7007844ad", domain: "mg.warp9audio.co"});


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
		var contactForm = false;

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

		if (newMessage.userid === "contactForm") {
			contactForm = true;
		}

		console.log("newmessage", newMessage);
		newMessage.save(function (err) {
			console.log("saving message");
		});
		if (newMessage.to == ADMINTITLE) {
			newMessage.toEmail = ADMIN
		} else if (newMessage.name === ADMINTITLE) {
			newMessage.toEmail = newMessage.email
			newMessage.email = ADMIN
		}
		var data = {
			from: newMessage.name+" <"+newMessage.email+">",
			to: newMessage.to+" <"+newMessage.toEmail+">",
			subject: "[www.warp9audio.co] "+newMessage.title,
			text: newMessage.text+"\n\n\nMessage sent from [www.warp9audio.co] message system"
		};
		var data2 = {
			from: ADMINTITLE+" <"+ADMIN+">",
			to: newMessage.name+" <"+newMessage.email+">",
			subject: "[www.warp9audio.co] "+"CONTACT FORM MESSAGE SENT",
			text: "Thank you for contact warp9 audio services.\nWe'll do out best to get back to you as soon as we can.\n\n\nMessage sent from [www.warp9audio.co] message system"
		}
		console.log("sending email to ", newMessage.email, " from ",newMessage.name);
		console.log(data);
		mailgun.messages().send(data, function (error, body) {
			console.log(body);
		});
		mailgun.messages().send(data2, function (error, body) {
			console.log(body);
		});
		res.json("success");

	},
	uploadFile: function (req, res) {
		console.log("upload a file from ", req.session.name);
        // create an incoming form object
        var form = new formidable.IncomingForm();
				var fileList = [];
        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = true;
				form.type = true;
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
						fileList.push(file.name);
        });
        // log any errors that occur
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });
        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
						var fileListParsed = fileList.join("\n");
            var newMessage = new Message();
            newMessage.title = "[www.warp9audio.co] "+"New Upload from "+req.session.name;
            newMessage.text = "A new upload was made by " + req.session.name + " for " + ADMINTITLE + ".\n\nFILES:\n"+fileListParsed;
            newMessage.name = req.session.name;
            newMessage.email = req.session.email;
            newMessage.read = false;
            newMessage.userid = req.session.userid;
            newMessage.to = ADMIN;

            newMessage.save(function (err) {
                console.log("saving message");
            });
						var data = {
							from: newMessage.name+" <"+newMessage.email+">",
							to: newMessage.to,
							subject: newMessage.title,
							text: newMessage.text
						};
						console.log("sending email to ", newMessage.to, " from ",newMessage.email);
						console.log(data);
						mailgun.messages().send(data, function (error, body) {
							console.log(body);
						});
            res.end('success');
        });
        // parse the incoming request containing the form data
        form.parse(req);

	}
};
