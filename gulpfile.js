const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

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

gulp.task('config:production', () => {
  $.env({
    vars: {
      NODE_ENV: 'production'
    }
  });
});

gulp.task('config:default', () => {
  $.env({
    vars: {
      NODE_ENV: ''
    }
  });
});
