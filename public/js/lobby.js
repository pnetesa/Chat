(function () {

    var app = angular.module('lobby', ['utils']);

    app.controller('LobbyController', ['$scope', 'Utils', function ($scope, Utils) {

        $scope.isVisible = function () {
            return Utils.isLobby;
        };

        $scope.onRoomClick = function () {
            Utils.showPage('room');
        };

    }]);

})();