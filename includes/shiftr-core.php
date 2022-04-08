<?php
/**  
 *  Shiftr's own body_class function, more lightweight than core WP
 *
 *  @since 1.0
 */
function shiftr_body_class( bool $use_shiftr = true ) {
    global $wp_query, $post;

    /**
     * To prevent conflict issues, it's mcuh safer to use the default
     * body_class() function when using WooCommerce.
     */
    if ( ! $use_shiftr || function_exists( 'is_woocommerce' ) ) {
        body_class();

        return true;
    }

    $classes = [];

    if ( is_front_page() ) {
        $classes[] = 'front-page';
    }

    if ( is_home() ) {
        $classes[] = 'home';
        $classes[] = 'archive';
        $classes[] = 'archive-post';
    }

    if ( is_post_type_archive() ) {
        $classes[] = 'archive';
        $classes[] = 'archive-' . get_query_var( 'post_type' );
    }

    if ( is_category() ) {
        $category = get_queried_object();

        $classes[] = 'archive';
        $classes[] = 'category';
        $classes[] = 'cat-' . $category->slug;
        $classes[] = 'catid-' . $category->term_id;
    }

    if ( is_tax()  ) {
        $term = get_queried_object();

        $classes[] = 'taxonomy';
        $classes[] = 'term-' . $term->slug;
        $classes[] = 'termid-' . $term->term_id;
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
 *  @return mixed|bool
 */
function shiftr_head_open() {
    if ( ! empty( shiftr()->tracking->head ) ) {
        echo shiftr()->tracking->head;
    }
}
add_action( 'wp_head', 'shiftr_head_open', 20 );


/**  
 *  Keeping the header.php file cleaner
 *  Update from WP 5.2 - now hooked on wp_body_open()
 *
 *  @since 1.0
 *  @return mixed|bool
 */
function shiftr_body_open() {
    if ( ! empty( shiftr()->tracking->body_open ) ) {
        echo shiftr()->tracking->body_open;
    }
}
add_action( 'wp_body_open', 'shiftr_body_open' );


/**  
 *  Keeping the footer.php file clean.
 *
 *  @since 1.0
 *  @return mixed|bool
 */
function shiftr_body_close() {
    if ( ! empty( shiftr()->tracking->body_close ) ) {
        echo shiftr()->tracking->body_close;
    }
}
add_action( 'wp_footer', 'shiftr_body_close', 100 );
