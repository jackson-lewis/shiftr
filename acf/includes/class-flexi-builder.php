<?php

namespace Shiftr_ACF;

use Shiftr_ACF\Utils as Utils;

/**
 * Registers a new Flexi Blocks Builder.
 * 
 * A `Builder` is just an ACF Flexible Content field
 */
class Flexi_Builder {

    /** @var string $id The builder ID */
    var $id = '';

    /** @var array Stores the final array used for ACF field data */
    var $acf_field_data = array();


    /**
     * @param string $id Unique identifier for the builder
     * @param array $blocks Blocks to assign to the builder
     * @param array $args Additional field args to parse
     */
    function __construct( $id = '', $blocks = array(), $args = array(), $for_global = false ) {
        $defaults = array(
            'key' => 'flexi_blocks_builder-' . $id,
            'label' => 'Flexi Blocks Builder',
            'name' => 'flexi_blocks_builder-' . $id,
            'type' => 'flexible_content',
            'instructions' => '',
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'button_label' => 'Add Block'
        );
    
        $args = wp_parse_args( $args, $defaults );
    
        // Add the layouts
        $args['layouts'] = $this->get_blocks( $blocks, $for_global );
     
        $this->acf_field_data = $args;

        $this->id = $id;
        $this->add_builder_to_library();
    }


    /**
     * Assign blocks to the builder
     */
    function get_blocks( $blocks = array(), $for_global = false ) {
        global $shiftr_blocks_library;

        $local_field_data = array();

        /**
         * If no blocks are passed, assign all blocks to $blocks
         */
        if ( empty( $blocks ) ) {
            $blocks = array_map( function( $item ) {
                return $item->name;
            }, $shiftr_blocks_library );
        }

        foreach ( $blocks as $block ) {
            
            if ( Utils\block_exists( $block ) ) {
                $local_field_data[ 'layout_block__' . $block ] = $shiftr_blocks_library[ $block ]->get_acf_field_data( $for_global );
            }
        }

        return $local_field_data;
    }


    /**
     * Returns the ACF field data
     */
    function get_acf_data() {
        return $this->acf_field_data;
    }

    function add_builder_to_library() {
        global $shiftr_builder_library;

        $shiftr_builder_library[ $this->id ] = $this;
    }
}
