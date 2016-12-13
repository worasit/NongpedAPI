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
    '!tests/data/*.js',
    '!gulpfile.js'])
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

gulp.task('pre-test', () =>
  gulp.src(['app/**/*.js'])
    .pipe($.istanbul())
    .pipe($.istanbul.hookRequire())
);

gulp.task('unit-test', ['lint', 'pre-test'], () =>
  gulp.src(['tests/unit/**/*.js'])
    .pipe($.mocha())
    .pipe($.istanbul.writeReports())
    .pipe($.istanbul.enforceThresholds({ thresholds: { global: 90 } }))
);


gulp.task('integration-test', ['lint'], () =>
  gulp.src(['tests/integration/*.js', 'test/integration/**/*.js'], { read: false })
    .pipe($.mocha({}))
    .on('error', $.util.log)
    .once('end', () => {
      process.exit();
    })
);

gulp.task('test:development', $.sequence('config:default', 'unit-test', 'integration-test'));
gulp.task('test:production', $.sequence('config:production', 'unit-test', 'integration-test'));