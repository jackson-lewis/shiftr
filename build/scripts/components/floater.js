/**
 * Floater component
 * 
 * @param {object} settings The settings of the component
 */
export default Element.prototype.floater = function( settings = {} ) {

    // The default settings
    let defaults = {
        bounding: this.parentElement,                   // Element
        float_buffer: 0,                                // Integar
        header: header,                                 // Element|null
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

        floaterPosition,
        floater_left,
        boundingPosition,
        bounding_top,
        bounding_bottom,

        floatPosition = _.float_buffer,

        positionTop,
        positionBottom,

        startingPoint,
        endingPoint;


    // Check if header height should be included in floatPosition
    if ( _.header ) floatPosition += _.header.offsetHeight;


    // The core function that event listeners are appended to
    const action = function( e ) {

        // Get the current scroll position
        let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;


        // We do not want to redefine the following on a scroll
        if ( e.type != 'scroll' ) {

            floaterPosition    = floater.getBoundingClientRect();
            boundingPosition   = bounding.getBoundingClientRect();

            if ( _.starting !== null ) {
                startingPoint = _.starting.getBoundingClientRect().top + scrollPosition;

            } else {
                startingPoint = boundingPosition.top + scrollPosition;
            }

            if ( _.ending !== null ) {
                endingPoint = _.ending.getBoundingClientRect().bottom + scrollPosition;

            } else {
                endingPoint = boundingPosition.bottom + scrollPosition;
            }
        }


        // Setup the starting and ending points including buffer areas
        positionTop        = scrollPosition + floatPosition;
        positionBottom     = scrollPosition + floatPosition + floater.offsetHeight;


        // Decide what state the floater should be in based on scroll position...
        if ( positionBottom >= endingPoint ) {
            floater.classList.add( 'pause' );
            floater.classList.remove( 'sticky' );
            floater.setAttribute( 'style', '' );

        } else if ( positionTop >= startingPoint ) {
            floater.style.width = bounding.offsetWidth + 'px';
            floater.style.top = floatPosition + 'px';
            floater.style.left = boundingPosition.left + 'px';
            floater.classList.add( 'sticky' );
            floater.classList.remove( 'pause' );

        } else if ( positionTop <= startingPoint ) {
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

