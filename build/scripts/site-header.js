( () => {

    //  ////  --|    Top-level variables

    let toggle    = document.querySelector( '.nav-primary--toggle' ),
        nav       = document.querySelector( '.nav-primary' ),
        sub_navs  = nav.querySelectorAll( 'li.parent' );


    // Check nav actually exists before going any further
    if ( ! nav ) return;


    //  ////  --|    Toggle hidden navigation
        
    let header_transition_height = '100vh';

    let stop = e => {
        e.stopPropagation();
    }

    let toggle_menu = e => {
        e.stopPropagation();

        toggle.classList.toggle( 'transition' );
        body.classList.toggle( 'no-scroll' );
        
        if ( header.offsetHeight > nav.offsetHeight ) {
            header.setAttribute( 'style', '' );
        } else {
            header.style.height = header_transition_height;
        }

        nav.classList.toggle( 'show' );
    };

    let toggle_window = () => {
        toggle.classList.remove( 'transition' );
        header.setAttribute( 'style', '' );
        body.classList.remove( 'no-scroll' );
        nav.classList.remove( 'show' );
    };

    x( l, () => {
        toggle.removeEventListener( 'click', toggle_menu );
        nav.removeEventListener( 'click', stop );
        window.removeEventListener( 'click', toggle_window );

    }, () => {
        toggle.addEventListener( 'click', toggle_menu );
        nav.addEventListener( 'click', stop );
        window.addEventListener( 'click', toggle_window );

    }, true );


    //  ////  --|    Sub-menu
    
    x( l, () => {

        sub_navs.forEach( sub => {

            let link = sub.children[0],
                menu = sub.children[1],
                remove_open;

            link.addEventListener( 'mouseover', e => {
                e.preventDefault();

                clearTimeout( remove_open );

                if ( sub.classList.contains( 'show' ) !== true ) {
                    sub.classList.add( 'show' );
                }
            });

            link.addEventListener( 'mouseleave', e => {

                remove_open = setTimeout( () => {
                    sub.classList.remove( 'show' );
                }, 200 );
            });

            menu.addEventListener( 'mouseover', () => {
                
                clearTimeout( remove_open );
            });

            menu.addEventListener( 'mouseleave', () => {

                remove_open = setTimeout( () => {
                    sub.classList.remove( 'show' );
                }, 200 );
            });

        });

    }, () => {

        sub_navs.forEach( sub => {

            let link = sub.children[0],
                menu = sub.children[1],
                remove_open;

            link.addEventListener( 'click', e => {
                e.preventDefault();

                sub.classList.toggle( 'show' );
            });

        });
    });


    //  ////  --|    Primary Logo Sizing

    ( logo => {

        let viewbox = logo.getAttribute( 'viewBox' ),
            values  = viewbox.split( ' ' ),
            ratio   = values[2] / values[3],
            width   = ( logo.parentElement.offsetHeight / 10 ) * ratio;

        logo.style.width = `${ width }rem`;

    })( document.querySelector( '.site-logo svg' ) );

})();

