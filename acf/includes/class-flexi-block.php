<?php
namespace Shiftr_ACF;

use Shiftr_ACF\Utils as Utils;
use Shiftr_ACF\Field_Types as Field_Types;

/**
 * Register a Flexi Block
 */
class Flexi_Block {

    /** @var string The block name */
    var $name = '';

    /** @var string The block label */
    var $label = '';

    /** @var array The passed settings to the class */
    var $settings = [];

    /** @var array The passed fields to the class */
    var $fields = [];

    /** @var array The passed args to the class */
    var $args = [];

    /** @var array Stores the final array used for ACF field data */
    var $acf_field_data = [];

    /** @var array Stores the final array used for global ACF field data */
    var $global_acf_field_data = [];


    function __construct( string $name, string $label, array $fields = [], array $args = [] ) {
        $this->name = $name;
        $this->label = $label;
        $this->fields = $this->process_fields( $fields );
        
        $default_args = [
            'settings'      => [],
            'block_before'  => false,
            'block_after'   => false,
            'allow_global'  => true,
            /**
             * Control the minimum number of instances a block can be used.
             */
            'min'           => '',
            /**
             * Control the maximum number of instances a block can be used.
             */
            'max'           => '',
            /**
             * Full access to override the layout array
             */
            'overrides'     => []
        ];
        $this->args = wp_parse_args( $args, $default_args );

        $default_settings = [
            'id'            => true,
            'background'    => [
                'choices'       => [
                    'white' => 'White',
                    'black' => 'Black',
                    'grey'  => 'Grey'
                ],
                'default_value' => 'white'
            ]
        ];

        if ( $this->args['settings'] !== false && is_array( $this->args['settings'] ) ) {
            $this->args['settings'] = $this->parse_settings( $this->args['settings'], $default_settings );
        }

        // Override $args again to add "Use global block" setting
        if ( $this->args['allow_global'] ) {
            if ( ! is_array( $this->args['settings'] ) ) {
                $this->args['settings'] = [];
            }

            $this->args['settings'] = [ 'use_global_block' => true ] + $this->args['settings'];
        }

        if ( Utils\block_exists( $name ) ) {
            trigger_error( 'The block "'. $label .'" has already been registered to the Shiftr Blocks Library.', E_USER_NOTICE );
            return;
        }

        $this->init();
    }


    /**
     * Where the bulk of the block data is constructed
     */
    public function init() {
        $default_acf_field_data = [
            'key'           => 'layout_block__' . $this->name,
            'name'          => $this->name,
            'label'         => $this->label,
            'display'       => 'block',
            'sub_fields'    => [],
            'min'           => '',
            'max'           => ''
        ];

        $acf_field_data = wp_parse_args( $this->args['overrides'], $default_acf_field_data );

        $acf_field_data['min'] = $this->args['min'];
        $acf_field_data['max'] = $this->args['max'];

        // Add tab for main block fields, only if fields set.
        if ( !empty( $this->fields ) ) { 
            array_unshift( $this->fields, $this->block_tab( 'Fields' ) );
        }

        if ( $this->args['block_before'] ) {
            array_unshift( $this->fields, $this->block_tab( 'Heading' ), $this->block_before() );
        }

        if ( $this->args['block_after'] ) {
            $this->fields[] = $this->block_tab( 'Additional content' );
            $this->fields[] = $this->block_after();
        }

        if ( $this->args['settings'] ) {
            /**
             * Create settings group field
             */
            $settings_field = $this->setup_settings();
            $settings_field['sub_fields'] = [];
            
            foreach ( $this->args['settings'] as $setting => $value ) {
                /**
                 * Only support pre-defined settings right now
                 */
                if ( $value && method_exists( $this, 'setting_' . $setting ) ) {
                    $settings_field['sub_fields'][] = call_user_func( [ __CLASS__, 'setting_' . $setting ] );

                } else if ( isset( $value['type'] ) ) {
                    /**
                     * Allows custom settings to be added.
                     */
                    $settings_field['sub_fields'][] = $value;
                }
            }

            // Append settings to end of all sub fields of block
            $this->fields[] = $this->block_tab( 'Settings' );
            $this->fields[] = $settings_field;
        }

        
        $acf_field_data['sub_fields'] = $this->fields;

        $this->acf_field_data = $acf_field_data;


        if ( $this->args['allow_global'] ) {
            $global_defaults = [
                'max' => '1'
            ];

            $this->global_acf_field_data = wp_parse_args( $global_defaults, $acf_field_data );
        }

        /**
         * Finally, add the block to the library
         */
        $this->add_block_to_library();
    }


    /**
     * Returns the complete ACF field data array
     * 
     * @return array The ACF field array
     */
    public function get_acf_field_data( bool $for_global = false ) {

        if ( $for_global ) {
            if ( $this->args['allow_global'] ) {
                return $this->global_acf_field_data;
            }

            return [];
        }

        return $this->acf_field_data;
    }


