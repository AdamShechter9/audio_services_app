// usersController
TopApp.controller('usersController', function ($scope, userFactory, messageFactory) {
	$scope.users = [];
	$scope.messageUser = {};

	//console.log("usersController");

	$scope.sessionProgress = false;

	var getAllUsers = function () {
		userFactory.getAllUsers(function (data) {
			//console.log("usersController=>getAllUsers->",data);
			$scope.users = data;
		});
	};
	$scope.deleteUser = function (user) {
		//console.log("deleteUser", user);
		if (user.email === ADMIN) {
			alert("can't delete administrator!");
		} else {
			var confirmed = confirm("this can't be undone!");
			if (confirmed) {
				userFactory.deleteUser(user, function(data) {
					if (data) {
						//console.log("error", data);
					} else {
						getAllUsers();
					}

				})
			}
		}
	};
	$scope.messageUserNew = function (user) {
		$scope.messageUser.from = ADMINTITLE;
		$scope.messageUser.name = user.first_name + " " + user.last_name;
		$scope.messageUser.userid = user.userid;
		$scope.messageUser.email = user.email;
		$("#messageNewModal").openModal();
	};

	$scope.newMessage = function () {
		if ($scope.title != undefined && $scope.title != "") {
			if ($scope.new_text != undefined && $scope.new_text != "") {
				if ($scope.new_text.length > 3) {
					var newMessage = {};
					newMessage.title = $scope.title;
					newMessage.text = $scope.new_text;
					newMessage.name = ADMINTITLE;
					newMessage.email = $scope.messageUser.email;
					newMessage.userid = $scope.messageUser.userid;
					newMessage.to = $scope.messageUser.name;
					//console.log(newMessage);
					messageFactory.createMessage(newMessage, function (){
					});
					$scope.title = "";
					$scope.new_text = "";
				} else {
					Materialize.toast('Message needs to be longer', 6000);
				}
			} else {
				Materialize.toast('Missing Body Text', 6000);
			}
		} else {
			Materialize.toast('Missing Title', 6000);
		}
	}
	function checkSession () {
		userFactory.sessionState( function (data) {
			$scope.currentSession = data;
			if ( $scope.currentSession.name == undefined ) {
				// no user logged in
				userFactory.inSession(function (response) {
					$scope.currentSession = response;
					if ($scope.currentSession.name == undefined || $scope.currentSession.email != ADMIN) {
						// reroute to HOME
						//console.log("no user logged in.");
						location.replace("/");
					}
					//console.log("uploadFileController->",$scope.sessionProgress,$scope.currentSession.name);
				});
			} else if ($scope.currentSession.email != ADMIN) {
				//console.log("no user logged in.");
				location.replace("/");
			}
			$scope.sessionProgress = true;
			getAllUsers();
		})
	}
	checkSession();
});
