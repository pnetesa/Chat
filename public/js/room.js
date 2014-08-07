(function () {

    var app = angular.module('room', ['utils']);

    app.controller('RoomController', ['$scope', '$routeParams', 'Utils', function ($scope, $routeParams, Utils) {

        $scope.init = function () {

            if (!Utils.canAccessProtected) {
                return;
            }

            var roomId = $routeParams.roomId;

            if (!roomId) {
                this.openPage('/');
            }


        };

    }]);

})();