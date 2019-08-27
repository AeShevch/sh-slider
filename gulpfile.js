const gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat');
plumber = require('gulp-plumber');

function scss() {
    return gulp.src(
        [
            'src/*.scss',
            'node_modules/swiper/dist/css/swiper.min.css'
        ])
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            level: {
                1: {
                    specialComments: 0
                }
            }
        }))
        .pipe(concat("bundle.css"))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream());
}

function js() {
    return gulp.src(
        [
        'node_modules/swiper/dist/js/swiper.min.js',
        'node_modules/swiper-animation/build/swiper-animation.min.js',
        'src/script.js'
        ])
        .pipe(plumber())
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat("bundle.js"))
        .pipe(gulp.dest("js"))
        .pipe(browserSync.stream());
}

function clean() {
    return del(['css/style.css', 'js/script.js'])
}

gulp.task('scss', scss);
gulp.task('js', js);

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('src/style.scss', scss);
    gulp.watch('src/script.js', js);
}

gulp.task('watch', watch);

gulp.task('build', gulp.series(
    clean,
    gulp.parallel(scss, js)
));

gulp.task('default', gulp.series('build', 'watch'));

