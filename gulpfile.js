/*  
    ////  ////  --  --|    GULPFILE
    

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


var dev             = environments.development;
var pro             = environments.production;

var allow_once = true;

var style_org = '',
    style_min = '';

// SASSY GOODNESS
gulp.task( 'sassy', () => {

    var processors = [
        autoprefixer({
            grid: true,
            browsers: ['>1%']
        })
    ];

    return gulp.src( 'assets/styles/*.scss' )
        .pipe( dev( sourcemaps.init() ) )
        .pipe( sass().on( 'error', sass.logError ) )
        .pipe( postcss( processors ) )
        .pipe( pro( minify_css({debug: true}, (details) => {
            if ( allow_once ) {

                style_org = details.stats.originalSize;
                style_min = details.stats.minifiedSize;
            }
        }) ) )
        .pipe( pro( strip_css() ) )
        .pipe( dev( sourcemaps.write() ) )
        .pipe( gulp.dest( 'assets/styles' ) )
        .pipe( browserSync.reload({
            stream: true
        }))
});


//  JAVASCRIPT
gulp.task( 'scripster', () =>
    gulp.src( ['assets/scripts/inc/*.js','assets/scripts/core/*.js'] )
        .pipe( babel ({
            presets: [ 'env' ]
        }))
        .pipe( sourcemaps.init() )
        .pipe( concat( 'core.js' ) )
        .pipe( minify_js() )
        .pipe( sourcemaps.write() )
        .pipe( gulp.dest( 'assets/scripts' ) )
);


// RUN BROWSERSYNC
gulp.task( 'reloader', () => {
    browserSync.init({
        proxy: 'http://localhost:8888/shapeshiftr/',
        port: 8888,
        open: false
    });
});


// WATCHIN YOU [MAIN TASK]
gulp.task( 's', [ 'reloader', 'sassy', 'scripster' ], () => {

    // Alert what environment is currently running
    
    console.log( '--------------------------------------\n' );
    
    if ( dev() ) {
        console.log( chalk.bgMagenta( ` ~ RUNNING DEVELOPMENT ENVIRONMENT ~ \n` ) );
    } else {
        console.log( chalk.bgGreen( ` ~ RUNNING PRODUCTION ENVIRONMENT ~ \n` ) );

        if ( allow_once ) {
            
            var savings = ( ( 100 / style_org  ) * style_min - 100 ) * -1;

            console.log( `style.css minified from ${style_org / 1000}KB to ${style_min / 1000}KB - ${ chalk.green.bold( savings.toFixed( 2 ) + '% saved' )}\n` );
             
            allow_once = false;
        }
    }

    console.log( '--------------------------------------' );

    gulp.watch( 'assets/styles/**/*.scss', [ 'sassy' ] )
    gulp.watch( 'assets/scripts/**/*.js', [ 'scripster', browserSync.reload ] )
    gulp.watch( '**/*.php' ).on( 'change', browserSync.reload );
});

