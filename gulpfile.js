'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

let files = ['./lib/**.js', './config/*.js', './*.js', './test/**.js'];

gulp.task('lint', () => {
	return gulp.src(files)
		.pipe($.eslint())
		.pipe($.eslint.format());
});

gulp.task('watch', () => {
	gulp.watch(files, ['lint']);
});

gulp.task('default', ['watch']);
