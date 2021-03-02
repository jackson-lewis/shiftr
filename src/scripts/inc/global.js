/**
 * Core document elements
 */
const header    = document.querySelector( 'header.site-header' ),    
      head      = document.getElementsByTagName( 'head' )[0],
      body      = document.body;

const Layout = { header, head, body }


/**
 * Wrapper to document.createElement
 * 
 * @param {string} el The node tag name
 * @return {HTMLElement} The HTML element
 */
function createEl( el ) {

    return document.createElement( el )
}


/**
 * Get the width of the viewport
 * 
 * @return {integer} The window.innerWidth
 */
function vw() {
    return window.innerWidth
}


/**
 * Get the height of the viewport
 * 
 * @return {integer} The window.innerHeight
 */
function vh() {
    return window.innerHeight
}


/*  ////  --|    Width Breakpoint - the JS equivilant to CSS media queries

    * Ensure breakpoint settings match those set in the styles
*/

const s   = 's';
const m   = 'm';
const l   = 'l';
const xl  = 'xl';
const max = 'max';


/**
 * CSS media query equivilant to 'min-width'
 * 
 * @param {integar|string} width The breakpoint width to match
 * @param {function} fn The function to run when match is met
 * @param {function} callback The function to run when match is not met
 * @param {boolean} runOnce Whether to run only on load
 */
function x( width, fn, callback = () => {}, runOnce = false ) {
    let value

    switch ( width ) {
        case s:     value = 450; break
        case m:     value = 768; break
        case l:     value = 1024; break
        case xl:    value = 1600; break
        case max:   value = 1920; break
        default:    value = width
    }

    const run = () => {
        let allow = false

        if ( vw() >= value ) {
            if ( runOnce && ! allow ) return;
            fn()

            allow = false

        } else {
            if ( runOnce && allow ) return;
            callback()

            allow = true
        } 
    }

    document.addEventListener( 'DOMContentLoaded', run )
    window.addEventListener( 'resize', run )
    window.addEventListener( 'orientationchange', run )
}

/**
 * Exports
 */
export { Layout, createEl, vw, vh, x }
