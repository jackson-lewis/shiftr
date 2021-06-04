<?php
/**
 * WordPress login screen
 */

/**  
 *  Add Shiftr login styles to the login page
 *
 *  @since 1.0
 *
 *  @global $shiftr
 */
function shiftr_login_styles() {
    global $shiftr;

    wp_enqueue_style( 'shiftr-login', get_template_directory_uri() . '/assets/styles/login.css', false, $shiftr->get( 'version' ) );
}
add_action( 'login_enqueue_scripts', 'shiftr_login_styles', 10 );
