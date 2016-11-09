// registerController
TopApp.controller('registerController', function ($scope, userFactory) {
	//console.log("registerController");

	$scope.registerUser = function () {
		var inputValid = true;
		if (($scope.password != undefined)&&($scope.password != $scope.password_confirm)) {
			inputValid = false;
		}
		if ($scope.first_name === undefined || $scope.last_name === undefined || $scope.email === undefined) {
			inputValid = false;
		} else if ($scope.first_name.length < 2 || $scope.last_name.length < 2) {
			inputValid = false;
		}
		if (inputValid) {
			var user = {
				first_name: $scope.first_name,
				last_name: $scope.last_name,
				email: $scope.email,
				password: $scope.password
			};
			userFactory.createUser(user, function (response) {
				if (response == "success") {
					// created user
					//console.log("successfully created user!");
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
