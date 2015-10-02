var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('build', function() {
    gulp.src('client/app.js')
        .pipe(browserify())
        .pipe(gulp.dest('./client/dist'))
});
