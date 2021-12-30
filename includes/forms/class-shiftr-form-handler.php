<?php

/**
 * Error response codes:
 * 
 * 2: Invalid email address.
 * 3: Required fields were missing.
 * 4: wp_mail returned false.
 * 5: File upload failed validation checks.
 * 9: Forced error for testing via error@example.com
 */
class Shiftr_Form_Handler {

    /* str The form name */
    var $form = '';

    /* obj The Shiftr_Form instance */
    var $form_instance;

    /* int The form ID */
    var $form_ID = 0;

    /* null Store the phpmailerException if there is one */
    var $error = null;

    /* array Store filepaths to be included in send */
    var $files = array();

    /* int The assigned ID of the data post */
    var $data_ID = 0;

    /** string The current secret dir for uploads */
    var $secret_uploads_dir;


    /**  
     *  Set-up the class ready for handling the request
     *
     *  @since 1.0
     */
    function __construct() {

        if ( shiftr_is_sending_form() ) {

            global $shiftr_forms;

            // We need a few files early to find all registered Shiftr Forms
            include( SHIFTR_INC . '/forms/shiftr-form.php' );
            include( SHIFTR_FUNC . '/forms.php' );

            $this->form_ID = $_POST['shiftr_form_id'];
            $this->form = get_post( $this->form_ID );
            $this->form_instance = $shiftr_forms[ $this->form->post_name ];
        }
    }


    /**  
     *  Add all the Shiftr Form Handler hooks
     *
     *  @since 1.0
     */
    function set_hooks() {

        if ( shiftr_is_sending_form() ) {

            add_action( 'wp_ajax_shiftr_form_handler', array( $this, 'init' ) );
            add_action( 'wp_ajax_nopriv_shiftr_form_handler', array( $this, 'init' ) );

            // For if our send attempt fails
            add_action( 'wp_mail_failed', array( $this, 'failed' ) );

        } else {

            add_action( 'shiftr_delete_expired_form_data', array( $this, 'delete_expired_data' ) );

            if ( ! wp_next_scheduled( 'shiftr_delete_expired_form_data' ) ) {

                wp_schedule_event( strtotime( '01:00' ), 'daily', 'shiftr_delete_expired_form_data' );
            }
        }
    }


    /**  
     *  Hook onto WP AJAX
     *
     *  It's important that we handle the data capture and email sending seperately
     *
     *  @since 1.0
     */
    function init() {
        global $shiftr;

        $this->response = array(
            'success' => false,
            'message' => ''
        );

        $this->verification();

        $this->maybe_upload_attachments();

        // Check data capture is enabled
        if ( $shiftr->forms->capture ) {
            $this->capture();
        }
        
        // Take care of sending the form data
        $this->handle();
    }


    function send_response( $res = array() ) {
        wp_die( wp_json_encode( wp_parse_args( $res, $this->response ) ) );
    }


    /**  
     *  Verify the submission before going anywhere
     *
     *  @since 1.0
     */
    function verification() {

        // Validate email address
        $email = $this->get_value( 'email' );

        if ( ! is_email( $email ) ) {

            $this->send_response([
                'message' => 'Err 2: Invalid email address.'
            ]);
        }

        // Check all required fields have a value
        $empty_required_fields = array();

        foreach ( $this->form_instance->fields as $field ) {

            $defaults = array(
                'type'              => '',
                'name'              => '',
                'required'          => true,
                'label'             => '',
                'include_in_send'   => true,
                'rows'              => 4
            );

            $field = wp_parse_args( $field, $defaults );

            if ( $field['required'] ) {

                if ( $field['type'] == 'file' ) {

                    if ( empty( $this->get_file( $field['name'] ) ) ) {

                        $empty_required_fields[] = $field['name'];
                    }

                } else if ( ! $this->has_value( $field['name'] ) ) {

                    $empty_required_fields[] = $field['name'];
                }
            }
        }

        if ( ! empty( $empty_required_fields ) ) {
            $plural = ( count( $empty_required_fields ) == 1 ) ? '' : 's';

            $this->send_response([
                'message' => 'Err 3: ' . strval( count( $empty_required_fields ) ) . " field{$plural} " . ( $plural ? 'are' : 'is' ) . ' missing.'
            ]);
        }

        /**
         * Enable testing.
         */
        $value = $this->get_value( 'email' );

        if ( $value == 'error@example.com' ) {
            $this->send_response([
                'message' => 'Err 9: Forced error.'
            ]);
        }
    }


