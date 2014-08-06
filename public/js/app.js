(function () {

    var app = angular.module('chat',
        [
            'ngRoute',
            'login',
            'register',
            'lobby',
            'room',
            'utils'
        ]);

    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when('/',
                {
                    templateUrl: 'include/login.html',
                    controller: 'LoginController'
                })
            .when('/register',
                {
                    templateUrl: 'include/register.html',
                    controller: 'RegisterController'
                })
            .when('/lobby',
                {
                    templateUrl: 'include/lobby.html',
                    controller: 'LobbyController'
                })
            .when('/room',
                {
                    templateUrl: 'include/room.html',
                    controller: 'RoomController'
                })
            .otherwise(
                {
                    redirectTo: '/'
                });
    }]);

    app.controller('AppController', ['$scope', '$http', 'Utils', function ($scope, $http, Utils) {

        $scope.logout = function () {

            $http.get('/logout.json', Utils.getConfig())
                .success(function (data) {
                    console.log(data.message);
                    Utils.clearUserInfo();
                    $scope.openPage('/login');
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);
                });
        };

        $scope.openPage = function (page) {
            Utils.openPage(page);
        };

        $scope.username = function () {
            return Utils.getUserInfo() ? Utils.getUserInfo().username : '';
        };

    }]);

    app.directive('loggedIn', function () {
        return {
            restrict: 'E',
            templateUrl: 'include/logged-in.html',
            controller: 'AppController'
        };
    });

})();