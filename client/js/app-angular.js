// Angular Application
// Warp9 Mixing and Mastering Services
// adam.s.develop@gmail.com

var TopApp = angular.module('TopApp', ['ui.materialize', 'ngRoute']);

var ADMIN = "warp9mixmaster@gmail.com";
var ADMINTITLE = "Warp9 Audio";


// -----------------------------------------------------------------
// CONFIG
TopApp.config( function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: "/partials/home.html"
		})
		.when('/about', {
			templateUrl: "/partials/about.html"
		})
		.when('/contact', {
			templateUrl: "/partials/contact.html"
		})
		.when('/prices', {
			templateUrl: "/partials/prices.html"
		})
		.when('/uploadfile', {
			templateUrl: "/partials/uploadfile.html"
		})
		.when('/inbox', {
			templateUrl: "/partials/inbox.html"
		})
		.when('/usersboards', {
			templateUrl: "/partials/usersboards.html"
		})
		.otherwise({
			redirectTo: "/"
		});
})
// -----------------------------------------------------------------
// DIRECTIVES
TopApp.directive('navBar', function() {
	var directive = {
		restrict: 'E',
		scope: false,
		templateUrl: 'partials/navbar.html'
	};
	return directive;
});
