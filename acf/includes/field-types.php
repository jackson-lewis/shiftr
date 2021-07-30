<?php
namespace Shiftr_ACF\Field_Types;

/**
 *  Range field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function range_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_range_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'range',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'default_value' => '',
        'min' => '',
        'max' => '',
        'step' => '',
        'prepend' => '',
        'append' => '',
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Text field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
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
 * Textarea field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
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
 * Button Group field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function button_group_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_button_group_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'button_group',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'choices' => array(),
        'allow_null' => 0,
        'default_value' => '',
        'layout' => 'horizontal',
        'return_format' => 'value'
    );

    return wp_parse_args( $args, $defaults );
}


/**
 *  Checkbox field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function checkbox_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_checkbox_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'checkbox',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'choices' => array(),
        'allow_custom' => 0,
        'default_value' => array(),
        'layout' => 'vertical',
        'toggle' => 0,
        'return_format' => 'value',
        'save_custom' => 0,
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Radio field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
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
 * Select field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
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
 * True/false field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
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
 * File field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function file_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_file_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'file',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'return_format' => 'array',
        'library' => 'all',
        'min_size' => '',
        'max_size' => '',
        'mime_types' => '',
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Gallery field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
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
 * Image field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
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
 * oEmbed field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function oembed_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_oembed_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'oembed',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'width' => '',
        'height' => ''
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Wysiwyg field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
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
 * Color Picker field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function color_picker_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_color_picker_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'color_picker',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'default_value' => '',
    );

    return wp_parse_args( $args, $defaults );
}


/**
 *  Date Picker field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function date_picker_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_date_picker_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'date_picker',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'display_format' => 'd/m/Y',
        'return_format' => 'd/m/Y',
        'first_day' => 1,
    );

    return wp_parse_args( $args, $defaults );
}


/**
 *  Date Time Picker field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function date_time_picker_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_date_time_picker_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'date_time_picker',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'display_format' => 'd/m/Y g:i a',
        'return_format' => 'd/m/Y g:i a',
        'first_day' => 1,
    );

    return wp_parse_args( $args, $defaults );
}


/**
 *  Google Map field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function google_map_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_google_map_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'google_map',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'center_lat' => '',
        'center_lng' => '',
        'zoom' => '',
        'height' => '',
    );

    return wp_parse_args( $args, $defaults );
}


/**
 *  Time Picker field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function time_picker_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_time_picker_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'time_picker',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'display_format' => 'g:i a',
        'return_format' => 'g:i a',
    );

    return wp_parse_args( $args, $defaults );
}


/**
 *  Accordion field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function accordion_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_accordion_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'accordion',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'open' => 0,
        'multi_expand' => 0,
        'endpoint' => 0,
    );

    return wp_parse_args( $args, $defaults );
}


/**
 *  Flexible Content field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function flexible_content_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_flexible_content_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'flexible_content',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'layouts' => array(),
        'button_label' => 'Add Row',
        'min' => '',
        'max' => '',
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Group field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
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
 * Repeater field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function repeater_field( $name, $args = array() ) {
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
        'min' => '',
        'max' => '',
        'layout' => 'table',
        'button_label' => 'Add Item',
        'sub_fields' => array()
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Tab field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
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
 *  Clone field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function clone_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_clone_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'clone',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'clone' => '',
        'display' => 'seamless',
        'layout' => 'block',
        'prefix_label' => 0,
        'prefix_name' => 0,
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Link field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function link_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_link_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'link',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'return_format' => 'array'
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Page Link field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function page_link_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_page_link_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'page_link',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'post_type' => '',
        'taxonomy' => '',
        'allow_null' => 0,
        'allow_archives' => 1,
        'multiple' => 0
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Post Object field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
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
 *  Relationship field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function relationship_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_relationship_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'relationship',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'post_type' => '',
        'taxonomy' => '',
        'filters' => array(
            0 => 'search',
            1 => 'post_type',
            2 => 'taxonomy',
        ),
        'elements' => '',
        'min' => '',
        'max' => '',
        'return_format' => 'object',
    );

    return wp_parse_args( $args, $defaults );
}


/**
 * Taxonomy field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
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


/**
 *  User field
 * 
 * @param string $name
 * @param array $args
 * @return array The formatted ACF field array
 */
function user_field( $name, $args = array() ) {
    $defaults = array(
        'key' => 'field_user_' . sanitize_title( $name ),
        'label' => $name,
        'name' => sanitize_title( $name ),
        'type' => 'user',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'role' => '',
        'allow_null' => 0,
        'multiple' => 0,
        'return_format' => 'array',
    );

    return wp_parse_args( $args, $defaults );
}
