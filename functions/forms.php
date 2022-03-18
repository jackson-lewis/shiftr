<?php 
/**
 * General
 */
shiftr_register_form(
    'general',
    [
        'settings' => [
            'nicename'  => 'General',
            'labels'    => false
        ],
        'fields' => [
            [
                'type'      => 'text',
                'name'      => 'name'
            ],
            [
                'type'      => 'email',
                'name'      => 'email'
            ],
            [
                'type'      => 'tel',
                'name'      => 'phone',
                'required'  => false
            ],
            [
                'type'      => 'textarea',
                'name'      => 'message',
                'rows'      => 6
            ],
            [
                'type'      => 'checkbox',
                'name'      => 'accept_terms',
                'label'     => 'I agree to the Terms & Conditions.',
                'include_in_send' => false
            ]
        ]
    ]
);

function shiftr_form_general() {
    shiftr_build_form( 'general' );
}
