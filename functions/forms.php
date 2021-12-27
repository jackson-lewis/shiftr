<?php 
/**
 * General
 */
shiftr_register_form(
    'general',
    array(
        'settings' => array(
            'nicename'  => 'General',
            'labels' => false
        ),
        'fields' => array(
            array(
                'type'      => 'text',
                'name'      => 'name'
            ),
            array(
                'type'      => 'email',
                'name'      => 'email'
            ),
            array(
                'type'      => 'tel',
                'name'      => 'phone',
                'required'  => false
            ),
            array(
                'type'      => 'textarea',
                'name'      => 'message',
                'rows'      => 6
            ),
            array(
                'type'      => 'checkbox',
                'name'      => 'accept_terms',
                'label'     => 'I agree to the Terms & Conditions.',
                'include_in_send' => false
            )
        )
    )
);

function shiftr_form_general() {
    shiftr_build_form( 'general' );
}
