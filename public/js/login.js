(function () {

    var app = angular.module('login', ['utils']);

    app.controller('LoginController', ['$scope', '$http', 'Utils', function ($scope, $http, Utils) {

        $scope.loginInfo = Utils.isDev ?
            {
                email: 'user@email.com',
                password: 'pass123',
                rememberMe: false
            } : {};

        $scope.autoLogin = function () {

            var token = Utils.getToken();

            if (!token) {
                return;
            }

            var config = {
                params: {
                    tokenInfo: token
                }
            };

            $http.get('/autologin.json', config)
                .success(function (data) {
                    console.log(data.message);
                    Utils.showPage('lobby');
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);
                });
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
                    Utils.setToken(data.email, data.token, $scope.loginInfo.rememberMe);
                    Utils.showPage('lobby');
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);
                });
        };

        $scope.isVisible = function () {
            return Utils.isLogin;
        };

    }]);

})();