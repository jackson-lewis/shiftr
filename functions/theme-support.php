<?php

    /*  ////  --|    Theme Support

    */


/**  
 *  shiftr_theme_support
 *
 *  The fundamental theme support 
 *
 *  @since 1.0
 */

function shiftr_theme_support() {

    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );

    if ( function_exists( 'is_woocommerce' ) ) {
        add_theme_support( 'woocommerce' );
    }
}

add_action( 'after_setup_theme', 'shiftr_theme_support' );


/**  
 *  shiftr_filter_the_content
 *
 *  Filter and remove <p> tags surrounding images in content
 *
 *  @since 1.0
 */

function shiftr_filter_the_content( $content ) {

    // Remove <p> tags wrapped around <img>
    $content = preg_replace( '/<p>\s*(<a .*>)?\s*(<img .* \/>)\s*(<\/a>)?\s*<\/p>/iU', '\1\2\3', $content );

    // Remove p tag surrounding anchor buttons
    $content = preg_replace( '/<p\s?(?:style)?[=]?[\"]?([^\">]*)[\"]?>\s*(<a\sclass="[^"]*(?:button\-)[^"]*".*>[a-zA-z0-9\-_&!\?£%\(\)>\s]*<\/a>)\s*<\/p>/', '<div class="content-button-wrapper" data-style="\1">\2</div>', $content );

    return $content;
}

add_filter( 'the_content', 'shiftr_filter_the_content' );
add_filter( 'acf_the_content', 'shiftr_filter_the_content' );


// Remove [...] from end of returned excerpt
add_filter( 'excerpt_more', '__return_empty_string' );


/**  
 *  shiftr_fonts
 *
 *  Output the font associated link tags
 *
 *  @since 1.0
 */
function shiftr_fonts() {
    global $shiftr;

    shiftr_preload_font(
        $shiftr->font_url,
        $shiftr->font_host
    );
}
add_action( 'wp_head', 'shiftr_fonts', 11 );


/**
 * Output the relevant HTML tags for preloading fonts
 * 
 * @param string $host The font hosted origin
 * @param string $url The url to the hosted fonts
 */
function shiftr_preload_font( $url = '', $host = '' ) {
    /**
     * If host is not supplied, just origin of $url
     */
    if ( $host == '' ) {
        preg_match( '#^(http[s]?://[\w\d\.-]*)#', $url, $matches );

        $host = $matches[0];
    }

    $preconnect_attr = array(
        'rel' => 'preconnect',
        'href' => $host,
        'crossorigin' => ''
    );
    echo '<link ' . shiftr_output_attr( $preconnect_attr, true ) . '>';

    $stylesheet_attr = array(
        'rel' => 'preload',
        'href' => $url,
        'as' => 'style',
        'onLoad' => "this.onload=null;this.rel='stylesheet'"
    );
    echo '<link ' . shiftr_output_attr( $stylesheet_attr ) . '>';

    $print_stylesheet_attr = array(
        'rel' => 'stylesheet',
        'href' => $url,
        'media' => 'print',
        'onLoad' => "this.media='all'"
    );
    echo '<link ' . shiftr_output_attr( $print_stylesheet_attr ) . '>';

    $noscript_attr = array(
        'rel' => 'stylesheet',
        'href' => $url
    );
    echo '<noscript><link ' . shiftr_output_attr( $noscript_attr ) . '></noscript>';
}


function shiftr_load_fonts() {
    ?>
<script id="shiftr-load-fonts">
    ( () => {
        function setFontsLoaded() {
            document.documentElement.classList.add( 'fonts-loaded' );
        }

        if ( sessionStorage.fontsLoaded || ! ( 'fonts' in document ) ) {
            setFontsLoaded();
            return;

        } else if ( 'fonts' in document ) {
            Promise.all([
                document.fonts.load( '1rem Nunito' ),
                document.fonts.load( '300 1rem Nunito' ),
                document.fonts.load( '700 1rem Nunito' )
            ]).then( _ => {
                setFontsLoaded();
                sessionStorage.fontsLoaded = true;
            });
        }
    })();
</script>
    <?php
}
add_action( 'wp_footer', 'shiftr_load_fonts', 5 );
