var app = angular.module("app", []);

app.controller("MyCtrl", function ($http) {

  top.window.addEventListener("message", function (message) {
    if (message.data.type === "callUrl") {
      // unsubscribing by visiting
      $http.get(message.data.url);
    }
    else if (message.data.type === "redirect") {
      window.open("http://localhost:8080/redirect.html");
    }
  });

});