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

		global $shiftr_forms;

		// We need a few files early to find all registered Shiftr Forms
		include( SHIFTR_INC . '/shiftr-form.php' );
		include( SHIFTR_FUNC . '/forms.php' );

		$this->form_ID = $_POST['shiftr_form_id'];
		$this->form = get_post( $this->form_ID );
		$this->form_instance = $shiftr_forms[ $this->form->post_name ];
	}


	/**  
	 *  set_hooks
	 *
	 *  Add all the Shiftr Form Handler hooks
	 *
	 *  @since 1.0
	 */

	function set_hooks() {

		add_action( 'wp_ajax_shiftr_form_handler', array( $this, 'init' ) );
		add_action( 'wp_ajax_nopriv_shiftr_form_handler', array( $this, 'init' ) );

		// For if our send attempt fails
		add_action( 'wp_mail_failed', array( $this, 'failed' ) );
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

		// Take care of capturing the form data
		$this->capture();

		// Take care of sending the form data
		$this->handle();
	}


	/**  
	 *  capture
	 *
	 *  Save the form data to the database
	 *
	 *  @since 1.0
	 */

	function capture() {

		$title = date( 'd-m-y-H:i:s' );

		$data = '';

		// Ignores the 'include_in_send' field setting
		foreach ( $this->form_instance->fields as $field ) {
			
			if ( ! $this->value_exists( $field['name'] ) ) continue;

			$data .= '<b>' . strtoupper( $field['name'] ) . '</b>';
			$data .= '<br>';
			$data .= $this->get_value( $field['name'] );
			$data .= '<br><br>';
		}

		// Create the post
		$this->data_ID = 0;

		// Extend the functionality of the data capture
		do_action( 'shiftr_form_handler_capture', $this->data_ID );
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
		$form_defaults = $shiftr->form_default_settings();

		$subject = $form_defaults->subject;
		$recepients = $form_defaults->recepients;

		$recepients = $this->format_multiple_emails( $recepients );

		// Prep for headers
		$headers = array();

		// Set content type as HTML
		$headers[] = 'Content-type: text/html; charset=UTF-8';
		$headers[] = 'Reply-To: ' . $_POST['_' . $this->form_ID . '_email'];

		// Apply the filters
		$subject = apply_filters( 'shiftr_form_handler_subject', $subject, $this->form );
		$recepients = apply_filters( 'shiftr_form_handler_recepients', $recepients, $this->form );
		$headers = apply_filters( 'shiftr_form_handler_headers', $headers, $this->form );

		// Configure $phpmailer to use SMTP if credentials available
		$this->trySMTP();

		// Try and sent the form
		if ( wp_mail( $recepients, $subject, $this->html(), $headers ) ) {

			$output = true;

		} else {
			$output = 'MAIL';
		}

		// Return string to JS function
		echo $output;

		wp_die();
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

			// Check field value exists in $_POST
			if ( ! $this->value_exists( $field['name'] ) ) continue;

			// Honor the include_in_send setting
			if ( ! $field['include_in_send'] ) continue;


			$table_contents .= '<tr>';

			$table_contents .= '<td>'. ucwords( $field['name'] ) .'</td>';
			$table_contents .= '<td>'. $this->get_value( $field['name'] ) .'</td>';

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
		add_post_meta( $this->data_ID, 'shiftr_form_mail_error', maybe_serialize( $this->error ) );

		// Update data title with "FAILED" message
		$data_title = get_the_title( $this->data_ID );

		wp_update_post( array( 'ID' => $this->data_ID, 'post_title' => $data_title . ' (FAILED)' ) );
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
			return $_POST[ '_' . $this->form_ID . '_' . $field ];

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

		if ( isset( $_POST[ '_' . $this->form_ID . '_' . $field ] ) ) {
			return true;

		} else {
			return false;
		}
	}

}


// Only run on a call to admin-ajax.php
if ( shiftr_is_sending_form() ) {

	$form_handler = new Shiftr_Form_Handler;

	// Add the Shiftr_Form_Handler methods to WP AJAX
	$form_handler->set_hooks();	
}

