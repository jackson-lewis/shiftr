/*  
    ////  ////  --  --|    gulpfile.js
    

    Where the magic happens
*/


var gulp            = require( 'gulp' ),

    environments    = require( 'gulp-environments' ),
    chalk           = require( 'chalk' ),

    sourcemaps      = require( 'gulp-sourcemaps' ),

    postcss         = require( 'gulp-postcss' ),
    sass            = require( 'gulp-sass' ),
    strip_css       = require( 'gulp-strip-css-comments' ),
    minify_css      = require( 'gulp-clean-css' ),
    autoprefixer    = require( 'autoprefixer' ),

    babel           = require( 'gulp-babel' ),
    concat          = require( 'gulp-concat' ),
    strip_js        = require( 'gulp-strip-comments' ),
    minify_js       = require( 'gulp-minify' ),

    browserSync     = require( 'browser-sync' ).create();


// Our variables
var dev = environments.development,
    pro = environments.production;


// Styles
gulp.task( 'sassy', () => {

    var processors = [
        autoprefixer({
            grid: true
        })
    ];

    return gulp.src( [ 'build/styles/*.scss', 'build/styles/packets/*.scss' ] )
        .pipe( dev( sourcemaps.init() ) )
        .pipe( sass().on( 'error', sass.logError ) )
        .pipe( postcss( processors ) )
        .pipe( pro( minify_css() ) )
        .pipe( pro( strip_css() ) )
        .pipe( dev( sourcemaps.write() ) )
        .pipe( gulp.dest( 'assets/styles' ) )
        .pipe( browserSync.reload({
            stream: true
        }))
});


//  Scripts
gulp.task( 'scripster', () =>
    gulp.src( [ 'build/scripts/inc/*.js', 'build/scripts/*.js' ] )
        .pipe( babel ({
            presets: [ 'env' ]
        }))
        .pipe( dev( sourcemaps.init() ) )
        .pipe( concat( 'script.js' ) )
        .pipe( pro( minify_js() ) )
        .pipe( dev( sourcemaps.write() ) )
        .pipe( gulp.dest( 'assets/scripts' ) )
);


// Browser Sync
gulp.task( 'reloader', () => {
    browserSync.init({
        proxy: 'shiftr.source',
        open: false,
        notify: false
    });
});


// The Build Task
gulp.task( 'build', [ 'sassy', 'scripster', 'reloader' ], () => {

    console.log( '--------------------------------------\n' );
    
    console.log( chalk.bgMagenta( ` Running Development Build... \n` ) );

    console.log( '--------------------------------------' );

    gulp.watch( 'build/styles/**/*.scss', [ 'sassy' ] )
    gulp.watch( 'build/scripts/**/*.js', [ 'scripster', browserSync.reload ] )
    gulp.watch( '**/**/*.php' ).on( 'change', browserSync.reload );
});


// Compile css and js assets on deployments
gulp.task( 'compile', [ 'sassy', 'scripster' ], () => {

    console.log( '--------------------------------------\n' );

    if ( dev() ) {
        console.log( chalk.bgMagenta( ` Compiling code... \n` ) );
    } else {
        console.log( chalk.bgGreen( ` Compiling code for production... \n` ) );
    }

    console.log( '--------------------------------------' );
});

