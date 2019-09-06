( () => {

    /*  ////  --|    General

        * Just some magic
    */


    //  ////  --|    Forms

    if ( document.querySelector( '[data-shiftr-form]' ) ) {

        // Define all forms
        let general_form = document.querySelector( '.shiftr-form-general' );

        if ( general_form ) general_form.form();
    }


    //  ////  --|    Carousels

    if ( document.querySelector( '[data-shiftr-carousel]' ) ) {

        // Define all carousels
        let home_carousel = document.querySelector( '.hero-carousel' );


        if ( home_carousel ) {

            document.addEventListener( 'DOMContentLoaded', () => {
                
                setTimeout( () => {
                    home_carousel.querySelector( '.content' ).classList.add( 'load' );
                }, 800 );
            });

            home_carousel.carousel({
                pause_on_marker_hover: false,
                speed: 6000
            });
            
        }
    }


    //  ////  --|    Galleries

    if ( document.querySelector( '[data-shiftr-gallery]' ) ) {

        // Define all galleries
        let gallery = document.querySelector( '.gallery' );
        
    
        if ( gallery ) gallery.gallery(); 
    }


    //  ////  --|    Accordions

    if ( document.querySelector( '[data-shiftr-accordion]' ) ) {

        // Define all accordions
        let accordion = document.querySelector( '.accordion' );
        
    
        if ( accordion ) accordion.accordion(); 
    }


    //  ////  --|    Primary Logo Sizing

    ( logo => {

        let viewbox = logo.getAttribute( 'viewBox' ),
            values  = viewbox.split( ' ' ),
            ratio   = values[2] / values[3],
            width   = ( logo.parentElement.offsetHeight / 10 ) * ratio;

        logo.style.width = `${ width }rem`;

    })( document.getElementById( 'the_logo' ) );


    //  ////  --|    Posts Sidebar

    x( l, () => {

        let sidebar = document.querySelector( '.blog-sidebar' );

        if ( sidebar ) sidebar.floater();
    });


})();

