/**
 * Control the behaviour of the site header. This includes 
 * the hamburger menu and dropdown menus. It would also be where 
 * to handle a search bar should one exist.
 */
import { Layout, x } from '../inc/global'


const { header, body } = Layout; // Semi-colon here forces Layout to not be a function...


( () => {

    //  ////  --|    Top-level variables

    let toggle    = document.querySelector( '.nav-primary--toggle' ),
        nav       = document.querySelector( '.nav-primary' ),
        subNavs   = nav ? nav.querySelectorAll( 'li.has-sub-menu' ) : [];


    // Check nav actually exists before going any further
    if ( ! nav ) return;


    //  ////  --|    Toggle hidden navigation
        
    let headerTransitionHeight = '100vh';

    let stop = e => {
        e.stopPropagation();
    }

    let toggleMenu = e => {
        e.stopPropagation();

        toggle.classList.toggle( 'transition' );
        header.classList.toggle( 'offset-is-expanded' );
        body.classList.toggle( 'no-scroll' );
        
        if ( header.offsetHeight > nav.offsetHeight ) {
            header.setAttribute( 'style', '' );
        } else {
            header.style.height = headerTransitionHeight;
        }
    };

    let toggleWindow = () => {
        toggle.classList.remove( 'transition' );
        header.classList.remove( 'offset-is-expanded' );
        header.setAttribute( 'style', '' );
        body.classList.remove( 'no-scroll' );
    };

    x( 1024, () => {
        toggle.removeEventListener( 'click', toggleMenu );
        nav.removeEventListener( 'click', stop );
        window.removeEventListener( 'click', toggleWindow );

    }, () => {
        toggle.addEventListener( 'click', toggleMenu );
        nav.addEventListener( 'click', stop );
        window.addEventListener( 'click', toggleWindow );

    }, true );


    //  ////  --|    Sub-menu

    nav.classList.add( subNavs.length <= 0 ? 'has-no-sub-navs' : 'has-sub-navs' );

    let displayClass = 'is-visible';
    
    x( 1024, () => {

        subNavs.forEach( sub => {

            let link = sub.children[0],
                menu = sub.children[2],
                removeOpen;

            link.addEventListener( 'mouseover', e => {
                e.preventDefault();

                clearTimeout( removeOpen );

                if ( sub.classList.contains( displayClass ) !== true ) {
                    sub.classList.add( displayClass );
                }
            });

            link.addEventListener( 'mouseleave', e => {

                removeOpen = setTimeout( () => {
                    sub.classList.remove( displayClass );
                }, 200 );
            });

            menu.addEventListener( 'mouseover', () => {
                
                clearTimeout( removeOpen );
            });

            menu.addEventListener( 'mouseleave', () => {

                removeOpen = setTimeout( () => {
                    sub.classList.remove( displayClass );
                }, 200 );
            });

        });

    }, () => {

        subNavs.forEach( sub => {

            let toggle = sub.children[1],
                menu = sub.children[2];

            toggle.addEventListener( 'click', e => {
                e.preventDefault();

                sub.classList.toggle( displayClass );
            });

        });
    });


    //  ////  --|    Primary Logo Sizing

    ( logo => {
        if ( ! logo ) return;

        let svg = logo.children[0];

        let viewbox = svg.getAttribute( 'viewBox' ),
            values  = viewbox.split( ' ' ),
            width   = logo.offsetHeight * ( values[2] / values[3] );

        svg.style.width = `${ width }px`;

    })( document.querySelector( '.site-logo' ) );

})();

