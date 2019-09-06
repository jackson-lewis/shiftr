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
    pro = environments.production,

    // Production vars
    allow_once = true,

    style_org = '',
    style_min = '';


// Styles
gulp.task( 'sassy', () => {

    var processors = [
        autoprefixer({
            grid: true,
            browsers: ['>1%']
        })
    ];

    return gulp.src( [ 'build/styles/*.scss', 'build/styles/packets/*.scss' ] )
        .pipe( dev( sourcemaps.init() ) )
        .pipe( sass().on( 'error', sass.logError ) )
        .pipe( postcss( processors ) )
        .pipe( pro( minify_css({debug: true}, (details) => {
            if ( allow_once ) {

                style_org = details.stats.originalSize;
                style_min = details.stats.minifiedSize;
            }
        }) ) )
        .pipe( strip_css() )
        .pipe( dev( sourcemaps.write() ) )
        .pipe( gulp.dest( 'assets/styles' ) )
        .pipe( browserSync.reload({
            stream: true
        }))
});


//  Scripts
gulp.task( 'scripster', () =>
    gulp.src( [ 'build/scripts/inc/*.js', 'build/scripts/core/*.js' ] )
        .pipe( babel ({
            presets: [ 'env' ]
        }))
        .pipe( dev( sourcemaps.init() ) )
        .pipe( concat( 'core.js' ) )
        .pipe( pro( minify_js() ) )
        .pipe( dev( sourcemaps.write() ) )
        .pipe( gulp.dest( 'assets/scripts' ) )
);


// Browser Sync
gulp.task( 'reloader', () => {
    browserSync.init({
        proxy: 'http://localhost:8888/',
        port: 8888,

        // Disable browserSync from opening browser on launch
        open: false,

        // Disable the browserSync popup on page reload
        notify: false
    });
});


// The Build Task
gulp.task( 'build', [ 'reloader', 'sassy', 'scripster' ], () => {

    // Alert what environment is currently running
    
    console.log( '--------------------------------------\n' );
    
    if ( dev() ) {
        console.log( chalk.bgMagenta( ` ~ RUNNING DEVELOPMENT BUILD CODE ~ \n` ) );
    } else {
        console.log( chalk.bgGreen( ` ~ RUNNING PRODUCTION BUILD CODE ~ \n` ) );

        if ( allow_once ) {
            
            var savings = ( ( 100 / style_org  ) * style_min - 100 ) * -1;

            console.log( `style.css minified from ${style_org / 1000}KB to ${style_min / 1000}KB - ${ chalk.green.bold( savings.toFixed( 2 ) + '% saved' )}\n` );
             
            allow_once = false;
        }
    }

    console.log( '--------------------------------------' );

    gulp.watch( 'build/styles/**/*.scss', [ 'sassy' ] )
    gulp.watch( 'build/scripts/**/*.js', [ 'scripster', browserSync.reload ] )
    gulp.watch( '**/**/*.php' ).on( 'change', browserSync.reload );
});

