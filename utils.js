'use strict';

var merge = require('merge-deep');
var unset = require('unset-value');
var unionValue = require('union-value');
var set = require('set-value');
var semver = require('semver');
var get = require('get-value');
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
require('through2', 'through');
require = fn;

utils.updateEngines = function(defaults, pkg, travis) {
  var engines = mergeEngines(defaults, travis);
  var allowedFailures = mergeAllowedFailures(defaults, travis);

  var pkgEngine = toSemver(pkg.engines.node);
  if (engines.indexOf(pkgEngine) === -1) {
    engines.push(pkgEngine);
  }

  // "e_" is engines
  var e_partitioned = partition(engines, isNumericVersion);
  var e_nonNumeric = e_partitioned[1];
  var e_versions = e_partitioned[0];
  var e_pversions = partitionVersions(e_versions, pkg);

  // "a_" is allowed failures
  var a_partitioned = partition(allowedFailures, isNumericVersion);
  var a_versions = a_partitioned[0];
  var a_pversions = partitionVersions(a_versions, pkg);

  var required = e_pversions[0].concat(a_pversions[0]).concat(e_nonNumeric);
  var notRequired = e_pversions[1].concat(a_pversions[1]);

  var arr = [];
  for (var i = 0; i < notRequired.length; i++) {
    arr.push({node_js: notRequired[i]});
  }

  travis = merge({}, defaults, travis);

  updateValue(travis, 'node_js', required);
  updateValue(travis, 'matrix.allow_failures', arr, 'node_js');
  if (!get(travis, 'matrix.allow_failures').length) {
    unset(travis, 'matrix.allow_failures');
  }
  if (Object.keys(travis.matrix).length === 1) {
    delete travis.matrix;
  }
  return travis;
};

function mergeEngines(defaults, travis) {
  var defaultValues = defaults.node_js || [];
  var travisValues = travis.node_js || [];
  return formatVersions(defaultValues.concat(travisValues));
}

function mergeAllowedFailures(defaults, travis) {
  var defaultValues = mapValues(defaults, 'matrix.allow_failures', 'node_js');
  var travisValues = mapValues(travis, 'matrix.allow_failures', 'node_js');
  return formatVersions(defaultValues.concat(travisValues));
}

function formatVersions(versions) {
  var result = [];
  for (var i = 0; i < versions.length; i++) {
    var version = String(versions[i]).trim();
    if (isNumericVersion(version)) {
      version = toSemver(version);
    }
    if (result.indexOf(version) === -1) {
      result.push(version);
    }
  }
  return result;
}

function mapValues(obj, prop, key) {
  var arr = get(obj, prop);
  if (!arr) return [];
  var values = [];
  for (var i = 0; i < arr.length; i++) {
    var val = get(arr[i], key);
    if (val) values.push(val);
  }
  return values;
}

function updateValue(obj, prop, arr, sortBy) {
  set(obj, prop, []);

  var stash = [];
  var res = [];

  for (var i = 0; i < arr.length; i++) {
    var ele = arr[i];

    if (typeof ele === 'string') {
      if (isNumericVersion(ele)) {
        ele = String(compressVersion(ele));
      }
      if (ele === 'stable') {
        continue;
      }
      if (res.indexOf(ele) === -1) {
        res.push(ele);
      }
    } else if (sortBy && isNumericVersion(ele[sortBy])) {
      ele[sortBy] = String(compressVersion(ele[sortBy]));
      if (stash.indexOf(ele[sortBy]) === -1) {
        stash.push(ele[sortBy]);
        res.push(ele);
      }
    }
  }
  unionValue(obj, prop, res);
  sortValue(obj, prop, sortBy);
}

function sortValue(obj, prop, sortBy) {
  var arr = get(obj, prop);
  if (Array.isArray(arr)) {
    arr.sort(function(a, b) {
      if (typeof sortBy === 'string') {
        return a[sortBy].localeCompare(b[sortBy]);
      }
      return a.localeCompare(b);
    });
    arr.reverse();
  }
}

function partitionVersions(versions, pkg) {
  let a = [];
  let b = [];
  for (let i = 0; i < versions.length; i++) {
    let version = toSemver(versions[i]);
    if (version === 'stable') {
      continue;
    }
    if (semver.satisfies(version, pkg.engines.node)) {
      a.push(version);
    } else {
      b.push(version);
    }
  }
  return [a, b];
}

function partition(arr, fn) {
  let a = [];
  let b = [];
  for (let i = 0; i < arr.length; i++) {
    let ele = arr[i];
    if (fn(ele)) {
      a.push(ele);
    } else {
      b.push(ele);
    }
  }
  return [a, b];
}

function isNumericVersion(version) {
  return /^\d+(\.\d+)?(\.\d+)?$/.test(version);
}

function toSemver(version) {
  version = version.replace(/^\D*|\D*$/g, '');
  let increments = String(version).trim().split('.');
  while (increments.length < 3) increments.push('0');
  return increments.join('.');
}

function compressVersion(str) {
  str = String(str);
  let segs = str.trim().split('.');
  let len = segs.length;
  while (len--) {
    if (segs[len] >= 1) {
      break;
    }
    segs.pop();
  }
  return segs.join('.');
}

/**
 * Expose `utils` modules
 */

module.exports = utils;
