/**
 * gulpfile
 * 
 * The Gulp build process used in Shiftr is designed to optimise the
 * developer experience as well optimise code for production.
 * 
 * `gulp-environments' is used to control how the code is handled and compiled
 * based on what you need. For instance you don't need minified code for development
 * and it'll slow down the compilation process, likewise you do want minified code
 * for production for speed optimisation.
 * 
 * Autoprefixer and Babel are used transpile code to support more browsers. By default,
 * CSS Grid support is enabled. For more info on how to effectively use CSS Grid whlist
 * getting the most from Autoprefixer, see https://css-tricks.com/css-grid-in-ie-css-grid-and-the-new-autoprefixer/
 */
import { series, parallel, watch, src, dest } from 'gulp'
import sourcemaps from 'gulp-sourcemaps'
import browserSync from 'browser-sync'
browserSync.create()

// Sass
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'

// JavaScript
import babel from 'gulp-babel'
import concat from 'gulp-concat'


const SRC = {
    styles: `build/styles/*.scss`,
    inc_scripts: `build/scripts/inc/*.js`,
    frontend_scripts: `build/scripts/frontend/*.js`,
    backend_scripts: `build/scripts/backend/*.js`,
    php: `**/**/*.php`
}

const DEST = {
    styles: `assets/styles/`,
    scripts: `assets/scripts/`
}


/**
 * We handle environments using `gulp-environments`
 * 
 * Pretty simple, we only use development and production.
 * 
 * Development code should be used for both dev and staging environments.
 */



/**
 * Compiles the scss files
 * 
 * Source maps are only available on development
 * 
 * For production code, files are stripped of comments
 * and minified.
 */
const styles = () => 
    src( [ `build/styles/*.scss`, `build/styles/packets/*.scss` ] )
    .pipe( sourcemaps.init() )
    .pipe( sass() )
    .pipe( postcss([ autoprefixer({
        grid: true
    }) ]) )
    .pipe( sourcemaps.write( `.maps` ) )
    .pipe( dest( DEST.styles ) )
    .pipe( browserSync.stream() )

exports.styles = styles


/**
 * Compiles the JavaScript files
 * 
 * Source files are only available on development
 * 
 * Concatinated file is minified on production
 * 
 * [ `build/scripts/inc/*.js`, `build/scripts/*.js` ]
 */
const frontendScripts = () => 
    src( [ SRC.inc_scripts, SRC.frontend_scripts ] )
    .pipe( sourcemaps.init() )
    .pipe( babel({
        presets: [ `@babel/env` ]
    }) )
    .pipe( concat( `main.js` ) )
    .pipe( sourcemaps.write( `.maps` ) )
    .pipe( dest( DEST.scripts ) )

exports.frontendScripts = frontendScripts


const backendScripts = () => 
    src( SRC.backend_scripts )
    .pipe( sourcemaps.init() )
    .pipe( babel({
        presets: [ `@babel/env` ]
    }) )
    .pipe( concat( `backend.js` ) )
    .pipe( sourcemaps.write( `.maps` ) )
    .pipe( dest( DEST.scripts ) )

exports.backendScripts = backendScripts


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
exports.watch = () =>
    browserSync.init({
        proxy: `shiftr.source`,
        open: false
    })

    watch( `build/styles/**/*.scss`, styles )
    watch( SRC.frontend_scripts, series( frontendScripts, reload ) )
    watch( SRC.php ).on( `change`, series( reload ) )


/**
 * Build the code, either as development or production
 * 
 * Development code with be built by default, so for production code
 * run `gulp build --env production`
 */
exports.build = series( styles, frontendScripts, backendScripts )

/**
 * This is the changelog content about Gulp Update
 * General cleanup of the gulpfile.js and Gulp tasks. This is involved all task to be renamed, where most importantly, the previously called `build` task has been renamed to `watch`. And the `compile` task is now `build`. The reason behind this is to bring the naming convention more inline with industry standards, so it made more sense for the task that compile the files (primarily for production) to be called `build`. Each task along with the file itself has been given descriptions to provide more information abuot how the tasks are designed to work.
 */
