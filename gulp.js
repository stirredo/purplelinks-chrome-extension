var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var watch = require('gulp-watch')

gulp.task('style', function () {
    return gulp.src('./bower_components/foundation/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css/'))

});

gulp.task('sass', function () {
    return gulp.src('./sass/styles.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function () {
    //gulp.watch('./bower_components/foundation/scss/**/*.scss', ['style']);
    gulp.watch('./sass/**/*.scss', ['sass']);

});


gulp.task('default', ['sass','watch']);
