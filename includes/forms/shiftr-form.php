<?php
/**
 * Shiftr Forms
 */

// The global
global $shiftr_forms;

// Placeholder value
$shiftr_forms = array();


/**  
 *  Register a Shiftr form
 *
 *  @since 1.0
 *
 *  @param $form str The name of the form
 *  @param $args array The form settings and list of fields
 */
function shiftr_register_form( $form = '', $args = [] ) {
    global $shiftr_forms;

    if ( ! isset( $shiftr_forms[ $form ] ) ) {

        $shiftr_forms[ $form ] = new Shiftr_Form( $form, $args );
    }
    
    $shiftr_forms[ $form ]->init();
}


/**  
 *  Output the HTML of the whole form
 *
 *  @since 1.0
 *
 *  @param string $form The name of the form
 */
function shiftr_build_form( $form = '', $is_shortcode = false ) {
    global $shiftr_forms;

    if ( isset( $shiftr_forms[ $form ] ) ) {

        $shiftr_forms[ $form ]->build( $is_shortcode );

    } else {
        return false;
    }
    
}


/**
 * Shiftr Form shortcode used to display a given form.
 */
function shiftr_form_shortcode( $atts = array() ) {
    $atts = array_change_key_case( (array) $atts, CASE_LOWER );

    if ( ! isset( $atts['form'] ) ) {
        return false;
    }

    ob_start();
    shiftr_build_form( $atts['form'], true );
    return ob_get_clean();
}
add_shortcode( 'shiftr_form', 'shiftr_form_shortcode' );


global $shiftr_form_core;

$shiftr_form_core = array();


