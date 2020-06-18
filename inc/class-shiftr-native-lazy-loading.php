<?php

    /*  ////  --|    Native Lazy Loading

    */

class Shiftr_Native_Lazy_Loading {

    /**
     * @var string The url to the fallback script
     */
    var $fallback_script_url = SHIFTR_ASSETS . '/scripts/lazyLoading.js';

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
        add_action( 'wp_footer', array( $this, 'print_script' ) );
        add_filter( 'wp_get_attachment_image_attributes', array( $this, 'filter_attributes' ), 999 );
        add_filter( 'the_content', array( $this, 'filter_the_content' ), 999 );
        add_filter( 'acf_the_content', array( $this, 'filter_the_content' ), 999 );
        add_filter( 'get_image_tag', array( $this, 'filter_the_content' ), 999 );

        add_filter(
			'wp_kses_allowed_html',
			function( $allowed_tags ) {
				if ( ! isset( $allowed_tags[ 'img' ] ) ) {
                    return;
                }

                $allowed_tags[ 'img' ] = array_merge(
                    $allowed_tags[ 'img' ],
                    [
                        'loading'     => [],
                        'data-src'    => [],
                        'data-srcset' => [],
                        'data-sizes'  => [],
                        'class'       => [],
                    ]
                );

				return $allowed_tags;
			}
		);
    }


    /**
     * Filter content for image elements, and change the
     * attributes to prepare element for lazy loading
     * 
     * @param string The content
     * @return string The filtered content
     */
    function filter_the_content( $content ) {

        // This is up next on the todo list...
        $content = preg_replace_callback(
            '/<(img)\s([^>]*)\s\/?>/',
            function( $matches ) {

                $old_attributes = $this->parse_attributes( $matches[2] );
                $prepared_attributes = $this->filter_attributes( $old_attributes );

                $output = sprintf( '<%1$s %2$s />', $matches[1], $this->build_attributes_string( $prepared_attributes ) );

                return $output;
            },
            $content
        );

        return $content;
    }


    /**
     * @param string $attributes_string The regex match from $content
     * @return array The attributes of the element
     */
    function parse_attributes( $attributes_string ) {
        return array_map(
            function( $attribute ) {
                return $attribute['value'];
            },
            wp_kses_hair( $attributes_string, array_merge( wp_allowed_protocols(), array( 'data' ) ) )
        );
    }


    /**
     * 
     */
    function filter_attributes( $attributes ) {

        $attributes['loading'] = 'lazy';

        if ( ! empty( $attributes['class'] ) ) {
            $attributes['class'] .= ' ' . $this->fallback_class;
        } else {
            $attributes['class'] = $this->fallback_class;
        }

        if ( ! empty( $attributes['src'] ) ) {
            $attributes['data-src'] = $attributes['src'];
            unset( $attributes['src'] );
        }

        if ( ! empty( $attributes['srcset'] ) ) {
            $attributes['data-srcset'] = $attributes['srcset'];
            unset( $attributes['srcset'] );
        }

        if ( ! empty( $attributes['sizes'] ) ) {
            $attributes['data-sizes'] = $attributes['sizes'];
            unset( $attributes['sizes'] );
        }

        return $attributes;
    }


    /**
     * 
     */
    function build_attributes_string( $attributes ) {
        return implode(
            ' ',
            array_map(
                function( $name, $value ) {
                    if ( $name == '' ) {
                        return $name;
                    }

                    return sprintf( '%s="%s"', $name, esc_attr( $value ) );
                },
                array_keys( $attributes ),
                $attributes
            )
        );
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
