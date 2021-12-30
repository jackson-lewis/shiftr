/**
 * gulpfile
 * 
 * The Gulp build process used in Shiftr is designed to optimise the
 * developer experience as well optimise code for production.
 * 
 * 'gulp-environments' is used to control how the code is handled and compiled
 * based on what you need. For instance you don't need minified code for development
 * and it'll slow down the compilation process, likewise you do want minified code
 * for production for speed optimisation.
 * 
 * Autoprefixer and Babel are used transpile code to support more browsers. By default,
 * CSS Grid support is enabled. For more info on how to effectively use CSS Grid whlist
 * getting the most from Autoprefixer, see https://css-tricks.com/css-grid-in-ie-css-grid-and-the-new-autoprefixer/
 */
import { series, parallel, watch, src, dest } from 'gulp'
import gulpif from 'gulp-if'
import sourcemaps from 'gulp-sourcemaps'
import browserSync from 'browser-sync'
browserSync.create()

// Sass
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cleanCSS from 'gulp-clean-css'

// JavaScript
import webpack from 'webpack-stream'


/**
 * Settings
 */
const proxy = 'shiftr-dev.test'

const SRC = {
    styles: 'src/styles/*.scss',
    stylesPackets: 'src/styles/packets/*.scss',
    incScripts: 'src/scripts/inc/*.js',
    frontendScripts: 'src/scripts/frontend/*.js',
    backendScripts: 'src/scripts/backend/*.js'
}

const DEST = {
    styles: 'assets/styles/',
    scripts: 'assets/scripts/'
}


/**
 * This sets the environment to dev by default
 */
const ENV = process.env.NODE_ENV || 'development'

const isDev = () => ENV === 'development'
const isProduction = () => ENV === 'production'


/**
 * Compiles the scss files
 * 
 * Source maps are only available on development
 * ®®
 * For production code, files are stripped of comments
 * and minified.
 */
const styles = () =>
    src( [ SRC.styles, SRC.stylesPackets ] )
    .pipe( gulpif( isDev(), sourcemaps.init() ) )
    .pipe( sass().on( 'error', sass.logError ) )
    .pipe( postcss([ autoprefixer() ]) )
    .pipe( gulpif( isProduction(), cleanCSS() ) )
    .pipe( gulpif( isDev(), sourcemaps.write( '.maps' ) ) )
    .pipe( dest( DEST.styles ) )
    .pipe( browserSync.stream() )
    

/**
 * Compiles the JavaScript files
 * 
 * Source files are only available on development
 * 
 * Minified on production build only
 */
const scripts = () =>
    src( [ SRC.incScripts, SRC.frontendScripts, SRC.backendScripts ] )
    .pipe( webpack( require( `./webpack.${ ENV }.config.js` ) ) )
    .pipe( dest( DEST.scripts ) )


/**
 * Browser Sync will watch for changes to all php, scss and js files
 * in the theme. Files to watch are specified in the watch task.
 */
const reload = done => {
    browserSync.reload()
    done()
}


/**
 * Build code and watch for changes via Browser Sync
 */
function dev() {
    browserSync.init({
        proxy: proxy,
        open: false,
        notify: false
    })

    watch( 'src/styles/**/*.scss', styles )
    watch( 'src/scripts/**/*.js', series( scripts, reload ) )
    watch( '**/**/*.php' ).on( 'change', series( reload ) )
}

exports.watch = dev
exports.dev = dev
    


/**
 * Build the code, either as development or production
 * 
 * Development code with be built by default, so for production code
 * run 'gulp build --env production'
 */
exports.build = parallel( styles, scripts )
