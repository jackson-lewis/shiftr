<?php
/**  
 *  Output the font associated link tags
 *
 *  @since 1.0
 */
function shiftr_fonts() {

    if ( ! empty( shiftr()->fonts ) ) {
        foreach ( shiftr()->fonts as $font ) {
            shiftr_preload_font( $font );
        }
    }
}
add_action( 'wp_head', 'shiftr_fonts', 11 );


/**
 * Output the relevant HTML tags for preloading fonts
 * 
 * @param array $font Associative array, contains url and host
 */
function shiftr_preload_font( $font = array() ) {
    $url = $font['url'];
    $host = isset( $font['host'] ) ? $font['host'] : '';
    
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