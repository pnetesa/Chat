(function () {
    var app = angular.module('utils', []),
        USER_INFO = 'USER_INFO';

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

        this.setUserInfo = function (username, email, token, remember) {

            this.clearUserInfo();

            var userInfoObj = {
                username: username,
                email: email,
                token: token
            };

            if (remember) {
                $.cookie(USER_INFO, JSON.stringify(userInfoObj), { expires: 366 * 10 });
            }
            this.userInfo = userInfoObj;
        };

        this.getConfig = function () {
            if (this.getUserInfo()) {
                return {
                    params: {
                        userInfo: this.getUserInfo()
                    }
                };
            }
        };

        this.getUserInfo = function () {
            this.userInfo = this.userInfo || ($.cookie(USER_INFO) ? JSON.parse($.cookie(USER_INFO)) : undefined);
            return this.userInfo;
        };

        this.clearUserInfo = function () {
            this.userInfo = undefined;
            $.removeCookie(USER_INFO);
        };

        this.openPage = function (page) {
            $location.path(page);
        };

        this.canAccessProtected = function () {

            if (!this.getUserInfo()) {
                this.openPage('/');
            }

            return true;
        };

        return this;
    }]);

})();