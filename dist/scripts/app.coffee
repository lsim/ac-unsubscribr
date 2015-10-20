app = angular.module('app', [])

app.controller('MainCtrl', ['$scope', ($scope) ->
	$scope.unsubscribe = (mail) ->
		console.log "UNSUBSCRIBING ", mail
	$scope.mails = [1..100].map (index) -> 
		id: index
		text: "something something darkside something " + index
		subject: "something something darkside something " + index
])

