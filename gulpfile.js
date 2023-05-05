const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

function styles() {
    return src('source/scss/style.scss')
    .pipe(autoprefixer({ overrideBrowserlist: ['last 10 version']}))
    // { outputStyle: 'compressed' } compressed file css
    .pipe(concat('style.min.css'))
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(dest('source/css'))
    .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'node_modules/swiper/swiper-bundle.js',
        'source/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('source/js'))
    .pipe(browserSync.stream())
}

function watching() {
    watch(['source/scss/style.scss'], styles)
    watch(['source/js/main.js'], scripts)
    watch(['source/*.html']).on('change', browserSync.reload)
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "source/"
        }
    });
}

function cleanDist() {
    return src('dist')
    .pipe(clean())
}

function building() {
    return src([
        'source/css/style.min.css',
        'source/js/main.min.js',
        'source/**/*.html'
    ], {base : 'source'})
    .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browserSync = browsersync;

exports.build = series(cleanDist, building);

exports.default = parallel(styles, scripts, browsersync, watching);