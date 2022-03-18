<?php

use Shiftr_ACF\Group;
use Shiftr_ACF\Field_Types;

/**
 * Single Shiftr Form
 */
new Group(
    'single-shiftr_form',
    [
        'title'     => 'Form Settings',
        'fields'    => [
            Field_Types\text_field(
                'Recepients'
            ),
            Field_Types\text_field(
                'Subject'
            )
        ],
        'location'  => [
            [
                [
                    'param'     => 'post_type',
                    'operator'  => '==',
                    'value'     => 'shiftr_form'
                ]
            ]
        ]
    ]
);
