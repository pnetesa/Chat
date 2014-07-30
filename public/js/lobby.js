(function () {

    var app = angular.module('chat-lobby', ['chat-services']);

    app.controller('LobbyController', ['$scope', 'CommonService', function ($scope, CommonService) {

        $scope.isVisible = function () {
            return CommonService.isLobby;
        };

        $scope.onRoomClick = function () {
            CommonService.showPage('room');
        };

    }]);

})();