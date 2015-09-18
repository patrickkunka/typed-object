/**!
 * TypedObject v1.0.0
 *
 * @copyright Copyright 2015 KunkaLabs Limited.
 * @author    KunkaLabs
 * @link      https://github.com/kunkalabs/typed-object/
 *
 * @license   GPLv3
 * @link      http://www.gnu.org/licenses/gpl-3.0.en.html
 */

(function(window) {
    'use strict';

    /**
     * TypedObject
     * @param {Object} obj
     * @param [{Object}] context
     * @constructor
     */

    var TypedObject = function(obj, context) {
        var self = context || this,
            dataStore = {},
            keys = Object.getOwnPropertyNames(obj),
            err = function(key, typeDest, typeSrc) {
                throw new TypeError(
                    'Can\'t set property <TypedObject>.' +
                    key +
                    ', type "' +
                    typeSrc +
                    '" is not assignable to type "' +
                    typeDest +
                    '"'
                );
            },
            set = function(key, value) {
                var type = typeof obj[key];

                switch (type) {
                    case 'object':
                        if (typeof value !== 'object') {
                            if (typeof obj[key].length !== 'undefined') {
                                err(key, 'array', typeof value);
                            } else {
                                err(key, 'object', typeof value);
                            }
                        }

                        if (
                            typeof obj[key].length !== 'undefined' &&
                            typeof value.length === 'undefined'
                        ) {
                            err(key, 'array', 'object');
                        }

                        if (
                            typeof value.length !== 'undefined' &&
                            typeof obj[key].length === 'undefined'
                        ) {
                            err(key, 'object', 'array');
                        }

                        break;
                    default:
                        if (typeof value !== type) {
                            err(key, type, typeof value);
                        }
                }

                dataStore[key] = value;
            };

        keys.forEach(function(key) {
            dataStore[key] = obj[key];

            if (typeof obj[key] === 'function') {
                throw new TypeError(
                    'Can\'t define property <TypedObject>.' +
                    key +
                    ', methods are not permitted on typed objects.'
                );
            }

            Object.defineProperty(self, key, {
                enumerable: true,
                get: function() {
                    return dataStore[key];
                },
                set: function(value) {
                    set(key, value);
                }
            });
        });

        Object.seal(self);
    };

    /**
     * toObject
     * @return {Object}
     */

    TypedObject.prototype.toObject = function() {
        var self = this,
            output = {},
            keys = Object.getOwnPropertyNames(this);

        keys.forEach(function(key) {
            output[key] = self[key];
        });

        return output;
    };

    if (!window) {
        module.exports = TypedObject;

        return;
    }

    if (
        typeof window.exports === 'object' &&
        typeof window.module === 'object'
    ) {
        module.exports = TypedObject;
    } else if (
        typeof window.define === 'function' &&
        window.define.amd
    ) {
        window.define(function() {
            return TypedObject;
        });
    } else if (
        typeof window.TypedObject === 'undefined' ||
        typeof window.mixItUp !== 'function'
    ) {
        window.TypedObject = TypedObject;
    }
})(typeof window !== 'undefined' ? window : null);