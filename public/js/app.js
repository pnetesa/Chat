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

            var config = {
                params: {
                    tokenInfo: Utils.getToken()
                }
            };

            $http.get('/logout.json', config)
                .success(function (data) {
                    console.log(data.message);
                    Utils.clearToken();
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

        $scope.initRestricted = function () {
            if (!Utils.getToken()) {
                Utils.openPage('/');
            }
        };

    }]);

})();