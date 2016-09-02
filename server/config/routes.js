var UsersController = require('../controllers/users.js');

module.exports = function (app) {
	app.get('/users/check/:email', function (req, res) {
		console.log("check->", req.params.email);
		UsersController.checkEmail(req, res);
	})
	app.post('/users/register', function (req, res) {
		console.log("register->sent over", req.body);
		UsersController.createUser(req, res);  
	})
	app.post('/users/login', function (req, res) {
		console.log("login->sent over", req.body);
		UsersController.logInUser(req, res);
	})
	app.get('/users/logout', function (req, res) {
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
	app.get('/users/settings/:userid', function (req, res) {
		res.end();
	})
	app.post('/users/settings/:userid/change', function (req, res) {
		console.log("changesettings->sent over", req.body);
		res.end();
	})
	app.post('/contact', function (req, res) {
		console.log("contact->sent over", req.body);
		res.end();
	})
	app.get('/messages/:userid', function (req, res) {

	})
	app.post('/messages/:userid/send', function (req, res) {

	})
	app.post('/messages/:userid/upload', function (req, res) {

	})
}