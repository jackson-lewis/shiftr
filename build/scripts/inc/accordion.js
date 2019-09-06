

/*  ////  --|    Element.prototype.accordion( settings = {} )

    * Create an accordion component
*/

Element.prototype.accordion = function( settings = {} ) {

    let accordion = this,
        singles   = this.querySelectorAll( '.single' );
    
    
    singles.forEach( single => {

        single.addEventListener( 'click', e => {
            e.preventDefault();

            single.classList.toggle( 'open' );
            
        });
    });
}