<?php


class Shiftr_Form_Handler {

	/* str The form name */
	var $form = '';

	/* obj The Shiftr_Form instance */
	var $form_instance;

	/* int The form ID */
	var $form_ID = 0;

	/* array SMTP contants */
	var $SMTP_constants = array( 'HOST', 'AUTH', 'PORT', 'USERNAME', 'PASSWORD', 'SECURE' );

	/* null Store the phpmailerException if there is one */
	var $error = null;

	/* array Store filepaths to be included in send */
	var $files = array();

	/* int The assigned ID of the data post */
	var $data_ID = 0;


	/**  
	 *  __construct
	 *
	 *  Set-up the class ready for handling the request
	 *
	 *  @since 1.0
	 */

	function __construct() {

		if ( shiftr_is_sending_form() ) {

			global $shiftr_forms;

			// We need a few files early to find all registered Shiftr Forms
			include( SHIFTR_INC . '/shiftr-form.php' );
			include( SHIFTR_FUNC . '/forms.php' );

			$this->form_ID = $_POST['shiftr_form_id'];
			$this->form = get_post( $this->form_ID );
			$this->form_instance = $shiftr_forms[ $this->form->post_name ];
		}
	}


	/**  
	 *  set_hooks
	 *
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
	 *  init
	 *
	 *  Hook onto WP AJAX
	 *
	 *	It's important that we handle the data capture and email sending seperately
	 *
	 *  @since 1.0
	 */

	function init() {

		global $shiftr;

		$this->verification();

		$this->manage_attachments();

		// Check data capture is enabled
		if ( $shiftr->forms->capture ) {
			$this->capture();
		}
		
		// Take care of sending the form data
		$this->handle();
	}


	/**  
	 *  verification
	 *
	 *  Verify the submission before going anywhere
	 *
	 *  @since 1.0
	 */

	function verification() {

		if ( ! isset( $_POST['_' . $this->form_ID . '_nonce'] ) ) {

			wp_die( 'nonce_not_found' );
		}

		$nonce = $_POST['_' . $this->form_ID . '_nonce'];

		// Verify the nonce
		if ( ! wp_verify_nonce( $nonce, 'shiftr_form_' . $this->form_ID . '_submission' ) ) {

			wp_die( 'nonce_not_verified' );
		}

		// Validate email address
		$email = $this->get_value( 'email' );

		if ( ! is_email( $email ) ) {

			wp_die( 'invalid_email_address' );
		}

		// Check all required fields have a value
		$empty_required_fields = array();

		foreach ( $this->form_instance->fields as $field ) {

			$defaults = array(
				'type' 				=> '',
				'name' 				=> '',
				'required' 			=> true,
				'label' 			=> '',
				'include_in_send' 	=> true,
				'rows'				=> 4
			);

			$field = wp_parse_args( $field, $defaults );

			if ( $field['required'] ) {

				// Check field value exists in $_POST
				if ( ! $this->has_value( $field['name'] ) ) {

					$empty_required_fields[] = $field['name'];
				}
			}
		}

		if ( ! empty( $empty_required_fields ) ) {

			$plural = ( count( $empty_required_fields ) == 1 ) ? '' : 's';
			wp_die( strval( count( $empty_required_fields ) ) . "_field{$plural}_missing" );
		}
	}


	/**  
	 *  capture
	 *
	 *  Save the form data to the database
	 *
	 *  @since 1.0
	 */

