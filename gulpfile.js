var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var liveserver = require('gulp-live-server');
var ghPages = require('gulp-gh-pages');

gulp.task('default', ['js', 'css', 'html', 'polyfill']);

gulp.task('js', function () {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('polyfill', function () {
  return gulp.src('node_modules/babel-polyfill/dist/polyfill.min.js')
    .pipe(gulp.dest('dist'));
});

gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('watch', function () {
    var server = liveserver.static('dist', 3000);
    server.start();

    gulp.watch('src/**/*.js', ['js']);
    gulp.watch('src/**/*.css', ['css']);
    gulp.watch('src/**/*.html', ['html']);

    gulp.watch('dist/**', function(file) {
        server.notify.apply(server, [file]);
    });
});
