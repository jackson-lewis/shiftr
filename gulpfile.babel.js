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
//import babel from 'gulp-babel'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'


import gulpWebpack from 'webpack-stream'
import webpack from 'webpack'


/**
 * Settings
 */
const proxy = `shiftr.source`

const SRC = {
    styles: `build/styles/*.scss`,
    scripts: `build/scripts/**/*.js`,
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
 * This sets the environment to dev by default
 */
const ENV = process.env.NODE_ENV || `development`

const isDev = () => ENV === `development`
const isProduction = () => ENV === `production`


/**
 * Compiles the scss files
 * 
 * Source maps are only available on development
 * ®®
 * For production code, files are stripped of comments
 * and minified.
 */
const styles = () =>
    src( [ `build/styles/*.scss`, `build/styles/packets/*.scss` ] )
    .pipe( gulpif( isDev(), sourcemaps.init() ) )
    .pipe( sass().on( `error`, sass.logError ) )
    .pipe( postcss([ autoprefixer({
        grid: true
    }) ]) )
    .pipe( gulpif( isProduction(), cleanCSS() ) )
    .pipe( gulpif( isDev(), sourcemaps.write( `.maps` ) ) )
    .pipe( dest( DEST.styles ) )
    .pipe( browserSync.stream() )
    

/**
 * Compiles the JavaScript files
 * 
 * Source files are only available on development
 * 
 * Concatinated file is minified on production
 */
const frontendScripts = () =>
    src( [ SRC.inc_scripts, SRC.frontend_scripts ] )
    .pipe( babel({
        presets: [ `@babel/env` ]
    }) )
    .pipe( gulpif( isDev(), sourcemaps.init() ) )
    .pipe( concat( `main.js` ) )
    .pipe( gulpif( isDev(), sourcemaps.write( `.maps` ) ) )
    .pipe( gulpif( isProduction(), uglify() ) )
    .pipe( dest( DEST.scripts ) )
    

const backendScripts = () =>
    src( SRC.backend_scripts )
    .pipe( gulpif( isDev(), sourcemaps.init() ) )
    .pipe( babel({
        presets: [ `@babel/env` ]
    }) )
    .pipe( concat( `backend.js` ) )
    .pipe( gulpif( isDev(), sourcemaps.write( `.maps` ) ) )
    .pipe( gulpif( isProduction(), uglify() ) )
    .pipe( dest( DEST.scripts ) )


const es6Scripts = () =>
    src( `build/scripts/frontend/*.js` )
    .pipe( gulpWebpack( require( `./webpack.${ENV}.config.js` ), webpack ) )
    .pipe( dest( DEST.scripts ) )

exports.webpack = es6Scripts


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
exports.watch = () => {
    browserSync.init({
        proxy: proxy,
        open: false,
        notify: false
    })

    watch( `build/styles/**/*.scss`, styles )
    watch( SRC.scripts, series( es6Scripts, reload ) )
    watch( SRC.php ).on( `change`, series( reload ) )
}
    


/**
 * Build the code, either as development or production
 * 
 * Development code with be built by default, so for production code
 * run `gulp build --env production`
 */
exports.build = parallel( styles, frontendScripts, backendScripts )

/**
 * This is the changelog content about Gulp Update
 * General cleanup of the gulpfile.js and Gulp tasks. This is involved all task to be renamed, where most importantly, the previously called `build` task has been renamed to `watch`. And the `compile` task is now `build`. The reason behind this is to bring the naming convention more inline with industry standards, so it made more sense for the task that compile the files (primarily for production) to be called `build`. Each task along with the file itself has been given descriptions to provide more information abuot how the tasks are designed to work.
 */
