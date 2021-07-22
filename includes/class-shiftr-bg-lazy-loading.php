<?php
/**
 * Lazy load images from css background-image 
 */
class Shiftr_Bg_Lazy_Loading {

    /**
     * @var string The url to the fallback script
     */
    var $fallback_script_url = '/assets/scripts/lazyLoading.js';

    /**
     * @var string The class name used as the fallback
     */
    var $fallback_class = 'lazy';


    /**
     * Just add the hook and that.
     */
    function __construct() {
        $this->init();
    }


    /**
     * Hook the print_script method to wp_footer
     */
    function init() {
        add_action( 'wp_footer', array( $this, 'print_script' ), 11 );
    }


    /**
     * Output the script to the footer
     * 
     * This script uses IntersectionObserver, if the API is not found in the window, 
     * then all background images are just loaded immediately as it is not worth the extra code.
     */
    function print_script() {
        ?>
<script id="shiftr-lazy-loading-bg">
( function() {
    function initLazyLoader() {
        var lazyBgs = [].slice.call( document.querySelectorAll( '.lazy-bg' ) );
        function loadBg( el ) {
            el.classList.add( 'visible-bg' );
            el.classList.remove( 'lazy-bg' );
        }
        if ( 'IntersectionObserver' in window ) {
            var lazyObserver = new IntersectionObserver( function( entries, observer ) {
                entries.forEach( function( entry ) {
                    if ( entry.isIntersecting ) {
                        loadBg( entry.target )
                        lazyObserver.unobserve( entry.target );
                    }
                });
            }, {
                rootMargin: '0px 0px ' + window.innerHeight + 'px 0px'
            });
            lazyBgs.forEach( function( bg ) { lazyObserver.observe( bg ); });
        } else {
            lazyBgs.forEach( loadBg );
        }
    }
    if ( document.readyState === 'complete' || document.readyState === 'interactive' ) {
        initLazyLoader();
    } else {
        document.addEventListener( 'DOMContentLoaded', initLazyLoader );
    }
})();
</script>
        <?php
    }
}


/**
 * Initiate the lazy loader
 */
if ( shiftr_lazy_loading_enabled() ) {

    new Shiftr_Bg_Lazy_Loading;
}
