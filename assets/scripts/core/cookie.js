( function() {

    /*  ////  --|    Cookie

        * Handle the Shiftr Cookie Consent
    */




    //  ////  --|    This is where we set the cookie

    if ( document.querySelector( '.shiftr-cookie-notice' ) === null ) return;


    const cookie_accepter = document.getElementById( 'shiftr-cookie-accept' );
    const shiftr_cookie_notice = document.querySelector( '.shiftr-cookie-notice' );

    cookie_accepter.addEventListener( 'click', e => {
        e.preventDefault();

        shiftr_cookie_notice.classList.add( 'accepted' );

        // Prepare the cookie
        var cookie_name = 'shiftr_' + shiftr.name + '_consent';

        cookie_name = cookie_name.replace( ' ', '_' );
        cookie_name = cookie_name.toLowerCase();

        var cookie_expiry = 'Thu, 18 Dec 2019 12:00:00 UTC';

        // Set the cookie
        document.cookie = `${cookie_name}=${true}; expires=${cookie_expiry}; path=/`;


        // Now, remove the notice
        setTimeout( () => {
            shiftr_cookie_notice.classList.remove( 'posted' );
        }, 750 );

        setTimeout( () => {
            document.body.removeChild( shiftr_cookie_notice );
        }, 2000 );

    });


})();

