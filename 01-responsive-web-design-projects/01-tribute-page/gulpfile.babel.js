'use strict';

import gulp from 'gulp';
import path from 'path';
import data from 'gulp-data';
import pug from 'gulp-pug';
import prefix from 'gulp-autoprefixer';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';

const paths = {
  public: './public/',
  sass: './src/sass/',
  css: './public/css/',
  data: './src/_data/',
  img: './img/'
};

gulp.task('pug', function () {
  return gulp.src('./src/*.pug')
    .pipe(data(function (file) {
      return require(paths.data + path.basename(file.path) + '.json');
    }))
    .pipe(pug())
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest(paths.public));
});

gulp.task('rebuild', ['pug'], function () {
  browserSync.reload();
});

gulp.task('browser-sync', ['sass', 'pug', 'img'], function () {
  browserSync({
    server: {
      baseDir: paths.public
    },
    notify: false
  });
});

gulp.task('sass', function () {
  return gulp.src(paths.sass + '*.scss')
    .pipe(sass({
      includePaths: [paths.sass],
      outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('img', function() {
  return gulp.src('./src/' + paths.img + '**/*.*')
    .pipe(gulp.dest('./public/' + paths.img));
});

gulp.task('watch', function () {
  gulp.watch(paths.sass + '**/*.scss', ['sass']);
  gulp.watch('./src/**/*.pug', ['rebuild']);
  gulp.watch('./src/' + paths.img + '**/*.*', ['img']);
  gulp.watch(paths.data + '**/*.json', ['pug']);
});

gulp.task('build', ['sass', 'pug']);

gulp.task('default', ['browser-sync', 'watch']);
