<?php

use Shiftr_ACF\Group;
use Shiftr_ACF\Field_Types;

/**
 * Single Shiftr Form
 */
new Group( 'single-shiftr_form', array(
    'title' => 'Form Settings',
    'fields' => array(
        Field_Types\text_field(
            'Recepients'
        ),
        Field_Types\text_field(
            'Subject'
        )
    ),
    'location' => array (
        array (
            array (
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'shiftr_form',
            )
        ),
    )
));
