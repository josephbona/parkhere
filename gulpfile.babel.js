import gulp from 'gulp';
import concat from 'gulp-concat';
import bower from 'bower';
import wrap from 'gulp-wrap';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import ngAnnotate from 'gulp-ng-annotate';
import templateCache from 'gulp-angular-templatecache';
// import server from 'browser-sync';
// import del from 'del';
import path from 'path';
import gutil from 'gulp-util';
import sh from 'shelljs';

const root = 'www/src/';
const paths = {
  dist: 'www/',
  scripts: `${root}/js/**/*.js`,
  styles: `${root}/scss/*.scss`,
  templates: `${root}/js/**/*.html`,
  modules: [
    'ionic/js/ionic.bundle.js',
    'ionic.cloud.min.js'
  ],
  static: [
    `${root}/manifest.json`,
    `${root}/index.html`,
    `${root}/fonts/**/*`,
    `${root}/images/**/*`
  ]
};

// server.create();

// gulp.task('clean', cb => del(paths.dist + '**/*', cb));

gulp.task('templates', () => {
  return gulp.src(paths.templates)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(templateCache({
      root: 'js',
      standalone: true,
      transformUrl: function (url) {
        return url.replace(path.dirname(url), '.');
      }
    }))
    .pipe(gulp.dest(paths.dist + 'js/'));
});

gulp.task('modules', ['templates'], () => {
  return gulp.src(paths.modules.map(item => paths.dist + 'lib/' + item))
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist + 'js/'));
});

gulp.task('styles', () => {
  return gulp.src(paths.styles)
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest(paths.dist + 'css/'));
});

gulp.task('scripts', ['modules'], () => {
  return gulp.src([
      `${root}/js/**/*.module.js`,
      paths.scripts,
      paths.dist + 'js/templates.js'
    ])
    .pipe(wrap('(function(angular){\n\'use strict\';\n<%= contents %>})(window.angular);'))
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist + 'js/'));
});

// gulp.task('copy', ['clean'], () => {
//   return gulp.src(paths.static, { base: 'src' })
//     .pipe(gulp.dest(paths.dist));
// });

gulp.task('watch', ['styles', 'scripts'], () => {
  gulp.watch([paths.scripts, paths.templates], ['scripts']);
  gulp.watch(paths.styles, ['styles']);
});

gulp.task('default', [
  'styles',
  'scripts',
  'watch'
]);

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
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