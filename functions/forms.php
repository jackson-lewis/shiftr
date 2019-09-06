<?php 

	/*  ////  --|    Register Shiftr Forms

    */


	// The General Form
	shiftr_register_form(
		'general',
		array(
			'settings' => array(
				'nicename' 	=> 'General',
				'labels' => false
			),
			'fields' => array(
				array(
					'type' 		=> 'text',
					'name'		=> 'name'
				),
				array(
					'type' 		=> 'email',
					'name'		=> 'email'
				),
				array(
					'type'		=> 'select',
					'name'		=> 'enquiry_type',
					'required'  => false,
					'options'   => array(
						'value1' => 'Value 1',
						'value2' => 'Value 2'
					)
				),
				array(
					'type'		=> 'radio',
					'name'		=> 'kitchen-type',
					'radio_fields' => array(
						array(
							'name' => 'black'
						),
						array(
							'name' => 'green'
						),
						array(
							'name' => 'blue'
						)
					)
				),
				array(
					'type' 		=> 'textarea',
					'name'		=> 'message',
					'rows'		=> 6
				),
				array(
					'type' 		=> 'checkbox',
					'name'		=> 'accept',
					'label' 	=> 'I agree to the Terms & Conditions.',
					'include_in_send' => false
				)
			)
		)
	);


	// The callable function to output the form HTML
	function shiftr_form_general() {

		shiftr_build_form( 'general' );
	}

