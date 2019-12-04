<?php

/**  
 *  All things related to the Shiftr Form
 *
 *  @since 1.0
 */


// The global
global $shiftr_forms;

// Placeholder value
$shiftr_forms = array();


/**  
 *  shiftr_register_form
 *
 *	Register a Shiftr form
 *
 *  @since 1.0
 *
 *	@param $form str The name of the form
 *	@param $args array The form settings and list of fields
 */

function shiftr_register_form( $form = '', $args = [] ) {

	global $shiftr_forms;

	if ( ! isset( $shiftr_forms[ $form ] ) ) {

		$shiftr_forms[ $form ] = new Shiftr_Form( $form, $args );
	}
	
	$shiftr_forms[ $form ]->init();
}


/**  
 *  shiftr_build_form
 *
 *	Output the HTML of the whole form
 *
 *  @since 1.0
 *
 *	@param $form str The name of the form
 */

function shiftr_build_form( $form = '' ) {

	global $shiftr_forms;

	if ( isset( $shiftr_forms[ $form ] ) ) {

		$shiftr_forms[ $form ]->build();

	} else {
		return false;
	}
	
}


global $shiftr_form_core;

$shiftr_form_core = array();


// Register the Shiftr forms post type
$shiftr_form_core['form'] = new Shiftr_Custom_Post_Type(
    array(
        'label' 		=> 'Contact Form',
        'name'          => 'shiftr_form',
        'menu_position' => 59,
        'menu_icon'		=> 'dashicons-email-alt'
    ),
    array(
    	'show_ui' => true,
    	'has_archive' => false,
    	'capabilities' => array(
    		'create_posts' => 'do_not_allow'
    	),
    	'map_meta_cap' => true,
    	'supports' => array( 'title' )
    )
);


// Admin Stuff

/**  
 *  shiftr_contact_forms_submenu
 *
 *	Create the admin page for general form settings
 *
 *  @since 1.0
 */

function shiftr_contact_forms_submenu() {

	add_submenu_page(
		'edit.php?post_type=shiftr_form',
		'General Settings',
		'Settings',
		'edit_posts',
		'settings',
		'shiftr_contact_form_settings'
	);
}

add_action( 'admin_menu', 'shiftr_contact_forms_submenu' );


/**  
 *  shiftr_contact_form_settings
 *
 *	The called function for content to the settings page
 *
 *  @since 1.0
 */

function shiftr_contact_form_settings() {

	settings_fields( 'shiftr_form' );
	do_settings_sections( 'shiftr_form' );

	shiftr_update_form_setting( 'shiftr_form_default_recepients' );
	shiftr_update_form_setting( 'shiftr_form_default_subject' );

	shiftr_update_form_setting( 'shiftr_form_message_success_heading' );
	shiftr_update_form_setting( 'shiftr_form_message_success_body' );
	shiftr_update_form_setting( 'shiftr_form_message_error_heading' );
	shiftr_update_form_setting( 'shiftr_form_message_error_body' );

	
	// Get the HTML for the settings page
	shiftr_get_html( 'shiftr-contact-form-settings' );
}


/**  
 *  shiftr_update_form_setting
 *
 *	Update a Shiftr setting via a form
 *
 *  @since 1.0
 *
 *	@param $option_name string The name of the setting to update
 */

function shiftr_update_form_setting( $option_name ) {

	// Update option if changed
	if ( isset( $_POST[$option_name] ) ) {
		$new_value = $_POST[$option_name];

		if ( get_option( $option_name ) != $new_value ) {

			$update_return = update_option( $option_name, $new_value );
		}

		if ( $update_return ) {
			add_action( 'admin_notices', 'shiftr_notice_update_form_setting' );
		}
	}
}

function shiftr_notice_update_form_setting() {
	shiftr_get_admin_notice_html( 'update-form-settings' );
}


function shiftr_register_form_settings() {

	register_setting( 'shiftr_form', 'form_default_recepients' );
}

add_action( 'admin_init', 'shiftr_register_form_settings' );


function shiftr_form_error_display() {

	global $post;

	if ( ! get_post_meta( $post->ID, 'shiftr_form_mail_error', true ) ) return;

    add_meta_box(
    	'shiftr-form-data-error',
    	'Mail Error',
    	'shiftr_form_get_error',
    	'shiftr_form_data'
    );
}

add_action( 'add_meta_boxes', 'shiftr_form_error_display' );

function shiftr_form_get_error() {

	global $post;

	$error = get_post_meta( $post->ID, 'shiftr_form_mail_error', true );

	echo '<pre><code>';

	print_r( maybe_unserialize( $error ) );

	echo '</code></pre>';
}

