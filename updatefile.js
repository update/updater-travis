'use strict';

var fs = require('fs');
var path = require('path');
var del = require('delete');
var yaml = require('js-yaml');
var isValid = require('is-valid-app');
var through = require('through2');
var defaults = require('./templates/defaults');
var utils = require('./utils');

module.exports = function(app) {
  if (!isValid(app, 'updater-travis')) return;
  var ctx = {paths: {}, tasks: []};
  var calculated;

  /**
   * Register a Generate generator, for creating a new `.travis.yml` file
   * when specified by the user.
   */

  app.register('generate-travis', require('generate-travis'));

  /**
   * Delete the `.travis.yml` file in the current working directory. This task is also aliased
   * as `travis:travis-del` to free up the `new` task name in case you use this updater as
   * a [plugin](#api).
   *
   * ```sh
   * $ update travis:del
   * ```
   * @name travis:del
   * @api public
   */

  app.task('del', ['travis-del']);
  app.task('travis-del', function(cb) {
    del(['.travis.yml'], {cwd: app.cwd}, cb);
  });

  /**
   * Add a new `.travis.yml` file using [templates/.travis.yml](template/.travis.yml) as a template. This task is also aliased as `travis:travis-new`
   * to free up the `new` task name in case you use this updater
   * as a [plugin](#api).
   *
   * ```sh
   * $ update travis:new
   * ```
   * @name travis:new
   * @api public
   */

  app.task('new', ['travis-new']);
  app.task('travis-new', ['paths'], function(cb) {
    app.generate('generate-travis:travis', cb);
  });

  /**
   * Update an existing `.travis.yml` file with the defaults in [templates/defaults.js](template/defaults.js).
   * Aliased as `travis:travis-update` to free up the `update` task name in case you use this
   * updater as a [plugin](#api).
   *
   * ```sh
   * $ update travis:update
   * ```
   * @name travis:update
   * @api public
   */

  app.task('update', ['travis-update']);
  app.task('travis-update', ['paths'], function() {
    var srcBase = app.options.srcBase || app.cwd;
    return app.src('.travis.yml', {cwd: srcBase, dot: true})
      .pipe(travisUpdate(app))
      .pipe(app.dest(function(file) {
        file.basename = '.travis.yml';
        return app.cwd;
      }));
  });

  /**
   * The default task calls the other tasks to either update an existing `.travis.yml` file or
   * add a new `.travis.yml` file if one doesn't already exist. Aliased as `travis:travis` so you
   * can use this updater as a [plugin](#api) and safely overwrite the `default` task.
   *
   * ```sh
   * $ update travis
   * ```
   * @name travis
   * @api public
   */

  app.task('default', ['travis']);
  app.task('travis', ['paths'], function(cb) {
    app.build(ctx.tasks, cb);
  });

  /**
   * Calculate build paths
   */

  app.task('paths', {silent: true}, function(cb) {
    calculatePaths();
    cb();
  });

  function calculatePaths() {
    if (calculated) return ctx.tasks;
    calculated = true;

    var cwd = path.resolve.bind(path, app.options.dest || app.cwd);
    var hasTravis = fs.existsSync(cwd('.travis.yml'));
    var hasTests = fs.existsSync(cwd('test')) || fs.existsSync(cwd('test.js'));
    ctx.tasks = (hasTests && hasTravis)
      ? ['travis-update']
      : ([hasTests ? 'travis-new' : 'travis-del']);

    return ctx.tasks;
  }
};

/**
 * Update `.travis.yml`
 */

function travisUpdate(app) {
  var opts = Object.assign({}, app.options);
  var pkg = Object.assign({}, app.pkg.data);

  return through.obj(function(file, enc, next) {
    var travisConfig = yaml.safeLoad(file.contents.toString());
    var config = utils.updateEngines(defaults, pkg, travisConfig);

    file.contents = new Buffer(yaml.dump(config));
    if (opts.delete === false) {
      next(null, file);
      return;
    }

    del(file.path, function(err) {
      if (err) return next(err);
      next(null, file);
    });
  });
}
