<?php
/**
 * Used to preconnect to the hosted font files
 * 
 * Example: <link rel="preconnect" href="https://fonts.gstatic.com/">
 */
$shiftr->font_host = 'https://fonts.gstatic.com/';

/**
 * The url path to the hosted fonts
 * 
 * Example: <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito:300,400,700&display=swap">
 */
$shiftr->font_url = 'https://fonts.googleapis.com/css?family=Nunito:300,400,700&display=swap';

/** Toggle the use of lazy loading on background-images */
$shiftr->bg_lazy_loading = true;

/** Toggle display of cookie notice on the frontend */
$shiftr->cookie_notice = true;

/** Toggle inclusion of jQuery on the frontend */
$shiftr->use_jquery = false;

/** Toggle display of the `Posts` admin menu link */
$shiftr->admin_show_posts = true;

/** Toggle display of the `Comments` admin menu link */
$shiftr->admin_show_comments = false;

/**
 * Assign users by ID that can access ACF
 * 
 * If empty, all admins have access
 * */
$shiftr->access_to_acf = array( 1 );

/** Toggle display of the Editor by post type */
$shiftr->remove_editor_by_post_type = array();

/** Must explicitly define a custom post type as publicly visible */
$shiftr->public_post_types = array();

/** Shiftr Form global settings */
$shiftr->forms = (object) array(
    'capture' => true,
    'expiration_days' => 30,
    'defaults' => (object) array(
        'recepients' => get_option( 'shiftr_form_default_recepients' ),
        'subject' => get_option( 'shiftr_form_default_subject' )
    )
);

/** The Shiftr JavaScript object */
$shiftr->js_object = array(
    'name'  => get_bloginfo( 'name' ),
    'url'   => get_bloginfo( 'url' ),
    'theme' => get_template_directory_uri(),
    'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
    'form'  => array(
        'successHeading'    => get_option( 'shiftr_form_message_success_heading' ),
        'successBody'       => get_option( 'shiftr_form_message_success_body' ),
        'errorHeading'      => get_option( 'shiftr_form_message_error_heading' ),
        'errorBody'         => get_option( 'shiftr_form_message_error_body' )
    ),
    'cookie' => array(
        'message'       => get_field( 'cookie_notice_message', 'option' ),
        'policyLink'    => get_permalink( 3 )
    )
);
