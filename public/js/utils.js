(function () {
    var app = angular.module('utils', []);
    var TOKEN = 'TOKEN';

    app.factory('Utils', function () {

        var $toast;

        this.isDev = true;

        this.isLogin = true;
        this.isRegister = false;
        this.isLobby = false;
        this.isRoom = false;

        this.showPage = function (pageName) {
            this.isLogin = pageName === 'login';
            this.isRegister = pageName === 'register';
            this.isLobby = pageName === 'lobby';
            this.isRoom = pageName === 'room';
        };

        this.showToast = function (text) {

            if (!text) {
                return;
            }

            if (!$toast) {
                $toast = $('.toast');
            }

            $toast.text(text);
            $toast.fadeIn(400).delay(3000).fadeOut(400);
        }

        this.setToken = function (email, token, remember) {

            var tokenObj = { email: email, token: token };

            if (remember) {
                $.cookie(TOKEN, JSON.stringify(tokenObj), { expires: 366 * 10 });
            }
            this.token = tokenObj;
        }

        this.getToken = function () {
            this.token = this.token || ($.cookie(TOKEN) ? JSON.parse($.cookie(TOKEN)) : undefined);
            return this.token;
        }

        this.clearToken = function () {
            this.token = undefined;
            $.removeCookie(TOKEN);
        }

        return this;
    });

})();