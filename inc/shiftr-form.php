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
        'label' 		=> 'Form',
        'name'          => 'shiftr_form',
        'menu_position' => 59,
        'menu_icon'		=> 'dashicons-email-alt'
    ),
    array(
    	'show_ui' => true,
    	'has_archive' => false,
    	'capabilities' => array(
    		'create_posts'		 => 'do_not_allow',
		    'edit_post'          => 'update_core',
		    'read_post'          => 'update_core',
		    'delete_post'        => 'update_core',
		    'edit_posts'         => 'update_core',
		    'edit_others_posts'  => 'update_core',
		    'delete_posts'       => 'update_core',
		    'publish_posts'      => 'update_core',
		    'read_private_posts' => 'update_core'
		),
    	'map_meta_cap' => true,
    	'supports' => array( 'title' )
    )
);


// Register the Shiftr forms post type
$shiftr_form_core['data'] = new Shiftr_Custom_Post_Type(
    array(
        'label' 		=> 'Form Data',
        'name'          => 'shiftr_form_data',
        'plural'		=> false
    ),
    array(
    	'show_ui' => true,
    	'show_in_menu' => 'edit.php?post_type=shiftr_form',
    	'has_archive' => false,
    	'capabilities' => array(
    		'create_posts'		 => 'do_not_allow',
		    'edit_post'          => 'update_core',
		    'read_post'          => 'update_core',
		    'delete_post'        => 'update_core',
		    'edit_posts'         => 'update_core',
		    'edit_others_posts'  => 'update_core',
		    'delete_posts'       => 'update_core',
		    'publish_posts'      => 'update_core',
		    'read_private_posts' => 'update_core'
		),
    	'map_meta_cap' => true,
    	'supports' => array( 'title', 'custom-fields' )
    )
);


add_filter( 'shiftr_custom_post_type_register_args', function( $args, $post_type ) {

	if ( $post_type == 'shiftr_form_data' ) {

		$args['labels']['all_items'] = 'Data';
		$args['labels']['edit_item'] = 'View Data';
	}

	return $args;

}, 10, 2 );


add_filter( 'manage_shiftr_form_data_posts_columns', function( $columns ) {

	unset( $columns['title'] );
	unset( $columns['date'] );

	$columns['data_id'] 		= 'Data ID';
	$columns['data_date'] 		= 'Date';
	$columns['data_from_form'] 	= 'Form';

	return $columns;
});


add_filter( 'manage_edit-shiftr_form_data_sortable_columns', function( $columns ) {

	$columns['data_id'] 	= 'ID';
	$columns['data_date'] 	= 'date';

	return $columns;
});


add_action( 'manage_shiftr_form_data_posts_custom_column', function( $column, $post_id ) {

	if ( $column == 'data_id' ) {

		// Construct record title
		$title = strval( $post_id );

		$content = get_post_meta( $post_id, '_shiftr_form_data_content', true );

		$content = unserialize( $content );

		echo '<a href="' . esc_url( admin_url( 'post.php?post=' . $post_id . '&action=edit' ) ) . '"><strong>#' . $title . ' ' . $content['name'] . '</strong></a>';
	}

	if ( $column == 'data_date' ) {

		$date = get_the_date( 'jS M Y \@ H:i' );

		echo $date;
	}

	if ( $column == 'data_from_form' ) {

		$form_id = get_post_meta( $post_id, '_shiftr_form_data_form_id', true );

		if ( $form_id > 0 ) {
			echo get_the_title( $form_id );

		} else {
			echo 'Unknown';
		}
	}

}, 10, 2 );


add_action( 'pre_get_posts', function( $query ) {

	if ( ! is_admin() ) return;

	$orderby = $query->get( 'orderby' );

	if ( $orderby == 'data_id' ) {

		$query->set( 'meta_key', 'post_id' );
		$query->set( 'orderby', 'meta_value_num' );
	}

} );


add_filter( 'post_row_actions', function( $actions, $post ) {

	if ( $post->post_type == 'shiftr_form' ) {

		unset( $actions['trash'] );
	}

	if ( $post->post_type == 'shiftr_form_data' ) {

		unset( $actions['inline hide-if-no-js'] );

		$actions['edit'] = '<a href="' . esc_url( admin_url( 'post.php?post=' . $post->ID . '&action=edit' ) ) . '">Edit</a>';
	}

	return $actions;

}, 100, 2 );


