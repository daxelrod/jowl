'use strict';

var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var eslint = require('gulp-eslint');
var gulpMocha = require('gulp-mocha');
var through2 = require('through2');
var markdownlint = require('markdownlint');
var fs = require('fs');

var javascriptGlobs = ['*.js', 'src/**/*.js', 'test/**/*.js'];
var markdownGlobs = ['*.md', 'docs/**/*.md'];

gulp.task('lint', function () {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(javascriptGlobs)

    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())

    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())

    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
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
  return gulp.src(markdownGlobs, { read: false })
    .pipe(through2.obj(function obj(file, enc, next) {
      markdownlint(
        {
          files: [file.path],
          config: JSON.parse(fs.readFileSync('./markdownlint.json', 'utf8')),
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

gulp.task('docs', ['markdownlint']);

gulp.task('build', ['lint', 'test', 'docs']);

gulp.task('default', ['build']);
