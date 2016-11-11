TopApp.factory('userFactory', function ($http) {
	var factory = {};
	var sessionUser = {};

	factory.sessionState = function (callback) {
		//console.log("sessionState Check", sessionUser);
		callback (sessionUser);
	}

	factory.inSession = function (callback) {
		//console.log("inSession check");
		$http.get('/users/current').then(function(data) {
			//console.log(data);
			if (data.data.hasOwnProperty('error')) {
				//console.log(data.data.error);
				callback(data.data.error);
			} else {
				sessionUser = data.data.user;
				if (sessionUser.email === ADMIN) {
					sessionUser.name = ADMINTITLE;
				}
				callback(sessionUser);
			}
		})
	};

	factory.getAllUsers = function (callback) {
		//console.log("getAllUsers");
		$http.get('/users/admin').then(function(data) {
			//console.log("getAllUsers callback", data);
			if (data.data.hasOwnProperty('error')) {
				//console.log(data.data.error);
				callback(data.data.error);
			} else {
				if (sessionUser.email === ADMIN) {
					callback(data.data.users);
				}
			}
		})
	};

	factory.deleteUser = function (user, callback) {
		//console.log("deleteUser", user);
		$http.post('users/admin/remove', user).then(function(data) {
			if (data.data.hasOwnProperty('error')) {
				//console.log(data.data.error);
				callback(data.data.error);
			} else {
				callback();
			}
		})
	};

	factory.createUser = function (newUser, callback) {
		//console.log("createUser->",newUser);
		$http.get('/users/check/'+newUser.email).then(function(data) {
			if (data.data.result === "not found") {
				$http.post('/users/register', newUser).then(function(data) {
					//console.log("createUser->post->callback", data);
					if (data.data.hasOwnProperty('error')) {
						callback(data.data.error);
					} else {
						callback("success");
					}
				})
			} else if (data.data.result === "found"){
				callback("user exists");
			}
		})
	};
	factory.loginUser = function (user, callback) {
		//console.log("loginUser", user);
		$http.post('/users/login', user).then(function(data) {
			//sign in user
			//console.log("loginUser->post->callback", data);
			if (data.data.hasOwnProperty('error')) {
				callback(data.data.error);
			} else {
				sessionUser = data.sessionuser;
				callback("success");
			}
		})
	};
	factory.logoutUser = function (user, callback) {
		//console.log("logoutUser", user);
		$http.get('/users/logout').then(function(data) {
			if (data.hasOwnProperty('error')) {
				callback(data.error);
			} else {
				sessionUser = {};
				callback("success");
			}
		})
	};
	return factory;
});
