(function () {

    var app = angular.module('chat',
        [
            'login',
            'register',
            'lobby',
            'room',
            'utils'
        ]);

    app.controller('AppController', ['$scope', '$http', 'Utils', function ($scope, $http, Utils) {

        $scope.showPage = function (pageName) {
            Utils.showPage(pageName);
        };

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
                    $scope.showPage('login');
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);
                });
        };

    }]);

    var createDirective = function (name, file) {

        file = file || name;

        app.directive(name, function () {
            return {
                restrict: 'E',
                templateUrl: 'include/' + file + '.html',
                controller: 'AppController',
                controllerAs: 'appCtrl'
            };
        });

    };

    createDirective('login');
    createDirective('register');
    createDirective('lobby');
    createDirective('room');

})();