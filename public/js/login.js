﻿(function () {

    var app = angular.module('login', ['utils']);

    app.controller('LoginController', ['$scope', '$http', 'Utils', function ($scope, $http, Utils) {

        $scope.loginInfo = Utils.isDev ?
            {
                email: 'user@email.com',
                password: 'pass123',
                rememberMe: false
            } : {};

        $scope.autoLogin = function () {

            var userInfo = Utils.getUserInfo();

            if (!userInfo) {
                return;
            }

            var config = {
                params: {
                    userInfo: userInfo
                }
            };

            $http.get('/autologin.json', config)
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

            var config = {
                params: {
                    loginInfo: $scope.loginInfo
                }
            };

            $http.get('/login.json', config)
                .success(function (data) {
                    console.log(data.message);
                    Utils.setUserInfo(data.username, data.email, data.token, $scope.loginInfo.rememberMe);
                    Utils.openPage('/lobby');
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);
                });
        };

    }]);

})();