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

            var getArgs = Utils.getArgs();

            if (!getArgs) {
                return;
            }

            $http.get('/autologin', getArgs)
                .success(function (data) {
                    console.log(data.message);
                    Utils.openPage('/lobby');
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);
                });
        };

        $scope.login = function () {

            $http.post('/login', $scope.loginInfo)
                .success(function (data) {
                    console.log(data.message);
                    Utils.setUserInfo(data, $scope.loginInfo.rememberMe);
                    Utils.openPage('/lobby');
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);
                });
        };

    }]);

})();