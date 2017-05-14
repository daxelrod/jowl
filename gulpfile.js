'use strict';

const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const eslint = require('gulp-eslint');
const gulpMocha = require('gulp-mocha');
const through2 = require('through2');
const markdownlint = require('markdownlint');
const fs = require('fs');

const javascriptGlobs = ['*.js', 'src/**/*.js', 'test/**/*.js'];
const markdownGlobs = ['*.md', 'docs/**/*.md'];

gulp.task('lint', () => (
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  gulp.src(javascriptGlobs)

    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())

    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())

    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
));

gulp.task('test:unit', () =>
  gulp.src('test/unit/**/*.js').pipe(gulpMocha())
);

gulp.task('test:integration', () =>
  gulp.src('test/integration/**/*.js').pipe(gulpMocha())
);

// adapted from DavidAnson/markdownlint README.md@24c33df
gulp.task('markdownlint', () => (
  gulp.src(markdownGlobs, { read: false }).pipe(through2.obj((file, enc, next) => {
    markdownlint(
      {
        files: [file.path],
        config: JSON.parse(fs.readFileSync('./markdownlint.json', 'utf8')),
      },
      (err, result) => {
        let error = err;
        const resultString = (result || '').toString();
        if (resultString) {
          console.log(resultString);
          error = new gulpUtil.PluginError('markdownlint', {
            message: 'Markdownlint failed.',
            showStack: false,
          });
        }

        next(error, file);
      }
    );
  }
  ))
));

gulp.task('test', ['test:unit', 'test:integration']);

gulp.task('docs', ['markdownlint']);

gulp.task('build', ['lint', 'test', 'docs']);

gulp.task('default', ['build']);
