/**
 * Display the cookie notice if the cookie confirmation cookie
 * is not found.
 */
import { createEl } from './global'


export default function CookieNotice() {

    const cookieName = 'shiftr_accept_cookie'

    if ( document.cookie.indexOf( cookieName ) == -1 ) {

        // Create notice
        let el = createEl( 'div' ),
            inner = createEl( 'div' ),
            message = createEl( 'p' ),
            dismiss = createEl( 'button' ),
            learnMore = createEl( 'a' )

        el.classList.add( 'shiftr-cookie-notice' )

        message.innerHTML = shiftr.cookie.message

        dismiss.classList.add( 'button-fill' )
        dismiss.setAttribute( 'id', 'shiftr-cookie-accept' )
        dismiss.innerHTML = 'Accept<span class="screen-reader-text"> cookies on this site.</span>'

        learnMore.classList.add( 'button-text' )
        learnMore.setAttribute( 'href', shiftr.cookie.policyLink )
        learnMore.innerHTML = 'Learn More<span class="screen-reader-text"> about cookies on this site.</span>'

        inner.appendChild( message )
        inner.appendChild( dismiss )
        inner.appendChild( learnMore )

        el.appendChild( inner )

        document.body.appendChild( el )

        setTimeout( function() {
            el.classList.add( 'is-visible' )
        }, 1000 )

        // Listen for notice acceptance
        const cookieAccepter = document.getElementById( 'shiftr-cookie-accept' )

        cookieAccepter.addEventListener( 'click', e => {
            e.preventDefault()

            var expiry = new Date()

            expiry.setDate( expiry.getDate() + 30 )

            // Set the cookie
            document.cookie = `${cookieName}=${true}; expires=${expiry}; path=/`


            // Now, remove the notice
            el.classList.remove( 'is-visible' )

            setTimeout( () => {
                document.body.removeChild( el )
            }, 1000 )

        })
    }
};
