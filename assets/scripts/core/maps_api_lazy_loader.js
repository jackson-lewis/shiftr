( function() {

    /*  ////  --|    GOOGLE MAPS API LAZY LOADER

        * The function is split, meaning lazy loading 
          can be toggled for diferent pages if necessary
    */




    function maps_api_lazy_loader( key ) {

        if ( api_key ) {

            if ( PHP_PAGE_ID == STATIC_PAGE_ID ) {

                var window_height = window.innerHeight,
                    map = document.getElementById("half-map"),
                    api_url = `https://maps.googleapis.com/maps/api/js?callback=initialize&key=${key}`;

                if ( 'IntersectionObserver' in window ) {

                    var options = {
                        rootMargin: window_height + 'px',
                        threshold: 0
                    }

                    var observer = new IntersectionObserver(
                        function( entries, observer ) {
                            var isIntersecting = typeof entries[0].isIntersecting === 'boolean' ? entries[0].isIntersecting : entries[0].intersectionRatio > 0;

                            if ( isIntersecting ) {

                                var script = document.createElement( 'script' );
                                script.src = api_url;

                                document.body.appendChild( script );
                                observer.unobserve( map );
                            }
                        },
                        options
                    )

                    observer.observe( map );

                } else {

                    let active = false;

                    const lazyMap = function() {
                        if ( active === false ) { active = true;

                            setTimeout( function() {
                                if ( ( map.getBoundingClientRect().top <= ( window.innerHeight * 2 ) &&
                                     map.getBoundingClientRect().bottom >= 0) &&
                                     getComputedStyle( map ).display !== 'none' ) {

                                    create_script();

                                    document.removeEventListener( 'scroll', lazyMap );
                                    window.removeEventListener( 'resize', lazyMap );
                                    window.removeEventListener( 'orientationchange', lazyMap );
                                }

                                active = false;
                            }, 200);
                        }
                    };

                    document.addEventListener( 'scroll', lazyMap );
                    window.addEventListener( 'resize', lazyMap );
                    window.addEventListener( 'orientationchange', lazyMap );
                }

            } else {
                // If current page doesn't match, load immediately

                create_script();
            }
        }

        function create_script() {
            var script = document.createElement( 'script' );
                script.src = api_url;
            document.body.appendChild( script );
        }
    }

    maps_api_lazy_loader( 'AIzaSyB9nr_oTH1RtTgYWGXxZj6MSNW-yb6hE7c' );

});

