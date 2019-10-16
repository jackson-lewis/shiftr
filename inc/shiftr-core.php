<?php


/**  
 *  shiftr_body_class
 *
 *  Shiftr's own body_class function, more lightweight than core WP
 *
 *  @since 1.0
 */

function shiftr_body_class( $use_shiftr = true ) {

	if ( ! $use_shiftr ) {
		body_class();

		return true;
	}

	global $wp_query;
	global $post;

	$classes = array();

	if ( is_front_page() ) {
		$classes[] = 'home';
	}

	if ( is_home() ) {
		$classes[] = 'posts-archive';
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

	if ( is_singular() ) {
		$classes[] = 'single-' . get_post_type( $post->ID );

		$classes[] = get_post_type( $post->ID ) . 'id-' . $post->ID;
	}

	$template = get_post_meta( $post->ID, '_wp_page_template', true );
	
	if ( $template != '' ) {
		$template = preg_replace( '/^.*\/(.*)\.php$/', '\1', $template );

		$classes[] = 'template-' . $template;
	}

	if ( is_user_logged_in() ) {
        $classes[] = 'logged-in';
    }

    echo 'class="' . join( ' ', $classes ) . '"';
}


/**  
 *  shiftr_head_open
 *
 *  Keeping the header.php file cleaner
 *
 *  @since 1.0
 *
 *	@return mixed|bool
 */

function shiftr_head_open() {

	if ( get_field( 'head_before', 'option' ) ) {
		the_field( 'head_before', 'option', false );
	} else {
		return false;
	}
}


/**  
 *  shiftr_body_open
 *
 *  Keeping the header.php file cleaner
 *	Update from WP 5.2 - now hooked on wp_body_open()
 *
 *  @since 1.0
 *
 *	@return mixed|bool
 */

function shiftr_body_open() {

	if ( get_field( 'body_before', 'option' ) ) {
		the_field( 'body_before', 'option', false );
	} else {
		return false;
	}
}

add_action( 'wp_body_open', 'shiftr_body_open' );

