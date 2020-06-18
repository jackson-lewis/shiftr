/**
 * Lazy Loading of images and iframes
 */
const LazyLoading = () => {
    var lazyContent = [].slice.call( document.querySelectorAll( '.lazy' ) ),
        listed = ['IMG', 'IFRAME'];

    if ( 'IntersectionObserver' in window ) {

        var lazyObserver = new IntersectionObserver( ( entries, observer ) => {

            entries.forEach( entry => {

                if ( entry.isIntersecting ) {

                    var lazyItem = entry.target;

                    if ( listed.indexOf( lazyItem.nodeName ) >= 0 ) {
                        lazyItem.src = lazyItem.dataset.src;
                        if ( lazyItem.dataset.srcset ) {
                            lazyItem.setAttribute( 'srcset', lazyItem.dataset.srcset );
                        }
                        lazyItem.classList.remove( 'lazy' );

                    } else { lazyItem.classList.add( 'visible' ); lazyItem.classList.remove( 'lazy' ); }

                    lazyObserver.unobserve( lazyItem );
                }
            });
        }, { rootMargin: `0px 0px ${window.innerHeight}px 0px` });

        lazyContent.forEach( lazyItem => { lazyObserver.observe( lazyItem ); });
    } else {

        var active = false,
            lazyLoad = function lazyLoad() {

            if ( active === false ) { active = true;

                setTimeout( () => { lazyContent.forEach( lazyItem => {

                        if ( lazyItem.getBoundingClientRect().top <= window.innerHeight &&
                            lazyItem.getBoundingClientRect().bottom >= window.innerHeight &&
                            getComputedStyle( lazyItem ).display != 'none' ) { 

                            if ( listed.indexOf( lazyItem.nodeName ) >= 0 ) {
                                lazyItem.src = lazyItem.dataset.src;
                                if ( lazyItem.dataset.srcset ) {
                                    lazyItem.setAttribute( 'srcset', lazyItem.dataset.srcset );
                                }
                                lazyItem.classList.remove( 'lazy' );

                            } else { lazyItem.classList.add( 'visible' ); lazyItem.classList.remove( 'lazy' ); }

                            lazyContent = lazyContent.filter( item => item !== lazyItem );

                            if ( lazyContent.length == 0 ) {
                                document.removeEventListener( 'scroll', lazyLoad );
                                window.removeEventListener( 'resize', lazyLoad );
                                window.removeEventListener( 'orientationchange', lazyLoad ); }
                        }
                    }); active = false; }, 200 );
                }
            };

        document.addEventListener( 'scroll', lazyLoad );
        window.addEventListener( 'resize', lazyLoad );
        window.addEventListener( 'orientationchange', lazyLoad );
    }
}

LazyLoading();
