(function () {

    var app = angular.module('room', ['utils']);

    app.controller('RoomController', ['$scope', '$http', 'Utils', function ($scope, $http, Utils) {

        $scope.messages = [];
        $scope.MAX_MESSAGES = 20;
        $scope.historyExpanded = false;

        $scope.init = function () {

            if (Utils.signedOutQuits()) {
                return;
            }

            $scope.room = Utils.getRoom();
            if (!$scope.room) {
                Utils.openPage('/');
                return;
            }

            $scope.server = io({ forceNew: true });
            $scope.server.on('connect', onServerConnect);
            $scope.server.on('message', onServerMessage);
        };

        $scope.getStyle = function (message) {
            return {
                color: message.color
            };
        }

        $scope.back = function () {
            $scope.server.disconnect();
            Utils.openPage('/lobby');
        };

        $scope.showHistory = function () {

            var config = Utils.getConfig();
            config.params.roomId = $scope.room.id;

            $http.get('/get-history.json', config)
                .success(function (data) {
                    console.log(data);
                    $scope.messages = data;
                    $scope.historyExpanded = true;
                })
                .error(function (data, status) {
                    Utils.showToast(data.message);
                    console.log(status + " " + data.message);
                });

        };

        $scope.sendMessage = function () {

            var message = {
                username: Utils.getUserInfo().username,
                color: Utils.getUserInfo().color,
                text: $scope.message
            };

            $scope.server.emit('message', message);
            $scope.message = '';

            $scope.messages.unshift(message);
            $scope.messages = $scope.historyExpanded ?
                $scope.messages : $scope.messages.slice(0, $scope.MAX_MESSAGES);
        };

        var onServerConnect = function () {
            $scope.server.emit('join', $scope.room.id, Utils.getUserInfo());
        };

        var onServerMessage = function (roomId, message) {

            if ($scope.room.id !== roomId) {
                return;
            }

            $scope.messages.unshift(message);
            $scope.messages = $scope.historyExpanded ?
                $scope.messages : $scope.messages.slice(0, $scope.MAX_MESSAGES);
            $scope.$apply();
        };

    }]);

})();