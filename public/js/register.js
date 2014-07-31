(function () {

    var app = angular.module('chat-register', ['chat-services']);

    app.controller('RegisterController', ['$scope', '$http', 'CommonService', function ($scope, $http, CommonService) {

        $scope.userInfo = {};

        $scope.register = function () {

            var config = {
                params: {
                    userInfo: {
                        email: $scope.userInfo.email,
                        password: $scope.userInfo.password
                    }
                }
            };

            $http.get('/register.json', config).success(function (data) {
                alert('Success: ' + data);
                CommonService.showPage('lobby');
            });
        };

        $scope.isVisible = function () {
            return CommonService.isRegister;
        };

    }]);

})();