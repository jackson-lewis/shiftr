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

		if ( ! $shiftr->use_jquery ) {
			wp_deregister_script( 'jquery' );
		}

        wp_deregister_script( 'wp-embed' );
    }

	// Scripts
	wp_enqueue_script( 'shiftr-script', get_template_directory_uri() . '/assets/scripts/core.js', array(), null, true );
	wp_localize_script( 'shiftr-script', 'shiftr', $shiftr->js_object );

	// Styles
	wp_enqueue_style( 'shiftr-style', get_template_directory_uri() . '/assets/styles/style.css', array(), $shiftr->get( 'version' ) );

	// Remove WP Glutenburg styling
	wp_dequeue_style( 'wp-block-library' );
}

add_action( 'wp_enqueue_scripts', 'shiftr_scripts', 999 );

