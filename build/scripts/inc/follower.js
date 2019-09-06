

/*  Element.prototype.follower
 *
 *  @since 1.0
 *
 *  @param settings Object The settings for the floater target element
 *  @polyfill Object.assign
 *
 */

Element.prototype.follower = function( settings = {} ) {

    // The default settings
    let defaults = {
        sections: document.querySelectorAll( 'section' )
    };


    // Assign settings as defaults if settings are not set
    if ( Object.keys( settings ).length == 0 ) settings = defaults;


    // Override the defaults with any defined settings
    let _ = Object.assign( defaults, settings );


    // Global variables
    var nav     = this,
        links   = this.querySelectorAll( 'span' ),

        sections = _.sections,

        section_position,
        section_id,

        section_top,
        section_bottom;
        
        
    links.forEach( link => {

        link.addEventListener( 'click', e => {

            document.querySelector( link.getAttribute( 'data-on-page-link' ) ).animateScroll();
            
        });
    });
        
  

    const action = e => {

        // Get the current scroll position
        let scroll_position = window.pageYOffset || document.documentElement.scrollTop,
            target_point = scroll_position + ( vh() / 2 );


        sections.forEach( section => {

            if ( e.type != 'scroll' ) {

                section_position = section.getBoundingClientRect();

                section_top = section_position.top + scroll_position;
                section_bottom = section_position.bottom + scroll_position;
            }

            let id              = section.getAttribute( 'id' ).substring( 8 ),
                section_top     = section.getBoundingClientRect().top + scroll_position,
                section_bottom  = section.getBoundingClientRect().bottom + scroll_position;

            if ( target_point > section_top && target_point < section_bottom ) {

                links[id - 1].classList.add( 'active' );
                
            } else {

                links[id - 1].classList.remove( 'active' );
            }

        });

    }


    document.addEventListener( 'DOMContentLoaded', action );
    window.addEventListener( 'scroll', action );

}

