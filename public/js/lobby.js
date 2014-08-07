(function () {

    var app = angular.module('lobby', ['utils']);

    app.controller('LobbyController', ['$scope', '$http', 'Utils', function ($scope, $http, Utils) {

        $scope.rooms = [];

        $scope.init = function () {

            if (!Utils.canAccessProtected) {
                return;
            }

            $http.get('/get-rooms.json', Utils.getConfig())
                .success(function (data) {
                    console.log(data);
                    $scope.rooms = data;
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);
                });
        };


        $scope.createRoom = function () {
            var config = Utils.getConfig();
            config.params.name = $scope.roomName;
            $http.get('/create-room.json', config)
                .success(function (data) {
                    console.log(data);
                    $scope.rooms = data;
                    $scope.roomName = '';
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);
                });
        };

        $scope.openRoom = function (room) {
            Utils.setRoom(room);
            Utils.openPage('/room');
        };

    }]);

})();