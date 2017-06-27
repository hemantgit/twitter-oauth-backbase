/**
 * filter
 * @module filter
 */
define(function (require, exports) {
    'use strict';
    /**
     * Export filter
     */
    exports.providerListFilter=  function() {
        return function (styles) {
            styles = styles || '';
            var str = (typeof styles === 'string') ? styles : styles.join(',');

            // revert ' ' to '-';
            str = str.replace(/ /gi, '-');

            // to lower case
            str = str.toLowerCase();
            return str;
        };
    }
});

