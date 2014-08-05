(function () {

    var app = angular.module('chat',
        [
            'chat-login',
            'chat-register',
            'chat-lobby',
            'chat-room',
            'chat-services'
        ]);

    app.controller('AppController', ['$scope', '$http', 'CommonService', function ($scope, $http, CommonService) {

        $scope.showPage = function (pageName) {
            CommonService.showPage(pageName);
        };

        $scope.logout = function () {

            var config = {
                params: {
                    tokenInfo: CommonService.getToken()
                }
            };

            $http.get('/logout.json', config)
                .success(function (data) {
                    console.log(data.message);
                    CommonService.clearToken();
                    $scope.showPage('login');
                })
                .error(function (data, status) {
                    CommonService.showToast(data.message);
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