add_filter( 'bulk_actions-edit-shiftr_form', function( $actions ) {

	unset( $actions['trash'] );

	return $actions;

}, 100, 1 );


// Admin Stuff

/**  
 *  shiftr_contact_form_submenu
 *
 *	Create the admin page for general form settings
 *
 *  @since 1.0
 */

function shiftr_contact_form_submenu() {

	add_submenu_page(
		'edit.php?post_type=shiftr_form',
		'General Settings',
		'Settings',
		'manage_options',
		'settings',
		'shiftr_contact_form_settings'
	);
}

add_action( 'admin_menu', 'shiftr_contact_form_submenu' );


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


function shiftr_form_data_meta_boxes() {

	global $post;

	remove_meta_box( 'slugdiv', 'shiftr_form_data', 'normal' );
	remove_meta_box( 'submitdiv', 'shiftr_form_data', 'side' );

	add_meta_box(
    	'shiftr-form-data-content',
    	'Data',
    	'shiftr_form_data_get_content',
    	'shiftr_form_data',
    	'normal'
    );

	if ( ! get_post_meta( $post->ID, 'shiftr_form_mail_error', true ) ) return;

    add_meta_box(
    	'shiftr-form-data-error',
    	'Mail Error',
    	'shiftr_form_get_error',
    	'shiftr_form_data',
    	'normal'
    );
}

add_action( 'add_meta_boxes', 'shiftr_form_data_meta_boxes' );


add_action( 'edit_form_top', function( $post ) {

	if ( $post->post_type == 'shiftr_form_data' ) {
		?>

		<style type="text/css"> #post-body-content { display: none; } </style>

		<?php
	}
} );


function shiftr_form_data_get_content() {

	global $post, $shiftr_forms;

	$content = get_post_meta( $post->ID, '_shiftr_form_data_content', true );
	$content = unserialize( $content );

	$form_id = get_post_meta( $post->ID, '_shiftr_form_data_form_id', true );
	$form    = get_the_title( $form_id );

	$form_post = get_post( $form_id );
	$form_instance = $shiftr_forms[ $form_post->post_name ];

	?>

	<div>
		<h2 class="shiftr-meta-box--heading">#<?php echo $post->ID . ' ' . $content['name']; ?></h2>
		<span>Submitted via the <strong><?php echo $form; ?></strong> form - <?php echo get_the_date( 'l jS M Y \@ H:i' ); ?></span>
	</div>
	
	<table class="shiftr-form-data-content-table" cellspacing="0" cellpadding="0">
		<tbody>
			<?php

			foreach ( $content as $name => $value ) :

				if ( $name == 'cv' ) {

					$key = 0;

					foreach ( $form_instance->fields as $k => $field ) {

						if ( $field['name'] == $name ) {
							$key = $k;
						}
					}

					
					if ( $form_instance->fields[ $key ]['type'] == 'file' ) {

						$files = get_post_meta( $post->ID, '_shiftr_form_data_files', true );

						$files = unserialize( $files );

						$upload_dir = wp_upload_dir();
						$shiftr_upload_dir = $upload_dir['baseurl'] . '/shiftr-form-attachments/';

						if ( is_array( $files ) ) {

							foreach ( $files as $file ) {

								$value .= '<a href="' . $shiftr_upload_dir . $file . '" target="_blank">' . $file . '</a>, ';
							}

						} else if ( is_string( $files ) ) {

							$value = '<a href="' . $shiftr_upload_dir . $files . '" target="_blank">' . $files . '</a>';

						} else {
							continue;
						}
					}
				}

			?>
			<tr>
				<td><?= strtoupper( $name ); ?></td>
				<td><?= $value; ?></td>
			</tr>
			<?php endforeach; ?>
		</tbody>
	</table>

	<?php
}


function shiftr_form_get_error() {

	global $post;

	$error = get_post_meta( $post->ID, 'shiftr_form_mail_error', true );

	echo '<pre><code>';

	print_r( maybe_unserialize( $error ) );

	echo '</code></pre>';
}

