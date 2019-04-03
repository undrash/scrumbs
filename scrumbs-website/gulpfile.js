

const gulp              = require( "gulp" );
const babel             = require( "gulp-babel" );
const uglify            = require( "gulp-uglify" );
const uglifycss         = require( "gulp-uglifycss" );



gulp.task( "js", () => {
    return gulp.src('./resources/**/*.js')
        .pipe( babel() )
        .pipe( uglify() )
        .pipe( gulp.dest( "./public" ) );
});


gulp.task( "css", () => {
    return gulp.src( "./resources/**/*.css" )
        .pipe( uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        }))
        .pipe( gulp.dest( "./public") );
});



gulp.task( "default", gulp.parallel( "js", "css" ) );