// Register the Shiftr forms post type
$shiftr_form_core['form'] = new Shiftr_Custom_Post_Type(
    array(
        'label'         => 'Form',
        'name'          => 'shiftr_form',
        'menu_position' => 59,
        'menu_icon'     => 'dashicons-email-alt'
    ),
    array(
        'show_ui' => true,
        'has_archive' => false,
        'capabilities' => array(
            'create_posts'       => 'do_not_allow',
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
        'label'         => 'Form Submissions',
        'name'          => 'shiftr_form_data',
        'plural'        => false
    ),
    array(
        'show_ui' => true,
        'show_in_menu' => 'edit.php?post_type=shiftr_form',
        'has_archive' => false,
        'capabilities' => array(
            'create_posts'       => 'do_not_allow',
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

        $args['labels']['all_items'] = 'Submissions';
        $args['labels']['edit_item'] = 'View Submission';
    }

    return $args;

}, 10, 2 );


add_filter( 'manage_shiftr_form_data_posts_columns', function( $columns ) {

    unset( $columns['title'] );
    unset( $columns['date'] );

    $columns['data_id']         = 'Submission ID';
    $columns['data_date']       = 'Date';
    $columns['data_from_form']  = 'Form';

    return $columns;
});


add_filter( 'manage_edit-shiftr_form_data_sortable_columns', function( $columns ) {

    $columns['data_id']     = 'ID';
    $columns['data_date']   = 'date';

    return $columns;
});


add_action( 'manage_shiftr_form_data_posts_custom_column', function( $column, $post_id ) {

    if ( $column == 'data_id' ) {

        // Construct record title
        $title = strval( $post_id );

        $content = get_post_meta( $post_id, 'shiftr_form_data_content', true );

        $content = unserialize( base64_decode( $content ) );

        echo '<a href="' . esc_url( admin_url( 'post.php?post=' . $post_id . '&action=edit' ) ) . '"><strong>#' . esc_html( $title . ' ' . wp_unslash( $content['name'] ) ) . '</strong></a>';
    }

    if ( $column == 'data_date' ) {

        $date = get_the_date( 'jS M Y \@ H:i' );

        echo $date;
    }

    if ( $column == 'data_from_form' ) {

        $form_id = get_post_meta( $post_id, 'shiftr_form_data_form_id', true );

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
 *  Create the admin page for general form settings
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
 *  The called function for content to the settings page
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
 *  Update a Shiftr setting via a form
 *
 *  @since 1.0
 *
 *  @param $option_name string The name of the setting to update
 */
function shiftr_update_form_setting( $option_name ) {

    // Update option if changed
    if ( isset( $_POST[$option_name] ) ) {
        $new_value = $_POST[$option_name];

        $update_return = false;

        if ( get_option( $option_name ) != $new_value ) {
            $update_return = update_option( $option_name, $new_value );
        }

        if ( $update_return ) {
            add_action( 'admin_notices', 'shiftr_notice_update_form_setting' );
        }
    }
}


function shiftr_notice_update_form_setting() {

    ?>
<div class="notice notice-success is-dismissible">
    <p>Settings updated successfully</p>
</div>
    <?php
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

    $content = get_post_meta( $post->ID, 'shiftr_form_data_content', true );
    $content = unserialize( base64_decode( $content ) );

    $form_id = get_post_meta( $post->ID, 'shiftr_form_data_form_id', true );
    $form    = get_the_title( $form_id );

    $form_post = get_post( $form_id );

    $form_instance = false;
    if ( isset( $shiftr_forms[ $form_post->post_name ] ) ) {
        $form_instance = $shiftr_forms[ $form_post->post_name ];
    } else {
        ?>
        <p><strong>Error!</strong> The form could not be found.</p>
        <?php 
        return;
    }
    ?>

    <div>
        <h2 class="shiftr-meta-box--heading">#<?php echo esc_html( $post->ID . ' ' . $content['name'] ); ?></h2>
        <span>Submitted via the <strong><?php echo $form; ?></strong> form - <?php echo get_the_date( 'l jS M Y \@ H:i' ); ?></span>
    </div>
    
    <table class="shiftr-form-data-content-table" border="0" cellspacing="0" cellpadding="0">
        <tbody>
            <?php

            $key = 0;

            foreach ( $content as $name => $value ) :
                $field = $form_instance->fields[ $key ];

                $label = isset( $field['label']  ) ? $field['label'] : $name;
            ?>
            <tr>
                <td><?php echo esc_html( strtoupper( shiftr_to_nicename( $label ) ) ); ?></td>
                <td><?php echo esc_html( wp_unslash( $value ) ); ?></td>
            </tr>
            <?php $key++; endforeach; ?>
        </tbody>
    </table>

    <?php
}


function shiftr_form_get_error() {
    global $post;

    $error = get_post_meta( $post->ID, 'shiftr_form_mail_error', true );

    echo '<pre><code>';

    print_r( esc_html( maybe_unserialize( base64_decode( $error ) ) ) );

    echo '</code></pre>';
}


/**
 * Get the accepted file types for a file input
 * 
 * @since 1.4
 * @param array $field The field 
 * @param string $format The format to return, regex or attribute
 * @return string The list of file types in the requested format
 */
function shiftr_form_get_file_types( $field, $format = 'regex' ) {

    $file_types = array();
    $formatted_file_types = array();

    $default_file_types = array(
        'png',
        'jpg',
        'jpeg',
        'gif',
        'pdf',
        'doc',
        'docx',
        'ppt',
        'pptx',
        'pages',
        'keynote'
    );

    if ( empty( $field['file_types'] ) ) {
        $file_types = $default_file_types;

    } else {
        $file_types = explode( ',', $field['file_types'] );
    }

    if ( is_array( $file_types ) ) {

        foreach ( $file_types as $type ) {

            if ( is_string( $type ) ) {
                $type = preg_split( '/[\s,]+/', $type );
            }

            $formatted_file_types = array_merge( $formatted_file_types, (array) $type );
        }

        $formatted_file_types = array_unique( array_filter( $formatted_file_types ) );
    }

    $output = '';

    foreach ( $formatted_file_types as $type ) {
        $type = trim( $type, ' ,|' );

        if ( $format === 'attr' ) {
            if ( preg_match( '/^application/', $type ) ) {
                $output .= sprintf( '%s,', $type );
            } else {
                $output .= sprintf( '.%s,', $type );
            }
        } else {
            $output .= preg_replace( array(
                '/\//',
                '/\./'
            ), array(
                '\/',
                '\.'
            ), $type );
            
            $output .= '|';
        }
    }

    return trim( $output, ' ,|' );
}
