(function () {

    var app = angular.module('room', ['utils']);

    app.controller('RoomController', ['$scope', 'Utils', function ($scope, Utils) {

        $scope.messages = [];

        $scope.init = function () {

            if (!Utils.canAccessProtected) {
                return;
            }

            $scope.$on('$routeChangeSuccess', function () {

                $scope.room = Utils.getRoom();
                if (!$scope.room) {
                    Utils.openPage('/');
                    return;
                }

                $scope.server = io();
                $scope.server.on('connect', onServerConnect);
                $scope.server.on('message', onServerMessage);
            });
        };

        $scope.sendMessage = function () {

            var message = {
                username: Utils.getUserInfo().username,
                color: Utils.getUserInfo().color,
                text: $scope.message
            };

            $scope.server.emit('message', $scope.room.id, message);
            $scope.message = '';
            $scope.messages.unshift(message);
        };

        var onServerConnect = function () {
            $scope.server.emit('join', $scope.room.id, Utils.getUserInfo());
        };

        var onServerMessage = function (message) {
            $scope.messages.unshift(message);
            $scope.$apply();
        };

    }]);

})();