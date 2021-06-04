<?php
namespace Shiftr_ACF\Field_Types;

/**
 * WYSIWYG
 */
function wysiwyg_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'wysiwyg',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'default_value' => '',
        'tabs' => 'visual',
        'toolbar' => 'full',
        'media_upload' => 1
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Text
 */
function text_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'text',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'default_value' => ''
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Textarea
 */
function textarea_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'textarea',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'default_value' => ''
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Image
 */
function image_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'image',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'return_format' => 'id',
        'preview_size' => 'medium_large',
        'library' => 'all',
        'min_width' => '',
        'min_height' => '',
        'min_size' => '',
        'max_width' => '',
        'max_height' => '',
        'max_size' => '',
        'mime_types' => ''
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Select
 */
function select_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'select',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'choices' => array(),
        'default_value' => '',
        'allow_null' => 0,
        'multiple' => 0,
        'ui' => 0,
        'ajax' => 0,
        'return_format' => 'value',
        'placeholder' => ''
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Radio 
 */
function radio_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'radio',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'choices' => array(),
        'default_value' => '',
        'layout' => 'horizontal',
        'return_format' => 'value'
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * True/false
 */
function true_false_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_group_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'true_false',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'message' => '',
        'ui' => 1,
        'ui_on_text' => '',
        'ui_off_text' => ''
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Tab
 */
function tab_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_tab_' . sanitize_title( $name ),
        'label' => $name,
        'name' => '',
        'type' => 'tab',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'endpoint' => 0
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Gallery
 */
function gallery_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_gallery_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'gallery',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
    );

    return wp_parse_args( $args, $defaults );
}

/**
 * Group
 */
function group_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_group_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'group',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'layout' => 'block',
        'sub_fields' => array()
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Repeater
 */
function repeater_field( $name, $args = array(), $sub_fields = array() ) {
    $defaults = array(
        'key' => 'repeater_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'repeater',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'collapsed' => '',
        'min' => 0,
        'max' => 7,
        'layout' => 'table',
        'button_label' => 'Add Item',
        'sub_fields' => array()
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Post Object
 */
function post_object_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_post-object_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'post_object',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'post_type' => array(),
        'taxonomy' => '',
        'allow_null' => 1,
        'multiple' => 1,
        'return_format' => 'id',
        'ui' => 1
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Taxonomy
 */
function taxonomy_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_taxonomy_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'taxonomy',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'taxonomy' => 'category',
        'field_type' => 'select',
        'allow_null' => 1,
        'add_term' => 0,
        'save_terms' => 0,
        'load_terms' => 0,
        'return_format' => 'object',
        'multiple' => 0,
    );

    return wp_parse_args( $args, $defaults );
}
