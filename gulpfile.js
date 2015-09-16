var gulp            = require('gulp'),
    jshint          = require('gulp-jshint'),
    stylish         = require('jshint-stylish'),
    jscs            = require('gulp-jscs'),
    uglify          = require('gulp-uglify'),
    sourcemaps      = require('gulp-sourcemaps');

gulp.task('code-style', function() {
    return gulp.src([
        './src/typed-object.js'
    ])
        .pipe(jscs({
            configPath: '.jscsrc'
        }));
});

gulp.task('lint', function() {
    return gulp.src([
        './src/typed-object.js'
    ])
        .pipe(jshint('./.jshintrc'))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('build', ['code-style', 'lint'], function() {
    return gulp.src([
        './src/typed-object.js'
    ], {
        base: './src/'
    })
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.', {
            isContentIncluded: false
        }))
        .pipe(gulp.dest('./dist/'))
        .on('error', function(e) {
            console.error(e.stack);
        });
});

gulp.task('default', ['build']);