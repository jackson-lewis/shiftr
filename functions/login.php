<?php


/**  
 *  shiftr_login_styles
 *
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


/**  
 *  shiftr_login_site_url
 *
 *  Add Shiftr login styles to the login page
 *
 *  @since 1.0
 *
 *  @global $shiftr
 *  @return str The site url
 */

function shiftr_login_site_url() {

    global $shiftr;

    return $shiftr->get( 'shiftr_url' );
}

add_filter( 'login_headerurl', 'shiftr_login_site_url' );


/**  
 *  shiftr_login_site_name
 *
 *  Add Shiftr login styles to the login page
 *
 *  @since 1.0
 *
 *  @global $shiftr
 *  @return str The site name
 */

function shiftr_login_site_name() {

    global $shiftr;

    return $shiftr->get( 'shiftr_name' );
}

add_filter( 'login_headertext', 'shiftr_login_site_name' );

