<?php


require_once( SHIFTR_INC . '/admin/shiftr-admin-helpers.php' );


/**  
 *  shiftr_is_installed
 *
 *  Used to check if Shiftr has already been installed and activated
 *
 *  @since 1.0
 *
 *  @return bool
 */

function shiftr_is_installed() {

    if ( ! get_option( '__shiftr__' ) ) {

        // Display welcome notice for install
        add_action( 'admin_notices', 'shiftr_notice_installed' );

        // Add option as false so install doesn't run again
        add_option( '__shiftr__', '0' );

        return false;

    } else {

        return true;
    }
};


/**  
 *  shiftr_notice_installed
 *
 *  Get the welcome notice HTML
 *
 *  @since 1.0
 */

function shiftr_notice_installed() {

    shiftr_get_admin_notice_html( 'welcome' );
}


// Register Contact Form settings
if ( ! shiftr_is_installed() ) {

    add_option( 'shiftr_form_default_recepients', get_option( 'admin_email' ) );
    add_option( 'shiftr_form_default_subject', 'New Message via Website' );
    add_option( 'shiftr_form_message_success_heading', 'Thank you!' );
    add_option( 'shiftr_form_message_success_body', 'One of the team will be in touch soon.' );
    add_option( 'shiftr_form_message_error_heading', 'Error!' );
    add_option( 'shiftr_form_message_error_body', 'We were unable to process you message at this time. Please try again.' );
}


// Register all core Advanced Custom Fields
if ( function_exists( 'acf' ) ) {

    // Tell Shiftr that ACF plugin is available
    $shiftr_has_acf = true;

} else {

    // Tell Shiftr that ACF plugin is unavailable
    $shiftr_has_acf = false;
    
    /**  
     *  shiftr_notice_error_no_acf
     *
     *  Get the admin notice for no ACF
     *
     *  @since 1.0
     */

    function shiftr_notice_error_no_acf() {

        shiftr_get_admin_notice_html( 'error-no-acf' );
    }

    add_action( 'admin_notices', 'shiftr_notice_error_no_acf' );
}



