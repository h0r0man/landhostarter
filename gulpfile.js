'use strict';

// Project ---------------------------------------------------------------------

var url                   = 'http://landhostarter.dev/',
    source                = './src',
    destination           = './dist',
    browserSyncPort       = 8012,
    AUTOPREFIXER_BROWSERS = {
      browsers: [
        'last 3 versions',
        'ie 11',
        'ie 10',
        'ios >= 7',
        'android >= 4'
      ]
    };

// Gulp ------------------------------------------------------------------------

var gulp         = require('gulp'),
    cache        = require('gulp-cache'),
    runSequence  = require('run-sequence'),
    flatten      = require('gulp-flatten'),
    rename       = require('gulp-rename');

// Stylesheets -----------------------------------------------------------------

var sass         = require('gulp-sass'),
    combineMq    = require('gulp-combine-mq'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano      = require('gulp-cssnano'),
    csscomb      = require('gulp-csscomb'),
    bourbon      = require('node-bourbon').includePaths,
    neat         = require('node-neat').includePaths;

// JavaScripts -----------------------------------------------------------------

var include      = require('gulp-include'),
    uglify       = require('gulp-uglify');

// BrowserSync -----------------------------------------------------------------

var browserSync  = require('browser-sync').create(),
    reload       = browserSync.reload;

// Stylesheets -----------------------------------------------------------------

gulp.task('stylesheets', function() {
  gulp.src(source + '/stylesheets/**/*.{scss,sass}')
    .pipe(sass({
      includePaths: bourbon,
      includePaths: neat,
      precision: 6
    }).on('error', sass.logError))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(combineMq())
    .pipe(csscomb())
    .pipe(cssnano())
    .pipe(gulp.dest(destination + '/css'))
    .pipe(browserSync.stream());
});

// Scripts ---------------------------------------------------------------------

gulp.task('scripts', function() {
  return gulp.src([source + '/scripts/{vendor,main}.js'])
    .pipe(include())
    .pipe(uglify())
    .pipe(gulp.dest(destination + '/js'))
    .pipe(browserSync.stream());
});

// Images ----------------------------------------------------------------------

gulp.task('images', function() {
  return gulp.src(source + '/images/**/*')
    .pipe(gulp.dest(destination + '/img'))
    .pipe(browserSync.stream());
});

// Fonts -----------------------------------------------------------------------

gulp.task('fonts', function() {
  return gulp.src(source + '/webfonts/**/*')
    .pipe(flatten())
    .pipe(gulp.dest(destination + '/webfonts'))
    .pipe(browserSync.stream());
});

// Watch -----------------------------------------------------------------------

gulp.task('watch', function() {
  browserSync.init({
    files: ['{template-pages,templates-parts,inc}/**/*.php', '*.php'],
    proxy: url,
    port: browserSyncPort,
    notify: false,
    ghostMode: {
      clicks: false,
      scroll: false,
      forms: {
        submit: false,
        inputs: false,
        toggles: false
      }
    },
    snippetOptions: {
      whitelist: ['/wp-admin/admin-ajax.php'],
      blacklist: ['/wp-admin/**']
    }
  });

  gulp.watch(source + '/stylesheets/**/*.{scss,sass}', ['stylesheets']);
  gulp.watch(source + '/scripts/**/*.js', ['scripts']);
  gulp.watch(source + '/webfonts/**/*', ['fonts']);
  gulp.watch(source + '/images/**/*', ['images']);
  gulp.watch(['build']);
});

// Clear -----------------------------------------------------------------------

gulp.task('clear', function (done) {
  return cache.clearAll(done);
});

// Build -----------------------------------------------------------------------

gulp.task('build', function(callback) {
  runSequence('clear', 'stylesheets', 'scripts', 'images', 'fonts', callback);
});

// Gulp ------------------------------------------------------------------------

gulp.task('default', function() {
  gulp.start('build');
});
