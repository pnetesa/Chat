(function () {

    var app = angular.module('lobby', ['utils']);

    app.controller('LobbyController', ['$scope', 'Utils', function ($scope, Utils) {

        $scope.onRoomClick = function () {
            Utils.openPage('/room');
        };

    }]);

})();