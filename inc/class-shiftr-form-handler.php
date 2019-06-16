<?php

class Shiftr_Form_Handler {


	/**  
	 *  init
	 *
	 *  Hook onto WP AJAX
	 *
	 *  @since 1.0
	 */

	function init() {

		add_action( 'wp_ajax_shiftr_form_handler', array( $this, 'handle' ) );
		add_action( 'wp_ajax_nopriv_shiftr_form_handler', array( $this, 'handle' ) );
	}


	/**  
	 *  handle
	 *
	 *  Do the handling...
	 *
	 *  @since 1.0
	 */

	function handle() {

		// Define return data
		$output = array();


		// Call the main Shiftr object
		global $shiftr;


		// Do the job
		if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

			$output['post'] = true;

			// Get Form type
			$form_id = $_POST['shiftr_form_id'];
			$form_defaults = $shiftr->form_default_settings();


			// Get all form settings
			//$form_settings = get_fields( $form_id );
			//$form_settings = (object) $form_settings;


			// Get subject
			$form_subject = $form_settings->subject;
		

			// Check if default recepients needs overriding
			if ( $form_settings->recepients != '' ) {
				$recepients = $form_settings->recepients;

			} else {
				$recepients = $form_defaults->recepients;
			}

			$recepients = $this->format_multiple_emails( $recepients );

			// Prep for headers
			$headers = array();

			// Set content type as HTML
			$headers[] = 'Content-type: text/html; charset=UTF-8';


			// Add additional headers set to the form
			// if ( gettype( $form_settings['headers'] ) === 'array' ) {
			// 	if ( count( $form_settings['headers'] ) > 0 ) {
			// 		foreach ( $form_settings['headers'] as $header ) {
			// 			$headers[] = ucfirst( $header['type'] ) . ': ' . $header['content'];
			// 		}
			// 	}
			// }


			$headers[] = 'Reply-To: ' . $_POST['_'.$form_id.'_email'];


			// Let's try to use SMTP
			$this->set_SMTP();


			// Try and sent the form
			if ( wp_mail( $recepients, 'Subject', $this->html( $content ), $headers ) ) {

				$output['sent'] = true;
				
			} else {
				$output['sent'] = false;
			}

		} else {
			$output['post'] = false;
		}

		// Return JSON to JS function
		echo json_encode( $output );

		wp_die();
	}


	/**  
	 *  set_SMTP
	 *
	 *  Let wp_mail use SMTP if details have been provided
	 *
	 *  @since 1.0
	 */

	function set_SMTP() {

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
	 *  html
	 *
	 *	Create the HTML structure and populate data from the contact form
	 *
	 *  @since 1.0
	 *
	 * 	@return str The HTML of the email
	 */

	function html( $content ) {

		// Body init
		$body = '<html><body>';
		$body .= '<h1>New Message</h1>';
		$body .= '<table><tbody>';

		
		// Content
		$content = array();

		if ( count( $content ) > 0 ) {
			foreach ( $content as $key => $value ) {
				if ( !empty( $value ) ) {

					$body .= '<tr>';

					$body .= '<td style="min-width:80px;font-weight:700;">'. $key .'</td>';
					$body .= '<td>'. $value .'</td>';

					$body .= '</tr>';
				}
			}
		}

		// Body close
		$body .= '</tbody></table>';
		$body .= '</body></html>';


		return $body;
	}
}


// Only run on a call to admin-ajax.php
if ( defined( 'DOING_AJAX' ) && isset( $_REQUEST['action'] ) ) {

	$form_handler = new Shiftr_Form_Handler;

	// Init the Handler
	$form_handler->init();
}

