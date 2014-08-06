(function () {

    var app = angular.module('room', ['utils']);

    app.controller('RoomController', ['$scope', 'Utils', function ($scope, Utils) {

        $scope.isVisible = function () {
            return Utils.isRoom;
        };

    }]);

})();