( function() {

    /*  ////  --|    GENERIC

        * Just some magic
    */




    //  ////  --|    TOGGLE HIDDEN MENU


    const toggle    = document.querySelector( '.toggle' ),
          nav       = document.querySelector( '.main-nav' ),
          sub_navs  = document.querySelectorAll( 'li.parent' ),
          
          header    = document.querySelector( '.header-primary' ),
          body      = document.body;


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

                console.log( 'click' );

                sub.classList.toggle( 'show' );
            });

        });
    });




    //  ////  --|    SIZE UP SVG LOGO


    const the_logo = document.getElementById( 'the_logo' ),
        viewbox = the_logo.getAttribute( 'viewBox' ),
        values = viewbox.split( ' ' ),
        ratio = values[2] / values[3],
        width = ( the_logo.parentElement.offsetHeight / 10 ) * ratio;

    the_logo.style.width = `${ width }rem`;




    //  ////  --|    BLOG STICKY SIDEBAR


    x( l, () => {

        var sidebar     = document.querySelector( '.blog-sidebar' ),
            blog_layout   = document.querySelector( '.blog-layout > div' );

        if ( sidebar === null ) return;

        var sidebar_width = sidebar.offsetWidth,
            sidebar_pos = sidebar.getBoundingClientRect(),
            blog_layout_pos = blog_layout.getBoundingClientRect();


        window.addEventListener( 'scroll', function() {

            let curr_pos = window.scrollY;


            if ( ( curr_pos + sidebar.offsetHeight + header.offsetHeight + 20 ) >= blog_layout_pos.bottom ) {
                
                sidebar.classList.add( 'pause' );
                sidebar.classList.remove( 'sticky' );

            } else if ( ( curr_pos + header.offsetHeight + 20 ) >= blog_layout_pos.top ) {
                
                sidebar.style.width = sidebar.offsetWidth + 'px';
                sidebar.style.top = header.offsetHeight + 20 + 'px';
                sidebar.style.left = sidebar_pos.left + 'px';
                sidebar.classList.add( 'sticky' );
                sidebar.classList.remove( 'pause' );

            } else {
                
                sidebar.classList.remove( 'sticky' );
                sidebar.setAttribute( 'style', '' );
            }

        });
    });




    //  ////  --|    CAROUSEL

    if ( document.querySelector( '[data-shiftr-carousel]' ) ) {

        if ( document.querySelector( '.hero-carousel' ) ) {

            document.addEventListener( 'DOMContentLoaded', () => {
                
                setTimeout( () => {
                    document.querySelector( '.hero-carousel .content' ).classList.add( 'load' );
                }, 800 );
            });

            document.querySelector( '.hero-carousel' ).shiftrCarousel({
                pause_on_marker_hover: false,
                speed: 6000
            });
            
        }
    }


})();