    /**  
     *  Save the form data to the database
     *
     *  @since 1.0
     */
    function capture() {

        do_action( 'shiftr_form_handler_capture_before', $this->form_instance );

        global $shiftr;

        $title = date( 'd-m-y-H:i:s' );
        $data = array();

        // Ignores the 'include_in_send' field setting
        foreach ( $this->form_instance->fields as $field ) {
            $_value = $this->get_value( $field['name'] );

            // Don't capture accept terms and conditions field
            if ( $field['name'] == 'accept_terms' ) {
                continue;
            }

            // Sanitize field value based on field type
            switch( $field['type'] ) {

                case 'email':
                    $value = sanitize_email( $_value );
                    break;

                case 'textarea':
                    $value = sanitize_textarea_field( $_value );
                    break;

                default:
                    $value = sanitize_text_field( $_value );
            }

            if ( $field['type'] == 'tel' ) {
                $value = $this->format_phone_number( $value );
            }

            $data[ $field['name'] ] = $value;
        }

        // List of args for the post
        $args = array(
            'post_author' => 1,
            'post_title' => $title,
            'post_type' => 'shiftr_form_data'
        );

        $args = apply_filters( 'shiftr_form_handler_capture_post_args', $args, $this->form );

        // Create the post and assign post ID
        $this->data_ID = wp_insert_post( $args );

        add_post_meta( $this->data_ID, 'shiftr_form_data_content', base64_encode( serialize( $data ) ) );
        add_post_meta( $this->data_ID, 'shiftr_form_data_form_id', $this->form_ID );

        do_action( 'shiftr_form_handler_capture_after', $this->form_instance, $data, $this->data_ID );
    }


    /**  
     *  Do the handling...
     *
     *  @since 1.0
     */
    function handle() {
        global $shiftr;

        // Get Form type
        $form_defaults = $shiftr->forms->defaults;

        $subject = $form_defaults->subject;
        $recepients = $form_defaults->recepients;

        $recepients = $this->format_multiple_emails( $recepients );

        // Prep for headers
        $headers = array();

        // Set content type as HTML
        $headers[] = 'Content-type: text/html; charset=UTF-8';
        $headers[] = 'Reply-To: ' . $_POST['_' . $this->form_ID . '_email'];

        // Use form specific settings
        if ( get_field( 'subject', $this->form_ID ) ) {

            $subject = get_field( 'subject', $this->form_ID );
        }

        if ( get_field( 'recepients', $this->form_ID ) ) {

            $recepients = get_field( 'recepients', $this->form_ID );
        }

        if ( preg_match( '/\%field_[a-zA-Z0-9_\-]*\%/', $subject ) ) {

            preg_match( '/\%field_([a-zA-Z0-9_\-]*)\%/', $subject, $match );

            $subject = preg_replace( '/\%field_[a-zA-Z0-9_\-]*\%/', $this->get_value( $match[1] ), $subject );
        }

        // Apply the filters
        $subject = apply_filters( 'shiftr_form_handler_subject', $subject, $this->form );
        $recepients = apply_filters( 'shiftr_form_handler_recepients', $recepients, $this->form );
        $headers = apply_filters( 'shiftr_form_handler_headers', $headers, $this->form );

        // Try and sent the form
        if ( wp_mail( $recepients, $subject, $this->html(), $headers, $this->files ) ) {
            $response = array(
                'success' => true,
                'message' => 'Message successfully sent!'
            );

        } else {
            $response = array(
                'message' => 'Err 4: There was an error while trying to send your message.'
            );
        }

        do_action( 'shiftr_form_handle_after', $this );

        $this->send_response( $response );
    }


