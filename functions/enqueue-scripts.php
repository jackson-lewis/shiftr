<?php

	/*  ////  --|    Enqueue Scripts & Styles

    */


/**  
 *  shiftr_scripts
 *
 *  Add Shiftr styles and scripts for frontend usage
 *	Remove core WP styles and scripts that aren't needed
 *	Statements monitor usage of jQuery for Woocommerce as standard
 *
 *  @since 1.0
 *
 *	@global $shiftr
 */

function shiftr_scripts() {

	global $shiftr;

	if ( ! is_admin() || ! is_user_logged_in() ) {

		if ( ! $shiftr->use_jquery || ! function_exists( 'is_woocommerce' ) ) {
			wp_deregister_script( 'jquery' );
		}

        wp_deregister_script( 'wp-embed' );
    }

	// Scripts
	wp_enqueue_script( 'shiftr-script', get_template_directory_uri() . '/assets/scripts/core.js', array(), null, true );

	// Styles
	wp_enqueue_style( 'shiftr-style', get_template_directory_uri() . '/assets/styles/style.css', array(), $shiftr->get( 'version' ) );

	// Remove WP Glutenburg styling
	wp_dequeue_style( 'wp-block-library' );
}

add_action( 'wp_enqueue_scripts', 'shiftr_scripts', 999 );


/**  
 *  shiftr_js_object
 *
 *  The Shiftr JS object providing JavaScript access to key site information
 *	Also required on admin pages
 *
 *  @since 1.0
 */

function shiftr_js_object() { ?>

	<script async>
		var shiftr = {
			name: '<?php bloginfo( "name" ); ?>',
			base: '<?php bloginfo( "url" ); ?>',
			theme: '<?php echo get_template_directory_uri(); ?>',
			form : {
				ajax: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
				success_heading: 'Thank you!',
				success_body: 'One of the team will be in touch soon.',
				error_heading: 'Error!',
				error_body: 'Looks like there was an error sending your messsage.',
				xhr_error: 'Something went very wrong! Please try again or contact info@shapeshiftr.co.uk'

			}
		};
	</script>

<?php 

}

add_action( 'wp_footer', 'shiftr_js_object', 0 ); 
add_action( 'admin_head', 'shiftr_js_object' );

