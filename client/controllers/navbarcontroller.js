// navbarController
TopApp.controller('navbarController', function ($scope, userFactory) {
	$scope.sessionProgress = false;
	$scope.sessionAdmin = false;

	var checkSession = function () {
		userFactory.sessionState( function (data) {
			$scope.currentSession = data;
			if ( $scope.currentSession.name == undefined ) {
				// no user logged in
				userFactory.inSession(function (response) {
					$scope.currentSession = response;
					if ($scope.currentSession.name != undefined) {
						$scope.sessionProgress = true;
						if ($scope.currentSession.email === ADMIN) {
							$scope.sessionAdmin = true;
						}
					}
					//console.log("navbarController->",$scope.sessionProgress,$scope.currentSession.name);
				});
			}
		})
	};
	checkSession();
});
