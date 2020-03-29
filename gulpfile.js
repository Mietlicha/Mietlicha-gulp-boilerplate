const gulp = require('gulp');
const sass = require('gulp-sass');
const sasslint = require('gulp-sass-lint');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const del = require('del');

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      watch: true,
      baseDir: 'dist'
    }
  });
});

gulp.task('sass-lint', function() {
  return gulp
    .src(['src/scss/**/*.scss'])
    .pipe(sasslint())
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
});

gulp.task('sass', function() {
  return gulp
    .src('src/scss/styles.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(postcss([autoprefixer()]))
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task('js', function() {
  return gulp
    .src('src/js/*.js')
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task('html', function() {
  return gulp
    .src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*.ttf').pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function() {
  return gulp
    .src('src/images/**/*')
    .pipe(changed('dist/images'))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('clean', function() {
  return del(['./dist']);
});

gulp.task('watch', function() {
  gulp.watch(
    [
      'src/js/**/*.js',
      'src/*.html',
      'src/fonts/**/*',
      'src/images/**/*',
      'src/scss/**/*.scss'
    ],
    gulp.series(['clean', 'js', 'html', 'fonts', 'images', 'sass', 'sass-lint'])
  );
});

gulp.task(
  'default',
  gulp.series('clean', [
    'js',
    'html',
    'sass',
    'sass-lint',
    'fonts',
    'images',
    gulp.parallel(['watch', 'browserSync'])
  ])
);
