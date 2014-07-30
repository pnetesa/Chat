(function () {

    var app = angular.module('chat-register', ['chat-services']);

    app.controller('RegisterController', ['$scope', 'CommonService', function ($scope, CommonService) {

        $scope.userInfo = {};

        $scope.register = function () {
            alert($scope.userInfo.email + ' ' + $scope.userInfo.password);
            CommonService.showPage('lobby');
        };

        $scope.isVisible = function () {
            return CommonService.isRegister;
        };

    }]);

})();