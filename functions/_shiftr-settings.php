<?php


/* 
	font_host

	Used to preconnect to the hosted font files

	Example: <link rel="preconnect" href="https://fonts.gstatic.com/">
*/

$shiftr->font_host = 'https://fonts.gstatic.com/';


/* 
	font_url

	The url path to the hosted fonts

	Example: <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito:300,400,700&display=swap">
*/

$shiftr->font_url = 'https://fonts.googleapis.com/css?family=Nunito:300,400,700&display=swap';


/* 
	cookie_notice

	Should the cookie notice be displayed on the front-end
*/

$shiftr->cookie_notice = true;


/* 
	use_jquery

	Should jQuery be used on the front-end
*/

$shiftr->use_jquery = false;


/* 
	admin_show_posts

	Toggle display of 'Posts' link in the admin menu
*/

$shiftr->admin_show_posts = true;


/* 
	admin_show_comments

	Toggle display of 'Comments' link in the admin menu
*/

$shiftr->admin_show_comments = false;


/* 
	remove_editor_by_post_type

	Toggle display of the WP editor by post type
*/

$shiftr->remove_editor_by_post_type = array();


/* 
	public_post_types

	Define all custom post types that should be publicly visible
*/

$shiftr->public_post_types = array();


/* 
	forms

	Define all custom post types that should be publicly visible
*/

$shiftr->forms = (object) array(
    'capture' => true,
    'expiration_days' => 30,
    'defaults' => (object) array(
    	'recepients' => get_option( 'shiftr_form_default_recepients' ),
        'subject' => get_option( 'shiftr_form_default_subject' )
    )
);


/* 
	js_object

	Pass variables into JavaScript for various execution, for both front-end and admin pages
*/

$shiftr->js_object = array(
	'name' 	=> get_bloginfo( 'name' ),
	'url' 	=> get_bloginfo( 'url' ),
	'theme' => get_template_directory_uri(),
	'ajax' 	=> admin_url( 'admin-ajax.php' ),
	'form' 	=> array(
		'success_heading' 	=> get_option( 'shiftr_form_message_success_heading' ),
		'success_body' 		=> get_option( 'shiftr_form_message_success_body' ),
		'error_heading' 	=> get_option( 'shiftr_form_message_error_heading' ),
		'error_body' 		=> get_option( 'shiftr_form_message_error_body' )
	),
	'cookie' => array(
		'message' => get_field( 'cookie_consent_message', 'option' )
	),
	'shortcuts' => array(
		'admin' => admin_url(),
		'edit'  => admin_url( 'post.php?post=$$$POSTID$$$&action=edit' ),
		'view'  => '$$$POSTPERMALINK$$$'
	),
	'vars' => array(
		'archive' => is_archive()
	)
);

