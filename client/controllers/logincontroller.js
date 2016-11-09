// loginController
TopApp.controller('loginController', function ($scope, userFactory, $location) {
	//console.log("loginController");

	$scope.loginUser = function () {
		var user = {
			email: $scope.email,
			password: $scope.password
		};
		//console.log("loginController", user);
		userFactory.loginUser(user, function (response) {
			if (response === "success") {
				// logged in user
				//console.log("successfully logged in user!");
				$('#modal1').closeModal();
				location.reload();
			} else {
				Materialize.toast(response, 6000);
			}
		})
	}
});
