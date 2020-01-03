( () => {


    //  ////  --|    Forms

    if ( document.querySelector( '[data-shiftr-form]' ) ) {

        // Define all forms
        let form = document.querySelector( '.shiftr-form' );

        if ( form ) form.form();
    }


    //  ////  --|    Carousels (Auto-discover)

    if ( document.querySelector( '[data-shiftr-carousel]' ) ) {

        // Define all accordions
        let carousels = document.querySelectorAll( '[data-shiftr-carousel]' );
        
        carousels.forEach( carousel => carousel.carousel() );
    }


    //  ////  --|    Accordions (Auto-discover)

    if ( document.querySelector( '[data-shiftr-accordion]' ) ) {

        // Define all accordions
        let accordions = document.querySelectorAll( '[data-shiftr-accordion]' );
        
        accordions.forEach( accordion => accordion.accordion() );
    }

    
    //  ////  --|    Galleries

    if ( document.querySelector( '[data-shiftr-gallery]' ) ) {

        // Define all galleries
        let gallery = document.querySelector( '.shiftr-gallery' );
        
        if ( gallery ) gallery.gallery(); 
    }

})();

