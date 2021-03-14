'use strict';

const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const through2 = require('through2');
const markdownlint = require('markdownlint');
const fs = require('fs');

const markdownGlobs = ['*.md', 'docs/**/*.md'];

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

gulp.task('docs', ['markdownlint']);

gulp.task('build', ['docs']);

gulp.task('default', ['build']);