    /**  
     *  Create the HTML structure and populate data from the contact form
     *
     *  @since 1.0
     *
     *  @return str The HTML of the email
     */
    function html() {

        // Body open
        $html_open = '<html><body>';
        $body_open = '<h1>New Message</h1>';
        $body_open .= '<p>Submitted via the <strong>' . $this->form_instance->nicename . '</strong> form.</p>';

        $body_open = apply_filters( 'shiftr_form_handler_html_body_open', $body_open, $this->form );

        $table_open = '<table style="width:100%;"><tbody>';

        
        // The form fields
        $fields = $this->form_instance->fields;

        $table_contents = '';

        $i = 1;
        foreach ( $fields as $field ) {

            $defaults = array(
                'type'              => '',
                'name'              => '',
                'required'          => true,
                'label'             => '',
                'include_in_send'   => true,
                'rows'              => 4
            );

            $field = wp_parse_args( $field, $defaults );

            // Check field value exists in $_POST
            if ( ! $this->has_value( $field['name'] ) ) continue;

            // Honor the include_in_send setting
            if ( ! $field['include_in_send'] ) continue;


            if ( $field['type'] == 'file' ) continue;

            $value = $this->get_value( $field['name'] );

            if ( $field['type'] == 'tel' ) {
                $value = $this->format_phone_number( $value );
            }

            $table_contents .= ( $i % 2 ) ? '<tr style="background-color:rgba(120,120,120,0.25);">' : '<tr>';

            $table_contents .= '<td style="width:160px;padding:15px 20px;color:#555555;font-weight:700;text-align:right;">'. ucwords( $field['label'] ?: $field['name'] ) .'</td>';
            $table_contents .=  '<td style="padding:15px 20px;">'. wp_unslash( $value ) .'</td>';
            
            $table_contents .= '</tr>';

            $i++;
        }

        // Body close
        $table_close = '</tbody></table>';
        $html_close = '</body></html>';

        // Bring it all together
        $full_body = $html_open . $style . $body_open . $table_open . $table_contents . $table_close . $html_close;

        // Apply any filters to the body HTML and return
        return apply_filters( 'shiftr_form_handler_html_full_body', $full_body, $this->form );
    }


    /**  
     *  Upload attachments if any
     *
     *  @since 1.0
     */
    function maybe_upload_attachments() {

        $files = array();

        foreach ( $this->form_instance->fields as $field ) {

            $defaults = array(
                'type'              => '',
                'name'              => '',
                'required'          => true,
                'label'             => '',
                'include_in_send'   => true,
                'rows'              => 4
            );

            $field = wp_parse_args( $field, $defaults );

            if ( $field['type'] == 'file' ) {

                if ( $this->validate_attachment( $field ) ) {
                    $file = $this->upload_attachment( $field['name'] );

                    $files[] = $file['path'];

                } else if ( $field['required'] ) {
                    $this->send_response([
                        'message' => 'Err 5: File validation failed.'
                    ]);
                }
            }
        }

        $this->files = $files;
    }


    /**  
     *  Find all files and attach to email
     *
     *  @since 1.0
     */
    function upload_attachment( $field_name = '', $field = null ) {
        $file = $_FILES[ '_' . $this->form_ID . '_' . $field_name ];

        $secret_dir = $this->generate_secret_dir( $field_name );
        $this->secret_uploads_dir = $secret_dir;

        add_filter( 'upload_dir', array( $this, 'uploads_filter' ) );
        
        $upload = wp_handle_upload( $file, array(
            'test_form' => false
        ));

        remove_filter( 'upload_dir', array( $this, 'uploads_filter' ) );

        if ( $upload && ! isset( $upload['error'] ) ) {
            add_action( 'shiftr_form_handle_after', array( $this, 'delete_uploaded_files' ) );

            return array(
                'path' => $upload['file']
            );
        }

        return array();
    }


    /**
     * Validate the file
     * 
     * @since 1.3.5
     */
    function validate_attachment( $field ) {
        $file = $_FILES[ '_' . $this->form_ID . '_' . $field['name'] ];

        if ( ! empty( $file['error'] ) && $file['error'] !== UPLOAD_ERR_NO_FILE ) {
            return false;
        }

        if ( empty( $file['tmp_name'] ) ) {
            return false;
        }
        
        /** Validate file type */
        $file_type_pattern = shiftr_form_get_file_types( $field );
        $file_type_pattern = '/\.(' . $file_type_pattern . ')$/i';

        if ( empty( $file['name'] ) || ! preg_match( $file_type_pattern, $file['name'] ) ) {
            return false;
        }

        return true;
    }

    function uploads_filter( $args ) {
        $secret_dir = '/' . $this->secret_uploads_dir;

        if ( $secret_dir ) {
            $args['path'] = str_replace( $args['subdir'], '', $args['path'] );
            $args['url'] = str_replace( $args['subdir'], '', $args['url'] );
            $args['subdir'] = $secret_dir;
            $args['path'] .= $secret_dir;
            $args['url'] .= $secret_dir;
    
            if ( ! file_exists( $args['path'] ) ) {
                wp_mkdir_p( $args['path'] );
            }
        }

        return $args;
    }

    function generate_secret_dir( $field_name ) {
        return md5( $this->form_ID . $field_name );
    }


