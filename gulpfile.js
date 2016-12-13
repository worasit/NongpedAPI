const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();

gulp.task('lint', () => {
  gulp.src([
    'app.js',
    'app/**/*.js',
    'gulpfile.js',
    'tests/**/*.js',
    'configManager.js',
    '!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format());
});

gulp.task('watch', () => {
  gulp.watch([
    'app.js',
    'gulpfile.js',
    'tests/**/*.js',
    'configManager.js',
    'app/**/*.js'], ['lint']);
});
