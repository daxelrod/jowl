'use strict';

var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');

var javascriptGlobs = ['*.js', 'src/**/*.js', 'test/**/*.js'];

gulp.task('style', function() {
  gulp.src(javascriptGlobs)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('lint', function() {
  gulp.src(javascriptGlobs)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter())
    .pipe(jshint.reporter('fail'));
});

gulp.task('build', ['lint', 'style'], function() {
  gulp.src('/');
});

gulp.task('default', ['build']);
