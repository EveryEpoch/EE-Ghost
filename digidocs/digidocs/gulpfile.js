var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass')(require('sass'));
var postcss = require('gulp-postcss');
var cssVariables = require('postcss-css-variables');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var wait = require('gulp-wait');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var zip = require('gulp-zip');
var browserSync = require('browser-sync').create();

gulp.task('css', function() {
    return gulp.src('./assets/scss/screen.scss')
    .pipe(wait(100))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream())
    .pipe(cleanCSS({
        level: {1: {specialComments: 0}},
        compatibility: 'ie9'}))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('concat-js', function() {
    return gulp.src([
        './assets/js/vendor/reframe.js',
        './assets/js/vendor/clipboard.min.js',
        './assets/js/vendor/prism.js',
        './assets/js/vendor/prism-toolbar.min.js',
        './assets/js/vendor/prism-show-language.min.js',
        './assets/js/vendor/prism-copy-to-clipboard.min.js',
        './assets/js/vendor/searchinghost.min.js',
        './assets/js/vendor/medium-zoom.min.js',
        './assets/js/vendor/tlite.min.js',
        './assets/js/vendor/resizeSensor.js',
        './assets/js/vendor/sticky-sidebar.min.js',
        './assets/js/vendor/disqusloader.js',
        './assets/js/index.js'
    ], { allowEmpty: true })
    .pipe(concat('app.bundle.min.js'))
    .pipe(uglify({mangle: {toplevel: true}}))
    .pipe(gulp.dest('./assets/js'));
});

gulp.task('watch', gulp.series('css', 'concat-js', function() {
    browserSync.init({
        proxy: "http://localhost:2368"
    });
    gulp.watch(['./assets/scss/**/*.scss'], { allowEmpty: true }).on('change', gulp.series('css'));
    gulp.watch(['./assets/js/**/*.js', '!./assets/js/app.bundle.min.js'], { allowEmpty: true }).on('change', gulp.series('concat-js', browserSync.reload));
    gulp.watch('./**/*.hbs').on('change', browserSync.reload);
}));

gulp.task('clean', function() {
    return del(['./build', './dist']);
});

gulp.task('build', gulp.series('clean', 'css', 'concat-js', function () {
    var targetDir = 'build/';
    return gulp.src([
        '**',
        '!assets/scss', '!assets/scss/**/*',
        'assets/js/**', '!assets/js/vendor', '!assets/js/vendor/**/*',
        '!node_modules', '!node_modules/**',
        '!build', '!build/**',
        '!dist', '!dist/**'
    ])
    .pipe(gulp.dest(targetDir));
}));

gulp.task('zip', function () {
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    return gulp.src([
        './build/**/*'
    ])
    .pipe(zip(filename))
    .pipe(gulp.dest(targetDir));
});

gulp.task('default', gulp.parallel('watch'));