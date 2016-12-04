import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import bower from 'bower';
import wrap from 'gulp-wrap';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import ngAnnotate from 'gulp-ng-annotate';
import templateCache from 'gulp-angular-templatecache';
import eslint from 'gulp-eslint';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import path from 'path';
import gutil from 'gulp-util';
import sh from 'shelljs';

const root = 'www/src/';
const paths = {
  dist: 'www/',
  scripts: `${root}/js/**/*.js`,
  styles: `${root}/scss/**/*.scss`,
  templates: `${root}/js/**/*.html`,
  modules: [
    'ionic/js/ionic.bundle.js',
    'ionic.cloud.min.js',
    'ngmap/build/scripts/ng-map.min.js',
    'moment/min/moment-with-locales.min.js',
    'ion-datetime-picker/release/ion-datetime-picker.min.js'
  ],
  static: [
    `${root}/manifest.json`,
    `${root}/index.html`,
    `${root}/fonts/**/*`,
    `${root}/images/**/*`
  ]
};

gulp.task('lintjs', function() {
  return gulp.src(paths.scripts)
    .pipe(plumber({
      errorHandler: notify.onError('Linting FAILED! Check your gulp process.')
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('templates', () => {
  return gulp.src(paths.templates)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(templateCache({
      root: 'js',
      standalone: true,
      transformUrl: function(url) {
        return url.replace(path.dirname(url), '.');
      }
    }))
    .pipe(gulp.dest(paths.dist + 'js/'));
});

gulp.task('modules', () => {
  return gulp.src(paths.modules.map(item => paths.dist + 'lib/' + item))
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist + 'js/'));
});

gulp.task('styles', () => {
  return gulp.src(paths.styles)
    .pipe(plumber({
        errorHandler: notify.onError('SASS processing failed! Check your gulp process.')
    }))
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest(paths.dist + 'css/'));
});

gulp.task('scripts', ['lintjs', 'templates'], () => {
  return gulp.src([
      `${root}/js/**/*.module.js`,
      paths.scripts,
      paths.dist + 'js/templates.js'
    ])
    .pipe(wrap('(function(angular){\n\'use strict\';\n<%= contents %>})(window.angular);'))
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist + 'js/'));
});

gulp.task('watch', ['styles', 'modules', 'scripts'], () => {
  gulp.watch([paths.scripts, paths.templates], ['scripts']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.modules, ['modules']);
});

gulp.task('default', [
  'styles',
  'scripts',
  'watch'
]);

gulp.task('install', ['git-check'], function() {
  bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    })
  return gulp.src('node_modules/@ionic/cloud/dist/bundle/ionic.cloud.min.js').pipe(gulp.dest('www/lib'));
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});