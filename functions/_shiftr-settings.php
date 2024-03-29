<?php

/** Define font urls that should be included. */
$shiftr->fonts = [
    [
        'host'  => 'https://fonts.gstatic.com',
        'url'   => 'https://fonts.googleapis.com/css?family=Nunito:300,400,700&display=swap'
    ]
];

/** Set the value of the theme-color meta tag */
$shiftr->theme_color = '';

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

/** Toggle display of the Editor by post type */
$shiftr->remove_editor_by_post_type = [];

/** Shiftr Form global settings */
$shiftr->forms = (object) [
    'capture'           => true,
    'expiration_days'   => 30,
    'defaults'          => (object) [
        'recepients'        => get_option( 'shiftr_form_default_recepients' ),
        'subject'           => get_option( 'shiftr_form_default_subject' )
    ]
];

/** The Shiftr JavaScript object */
$shiftr->js_object = [
    'name'      => get_bloginfo( 'name' ),
    'url'       => get_bloginfo( 'url' ),
    'theme'     => get_template_directory_uri(),
    'ajaxUrl'   => admin_url( 'admin-ajax.php' ),
    'form'      => [
        'successHeading'    => get_option( 'shiftr_form_message_success_heading' ),
        'successBody'       => get_option( 'shiftr_form_message_success_body' ),
        'errorHeading'      => get_option( 'shiftr_form_message_error_heading' ),
        'errorBody'         => get_option( 'shiftr_form_message_error_body' )
    ],
    'cookie'    => [
        'message'       => apply_filters( 'the_content', get_option( 'options_cookies_message' ) ),
        'policyLink'    => get_permalink( get_option( 'wp_page_for_privacy_policy' ) )
    ]
];
