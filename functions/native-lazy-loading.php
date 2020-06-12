<?php

    /*  ////  --|    Native Lazy Loading

    */

class Shiftr_Native_Lazy_Loading {

    /**
     * @var string The url to the fallback script
     */
    var $fallback_script_url = SHIFTR_ASSETS . '/scripts/native-lazy-load-fallback.js';


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
        add_action( 'wp_footer', array( $this, 'print_script' ) );
        add_filter( 'wp_get_attachment_image_attributes', array( $this, 'filter_attributes' ), 1, 100 );
        add_filter( 'the_content', array( $this, 'filter_the_content' ), 1, 100 );
        add_filter( 'acf_the_content', array( $this, 'filter_the_content' ), 1, 100 );
    }

    /**
     * Filter the image attributes so element is prepared for 
     * lazy loading in browser.
     * 
     * @param array The element attributes
     * 
     * @return array The filtered attributes
     */
    function filter_attributes( $attr ) {

        // For now, just don't bother adding lazy loading to admin
        if ( is_admin() || ! shiftr_lazy_loading_enabled() ) {
            return $attr;
        }
    
        $attr['loading'] = 'lazy';
        $attr['class'] .= ' lazy';
        $attr['data-src'] = $attr['src'];
        
        unset( $attr['src'] );
        
        if ( isset( $attr['srcset'] ) ) {
            $attr['data-srcset'] = $attr['srcset'];
            unset( $attr['srcset'] );
        }
    
        if ( isset( $attr['sizes'] ) ) {
            $attr['data-sizes'] = $attr['sizes'];
            unset( $attr['sizes'] );
        }
    
        return $attr;
    }


    /**
     * Filter content for image elements, and change the
     * attributes to prepare element for lazy loading
     * 
     * @param string The content
     * 
     * @return string The filtered content
     */
    function filter_the_content( $content ) {

        // This is up next on the todo list...

        return $content;
    }


    /**
     * Output the script to the footer
     */
    function print_script() {
        ?>
<script>
( function() {
    var initLazyLoader = function() {

        if ( 'loading' in HTMLImageElement.prototype ) {

            var lazyElements = [].slice.call( document.querySelectorAll( '.lazy' ) );

            lazyElements.forEach( function( el ) {

                if ( ! el.dataset.src ) {
                    return;
                }

                el.src = el.dataset.src;
                delete el.dataset.src;

                if ( el.dataset.srcset ) {
                    el.srcset = el.dataset.srcset;
                    delete el.dataset.srcset;
                }

                if ( el.dataset.sizes ) {
                    el.sizes = el.dataset.sizes;
                    delete el.dataset.sizes;
                }

                el.classList.remove( '.lazy' );
            });

        } else {
            var script = document.createElement( 'script' );

            script.id = 'shiftr-native-lazy-load-fallback';
            script.src = '<?php echo esc_js( $this->fallback_script_url ); ?>';
            script.defer = true;

            document.body.appendChild( script );
        }
    }

    if ( document.readyState == 'complete' || document.readyState == 'interactive' ) {
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

    new Shiftr_Native_Lazy_Loading;
}
