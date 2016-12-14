'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('delete', 'del');
require('extend-shallow', 'extend');
require('fs-exists-sync', 'exists');
require('is-valid-app', 'isValid');
require('js-yaml', 'yaml');
require('merge-deep', 'merge');
require('semver', 'semver');
require('through2', 'through');
require('array-unique', 'unique');
require = fn;

utils.updateEngine = function(engines, obj) {
  obj.node_js = obj.node_js.filter(function(version) {
    if (utils.isNumericVersion(version)) {
      return utils.semver.satisfies(utils.toSemver(version), engines);
    } else {
      return true;
    }
  });

  var list = utils.engines(engines);
  for (var i = 0; i < list.length; i++) {
    var engine = utils.semver.clean(list[i]);
    if (obj.node_js.indexOf(engine) === -1) {
      obj.node_js.push(utils.compressVersion(engine));
    }
  }
  obj.node_js = utils.unique(obj.node_js);
  obj.node_js.sort();
  obj.node_js.reverse();
};

utils.engines = function(str) {
  var re = /(\D*)([\d.]+)\s*/;
  var engines = String(str).trim().split(' ');
  var res = [];
  for (var i = 0; i < engines.length; i++) {
    var m = re.exec(engines[i]);
    if (!m) continue;
    res.push(utils.toSemver(m[2]));
  }
  return res;
};

utils.isNumericVersion = function(str) {
  return /^[\s.\d]+$/.test(str);
};

utils.toSemver = function(str) {
  var segs = str.trim().split('.');
  while (segs.length < 3) segs.push('0');
  return segs.join('.');
};

utils.compressVersion = function(str) {
  str = String(str);
  var segs = str.trim().split('.');
  var len = segs.length;
  while (len--) {
    var v = segs[len];
    if (v >= 1) {
      return segs.join('.');
    }
    segs.pop();
  }
  return segs.join('.');
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
