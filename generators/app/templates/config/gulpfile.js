var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var raml2html = require('gulp-raml2html');
var jasmine = require('gulp-jasmine');
var processEnv = require('gulp-process-env');

gulp.task('lint', function() {
  return gulp.src('./server/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('start', ['apidoc'], function () {
  nodemon({
    script: 'server/app.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  })
  .on('restart', function () {
    console.log('server restarted!');
  });
});

gulp.task('apidoc', function() {
  return gulp.src('raml/api.raml')
    .pipe(raml2html())
    .pipe(gulp.dest('server/api/documentation'));
});


gulp.task('test', function() {
  var env = processEnv({AGGREGATOR_NODE_ENV: 'test'});
  return gulp.src('tests/**/*.js')
    .pipe(env)           // Sets the environment
    .pipe(jasmine())
    .pipe(env.restore());
});

gulp.task('default', ['test', 'apidoc', 'start']);
