(function () {

    var app = angular.module('room', ['utils']);

    app.controller('RoomController', ['$scope', '$http', 'Utils', function ($scope, $http, Utils) {

        $scope.messages = [];
        $scope.MAX_MESSAGES = 20;
        $scope.historyExpanded = false;
        $scope.inUpload = false;
        $scope.uploading = false;

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

        $scope.toggleShowUpload = function () {
            $scope.inUpload = !$scope.inUpload;
        };

        $scope.uploadFile = function () {

            $scope.uploading = true;

            $http({
                method: 'POST',
                url: '/upload-file',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: {
                    email: Utils.getUserInfo().email,
                    token: Utils.getUserInfo().token,
                    upload: $scope.file
                },
                transformRequest: getFormDataObject
            })
            .success(function (data) {
                console.log('Uploaded: ' + data.filename);
                $scope.uploading = false;
                $scope.inUpload = false;

                $('#uploadFile').val(undefined);

                var message = {
                    username: Utils.getUserInfo().username,
                    color: Utils.getUserInfo().color,
                    filename: data.filename,
                    filepath: data.filepath
                };

                $scope.server.emit('uploaded-file', message);
            })
            .error(function (data, status) {
                Utils.showToast(data.message);
                console.log(status + " " + data.message);
            });
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

        var getFormDataObject = function (data, headersGetter) {
            var formData = new FormData();
            angular.forEach(data, function (value, key) {
                formData.append(key, value);
            });

            var headers = headersGetter();
            delete headers['Content-Type'];

            return formData;
        };
    }]);

    app.directive('file', function () {
        return {
            scope: {
                file: '='
            },
            link: function (scope, el, attrs) {
                el.bind('change', function (event) {
                    var file = event.target.files[0];
                    scope.file = file ? file : undefined;
                    scope.$apply();
                });
            }
        };
    });

})();