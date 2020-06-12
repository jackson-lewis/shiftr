

import { parseComponentData, generateComponentID } from './_init'

/*  ////  --|    Element.prototype.accordion( settings = {} )

    * Create an accordion component
*/

export default function( settings = {} ) {

    // The default settings
    let defaults = {
        itemsTarget:    '.accordion--item',
        duration:       600,
        firstOpen:      true,
        allowMultiOpen: false
    };

    // Assign settings as defaults if settings are not set
    if ( Object.keys( settings ).length == 0 ) settings = defaults;

    // Override the defaults with any defined settings, and parse any settings set via data attributes
    let _ = parseComponentData( Object.assign( defaults, settings ), this, 'accordion' );


    let accordion       = this,
        items           = this.querySelectorAll( _.itemsTarget );


    // Verify that there is at least 1 item in the accordion
    if ( items.length <= 0 ) return;
    

    // Generate a ID for the accordion
    let accordionID = generateComponentID( this, 'accordion' );


    //  --|    function Open an item
    
    let expand = el => {

        el.classList.add( 'is-expanded' );

        const label = el.children[0],
              panel = el.children[1];

        // ARIA
        label.setAttribute( 'aria-selected', 'true' );

        panel.removeAttribute( 'hidden' );

        // Styling & transition
        panel.style.removeProperty( 'display' );

        let display = window.getComputedStyle( panel ).display;

        if ( display === 'none' ) {
            display = 'block';
        }

        panel.style.display = display;

        let height = panel.offsetHeight;

        panel.style.overflow = 'hidden';
        panel.style.height = 0;
        panel.style.paddingTop = 0;
        panel.style.paddingBottom = 0;
        panel.offsetHeight;
        panel.style.transitionProperty = "height, padding";
        panel.style.transitionDuration = _.duration + 'ms';
        panel.style.height = height + 'px';

        panel.style.removeProperty( 'padding-top' );
        panel.style.removeProperty( 'padding-bottom' );

        setTimeout( e => {
            panel.style.removeProperty( 'height' );
            panel.style.removeProperty( 'overflow' );
            panel.style.removeProperty( 'transition-duration' );
            panel.style.removeProperty( 'transition-property' );
        }, _.duration );
    };


    //  --|    function Close an item
     
    let contract = el => {

        el.classList.remove( 'is-expanded' );

        const label = el.children[0],
              panel = el.children[1];

        // ARIA
        label.setAttribute( 'aria-selected', false );

        panel.setAttribute( 'hidden', '' );

        // Styling & transition
        panel.style.transitionProperty = 'height, padding';
        panel.style.transitionDuration = _.duration + 'ms';
        panel.style.height = panel.offsetHeight + 'px';
        panel.offsetHeight;
        panel.style.overflow = 'hidden';
        panel.style.height = 0;
        panel.style.paddingTop = 0;
        panel.style.paddingBottom = 0;

        setTimeout( e => {
            panel.style.display = 'none';
            panel.style.removeProperty( 'height' );
            panel.style.removeProperty( 'padding-top' );
            panel.style.removeProperty( 'padding-bottom' );
            panel.style.removeProperty( 'overflow' );
            panel.style.removeProperty( 'transition-duration' );
            panel.style.removeProperty( 'transition-property' );
        }, _.duration );
    };


    //  --|    Create SVG item status indicator

    var svgBuilderRun = false

    let svgIndicator,
        svgBuilder = () => {

            // If function has already run, return cloned copy
            if ( svgBuilderRun ) return svgIndicator.cloneNode( true );

            let svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ),
                path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );

            svg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
            svg.setAttribute( 'viewBox', '0 0 24 24' );
            svg.setAttribute( 'class', 'status-indicator' );
            path.setAttribute( 'd', 'M14.71 6.71c-.39-.39-1.02-.39-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41z' );

            svg.appendChild( path );

            svgIndicator = svg;
            svgBuilderRun = true;

            return svgIndicator;
        };

    
    //  --|    The loop - setup functionaility to all items

    // Accordion ARIA
    accordion.setAttribute( 'id', accordionID );
    accordion.setAttribute( 'role', 'tablist' );


    var index = 1;

    items.forEach( item => {

        // Assign item blocks
        let label = item.children[0],
            content = item.children[1];

        // Add SVG to label
        label.appendChild( svgBuilder() );

        // Setup ARIA
        let tabID = `${accordionID}-tab_${index}`,
            panelID = `${accordionID}-panel_${index}`;

        label.setAttribute( 'id', tabID );
        label.setAttribute( 'role', 'tab' );
        label.setAttribute( 'aria-selected', false );
        label.setAttribute( 'aria-controls', panelID );

        content.setAttribute( 'id', panelID );
        content.setAttribute( 'role', 'tabpanel' );
        content.setAttribute( 'aria-labelledby', tabID );
        content.setAttribute( 'hidden', '' );

        // Set all items to 'none'
        content.style.display = 'none';

        label.addEventListener( 'click', e => {
            e.preventDefault();

            if ( ! _.allowMultiOpen ) {

                let current = accordion.querySelector( '.accordion--item.is-expanded' ) || null;

                if ( current != item && current !== null ) {
                    contract( current );
                }
            }

            if ( window.getComputedStyle( content ).display === 'none' ) {

                expand( item );

            } else {
                contract( item );
            }
        });

        index++;
    });


    // Set first item as 'expanded'
    if ( _.firstOpen ) {
        let first = items[0];

        first.classList.add( 'is-expanded' );

        first.children[0].setAttribute( 'aria-selected', true );
        first.children[1].removeAttribute( 'hidden' );
        first.children[1].style.display = 'block';
    }
}

