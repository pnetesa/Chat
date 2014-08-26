(function () {

    var app = angular.module('lobby', ['utils']);

    app.controller('LobbyController', ['$scope', '$http', 'Utils', function ($scope, $http, Utils) {

        $scope.rooms = [];

        $scope.init = function () {

            if (Utils.signedOutQuits()) {
                return;
            }

            $scope.getRooms();
        };

        $scope.getRooms = function () {
            $http.get('/get-rooms', Utils.getArgs())
                .success(function (data) {
                    console.log(data);
                    $scope.rooms = data;
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);

                    if (status === 403) { // Not authorized
                        Utils.openPage('/');
                    }
                });
        }

        $scope.createRoom = function () {

            var postArgs = Utils.postArgs();
            postArgs.name = $scope.roomName;

            $http.post('/create-room', postArgs)
                .success(function (data) {
                    console.log(data.message);
                    $scope.roomName = '';
                    $scope.getRooms();
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);

                    if (status === 403) { // Not authorized
                        Utils.openPage('/');
                    }
                });
        };

        $scope.openRoom = function (room) {
            Utils.setRoom(room);
            Utils.openPage('/room');
        };

    }]);

})();