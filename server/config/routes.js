var UsersController = require('../controllers/users.js');
var MessagesController = require('../controllers/messages.js');

module.exports = function (app) {
	app.get('/users/check/:email', function (req, res) {
		// check for existing email account
		console.log("check->", req.params.email);
		UsersController.checkEmail(req, res);
	})
	app.post('/users/register', function (req, res) {
		// register a new user to database
		console.log("register->sent over", req.body);
		UsersController.createUser(req, res);  
	})
	app.post('/users/login', function (req, res) {
		// login user to database
		console.log("login->sent over", req.body);
		UsersController.logInUser(req, res);
	})
	app.get('/users/logout', function (req, res) {
		// log out user from database
		console.log("logging out user", req.session.name);
		req.session.destroy(function (err) {
			if (err) {
				console.log("error! ", err);
				res.json({error: "error logging out"});
			} else {
				console.log("logged out");
				res.redirect('/');
			}
		});
	})
	app.get('/users/current', function (req, res) {
		// return current user name.  returns undefined if no session.
		console.log("current user is:", req.session.name);
		if (req.session.name === undefined) {
			res.json({error: "no user logged in"});
		} else {
			var sessionuser = {
				name: req.session.name,
				userid: req.session.userid,
				email: req.session.email
			};
			res.json({sessionuser});
		}
	})
	app.get('/users/settings', function (req, res) {
		res.end();
	})
	app.post('/users/settings/change', function (req, res) {
		console.log("changesettings->sent over", req.body);
		res.end();
	})
	app.post('/contact', function (req, res) {
		// contact form send 
		console.log("contact->sent over", req.body);
		res.end();
	})
	app.get('/messages', function (req, res) {
		// get all messages from user inbox
		console.log("getting messages for user", req.session.userid);
		MessagesController.getMessages(req, res);
	})
	app.post('/messages/send', function (req, res) {
		// send a new message and store in database
		console.log("sending message for user", req.session.userid);
		MessagesController.createMessage(req, res);
	})
	app.post('/messages/upload', function (req, res) {
		// upload a file 
		console.log("Uploading file for user", req.session.userid);
		MessagesController.uploadFile(req, res);
	})
}