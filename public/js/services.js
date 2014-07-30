(function () {
    var app = angular.module('chat-services', []);

    app.factory('CommonService', function () {

        var service = {};

        service.isLogin = true;
        service.isRegister = false;
        service.isLobby = false;
        service.isRoom = false;

        service.showPage = function (pageName) {
            service.isLogin = pageName === 'login';
            service.isRegister = pageName === 'register';
            service.isLobby = pageName === 'lobby';
            service.isRoom = pageName === 'room';
        };

        return service;
    });

})();