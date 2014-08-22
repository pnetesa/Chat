(function () {

    var app = angular.module('register', ['utils']);

    app.controller('RegisterController', ['$scope', '$http', 'Utils', function ($scope, $http, Utils) {

        $scope.userInfo = Utils.isDev ?
            {
                username: 'User',
                email: 'user@email.com',
                password: 'pass123'
            } : {};

        $scope.register = function () {

            var config = {
                params: {
                    userInfo: $scope.userInfo
                }
            };

            $http.get('/register', config)
                .success(function (data) {
                    console.log(data.message);
                    Utils.setUserInfo(data);
                    Utils.openPage('/lobby');
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);
                });
        };

    }]);

})();