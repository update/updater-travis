'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('delete', 'del');
require('fs-exists-sync', 'exists');
require('is-valid-app', 'isValid');
require('js-yaml', 'yaml');
require('merge-deep', 'merge');
require('through2', 'through');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
