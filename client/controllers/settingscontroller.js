// settingsController
TopApp.controller('settingsController', function ($scope, userFactory) {
	//console.log("settingsController");
	function checkSession () {
		userFactory.sessionState( function (data) {
			$scope.currentSession = data;
			if ( $scope.currentSession.name == undefined ) {
				// no user logged in
				userFactory.inSession(function (response) {
					$scope.currentSession = response;
					if ($scope.currentSession.name == undefined) {
						// reroute to HOME
						//console.log("no user logged in.");
						location.replace("/");
					}
					//console.log("uploadFileController->",$scope.sessionProgress,$scope.currentSession.name);
				});
			}
			$scope.sessionProgress = true;

		})
	}
	checkSession();
});
