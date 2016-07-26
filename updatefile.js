'use strict';

var path = require('path');
var defaults = require('./templates/defaults');
var utils = require('./utils');

module.exports = function(app) {
  if (!utils.isValid(app, 'updater-travis')) return;
  app.use(require('generate-travis'));
  var ctx = {paths: {}, tasks: []};
  var calculated;

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
    utils.del(['.travis.yml'], app.options, cb);
  });

  /**
   * Add a new `.travis.yml` file using [templates/.travis.yml](template/.travis.yml) as a template.
   * This task is also aliased as `travis:travis-new` to free up the `new` task name in case you use this
   * updater as a [plugin](#api).
   *
   * ```sh
   * $ update travis:new
   * ```
   * @name travis:new
   * @api public
   */

  app.task('new', ['travis-new']);
  app.task('travis-new', function(cb) {
    app.generate('generate-travis', cb);
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

  app.task('travis', ['travis-update']);
  app.task('travis-update', ['paths'], function() {
    var srcBase = app.options.srcBase || app.cwd;
    return app.src('.travis.yml', {cwd: srcBase, dot: true})
      .pipe(travisUpdate())
      .pipe(app.dest(function(file) {
        file.basename = '.travis.yml';
        console.log(app.cwd)
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

  app.task('paths', {silent: true}, function(cb) {
    app.build(calculatePaths(), cb);
  });

  app.task('default', {silent: true}, function(cb) {
    app.build(calculatePaths(), cb);
  });

  function calculatePaths() {
    if (calculated) return ctx.tasks;
    calculated = true;
    ctx.paths.cwd = path.resolve.bind(path, app.options.dest || app.cwd);
    var hasTravis = utils.exists(ctx.paths.cwd('.travis.yml'));
    var hasTests = utils.exists(ctx.paths.cwd('test')) || utils.exists(ctx.paths.cwd('test.js'));
    ctx.tasks = hasTests && hasTravis ? ['travis-update'] : [hasTests ? 'travis-new' : 'travis-del'];
    return ctx.tasks;
  }
};

/**
 * Update `.travis.yml`
 */

function travisUpdate() {
  return utils.through.obj(function(file, enc, next) {
    var obj = utils.yaml.safeLoad(file.contents.toString());
    obj = utils.merge({}, defaults.json, obj);
    obj.node_js = defaults.json.node_js;
    obj.matrix.allow_failures = defaults.json.matrix.allow_failures;
    file.contents = new Buffer(utils.yaml.dump(obj));

    utils.del(file.path, function(err) {
      if (err) return next(err);
      next(null, file);
    });
  });
}
