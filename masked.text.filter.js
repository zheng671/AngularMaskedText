(function () {
    'use strict';

    angular
        .module("yourapp")
        .filter('tel', tel)
        .filter('email', email);

    function tel() {
        return function (tel, masked) {
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

                case 12: // +CCCPP####### -> CCC (PP) ###-####
                    country = value.slice(0, 3);
                    city = value.slice(3, 5);
                    number = value.slice(5);
                    break;

                default:
                    return tel;
            }

            if (country === 1) {
                country = "";
            }

            number = (masked ? "xxx" : number.slice(0, 3)) + '-' + number.slice(3);

            return (country + "(" + (masked ? "xxx" : city) + ") " + number).trim();
        };
    }

    function email() {
        return function (email, masked) {
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
})();