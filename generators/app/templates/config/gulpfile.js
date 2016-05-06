var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
<% if (usesRAML) { %>var raml2html = require('gulp-raml2html');<% } %>
<% if (usesTests) { %>var jasmine = require('gulp-jasmine');
var processEnv = require('gulp-process-env');
var istanbul = require('gulp-istanbul');
var isparta = require('isparta');<% } %>
var shell = require('gulp-shell');

gulp.task('lint', function() {
  return gulp.src('./server/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('start', [<% if (usesRAML) { %>'apidoc', <% } %>'lint' <% if (usesTests) { %>, 'test' <% } %>], function () {
  nodemon({
    script: 'server',
    ext: 'js',
    env: { '<%= appPrefix %>_NODE_ENV': 'local' },
    tasks: ['lint']
  })
  .on('restart', function () {
    console.log('server restarted!');
  });
});

<% if (usesRAML) { %>
gulp.task('apidoc', function() {
  return gulp.src('raml/api.raml')
    .pipe(raml2html())
    .pipe(gulp.dest('documentation'));
});
  <% } %>

<% if (usesTests) { %>
gulp.task('pre-test', function () {
  return gulp.src([
      './server/**/*.js',
      '!./server/**/index.js',
      '!./server/config/environment/**/*'
    ])
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});


gulp.task('test', ['pre-test'], function() {
  var env = processEnv({<%= appPrefix %>_NODE_ENV: 'test'});
  return gulp.src('tests/**/*.js')
    .pipe(env)           // Sets the environment
    .pipe(jasmine())
    .pipe(istanbul.writeReports({
      reporters: ['text', 'text-summary', 'html', 'cobertura'],
      reportOpts: { dir: './coverage' }
    }))
    // .pipe(istanbul.enforceThresholds({ thresholds: { global: 75 } }))
    .pipe(env.restore());
});

gulp.task('tests.watch', function () {
  gulp.start('test');
  gulp.watch('./tests/**/*.js', { verbose: true } ['test']);
});

<% } %>

gulp.task('default', ['start']);



gulp.task('deploy', shell.task([
  'sh marathon_deploy.sh'
], {
  interactive: true
}));
