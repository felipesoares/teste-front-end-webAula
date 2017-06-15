var gulp = require('gulp');
var clearRequire = require('clear-require');
var browserSync = require('browser-sync').create();

const path = require('path');
var clean = require('gulp-clean');

var replace = require('gulp-replace');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');

// CSS
var compass = require('gulp-compass');
var concatCss = require('gulp-concat-css');
var importCss = require('gulp-import-css');
var cssimport = require("gulp-cssimport");
var cleanCSS = require('gulp-clean-css');

// JS
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var libsJS, assetsJS;

gulp.task('compass', function () {
    gulp.src('./assets/sass/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            css: './assets/css',
            sass: './assets/sass',
            sourcemap: true,
            task: 'watch',
            debug: false
        }))
});

gulp.task('compile', function () {
    gulp.src('./assets/sass/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            css: './assets/css',
            sass: './assets/sass',
            sourcemap: false,
            task: 'compile',
            debug: false
        }))
});

gulp.task('fonts', ['cleanFonts', 'copyFonts'], function () {});

gulp.task('cleanFonts', function () {
    return gulp.src('./dist/fonts/*', {
            read: false
        })
        .pipe(clean());
});

gulp.task('copyFonts', function () {
    // './bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}'
    gulp.src('./assets/fonts/*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('css', function () {
    runSequence(['cssIE8', 'cssIE9']);
    return gulp.src(['./assets/css/style.css'])
        .pipe(concatCss("style.min.css"))
        .pipe(cssimport())
        .pipe(cleanCSS())
        .pipe(gulp.dest("./dist/css/"));
});

gulp.task('cssIE8', function () {
    return gulp.src(['./assets/css/ie8.css'])
        .pipe(cssimport())
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest("./dist/css/"));
});

gulp.task('cssIE9', function () {
    return gulp.src(['./assets/css/ie9.css'])
        .pipe(cssimport())
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest("./dist/css/"));
});

gulp.task('cssLibs', function () {
    return gulp.src(['./assets/css/bibliotecas.css'])
        .pipe(cssimport())
        .pipe(cleanCSS())
        .pipe(replace('../../bower_components/', ''))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest("./dist/css/"));
});

gulp.task('joinPathsLibsJS', function () {

    clearRequire('./scripts.json');
    libsJS = require('./scripts.json');

    for (var i = 0; i < libsJS['libs'].length; i++) {
        libsJS['libs'][i] = path.join('./bower_components/', libsJS['libs'][i]);
    }
});

gulp.task('joinPathsAssetsJS', function () {

    clearRequire('./scripts.json');
    assetsJS = require('./scripts.json');

    for (var i = 0; i < assetsJS['assets'].length; i++) {
        assetsJS['assets'][i] = path.join('./assets/', assetsJS['assets'][i]);
    }
});

gulp.task('jsLibs', function () {
    return gulp.src(libsJS['libs'])
        .pipe(concat('bibliotecas.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('jsAssets', function () {
    return gulp.src(assetsJS['assets'])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js', ['joinPathsLibsJS', 'joinPathsAssetsJS', 'jsLibs', 'jsAssets'], function () {});

gulp.task('reloadCSS', function () {
    return gulp.src("./assets/css/*.css")
        .pipe(browserSync.stream());
});

gulp.task('browser-sync', function () {
    browserSync.init({
        open: 'external', // false,
        //host: '',
        //proxy: 'webaula.localhost.com',
        port: 3000,
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', ['fonts', 'browser-sync', 'compass', 'css', 'js'], function () {
    // CSS
    gulp.watch(["./assets/css/*.css", "!./assets/css/bibliotecas.css"], ['css', 'reloadCSS']);
    gulp.watch(["./assets/css/bibliotecas.css"], ['cssLibs', 'reloadCSS']);
    // JS
    gulp.watch("./scripts.json", ['js']);
    gulp.watch("./assets/js/*.js", ['jsAssets']);
    gulp.watch("./assets/js/*.js").on('change', browserSync.reload);
});

gulp.task('build', ['compile'], function (callback) {
    setTimeout(function () {
        runSequence(['fonts', 'cssLibs', 'css', 'js'], callback);
    }, 5000);
});