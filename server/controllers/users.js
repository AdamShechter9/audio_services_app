// CONTROLLER
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var uniqueIdGen = require('../modules/uniqueIdGenerator.js');
var User = mongoose.model('User');
var session = require('express-session');

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
		newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
		newUser.save(function (err) {
		 	if (err) {
				console.log("error! ", err);
				res.json({error: "error creating user"});
			} else {
				var sessionuser = {
					name: newUser.first_name + " " + newUser.last_name,
					userid: newUser.userid,
					email: newUser.email
				}
				req.session.name = sessionuser.name;
				req.session.userid = sessionuser.userid;
				req.session.email = sessionuser.email;
				console.log("Success", sessionuser);
				req.session.save();
				res.json({sessionuser});
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
				if (user != null) {
					console.log("logging in", user);
					if (bcrypt.compareSync(req.body.password, user.password)) {
						var sessionuser = {
							name: user.first_name + " " + user.last_name,
							userid: user.userid,
							email: user.email
						}
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
					res.json({error: "No user to match in database."});
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
