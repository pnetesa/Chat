(function () {

    var app = angular.module('chat-login', ['chat-services']);

    app.controller('LoginController', ['$scope', '$http', 'CommonService', function ($scope, $http, CommonService) {

        $scope.loginInfo = CommonService.isDev ?
            {
                email: 'user@email.com',
                password: 'pass123',
                rememberMe: false
            } : {};

        $scope.autoLogin = function () {
            alert('autoLogin()');
        };

        $scope.login = function () {

            var config = {
                params: {
                    loginInfo: $scope.loginInfo
                }
            };

            $http.get('/login.json', config)
                .success(function (data) {
                    console.log(data.message);
                    CommonService.setToken(data.email, data.token, $scope.loginInfo.rememberMe);
                    CommonService.showPage('lobby');
                })
                .error(function (data, status) {
                    CommonService.showToast(data.message);
                    console.log(status + " " + data.message);
                });
        };

        $scope.isVisible = function () {
            return CommonService.isLogin;
        };

    }]);

})();