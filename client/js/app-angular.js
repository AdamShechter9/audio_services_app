// Angular Application
// Warp9 Mixing and Mastering Services
// adam.s.develop@gmail.com

var TopApp = angular.module('TopApp', ['ui.materialize']);



// -----------------------------------------------------------------
// DIRECTIVES



// -----------------------------------------------------------------
// FACTORIES
TopApp.factory('userFactory', function ($http) {
	var factory = {};
	var sessionuser = {};

	factory.inSession = function (callback) {
		console.log("inSession check");
		$http.get('/users/current').then(function(data) {
			console.log(data);
			if (data.data.hasOwnProperty('error')) {
				console.log(data.data.error);
				callback(data.data.error);
			} else {
				sessionuser = data.data.sessionuser;
				callback(sessionuser);
			}
		})
	}

	factory.createUser = function (newUser, callback) {
		console.log("createUser->",newUser);
		$http.get('/users/check/'+newUser.email).then(function(data) {
			if (data.data.result === "not found") {
				$http.post('/users/register', newUser).then(function(data) {
					console.log("createUser->post->callback", data);
					if (data.data.hasOwnProperty('error')) {
						callback(data.data.error);
					} else {
						sessionuser = data.data.sessionuser;
						callback("success");
					}
				})
			} else if (data.data.result === "found"){
				callback("user exists");
			}	
		})
	};
	factory.loginUser = function (user, callback) {
		console.log("loginUser", user);
		$http.post('/users/login', user).then(function(data) {
			//sign in user
			console.log("loginUser->post->callback", data);
			if (data.data.hasOwnProperty('error')) {
				callback(data.data.error);
			} else {
				sessionuser = data.sessionuser;
				callback("success");
			}
		})
	};
	factory.logoutUser = function (user, callback) {
		console.log("logoutUser", user);
		$http.get('/users/logout').then(function(data) {
			if (data.hasOwnProperty('error')) {
				callback(data.error);
			} else {
				sessionuser = {};
				callback("success");
			}
		})
	};
	return factory;
});

TopApp.factory('messageFactory', function () {
	var factory = {};
	var messages = [];

	return factory;
})


// -----------------------------------------------------------------
// CONTROLLERS
TopApp.controller('registerController', function ($scope, userFactory) {
	console.log("registerController");

	$scope.registerUser = function () {
		var inputValid = true;

		if (($scope.password != undefined)&&($scope.password != $scope.password_confirm)) {
			inputValid = false;
		}
		if ($scope.first_name === undefined || $scope.last_name === undefined || $scope.email === undefined) {
			inputValid = false;
		} else if ($scope.first_name.length < 2 || $scope.last_name.length < 2) {
			inputValid = false;
		};
		if (inputValid) {
			var user = {
				first_name: $scope.first_name,
				last_name: $scope.last_name,
				email: $scope.email,
				password: $scope.password
			}
			userFactory.createUser(user, function (response) {
				if (response == "success") {
					// created user
					console.log("successfully created user!");
					// reload page?
					$('#modal2').closeModal();
					location.reload();
				} else {
					Materialize.toast('User exists!', 6000);
				} 
			});
		} else {
			Materialize.toast('Error in form input!', 6000);
		}
	}

});

TopApp.controller('loginController', function ($scope, userFactory, $location) {
	console.log("loginController");
	
	$scope.loginUser = function () {
		var user = {
			email: $scope.email,
			password: $scope.password
		};
		console.log("loginController", user);
		userFactory.loginUser(user, function (response) {
			if (response === "success") {
				// logged in user
				console.log("successfully logged in user!");
				$('#modal1').closeModal();
				location.reload();
			} else {
				Materialize.toast(response, 6000);
			} 
		})	
	}


});

TopApp.controller('navbarController', function ($scope, userFactory) {
	$scope.sessionProgress = false;
	userFactory.inSession(function (response) {
		$scope.currentSession = response;
		if ($scope.currentSession.name != undefined) {
			$scope.sessionProgress = true;
		}
		console.log("navbarController->",$scope.sessionProgress,$scope.currentSession.name);
	});

});

TopApp.controller('contactFormController', function ($scope) {
	console.log("contactFormController");
})

TopApp.controller('uploadFileController', function ($scope) {
	console.log("uploadFileController");
})

TopApp.controller('messageController', function ($scope) {
	console.log("messageController");
})

TopApp.controller('settingsController', function ($scope) {
	console.log("settingsController");
})
