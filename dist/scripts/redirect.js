/**
*  Module
*
* Description
*/
var app = angular.module('app', ['ngRoute', 'AdalAngular', 'ngAnimate']);

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

	// check for adal stuff
	if (!localStorage.getItem('adal.start.page') && top.window !== window) {
		top.window.postMessage({
			type: "redirect"
		}, "*");
		return;
	}

	adalAuthenticationServiceProvider.init({
		// tenant: 'dxdev01.onmicrosoft.com',
		clientId: 'e5648932-409f-48ee-a297-611c375592df',
		endpoints: endpoints,
		cacheLocation: 'localStorage'
	}, $httpProvider);
}]);

app.controller('HomeController', ['$http', '$scope', '$q', function ($http, $scope, $q) {
	var vm = this;
	var junkFolderId = "";

	var filterForUnsubscribe = function (emails) {
		var emails = emails.map(function (email) {
			var links = $(email.Body.Content).find("a");
			for (var i = 0; i < links.length; i++) {
				if ($(links[i]).text().toLowerCase().indexOf("unsubscribe") >= 0) {
					email.unsubscribeLink = $(links[i]).attr('href');
					return email;
				}
			}
			return null;
		}).filter(function(email) { return !!email; });

		return emails;
	};

	var getMessages = function () {
		$http.get("https://outlook.office365.com/api/v1.0/me/messages").then(function (response) {
			console.log("success");
			console.log(response);
			vm.emails = filterForUnsubscribe(response.data.value);
		}, function (error) {
			console.log("error");
			console.log(error);
		});
	};
	getMessages();

	// get "Junk" folder id
	$http.get("https://outlook.office365.com/api/v1.0/me/folders").then(function (response) {
		var folders = response.data.value;
		folders.forEach(function (folder) {
			if (folder.DisplayName === "Junk Email") {
				junkFolderId = folder.Id;
				console.log("Junk Folder found");
			}
		});
	});

	var unsubscribe = function (email) {
		return $http.post("https://outlook.office365.com/api/v1.0/me/messages/" + email.Id + "/move", {
			DestinationId: junkFolderId
		}).then(function (response) {
			top.window.postMessage({
				type: "callUrl",
				url: email.unsubscribeLink
			}, "*");
		}, function (error) {
			console.log("error");
			console.log(error);
		});
	};

	$scope.unsubscribeAll = function (emails) {
		var dfds = [];
		emails.forEach(function (email) {
			dfds.push(unsubscribe(email));
		});

		$q.all(dfds).then(function() {
			// document.location.reload();
			getMessages();
		});
	};

	$scope.unsubscribe = function (email) {
		// move to Junk folder
		unsubscribe(email).then(function () {
			// document.location.reload();
			getMessages();
		});
	};
}]);

// TODO: Video

// TODO: Package & Upload

