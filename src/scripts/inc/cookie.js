/**
 * Display the cookie notice if the cookie confirmation cookie
 * is not found.
 */
import { createEl } from './global'


export default function CookieNotice() {

    const cookieName = 'shiftr_accept_cookie'

    if ( document.cookie.indexOf( cookieName ) == -1 ) {
        const el = createEl( 'div' )
        el.classList.add( 'shiftr-cookie-notice' )

        el.innerHTML = `
            <div>${ shiftr.cookie.message }</div>
            <button id="shiftr-cookie-accept" class="button">Accept<span class="screen-reader-text"> cookies on this site.</span></button>
            <a href="${ shiftr.cookie.policyLink }" class="button-text">Learn More<span class="screen-reader-text"> about cookies on this site.</span></a>
        `

        document.body.appendChild( el )

        setTimeout( function() {
            el.classList.add( 'is-visible' )
        }, 1000 )

        // Listen for notice acceptance
        document.getElementById( 'shiftr-cookie-accept' ).addEventListener( 'click', e => {
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
