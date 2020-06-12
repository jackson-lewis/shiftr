
import { Layout, createEl } from './_init'


const { head } = Layout

/*  ////  --|    Cookie
    
    * Handle the Shiftr Cookie Consent
*/
export default () => {

    const cookieName = `shiftr_cookie_${shiftr.name.toLowerCase().replace( ' ', '' )}_accept`

    if ( document.cookie.indexOf( cookieName ) == -1 ) {
    
        let stylesheet = createEl( 'link' );
        stylesheet.setAttribute( 'rel', 'stylesheet' );
        stylesheet.setAttribute( 'href', `${shiftr.theme}/assets/styles/cookie-notice.css` );
        stylesheet.setAttribute( 'type', 'text/css' );
        head.appendChild( stylesheet );

        // Create notice
        let el = createEl( 'div' ),
            inner = createEl( 'div' ),
            message = createEl( 'p' ),
            dismiss = createEl( 'button' ),
            learnMore = createEl( 'a' );

        el.classList.add( 'shiftr-cookie-notice' );

        message.innerHTML = shiftr.cookie.message;

        dismiss.classList.add( 'button-fill' ); 
        dismiss.setAttribute( 'id', 'shiftr-cookie-accept' );
        dismiss.innerHTML = 'Accept';

        learnMore.classList.add( 'button-text' );
        learnMore.setAttribute( 'href', shiftr.cookie.policyLink );
        learnMore.innerHTML = 'Learn More';

        inner.appendChild( message );
        inner.appendChild( dismiss );
        inner.appendChild( learnMore );

        el.appendChild( inner );

        document.body.appendChild( el );

        setTimeout( function() {
            el.classList.add( 'is-visible' );
        }, 1000 );

        // Listen for notice acceptance
        const cookieAccepter = document.getElementById( 'shiftr-cookie-accept' );

        cookieAccepter.addEventListener( 'click', e => {
            e.preventDefault();

            var expiry = new Date();

            expiry.setDate( expiry.getDate() + 30 );

            // Set the cookie
            document.cookie = `${cookieName}=${true}; expires=${expiry}; path=/`;


            // Now, remove the notice
            el.classList.remove( 'is-visible' );

            setTimeout( () => {
                document.body.removeChild( el );
            }, 1000 );

        });
    }
}