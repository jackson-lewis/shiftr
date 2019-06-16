( function() {

    /*  ////  --|    Accordion

        @since 1.0
    */


    // Check Gallery component exists on page
    if ( document.querySelector( '[data-shiftr-accordion]' ) === null ) return false;


    const accordion = document.querySelector( '.accordion' ),
          accordion_singles = accordion.querySelectorAll( '.single' );
    
    
    accordion_singles.forEach( single => {

        single.addEventListener( 'click', e => {
            e.preventDefault();

            single.classList.toggle( 'open' );
            
        });
    });
    
    
})();

