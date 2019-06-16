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
		// Set the class name to match the display name of the posts (e.g. blogs/news/journal)
		$classes[] = 'news';
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
		$classes[] = 'single';

		$classes[] = get_post_type( $post->ID );

		$classes[] = get_post_type( $post->ID ) . 'id-' . $post->ID;
	}

	$template = get_post_meta( $post->ID, '_wp_page_template', true );
	if ( $template != '' ) {
		$template = str_replace( 'templates/', '', $template );
		$template = str_replace( '.php', '', $template );

		$classes[] = get_post_type( $post->ID ) . '-template-' . $template;
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


/**  
 *  shiftr_cookie_consent
 *
 *  Check if Shiftr cookie has been accepted, if not add script to wp_footer to create notice
 *
 *  @since 1.0
 *
 *	@global $shiftr Get value of cookie_notice setting
 */

function shiftr_cookie_consent() {
	global $shiftr;

	// Check theme settings if Cookie Notice should be used
	if ( $shiftr->cookie_notice ) {

		$cookie_name = 'shiftr_' . str_replace( ' ', '_', strtolower( get_bloginfo( 'name' ) ) ) . '_consent';

		if ( ! isset( $_COOKIE[$cookie_name] ) ) {
			add_action( 'wp_footer', 'shiftr_display_cookie_notice', 1 );
		}
	}
}

add_action( 'init', 'shiftr_cookie_consent' );



/**  
 *  shiftr_display_cookie_notice
 *
 *  The JS to be added that creates the Shiftr Cookie Notice
 *
 *  @since 1.0
 *
 *	@global $shiftr Use get_acf_value method to retrieve cookie_consent_message
 */

function shiftr_display_cookie_notice() {
	global $shiftr;

	$message = trim( strip_tags( $shiftr->get_acf_value( 'cookie_consent_message' ), '<a><b><strong><i>' ) );

	?>

	<script async>
		var el = document.createElement( 'div' ),
            inner = document.createElement( 'div' ),
            message = document.createElement( 'p' ),
            dismiss = document.createElement( 'button' );

        el.classList = 'shiftr-cookie-notice';


        message.innerHTML = '<?php echo $message; ?>';

        dismiss.setAttribute( 'id', 'shiftr-cookie-accept' );
        dismiss.innerHTML = 'Close';

        inner.appendChild( message );
        inner.appendChild( dismiss );

        el.appendChild( inner );

        document.body.appendChild( el );

        setTimeout( function() {
        	el.classList.add( 'posted' );
        }, 1000 );
	</script>

<?php 

}

