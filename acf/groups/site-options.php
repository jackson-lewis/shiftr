<?php

use Shiftr_ACF\Group;
use Shiftr_ACF\Utils;
use Shiftr_ACF\Field_Types;

/**
 * Options
 */
new Group( 'site_options', array(
    'title' => 'Site Options',
    'fields' => array(
        Field_Types\tab_field( 'Contact Details' ),
        Field_Types\group_field(
            'Contact Details',
            array(
                'sub_fields' => array(
                    Field_Types\text_field(
                        'Email address',
                        array(
                            'placeholder' => 'info@example.com',
                            'wrapper' => array( 'width' => '50' )
                        )
                    ),
                    Field_Types\text_field(
                        'Phone number',
                        array(
                            'placeholder' => '0800 123 456',
                            'wrapper' => array( 'width' => '50' )
                        )
                    ),
                    Field_Types\textarea_field(
                        'Address',
                        array(
                            'placeholder' => 'Westminster,&#10;London,&#10;SW1A 1AA',
                            'wrapper' => array( 'width' => '50' ),
                            'rows' => '6',
                            'new_lines' => 'br',
                        )
                    ),
                    Field_Types\textarea_field(
                        'Opening hours',
                        array(
                            'placeholder' => 'Mon - Fri: 09:00 - 17:00&#10;Sat - Sun: Closed',
                            'wrapper' => array( 'width' => '50' ),
                            'rows' => '6',
                            'new_lines' => 'br',
                        )
                    ),
                ),
                'wrapper' => array( 'class' => 'hide-label' )
            )
        ),
        Field_Types\tab_field( 'Tracking' ),
        Field_Types\group_field(
            'Tracking',
            array(
                'sub_fields' => array(
                    Field_Types\wysiwyg_field(
                        'Tracking head',
                        array(
                            'key' => 'head',
                            'name' => 'head',
                            'label' => 'Place in &lt;head&gt;',
                            'tabs' => 'text',
                            'toolbar' => 'basic',
                            'media_upload' => 0
                        )
                    ),
                    Field_Types\wysiwyg_field(
                        'Tracking body (open)',
                        array(
                            'key' => 'body_open',
                            'name' => 'body_open',
                            'label' => 'Place at the start of &lt;body&gt;',
                            'tabs' => 'text',
                            'toolbar' => 'basic',
                            'media_upload' => 0
                        )
                    ),
                    Field_Types\wysiwyg_field(
                        'Tracking body (close)',
                        array(
                            'key' => 'body_close',
                            'name' => 'body_close',
                            'label' => 'Place at the end of &lt;body&gt;',
                            'tabs' => 'text',
                            'toolbar' => 'basic',
                            'media_upload' => 0
                        )
                    ),
                ),
                'wrapper' => array( 'class' => 'hide-label' )
            )
        ),
        Field_Types\tab_field( 'Announcement Bar' ),
        Field_Types\group_field(
            'Announcement bar',
            array(
                'sub_fields' => array(
                    Field_Types\text_field(
                        'Message',
                        array(
                            'wrapper' => array(
                                'width' => '60'
                            )
                        )
                    ),
                    Field_Types\text_field(
                        'Link',
                        array(
                            'wrapper' => array(
                                'width' => '40'
                            )
                        )
                    )
                ),
                'wrapper' => array( 'class' => 'hide-label' )
            )
        )
    ),
    'location' => array (
        array (
            array (
                'param' => 'options_page',
                'operator' => '==',
                'value' => 'site-options',
            )
        )
    )
));
