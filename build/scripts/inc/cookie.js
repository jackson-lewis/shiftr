( cookie_name => {

    /*  ////  --|    Cookie

        * Handle the Shiftr Cookie Consent
    */


    if ( document.cookie.indexOf( cookie_name ) == -1 ) {

        console.log( 'cookie doesn\'t exist' );

        let stylesheet = createEl( 'link' );
        stylesheet.setAttribute( 'rel', 'stylesheet' );
        stylesheet.setAttribute( 'href', `${shiftr.theme}/assets/styles/cookie-notice.css` );
        stylesheet.setAttribute( 'type', 'text/css' );
        head.appendChild( stylesheet );

        // Create notice
        let el = document.createElement( 'div' ),
            inner = document.createElement( 'div' ),
            message = document.createElement( 'p' ),
            dismiss = document.createElement( 'button' );

        el.classList = 'shiftr-cookie-notice';

        message.innerHTML = shiftr.cookie.message;

        dismiss.classList.add( 'button' ); 
        dismiss.setAttribute( 'id', 'shiftr-cookie-accept' );
        dismiss.innerHTML = 'Close';

        inner.appendChild( message );
        inner.appendChild( dismiss );

        el.appendChild( inner );

        document.body.appendChild( el );

        setTimeout( function() {
            el.classList.add( 'posted' );
        }, 1000 );


        // Listen for notice acceptance
        const cookie_accepter = document.getElementById( 'shiftr-cookie-accept' );

        cookie_accepter.addEventListener( 'click', e => {
            e.preventDefault();

            var cookie_expiry = 'Thu, 18 Dec 2019 12:00:00 UTC';

            // Set the cookie
            document.cookie = `${cookie_name}=${true}; expires=${cookie_expiry}; path=/`;


            // Now, remove the notice
            el.classList.remove( 'posted' );

            setTimeout( () => {
                document.body.removeChild( el );
            }, 1000 );

        });

    }


})( `shiftr_cookie_${shiftr.name.toLowerCase().replace( ' ', '' )}_accept` );
