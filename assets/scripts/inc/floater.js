

/*  Element.prototype.floater
 *
 *  @since 1.0
 *
 *  @param settings Object The settings for the floater target element
 *  @polyfill Object.assign
 *
 */

Element.prototype.floater = function( settings = {} ) {

    // The default settings
    let defaults = {
        bounding: this.parentElement,                   // Element
        float_buffer: 0,                                // Integar
        header: document.querySelector( '.header' ),    // Element|null
        starting: null,                                 // null|Element
        ending: null,
        events: {
            resize: window,
            orientationchange: window
        }
    };


    // Assign settings as defaults if settings are not set
    if ( Object.keys( settings ).length == 0 ) settings = defaults;


    // Override the defaults with any defined settings
    let _ = Object.assign( defaults, settings );


    // Global variables
    var floater  = this,
        bounding = _.bounding,

        floater_position,
        floater_left,
        bounding_position,
        bounding_top,
        bounding_bottom,

        float_position = _.float_buffer,

        position_top,
        position_bottom,

        starting_point,
        ending_point;


    // Check if header height should be included in float_position
    if ( _.header ) float_position += _.header.offsetHeight;


    // The core function that event listeners are appended to
    const action = function( e ) {

        // Get the current scroll position
        let scroll_position = window.pageYOffset || document.documentElement.scrollTop;


        // We do not want to redefine the following on a scroll
        if ( e.type != 'scroll' ) {

            floater_position    = floater.getBoundingClientRect();
            bounding_position   = bounding.getBoundingClientRect();

            floater_left        = floater_position.left;

            if ( _.starting !== null ) {
                starting_point = _.starting.getBoundingClientRect().top + scroll_position;

            } else {
                starting_point = bounding_position.top + scroll_position;
            }

            if ( _.ending !== null ) {
                ending_point = _.ending.getBoundingClientRect().bottom + scroll_position;

            } else {
                ending_point = bounding_position.bottom + scroll_position;
            }
        }


        // Setup the starting and ending points including buffer areas
        position_top        = scroll_position + float_position;
        position_bottom     = scroll_position + float_position + floater.offsetHeight;


        // Decide what state the floater should be in based on scroll position...
        if ( position_bottom >= ending_point ) {
            floater.classList.add( 'pause' );
            floater.classList.remove( 'sticky' );
            floater.setAttribute( 'style', '' );

        } else if ( position_top >= starting_point ) {
            floater.style.width = bounding.offsetWidth + 'px';
            floater.style.top = float_position + 'px';
            floater.style.left = bounding_position.left + 'px';
            floater.classList.add( 'sticky' );
            floater.classList.remove( 'pause' );

        } else if ( position_top <= starting_point ) {
            floater.classList.remove( 'sticky' );
            floater.setAttribute( 'style', '' );
        }
    } 


    // The event listeners...
    Object.keys( _.events ).forEach( function( e ) {
        _.events[e].addEventListener( e, action );
    });

    document.addEventListener( 'DOMContentLoaded', action );
    window.addEventListener( 'scroll', action );

}

