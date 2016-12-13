const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

gulp.task('lint', () => {
  gulp.src([
    'app.js',
    'app/**/*.js',
    'gulpfile.js',
    'tests/**/*.js',
    'configManager.js',
    '!node_modules/**',
    '!tests/data/*.js'])
    .pipe($.eslint())
    .pipe($.eslint.format());
});

gulp.task('watch', () => {
  gulp.watch([
    'app.js',
    'gulpfile.js',
    'tests/**/*.js',
    'configManager.js',
    'app/**/*.js',
    '!tests/data'
  ], ['lint']);
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

gulp.task('pre-test', function () {
  return gulp.src(['app/**/*.js'])
    .pipe($.istanbul())
    .pipe($.istanbul.hookRequire());
});

gulp.task('unit-test', ['lint', 'pre-test'], () => {
  gulp.src(['tests/unit/**/*.js'])
    .pipe($.mocha())
    .pipe($.istanbul.writeReports())
    .pipe($.istanbul.enforceThresholds({ thresholds: { global: 90 } }))
    .once('error', () => {
      process.exit(1);
    })
    .once('end', () => {
      process.exit();
    });
});
