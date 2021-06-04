<?php
/**
 * Enqueue scripts & styles
 */

/**  
 *  Add Shiftr styles and scripts for frontend usage
 *  Remove core WP styles and scripts that aren't needed
 *  Statements monitor usage of jQuery for Woocommerce as standard
 *
 *  @since 1.0
 *
 *  @global $shiftr To access the theme version
 */
function shiftr_scripts() {
    global $shiftr;

    if ( ! is_user_logged_in() && ! $shiftr->use_jquery ) {

        wp_deregister_script( 'jquery' );
    } else {
        wp_enqueue_script( 'jquery' );
    }

    wp_deregister_script( 'wp-embed' );

    // Scripts
    wp_register_script( 'shiftr-script-main', get_template_directory_uri() . '/assets/scripts/main.js', array(), $shiftr->get( 'version' ), true );
    wp_enqueue_script( 'shiftr-script-main' );
    wp_localize_script( 'shiftr-script-main', 'shiftr', shiftr_js_object() );

    // Styles
    wp_enqueue_style( 'shiftr-style', get_template_directory_uri() . '/assets/styles/main.css', array(), $shiftr->get( 'version' ) );

    // Remove WP Glutenburg styling as not supported by the theme yet
    wp_dequeue_style( 'wp-block-library' );
}
add_action( 'wp_enqueue_scripts', 'shiftr_scripts', 999 );
