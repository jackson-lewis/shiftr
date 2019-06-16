( function() {

    /*  ////  --|    POPUPS

        * Basic functionality to handle opening an closing
          of popup elements.
        * Can handle multiple popups per page
    */




    const open   = document.querySelectorAll( '.open' ),
    	  close  = document.querySelectorAll( '.x' ),
          body = document.body;

    
    open.forEach( opener => {
        opener.addEventListener( 'click', () => {

            const instance = opener.getAttribute( 'data-open' ),
                popup = document.querySelector( `[data-popup="${instance}"]` );

            popup.classList.add( 'popup-appear' );
            body.classList.add( 'no-scroll' );
        });
    });

    close.forEach( closer => {
        closer.addEventListener( 'click', () => {

            const popup = closer.parentElement;

            popup.classList.add( 'popup-disappear' );
            body.classList.remove( 'no-scroll' );

            setTimeout( () => {
                popup.classList.remove( 'popup-appear' );
                popup.classList.remove( 'popup-disappear' );
            }, 1200 );
        });
    });

});

