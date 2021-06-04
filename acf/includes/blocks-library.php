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

    $builder = new Flexi_Builder( 'global', $global_blocks, array(), true );

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
