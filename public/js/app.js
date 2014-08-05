(function () {

    var app = angular.module('chat',
        [
            'chat-login',
            'chat-register',
            'chat-lobby',
            'chat-room',
            'chat-services'
        ]);

    app.controller('AppController', ['$scope', 'CommonService', function ($scope, CommonService) {

        $scope.showPage = function (pageName) {
            CommonService.showPage(pageName);
        };

        $scope.logout = function () {
            CommonService.clearToken();
            $scope.showPage('login');
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