    /**
     * Returns an ACF group field for the block settings
     * 
     * @return array The ACF group field for settings
     */
    public function setup_settings( array $args = [] ) {
        $defaults = [
            'key'       => $this->name . '_settings',
            'wrapper'   => [
                'class'     => 'hide-label'
            ]
        ];   
        $args = wp_parse_args( $args, $defaults );
        
        return Field_Types\group_field( 'Settings', $args );
    }


    /**
     * Returns the use global setting field
     * 
     * @return array
     */
    public function setting_use_global_block() {
        return apply_filters(
            'shiftr_acf_flexi_block_setting_use_global',
            Field_Types\true_false_field(
                'Use global block',
                [
                    'key'       => $this->name . '_block_setting_use_global',
                    'name'      => 'use_global',
                    'wrapper'   => [
                        'width'     => '20'
                    ]
                ]
            )
        );
    }


    /**
     * Returns the ID setting field
     * 
     * @return array
     */
    public function setting_id() {
        return apply_filters(
            'shiftr_acf_flexi_block_setting_id',
            Field_Types\text_field(
                'HTML ID',
                [
                    'key'       => $this->name . '_block_setting_id',
                    'name'      => 'id',
                    'wrapper'   => [
                        'width'     => '30'
                    ]
                ]
            )
        );
    }


    /**
     * Returns the background setting field
     * 
     * @return array
     */
    public function setting_background() {
        return apply_filters(
            'shiftr_acf_flexi_block_setting_background',
            Field_Types\select_field(
                'Background',
                [
                    'key'           => $this->name . '_block_setting_background',
                    'name'          => 'background',
                    'choices'       => $this->args['settings']['background']['choices'],
                    'default_value' => $this->args['settings']['background']['default_value'],
                    'wrapper'       => [
                        'width' => '30'
                    ]
                ]
            )
        );
    }


    /**
     * Returns the layout setting field
     * 
     * @return array
     */
    public function setting_layout() {
        return apply_filters(
            'shiftr_acf_flexi_block_setting_layout',
            Field_Types\button_group_field(
                'Layout',
                [
                    'key'           => $this->name . '_block_setting_layout',
                    'name'          => 'layout',
                    'choices'       => $this->args['settings']['layout']['choices'],
                    'default_value' => $this->args['settings']['layout']['default_value']
                ]
            )
        );
    }


    /**
     * Splits the layout sub fields into parts
     * 
     * @param string $name
     * @return array An ACF tab field
     */
    public function block_tab( string $name ) {
        return Field_Types\tab_field(
            $name,
            [
                'key' => "{$this->name}_block_tab_" . sanitize_title( $name )
            ]
        );
    }


    /**
     * The block before field.
     * 
     * @return array An ACF wysiwyg field
     */
    public function block_before() {
        return Field_Types\wysiwyg_field(
            'Block before',
            [
                'key'       => "{$this->name}_block_block-before",
                'wrapper'   => [
                    'class'     => 'hide-label mini-editor'
                ]
            ]
        );
    }


    /**
     * The block after field.
     * 
     * @return array An ACF wysiwyg field
     */
    public function block_after() {
        return Field_Types\wysiwyg_field(
            'Block after',
            [
                'key'       => "{$this->name}_block_block-after",
                'wrapper'   => [
                    'class'     => 'hide-label mini-editor'
                ]
            ]
        );
    }


    /**
     * Adds the block instance to the global Blocks Library
     */
    public function add_block_to_library() {
        global $shiftr_blocks_library;

        $shiftr_blocks_library[ $this->name ] = $this;
    }


    /**
     * Parses the multidimensional array for the block settings. wp_parse_args for multidimensional arrays
     * 
     * With thanks: https://mekshq.com/recursive-wp-parse-args-wordpress-function/
     * 
     * @param array $defaults
     * @param array $args
     * @return array The parsed array
     */
    private function parse_settings( array $args, array $defaults ) {
        $args = (array) $args;
        $defaults = (array) $defaults;
    
        $result = $defaults;
    
        foreach ( $args as $k => &$v ) {
            if ( is_array( $v ) && isset( $result[ $k ] ) && $k != 'choices' ) {
                $result[ $k ] = $this->parse_settings( $v, $result[ $k ] );
            } else {
                $result[ $k ] = $v;
            }
        }
    
        return $result;
    }


    /**
     * Process the fields, setting keys scoped to the block.
     * 
     * @param array $fields
     * @return array
     */
    private function process_fields( array $fields ) {
        return array_map( function( $field ) {
            $field['key'] = $this->name . '-' . sanitize_title( $field['label'] );

            if ( $field['type'] == 'repeater' ) {
                $field['sub_fields'] = $this->process_fields( $field['sub_fields'] );
            }

            return $field;
        }, $fields );
    }
}
