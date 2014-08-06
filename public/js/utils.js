(function () {
    var app = angular.module('utils', []);
    var TOKEN = 'TOKEN';

    app.factory('Utils', ['$location', function ($location) {

        var $toast;

        this.isDev = true;

        this.showToast = function (text) {

            if (!text) {
                return;
            }

            if (!$toast) {
                $toast = $('.toast');
            }

            $toast.text(text);
            $toast.fadeIn(400).delay(3000).fadeOut(400);
        };

        this.setToken = function (email, token, remember) {

            var tokenObj = { email: email, token: token };

            if (remember) {
                $.cookie(TOKEN, JSON.stringify(tokenObj), { expires: 366 * 10 });
            }
            this.token = tokenObj;
        };

        this.getToken = function () {
            this.token = this.token || ($.cookie(TOKEN) ? JSON.parse($.cookie(TOKEN)) : undefined);
            return this.token;
        };

        this.clearToken = function () {
            this.token = undefined;
            $.removeCookie(TOKEN);
        };

        this.openPage = function (page) {
            $location.path(page);
        };

        return this;
    }]);

})();