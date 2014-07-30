(function () {

    var app = angular.module('chat-login', ['chat-services']);

    app.controller('LoginController', ['$scope', 'CommonService', function ($scope, CommonService) {

        $scope.isVisible = function () {
            return CommonService.isLogin;
        };

        $scope.showRegisterPage = function () {
            CommonService.showPage('register')
        };

    }]);

})();