<?php

use Shiftr_ACF\Flexi_Block;
use Shiftr_ACF\Utils as Utils;
use Shiftr_ACF\Field_Types as Field_Types;


/**
 * Content
 */
new Flexi_Block(
    'content',
    'Content',
    array(
        Field_Types\wysiwyg_field( 'Content' )
    )
);


/**
 * Content & Image
 */
new Flexi_Block(
    'content-image',
    'Content & Image',
    array(
        Field_Types\wysiwyg_field( 'Content', array(
            'key' => 'field_content-image_content',
            'wrapper' => array(
                'width' => '50'
            )
        )),
        Field_Types\image_field( 'Image', array(
            'key' => 'field_content-image_image',
            'wrapper' => array(
                'width' => '50'
            )
        ))
    ),
    array(
        'settings' => array(
            'layout' => array(
                'choices' => array(
                    'content_image' => 'Content / Image',
                    'image_content' => 'Image / Content'
                ),
                'default_value' => 'content_image'
            )
        )
    )
);


/**
 * CTA Banner (small)
 */
new Flexi_Block(
    'cta-banner-small',
    'CTA Banner (small)',
    array(
        Field_Types\text_field( 'Label', array(
            'key' => 'field_cta-banner-small_label',
            'wrapper' => array(
                'width' => '40'
            )
        )),
        Field_Types\text_field( 'Link', array(
            'key' => 'field_cta-banner-small_link',
            'wrapper' => array(
                'width' => '30'
            )
        )),
        Field_Types\text_field( 'Link label', array(
            'key' => 'field_cta-banner-small_link-label',
            'wrapper' => array(
                'width' => '30'
            )
        ))
    ), array(
        'settings' => array(
            'id' => false,
            'background' => array(
                'choices' => array(
                    'white' => 'White',
                    'black' => 'Black',
                    'grey' => 'Grey',
                    'primary' => 'Branding colour'
                ),
                'default_value' => 'grey'
            )
        )
    )
);


/**
 * Featured Posts
 */
new Flexi_Block(
    'featured-posts',
    'Featured Posts',
    array(
        Field_Types\post_object_field(
            'Posts',
            array(
                'name' => 'by-post',
                'post_type' => array( 'post' ),
                'instructions' => 'Optional. Display a selection of posts.',
                'wrapper' => array (
                    'width' => 50
                )
            )
        ),
        Field_Types\taxonomy_field(
            'Category',
            array(
                'name' => 'by-category',
                'taxonomy' => 'category',
                'instructions' => 'Optional. Display posts from a category.',
                'wrapper' => array (
                    'width' => 50
                )
            )
        )
    ),
    array(
        'block_before' => true,
        'block_after' => true,
        'settings' => array(
            'background' => array(
                'choices' => array(
                    'white' => 'White',
                    'grey' => 'Grey'
                )
            )
        )
    )
);
