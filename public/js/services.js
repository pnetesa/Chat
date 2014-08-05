(function () {
    var app = angular.module('chat-services', []);
    var TOKEN = 'TOKEN';

    app.factory('CommonService', function () {

        var service = {};
        var $toast;

        service.isDev = true;

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

        service.showToast = function (text) {

            if (!text) {
                return;
            }

            if (!$toast) {
                $toast = $('.toast');
            }

            $toast.text(text);
            $toast.fadeIn(400).delay(3000).fadeOut(400);
        }

        service.setToken = function (email, token, remember) {

            var tokenObj = { email: email, token: token };

            if (remember) {
                $.cookie(TOKEN, JSON.stringify(tokenObj), { expires: 366 * 10 });
            }
            service.token = tokenObj;
        }

        service.getToken = function () {
            service.token = service.token || ($.cookie(TOKEN) ? JSON.parse($.cookie(TOKEN)) : undefined);
            return service.token;
        }

        service.clearToken = function () {
            service.token = undefined;
            $.removeCookie(TOKEN);
        }

        return service;
    });

})();