	function capture() {

		do_action( 'shiftr_form_handler_capture_before', $this->form_ID );

		global $shiftr;

		$title = date( 'd-m-y-H:i:s' );
		$data = array();

		// Ignores the 'include_in_send' field setting
		foreach ( $this->form_instance->fields as $field ) {

			$_value = $this->get_value( $field['name'] );

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

		add_post_meta( $this->data_ID, '_shiftr_form_data_content', base64_encode( serialize( $data ) ) );
		add_post_meta( $this->data_ID, '_shiftr_form_data_form_id', $this->form_ID );

		if ( ! empty( $this->files ) ) {

			add_post_meta( $this->data_ID, '_shiftr_form_data_files', serialize( $this->files['filename'] ) );
		}

		do_action( 'shiftr_form_handler_capture_after', $this->form_ID, $this->data_ID );
	}


	/**  
	 *  handle
	 *
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

		// Configure $phpmailer to use SMTP if credentials available
		$this->trySMTP();

		// Try and sent the form
		if ( wp_mail( $recepients, $subject, $this->html(), $headers, $this->files['absolute'] ) ) {

			$output = true;

		} else {
			$output = 'mail_not_sent';
		}


		// Delete all files if capture is not enabled
		if ( ! $shiftr->forms->capture ) {

			foreach ( $this->files as $file ) unlink( $file );
		}

		// Return string to JS function
		wp_die( $output );
	}


	/**  
	 *  html
	 *
	 *	Create the HTML structure and populate data from the contact form
	 *
	 *  @since 1.0
	 *
	 * 	@return str The HTML of the email
	 */

	function html() {

		// Body open
		$html_open = '<html><body>';
		$style = '<style>' . file_get_contents( SHIFTR_ASSETS . '/styles/email.css' ) . '</style>';
		$body_open = '<h1>New Message</h1>';

		$body_open = apply_filters( 'shiftr_form_handler_html_body_open', $body_open, $this->form );

		$table_open = '<table><tbody>';

		
		// The form fields
		$fields = $this->form_instance->fields;

		$table_contents = '';

		foreach ( $fields as $field ) {

			$defaults = array(
				'type' 				=> '',
				'name' 				=> '',
				'required' 			=> true,
				'label' 			=> '',
				'include_in_send' 	=> true,
				'rows'				=> 4
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

			$table_contents .= '<tr>';

			$table_contents .= '<td>'. ucwords( $field['name'] ) .'</td>';
			$table_contents .=  '<td>'. wp_unslash( $value ) .'</td>';
			
			$table_contents .= '</tr>';
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
	 *  manage_attachments
	 *
	 *	Find all files and attach to email
	 *
	 *  @since 1.0
	 */

	function manage_attachments() {

		$upload_dir = wp_upload_dir();
		$shiftr_upload_dir = $upload_dir['basedir'] . '/shiftr-form-attachments';

		if ( ! file_exists( $shiftr_upload_dir ) ) {
			wp_mkdir_p( $shiftr_upload_dir );
		}

		$files = array(
			'absolute' => array(),
			'filename' => array()
		);

		foreach ( $this->form_instance->fields as $field ) {

			$defaults = array(
				'type' 				=> '',
				'name' 				=> '',
				'required' 			=> true,
				'label' 			=> '',
				'include_in_send' 	=> true,
				'rows'				=> 4
			);

			$field = wp_parse_args( $field, $defaults );

			if ( $field['type'] == 'file' ) {

				$file = $this->upload_attachment( $field['name'] );

				$files['absolute'][] = $file['absolute'];
				$files['filename'][] = $file['filename'];
			}
		}

		$this->files = $files;
	}


	/**  
	 *  upload_attachment
	 *
	 *	Find all files and attach to email
	 *
	 *  @since 1.0
	 */

	function upload_attachment( $field_name = '' ) {

		$file = $_FILES[ '_' . $this->form_ID . '_' . $field_name ];

		$upload_dir = wp_upload_dir();
		$shiftr_upload_dir = $upload_dir['basedir'] . '/shiftr-form-attachments';

		$filepath = $shiftr_upload_dir . '' . basename( $file['name'] );
		$file_type = strtolower( pathinfo( $filepath, PATHINFO_EXTENSION ) );

		$target_file_name = $field_name . '_' . $this->form_ID . '__' . date( 'j-m-Y-H-i-s' ) . '.' . $file_type;
		$target_file = $shiftr_upload_dir . '/' . $target_file_name;

		if ( move_uploaded_file( $file['tmp_name'], $target_file ) ) {

			return array( 'absolute' => $target_file, 'filename' => $target_file_name );

		} else {
			return '';
		}
	}


	/**  
	 *  format_multiple_emails
	 *
	 *  Used in the Form Handler to format multiple email addresses
	 *
	 *  @since 1.0
	 *
	 *	@param $emails str The email addresses as a single string
	 *	@return $emails str The email addresses formatted with seperating commas
	 */

	function format_multiple_emails( $emails ) {

		// Remove lines and any spaces
		$emails = trim( preg_replace( '/\s\s+/', ',', $emails ) );

		return $emails;
	}
	

	/**  
	 *  format_phone_number
	 *
	 *  Used to chnage the phone number into a more readable format
	 *
	 *  @since 1.0
	 *
	 *	@param $number str The raw phone number
	 *	@return $formatted str The formatted phone number
	 */

	function format_phone_number( $number ) {

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
	 *  trySMTP
	 *
	 *  Attempt to use SMTP if credentials can be found
	 *
	 *  @since 1.0
	 */

	function trySMTP() {

		if ( ! defined( 'SHIFTR_FORM_USE_SMTP' ) ) return;

		if ( SHIFTR_FORM_USE_SMTP ) {
			add_action( 'phpmailer_init', array( $this, 'SMTP' ) );
		}
	}


	/**  
	 *  SMTP
	 *
	 *  Use SMTP
	 *
	 *  @since 1.0
	 */

	function SMTP( $phpmailer ) {

		// Check all the SMTP contants are defined before proceeding
		foreach ( $this->SMTP_constants as $constant ) {

			if ( ! defined( "SHIFTR_FORM_SMTP_{$constant}" ) ) return false;
		}

		$phpmailer->isSMTP();
		$phpmailer->isHTML( true );
		
		$phpmailer->SMTPAuth 	= SHIFTR_FORM_SMTP_AUTH;
		$phpmailer->SMTPSecure 	= SHIFTR_FORM_SMTP_SECURE;
		$phpmailer->Host 		= SHIFTR_FORM_SMTP_HOST;
		$phpmailer->Port 		= SHIFTR_FORM_SMTP_PORT;
		$phpmailer->Username 	= SHIFTR_FORM_SMTP_USERNAME;
		$phpmailer->Password 	= SHIFTR_FORM_SMTP_PASSWORD;
	}


	/**  
	 *  failed
	 *
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
	 *  delete_expired_data
	 *
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
			'post_type' 	=> 'shiftr_form_data',
			'post_status'   => 'draft',
			'numberposts' 	=> -1
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
	 *  get_value
	 *
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
	 *  has_value
	 *
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
	 *  value_exists
	 *
	 *  Check a $_POST property has a value
	 *
	 *  @since 1.0
	 */

	function value_exists( $field = '' ) {

		if ( isset( $_POST[$this->POST_field( $field )] ) ) {
			return true;

		} else {
			return false;
		}
	}


	/**  
	 *  get_file
	 *
	 *  Return a $_FILES array
	 *
	 *  @since 1.0
	 */

	function get_file( $field = '' ) {

		return $_FILES[ '_' . $this->form_ID . '_' . $field ];
	}


	/**
	 *  POST_field
	 *
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

