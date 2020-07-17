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
 * Control the post type support
 * 
 * @since v1.2
 */
function shiftr_post_type_support() {

    if ( ! isset( $_GET['post'] ) ) {
        return;
    }

    if ( get_page_template_slug( $_GET['post'] ) == 'templates/flexi-builder.php' ) {
        remove_post_type_support( 'page', 'thumbnail' );
    }

}
add_action( 'admin_init', 'shiftr_post_type_support', 100 );

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

    $preconnect_attr = array(
        'rel' => 'preconnect',
        'href' => $shiftr->font_host
    );
    echo '<link ' . shiftr_output_attr( $preconnect_attr ) . '>';

    $stylesheet_attr = array(
        'rel' => 'stylesheet',
        'href' => $shiftr->font_url
    );
    echo '<link ' . shiftr_output_attr( $stylesheet_attr ) . '>';
}

add_action( 'wp_head', 'shiftr_fonts', 1 );

