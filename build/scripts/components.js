( () => {


    //  ////  --|    Forms

    if ( document.querySelector( '[data-shiftr-form]' ) ) {

        // Define all forms
        let form = document.querySelector( '.shiftr-form' );

        if ( form ) form.form();
    }


    //  ////  --|    Carousels

    if ( document.querySelector( '[data-shiftr-carousel]' ) ) {

        // Define all carousels
        let carousel = document.querySelector( '.shiftr-carousel' );

        if ( carousel ) carousel.carousel();
    }


    //  ////  --|    Galleries

    if ( document.querySelector( '[data-shiftr-gallery]' ) ) {

        // Define all galleries
        let gallery = document.querySelector( '.shiftr-gallery' );
        
        if ( gallery ) gallery.gallery(); 
    }


    //  ////  --|    Accordions

    if ( document.querySelector( '[data-shiftr-accordion]' ) ) {

        // Define all accordions
        let accordion = document.querySelector( '.shiftr-accordion' );
        
        if ( accordion ) accordion.accordion(); 
    }


})();

