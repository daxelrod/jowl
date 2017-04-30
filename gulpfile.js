'use strict';

var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var gulpMocha = require('gulp-mocha');
var through2 = require('through2');
var markdownlint = require('markdownlint');

var javascriptGlobs = ['*.js', 'src/**/*.js', 'test/**/*.js'];

gulp.task('style', function () {
  return gulp.src(javascriptGlobs)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('lint', function () {
  return gulp.src(javascriptGlobs)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter())
    .pipe(jshint.reporter('fail'));
});

gulp.task('test:unit', function () {
  return gulp.src('test/unit/**/*.js')
    .pipe(gulpMocha());
});

gulp.task('test:integration', function () {
  return gulp.src('test/integration/**/*.js')
    .pipe(gulpMocha());
});

// adapted from DavidAnson/markdownlint README.md@24c33df
gulp.task('markdownlint', function task() {
  return gulp.src(['*.md', 'docs/**/*.md'], { read: false })
    .pipe(through2.obj(function obj(file, enc, next) {
      markdownlint(
        {
          files: [file.path],
          config: require('./markdownlint.json'),
        },
        function callback(err, result) {

          var resultString = (result || '').toString();
          if (resultString) {

            console.log(resultString);
            err = new gulpUtil.PluginError('markdownlint', {
              message: 'Markdownlint failed.',
              showStack: false,
            });
          }

          next(err, file);
        });
    }));
});

gulp.task('test', ['test:unit', 'test:integration']);

gulp.task('build', ['lint', 'style', 'test', 'markdownlint']);

gulp.task('default', ['build']);
