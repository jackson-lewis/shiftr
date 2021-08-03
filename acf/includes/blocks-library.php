<?php
namespace Shiftr_ACF\Utils;

use Shiftr_ACF\Flexi_Builder;
use Shiftr_ACF\Flexi_Block;

/**
 * Returns the Shiftr Blocks Library
 */
function blocks_library() {
    global $shiftr_blocks_library;

    return $shiftr_blocks_library;
}


/**
 * Register a new Flexi Block
 * 
 * @param string $name The Block name, sanitized
 * @param string $display_name The display name of the Block
 * @param array $fields The fields of the Block
 * @param array $args The args of the Block 
 */
function register_flexi_block( $name = '', $display_name = '', $fields = array(), $args = array() ) {
    return new Flexi_Block( $name, $display_name, $fields, $args );
}


/**
 * Checks whether a block is in the Blocks Library
 * 
 * @param string $block_name The block to check my name
 * @return bool True if block exists, false if not
 */
function block_exists( $block_name = '' ) {
    return isset( blocks_library()[ $block_name ] );
}

function get_global_blocks() {
    global $shiftr_blocks_library;

    $global_blocks = array();

    foreach ( $shiftr_blocks_library as $block ) {
        $global_blocks[] = $block->name;
    }

    $builder = new Flexi_Builder( 'global', $global_blocks, array(
        'instructions' => 'The Global Blocks Builder allows you to define one instance of each Block globally, that can be reused where a Builder supports the Block. To use a global Block, first create the Block here then add the Block on any given page, and in the settings, set `Use Global` to true.'
    ), true );

    return $builder->get_acf_data();
}


function get_global_block_data( $block = '' ) {
    $global_flexi_builder = get_field( 'flexi_blocks_builder-global', 'options' );
    $block_found = false;

    if ( ! empty( $global_flexi_builder ) ) {
        foreach ( $global_flexi_builder as $layout ) {

            if ( $layout['acf_fc_layout'] == $block ) {
                $block_found = $layout;
                unset( $layout['acf_fc_layout'] );
            }
        }
    }

    return $block_found;
}


function get_builder( $builder_id = '' ) {
    global $shiftr_builder_library;

    return ( isset( $shiftr_builder_library[ $builder_id ] ) ) ? $shiftr_builder_library[ $builder_id ]->get_acf_data() : array();
}
