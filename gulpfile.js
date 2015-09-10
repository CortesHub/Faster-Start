var gulp = require('gulp'),
  gutil = require('gulp-util'),

  coffee = require('gulp-coffee'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),

  sass = require('gulp-sass'),
  prefix = require('gulp-autoprefixer'),
  minifyCss = require('gulp-minify-css'),

  jade = require('gulp-jade'),////////////////////////////////////////////////////////
    //  yolo putain//
  ////////////////////////////////////////////////////////

  gulpDeployFtp = require('gulp-deploy-ftp'),
  zip = require('gulp-zip'),

  imagemin = require('gulp-imagemin'),
  connect = require('gulp-connect'),
  plumber = require('gulp-plumber'),
  sourcemaps = require('gulp-sourcemaps');

// Prefix is not assured when livereload, only when run $ gulp
// MinifyCss ( assured by sass ), Plumber, gutil, sourceMap not used

// 

var modernizr = 'bower_components/modernizr/modernizr.js',
  classie = 'bower_components/classie/classie.js',
  velocity = 'bower_components/velocity/velocity.min.js',
  app = 'www/js/*.js';

var lib = [modernizr, classie, app];

var ftpOptions = {
  user: '',
  password: '',
  port: '',
  host: '',
  uploadPath: 'www/'
};

// Gulp DOM Tasks

gulp.task('coffee', function () {
  gulp.src('www/js/*.coffee')
    .pipe(coffee({
      bare: false
    }))
    .pipe(uglify())
    .pipe(gulp.dest('www/js/'));

  gulp.src('www/js/*.js')
    .pipe(connect.reload());
});

gulp.task('sass', function () {
  gulp.src('www/css/*.sass')
    .pipe(sass({
      outputStyle: 'uncompressed'
    }))
    .pipe(gulp.dest('www/css/'));

  gulp.src('www/css/*.css')
    .pipe(connect.reload());

  gulp.src('www/*.html')
    .pipe(connect.reload());
});

gulp.task('jade', function () {
  gulp.src('www/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('www/'));

  gulp.src('www/*.html')
    .pipe(connect.reload());
});

// FTP

gulp.task('ftp', function () {
  gulp.src('www/dist/*')
    .pipe(gulpDeployFtp(ftpOptions))
    .pipe(gulp.dest('www/ftp/'));
});

// Zip

gulp.task('zip', function () {
  gulp.src('www/dist/*')
    .pipe(zip('Dist.zip'))
    .pipe(gulp.dest('www/dist/'));
});

// Server

gulp.task('connect', function () {
  connect.server({
    root: 'www/',
    livereload: true
  });
});

// Watcher

gulp.task('watch', function () {

  gulp.watch('www/js/*.coffee', ['coffee']);
  gulp.watch('www/css/*.sass', ['sass']);
  gulp.watch('www/*.jade', ['jade']);

});

// Dist

gulp.task('default', function () {

  gulp.src('www/*.jade')
    .pipe(jade({
      pretty: false
    }))
    .pipe(gulp.dest('www/dist/'));

  gulp.src(lib)
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('www/dist/js/'));

  gulp.src('www/img/*')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('www/dist/img/'));

  gulp.src('www/css/*.sass')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(prefix())
    .pipe(gulp.dest('www/dist/css/'));

});

gulp.task('serve', ['connect', 'watch']);