(function () {

    var app = angular.module('chat-room', ['chat-services']);

    app.controller('RoomController', ['$scope', 'CommonService', function ($scope, CommonService) {

        $scope.isVisible = function () {
            return CommonService.isRoom;
        };

    }]);

})();