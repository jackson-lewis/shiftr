<?php

/**  
 *  All things related to the Shiftr Form
 *
 *  @since 1.0
 */


// Register the Shiftr forms post type
$shiftr_post_type_form = new Shiftr_Custom_Post_Type(
    array(
        'label' 		=> 'shiftr form',
        'name'          => 'Contact Forms',
        'menu_position' => 59,
        'menu_icon'		=> 'dashicons-email-alt'
    ),
    array(
    	'public' => false,
    	'publicly_queryable' => false,
    	'exclude_from_search' => true,
    	'has_archive' => false,
    	'capabilities' => array(
    		'create_posts' => 'do_not_allow'
    	),
    	'map_meta_cap' => true,
    	'supports' => array( '' )
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
	require SHIFTR_INC . '/html/shiftr-contact-form-settings.php';
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


/**  
 *  shiftr_register_form
 *
 *	Register a Shiftr form
 *
 *  @since 1.0
 *
 *	@param $args array The label and type of form to register
 *	@param $attr array Any attributes that should be added to the form element
 */

function shiftr_register_form( $args = [], $attr = [] ) {


	$within_registration = true;

	$defaults = array(
		'label' => '',
		'type' => '',
		'id' => 0
	);

	$args = (object) wp_parse_args( $args, $defaults );

	$form = get_page_by_title( $args->type, OBJECT, 'shiftr_form' );

	// Create post if one does not exist
	if ( $form === null ) {

		$form = wp_insert_post( array(
			'post_author' => 1,
			'post_title' => $args->label,
			'post_status' => 'publish',
			'post_type' => 'shiftr_form'
		));

	}

	$form_attr = array();

	$form_attr['method'] = 'post';
	$form_attr['id'] = 'shiftr_form_' . shiftr_get_form_id( $form->ID );
	$form_attr['class'] = 'form';


	// Add any further attributes
	if ( count( $attr ) > 0 ) {
		$form_attr = array_merge( $form_attr, $attr );
	}

	// Get the form itself
	$path_to_form = SHIFTR_PARTS . '/form-' . $args->type . '.php';

	if ( file_exists( $path_to_form ) ) {

		echo '<form ' . shiftr_output_attr( $form_attr ) . '>';

		include( $path_to_form );

		echo '</form>';

	} else {
		echo 'SHIFTR ERROR: NO FORM FOUND!';
		return false;
	}
	
}

function shiftr_get_form_id( $id = 0 ) {


	if ( $id == 0 ) {
		$id = $form->ID;
	}

	return $id;
}

function shiftr_form_id( $id = 0 ) {

	if ( $id == 0 ) {
		$id = $form->ID;
	}

	echo $id;
}


/**  
 *  shiftr_form_input
 *
 *	Create an input element to include within the shiftr_register_form call
 *
 *  @since 1.0
 *
 *	@param $args array The list of attributes and settings supported by an input element
 *	@param $form_id int The id of the current form
 */

function shiftr_form_input( $args = [], $form_id ) {

	$defaults = array(
		'type' => '',
		'name' => '',
		'id' => $form_id,
		'wrap_attr' => array(),
		'use_label' => true,
		'placeholder' => '',
		'required' => true
	);

	$args = (object) wp_parse_args( $args, $defaults );


	// Hold the attributes
	$wrap_attr = array();
	$input_attr = array();
	$label_attr = array();


	// Wrap attributes
	$wrap_attr = array( 'class' => 'input' );

	if ( ! empty( $args->wrap_attr ) ) {
		if ( $args->wrap_attr['class'] != '' ) {
			$wrap_attr['class'] .= ' ' . $args->wrap_attr['class'];
		}
	}

	// Reset wrap class attribute
	$args->wrap_attr['class'] = $wrap_class['class'];

	// The input identifier, used to connect the label and input via for/id attributes
	$the_id = 'shiftr_form_' . $form_id . '_' . $args->name;


	// Label attributes
	$label_attr['for'] = $the_id;


	// Input attributes
	$input_attr['type'] = $args->type;
	$input_attr['name'] = '_' . $form_id . '_' . $args->name;
	$input_attr['id'] = $the_id;

	// Ensure required attribute is added with no value
	if ( $args->required ) {
		$input_attr['required'] = '';
	}
	
	// Add aria-label if labels are not used
	if ( ! $args->use_label ) {
		$input_attr['aria-label'] = ucwords( $args->name );
	}


	// Complete the HTML
	?>

	<div <?php shiftr_output_attr( $wrap_attr, true ); ?>>

		<?php if ( $args->use_label ) : ?>
		<label <?php shiftr_output_attr( $label_attr, true ); ?>><?php echo strtolower( $args->name ); if ( $args->required ) echo '*'; ?></label>
		<?php endif; ?>

		<input <?php shiftr_output_attr( $input_attr, true, true ); ?>>
	</div>

	<?php
}

