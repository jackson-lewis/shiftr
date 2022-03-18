<?php

use Shiftr_ACF\Group;
use Shiftr_ACF\Utils;
use Shiftr_ACF\Field_Types;


$fields = [
    Field_Types\tab_field( 'Contact Details' ),
    Field_Types\group_field(
        'Contact Details',
        [
            'sub_fields' => [
                Field_Types\text_field(
                    'Email address',
                    [
                        'placeholder'   => 'info@example.com',
                        'wrapper'       => [
                            'width'         => '50'
                        ]
                    ]
                ),
                Field_Types\text_field(
                    'Phone number',
                    [
                        'placeholder'   => '0800 123 456',
                        'wrapper'       => [
                            'width'         => '50'
                        ]
                    ]
                ),
                Field_Types\textarea_field(
                    'Address',
                    [
                        'placeholder'   => 'Westminster,&#10;London,&#10;SW1A 1AA',
                        'wrapper'       => [
                            'width'         => '50' 
                        ],
                        'rows'          => '6',
                        'new_lines'     => 'br'
                    ]
                ),
                Field_Types\textarea_field(
                    'Opening hours',
                    [
                        'placeholder'   => 'Mon - Fri: 09:00 - 17:00&#10;Sat - Sun: Closed',
                        'wrapper'       => [
                            'width'         => '50'
                        ],
                        'rows'          => '6',
                        'new_lines'     => 'br'
                    ]
                )
            ],
            'wrapper' => [
                'class' => 'hide-label'
            ]
        ]
    ),
    Field_Types\tab_field( 'Tracking' ),
    Field_Types\group_field(
        'Tracking',
        [
            'sub_fields' => [
                Field_Types\wysiwyg_field(
                    'Tracking head',
                    [
                        'key'           => 'head',
                        'name'          => 'head',
                        'label'         => 'Place in &lt;head&gt;',
                        'tabs'          => 'text',
                        'toolbar'       => 'basic',
                        'media_upload'  => 0
                    ]
                ),
                Field_Types\wysiwyg_field(
                    'Tracking body (open)',
                    [
                        'key'           => 'body_open',
                        'name'          => 'body_open',
                        'label'         => 'Place at the start of &lt;body&gt;',
                        'tabs'          => 'text',
                        'toolbar'       => 'basic',
                        'media_upload'  => 0
                    ]
                ),
                Field_Types\wysiwyg_field(
                    'Tracking body (close)',
                    [
                        'key'           => 'body_close',
                        'name'          => 'body_close',
                        'label'         => 'Place at the end of &lt;body&gt;',
                        'tabs'          => 'text',
                        'toolbar'       => 'basic',
                        'media_upload'  => 0
                    ]
                )
            ],
            'wrapper' => [
                'class' => 'hide-label'
            ]
        ]
    ),
    Field_Types\tab_field( 'Cookies' ),
    Field_Types\group_field(
        'Cookies',
        [
            'sub_fields' => [
                Field_Types\wysiwyg_field(
                    'Message',
                    [
                        'toolbar'       => 'basic',
                        'media_upload'  => 0,
                        'wrapper'       => [
                            'class'         => 'mini-editor'
                        ]
                    ]
                )
            ],
            'wrapper' => [
                'class' => 'hide-label'
            ]
        ]
    ),
    Field_Types\tab_field( 'Announcement Bar' ),
    Field_Types\group_field(
        'Announcement Bar',
        [
            'sub_fields' => [
                Field_Types\text_field(
                    'Message',
                    [
                        'wrapper' => [
                            'width' => '60'
                        ]
                    ]
                ),
                Field_Types\text_field(
                    'Link',
                    [
                        'wrapper' => [
                            'width' => '40'
                        ]
                    ]
                )
            ],
            'wrapper' => [
                'class' => 'hide-label'
            ]
        ]
    ),
    Field_Types\tab_field( 'Page Setup' ),
    Field_Types\group_field(
        'Page Setup',
        [
            'sub_fields'    => shiftr_flexi_get_available_post_types(),
            'wrapper'       => [
                'class'         => 'hide-label'
            ]
        ]
    )
];


/**
 * Dynamically add our own social media fields if Yoast SEo is not acive.
 */
if ( !in_array( 'wordpress-seo/wp-seo.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {
    array_splice(
        $fields,
        2,
        0,
        [
            Field_Types\tab_field( 'Social Media' ),
            Field_Types\group_field(
                'Social Media',
                [
                    'sub_fields' => [
                        Field_Types\text_field(
                            'Facebook'
                        ),
                        Field_Types\text_field(
                            'Twitter',
                            [
                                'instructions' => 'Username handle only' // Minic how Yoast is setup.
                            ]
                        ),
                        Field_Types\text_field(
                            'Instagram'
                        ),
                        Field_Types\text_field(
                            'LinkedIn'
                        ),
                        Field_Types\text_field(
                            'YouTube'
                        ),
                        Field_Types\text_field(
                            'Pinterest'
                        )
                    ],
                    'wrapper' => [
                        'class' => 'hide-label'
                    ]
                ]
            )
        ]
    );
}


/**
 * Options
 */
new Group(
    'site_options',
    [
        'title' => 'Site Options',
        'fields' => $fields,
        'location' => [
            [
                [
                    'param'     => 'options_page',
                    'operator'  => '==',
                    'value'     => 'site-options'
                ]
            ]
        ]
    ]
);
