(function () {
    'use strict';

    angular
        .module('app', [])
        .filter('maskedtel', maskedtel)
        .filter('maskedemail', maskedemail)
        .filter('maskedusername', maskedusername);

    function maskedtel() {
        return function (tel) {
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;

            switch (value.length) {
                case 10: // +1PPP####### -> C (PPP) ###-####
                    country = 1;
                    city = value.slice(0, 3);
                    number = value.slice(3);
                    break;

                case 11: // +CPPP####### -> CCC (PP) ###-####
                    country = value[0];
                    city = value.slice(1, 4);
                    number = value.slice(4);
                    break;

                default:
                    if (value.length <= 4) return 'xxx' + value.slice(value.length - 1);
                    else return value.slice(0, value.length - 4).replace(/[0-9]/g, "x") + value.slice(value.length - 4);
                    return tel;
            }

            if (country === 1) {
                country = "";
            }

            number = 'xxx-' + number.slice(3);

            return (country.replace(/[0-9]/g, "x") + ' (xxx) ' + number).trim();
        };
    }

    function maskedemail() {
        return function (email) {
            if (!email) { return ''; }

            var value = email.toString().trim().replace(/^\+/, '');

            if (!value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
                return email;
            }

            var atIndex = email.indexOf('@');
            var suffix = email.slice(atIndex);
            var prefix = email.slice(0, atIndex);
            var maskedPrefix = '';

            if (prefix.length > 4) {
                maskedPrefix = prefix.slice(0, 1) + '...' + prefix.slice(prefix.length - 3);
            } else {
                maskedPrefix = prefix.slice(0, 1) + '...';
            }

            return maskedPrefix + suffix;
        };
    }

    function maskedusername() {
        return function (username, showLength) {
            if (!username) { return ''; }
            if (!showLength) showLength = 3;

            var suffix = '';

            if (username.length < showLength) suffix = username;
            else suffix = username.slice(username.length - showLength);

            return 'xxxxxxxxxxxx' + suffix;
        };
    }
})();