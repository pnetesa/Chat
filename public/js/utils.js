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

        this.setUserInfo = function (obj, remember) {

            this.clearUserInfo();

            this.userInfo = {
                username: obj.username,
                email: obj.email,
                token: obj.token
            };

            if (remember) {
                window.localStorage.setItem(USER_INFO, JSON.stringify(this.userInfo));
            }
        };

        this.getArgs = function () {
            if (this.getUserInfo()) {
                return {
                    params: {
                        userInfo: this.getUserInfo()
                    }
                };
            }
        };

        this.postArgs = function () {
            if (this.getUserInfo()) {
                return {
                    userInfo: this.getUserInfo()
                };
            }
        };

        this.getUserInfo = function () {
            this.userInfo = this.userInfo || (window.localStorage.getItem(USER_INFO) ?
                JSON.parse(window.localStorage.getItem(USER_INFO)) : undefined);
            return this.userInfo;
        };

        this.clearUserInfo = function () {
            this.userInfo = undefined;
            window.localStorage.removeItem(USER_INFO);
        };

        this.openPage = function (page) {
            $location.path(page);
        };

        this.signedOutQuits = function () {

            if (!this.getUserInfo()) {
                this.openPage('/');
                return true;
            }

            return false;
        };

        this.setRoom = function (room) {
            this.room = room;
        };

        this.getRoom = function () {
            return this.room;
        };

        return this;
    }]);

})();