<?php
/**  
 *  Shiftr's own body_class function, more lightweight than core WP
 *
 *  @since 1.0
 */
function shiftr_body_class( $use_shiftr = true ) {

    /**
     * To prevent conflict issues, it's mcuh safer to use the default
     * body_class() function when using WooCommerce.
     */
    if ( ! $use_shiftr || function_exists( 'is_woocommerce' ) ) {
        body_class();

        return true;
    }

    global $wp_query;
    global $post;

    $classes = array();

    if ( is_front_page() ) {
        $classes[] = 'site-home';
    }

    if ( is_home() ) {
        $classes[] = 'home';
        $classes[] = 'archive-post';
    }

    if ( is_archive() ) {
        $classes[] = 'archive';
    }

    if ( is_date() ) {
        $classes[] = 'date';
    }

    if ( is_404() ) {
        $classes[] = 'error404';
    }

    if ( is_search() ) {
        $classes[] = 'search';
    }

    if ( is_singular() ) {
        $classes[] = 'single-' . get_post_type( $post->ID );

        $classes[] = get_post_type( $post->ID ) . '_id-' . $post->ID;

        $template = get_post_meta( $post->ID, '_wp_page_template', true );
    
        if ( $template != '' ) {
            $template = preg_replace( '/^.*\/(.*)\.php$/', '\1', $template );

            $classes[] = 'template-' . $template;
        }
    }

    if ( is_user_logged_in() ) {
        $classes[] = 'logged-in';
    }

    echo 'class="' . join( ' ', $classes ) . '"';
}


/**  
 *  Keeping the header.php file cleaner
 *
 *  @since 1.0
 *
 *  @return mixed|bool
 */
function shiftr_head_open() {

    if ( get_field( 'head_open', 'option' ) ) {
        the_field( 'head_open', 'option', false );
    } else {
        return false;
    }
}


/**  
 *  Keeping the header.php file cleaner
 *  Update from WP 5.2 - now hooked on wp_body_open()
 *
 *  @since 1.0
 *
 *  @return mixed|bool
 */
function shiftr_body_open() {

    if ( get_field( 'body_open', 'option' ) ) {
        the_field( 'body_open', 'option', false );
    } else {
        return false;
    }
}
add_action( 'wp_body_open', 'shiftr_body_open' );


/**  
 *  Keeping the footer.php file clean.
 *
 *  @since 1.0
 *
 *  @return mixed|bool
 */
function shiftr_body_close() {

    if ( get_field( 'body_close', 'option' ) ) {
        the_field( 'body_close', 'option', false );
    } else {
        return false;
    }
}
add_action( 'wp_footer', 'shiftr_body_close', 1 );
