// CONTROLLER
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var uniqueIdGen = require('../modules/uniqueIdGenerator.js');
var User = mongoose.model('User');
var session = require('express-session');
var mailgun = require('mailgun-js')({apiKey: "key-731e882fcc6208dd54aa8fa7007844ad", domain: "mg.warp9audio.co"});


module.exports = {
	getUsers: function (req, res) {
		console.log("getUsers");
		User.find({}, (err, users) => {
			console.log(users);
			if (!users) {
				res.json({users: "no users found"});
			} else {
				res.json({users: users});
			}
		})
	},

	checkEmail: function (req, res) {
		// Check if email exists in Users DB.
		console.log("checkEmail->", req.params.email);
		User.findOne({ email: req.params.email}, function (err, user) {
			console.log(user);
			if (!user) {
				res.json({result: "not found"});
			} else {
				res.json({result: "found"});
			}
		})
	},
	createUser: function (req, res) {
		// create a new user in the Users DB.
		console.log("createUser", req.body);
		var newUser = new User();
		newUser.first_name = req.body.first_name;
		newUser.last_name= req.body.last_name;
		newUser.email = req.body.email;
		newUser.userid = uniqueIdGen.uniqueIdGenerate(8, 'aA#');
		newUser.confirm = false;
		newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
		newUser.save(function (err) {
		 	if (err) {
				console.log("error! ", err);
				res.json({error: "error creating user"});
			} else {
				//send email confirmation
				var myUrl = "http://www.warp9audio.co/users/confirm?email="+encodeURI(newUser.email)+"&userid="+encodeURI(newUser.userid);
				var data = {
				  from: 'Warp9 Audio <warp9audio@mg.warp9audio.co>',
				  to: newUser.email,
				  subject: 'New User Registration for www.warp9audio.co',
				  text: 'Hi!\nYou\'ve signed up to register for www.warp9audio.co\nPlease click the following link to activate the account.\n'+myUrl+'\nLooking forward to seeing you on the site!\nAdam Shechter',
					html: "<html>Hi!<br>You've signed up to register for <em>www.warp9audio.co</em><br>Please click the following link to activate the account.<br><a href='"+myUrl+"'>Confirm Address</a><br>Looking forward to seeing you on the site!<br>Adam Shechter</html>"
				};
				console.log("sending confirmation email to ", newUser.email);
				console.log(data);
				mailgun.messages().send(data, function (error, body) {
				  console.log(body);
				});

				res.json({status: "user created.  awaiting confirmation."})
			}
		})
	},
	confirmUserEmail: function (req, res) {
		// confirms user's email.
		console.log("confirmUserEmail->", req.query.email);
		User.findOne({ email: req.query.email}, function (err, user) {
			//console.log(user);
			if (!user) {
				res.json({error: "not found"});
			} else {
				if (user.userid == req.query.userid) {
					// user confirmed and verified
					user.confirm = true;
					user.save(function (err) {
						res.send("User confirmed!  Feel free to login to website using your credentials.")
					})
				} else {
					res.json({error: "error with verification.  data does not match."});
				}

			}
		})
	},
	logInUser: function (req, res) {
		// Checks credentials and logs in if correct.
		console.log("logInUser", req.body);
		User.findOne({email: req.body.email}, (err, user) => {
			console.log(user);
			if (err) {
				res.json({error: "error"});
			} else {
				if (user != null && user.confirm) {
					console.log("logging in", user);
					if (bcrypt.compareSync(req.body.password, user.password)) {
						var sessionuser = {
							name: user.first_name + " " + user.last_name,
							userid: user.userid,
							email: user.email
						};
						req.session.name = sessionuser.name;
						req.session.userid = sessionuser.userid;
						req.session.email = sessionuser.email;
						console.log("Success", sessionuser);
						req.session.save();
						res.json({sessionuser});
					} else {
						res.json({error: "password invalid"});
					}
				} else {
					res.json({error: "No user to match in database, or pending email confirmation."});
				}

			}
		});
	},
	removeUser: function (req, res) {
		// remove user in the Users DB.
		console.log("removeUser", req.body);
		var deleteUser = req.body;
		User.remove({_id: deleteUser._id}, function (err) {
			if (err) {
				console.log("error! ", err);
				res.json({error: "error deleting user"});
			} else {
				res.json({response: "user deleted"});
			}
		})
	}
}
