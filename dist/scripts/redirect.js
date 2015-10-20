/**
*  Module
*
* Description
*/
var app = angular.module('app', ['ngRoute', 'AdalAngular']);

app.config(['$routeProvider', '$httpProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, adalAuthenticationServiceProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeController',
			controllerAs: 'home',
			requireADLogin: true
		})

		.otherwise({
			redirectTo: '/'
		});

	var endpoints = {
		'https://outlook.office365.com': 'https://outlook.office365.com'
	};

	adalAuthenticationServiceProvider.init({
		// tenant: 'dxdev01.onmicrosoft.com',
		clientId: 'e5648932-409f-48ee-a297-611c375592df',
		endpoints: endpoints,
		cacheLocation: 'localStorage'
	}, $httpProvider);
	console.log("done");
}]);

app.controller('HomeController', ['$http', '$scope', function ($http, $scope) {
	var vm = this;

	var filterForUnsubscribe = function (emails) {
		return emails.filter(function (email) {
			var links = $(email.Body.Content).find("a");
			for (var i = 0; i < links.length; i++) {
				if ($(links[i]).text().toLowerCase().indexOf("unsubscribe") >= 0) {
					return true;
				}
			}
			return false;
		});
	};

	$http.get("https://outlook.office365.com/api/v1.0/me/messages").then(function (response) {
		console.log("success");
		console.log(response);
		vm.emails = filterForUnsubscribe(response.data.value);
	}, function (error) {
		console.log("error");
		console.log(error);
	});

	$scope.unsubscribe = function (emailId) {

	};
}]);