<?php
namespace Shiftr_ACF\Field_Types;


/**
 * Get the default base args for a field.
 * 
 * @param string $type
 * @param string $label
 * @param array $args
 * @param array $field_defaults
 * @return array
 */
function process_field_args( string $type, string $label, array $args = [], array $field_defaults = [] ) {
    return wp_parse_args(
        $args,
        array_merge(
            [
                'key'               => sanitize_title( $label ),
                'label'             => $label,
                'name'              => sanitize_title( $label ),
                'instructions'      => '',
                'required'          => 0,
                'conditional_logic' => 0,
                'wrapper'           => [
                    'width' => '',
                    'class' => '',
                    'id'    => '',
                ]
            ],
            $field_defaults
        )
    );
}


/**
 *  Range field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function range_field( string $label, array $args = [] ) {
    return process_field_args(
        'range',
        $label,
        $args,
        [
            'default_value' => '',
            'min'           => '',
            'max'           => '',
            'step'          => '',
            'prepend'       => '',
            'append'        => ''
        ]
    );
}


/**
 * Text field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function text_field( string $label, array $args = [] ) {
    return process_field_args(
        'text',
        $label,
        $args,
        [
            'placeholder'   => '',
			'prepend'       => '',
			'append'        => '',
			'maxlength'     => ''
        ]
    );
}


/**
 * Textarea field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function textarea_field( string $label, array $args = [] ) {
    return process_field_args(
        'textarea',
        $label,
        $args,
        [
            'default_value' => '',
			'placeholder'   => '',
			'maxlength'     => '',
			'rows'          => '',
			'new_lines'     => ''
        ]
    );
}


/**
 * Button Group field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function button_group_field( string $label, array $args = [] ) {
    return process_field_args(
        'button_group',
        $label,
        $args,
        [
            'choices'       => [],
            'allow_null'    => 0,
            'default_value' => '',
            'layout'        => 'horizontal',
            'return_format' => 'value'
        ]
    );
}


/**
 *  Checkbox field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function checkbox_field( string $label, array $args = [] ) {
    return process_field_args(
        'checkbox',
        $label,
        $args,
        [
            'choices'       => [],
            'allow_custom'  => 0,
            'default_value' => [],
            'layout'        => 'vertical',
            'toggle'        => 0,
            'return_format' => 'value',
            'save_custom'   => 0
        ]
    );
}


/**
 * Radio field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function radio_field( string $label, array $args = [] ) {
    return process_field_args(
        'radio',
        $label,
        $args,
        [
            'choices'       => [],
            'default_value' => '',
            'layout'        => 'horizontal',
            'return_format' => 'value'
        ]
    );
}


/**
 * Select field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function select_field( string $label, array $args = [] ) {
    return process_field_args(
        'select',
        $label,
        $args,
        [
            'choices'       => [],
            'default_value' => '',
            'allow_null'    => 0,
            'multiple'      => 0,
            'ui'            => 0,
            'ajax'          => 0,
            'return_format' => 'value',
            'placeholder'   => ''
        ]
    );
}


/**
 * True/false field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function true_false_field( string $label, array $args = [] ) {
    return process_field_args(
        'true_false',
        $label,
        $args,
        [
            'message'       => '',
            'ui'            => 1,
            'ui_on_text'    => '',
            'ui_off_text'   => ''
        ]
    );
}


/**
 * File field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function file_field( string $label, array $args = [] ) {
    return process_field_args(
        'file',
        $label,
        $args,
        [
            'return_format' => 'array',
            'library'       => 'all',
            'min_size'      => '',
            'max_size'      => '',
            'mime_types'    => ''
        ]
    );
}


/**
 * Gallery field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function gallery_field( string $label, array $args = [] ) {
    return process_field_args(
        'gallery',
        $label,
        $args,
        [
            'return_format' => 'array',
			'preview_size'  => 'medium',
			'insert'        => 'append',
			'library'       => 'all',
			'min'           => '',
			'max'           => '',
			'min_width'     => '',
			'min_height'    => '',
			'min_size'      => '',
			'max_width'     => '',
			'max_height'    => '',
			'max_size'      => '',
			'mime_types'    => ''
        ]
    );
}


/**
 * Image field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function image_field( string $label, array $args = [] ) {
    return process_field_args(
        'image',
        $label,
        $args,
        [
            'return_format' => 'id',
            'preview_size'  => 'medium_large',
            'library'       => 'all',
            'min_width'     => '',
            'min_height'    => '',
            'min_size'      => '',
            'max_width'     => '',
            'max_height'    => '',
            'max_size'      => '',
            'mime_types'    => ''
        ]
    );
}


/**
 * oEmbed field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function oembed_field( string $label, array $args = [] ) {
    return process_field_args(
        'oembed',
        $label,
        $args,
        [
            'width'     => '',
            'height'    => ''
        ]
    );
}


/**
 * Wysiwyg field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function wysiwyg_field( string $label, array $args = [] ) {
    return process_field_args(
        'wysiwyg',
        $label,
        $args,
        [
            'default_value' => '',
            'tabs'          => 'visual',
            'toolbar'       => 'full',
            'media_upload'  => 1
        ]
    );
}


/**
 * Color Picker field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function color_picker_field( string $label, array $args = [] ) {
    return process_field_args(
        'color_picker',
        $label,
        $args,
        [
            'default_value'     => '',
			'enable_opacity'    => 0,
			'return_format'     => 'string'
        ]
    );
}


/**
 *  Date Picker field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function date_picker_field( string $label, array $args = [] ) {
    return process_field_args(
        'date_picker',
        $label,
        $args,
        [
            'display_format'    => 'd/m/Y',
            'return_format'     => 'd/m/Y',
            'first_day'         => 1
        ]
    );
}


/**
 *  Date Time Picker field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function date_time_picker_field( string $label, array $args = [] ) {
    return process_field_args(
        'date_time_picker',
        $label,
        $args,
        [
            'display_format'    => 'd/m/Y g:i a',
            'return_format'     => 'd/m/Y g:i a',
            'first_day'         => 1,
        ]
    );
}


/**
 *  Google Map field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function google_map_field( string $label, array $args = [] ) {
    return process_field_args(
        'google_map',
        $label,
        $args,
        [
            'center_lat'    => '',
            'center_lng'    => '',
            'zoom'          => '',
            'height'        => ''
        ]
    );
}


/**
 *  Time Picker field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function time_picker_field( string $label, array $args = [] ) {
    return process_field_args(
        'time_picker',
        $label,
        $args,
        [
            'display_format'    => 'g:i a',
            'return_format'     => 'g:i a',
        ]
    );
}


/**
 *  Accordion field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function accordion_field( string $label, array $args = [] ) {
    return process_field_args(
        'accordion',
        $label,
        $args,
        [
            'open'          => 0,
            'multi_expand'  => 0,
            'endpoint'      => 0
        ]
    );
}


/**
 *  Flexible Content field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function flexible_content_field( string $label, array $args = [] ) {
    return process_field_args(
        'flexible_content',
        $label,
        $args,
        [
            'layouts'       => [],
            'button_label'  => 'Add Row',
            'min'           => '',
            'max'           => ''
        ]
    );
}


/**
 * Group field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function group_field( string $label, array $args = [] ) {
    return process_field_args(
        'group',
        $label,
        $args,
        [
            'layout'        => 'block',
            'sub_fields'    => []
        ]
    );
}


/**
 * Repeater field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function repeater_field( string $label, array $args = [] ) {
    return process_field_args(
        'repeater',
        $label,
        $args,
        [
            'collapsed'     => '',
            'min'           => '',
            'max'           => '',
            'layout'        => 'table',
            'button_label'  => 'Add Item',
            'sub_fields'    => []
        ]
    );
}


/**
 * Tab field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function tab_field( string $label, array $args = [] ) {
    return process_field_args(
        'tab',
        $label,
        $args,
        [
            'endpoint' => 0
        ]
    );
}


/**
 *  Clone field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function clone_field( string $label, array $args = [] ) {
    return process_field_args(
        'clone',
        $label,
        $args,
        [
            'clone'         => '',
            'display'       => 'seamless',
            'layout'        => 'block',
            'prefix_label'  => 0,
            'prefix_name'   => 0
        ]
    );
}


/**
 * Link field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function link_field( string $label, array $args = [] ) {
    return process_field_args(
        'link',
        $label,
        $args,
        [
            'return_format' => 'array'
        ]
    );
}


/**
 * Page Link field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function page_link_field( string $label, array $args = [] ) {
    return process_field_args(
        'page_link',
        $label,
        $args,
        [
            'post_type'         => '',
            'taxonomy'          => '',
            'allow_null'        => 0,
            'allow_archives'    => 1,
            'multiple'          => 0
        ]
    );
}


/**
 * Post Object field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function post_object_field( string $label, array $args = [] ) {
    return process_field_args(
        'post_object',
        $label,
        $args,
        [
            'post_type'     => [],
            'taxonomy'      => '',
            'allow_null'    => 1,
            'multiple'      => 1,
            'return_format' => 'id',
            'ui'            => 1
        ]
    );
}


/**
 *  Relationship field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function relationship_field( string $label, array $args = [] ) {
    return process_field_args(
        'relationship',
        $label,
        $args,
        [
            'post_type'     => '',
            'taxonomy'      => '',
            'filters'       => [
                'search',
                'post_type',
                'taxonomy'
            ],
            'elements'      => '',
            'min'           => '',
            'max'           => '',
            'return_format' => 'object'
        ]
    );
}


/**
 * Taxonomy field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function taxonomy_field( string $label, array $args = [] ) {
    return process_field_args(
        'taxonomy',
        $label,
        $args,
        [
            'taxonomy'      => 'category',
            'field_type'    => 'select',
            'allow_null'    => 1,
            'add_term'      => 0,
            'save_terms'    => 0,
            'load_terms'    => 0,
            'return_format' => 'object',
            'multiple'      => 0,
        ]
    );
}


/**
 *  User field
 * 
 * @param string $label
 * @param array $args
 * @return array The formatted ACF field array
 */
function user_field( string $label, array $args = [] ) {
    return process_field_args(
        'user',
        $label,
        $args,
        [
            'role'          => '',
            'allow_null'    => 0,
            'multiple'      => 0,
            'return_format' => 'array'
        ]
    );
}
