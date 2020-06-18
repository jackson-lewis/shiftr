/**
 * Imports
 */
import { generateComponentID, parseComponentData } from '../inc/component-functions'


/**
 * Follower component
 * 
 * @param {object} settings The settings of the component
 */
export default Element.prototype.follower = function( settings = {} ) {

    // The default settings
    let defaults = {
        sections: document.querySelectorAll( 'section' )
    };


    // Assign settings as defaults if settings are not set
    if ( Object.keys( settings ).length == 0 ) settings = defaults;


    // OverrIDe the defaults with any defined settings
    let _ = Object.assign( defaults, settings );


    // Global variables
    var nav     = this,
        links   = this.querySelectorAll( 'span' ),

        sections = _.sections,

        sectionPosition,
        sectionID,

        sectionTop,
        sectionBottom;
        
        
    links.forEach( link => {

        link.addEventListener( 'click', e => {

            document.querySelector( link.getAttribute( 'data-on-page-link' ) ).animateScroll();
            
        });
    });
        
  

    const action = e => {

        // Get the current scroll position
        let scrollPosition = window.pageYOffset || document.documentElement.scrollTop,
            targetPoint = scrollPosition + ( vh() / 2 );


        sections.forEach( section => {

            if ( e.type != 'scroll' ) {

                sectionPosition = section.getBoundingClientRect();

                sectionTop = sectionPosition.top + scrollPosition;
                sectionBottom = sectionPosition.bottom + scrollPosition;
            }

            let ID              = section.getAttribute( 'id' ).substring( 8 ),
                sectionTop     = section.getBoundingClientRect().top + scrollPosition,
                sectionBottom  = section.getBoundingClientRect().bottom + scrollPosition;

            if ( targetPoint > sectionTop && targetPoint < sectionBottom ) {

                links[ID - 1].classList.add( 'active' );
                
            } else {

                links[ID - 1].classList.remove( 'active' );
            }

        });

    }


    document.addEventListener( 'DOMContentLoaded', action );
    window.addEventListener( 'scroll', action );

}