    function delete_uploaded_files( $handler ) {
        $uploads = wp_get_upload_dir();

        foreach ( $this->form_instance->fields as $field ) {

            $defaults = array(
                'type'              => '',
                'name'              => '',
                'required'          => true,
                'label'             => '',
                'include_in_send'   => true,
                'rows'              => 4
            );

            $field = wp_parse_args( $field, $defaults );

            if ( $field['type'] == 'file' ) {
                $dir = $uploads['basedir'] . '/' . $this->generate_secret_dir( $field['name'] );

                if ( is_dir( $dir ) ) {
                    array_map( 'unlink', glob( $dir . '/*' ) );
                    rmdir( $dir );
                }
            }
        }
    }


    /**  
     *  Used in the Form Handler to format multiple email addresses
     *
     *  @since 1.0
     *
     *  @param $emails str The email addresses as a single string
     *  @return $emails str The email addresses formatted with seperating commas
     */
    function format_multiple_emails( $emails ) {

        // Remove lines and any spaces
        $emails = trim( preg_replace( '/\s\s+/', ',', $emails ) );

        return $emails;
    }
    

    /**  
     *  Used to chnage the phone number into a more readable format
     *
     *  @since 1.0
     *
     *  @param $number str The raw phone number
     *  @return $formatted str The formatted phone number
     */
    function format_phone_number( $number ) {
        $formatted = $number;

        // Format mobile number
        if ( preg_match( '/^07/', $number ) ) {

            $formatted = substr( $number, 0, 3 );
            $formatted .= ' ' . substr( $number , 3, 3 );
            $formatted .= ' ' . substr( $number , 6, 3 );
            $formatted .= ' ' . substr( $number , 9, 2 );
        }

        return $formatted;
    }


    /**  
     *  Handle a phpmailerException 
     *
     *  @since 1.0
     */
    function failed( $wp_error ) {

        $this->error = $wp_error;

        // Add error object to db
        add_post_meta( $this->data_ID, 'shiftr_form_mail_error', base64_encode( maybe_serialize( $this->error ) ) );
    }


    /**  
     *  Delete data posts that exceed a defined expiration time period
     *
     *  @since 1.0
     */
    function delete_expired_data() {
        global $shiftr;

        // Update the $shiftr global with custom settings
        include SHIFTR_FUNC . '/_shiftr-settings.php';

        $days = $shiftr->forms->expiration_days;

        if ( $days < 1 ) return;

        $expiration_date = date( 'Y-m-d H:i:s', strtotime( "-$days days", strtotime( date( 'Y-m-d H:i:s' ) ) ) );

        $posts = get_posts( array(
            'post_type'     => 'shiftr_form_data',
            'post_status'   => 'draft',
            'numberposts'   => -1
        ));

        foreach ( $posts as $post ) {

            setup_postdata( $post );

            // Delete post if post date is after expiration date
            if ( $expiration_date >= $post->post_date ) {

                wp_delete_post( $post->ID );
            }
        }

        wp_reset_postdata();
    }


    /**  
     *  Return a $_POST value
     *
     *  @since 1.0
     */
    function get_value( $field = '' ) {

        if ( $this->value_exists( $field ) ) {
            return $_POST[$this->POST_field( $field )];

        } else {
            return false;
        }
    }


    /**  
     *  Check a $_POST property has a value
     *
     *  @since 1.0
     */
    function has_value( $field = '' ) {

        if ( isset( $_POST[$this->POST_field( $field )] ) ) {
            
            if ( $this->get_value( $field ) != '' ) {

                return true;

            } else {
                return false;
            }

        } else {
            return false;
        }
    }


    /**  
     *  Check a $_POST property has a value
     *
     *  @since 1.0
     */
    function value_exists( $field = '' ) {
        return isset( $_POST[$this->POST_field( $field )] );
    }


    /**  
     *  Return a $_FILES array
     *
     *  @since 1.0
     */
    function get_file( $field = '' ) {
        return $_FILES[ '_' . $this->form_ID . '_' . $field ];
    }


    /**
     *  Return a $_POST field name
     *
     *  @since 1.0
     */
    function POST_field( $field = '' ) {
        return '_' . $this->form_ID . '_' . $field;
    }
}


$shiftr_form_handler = new Shiftr_Form_Handler;

// Add the Shiftr_Form_Handler methods to WP AJAX and cron
$shiftr_form_handler->set_hooks();  
