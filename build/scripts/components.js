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


    //  ////  --|    Accordions (Auto)

    if ( document.querySelector( '[data-shiftr-accordion]' ) ) {

        // Define all accordions
        let accordions = document.querySelectorAll( '[data-shiftr-accordion]' );
        
        accordions.forEach( accordion => accordion.accordion() );
    }


})();

