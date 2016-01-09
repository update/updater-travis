'use strict';

var fs = require('fs');

var travis = [
  'sudo: false',
  'language: node_js',
  'node_js:',
  '  - "stable"',
  '  - "5"',
  '  - "4"',
  '  - "0.12"',
  '  - "0.10"',
  'before_install:',
  '  - npm install -g npm@next',
  'matrix:',
  '  fast_finish: true',
  '  allow_failures:',
  '    - node_js: "0.10"',
  ''
].join('\n');

module.exports = function (app, base, env) {
  var opts = base.option('travis') || base.get('argv.options.travis') || {};

  if (!fs.existsSync('.travis.yml') || opts.overwrite) {
    base.log('adding .travis.yml');
    base.file({path: '.travis.yml', content: travis});
  }

  base.onLoad(/\.travis\.yml$/, function (file, next) {
    base.log('updating .travis.yml');
    file.content = travis;
    next();
  });
};

