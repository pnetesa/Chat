(function () {

    var app = angular.module('register', ['utils']);

    app.controller('RegisterController', ['$scope', '$http', 'Utils', function ($scope, $http, Utils) {

        $scope.userInfo = Utils.isDev ?
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
                    Utils.setToken(data.email, data.token);
                    Utils.openPage('/lobby');
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);
                });
        };

    }]);

})();