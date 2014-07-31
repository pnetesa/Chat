(function () {

    var app = angular.module('chat-register', ['chat-services']);

    app.controller('RegisterController', ['$scope', '$http', 'CommonService', function ($scope, $http, CommonService) {

        $scope.userInfo = {};

        $scope.register = function () {

            var data = { email: $scope.userInfo.email, password: $scope.userInfo.password };

            //$http.get('/register.json', { data: data }).success(function (data) {
            //    alert('Success: ' + data);
            //    CommonService.showPage('lobby');
            //});

            $http({
                method: 'GET',
                url: '/register.json',
                params: {
                    test: 'test'
                },
                data: data
            }).success(function (data) {
                alert('Success: ' + data);
                CommonService.showPage('lobby');
            });
        };

        $scope.isVisible = function () {
            return CommonService.isRegister;
        };

    }]);

})();