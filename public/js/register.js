(function () {

    var app = angular.module('chat-register', ['chat-services']);

    app.controller('RegisterController', ['$scope', '$http', 'CommonService', function ($scope, $http, CommonService) {

        $scope.userInfo = CommonService.isDev ?
            {
                email: 'user@email.com',
                password: 'pass123'
            } : {};

        $scope.register = function () {

            var config = {
                params: {
                    userInfo: $scope.userInfo
                }
            };

            $http.get('/register.json', config)
                .success(function (data) {
                    console.log(data.message);
                    CommonService.setToken(data.email, data.token);
                    CommonService.showPage('lobby');
                })
                .error(function (data, status) {
                    CommonService.showToast(data.message);
                    console.log(status + " " + data.message);
                });
        };

        $scope.isVisible = function () {
            return CommonService.isRegister;
        };

    }]);

})();