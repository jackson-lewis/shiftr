<?php

use Shiftr_ACF\Flexi_Block;
use Shiftr_ACF\Utils as Utils;
use Shiftr_ACF\Field_Types as Field_Types;


/**
 * Content
 */
Utils\register_flexi_block(
    'content',
    'Content',
    [
        Field_Types\wysiwyg_field( 'Content' )
    ]
);


/**
 * Content & Image
 */
Utils\register_flexi_block(
    'content-image',
    'Content & Image',
    [
        Field_Types\wysiwyg_field(
            'Content',
            [
                'wrapper'   => [
                    'width'     => '50'
                ]
            ]
        ),
        Field_Types\image_field(
            'Image',
            [
                'wrapper'   => [
                    'width'     => '50'
                ]
            ]
        )
    ],
    [
        'settings'  => [
            'layout'    => [
                'choices'       => [
                    'content_image' => 'Content / Image',
                    'image_content' => 'Image / Content'
                ],
                'default_value' => 'content_image'
            ]
        ]
    ]
);


/**
 * CTA Banner (small)
 */
Utils\register_flexi_block(
    'cta-banner-small',
    'CTA Banner (small)',
    [
        Field_Types\text_field(
            'Label',
            [
                'wrapper' => [
                    'width' => '40'
                ]
            ]
        ),
        Field_Types\text_field(
            'Link',
            [
                'wrapper' => [
                    'width' => '30'
                ]
            ]
        ),
        Field_Types\text_field(
            'Link label',
            [
                'wrapper' => [
                    'width' => '30'
                ]
            ]
        )
    ],
    [
        'settings' => [
            'id'            => false,
            'background'    => [
                'choices'       => [
                    'white'         => 'White',
                    'black'         => 'Black',
                    'grey'          => 'Grey',
                    'primary'       => 'Branding colour'
                ],
                'default_value' => 'grey'
            ]
        ]
    ]
);


/**
 * Featured Posts
 */
Utils\register_flexi_block(
    'featured-posts',
    'Featured Posts',
    [
        Field_Types\post_object_field(
            'Posts',
            [
                'name'          => 'by-post',
                'post_type'     => [ 'post' ],
                'instructions'  => 'Optional. Display a selection of posts.',
                'wrapper'       => [
                    'width'         => 50
                ]
            ]
        ),
        Field_Types\taxonomy_field(
            'Category',
            [
                'name'          => 'by-category',
                'instructions'  => 'Optional. Display posts from a category.',
                'return_format' => 'id',
                'wrapper'       => [
                    'width'         => 50
                ]
            ]
        )
    ],
    [
        'block_before'  => true,
        'block_after'   => true,
        'settings'      => [
            'background'    => [
                'choices'       => [
                    'white'         => 'White',
                    'grey'          => 'Grey'
                ]
            ]
        ]
    ]
);


/**
 * Google Maps
 */
Utils\register_flexi_block(
    'google-maps',
    'Google Maps',
    [
        Field_Types\google_map_field(
            'Map',
            [
                'required' => 1
            ]
        )
    ],
    [
        'settings' => [
            'background' => false
        ],
        'max' => '1' // Strictly only 1 instance of this block is allowed!!!
    ]
);


/**
 * Contact
 */
Utils\register_flexi_block(
    'contact',
    'Contact',
    [],
    [
        'block_before' => true
    ]
);


/**
 * Columns
 */
Utils\register_flexi_block(
    'columns',
    'Columns',
    [
        Field_Types\repeater_field(
            'Columns',
            [
                'sub_fields'     => [
                    Field_Types\image_field( 'Image' ),
                    Field_Types\wysiwyg_field( 'Content' )
                ],
                'button_label'  => 'Add Column',
                'min'           => 2,
                'max'           => 12
            ]
        )
    ],
    [
        'block_before'  => true,
        'block_after'   => true
    ]
);


/**
 * Accordion
 */
Utils\register_flexi_block(
    'accordion',
    'Accordion',
    [
        Field_Types\repeater_field(
            'Items',
            [
                'sub_fields'     => [
                    Field_Types\text_field( 'Title' ),
                    Field_Types\wysiwyg_field( 'Content' )
                ],
                'button_label'  => 'Add Item',
                'layout' => 'block'
            ]
        )
    ],
    [
        'block_before'  => true,
        'block_after'   => true,
        'settings' => [
            'default_open' => Field_Types\true_false_field(
                'Open by default',
                [
                    'name' => 'default_open',
                    'wrapper' => [
                        'width' => 30
                    ],
                    'default_value' => 1
                ]
            ),
            'allow_multi_open' => Field_Types\true_false_field(
                'Allow multiple items open at once',
                [
                    'name' => 'allow_multi_open',
                    'wrapper' => [
                        'width' => 30
                    ]
                ]
            )
        ]
    ]
);


/**
 * Gallery
 */
Utils\register_flexi_block(
    'gallery',
    'Image Gallery',
    [
        Field_Types\gallery_field( 'Images' )
    ],
    [
        'block_before' => true,
        'block_after' => true,
        'settings' => [
            'infinite_loop' => Field_Types\true_false_field(
                'Infinite loop',
                [
                    'name' => 'infinite_loop',
                    'wrapper' => [
                        'width' => 30
                    ],
                    'default_value' => 1
                ]
            ),
            'display_bullets' => Field_Types\true_false_field(
                'Display bullet markers',
                [
                    'name' => 'display_bullets',
                    'wrapper' => [
                        'width' => 30
                    ]
                ]
            )
        ]
    ]
);
